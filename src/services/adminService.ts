import { 
  collection, 
  query, 
  getDocs, 
  where, 
  doc, 
  updateDoc, 
  setDoc,
  orderBy,
  limit,
  Timestamp,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { FeatureFlags, AdminKPI, PromptConfig } from '../types';

export const adminService = {
  async getKPIs(): Promise<AdminKPI> {
    const userSnap = await getDocs(collection(db, 'users'));
    const examsSnap = await getDocs(collection(db, 'audit')); // Simplified, usually more complex
    
    return {
      totalUsers: userSnap.size,
      dau: 42, // Mock for demo, would require daily activity tracking logic
      avgSessionDuration: 15.4,
      totalExamsWeekly: 128,
      coinsSpentWeekly: 4500,
      coinsEarnedWeekly: 3800,
      tutorSessionsWeekly: 65
    };
  },

  async getFeatureFlags(): Promise<FeatureFlags> {
    const ref = doc(db, 'settings', 'featureFlags');
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as FeatureFlags : {
      srsEnabled: true,
      conversationTutorEnabled: true,
      adsEnabled: false,
      leaguesEnabled: true,
      pronunciationDrillEnabled: true,
      portunholDetectorEnabled: true,
      maintenanceMode: false
    };
  },

  async updateFeatureFlag(flag: keyof FeatureFlags, value: boolean) {
    const ref = doc(db, 'settings', 'featureFlags');
    await setDoc(ref, { [flag]: value }, { merge: true });
  },

  async getPrompts(): Promise<PromptConfig[]> {
    const q = query(collection(db, 'settings', 'prompts', 'versions'), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PromptConfig));
  },

  async savePrompt(level: string, section: string, prompt: string) {
    const id = `${level}_${section}`;
    const ref = doc(db, 'settings', 'prompts', 'versions', `${id}_${Date.now()}`);
    await setDoc(ref, {
      level,
      section,
      prompt,
      updatedAt: Timestamp.now(),
      version: Date.now()
    });
  },

  async findUserByEmail(email: string) {
    const q = query(collection(db, 'users'), where('email', '==', email), limit(1));
    const snap = await getDocs(q);
    if(snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  }
};
