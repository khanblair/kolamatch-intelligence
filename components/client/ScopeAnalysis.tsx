"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { JobPost } from "@/types";

export function ScopeAnalysis({ result }: { result: Partial<JobPost> }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.title}</h2>
                    <p className="text-gray-600 mb-8">{result.summary}</p>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Deliverables</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {result.deliverables?.map((d, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <CheckCircle2 className="h-4 w-4 text-[#35b544] flex-shrink-0" />
                                {d}
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Phases</h3>
                    <div className="space-y-4">
                        {result.phases?.map((p, i) => (
                            <div key={i} className="border-l-2 border-green-100 pl-4 py-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-900">{p.name}</span>
                                    <Badge>{p.duration}</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Includes: {p.deliverables.join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Market Estimate</h3>
                    <div className="text-3xl font-bold text-[#35b544] mb-1">
                        {result.suggestedRateRange}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Est. {result.estimatedHours} total hours</p>

                    <Button className="w-full">
                        Finalize & Notify Freelancers
                    </Button>
                </Card>

                {result.redFlags && result.redFlags.length > 0 && (
                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Red Flags
                        </h3>
                        <ul className="space-y-2">
                            {result.redFlags.map((flag, i) => (
                                <li key={i} className="text-xs text-amber-800 leading-relaxed">• {flag}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
