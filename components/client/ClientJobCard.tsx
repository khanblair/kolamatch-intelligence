"use client";

import { Card, Badge, Button } from "@/components/ui";
import { Users, Clock, FileText } from "lucide-react";
import { JobPost } from "@/types";

export function ClientJobCard({ job }: { job: JobPost }) {
    return (
        <Card className="p-6">
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
    );
}
