import sys
import whisper
from pydub import AudioSegment
from Inferencing.evaluators import BasicEvaluator

def convert_to_wav(input_file):
    output_file = input_file.replace(".webm", ".wav")
    try:
        audio = AudioSegment.from_file(input_file, format="webm")
        audio.export(output_file, format="wav")
        return output_file
    except Exception as e:
        raise Exception(f"Error converting file to WAV: {e}")

def main(audio_path):
    # Convert the file to WAV format
    try:
        wav_audio_path = convert_to_wav(audio_path)
    except Exception as e:
        return

    # Load the Whisper model
    model = whisper.load_model("base")

    try:
        result = model.transcribe(wav_audio_path)
    except Exception as e:
        return

    transcription_text = result.get("text", "").strip()

    if not transcription_text:
        return

    # Print the transcription output for `server.ts`
    print(transcription_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)

    audio_path = sys.argv[1]
    main(audio_path)
