'use client';

import { Label } from "@radix-ui/react-dropdown-menu";
import { InfoIcon} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AudioRecorder from "@/components/interview/AudioRecorder";
import Link from 'next/link';

const options = [
  "Tell me about yourself",
  "Why LinkedIn?",
  "Tell me about a time...",
];

export default function ProtectedPage() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<
    "pre" | "during" | "post"
  >("pre");
  const [question, setQuestion] = useState(options[0]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  if (interviewStatus === "during") {
    return (
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
  }

  if (interviewStatus === "post") {
    // Render your "post" view here
    return (
      <div className="flex flex-col items-center gap-4 mt-20">
        <h2 className="text-2xl font-bold">Thank you for your interview!</h2>
        {/* You can show results or other post-interview content here */}
        <div className="flex-1 justify-center border-2 w-100 h-40 rounded mt-40 mb-40">
              <div className="flex-1 w-full flex flex-col gap-12">
                <div className="w-full">
                  <div className="font-bold text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />
                    Session Ended
                  </div>
                  <div className="text-sm px-5 rounded-md text-foreground flex gap-3 items-center">
                    <p className="test-smp-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                      Great Job! Click here to read our feedback
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-2 mb-4 ml-10">
                <Link href="/feedback" className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">More Details</Link>
              </div>
            </div>
      </div>
    );
  }

  return (
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
