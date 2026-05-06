import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  Layout,
  MessageCircle,
  Brain
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Level } from '../types';

interface Question {
  id: string;
  type: 'multiple-choice' | 'cloze' | 'listening' | 'reading';
  level: Level;
  question: string;
  options: string[];
  answer: string;
  audioText?: string;
  readingText?: string;
}

const PLACEMENT_QUESTIONS: Question[] = [
  // A1
  { id: 'a1-1', level: 'A1', type: 'multiple-choice', question: '¿Cómo se dice "Bom dia" en español?', options: ['Buenas noches', 'Hola', 'Buenos días', 'Hasta luego'], answer: 'Buenos días' },
  { id: 'a1-2', level: 'A1', type: 'multiple-choice', question: 'Yo ____ de Brasil.', options: ['ser', 'soy', 'es', 'somos'], answer: 'soy' },
  { id: 'a1-3', level: 'A1', type: 'multiple-choice', question: 'Juan ____ mi amigo.', options: ['es', 'está', 'ser', 'soy'], answer: 'es' },
  { id: 'a1-4', level: 'A1', type: 'multiple-choice', question: '¿_____ años tienes?', options: ['Cuántos', 'Cuál', 'Cómo', 'Qué'], answer: 'Cuántos' },

  // A2
  { id: 'a2-1', level: 'A2', type: 'multiple-choice', question: 'Mañana ____ al cine con mis amigos.', options: ['ir', 'voy', 'iré', 'fui'], answer: 'iré' },
  { id: 'a2-2', level: 'A2', type: 'multiple-choice', question: '¿Dónde ____ las llaves?', options: ['están', 'son', 'está', 'es'], answer: 'están' },
  { id: 'a2-3', level: 'A2', type: 'multiple-choice', question: 'Ayer ____ una película muy buena.', options: ['veo', 'vi', 'visto', 'veía'], answer: 'vi' },
  { id: 'a2-4', level: 'A2', type: 'multiple-choice', question: 'Me ____ mucho viajar.', options: ['gusta', 'gustan', 'gustar', 'gustó'], answer: 'gusta' },

  // B1
  { id: 'b1-1', level: 'B1', type: 'multiple-choice', question: 'No creo que ____ a llover hoy.', options: ['vaya', 'va', 'vayas', 'ir'], answer: 'vaya' },
  { id: 'b1-2', level: 'B1', type: 'multiple-choice', question: 'Cuando era niño, ____ mucho en el parque.', options: ['jugué', 'jugaba', 'jugar', 'juego'], answer: 'jugaba' },
  { id: 'b1-3', level: 'B1', type: 'multiple-choice', question: 'Espero que ____ bien en tu examen.', options: ['te sale', 'te salga', 'te salió', 'te saliera'], answer: 'te salga' },
  { id: 'b1-4', level: 'B1', type: 'multiple-choice', question: 'He ____ ya todos los deberes.', options: ['hecho', 'hacer', 'haciendo', 'hace'], answer: 'hecho' },

  // B2
  { id: 'b2-1', level: 'B2', type: 'multiple-choice', question: 'Si ____ más tiempo, estudiaría más.', options: ['tuviera', 'tenía', 'tenga', 'tubo'], answer: 'tuviera' },
  { id: 'b2-2', level: 'B2', type: 'multiple-choice', question: 'He ____ el libro que me prestaste.', options: ['leido', 'leyendo', 'leído', 'lear'], answer: 'leído' },
  { id: 'b2-3', level: 'B2', type: 'multiple-choice', question: 'No pidas perdón, a menos que ____ de corazón.', options: ['lo sientes', 'lo sientas', 'lo sentiste', 'lo sintieras'], answer: 'lo sientas' },

  // C1
  { id: 'c1-1', level: 'C1', type: 'multiple-choice', question: 'Es imprescindible que se ____ a cabo las reformas.', options: ['lleven', 'llevan', 'llevaran', 'llevasen'], answer: 'lleven' },
  { id: 'c1-2', level: 'C1', type: 'multiple-choice', question: 'A pesar de que ____ rico, vive muy humildemente.', options: ['es', 'sea', 'fuera', 'siendo'], answer: 'es' },
  { id: 'c1-3', level: 'C1', type: 'multiple-choice', question: '¡Quién ____ adivinarlo!', options: ['hubiera podido', 'haya podido', 'había podido', 'podrá'], answer: 'hubiera podido' },

  // C2
  { id: 'c2-1', level: 'C2', type: 'multiple-choice', question: 'Apenas ____ el sol, se puso en camino.', options: ['hubo despuntado', 'ha despuntado', 'despuntó', 'despuntara'], answer: 'hubo despuntado' },
  { id: 'c2-2', level: 'C2', type: 'multiple-choice', question: 'Hubiera sido mejor que se ____ en silencio.', options: ['estuviesen quedados', 'hubieran quedado', 'queden', 'habían quedado'], answer: 'hubieran quedado' },
];

