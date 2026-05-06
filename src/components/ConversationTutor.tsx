import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConversation } from '../hooks/useConversation';
import { Message } from '../types';
import { Send, User, Bot, AlertCircle, Coins, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScenarioSelector } from './ScenarioSelector';

interface ConversationTutorProps {
  uid: string;
  userCoins: number;
  onBack: () => void;
}

export const ConversationTutor: React.FC<ConversationTutorProps> = ({ uid, userCoins, onBack }) => {
  const { sessionId, messages, loading, startNew, send } = useConversation(uid);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!inputText.trim() || loading) return;
    send(inputText);
    setInputText('');
  };

  if (!sessionId) {
    return (
      <div className="flex-1 flex flex-col space-y-8 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
             <ChevronLeft className="cursor-pointer" onClick={onBack} />
             <h2 className="text-2xl font-black tracking-tight">Tutor IA</h2>
          </div>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Escolha um cenário para praticar sua conversação em espanhol com feedback em tempo real.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
           <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Coins size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Custo da Sessão</p>
              <p className="text-xs text-amber-700 font-bold">10 Moedas (Sessão completa)</p>
           </div>
        </div>

        <ScenarioSelector 
          onSelect={startNew} 
          disabled={userCoins < 10} 
        />

        {userCoins < 10 && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <p className="text-xs font-bold font-bold">Saldo de moedas insuficiente.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full max-h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 hover:bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">Tutor de Espanhol</h3>
            <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth pb-24"
      >
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full mb-2",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-br-none" 
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-2"
          >
            <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-gray-100 flex gap-1">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escreva em espanhol..."
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || loading}
            className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
