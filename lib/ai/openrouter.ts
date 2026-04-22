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
  CLAUDE_3_5_SONNET: "anthropic/claude-3.5-sonnet",
  CLAUDE_3_OPUS: "anthropic/claude-3-opus",
  GPT_4O: "openai/gpt-4o",
};

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateCompletion(
  messages: Message[],
  model: string = MODELS.CLAUDE_3_5_SONNET
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
