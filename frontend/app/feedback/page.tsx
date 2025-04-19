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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end py-5 px-10">
          <UserProfileDropdown user={user} />
        </div>
        <Chat isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
};

const Sidebar = ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => {
  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-[24%]'} bg-gray-800 text-white py-4 px-5 transition-all duration-300`}>
      <div className={`flex ${isCollapsed ? 'flex-col gap-4 items-center' : 'flex-row justify-between items-center'}`}>
        <Link href="/" className="flex gap-4 items-center">
          <Image src={'/logo.png'} alt={'logo'} width={40} height={40} className="brightness-0 invert" />
        </Link>
        <button 
          onClick={onToggle}
          className='hover:bg-gray-700 rounded-lg p-1 transition-transform duration-300 hover:scale-110'
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className={`size-8 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" 
            />
          </svg>
        </button>
      </div>
      {!isCollapsed && (
        <ul className='mt-16'>
          <li className="mb-2 cursor-pointer hover:text-gray-300">Chat 1</li>
          <li className="mb-2 cursor-pointer hover:text-gray-300">Chat 2</li>
          <li className="mb-2 cursor-pointer hover:text-gray-300">Chat 3</li>
        </ul>
      )}
      {!isCollapsed && (
        <div className='flex flex-row justify-center items-center absolute bottom-0 left-3text-xs'>
          Built with <HeartIcon className='size-4 mx-1' /> by ASCEND Product II.
        </div>
      )}
    </div>
    
  );
};

const Chat = ({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setInput('');
      
      // Immediately add user's message and loading indicator
      setMessages(prev => [...prev, { text: userMessage, isUser: true }, { text: '...', isUser: false }]);
      setIsLoading(true);

      try {
        // Send the message to the backend
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

        // Get the response from the backend (LLM's reply)
        const data = await response.json();
        const llmReply = data.reply;

        // Replace the loading indicator with the actual response
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { text: llmReply, isUser: false };
          return newMessages;
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Replace the loading indicator with error message
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
    <div
      className={`
        h-screen             /* fill screen height */
        flex-1 flex flex-col items-center
        min-h-0              /* allow inner flex-1 to shrink */
        transition-all duration-300
      `}
    >
      {/* ─── scrollable area ─── */}
      <div
        className="
          flex-1
          w-full
          mb-4 p-4
          bg-white rounded
          overflow-y-auto
        "
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`
              flex ${msg.isUser ? 'justify-end' : 'justify-start'}
              px-40 mb-4
            `}
          >
            <div
              className={`
                max-w-[60%] rounded-lg p-3 mt-2
                ${msg.isUser ? 'bg-gray-100' : 'bg-blue-50'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* this empty div is our scroll‐target */}
        <div ref={bottomRef} />
      </div>

      {/* ─── input bar ─── */}
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