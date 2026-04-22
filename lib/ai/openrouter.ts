import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter rankings
    "X-Title": "KolaMatch Intelligence", // Optional, for OpenRouter rankings
  },
});

export const MODELS = {
  GEMINI_3_FLASH: "google/gemini-3-flash-preview",
  GEMINI_2_FLASH: "google/gemini-2.0-flash-exp:free",
  GEMINI_1_5_FLASH: "google/gemini-flash-1.5",
  GPT_4O: "openai/gpt-4o",
};

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateCompletion(
  messages: Message[],
  model: string = MODELS.GEMINI_3_FLASH
) {
  try {
    const response = await openrouter.chat.completions.create({
      model: model,
      messages: messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw error;
  }
}
