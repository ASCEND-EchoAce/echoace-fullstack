"use client";

import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { endInterviewAction } from '@/app/actions';
import { useState, useRef, useEffect } from 'react';
import AudioRecorder from '@/components/interview/AudioRecorder';

export default function ProtectedPage() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (cameraEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => console.error("Error accessing camera:", error));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [cameraEnabled]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Please select a question to start your interview
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Select a Question</h2>
        <select
          className="p-2 border rounded"
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
        >
          <option value="">-- Choose a question --</option>
          <option value="Tell me about yourself">Tell me about yourself</option>
          <option value="What are your strengths?">What are your strengths?</option>
          <option value="Describe a challenge you faced">Describe a challenge you faced</option>
        </select>
      </div>
      <div className="flex flex-col items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={cameraEnabled} onChange={() => setCameraEnabled(!cameraEnabled)} />
          Enable Camera
        </label>
        <div className="w-96 h-72 bg-gray-300 flex items-center justify-center rounded overflow-hidden">
          {cameraEnabled ? <video ref={videoRef} autoPlay className="w-full h-full" /> : <span>Camera Off</span>}
        </div>
        <AudioRecorder selectedQuestion={selectedQuestion} />
      </div>
    </div>
  );
}