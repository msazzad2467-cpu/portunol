import { Level, MasteryScores, Message, WritingEvaluation, AiConversationMessage, WritingFeedback } from '../types';
export { type AiConversationMessage, type WritingFeedback };
import { GoogleGenAI, Type } from "@google/genai";
import { CONFIG } from '../config';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export interface ExamGenerationResult {
  textBase?: string;
  questions: {
    question: string;
    options?: string[];
    answer?: string;
    type?: 'multiple-choice' | 'writing' | 'matching';
    explanation?: string;
  }[];
  instructions?: string;
}

export class GeminiAiService {
  private genAi: GoogleGenAI;
  private customApiKey: string | null = null;
  private lastKeyCheck: number = 0;

  constructor() {
    const key = process.env.GEMINI_API_KEY || 'dummy_key';
    this.genAi = new GoogleGenAI({ apiKey: key });
  }

  private async ensureFreshKey() {
    const now = Date.now();
    // Check every 5 minutes
    if (now - this.lastKeyCheck < 300000 && this.customApiKey) return;
    
    try {
      const snap = await getDoc(doc(db, 'admin', 'keys'));
      if (snap.exists() && snap.data().gemini) {
        const newKey = snap.data().gemini;
        if (newKey !== this.customApiKey) {
          this.customApiKey = newKey;
          this.genAi = new GoogleGenAI({ apiKey: newKey });
        }
      }
      this.lastKeyCheck = now;
    } catch (e) {
      console.error("Failed to load custom API key:", e);
    }
  }

  private formatMasteryContext(scores: MasteryScores): string {
    const avg = (scores.reading + scores.writing + scores.grammar + scores.listening) / 4;
    let difficultyNote = "";
    if (avg > 80) {
      difficultyNote = "Generate harder questions with advanced, nuanced vocabulary and complex sentence structures. Include idiomatic expressions.";
    } else if (avg > 50) {
      difficultyNote = "Use intermediate vocabulary with moderate sentence complexity.";
    } else {
      difficultyNote = "Use only high-frequency vocabulary, short sentences, clear contexts. Avoid idioms.";
    }

    const skills = [
      { name: 'Reading', score: scores.reading },
      { name: 'Writing', score: scores.writing },
      { name: 'Grammar', score: scores.grammar },
      { name: 'Listening', score: scores.listening }
    ].sort((a, b) => a.score - b.score);

    return `
      STUDENT MASTERY CONTEXT:
      Difficulty Level: ${difficultyNote}
      Lowest Scoring Skills: ${skills[0].name} (${skills[0].score}), ${skills[1].name} (${skills[1].score}), ${skills[2].name} (${skills[2].score}).
      Weight questions specifically toward these weak areas to help them improve.
    `;
  }

