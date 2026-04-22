"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Upload, FileCheck, Loader2, Bell, MessageSquare, ShieldCheck } from "lucide-react";
import { FreelancerProfile } from "@/types";

export default function FreelancerSettings() {
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<Partial<FreelancerProfile> | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const mockCvText = "Ivan Ssempijja, Senior Full Stack Developer with 6 years of experience in Next.js, Node.js and PostgreSQL. Worked on HealthTrack and E-commerce platforms.";

        try {
            const res = await fetch("/api/cv/parse", {
                method: "POST",
                body: JSON.stringify({ text: mockCvText, fileName: file.name })
            });
            const data = await res.json();
            setProfile(data);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Freelancer Settings</h1>
                <p className="text-gray-500">Update your profile and AI matching preferences.</p>
            </div>

            {/* Notification Preferences Section */}
            <Card className="p-8 shadow-sm border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                        <p className="text-sm text-gray-500 font-medium">Get matched projects delivered instantly.</p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800">WhatsApp Match Alerts</span>
                        <Badge className="bg-green-100 text-[#35b544] border-green-200">Instant</Badge>
                    </div>
                    <Button className="gap-2 font-bold px-6 rounded-xl bg-[#35b544] hover:bg-[#2e9e3b]">
                        <MessageSquare className="h-4 w-4" />
                        Connect WhatsApp
                    </Button>
                </div>
            </Card>

            {/* CV Upload Section */}
            <Card className="p-8 shadow-sm border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Professional CV</h2>
                        <p className="text-sm text-gray-500 font-medium">AI will extract your skills from your PDF.</p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer relative group">
                    <input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <>
                            <Loader2 className="h-12 w-12 text-[#35b544] animate-spin mb-4" />
                            <p className="text-base font-bold text-gray-900">AI is analyzing your profile...</p>
                        </>
                    ) : profile ? (
                        <>
                            <ShieldCheck className="h-12 w-12 text-[#35b544] mb-4" />
                            <p className="text-base font-bold text-gray-900">CV Successfully Parsed!</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Skills and experience documented.</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-12 w-12 text-gray-300 mb-4 group-hover:text-[#35b544] transition-colors" />
                            <p className="text-base font-bold text-gray-900">Click or drag your CV here</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">PDF format only (max 5MB)</p>
                        </>
                    )}
                </div>
            </Card>

            {profile && (
                <Card className="p-8 shadow-sm border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-8">Extracted AI Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <p className="text-gray-900 font-bold text-lg px-4 py-2 bg-gray-50 rounded-lg">{profile.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seniority Level</label>
                                <p className="text-gray-900 font-bold text-lg px-4 py-2 bg-gray-50 rounded-lg capitalize">{profile.seniority}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Detected Skills</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {profile.skills?.map(s => (
                                    <Badge key={s} className="bg-[#35b544]/10 text-[#35b544] border-[#35b544]/20 font-bold px-3 py-1">
                                        {s}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                        <Button className="px-8 py-6 rounded-xl font-bold text-base bg-[#35b544] hover:bg-[#2e9e3b]">
                            Save AI Profile
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
