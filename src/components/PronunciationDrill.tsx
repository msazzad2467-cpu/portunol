import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { aiService } from '../services/aiService';
import { Mic, RotateCcw, CheckCircle2, AlertCircle, Loader2, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface PronunciationDrillProps {
  targetPhrase: string;
  onSuccess?: () => void;
}

export const PronunciationDrill: React.FC<PronunciationDrillProps> = ({ 
  targetPhrase, 
  onSuccess 
}) => {
  const { isListening, transcript, error, listen, isSupported } = useSpeechRecognition();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    if (transcript && !isListening) {
      handleEvaluate();
    }
  }, [transcript, isListening]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const data = await aiService.evaluatePronunciation(transcript, targetPhrase);
      setEvaluation(data);
      if (data.score >= 90 && onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return (
      <div className="p-8 bg-red-50 rounded-[2rem] text-center space-y-4">
        <AlertCircle size={40} className="text-red-500 mx-auto" />
        <p className="text-sm font-bold text-red-700">Seu navegador não suporta reconhecimento de voz. Use Chrome.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-indigo-50 space-y-8 flex flex-col items-center">
      <div className="space-y-4 text-center w-full">
        <div className="flex items-center justify-between">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Atividade Oral</span>
           <button onClick={speak} className="text-indigo-600 hover:scale-110 transition-transform">
             <Volume2 size={20} />
           </button>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          "{targetPhrase}"
        </h2>
      </div>

      <div className="py-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={listen}
          disabled={isListening || isEvaluating}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative",
            isListening ? "bg-red-500 shadow-red-200" : "bg-indigo-600 shadow-indigo-200"
          )}
        >
          {isListening ? (
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-red-400 rounded-full opacity-40"
            />
          ) : null}
          {isEvaluating ? <Loader2 size={32} className="animate-spin" /> : <Mic size={32} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {evaluation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6 pt-6 border-t border-gray-50"
          >
            {/* Score Ring */}
            <div className="flex items-center gap-4">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                    <motion.circle 
                      cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                      strokeDasharray={176}
                      initial={{ strokeDashoffset: 176 }}
                      animate={{ strokeDashoffset: 176 - (176 * evaluation.score / 100) }}
                      className="text-indigo-600"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-indigo-600">{evaluation.score}%</span>
               </div>
               <div className="flex-1">
                  <h4 className="text-sm font-black text-gray-900">Resultado da Análise</h4>
                  <p className="text-[10px] text-gray-500 font-medium">{evaluation.encouragement}</p>
               </div>
            </div>

            {/* Error List */}
            {evaluation.errors.length > 0 && (
              <div className="space-y-3">
                {evaluation.errors.map((err: any, idx: number) => (
                  <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xs font-black shrink-0">
                      {err.phoneme}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-amber-900">"{err.mistake}"</p>
                      <p className="text-[10px] text-amber-700 font-medium">{err.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {evaluation.score >= 85 && (
              <div className="flex items-center justify-center gap-2 text-green-500 py-2">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Pronúncia Excelente!</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!evaluation && !isListening && (
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
          Toque para começar a gravar
        </p>
      )}
    </div>
  );
};
