import { Telegraf } from "telegraf";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

function getBotToken() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
            if (data.telegram?.botToken) return data.telegram.botToken;
        }
    } catch (e) {
        console.error("Failed to read bot token from config", e);
    }
    return process.env.TELEGRAM_BOT_TOKEN;
}

// Initialize bot lazily
let bot: Telegraf | null = null;
let currentToken: string | null = null;

export function getTelegramBot() {
    const token = getBotToken();
    if (!token || token === "your_telegram_bot_token_here") return null;

    // Reset bot if token changed (e.g., set via UI)
    if (token !== currentToken) {
        bot = new Telegraf(token);
        currentToken = token;
    }

    return bot;
}

export async function sendTelegramNotification(chatId: string, message: string) {
    const telegramBot = getTelegramBot();
    if (!telegramBot) {
        console.warn("Telegram bot not configured. Message skipped.");
        return null;
    }

    try {
        return await telegramBot.telegram.sendMessage(chatId, message, {
            parse_mode: "Markdown",
        });
    } catch (error) {
        console.error("Telegram Notification Error:", error);
        return null;
    }
}
