import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import { userService } from './services/userService';
import { UserProfile, Level } from './types';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  User as UserIcon, 
  Crown, 
  Coins, 
  Zap,
  Mic,
  PenTool,
  History,
  LayoutDashboard,
  Dumbbell,
  GraduationCap,
  MessageCircle,
  Settings,
  X,
  Library
} from 'lucide-react';
import { cn } from './lib/utils';
import { CONFIG } from './config';

// Module Components
import { ConversationTutor } from './components/ConversationTutor';
import { SRSReview } from './components/SRSReview';
import { SkillRadarChart } from './components/SkillRadarChart';
import { LeagueBoard } from './components/LeagueBoard';
import { WritingExam } from './components/WritingExam';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StreakWidget } from './components/StreakWidget';
import { AchievementBadge } from './components/AchievementBadge';
import { OfflineFallback } from './components/OfflineFallback';
import { RequiresAuth } from './components/RequiresAuth';
import AdSimulation from './components/Ads';

import HomeView from './components/HomeView';
import AIView from './components/AIView';
import SettingsView from './components/SettingsView';
import DictionaryView from './components/DictionaryView';
import GradedReader from './components/GradedReader';
import PhrasebookView from './components/PhrasebookView';
import FalseFriendsView from './components/FalseFriendsView';
import MicroDrillView from './components/MicroDrillView';
import ExamHubView from './components/ExamHubView';
import CreditsStore from './components/CreditsStore';
import LibraryView from './components/LibraryView';
import CurriculumView from './components/CurriculumView';
import LessonView from './components/LessonView';
import PlacementTest from './components/PlacementTest';
import ConjugatorView from './components/ConjugatorView';
import { PortunholDetector } from './components/PortunholDetector';
import { PronunciationDrill } from './components/PronunciationDrill';
import { CURRICULUM, LEARNING_IDEAS } from './content';
import { srsService } from './services/srsService';
import { Module } from './types';
import ResourcesCenter from './components/ResourcesCenter';
import IdeasView from './components/IdeasView';

