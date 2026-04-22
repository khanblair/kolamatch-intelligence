"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LayoutDashboard, Briefcase, Settings, LogOut } from "lucide-react";

const clientNav = [
    { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
    { name: "My Jobs", href: "/client/jobs", icon: Briefcase },
    { name: "Settings", href: "/client/settings", icon: Settings },
];

const freelancerNav = [
    { name: "Project Feed", href: "/freelancer/dashboard", icon: LayoutDashboard },
    { name: "My Applications", href: "/freelancer/jobs", icon: Briefcase },
    { name: "Settings & CV", href: "/freelancer/settings", icon: Settings },
];

export function Sidebar({ type }: { type: "client" | "freelancer" }) {
    const pathname = usePathname();
    const navItems = type === "client" ? clientNav : freelancerNav;

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-[#35b544]">KolaMatch</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                                isActive
                                    ? "bg-green-50 text-[#35b544]"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-[#35b544]" : "text-gray-400 group-hover:text-gray-500"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <Link
                    href="/login"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    Logout
                </Link>
            </div>
        </div>
    );
}
