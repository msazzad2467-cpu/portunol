import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SRSCard } from '../types';
import { cn } from '../lib/utils';
import { HelpCircle, Languages, BookText } from 'lucide-react';

interface FlashCardProps {
  card: SRSCard;
  onRate: (quality: number) => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({ card, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-sm h-[450px] perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl border border-indigo-100 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
            <Languages size={24} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {card.front}
          </h2>
          <p className="text-gray-400 text-sm font-medium animate-pulse">
            Toque para revelar
          </p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl border border-indigo-100 flex flex-col p-8 text-left rotate-y-180">
          <div className="flex-1 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-500">
                <BookText size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tradução</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {card.back}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <HelpCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Exemplo</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic italic">
                "{card.example}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-50">
            <button
              onClick={(e) => { e.stopPropagation(); onRate(1); setIsFlipped(false); }}
              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
            >
              De Novo
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRate(3); setIsFlipped(false); }}
              className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              Bom
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRate(5); setIsFlipped(false); }}
              className="col-span-2 px-4 py-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
            >
              Fácil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
