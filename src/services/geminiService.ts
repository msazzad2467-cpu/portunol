import { GoogleGenAI } from "@google/genai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

let genAI: GoogleGenAI | null = null;

async function getAI() {
  if (genAI) return genAI;

  let apiKey = process.env.GEMINI_API_KEY;

  // Fallback to Firestore config if env is missing (for admin-managed keys in preview)
  if (!apiKey) {
    try {
      const configDoc = await getDoc(doc(db, 'config', 'api_keys'));
      if (configDoc.exists()) {
        apiKey = configDoc.data().gemini;
      }
    } catch (e) {
      console.error("Failed to load Gemini key from Firestore:", e);
    }
  }

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  genAI = new GoogleGenAI({ apiKey });
  return genAI;
}

export const aiTutor = {
  async explainConcept(concept: string, level: string) {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique o conceito gramatical ou vocabulário de espanhol "${concept}" para um aluno de nível ${level}. 
      A explicação deve ser em português (pt-BR), clara e amigável. 
      Inclua 3 exemplos em espanhol com tradução.`,
    });
      
    return response.text;
  },

  async getConversationResponse(history: { role: 'user' | 'model', text: string }[], userLevel: string) {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      config: {
        systemInstruction: `Você é um tutor de espanhol nativo conversando com um aluno brasileiro de nível ${userLevel}.
        Mantenha a conversa em espanhol simples de acordo com o nível. 
        Se o aluno cometer erros graves, corrija-os gentilmente em português (pt-BR) após sua resposta em espanhol.
        Seja encorajador.`
      }
    });

    return response.text;
  },

  async correctWriting(text: string, prompt: string) {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Avalie o seguinte texto em espanhol escrito por um aluno:
      Tarefa: ${prompt}
      Texto do aluno: ${text}
      
      Forneça:
      1. Uma nota de 0 a 10.
      2. Correções gramaticais detalhadas em pt-BR.
      3. Sugestões de vocabulário mais natural.`,
    });
      
    return response.text;
  }
};
