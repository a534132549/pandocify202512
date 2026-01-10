import { GoogleGenAI } from "@google/genai";

export const generateMathExample = async (): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error("VITE_API_KEY not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short academic markdown snippet about Quantum Mechanics. Include at least 2 inline math formulas using $...$ and 1 block math formula using $$...$$. Keep it concise.",
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "> Error: No content generated.";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "> Error generating AI content. Please check API Key.";
  }
};