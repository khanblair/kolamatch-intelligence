import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const APPLICATIONS_PATH = path.join(DATA_DIR, "applications.json");

export async function POST(req: Request) {
    try {
        const { jobId, freelancerId, proposal, channel } = await req.json();

        if (!jobId || !freelancerId || !proposal) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const JOBS_PATH = path.join(DATA_DIR, "jobs.json");
        const CLIENTS_PATH = path.join(DATA_DIR, "clients.json");
        const FREELANCERS_PATH = path.join(DATA_DIR, "freelancers.json");

        // Ensure applications.json exists
        if (!fs.existsSync(APPLICATIONS_PATH)) {
            fs.writeFileSync(APPLICATIONS_PATH, JSON.stringify([]));
        }

        const applications = JSON.parse(fs.readFileSync(APPLICATIONS_PATH, "utf-8"));
        const newApplication = {
            id: `app_${Date.now()}`,
            jobId,
            freelancerId,
            proposal,
            channel: channel || "web",
            status: "submitted",
            appliedAt: new Date().toISOString()
        };

        applications.push(newApplication);
        fs.writeFileSync(APPLICATIONS_PATH, JSON.stringify(applications, null, 2));

        // WHATSAPP OUTREACH BRIDGE
        if (channel === "whatsapp") {
            try {
                const jobs = JSON.parse(fs.readFileSync(JOBS_PATH, "utf-8"));
                const clients = JSON.parse(fs.readFileSync(CLIENTS_PATH, "utf-8"));
                const freelancers = JSON.parse(fs.readFileSync(FREELANCERS_PATH, "utf-8"));

                const job = jobs.find((j: any) => j.id === jobId);
                const freelancer = freelancers.find((f: any) => f.id === freelancerId);
                const client = clients.find((c: any) => c.id === job?.clientId);

                if (client?.phone) {
                    const message = `🚀 *New Strategic Proposal!*\n\n*${freelancer?.name || "An expert"}* has submitted a proposal for your project: *${job?.title || "Untitled Project"}*.\n\n*Proposal Summary:* \n${proposal.substring(0, 300)}${proposal.length > 300 ? "..." : ""}\n\n*Action Required:* Would you like to accept this proposal, reject it, or ask the freelancer a follow-up question? Reply directly to this message and I will notify them!`;

                    fetch("http://localhost:3001/send", {
                        method: "POST",
                        body: JSON.stringify({ phone: client.phone, message })
                    }).catch(err => console.error("WhatsApp Bridge Error:", err));
                }
            } catch (e) {
                console.error("Outreach Bridge Error:", e);
            }
        }

        return NextResponse.json({ success: true, application: newApplication });

    } catch (error) {
        console.error("Application Error:", error);
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }
}
