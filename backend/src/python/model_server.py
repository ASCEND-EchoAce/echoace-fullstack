from flask import Flask, request, jsonify
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import whisper
import os
from typing import List, Dict
import numpy as np

app = Flask(__name__)

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
            max_new_tokens=256,
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
    try:
        sys_content = """
            You are Steve, an AI assistant conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            You should ask clarifying questions to better understand the candidate's responses.
            Keep your questions concise and focused on gathering specific details about their experience.
        """
        
        user_content = f"""                    
        The candidate has said: '{message}'
        Ask a clarifying question to better understand their response.
        """
        
        # Process single message using batch processing function
        response = process_batch([{
            'system_content': sys_content,
            'user_content': user_content
        }])[0]
        
        return jsonify({'reply': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/evaluate', methods=['POST'])
def evaluate():
    if 'question' not in request.json or 'response' not in request.json:
        return jsonify({'error': 'Missing question or response'}), 400
    
    question = request.json['question']
    response = request.json['response']
    
    try:
        sys_content = f"""
            You are conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            To the candidate you are interviewing, you asked the question: '{question}'.
        """
        
        user_content = f"""                    
        Evaluate the candidate's response on a scale of 1 to 5, where 5 is the highest rating, and briefly explain why.
        Here is the candidate's response:
        '{response}'
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