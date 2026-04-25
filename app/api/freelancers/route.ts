import { NextResponse } from "next/server";
import { readJson } from "@/lib/storage/json-store";
import { FreelancerProfile } from "@/types";

export async function GET() {
    const freelancers = await readJson<FreelancerProfile[]>("freelancers.json") || [];
    return NextResponse.json(freelancers);
}
