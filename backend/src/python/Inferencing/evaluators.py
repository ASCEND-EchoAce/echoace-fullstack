# import torch
# from transformers import pipeline

# class BasicEvaluator:
#     def __init__(self):
#         self.pipe = pipeline("text-generation", model="meta-llama/Llama-3.2-1B-Instruct", torch_dtype=torch.bfloat16, device_map="auto")

#     def get_feedback(self, generated_text):
#         header = "<|start_header_id|>assistant<|end_header_id|>"
#         header_index = generated_text.index(header)
#         feedback_index = header_index + len(header) + 2
#         return generated_text[feedback_index:]
#     def evaluate(self, question, response):
#         sys_content = f"""
#             You are conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            
#             To the candidate you are interviewing, you asked the question '{question}'.
#             """
        
#         user_content = f"""                    
#                     Evaluate the candidate's reponse on a scale of 1 to 5, where 5 is the highest rating, and briefly explain why you gave the candidate that score.
                    
#                     Here is the candidate's response:

#                     '{response}'
#                     """
        
#         messages = [
#             {
#                 "role": "system",
#                 "content": sys_content,
#             },
#             {
#                 "role": "user",
#                 "content": user_content
#             }
#         ]

#         prompt = self.pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

#         outputs = self.pipe(prompt, max_new_tokens=256)
#         return self.get_feedback(outputs[0]["generated_text"])



import sys
import torch
from transformers import pipeline

class BasicEvaluator:
    def __init__(self):
        # Use float16 for MPS compatibility
        self.pipe = pipeline(
            "text-generation",
            model="meta-llama/Llama-3.2-1B-Instruct",  # Use your model
            torch_dtype=torch.float32,  # Use float32 for CPU
            device="cpu"  # Force usage of CPU instead of MPS
        )

    def get_feedback(self, generated_text):
        header = "<|start_header_id|>assistant<|end_header_id|>"
        try:
            header_index = generated_text.index(header)
            feedback_index = header_index + len(header) + 2
            return generated_text[feedback_index:]
        except ValueError:
            return "Feedback header not found."

    def evaluate(self, question, response):
        sys_content = f"""
            You are conducting a behavioral interview for the 'Software Engineering Intern' position at LinkedIn.
            To the candidate you are interviewing, you asked the question: '{question}'.
        """
        
        user_content = f"""                    
        Evaluate the candidate's response on a scale of 1 to 5, where 5 is the highest rating, and briefly explain why.
        Here is the candidate's response:
        '{response}'
        """
        
        messages = [
            {"role": "system", "content": sys_content},
            {"role": "user", "content": user_content}
        ]

        prompt = self.pipe.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        print("Starting inference...")
        outputs = self.pipe(prompt, max_new_tokens=256)  # Limit token generation to avoid long computation
        print("Inference complete!")
        evaluation = self.get_feedback(outputs[0]["generated_text"])
        print("Evaluation Result:", evaluation)
        return evaluation


# The main function to handle arguments from the command line
if __name__ == "__main__":
    evaluator = BasicEvaluator()

    # Get the arguments passed from server (question and response)
    question = sys.argv[1]
    response = sys.argv[2]

    # Evaluate the response based on the question
    print("Evaluating the response...")

    evaluation = evaluator.evaluate(question, response)
    
    # Output the evaluation result (it will be captured by the server)
    print(evaluation)


    
# if __name__ == "__main__":
#     evaluator = BasicEvaluator()

#     question = "How do you manage conflicts in a team?"
#     response = "Hola mi nombre is Brandon. Yo nomas le digo a mis copaneros que los odio"

#     print("Evaluating the response...")

#     evaluation = evaluator.evaluate(question, response)
#     print("Evaluation Result:", evaluation)
