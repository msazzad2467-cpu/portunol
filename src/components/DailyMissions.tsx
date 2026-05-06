import { CheckCircle2, Circle, Target, Gift } from 'lucide-react';
import { cn } from '../lib/utils';
import { Mission } from '../types';

export default function DailyMissions({ missions, onEarnReward }: { missions: Mission[], onEarnReward: () => void }) {
  const completedCount = missions.filter(m => m.completed).length;
  const progress = (completedCount / missions.length) * 100;

  return (
    <div className="bg-slate-900 text-white rounded-[32px] p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Missões Diárias</h3>
           <p className="text-2xl font-display font-bold">{completedCount}/{missions.length} Concluídas</p>
        </div>
        <div className="text-right">
           <Gift size={24} className={cn("text-yellow-400 mb-2 transition-all", completedCount === missions.length && "animate-bounce scale-125")} />
        </div>
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-700" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {missions.map(mission => (
          <div key={mission.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
             {mission.completed ? (
               <CheckCircle2 className="text-green-400 shrink-0" size={18} />
             ) : (
               <Circle className="opacity-20 shrink-0" size={18} />
             )}
             <div className="flex-1">
                <p className={cn("text-xs font-bold", mission.completed && "opacity-40 line-through")}>
                  {mission.title}
                </p>
                <div className="flex justify-between items-center mt-1">
                   <div className="h-1 flex-1 bg-white/10 rounded-full mr-2">
                      <div 
                        className="h-full bg-white/30 rounded-full" 
                        style={{ width: `${(mission.count / mission.goal) * 100}%` }}
                      />
                   </div>
                   <span className="text-[10px] font-bold opacity-40">{mission.count}/{mission.goal}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {completedCount === missions.length && (
        <button 
          onClick={onEarnReward}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl animate-pulse"
        >
          ABRIR BAÚ DO DIA 🎁
        </button>
      )}
    </div>
  );
}
