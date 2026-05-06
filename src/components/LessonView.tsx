import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Volume2, 
  Mic, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Activity,
  Plus,
  Play,
  SkipForward
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonContent, Module, SRSItem } from '../types';
import { cn } from '../lib/utils';
import { CONFIG } from '../config';
import { audioService } from '../services/audioService';

interface LessonViewProps {
  module: Module;
  onClose: () => void;
  onComplete: (moduleId: string) => void;
  onAddToSRS: (item: SRSItem) => void;
}

export default function LessonView({ module, onClose, onComplete, onAddToSRS }: LessonViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [clozeValue, setClozeValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [showingDictation, setShowingDictation] = useState(false);
  
  const currentLesson = module.lessons[currentIndex];
  const progress = ((currentIndex) / module.lessons.length) * 100;

  const handleCheck = () => {
    let correct = false;
    if (currentLesson.type === 'multiple-choice') {
      correct = selectedOption === currentLesson.answer;
    } else if (currentLesson.type === 'cloze' || currentLesson.type === 'writing' || currentLesson.type === 'dictation') {
      correct = clozeValue.toLowerCase().trim() === currentLesson.answer.toLowerCase().trim();
    } else if (currentLesson.type === 'flashcard') {
      correct = true;
    } else if (currentLesson.type === 'speaking') {
      correct = true; // Simplified for demo
      setSpeakingScore(Math.floor(Math.random() * 21) + 80); // 80-100 range
    }

    setIsCorrect(correct);
    if (correct) {
      if (currentIndex === module.lessons.length - 1) {
        confetti({ 
          particleCount: 150, 
          spread: 70, 
          origin: { y: 0.6 },
          colors: ['#00C853', '#B2FF59', '#64DD17']
        });
      }
    } else {
      // Haptic/Shake simulation
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const handleNext = () => {
    if (currentIndex < module.lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowAnswer(false);
      setClozeValue('');
      setSpeakingScore(null);
    } else {
      onComplete(module.id);
    }
  };

  const addToSRS = () => {
    onAddToSRS({
      id: Math.random().toString(36).substr(2, 9),
      front: currentLesson.audioText || currentLesson.question,
      back: currentLesson.type === 'multiple-choice' || currentLesson.type === 'cloze' ? currentLesson.answer : "Tradução pendente",
      dueDate: Date.now() + 86400000,
      example: "",
      source: 'manual',
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5
    } as any);
  };

  const startListening = () => {
     if (!('webkitSpeechRecognition' in window)) {
        alert("Reconhecimento de voz não suportado neste navegador.");
        return;
     }
     
     setIsListening(true);
     // @ts-ignore
     const recognition = new webkitSpeechRecognition();
     recognition.lang = 'es-ES';
     recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setClozeValue(transcript);
        setIsListening(false);
     };
     recognition.onerror = () => setIsListening(false);
     recognition.onend = () => setIsListening(false);
     recognition.start();
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans max-w-md mx-auto">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <button onClick={addToSRS} className="p-2 text-primary bg-primary/10 rounded-xl">
           <Plus size={20} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentLesson.type === 'speaking' ? 'Treinador de Voz' : 
                 currentLesson.type === 'dictation' ? 'Ditado: Ouça e Escreva' : 
                 'Aprenda Espanhol'}
              </h2>
              {currentLesson.context && (
                <p className="text-gray-500 text-sm flex items-center gap-1">
                   <HelpCircle className="w-4 h-4" /> {currentLesson.context}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 py-8">
              <div className="bg-primary-container p-8 rounded-[40px] shadow-sm relative group w-full">
                <p className={cn(
                  "text-2xl font-medium text-center text-on-primary-container",
                  currentLesson.type === 'dictation' && "blur-md select-none"
                )}>
                  {currentLesson.question}
                </p>
                <div className="absolute -right-2 -bottom-2 flex gap-2">
                  <div className="bg-white flex rounded-2xl shadow-lg border overflow-hidden">
                    {[0.75, 1, 1.25].map(rate => (
                      <button 
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={cn(
                          "px-3 py-2 text-[10px] font-bold transition-colors",
                          playbackRate === rate ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-50"
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => audioService.speak(currentLesson.audioText || currentLesson.question)}
                    className="bg-primary text-white shadow-lg p-4 rounded-2xl active:scale-90 transition-transform"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {currentLesson.hint && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm flex items-center gap-2">
                   <AlertCircle className="w-4 h-4" /> {currentLesson.hint}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              {currentLesson.type === 'multiple-choice' && currentLesson.options?.map((option, i) => (
                <button
                  key={`opt-${i}`}
                  onClick={() => !isCorrect && setSelectedOption(option)}
                  className={cn(
                    "w-full p-5 rounded-3xl border-2 text-left font-bold transition-all text-lg",
                    selectedOption === option 
                      ? "border-primary bg-primary-container text-primary" 
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  {option}
                </button>
              ))}

              {(currentLesson.type === 'cloze' || currentLesson.type === 'writing' || currentLesson.type === 'dictation') && (
                <textarea
                  value={clozeValue}
                  onChange={(e) => setClozeValue(e.target.value)}
                  placeholder={currentLesson.type === 'dictation' ? "Ouça o áudio e escreva aqui..." : "Sua resposta..."}
                  className="w-full p-6 text-xl rounded-[32px] border-2 border-gray-100 focus:border-primary focus:outline-none transition-colors min-h-[120px] resize-none"
                  autoFocus
                />
              )}

              {currentLesson.type === 'speaking' && (
                <div className="flex flex-col items-center gap-8">
                   <div className="relative">
                      <motion.div 
                        animate={isListening ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-primary/20 rounded-full -z-10" 
                      />
                      <button
                        onClick={startListening}
                        className={cn(
                          "w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-xl",
                          isListening ? "bg-red-500 scale-105" : "bg-primary"
                        )}
                      >
                        <Mic className="w-10 h-10 text-white" />
                      </button>
                   </div>
                   
                   {speakingScore && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center w-full"
                     >
                       <div className="flex items-center justify-center gap-2 text-orange-600 font-bold mb-1">
                          <Activity size={18} /> Pontuação de Voz
                       </div>
                       <div className="text-4xl font-bold text-orange-950">{speakingScore}%</div>
                       <p className="text-[10px] text-orange-500 uppercase tracking-widest mt-2">Nativo: Excelente</p>
                     </motion.div>
                   )}
                   
                   {clozeValue && !speakingScore && (
                     <div className="bg-gray-50 p-6 rounded-3xl font-medium italic text-center w-full border border-dashed border-gray-200">
                        "{clozeValue}"
                     </div>
                   )}
                </div>
              )}

              {currentLesson.type === 'flashcard' && (
                <div 
                   onClick={() => setShowAnswer(true)}
                   className="flex flex-col items-center justify-center h-56 bg-primary/5 border-4 border-dashed border-primary/20 rounded-[48px] cursor-pointer"
                >
                   <AnimatePresence mode="wait">
                     {showAnswer ? (
                       <motion.div 
                         key="ans"
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="text-center p-6"
                       >
                          <p className="text-4xl font-bold text-primary">{currentLesson.answer}</p>
                          <p className="text-xs text-gray-400 mt-4">Pressione continuar para prosseguir</p>
                       </motion.div>
                     ) : (
                       <motion.div key="hint" className="flex flex-col items-center gap-4 text-gray-400">
                          <Play size={40} className="text-primary/40" />
                          <span className="font-bold uppercase tracking-widest">Toque para ver</span>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Feedback */}
      <footer className={cn(
        "p-6 transition-colors border-t border-gray-100",
        isCorrect === true ? "bg-green-50" : isCorrect === false ? "bg-red-50" : "bg-white"
      )}>
        <div className="max-w-md mx-auto space-y-4">
          {isCorrect !== null && (
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              )}>
                {isCorrect ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
              </div>
              <div className="flex-1">
                <h4 className={cn("font-bold text-lg leading-tight", isCorrect ? "text-green-800" : "text-red-800")}>
                  {isCorrect ? "Muito bem!" : "Tente no SRS depois"}
                </h4>
                {!isCorrect && (
                  <p className="text-red-700 font-bold">Resposta correta: {currentLesson.answer}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-5 gap-3">
            {isCorrect === null ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const credits = Number(window.localStorage.getItem('ai_credits') || '0');
                    if (credits < CONFIG.iaCredits.skipLessonCost) {
                       alert(`Créditos insuficientes! Você precisa de ${CONFIG.iaCredits.skipLessonCost} créditos.`);
                       return;
                    }
                    if (confirm(`Pular esta lição por ${CONFIG.iaCredits.skipLessonCost} créditos?`)) {
                       // Disparar evento para o App.tsx processar a dedução e persistência
                       window.dispatchEvent(new CustomEvent('deduct-credits', { detail: CONFIG.iaCredits.skipLessonCost }));
                       // Avançar localmente
                       handleCheck();
                       setIsCorrect(true);
                    }
                  }}
                  className="col-span-1 py-5 bg-gray-100 text-gray-400 rounded-3xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title="Pular com créditos"
                >
                  <SkipForward size={24} />
                </button>
                <button
                  onClick={handleCheck}
                  disabled={
                    (currentLesson.type === 'multiple-choice' && !selectedOption) ||
                    ((currentLesson.type === 'cloze' || currentLesson.type === 'writing' || currentLesson.type === 'dictation') && !clozeValue) ||
                    (currentLesson.type === 'speaking' && !clozeValue)
                  }
                  className="col-span-4 py-5 bg-primary text-white rounded-3xl font-bold shadow-xl shadow-primary/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  {currentLesson.type === 'flashcard' ? "ENTENDI" : "VERIFICAR RESPOSTA"}
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className={cn(
                  "col-span-5 py-5 rounded-3xl font-bold shadow-xl transition-all active:scale-95",
                  isCorrect ? "bg-green-600 text-white shadow-green-200" : "bg-gray-800 text-white"
                )}
              >
                CONTINUAR
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
