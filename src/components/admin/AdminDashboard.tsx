import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import { FeatureFlags } from './FeatureFlags';
import { UserLookup } from './UserLookup';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Loader2,
  Key,
  Settings,
  Database,
  Save,
  AlertCircle,
  Activity,
  Users,
  TrendingUp,
  Coins,
  FileJson,
  Users as UsersIcon, 
  TrendingUp as TrendingIcon, 
  Activity as ActivityIcon, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Search, 
  FileJson as FileJsonIcon,
  Coins as CoinsIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CONFIG } from '../../config';

export const AdminDashboard: React.FC = () => {
  const { kpis, flags, prompts, loading: dataLoading, updateFlag } = useAdminData();
  const [activeTab, setActiveTab] = useState<'kpis' | 'users' | 'flags' | 'api' | 'config'>('kpis');
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [appConfig, setAppConfig] = useState(CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const keySnap = await getDoc(doc(db, 'admin', 'keys'));
        if (keySnap.exists()) setKeys(keySnap.data());

        const configSnap = await getDoc(doc(db, 'admin', 'config'));
        if (configSnap.exists()) setAppConfig({ ...CONFIG, ...configSnap.data() });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const saveKeys = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'admin', 'keys'), keys);
      alert("Chaves de API salvas com sucesso!");
    } catch (e) {
      alert("Erro ao salvar chaves.");
    } finally {
      setSaving(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'admin', 'config'), appConfig);
      alert("Configurações do app salvas com sucesso!");
    } catch (e) {
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 h-full bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Carregando Painel Administrativo...</p>
      </div>
    );
  }

  const kpiStats = [
    { label: 'Usuários Totais', value: kpis?.totalUsers, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'DAU (24h)', value: kpis?.dau, icon: ActivityIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Exames / Semana', value: kpis?.totalExamsWeekly, icon: TrendingIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Moedas', value: kpis?.coinsSpentWeekly, icon: CoinsIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <nav className="shrink-0 bg-white border-b border-gray-100 p-2 flex gap-1 overflow-x-auto scroll-none">
        {[
          { id: 'kpis', label: 'Stats', icon: LayoutDashboard },
          { id: 'users', label: 'Usuários', icon: Search },
          { id: 'flags', label: 'Features', icon: SettingsIcon },
          { id: 'api', label: 'API Keys', icon: Key },
          { id: 'config', label: 'Config', icon: SettingsIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-gray-400 hover:bg-gray-50"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 p-6 overflow-y-auto pb-32">
        {activeTab === 'kpis' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiStats.map((kpi, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.bg, kpi.color)}>
                    <kpi.icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserLookup />}

        {activeTab === 'flags' && flags && (
          <FeatureFlags flags={flags} onToggle={updateFlag} />
        )}

        {activeTab === 'api' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex gap-3 text-amber-700">
               <AlertCircle size={20} className="shrink-0" />
               <p className="text-[10px] font-black uppercase leading-relaxed tracking-wider">Altarações aqui substituem .env em tempo real para todos os usuários.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-2">Gemini API Key</label>
                      <input 
                        type="password"
                        value={keys.gemini || ''}
                        onChange={e => setKeys({...keys, gemini: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-2">Unity Ads Game ID</label>
                      <input 
                        type="text"
                        value={keys.unity || ''}
                        onChange={e => setKeys({...keys, unity: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-2">Outras APIs (JSON Config)</label>
                      <textarea 
                        value={keys.other || ''}
                        onChange={e => setKeys({...keys, other: e.target.value})}
                        rows={6}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-indigo-100 outline-none"
                        placeholder='{
  "STABILITY_AI": "...",
  "OPENAI_KEY": "..."
}'
                      />
                      <p className="text-[9px] text-gray-400 px-2 italic">Cole aqui um objeto JSON válido com chaves adicionais.</p>
                   </div>
                   <button 
                     onClick={saveKeys}
                     disabled={saving}
                     className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
                   >
                     <Save size={18} />
                     Atualizar Chaves
                   </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="space-y-1">
                         <p className="text-xs font-black text-gray-900 uppercase">Manutenção</p>
                         <p className="text-[9px] text-gray-400 font-black">Bloqueia acesso geral</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={appConfig.maintenanceMode}
                        onChange={e => setAppConfig({...appConfig, maintenanceMode: e.target.checked})}
                        className="w-6 h-6 rounded-lg border-gray-200 text-indigo-600 focus:ring-indigo-500"
                      />
                   </div>
                   <button 
                     onClick={saveConfig}
                     disabled={saving}
                     className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 active:scale-95 disabled:opacity-50"
                   >
                     <Save size={18} />
                     Salvar App Config
                   </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
