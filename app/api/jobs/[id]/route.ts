import { NextResponse } from "next/server";
import { readJson, updateJson } from "@/lib/storage/json-store";
import { JobPost } from "@/types";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const jobs = await readJson<JobPost[]>("jobs.json") || [];
    const job = jobs.find(j => j.id === id);

    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const updates = await req.json();

    const updatedJobs = await updateJson<JobPost[]>("jobs.json", (current) => {
        return (current || []).map(job =>
            job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job
        );
    });

    const updatedJob = updatedJobs.find(j => j.id === id);
    return NextResponse.json(updatedJob);
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const updatedJobs = await updateJson<JobPost[]>("jobs.json", (current) => {
        return (current || []).filter(job => job.id !== id);
    });

    return NextResponse.json({ success: true });
}
