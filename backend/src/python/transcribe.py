import sys
import whisper
from Inferencing.evaluators import BasicEvaluator

def main(audio_path):
    # Load the Whisper model
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)

    transcription_text = result["text"]

    # Get feedback from the evaluator
    evaluator = BasicEvaluator()
    feedback = evaluator.evaluate("Why LinkedIn?", transcription_text)

    # Combine transcription and feedback into a single formatted string
    output = (
        f"<strong>Transcription:</strong>\n{transcription_text.strip()}\n\n"
        f"<strong>Feedback:</strong>\n{feedback.strip()}"
    )

    # Print the combined output as plain text (with HTML formatting for bold)
    print(output)

if __name__ == "__main__":
    audio_path = sys.argv[1]  # Get the audio file path from the command-line arguments
    main(audio_path)
