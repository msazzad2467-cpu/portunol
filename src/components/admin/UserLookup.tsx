import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { Search, User, Mail, Coins, Flame, Award, Loader2, Plus, Minus } from 'lucide-react';
import { userService } from '../../services/userService';

export const UserLookup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!email) return;
    setLoading(true);
    const data = await adminService.findUserByEmail(email);
    setUser(data);
    setLoading(false);
  };

  const adjustCoins = async (delta: number) => {
    if (!user) return;
    await userService.updateCredits(user.id, delta, 'Manual admin adjustment');
    setUser({ ...user, coins: user.coins + delta });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <Mail size={18} className="text-gray-400" />
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail do estudante..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </button>
      </div>

      {user && (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {/* User Profile Header */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
              {user.avatar || '👤'}
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-indigo-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Saldo</span>
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-indigo-600" />
                <span className="text-lg font-black text-indigo-600">{user.coins}</span>
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Streak</span>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="text-lg font-black text-orange-500">{user.streak} d</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">XP Total</span>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-green-600" />
                <span className="text-lg font-black text-green-600">{user.xp}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nível Atual</span>
              <span className="text-lg font-black text-gray-900 block">{user.currentLevel}</span>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Ações Rápidas</h4>
            <div className="flex flex-wrap gap-3">
               <button 
                 onClick={() => adjustCoins(100)}
                 className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100"
               >
                 <Plus size={14} /> 100 Moedas
               </button>
               <button 
                 onClick={() => adjustCoins(-100)}
                 className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100"
               >
                 <Minus size={14} /> 100 Moedas
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
