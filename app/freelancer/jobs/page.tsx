"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Clock, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";
import { JobPost } from "@/types";

export default function FreelancerJobsPage() {
    const [appliedJobs, setAppliedJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        // Mocking applied jobs for demo
        fetch("/api/jobs")
            .then(res => res.json())
            .then(jobs => {
                // Just take the first few as "applied" for the demo
                setAppliedJobs(jobs.slice(0, 2));
            });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-500">Track the status of your project proposals.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {appliedJobs.length === 0 && (
                    <Card className="p-12 text-center text-gray-400">
                        You haven&apos;t applied to any projects yet.
                    </Card>
                )}

                {appliedJobs.map((job) => (
                    <Card key={job.id} className="p-6 hover:border-green-100 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#35b544] transition-colors">{job.title}</h3>
                                    <Badge className="bg-blue-50 text-blue-600 border-blue-100">Under Review</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" /> Applied 2 days ago
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-[#35b544]" /> Proposal Viewed
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Button variant="outline" size="sm" className="gap-2 flex-1 md:flex-none">
                                    <MessageSquare className="h-4 w-4" />
                                    Chat with Client
                                </Button>
                                <Button size="sm" className="gap-2 flex-1 md:flex-none">
                                    View My Proposal
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
