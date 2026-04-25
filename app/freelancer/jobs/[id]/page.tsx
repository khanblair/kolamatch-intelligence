"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { ArrowLeft, Send, Sparkles, Clock, Globe, Briefcase, ChevronRight, FileText, CheckCircle2, DollarSign, MessageSquare } from "lucide-react";
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
    deliverables: string[];
    phases: { name: string; duration: string; deliverables: string[] }[];
    redFlags?: string[] | string;
}

export default function JobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [client, setClient] = useState<any | null>(null);
    const [generatingProposal, setGeneratingProposal] = useState(false);
    const [proposal, setProposal] = useState("");
    const [showChannelSelector, setShowChannelSelector] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Mock fetching job data
        fetch("/api/jobs")
            .then(res => res.json())
            .then((data: Job[]) => {
                const found = data.find(j => j.id === id);
                setJob(found || null);

                if (found?.clientId) {
                    fetch(`/api/profile?role=client&id=${found.clientId}`)
                        .then(res => res.json())
                        .then(cData => setClient(cData));
                }
            });
    }, [id]);

    const handleSubmitApplication = async (channel: "whatsapp" | "telegram" | "web") => {
        if (!job || !proposal) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/jobs/apply", {
                method: "POST",
                body: JSON.stringify({
                    jobId: job.id,
                    freelancerId: "f2", // Ivan's real ID
                    proposal,
                    channel
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Application submitted successfully via ${channel}!`);
                router.push("/freelancer/dashboard");
            }
        } catch (err) {
            alert("Failed to submit application");
        } finally {
            setSubmitting(false);
            setShowChannelSelector(false);
        }
    };

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

    const handleGenerateProposal = async () => {
        if (!job) return;
        setGeneratingProposal(true);
        try {
            // Fetch Ivan's profile for real context
            const fRes = await fetch("/api/freelancers");
            const freelancers = await fRes.json();
            const freelancer = freelancers.find((f: any) => f.id === "f2") || freelancers[0];

            const res = await fetch("/api/jobs/generate-proposal", {
                method: "POST",
                body: JSON.stringify({
                    job,
                    freelancer,
                    clientName: client?.name || "KolaMatch Partner"
                }),
            });
            const data = await res.json();
            if (data.proposal) {
                setProposal(stripMarkdown(data.proposal));
            }
        } catch (err) {
            console.error("Proposal Generation Failed:", err);
        } finally {
            setGeneratingProposal(false);
        }
    };

    if (!job) return <div className="p-8">Loading job details...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Navigation Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-10 w-10 p-0 rounded-full bg-white border border-gray-100 hover:bg-gray-50 text-gray-400">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] font-black px-2 py-0.5 border-gray-200 text-gray-400 bg-white">Market Opportunity</Badge>
                            <Badge className="bg-[#35b544]/5 text-[#35b544] border-transparent text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">High Match Score</Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">{job.title}</h1>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Scoping Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Executive Summary */}
                    <Card className="p-8 border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#35b544]/20 group-hover:bg-[#35b544] transition-colors" />
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[#35b544]" /> Project Objective
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
                            {job.summary}
                        </p>
                    </Card>

                    {/* Integrated Deliverables */}
                    <Card className="p-8 border-gray-100 shadow-sm">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#35b544]" /> Strategic Deliverables
                        </h2>
                        <div className="grid gap-3">
                            {job.deliverables?.map((d, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100/50">
                                    <div className="mt-0.5 shrink-0">
                                        <div className="w-5 h-5 rounded-full bg-white border border-[#35b544]/30 flex items-center justify-center">
                                            <CheckCircle2 className="h-3 w-3 text-[#35b544]" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 tracking-tight">{d}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Development Roadmap (Phases) */}
                    {job.phases && job.phases.length > 0 && (
                        <Card className="p-8 border-gray-100 shadow-sm">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#35b544]" /> Implementation Roadmap
                            </h2>
                            <div className="space-y-6">
                                {job.phases.map((phase, i) => (
                                    <div key={i} className="relative pl-8 border-l border-gray-100 pb-2 last:pb-0">
                                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white border-2 border-[#35b544] flex items-center justify-center text-[10px] font-black text-[#35b544]">
                                            {i + 1}
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-black text-gray-900 leading-none">{phase.name}</h3>
                                            <Badge variant="outline" className="text-[9px] font-black text-[#35b544] border-[#35b544]/20 bg-green-50">{phase.duration}</Badge>
                                        </div>
                                        <ul className="space-y-1.5 mt-3">
                                            {phase.deliverables.map((del, di) => (
                                                <li key={di} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    {del}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Risk Assessment */}
                    {job.redFlags && (Array.isArray(job.redFlags) ? job.redFlags.length > 0 : !!job.redFlags) && (
                        <Card className="p-8 border-amber-100 bg-amber-50/20 shadow-sm">
                            <h2 className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-500" /> Strategic Considerations & Red Flags
                            </h2>
                            <div className="space-y-3">
                                {Array.isArray(job.redFlags) ? (
                                    job.redFlags.map((flag, i) => (
                                        <div key={i} className="flex gap-3 text-xs text-amber-800 font-bold bg-white/50 p-3 rounded-lg border border-amber-100/50">
                                            <span className="text-amber-400 mt-1 shrink-0">•</span>
                                            {flag}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex gap-3 text-xs text-amber-800 font-bold bg-white/50 p-3 rounded-lg border border-amber-100/50">
                                        <span className="text-amber-400 mt-1 shrink-0">•</span>
                                        {job.redFlags}
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="p-6 border-gray-100 shadow-xl sticky top-8 space-y-6 bg-white overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#35b544]/5 rounded-bl-full -mr-8 -mt-8 flex items-center justify-center p-6">
                            <Globe className="h-6 w-6 text-[#35b544]/20" />
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Financial Blueprint</h3>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <DollarSign className="h-5 w-5 text-[#35b544]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Calibration</p>
                                    <p className="text-lg font-black text-gray-900 leading-none tracking-tight">{job.suggestedRateRange || job.budget}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full h-12 gap-3 bg-[#35b544] hover:bg-[#2e9e3b] font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100"
                                onClick={handleGenerateProposal}
                                disabled={generatingProposal}
                            >
                                {generatingProposal ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {proposal ? "Refine Draft" : "Gen AI Proposal"}
                            </Button>
                            <Button variant="outline" className="w-full h-12 gap-3 font-black text-xs border-gray-200 text-gray-500 uppercase tracking-widest">
                                <Send className="w-4 h-4" />
                                Manual apply
                            </Button>
                        </div>

                        {proposal && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="pt-4 border-t border-gray-50">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">AI Context-Aware Proposal</label>
                                    <textarea
                                        className="w-full h-64 bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-700 font-semibold outline-none focus:ring-2 focus:ring-[#35b544]/10 transition-all leading-relaxed"
                                        value={proposal}
                                        onChange={(e) => setProposal(e.target.value)}
                                    />
                                    <Button
                                        className="w-full h-12 mt-4 bg-gray-900 hover:bg-black font-black text-xs uppercase tracking-widest gap-3"
                                        onClick={() => setShowChannelSelector(true)}
                                    >
                                        Submit Application
                                    </Button>

                                    {showChannelSelector && (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                                            <Card className="w-full max-w-sm p-8 space-y-6 shadow-2xl border-white/20 bg-white/95 backdrop-blur-xl rounded-[2rem]">
                                                <div className="text-center space-y-2">
                                                    <div className="w-16 h-16 bg-[#35b544]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                        <Send className="h-8 w-8 text-[#35b544]" />
                                                    </div>
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Outreach Channel</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select your delivery payload</p>
                                                </div>

                                                <div className="space-y-3">
                                                    <Button
                                                        onClick={() => handleSubmitApplication("whatsapp")}
                                                        disabled={submitting}
                                                        className="w-full h-14 bg-[#35b544] hover:bg-[#2e9e3b] font-black text-xs uppercase tracking-widest rounded-2xl gap-3 shadow-lg shadow-green-100"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                        WhatsApp Messenger
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleSubmitApplication("telegram")}
                                                        disabled={submitting}
                                                        variant="outline"
                                                        className="w-full h-14 border-blue-100 text-blue-600 hover:bg-blue-50 font-black text-xs uppercase tracking-widest rounded-2xl gap-3"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        Telegram Bridge
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setShowChannelSelector(false)}
                                                        className="w-full h-10 text-gray-400 font-black text-[10px] uppercase tracking-widest"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6 border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partner Identity</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center font-black text-gray-300 text-lg">
                                {client?.name ? client.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "KM"}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-black text-gray-900 leading-tight">{client?.name || "KolaMatch Partner"}</p>
                                <div className="flex items-center gap-1.5">
                                    <Badge className="bg-blue-50 text-blue-600 border-none px-1.5 py-0 text-[8px] font-black uppercase tracking-tighter">Verified</Badge>
                                    <span className="text-[10px] text-gray-400 font-bold">• 4.9 ★</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-3">
                                {client?.description || "A verified KolaMatch partner with a history of successful projects and timely payments."}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full h-10 text-gray-400 font-black hover:bg-gray-50 text-[10px] uppercase tracking-widest border border-gray-100 rounded-xl">
                            View Network
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
