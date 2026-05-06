import { useState, useEffect, useCallback } from 'react';
import { SRSCard } from '../types';
import { srsService } from '../services/srsService';

export const useSRS = (uid: string) => {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await srsService.getUserCards(uid);
      setCards(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) fetchCards();
  }, [uid, fetchCards]);

  const dueCards = cards.filter(c => {
    const now = new Date();
    return c.dueDate.toDate() <= now;
  });

  return { cards, dueCards, loading, refresh: fetchCards };
};