type Tab = 'home' | 'learn' | 'practice' | 'ia' | 'library' | 'profile' | 'admin';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [versionClicks, setVersionClicks] = useState(0);
  const [activeAd, setActiveAd] = useState<{ type: 'interstitial' | 'rewarded', rewardAmount: number } | null>(null);
  const [showStore, setShowStore] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showPlacement, setShowPlacement] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sub-navigation state
  const [activePractice, setActivePractice] = useState<'menu' | 'srs' | 'writing' | 'pronunciation' | 'portunhol' | 'exams' | 'drills'>('menu');
  const [activeLibrary, setActiveLibrary] = useState<'menu' | 'dictionary' | 'readers' | 'phrasebook' | 'false-friends'>('menu');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setIsGuest(false);
        const p = await userService.ensureUser(u.uid, u.email || '', u.displayName || 'Estudante');
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const handleDeductCredits = async (e: any) => {
      const amount = e.detail;
      if (user?.uid && profile) {
        // Here we could update Firestore, but let's just update local state for snappiness if needed
        // Ideally we update Firestore via userService
        await userService.addCoins(user.uid, -amount);
        const p = await userService.getUser(user.uid);
        setProfile(p);
      }
    };

    window.addEventListener('deduct-credits', handleDeductCredits);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('deduct-credits', handleDeductCredits);
      unsubscribe();
    };
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white"
        >
          <Zap size={32} />
        </motion.div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">DELE Simulador • Pro</p>
      </div>
    );
  }

  if (!user && !profile && !isGuest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl text-center space-y-8">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-indigo-100">
            <Crown size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">¡Bienvenido!</h1>
            <p className="text-gray-500 font-medium">Faça login para começar sua jornada rumo ao DELE.</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => handleLogin()}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all"
            >
              Entrar com Google
            </button>
            <button 
              onClick={() => setIsGuest(true)}
              className="w-full py-4 bg-white text-gray-500 rounded-2xl font-bold border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-sm"
            >
              Continuar como Convidado
            </button>
          </div>
          <div 
            className="pt-4 p-4 -m-4 transition-all cursor-pointer select-none"
            onClick={() => {
              const newCount = versionClicks + 1;
              setVersionClicks(newCount);
              if (newCount >= 7) {
                handleLogin(true);
                setVersionClicks(0);
              }
            }}
          >
            <p className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              versionClicks > 0 ? "text-indigo-600 opacity-100" : "text-gray-400 opacity-20"
            )}>
              DELE Simulador • v{CONFIG.version}
              {versionClicks > 0 && versionClicks < 7 && (
                <span className="ml-2 animate-pulse">
                   Tops restantes: {7 - versionClicks}
                </span>
              )}
              {versionClicks >= 7 && <span className="ml-2">Modo Admin Desbloqueado!</span>}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = (user?.email && CONFIG.adminEmails.includes(user.email)) || false;

  const handleLogin = async (asAdmin = false) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (asAdmin) {
        if (result.user.email && CONFIG.adminEmails.includes(result.user.email)) {
          setActiveTab('admin');
        } else {
          alert("Esta conta não possui privilégios de administrador.");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Erro ao entrar com Google.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <main className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-x-hidden">
        
        {isOffline && <OfflineFallback />}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activeTab === 'practice' ? activePractice : '')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="h-full flex flex-col"
            >
              {/* HOME TAB */}
              {activeTab === 'home' && (
                <HomeView 
                  user={profile}
                  onNavigate={(tab: string) => {
                    if (tab === 'placement') setShowPlacement(true);
                    else if (tab === 'resources') setShowResources(true);
                    else setActiveTab(tab as any);
                  }}
                  onOpenSRS={() => { setActiveTab('practice'); setActivePractice('srs'); }}
                  onOpenDictionary={() => setShowResources(true)}
                  onOpenTutor={() => setActiveTab('ia')}
                  onOpenConjugator={() => setShowResources(true)}
                  onOpenFeatures={() => setShowResources(true)}
                  onOpenSettings={() => setActiveTab('profile')} 
                  onOpenIdeas={() => setShowIdeas(true)}
                  onOpenDrill={(type: string, title: string) => {
                    if (type === 'grammar') setActivePractice('drills');
                    if (type === 'writing') setActivePractice('writing');
                    if (type === 'speaking') setActivePractice('pronunciation');
                    if (type === 'reading') { setActiveTab('library'); setActiveLibrary('readers'); }
                    setActiveTab('practice');
                  }}
                  onOpenModule={(id: string) => {
                    setActiveTab('learn');
                  }}
                  onCheckIn={async () => {
                    if (user?.uid) {
                      await userService.checkIn(user.uid);
                      const p = await userService.getUser(user.uid);
                      setProfile(p);
                    }
                  }}
                  onOpenStore={() => setShowStore(true)}
                  onUpgradeChest={() => setShowStore(true)}
                  onEarnCredits={async () => {
                    setActiveAd({ type: 'rewarded', rewardAmount: 50 });
                  }}
                />
              )}

              {/* LEARN TAB */}
              {activeTab === 'learn' && (
                <RequiresAuth isGuest={isGuest}>
                   <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
                    <AnimatePresence mode="wait">
                      {!selectedModule ? (
                        <motion.div 
                          key="curriculum"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full overflow-y-auto"
                        >
                          <CurriculumView 
                            modules={CURRICULUM}
                            userCredits={profile?.coins || 0}
                            onModuleSelect={setSelectedModule}
                            onUnlockModule={async (moduleId) => {
                              if (user?.uid && profile && profile.coins >= CONFIG.iaCredits.skipModuleCost) {
                                await userService.addCoins(user.uid, -CONFIG.iaCredits.skipModuleCost);
                                const p = await userService.getUser(user.uid);
                                setProfile(p);
                              }
                            }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="lesson"
                          initial={{ x: '100%' }}
                          animate={{ x: 0 }}
                          exit={{ x: '100%' }}
                          className="h-full"
                        >
                          <LessonView 
                            module={selectedModule}
                            onClose={() => setSelectedModule(null)}
                            onComplete={async (moduleId) => {
                               if (user?.uid) {
                                  await userService.updateXP(user.uid, 50);
                                  const p = await userService.getUser(user.uid);
                                  setProfile(p);
                               }
                               setSelectedModule(null);
                            }}
                            onAddToSRS={async (item) => {
                               if (user?.uid) {
                                  await srsService.addCard(user.uid, item);
                               }
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </RequiresAuth>
              )}

              {/* PRACTICE TAB */}
              {activeTab === 'practice' && (
                <RequiresAuth isGuest={isGuest}>
                  <div className="flex-1 flex flex-col h-full">
                    {activePractice === 'menu' && (
                      <div className="p-6 space-y-8 pb-32">
                         <h2 className="text-2xl font-black text-gray-900 tracking-tight">Área de Treino</h2>
                         <div className="grid grid-cols-1 gap-4">
                            <button 
                              onClick={() => setActivePractice('srs')}
                              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 transition-all text-left shadow-sm"
                            >
                               <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center"><History /></div>
                               <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">Revisão SRS</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Espaçamento Inteligente</p>
                               </div>
                            </button>
                            <button 
                              onClick={() => setActivePractice('drills')}
                              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 transition-all text-left shadow-sm"
                            >
                               <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center"><Dumbbell /></div>
                               <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">Micro-Drills</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prática Rápida de Gramática</p>
                               </div>
                            </button>
                            <button 
                              onClick={() => setActivePractice('exams')}
                              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 transition-all text-left shadow-sm"
                            >
                               <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center"><Trophy /></div>
                               <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">Hub de Exames</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Simulados DELE / SIELE</p>
                               </div>
                            </button>
                            <button 
                              onClick={() => setActivePractice('writing')}
                              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 transition-all text-left shadow-sm"
                            >
                               <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><PenTool /></div>
                               <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">Redação DELE</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Avaliação com IA</p>
                               </div>
                            </button>
                            <button 
                              onClick={() => setActivePractice('pronunciation')}
                              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 transition-all text-left shadow-sm"
                            >
                               <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center"><Mic /></div>
                               <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">Treino de Pronúncia</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Feedback fonético</p>
                               </div>
                            </button>
                            <button 
                              onClick={() => setActivePractice('portunhol')}
                              className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 transition-all text-left shadow-sm"
                            >
                               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><Sparkles /></div>
                               <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">Detector de Portunhol</h4>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Limpeza de interferência</p>
                               </div>
                            </button>
                         </div>
                      </div>
                    )}

                    {activePractice === 'srs' && <SRSReview uid={user?.uid || ''} onComplete={() => setActivePractice('menu')} />}
                    {activePractice === 'drills' && <MicroDrillView type="grammar" title="Micro-Drills" onClose={() => setActivePractice('menu')} onComplete={() => setActivePractice('menu')} />}
                    {activePractice === 'pronunciation' && (
                      <div className="p-6 space-y-8">
                         <button onClick={() => setActivePractice('menu')} className="p-2 bg-white rounded-xl shadow-sm inline-flex"><X size={18} /></button>
                         <PronunciationDrill targetPhrase="El cielo está enladrillado, ¿quién lo desenladrillará?" onSuccess={() => {}} />
                      </div>
                    )}
                    {activePractice === 'portunhol' && (
                      <div className="h-full flex flex-col">
                         <div className="p-4 bg-white border-b flex items-center gap-4">
                            <button onClick={() => setActivePractice('menu')} className="p-2"><X size={18} /></button>
                            <h3 className="font-bold">Detector de Portunhol</h3>
                         </div>
                         <PortunholDetector />
                      </div>
                    )}
                    {activePractice === 'exams' && (
                      <ExamHubView 
                        user={profile as any} 
                        onUpdateUser={(p) => setProfile(p as any)} 
                        onClose={() => setActivePractice('menu')} 
                        onWatchAd={() => {
                          setActiveAd({ type: 'rewarded', rewardAmount: 50 });
                        }}
                      />
                    )}
                    {activePractice === 'writing' && (
                      <WritingExam 
                        uid={user?.uid || ''} 
                        level={(profile?.currentLevel as Level) || 'A1'} 
                        prompt="Escriba un correo electrónico a un amigo contándole sobre sus últimas vacaciones. Use el pretérito perfeito e indefinido." 
                        minWords={80} 
                        maxWords={150} 
                        duration={20}
                        onComplete={() => setActivePractice('menu')}
                      />
                    )}
                  </div>
                </RequiresAuth>
              )}

              {/* IA TAB */}
              {activeTab === 'ia' && (
                <RequiresAuth isGuest={isGuest}>
                  <AIView 
                    user={profile as any} 
                    onEarnCredits={() => {
                      setActiveAd({ type: 'rewarded', rewardAmount: 20 });
                    }} 
                  />
                </RequiresAuth>
              )}

              {/* LIBRARY TAB */}
              {activeTab === 'library' && (
                <div className="flex-1 flex flex-col h-full bg-gray-50">
                   <AnimatePresence mode="wait">
                      {activeLibrary === 'menu' && (
                        <motion.div key="lib-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-8 pb-32">
                           <h2 className="text-2xl font-black text-gray-900 tracking-tight">Biblioteca</h2>
                           <div className="grid grid-cols-2 gap-4">
                              <button onClick={() => setActiveLibrary('dictionary')} className="p-6 bg-white rounded-3xl border border-gray-100 text-left space-y-3 shadow-sm active:scale-95 transition-all outline-none">
                                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><BookOpen size={20} /></div>
                                 <h4 className="text-sm font-black text-gray-900 leading-tight">Dicionário Pró</h4>
                              </button>
                              <button onClick={() => setActiveLibrary('readers')} className="p-6 bg-white rounded-3xl border border-gray-100 text-left space-y-3 shadow-sm active:scale-95 transition-all outline-none">
                                 <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><GraduationCap size={20} /></div>
                                 <h4 className="text-sm font-black text-gray-900 leading-tight">Leituras Graduadas</h4>
                              </button>
                              <button onClick={() => setActiveLibrary('phrasebook')} className="p-6 bg-white rounded-3xl border border-gray-100 text-left space-y-3 shadow-sm active:scale-95 transition-all outline-none">
                                 <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><MessageCircle size={20} /></div>
                                 <h4 className="text-sm font-black text-gray-900 leading-tight">Guia de Frases</h4>
                              </button>
                              <button onClick={() => setActiveLibrary('false-friends')} className="p-6 bg-white rounded-3xl border border-gray-100 text-left space-y-3 shadow-sm active:scale-95 transition-all outline-none">
                                 <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
                                 <h4 className="text-sm font-black text-gray-900 leading-tight">Falsos Amigos</h4>
                              </button>
                           </div>

                           <div className="bg-slate-900 rounded-[32px] p-6 text-white space-y-4 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={48} /></div>
                              <h4 className="font-bold">Preparação DELE</h4>
                              <p className="text-xs text-white/60 leading-relaxed">Acesse recursos exclusivos para passar no exame oficial com nota máxima.</p>
                              <button onClick={() => { setActiveTab('practice'); setActivePractice('exams'); }} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest">VER HUB DE EXAMES</button>
                           </div>
                        </motion.div>
                      )}

                      {activeLibrary === 'dictionary' && <div className="p-6 h-full overflow-hidden"><DictionaryView onClose={() => setActiveLibrary('menu')} /></div>}
                      {activeLibrary === 'readers' && <LibraryView onClose={() => setActiveLibrary('menu')} />}
                      {activeLibrary === 'phrasebook' && <div className="p-6 pb-32"><PhrasebookView onClose={() => setActiveLibrary('menu')} /></div>}
                      {activeLibrary === 'false-friends' && <div className="p-6 pb-32"><FalseFriendsView onClose={() => setActiveLibrary('menu')} /></div>}
                   </AnimatePresence>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-y-auto pb-32">
                   <div className="p-8 text-center space-y-6">
                      <div className="w-32 h-32 bg-white rounded-full mx-auto border-4 border-white shadow-2xl overflow-hidden relative group">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.displayName || 'Guest'}`} alt="avatar" className="w-full h-full object-cover" />
                         <button onClick={() => setShowSettings(true)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Settings className="text-white" />
                         </button>
                      </div>
                      
                      <div className="space-y-1">
                         <h2 className="text-2xl font-black text-gray-900 tracking-tight">{profile?.displayName || 'Invitado'}</h2>
                         <p className="text-sm text-gray-500 font-medium">Nível {profile?.currentLevel || 'A1'} • {profile?.xp || 0} XP Total</p>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                         <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dose Diária</p>
                            <p className="text-lg font-black text-orange-500 flex justify-center"><StreakWidget streak={profile?.streak || 0} compact /></p>
                         </div>
                         <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Moedas</p>
                            <p className="text-lg font-black text-amber-600">🪙 {profile?.coins || 0}</p>
                         </div>
                         <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ranking</p>
                            <p className="text-lg font-black text-indigo-600">#42</p>
                         </div>
                      </div>

                      {/* Achievements Section */}
                      <div className="space-y-4 text-left">
                         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Suas Conquistas</h3>
                         <div className="grid grid-cols-3 gap-3">
                            <AchievementBadge 
                               achievement={{ id: '1', name: 'Novato', desc: 'Sua primeira lição', icon: '🐣', category: 'progresso' }} 
                               isUnlocked={true} 
                            />
                            <AchievementBadge 
                               achievement={{ id: '2', name: 'Poliglota', desc: 'Mudou idioma 5 vezes', icon: '🌎', category: 'progresso' }} 
                               isUnlocked={false} 
                            />
                            <AchievementBadge 
                               achievement={{ id: '3', name: 'Determinado', desc: 'Streak de 7 dias', icon: '🔥', category: 'progresso' }} 
                               isUnlocked={(profile?.streak || 0) >= 7} 
                            />
                         </div>
                      </div>

                      <div className="bg-slate-900 rounded-3xl p-6 text-white text-left space-y-4">
                         <div className="flex justify-between items-center">
                            <h4 className="font-bold">Plano Premium Ad-Sponsored</h4>
                            <Sparkles className="text-primary" size={16} />
                         </div>
                         <p className="text-[10px] text-white/50 leading-relaxed">Você tem acesso ilimitado a todos os recursos IA. Continue assistindo anúncios para manter sua conta ativa!</p>
                         <button 
                           onClick={() => setShowStore(true)}
                           className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                         >
                           ABRIR LOJA DE MOEDAS
                         </button>
                      </div>

                      <button 
                        onClick={() => {
                          if (isGuest) setIsGuest(false);
                          auth.signOut();
                        }}
                        className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                      >
                        {isGuest ? 'Voltar para Login' : 'Sair da Conta'}
                      </button>
                   </div>
                </div>
              )}

              {/* ADMIN TAB */}
              {activeTab === 'admin' && isAdmin && <AdminDashboard />}

            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPlacement && (
            <PlacementTest 
              onCancel={() => setShowPlacement(false)}
              onComplete={async (level) => {
                if (user?.uid) {
                  await userService.updateUser(user.uid, { currentLevel: level as any, onboardingComplete: true });
                  const p = await userService.getUser(user.uid);
                  setProfile(p);
                }
                setShowPlacement(false);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activePractice === 'drills' && (
             <ConjugatorView onClose={() => setActivePractice('menu')} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResources && (
            <ResourcesCenter 
              onClose={() => setShowResources(false)}
              onNavigate={(id) => {
                setShowResources(false);
                if (id === 'dictionary') { setActiveTab('library'); setActiveLibrary('dictionary'); }
                if (id === 'library') { setActiveTab('library'); setActiveLibrary('menu'); }
                if (id === 'false-friends') { setActiveTab('library'); setActiveLibrary('false-friends'); }
                if (id === 'phrasebook') { setActiveTab('library'); setActiveLibrary('phrasebook'); }
                if (id === 'exams') { setActiveTab('practice'); setActivePractice('exams'); }
                if (id === 'ai-tutor') { setActiveTab('ia'); }
                if (id === 'ai-conversation') { setActiveTab('ia'); }
                if (id === 'ai-writing') { setActiveTab('ia'); }
                if (id === 'placement') { setShowPlacement(true); }
                if (id === 'ideas') { setShowIdeas(true); }
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showIdeas && (
            <IdeasView onClose={() => setShowIdeas(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeAd && (
            <AdSimulation 
              type={activeAd.type}
              onClose={() => setActiveAd(null)}
              onReward={async () => {
                if (user?.uid) {
                  await userService.addCoins(user.uid, activeAd.rewardAmount);
                  const p = await userService.getUser(user.uid);
                  setProfile(p);
                }
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStore && (
            <CreditsStore 
              credits={profile} 
              onClose={() => setShowStore(false)}
              onWatchAd={() => {
                setShowStore(false);
                setActiveAd({ type: 'rewarded', rewardAmount: 50 });
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSettings && (
            <SettingsView 
              user={profile}
              onUpdateProfile={(p) => setProfile(p)}
              onClose={() => setShowSettings(false)}
              onEarnCredits={() => {
                setShowSettings(false);
                setActiveAd({ type: 'rewarded', rewardAmount: 20 });
              }}
              onOpenLegal={(type) => { /* handle legal tabs */ }}
              onOpenDebug={() => { /* handle debug */ }}
            />
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        {!loading && (user || isGuest) && (
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 shrink-0 flex items-center justify-between px-6 py-4 z-40">
            {[
              { id: 'home', icon: Home },
              { id: 'practice', icon: BookOpen },
              { id: 'ia', icon: Sparkles },
              { id: 'library', icon: Library },
              { id: 'profile', icon: UserIcon },
              ...(isAdmin ? [{ id: 'admin', icon: LayoutDashboard }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setActivePractice('menu'); setActiveLibrary('menu'); }}
                className={cn(
                  "relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all",
                  activeTab === tab.id ? "text-indigo-600 scale-110" : "text-gray-300"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                ) }
                {/* @ts-ignore */}
                <tab.icon size={22} />
              </button>
            ))}
          </nav>
        )}
      </main>
    </div>
  );
}
