/**
 * STANDALONE WHATSAPP BOT SERVER (AGENTIC v8)
 * BI-DIRECTIONAL PROFILE SYNC ENGINE via WPPConnect.
 */

import * as wppconnect from "@wppconnect-team/wppconnect";
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
const JOBS_PATH = path.join(DATA_DIR, "jobs.json");
const CLIENTS_PATH = path.join(DATA_DIR, "clients.json");
const FREELANCERS_PATH = path.join(DATA_DIR, "freelancers.json");
const WHATSAPP_CHATS_PATH = path.join(DATA_DIR, "whatsapp_chats.json");

const ai = new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY });
const MODEL = process.env.MODEL || "google/gemini-3-flash-preview";

// Shared Logic
const loadData = (p: string) => JSON.parse(fs.readFileSync(p, "utf-8") || (p.endsWith(".json") ? "[]" : "{}"));
const saveData = (p: string, data: unknown) => fs.writeFileSync(p, JSON.stringify(data, null, 2));

const SYSTEM_PROMPT = `
You are KolaMatch Intelligence, a high-fidelity Career Agent and Profile Sync Engine.
Your goal is to provide intelligent matchmaking and career advice on WhatsApp.

FORMATTING RULES:
- BE EXTREMELY CONCISE. No long paragraphs. Use emojis effectively.
- Use *single asterisks* for bolding (e.g. *Title*). NEVER use double asterisks.
- Do NOT use markdown headers (#, ##, ###). Use bold text for section headers instead.
- Format lists with bullet points (•) or dashes (-).
- Format matches like this: *[Job Title]* ([Budget]) — *Why:* [1 short sentence on fit].

MATCHMAKING RULES:
- When finding jobs, only return the Top 2-3 most relevant matches.
- GUIDANCE: Conclude by asking which job interests them most and offer to help them phrase a professional outreach message.

PROFILE COACH RULES:
- Be BRIEF. 
- Show current core stats (Rate, Seniority, Exp).
- Provide max 2 sharp suggestions for profile growth.
- GUIDANCE: End by offering to help them implement these specific updates or refine their technical skills list.

UPDATE RULES:
- If a user asks to change their company name, skills, rate, or seniority, you MUST:
  1. Provide a JSON block in your response starting with 'UPDATE_PROFILE: { ... }'.
  2. The JSON should contain the fields: role (client/freelancer), updates (key-value pairs).

CONTEXT:
Jobs: ${JSON.stringify(loadData(JOBS_PATH))}
Clients: ${JSON.stringify(loadData(CLIENTS_PATH))}

KNOWLEDGEBASE MAPPING:
- Jobs in 'Jobs' array are linked to Clients in 'Clients' array via 'clientId' -> 'id'.
- If a user asks "who owns this job" or "which client is this", look up the 'clientId' in the Jobs array and find the corresponding Client in the Clients array.
- You are PERMITTED to share the Client Name and Industry when asked about job ownership.
`;

// Persistent Session store (Disk-based Memory)
const userHistories: Record<string, { role: "system" | "user" | "assistant"; content: string }[]> = fs.existsSync(WHATSAPP_CHATS_PATH)
    ? JSON.parse(fs.readFileSync(WHATSAPP_CHATS_PATH, "utf-8"))
    : {};

const MAX_HISTORY = 10;
const saveHistory = () => saveData(WHATSAPP_CHATS_PATH, userHistories);

