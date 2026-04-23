import { NextResponse } from "next/server";
import { readJson, updateJson } from "@/lib/storage/json-store";
import { FreelancerProfile, ClientProfile } from "@/types";

export async function POST(req: Request) {
    try {
        const { role, id, updates } = await req.json();

        if (!role || !id || !updates) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const filename = role === "freelancer" ? "freelancers.json" : "clients.json";

        await updateJson<(FreelancerProfile | ClientProfile)[]>(filename, (current) => {
            const list = (current || []) as (FreelancerProfile | ClientProfile)[];
            const index = list.findIndex(item => item.id === id);

            if (index === -1) return list;

            list[index] = { ...list[index], ...updates };
            return list;
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!role || (!id && !email)) {
        return NextResponse.json({ error: "Missing role and identifier (id or email)" }, { status: 400 });
    }

    const filename = role === "freelancer" ? "freelancers.json" : "clients.json";
    const list = await readJson<(FreelancerProfile | ClientProfile)[]>(filename) || [];

    const profile = list.find(item => {
        if (id && item.id === id) return true;
        if (email && item.email === email) return true;
        return false;
    });

    return NextResponse.json(profile || null);
}
