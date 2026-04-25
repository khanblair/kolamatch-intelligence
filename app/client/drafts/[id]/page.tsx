"use client";

import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";
import { JobPost } from "@/types";
import { JobDetailsEditor } from "@/components/client/JobDetailsEditor";

export default function EditDraftPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [job, setJob] = useState<JobPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/jobs/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setJob(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-[#35b544]" /></div>;
    if (error) return <div className="p-8 text-red-500 font-bold bg-red-50 rounded-xl border border-red-100">{error}</div>;
    if (!job) return <div className="p-8 text-gray-500 font-bold text-center">Draft not found.</div>;

    return <JobDetailsEditor initialJob={job} />;
}
