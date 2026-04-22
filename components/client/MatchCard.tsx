"use client";

import { Card, Badge, Button } from "@/components/ui";
import { User, CheckCircle2 } from "lucide-react";
import { MatchingResult, FreelancerProfile } from "@/types";

export function MatchCard({
    profile,
    match
}: {
    profile: FreelancerProfile;
    match: MatchingResult;
}) {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#35b544]">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{profile.name}</h3>
                        <p className="text-xs text-gray-500 uppercase font-black tracking-wider">{profile.seniority} Developer</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-[#35b544]">{match.matchScore}%</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Match Score</div>
                </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6 text-sm text-green-800 border border-green-100">
                <strong>Why it matches:</strong> {match.fitExplanation}
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Skills</label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {profile.skills.map(s => (
                            <Badge key={s} className="bg-white border-gray-100 text-gray-600">{s}</Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Suggested Rate</span>
                    <span className="font-bold text-gray-900">{match.suggestedRate}</span>
                </div>
                <Button size="sm">Invite to Project</Button>
            </div>
        </Card>
    );
}
