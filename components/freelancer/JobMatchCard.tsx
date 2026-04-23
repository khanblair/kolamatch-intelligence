"use client";

import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { Clock, ChevronRight, DollarSign, Briefcase } from "lucide-react";
import { JobPost } from "@/types";

export function JobMatchCard({ job }: { job: JobPost }) {
    return (
        <Link href={`/freelancer/jobs/${job.id}`} className="block">
            <Card className="p-6 sm:p-7 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#35b544]/20 transition-all cursor-pointer border-gray-100 group relative overflow-hidden">
                {/* Match Ribbon */}
                <div className="absolute top-0 right-0">
                    <div className="bg-[#35b544]/5 text-[#35b544] px-4 py-1.5 rounded-bl-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-l border-b border-[#35b544]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#35b544] animate-pulse" />
                        {job.matchScore || 95}% Match
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Header Section */}
                    <div className="space-y-3 pr-20">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#35b544] transition-colors leading-tight">
                            {job.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                                <span className="font-semibold text-gray-700">{job.budget || job.suggestedRateRange || "$1,500 - $3,000"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span className="font-semibold text-gray-700">{job.estimatedHours || 40}h est.</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 max-w-3xl">
                        {job.summary}
                    </p>

                    {/* Footer Section */}
                    <div className="pt-5 border-t border-gray-50 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 4).map(skill => (
                                <Badge key={skill} variant="secondary" className="text-[10px] font-bold py-1 px-3 border-transparent bg-gray-50 text-gray-500 rounded-lg">
                                    {skill}
                                </Badge>
                            )) || (
                                ["React", "TypeScript", "Node.js"].map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-[10px] font-bold py-1 px-3 border-transparent bg-gray-50 text-gray-500 rounded-lg">
                                        {skill}
                                    </Badge>
                                ))
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-[#35b544] font-bold text-sm group-hover:gap-3 transition-all">
                            <span>View Details</span>
                            <div className="w-8 h-8 rounded-full bg-[#35b544]/5 flex items-center justify-center group-hover:bg-[#35b544] group-hover:text-white transition-all">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
