import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Volume2, Plus, Bookmark, ChevronLeft, Type } from 'lucide-react';
import { LibraryItem } from '../types';
import { cn } from '../lib/utils';
import { audioService } from '../services/audioService';

interface GradedReaderProps {
  item: LibraryItem;
  onClose: () => void;
  onSaveWord: (word: string, translation: string) => void;
}

export default function GradedReader({ item, onClose, onSaveWord }: GradedReaderProps) {
  const [selectedWord, setSelectedWord] = useState<{ word: string, rect: DOMRect | null } | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isTranslating, setIsTranslating] = useState(false);

  // Simulação de tradutor (em produção usaria uma API de dicionário ou Gemini)
  const mockTranslate = async (word: string) => {
    setIsTranslating(true);
    // Simulando delay de rede
    await new Promise(r => setTimeout(r, 300));
    const dict: Record<string, string> = {
      'madrid': 'Madri',
      'españa': 'Espanha',
      'hermosos': 'lindos/belos',
      'gente': 'pessoas',
      'amable': 'amável/gentil',
      'comida': 'comida',
      'deliciosa': 'deliciosa',
      'especialmente': 'especialmente',
      'churros': 'churros',
      'chocolate': 'chocolate',
      'oro': 'ouro',
      'selva': 'selva/floresta',
      'hidalgo': 'fidalgo/nobre',
      'lanza': 'lança',
      'rocín': 'pangaré/cavalo ruim',
      'flaco': 'magro',
    };
    
    const cleanWord = word.toLowerCase().replace(/[.,!?;:()]/g, '');
    setTranslation(dict[cleanWord] || 'Tradução não encontrada');
    setIsTranslating(false);
  };

  const handleWordClick = (word: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectedWord({ word, rect });
    mockTranslate(word);
  };

  const words = item.content.split(' ');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-white z-[500] flex flex-col max-w-md mx-auto"
    >
      {/* Header */}
      <header className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center">
           <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
            {item.level} • {item.type === 'reading' ? 'Leitura' : 'Transcrição'}
           </span>
           <h2 className="text-sm font-bold truncate px-4">{item.title}</h2>
        </div>
        <button 
          onClick={() => setFontSize(f => f === 'sm' ? 'md' : f === 'md' ? 'lg' : 'sm')}
          className="p-2 text-gray-400"
        >
          <Type size={20} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#F9F7F2]">
        <div className={cn(
          "leading-relaxed font-serif text-gray-800 transition-all duration-300",
          fontSize === 'sm' ? 'text-lg' : fontSize === 'md' ? 'text-xl' : 'text-2xl'
        )}>
          {words.map((word, i) => (
            <span 
              key={i} 
              onClick={(e) => handleWordClick(word, e)}
              className={cn(
                "inline-block cursor-pointer hover:bg-primary/10 rounded px-0.5 transition-colors",
                selectedWord?.word === word ? "bg-primary/20 text-primary font-medium" : ""
              )}
            >
              {word}{' '}
            </span>
          ))}
        </div>
        <div className="h-32" /> {/* Spacer for popup */}
      </div>

      {/* Translation Popup */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-0 inset-x-0 p-6 bg-white border-t rounded-t-[40px] shadow-2xl z-20"
          >
             <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                   <h3 className="text-2xl font-display font-bold text-gray-900">{selectedWord.word.replace(/[.,!?;:()]/g, '')}</h3>
                   <div className="flex items-center gap-2 text-primary">
                      <button 
                        onClick={() => audioService.speak(selectedWord.word.replace(/[.,!?;:()]/g, ''))}
                        className="p-1.5 bg-primary/10 rounded-lg active:scale-90 transition-all"
                      >
                        <Volume2 size={16} />
                      </button>
                      <span className="text-xs font-bold uppercase tracking-widest">Pronunciar</span>
                   </div>
                </div>
                <button onClick={() => setSelectedWord(null)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                   <X size={20} />
                </button>
             </div>

             <div className="bg-gray-50 p-5 rounded-2xl mb-6 relative overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tradução</p>
                {isTranslating ? (
                   <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                ) : (
                   <p className="text-lg font-medium text-gray-700">{translation}</p>
                )}
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={() => {
                    onSaveWord(selectedWord.word, translation || '');
                    setSelectedWord(null);
                  }}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                   <Bookmark size={18} /> Salvar no SRS
                </button>
                <button className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">
                   <Plus size={18} />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
