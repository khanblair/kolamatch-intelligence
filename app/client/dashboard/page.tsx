"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Sparkles, Loader2, AlertCircle, X, Globe, Coins, Check } from "lucide-react";
import { JobPost } from "@/types";
import { Button } from "@/components/ui";
import { ScopeAnalysis } from "@/components/client/ScopeAnalysis";

export default function ClientDashboard() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Partial<JobPost> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // Get current clientId from localStorage
    const getClientId = () => {
        if (typeof window === "undefined") return "c3";
        const email = localStorage.getItem("userEmail");
        if (email === "jane@kolalogistics.com") return "c1";
        if (email === "robert@keziafintech.ug") return "c2";
        return "c3"; // Default for client@kolaborate.com
    };

    // New Configuration State
    const [regions, setRegions] = useState<string[]>(["Africa", "Uganda"]);
    const [budgetType, setBudgetType] = useState<"fixed" | "range">("range");
    const [currency, setCurrency] = useState("USD");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [fixedBudget, setFixedBudget] = useState("");

    const regionOptions = ["Africa", "Uganda", "Kenya", "Nigeria", "South Africa", "Global"];

    const toggleRegion = (reg: string) => {
        setRegions(prev => prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]);
    };

    const startScope = () => {
        if (!input.trim()) return;
        setShowConfirm(true);
    };

    const confirmScope = async () => {
        if (!input.trim()) return;
        setShowConfirm(false);
        setLoading(true);
        setError(null);
        setResult(null);

        const budgetValue = budgetType === "fixed" ? fixedBudget : { min: minBudget, max: maxBudget };

        try {
            const response = await fetch("/api/ai/scope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rawInput: input,
                    regions,
                    budgetType,
                    budgetValue,
                    currency
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to scope project");

            setResult(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsDraft = async () => {
        if (!result) return;

        await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...result,
                status: "draft",
                clientId: getClientId(),
                rawInput: input,
                regions,
                budgetType,
                budgetValue: budgetType === "fixed" ? fixedBudget : { min: minBudget, max: maxBudget },
                currency
            }),
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Project Scoping</h1>
                    <p className="text-gray-500">Transform your rough idea into a professional job post.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                            Project Brief / Idea
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., I need an app like Uber but for local logistics with mobile money integration..."
                            className="w-full h-64 p-5 border border-gray-100 rounded-xl bg-gray-50/50 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-inset focus:ring-[#35b544] focus:bg-white focus:shadow-[0_0_25px_-5px_rgba(53,181,68,0.2)] transition-all outline-none resize-none sm:text-base leading-relaxed"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#35b544]" />
                            Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Target Regions</label>
                                <div className="flex flex-wrap gap-2">
                                    {regionOptions.map((reg) => (
                                        <button
                                            key={reg}
                                            onClick={() => toggleRegion(reg)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all",
                                                regions.includes(reg)
                                                    ? "bg-[#35b544] text-white border-[#35b544] shadow-md shadow-green-100"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            {reg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Currency</label>
                                <select
                                    value={currency}
                                    onChange={e => setCurrency(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#35b544] outline-none shadow-sm"
                                >
                                    <option>USD</option>
                                    <option>UGX</option>
                                    <option>KES</option>
                                    <option>NGN</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Budget Type</label>
                                <div className="flex gap-2 p-1 bg-gray-100/50 rounded-lg border border-gray-100/80">
                                    <button
                                        onClick={() => setBudgetType("range")}
                                        className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all", budgetType === "range" ? "bg-white shadow-sm text-[#35b544]" : "text-gray-500 hover:text-gray-700")}
                                    >
                                        Range
                                    </button>
                                    <button
                                        onClick={() => setBudgetType("fixed")}
                                        className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all", budgetType === "fixed" ? "bg-white shadow-sm text-[#35b544]" : "text-gray-500 hover:text-gray-700")}
                                    >
                                        Fixed
                                    </button>
                                </div>
                            </div>

                            {budgetType === "range" ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Min</label>
                                        <input
                                            type="number"
                                            value={minBudget}
                                            onChange={e => setMinBudget(e.target.value)}
                                            placeholder="Min"
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#35b544] outline-none shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Max</label>
                                        <input
                                            type="number"
                                            value={maxBudget}
                                            onChange={e => setMaxBudget(e.target.value)}
                                            placeholder="Max"
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#35b544] outline-none shadow-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Fixed Amount</label>
                                    <input
                                        type="number"
                                        value={fixedBudget}
                                        onChange={e => setFixedBudget(e.target.value)}
                                        placeholder="Amount"
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#35b544] outline-none shadow-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={startScope}
                            disabled={loading || !input.trim()}
                            className={cn("w-full h-12 font-bold text-base shadow-lg shadow-green-100 transition-all active:scale-[0.98]", loading && "animate-pulse")}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    AI Scoping...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 mr-3" />
                                    Analyze & Scope
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-5 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            {result && (
                <div className="pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <ScopeAnalysis result={result} onSaveDraft={handleSaveAsDraft} />
                </div>
            )}
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Confirm Analysis</h2>
                            <button onClick={() => setShowConfirm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-5">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        <Sparkles className="h-3 w-3 text-[#35b544]" />
                                        Project Idea
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed italic">
                                        "{input.length > 150 ? input.substring(0, 150) + '...' : input}"
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Globe className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Regions</p>
                                        <p className="text-sm font-bold text-gray-900">{regions.join(", ")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#35b544]/10 rounded-lg">
                                        <Coins className="h-5 w-5 text-[#35b544]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing Config</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {currency} • {budgetType === "fixed" ? (fixedBudget || "Market Rates") : (minBudget && maxBudget ? `${minBudget}-${maxBudget}` : "Market Rates")}
                                        </p>
                                        {(!fixedBudget && budgetType === "fixed") || ((!minBudget || !maxBudget) && budgetType === "range") ? (
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded text-[10px] font-bold text-amber-700 border border-amber-100 uppercase tracking-wider">
                                                <AlertCircle className="h-3 w-3" />
                                                Using AI Market Defaults
                                            </div>
                                        ) : (
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded text-[10px] font-bold text-[#35b544] border border-green-100 uppercase tracking-wider">
                                                <Check className="h-3 w-3" />
                                                Custom Budget Attached
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1 font-bold py-3 text-gray-600">
                                Edit Config
                            </Button>
                            <Button onClick={confirmScope} className="flex-1 bg-[#35b544] hover:bg-[#2e9e3b] font-bold shadow-lg shadow-green-100 py-3">
                                Analyze & Scope
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
