"use client";

import { cn } from "@/lib/utils/cn";

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}) {
    const variants = {
        primary: "bg-[#35b544] text-white hover:bg-[#2e9e3b] shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-50 text-[#35b544] border border-green-100", className)}>
            {children}
        </span>
    );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("bg-white border border-gray-100 rounded-xl shadow-sm", className)}>
            {children}
        </div>
    );
}
