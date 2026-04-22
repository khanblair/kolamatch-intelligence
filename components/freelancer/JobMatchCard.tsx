"use client";

import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { Clock, ChevronRight, Globe } from "lucide-react";
import { JobPost } from "@/types";

export function JobMatchCard({ job }: { job: JobPost }) {
    return (
        <Link href={`/freelancer/jobs/${job.id}`}>
            <Card className="p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer border-gray-100 group">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-base text-gray-900 group-hover:text-[#35b544] transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] sm:text-xs text-gray-500">
                                <span className="flex items-center gap-1 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                    <Globe className="h-3 w-3" /> {job.budget}
                                </span>
                                <span className="flex items-center gap-1 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                    <Clock className="h-3 w-3" /> {job.estimatedHours}h est.
                                </span>
                            </div>
                        </div>
                        <Badge className="bg-[#35b544]/5 text-[#35b544] hover:bg-[#35b544]/10 border-transparent font-black text-[9px] px-1.5 py-0">
                            {job.matchScore || 95}% Match
                        </Badge>
                    </div>

                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {job.summary}
                    </p>

                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                        <div className="flex gap-1.5">
                            {job.skills?.slice(0, 3).map(skill => (
                                <Badge key={skill} variant="secondary" className="text-[9px] font-bold py-0 h-4 px-1.5 border-transparent bg-gray-50 text-gray-500">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <span className="text-[#35b544] text-[10px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ChevronRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
