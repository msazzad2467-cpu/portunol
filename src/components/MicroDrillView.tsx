import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Mic, Volume2, CheckCircle, Send, Play, AlertCircle, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';
import { cn } from '../lib/utils';

interface MicroDrillProps {
  type: 'listening' | 'writing' | 'speaking' | 'grammar';
  title: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function MicroDrillView({ type, title: initialTitle, onClose, onComplete }: MicroDrillProps) {
  const [step, setStep] = useState<'intro' | 'loading' | 'action' | 'success' | 'error'>('intro');
  const [title, setTitle] = useState(initialTitle);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [targetPhrase, setTargetPhrase] = useState('');
  const [task, setTask] = useState('');

  const generateContent = async (selectedTitle?: string) => {
    setStep('loading');
    try {
      const content = await aiService.generateDrillContent(type, selectedTitle || title);
      setTargetPhrase(content.phrase);
      setTask(content.task || 'Repita a frase abaixo com clareza:');
      if (selectedTitle) setTitle(selectedTitle);
      setStep('action');
      setAnswer('');
      setFeedback(null);
    } catch (error) {
      console.error(error);
      // Fallback
      setTargetPhrase(type === 'speaking' ? 'La guitarra rápida de Ramón.' : 'Hola, ¿cómo estás?');
      setTask('Repita a frase abaixo:');
      setStep('action');
    }
  };

  const SPEAKING_TOPICS = [
    { id: 'R Vibrante', label: 'R Vibrante (rr)', desc: 'Perro, carro, Roma' },
    { id: 'J e G', label: 'Letras J e G', desc: 'Jamón, gente, jueves' },
    { id: 'LL e Y', label: 'Letras LL e Y', desc: 'Llama, playa, pollo' },
    { id: 'B e V', label: 'Letras B e V', desc: 'Bebida, vivir, ventana' },
    { id: 'Ñ', label: 'Letra Ñ', desc: 'Mañana, niño, español' },
    { id: 'Z e C', label: 'Letras Z e C', desc: 'Zapato, cielo, azul' },
    { id: 'H muda', label: 'Letra H', desc: 'Hola, hacer, huevo' },
    { id: 'S e X', label: 'Letras S e X', desc: 'Salsa, experto, éxito' },
    { id: 'D e T', label: 'Letras D e T', desc: 'Dado, todo, dental' },
    { id: 'Ditongos', label: 'Ditongos', desc: 'Auto, baile, ciudad' },
    { id: 'Entonação', label: 'Entonação', desc: 'Frases interrogativas' },
    { id: 'Acentuação', label: 'Acentuação', desc: 'Palavras agudas e graves' }
  ];

  useEffect(() => {
    // If not speaking, or if title is specific, generate content automatically
    if (type !== 'speaking' || (initialTitle !== 'Pronúncia' && initialTitle !== 'speaking')) {
      generateContent();
    }
  }, []);

  const handleStartRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setIsRecording(false);
      alert("Erro ao capturar voz. Tente novamente.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleVerify = async () => {
    if (!answer.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const context = type === 'speaking' 
        ? `Exercício de pronúncia. O usuário deve falar exatamente: "${targetPhrase}". Ele falou: "${answer}". Verifique se a pronúncia/transcrição está próxima o suficiente e dê uma dica curta em português sobre como melhorar ou o que ele errou.` 
        : `Exercício de ${type}.`;
      
      const result = await aiService.correct(answer, context);
      
      if (result.isCorrect) {
        setStep('success');
      } else {
        setFeedback(result.explanationPt);
        setStep('error');
      }
    } catch (error) {
      console.error(error);
      setStep('success'); // Fallback to avoid blocking
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playTarget = () => {
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-white z-[400] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              type === 'speaking' ? "bg-orange-500" : "bg-primary"
            )} />
            <h2 className="font-bold text-gray-400 text-xs uppercase tracking-widest">{type} Micro-Drill</h2>
         </div>
         <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors"><X /></button>
      </header>

      <div className="flex-1 p-6 flex flex-col justify-center text-center space-y-8 overflow-y-auto">
         <AnimatePresence mode="wait">
           {step === 'intro' && (
             <motion.div 
               key="intro"
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6 py-4"
             >
                <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mx-auto">
                   {type === 'listening' ? <Volume2 size={32} /> : 
                    type === 'writing' ? <Send size={32} /> : <Mic size={32} />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{type === 'speaking' ? 'Treino de Pronúncia' : title}</h3>
                  <p className="text-gray-500 text-sm">Escolha um foco ou comece um treino aleatório.</p>
                </div>

                {type === 'speaking' && (
                  <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-4 pt-2">
                    {SPEAKING_TOPICS.map(topic => (
                      <button 
                        key={topic.id}
                        onClick={() => generateContent(topic.label)}
                        className="p-4 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl text-left transition-all active:scale-[0.98] group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900">{topic.label}</h4>
                            <p className="text-[10px] text-slate-500">{topic.desc}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => {
                    const randomTopic = SPEAKING_TOPICS[Math.floor(Math.random() * SPEAKING_TOPICS.length)];
                    generateContent(randomTopic.label);
                  }}
                  className="w-full bg-primary text-white py-5 rounded-[32px] font-bold shadow-xl shadow-primary/10 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  {type === 'speaking' ? 'Praticar Aleatório' : 'Começar Treino'}
                </button>
             </motion.div>
           )}

           {step === 'loading' && (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="space-y-6"
             >
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <Sparkles size={32} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Gerando Desafio...</h3>
                  <p className="text-sm text-gray-500">A IA está preparando algo especial para você.</p>
                </div>
             </motion.div>
           )}

           {step === 'action' && (
             <motion.div 
               key="action"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="space-y-8 flex-1 flex flex-col justify-center py-8"
             >
                {type === 'speaking' && (
                  <div className="space-y-8">
                     <div className="space-y-4">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{task}</p>
                       <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 relative group">
                          <p className="text-2xl font-display font-bold text-orange-900 leading-tight">
                            {targetPhrase}
                          </p>
                          <button 
                            onClick={playTarget}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-500 hover:scale-110 transition-transform"
                          >
                            <Volume2 size={18} />
                          </button>
                       </div>
                       
                       <button 
                        onClick={() => generateContent()}
                        className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 mx-auto"
                       >
                         <Sparkles size={12} /> Tentar outra frase
                       </button>
                     </div>

                     <div className="space-y-4 flex flex-col items-center">
                       <button 
                         onClick={handleStartRecording}
                         disabled={isRecording || isAnalyzing}
                         className={cn(
                           "w-32 h-32 rounded-full flex items-center justify-center transition-all relative",
                           isRecording ? "bg-red-500 text-white animate-pulse" : "bg-orange-500 text-white shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95"
                         )}
                       >
                         {isRecording ? <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" /> : null}
                         <Mic size={48} />
                       </button>
                       <p className={cn(
                         "text-sm font-bold",
                         isRecording ? "text-red-500 font-bold" : "text-gray-400"
                       )}>
                         {isRecording ? "OUVINDO..." : "TOQUE PARA FALAR"}
                       </p>
                     </div>

                     {answer && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600 text-sm">
                         "{answer}"
                       </motion.div>
                     )}
                  </div>
                )}

                {type === 'listening' && (
                  <div className="space-y-8">
                     <p className="text-gray-500">Ouça e complete a frase:</p>
                     <button 
                      onClick={playTarget}
                      className="w-32 h-32 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-orange-200"
                     >
                        <Play size={48} fill="currentColor" />
                     </button>
                     <div className="flex gap-2 justify-center">
                        <span className="text-3xl font-display font-medium border-b-2 border-gray-100 min-w-[40px]">H</span>
                        <span className="text-3xl font-display font-medium border-b-2 border-gray-100 min-w-[40px]">O</span>
                        <span className="text-3xl font-display font-medium border-b-2 border-primary min-w-[40px] text-primary">_</span>
                        <span className="text-3xl font-display font-medium border-b-2 border-gray-100 min-w-[40px]">A</span>
                     </div>
                  </div>
                )}

                {type === 'writing' && (
                  <div className="space-y-6 text-left">
                     <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-2">
                        <h4 className="font-bold text-xs">PROMPT:</h4>
                        <p className="text-gray-700">Explique como você chega ao trabalho em espanhol.</p>
                     </div>
                     <textarea 
                       value={answer}
                       onChange={(e) => setAnswer(e.target.value)}
                       placeholder="Escriba aquí..."
                       className="w-full h-40 bg-white border border-gray-200 rounded-3xl p-6 focus:ring-2 ring-primary/20 outline-none resize-none"
                     />
                  </div>
                )}

                <div className="mt-auto pt-8">
                   <button 
                     onClick={handleVerify}
                     disabled={!answer || isAnalyzing}
                     className="w-full bg-slate-900 text-white py-5 rounded-[32px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                   >
                     {isAnalyzing ? (
                       <>
                          <Sparkles size={18} className="animate-spin text-primary" />
                          Analisando com IA...
                       </>
                     ) : "Verificar"}
                   </button>
                </div>
             </motion.div>
           )}

           {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="space-y-6"
              >
                 <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
                    <CheckCircle size={48} />
                 </div>
                 <div className="space-y-2">
                  <h3 className="text-3xl font-bold">¡Excelente!</h3>
                  <p className="text-gray-500">Sua pronúncia está ótima. Você ganhou +10 XP e 1 Dica AI extra.</p>
                 </div>
                 <button 
                  onClick={onComplete}
                  className="w-full bg-primary text-white py-5 rounded-[32px] font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Continuar
                </button>
              </motion.div>
           )}

           {step === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="space-y-6"
              >
                 <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={48} />
                 </div>
                 <div className="space-y-3">
                   <h3 className="text-2xl font-bold">Quase lá!</h3>
                   <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-left">
                      <p className="text-sm text-red-900 leading-relaxed font-medium">
                        {feedback}
                      </p>
                   </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setStep('action')}
                      className="w-full bg-slate-900 text-white py-5 rounded-[32px] font-bold uppercase text-xs"
                    >
                      Tentar de novo
                    </button>
                    <button 
                      onClick={onComplete}
                      className="w-full bg-gray-100 text-gray-500 py-3 rounded-[32px] font-bold uppercase text-[10px] tracking-widest"
                    >
                      Pular por enquanto
                    </button>
                 </div>
              </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}

