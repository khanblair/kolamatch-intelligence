"use client";

import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export function MobileHeader({ onMenuClick, isOpen }: { onMenuClick: () => void, isOpen: boolean }) {
    return (
        <header className="flex h-16 items-center border-b bg-white px-4 md:hidden">
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="mr-2">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#35b544] rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-gray-900">KolaMatch</span>
            </div>
        </header>
    );
}
