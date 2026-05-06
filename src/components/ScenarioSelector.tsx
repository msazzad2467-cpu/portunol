import React from 'react';
import { motion } from 'motion/react';
import { CONFIG } from '../config';
import { ChefHat, Briefcase, Stethoscope, Hotel, GraduationCap, ArrowRight } from 'lucide-react';

interface ScenarioSelectorProps {
  onSelect: (scenarioId: string) => void;
  disabled?: boolean;
}

const scenarioIcons: Record<string, any> = {
  restaurante: ChefHat,
  entrevista: Briefcase,
  medico: Stethoscope,
  hotel: Hotel,
  universidade: GraduationCap
};

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {CONFIG.scenarios.map((scenario, idx) => {
        const Icon = scenarioIcons[scenario.id] || Briefcase;
        return (
          <motion.button
            key={scenario.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(scenario.id)}
            disabled={disabled}
            className="group flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all text-left disabled:opacity-50"
          >
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Icon size={28} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-black text-gray-900 tracking-tight">{scenario.name}</h4>
              <p className="text-xs text-gray-500 font-medium">{scenario.description}</p>
            </div>
            <div className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">
              <ArrowRight size={20} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
