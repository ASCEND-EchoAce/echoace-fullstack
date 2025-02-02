'use client';

import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';

const AudioRecorder: React.FC<{ question: string }> = ({ question }) => {
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
      <h1 className="text-3xl">{question}</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ border: '1px solid black' }}
      />
      <Button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
};

export default AudioRecorder;
