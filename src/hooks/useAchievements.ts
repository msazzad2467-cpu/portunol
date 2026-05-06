import { useCallback } from 'react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

export const useAchievements = (uid: string, profile: UserProfile) => {
  const checkAll = useCallback(async (context: {
    completedExams: number;
    grammarScore: number;
    responseTime: number;
    scenarioCount: number;
    portunholCount: number;
  }) => {
    const unlocks: string[] = [];

    // Primeiro Simulado
    if (context.completedExams >= 1 && !profile.achievements.includes('first_exam')) {
      unlocks.push('first_exam');
    }

    // 7 Dias Seguidos
    if (profile.streak >= 7 && !profile.achievements.includes('streak_7')) {
      unlocks.push('streak_7');
    }

    // Mestre da Gramática
    if (context.grammarScore >= 95 && !profile.achievements.includes('grammar_master')) {
      unlocks.push('grammar_master');
    }

    // Velocista
    if (context.responseTime < 1200 && context.completedExams > 0 && !profile.achievements.includes('speedster')) {
      unlocks.push('speedster');
    }

    // Poliglota
    if (context.scenarioCount >= 5 && !profile.achievements.includes('polyglot')) {
      unlocks.push('polyglot');
    }

    // Coruja Noturna
    const hour = new Date().getHours();
    if ((hour >= 23 || hour <= 3) && !profile.achievements.includes('night_owl')) {
      unlocks.push('night_owl');
    }

    for (const badgeId of unlocks) {
      await userService.unlockBadge(uid, badgeId);
    }

    return unlocks;
  }, [uid, profile]);

  return { checkAll };
};
