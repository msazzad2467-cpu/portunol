import { motion } from 'motion/react';
import { Zap, Sparkles, GraduationCap, Download, X, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { CONFIG } from '../config';

export default function CreditsStore({ onClose, onWatchAd, credits }: any) {
  const currentCoins = credits?.coins || 0;
  const items = [
    { id: 'ai', title: `${CONFIG.iaCredits.rewardAmount} Créditos IA`, desc: 'Para tutor e correções', icon: Sparkles, color: 'text-indigo-500 bg-indigo-50' },
    { id: 'exam', title: 'Simulado DELE/SIELE', desc: 'Desbloqueia um set completo', icon: GraduationCap, color: 'text-purple-500 bg-purple-50' },
    { id: 'boost', title: 'Dobro de XP (30min)', desc: 'Acelere seu progresso', icon: Zap, color: 'text-orange-500 bg-orange-50' },
    { id: 'offline', title: 'Pack Offline', desc: 'Baixe lições para viajar', icon: Download, color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-white z-[1000] flex flex-col max-w-md mx-auto"
    >
      <header className="p-6 border-b flex justify-between items-center text-left">
         <div>
            <h1 className="text-xl font-bold">Loja de Recompensas</h1>
            <p className="text-xs text-gray-400">Troque anúncios por utilidades</p>
         </div>
         <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <X size={20} />
         </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
         <div className="bg-slate-900 text-white p-8 rounded-[40px] text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-3xl mx-auto flex items-center justify-center">
               <Zap className="text-yellow-400 fill-current" size={32} />
            </div>
            <div>
               <p className="text-4xl font-display font-bold">{currentCoins}</p>
               <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Suas Moedas Atuais</p>
            </div>
         </div>

         <div className="grid gap-4">
            {items.map(item => (
              <div key={item.id} className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", item.color)}>
                    <item.icon size={28} />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                 </div>
                 <button 
                   onClick={() => onWatchAd(item.id)}
                   className="bg-primary text-white p-3 rounded-2xl flex items-center gap-2 active:scale-95 transition-all"
                 >
                    <Play size={16} className="fill-current" />
                    <span className="text-xs font-bold">GANHAR</span>
                 </button>
              </div>
            ))}
         </div>

         <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl space-y-2">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Dica</p>
            <p className="text-sm text-orange-900 leading-relaxed">
              O Portunol IA é 100% gratuito graças aos anúncios. Cada vídeo assistido apoia o desenvolvimento de novos conteúdos!
            </p>
         </div>
      </div>
    </motion.div>
  );
}
