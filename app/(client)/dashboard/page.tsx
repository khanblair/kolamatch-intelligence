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
        } catch (err: any) {
            setError(err.message);
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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you looking to build?
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., I need an app like Uber but for local logistics with mobile money integration..."
                    className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#35b544] focus:border-transparent transition-all outline-none resize-none"
                />
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={handleScope}
                        disabled={loading || !input.trim()}
                        className={cn(loading && "animate-pulse")}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Scoping...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Scope Project
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ScopeAnalysis result={result} />
                </div>
            )}
        </div>
    );
}
