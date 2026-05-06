import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { MasteryScores } from '../types';

interface SkillRadarChartProps {
  scores: MasteryScores;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ scores }) => {
  const data = [
    { subject: 'Leitura', A: scores.reading, fullMark: 100 },
    { subject: 'Escrita', A: scores.writing, fullMark: 100 },
    { subject: 'Gramática', A: scores.grammar, fullMark: 100 },
    { subject: 'Escuta', A: scores.listening, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[300px] flex items-center justify-center"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
