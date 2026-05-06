import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  Volume2, 
  Plus, 
  Sparkles, 
  Camera, 
  Clipboard,
  X,
  Play,
  ArrowRight,
  Volume2 as VolumeIcon
} from 'lucide-react';
import { DICTIONARY_DATA, CONJUGATIONS } from '../content';
import { DictionaryEntry } from '../types';
import { cn } from '../lib/utils';
import { audioService } from '../services/audioService';

export default function DictionaryView({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [mode, setMode] = useState<'search' | 'ocr'>('search');

  const results = useMemo(() => {
    if (!search.trim()) return DICTIONARY_DATA;
    const s = search.toLowerCase();
    return DICTIONARY_DATA.filter(e => 
      e.es.toLowerCase().includes(s) || 
      e.pt.toLowerCase().includes(s)
    );
  }, [search]);

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col max-w-md mx-auto">
      <header className="p-6 bg-primary text-white space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-display font-bold">Dicionário</h1>
            <button onClick={onClose} className="opacity-60 font-bold">FECHAR</button>
        </div>
        
        <div className="relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
           <input 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Pesquisar em espanhol ou português..."
             className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20"
           />
        </div>

        <div className="flex gap-2">
           <button 
            onClick={() => setMode('ocr')}
            className="flex-1 bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/10"
           >
              <Camera size={16} /> Tradutor Visual
           </button>
           <button className="flex-1 bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/10">
              <Clipboard size={16} /> Colar Texto
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 pb-24">
        <AnimatePresence mode="wait">
          {mode === 'search' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {results.length > 0 ? results.map((entry, idx) => (
                 <div key={entry.id}>
                    <button 
                      onClick={() => setSelectedEntry(entry)}
                      className="w-full bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between group shadow-sm active:scale-[0.99] transition-all"
                    >
                      <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-lg text-gray-900">{entry.es}</span>
                             <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{entry.type}</span>
                          </div>
                          <p className="text-sm text-gray-500">{entry.pt}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </button>
                    
                    {idx === 4 && (
                       <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[32px] p-6 space-y-4 my-2 shadow-xl shadow-indigo-200">
                          <div className="flex justify-between items-start">
                             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🌐</div>
                             <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded">Patrocinado</span>
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">Traduza Documentos Profissionais</h4>
                             <p className="text-xs text-white/60 leading-relaxed">Precisa traduzir contratos ou currículos? Nossa rede de especialistas faz isso em 1 hora.</p>
                          </div>
                          <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg">
                             ORÇAMENTO GRÁTIS
                          </button>
                       </div>
                    )}

                    {idx === 2 && (
                       <div className="my-4 bg-indigo-50 border border-indigo-100 p-4 rounded-[28px] flex gap-3 items-center">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                             <Sparkles size={20} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">IA Recomendada</p>
                             <p className="text-xs text-indigo-800">Use IA para criar frases com "{results[0].es}"</p>
                          </div>
                          <ChevronRight size={14} className="text-indigo-300" />
                       </div>
                    )}
                 </div>
              )) : (
                <div className="p-12 text-center space-y-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <Search size={32} />
                   </div>
                   <div className="space-y-1">
                      <p className="font-bold text-gray-400">Palavra não encontrada</p>
                      <button className="text-primary font-bold text-sm flex items-center justify-center gap-2 mx-auto">
                        <Sparkles size={16} /> Perguntar ao Portunol IA
                      </button>
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {mode === 'ocr' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-8 text-center bg-white rounded-[40px] m-4 border-2 border-dashed border-gray-200">
               <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Camera size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold">Tradutor de Câmera</h3>
                  <p className="text-sm text-gray-500">Aponte para placas ou textos para tradução instantânea com IA.</p>
               </div>
               <button onClick={() => setMode('search')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">
                  Simular Escaneamento
               </button>
               <button onClick={() => setMode('search')} className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Voltar
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <DictionaryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function DictionaryDetail({ entry, onClose }: { entry: DictionaryEntry, onClose: () => void }) {
  const conjugation = entry.conjugationId ? CONJUGATIONS[entry.conjugationId] : null;

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      className="absolute inset-0 bg-white z-[310] flex flex-col max-w-md mx-auto"
    >
      <header className="p-6 flex items-center justify-between border-b">
         <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 -ml-2 text-gray-400"><X /></button>
            <h2 className="text-xl font-bold">Detalhes</h2>
         </div>
         <button className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} /> Adicionar SRS
         </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
         <section className="space-y-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-4xl font-display font-bold text-gray-900">{entry.es}</h1>
                  <p className="text-lg text-primary font-medium">{entry.pt}</p>
               </div>
               <button 
                 onClick={() => audioService.speak(entry.es)}
                 className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-colors active:scale-90"
               >
                  <VolumeIcon size={24} />
               </button>
            </div>
            <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{entry.type}</span>
               {entry.gender && <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Gênero: {entry.gender === 'm' ? 'Masculino' : 'Feminino'}</span>}
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <Sparkles size={14} className="text-primary" /> Exemplos com IA
            </h3>
            <div className="grid gap-3">
               {entry.examples.map((ex: any, i: number) => (
                 <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1 relative group/ex">
                    <p className="font-bold text-gray-950 pr-8">{typeof ex === 'string' ? ex : ex.es}</p>
                    <p className="text-[10px] text-gray-400 italic">"{typeof ex === 'string' ? '' : ex.pt}"</p>
                    <button 
                      onClick={() => audioService.speak(typeof ex === 'string' ? ex : ex.es)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-primary opacity-0 group-hover/ex:opacity-100 transition-all"
                    >
                      <VolumeIcon size={14} />
                    </button>
                 </div>
               ))}
               <button className="w-full py-4 text-primary text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
                  Gerar +5 Exemplos Nível C1
               </button>
            </div>
         </section>

         {conjugation && (
            <section className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conjugação: Presente</h3>
               <div className="bg-white border rounded-[32px] overflow-hidden">
                  <div className="bg-gray-50 p-4 font-bold text-center border-b text-gray-400 text-[10px] uppercase tracking-widest">Indicativo Presente</div>
                  <div className="divide-y">
                     {conjugation.present.map((item: any, i: number) => (
                       <div key={i} className="flex p-4 text-sm">
                          <span className="w-24 text-gray-400">{item.p}</span>
                          <span className="font-bold text-gray-900">{item.v}</span>
                       </div>
                     ))}
                   </div>
                   <button className="w-full py-5 bg-gray-50 text-primary font-bold text-xs uppercase tracking-widest border-t">
                      Ver Todos os Tempos
                   </button>
                </div>
             </section>
          )}

          <button className="w-full bg-primary text-white py-6 rounded-[32px] font-bold shadow-xl shadow-primary/20 flex flex-col items-center">
             <span className="text-xs opacity-60 uppercase tracking-tighter">Praticar esta palavra</span>
             <span className="text-lg">Treino Micro-Drill</span>
          </button>
       </div>
    </motion.div>
  );
}
