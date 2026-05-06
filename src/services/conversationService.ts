import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ConversationSession, Message } from '../types';
import { aiService } from './aiService';
import { userService } from './userService';
import { CONFIG } from '../config';

export const conversationService = {
  async startSession(uid: string, scenarioId: string): Promise<string> {
    // Check credits
    // This should ideally be handled by the component before calling this
    
    const sessionData: Omit<ConversationSession, 'id'> = {
      scenario: scenarioId,
      messages: [
        {
          id: 'initial',
          role: 'assistant',
          content: `¡Hola! Soy tu tutor de español. Estoy listo para nuestra práctica de: ${scenarioId}. ¿Comenzamos?`,
          timestamp: Date.now()
        }
      ],
      startedAt: Timestamp.now(),
      totalMessages: 1,
      portunholErrors: []
    };

    const docRef = await addDoc(collection(db, 'users', uid, 'conversations'), sessionData);
    await userService.updateCredits(uid, -CONFIG.costs.conversationSession, `Início de conversa: ${scenarioId}`);
    return docRef.id;
  },

  async sendMessage(uid: string, sessionId: string, message: string, history: Message[]): Promise<{
    assistantMessage: string;
    correctionBlock?: string;
  }> {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    const updatedHistory = [...history, userMessage];
    
    // Call AI
    const scenario = history[0].content; // Or fetch from session
    const aiResponse = await aiService.chat(updatedHistory, scenario);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse.content,
      timestamp: Date.now()
    };

    if (aiResponse.correctionBlock) {
      assistantMessage.content += `\n\n${aiResponse.correctionBlock}`;
    }

    // Update Firestore
    const sessionRef = doc(db, 'users', uid, 'conversations', sessionId);
    await updateDoc(sessionRef, {
      messages: [...updatedHistory, assistantMessage],
      totalMessages: updatedHistory.length + 1
    });

    return {
      assistantMessage: aiResponse.content,
      correctionBlock: aiResponse.correctionBlock
    };
  },

  async getSessions(uid: string): Promise<ConversationSession[]> {
    const q = query(
      collection(db, 'users', uid, 'conversations'), 
      orderBy('startedAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ConversationSession));
  }
};
