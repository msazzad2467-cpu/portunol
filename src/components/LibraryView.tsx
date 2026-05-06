import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Headset, ArrowLeft, ChevronRight } from 'lucide-react';
import { LIBRARY } from '../content';
import { LibraryItem } from '../types';
import GradedReader from './GradedReader';
import AudioReader from './AudioReader';

export default function LibraryView({ onClose }: { onClose: () => void }) {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'reading' | 'listening'>('all');

  const filtered = LIBRARY.filter(i => filter === 'all' || i.type === filter);

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4 bg-primary text-white">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Biblioteca Imersiva</h2>
      </header>

      <div className="flex border-b bg-gray-50/50">
        {(['all', 'reading', 'listening'] as const).map(type => (
          <button 
            key={type}
            onClick={() => setFilter(type)}
            className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest ${filter === type ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          >
            {type === 'all' ? 'Todos' : type === 'reading' ? 'Leitura' : 'Escuta'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filtered.map((item, index) => (
          <div key={item.id} className="space-y-4">
            <button
              onClick={() => setSelectedItem(item)}
              className="w-full bg-white border border-gray-100 p-5 rounded-3xl flex items-center gap-4 group active:scale-[0.98] transition-all shadow-sm"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'reading' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500'}`}>
                {item.type === 'reading' ? <BookOpen size={20} /> : <Headset size={20} />}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold">{item.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded uppercase">{item.level}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{item.type}</span>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-primary" />
            </button>
            
            {(index + 1) % 3 === 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 relative overflow-hidden">
                 <div className="absolute top-3 right-3 text-[8px] font-bold text-amber-500 uppercase tracking-widest bg-amber-100 px-1.5 py-0.5 rounded">AD</div>
                 <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shrink-0">🎓</div>
                    <div className="flex-1">
                       <h4 className="font-bold text-amber-900 text-sm">Bolsas em Madrid?</h4>
                       <p className="text-[10px] text-amber-800/60 leading-tight">Saiba como estudar na Espanha com tudo pago. Clique para saber mais!</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          selectedItem.type === 'reading' ? (
            <GradedReader 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)}
              onSaveWord={(word, trans) => {
                console.log('Saving word:', word, trans);
                // Integration with logic would go here
              }}
            />
          ) : (
            <AudioReader 
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}
