import { 
  Sparkles, 
  Book, 
  Library, 
  MessageCircle, 
  Brain, 
  Mic, 
  FileText, 
  GraduationCap, 
  Activity, 
  Flame, 
  Settings,
  ChevronRight,
  Layout,
  Award,
  Search,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { CONFIG } from '../config';
import { useMemo } from 'react';

interface ResourcesCenterProps {
  onNavigate: (feature: string) => void;
  onClose: () => void;
}

const RESOURCES = [
  {
    title: 'Inteligência Artificial',
    items: [
      { id: 'ai-tutor', icon: Brain, label: 'Tutor Personalizado', desc: 'Sua dúvida resolvida pela IA', color: 'bg-indigo-50 text-indigo-600' },
      { id: 'ai-conversation', icon: MessageCircle, label: 'Chat de Voz/Texto', desc: 'Roleplay em espanhol real', color: 'bg-orange-50 text-orange-600' },
      { id: 'ai-writing', icon: FileText, label: 'Coach de Escrita', desc: 'Correção profunda de textos', color: 'bg-blue-50 text-blue-600' },
    ]
  },
  {
    title: 'Ferramentas de Estudo',
    items: [
      { id: 'dictionary', icon: Search, label: 'Dicionário PT-ES', desc: 'O melhor tradutor com IA', color: 'bg-gray-50 text-gray-700' },
      { id: 'conjugator', icon: Activity, label: 'Conjugador Pro', desc: 'Todos os verbos e tempos', color: 'bg-red-50 text-red-600' },
      { id: 'false-friends', icon: AlertTriangle, label: 'Falsos Amigos', desc: 'Palavras que te enganam', color: 'bg-orange-50 text-orange-600' },
    ]
  },
  {
    title: 'Certificação',
    items: [
      { id: 'exams', icon: GraduationCap, label: 'Preparatório DELE/SIELE', desc: 'Simulados reais cronometrados', color: 'bg-purple-50 text-purple-600' },
      { id: 'placement', icon: TargetIcon, label: 'Teste de Nivelamento', desc: 'Saiba onde você está agora', color: 'bg-yellow-50 text-yellow-600' },
    ]
  },
  {
    title: 'Imersão',
    items: [
      { id: 'library', icon: Library, label: 'Biblioteca Snack', desc: 'Textos curtos e áudios', color: 'bg-pink-50 text-pink-600' },
      { id: 'ideas', icon: Award, label: 'Ideias de Aprendizado', desc: 'Desafios práticos diários', color: 'bg-emerald-50 text-emerald-600' },
      { id: 'regional', icon: Globe, label: 'Guia de Gírias', desc: 'México, Argentina e mais', color: 'bg-teal-50 text-teal-600' },
    ]
  }
];

export default function ResourcesCenter({ onNavigate, onClose }: ResourcesCenterProps) {
  const filteredResources = useMemo(() => {
    return RESOURCES.map(pack => ({
      ...pack,
      items: pack.items.filter(item => {
        if (item.id === 'ai-tutor' || item.id === 'ai-conversation') return CONFIG.featureFlags.aiTutor;
        if (item.id === 'ai-writing') return CONFIG.featureFlags.writingAssistant;
        return true;
      })
    })).filter(pack => pack.items.length > 0);
  }, [CONFIG.featureFlags]);

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col max-w-md mx-auto">
      <header className="p-8 bg-gray-900 text-white space-y-2">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-display font-bold">Recursos</h1>
            <button onClick={onClose} className="opacity-40 hover:opacity-100"><Settings size={24} /></button>
        </div>
        <p className="text-gray-400 text-sm">Explore todas as ferramentas de maestria.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-gray-50 pb-24">
        {filteredResources.map((pack) => (
          <section key={pack.title} className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{pack.title}</h2>
            <div className="grid gap-3">
              {pack.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center gap-5 text-left shadow-sm active:scale-[0.98] transition-all group"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", item.color)}>
                    <item.icon size={28} />
                  </div>
                  <div className="flex-1 space-y-0.5">
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

function HistoryIcon({ size }: { size: number }) { return <Activity size={size} className="rotate-180" /> }
function TargetIcon({ size }: { size: number }) { return <Award size={size} /> }
