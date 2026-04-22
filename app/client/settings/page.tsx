"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { User, Bell, Shield, Wallet, MessageSquare, Cog, Check, Save } from "lucide-react";

export default function ClientSettings() {
    const [isEditingTelegram, setIsEditingTelegram] = useState(false);
    const [telegramConfig, setTelegramConfig] = useState({ botToken: "", chatId: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/config")
            .then(res => res.json())
            .then(data => setTelegramConfig(data.telegram));
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
    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Settings</h1>
                <p className="text-gray-500">Manage your company profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Account Profile Section */}
                <Card className="p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Account Profile</h2>
                            <p className="text-sm text-gray-500 font-medium">Update your company details and contact info.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Name</label>
                            <p className="text-gray-900 font-semibold text-lg">Kolaborate Africa</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Industry</label>
                            <p className="text-gray-900 font-semibold text-lg">Tech & Outsourcing</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <Button variant="outline" className="px-6 rounded-xl font-bold border-gray-200">Edit Profile</Button>
                    </div>
                </Card>

                {/* Notification Preferences Section */}
                <Card className="p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                            <p className="text-sm text-gray-500 font-medium">Control how you receive project updates.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800">WhatsApp Alerts</span>
                                <Badge className="bg-green-100 text-[#35b544] border-green-200 hover:bg-green-100">Recommended</Badge>
                            </div>
                            <Button className="gap-2 font-bold px-6 rounded-xl bg-[#35b544] hover:bg-[#2e9e3b]">
                                <MessageSquare className="h-4 w-4" />
                                Connect WhatsApp
                            </Button>
                        </div>

                        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
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
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSaveTelegram}
                                            disabled={saving}
                                            className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] gap-2 rounded-xl font-bold py-2 text-xs"
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
                                            className="flex-1 border-[#0088cc] text-[#0088cc] hover:bg-blue-50 rounded-xl font-bold py-2 text-xs"
                                        >
                                            Test Link
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500 font-medium">
                                        {telegramConfig.botToken ? "✅ Bot connected" : "❌ Bot not configured"}
                                    </p>
                                    <Button className="gap-2 font-bold px-6 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white border-transparent text-xs h-9">
                                        <Check className="h-3 w-3" />
                                        Bot Ready
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                            <span className="font-bold text-gray-800">Email Summaries (Weekly)</span>
                            <Badge className="text-gray-400 border-gray-200 bg-transparent">Inactive</Badge>
                        </div>
                    </div>
                </Card>

                {/* Billing & Rates Section */}
                <Card className="p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Billing & Rates</h2>
                            <p className="text-sm text-gray-500 font-medium">Manage your preferred currency and rate cards.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">Default Currency</span>
                        <Badge className="bg-gray-900 text-white border-transparent px-4 py-1.5 font-bold">USD ($)</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
}
