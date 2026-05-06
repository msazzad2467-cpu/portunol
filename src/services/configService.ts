import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { CONFIG as DEFAULT_CONFIG, isAdmin } from '../config';

export interface AppConfig {
  version: string;
  maintenanceMode: boolean;
  announcement: {
    message: string;
    active: boolean;
    type: 'info' | 'warning' | 'error';
  };
  xpMultiplier: number;
  featureFlags: {
    aiTutor: boolean;
    writingAssistant: boolean;
    community: boolean;
  };
  unityAds: {
    gameId: string;
    bannerPlacement: string;
    interstitialPlacement: string;
    rewardedPlacement: string;
  };
  iaCredits: {
    rewardAmount: number;
    initialAmount: number;
    skipModuleCost: number;
    skipLessonCost: number;
  };
  adminEmails: string[];
  examPrompts: {
    [key: string]: string; // key like 'DELE-A2-Reading' or 'DELE-Writing'
  };
  externalApis?: {
    gemini?: string;
    unity?: string;
    other?: string;
  };
}

const CONFIG_DOC_PATH = 'admin/config';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const configService = {
  async getConfig(): Promise<AppConfig> {
    const docRef = doc(db, CONFIG_DOC_PATH);
    try {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as AppConfig;
      }
      
      // Only attempt to initialize if admin
      if (isAdmin(auth.currentUser?.email)) {
        await this.updateConfig(DEFAULT_CONFIG as AppConfig);
      }
      return DEFAULT_CONFIG as AppConfig;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, CONFIG_DOC_PATH);
      }
      console.error("Error fetching config:", error);
      return DEFAULT_CONFIG as AppConfig;
    }
  },

  async updateConfig(newConfig: AppConfig): Promise<void> {
    const docRef = doc(db, CONFIG_DOC_PATH);
    try {
      await setDoc(docRef, newConfig);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, CONFIG_DOC_PATH);
    }
  },

  subscribeConfig(callback: (config: AppConfig) => void) {
    const docRef = doc(db, CONFIG_DOC_PATH);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as AppConfig);
      }
    }, (error) => {
      if (error.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, CONFIG_DOC_PATH);
      }
      console.error("Snapshot error:", error);
    });
  }
};
