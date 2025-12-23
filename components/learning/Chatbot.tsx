
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserType, Message } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface ChatbotProps {
  userType: UserType;
  userName: string;
}

const getSystemInstruction = (userType: UserType, userName: string): string => {
  const base = `The user's name is ${userName}. Your persona is 'Kore', a warm and polite female English tutor. Always address the user by name. `;
  switch (userType) {
    case UserType.Beginner:
      return base + 'You are a patient teacher. Use simple English, correct errors gently, and encourage the user.';
    case UserType.Advanced:
      return base + 'You are a sophisticated conversation partner. Focus on idiomatic expressions and sounding natural.';
    case UserType.Professional:
      return base + 'You are a professional business coach. Focus on workplace etiquette, professional tone, and industry clarity.';
    default:
      return base + 'You are a helpful English learning assistant.';
  }
};

const Chatbot: React.FC<ChatbotProps> = ({ userType, userName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { transcript, isListening, startListening, stopListening, error: recognitionError } = useSpeechRecognition();
  const { speak, isSpeaking } = useTextToSpeech();

  const systemInstruction = getSystemInstruction(userType, userName);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = `Hi ${userName}! I'm Kore, your English learning assistant. It's so nice to meet you! As a ${userType}, what would you like to practice together today?`;
      setMessages([{ id: 'greeting', text: greeting, sender: 'ai' }]);
      setHistory([{ role: 'model', parts: [{ text: greeting }] }]);
    }
  }, [userName, userType, messages.length]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await geminiService.getChatResponse(input, history, systemInstruction);
      const aiText = response.text || "I'm here to help!";
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' };
      
      setMessages(prev => [...prev, aiMessage]);
      setHistory(prev => [...prev, { role: 'user', parts: [{text: input}] }, { role: 'model', parts: [{text: aiText}] }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', text: 'Sorry, I hit a snag.', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, history, systemInstruction]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Chat with Kore</h2>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">AI Online</span>
        </div>
      </div>

      <div className="flex-grow min-h-[450px] bg-slate-50 rounded-2xl p-6 overflow-y-auto mb-4 border border-slate-200 shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 my-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg">
                    <Icon name="language" className="w-6 h-6 text-white" />
                </div>
            )}
            <div className={`group relative p-4 rounded-2xl max-w-[85%] sm:max-w-[70%] transition-all ${msg.sender === 'user' ? 'bg-indigo-600 text-white shadow-md rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'}`}>
              <p className="text-sm sm:text-base leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              {msg.sender === 'ai' && (
                <button 
                    onClick={() => speak(msg.text)} 
                    disabled={isSpeaking} 
                    className={`mt-3 flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md transition-colors ${isSpeaking ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                    <Icon name="speaker" className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`}/>
                    {isSpeaking ? 'Kore is speaking...' : 'Listen to Kore'}
                </button>
              )}
            </div>
            {msg.sender === 'user' && (
                <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm">
                    <span className="text-slate-600 font-bold text-xs">{userName.charAt(0).toUpperCase()}</span>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm rounded-tl-none">
              <Spinner className="text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Type a message to Kore...`}
          className="flex-1 p-3 border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none min-h-[44px] max-h-[120px]"
          rows={1}
        />
        <div className="flex gap-1 pb-1 pr-1">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'}`}
              title="Speak to AI"
            >
              <Icon name={isListening ? "stop" : "microphone"} className="w-5 h-5" />
            </button>
            <Button onClick={handleSend} isLoading={isLoading} disabled={!input.trim()} className="rounded-xl h-10 w-10 !p-0 shadow-none">
              <Icon name="send" className="w-5 h-5" />
            </Button>
        </div>
      </div>
      {recognitionError && <p className="text-red-500 text-[10px] mt-2 text-center font-bold tracking-widest uppercase">{recognitionError}</p>}
    </div>
  );
};

export default Chatbot;
