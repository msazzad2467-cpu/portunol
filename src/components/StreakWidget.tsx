import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Shield, Coins, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

interface StreakWidgetProps {
  streak: number;
  shieldActive: boolean;
  coins: number;
  onActivateShield: () => void;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ 
  streak, 
  shieldActive, 
  coins, 
  onActivateShield 
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
            streak > 0 ? "bg-orange-500 text-white shadow-orange-200" : "bg-gray-100 text-gray-400"
          )}
        >
          <Flame size={24} fill={streak > 0 ? "currentColor" : "none"} />
        </motion.div>
        <div>
          <h4 className="text-xl font-black text-gray-900 tracking-tight">{streak} Dias</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
            {streak > 0 ? 'FOGO ACESO!' : 'COMECE HOJE'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {shieldActive ? (
            <motion.div 
              key="active"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-2 border border-indigo-100"
            >
              <Shield size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Protegido</span>
            </motion.div>
          ) : (
            <motion.button
              key="inactive"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={onActivateShield}
              disabled={coins < 50}
              className="px-3 py-2 bg-gray-50 text-gray-400 rounded-xl flex items-center gap-2 border border-white hover:border-gray-200 hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              <Shield size={16} />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">50</span>
                <Coins size={10} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
