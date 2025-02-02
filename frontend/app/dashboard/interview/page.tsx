'use client';

import { Button } from '../../../components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { endInterviewAction } from '@/app/actions';
import AudioRecorder from '@/components/AudioRecorder.js'; // Import the AudioRecorder component


export default function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>();
  const [audioURL, setAudioURL] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        // make http request
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error: Could not access microphone.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 justify-center items-center">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Tell me about Yourself</h2>
      </div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
         className="border-8 border-grey-900 rounded-lg shadow-xl"
      />
      {/* <Button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button> */}
      <div className="flex justify-center gap-4 mt-4">
        <form action={endInterviewAction}>
          <button type="submit" className="bg-black text-white py-2 px-4 rounded-lg">
            End Interview
          </button>
        </form>
      </div>
      <div>
        <p>Record audio and get a transcription:</p>
        <AudioRecorder /> {}
      </div>
    </div>
  );
}