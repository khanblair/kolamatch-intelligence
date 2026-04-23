"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
    MessageSquare,
    Check,
    Loader2,
    Smartphone,
    Settings,
    Activity,
    ShieldCheck,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AdminWhatsAppPage() {
    const [qrData, setQrData] = useState<{
        qr?: string;
        status?: string;
        user?: { phone: string; name: string; device: string }
    }>({ status: "loading" });
    const [showQRModal, setShowQRModal] = useState(false);

    const isConnected = ["isLogged", "synced", "chatsAvailable", "inChat"].includes(qrData.status || "");

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/whatsapp/qr");
                const data = await res.json();
                setQrData(data);

                if (showQRModal && ["isLogged", "qrReadSuccess", "synced", "chatsAvailable"].includes(data.status)) {
                    setTimeout(() => setShowQRModal(false), 3000);
                }
            } catch (e) {
                console.error("Admin Status Fetch Error:", e);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [showQRModal]);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#35b544]/10">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="rounded-full hover:bg-gray-100">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                                <ShieldCheck className="w-5 h-5 text-[#35b544]" />
                                Admin <span className="text-gray-400">/</span> WhatsApp
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Agent Management</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 md:py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                    {/* Left Column: Stats & Description */}
                    <div className="w-full lg:w-[45%] space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-gray-900">
                                Control <br className="hidden sm:block" />
                                the <span className="text-[#35b544]">AI Pulse</span>
                            </h2>
                            <p className="text-base text-gray-500 font-medium leading-relaxed">
                                Manage the platform's official WhatsApp agent. Once linked, KolaMatch AI will handle career coaching and matchmaking automatically for all users.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="p-5 border-transparent bg-gray-50/80 space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-[#35b544]" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bot Status</p>
                                </div>
                                <p className="text-xl font-black text-gray-900">{isConnected ? "ONLINE" : "OFFLINE"}</p>
                            </Card>
                            <Card className="p-5 border-transparent bg-gray-50/80 space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Smartphone className="w-4 h-4 text-blue-500" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Host Device</p>
                                </div>
                                <p className="text-xl font-black text-gray-900 truncate">{qrData.user?.device || "NONE"}</p>
                            </Card>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={() => setShowQRModal(true)}
                                className={`px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all ${isConnected
                                        ? "bg-green-50 text-[#35b544] border-2 border-[#35b544]/20 pointer-events-none"
                                        : "bg-[#35b544] hover:bg-[#2e9e3b] text-white"
                                    }`}
                            >
                                {isConnected ? <Check className="mr-2 w-4 h-4" /> : <MessageSquare className="mr-2 w-4 h-4" />}
                                {isConnected ? "Account Linked" : "Setup Connection"}
                            </Button>

                            {isConnected && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setShowQRModal(true)}
                                    className="h-14 px-8 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-50"
                                >
                                    Switch Account
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Active Status Card */}
                    <div className="w-full lg:w-[55%]">
                        <Card className="overflow-hidden border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[40px] relative bg-gradient-to-br from-gray-50 to-white">
                            <div className="p-10 md:p-12 min-h-[460px] flex flex-col justify-center">
                                {isConnected ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                        <div className="w-16 h-16 bg-[#35b544] rounded-2xl shadow-xl shadow-[#35b544]/20 flex items-center justify-center text-white rotate-3">
                                            <ShieldCheck className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <Badge className="bg-[#35b544] text-white uppercase tracking-tighter text-[10px]">Active Session</Badge>
                                            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">{qrData.user?.name}</h3>
                                            <p className="text-xl font-bold text-gray-400">+{qrData.user?.phone}</p>
                                        </div>
                                        <div className="pt-6 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#35b544] animate-ping" />
                                            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-[#35b544]">
                                                Processing Realtime Conversations
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-6 py-12">
                                        <div className="w-20 h-20 bg-gray-100 rounded-3xl mx-auto flex items-center justify-center text-gray-300">
                                            <Settings className="w-10 h-10 animate-spin-slow" />
                                        </div>
                                        <div className="space-y-2 max-w-sm mx-auto">
                                            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Agent Offline</h3>
                                            <p className="text-sm text-gray-400 font-medium">Link a WhatsApp device to enable global AI career assistance.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* QR Modal */}
            {showQRModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
                    <Card className="max-w-xl w-full p-10 md:p-14 space-y-10 shadow-2xl border-transparent rounded-[40px]">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-black tracking-tight uppercase">Device Authentication</h2>
                            <p className="text-gray-500 font-medium">Open WhatsApp on your phone, go to Linked Devices, and scan this code to grant agentic permissions.</p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 min-h-[400px] relative">
                            {qrData.qr ? (
                                <img src={qrData.qr} alt="WhatsApp QR" className="w-80 h-80 shadow-2xl rounded-3xl border-8 border-white" />
                            ) : ["qrReadSuccess", "connecting", "SYNCING", "isLogged"].includes(qrData.status || "") ? (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 bg-[#35b544]/10 rounded-full flex items-center justify-center text-[#35b544] animate-pulse">
                                        <Loader2 className="h-10 w-10 animate-spin" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-black uppercase tracking-tight">Connecting Session...</p>
                                        <p className="text-gray-400 font-medium">Finalizing handshake with WhatsApp servers.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <Loader2 className="h-12 w-12 text-[#35b544] animate-spin" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Waiting for QR payload...</p>
                                </div>
                            )}

                            {isConnected && (
                                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-[40px] animate-in zoom-in duration-700">
                                    <div className="w-24 h-24 bg-green-100 rounded-[30px] flex items-center justify-center text-[#35b544] mb-8 shadow-xl shadow-green-100/50">
                                        <Check className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight uppercase mb-2">Authenticated</h3>
                                    <p className="text-gray-500 font-medium text-lg">Agent is now live and ready.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                variant="ghost"
                                className="font-black uppercase tracking-widest text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 px-8 h-12 rounded-xl transition-all"
                                onClick={() => setShowQRModal(false)}
                            >
                                Close Management
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
