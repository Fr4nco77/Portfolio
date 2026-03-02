import { GoogleGenAI } from "@google/genai";
import { existsSync } from "node:fs";

// Intentar cargar el .env SOLO si existe (Entorno Local)
if (existsSync(".env")) {
  process.loadEnvFile();
}

const ai = new GoogleGenAI({});

export default async function gemini(prompt) {
  if (!prompt || prompt.trim() === "") return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim();
  } catch (error) {
    console.error(`\n❌ Gemini API Error:`, error.message);
    return null;
  }
}
