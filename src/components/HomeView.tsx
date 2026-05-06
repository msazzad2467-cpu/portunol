import { motion } from 'motion/react';
import { 
  Flame, 
  Zap, 
  Play, 
  ChevronRight, 
  Sparkles, 
  Volume2, 
  History, 
  Settings, 
  Gift, 
  GraduationCap,
  Activity,
  MessageCircle,
  BookOpen,
  Trophy,
  Star,
  Users,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import DailyCheckIn from './DailyCheckIn';
import DailyMissions from './DailyMissions';

import { LeagueBoard } from './LeagueBoard';

export default function HomeView({ 
  user, 
  onNavigate, 
  onOpenSRS, 
  onOpenDictionary, 
  onOpenTutor, 
  onOpenConjugator, 
  onOpenFeatures,
  onOpenSettings,
  onOpenDrill,
  onOpenModule,
  onCheckIn,
  onOpenStore,
  onUpgradeChest,
  onEarnCredits,
  onOpenIdeas
}: any) {
  
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-24">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold rotate-6">P</div>
          <div>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-display font-bold">¡Hola, {user?.name || 'Estudante'}!</h2>
               {user?.profile?.targetAccent && (
                 <span className="text-sm scale-110" title={user.profile.targetAccent}>
                   {user.profile.targetAccent === 'neutral' && '🌎'}
                   {user.profile.targetAccent === 'mexican' && '🇲🇽'}
                   {user.profile.targetAccent === 'argentinian' && '🇦🇷'}
                   {user.profile.targetAccent === 'spanish' && '🇪🇸'}
                   {user.profile.targetAccent === 'colombian' && '🇨🇴'}
                 </span>
               )}
            </div>
             <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500 fill-current" /> {user?.streak || 0}</span>
                <span className="flex items-center gap-1 text-primary"><Zap size={12} className="fill-current" /> {user?.xp || 0} XP</span>
             </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => onNavigate('resources')} className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm active:scale-95 transition-all">
              <Sparkles size={20} />
           </button>
           <button onClick={() => onOpenStore()} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary shadow-sm active:scale-95 transition-all">
              <Gift size={20} />
           </button>
           <button onClick={onOpenSettings} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm active:scale-95 transition-all">
              <Settings size={20} />
           </button>
        </div>
      </header>

      {/* Persistence Loops */}
       <DailyCheckIn 
        streak={user?.streak || 0} 
        lastCheckIn={user?.lastLoginDate || null} 
        onCheckIn={onCheckIn} 
      />

      {user?.currentLevel === 'A1' && !user?.onboardingComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-[32px] p-6 text-white space-y-4 shadow-xl shadow-indigo-200"
        >
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <Sparkles className="text-white" />
              </div>
              <div>
                 <h4 className="font-bold">Teste de Nível</h4>
                 <p className="text-xs text-white/70">Descubra seu nível exato no CEFR.</p>
              </div>
           </div>
           <button 
             onClick={() => onNavigate('placement')}
             className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all"
           >
              COMEÇAR TESTE
           </button>
        </motion.div>
      )}

      <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plano do Dia</h3>
             <span className="text-xs font-bold text-primary">{user?.dailyProgress || 0}% Concluído</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <ContinueCard 
               title="Continuar" 
               subtitle={user?.lastModule?.title || "Nível A1: Saudação"} 
               progress={user?.lastModule?.progress || 45} 
               onClick={() => onOpenModule(user?.lastModule?.id || 'a1-1')}
             />
             <div className="grid gap-4">
                <button onClick={onOpenSRS} className="p-4 bg-green-50 rounded-3xl border border-green-100 flex flex-col justify-between items-start h-full group active:scale-95 transition-all">
                   <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                      <History size={20} />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-bold text-green-700">Revisão SRS</p>
                      <p className="text-[10px] text-green-600/60 font-bold">{user?.srsItems?.length || 0} itens hoje</p>
                   </div>
                </button>
               <button onClick={onOpenStore} className="p-4 bg-primary/10 rounded-3xl border border-primary/20 flex flex-col justify-between items-start h-full group active:scale-95 transition-all relative overflow-hidden">
                  <div className="absolute -right-2 -top-2 opacity-10 rotate-12 transition-transform group-hover:scale-125">
                     <Zap size={64} className="text-primary fill-current" />
                  </div>
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                     <Gift size={16} className="text-primary" />
                  </div>
                  <div className="text-left relative z-10">
                     <p className="text-xs font-bold text-primary">Bônus Diário</p>
                     <p className="text-[8px] text-primary/60 font-bold uppercase tracking-widest">Grátis com Ad</p>
                  </div>
               </button>
            </div>
         </div>
      </div>

      {/* Reorganized Feed: Plano do Dia (Prominent) */}
      <section className="space-y-4">
         <div className="flex justify-between items-end px-2">
            <div>
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seu Plano Adaptativo</h3>
               <h2 className="text-xl font-display font-bold">Plano do Dia</h2>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-bold text-primary uppercase block mb-1">Hoje</span>
               <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn("w-6 h-1 rounded-full", i < 2 ? "bg-primary" : "bg-gray-100")} />
                  ))}
               </div>
            </div>
         </div>
         
         <div className="bg-white border border-gray-100 rounded-[40px] p-2 shadow-sm space-y-1">
            {[
              { id: 'task-1', title: 'Verbos Irregulares (Nível B1)', type: 'grammar', xp: 20, icon: <GraduationCap size={16} /> },
              { id: 'task-2', title: 'Leitura: O Realismo Mágico', type: 'reading', xp: 35, icon: <BookOpen size={16} /> },
              { id: 'task-3', title: 'Miniconversa: O Final de Semana', type: 'chat', xp: 50, icon: <MessageCircle size={16} />, highlight: true },
              { id: 'task-4', title: 'Revisão de Vocabulário', type: 'srs', xp: 15, icon: <History size={16} /> },
              { id: 'task-5', title: 'Desafio de Escuta Rápida', type: 'listening', xp: 25, icon: <Volume2 size={16} /> }
            ].map((task, idx) => (
              <button 
                key={task.id}
                onClick={
                  task.id === 'task-3' ? onOpenTutor : 
                  task.id === 'task-4' ? onOpenSRS : 
                  () => onOpenDrill(task.type, task.title)
                }
                className={cn(
                  "w-full p-4 rounded-[32px] flex items-center gap-4 transition-all active:scale-[0.98]",
                  task.highlight ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  task.highlight ? "bg-white/20" : "bg-gray-100 text-primary"
                )}>
                  {task.icon}
                </div>
                <div className="flex-1 text-left">
                   <p className={cn("text-[11px] font-bold", task.highlight ? "text-white/80" : "text-gray-400")}>Tarefa {idx + 1}</p>
                   <h4 className="font-bold text-sm leading-tight">{task.title}</h4>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold",
                  task.highlight ? "bg-white text-primary" : "bg-primary/10 text-primary"
                )}>
                  +{task.xp} XP
                </div>
              </button>
            ))}
         </div>
      </section>

      {/* Micro-Lessons Grid */}
      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Micro-Lições (30s)</h3>
         <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onOpenIdeas}
              className="bg-indigo-50 border border-indigo-100 p-5 rounded-[32px] text-left space-y-3 group active:scale-95 transition-all"
            >
               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">💡</div>
               <div>
                  <h4 className="font-bold text-indigo-900 text-sm">Ideias de Estudo</h4>
                  <p className="text-[10px] text-indigo-800/60 font-medium">Missões de fluência</p>
               </div>
            </button>
            <button 
              onClick={() => onOpenDrill('writing', 'Assistente de Escrita')}
              className="bg-emerald-50 border border-emerald-100 p-5 rounded-[32px] text-left space-y-3 group active:scale-95 transition-all"
            >
               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">✍️</div>
               <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Escrita com IA</h4>
                  <p className="text-[10px] text-emerald-800/60 font-medium">Feedback em tempo real</p>
               </div>
            </button>
         </div>
      </section>

      {/* Daily Culture: Word & Phrase of the Day */}
      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Cultura Diária</h3>
         <div className="space-y-3">
            <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm flex items-center gap-4 group">
               <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  🏷️
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-0.5">Palavra do Dia</p>
                  <h4 className="font-bold text-gray-900 text-lg">Zapatillas</h4>
                  <p className="text-xs text-gray-400">Tênis / Calçados esportivos</p>
               </div>
               <button 
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance('Zapatillas');
                  utterance.lang = 'es-ES';
                  window.speechSynthesis.speak(utterance);
                }}
                className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
               >
                  <Volume2 size={18} />
               </button>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm flex items-center gap-4 group">
               <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  💬
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Frase do Dia</p>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight italic">"No dejes para mañana lo que puedes hacer hoy"</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Não deixe para amanhã o que você pode fazer hoje.</p>
               </div>
            </div>
         </div>
      </section>

       {/* Persistence Loops (Daily Missions merged here or elsewhere) */}
      <DailyMissions missions={user?.missions || []} onEarnReward={onUpgradeChest} />
      
      <section className="space-y-4">
         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Competição da Semana</h3>
         <LeagueBoard uid={user?.uid || ''} tier={user?.leagueTier || 'Bronze'} />
      </section>

      <NativeAdCard onWatchAd={() => onEarnCredits()} />
      <section className="bg-slate-900 rounded-[40px] p-8 space-y-6 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
         <div className="relative z-10 flex gap-6 items-center">
            <div className="w-20 h-20 bg-primary rounded-[32px] flex items-center justify-center shadow-xl shadow-primary/40 rotate-6 group-hover:rotate-0 transition-transform">
               <MessageCircle size={32} fill="currentColor" />
            </div>
            <div className="flex-1">
               <h3 className="text-xl font-display font-bold">Chat Tutor</h3>
               <p className="text-sm text-white/60">Fale naturalmente com nossa IA por 5 minutos agora.</p>
            </div>
         </div>
         <button 
           onClick={onOpenTutor}
           className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
         >
            INICIAR CONVERSA <ChevronRight size={16} />
         </button>
      </section>

      {/* Native Ad Placement 1 */}
      {/* (Moved up for better flow) */}

      {/* Extra Native Contextual Card */}
      <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 flex items-center gap-4 relative group cursor-pointer hover:bg-slate-100 transition-colors">
         <div className="absolute top-3 right-3 text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em]">Sponsor</div>
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🍷</div>
         <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">Vinhos de Mendoza</h4>
            <p className="text-[10px] text-slate-500 line-clamp-1">Explore a Rota do Vinho com guias locais bilíngues.</p>
         </div>
         <ChevronRight size={14} className="text-slate-300" />
      </div>

      {/* Daily Learning Hub */}
      <section className="space-y-4 pt-4">
         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Destaques do Dia</h3>
         
         <div className="grid gap-4">
            <FeatureCard 
               icon={Sparkles} 
               title="Frase do Dia (Audio)" 
               subtitle="¡Qué chévere verte de nuevo!" 
               tag="Speaking"
               onClick={() => onOpenDrill('speaking', 'Frase do Dia')}
            />
            <FeatureCard 
               icon={MessageCircle} 
               title="Miniconversa" 
               subtitle="IA: ¿Cómo estuvo tu finde?" 
               tag="Chat"
               onClick={onOpenTutor}
            />
            <FeatureCard 
               icon={GraduationCap} 
               title="Dica de Exame" 
               subtitle="Como usar o subjuntivo no DELE" 
               tag="C1/C2"
               onClick={() => onNavigate('aprender')}
            />
         </div>
      </section>

      {/* Infinite Drill Generator Teaser */}
      <section className="bg-orange-50 rounded-[40px] p-8 space-y-6 text-center border border-orange-100 overflow-hidden relative">
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl" />
         <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-orange-200">
               <Zap className="text-orange-500 fill-current" size={32} />
            </div>
            <div>
               <h3 className="text-xl font-display font-bold text-orange-950">Infinite Drills</h3>
               <p className="text-sm text-orange-800/60 px-4">Treine gramática e vocabulário sem fim com gerador de IA.</p>
            </div>
            <button 
              onClick={() => onOpenDrill('grammar', 'Gerador de IA')}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
               GERAR NOVA SESSÃO
            </button>
         </div>
      </section>
    </div>
  );
}

