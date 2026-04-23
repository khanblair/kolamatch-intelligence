"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Plus, Users, Clock, FileText, ChevronRight } from "lucide-react";
import { JobPost } from "@/types";
import Link from "next/link";

export default function ClientJobsPage() {
    const [jobs, setJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        fetch("/api/jobs")
            .then(res => res.json())
            .then(setJobs);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Posted Projects</h1>
                    <p className="text-gray-500">Manage your projects and review proposals.</p>
                </div>
                <Link href="/client/dashboard" className="w-full sm:w-auto">
                    <Button className="gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {jobs.length === 0 && (
                    <Card className="p-12 text-center text-gray-400">
                        You haven&apos;t posted any projects yet.
                    </Card>
                )}

                {jobs.map((job) => (
                    <Link href={`/client/jobs/${job.id}`} key={job.id}>
                        <Card className="p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer border-gray-100 group">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#35b544] transition-colors tracking-tight">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1 font-bold uppercase tracking-tighter">
                                            <Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase px-1.5 py-0 border-gray-100">{job.status}</Badge>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="gap-2 px-4 font-bold h-8 text-[11px] border-gray-200">
                                        <Users className="h-3 w-3" /> 18 Matches
                                    </Button>
                                    <Button variant="primary" size="sm" className="gap-2 px-4 font-bold h-8 text-[11px] shadow-none">
                                        View Dashboard <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
