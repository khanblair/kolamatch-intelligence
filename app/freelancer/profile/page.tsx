"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge, Progress } from "@/components/ui";
import { User, Mail, CreditCard, Award, FileText, CheckCircle2, ChevronRight, Briefcase } from "lucide-react";

export default function FreelancerProfilePage() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const res = await fetch("/api/profile?role=freelancer&email=ivan@freelancer.com").catch(() => null);
            if (res && res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        };
        loadProfile();
    }, []);

    if (!profile) return <div className="p-8 text-center text-gray-500 font-medium">Loading your profile...</div>;

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Left Column: Essential Info */}
                <Card className="w-full md:w-1/3 p-6 sm:p-8 border-t-4 border-t-[#35b544]">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative">
                            <User className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white flex items-center justify-center">
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{profile.name}</h2>
                        <Badge className="mt-1 uppercase tracking-tighter bg-green-100 text-green-700 border-green-200">{profile.seniority} developer</Badge>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Email</span>
                            <span className="font-semibold text-gray-800 truncate ml-2 max-w-[150px]">{profile.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Rate</span>
                            <span className="font-bold text-[#35b544]">{profile.suggestedRate}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /> Exp.</span>
                            <span className="font-semibold text-gray-800">{profile.experienceYears} Years</span>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Profile Strength</span>
                            <span className="text-xs font-bold text-[#35b544]">85%</span>
                        </div>
                        <Progress value={85} className="h-1.5" />
                        <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                            Add a portfolio project to reach 100% and unlock high-value matches.
                        </p>
                    </div>
                </Card>

                {/* Right Column: Skills, Sync Status & Summary */}
                <div className="flex-1 space-y-6 w-full">
                    {/* Professional Summary */}
                    {profile.summary && (
                        <Card className="p-6 sm:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#35b544]/5 rounded-bl-full -mr-16 -mt-16" />
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#35b544]" />
                                Professional Summary
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {profile.summary}
                            </p>
                        </Card>
                    )}

                    <Card className="p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-[#35b544]" />
                            Expertise & Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill: string) => (
                                <Badge key={skill} className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-white border-gray-200 text-gray-700 shadow-sm">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-[#35b544]" />
                            Notable Projects
                        </h3>
                        <div className="space-y-4">
                            {profile.notableProjects.map((project: string) => (
                                <div key={project} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group cursor-pointer hover:bg-green-50 transition-colors">
                                    <span className="font-medium text-gray-700 text-sm md:text-base">{project}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#35b544]" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Additional Highlights (Dynamic) */}
                    {profile.additionalInfo && Object.keys(profile.additionalInfo).length > 0 && (
                        <Card className="p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Additional Highlights
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(profile.additionalInfo).map(([key, value]: [string, any]) => (
                                    <div key={key} className="p-4 border border-gray-100 rounded-lg">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-sm font-medium text-gray-700">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-6 bg-[#35b544]/5 border-[#35b544]/20">
                            <h4 className="font-bold text-[#35b544] mb-1">Telegram Intelligence</h4>
                            <p className="text-xs text-green-700 leading-relaxed">
                                Your profile is synchronized with our AI CV parser. Any updates provided via Telegram will automatically appear here.
                            </p>
                        </Card>
                        <Button className="h-auto py-5 md:py-6 flex flex-col items-center justify-center gap-1 bg-gray-900 hover:bg-black w-full">
                            <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider">Next Step</span>
                            <span className="text-sm md:text-base">Generate Proposal</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
