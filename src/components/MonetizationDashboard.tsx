import { BarChart3, TrendingUp, Users, Smartphone, ShieldCheck } from 'lucide-react';

export default function MonetizationDashboard({ onClose }: { onClose: () => void }) {
  const stats = [
    { label: 'Impressões Totais', value: '1.2k', change: '+12%', icon: Users },
    { label: 'ECPM Médio', value: '$2.45', change: '+5%', icon: TrendingUp },
    { label: 'Rewarded Video (Completos)', value: '450', change: '+22%', icon: Smartphone },
    { label: 'Ads Interstitials', value: '890', change: '-3%', icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 bg-white z-[500] flex flex-col max-w-md mx-auto">
      <header className="p-6 bg-slate-900 text-white flex justify-between items-center">
         <h2 className="text-xl font-bold flex items-center gap-2">
           <ShieldCheck className="text-green-400" /> Painel de Monetização (InMobi)
         </h2>
         <button onClick={onClose} className="opacity-60">X</button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
         <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                 <s.icon className="text-slate-400 w-5 h-5" />
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                 </div>
                 <span className={s.change.startsWith('+') ? "text-[10px] text-green-500 font-bold" : "text-[10px] text-red-500 font-bold"}>
                   {s.change} vs ontem
                 </span>
              </div>
            ))}
         </div>

         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuração app-ads.txt</h3>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-mono">inmobi.com, 123456, DIRECT...</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
               </div>
               <p className="text-[10px] text-slate-400 italic">Status: Verificado e ativo no domínio oficial.</p>
            </div>
         </div>

         <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest text-center">Simulador de Eventos</h3>
            <div className="grid gap-2">
               <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-bold">DISPARAR INTERSTITIAL</button>
               <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-bold">DISPARAR REWARDED (SUCESSO)</button>
               <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-bold">DISPARAR REWARDED (FALHA)</button>
            </div>
         </div>
      </div>
    </div>
  );
}
