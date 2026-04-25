import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const APPLICATIONS_PATH = path.join(DATA_DIR, "applications.json");

export async function GET() {
    try {
        if (!fs.existsSync(APPLICATIONS_PATH)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(APPLICATIONS_PATH, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}
