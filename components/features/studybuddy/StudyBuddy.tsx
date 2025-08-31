import React, { useState, useRef, useEffect } from 'react';
import { createStudyBuddyChat } from '../../../services/geminiService';
import type { Chat } from '@google/genai';
import Button from '../../ui/Button';
import { Icons } from '../../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const parseMarkdown = (text: string): string => {
    let html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape HTML
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-1 font-mono text-sm">$1</code>') // Inline code
        .replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside"><li class="my-1">$1</li></ul>') // List items
    
    // Merge consecutive lists
    html = html.replace(/<\/ul>\s?<ul>/g, '');

    // Convert newlines to <br>, but not before block elements
    html = html.replace(/\n/g, '<br />');
    html = html.replace(/<br \/>(\s*<ul)/g, '$1');
    
    return html;
}

const initialMessage: Message = { 
    sender: 'bot', 
    text: "Hello! I'm your AI Study Buddy. How can I help you be more productive today? I can now remember our conversation." 
};

const StudyBuddy: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createStudyBuddyChat());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const startNewChat = () => {
    setChat(createStudyBuddyChat());
    setMessages([initialMessage]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const response = await chat.sendMessage({ message: currentInput });
        const formattedText = parseMarkdown(response.text);
        
        const botMessage: Message = { sender: 'bot', text: formattedText };
        setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const errorMessage = error instanceof Error 
            ? `An error occurred: ${error.message}`
            : "An unknown error occurred while talking to the Study Buddy.";
        const botMessage: Message = { sender: 'bot', text: errorMessage };
        setMessages(prev => [...prev, botMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
            <Icons.BrainCircuit className="w-6 h-6 text-primary"/>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Study Buddy</h2>
        </div>
        <Button variant="secondary" size="sm" onClick={startNewChat}>
            <Icons.PlusSquare className="w-4 h-4 mr-2" />
            New Chat
        </Button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <AnimatePresence>
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    layout
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                    {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1"><Icons.BrainCircuit className="w-5 h-5 text-white" /></div>}
                    <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                        <div className="text-sm prose" dangerouslySetInnerHTML={{__html: msg.text }} />
                    </div>
                    {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 mt-1" />}
                </motion.div>
            ))}
            {isLoading && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3"
                 >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1"><Icons.BrainCircuit className="w-5 h-5 text-white" /></div>
                    <div className="max-w-md p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a topic, e.g., 'Explain the Pythagorean theorem'"
            className="flex-1 w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Icons.Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudyBuddy;