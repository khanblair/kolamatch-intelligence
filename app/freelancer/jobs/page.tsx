"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { Clock, CheckCircle2, ChevronRight, MessageSquare, Briefcase } from "lucide-react";
import { JobPost } from "@/types";

export default function FreelancerJobsPage() {
    const [appliedJobs, setAppliedJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [jobsRes, appsRes] = await Promise.all([
                fetch("/api/jobs"),
                fetch("/api/applications")
            ]);
            const jobs: JobPost[] = await jobsRes.json();
            const apps: any[] = await appsRes.json();

            // Link applications with job data for Ivan (f2)
            const ivanApps = apps.filter(a => a.freelancerId === "f2").map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return {
                    ...job,
                    ...app // Override with app status/proposal
                };
            });
            setAppliedJobs(ivanApps);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Applications</h1>
                    <p className="text-gray-500 font-medium">Track your active bids and strategic proposals.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-4 py-2 text-center border-r border-gray-100 last:border-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active</p>
                        <p className="text-sm font-black text-gray-900 leading-none">{appliedJobs.length}</p>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Views</p>
                        <p className="text-sm font-black text-gray-900 leading-none">12</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {appliedJobs.length === 0 && (
                    <Card className="p-16 text-center border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-1">No active applications</h3>
                        <p className="text-xs text-gray-400 font-medium">Your proposals will appear here once submitted.</p>
                    </Card>
                )}

                {appliedJobs.map((job) => (
                    <Card key={job.id} className="group relative overflow-hidden bg-white/50 backdrop-blur-xl p-8 border-gray-100 transition-all hover:border-[#35b544]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-3xl">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#35b544]/20 to-transparent group-hover:from-[#35b544] transition-all duration-500" />

                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                            <div className="space-y-5 flex-1 w-full">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="font-black text-xl text-gray-900 group-hover:text-[#35b544] transition-colors tracking-tight">{job.title}</h3>
                                        <Badge className="bg-[#35b544]/5 text-[#35b544] border-[#35b544]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none">Under Review</Badge>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">
                                        Ref: KM-{job.id.substring(0, 8).toUpperCase()} • Applied {new Date(job.postedAt || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
                                    <div className="space-y-1.5">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Contract Calibration</p>
                                        <p className="text-sm font-black text-gray-900 leading-none">{job.suggestedRateRange || job.budget}</p>
                                    </div>
                                    <div className="space-y-1.5 border-l border-gray-100 pl-6">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Decision Pipeline</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-[#35b544] shadow-[0_0_8px_rgba(53,181,68,0.4)]" />
                                            <span className="text-[11px] font-bold text-gray-600">Proposal Viewed</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 border-l border-gray-100 pl-6 hidden sm:block">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Next Milestone</p>
                                        <p className="text-[11px] font-bold text-gray-400">Technical Interview</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-0 border-gray-50">
                                <Link href={`/freelancer/jobs/${job.id}`} className="flex-1 lg:flex-none">
                                    <Button variant="ghost" className="h-12 w-full lg:px-6 font-black text-[10px] text-gray-500 uppercase tracking-widest hover:bg-gray-50 border border-gray-100 rounded-2xl">
                                        Scope Details
                                    </Button>
                                </Link>
                                <Button className="h-12 flex-1 lg:px-8 bg-gray-900 hover:bg-black font-black text-[10px] text-white uppercase tracking-widest shadow-xl shadow-gray-200 rounded-2xl gap-3">
                                    <MessageSquare className="h-4 w-4 text-[#35b544]" />
                                    Messenger
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
