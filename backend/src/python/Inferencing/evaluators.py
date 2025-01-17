import torch
from transformers import pipeline

class BasicEvaluator:
    def __init__(self):
        self.pipe = pipeline("text-generation", model="meta-llama/Llama-3.2-1B-Instruct", torch_dtype=torch.bfloat16, device_map="auto")
        
    def evaluate(self, question, response):
        self.sys_content = f"""
            You are conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            
            To the candidate you are interviewing, you asked the question '{question}'.
            """
        
        self.user_content = f"""                    
                    Evaluate the candidate's reponse on a scale of 1 to 5, where 5 is the highest rating, and briefly explain why you gave the candidate that score.
                    
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

        outputs = self.pipe(self.prompt, max_new_tokens=256)
        return outputs[0]["generated_text"]