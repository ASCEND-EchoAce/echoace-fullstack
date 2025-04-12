'use client';

import { Label } from "@radix-ui/react-dropdown-menu";
import { InfoIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AudioRecorder from "@/components/interview/AudioRecorder";
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { useRouter } from "next/navigation";
import Typewriter from '@/components/normal-typewriter'
import ProgressBar from "@/components/ProgressBar";
import Image from 'next/image';

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
  const router = useRouter();

  const getProgress = () => {
    if (interviewStatus === "pre") return 0;    
    if (interviewStatus === "during") return 50;  
    if (interviewStatus === "post") return 100;    
    return 0;
  };

  const getCurrentPage = () => { 
    if (interviewStatus === "pre") return "Interview Details";
    if (interviewStatus === "during") return "Mock Interview"
  }
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

  useEffect(() => {
    if (interviewStatus === "post") {
      router.push("/feedback");
    }
  }, [interviewStatus, router]);

  let content;

  if (interviewStatus === "during") {
    content = (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row gap-16">
          <div className="relative w-[700px] h-[550px] bg-gray-950 flex items-center justify-center rounded-lg overflow-hidden">
            {cameraEnabled ? (
              <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xl">Camera Off</span>
            )}
            <label className="absolute bottom-0 flex items-center gap-2 mb-4 bg-white hover:bg-gray-200 py-3 px-3 rounded-full">
            {cameraEnabled ? (
              <svg
                onClick={() => setCameraEnabled(false)}
                className="h-6 w-6"  
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
                className="h-6 w-6"  
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
          <div className="border-2 border-gray-300 bg-white h-[300px] w-[400px] rounded-xl "> 
            <div className="w-full h-[48px] bg-gray-100 rounded-md">
              <p className="font-bold py-3 px-3 text-slate-500">STEVE </p>
            </div>
            
            <p className="flex flex-row px-5 py-3 text-md text-ellipsis font-semibold font-sans gap-1">
              <Image src={'/logo.png'} alt={'logo'} width={24} height={20} className="invert" />
              
              <Typewriter key={question} text={question} speed={50}/>
              </p>
          </div>
        </div>
        <div className="mt-2">
          <AudioRecorder
            selectedQuestion={question}
            onStop={() => setInterviewStatus("post")}
          />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        <div className="w-full text-center">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center justify-center">
            <InfoIcon size="16" strokeWidth={2} />
            Please select a question to start your interview
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <Label className="text-xl">Interview Question</Label>
          <select
            name="current-status"
            className="border border-black rounded-md py-2.5 px-10 mt-3 left-0"
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
            <Button type="submit" variant={'secondary'} className="bg-highlight text-bold">Begin Interview</Button>
            {/* <button type="submit" className="bg-black text-white py-2 px-4 rounded-md">
              Begin Interview
            </button> */}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{getCurrentPage()}</h1>
      <div className="w-[700px] mx-auto mb-2">
        <ProgressBar progress={getProgress()} />
      </div>
      <div>
        {content}
      </div>
    </div>
  );
}
