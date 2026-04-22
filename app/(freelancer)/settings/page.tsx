"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { Upload, FileCheck, Loader2 } from "lucide-react";
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

            <Card className="p-8">
                <h2 className="text-lg font-semibold mb-4">Professional CV</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Upload your CV (PDF) to allow KolaMatch to extract your skills and match you with relevant projects.
                </p>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <>
                            <Loader2 className="h-10 w-10 text-[#35b544] animate-spin mb-4" />
                            <p className="text-sm font-medium text-gray-900">AI is parsing your CV...</p>
                        </>
                    ) : profile ? (
                        <>
                            <FileCheck className="h-10 w-10 text-green-600 mb-4" />
                            <p className="text-sm font-medium text-gray-900">CV successfully parsed!</p>
                            <p className="text-xs text-gray-500 mt-1">Found {profile.skills?.length} skills</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-gray-400 mb-4" />
                            <p className="text-sm font-medium text-gray-900">Click to upload your CV</p>
                            <p className="text-xs text-gray-500 mt-1">PDF format only (max 5MB)</p>
                        </>
                    )}
                </div>
            </Card>

            {profile && (
                <Card className="p-8 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-lg font-semibold mb-6">Extracted Profile</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <p className="text-gray-900 font-medium">{profile.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seniority</label>
                                <p className="text-gray-900 font-medium capitalize">{profile.seniority}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skills</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {profile.skills?.map(s => (
                                        <span key={s} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                        <Button>Save Profile</Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
