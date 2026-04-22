"use client";

import { Card, Badge, Button } from "@/components/ui";
import { Briefcase, Clock, DollarSign, ChevronRight } from "lucide-react";
import { JobPost } from "@/types";

export function JobMatchCard({ job }: { job: JobPost }) {
    return (
        <Card className="p-6 hover:border-green-200 transition-all cursor-pointer group">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#35b544] transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">{job.summary}</p>
                </div>
                <Badge className="bg-green-50 text-[#35b544] border-green-100">
                    95% Match
                </Badge>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {job.suggestedRateRange}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {job.estimatedHours} hours
                </div>
                <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {job.phases.length} Phases
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button variant="outline" className="gap-2">
                    View Scope & Apply
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}
