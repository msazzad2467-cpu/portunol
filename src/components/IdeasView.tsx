import { ChevronRight } from 'lucide-react';
import { LEARNING_IDEAS } from '../content';

export default function IdeasView({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 flex items-center gap-4 border-b bg-primary text-white">
        <button onClick={onClose} className="p-2">
           <ChevronRight className="rotate-180 w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Ideias de Aprendizado</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-green-50 border border-green-200 p-6 rounded-[32px] space-y-2 translate-y-0 shadow-sm">
           <h3 className="font-bold text-green-950">Missões de Fluência</h3>
           <p className="text-sm text-green-800 opacity-80">Pratique seu espanhol em situações reais com estes desafios práticos.</p>
        </div>
        
        <div className="space-y-4">
           {LEARNING_IDEAS.map((idea) => (
             <div key={idea.id} className="bg-white border rounded-[28px] p-6 space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    {idea.category}
                  </span>
                  <span className="text-[10px] text-gray-300 font-mono">#{idea.id}</span>
                </div>
                <h4 className="font-bold text-lg leading-tight">{idea.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{idea.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
