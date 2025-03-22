import { useState } from "react";
import Recorder from "recorder-js";

export default function AudioRecorder({
  selectedQuestion,
  onStop, 
}: {
  selectedQuestion: string;
  onStop: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [recorder, setRecorder] = useState<Recorder | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [pendingText, setPendingText] = useState("");

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new Recorder(new AudioContext());
      await newRecorder.init(stream);
      setRecorder(newRecorder);
      newRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("❌ Error accessing microphone:", error);
      alert("Error: Could not access microphone.");
    }
  };

  const handleStopRecording = async () => {
    if (recorder) {
      setIsPending(true);
      setPendingText("Stopping recording...");

      const { blob } = await recorder.stop();
      setIsRecording(false);

      const audioBlob = new Blob([blob], { type: "audio/wav" }); 
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav"); // Set filename to .wav
      formData.append("question", selectedQuestion);

      try {
        // Ensure server is configured to accept multipart/form-data
        const response = await fetch("http://localhost:8080/process-audio", {
          method: "POST",
          body: formData,
          headers: {
            // No need to set Content-Type explicitly for FormData, browser handles this
          },
        });

        if (!response.ok) {
          throw new Error("Server responded with an error.");
        }

        const jsonResponse = await response.json();
        console.log("✅ Server JSON response:", jsonResponse);

        setTranscription(jsonResponse.transcription);
        setEvaluation(jsonResponse.evaluation);

        setTimeout(() => {
          setIsPending(false);
          setPendingText("");
          onStop(); // call the parent's callback to change interviewStatus
        }, 10);
      } catch (error) {
        console.error("❌ Error fetching server response:", error);
        setTranscription("Error: Could not process audio.");
        setIsPending(false);
        setPendingText("");
        // setTimeout(() => {
        //   setIsPending(false);
        //   setPendingText("");
        //   onStop(); 
        // }, 10);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`py-2 px-4 rounded ${
          isRecording ? "bg-red-600" : "bg-black"
        } text-white`}
      >
        {isPending
          ? pendingText
          : isRecording
          ? "Stop Recording"
          : "Start Recording"}
      </button>
      {transcription && (
        <div className="mt-4 p-4 bg-gray-200 rounded text-black">
          <strong>Transcription:</strong>
          <p dangerouslySetInnerHTML={{ __html: transcription }} />
        </div>
      )}
      {evaluation && (
        <div className="mt-4 p-4 bg-gray-200 rounded text-black">
          <strong>Evaluation:</strong>
          <p dangerouslySetInnerHTML={{ __html: evaluation }} />
        </div>
      )}
    </div>
  );
}