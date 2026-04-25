import { NextResponse } from "next/server";
import { generateCompletion, Message } from "@/lib/ai/openrouter";
import { SCOPING_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { tavilyResearchForScoping } from "@/lib/ai/tavily";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const { rawInput, regions, budgetType, budgetValue, currency } = await req.json();

        if (!rawInput) {
            return NextResponse.json(
                { error: "Raw input is required" },
                { status: 400 }
            );
        }

        const targetRegions = Array.isArray(regions) ? regions : (regions ? [regions] : ["Africa"]);
        const clientBudgetStr = budgetValue ? `${budgetType === 'range' ? budgetValue.min + '-' + budgetValue.max : budgetValue} ${currency}` : "Not provided";

        // Fetch live market data from Tavily
        let liveResearch = { context: "", sources: [] as { title: string; url: string }[] };
        try {
            liveResearch = await tavilyResearchForScoping(rawInput, targetRegions);
        } catch (e) {
            console.warn("Tavily research failed, falling back to built-in knowledge:", e);
        }

        // Load available freelancers
        const dataDir = path.join(process.cwd(), "data");
        const freelancers = JSON.parse(fs.readFileSync(path.join(dataDir, "freelancers.json"), "utf-8") || "[]");
        const freelancerPool = freelancers.map((f: { id: string; name: string; skills: string[]; seniority: string; experienceYears: number; suggestedRate: string; notableProjects: string[] }) => ({
            id: f.id,
            name: f.name,
            skills: f.skills,
            seniority: f.seniority,
            experienceYears: f.experienceYears,
            suggestedRate: f.suggestedRate,
            notableProjects: f.notableProjects,
        }));

        const sourcesList = liveResearch.sources.map((s, i) => `[${i + 1}] ${s.title} - ${s.url}`).join("\n");
        const enhancedPrompt = `${SCOPING_SYSTEM_PROMPT}\n\nTARGET REGIONS: ${targetRegions.join(", ")}\nCLIENT BUDGET: ${clientBudgetStr}\n\nLIVE MARKET RESEARCH (PRIMARY SOURCE):\n${liveResearch.context}\n\nSOURCES:\n${sourcesList}\n\nAVAILABLE FREELANCERS:\n${JSON.stringify(freelancerPool)}\n\nCRITICAL: The LIVE MARKET RESEARCH above contains real-time 2026 pricing data scraped from the Internet for the regions: ${targetRegions.join(", ")}. You MUST use these live figures as your PRIMARY source for all pricing, budget ranges, and timeline estimates. If research comes from higher-cost regions, adjust them for ${targetRegions[0]}. Include a "sources" array in your JSON output referencing the source numbers you used (e.g., [1, 3]). Also, select the top 3 best-matching freelancers from the AVAILABLE FREELANCERS list and include them in a "topMatches" array. Each match must include ALL original fields (id, name, skills, seniority, experienceYears, suggestedRate, notableProjects) plus matchReason and matchScore (0-100).`;

        const messages: Message[] = [
            { role: "system", content: enhancedPrompt },
            { role: "user", content: rawInput },
        ];

        const result = await generateCompletion(messages);

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

        // Attach live research sources to the response
        parsedResult.sources = liveResearch.sources;

        return NextResponse.json(parsedResult);
    } catch (error: unknown) {
        console.error("Scoping API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
