"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { ArrowLeft, Users, Brain, BarChart3, Settings2, ShieldCheck, Mail, ChevronRight, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import { JobPost, FreelancerProfile } from "@/types";

export default function ClientJobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<JobPost | null>(null);
    const [matches, setMatches] = useState<(FreelancerProfile & { matchScore: number; fitReason: string })[]>([]);

    useEffect(() => {
        // Fetch job details
        fetch("/api/jobs")
            .then(res => res.json())
            .then((data: JobPost[]) => {
                const found = data.find(j => j.id === id);
                setJob(found || null);
            });

        // Mock fetch matches
        setMatches([
            {
                id: "f2",
                name: "Ivan Ssempijja",
                email: "ivan@freelancer.com",
                skills: ["Next.js", "Node.js", "PostgreSQL"],
                experienceYears: 7,
                seniority: "senior",
                notableProjects: ["E-Commerce Backend"],
                matchScore: 92,
                fitReason: "Strong synergy with required Node.js backend and local market experience."
            },
            {
                id: "f1",
                name: "Kezia Namugga",
                email: "kezia@example.com",
                skills: ["React Native", "TypeScript", "Mobile Money API"],
                experienceYears: 4,
                seniority: "mid",
                notableProjects: ["SafeRide App"],
                matchScore: 88,
                fitReason: "Expert in Mobile Money integration, which is critical for this project."
            }
        ]);
    }, [id]);

    if (!job) return <div className="p-8">Loading job dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-9 w-9 p-0 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold">Project Dashboard</Badge>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Active Recruiting</Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 flex-1 sm:flex-none font-bold shadow-sm">
                        <Settings2 className="h-4 w-4" /> Manage Job
                    </Button>
                    <Button className="gap-2 flex-1 sm:flex-none font-bold">
                        <Users className="h-4 w-4" /> View All Matches
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistics Overview */}
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Total Matches", value: "18", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "AI High Confidence", value: "4", icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
                        { label: "Activity Level", value: "High", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Status", value: job.status.toUpperCase(), icon: Briefcase, color: "text-green-600", bg: "bg-green-50" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-3 flex items-center gap-3 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center shrink-0`}>
                                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-base sm:text-lg font-black text-gray-900">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Left Column: Matches */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-gray-900">Top AI Matches</h2>
                        <Link href="#" className="text-[10px] font-bold text-[#35b544] hover:underline uppercase tracking-wider">Recalculate</Link>
                    </div>

                    <div className="space-y-3">
                        {matches.map((freelancer) => (
                            <Card key={freelancer.id} className="p-4 sm:p-5 border-gray-100 shadow-sm hover:border-[#35b544]/30 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-3">
                                    <Badge className="bg-[#35b544]/5 text-[#35b544] border-transparent font-black px-2 py-0 text-[10px]">
                                        {freelancer.matchScore}% Match
                                    </Badge>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-lg text-gray-400 shrink-0 border border-gray-100">
                                        {freelancer.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 space-y-2.5">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#35b544] transition-colors">{freelancer.name}</h3>
                                            <p className="text-[10px] text-gray-500 font-medium capitalize">{freelancer.seniority} Engineer • {freelancer.experienceYears} Years Exp.</p>
                                        </div>
                                        <div className="p-2.5 bg-blue-50/30 rounded-lg border border-blue-100/50">
                                            <p className="text-[10px] text-blue-700 italic font-medium leading-relaxed">
                                                "AI Insight: {freelancer.fitReason}"
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {freelancer.skills.map(skill => (
                                                <Badge key={skill} variant="outline" className="text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0 border-gray-100 bg-white">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <Button variant="primary" size="sm" className="gap-2 font-bold px-4 h-8 text-[11px]">
                                                <Mail className="w-3 h-3" /> Contact
                                            </Button>
                                            <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200 h-8 text-[11px] px-4">
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Column: Job Summary / Scope */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Project Details</h2>
                    <Card className="p-5 border-gray-100 shadow-sm space-y-5">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Scope</p>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                {job.summary}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Key Deliverables</p>
                            <div className="space-y-2">
                                {["Mobile Money Integration", "Real-time Delivery API", "Fleet Management Backend"].map((d, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] text-gray-700 font-bold">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#35b544]" />
                                        {d}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-5 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Budget Remaining</p>
                                <p className="text-sm font-black text-gray-900">$2,450</p>
                            </div>
                            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 font-bold gap-2 py-5 rounded-xl text-xs h-10">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Post Update
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-5 border-gray-100 shadow-sm bg-gray-50/20">
                        <div className="flex items-center gap-2 mb-3 text-[#35b544]">
                            <Users className="w-4 h-4" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Match Insights</h3>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                            KolaMatch AI has analyzed 124 profiles and identified 4 primary candidates that meet your 100% technical threshold.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
