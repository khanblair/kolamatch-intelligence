import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

export async function GET() {
    try {
        const data = await fs.readFile(CONFIG_PATH, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ telegram: { botToken: "", chatId: "" } });
    }
}

export async function POST(req: Request) {
    try {
        const newConfig = await req.json();
        await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
