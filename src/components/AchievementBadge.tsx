import React from 'react';
import { motion } from 'motion/react';
import { Achievement } from '../types';
import { cn } from '../lib/utils';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  onReveal?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, isUnlocked }) => {
  return (
    <div className="relative group perspective-1000">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-full aspect-square rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-all duration-500",
          isUnlocked 
            ? "bg-white shadow-xl shadow-indigo-100 border border-indigo-100" 
            : "bg-gray-50 border border-gray-100 opacity-60 grayscale"
        )}
      >
        <div className={cn(
          "text-4xl mb-2",
          !isUnlocked && "blur-[2px]"
        )}>
          {achievement.icon}
        </div>
        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
          {achievement.name}
        </h4>
        
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 backdrop-blur-[1px] rounded-3xl">
            <Lock size={16} className="text-gray-400" />
          </div>
        )}
      </motion.div>

      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-3 bg-gray-900 text-white rounded-xl text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
        <p className="leading-relaxed">{achievement.description}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};
