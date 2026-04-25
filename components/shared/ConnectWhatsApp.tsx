"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { MessageSquare, Check, Loader2, ExternalLink, Smartphone } from "lucide-react";

interface ConnectWhatsAppProps {
    role: "client" | "freelancer";
    userId: string;
    initialPhone?: string;
}

export function ConnectWhatsApp({ role, userId, initialPhone }: ConnectWhatsAppProps) {
    const [phone, setPhone] = useState(initialPhone || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isLinked, setIsLinked] = useState(!!initialPhone);
    const [botNumber, setBotNumber] = useState("");

    useEffect(() => {
        if (initialPhone) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPhone(initialPhone);
            setIsLinked(true);
        }
    }, [initialPhone]);

    useEffect(() => {
        // Fetch the platform's bot number
        fetch("/api/whatsapp/qr")
            .then(res => res.json())
            .then(data => {
                if (data.user?.phone) {
                    setBotNumber(data.user.phone);
                }
            });
    }, []);

    const handleLink = async () => {
        if (!phone) return;
        setIsSaving(true);
        try {
            // Clean phone number (remove +, spaces, etc)
            const cleanPhone = phone.replace(/\D/g, "");

            await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify({
                    role,
                    id: userId,
                    updates: { phone: cleanPhone }
                })
            });
            setIsLinked(true);
            setPhone(cleanPhone);
        } catch (error) {
            console.error("Failed to link WhatsApp:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenWhatsApp = () => {
        if (!botNumber) return;
        // WhatsApp click to chat link
        const url = `https://wa.me/${botNumber}?text=Hi KolaMatch, I just linked my account!`;
        window.open(url, "_blank");
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // If it doesn't start with +, and it's not empty, add it
        if (val && !val.startsWith("+")) {
            val = "+" + val;
        }
        // Remove any non-digit characters except the leading +
        if (val.startsWith("+")) {
            val = "+" + val.slice(1).replace(/\D/g, "");
        } else {
            val = val.replace(/\D/g, "");
        }
        setPhone(val);
    };

    return (
        <Card className="p-6 sm:p-8 shadow-sm border-gray-100 overflow-hidden relative">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center text-[#25D366] shrink-0">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Personal WhatsApp</h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Link your number to chat with the AI Agent.</p>
                </div>
            </div>

            {isLinked ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white">
                                <Check className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Linked to {phone.startsWith("+") ? phone : `+${phone}`}</p>
                                <p className="text-[10px] text-gray-600">Ready for agentic commands</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-gray-400 hover:text-red-500"
                            onClick={() => setIsLinked(false)}
                        >
                            Change
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            You can now message the KolaMatch AI Agent directly from your WhatsApp. Try asking about matches or market rates.
                        </p>
                        <Button
                            className="w-full !bg-[#25D366] hover:!bg-[#128C7E] !text-white gap-2 font-bold h-12 rounded-xl shadow-lg shadow-green-100"
                            onClick={async () => {
                                setIsSaving(true);
                                try {
                                    const res = await fetch("/api/whatsapp/notify", {
                                        method: "POST",
                                        body: JSON.stringify({
                                            phone: phone,
                                            message: `🚨 *KolaMatch Connection Test*\n\nYour WhatsApp linking is almost complete! To securely pair this phone with Ivan Ssempijja's profile, please reply to this message with:\n\n*LINK-${userId}*`
                                        })
                                    });
                                    const data = await res.json();
                                    if (data.success) alert("Test notification sent to " + phone + "!");
                                    else alert("Error: " + data.error);
                                } catch (err) {
                                    alert("Connection failed. Check server status.");
                                } finally {
                                    setIsSaving(false);
                                }
                            }}
                            disabled={isSaving || !phone}
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                            Test Connection
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your WhatsApp Number</label>
                        <div className="flex gap-2">
                            <Input
                                type="tel"
                                placeholder="+256 700 000 000"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 font-bold placeholder:text-gray-300 focus:border-[#35b544] focus:ring-0"
                            />
                            <Button
                                onClick={handleLink}
                                disabled={isSaving || !phone}
                                className="h-12 px-6 font-bold rounded-xl"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Link Number"}
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400 ml-1">Include country code. Example: +256...</p>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3">
                        <Smartphone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                            We use this number only to identify you when you message our bot. We will never share your number or message you without a match trigger.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
}
