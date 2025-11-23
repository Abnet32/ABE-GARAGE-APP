
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, Bot } from "lucide-react";
import type { ChatMessage } from "../types"; // <-- type-only import
import { generateMechanicResponse } from "../lib/gemini";


interface ChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialMessage?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, setIsOpen, initialMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi there! 👋 I'm the Abe Garage AI Assistant. How can I help you with your vehicle today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle initial prompt from other components
  useEffect(() => {
    if (isOpen && initialMessage && !hasProcessedInitial.current) {
      const processInitial = async () => {
        hasProcessedInitial.current = true;
        setMessages(prev => [...prev, { role: 'user', text: initialMessage }]);
        setIsLoading(true);
        const responseText = await generateMechanicResponse(initialMessage);
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        setIsLoading(false);
      };
      processInitial();
    }
    if (!isOpen) {
      hasProcessedInitial.current = false;
    }
  }, [isOpen, initialMessage]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await generateMechanicResponse(inputValue);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5 font-sans">
          {/* Modern Header */}
          <div className="bg-brand-blue p-5 flex justify-between items-center shadow-lg z-10">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <Bot className="text-brand-red" size={24} />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-brand-blue rounded-full"></div>
              </div>
              <div>
                 <h3 className="font-bold text-white text-base tracking-wide">Abe's Assistant</h3>
                 <div className="flex items-center gap-1.5">
                   <Sparkles size={10} className="text-yellow-400" />
                   <p className="text-[11px] text-blue-100 font-medium">Powered by Gemini AI</p>
                 </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.role === 'model' && (
                   <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0 mt-1">
                     <Bot size={14} className="text-brand-blue" />
                   </div>
                )}
                
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                    msg.role === 'user' 
                      ? 'bg-red-700 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={`${i > 0 ? 'mt-2' : ''}`}>{line}</p>
                  ))}
                </div>

                {msg.role === 'user' && (
                   <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0 mt-1">
                     <User size={14} className="text-brand-red" />
                   </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                   <Bot size={14} className="text-brand-blue" />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
             <div className="relative flex items-center">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about repairs, pricing, or hours..."
                  className="w-full bg-gray-100 text-gray-800 rounded-full py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all border border-transparent focus:border-brand-red/50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 p-2 bg-brand-red text-white rounded-full hover:bg-red-700 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                >
                  <Send size={16} className={isLoading ? 'opacity-0' : 'opacity-100'} />
                </button>
             </div>
             <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400">AI can make mistakes. Please verify critical info.</p>
             </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative bg-brand-red hover:bg-red-700 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(230,28,35,0.3)] hover:shadow-[0_8px_30px_rgb(230,28,35,0.5)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 pr-6"
        >
          <div className="relative">
             <MessageSquare size={28} className="relative z-10" />
             <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-brand-red"></span>
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm leading-none">Need Help?</span>
            <span className="text-[10px] text-red-100 font-medium">Chat with AI</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