function ContinueCard({ title, subtitle, progress, onClick }: any) {
  return (
    <button onClick={onClick} className="bg-white border border-gray-100 rounded-[32px] p-6 text-left space-y-6 shadow-sm active:scale-95 transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Play size={48} className="fill-current" />
      </div>
      <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
         <Play size={18} className="fill-current" />
      </div>
      <div className="space-y-1">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
         <h4 className="font-bold text-lg leading-tight">{subtitle}</h4>
      </div>
      <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
         <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </button>
  );
}

function FeatureCard({ icon: Icon, title, subtitle, tag, onClick }: any) {
  return (
    <button onClick={onClick} className="p-5 rounded-3xl border border-gray-100 bg-white flex items-center gap-4 active:scale-95 transition-all shadow-sm">
       <div className="w-12 h-12 bg-gray-50 text-primary rounded-2xl flex items-center justify-center">
          <Icon size={24} />
       </div>
       <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-0.5">
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{tag}</span>
             <div className="w-1 h-1 bg-gray-200 rounded-full" />
             <h4 className="text-xs font-bold text-gray-400">{title}</h4>
          </div>
          <p className="font-bold text-gray-900">{subtitle}</p>
       </div>
       <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}

function SuggestionCard({ icon, title, desc, level, color, onClick }: any) {
   const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-100 text-blue-600',
      orange: 'bg-orange-50 border-orange-100 text-orange-600',
      purple: 'bg-purple-50 border-purple-100 text-purple-600',
      green: 'bg-green-50 border-green-100 text-green-600',
   };

   return (
      <button onClick={onClick} className={cn("min-w-[160px] p-5 rounded-[32px] border flex flex-col gap-3 text-left active:scale-95 transition-all shadow-sm", colors[color] || colors.blue)}>
         <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
            {icon}
         </div>
         <div>
            <div className="flex items-center gap-1.5 mb-1">
               <span className="text-[8px] font-bold px-1.5 py-0.5 bg-white/50 rounded uppercase tracking-widest">{level}</span>
               <h4 className="text-[10px] font-bold truncate opacity-80 uppercase tracking-widest">{title}</h4>
            </div>
            <p className="text-[11px] font-bold leading-tight line-clamp-2 text-gray-900">{desc}</p>
         </div>
      </button>
   );
}

function NativeAdCard({ onWatchAd }: { onWatchAd: () => void }) {
   return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-6 space-y-4 relative overflow-hidden group">
         <div className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[8px] font-bold rounded uppercase tracking-widest">Patrocinado</div>
         <div className="flex gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
               <span className="text-3xl">📱</span>
            </div>
            <div className="flex-1">
               <h4 className="font-bold text-indigo-950 text-sm">Portunol sem limites!</h4>
               <p className="text-[10px] text-indigo-800/60 leading-relaxed font-medium">Assista a um vídeo rápido para ganhar 50 Créditos de IA e usar o Chat Tutor à vontade.</p>
            </div>
         </div>
         <button 
          onClick={onWatchAd}
          className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all group-hover:bg-indigo-700"
         >
            ASSISTIR E GANHAR 📺
         </button>
      </div>
   );
}
