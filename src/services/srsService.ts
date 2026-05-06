import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { SRSCard } from '../types';
import { aiService } from './aiService';
import { GoogleGenAI, Type } from "@google/genai";
import { CONFIG } from '../config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const calculateNextReview = (card: SRSCard, quality: number): Partial<SRSCard> => {
  let { repetitions, easeFactor, interval } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    repetitions = 0;
    interval = 1;
  }

  if (easeFactor < 1.3) easeFactor = 1.3;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    repetitions,
    easeFactor,
    interval,
    dueDate: Timestamp.fromDate(dueDate)
  };
};

export const srsService = {
  async getUserCards(uid: string): Promise<SRSCard[]> {
    const q = query(collection(db, 'users', uid, 'srsCards'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SRSCard));
  },

  async updateCard(uid: string, cardId: string, updates: Partial<SRSCard>) {
    const ref = doc(db, 'users', uid, 'srsCards', cardId);
    await updateDoc(ref, updates);
  },

  async extractAndQueueVocabulary(uid: string, wrongAnswers: any[]) {
    // Process top 5 errors to avoid huge costs
    const errorsToProcess = wrongAnswers.slice(0, 5);
    
    for (const error of errorsToProcess) {
      const prompt = `
        Based on this exam error explanation: "${error.explanation}", 
        extract the key Spanish word or phrase causing the mistake.
        Generate a JSON object with:
        { "es": "Spanish word", "pt": "Portuguese translation", "example": "Spanish example sentence" }
      `;

      try {
        const response = await ai.models.generateContent({
          model: CONFIG.geminiModel as any,
          contents: [{ role: 'user' as any, parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                es: { type: Type.STRING },
                pt: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["es", "pt", "example"]
            }
          }
        });

        const data = JSON.parse(response.text || '{}');
        
        const newCard: Omit<SRSCard, 'id'> = {
          front: data.es,
          back: data.pt,
          example: data.example,
          easeFactor: 2.5,
          interval: 0,
          dueDate: Timestamp.now(),
          repetitions: 0,
          source: 'exam_error'
        };

        await addDoc(collection(db, 'users', uid, 'srsCards'), newCard);
      } catch (e) {
        console.error('SRS Extraction failed', e);
      }
    }
  },

  async addCard(uid: string, card: Omit<SRSCard, 'id'>) {
    await addDoc(collection(db, 'users', uid, 'srsCards'), card);
  },
};
