import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlashCard } from './FlashCard';
import { useSRS } from '../hooks/useSRS';
import { calculateNextReview, srsService } from '../services/srsService';
import { Loader2, CheckCircle2, TrendingUp } from 'lucide-react';

interface SRSReviewProps {
  uid: string;
  onComplete: () => void;
}

export const SRSReview: React.FC<SRSReviewProps> = ({ uid, onComplete }) => {
  const { dueCards, loading, refresh } = useSRS(uid);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const currentCard = useMemo(() => dueCards[currentIdx], [dueCards, currentIdx]);

  const handleRate = async (quality: number) => {
    if (!currentCard) return;

    const updates = calculateNextReview(currentCard, quality);
    await srsService.updateCard(uid, currentCard.id, updates);

    if (currentIdx < dueCards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinishing(true);
      setTimeout(onComplete, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-400 font-medium">Preparando seus cartões...</p>
      </div>
    );
  }

  if (dueCards.length === 0 || isFinishing) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6"
      >
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-green-100">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Tudo em dia!</h2>
          <p className="text-gray-500 max-w-[240px] leading-relaxed">
            Você revisou todos os cartões pendentes. Volte amanhã para mais!
          </p>
        </div>
        <button 
          onClick={onComplete}
          className="w-full max-w-[200px] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  const progress = ((currentIdx + 1) / dueCards.length) * 100;

  return (
    <div className="flex-1 p-6 flex flex-col space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Revisão Diária</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {currentIdx + 1} de {dueCards.length} cartões
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <TrendingUp size={20} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Card Stage */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full flex justify-center"
          >
            <FlashCard card={currentCard} onRate={handleRate} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-20" /> {/* Spacer */}
    </div>
  );
};
