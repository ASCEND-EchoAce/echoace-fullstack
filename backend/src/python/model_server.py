from flask import Flask, request, jsonify
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import whisper
import os
from typing import List, Dict
import numpy as np
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Supabase configuration
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

def get_interview_data(interview_id=None, user_fid=None):
    """Fetch interview data from Supabase"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or key is missing.")
    
    if not interview_id and not user_fid:
        raise ValueError("Either interview_id or user_fid must be provided.")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }

    if interview_id:
        url = f"{SUPABASE_URL}/rest/v1/interviews?id=eq.{interview_id}"
    else:
        url = f"{SUPABASE_URL}/rest/v1/interviews?user_fid=eq.{user_fid}&order=created_at.desc&limit=1"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data[0] if data else None
    except requests.RequestException as e:
        print(f"Error fetching interview data: {e}")
        return None


def load_optimized_model():
    print("Loading models...")
    
    # Check if CUDA/MPS is available for LLM
    if torch.cuda.is_available():
        device = "cuda"
    elif torch.backends.mps.is_available():
        device = "mps"
    else:
        device = "cpu"
    print(f"Using device for LLM: {device}")
    
    # Load LLM model with optimizations
    model_id = "meta-llama/Llama-3.2-1B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype=torch.float16,  # Use float16 for better performance
        low_cpu_mem_usage=True,     # Optimize memory usage
        device_map=device           # Automatically handle device placement
    )
    
    # Create pipeline with optimizations
    llm = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device_map=device
    )
    
    # Load Whisper model with optimizations - force CPU for compatibility
    print("Loading Whisper model on CPU for compatibility")
    whisper_model = whisper.load_model(
        "base",
        device="cpu",  # Force CPU for Whisper
        download_root=os.path.join(os.path.dirname(__file__), "models")  # Cache models locally
    )
    
    print("Models loaded successfully!")
    return llm, whisper_model

# Load models with optimizations
llm, whisper_model = load_optimized_model()

# Initialize request batch
current_batch: List[Dict] = []
BATCH_SIZE = 4  # Adjust based on your needs

def get_response(generated_text):
    header = "<|start_header_id|>assistant<|end_header_id|>"
    try:
        header_index = generated_text.index(header)
        response_index = header_index + len(header) + 2
        return generated_text[response_index:]
    except ValueError:
        return "Response header not found."

def process_batch(messages: List[Dict]) -> List[str]:
    """Process a batch of messages together"""
    if not messages:
        return []
    
    # Prepare all prompts
    prompts = []
    for msg in messages:
        sys_content = msg.get('system_content', '')
        user_content = msg.get('user_content', '')
        messages_list = [
            {"role": "system", "content": sys_content},
            {"role": "user", "content": user_content}
        ]
        prompt = llm.tokenizer.apply_chat_template(
            messages_list, tokenize=False, add_generation_prompt=True
        )
        prompts.append(prompt)
    
    # Generate responses for all prompts at once
    with torch.inference_mode():
        outputs = llm(
            prompts,
            max_new_tokens=512,
            num_return_sequences=1,
            pad_token_id=llm.tokenizer.eos_token_id,
            do_sample=True,
            temperature=0.7,
        )
    
    # Extract responses
    responses = []
    for output in outputs:
        response = get_response(output[0]['generated_text'])
        responses.append(response)
    
    return responses

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio_path' not in request.json:
        return jsonify({'error': 'No audio path provided'}), 400
    
    audio_path = request.json['audio_path']
    try:
        # Use torch.inference_mode() for faster inference
        with torch.inference_mode():
            result = whisper_model.transcribe(
                audio_path,
                temperature=0,  # Disable sampling for faster inference
                compression_ratio_threshold=2.4,
                no_speech_threshold=0.6
            )
        return jsonify({'transcription': result["text"]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    if 'message' not in request.json:
        return jsonify({'error': 'No message provided'}), 400
    
    message = request.json['message']
    
    # Get latest interview (highest ID) from Supabase
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    try:
        latest_url = f"{SUPABASE_URL}/rest/v1/interviews?select=id&order=id.desc&limit=1"
        latest_response = requests.get(latest_url, headers=headers)
        latest_response.raise_for_status()
        latest_data = latest_response.json()
        interview_id = latest_data[0]['id'] if latest_data else None
        print(f"Using latest interview ID: {interview_id}")
    except Exception as e:
        print(f"Error fetching latest interview ID: {str(e)}")
        return jsonify({'error': 'Failed to get latest interview ID'}), 500

    
    # Get interview data from the Node.js server
    interview_data = None
    try:
        # Call the Node.js API endpoint to get the interview data
        node_server_url = "http://127.0.0.1:8080"
        response = requests.get(f"{node_server_url}/api/interview/{interview_id}")
        
        if response.status_code == 200:
            interview_data = response.json()
            print(f"Successfully retrieved interview data: {interview_data.get('question', 'No question')}")
        else:
            print(f"Error retrieving interview data: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Exception retrieving interview data: {str(e)}")
    
    try:
        sys_content = f"""
        You are Steve, an AI assistant designed to help users improve their interview responses and better understand their interview performance.
        - Help the user understand the interview question and their response.
        - ONLY respond to questions about the interview or the interview response. Politely decline unrelated requests.
        - Support clarifications, hypotheticals, and improvements (e.g., “Would it be better if I did this instead?”).
        - Keep responses professional, structured, and polite — but not robotic or overly casual.
        - Your tone should be helpful, productive, and to the point.
        - When evaluating, compare the users response to the Google STAR method:
            - Situation: Describe the background context.
            - Task: Define the challenge or objective.
            - Action: Explain what the user specifically did.
            - Result: Share the measurable or meaningful outcome.

        You are about to assist a user in improving their interview performance. Before you do that, here is the interview data of the practice interview that the user just completed and wants to ask questions about:
        Here is the data you've received:
        - Question: {interview_data.get('question', 'N/A') if interview_data else 'N/A'}
        - Transcript: {interview_data.get('transcript', 'N/A') if interview_data else 'N/A'}
        - Evaluation: {interview_data.get('evaluation', 'N/A') if interview_data else 'N/A'}
        
        General Guidelines:
        - Never provide feedback that isn’t earned.
        - Always stay focused on interview performance.
        - Do not use Markdown formatting like asterisks for bold or underscores for italics. Just write plain text.
        """
        
        user_content = f"""                
        The user has said: '{message}'
        Respond appropriately and ensure you respond in a human like manner, this should be a conversation
        """

        
        # Process single message using batch processing function
        response = process_batch([{
            'system_content': sys_content,
            'user_content': user_content
        }])[0]
        
        return jsonify({'reply': response})
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/evaluate', methods=['POST'])
def evaluate():
    if 'question' not in request.json or 'response' not in request.json:
        return jsonify({'error': 'Missing question or response'}), 400
    
    question = request.json['question']
    response = request.json['response']
    
    try:
        sys_content = """
            You are Steve, an AI assistant who helps people improve their behavioral interview answers.
            You are not affiliated with any specific company or employer.

            - Help the user understand the interview question and their response.
            - Do NOT repeat the full content of the response or question. Reference them only when needed.
            - ONLY respond to questions about the interview or the interview response. Politely decline unrelated requests.
            - Support clarifications, hypotheticals, and improvements (e.g., “Would it be better if I did this instead?”).
            - Keep responses professional, structured, and polite — but not robotic or overly casual.
            - Your tone should be helpful, productive, and to the point.
            - When evaluating, compare the users response to the Google STAR method:
                - Situation: Describe the background context.
                - Task: Define the challenge or objective.
                - Action: Explain what the user specifically did.
                - Result: Share the measurable or meaningful outcome.

            General Guidelines:
            - Never provide feedback that isn’t earned.
            - Always stay focused on interview performance.
            - Do not use Markdown formatting like asterisks for bold or underscores for italics. Just write plain text.
            """

        
        
        user_content =f"""
            The user was asked this interview question: '{question}'

            Here's their response:
            '{response}'

            Start by highlighting if and what they did well, then share what they could improve.
            """
        
        # Process single evaluation using batch processing function
        evaluation = process_batch([{
            'system_content': sys_content,
            'user_content': user_content
        }])[0]
        
        return jsonify({'evaluation': evaluation})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run with optimized settings
    app.run(
        host='127.0.0.1',
        port=5000,
        threaded=True,  # Enable threading for concurrent requests
        debug=False     # Disable debug mode for better performance
    ) 