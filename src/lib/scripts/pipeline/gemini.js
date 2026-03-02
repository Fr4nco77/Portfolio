import { GoogleGenAI } from "@google/genai";
import { existsSync } from "node:fs";

// Intentar cargar el .env SOLO si existe (Entorno Local)
if (existsSync(".env")) {
  process.loadEnvFile();
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function gemini(prompt) {
  if (!prompt || prompt.trim() === "") return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim();
  } catch (error) {
    console.error(`❌ Gemini API Error:`, error.message);
    return null;
  }
}
