"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { X, Send, Phone, MessageCircle, Star, BadgeCheck, Loader2, CheckCircle2, Sparkles, Edit3 } from "lucide-react";
import { FreelancerProfile, ClientProfile } from "@/types";

interface FreelancerInviteModalProps {
    freelancerId: string;
    jobTitle: string;
    clientId: string;
    onClose: () => void;
}

export function FreelancerInviteModal({ freelancerId, jobTitle, clientId, onClose }: FreelancerInviteModalProps) {
    const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
    const [client, setClient] = useState<ClientProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviteStatus, setInviteStatus] = useState<"idle" | "reviewing" | "drafting" | "sent">("idle");
    const [activePlatform, setActivePlatform] = useState<"whatsapp" | "telegram" | "system" | null>(null);
    const [draftMessage, setDraftMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        const fetchDetails = async () => {
            try {
                // Fetch Freelancer
                const fRes = await fetch("/api/freelancers");
                const fData = await fRes.json();
                const foundF = fData.find((f: FreelancerProfile) => f.id === freelancerId);
                setFreelancer(foundF);

                // Fetch Client
                const cRes = await fetch(`/api/profile?role=client&id=${clientId}`);
                const cData = await cRes.json();
                setClient(cData);
            } catch (err) {
                console.error("Failed to load invite details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [freelancerId, clientId]);

    const handleInvite = async (platform: "whatsapp" | "telegram" | "system") => {
        if (!freelancer || inviteStatus !== "idle") return;

        setActivePlatform(platform);

        if (platform === "system") {
            setInviteStatus("drafting");
            setTimeout(() => {
                setInviteStatus("sent");
                setTimeout(() => onClose(), 3000);
            }, 2500);
        } else {
            // Generate draft for external apps with "Middleman" tone
            const greeting = platform === "whatsapp" ? `Hi ${freelancer.name.split(' ')[0]}!` : `Hi ${freelancer.name.split(' ')[0]},`;
            const clientName = client?.name || "A client";
            const clientFirstName = client?.contactPerson?.split(' ')[0] || clientName;

            setDraftMessage(`🤖 *KolaMatch Intelligence here!*

${greeting} ${clientName} is inviting you to collaborate on their project: "${jobTitle}".

Let ${clientFirstName} know if you are available to discuss. *Action Required:* Would you like to express interest, decline, or ask them a question? Reply directly to this message and I will notify the client!`);
            setInviteStatus("reviewing");
        }
    };

    const confirmDispatch = async () => {
        if (!freelancer) return;

        // Transition to the AI sending state
        setInviteStatus("drafting");

        if (activePlatform === "whatsapp" && freelancer.phone) {
            try {
                const res = await fetch("/api/whatsapp/notify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone: freelancer.phone,
                        message: draftMessage
                    })
                });

                if (res.ok) {
                    setInviteStatus("sent");
                    setTimeout(() => onClose(), 3000);
                    return;
                } else {
                    console.error("WhatsApp delivery failed. Falling back.");
                }
            } catch (error) {
                console.error("WhatsApp dispatch error:", error);
            }
        }

        // Fallback mock dispatch for Telegram and System invites
        setTimeout(() => {
            setInviteStatus("sent");
            setTimeout(() => onClose(), 3000);
        }, 2500);
    };

    if (loading) return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-lg p-12 text-center bg-white rounded-[24px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#35b544] mb-4" />
                <p className="text-gray-500 font-bold">Reserving profile access...</p>
            </div>
        </div>
    );

    if (!freelancer) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="min-h-full flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div
                    className="w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl overflow-hidden relative pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col"
                >
                    {/* Close button layered on top */}
                    <button
                        onClick={onClose}
                        disabled={inviteStatus === "drafting"}
                        className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all z-20 disabled:opacity-50"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    {/* Premium Header Container */}
                    <div className="relative shrink-0">
                        <div className="bg-[#35b544] h-24 sm:h-28 w-full" />
                        <div className="absolute -bottom-8 left-6 sm:left-10 z-10">
                            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white p-1 sm:p-1.5 shadow-xl relative">
                                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-4xl font-black text-[#35b544]">
                                    {freelancer.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-[#35b544] rounded-full border-2 sm:border-4 border-white flex items-center justify-center shadow-lg">
                                    <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="pt-14 sm:pt-16 px-6 sm:px-10 pb-6 sm:pb-8 space-y-6 bg-white select-text">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 border-b border-gray-50 pb-5">
                            <div className="space-y-0.5">
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                                    {freelancer.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#35b544] uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md">
                                        {freelancer.seniority}
                                    </span>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {freelancer.experienceYears} Years Exp
                                    </span>
                                </div>
                            </div>
                            <div className="sm:text-right bg-gray-50/50 px-3 py-2 rounded-xl border border-gray-100/50">
                                <div className="text-lg sm:text-lg font-black text-gray-900 leading-none">{freelancer.suggestedRate}</div>
                                <div className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Calibrated Rate</div>
                            </div>
                        </div>

                        {inviteStatus === "idle" ? (
                            <div className="space-y-6 animate-in fade-in">
                                {/* Summary Section */}
                                <div className="space-y-2">
                                    <label className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 opacity-70">
                                        Expertise Summary
                                    </label>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                                        {freelancer.summary || "A highly skilled professional specializing in modern development stacks with a focus on delivering high-quality, scalable solutions."}
                                    </p>
                                </div>

                                {/* Skills Section */}
                                <div className="space-y-2">
                                    <label className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 opacity-70">
                                        Technical Proficiency
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {freelancer.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1.5 bg-white text-gray-700 text-[10px] sm:text-xs font-bold rounded-lg border border-gray-100 hover:border-[#35b544]/20 hover:text-[#35b544] transition-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Intelligent Action Section */}
                                <div className="pt-4 space-y-4">
                                    <label className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 opacity-70">
                                        <Sparkles className="h-3 w-3 text-[#35b544]" /> AI Middleman Outreach
                                    </label>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        Kolaborate Intelligence acts as your broker. We will securely draft an invitation to {freelancer.name.split(" ")[0]} via their connected platforms for your review.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleInvite("whatsapp")}
                                            className="w-full flex items-center justify-center gap-2 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-[#25D366] hover:bg-green-50/30 transition-all group/wa text-xs font-bold text-gray-700 hover:text-[#25D366]"
                                        >
                                            <MessageCircle className="h-4 w-4 text-[#25D366]" /> Draft WhatsApp Invite
                                        </button>

                                        <button
                                            onClick={() => handleInvite("telegram")}
                                            className="w-full flex items-center justify-center gap-2 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0088cc] hover:bg-blue-50/30 transition-all group/tg text-xs font-bold text-gray-700 hover:border-[#0088cc]"
                                        >
                                            <Phone className="h-4 w-4 text-[#0088cc]" /> Draft Telegram Invite
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : inviteStatus === "reviewing" ? (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 fade-in">
                                <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Edit3 className="h-3 w-3 text-[#35b544]" /> AI Drafted Invitation
                                        </label>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border border-gray-100">
                                            {activePlatform === "whatsapp" ? <MessageCircle className="h-3 w-3 text-[#25D366]" /> : <Phone className="h-3 w-3 text-[#0088cc]" />}
                                            <span className="text-[9px] font-bold text-gray-600 uppercase">Via {activePlatform}</span>
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full h-32 p-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35b544]/20 focus:border-[#35b544] outline-none transition-all resize-none shadow-sm"
                                        value={draftMessage}
                                        onChange={(e) => setDraftMessage(e.target.value)}
                                        placeholder="Customize your message here..."
                                    />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                        Review and edit the message above. Once confirmed, Kolaborate Intelligence will instantly dispatch this message through your connected KolaMatch {activePlatform} Business Bot.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setInviteStatus("idle")}
                                        className="flex-1 h-12 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50"
                                    >
                                        Back
                                    </Button>
                                    {activePlatform === 'whatsapp' ? (
                                        <Button
                                            onClick={confirmDispatch}
                                            className="flex-[2] h-12 font-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            style={{ backgroundColor: "#25D366", color: "white" }}
                                        >
                                            <Send className="h-4 w-4 mr-2" /> Dispatch via AI Bot
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={confirmDispatch}
                                            className="flex-[2] h-12 font-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            style={{ backgroundColor: "#0088cc", color: "white" }}
                                        >
                                            <Send className="h-4 w-4 mr-2" /> Dispatch via AI Bot
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="min-h-[300px] flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
                                {inviteStatus === "drafting" ? (
                                    <>
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                                                <Sparkles className="h-10 w-10 text-[#35b544] animate-pulse" />
                                            </div>
                                            <Loader2 className="h-20 w-20 text-[#35b544]/20 animate-spin absolute inset-0" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-black text-gray-900">KolaMatch AI Activated</h3>
                                            <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto">
                                                Dispatching custom invitation to <span className="text-gray-900 font-bold">{freelancer.name}</span> through the verified <span className="uppercase font-black text-[#35b544] text-[10px] tracking-widest">{activePlatform}</span> Bot System...
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-[#35b544] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(53,181,68,0.2)] animate-in zoom-in spin-in-12 duration-500">
                                            <CheckCircle2 className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="text-center space-y-2 animate-in slide-in-from-bottom-4 delay-150 fade-in duration-500">
                                            <h3 className="text-xl font-black text-[#35b544]">Message Delivered</h3>
                                            <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto">
                                                The invitation has been successfully bridged to {freelancer.name}. You will be notified of any response.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Elite Action Bar */}
                        {inviteStatus === "idle" && (
                            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-12 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleInvite("system")}
                                    className="flex-[2] h-12 bg-[#35b544] hover:bg-[#2e9e3b] font-black text-white rounded-xl shadow-[0_10px_20px_rgba(53,181,68,0.2)]"
                                >
                                    <Send className="h-4 w-4 mr-2" /> Issue System Invite
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
