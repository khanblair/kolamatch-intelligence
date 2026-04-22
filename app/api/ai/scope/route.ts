import { NextResponse } from "next/server";
import { generateCompletion, MODELS } from "@/lib/ai/openrouter";
import { SCOPING_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: Request) {
    try {
        const { rawInput } = await req.json();

        if (!rawInput) {
            return NextResponse.json(
                { error: "Raw input is required" },
                { status: 400 }
            );
        }

        const messages = [
            { role: "system", content: SCOPING_SYSTEM_PROMPT },
            { role: "user", content: rawInput },
        ];

        const result = await generateCompletion(messages as any);

        // Parse the JSON result from the AI
        let parsedResult;
        try {
            // Find the JSON block in the response if there's surrounding text
            const jsonMatch = result?.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : result;
            parsedResult = JSON.parse(jsonString || "{}");
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", result);
            return NextResponse.json(
                { error: "Failed to generate structured scope. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(parsedResult);
    } catch (error: any) {
        console.error("Scoping API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
