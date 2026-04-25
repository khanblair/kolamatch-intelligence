import { NextResponse } from "next/server";
import OpenAI from "openai";

const ai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { job, freelancer, clientName } = await req.json();

        const prompt = `
            You are a world-class strategic proposal writer for KolaMatch.
            Write a highly persuasive, ULTRA-CONCISE proposal (max 150 words).

            PROJECT: ${job.title}
            CLIENT: ${clientName || "KolaMatch Partner"}
            STRATEGIC DELIVERABLES: ${job.deliverables?.join(", ")}

            FREELANCER: ${freelancer.name}
            EXPERTISE: ${freelancer.skills?.join(", ")}
            SENIORITY: ${freelancer.seniority}

            PROPOSAL STRUCTURE:
            1. Salutation: "Dear ${clientName || "KolaMatch Partner"}..."
            2. Value Proposition: 2 sentences max on why you are the perfect fit.
            3. Execution Strategy: 1 bullet point on how you'll handle key deliverables.
            4. Local/Domain Context: 1 sentence.
            5. Professional sign-off.

            TONE: Elite, strategic, and brief.
        `;

        const response = await ai.chat.completions.create({
            model: process.env.MODEL || "google/gemini-3-flash-preview",
            messages: [
                { role: "system", content: "You write elite, context-aware freelancer proposals." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        return NextResponse.json({
            proposal: response.choices[0].message.content
        });

    } catch (error) {
        console.error("AI Proposal Error:", error);
        return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 });
    }
}
