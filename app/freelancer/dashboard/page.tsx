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
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Recommended Jobs</h1>
                <p className="text-gray-500 font-medium">Curated elite opportunities based on your expertise.</p>
            </div>

            <div className="space-y-8">
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
