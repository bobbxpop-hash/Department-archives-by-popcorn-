
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Correct initialization using process.env.API_KEY directly as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateQuiz(content: string, title: string): Promise<Quiz> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 5-question multiple choice quiz based on the following academic notes for a student. 
      The content is: "${content}".
      Each question must have 4 options and one correct answer (index 0-3).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.INTEGER }
                },
                required: ["question", "options", "correctAnswer"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    // Access text property safely
    const result = JSON.parse(response.text || "{}");
    return {
      title: result.title || `Quiz: ${title}`,
      questions: result.questions || []
    };
  }
}

export const geminiService = new GeminiService();
