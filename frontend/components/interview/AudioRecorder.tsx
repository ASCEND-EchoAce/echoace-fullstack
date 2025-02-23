// 'use client';

// import { Button } from '../ui/button';
// import { useEffect, useRef, useState } from 'react';

// const AudioRecorder: React.FC<{ question: string }> = ({ question }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>();
//   const [audioURL, setAudioURL] = useState<string>('');
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error('Error accessing webcam: ', err);
//       }
//     };

//     startVideo();

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);


//   const handleStartRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const audioChunks: Blob[] = [];

//       recorder.ondataavailable = (event) => {
//         audioChunks.push(event.data);
//       };

//       recorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const formData = new FormData();
//         formData.append('audio', audioBlob);

//         // make http request
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       alert('Error: Could not access microphone.');
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col gap-4 justify-center items-center">
//       <h1 className="text-3xl">{question}</h1>
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         width="640"
//         height="480"
//         style={{ border: '1px solid black' }}
//       />
//       <Button onClick={isRecording ? handleStopRecording : handleStartRecording}>
//         {isRecording ? 'Stop' : 'Start'}
//       </Button>
//     </div>
//   );
// };

// export default AudioRecorder;




import { useState } from "react";
import Recorder from 'recorder-js';

export default function AudioRecorder({ selectedQuestion }: { selectedQuestion: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [recorder, setRecorder] = useState<Recorder | null>(null);

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
      const { blob } = await recorder.stop();
      setIsRecording(false);

      const audioBlob = new Blob([blob], { type: 'audio/wav' });

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
      } catch (error) {
        console.error("❌ Error fetching server response:", error);
        setTranscription("Error: Could not process audio.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`py-2 px-4 rounded ${isRecording ? "bg-red-600" : "bg-green-600"} text-white`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
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
