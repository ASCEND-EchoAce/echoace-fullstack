'use client';

import { Label } from "@radix-ui/react-dropdown-menu";
import { InfoIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AudioRecorder from "@/components/interview/AudioRecorder";
import Link from "next/link";
import { useRouter } from "next/navigation";

const options = [
  "Tell me about yourself",
  "Why LinkedIn?",
  "Tell me about a time...",
];

export default function ProtectedPage() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<"pre" | "during" | "post">("pre");
  const [question, setQuestion] = useState(options[0]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Always call hooks at the top level
  const router = useRouter();

  useEffect(() => {
    if (cameraEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing camera:", error));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  }, [cameraEnabled]);

  // Redirect if interview status is post
  useEffect(() => {
    if (interviewStatus === "post") {
      router.push("/feedback");
    }
  }, [interviewStatus, router]);

  // Conditionally set the content to render
  let content;

  if (interviewStatus === "during") {
    content = (
      <div className="flex flex-col items-center gap-4 mt-20">
        <div className="flex flex-row gap-4"></div>
        <h2 className="text-xl font-bold mb-4">{question}</h2>
        <div className="w-[600px] h-[450px] bg-gray-300 flex items-center justify-center rounded overflow-hidden">
          {cameraEnabled ? (
            <video ref={videoRef} autoPlay className="w-full h-full" />
          ) : (
            <span>Camera Off</span>
          )}
        </div>
        <div className="mt-4 mb-4 hover:bg-gray-400 py-3 px-3 rounded-2xl">
          <label className="flex items-center gap-2">
            {cameraEnabled ? (
              <svg
                onClick={() => setCameraEnabled(false)}
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            ) : (
              <svg
                onClick={() => setCameraEnabled(true)}
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </label>
        </div>
        {/* Pass the onStop callback to AudioRecorder */}
        <AudioRecorder
          selectedQuestion={question}
          onStop={() => setInterviewStatus("post")}
        />
      </div>
    );
  } else {
    // Render pre-interview view
    content = (
      <div className="flex-1 w-full flex flex-col gap-12 items-center mt-20">
        <div className="w-full text-center">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center justify-center">
            <InfoIcon size="16" strokeWidth={2} />
            Please select a question to start your interview
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <Label>Starting Question</Label>
          <select
            name="current-status"
            className="border rounded-md p-3 mt-3"
            onChange={(e) => setQuestion(e.target.value)}
            required
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setInterviewStatus("during");
            }}
          >
            <button type="submit" className="bg-black text-white py-2 px-4 rounded">
              Start Interview
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{content}</>;
}
