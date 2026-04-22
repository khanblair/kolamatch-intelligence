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
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
