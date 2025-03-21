import sys
import torch
from transformers import pipeline

class ConversationHandler:
    def __init__(self):
        # Use float16 for MPS compatibility
        self.pipe = pipeline(
            "text-generation",
            model="meta-llama/Llama-3.2-1B-Instruct",  # Use your model
            torch_dtype=torch.float32,  # Use float32 for CPU
            device="cpu"  # Force usage of CPU instead of MPS
        )

    def get_response(self, generated_text):
        header = "<|start_header_id|>assistant<|end_header_id|>"
        try:
            header_index = generated_text.index(header)
            response_index = header_index + len(header) + 2
            return generated_text[response_index:]
        except ValueError:
            return "Response header not found."

    def process_message(self, message):
        sys_content = """
            You are Steve, an AI assistant conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            You should ask clarifying questions to better understand the candidate's responses.
            Keep your questions concise and focused on gathering specific details about their experience.
        """
        
        user_content = f"""                    
        The candidate has said: '{message}'
        Ask a clarifying question to better understand their response.
        """
        
        messages = [
            {"role": "system", "content": sys_content},
            {"role": "user", "content": user_content}
        ]

        prompt = self.pipe.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        outputs = self.pipe(prompt, max_new_tokens=256)  # Limit token generation to avoid long computation
        response = self.get_response(outputs[0]["generated_text"])
        return response

def main():
    if len(sys.argv) < 2:
        print("Error: No message provided")
        return

    message = sys.argv[1]
    
    # Initialize the conversation handler and process the message
    handler = ConversationHandler()
    response = handler.process_message(message)
    print(response)

if __name__ == "__main__":
    main()
