import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { LeagueEntry } from '../types';

export const leagueService = {
  async getLeaderboard(tier: string): Promise<LeagueEntry[]> {
    const q = query(
      collection(db, 'users'),
      where('leagueTier', '==', tier),
      orderBy('weeklyXP', 'desc'),
      limit(20)
    );
    
    const snap = await getDocs(q);
    return snap.docs.map((d, idx) => {
      const data = d.data();
      return {
        uid: d.id,
        name: data.name || 'Estudante',
        avatar: data.avatar || '👤',
        weeklyXP: data.weeklyXP || 0,
        rank: idx + 1,
        trend: 'stable' // Default, real trend would need snapshots
      };
    });
  },

  async getUserRank(uid: string, tier: string): Promise<number> {
    const q = query(
      collection(db, 'users'),
      where('leagueTier', '==', tier),
      orderBy('weeklyXP', 'desc')
    );
    const snap = await getDocs(q);
    const index = snap.docs.findIndex(d => d.id === uid);
    return index + 1;
  }
};
