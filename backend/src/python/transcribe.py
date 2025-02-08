# import sys
# import whisper
# from Inferencing.evaluators import BasicEvaluator

# def main(audio_path):
#     # Load the Whisper model
#     model = whisper.load_model("base")
#     result = model.transcribe(audio_path)

#     transcription_text = result["text"]

#     # Get feedback from the evaluator
#     evaluator = BasicEvaluator()
#     feedback = evaluator.evaluate("Why LinkedIn?", transcription_text)

#     # Combine transcription and feedback into a single formatted string
#     output = (
#         f"<strong>Transcription:</strong>\n{transcription_text.strip()}\n\n"
#         f"<strong>Feedback:</strong>\n{feedback.strip()}"
#     )

#     # Print the combined output as plain text (with HTML formatting for bold)
#     print(output)

# if __name__ == "__main__":
#     audio_path = "backend/" + sys.argv[1]  # Get the audio file path from the command-line arguments
#     main(audio_path)



import sys
import whisper
from pydub import AudioSegment
from Inferencing.evaluators import BasicEvaluator

def convert_to_wav(input_file):
    output_file = input_file.replace(".webm", ".wav")
    try:
        audio = AudioSegment.from_file(input_file, format="webm")
        audio.export(output_file, format="wav")
        print(f"✅ Successfully converted {input_file} to WAV format")
        return output_file
    except Exception as e:
        print(f"❌ Error converting file to WAV: {e}")
        raise

def main(audio_path):
    print(f"✅ Transcribe.py received: {audio_path}")

    # Convert the file to WAV format
    try:
        wav_audio_path = convert_to_wav(audio_path)
    except Exception as e:
        print(f"❌ Error during conversion: {e}")
        return

    # Load the Whisper model
    model = whisper.load_model("base")

    try:
        result = model.transcribe(wav_audio_path)
    except Exception as e:
        print(f"❌ Whisper transcription failed: {e}")
        return

    transcription_text = result.get("text", "").strip()

    print(f"✅ Transcription: {transcription_text}")

    if not transcription_text:
        print("❌ Transcription is empty!")
        return

    # Print the transcription output for `server.ts`
    print(transcription_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Error: Missing audio file argument.")
        sys.exit(1)

    audio_path = sys.argv[1]
    main(audio_path)
