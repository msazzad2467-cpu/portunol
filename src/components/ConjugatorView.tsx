import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Volume2, Star, ChevronDown, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ConjugatorView({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const conjugation = searchTerm.toLowerCase() === 'hablar' ? {
    verb: 'HABLAR',
    translation: 'Falar',
    present: [
      { p: 'Yo', v: 'hablo' },
      { p: 'Tú', v: 'hablas' },
      { p: 'Él/Ella', v: 'habla' },
      { p: 'Nosotros', v: 'hablamos' },
      { p: 'Vosotros', v: 'habláis' },
      { p: 'Ellos', v: 'hablan' },
    ],
    past: [
      { p: 'Yo', v: 'hablé' },
      { p: 'Tú', v: 'hablaste' },
    ]
  } : null;

  return (
    <div className="fixed inset-0 bg-white z-[250] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4 bg-primary text-white">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Conjugador</h2>
      </header>

      <div className="p-6 space-y-4 bg-gray-50 border-b">
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Digite um verbo (ex: Hablar)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-[28px] focus:outline-none focus:ring-2 ring-primary/20"
            />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {conjugation ? (
          <div className="space-y-8">
            <div className="flex items-end gap-3 border-b-2 border-primary/10 pb-4">
               <div>
                 <h3 className="text-4xl font-bold text-primary">{conjugation.verb}</h3>
                 <p className="text-gray-400 font-medium">({conjugation.translation})</p>
               </div>
               <button className="mb-2 p-2 text-primary bg-primary/5 rounded-xl"><Volume2 size={20} /></button>
            </div>

            <section className="space-y-4">
               <div className="flex items-center justify-between">
                 <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Presente de Indicativo</h4>
                 <div className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase">Regular</div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 {conjugation.present.map((item, i) => (
                   <div key={i} className="bg-white border rounded-2xl p-4 flex justify-between items-center group hover:border-primary transition-all">
                      <span className="text-xs text-gray-400">{item.p}</span>
                      <b className="text-primary font-bold group-hover:scale-105 transition-transform">{item.v}</b>
                   </div>
                 ))}
               </div>
            </section>

            <button className="w-full py-5 bg-orange-500 text-white rounded-[32px] font-bold flex items-center justify-center gap-2 shadow-xl shadow-orange-100 active:scale-95 transition-all">
               <Activity size={20} /> Praticar este Verbo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-300 text-center space-y-4">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-100">
               <Activity size={48} />
             </div>
             <p>Aprenda a conjugar milhares de verbos<br/>regulares e irregulares.</p>
          </div>
        )}
      </div>
    </div>
  );
}
