'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { signOutAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { HeartIcon } from 'lucide-react';
import { useRef } from 'react';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  const displayName = user ? 
    (user.user_metadata?.full_name || 
     user.user_metadata?.name || 
     user.email || 
     'Profile') : 'Profile';

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end py-5 px-10">
          <UserProfileDropdown user={user} />
        </div>
        <Chat />
      </div>
    </div>
  );
};

const Chat = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      <div className='flex-1 w-full mb-4 p-4 bg-white rounded overflow-y-auto'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} px-40 mb-4`}>
            <div className={`max-w-[60%] rounded-lg p-3 mt-2 ${msg.isUser ? 'bg-gray-100' : 'bg-blue-50'}`}>
              {msg.text}
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
}

export default App;