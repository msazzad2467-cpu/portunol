import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';
import { AlertTriangle, Sparkles, BookCheck, Info, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { debounce } from 'lodash';

export const PortunholDetector: React.FC = () => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  const analyzeText = useCallback(
    debounce(async (val: string) => {
      if (val.length < 10) {
        setErrors([]);
        return;
      }
      setIsAnalyzing(true);
      try {
        const foundErrors = await aiService.detectPortunhol(val);
        setErrors(foundErrors);
      } catch (e) {
        console.error(e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500),
    []
  );

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const val = e.currentTarget.innerText;
    setText(val);
    analyzeText(val);
  };

  const getScoreUI = () => {
    const count = errors.length;
    if (count === 0) return { label: 'Español Puro', color: 'bg-green-500' };
    if (count <= 2) return { label: 'Cuidado', color: 'bg-yellow-500' };
    if (count <= 5) return { label: 'Portunhol Detectado', color: 'bg-orange-500' };
    return { label: 'Alerta Máximo', color: 'bg-red-500' };
  };

  const score = getScoreUI();

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 bg-gray-50 overflow-y-auto pb-32">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          Detector de Portunhol <Sparkles className="text-amber-500" />
        </h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
          Escreva livremente e receba alertas em tempo real
        </p>
      </div>

      {/* Score Badge */}
      <motion.div 
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
           <div className={cn("w-3 h-3 rounded-full", score.color)} />
           <span className="text-lg font-black text-gray-900 tracking-tight">{score.label}</span>
        </div>
        <div className="bg-gray-50 px-3 py-1 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
           {errors.length} Erros
        </div>
      </motion.div>

      {/* Writing Area */}
      <div className="relative group">
        <div 
          ref={editableRef}
          contentEditable
          onInput={handleInput}
          placeholder="Escriba aquí..."
          className="w-full min-h-[250px] p-6 bg-white rounded-[2rem] border-2 border-gray-100 focus:border-indigo-400 focus:ring-0 transition-all text-sm font-medium leading-relaxed outline-none shadow-sm empty:before:content-[attr(placeholder)] empty:before:text-gray-300 empty:before:italic"
        />
        {isAnalyzing && (
           <div className="absolute top-4 right-4 text-indigo-500">
             <Loader2 size={16} className="animate-spin" />
           </div>
        )}
      </div>

      {/* Error List */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest px-2">Análise de Interferência</h3>
        <AnimatePresence mode="popLayout">
          {errors.length === 0 && !isAnalyzing && text.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-50 border border-green-100 rounded-[2rem] text-center space-y-3"
            >
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                 <BookCheck size={24} />
               </div>
               <p className="text-xs text-green-700 font-bold">Excelente! Não detectamos padrões de portunhol.</p>
            </motion.div>
          )}

          {errors.map((error, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex gap-4"
            >
               <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-500 strike-through line-through">"{error.word_written}"</span>
                    <span className="text-gray-300">→</span>
                    <span className="text-sm font-bold text-green-600">{error.correct_spanish}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    {error.explanation_ptbr}
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-50 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded">
                    {error.error_type}
                  </span>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 flex gap-3 pointer-events-none">
         <button 
           onClick={() => { setText(''); if(editableRef.current) editableRef.current.innerText = ''; setErrors([]); }}
           className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-xl pointer-events-auto active:scale-95 transition-all"
         >
           <Trash2 size={20} />
         </button>
         <button 
           disabled={errors.length === 0 || isCorrecting}
           className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-100 pointer-events-auto active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
         >
           {isCorrecting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
           <span>Corrigir Portunhol</span>
         </button>
      </div>
    </div>
  );
};
