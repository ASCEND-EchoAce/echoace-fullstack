import torch
from transformers import AutoTokenizer, LlamaForCausalLM, pipeline

device = torch.device("mps")
model_name = "meta-llama/Llama-3.2-1B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = LlamaForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16).to(device)

class BasicEvaluator:
    def __init__(self):
        # Configure the pipeline with the loaded model and tokenizer
        self.pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=0,  # Use device 0 for MPS
            torch_dtype=torch.float16
        )

    def get_feedback(self, generated_text):
        header = "<|start_header_id|>assistant<|end_header_id|>"
        try:
            header_index = generated_text.index(header)
            feedback_index = header_index + len(header) + 2
            return generated_text[feedback_index:]
        except ValueError:
            return "Feedback header not found in the generated text."

    def evaluate(self, question, response):
        sys_content = f"""
            You are conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            
            To the candidate you are interviewing, you asked the question '{question}'.
            """

        user_content = f"""                    
            Evaluate the candidate's response on a scale of 1 to 5, where 5 is the highest rating, and briefly explain why you gave the candidate that score.
            
            Here is the candidate's response:

            '{response}'
            """

        messages = [
            {
                "role": "system",
                "content": self.sys_content,
            },
            {
                "role": "user",
                "content": self.user_content
            }
        ]

        self.prompt = self.pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        
    def evaluate(self):
        outputs = self.pipe(self.prompt, max_new_tokens=256)
        return outputs[0]["generated_text"]