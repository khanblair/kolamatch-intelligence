"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { Copy, Check, Send } from "lucide-react";

export function ProposalDraft({
    draft,
    onSend
}: {
    draft: string;
    onSend: (text: string) => void;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(draft);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Personalized Proposal Starter</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy to Clipboard"}
                </Button>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
                {draft}
            </div>

            <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 font-medium">
                    This draft references your matching skills and the client's deliverables.
                </p>
                <Button onClick={() => onSend(draft)} className="gap-2 shadow-lg shadow-green-100">
                    Submit Proposal
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}
