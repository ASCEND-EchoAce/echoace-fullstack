'use client';

import { Label } from "@radix-ui/react-dropdown-menu";
import { InfoIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import AudioRecorder from "@/components/interview/AudioRecorder";
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { useRouter } from "next/navigation";
import Typewriter from '@/components/normal-typewriter'
import ProgressBar from "@/components/ProgressBar";
import Image from 'next/image';
import CustomDropdown from "@/components/CustomDropdown";

const options = [
  "Custom Question",
  "Tell me about a time you had to solve a complex problem with no clear solution. How did you approach it?",
  "Describe a situation where you had to learn something new quickly to solve a problem.",
  "Have you ever led a project or team initiative? What was your role and how did you influence the outcome?",
  "Describe a time you took ownership of a problem outside your responsibilities.",
  "Tell me about a time you worked with someone very different from you. How did you adapt?",
  "Have you ever had to stand up for something you believed was right in a team setting?",
  "Tell me about a technical project you're proud of. What challenges did you face, and how did you overcome them?",
  "Describe a time when your technical judgment was critical to the success of a project.",
  "Tell me about a time you had to deliver something quickly. How did you prioritize and execute?",
  "Give me an example of a time you had a measurable impact on a project or team.",
  "Describe a time you took a big risk or tried something new. What happened?",
  "Tell me about a time you received critical feedback. How did you react, and what did you do with it?",
  "Have you ever given someone difficult feedback? How did you approach it?",
  "Tell me about a time you had a disagreement with a teammate. How did you handle it?",
  "Give me an example of when you helped someone else succeed.",
];

export default function ProtectedPage() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<"pre" | "during" | "post">("pre");
  const [question, setQuestion] = useState(options[0]);
  const [userResponse, setUserResponse] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [showLearnMore, setShowLearnMore] = useState(false);
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

  const handleDropdownChange = (option: string) => {
    setQuestion(option);
    // You can perform additional actions here if needed
  };

  const handleStopRecording = (transcription: string, evaluation: string) => {
    setUserResponse(transcription);
    setFeedback(evaluation);
    setInterviewStatus("post");
    setShowLearnMore(true);
  };

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
      // Instead of redirecting, we'll show the feedback in the chat
      setShowLearnMore(true);
      // Ensure feedback is set if it's not already
      if (!feedback) {
        setFeedback("Thank you for your response! I've analyzed your answer and here's my feedback...");
      }
    }
  }, [interviewStatus, feedback]);

  let content;

  if (interviewStatus === "during" || interviewStatus === "post") {
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
          <div className="border-2 border-gray-300 bg-white h-[550px] w-[400px] rounded-xl flex flex-col"> 
            <div className="w-full h-[48px] bg-gray-100 rounded-t-xl">
              <p className="font-bold py-3 px-3 text-slate-500">STEVE</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Steve's question */}
              <div className="flex items-start mb-4">
                <div className="flex items-start">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={24}
                    height={20}
                    className="invert mr-2"
                  />
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Typewriter key={question} text={question} speed={50} />
                  </div>
                </div>
              </div>

              {/* User's response */}
              {userResponse && (
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                    <p>{userResponse}</p>
                  </div>
                </div>
              )}

              {/* Steve's feedback */}
              {feedback && (
                <div className="flex items-start">
                  <div className="flex items-start">
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={24}
                      height={20}
                      className="invert mr-2"
                    />
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p>{feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Learn More button */}
            {showLearnMore && (
              <div className="p-4 border-t">
                <Button 
                  onClick={() => router.push("/feedback")}
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
        {interviewStatus === "during" && (
          <div className="mt-2">
            <AudioRecorder
              selectedQuestion={question}
              onStop={handleStopRecording}
            />
          </div>
        )}
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
            <CustomDropdown options={options} onChange={handleDropdownChange} />
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
