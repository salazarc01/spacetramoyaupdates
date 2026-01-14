
import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI strictly using the process.env.API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTimedMessage = async (type: 'morning' | 'evening'): Promise<string> => {
  const prompt = type === 'morning' 
    ? "Genera un mensaje corto de 'Buenos Días' (máximo 20 palabras) para una comunidad de concursos de belleza virtuales. El tono debe ser glamoroso, entusiasta y motivador. Usa emojis de coronas o destellos. Sin hashtags."
    : "Genera un mensaje corto de 'Buenas Noches' o resumen nocturno (máximo 20 palabras) para una comunidad de concursos de belleza virtuales. El tono debe ser elegante, misterioso y lleno de glamour. Habla sobre el descanso de las reinas o la espera de resultados. Sin hashtags.";

  try {
    // Calling generateContent with the model name and prompt directly.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });

    // Accessing the generated text via the .text property as recommended.
    return response.text?.trim() || (type === 'morning' ? "¡Buenos días, bellezas! Es hora de conquistar la pasarela virtual." : "¡Buenas noches! Que los sueños de corona se hagan realidad.");
  } catch (error) {
    console.error("Error generating timed message:", error);
    return type === 'morning' ? "¡Buenos días! El brillo de hoy empieza ahora." : "¡Buenas noches! Cerramos el telón por hoy.";
  }
};
