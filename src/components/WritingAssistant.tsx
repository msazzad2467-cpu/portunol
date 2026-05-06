import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Send, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  BarChart3,
  Lightbulb,
  Zap
} from 'lucide-react';
import { userService } from '../services/userService';
import { aiService, WritingFeedback } from '../services/aiService';
import { cn } from '../lib/utils';

export default function WritingAssistant({ onClose, credits, onEarnCredits }: { onClose: () => void, credits: number, onEarnCredits: () => void }) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 20) return;
    
    if (credits < 5) {
      alert("Você precisa de pelo menos 5 créditos para realizar esta análise.");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await aiService.evaluateWriting(text);
      window.dispatchEvent(new CustomEvent('deduct-credits', { detail: 5 }));
      setFeedback(result);
    } catch (error) {
      console.error("Error analyzing text:", error);
      alert("Ocorreu um erro ao analisar o texto. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-white z-[600] flex flex-col max-w-md mx-auto"
    >
      <header className="p-6 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">Assistente de Escrita</h2>
            <p className={cn(
              "text-[10px] font-bold",
              credits < 5 ? "text-red-500" : "text-indigo-400"
            )}>
              {credits} CRÉDITOS {credits < 5 && "(Mínimo 5 p/ análise)"}
            </p>
          </div>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!feedback ? (
          <div className="space-y-4">
             {credits < 5 && (
               <div className="bg-red-50 p-6 rounded-3xl text-center space-y-4 border border-red-100">
                 <p className="text-sm font-bold text-red-900 leading-tight">Você precisa de 5 créditos para esta análise.</p>
                 <button onClick={onEarnCredits} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                   <span>GANHAR +20 CRÉDITOS</span>
                   <Zap size={14} className="fill-current" />
                 </button>
               </div>
             )}
             
             <div className="bg-indigo-50 p-4 rounded-2xl flex gap-3">
                <Lightbulb size={20} className="text-indigo-600 shrink-0" />
                <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                  Escreva sobre suas férias, um dia de trabalho ou uma opinião sobre um filme. Nossa IA analisará sua gramática e vocabulário.
                </p>
             </div>
             
             <div className="relative">
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva seu texto aqui (mínimo 20 caracteres)..."
                  className="w-full h-64 p-6 bg-gray-50 border border-gray-100 rounded-[32px] text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none transition-all"
                />
                <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-400">
                  {text.length} caracteres
                </div>
             </div>

             <button 
               onClick={handleAnalyze}
               disabled={text.length < 20 || isAnalyzing || credits < 5}
               className={cn(
                 "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                 (text.length < 20 || isAnalyzing || credits < 5)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                  : "bg-indigo-600 text-white shadow-indigo-200 active:scale-95"
               )}
             >
               {isAnalyzing ? (
                 <>
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                   >
                     <Sparkles size={18} />
                   </motion.div>
                   ANALISANDO...
                 </>
               ) : (
                 <>
                   <Send size={18} />
                   OBTER FEEDBACK IA (5 🪙)
                 </>
               )}
             </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             {/* Score & Level Dashboard */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-6 rounded-[32px] text-center space-y-1">
                   <p className="text-[10px] font-bold text-indigo-400 uppercase">Score Geral</p>
                   <p className="text-4xl font-display font-bold text-indigo-600">{feedback.score}</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[32px] text-center space-y-1">
                   <p className="text-[10px] font-bold text-emerald-400 uppercase">Nível CEFR</p>
                   <p className="text-4xl font-display font-bold text-emerald-600">{feedback.cefrLevel}</p>
                </div>
             </div>

             {/* Feedback Areas */}
             <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                   <CheckCircle2 size={12} className="text-emerald-500" /> Pontos Fortes
                </h3>
                <div className="space-y-2">
                   {feedback.strengths.map((s, i) => (
                      <div key={i} className="flex gap-3 bg-emerald-50 group-hover:bg-emerald-100 p-4 rounded-2xl transition-colors">
                         <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} />
                         </div>
                         <p className="text-xs text-emerald-900 font-medium">{s}</p>
                      </div>
                   ))}
                </div>
             </section>

             <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                   <AlertCircle size={12} className="text-orange-500" /> Gramática e Erros
                </h3>
                <div className="bg-orange-50 p-5 rounded-[32px] border border-orange-100">
                   <p className="text-xs text-orange-900 leading-relaxed font-medium">{feedback.grammarFeedback}</p>
                </div>
             </section>

             <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                   <Sparkles size={12} className="text-primary" /> Sugestões de Vocabulário
                </h3>
                <div className="flex flex-wrap gap-2">
                   {feedback.vocabularySuggestions.map((v, i) => (
                      <div key={i} className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-[10px] font-bold border border-primary/10">
                        {v}
                      </div>
                   ))}
                </div>
             </section>

             <button 
               onClick={() => {
                 setFeedback(null);
                 setText('');
               }}
               className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
             >
               NOVO TEXTO
             </button>
          </motion.div>
        )}
      </div>

      {/* Persistence / AD CTA */}
      {!feedback && (
        <footer className="p-6 bg-gray-50 border-t">
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100">
             <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <BarChart3 size={20} />
             </div>
             <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-700">Histórico de Redações</p>
                <p className="text-[8px] text-gray-400 uppercase tracking-widest">Desbloqueado com 1 vídeo</p>
             </div>
             <button 
               onClick={onEarnCredits}
               className="px-3 py-1.5 bg-indigo-600 text-white text-[8px] font-bold rounded-lg uppercase active:scale-95 transition-all"
             >
               VER
             </button>
          </div>
        </footer>
      )}
    </motion.div>
  );
}
