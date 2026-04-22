"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { JobPost } from "@/types";
import { JobMatchCard } from "@/components/freelancer/JobMatchCard";

export default function FreelancerDashboard() {
    const [jobs, setJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        // Mocking job feed from seed
        fetch("/api/jobs")
            .then(res => res.json())
            .then(setJobs);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Recommended Projects</h1>
                <p className="text-gray-500">Based on your CV and skills.</p>
            </div>

            <div className="space-y-4">
                {jobs.length === 0 && (
                    <Card className="p-12 text-center text-gray-500">
                        No projects matched yet. Make sure your CV is up to date in Settings.
                    </Card>
                )}

                {jobs.map((job) => (
                    <JobMatchCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}
