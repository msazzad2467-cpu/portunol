import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, Volume2, Info, AlertTriangle } from 'lucide-react';
import { audioService } from '../services/audioService';

const FALSE_FRIENDS = [
  { es: 'Embarazada', pt: 'Grávida', literal: 'Embaraçada (Vergonha)', example: 'Ella está embarazada de tres meses.' },
  { es: 'Exquisito', pt: 'Delicioso', literal: 'Esquisito (Estranho)', example: 'La cena estaba exquisita.' },
  { es: 'Borracha', pt: 'Bêbada', literal: 'Borracha (Apagador)', example: 'Tomó mucho vino y ahora está borracha.' },
  { es: 'Cachorro', pt: 'Filhote (qualquer animal)', literal: 'Cachorro (Cão)', example: 'El cachorro del león es muy tierno.' },
  { es: 'Extrañar', pt: 'Sentir saudades', literal: 'Estranhar', example: 'Extraño mucho a mi familia.' },
  { es: 'Apellido', pt: 'Sobrenome', literal: 'Apelido (Alcunha)', example: 'Mi apellido es Rodríguez.' },
  { es: 'Taller', pt: 'Oficina', literal: 'Talher', example: 'Llevé mi coche al taller.' },
  { es: 'Escritório', pt: 'Escrivaninha', literal: 'Escritório (Oficina)', example: 'Mi abuelo tiene un escritorio de madera.' },
  { es: 'Vaso', pt: 'Copo', literal: 'Vaso', example: '¿Me das un vaso de agua?' },
  { es: 'Pastilla', pt: 'Comprimido / Pílula', literal: 'Pastilha', example: 'Tengo que tomar una pastilla para el dolor.' }
];

export default function FalseFriendsView({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = FALSE_FRIENDS.filter(f => 
    f.es.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.pt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-white z-[600] flex flex-col max-w-md mx-auto"
    >
      <header className="p-6 flex items-center justify-between border-b">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest">Falsos Amigos</h2>
        <div className="w-10" />
      </header>

      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-2xl flex gap-3 border border-red-100 mb-6">
           <AlertTriangle size={20} className="text-red-500 shrink-0" />
           <p className="text-[10px] text-red-900 leading-relaxed font-bold uppercase tracking-widest">
             Cuidado! Estas palavras parecem português mas têm significados totalmente diferentes.
           </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Pesquisar palavra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-5 rounded-[32px] shadow-sm space-y-3">
             <div className="flex justify-between items-center text-primary font-bold">
                <div className="flex items-center gap-2">
                   <span className="text-lg">{item.es}</span>
                   <button onClick={() => audioService.speak(item.es)} className="p-1 hover:bg-primary/10 rounded-lg transition-colors">
                      <Volume2 size={16} />
                   </button>
                </div>
                <span className="text-xs uppercase bg-primary/10 px-3 py-1 rounded-full">Español</span>
             </div>
             
             <div className="flex items-center gap-2 text-gray-400">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Significa</span>
                <div className="h-px flex-1 bg-gray-100" />
             </div>

             <div className="flex justify-between items-center text-gray-900 font-bold">
                <span className="text-lg">{item.pt}</span>
                <span className="text-xs uppercase bg-gray-100 px-3 py-1 rounded-full">Português</span>
             </div>

             <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <p className="text-[10px] text-amber-900">
                  <span className="font-bold">NÃO É:</span> {item.literal}
                </p>
             </div>

             <div className="pt-2 italic text-xs text-gray-500 leading-relaxed flex items-center justify-between group/ex">
                <span>"{item.example}"</span>
                <button 
                  onClick={() => audioService.speak(item.example)}
                  className="p-1 text-gray-300 hover:text-primary opacity-0 group-hover/ex:opacity-100 transition-all"
                >
                   <Volume2 size={14} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
