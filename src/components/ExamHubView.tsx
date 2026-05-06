import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Target, 
  ChevronRight, 
  X,
  FileText,
  Lock,
  BarChart3,
  Calendar,
  Zap,
  Loader2,
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { EXAM_MOCKS } from '../content';
import { ExamMock, UserProgress } from '../types';
import { cn } from '../lib/utils';
import { aiService, ExamGenerationResult } from '../services/aiService';
import { CONFIG } from '../config';

export default function ExamHubView({ 
  user, 
  onUpdateUser, 
  onClose, 
  onWatchAd 
}: { 
  user: UserProgress, 
  onUpdateUser: (data: UserProgress) => void,
  onClose: () => void, 
  onWatchAd?: () => void 
}) {
  const [selectedExam, setSelectedExam] = useState<ExamMock | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'dele' | 'siele'>('all');

  const isUnlocked = (examId: string, index: number) => {
    if (index <= 1) return true;
    return (user?.unlockedExams || []).includes(examId);
  };

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col max-w-md mx-auto">
      <header className="p-6 bg-indigo-900 text-white space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-display font-bold">Exames Oficiais</h1>
            <button onClick={onClose} className="opacity-60 font-bold">FECHAR</button>
        </div>
        <p className="text-indigo-200 text-sm leading-tight">Prepare-se para o DELE ou SIELE com simulados reais e cronometrados.</p>
        
        <div className="flex gap-2">
           {['all', 'dele', 'siele'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={cn(
                 "flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                 activeTab === tab ? "bg-white text-indigo-900 border-white" : "bg-white/10 text-white border-white/10"
               )}
             >
               {tab === 'all' ? 'Todos' : tab}
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50 pb-24">
        <section className="space-y-4">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} /> Cronograma de Estudos
           </h2>
           <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-5 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                 <BarChart3 />
              </div>
              <div className="flex-1">
                 <h3 className="font-bold">Plano de 8 Semanas</h3>
                 <p className="text-[10px] text-gray-400">Meta: B2 • 15% concluído</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
           </div>
        </section>

        <section className="space-y-4">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Simulados Disponíveis</h2>
           <div className="grid gap-4">
              {EXAM_MOCKS.filter(e => activeTab === 'all' || e.examType.toLowerCase() === activeTab).map((exam, i) => {
                const locked = !isUnlocked(exam.id, i);
                return (
                  <button 
                    key={exam.id}
                    onClick={() => {
                      if (locked) {
                        alert("Este simulado está bloqueado. Assista a um anúncio para desbloquear!");
                      } else {
                        setSelectedExam(exam);
                      }
                    }}
                    className={cn(
                      "bg-white p-6 rounded-[32px] border border-gray-100 text-left space-y-4 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden",
                      locked && "opacity-75 grayscale"
                    )}
                  >
                     {locked && (
                       <div className="absolute top-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg scale-75">
                          <Lock size={14} />
                       </div>
                     )}
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <span className={cn(
                                 "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border",
                                 exam.examType === 'DELE' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                              )}>{exam.examType}</span>
                              <span className="text-xs font-bold text-gray-400">Nível {exam.level}</span>
                              {locked && <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-100">Premium</span>}
                           </div>
                           <h3 className="text-lg font-bold text-gray-900">{exam.title}</h3>
                        </div>
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                           <Target size={20} />
                        </div>
                     </div>
                     
                     <div className="flex gap-6">
                        <div className="flex items-center gap-1.5">
                           <Timer size={14} className="text-gray-300" />
                           <span className="text-[10px] font-bold text-gray-500">{exam.sections[0].duration} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <FileText size={14} className="text-gray-300" />
                           <span className="text-[10px] font-bold text-gray-500">{exam.sections.length} Sessões</span>
                        </div>
                     </div>
                  </button>
                );
              })}
           </div>
        </section>

        <div className="bg-indigo-600 text-white p-8 rounded-[40px] space-y-4 shadow-xl shadow-indigo-200">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Zap /></div>
              <h4 className="font-bold">Desbloqueio Gratuito</h4>
           </div>
           <p className="text-xs text-indigo-100 leading-tight">Assista a um vídeo curto para desbloquear UM Simulado Premium permanentemente.</p>
           <button 
             onClick={() => {
               if (onWatchAd) {
                 onWatchAd();
               }
             }}
             className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
           >
              ASSISTIR E DESBLOQUEAR (RECOMPENSA 📺)
           </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedExam && (
          <ExamSimulator exam={selectedExam} onClose={() => setSelectedExam(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ExamSimulator({ exam, onClose }: { exam: ExamMock, onClose: () => void }) {
  const [step, setStep] = useState<'intro' | 'loading' | 'active' | 'results'>('intro');
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [sectionData, setSectionData] = useState<Record<number, ExamGenerationResult>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // key: sectionIdx-questionIdx
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  const activeSection = exam.sections[activeSectionIdx];
  const currentSectionData = sectionData[activeSectionIdx];

  const startSection = useCallback(async (idx: number) => {
    setIsSectionLoading(true);
    setStep('loading');
    try {
      const section = exam.sections[idx];
      // Try to find custom prompt from config
      const promptKey = `${exam.examType}-${section.type}`;
      const customPrompt = CONFIG.examPrompts?.[promptKey] || CONFIG.examPrompts?.[`${exam.examType}-${exam.level}-${section.type}`];
      
      const data = await aiService.generateExamQuestions(exam.examType as any, exam.level, section.type, undefined, customPrompt);
      setSectionData(prev => ({ ...prev, [idx]: data }));
      setTimeLeft(section.duration * 60);
      setCurrentIdx(0);
      setIsSectionLoading(false);
      setStep('active');
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar seção. Tente novamente.");
      setIsSectionLoading(false);
      setStep('intro');
    }
  }, [exam]);

  const handleAutoSubmit = useCallback(() => {
    if (activeSectionIdx < exam.sections.length - 1) {
      const nextIdx = activeSectionIdx + 1;
      setActiveSectionIdx(nextIdx);
      startSection(nextIdx);
    } else {
      setStep('results');
    }
  }, [activeSectionIdx, exam.sections.length, startSection]);

  useEffect(() => {
    let interval: any;
    if (step === 'active' && timeLeft > 0 && !isSectionLoading) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft, isSectionLoading, handleAutoSubmit]);

  const [writingFeedback, setWritingFeedback] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const getWritingFeedback = async (sIdx: number, qIdx: number) => {
    const answer = answers[`${sIdx}-${qIdx}`];
    if (!answer || answer.length < 10) return;
    
    setIsEvaluating(true);
    try {
      const prompt = `Avalie esta redação de um estudante de espanhol nível ${exam.level}.
      Texto: "${answer}"
      Forneça feedback sobre gramática, vocabulário e coerência em português, mas use exemplos em espanhol.
      Seja encorajador mas preciso.`;
      const response = await aiService.chat([{ role: 'user', content: prompt }], "Avaliação de Redação DELE");
      setWritingFeedback(prev => ({ ...prev, [`${sIdx}-${qIdx}`]: response.content }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    let correct = 0;
    let total = 0;
    Object.keys(sectionData).forEach((sIdxStr) => {
      const sIdx = parseInt(sIdxStr);
      const sData = sectionData[sIdx];
      if (sData && sData.questions) {
        sData.questions.forEach((q, qIdx) => {
          total++;
          if (answers[`${sIdx}-${qIdx}`] === q.answer) {
            correct++;
          }
        });
      }
    });
    return { correct, total, score: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  const { correct, total, score } = calculateResults();

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }}
      className="absolute inset-0 bg-white z-[310] flex flex-col max-w-md mx-auto"
    >
      <header className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
         <button onClick={onClose} className="p-2"><X /></button>
         <div className="text-center">
            <h2 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600">{exam.examType} SIMULADOR</h2>
            <p className="text-[8px] font-medium text-gray-400 capitalize">{exam.title}</p>
         </div>
         <div className="w-10" />
      </header>

      {step === 'intro' && (
        <div className="flex-1 p-8 flex flex-col justify-start items-center text-center space-y-8 overflow-y-auto pt-12 pb-24">
           <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100 shrink-0">
              <Timer size={32} />
           </div>
           <div className="space-y-3">
              <h2 className="text-2xl font-display font-bold">Simulado Oficial</h2>
              <p className="text-xs text-gray-500 leading-relaxed px-4">
                Este teste simula as condições reais do {exam.examType}. 
                São {exam.sections.length} seções cronometradas individualmente. 
                Ao fim de cada tempo, a seção é enviada automaticamente.
              </p>
           </div>
           
           <div className="space-y-3 px-4">
              {exam.sections.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-white text-indigo-600 rounded-lg text-[10px] font-bold flex items-center justify-center border shadow-sm">{i + 1}</span>
                    <span className="text-xs font-bold text-gray-700 capitalize">{s.type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{s.duration} min</span>
                </div>
              ))}
           </div>

           <button 
             onClick={() => {
               setActiveSectionIdx(0);
               startSection(0);
             }} 
             className="w-full bg-indigo-900 text-white py-5 rounded-[28px] font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95"
           >
             Começar Simulado
           </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
           <div className="relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20" />
              <div className="relative bg-white p-6 rounded-full shadow-xl">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              </div>
           </div>
           <div className="space-y-2">
              <h3 className="font-bold text-xl">Gerando Seção: {activeSection.type}</h3>
              <p className="text-sm text-gray-400">A IA está criando questões oficiais inéditas para o seu nível {exam.level}...</p>
           </div>
        </div>
      )}

      {step === 'active' && currentSectionData && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
           <div className={cn(
             "p-3 flex items-center justify-between px-6 border-b sticky top-0 bg-white z-20",
             timeLeft < 60 ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-indigo-50 border-indigo-100 text-indigo-600"
           )}>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black uppercase bg-indigo-600 text-white px-2 py-0.5 rounded-full">{activeSection.type}</span>
                <span className="text-[10px] font-bold">Seção {activeSectionIdx + 1}/{exam.sections.length}</span>
              </div>
              <div className="flex items-center gap-2 font-mono font-black text-xs">
                <Timer size={14} />
                <span>{formatTime(timeLeft)}</span>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto w-full max-w-md">
              {/* Progress bar */}
              <div className="h-1 bg-gray-100 w-full sticky top-0 z-10">
                <motion.div 
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / currentSectionData.questions.length) * 100}%` }}
                />
              </div>

              <div className="p-6 space-y-6 pb-40">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tarefa {currentIdx + 1} de {currentSectionData.questions.length}</span>
                 </div>

                 {currentSectionData.textBase && (
                    <div className="bg-white p-6 rounded-[32px] border-2 border-indigo-50 space-y-3 mb-6 shadow-sm">
                       <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] flex items-center gap-2">
                         <FileText size={12} /> Texto de Apoio
                       </h4>
                       <div className="text-sm text-gray-700 leading-relaxed space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                         {currentSectionData.textBase.split('\n').map((para, i) => (
                           <p key={i}>{para}</p>
                         ))}
                       </div>
                    </div>
                 )}

                 <div className="space-y-6">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight">{currentSectionData.questions[currentIdx].question}</h3>
                    
                    {currentSectionData.questions[currentIdx].type === 'writing' ? (
                      <div className="space-y-4">
                        <textarea 
                          value={answers[`${activeSectionIdx}-${currentIdx}`] || ''}
                          onChange={(e) => setAnswers({ ...answers, [`${activeSectionIdx}-${currentIdx}`]: e.target.value })}
                          placeholder="Escriba su respuesta aquí..."
                          className="w-full min-h-[250px] p-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm leading-relaxed"
                        />
                        <div className="flex justify-end text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          { (answers[`${activeSectionIdx}-${currentIdx}`] || '').split(/\s+/).filter(Boolean).length } palavras
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {currentSectionData.questions[currentIdx].options?.map((opt: string, i: number) => (
                          <button 
                            key={i} 
                            onClick={() => setAnswers({ ...answers, [`${activeSectionIdx}-${currentIdx}`]: opt })} 
                            className={cn(
                              "w-full p-6 border-2 rounded-[2rem] text-left transition-all relative group overflow-hidden",
                              answers[`${activeSectionIdx}-${currentIdx}`] === opt 
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200" 
                                : "bg-white border-gray-50 text-gray-700 hover:border-indigo-100"
                            )}
                          >
                             <div className="flex items-center gap-4">
                                <span className={cn(
                                  "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black",
                                  answers[`${activeSectionIdx}-${currentIdx}`] === opt ? "bg-white/20 border-white/20" : "bg-gray-50 border-gray-100 text-gray-400"
                                )}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="flex-1 font-medium">{opt}</span>
                             </div>
                          </button>
                        ))}
                      </div>
                    )}
                 </div>
              </div>
           </div>

           <footer className="p-6 border-t flex justify-between items-center bg-white/80 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-30">
              <button 
                disabled={currentIdx === 0} 
                onClick={() => setCurrentIdx(prev => prev - 1)} 
                className="text-gray-400 font-bold text-xs uppercase tracking-widest disabled:opacity-0 transition-opacity"
              >
                Anterior
              </button>
              
              <div className="flex gap-3">
                {currentIdx < currentSectionData.questions.length - 1 ? (
                  <button 
                    onClick={() => setCurrentIdx(prev => prev + 1)} 
                    className="bg-indigo-900 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100"
                  >
                    Próxima
                  </button>
                ) : (
                  <button 
                    onClick={handleAutoSubmit} 
                    className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-green-100"
                  >
                    {activeSectionIdx === exam.sections.length - 1 ? 'Finalizar' : 'Próxima Seção'}
                  </button>
                )}
              </div>
           </footer>
        </div>
      )}

      {step === 'results' && (
        <div className="flex-1 p-8 flex flex-col justify-start items-center text-center space-y-8 bg-gray-50 overflow-y-auto pt-10 pb-32">
           <div className="relative shrink-0">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className={cn(
                  "w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-black shadow-2xl relative z-10",
                  score >= 60 ? "bg-green-500 shadow-green-200" : "bg-orange-500 shadow-orange-200"
                )}
              >
                <span className="text-4xl">{score}%</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80">{score >= 60 ? 'APTO' : 'NO APTO'}</span>
              </motion.div>
              <div className="absolute -inset-4 bg-white/50 rounded-full animate-pulse z-0" />
           </div>

           <div className="space-y-2">
              <h2 className="text-3xl font-display font-black text-gray-900">Resultado Final</h2>
              <p className="text-sm text-gray-500 max-w-[240px] mx-auto">
                {score >= 60 
                  ? '¡Felicidades! Usted demostró un dominio adecuado para el nivel ' + exam.level + '.' 
                  : 'Siga practicando. El nivel ' + exam.level + ' requiere mayor precisión gramatical.'}
              </p>
           </div>

           <div className="w-full space-y-4">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4 shadow-sm">
                 <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-left">Desempenho por Seção</h4>
                 {exam.sections.map((s, sIdx) => {
                   const sQuestions = sectionData[sIdx]?.questions || [];
                   const sCorrect = sQuestions.filter((q, qIdx) => answers[`${sIdx}-${qIdx}`] === q.answer).length;
                   const sScore = sQuestions.length > 0 ? Math.round((sCorrect / sQuestions.length) * 100) : 0;
                   return (
                     <div key={s.id} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-gray-700 uppercase">{s.type}</span>
                          <span className={cn(sScore >= 60 ? "text-green-600" : "text-orange-600")}>{sScore}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className={cn("h-full transition-all", sScore >= 60 ? "bg-green-500" : "bg-orange-500")} style={{ width: `${sScore}%` }} />
                        </div>
                     </div>
                   );
                 })}
              </div>

              {/* Detailed Review of Questions */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-6 shadow-sm w-full text-left">
                 <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Revisão Detalhada</h4>
                 {Object.keys(sectionData).map(sIdxStr => {
                    const sIdx = parseInt(sIdxStr);
                    const sData = sectionData[sIdx];
                    const sType = exam.sections[sIdx].type;
                    
                    return (
                      <div key={sIdx} className="space-y-4">
                        <h5 className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded inline-block">
                          SEÇÃO: {sType}
                        </h5>
                        <div className="space-y-6">
                          {sData.questions.map((q, qIdx) => {
                            if (q.type === 'writing') return null;
                            const isCorrect = answers[`${sIdx}-${qIdx}`] === q.answer;
                            
                            return (
                              <div key={`${sIdx}-${qIdx}`} className="space-y-3 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="flex gap-3">
                                  <div className="mt-0.5">
                                    {isCorrect ? (
                                      <CheckCircle2 size={16} className="text-green-500" />
                                    ) : (
                                      <XCircle size={16} className="text-red-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <p className="text-xs font-bold text-gray-900 leading-tight">
                                      {qIdx + 1}. {q.question}
                                    </p>
                                    
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2 text-[10px]">
                                        <span className="text-gray-400 font-bold uppercase">Sua Resposta:</span>
                                        <span className={cn(
                                          "font-medium",
                                          isCorrect ? "text-green-600" : "text-red-600"
                                        )}>
                                          {answers[`${sIdx}-${qIdx}`] || '(Sem resposta)'}
                                        </span>
                                      </div>
                                      
                                      {!isCorrect && (
                                        <div className="flex items-center gap-2 text-[10px]">
                                          <span className="text-gray-400 font-bold uppercase">Resposta Correta:</span>
                                          <span className="text-green-600 font-medium">
                                            {q.answer}
                                          </span>
                                        </div>
                                      )}

                                      {q.explanation && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                          <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                            {q.explanation}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                 })}
              </div>

              {/* Show Writing Tasks feedback if any */}
              {Object.keys(sectionData).some(sIdx => 
                sectionData[parseInt(sIdx)].questions.some(q => q.type === 'writing') || false
              ) && (
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-6 shadow-sm w-full text-left">
                  <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Avaliação de Escrita</h4>
                  {Object.keys(sectionData).map(sIdxStr => {
                    const sIdx = parseInt(sIdxStr);
                    const writingQs = sectionData[sIdx].questions.filter(q => q.type === 'writing');
                    if (writingQs.length === 0) return null;
                    
                    return writingQs.map((q, qIdx) => {
                      const qAbsoluteIdx = sectionData[sIdx].questions.indexOf(q);
                      const answer = answers[`${sIdx}-${qAbsoluteIdx}`];
                      const feedback = writingFeedback[`${sIdx}-${qAbsoluteIdx}`];

                      return (
                        <div key={`${sIdx}-${qIdx}`} className="space-y-4 pt-4 border-t first:pt-0 first:border-0 border-gray-50">
                           <p className="text-xs font-bold text-gray-900">{q.question}</p>
                           <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-600 italic">
                             {answer || "Nenhuma resposta fornecida."}
                           </div>
                           
                           {feedback ? (
                             <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2">
                               <div className="flex items-center gap-2 text-indigo-600">
                                 <Brain size={14} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Feedback da IA</span>
                               </div>
                               <p className="text-xs text-indigo-900 leading-relaxed whitespace-pre-wrap">{feedback}</p>
                             </div>
                           ) : (
                             <button
                               disabled={!answer || isEvaluating}
                               onClick={() => getWritingFeedback(sIdx, qAbsoluteIdx)}
                               className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                             >
                               {isEvaluating ? (
                                 <>
                                   <Loader2 className="animate-spin" size={14} /> Avaliando...
                                 </>
                               ) : (
                                 <>
                                   <Sparkles size={14} /> Obter Feedback da IA
                                 </>
                               )}
                             </button>
                           )}
                        </div>
                      );
                    });
                  })}
                </div>
              )}

              <div className="bg-indigo-900 text-white p-6 rounded-[32px] flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Taxa de Acerto</p>
                  <p className="text-xl font-bold">{correct} <span className="text-xs opacity-50">/ {total} questões</span></p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
              </div>
           </div>

           <button onClick={onClose} className="w-full bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-[28px] font-bold text-lg shadow-sm active:scale-95 transition-all">
             Voltar ao Simulador
           </button>
        </div>
      )}
    </motion.div>
  );
}
