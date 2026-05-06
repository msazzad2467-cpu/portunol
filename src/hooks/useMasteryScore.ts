import { useCallback } from 'react';
import { MasteryScores } from '../types';
import { userService } from '../services/userService';

export const useMasteryScore = (uid: string, currentScores: MasteryScores) => {
  const computeNewScore = useCallback(async (
    skill: keyof Omit<MasteryScores, 'lastUpdated'>,
    accuracy: number, // 0-100
    responseTime: number, // avg seconds
    idealTime: number = 20
  ) => {
    // accuracy_weight: 0.7, speed_weight: 0.3
    // speed score: 100 if responseTime <= idealTime, decays exponentially or linearly
    const speedScore = Math.max(0, 100 - ((responseTime - idealTime) * 2));
    const sessionScore = (accuracy * 0.7) + (speedScore * 0.3);

    // Weighted moving average: new = 0.6 * old + 0.4 * session
    const oldScore = currentScores[skill];
    const newScore = Math.round((0.6 * oldScore) + (0.4 * sessionScore));

    await userService.updateMasteryScores(uid, { [skill]: newScore });
    return newScore;
  }, [uid, currentScores]);

  return { computeNewScore };
};
