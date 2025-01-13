from Inferencing.evaluators import BasicEvaluator

evaluator = BasicEvaluator("Why LinkedIn?", "I heard that LinkedIn pays well.")
feedback = evaluator.evaluate()
print(feedback)