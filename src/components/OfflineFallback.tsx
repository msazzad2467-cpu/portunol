import React from 'react';
import { motion } from 'motion/react';
import { WifiOff, BookOpen, Clock } from 'lucide-react';

export const OfflineFallback: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-red-100">
        <WifiOff size={44} />
      </div>

      <div className="space-y-3 mb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Você está offline</h2>
        <p className="text-gray-500 font-medium leading-relaxed max-w-[280px] mx-auto">
          Algumas funcionalidades requerem conexão, mas você ainda pode revisar seus cartões!
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 text-left border border-gray-100">
           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen size={20} />
           </div>
           <div>
              <p className="text-sm font-bold text-gray-800">SRS Review</p>
              <p className="text-[10px] text-gray-500">Acesse seus cartões em cache</p>
           </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 text-left border border-gray-100 opacity-50">
           <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
           </div>
           <div>
              <p className="text-sm font-bold text-gray-800">Simulados</p>
              <p className="text-[10px] text-gray-500">Requer conexão para gerar questões IA</p>
           </div>
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-12 text-sm font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-600 pb-1"
      >
        Tentar Novamente
      </button>
    </motion.div>
  );
};
