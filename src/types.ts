import { Timestamp } from 'firebase/firestore';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface MasteryScores {
  reading: number;
  writing: number;
  grammar: number;
  listening: number;
  lastUpdated: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  profile?: {
    bio?: string;
    location?: string;
    targetAccent?: string;
  };
  targetLevel: Level;
  currentLevel: Level;
  xp: number;
  weeklyXP: number;
  coins: number;
  streak: number;
  checkInStreak?: number; // legacy
  missions?: Mission[];
  streakShieldActive: boolean;
  lastLoginDate: string | null;
  masteryScores: MasteryScores;
  achievements: string[]; // slug/id
  leagueTier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  fcmToken?: string;
  onboardingComplete: boolean;
  unlockedExams: string[];
  rewards: {
    dailyCheckin: boolean;
    missions: string[];
    aiCredits: number;
  };
  createdAt: Timestamp;
}

export interface SRSCard {
  id: string;
  front: string; // Spanish
  back: string; // PT-BR + example
  es?: string; // Alias for front
  pt?: string; // Alias for back
  example: string;
  easeFactor: number;
  interval: number;
  dueDate: Timestamp | any;
  nextReview?: Timestamp | any; // Alias for dueDate
  repetitions: number;
  source: 'manual' | 'exam_error';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ConversationSession {
  id: string;
  scenario: string;
  messages: Message[];
  startedAt: Timestamp;
  endedAt?: Timestamp;
  totalMessages: number;
  portunholErrors: string[];
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Timestamp;
}

export interface LeagueEntry {
  uid: string;
  name: string;
  avatar: string;
  weeklyXP: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface WritingEvaluation {
  id: string;
  timestamp: Timestamp;
  originalText: string;
  improvedVersion: string;
  overallBand: Level;
  scores: {
    coherence: number;
    lexical: number;
    grammar: number;
    task: number;
    register: number;
  };
  portunholErrors: { phrase: string; explanation_ptbr: string }[];
  highlightedErrors: {
    text: string;
    correction: string;
    explanation: string;
    type: 'grammar' | 'lexical' | 'register' | 'coherence';
  }[];
  examinerComment: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  timestamp: Timestamp;
  level: Level;
  scores: Record<string, number>; // sectionId -> score
  totalScore: number;
  passed: boolean;
  sections: {
    id: string;
    accuracy: number;
    responseTime: number; // avg seconds per question
  }[];
}

export interface FeatureFlags {
  srsEnabled: boolean;
  conversationTutorEnabled: boolean;
  adsEnabled: boolean;
  leaguesEnabled: boolean;
  pronunciationDrillEnabled: boolean;
  portunholDetectorEnabled: boolean;
  maintenanceMode: boolean;
}

export interface AdminKPI {
  totalUsers: number;
  dau: number;
  avgSessionDuration: number;
  totalExamsWeekly: number;
  coinsSpentWeekly: number;
  coinsEarnedWeekly: number;
  tutorSessionsWeekly: number;
}

export interface PromptConfig {
  id: string;
  level: Level;
  section: string;
  prompt: string;
  version: number;
  updatedAt: Timestamp;
}

// Added for compatibility with existing components
export interface UserProgress extends UserProfile {}
export interface AiConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestion?: string;
}
export interface WritingFeedback {
  content: string;
  score: number;
  errors: any[];
}
export interface LibraryItem {
  id: string;
  title: string;
  level: Level;
  type: string;
  content: string;
}
export interface Module {
  id: string;
  title: string;
  level: Level;
  lessons: any[];
  isLocked?: boolean;
  completion?: number;
}
export interface SRSItem extends SRSCard {}
export interface ExamMock {
  id: string;
  title: string;
  level: Level;
  questions?: any[];
  examType?: string;
  sections?: any[];
}
export interface Mission {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  count?: number;
  goal?: number;
}
export interface DictionaryEntry {
  id?: string;
  word?: string; // legacy
  translation?: string; // legacy
  es: string;
  pt: string;
  examples: (string | { es: string; pt: string })[];
  type?: string;
  gender?: string;
  conjugationId?: string;
}
export type LessonType = 'reading' | 'listening' | 'grammar' | 'writing' | 'vocabulary';
export interface LessonContent {
  id: string;
  type: LessonType;
  title: string;
  text?: string;
  questions: any[];
}
export interface GrammarTopic {
  id: string;
  title: string;
  description?: string;
  explanation?: string; // Alias or extra field
  examples: (string | { es: string; pt: string })[];
  quiz?: any[];
}
