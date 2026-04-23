/**
 * STANDALONE TELEGRAM BOT SERVER (AGENTIC v8)
 * BI-DIRECTIONAL PROFILE SYNC ENGINE.
 */

import { Telegraf, Markup } from "telegraf";
import { FreelancerProfile, ClientProfile } from "@/types";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFParse = require("pdf-parse");

dotenv.config({ path: ".env.local" });

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");
const CHATS_PATH = path.join(DATA_DIR, "chats.json");
const JOBS_PATH = path.join(DATA_DIR, "jobs.json");
const CLIENTS_PATH = path.join(DATA_DIR, "clients.json");
const FREELANCERS_PATH = path.join(DATA_DIR, "freelancers.json");

const ai = new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY });
const MODEL = process.env.MODEL || "google/gemini-3-flash-preview";

// Shared Logic
const loadData = (p: string) => JSON.parse(fs.readFileSync(p, "utf-8") || (p.endsWith(".json") ? "[]" : "{}"));
const saveData = (p: string, data: unknown) => fs.writeFileSync(p, JSON.stringify(data, null, 2));

async function safeReply(ctx: { reply: (t: string, o?: Record<string, unknown>) => Promise<unknown> }, text: string) {
    try {
        await ctx.reply(text, { parse_mode: "Markdown" });
    } catch (e) {
        console.error("Markdown parse failed, sending plain text:", e);
        await ctx.reply(text);
    }
}

function getBotToken() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
            if (data.telegram?.botToken) return data.telegram.botToken;
        }
    } catch (e) { }
    return process.env.TELEGRAM_BOT_TOKEN;
}

const SYSTEM_PROMPT = `
You are KolaMatch Intelligence, a high-fidelity Career Agent and Profile Sync Engine.
Your goal is to provide intelligent matchmaking and career advice.

MATCHMAKING RULES:
- BE EXTREMELY CONCISE. No long paragraphs.
- When finding jobs, only return the Top 2-3 most relevant matches.
- Format: **[Job Title]** ([Budget]) — *Why:* [1 short sentence on fit].
- GUIDANCE: Conclude by asking which job interests them most and offer to help them phrase a professional outreach message or proposal to that specific client.

PROFILE COACH RULES:
- Be BRIEF. 
- Show current core stats (Rate, Seniority, Exp).
- Provide max 2 sharp suggestions for profile growth.
- GUIDANCE: End by offering to help them implement these specific updates or refine their technical skills list.

UPDATE RULES:
- If a user asks to change their company name, skills, rate, or seniority, you MUST:
  1. Provide a JSON block in your response starting with 'UPDATE_PROFILE: { ... }'.
  2. The JSON should contain the fields: role (client/freelancer), updates (key-value pairs).

KNOWLEDGEBASE MAPPING:
- Jobs in 'Jobs' array are linked to Clients in 'Clients' array via 'clientId' -> 'id'.
- If a user asks "who owns this job" or "which client is this", look up the 'clientId' in the Jobs array and find the corresponding Client in the Clients array.
- You are PERMITTED to share the Client Name and Industry when asked about job ownership.

CONTEXT:
Jobs: ${JSON.stringify(loadData(JOBS_PATH))}
Clients: ${JSON.stringify(loadData(CLIENTS_PATH))}
`;

const token = getBotToken();

