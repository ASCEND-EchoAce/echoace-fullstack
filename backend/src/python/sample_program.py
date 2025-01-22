from Inferencing.evaluators import BasicEvaluator

evaluator = BasicEvaluator()
feedback = evaluator.evaluate("Why LinkedIn?", "I heard that LinkedIn pays well.")
print(feedback)