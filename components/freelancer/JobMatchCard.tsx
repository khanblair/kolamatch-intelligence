"use client";

import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { Clock, ChevronRight, DollarSign, Briefcase } from "lucide-react";
import { JobPost } from "@/types";

export function JobMatchCard({ job }: { job: JobPost }) {
    return (
        <Link href={`/freelancer/jobs/${job.id}`} className="block">
            <Card className="group relative overflow-hidden border-gray-100 bg-white p-7 transition-all hover:border-[#35b544]/30 hover:shadow-[0_20px_50px_rgba(53,181,68,0.06)] shadow-sm">
                {/* Match Score Badge */}
                <div className="absolute right-6 top-6">
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#35b544]/5 px-3 py-1.5 border border-[#35b544]/10">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#35b544]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#35b544]">
                            {job.matchScore || 95}% Match
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2 pr-28">
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-[#35b544] transition-colors tracking-tight leading-tight">
                            {job.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {job.clientId === "c3" ? "KolaMatch Test Client" : "Verified Client"} • Posted {new Date(job.postedAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>

                    <p className="max-w-2xl text-sm font-medium leading-relaxed text-gray-500 line-clamp-2">
                        {job.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-[#35b544]">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Budget Range</p>
                                <p className="text-xs font-black text-gray-900">{job.suggestedRateRange || job.budget || "$35 - $55 /hr"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Est. Effort</p>
                                <p className="text-xs font-black text-gray-900">{job.estimatedHours || 40} Hours</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                                <Briefcase className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Seniority</p>
                                <p className="text-xs font-black text-gray-900">Senior Level</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                        <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 3).map(skill => (
                                <Badge key={skill} variant="outline" className="border-gray-100 bg-gray-50/50 px-2.5 py-1 text-[10px] font-bold text-gray-500 rounded-md">
                                    {skill}
                                </Badge>
                            )) || ["React", "Node.js"].map(skill => (
                                <Badge key={skill} variant="outline" className="border-gray-100 bg-gray-50/50 px-2.5 py-1 text-[10px] font-bold text-gray-500 rounded-md">
                                    {skill}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 font-black text-sm text-[#35b544] group-hover:gap-3 transition-all">
                            <span>Analyze Scope</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
