import { motion } from 'motion/react';
import { Activity, ShieldCheck, Zap, BarChart3, ArrowLeft, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { adPolicy } from '../lib/AdPolicyManager';
import { useState } from 'react';

export default function DebugMonetizationView({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState(adPolicy.getDebugStats());

  const handleRefresh = () => {
    setStats(adPolicy.getDebugStats());
  };

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-slate-900 z-[500] flex flex-col max-w-md mx-auto text-white"
    >
      <header className="p-6 border-b border-white/10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 -ml-2 text-white/40"><ArrowLeft /></button>
            <h2 className="text-xl font-bold">Monetização Debug</h2>
         </div>
         <button onClick={handleRefresh} className="text-primary"><RefreshCw size={20} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
         <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-white/40 uppercase tracking-widest">
               <span>InMobi SDK Status</span>
               <ShieldCheck className="text-green-500" size={16} />
            </div>
            <p className="text-2xl font-display font-bold">Iniciado / OK</p>
            <div className="pt-4 border-t border-white/5 space-y-2">
               <div className="flex justify-between text-xs">
                  <span className="text-white/40">Interstitial Caps</span>
                  <span>{stats.interstitialCount} / 10 ao dia</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-white/40">Rewarded Caps</span>
                  <span>{stats.rewardedCount} / 25 ao dia</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <DebugStat icon={BarChart3} label="eCPM Est." value="$14.20" />
            <DebugStat icon={Zap} label="Fill Rate" value="98.4%" />
         </div>

         <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Políticas Ativas (In-App)</h3>
            <div className="space-y-2">
               <PolicyRow label="No ADS no primeiro minuto" active />
               <PolicyRow label="3 min entre Interstitials" active />
               <PolicyRow label="10 min entre Rewarded Bonus" active={false} />
            </div>
         </div>

         <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3">
            <AlertCircle className="text-orange-500 shrink-0" size={20} />
            <p className="text-[10px] text-orange-200 leading-tight">
               Este painel é apenas para desenvolvedores e QA. Verifique app-ads.txt no domínio principal para autorização de rede.
            </p>
         </div>

         <button 
           onClick={() => {
             // Dispatch a custom event or use a state passed down. 
             // Since we are already in Debug view, and only admins can see it,
             // we'll trigger a state change in App.tsx by exposing it.
             window.dispatchEvent(new CustomEvent('open-admin-config'));
           }}
           className="w-full py-4 bg-primary/20 text-primary font-bold border border-primary/40 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
         >
           <Settings size={16} /> Configurações Globais (DB)
         </button>

         <button 
           onClick={() => {
             localStorage.clear();
             window.location.reload();
           }}
           className="w-full py-4 text-red-400 font-bold border border-red-400/20 rounded-2xl text-xs uppercase tracking-widest"
         >
           Resetar Política de Anúncios
         </button>
      </div>
      
      <div className="p-6 text-center text-[10px] text-white/20 uppercase font-bold tracking-widest">
        Portunol IA Build Ver. 1.0.4-PROD
      </div>
    </motion.div>
  );
}

function DebugStat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-1">
       <Icon size={16} className="text-primary" />
       <p className="text-[10px] text-white/40 uppercase font-bold">{label}</p>
       <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function PolicyRow({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
       <span className="text-xs text-white/70">{label}</span>
       <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 box-shadow-green' : 'bg-red-500'}`} />
    </div>
  );
}
