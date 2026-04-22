"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { Plus, Users, Clock, FileText } from "lucide-react";
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
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Posted Projects</h1>
                    <p className="text-gray-500">Manage your projects and review proposals.</p>
                </div>
                <Link href="/dashboard">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {jobs.length === 0 && (
                    <Card className="p-12 text-center text-gray-400">
                        You haven't posted any projects yet.
                    </Card>
                )}

                {jobs.map((job) => (
                    <Card key={job.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                    <Badge>{job.status}</Badge>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <FileText className="h-4 w-4" /> Export Scope
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Users className="h-4 w-4" /> View Matches
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
