import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  Smartphone, 
  Monitor, 
  Zap,
  Globe,
  Settings,
  Megaphone,
  AlertTriangle,
  TrendingUp,
  Layout,
  Eye,
  EyeOff
} from 'lucide-react';
import { configService, AppConfig } from '../services/configService';
import { CONFIG } from '../config';

export default function AdminConfigView({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newAdmin, setNewAdmin] = useState('');

  useEffect(() => {
    configService.getConfig().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      await configService.updateConfig(config);
      alert('Configuração salva com sucesso para todos os usuários!');
    } catch (err) {
      alert('Erro ao salvar: ' + err);
    } finally {
      setIsSaving(false);
    }
  };

  const addAdmin = () => {
    if (newAdmin && config && !config.adminEmails.includes(newAdmin)) {
      setConfig({
        ...config,
        adminEmails: [...config.adminEmails, newAdmin]
      });
      setNewAdmin('');
    }
  };

  const removeAdmin = (email: string) => {
    if (config) {
      setConfig({
        ...config,
        adminEmails: config.adminEmails.filter(e => e !== email)
      });
    }
  };

  if (!config) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[700] flex flex-col max-w-md mx-auto"
    >
      <header className="p-6 flex items-center justify-between border-b">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Settings size={16} className="text-primary" /> Painel do Administrador
        </h2>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors disabled:opacity-50"
        >
          <Save size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Vital Status */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={12} className="text-amber-500" /> Operação Vital
          </h3>
          <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Modo de Manutenção</p>
                <p className="text-[10px] text-amber-700/60 leading-tight pr-4">Bloqueia o acesso ao app para todos exceto admins.</p>
              </div>
              <button 
                onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                className={`p-1 rounded-full w-12 transition-colors flex ${config.maintenanceMode ? 'bg-amber-500 justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          </div>
        </section>

        {/* IA Exam Prompts */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} className="text-indigo-500" /> Engenharia de Prompts (DELE/SIELE)
          </h3>
          <div className="space-y-4 p-6 bg-indigo-50 border border-indigo-100 rounded-[32px]">
            <p className="text-[10px] text-indigo-700/60 leading-tight">Defina como a IA deve gerar cada seção dos simulados. Use o nível e tipo como variáveis implícitas.</p>
            {Object.entries(config.examPrompts || {}).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase tracking-tighter">{key}</label>
                  <button 
                    onClick={() => {
                      const newPrompts = { ...config.examPrompts };
                      delete newPrompts[key];
                      setConfig({ ...config, examPrompts: newPrompts });
                    }}
                    className="text-[10px] font-bold text-red-500 hover:opacity-75"
                  >
                    Excluir
                  </button>
                </div>
                <textarea 
                  value={value}
                  onChange={e => {
                    setConfig({
                      ...config,
                      examPrompts: { ...config.examPrompts, [key]: e.target.value }
                    });
                  }}
                  className="w-full p-4 bg-white border border-indigo-200 rounded-2xl text-xs min-h-[80px] outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            ))}
            <div className="pt-2">
               <button 
                 onClick={() => {
                   const name = prompt('Nome do Prompt (Ex: DELE-B2-Reading):');
                   if (name) {
                     setConfig({
                       ...config,
                       examPrompts: { ...config.examPrompts, [name]: 'Instruções aqui...' }
                     });
                   }
                 }}
                 className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
               >
                 <Plus size={14} /> Novo Prompt Personalizado
               </button>
            </div>
          </div>
        </section>

        {/* Global Announcement */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Megaphone size={12} /> Comunicado Global
          </h3>
          <div className="space-y-3 p-6 bg-gray-50 border border-gray-100 rounded-[32px]">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Status: {config.announcement.active ? 'Ativo' : 'Inativo'}</span>
               <button 
                onClick={() => setConfig({...config, announcement: {...config.announcement, active: !config.announcement.active}})}
                className={`text-[10px] font-bold uppercase ${config.announcement.active ? 'text-red-500' : 'text-primary'}`}
              >
                {config.announcement.active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
            <textarea 
              value={config.announcement.message}
              onChange={e => setConfig({...config, announcement: {...config.announcement, message: e.target.value}})}
              placeholder="Digite a mensagem para todos os usuários..."
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex gap-2">
              {(['info', 'warning', 'error'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setConfig({...config, announcement: {...config.announcement, type}})}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tighter border transition-all ${
                    config.announcement.type === type 
                      ? 'bg-slate-900 text-white border-slate-900 border-2' 
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Multiplier */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={12} className="text-green-500" /> Eventos & XP
          </h3>
          <div className="p-6 bg-green-50 border border-green-100 rounded-[32px] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-900">Multiplicador de XP Global</p>
              <p className="text-[10px] text-green-700/60">Atualmente: <span className="font-bold text-green-700">{config.xpMultiplier}x</span></p>
            </div>
            <div className="flex gap-2">
              {[1, 1.5, 2].map(val => (
                <button
                  key={val}
                  onClick={() => setConfig({...config, xpMultiplier: val})}
                  className={`w-10 h-10 rounded-full text-[10px] font-bold transition-all border ${
                    config.xpMultiplier === val
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-green-600 border-green-200 hover:bg-green-100'
                  }`}
                >
                  {val}x
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Flags */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Layout size={12} /> Recursos do Aplicativo
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'aiTutor', name: 'Tutor IA (Conversas)', icon: Zap },
              { id: 'writingAssistant', name: 'Assistente de Escrita', icon: Settings },
              { id: 'community', name: 'Recursos Comunitários', icon: Globe }
            ].map(feature => (
              <div key={feature.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.featureFlags[feature.id as keyof typeof config.featureFlags] ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    {config.featureFlags[feature.id as keyof typeof config.featureFlags] ? <Eye size={14} /> : <EyeOff size={14} />}
                  </div>
                  <span className={`text-xs font-bold ${config.featureFlags[feature.id as keyof typeof config.featureFlags] ? 'text-gray-700' : 'text-gray-400'}`}>
                    {feature.name}
                  </span>
                </div>
                <button 
                  onClick={() => setConfig({
                    ...config, 
                    featureFlags: {
                      ...config.featureFlags, 
                      [feature.id]: !config.featureFlags[feature.id as keyof typeof config.featureFlags]
                    }
                  })}
                  className={`p-1 rounded-full w-10 transition-colors flex ${config.featureFlags[feature.id as keyof typeof config.featureFlags] ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Unity Ads */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Smartphone size={12} /> Unity Ads SDK (Monetization)
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Unity Game ID</label>
              <input 
                type="text" 
                value={config.unityAds.gameId}
                onChange={e => setConfig({...config, unityAds: {...config.unityAds, gameId: e.target.value}})}
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Placement (Interstitial)</label>
                <input 
                  type="text" 
                  value={config.unityAds.interstitialPlacement}
                  onChange={e => setConfig({...config, unityAds: {...config.unityAds, interstitialPlacement: e.target.value}})}
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-mono focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Placement (Rewarded)</label>
                <input 
                  type="text" 
                  value={config.unityAds.rewardedPlacement}
                  onChange={e => setConfig({...config, unityAds: {...config.unityAds, rewardedPlacement: e.target.value}})}
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-mono focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* IA Economy */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} /> Economia de Créditos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Ganhos por Anúncio</label>
              <input 
                type="number" 
                value={config.iaCredits.rewardAmount}
                onChange={e => setConfig({...config, iaCredits: {...config.iaCredits, rewardAmount: Number(e.target.value)}})}
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Créditos Iniciais</label>
              <input 
                type="number" 
                value={config.iaCredits.initialAmount}
                onChange={e => setConfig({...config, iaCredits: {...config.iaCredits, initialAmount: Number(e.target.value)}})}
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Custo Pular Módulo</label>
              <input 
                type="number" 
                value={config.iaCredits.skipModuleCost}
                onChange={e => setConfig({...config, iaCredits: {...config.iaCredits, skipModuleCost: Number(e.target.value)}})}
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Custo Pular Lição</label>
              <input 
                type="number" 
                value={config.iaCredits.skipLessonCost}
                onChange={e => setConfig({...config, iaCredits: {...config.iaCredits, skipLessonCost: Number(e.target.value)}})}
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Admin Emails */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} /> Administradores Registrados
          </h3>
          <div className="space-y-2">
            {config.adminEmails.map(email => (
              <div key={email} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-medium text-gray-700">{email}</span>
                <button 
                  onClick={() => removeAdmin(email)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Novo email admin..."
              value={newAdmin}
              onChange={e => setNewAdmin(e.target.value)}
              className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button 
              onClick={addAdmin}
              className="p-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </section>
      </div>

      <div className="p-6 border-t bg-gray-50">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? 'SALVANDO...' : 'PROPAGAR PARA TODOS OS DISPOSITIVOS'}
        </button>
      </div>
    </motion.div>
  );
}
