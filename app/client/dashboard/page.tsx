"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { JobPost } from "@/types";
import { Button } from "@/components/ui";
import { ScopeAnalysis } from "@/components/client/ScopeAnalysis";

export default function ClientDashboard() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Partial<JobPost> | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScope = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/ai/scope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rawInput: input }),
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Project Scoping</h1>
                <p className="text-gray-500">Transform your rough idea into a professional job post.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Project Brief / Idea
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., I need an app like Uber but for local logistics with mobile money integration..."
                    className="w-full h-48 p-5 border border-gray-100 rounded-xl bg-gray-50/50 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-inset focus:ring-[#35b544] focus:bg-white focus:shadow-[0_0_25px_-5px_rgba(53,181,68,0.2)] transition-all outline-none resize-none sm:text-base leading-relaxed"
                />
                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={handleScope}
                        disabled={loading || !input.trim()}
                        className={cn("h-12 px-8 font-bold text-base shadow-lg shadow-green-100 transition-all active:scale-[0.98]", loading && "animate-pulse")}
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

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-5 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            {result && (
                <div className="pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <ScopeAnalysis result={result} />
                </div>
            )}
        </div>
    );
}
