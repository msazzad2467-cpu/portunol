import { useState } from 'react';
import { Search, ArrowLeft, Volume2, Bookmark, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dictionary({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [direction, setDirection] = useState<'es-pt' | 'pt-es'>('es-pt');
  
  // Mock data for dictionary results
  const results = searchTerm.length > 1 ? [
    { word: 'Hablar', translation: 'Falar', pos: 'verbo', examples: ['Yo hablo español', 'Él habla muito'] },
    { word: 'Hola', translation: 'Olá', pos: 'interj.', examples: ['¡Hola! ¿Cómo estás?'] },
    { word: 'Coche', translation: 'Carro', pos: 'sust. m.', examples: ['Mi coche es rojo'] },
  ].filter(r => r.word.toLowerCase().includes(searchTerm.toLowerCase()) || r.translation.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = direction === 'es-pt' ? 'es-ES' : 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-white z-[200] flex flex-col max-w-md mx-auto"
    >
      <header className="p-4 border-b flex items-center gap-4 bg-primary text-white">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Dicionário Portunol</h2>
      </header>

      <div className="p-4 space-y-4 bg-gray-50 border-b">
        <div className="flex bg-white rounded-2xl p-1 border">
           <button 
             onClick={() => setDirection('es-pt')}
             className={cn("flex-1 py-2 text-xs font-bold rounded-xl transition-all", direction === 'es-pt' ? "bg-primary text-white" : "text-gray-400")}
           >
             ES 🇪🇸 → PT 🇧🇷
           </button>
           <button 
             onClick={() => setDirection('pt-es')}
             className={cn("flex-1 py-2 text-xs font-bold rounded-xl transition-all", direction === 'pt-es' ? "bg-primary text-white" : "text-gray-400")}
           >
             PT 🇧🇷 → ES 🇪🇸
           </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            autoFocus
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite uma palavra..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-3xl outline-none focus:ring-2 ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {results.length > 0 ? (
          results.map((res, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border p-6 rounded-[32px] space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {res.word} <Volume2 className="w-5 h-5 text-primary cursor-pointer" onClick={() => speak(res.word)} />
                  </h3>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">{res.pos}</span>
                </div>
                <button className="p-2 text-gray-300 hover:text-orange-400 transition-colors"><Star size={20} /></button>
              </div>
              
              <div className="text-xl text-gray-800 font-medium border-l-4 border-primary pl-4 py-1">
                {res.translation}
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase">Exemplos</h4>
                {res.examples.map((ex, j) => (
                  <p key={j} className="text-sm bg-gray-50 p-3 rounded-xl italic text-gray-600">{ex}</p>
                ))}
              </div>

              {res.pos === 'verbo' && (
                <button className="w-full py-3 bg-primary/5 rounded-2xl text-xs font-bold text-primary flex items-center justify-center gap-2 border border-primary/10">
                  Ver Conjugação <ChevronRight size={14} />
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-300 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <Search size={40} />
            </div>
            <p className="text-sm">Busque por palavras ou expressões<br/>para ver traduções e exemplos.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
               <Bookmark size={20} />
            </div>
            <div className="text-xs font-bold">Favoritos (0)</div>
         </div>
      </div>
    </motion.div>
  );
}
