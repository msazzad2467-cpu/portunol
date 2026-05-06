import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookMarked, ArrowLeft, Volume2, Globe, Search, Plus, Sparkles } from 'lucide-react';
import { PHRASEBOOK, REAL_SPANISH } from '../content';
import { audioService } from '../services/audioService';

export default function PhrasebookView({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'standard' | 'slang'>('standard');
  const [search, setSearch] = useState('');

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4 bg-primary text-white">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Guia de Frases</h2>
      </header>

      <div className="flex border-b">
        <button 
          onClick={() => setTab('standard')}
          className={`flex-1 py-4 font-bold text-sm transition-all border-b-2 ${tab === 'standard' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
        >
          ESSENCIAL
        </button>
        <button 
          onClick={() => setTab('slang')}
          className={`flex-1 py-4 font-bold text-sm transition-all border-b-2 ${tab === 'slang' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
        >
          GÍRIAS REGIONAIS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32">
        {tab === 'standard' ? (
          PHRASEBOOK.map((cat, i) => (
            <section key={i} className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{cat.category}</h3>
              <div className="grid gap-3">
                {cat.phrases.map((p, j) => (
                  <div key={j} className="bg-white border p-5 rounded-3xl space-y-2 flex justify-between items-center group shadow-sm">
                    <div>
                      <p className="font-bold text-lg text-primary">{p.es}</p>
                      <p className="text-sm text-gray-500">{p.pt}</p>
                      <p className="text-[10px] text-gray-400 italic mt-1">{p.note}</p>
                    </div>
                    <button onClick={() => audioService.speak(p.es)} className="p-3 bg-primary/5 rounded-2xl text-primary"><Volume2 size={20} /></button>
                  </div>
                ))}
              </div>
              {i === 0 && (
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[32px] space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm"><Sparkles /></div>
                      <div>
                         <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Patrocinado</p>
                         <h4 className="font-bold text-indigo-900">IA Premium: Frases Infinitas</h4>
                      </div>
                   </div>
                   <p className="text-xs text-indigo-700">Gere guias de frases personalizados para QUALQUER situação com IA.</p>
                   <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest">VER OFERTA</button>
                </div>
              )}
            </section>
          ))
        ) : (
          REAL_SPANISH.map((reg, i) => (
            <section key={i} className="space-y-4">
               <h3 className="text-sm font-bold text-orange-500 flex items-center gap-2">
                 <Globe size={16} /> {reg.region}
               </h3>
               <div className="grid gap-3">
                 {reg.slang.map((s, j) => (
                   <div key={j} className="bg-orange-50/50 border border-orange-100 p-5 rounded-3xl space-y-1">
                     <div className="flex justify-between">
                       <p className="font-bold text-xl text-orange-950">"{s.term}"</p>
                       <Volume2 size={16} className="text-orange-300 cursor-pointer" onClick={() => audioService.speak(s.term)} />
                     </div>
                     <p className="text-sm font-medium text-orange-800">Significa: {s.meaning}</p>
                     <p className="text-xs text-orange-600/70 mt-1 italic">Ex: {s.example}</p>
                   </div>
                 ))}
               </div>
            </section>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-50 border-t p-3 text-center z-40">
         <div className="text-[8px] font-bold text-gray-300 mb-1 uppercase tracking-widest">InMobi Adaptive Banner</div>
         <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
