'use client';

import { useState } from 'react';

const App = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <Chat />
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-[30%] bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      <ul>
        <li className="mb-2 cursor-pointer hover:text-gray-300">Chat 1</li>
        <li className="mb-2 cursor-pointer hover:text-gray-300">Chat 2</li>
        <li className="mb-2 cursor-pointer hover:text-gray-300">Chat 3</li>
      </ul>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setInput('');
      
      // Immediately add user's message and loading indicator
      setMessages(prev => [...prev, `You: ${userMessage}`, 'Steve: ...']);
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
          newMessages[newMessages.length - 1] = `Steve: ${llmReply}`;
          return newMessages;
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Replace the loading indicator with error message
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = 'Error: Failed to send message';
          return newMessages;
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-100">
      <div className="flex-1 mb-4 p-4 border border-gray-300 bg-white rounded overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a clarifying Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;