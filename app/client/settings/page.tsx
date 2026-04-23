"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { User, Bell, Shield, Wallet, MessageSquare, Cog, Check, Save, Loader2 } from "lucide-react";

import { ClientProfile } from "@/types";
import { ConnectWhatsApp } from "@/components/shared/ConnectWhatsApp";

export default function ClientSettings() {
    const [isEditingTelegram, setIsEditingTelegram] = useState(false);
    const [telegramConfig, setTelegramConfig] = useState({ botToken: "", chatId: "" });
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState<ClientProfile | null>(null);

    useEffect(() => {
        fetch("/api/config")
            .then(res => res.json())
            .then(data => setTelegramConfig(data.telegram));

        // Mock current user c1
        fetch("/api/profile?role=client&id=c1")
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
                                    <p className="text-gray-500 font-medium">Your company profile is linked.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Client Settings</h1>
                <p className="text-gray-500">Manage your company profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Account Profile Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <ConnectWhatsApp role="client" userId="c1" initialPhone={userProfile?.phone} />

                    <Card className="p-6 sm:p-8 shadow-sm border-gray-100">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544] shrink-0">
                                <User className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">Account Profile</h2>
                                <p className="text-xs md:text-sm text-gray-500 font-medium">Update company contact info.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</label>
                                <p className="text-gray-900 font-bold text-sm">Kola Logistics Ltd</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Industry</label>
                                <p className="text-gray-900 font-bold text-sm">Logistics</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Notification Preferences Section */}
                <Card className="p-6 sm:p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544] shrink-0">
                            <Bell className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Notification Preferences</h2>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">Control how you receive project updates.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800">WhatsApp Alerts</span>
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
                                    <span className="font-bold text-gray-800">Telegram Notifications</span>
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
                                    <div className="space-y-1 text-left">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bot Token</label>
                                        <input
                                            type="password"
                                            value={telegramConfig.botToken}
                                            onChange={(e) => setTelegramConfig({ ...telegramConfig, botToken: e.target.value })}
                                            placeholder="123456789:ABCDE..."
                                            className="block w-full rounded-xl border-gray-200 py-2.5 px-4 text-xs text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-[#0088cc] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1 text-left">
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

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 gap-2">
                            <span className="font-bold text-gray-800">Email Summaries (Weekly)</span>
                            <Badge className="text-gray-400 border-gray-200 bg-transparent">Inactive</Badge>
                        </div>
                    </div>
                </Card>

                {/* Billing & Rates Section */}
                <Card className="p-6 sm:p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544] shrink-0">
                            <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Billing & Rates</h2>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">Manage your preferred currency and rate cards.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-800 text-sm md:text-base">Default Currency</span>
                        <Badge className="bg-gray-900 text-white border-transparent px-4 py-1.5 font-bold">USD ($)</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
}