// Helper to format text for WhatsApp markdown
const formatForWhatsApp = (text: string) => {
    return text
        .replace(/\*\*\*(.*?)\*\*\*/g, "_*$1*_") // Bold + Italic
        .replace(/\*\*(.*?)\*\*/g, "*$1*")      // **bold** to *bold*
        .replace(/^#+ (.*$)/gm, "*$1*")         // # Headers to *Bold*
        .replace(/`([^`]+)`/g, "```$1```")      // `code` to ```code```
        .trim();
};

// Helper for robust JSON extraction from AI text
const extractJson = (text: string) => {
    try {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        if (jsonStart === -1 || jsonEnd === 0) return null;
        const candidate = text.substring(jsonStart, jsonEnd);
        return JSON.parse(candidate);
    } catch (e) {
        console.error("JSON Extraction Error:", e);
        return null;
    }
};

async function handleMessage(client: wppconnect.Whatsapp, message: wppconnect.Message) {
    const from = message.from;
    const body = message.body || "";
    const isMedia = message.isMedia || message.type === 'document';

    // Fetch user context (Check both freelancers and clients)
    const freelancers = loadData(FREELANCERS_PATH);
    const clients = loadData(CLIENTS_PATH);
    const userPhone = from.split('@')[0];

    let user: FreelancerProfile | ClientProfile | undefined = (freelancers as FreelancerProfile[]).find((f) => f.phone === userPhone);
    let role: "freelancer" | "client" | "guest" = "freelancer";

    if (!user) {
        user = (clients as ClientProfile[]).find((c) => c.phone === userPhone);
        role = "client";
    }

    // Guest state handling
    if (!user) {
        role = "guest";
    }

    // 📄 CV SYNC HANDLER (Freelancers only)
    if ((role === "freelancer" || role === "guest") && isMedia && message.type === 'document' && (message as { filename?: string }).filename?.toLowerCase().endsWith('.pdf')) {
        try {
            await client.sendText(from, "📥 *Processing your CV...* I'm extracting your latest skills and experience.");

            const buffer = await client.downloadMedia(message);
            const parser = new PDFParse({ data: Buffer.from(buffer, 'base64') });
            const data = await parser.getText();
            const resumeText = data.text;

            const aiExtraction = await ai.chat.completions.create({
                model: MODEL,
                messages: [
                    {
                        role: "system" as const,
                        content: `You are the KolaMatch Intelligence Full Profile Sync Engine.
                        Your task is to take a raw Resume Text and intelligently merge it into the Current User Profile.
                        
                        CURRENT USER PROFILE: ${JSON.stringify(user)}
                        
                        SYNC OBJECTIVE:
                        1. EXTRACT: Find names, emails, skills, experience, seniority, a professional summary, and notable projects.
                        2. MERGE: Intelligently combine with the Current Profile.
                           - If a field is missing in the Current Profile but present in the CV, ADD it.
                           - For 'skills', prioritizes high-value technical skills. Maintain a clean list (max 15).
                           - For 'notableProjects', merge the new ones with existing ones.
                        3. CLEAN: Ignore filler/template text.
                        
                        REQUIRED JSON STRUCTURE:
                        {
                          "name": "Full Name",
                          "email": "Email Address",
                          "skills": ["Skill 1", "Skill 2"],
                          "experienceYears": 0,
                          "seniority": "junior|mid|senior|lead",
                          "summary": "Short professional summary",
                          "notableProjects": ["Project A", "Project B"],
                          "suggestedRate": "$XX-YY/hr"
                        }
                        
                        Return ONLY the valid JSON block.`
                    },
                    { role: "user" as const, content: `RESUME TEXT:\n${resumeText}` }
                ]
            });

            const rawResponse = aiExtraction.choices[0].message.content || "{}";
            const extracted = extractJson(rawResponse);

            if (extracted) {
                const index = (freelancers as FreelancerProfile[]).findIndex((f) => f.phone === userPhone);
                const targetIndex = index > -1 ? index : 0;
                freelancers[targetIndex] = { ...freelancers[targetIndex], ...extracted, phone: userPhone };
                saveData(FREELANCERS_PATH, freelancers);

                await client.sendText(from, `✅ *Profile Synced!* 🚀\n\nI've performed a full sync of your profile via WhatsApp:\n• *Key Skills:* ${extracted.skills?.slice(0, 5).join(", ")}...\n• *Seniority:* ${extracted.seniority}\n• *Experience:* ${extracted.experienceYears} Years \n\nYour profile has been updated and merged intelligently.`);
            }
            return;
        } catch (e) {
            console.error("WhatsApp CV Error:", e);
            await client.sendText(from, "⚠️ Sorry, I had trouble parsing that CV.");
            return;
        }
    }

    // Handle explicit commands
    const command = body.toLowerCase().trim();

    // 🔗 AUTH/LINK HANDLER
    if (command.startsWith('link-')) {
        const targetId = command.replace('link-', '');
        let targetUser: FreelancerProfile | ClientProfile | undefined;
        let isFreelancer = false;

        targetUser = (freelancers as FreelancerProfile[]).find(f => f.id === targetId);
        if (targetUser) isFreelancer = true;
        else targetUser = (clients as ClientProfile[]).find(c => c.id === targetId);

        if (targetUser) {
            targetUser.phone = userPhone;
            if (isFreelancer) saveData(FREELANCERS_PATH, freelancers);
            else saveData(CLIENTS_PATH, clients);

            await client.sendText(from, `✅ *Account Linked Successfully!* 🚀\n\nWelcome back, *${targetUser.name}*. Your WhatsApp is now securely paired with your KolaMatch profile.`);
            return;
        } else {
            await client.sendText(from, `⚠️ Sorry, I couldn't find a profile with ID: *${targetId}*. Please check your settings and try again.`);
            return;
        }
    }
    if (command === '/jobs' || command === 'find jobs') {
        const response = await ai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I am ${user?.name || "unidentified"} (${role}). Based on available data, provide insights or job matches. Format with bullet points.` }
            ]
        });
        await client.sendText(from, formatForWhatsApp(response.choices[0].message.content || "🔍 No job matches found."));
        return;
    }

    if (command === '/profile' || command === 'my profile') {
        const response = await ai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I am ${user?.name || "unidentified"} (${role}). Display my profile and provide role-specific AI insights.` }
            ]
        });
        await client.sendText(from, formatForWhatsApp(response.choices[0].message.content || "👤 Profile loaded."));
        return;
    }

    if (command === '/help' || command === 'help') {
        const helpText = role === "client"
            ? "👋 *KolaMatch AI Client Assistant*\n\nCommands:\n• */jobs* - Review your posted jobs & matches\n• */profile* - View company profile\n• *Chat* - Ask about scoping or finding talent!"
            : role === "guest"
                ? "👋 *KolaMatch AI Assistant*\n\nIt looks like your number isn't linked to a profile yet.\n\nCommands:\n• *Chat* - Ask me anything!\n• */help* - See this message\n\n*Pro Tip:* Link your number in the KolaMatch Web Settings to unlock matches and CV sync!"
                : "👋 *KolaMatch AI Career Assistant*\n\nCommands:\n• */jobs* - Find matching projects\n• */profile* - View my profile & AI coaching\n• *Upload PDF* - Intelligently sync CV\n• *Chat* - Ask me anything about your career!";
        await client.sendText(from, helpText);
        return;
    }

    // Initialize/Get history
    if (!userHistories[userPhone]) userHistories[userPhone] = [];
    const history = userHistories[userPhone];

    // AI Conversational Logic
    if (body) {
        const DYNAMIC_PROMPT = `
${SYSTEM_PROMPT}
CURRENT USER: ${user?.name || "Guest"} (${role})
USER DATA: ${JSON.stringify(user || { status: "unlinked" })}

If role is 'guest', politely ask them to link their WhatsApp in the KolaMatch Settings.
If role is 'client', focus on their active jobs and finding freelancers.
If role is 'freelancer', focus on career coaching and job matches.
`;

        try {
            const messages = [
                { role: "system" as const, content: DYNAMIC_PROMPT },
                ...history,
                { role: "user" as const, content: body }
            ];

            const response = await ai.chat.completions.create({
                model: MODEL,
                messages: messages
            });

            const reply = response.choices[0].message.content || "...";

            if (reply.includes("UPDATE_PROFILE:")) {
                const parts = reply.split("UPDATE_PROFILE:");
                const jsonPart = parts[1];
                const sync = extractJson(jsonPart);

                if (sync && sync.updates) {
                    if (role === "client") {
                        const index = (clients as ClientProfile[]).findIndex((c) => c.phone === userPhone);
                        if (index > -1) {
                            clients[index] = { ...clients[index], ...sync.updates, phone: userPhone };
                            saveData(CLIENTS_PATH, clients);
                        }
                    } else {
                        const index = (freelancers as FreelancerProfile[]).findIndex((f) => f.phone === userPhone) || 0;
                        freelancers[index] = { ...freelancers[index], ...sync.updates, phone: userPhone };
                        saveData(FREELANCERS_PATH, freelancers);
                    }

                    const cleanReply = parts[0].trim();
                    await client.sendText(from, formatForWhatsApp(cleanReply || "✅ Profile updated and synced!"));
                } else {
                    await client.sendText(from, formatForWhatsApp(reply)); // Fallback to sending full reply if parse fails
                }
            } else {
                await client.sendText(from, formatForWhatsApp(reply));
            }

            // Update History
            history.push({ role: "user", content: body });
            history.push({ role: "assistant", content: reply });
            if (history.length > MAX_HISTORY) userHistories[userPhone] = history.slice(-MAX_HISTORY);
            saveHistory(); // Persist to disk
        } catch (e) {
            console.error("WhatsApp AI Error:", e);
            await client.sendText(from, "⚠️ AI Sync Error.");
        }
    }
}

