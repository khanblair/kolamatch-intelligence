import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram/bot";

export async function POST(req: Request) {
    try {
        const { chatId, message } = await req.json();

        if (!chatId || !message) {
            return NextResponse.json({ error: "chatId and message are required" }, { status: 400 });
        }

        const result = await sendTelegramNotification(chatId, message);

        if (!result) {
            return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
