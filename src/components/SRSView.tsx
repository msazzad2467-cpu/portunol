import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ArrowLeft, Brain, ChevronRight, Check, X, Volume2 } from 'lucide-react';
import { SRSItem } from '../types';
import { audioService } from '../services/audioService';

interface SRSViewProps {
  items: SRSItem[];
  onClose: () => void;
  onReview: (id: string, success: boolean) => void;
}

export default function SRSView({ items, onClose, onReview }: SRSViewProps) {
  const dueItems = items.filter(item => item.nextReview <= Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentItem = dueItems[currentIndex];

  const handleReview = (success: boolean) => {
    onReview(currentItem.id, success);
    setShowAnswer(false);
    if (currentIndex < dueItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(-1); // Finished
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4 bg-primary text-white">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Revisão Inteligente (SRS)</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center space-y-8">
        {currentIndex !== -1 && currentItem ? (
          <>
            <motion.div 
               key={currentItem.id}
               className="w-full aspect-square max-w-[300px] perspective-1000"
               onClick={() => setShowAnswer(true)}
            >
              <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${showAnswer ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 bg-white border-4 border-primary/20 rounded-[48px] flex flex-col items-center justify-center p-8 text-center backface-hidden shadow-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">ESPANHOL</span>
                  <p className="text-4xl font-bold text-gray-800 font-display leading-tight">{currentItem.es}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); audioService.speak(currentItem.es); }}
                    className="mt-4 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-all active:scale-90"
                  >
                    <Volume2 size={20} />
                  </button>
                  <p className="text-xs text-gray-400 mt-4">Toque para ver a tradução</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-primary border-4 border-white rounded-[48px] flex flex-col items-center justify-center p-8 text-center backface-hidden rotate-y-180 shadow-2xl text-white">
                   <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">PORTUGUÊS</span>
                   <p className="text-4xl font-bold font-display leading-tight">{currentItem.pt}</p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 w-full max-w-[300px]"
                >
                  <button 
                    onClick={() => handleReview(false)}
                    className="flex-1 bg-red-50 text-red-500 py-6 rounded-3xl font-bold shadow-lg shadow-red-100 border-2 border-red-100 flex flex-col items-center gap-2 group active:scale-95 transition-all"
                  >
                    <X /> ESQUECI
                  </button>
                  <button 
                    onClick={() => handleReview(true)}
                    className="flex-1 bg-green-50 text-green-500 py-6 rounded-3xl font-bold shadow-lg shadow-green-100 border-2 border-green-100 flex flex-col items-center gap-2 group active:scale-95 transition-all"
                  >
                    <Check /> LEMBREI
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="text-sm font-bold text-gray-300">
               CARTÃO {currentIndex + 1} DE {dueItems.length}
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 max-w-[280px]">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-inner">
                <Brain size={48} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display">Tudo revisado!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Você está em dia com seus estudos. Volte amanhã para novas revisões.</p>
             </div>
             <button
               onClick={onClose}
               className="w-full bg-primary text-white py-5 rounded-3xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform"
             >
               Voltar para o Início
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