wppconnect
    .create({
        session: "KolaMatch-Agent",
        mkdirFolderToken: path.join(DATA_DIR, "tokens"),
        autoClose: 0,
        whatsappVersion: '2.3000.1018901844',
        catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log("Terminal QR Code:");
            console.log(asciiQR);
            saveData(path.join(DATA_DIR, "whatsapp-qr.json"), {
                qr: base64Qrimg,
                updatedAt: new Date().toISOString(),
                status: "waiting"
            });
        },
        statusFind: (statusSession, session) => {
            console.log("Status Session: ", statusSession);
            saveData(path.join(DATA_DIR, "whatsapp-qr.json"), {
                status: statusSession,
                updatedAt: new Date().toISOString()
            });
        },
    })
    .then(async (client) => {
        console.log("🤖 WhatsApp Agent Starting...");

        try {
            const me = (await client.getHostDevice()) as unknown as {
                wid?: { user: string },
                id?: { user: string },
                pushname?: string,
                platform?: string
            };
            const phone = me?.wid?.user || me?.id?.user || "Unknown";
            const name = me?.pushname || "KolaMatch Bot";
            const device = me?.platform || "Web";

            console.log(`✅ Logged in as: ${phone} (${name}) on ${device}`);

            saveData(path.join(DATA_DIR, "whatsapp-qr.json"), {
                status: "isLogged",
                updatedAt: new Date().toISOString(),
                user: {
                    phone: phone,
                    name: name,
                    device: device
                }
            });
        } catch (e) {
            console.error("Error fetching host device info:", e);
            saveData(path.join(DATA_DIR, "whatsapp-qr.json"), {
                status: "isLogged",
                updatedAt: new Date().toISOString(),
                user: {
                    phone: "Unknown",
                    name: "WhatsApp Agent",
                    device: "Connected"
                }
            });
        }

        client.onMessage((message) => handleMessage(client, message));

        console.log("🌐 Starting Notification Bridge on port 3001...");
        // @ts-expect-error - Bun is available at runtime
        Bun.serve({
            port: 3001,
            async fetch(req: Request) {
                const url = new URL(req.url);
                if (url.pathname === "/send" && req.method === "POST") {
                    try {
                        const { phone, message } = await req.json();
                        const target = phone.includes("@") ? phone : `${phone}@c.us`;

                        await client.sendText(target, message);
                        console.log(`📡 [Bridge] Message sent to ${phone}`);

                        return Response.json({ success: true });
                    } catch (e) {
                        console.error("Bridge Error:", e);
                        return Response.json({ success: false, error: String(e) }, { status: 500 });
                    }
                }
                return new Response("KolaMatch WhatsApp Bridge", { status: 200 });
            },
        });
    })
    .catch((error) => console.log(error));
