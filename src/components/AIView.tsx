import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageCircle, 
  PenTool, 
  Brain, 
  ChevronRight, 
  X,
  Zap
} from 'lucide-react';
import { aiService, AiConversationMessage } from '../services/aiService';
import { UserProgress } from '../types';
import { cn } from '../lib/utils';
import { CONFIG } from '../config';
import { ScenarioSelector } from './ScenarioSelector';
import StandaloneAITutor from './AITutor';
import StandaloneWritingAssistant from './WritingAssistant';

export default function AIView({ user, onEarnCredits }: { user: UserProgress, onEarnCredits: () => void }) {
  const [activeTool, setActiveTool] = useState<'hub' | 'chat' | 'writing' | 'tutor'>('hub');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  
  if (!CONFIG.featureFlags.aiTutor) {
    return (
       <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-[30px] flex items-center justify-center text-gray-300">
            <Sparkles size={40} />
          </div>
          <h2 className="font-bold text-gray-400">Recursos IA Temporariamente Indisponíveis</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Estamos realizando melhorias em nossos servidores de IA. Volte em breve para continuar praticando!
          </p>
       </div>
    );
  }

  const aiCredits = user?.coins || 0;

  return (
    <div className="min-h-full bg-gray-50 flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {activeTool === 'hub' && (
          <motion.div 
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-8 pb-32 h-full overflow-y-auto"
          >
            <header className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={24} className="fill-current" />
                <h1 className="text-3xl font-display font-bold">Portunol IA</h1>
              </div>
              <p className="text-gray-500 text-sm">Sua jornada personalizada com inteligência artificial.</p>
            </header>

            {/* AI Credits Card */}
            <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Créditos de IA (Moedas)</span>
                <Sparkles size={18} className="text-primary" />
              </div>
              <div className="flex items-end gap-2 relative z-10">
                <span className="text-5xl font-display font-bold">{aiCredits}</span>
                <span className="text-sm opacity-40 mb-1 font-bold uppercase tracking-widest">Ativos</span>
              </div>
              <button 
                onClick={onEarnCredits}
                className="w-full bg-primary text-white py-5 rounded-[28px] font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20 relative z-10"
              >
                GANHAR +20 CRÉDITOS 📺
              </button>
            </div>

            <div className="grid gap-4">
              <AIToolCard 
                icon={MessageCircle} 
                title="Conversação Real" 
                desc="Pratique diálogos em situações reais com feedback instantâneo."
                color="bg-orange-50 text-orange-600"
                onClick={() => setActiveTool('chat')}
              />
              <AIToolCard 
                icon={PenTool} 
                title="Escrita Criativa" 
                desc="Escreva e receba correções detalhadas com explicações."
                color="bg-blue-50 text-blue-600"
                onClick={() => setActiveTool('writing')}
              />
              <AIToolCard 
                icon={Brain} 
                title="Tutor Personalizado" 
                desc="Tire dúvidas gramaticais e gere exercícios sob medida."
                color="bg-indigo-50 text-indigo-600"
                onClick={() => setActiveTool('tutor')}
              />
            </div>

            {/* AI Hub Banner Ad */}
            <div className="bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">🌐</div>
                  <div>
                     <p className="text-[10px] font-bold text-gray-900">Seguro Viagem Madrid</p>
                     <p className="text-[9px] text-gray-400">Proteja sua imersão na Espanha.</p>
                  </div>
               </div>
               <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">VER</button>
            </div>
          </motion.div>
        )}

        {activeTool === 'chat' && (
          !selectedScenario ? (
            <motion.div key="scenarios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTool('hub')} className="p-2 bg-white rounded-xl shadow-sm"><X size={18} /></button>
                  <h2 className="text-xl font-display font-bold">Escolha um Cenário</h2>
               </div>
               <ScenarioSelector onSelect={(id) => setSelectedScenario(id)} />
            </motion.div>
          ) : (
            <AIChat 
              onClose={() => { setSelectedScenario(null); setActiveTool('hub'); }} 
              userLevel={user.currentLevel} 
              credits={user.coins}
              scenarioId={selectedScenario}
              onEarnCredits={onEarnCredits}
            />
          )
        )}
        {activeTool === 'writing' && (
          <StandaloneWritingAssistant 
            onClose={() => setActiveTool('hub')} 
            credits={aiCredits}
            onEarnCredits={onEarnCredits}
          />
        )}
        {activeTool === 'tutor' && (
          <StandaloneAITutor 
            onClose={() => setActiveTool('hub')} 
            userLevel={user.currentLevel} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AIToolCard({ icon: Icon, title, desc, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5 text-left active:scale-[0.98] transition-all shadow-sm group"
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", color)}>
        <Icon size={28} />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-bold text-lg leading-tight">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}

function AIChat({ onClose, userLevel, credits, scenarioId, onEarnCredits }: any) {
  const scenario = (CONFIG.scenarios.find((s: any) => s.id === scenarioId) || CONFIG.scenarios[0]) as any;
  
  const [messages, setMessages] = useState<AiConversationMessage[]>([
    { role: 'assistant', content: `¡Hola! Soy tu compañero de charla. Estamos en el escenario: ${scenario.name}. ${scenario.initialMessage || '¿De qué quieres hablar hoje?'}` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (credits < 1) {
      alert("Você precisa de pelo menos 1 crédito para enviar uma mensagem.");
      return;
    }

    const userMsg: AiConversationMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chatMessages = [...messages, userMsg].map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      const response = await aiService.chat(chatMessages as any, `Conversação natural para nível ${userLevel}. O tutor deve ser encorajador e focar em eliminar o portunol.`);
      window.dispatchEvent(new CustomEvent('deduct-credits', { detail: 1 }));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content,
        suggestion: response.suggestion
      }]);
    } catch (e) {
      console.error(e);
      alert("Erro na conexão com a IA. Tente novamente.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 bg-white z-[200] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 text-gray-400"><X /></button>
          <div>
            <span className="font-bold block">Conversação IA</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{credits} créditos</span>
          </div>
        </div>
        <div className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-bold">Nível {userLevel}</div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={cn("max-w-[85%] space-y-2", m.role === 'user' ? "ml-auto" : "mr-auto")}>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
              m.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
            )}>
              {m.content}
            </div>
            {m.suggestion && (
              <div className="bg-orange-50 border border-orange-100 p-2 rounded-xl text-[10px] text-orange-600 flex items-center gap-2 italic">
                <Sparkles size={10} /> Sugestão: {m.suggestion}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-400 italic px-2 animate-pulse">Pensando...</div>}
        {credits <= 0 ? (
           <div className="p-6 bg-red-50 border border-red-100 rounded-3xl space-y-4 text-center">
              <p className="text-sm font-bold text-red-900">Seus créditos acabaram!</p>
              <button onClick={onEarnCredits} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                 <span>Ganhar mais 20 créditos</span>
                 <Zap size={14} className="fill-current" />
              </button>
           </div>
        ) : null}
      </div>

      <div className="p-4 border-t flex gap-2 bg-white pb-8">
        <input 
          disabled={credits <= 0}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={credits > 0 ? "Escriba aquí..." : "Créditos insuficientes"}
          className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend} 
          disabled={credits <= 0 || !input.trim()}
          className="bg-primary text-white p-3 rounded-2xl active:scale-90 transition-all disabled:opacity-30"
        >
          <Zap size={20} />
        </button>
      </div>
    </motion.div>
  );
}
