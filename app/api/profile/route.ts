import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "freelancer";
    const email = searchParams.get("email") || "ivan@freelancer.com";

    try {
        const filePath = path.join(process.cwd(), "data", role === "client" ? "clients.json" : "freelancers.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");

        // Find the specific user if email provided
        const profile = data.find((p: any) => p.email === email) || data[0];

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }
}
