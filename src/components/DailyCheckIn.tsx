import { motion } from 'motion/react';
import { Calendar, Gift, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DailyCheckIn({ streak, lastCheckIn, onCheckIn }: any) {
  const days = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  const rewards = ['50 XP', '100 XP', '1 Crédito IA', '200 XP', '1 Voucher Exame', '300 XP', 'Báu Lendário'];
  
  const today = new Date().toISOString().split('T')[0];
  const isCheckedInToday = lastCheckIn === today;

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-6 space-y-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Check-in Diário</h3>
           <p className="font-display font-bold text-xl">Streak: {streak} dias</p>
        </div>
        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
           <Zap size={24} className="fill-current" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isActive = i < streak;
          const isToday = i === streak % 7 && !isCheckedInToday;
          
          return (
            <div key={day} className="flex flex-col items-center gap-1">
               <div className={cn(
                 "w-full aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all",
                 isActive ? "bg-primary text-white" : isToday ? "bg-orange-100 text-orange-600 border border-orange-200 animate-pulse" : "bg-gray-50 text-gray-300"
               )}>
                 {isActive ? <CheckCircle2 size={12} /> : day}
               </div>
               <span className="text-[8px] font-bold text-gray-400">{i === 6 ? '🎁' : `+${(i + 1) * 10}XP`}</span>
            </div>
          );
        })}
      </div>

      {!isCheckedInToday ? (
        <button 
          onClick={onCheckIn}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          COLETAR RECOMPENSA DE HOJE
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm py-4">
           <CheckCircle2 size={18} /> Recompensa Coletada!
        </div>
      )}
    </div>
  );
}
