import React from 'react';
import { motion } from 'motion/react';
import { WritingEvaluation } from '../types';
import { CEFRScoreBar } from './CEFRScoreBar';
import { cn } from '../lib/utils';
import { AlertCircle, CheckCircle2, History, Languages, MessageSquareQuote } from 'lucide-react';

interface EvaluationResultProps {
  evaluation: WritingEvaluation;
  onClose: () => void;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({ evaluation, onClose }) => {
  const errorColors = {
    grammar: "text-red-600 bg-red-50 border-red-100",
    lexical: "text-amber-600 bg-amber-50 border-amber-100",
    register: "text-purple-600 bg-purple-50 border-purple-100",
    coherence: "text-blue-600 bg-blue-50 border-blue-100"
  };

  return (
    <div className="flex-1 flex flex-col space-y-8 p-6 bg-gray-50 overflow-y-auto pb-32">
      {/* Overall Score Header */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 text-center space-y-4 shadow-xl shadow-indigo-50">
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black mx-auto shadow-xl shadow-indigo-100">
          {evaluation.overallBand}
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Avaliação Concluída</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Resultado de Escrita</p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-4">Desempenho por Critério</h3>
        <div className="space-y-4">
          <CEFRScoreBar label="Coerência e Coesão" score={evaluation.scores.coherence} />
          <CEFRScoreBar label="Alcance Lexical" score={evaluation.scores.lexical} />
          <CEFRScoreBar label="Correção Gramatical" score={evaluation.scores.grammar} />
          <CEFRScoreBar label="Cumprimento da Tarefa" score={evaluation.scores.task} />
          <CEFRScoreBar label="Registro e Estilo" score={evaluation.scores.register} />
        </div>
      </div>

      {/* Examiner Comment */}
      <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 space-y-3">
        <div className="flex items-center gap-2 opacity-80">
          <MessageSquareQuote size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Comentário do Examinador</span>
        </div>
        <p className="text-sm font-medium leading-relaxed italic">
          "{evaluation.examinerComment}"
        </p>
      </div>

      {/* Portunhol Warnings */}
      {evaluation.portunholErrors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest px-2 flex items-center gap-2">
            <AlertCircle size={14} className="text-orange-500" /> Alertas de Portunhol
          </h3>
          <div className="space-y-3">
            {evaluation.portunholErrors.map((error, idx) => (
              <div key={idx} className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
                <div className="font-bold text-orange-600">"{error.phrase}"</div>
                <div className="text-xs text-orange-800 font-medium flex-1">{error.explanation_ptbr}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Review */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest px-2 flex items-center gap-2">
          <Languages size={14} className="text-indigo-500" /> Revisão Sugerida
        </h3>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
           <div className="p-5">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.15em] block mb-2">Original</span>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{evaluation.originalText}</p>
           </div>
           <div className="p-5 bg-indigo-50/30">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.15em] block mb-2">Versão Melhorada</span>
              <p className="text-sm text-gray-900 font-bold leading-relaxed">{evaluation.improvedVersion}</p>
           </div>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-100 hover:bg-gray-800 transition-all active:scale-95"
      >
        Fechar Resultado
      </button>

      <div className="h-10" />
    </div>
  );
};
