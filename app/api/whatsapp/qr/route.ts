import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const QR_PATH = path.join(DATA_DIR, "whatsapp-qr.json");

export async function GET() {
    try {
        const data = await fs.readFile(QR_PATH, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ status: "not_started" });
    }
}
