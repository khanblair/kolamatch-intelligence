"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, X, Star, Briefcase, DollarSign, Award, Lightbulb } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { JobPost } from "@/types";

export function ScopeAnalysis({ result }: { result: Partial<JobPost> }) {
    const [selectedFreelancer, setSelectedFreelancer] = useState<typeof result.topMatches extends (infer T)[] ? T : null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                <Card className="p-6 sm:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{result.title}</h2>
                    <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">{result.summary}</p>

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

                    {result.futureImplementations && result.futureImplementations.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Future Implementations</h3>
                            <div className="space-y-3">
                                {result.futureImplementations.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                                        <Lightbulb className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>

                {result.topMatches && result.topMatches.length > 0 && (
                    <Card className="p-6 sm:p-8 border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Star className="h-5 w-5 text-[#35b544] fill-[#35b544]" />
                            Top 3 Recommended Freelancers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {result.topMatches.map((match, i) => (
                                <div
                                    key={match.id}
                                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-[#35b544]/30 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => setSelectedFreelancer(match)}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                                            {match.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{match.name}</p>
                                            <p className="text-xs text-gray-500">{match.seniority} • {match.experienceYears}y exp</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-[#35b544]">{match.matchScore}% Match</span>
                                        <span className="text-xs text-gray-500">{match.suggestedRate}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{match.matchReason}</p>
                                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">View Profile</span>
                                        <span className="text-[#35b544] group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
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

                {result.sources && result.sources.length > 0 && (
                    <Card className="p-6 border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                            <CheckCircle2 className="h-4 w-4 text-[#35b544]" />
                            Live Research Sources
                        </h3>
                        <ul className="space-y-3">
                            {result.sources.map((source: { title: string; url: string }, i: number) => (
                                <li key={i} className="text-sm leading-relaxed">
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#35b544] hover:underline transition-colors font-medium">
                                        <span className="text-[#35b544] font-bold mr-1">[{i + 1}]</span> {source.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>

            {selectedFreelancer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedFreelancer(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                                    {selectedFreelancer.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedFreelancer.name}</h3>
                                    <p className="text-sm text-gray-500">{selectedFreelancer.seniority} • {selectedFreelancer.experienceYears} years exp</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFreelancer(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Award className="h-5 w-5 text-[#35b544]" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Match Score</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedFreelancer.matchScore}% — {selectedFreelancer.matchReason}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFreelancer.skills.map((skill: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notable Projects</p>
                                <ul className="space-y-1">
                                    {selectedFreelancer.notableProjects.map((project: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                                            {project}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                <DollarSign className="h-5 w-5 text-[#35b544]" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Suggested Rate</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedFreelancer.suggestedRate}</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-6 bg-[#35b544] hover:bg-[#2e9e3b]">
                            Invite to Project
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
