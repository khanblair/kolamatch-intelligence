"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Plus, Users, Clock, FileText, ChevronRight } from "lucide-react";
import { JobPost } from "@/types";
import Link from "next/link";

export default function ClientJobsPage() {
    const [jobs, setJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const currentClientId = email === "jane@kolalogistics.com" ? "c1" : (email === "robert@keziafintech.ug" ? "c2" : "c3");

        fetch("/api/jobs")
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter((job: JobPost) =>
                    job.clientId === currentClientId && job.status !== "draft"
                );
                setJobs(filtered);
            });
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Posted Projects</h1>
                    <p className="text-gray-500">Manage your projects and review proposals.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Link href="/client/drafts" className="flex-1 sm:flex-initial">
                        <Button variant="outline" className="gap-2 w-full font-bold border-amber-200 text-amber-700 hover:bg-amber-50">
                            <FileText className="h-4 w-4" />
                            Draft Projects
                        </Button>
                    </Link>
                    <Link href="/client/dashboard" className="flex-1 sm:flex-initial">
                        <Button className="gap-2 w-full bg-[#35b544] hover:bg-[#2e9e3b] font-bold">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Button>
                    </Link>
                </div>
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
                                    <Button variant="outline" size="sm" className="gap-2 px-4 font-bold h-8 text-[11px] border-gray-100 group-hover:border-[#35b544] group-hover:text-[#35b544] transition-colors">
                                        <Users className="h-3 w-3" /> 18 Matches
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
