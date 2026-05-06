import { useState, useCallback } from 'react';
import { Message } from '../types';
import { conversationService } from '../services/conversationService';

export const useConversation = (uid: string) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const startNew = useCallback(async (scenarioId: string) => {
    setLoading(true);
    try {
      const id = await conversationService.startSession(uid, scenarioId);
      setSessionId(id);
      setMessages([
        {
          id: 'initial',
          role: 'assistant',
          content: `¡Hola! Soy tu tutor de español. Estoy listo para nuestra práctica de: ${scenarioId}. ¿Comenzamos?`,
          timestamp: Date.now()
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  const send = useCallback(async (text: string) => {
    if (!sessionId) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await conversationService.sendMessage(uid, sessionId, text, messages);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.assistantMessage + (response.correctionBlock ? `\n\n${response.correctionBlock}` : ''),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [uid, sessionId, messages]);

  return { sessionId, messages, loading, startNew, send };
};
