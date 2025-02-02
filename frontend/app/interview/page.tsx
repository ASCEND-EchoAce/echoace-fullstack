'use client';

import { Label } from '@radix-ui/react-dropdown-menu';
import AudioRecorder from '../../components/interview/AudioRecorder';
import { useState } from 'react';

const options = ['Tell me about yourself', 'Why LinkedIn?', 'Tell me about a time...'];

export default function InterviewPage() {
  const [interviewStatus, setInterviewStatus] = useState<'pre' | 'during' | 'post'>('pre');
  const [question, setQuestion] = useState('');

  if (interviewStatus === 'during') {
    return <AudioRecorder question={question} />;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col mt-20 gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">ECHOACE INTERVIEW</h2>
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
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <form action={() => setInterviewStatus('during')}>
          <button type="submit" className="bg-black text-white py-2 px-4 rounded">
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
}