  async generateExamQuestions(
    examType: 'DELE' | 'SIELE', 
    level: Level, 
    sectionType: string, 
    masteryScores?: MasteryScores,
    customPrompt?: string
  ): Promise<ExamGenerationResult> {
    await this.ensureFreshKey();
    const masteryContext = masteryScores ? this.formatMasteryContext(masteryScores) : "";
    
    const prompt = `
      ${masteryContext}
      TASK: Generate exactly 15 high-quality questions for an official ${examType} level ${level} exam.
      Section: ${sectionType}.
      
      REQUIREMENTS:
      - For Reading: Long base text (2000+ chars).
      - For Listening: Rich audio transcript (1500+ chars).
      - For Writing: 2 detailed task prompts.
      - For Grammar: Cloze, matching, and verb form choice.
      - Include "explanation" in Portuguese for each correct answer.
      ${customPrompt ? `CUSTOM INSTRUCTIONS: ${customPrompt}` : ''}
    `;

    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            textBase: { type: Type.STRING },
            instructions: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['multiple-choice', 'writing', 'matching'] },
                  explanation: { type: Type.STRING }
                },
                required: ["question"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  async evaluateWriting(text: string, level: Level = 'B1'): Promise<WritingEvaluation> {
    await this.ensureFreshKey();
    const prompt = `
      You are an official DELE examiner with 20 years of experience. 
      You are evaluating a written task submitted by a Brazilian Portuguese speaker at level ${level}. 
      Be rigorous but pedagogical.
      TEXT: "${text}"
      
      Respond ONLY with valid JSON.
    `;

    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an official DELE examiner. You MUST respond ONLY with valid JSON matching the schema for WritingEvaluation.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallBand: { type: Type.STRING, enum: ["A1", "A2", "B1", "B2", "C1", "C2"] },
            scores: {
              type: Type.OBJECT,
              properties: {
                coherence: { type: Type.NUMBER },
                lexical: { type: Type.NUMBER },
                grammar: { type: Type.NUMBER },
                task: { type: Type.NUMBER },
                register: { type: Type.NUMBER }
              }
            },
            portunholErrors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  explanation_ptbr: { type: Type.STRING }
                }
              }
            },
            highlightedErrors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["grammar", "lexical", "register", "coherence"] }
                }
              }
            },
            improvedVersion: { type: Type.STRING },
            examinerComment: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  async chat(messages: any[], context: string): Promise<{
    content: string;
    correctionBlock?: string;
    suggestion?: string;
  }> {
    await this.ensureFreshKey();
    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: messages.map(m => ({
        role: (m.role === 'user' ? 'user' : 'model') as any,
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: context,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            correctionBlock: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ["content"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      content: data.content || '',
      correctionBlock: data.correctionBlock,
      suggestion: data.suggestion
    };
  }

  async explain(topic: string, level: string | number): Promise<any> {
    await this.ensureFreshKey();
    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: `Explique o tópico "${topic}" para um estudante de espanhol nível ${level}. Use português do Brasil para a explicação e espanhol para os exemplos.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  async generateExercises(topic: string, count: number): Promise<any[]> {
    await this.ensureFreshKey();
    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: `Gere ${count} exercícios de múltipla escolha sobre o tópico "${topic}".` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  }

  async generateDrillContent(type: string, level: string): Promise<any> {
    await this.ensureFreshKey();
    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: `Gere um exercício de pronúncia/drill do tipo "${type}" para nível ${level}.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            translation: { type: Type.STRING },
            focus: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  async correct(text: string, context: string = ''): Promise<any> {
    await this.ensureFreshKey();
    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: context ? `${context}\n\nTexto: "${text}"` : `Corrija este texto em espanhol: "${text}"` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrected: { type: Type.STRING },
            explanation: { type: Type.STRING },
            explanationPt: { type: Type.STRING },
            isCorrect: { type: Type.BOOLEAN }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  async detectPortunhol(text: string): Promise<any[]> {
    await this.ensureFreshKey();
    const prompt = `
      Analyze this text for Brazilian Portuguese interference (Portunhol):
      TEXT: "${text}"
      Return ONLY a JSON array of errors.
    `;

    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Expert in Portunhol detection. Focus on false friends, direct translations, phonetic spellings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word_written: { type: Type.STRING },
              correct_spanish: { type: Type.STRING },
              error_type: { type: Type.STRING, enum: ['false_friend', 'direct_translation', 'phonetic_spelling', 'wrong_verb_form', 'word_order'] },
              explanation_ptbr: { type: Type.STRING },
              char_start: { type: Type.NUMBER },
              char_end: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }

  async evaluatePronunciation(recognized: string, target: string): Promise<any> {
    const prompt = `
      Student said: '${recognized}'. Target was: '${target}'.
      Identify critical pronunciation errors for a Brazilian (r/rr, vowel purity, stress).
    `;

    const response = await this.genAi.models.generateContent({
      model: CONFIG.geminiModel as any,
      contents: [{ role: 'user' as any, parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            errors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phoneme: { type: Type.STRING },
                  mistake: { type: Type.STRING },
                  tip: { type: Type.STRING }
                }
              }
            },
            encouragement: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }
}

export const aiService = new GeminiAiService();
