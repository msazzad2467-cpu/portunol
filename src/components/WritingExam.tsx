import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';
import { userService } from '../services/userService';
import { EvaluationResult } from './EvaluationResult';
import { Level, WritingEvaluation } from '../types';
import { Timer, Send, PenTool, Type, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface WritingExamProps {
  uid: string;
  level: Level;
  prompt: string;
  minWords: number;
  maxWords: number;
  duration: number; // minutes
  onComplete: () => void;
}

export const WritingExam: React.FC<WritingExamProps> = ({ 
  uid, 
  level, 
  prompt, 
  minWords, 
  maxWords, 
  duration,
  onComplete 
}) => {
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<WritingEvaluation | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  const handleFinish = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    try {
      const evaluation = await aiService.evaluateWriting(text, level);
      const evalWithText = { ...evaluation, originalText: text, id: Date.now().toString() };
      await userService.saveWritingEvaluation(uid, evalWithText);
      setResult(evalWithText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (result) {
    return <EvaluationResult evaluation={result} onClose={onComplete} />;
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const isWordCountValid = wordCount >= minWords && wordCount <= maxWords;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Header Info */}
      <header className="shrink-0 bg-white border-b border-gray-100 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <PenTool size={20} className="text-indigo-600" />
           <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Tarefa de Escrita</span>
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-full flex items-center gap-2 font-black text-xs transition-colors",
          timeLeft < 60 ? "bg-red-50 text-red-600 animate-pulse" : "bg-indigo-50 text-indigo-600"
        )}>
          <Timer size={14} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {/* Prompt Card */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
           <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Instruções</h3>
           <p className="text-sm text-gray-700 font-bold leading-relaxed">{prompt}</p>
        </div>

        {/* Text Area Container */}
        <div className="relative group">
           <textarea
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="Escriba aquí su respuesta..."
             className="w-full min-h-[300px] p-6 bg-white rounded-[2rem] border-2 border-gray-100 focus:border-indigo-400 focus:ring-0 transition-all text-sm font-medium leading-relaxed resize-none shadow-sm"
           />
           
           {/* Word Counter floating badge */}
           <div className={cn(
             "absolute bottom-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-1.5 transition-all group-focus-within:translate-y-[-4px]",
             wordCount === 0 ? "bg-gray-100 text-gray-400" :
             wordCount < minWords ? "bg-amber-50 text-amber-600" :
             wordCount > maxWords ? "bg-red-50 text-red-600" :
             "bg-green-50 text-green-600"
           )}>
             <Type size={12} />
             {wordCount} / {minWords}-{maxWords} palavras
           </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-transparent pointer-events-none">
         <button 
           onClick={handleFinish}
           disabled={text.length < 50 || isEvaluating}
           className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 pointer-events-auto active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
         >
           {isEvaluating ? (
             <>
               <Loader2 size={18} className="animate-spin" /> 
               <span>Avaliando...</span>
             </>
           ) : (
             <>
               <Send size={18} />
               <span>Finalizar Redação</span>
             </>
           )}
         </button>
      </div>
    </div>
  );
};