if (!token || token === "your_telegram_bot_token_here") {
    console.log("⚠️ No token. Check config.json or .env.local");
    setInterval(() => { }, 1000);
} else {
    const bot = new Telegraf(token);

    const dashboard = Markup.keyboard([
        ["🔍 Find Jobs", "🤝 My Matches"],
        ["📊 Market Rates", "📝 Draft Proposal"],
        ["🚀 Scout Skills", "👤 My Profile"],
        ["📄 Sync CV", "❓ Help & Support"]
    ]).resize();

    // 1. JOBS (AI-DRIVEN MATCHMAKING)
    bot.hears(["🔍 Find Jobs", "/jobs"], async (ctx) => {
        const chatId = ctx.chat.id.toString();
        const freelancers = loadData(FREELANCERS_PATH) as FreelancerProfile[];
        const freelancer = freelancers.find((f) => f.telegramChatId === chatId) || freelancers[0];
        const jobs = loadData(JOBS_PATH);

        await ctx.sendChatAction("typing");
        const response = await ai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I am ${freelancer.name}. Based on my profile: ${JSON.stringify(freelancer)}, please find the best job matches for me from the available jobs. Format your response with clear bullet points and "Why it's a fit" insights.` }
            ]
        });

        await safeReply(ctx, response.choices[0].message.content || "🔍 No job matches found at the moment.");
    });

    // 2. PROFILE (AI-DRIVEN COACH)
    bot.hears(["👤 My Profile", "/profile"], async (ctx) => {
        const chatId = ctx.chat.id.toString();
        const freelancers = loadData(FREELANCERS_PATH) as FreelancerProfile[];
        const freelancer = freelancers.find((f) => f.telegramChatId === chatId) || freelancers[0];

        await ctx.sendChatAction("typing");
        const response = await ai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I am ${freelancer.name}. Here is my profile: ${JSON.stringify(freelancer)}. Please display my profile clearly AND provide a 'Career Agent Insight' with suggestions to improve my profile strength and marketability.` }
            ]
        });

        await safeReply(ctx, response.choices[0].message.content || "👤 Profile loaded.");
    });

    // 📄 CV SYNC HANDLER (PDF PARSING)
    bot.on("document", async (ctx) => {
        const doc = ctx.message.document;
        const chatId = ctx.chat.id.toString();

        if (doc.mime_type !== "application/pdf") {
            return ctx.reply("❌ Please upload your CV as a *PDF* document.", { parse_mode: "Markdown" });
        }

        try {
            await ctx.reply("📥 *Processing your CV...* I'm extracting your latest skills and experience.", { parse_mode: "Markdown" });

            const fileLink = await bot.telegram.getFileLink(doc.file_id);
            const response = await fetch(fileLink.href);
            const buffer = Buffer.from(await response.arrayBuffer());
            const parser = new PDFParse({ data: buffer });
            const data = await parser.getText();
            const resumeText = data.text;

            // Fetch current user profile for context
            const freelancers = loadData(FREELANCERS_PATH) as FreelancerProfile[];
            const index = freelancers.findIndex((f) => f.telegramChatId === chatId);
            const targetIndex = index > -1 ? index : 0;
            const currentProfile = freelancers[targetIndex];

            // Use AI to extract structured data and perform a high-fidelity MERGE with current profile
            const aiExtraction = await ai.chat.completions.create({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are the KolaMatch Intelligence Full Profile Sync Engine.
                        Your task is to take a raw Resume Text and intelligently merge it into the Current User Profile.
                        
                        CURRENT USER PROFILE: ${JSON.stringify(currentProfile)}
                        
                        SYNC OBJECTIVE:
                        1. EXTRACT: Find names, emails, skills, experience, seniority, a professional summary, and notable projects.
                        2. MERGE: Intelligently combine with the Current Profile.
                           - If a field is missing in the Current Profile but present in the CV, ADD it.
                           - If a field is present in both, MERGE or UPDATE it to reflect the latest/best info.
                           - For 'skills', prioritize high-value technical skills. Remove redundant or low-value soft skills. Maintain a clean, professional list (max 15 skills).
                           - For 'notableProjects', merge the new ones with existing ones, keeping the most impressive.
                        3. CLEAN: If the CV contains filler/template text (like instructions or generic examples), IGNORE IT completely. Only sync REAL personal data.
                        4. ROBUSTNESS: Ensure the resulting profile is complete. If 'suggestedRate' or other fields can be inferred, include them.
                        
                        REQUIRED JSON STRUCTURE:
                        {
                          "name": "Full Name",
                          "email": "Email Address",
                          "skills": ["Skill 1", "Skill 2"],
                          "experienceYears": 0,
                          "seniority": "junior|mid|senior|lead",
                          "summary": "Short professional summary",
                          "notableProjects": ["Project A", "Project B"],
                          "suggestedRate": "$XX-YY/hr",
                          "additionalInfo": { "key": "value" } 
                        }
                        
                        Return ONLY the valid JSON block representing the complete, updated profile.`
                    },
                    { role: "user", content: `RESUME TEXT:\n${resumeText}` }
                ]
            });

            const rawJson = aiExtraction.choices[0].message.content || "{}";
            const extracted = JSON.parse(rawJson.substring(rawJson.indexOf("{"), rawJson.lastIndexOf("}") + 1));

            // Update user profile directly with AI-merged data
            freelancers[targetIndex] = {
                ...freelancers[targetIndex],
                ...extracted
            };
            saveData(FREELANCERS_PATH, freelancers);

            await safeReply(ctx, `✅ *Profile Synced!* 🚀\n\nI've performed a full sync of your profile:\n• *Key Skills:* ${extracted.skills?.slice(0, 5).join(", ")}...\n• *Seniority:* ${extracted.seniority}\n• *Experience:* ${extracted.experienceYears} Years\n\nYour profile has been updated and merged intelligently.`);

        } catch (e) {
            console.error("CV Error:", e);
            ctx.reply("⚠️ Sorry, I had trouble parsing that CV. Please ensure it's a valid PDF.");
        }
    });

    // Main AI & Sync Handler
    bot.on("text", async (ctx) => {
        const text = ctx.message.text;
        const chatId = ctx.chat.id.toString();
        if (text.startsWith("/")) return;

        // Fetch current user context for the AI
        const freelancers = loadData(FREELANCERS_PATH) as FreelancerProfile[];
        const userProfile = freelancers.find((f) => f.telegramChatId === chatId) || freelancers[0];

        const DYNAMIC_PROMPT = `
${SYSTEM_PROMPT}
CURRENT USER PROFILE: ${JSON.stringify(userProfile)}
INSTRUCTIONS: 
- Be CONCISE.
- If the user wants to update their profile or provides info about themselves, encourage them to upload their CV as a PDF for a "Full Platform Sync".
- You already know the user is ${userProfile.name}.
`;

        try {
            await ctx.sendChatAction("typing");
            const response = await ai.chat.completions.create({
                model: MODEL,
                messages: [{ role: "system", content: DYNAMIC_PROMPT }, { role: "user", content: text }]
            });

            const reply = response.choices[0].message.content || "...";

            // CHECK FOR SYNC INSTRUCTION
            if (reply.includes("UPDATE_PROFILE:")) {
                const jsonStr = reply.split("UPDATE_PROFILE:")[1].trim();
                const sync = JSON.parse(jsonStr.substring(0, jsonStr.indexOf("}") + 1));

                if (sync.role === "client") {
                    const clients = loadData(CLIENTS_PATH) as ClientProfile[];
                    clients[0] = { ...clients[0], ...sync.updates };
                    saveData(CLIENTS_PATH, clients);
                } else {
                    const freelancers = loadData(FREELANCERS_PATH) as FreelancerProfile[];
                    const index = freelancers.findIndex((f) => f.telegramChatId === chatId);
                    const targetIndex = index > -1 ? index : 0;
                    freelancers[targetIndex] = { ...freelancers[targetIndex], ...sync.updates };
                    saveData(FREELANCERS_PATH, freelancers);
                }

                const cleanReply = reply.split("UPDATE_PROFILE:")[0].trim();
                await safeReply(ctx, cleanReply || "✅ Profile updated and synced to web!");
            } else {
                await safeReply(ctx, reply);
            }
        } catch (e) { ctx.reply("⚠️ AI Sync Error."); }
    });

    console.log("🤖 Agent v8 (Bi-directional Sync) Starting...");
    bot.launch();
}
