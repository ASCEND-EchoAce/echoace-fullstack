import sys
import whisper

def main(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    print(result["text"])

if __name__ == "__main__":
    audio_path = sys.argv[1]  # Get the audio file path from the command-line arguments
    main(audio_path)
