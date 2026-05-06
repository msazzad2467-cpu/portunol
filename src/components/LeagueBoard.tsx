import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { leagueService } from '../services/leagueService';
import { LeagueEntry } from '../types';
import { Trophy, ArrowUp, ArrowDown, Minus, Crown, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LeagueBoardProps {
  uid: string;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
}

export const LeagueBoard: React.FC<LeagueBoardProps> = ({ uid, tier }) => {
  const [entries, setEntries] = useState<LeagueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeague = async () => {
      setLoading(true);
      const data = await leagueService.getLeaderboard(tier);
      setEntries(data);
      setLoading(false);
    };
    fetchLeague();
  }, [tier]);

  const userEntry = entries.find(e => e.uid === uid);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* League Header Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Sua Liga Atual</h2>
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Trophy size={24} /> {tier}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Reset em</p>
          <p className="text-sm font-bold">5 dias 12h</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.uid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "flex items-center gap-4 p-4",
              entry.uid === uid ? "bg-indigo-50/50" : ""
            )}
          >
            <div className="w-8 text-center font-black text-gray-300 text-sm">
              {idx + 1 === 1 ? <Crown size={16} className="text-amber-400 mx-auto" /> : idx + 1}
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg shadow-inner">
              {entry.avatar}
            </div>
            <div className="flex-1">
              <h4 className={cn(
                "text-sm font-bold tracking-tight",
                entry.uid === uid ? "text-indigo-600" : "text-gray-900"
              )}>
                {entry.name} {entry.uid === uid && "(Você)"}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entry.weeklyXP} XP</p>
            </div>
            <div className="flex items-center gap-1">
              {entry.trend === 'up' && <ArrowUp size={12} className="text-green-500" />}
              {entry.trend === 'down' && <ArrowDown size={12} className="text-red-500" />}
              {entry.trend === 'stable' && <Minus size={12} className="text-gray-300" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
