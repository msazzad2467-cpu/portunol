import { 
  Settings, 
  ArrowLeft, 
  Wallet, 
  Trash2, 
  Download, 
  Shield, 
  Bell, 
  Eye, 
  Zap,
  Gift,
  MoreVertical,
  Check,
  Heart,
  ExternalLink,
  Globe,
  ChevronLeft,
  LogIn,
  User as UserIcon,
  CheckCircle,
  Cloud
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { isAdmin } from '../config';
import { signInWithGoogle, auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

interface SettingsProps {
  user: any;
  onUpdateProfile: (profile: any) => void;
  onClose: () => void;
  onEarnCredits: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'consent') => void;
  onOpenDebug: () => void;
}

export default function SettingsView({ user, onUpdateProfile, onClose, onEarnCredits, onOpenLegal, onOpenDebug }: SettingsProps) {
  const [adFrequency, setAdFrequency] = useState('normal');
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const isUserAdmin = isAdmin(currentUser?.email || user?.profile?.email || null);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      alert('Login falhou: ' + err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert('Sair falhou: ' + err);
    }
  };

  const accents = [
    { id: 'neutral', name: 'Neutro (LatAm)', flag: '🌎' },
    { id: 'mexican', name: 'Mexicano', flag: '🇲🇽' },
    { id: 'argentinian', name: 'Argentino (Rioplatense)', flag: '🇦🇷' },
    { id: 'spanish', name: 'Espanha (Castelhano)', flag: '🇪🇸' },
    { id: 'colombian', name: 'Colombiano', flag: '🇨🇴' },
  ];

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col max-w-md mx-auto">
      <header className="p-4 border-b flex items-center gap-4">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">Configurações</h2>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-12">
        <div className="p-6 space-y-8">
          
          {/* Authentication Status */}
          <section className="space-y-4">
             <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sincronização na Nuvem</h3>
             </div>
             <div className="bg-white border rounded-[32px] p-6 shadow-sm">
                {currentUser ? (
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email || 'guest'}`} 
                      className="w-12 h-12 rounded-full border-2 border-primary/20" 
                      alt="avatar" 
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate">{currentUser?.displayName || 'Usuário Logado'}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{currentUser?.email || 'Email não disponível'}</p>
                      {isAdmin(currentUser?.email) && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle size={10} className="text-green-500 fill-green-500/10" />
                          <span className="text-[9px] font-bold text-green-600 uppercase tracking-tighter">Administrador Verificado</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="text-[10px] font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-xs text-gray-500">Faça login para salvar seu progresso na nuvem e habilitar recursos de administrador.</p>
                    <button 
                      onClick={handleSignIn}
                      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xs"
                    >
                      <LogIn size={18} className="text-primary" /> ENTRAR COM GOOGLE
                    </button>
                  </div>
                )}
             </div>
          </section>

          {/* Target Accent */}
          <section className="space-y-4">
             <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sotaque de Foco</h3>
             </div>
             <div className="bg-white border rounded-3xl overflow-hidden divide-y">
                {accents.map((acc) => (
                   <button 
                     key={acc.id}
                     onClick={() => user?.profile && onUpdateProfile({ ...user.profile, targetAccent: acc.id })}
                     className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-all"
                   >
                     <div className="flex items-center gap-3">
                        <span className="text-2xl">{acc.flag}</span>
                        <span className="font-bold text-gray-700">{acc.name}</span>
                     </div>
                     {user?.profile?.targetAccent === acc.id && (
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                           <Check size={14} />
                        </div>
                     )}
                   </button>
                ))}
             </div>
          </section>

          {/* Why Ads? Section */}
          <section className="bg-white border-2 border-primary/20 p-6 rounded-[32px] space-y-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Heart size={80} fill="currentColor" className="text-primary" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Espanhol 100% Grátis
             </h3>
             <p className="text-xs text-gray-500 leading-relaxed">
                Nós removemos todas as assinaturas! Para manter o Portunol gratuito para sempre, exibimos anúncios que financiam nossas IAs e servidores. Aprenda sem limites, patrocinado por marcas incríveis.
             </p>
             <button 
                onClick={onEarnCredits}
                className="w-full bg-primary/10 text-primary py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-all text-xs"
             >
                <Zap size={14} fill="currentColor" /> GANHAR BÔNUS (VER ANÚNCIO)
             </button>
          </section>

          {/* Ad Transparency Note */}
          <div className="p-4 bg-gray-200/50 rounded-2xl space-y-2">
             <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Infraestrutura de Anúncios</span>
                <Shield size={12} />
             </div>
             <p className="text-[10px] text-gray-500 italic">
                Rede de Parceiros ativada. Exibindo anúncios certificados para garantir acesso ilimitado ao curso.
             </p>
          </div>

          {/* Download & Storage */}
          <section className="space-y-4">
             <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Acesso Offline</h3>
             </div>
             <div className="bg-white border rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                   <div>
                      <h4 className="font-bold">Espanhol Essencial A1</h4>
                      <p className="text-[10px] text-gray-400">45 MB • Desbloqueado com Ad</p>
                   </div>
                   <Trash2 className="text-gray-300 w-5 h-5" />
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full">
                   <div className="bg-green-500 h-full w-full rounded-full" />
                </div>
                <button className="w-full py-4 bg-gray-50 rounded-2xl text-[10px] font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                   GERENCIAR TODOS OS PACKS
                </button>
             </div>
          </section>

          {/* Backup & Sync */}
          <section className="space-y-4">
             <div className="flex items-center gap-2">
                <Download size={16} className="text-gray-400" />
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nuvem & Sincronização</h2>
             </div>
             <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-6">
                <div className="flex justify-between items-center">
                   <div>
                      <h3 className="font-bold">Backup na Nuvem</h3>
                      <p className="text-[10px] text-gray-400">Sincronize seu progresso (Opcional).</p>
                   </div>
                   <div className="w-12 h-6 bg-gray-100 rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                   </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm text-blue-600"><Settings size={16} /></div>
                   <div className="flex-1">
                      <p className="text-[10px] font-bold text-blue-900 mb-1">Nota de Desenvolvedor (app-ads.txt)</p>
                      <p className="text-[9px] text-blue-700 leading-tight">Para garantir a monetização correta, o arquivo app-ads.txt deve estar no domínio da Play Store.</p>
                   </div>
                </div>
             </div>
          </section>

          <footer className="space-y-4 pt-4">
             <button 
               onClick={() => onOpenLegal('privacy')}
               className="w-full py-5 bg-white border border-gray-100 text-gray-400 rounded-3xl font-bold flex items-center justify-center gap-2 text-sm"
             >
                Política de Privacidade <ExternalLink size={14} />
             </button>
             <button 
               onClick={() => onOpenLegal('terms')}
               className="w-full py-5 bg-white border border-gray-100 text-gray-400 rounded-3xl font-bold flex items-center justify-center gap-2 text-sm"
             >
                Termos de Uso <ExternalLink size={14} />
             </button>
             {isUserAdmin && (
                <button 
                  onDoubleClick={onOpenDebug}
                  className="w-full py-3 bg-transparent text-gray-200 rounded-3xl font-bold text-[8px] uppercase tracking-widest"
                >
                   Debug Monetização (Double Tap)
                </button>
             )}
             <button className="w-full py-5 bg-red-50 text-red-500 rounded-3xl font-bold border border-red-100 active:scale-95 transition-all">
                Sair da Conta
             </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