export default function PlacementTest({ onComplete, onCancel }: { onComplete: (level: string) => void, onCancel: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = PLACEMENT_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / PLACEMENT_QUESTIONS.length) * 100;

  const handleAnswer = (ans: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: ans };
    setAnswers(newAnswers);
    
    if (currentIdx < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculatedLevel = useMemo(() => {
    let score = 0;
    const levelPoints: Record<Level, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
    let maxPossible = 0;

    PLACEMENT_QUESTIONS.forEach(q => {
      maxPossible += levelPoints[q.level];
      if (answers[q.id] === q.answer) {
        score += levelPoints[q.level];
      }
    });

    const ratio = score / maxPossible;
    if (ratio < 0.2) return 'A1';
    if (ratio < 0.4) return 'A2';
    if (ratio < 0.6) return 'B1';
    if (ratio < 0.8) return 'B2';
    if (ratio < 0.95) return 'C1';
    return 'C2';
  }, [answers]);

  return (
    <div className="fixed inset-0 bg-white z-[1000] flex flex-col max-w-md mx-auto">
      {!showResult ? (
        <>
          <header className="p-6 border-b flex items-center justify-between">
            <button onClick={onCancel} className="text-gray-400 p-2"><X /></button>
            <div className="flex-1 px-4">
               <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary" />
               </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 w-12 text-right">{currentIdx + 1}/{PLACEMENT_QUESTIONS.length}</span>
          </header>

          <div className="flex-1 flex flex-col p-8 space-y-12 overflow-y-auto">
             <div className="space-y-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">Referência: {currentQuestion.level}</span>
                <h2 className="text-2xl font-display font-bold leading-tight">{currentQuestion.question}</h2>
             </div>

             <div className="grid gap-3">
                {currentQuestion.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="p-6 bg-white border border-gray-100 rounded-3xl text-left font-medium hover:border-primary active:scale-[0.98] transition-all shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
             </div>
          </div>
        </>
      ) : (
        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-8">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center relative"
           >
              <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full animate-spin-slow" />
              <span className="text-6xl font-display font-bold text-primary">{calculatedLevel}</span>
           </motion.div>
           
           <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold">¡Excelente Trabajo!</h1>
              <p className="text-gray-500">Com base nas suas respostas, seu nível estimado é <span className="font-bold text-gray-900">{calculatedLevel}</span>.</p>
           </div>

           <div className="bg-gray-50 p-6 rounded-[32px] w-full space-y-4 border border-gray-100">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">O que isso significa?</p>
              <p className="text-sm leading-relaxed">
                 {calculatedLevel === 'A1' && "Você está dando os primeiros passos. Perfeito para aprender o básico e apresentações."}
                 {calculatedLevel === 'A2' && "Você já entende frases curtas e pode falar de temas cotidianos simples."}
                 {calculatedLevel === 'B1' && "Você consegue lidar com a maioria das situações em viagens e falar de desejos."}
                 {calculatedLevel === 'B2' && "Você entende ideias complexas e pode conversar de forma fluida."}
                 {calculatedLevel === 'C1' && "Você se expressa com facilidade e usa o idioma de forma flexível em contextos sociais."}
                 {calculatedLevel === 'C2' && "Você domina o idioma de forma quase nativa, compreendendo tudo o que ouve ou lê."}
              </p>
           </div>

           <button 
             onClick={() => onComplete(calculatedLevel)}
             className="w-full bg-primary text-white py-6 rounded-[32px] font-bold text-lg shadow-xl shadow-primary/20"
           >
             Começar agora no {calculatedLevel}
           </button>
        </div>
      )}
    </div>
  );
}
