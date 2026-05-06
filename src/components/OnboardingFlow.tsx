import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Target, 
  Clock, 
  Globe, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Plane,
  Briefcase,
  GraduationCap,
  Layout,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Level, UserProfile } from '../types';
import { INITIAL_PROFILE } from '../services/userService';
import { cn } from '../lib/utils';
import PlacementTest from './PlacementTest';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [showPlacement, setShowPlacement] = useState(false);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  if (showPlacement) {
    return (
      <PlacementTest 
        onCancel={() => setShowPlacement(false)}
        onComplete={(level) => {
          onComplete({ ...profile, currentLevel: level as Level, onboardingComplete: true, placementComplete: true });
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Progress Header */}
      <div className="p-6 flex items-center gap-2">
         {[1, 2, 3].map(i => (
           <div key={i} className={cn("h-1.5 flex-1 rounded-full bg-gray-100 transition-all duration-500", step >= i ? "bg-primary" : "bg-gray-100")} />
         ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 space-y-12"
          >
             <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                   <User size={32} />
                </div>
                <h1 className="text-3xl font-display font-bold">Cómo te llamas?</h1>
                <p className="text-gray-500">Vamos a personalizar sua experiência. Qual nome você gostaria de usar no Portunol?</p>
             </div>
             
             <div className="space-y-4">
               <input 
                 value={profile.name}
                 onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                 placeholder="Seu nome"
                 className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
               />
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Isso será exibido no seu perfil e tutor IA</p>
             </div>

             <div className="pt-12">
                <button 
                  disabled={!profile.name.trim()}
                  onClick={next}
                  className="w-full bg-primary text-white py-6 rounded-[32px] font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  Continuar
                </button>
             </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 space-y-12 overflow-y-auto"
          >
             <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold">Quais seus objetivos?</h1>
                <p className="text-gray-500">Isso ajuda a IA a selecionar as melhores lições para você.</p>
             </div>

             <div className="grid gap-3">
                <GoalOption 
                  icon={Plane} 
                  title="Viagens" 
                  selected={profile.goalType === 'travel'} 
                  onClick={() => setProfile({ ...profile, goalType: 'travel' })}
                />
                <GoalOption 
                  icon={Briefcase} 
                  title="Trabalho / Carreira" 
                  selected={profile.goalType === 'work'} 
                  onClick={() => setProfile({ ...profile, goalType: 'work' })}
                />
                <GoalOption 
                  icon={GraduationCap} 
                  title="Exame DELE / SIELE" 
                  selected={profile.goalType === 'exam'} 
                  onClick={() => setProfile({ ...profile, goalType: 'exam', examTarget: 'DELE' })}
                />
                <GoalOption 
                  icon={Zap} 
                  title="Geral / Curiosidade" 
                  selected={profile.goalType === 'general'} 
                  onClick={() => setProfile({ ...profile, goalType: 'general' })}
                />
             </div>

             <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Meta Diária</h3>
                <div className="flex gap-2">
                   {[10, 15, 30].map(m => (
                     <button 
                       key={m}
                       onClick={() => setProfile({ ...profile, dailyGoalMinutes: m })}
                       className={cn(
                        "flex-1 py-4 rounded-2xl border font-bold text-sm transition-all",
                        profile.dailyGoalMinutes === m ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-gray-100 text-gray-400"
                       )}
                     >
                       {m} min
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex gap-4 pt-4 pb-8">
                <button onClick={back} className="w-20 h-16 bg-gray-50 text-gray-400 rounded-[28px] flex items-center justify-center"><ChevronLeft /></button>
                <button onClick={next} className="flex-1 bg-primary text-white py-4 rounded-[28px] font-bold text-lg shadow-xl shadow-primary/20">Continuar</button>
             </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-8 space-y-12"
          >
             <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold">Qual seu nível atual?</h1>
                <p className="text-gray-500">Seja sincero para que possamos começar do lugar certo.</p>
             </div>

             <div className="grid gap-4">
                <button 
                  onClick={() => setShowPlacement(true)}
                  className="p-8 bg-slate-900 text-white rounded-[40px] text-left space-y-4 relative overflow-hidden group shadow-2xl shadow-indigo-200"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <Sparkles size={100} />
                   </div>
                   <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg"><Zap fill="currentColor" /></div>
                   <div>
                      <h4 className="text-xl font-bold">Fazer Teste de Nível</h4>
                      <p className="text-xs text-white/50 leading-relaxed max-w-[80%]">Recomendado. Descubra seu nível real de A1 a C2 em 15 minutos.</p>
                   </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => onComplete({ ...profile, currentLevel: 'A1', onboardingComplete: true })}
                     className="p-6 bg-white border border-gray-100 rounded-[32px] text-center space-y-2 active:scale-95 transition-all shadow-sm"
                   >
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={20} /></div>
                      <div>
                         <p className="font-bold">Soy novo</p>
                         <p className="text-[10px] text-gray-400">Começar do A1</p>
                      </div>
                   </button>
                   <button 
                     onClick={() => setStep(4)}
                     className="p-6 bg-white border border-gray-100 rounded-[32px] text-center space-y-2 active:scale-95 transition-all shadow-sm"
                   >
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto"><Layout size={20} /></div>
                      <div>
                         <p className="font-bold">Escolher</p>
                         <p className="text-[10px] text-gray-400">A1 até C2</p>
                      </div>
                   </button>
                </div>
             </div>
             
             <button onClick={back} className="w-full py-4 text-gray-400 font-bold text-sm uppercase tracking-widest">Voltar</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-8 space-y-8"
          >
             <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Escolha seu Nível</h1>
                <p className="text-sm text-gray-500">Você pode mudar isso depois no perfil.</p>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lv => (
                  <button 
                    key={lv}
                    onClick={() => onComplete({ ...profile, currentLevel: lv as Level, onboardingComplete: true })}
                    className="p-6 bg-white border border-gray-100 rounded-3xl font-display font-bold text-2xl hover:border-primary hover:text-primary transition-all active:scale-95"
                  >
                    {lv}
                  </button>
                ))}
             </div>
             <button onClick={() => setStep(3)} className="w-full py-4 text-gray-400 font-bold text-sm">Voltar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GoalOption({ icon: Icon, title, selected, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 rounded-3xl border flex items-center gap-5 transition-all active:scale-[0.98] shadow-sm",
        selected ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" : "bg-white border-gray-50 text-gray-900"
      )}
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", selected ? "bg-white/20" : "bg-gray-50 text-primary")}>
        <Icon size={24} />
      </div>
      <span className="font-bold text-sm">{title}</span>
    </button>
  );
}
