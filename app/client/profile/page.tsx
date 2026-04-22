"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { Building2, Mail, Briefcase, Globe, Edit3, Save } from "lucide-react";

export default function ClientProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            const res = await fetch("/api/profile?role=client&email=jane@kolalogistics.com").catch(() => null);
            if (res && res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        };
        loadProfile();
    }, []);

    if (!profile) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Profile</h1>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Manage your company information and AI visibility.</p>
                </div>
                <Button
                    variant={isEditing ? "primary" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2 w-full sm:w-auto"
                >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {isEditing ? "Save Profile" : "Edit Profile"}
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 md:col-span-2">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                <Building2 className="text-[#35b544] w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
                                {isEditing ? (
                                    <Input value={profile.name} className="mt-1" />
                                ) : (
                                    <p className="text-xl font-semibold text-gray-900 mt-1">{profile.name}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Industry</label>
                            {isEditing ? (
                                <Input value={profile.industry} className="mt-1" />
                            ) : (
                                <div className="mt-2">
                                    <Badge className="text-green-600 border-green-200 bg-green-50">
                                        {profile.industry}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                            {isEditing ? (
                                <textarea className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500" rows={4} value={profile.description} />
                            ) : (
                                <p className="text-gray-600 mt-2 leading-relaxed">{profile.description}</p>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Contact Person</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-800 font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-800 font-medium">www.kolalogistics.com</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-green-50 border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-green-700 uppercase">Telegram Sync Active</span>
                        </div>
                        <p className="text-sm text-green-800">
                            You can update this profile by telling KolaMatch Intelligence on Telegram.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
