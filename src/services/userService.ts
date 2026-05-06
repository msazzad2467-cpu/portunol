import { 
  doc, 
  setDoc, 
  updateDoc, 
  increment, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserProfile, MasteryScores, ExamResult, WritingEvaluation } from '../types';

export const INITIAL_PROFILE: any = {
  xp: 0,
  weeklyXP: 0,
  coins: 500,
  streak: 0,
  streakShieldActive: false,
  lastLoginDate: null,
  targetLevel: 'B1',
  currentLevel: 'A1',
  profile: {
    targetAccent: 'neutral'
  },
  missions: [
    { id: 'm1', title: 'Completar 1 lição', count: 0, goal: 1, completed: false, reward: 20 },
    { id: 'm2', title: 'Praticar 5 min no Chat', count: 0, goal: 5, completed: false, reward: 50 },
    { id: 'm3', title: 'Acertar 3 drills', count: 0, goal: 3, completed: false, reward: 30 }
  ],
  masteryScores: {
    reading: 0,
    writing: 0,
    grammar: 0,
    listening: 0,
  },
  achievements: [],
  leagueTier: 'Bronze',
  onboardingComplete: false,
  unlockedExams: [],
  rewards: {
    dailyCheckin: false,
    missions: [],
    aiCredits: 10,
  },
};

async function logAudit(uid: string, action: string, metadata: any = {}) {
  try {
    await addDoc(collection(db, 'audit', uid, 'logs'), {
      action,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Audit log failed', error);
  }
}

export const userService = {
  async ensureUser(uid: string, email: string, name: string): Promise<UserProfile> {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }

    const newUser: UserProfile = {
      uid,
      email,
      name,
      ...INITIAL_PROFILE,
      createdAt: Timestamp.now()
    } as UserProfile;

    await setDoc(userRef, newUser);
    await logAudit(uid, 'user_created', { email });
    return newUser;
  },

  async updateMasteryScores(uid: string, scores: Partial<MasteryScores>) {
    const userRef = doc(db, 'users', uid);
    const updateData: any = {};
    Object.entries(scores).forEach(([key, value]) => {
      if (key !== 'lastUpdated') {
        updateData[`masteryScores.${key}`] = value;
      }
    });
    updateData['masteryScores.lastUpdated'] = serverTimestamp();
    
    await updateDoc(userRef, updateData);
    await logAudit(uid, 'mastery_updated', scores);
  },

  async updateCredits(uid: string, delta: number, reason: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      coins: increment(delta)
    });
    await logAudit(uid, 'credits_adjusted', { delta, reason });
  },

  async updateStreak(uid: string, streak: number, lastLoginDate: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      streak,
      lastLoginDate
    });
  },

  async saveExamResult(uid: string, result: ExamResult) {
    await addDoc(collection(db, 'users', uid, 'examResults'), {
      ...result,
      timestamp: serverTimestamp()
    });
    await logAudit(uid, 'exam_completed', { examId: result.examId, score: result.totalScore });
  },

  async saveWritingEvaluation(uid: string, evaluation: WritingEvaluation) {
    await addDoc(collection(db, 'users', uid, 'writingHistory'), {
      ...evaluation,
      timestamp: serverTimestamp()
    });
    await logAudit(uid, 'writing_evaluated', { band: evaluation.overallBand });
  },

  async updateXP(uid: string, xpDelta: number) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      xp: increment(xpDelta),
      weeklyXP: increment(xpDelta)
    });
    await logAudit(uid, 'xp_earned', { delta: xpDelta });
  },

  async getUser(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  async checkIn(uid: string) {
    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      streak: increment(1),
      lastLoginDate: today,
      coins: increment(20)
    });
    await logAudit(uid, 'checkin_completed', { date: today });
  },

  async addCoins(uid: string, amount: number) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      coins: increment(amount)
    });
    await logAudit(uid, 'coins_added', { amount });
  },

  async updateUser(uid: string, updates: Partial<UserProfile>) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates as any);
    await logAudit(uid, 'user_updated', updates);
  },

  async toggleStreakShield(uid: string, active: boolean) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      streakShieldActive: active
    });
    await logAudit(uid, 'streak_shield_toggled', { active });
  },

  async unlockBadge(uid: string, badgeId: string) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const badges = userSnap.data()?.achievements || [];
    if (!badges.includes(badgeId)) {
      await updateDoc(userRef, {
        achievements: [...badges, badgeId]
      });
      await logAudit(uid, 'badge_unlocked', { badgeId });
    }
  }
};
