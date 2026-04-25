"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { ArrowLeft, Send, Sparkles, Clock, Globe, Briefcase, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Job {
    id: string;
    title: string;
    summary: string;
    description: string;
    budget: string;
    suggestedRateRange: string;
    estimatedHours: number;
    clientId: string;
    status: string;
    postedAt: string;
}

export default function JobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [generatingProposal, setGeneratingProposal] = useState(false);
    const [proposal, setProposal] = useState("");

    useEffect(() => {
        // Mock fetching job data
        fetch("/api/jobs")
            .then(res => res.json())
            .then((data: Job[]) => {
                const found = data.find(j => j.id === id);
                setJob(found || null);
            });
    }, [id]);

    const stripMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/^#{1,6}\s+/gm, "")
            .replace(/^\s*[-*+]\s+/gm, "• ")
            .replace(/\[(.*?)\]\(.*?\)/g, "$1")
            .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
            .replace(/^>\s+/gm, "")
            .trim();
    };

    const handleGenerateProposal = () => {
        setGeneratingProposal(true);
        setTimeout(() => {
            const rawProposal = `Dear Client,\n\nI am excited to apply for the "${job?.title}" project. With my experience in Fullstack Engineering and Financial Structuring, I am confident I can deliver high-quality results...\n\n[AI Generated Strategic Points]\n- Professional implementation of Node.js backend logic.\n- Secure integration of payment gateways.\n- Scalable architecture designed for East African infrastructure.`;
            setProposal(stripMarkdown(rawProposal));
            setGeneratingProposal(false);
        }, 1500);
    };

    if (!job) return <div className="p-8">Loading job details...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-8">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 w-8 p-0 rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0">Project Detail</Badge>
                        <Badge className="bg-[#35b544]/5 text-[#35b544] border-transparent text-[9px] font-black px-1.5 py-0">92% Match</Badge>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{job.title}</h1>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-5 sm:p-6 border-gray-100 shadow-sm">
                        <h2 className="text-base font-bold text-gray-900 mb-3">Project Overview</h2>
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6">
                            {job.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gray-50">
                            {[
                                { label: "Budget", value: job.budget },
                                { label: "Est. Duration", value: `${job.estimatedHours} Hours` },
                                { label: "Posted", value: new Date(job.postedAt).toLocaleDateString() }
                            ].map((item, i) => (
                                <div key={i} className="space-y-0.5">
                                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-xs font-bold text-gray-900">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-5 sm:p-6 border-blue-100 bg-blue-50/20 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 leading-none mb-1">AI Match Insights</h2>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Top Match Breakdown</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                "Your Node.js proficiency matches 100% of the backend requirements.",
                                "Experience with 'KolaPay' is highly relevant for the required Mobile Money integration.",
                                "Based in Kampala, Uganda - familiar with the target market infrastructure."
                            ].map((insight, i) => (
                                <div key={i} className="flex gap-2.5 items-start">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-gray-600 text-xs font-medium leading-relaxed">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-5 sm:p-6 border-gray-100 shadow-sm">
                        <h2 className="text-base font-bold text-gray-900 mb-5 uppercase tracking-tighter">Project Phases</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Phase 1: Architecture", desc: "Design data schema and API structure.", status: "Upcoming" },
                                { title: "Phase 2: Payment Integration", desc: "Connect Beyonic and MTN/Airtel APIs.", status: "Upcoming" },
                                { title: "Phase 3: Dashboard V1", desc: "Build real-time tracking visualization.", status: "Upcoming" }
                            ].map((phase, i) => (
                                <div key={i} className="flex gap-3.5 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-0.5">{phase.title}</h3>
                                        <p className="text-[11px] text-gray-500 leading-normal">{phase.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="p-5 border-gray-100 shadow-sm sticky top-8">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">Take Action</h3>
                        <div className="space-y-2.5">
                            <Button
                                className="w-full h-10 gap-2 bg-[#35b544] hover:bg-[#2e9e3b] font-bold text-xs"
                                onClick={handleGenerateProposal}
                                disabled={generatingProposal}
                            >
                                {generatingProposal ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                {proposal ? "Regenerate Proposal" : "AI Generate Proposal"}
                            </Button>
                            <Button variant="outline" className="w-full h-10 gap-2 font-bold text-xs border-gray-200">
                                <Send className="w-3.5 h-3.5" />
                                Manual Proposal
                            </Button>
                        </div>

                        {proposal && (
                            <div className="mt-5 p-3.5 bg-gray-50 rounded-lg border border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-4">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Drafted Proposal</p>
                                <textarea
                                    className="w-full h-40 bg-white border border-gray-200 rounded-lg p-3 text-[11px] text-gray-700 outline-none focus:ring-2 focus:ring-[#35b544] transition-all"
                                    value={proposal}
                                    onChange={(e) => setProposal(e.target.value)}
                                />
                                <Button className="w-full h-10 bg-[#35b544] hover:bg-[#2e9e3b] font-bold text-xs gap-2">
                                    Submit Application
                                </Button>
                            </div>
                        )}
                    </Card>

                    <Card className="p-5 border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Client Info</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center font-bold text-sm text-gray-400">
                                KM
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-tight">Kola Logistics Ltd</p>
                                <p className="text-[10px] text-gray-500 font-medium">Verified • 4.9 ★</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full h-9 text-blue-600 font-bold hover:bg-blue-50 text-[11px]">
                            View Profile
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
