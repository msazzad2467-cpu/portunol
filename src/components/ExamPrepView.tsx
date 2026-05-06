import { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ArrowLeft, Timer, FileText, BarChart, ChevronRight } from 'lucide-react';

export default function ExamPrepView({ onClose }: { onClose: () => void }) {
  const exams = [
    { title: 'DELE - Diploma de Español como Lengua Extranjera', desc: 'Oferecido pelo Instituto Cervantes.', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    { title: 'SIELE - Servicio Internacional de Evaluación de la Lengua Española', desc: 'Exame digital e modular.', levels: ['A1-C1'] },
  ];

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4 bg-primary text-white">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Preparação para Exames</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 flex gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0">
             <GraduationCap size={24} />
           </div>
           <div className="space-y-1">
             <h3 className="font-bold text-orange-950">Pronto para o Certificado?</h3>
             <p className="text-xs text-orange-800 opacity-70">Prepare-se para o DELE ou SIELE com simulados cronometrados e dicas exclusivas.</p>
           </div>
        </section>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Exames Disponíveis</h3>
          {exams.map((exam, i) => (
            <div key={i} className="bg-white border p-6 rounded-3xl space-y-4 shadow-sm">
              <div>
                <h4 className="font-bold text-lg leading-tight">{exam.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{exam.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {exam.levels.map(l => (
                   <span key={l} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">{l}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                 <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-xs font-bold active:scale-95 transition-all">
                    <Timer size={14} /> Simulado
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl text-xs font-bold active:scale-95 transition-all">
                    <FileText size={14} /> Guia
                 </button>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-4">
           <div className="flex items-center gap-2 text-blue-600">
             <BarChart size={20} />
             <h3 className="font-bold">Sua Performance</h3>
           </div>
           <p className="text-sm text-blue-800 opacity-70">Complete simulados para ver sua pontuação estimada por habilidade (Leitura, Escrita, Escuta, Fala).</p>
           <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-0" />
           </div>
           <p className="text-[10px] text-blue-400 font-bold uppercase">Estimativa Global: N/A</p>
        </section>
      </div>
    </div>
  );
}
