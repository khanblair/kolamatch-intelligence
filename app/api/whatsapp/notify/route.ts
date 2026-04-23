import { NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/whatsapp/client";

export async function POST(req: Request) {
    try {
        const { phone, message } = await req.json();

        if (!phone || !message) {
            return NextResponse.json(
                { error: "Phone and message are required" },
                { status: 400 }
            );
        }

        const result = await sendWhatsAppNotification(phone, message);
        return NextResponse.json(result);
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
