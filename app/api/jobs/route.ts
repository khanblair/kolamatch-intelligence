import { NextResponse } from "next/server";
import { readJson, updateJson } from "@/lib/storage/json-store";
import { JobPost } from "@/types";

export async function GET() {
    const jobs = await readJson<JobPost[]>("jobs.json") || [];
    return NextResponse.json(jobs);
}

export async function POST(req: Request) {
    const job = await req.json();

    const newJob = {
        ...job,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        status: "open"
    };

    const updatedJobs = await updateJson<JobPost[]>("jobs.json", (current) => {
        return [...(current || []), newJob];
    });

    return NextResponse.json(newJob);
}
