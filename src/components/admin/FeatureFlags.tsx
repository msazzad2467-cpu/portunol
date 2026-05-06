import React from 'react';
import { motion } from 'motion/react';
import { FeatureFlags as Flags } from '../../types';
import { Power, ShieldAlert, Cpu, Share2, Music, Search, Construction } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FeatureFlagsProps {
  flags: Flags;
  onToggle: (flag: keyof Flags, value: boolean) => void;
}

export const FeatureFlags: React.FC<FeatureFlagsProps> = ({ flags, onToggle }) => {
  const flagConfig: { key: keyof Flags; label: string; icon: any }[] = [
    { key: 'srsEnabled', label: 'Spaced Repetition (SRS)', icon: Cpu },
    { key: 'conversationTutorEnabled', label: 'AI Conversation Tutor', icon: Share2 },
    { key: 'leaguesEnabled', label: 'Weekly XP Leagues', icon: Music },
    { key: 'pronunciationDrillEnabled', label: 'Pronunciation Drill', icon: Search },
    { key: 'portunholDetectorEnabled', label: 'Portunhol Detector', icon: ShieldAlert },
    { key: 'adsEnabled', label: 'Monetization (Ads)', icon: Power },
    { key: 'maintenanceMode', label: 'Maintenance Mode', icon: Construction },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {flagConfig.map((item) => {
        const isActive = flags[item.key];
        const Icon = item.icon;
        
        return (
          <div key={item.key} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                isActive ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-400"
              )}>
                <Icon size={24} />
              </div>
              <span className="text-sm font-bold text-gray-900">{item.label}</span>
            </div>
            
            <button
              onClick={() => onToggle(item.key, !isActive)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors",
                isActive ? "bg-indigo-600" : "bg-gray-200"
              )}
            >
              <motion.div
                animate={{ x: isActive ? 24 : 2 }}
                className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};
