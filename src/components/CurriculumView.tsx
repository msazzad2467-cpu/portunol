import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  ChevronRight, 
  Star, 
  Trophy, 
  Award, 
  Map as MapIcon,
  Compass,
  Flag,
  Sparkles,
  Zap,
  Coins,
  ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Module, Level } from '../types';
import { CONFIG } from '../config';

interface CurriculumViewProps {
  modules: Module[];
  onModuleSelect: (module: Module) => void;
  userLevel?: Level;
  userCredits: number;
  onUnlockModule: (moduleId: string) => void;
}

const LEVEL_THEMES: Record<Level, { color: string, bg: string, text: string, icon: any }> = {
  'A1': { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: MapIcon },
  'A2': { color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', icon: Compass },
  'B1': { color: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600', icon: Sparkles },
  'B2': { color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', icon: Award },
  'C1': { color: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', icon: Flag },
  'C2': { color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600', icon: Trophy },
};

export default function CurriculumView({ modules, onModuleSelect, userCredits, onUnlockModule }: CurriculumViewProps) {
  const [unlockingModule, setUnlockingModule] = useState<Module | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const levels: Level[] = ['A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].filter((v, i, a) => a.indexOf(v) === i) as Level[];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockRequest = (e: React.MouseEvent, module: Module) => {
    e.stopPropagation();
    if (module.isLocked) {
      setUnlockingModule(module);
    }
  };

  const confirmUnlock = () => {
    if (unlockingModule && userCredits >= CONFIG.iaCredits.skipModuleCost) {
      onUnlockModule(unlockingModule.id);
      setUnlockingModule(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-2 flex justify-around items-center">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => {
              const el = document.getElementById(`section-${level}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
              LEVEL_THEMES[level].color,
              "text-white shadow-lg shadow-current/20 hover:scale-110 active:scale-95"
            )}
          >
            {level}
          </button>
        ))}
        <div className="h-8 w-px bg-gray-100 mx-2" />
        <div className="bg-primary/10 px-3 py-2 rounded-full flex items-center gap-2">
          <Zap size={14} className="text-primary fill-primary" />
          <span className="text-xs font-bold text-primary">{userCredits}</span>
        </div>
      </div>

      <header className="p-8 space-y-2 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <MapIcon size={120} />
        </div>
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest relative z-10">
          <Sparkles size={12} /> Jornada de Aprendizado
        </div>
        <h1 className="text-4xl font-display font-bold relative z-10">Seu Mapa</h1>
        <p className="text-gray-400 text-sm relative z-10">Conclua os módulos ou desbloqueie-os com créditos.</p>
      </header>

      <div className="p-6">
        {levels.map((level, levelIdx) => {
          const levelModules = modules.filter(m => m.level === level);
          const theme = LEVEL_THEMES[level];
          const Icon = theme.icon;

          return (
            <section key={level} id={`section-${level}`} className="mb-20 last:mb-0">
              <div className="flex items-center gap-4 mb-12">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-current/20 rotate-3", theme.color)}>
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display">Nível {level}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    {levelIdx === 0 ? 'Iniciante' : levelIdx === 1 ? 'Básico' : levelIdx === 2 ? 'Independente' : levelIdx === 3 ? 'Avançado' : 'Especialista'}
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col items-center">
                <div className="space-y-12 w-full">
                  {levelModules.map((module, idx) => {
                    const offset = Math.sin(idx * 1.5) * 60;
                    const isUnlocked = !module.isLocked;

                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ x: offset }}
                        className="flex flex-col items-center"
                      >
                        <div
                          onClick={() => !module.isLocked && onModuleSelect(module)}
                          className={cn(
                            "group relative flex flex-col items-center",
                            !module.isLocked && "cursor-pointer"
                          )}
                        >
                          {/* Main Circle Node */}
                          <div className={cn(
                            "w-20 h-20 rounded-[32px] flex items-center justify-center shadow-lg transition-all active:scale-90 relative z-10",
                            module.isLocked 
                              ? "bg-gray-200 border-gray-300 text-gray-400" 
                              : cn(theme.color, "text-white shadow-current/20")
                          )}>
                            {module.isLocked ? (
                              <button 
                                onClick={(e) => handleUnlockRequest(e, module)}
                                className="flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity"
                              >
                                <Lock size={20} />
                                <div className="text-[8px] font-bold mt-1 flex items-center gap-0.5">
                                  <Zap size={8} fill="currentColor" /> {CONFIG.iaCredits.skipModuleCost}
                                </div>
                              </button>
                            ) : module.completion === 100 ? (
                              <Star size={32} className="fill-current" />
                            ) : (
                              <span className="text-xl font-bold">{idx + 1}</span>
                            )}
                          </div>

                          {/* Connection logic visual */}
                          {idx < levelModules.length - 1 && (
                            <div className="absolute top-full h-12 flex flex-col items-center gap-1 opacity-20 -z-10">
                               <div className="w-1 h-3 bg-gray-400 rounded-full" />
                               <div className="w-1 h-3 bg-gray-400 rounded-full" />
                            </div>
                          )}
                          
                          {/* ALWAYS SHOW NAME (The user request) */}
                          <div className={cn(
                            "mt-3 text-center transition-all",
                            module.isLocked ? "text-gray-400 opacity-60" : "text-gray-900"
                          )}>
                            <h4 className="font-bold text-[10px] uppercase tracking-wider leading-tight max-w-[100px] line-clamp-2">
                              {module.title}
                            </h4>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Return to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            onClick={scrollToTop}
            className="fixed bottom-36 right-6 w-12 h-12 bg-white text-primary rounded-full shadow-2xl border border-primary/10 flex items-center justify-center z-[60] active:scale-95 transition-all"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Unlock Confirmation Modal */}
      <AnimatePresence>
        {unlockingModule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Coins size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Desbloquear Módulo?</h3>
                <p className="text-gray-500 text-sm italic">
                  "{unlockingModule.title}"
                </p>
                <p className="text-gray-400 text-xs">
                  Este módulo custa <strong>{CONFIG.iaCredits.skipModuleCost} créditos</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={confirmUnlock}
                  disabled={userCredits < CONFIG.iaCredits.skipModuleCost}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Coins size={18} /> {userCredits < CONFIG.iaCredits.skipModuleCost ? 'CRÉDITOS INSUFICIENTES' : 'DESBLOQUEAR AGORA'}
                </button>
                <button
                  onClick={() => setUnlockingModule(null)}
                  className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold"
                >
                  MAIS TARDE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-100/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-3/4 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
