import { useState } from "react";
import Recorder from "recorder-js";
import { useSelf } from "@/hooks/useSelf";
import { UserAPI } from "@/api/userAPI";

export default function AudioRecorder({
  selectedQuestion,
  onStop, 
}: {
  selectedQuestion: string;
  onStop: (transcription: string, evaluation: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [recorder, setRecorder] = useState<Recorder | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const { user } = useSelf();

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
    if (recorder && user?.id) {
      setIsPending(true);
      setPendingText("Stopping recording...");

      try {
        // Ensure user exists in our users table
        await UserAPI.createUser(user.email || '', user.id);
      } catch (error) {
        console.error("❌ Error creating user:", error);
      }

      const { blob } = await recorder.stop();
      setIsRecording(false);

      const audioBlob = new Blob([blob], { type: "audio/wav" }); 
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("question", selectedQuestion);
      formData.append("user_fid", user.id);

      try {
        const response = await fetch("http://localhost:8080/process-audio", {
          method: "POST",
          body: formData,
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
          onStop(jsonResponse.transcription, jsonResponse.evaluation);
        }, 10);
      } catch (error) {
        console.error("❌ Error fetching server response:", error);
        setTranscription("Error: Could not process audio.");
        setIsPending(false);
        setPendingText("");
        onStop("Error: Could not process audio.", "Error: Could not process audio.");
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