"use client";

import { useState } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { MobileHeader } from "@/components/shared/MobileHeader";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen flex-col md:flex-row bg-gray-50 overflow-hidden">
            <MobileHeader isOpen={isMobileMenuOpen} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

            <Sidebar
                type="client"
                mobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            <main className="flex-1 overflow-y-auto relative z-40">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
