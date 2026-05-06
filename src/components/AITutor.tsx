import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  MessageSquare,
  BookOpen,
  Mic,
  Gift
} from 'lucide-react';
import { aiTutor } from '../services/geminiService';
import { cn } from '../lib/utils';
import AdSimulation from './Ads';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AITutor({ userLevel, onClose }: { userLevel: string, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `¡Hola! Eu sou seu tutor Portunol AI. Como posso te ajudar hoje com seu espanhol de nível ${userLevel}?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [aiLimit, setAiLimit] = useState(5); // Simulate limit
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (aiLimit <= 0) {
      setShowRewardAd(true);
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await aiTutor.getConversationResponse(
        [...messages, { role: 'user', text: userMsg }],
        userLevel
      );
      setMessages(prev => [...prev, { role: 'model', text: response || "Perdão, tive um pequeno problema. Tente novamente." }]);
      setAiLimit(prev => prev - 1);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro ao conectar com o servidor AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center justify-between bg-primary text-white">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-300" /> AI Tutor
            </h2>
            <p className="text-[10px] opacity-70">Sempre disponível para tirar dúvidas</p>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> {aiLimit}
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'model' ? "bg-primary text-white" : "bg-gray-200"
              )}>
                {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'model' 
                  ? "bg-white text-gray-800 rounded-tl-none border border-gray-100" 
                  : "bg-primary text-white rounded-tr-none"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                <Bot size={18} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <footer className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre gramática, tradução..."
            className="flex-1 bg-gray-100 py-3 px-4 rounded-2xl focus:outline-none focus:ring-2 ring-primary/20"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-primary text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </footer>

      {showRewardAd && (
        <AdSimulation 
          type="rewarded"
          onClose={() => setShowRewardAd(false)}
          onReward={() => {
            setAiLimit(5);
            setMessages(prev => [...prev, { role: 'model', text: "¡Estupendo! Recompensa concedida. Você ganhou mais 5 consultas AI." }]);
          }}
        />
      )}
    </div>
  );
}
