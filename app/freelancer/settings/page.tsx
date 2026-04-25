"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Upload, FileCheck, Loader2, Bell, MessageSquare, ShieldCheck, Cog, Save, Check } from "lucide-react";
import { FreelancerProfile } from "@/types";
import { ConnectWhatsApp } from "@/components/shared/ConnectWhatsApp";

export default function FreelancerSettings() {
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<Partial<FreelancerProfile> | null>(null);
    const [isEditingTelegram, setIsEditingTelegram] = useState(false);
    const [telegramConfig, setTelegramConfig] = useState({ botToken: "", chatId: "" });
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState<FreelancerProfile | null>(null);

    useEffect(() => {
        fetch("/api/config")
            .then(res => res.json())
            .then(data => setTelegramConfig(data.telegram));

        // Mock current user f2 (Ivan)
        fetch("/api/profile?role=freelancer&id=f2")
            .then(res => res.json())
            .then(setUserProfile);
    }, []);

    const handleSaveTelegram = async () => {
        setSaving(true);
        try {
            await fetch("/api/config", {
                method: "POST",
                body: JSON.stringify({ telegram: telegramConfig })
            });
            setIsEditingTelegram(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

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

    const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);
    const [qrData, setQrData] = useState<{
        qr?: string;
        status?: string;
        user?: { phone: string; name: string; device: string }
    }>({ status: "loading" });

    const isConnected = ["isLogged", "synced", "chatsAvailable", "inChat"].includes(qrData.status || "");

    // Poll for QR Code or Initial Status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/whatsapp/qr");
                const data = await res.json();
                setQrData(data);

                if (showWhatsAppQR && ["isLogged", "qrReadSuccess", "synced", "inChat", "chatsAvailable"].includes(data.status)) {
                    // Success! Close modal after a delay
                    setTimeout(() => setShowWhatsAppQR(false), 3000);
                }
            } catch (e) {
                console.error("Status Fetch Error:", e);
            }
        };

        fetchStatus(); // Initial fetch
        const interval = setInterval(fetchStatus, 5000); // Background poll

        return () => clearInterval(interval);
    }, [showWhatsAppQR]);

    return (
        <div className="max-w-3xl space-y-6 md:space-y-8">
            {/* WhatsApp QR Modal Overlay */}
            {showWhatsAppQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="max-w-md w-full p-8 space-y-6 shadow-2xl border-transparent">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">Connect WhatsApp</h2>
                            <p className="text-sm text-gray-500 font-medium">Scan this QR code with your WhatsApp app to link KolaMatch Intelligence.</p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[300px] relative">
                            {qrData.qr ? (
                                <img src={qrData.qr} alt="WhatsApp QR" className="w-64 h-64 shadow-inner rounded-lg" />
                            ) : qrData.status === "qrReadSuccess" || qrData.status === "connecting" || qrData.status === "SYNCING" ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2 animate-pulse">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">Connecting to WhatsApp...</p>
                                    <p className="text-xs text-gray-400">Verifying session with your phone.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-10 w-10 text-[#35b544] animate-spin" />
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Waiting for server...</p>
                                </div>
                            )}

                            {(qrData.status === "isLogged" || qrData.status === "synced" || qrData.status === "chatsAvailable") && (
                                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#35b544] mb-6 shadow-sm">
                                        <Check className="w-10 h-10" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">WhatsApp Connected!</p>
                                    <p className="text-gray-500 font-medium">Your number is successfully linked.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center pt-2">
                            <Button variant="ghost" className="font-bold text-gray-400 hover:text-red-500" onClick={() => setShowWhatsAppQR(false)}>
                                Cancel Connection
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Freelancer Settings</h1>
                <p className="text-gray-500">Update your profile and AI matching preferences.</p>
            </div>

            {/* Notification Preferences Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <ConnectWhatsApp role="freelancer" userId="f2" userName={userProfile?.name} initialPhone={userProfile?.phone} />

                <Card className="p-6 sm:p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544] shrink-0">
                            <Bell className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Notifications</h2>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">Manage other alerts.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800">WhatsApp Match Alerts</span>
                                <Badge className={isConnected ? "bg-green-100 text-[#35b544]" : "bg-gray-100 text-gray-400"}>
                                    {isConnected ? "Active" : "Linked via Admin"}
                                </Badge>
                            </div>
                            {isConnected && qrData.user && (
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-gray-900">{qrData.user.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">+{qrData.user.phone}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800">Telegram Match Alerts</span>
                                    <Badge className="bg-blue-100 text-blue-600 border-blue-200">Zero Setup</Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditingTelegram(!isEditingTelegram)}
                                    className="text-gray-400 hover:text-[#0088cc] h-8 w-8 p-0"
                                >
                                    <Cog className="h-4 w-4" />
                                </Button>
                            </div>

                            {isEditingTelegram ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bot Token</label>
                                        <input
                                            type="password"
                                            value={telegramConfig.botToken}
                                            onChange={(e) => setTelegramConfig({ ...telegramConfig, botToken: e.target.value })}
                                            placeholder="123456789:ABCDE..."
                                            className="block w-full rounded-xl border-gray-200 py-2.5 px-4 text-xs text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-[#0088cc] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">My Chat ID</label>
                                        <input
                                            type="text"
                                            value={telegramConfig.chatId}
                                            onChange={(e) => setTelegramConfig({ ...telegramConfig, chatId: e.target.value })}
                                            placeholder="e.g. 987654321"
                                            className="block w-full rounded-xl border-gray-200 py-2.5 px-4 text-xs text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-[#0088cc] outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button
                                            onClick={handleSaveTelegram}
                                            disabled={saving}
                                            className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] gap-2 rounded-xl font-bold py-2.5 text-xs h-10"
                                        >
                                            {saving ? <Cog className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                            Save Configuration
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={async () => {
                                                const res = await fetch("/api/telegram/notify", {
                                                    method: "POST",
                                                    body: JSON.stringify({
                                                        chatId: telegramConfig.chatId,
                                                        message: "🔔 *KolaMatch Intelligence Test*\n\nYour Telegram integration is working perfectly! 🚀"
                                                    })
                                                });
                                                const data = await res.json();
                                                if (data.success) alert("Test notification sent!");
                                                else alert("Error: " + data.error);
                                            }}
                                            className="flex-1 border-[#0088cc] text-[#0088cc] hover:bg-blue-50 rounded-xl font-bold py-2.5 text-xs h-10"
                                        >
                                            Test Link
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <p className="text-xs text-gray-500 font-medium">
                                        {telegramConfig.botToken ? "✅ Bot connected" : "❌ Bot not configured"}
                                    </p>
                                    <Button className="gap-2 font-bold px-6 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white border-transparent text-xs h-9 w-full sm:w-auto">
                                        <Check className="h-3 w-3" />
                                        Bot Ready
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* CV Upload Section */}
            <Card className="p-6 sm:p-8 shadow-sm border-gray-100">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544] shrink-0">
                        <Upload className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Professional CV</h2>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">AI will extract your skills from your PDF.</p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer relative group">
                    <input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <>
                            <Loader2 className="h-10 w-10 md:h-12 md:w-12 text-[#35b544] animate-spin mb-4" />
                            <p className="text-sm md:text-base font-bold text-gray-900">AI is analyzing profile...</p>
                        </>
                    ) : profile ? (
                        <>
                            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-[#35b544] mb-4" />
                            <p className="text-sm md:text-base font-bold text-gray-900">CV Parsed!</p>
                            <p className="text-[10px] md:text-sm text-gray-500 mt-1 font-medium text-center">Skills and experience documented.</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mb-4 group-hover:text-[#35b544] transition-colors" />
                            <p className="text-sm md:text-base font-bold text-gray-900 text-center">Click or drag your CV here</p>
                            <p className="text-[10px] md:text-sm text-gray-500 mt-1 font-medium">PDF format only (max 5MB)</p>
                        </>
                    )}
                </div>
            </Card>

            {profile && (
                <Card className="p-6 sm:p-8 shadow-sm border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 md:mb-8 text-left">Extracted AI Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <p className="text-gray-900 font-bold text-base md:text-lg px-4 py-2.5 bg-gray-50 rounded-lg">{profile.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Seniority Level</label>
                                <p className="text-gray-900 font-bold text-base md:text-lg px-4 py-2.5 bg-gray-50 rounded-lg capitalize">{profile.seniority}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Detected Skills</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {profile.skills?.map(s => (
                                    <Badge key={s} className="bg-[#35b544]/10 text-[#35b544] border-[#35b544]/20 font-bold px-3 py-1 text-[10px] md:text-xs">
                                        {s}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-100 flex justify-end">
                        <Button className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-base bg-[#35b544] hover:bg-[#2e9e3b]">
                            Save AI Profile
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
