import { NextResponse } from "next/server";
import { generateCompletion, Message } from "@/lib/ai/openrouter";

// Utility to extract text from a PDF (Mocked for demo, as actual PDF parsing inside Next.js needs heavy deps like pdf-parse)
// In a real scenario, we'd use a server action or a dedicated microservice.
// For the demo, we'll assume the client sends the extracted text or we use OpenRouter with a Vision model if it supports PDFs directly.
// OpenRouter's Google Gemini Flash supports PDF input directly in some contexts, but here we'll simulate the text parsing.

export async function POST(req: Request) {
    try {
        const { text, fileName } = await req.json();

        const systemPrompt = `
      You are an expert CV parser. Extract the following from the CV text into JSON:
      - name: Full name
      - skills: Array of technical skills
      - experienceYears: Total years of experience (number)
      - seniority: junior, mid, or senior
      - notableProjects: Array of project names/descriptions
      
      Return ONLY valid JSON.
    `;

        const messages: Message[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
        ];

        const result = await generateCompletion(messages);
        const parsed = JSON.parse(result || "{}");

        return NextResponse.json(parsed);
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
