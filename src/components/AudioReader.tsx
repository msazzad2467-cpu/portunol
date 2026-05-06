import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  ChevronLeft, 
  Volume2, 
  Languages,
  MessageCircle,
  SkipForward,
  Zap,
  SkipBack,
  Gauge
} from 'lucide-react';
import { LibraryItem } from '../types';
import { cn } from '../lib/utils';
import { audioService } from '../services/audioService';

interface AudioReaderProps {
  item: LibraryItem;
  onClose: () => void;
}

export default function AudioReader({ item, onClose }: AudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  
  const words = item.content.split(' ');

  // Simular progresso e sincronia de texto
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + (0.5 * playbackRate);
        });
        
        // Simular destaque de palavras baseado no progresso
        setActiveWordIndex(Math.floor((progress / 100) * words.length));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackRate, progress, words.length]);

  const togglePlay = () => {
    if (!isPlaying) {
      audioService.speak(item.content);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-white z-[500] flex flex-col max-w-md mx-auto overflow-hidden"
    >
      {/* Header Estilizado */}
      <header className="p-6 flex items-center justify-between">
        <button onClick={onClose} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-1">Audição Nível {item.level}</p>
            <h2 className="text-sm font-bold truncate max-w-[200px]">{item.title}</h2>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        {/* Cover Art / Visualizer */}
        <div className="aspect-square w-full rounded-[48px] bg-gradient-to-br from-orange-400 to-orange-600 mb-8 relative overflow-hidden shadow-2xl shadow-orange-200 flex items-center justify-center group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <motion.div 
              animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="z-10 bg-white/20 p-8 rounded-full backdrop-blur-md"
            >
                <Volume2 size={48} className="text-white" />
            </motion.div>
            
            {/* Visualizer Lines */}
            <div className="absolute bottom-6 flex gap-1 items-end h-12">
               {[...Array(12)].map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? [12, Math.random() * 40 + 10, 12] : 4 }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                    className="w-1 bg-white/40 rounded-full"
                 />
               ))}
            </div>
        </div>

        {/* Dynamic Transcript */}
        <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 flex-1 mb-8 relative">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <Languages size={12} className="text-orange-500" /> Transcrição Dinâmica
              </h3>
              <button 
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-[10px] font-bold text-orange-500 hover:bg-orange-50 px-3 py-1 rounded-full transition-colors"
                >
                {showTranscript ? 'OCULTAR' : 'MOSTRAR'}
              </button>
           </div>
           
           <AnimatePresence>
             {showTranscript && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className="text-lg leading-relaxed text-gray-700 font-medium overflow-y-auto max-h-[160px] no-scrollbar"
               >
                 {words.map((word, i) => (
                   <span 
                    key={i}
                    className={cn(
                      "transition-colors duration-200 inline-block mr-1.5",
                      i === activeWordIndex ? "text-orange-600 bg-orange-100 px-1 rounded-lg scale-110 font-bold" : i < activeWordIndex ? "text-gray-400" : ""
                    )}
                   >
                     {word}
                   </span>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
           
           {!showTranscript && (
             <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <MessageCircle size={32} className="text-gray-200 mb-2" />
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Foco total no áudio ativado</p>
             </div>
           )}
        </div>

        {/* Audio Controls */}
        <div className="space-y-6">
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400">
                 <span>0:{Math.floor((progress/100) * 60).toString().padStart(2, '0')}</span>
                 <span>0:60</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden cursor-pointer">
                 <motion.div 
                   className="h-full bg-orange-500" 
                   animate={{ width: `${progress}%` }}
                 />
              </div>
           </div>

           <div className="flex items-center justify-between gap-4">
              <button 
                onClick={() => setPlaybackRate(r => r === 1 ? 0.75 : r === 0.75 ? 1.25 : r === 1.25 ? 1.5 : 1)}
                className="w-12 h-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl group active:scale-95 transition-all"
              >
                 <Gauge size={18} className="text-gray-400 group-hover:text-orange-500" />
                 <span className="text-[8px] font-bold text-gray-500">{playbackRate}x</span>
              </button>

              <div className="flex items-center gap-4">
                <button className="p-3 text-gray-400 hover:text-orange-500 transition-colors">
                  <SkipBack size={24} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 bg-orange-500 text-white rounded-[32px] flex items-center justify-center shadow-xl shadow-orange-200 active:scale-90 transition-all"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button className="p-3 text-gray-400 hover:text-orange-500 transition-colors">
                  <SkipForward size={24} />
                </button>
              </div>

              <button className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl group active:scale-95 transition-all">
                 <RotateCcw size={18} className="text-gray-400 group-hover:text-orange-500" />
              </button>
           </div>
        </div>
      </div>

      {/* Footer Stats & Ad */}
      <footer className="p-6 bg-gray-50 border-t space-y-4">
         <div className="flex justify-around">
            <div className="text-center">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">XP Ganho</p>
               <p className="text-sm font-bold text-gray-700">+{Math.floor(progress/5)} XP</p>
            </div>
            <div className="text-center border-x border-gray-200 px-8">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Compreensão</p>
               <p className="text-sm font-bold text-green-500">85%</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tempo</p>
               <p className="text-sm font-bold text-gray-700">1:00</p>
            </div>
         </div>
         <div className="bg-white border rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Zap size={14} fill="currentColor" />
               </div>
               <span className="text-[9px] font-bold text-gray-400 leading-tight">Quer baixar este áudio?<br/><span className="text-primary">VEJA UM VÍDEO</span></span>
            </div>
            <button className="px-3 py-1.5 bg-primary text-white text-[8px] font-bold rounded-lg uppercase">Baixar</button>
         </div>
      </footer>
    </motion.div>
  );
}
