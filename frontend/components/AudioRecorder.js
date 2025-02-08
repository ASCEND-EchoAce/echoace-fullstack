"use client"; // Mark this component as a client component

import { useState } from "react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch("http://localhost:8080/process-audio", {
            method: "POST",
            body: formData,
          });

          const jsonResponse = await response.json(); // Backend sends JSON
          const rawText = jsonResponse.transcription;

          // Replace '\n' with actual line breaks for rendering
          const formattedText = rawText.replace(/\n/g, "<br>");
          setTranscription(formattedText); // Store the formatted HTML string
        } catch (error) {
          console.error("Error fetching transcription:", error);
          setTranscription("Error: Could not process audio.");
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error: Could not access microphone.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isRecording ? "red" : "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {transcription && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            textAlign: "left",
          }}
          dangerouslySetInnerHTML={{ __html: transcription }} // Render HTML for line breaks
        ></div>
      )}
    </div>
  );
}