import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, SkipForward } from 'lucide-react';
import { CONFIG } from '../config';

interface AdProps {
  type: 'interstitial' | 'rewarded';
  onClose: () => void;
  onReward?: (rewardType?: string) => void;
  rewardType?: string;
}

export default function AdSimulation({ type, onClose, onReward, rewardType }: AdProps) {
  const [seconds, setSeconds] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    if (canClose) {
      if (type === 'rewarded' && onReward) onReward(rewardType);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="absolute top-6 right-6">
        <button 
          onClick={handleClose}
          className={cn(
            "p-3 rounded-full transition-all",
            canClose ? "bg-white text-black" : "bg-white/20 text-white/40"
          )}
        >
          {canClose ? "Fechar" : seconds}
        </button>
      </div>

      <div className="space-y-6">
        <div className="w-20 h-20 bg-primary mx-auto rounded-3xl flex items-center justify-center shadow-2xl">
          <Play className="w-10 h-10 fill-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Publicidade</h2>
          <p className="text-white/40 text-xs italic">Simulação de Vídeo Premiado</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-white/5 space-y-3">
           <p className="text-sm font-medium">Assista até o final para {type === 'rewarded' ? `receber sua recompensa de ${CONFIG.iaCredits.rewardAmount} créditos` : 'continuar seu treino'}.</p>
           <div className="h-1 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-primary"
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 5, ease: "linear" }}
             />
           </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 w-full px-8 text-[8px] opacity-20 font-bold uppercase tracking-[0.3em]">
         Premium Ad Network Simulation
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
