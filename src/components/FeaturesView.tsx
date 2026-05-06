import { 
  Book, 
  Brain, 
  Ghost, 
  History, 
  Library, 
  MessageCircle, 
  Search, 
  Mic, 
  FileText, 
  GraduationCap, 
  Activity, 
  Flame, 
  Download, 
  Settings,
  ChevronRight,
  Sparkles,
  Layout,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface FeaturesViewProps {
  onNavigate: (feature: string) => void;
  onClose: () => void;
}

const FEATURE_PACKS = [
  {
    title: 'Aprendizado & Conteúdo',
    items: [
      { id: 'grammar', icon: Brain, label: 'Gramática Completa', desc: 'Mapa de tópicos e exercícios adaptativos' },
      { id: 'library', icon: Library, label: 'Biblioteca', desc: 'Textos graduados e áudios' },
      { id: 'phrasebook', icon: Ghost, label: 'Guia de Gírias', desc: 'Expressões regionais e girias' },
      { id: 'conjugator', icon: Activity, label: 'Conjugador', desc: 'Milhares de verbos em todos os tempos' },
    ]
  },
  {
    title: 'Treino & Memória',
    items: [
      { id: 'srs', icon: History, label: 'Revisão SRS', desc: 'Sistema de repetição espaçada' },
      { id: 'dictation', icon: Mic, label: 'Ditado Digital', desc: 'Treine sua audição e escrita' },
      { id: 'reading', icon: FileText, label: 'Leitura Snack', desc: 'Textos curtos para consumo rápido' },
    ]
  },
  {
    title: 'Preparação & Exames',
    items: [
      { id: 'exam', icon: GraduationCap, label: 'DELE/SIELE', desc: 'Simulados e dicas específicas' },
      { id: 'placement', icon: Target, label: 'Teste de Nível', desc: 'Avalie seu espanhol agora' },
    ]
  },
  {
    title: 'Inteligência Artificial',
    items: [
      { id: 'tutor', icon: Sparkles, label: 'AI Tutor', desc: 'Explicações e correção de erros' },
      { id: 'conversation', icon: MessageCircle, label: 'Chat de Voz AI', desc: 'Role-play interativo em tempo real' },
    ]
  }
];

export default function FeaturesView({ onNavigate, onClose }: FeaturesViewProps) {
  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col max-w-md mx-auto">
      <header className="p-6 bg-primary text-white space-y-2">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-display font-bold">Recursos</h1>
            <button onClick={onClose} className="opacity-60 font-bold">FECHAR</button>
        </div>
        <p className="text-white/70 text-sm">Explore todas as ferramentas do Portunol.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
        {FEATURE_PACKS.map((pack) => (
          <section key={pack.title} className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{pack.title}</h2>
            <div className="grid gap-3">
              {pack.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4 text-left shadow-sm active:scale-[0.98] transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.label}</h3>
                    <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Target({ size }: { size: number }) {
  return <Layout size={size} />;
}
