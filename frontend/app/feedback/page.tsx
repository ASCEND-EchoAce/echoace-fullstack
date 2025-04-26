'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { signOutAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { HeartIcon } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('interviews')  // replace with your actual table name if it's different
          .select('*')
          .order('id', { ascending: false })
          .limit(1)
          .single();  // to unwrap the array directly into an object

        if (error) {
          throw new Error(error.message);
        }

        setInterviewData(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch interview data');
      }
    };

    fetchInterviewData();
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end py-3 px-10">
          <UserProfileDropdown user={user} />
        </div>
        <Chat initialInterviewData={interviewData} />
      </div>
    </div>
  );
};

const InterviewSummary = ({ data }: { data: any }) => {
  const createdAt = new Date(data.created_at).toLocaleString();
  return (
    <>
      👋 Hi! I'm Steve, your interview assistant. Here's a recap of the interview:
      <br /><br />
      🗓️ <strong>Created At:</strong> {createdAt}<br />
      ❓ <strong>Question:</strong> {data.question || 'N/A'}<br />
      🗣️ <strong>Transcript:</strong> {data.transcript || 'N/A'}<br />
      📋 <strong>Evaluation:</strong><br />
      {data.evaluation || 'N/A'}
    </>
  );
};

const Chat = ({ initialInterviewData }: { initialInterviewData: any }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ text?: string; isUser: boolean; data?: any }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialInterviewData) {
      setMessages([{ isUser: false, data: initialInterviewData }]);
    }
  }, [initialInterviewData]);

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { text: userMessage, isUser: true }, { text: '...', isUser: false }]);
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8080/process-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message to the backend');
        }

        const data = await response.json();
        const llmReply = data.reply;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { text: llmReply, isUser: false };
          return newMessages;
        });
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { text: 'Error: Failed to send message', isUser: false };
          return newMessages;
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex-1 flex flex-col items-center min-h-0">
      <div className="flex-1 w-full -mb-4 -mt-2 p-4 bg-white rounded overflow-y-auto">
      {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} px-40 mb-4`}
          >
            <div
              className={`max-w-[60%] rounded-lg p-3 mt-2 ${msg.isUser ? 'bg-gray-100' : 'bg-blue-50'} whitespace-pre-wrap`}
            >
              {msg.data ? <InterviewSummary data={msg.data} /> : msg.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex items-center w-[660px] mb-8">
        <input
          type="text"
          placeholder="Type a clarifying Question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 bg-gray-50 rounded-2xl px-4 py-5 focus:outline-none"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default App;
