import React from 'react';
import { auth } from '../services/firebaseConfig';
import { Crown, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface RequiresAuthProps {
  children: React.ReactNode;
  isGuest: boolean;
  title?: string;
}

export function RequiresAuth({ children, isGuest, title = "Conteúdo Exclusivo" }: RequiresAuthProps) {
  if (!isGuest) return <>{children}</>;

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("RequiresAuth Login error:", error);
    }
  };

  return (
    <div className="relative group h-full">
      {/* Blurred preview of content */}
      <div className="blur-[4px] pointer-events-none select-none opacity-30 h-full overflow-hidden">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[4px] p-8 text-center transition-all bg-gradient-to-b from-white/10 to-white/80">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6 max-w-[280px]"
        >
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200">
            <Crown size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{title}</h3>
            <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase tracking-widest">
              Faça login para desbloquear <br /> todas as ferramentas.
            </p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all mx-auto"
          >
            <LogIn size={18} />
            Entrar com Google
          </button>
        </motion.div>
      </div>
    </div>
  );
}
