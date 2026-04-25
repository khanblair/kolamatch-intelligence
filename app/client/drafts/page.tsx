"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { FileText, Clock, ChevronRight, Edit3 } from "lucide-react";
import { JobPost } from "@/types";
import Link from "next/link";

export default function ClientDraftsPage() {
    const [drafts, setDrafts] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const currentClientId = email === "jane@kolalogistics.com" ? "c1" : (email === "robert@keziafintech.ug" ? "c2" : "c3");

        fetch("/api/jobs")
            .then(res => res.json())
            .then(data => {
                const draftJobs = data.filter((job: JobPost) =>
                    job.status === "draft" && job.clientId === currentClientId
                );
                setDrafts(draftJobs);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Draft Projects</h1>
                <p className="text-gray-500">View and edit your previously generated project scopes.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading drafts...</div>
                ) : drafts.length === 0 ? (
                    <Card className="p-12 text-center text-gray-400">
                        No draft projects found. Go to the Dashboard to generate one!
                    </Card>
                ) : (
                    drafts.map((draft) => (
                        <Link href={`/client/drafts/${draft.id}`} key={draft.id}>
                            <Card className="p-4 sm:p-5 hover:shadow-md transition-all border-gray-100 group cursor-pointer">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="space-y-0.5">
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#35b544] transition-colors tracking-tight">
                                            {draft.title || "Untitled Project"}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-gray-400">
                                            <span className="flex items-center gap-1 font-bold uppercase tracking-tighter">
                                                <Clock className="h-3 w-3" /> {new Date(draft.createdAt || "").toLocaleDateString()}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase px-1.5 py-0 border-amber-100 bg-amber-50 text-amber-700">
                                                Draft
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{draft.summary}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <Button variant="outline" size="sm" className="gap-2 px-4 font-bold h-8 text-[11px] border-gray-100 group-hover:border-[#35b544] group-hover:text-[#35b544] transition-colors">
                                            <Edit3 className="h-3 w-3" /> Edit Scope
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
