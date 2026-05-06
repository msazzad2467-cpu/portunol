import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronRight, Search, ArrowLeft, PlayCircle, CheckCircle } from 'lucide-react';
import { GRAMMAR_BOOK } from '../content';
import { GrammarTopic } from '../types';

export default function GrammarView({ onClose }: { onClose: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = GRAMMAR_BOOK.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Gramática</h2>
      </header>

      <div className="p-4 border-b bg-gray-50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar tópico..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filtered.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="w-full bg-white border border-gray-200 p-5 rounded-3xl text-left flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <Book size={24} />
              </div>
              <div>
                <h3 className="font-bold">{topic.title}</h3>
                <p className="text-xs text-gray-400">Guia teórico + Exercícios</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedTopic && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-white z-[160] flex flex-col max-w-md mx-auto"
          >
            <header className="p-4 border-b flex items-center gap-4">
              <button onClick={() => setSelectedTopic(null)} className="p-2"><ArrowLeft /></button>
              <h2 className="text-xl font-bold">{selectedTopic.title}</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Explicação</h3>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-gray-800 leading-relaxed">
                  {selectedTopic.explanation}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Exemplos</h3>
                <div className="space-y-3">
                  {selectedTopic.examples.map((ex, i) => (
                    <div key={i} className="bg-white border rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg text-primary">{ex.es}</p>
                        <p className="text-sm text-gray-500">{ex.pt}</p>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-primary"><PlayCircle /></button>
                    </div>
                  ))}
                </div>
              </section>
              
              <button className="w-full bg-primary text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <CheckCircle size={20} /> Praticar este tópico
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
