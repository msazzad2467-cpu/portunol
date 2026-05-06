import React from 'react';
import { motion } from 'motion/react';

interface CEFRScoreBarProps {
  label: string;
  score: number; // 0-10
  color?: string;
}

export const CEFRScoreBar: React.FC<CEFRScoreBarProps> = ({ 
  label, 
  score, 
  color = "bg-indigo-600" 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        <span>{label}</span>
        <span className="text-gray-900">{score}/10</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};
