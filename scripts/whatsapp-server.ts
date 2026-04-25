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
You are KolaMatch Intelligence, a high-fidelity AI Broker and Career Agent.
Your goal is to provide intelligent matchmaking and seamlessly bridge communication between freelancers and clients on WhatsApp.

FORMATTING RULES:
- BE EXTREMELY CONCISE. No long paragraphs. Use emojis effectively.
- Use *single asterisks* for bolding (e.g. *Title*). NEVER use double asterisks.
- Do NOT use markdown headers (#, ##, ###). Use bold text for section headers instead.
- Format lists with bullet points (•) or dashes (-).

CONVERSATIONAL BRIDGING (ACT AS A BROKER):
- If a freelancer responds to a client's invitation (e.g., expressing interest, asking for details, or declining):
  1. Acknowledge their response gracefully.
  2. If they are interested or asking a question, synthesize a polite message summarizing their response.
  3. Include a JSON block: 'NOTIFY_CLIENT: { "freelancerId": "<their id>", "clientId": "<target client id>", "message": "<your synthesized message>" }'.

- If a client responds to a freelancer's proposal (e.g., accepting, rejecting, or asking a follow-up question):
  1. Acknowledge their response.
  2. Synthesize a polite, professional message forwarding their intent.
  3. Include a JSON block: 'NOTIFY_FREELANCER: { "clientId": "<their id>", "freelancerId": "<target freelancer id>", "message": "<your synthesized message>" }'.

UPDATE RULES:
- If a user asks to change their company name, skills, rate, or seniority, you MUST:
  1. Provide a JSON block in your response starting with 'UPDATE_PROFILE: { ... }'.
  2. The JSON should contain the fields: role (client/freelancer), updates (key-value pairs).

CONTEXT:
Jobs: ${JSON.stringify(loadData(JOBS_PATH))}
Clients: ${JSON.stringify(loadData(CLIENTS_PATH))}
Freelancers: ${JSON.stringify(loadData(FREELANCERS_PATH))}

KNOWLEDGEBASE MAPPING:
- Jobs in 'Jobs' array are linked to Clients in 'Clients' array via 'clientId' -> 'id'.
- You must carefully infer the target 'clientId' or 'freelancerId' from the conversation history (e.g., if you recently showed them an invite from "Kola Logistics", look up that client's ID).
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
const extractJson = (text: string, prefix: string = "") => {
    try {
        const targetString = prefix ? (text.split(prefix)[1] || "") : text;
        const jsonStart = targetString.indexOf("{");
        if (jsonStart === -1) return null;

        // Find the matching closing bracket by tracking depth
        let depth = 0;
        let jsonEnd = -1;
        for (let i = jsonStart; i < targetString.length; i++) {
            if (targetString[i] === "{") depth++;
            else if (targetString[i] === "}") {
                depth--;
                if (depth === 0) {
                    jsonEnd = i + 1;
                    break;
                }
            }
        }

        if (jsonEnd === -1) return null;

        const candidate = targetString.substring(jsonStart, jsonEnd);
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

CRITICAL DIRECTIVES FOR THIS TURN:
1. IF the user is responding to an AI proposal alert, an invite, or any broker message, YOU MUST use the CONVERSATIONAL BRIDGING rules to forward their intent using NOTIFY_FREELANCER or NOTIFY_CLIENT. Do NOT attempt to find new talent or start a new job search if they are just replying to a proposal.
2. If role is 'guest', politely ask them to link their WhatsApp in the KolaMatch Settings.
3. If they explicitly ask for new talent or job matches, ONLY THEN should you fetch jobs/freelancers.
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

            let cleanReply = reply;
            if (reply.includes("NOTIFY_CLIENT:")) {
                const parts = reply.split("NOTIFY_CLIENT:");
                cleanReply = parts[0].trim();

                for (let i = 1; i < parts.length; i++) {
                    const notification = extractJson(parts[i]);
                    if (notification && notification.clientId && notification.message) {
                        const clientsData = loadData(CLIENTS_PATH);
                        const targetClient = clientsData.find((c: any) => c.id === notification.clientId);
                        if (targetClient && targetClient.phone) {
                            await client.sendText(`${targetClient.phone}@c.us`, notification.message);
                            console.log(`📡 [AI Broker] Forwarded message to client ${targetClient.name}`);
                        }
                    }
                }
            } else if (reply.includes("NOTIFY_FREELANCER:")) {
                const parts = reply.split("NOTIFY_FREELANCER:");
                cleanReply = parts[0].trim();

                for (let i = 1; i < parts.length; i++) {
                    const notification = extractJson(parts[i]);
                    if (notification && notification.freelancerId && notification.message) {
                        const freelancersData = loadData(FREELANCERS_PATH);
                        const targetFreelancer = freelancersData.find((f: any) => f.id === notification.freelancerId);
                        if (targetFreelancer && targetFreelancer.phone) {
                            await client.sendText(`${targetFreelancer.phone}@c.us`, notification.message);
                            console.log(`📡 [AI Broker] Forwarded message to freelancer ${targetFreelancer.name}`);
                        }
                    }
                }
            } else if (reply.includes("UPDATE_PROFILE:")) {
                cleanReply = reply.split("UPDATE_PROFILE:")[0].trim();
            }

            // Always respond to the current user
            if (cleanReply) {
                await client.sendText(from, formatForWhatsApp(cleanReply));
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

                        // Sync bridge messages to AI history so it can understand replies
                        const userPhone = phone.includes("@") ? phone.split("@")[0] : phone;
                        if (!userHistories[userPhone]) userHistories[userPhone] = [];
                        userHistories[userPhone].push({ role: "assistant", content: message });
                        saveHistory();

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
