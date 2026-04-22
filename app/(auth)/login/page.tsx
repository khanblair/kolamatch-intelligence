"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export default function LoginPage() {
    const [role, setRole] = useState<"client" | "freelancer">("client");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#35b544] rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white text-2xl font-bold">K</span>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Welcome to KolaMatch
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to start matching
                    </p>
                </div>

                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => setRole("client")}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            role === "client" ? "bg-white shadow-sm text-[#35b544]" : "text-gray-500"
                        )}
                    >
                        I'm a Client
                    </button>
                    <button
                        onClick={() => setRole("freelancer")}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            role === "freelancer" ? "bg-white shadow-sm text-[#35b544]" : "text-gray-500"
                        )}
                    >
                        I'm a Freelancer
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#35b544] sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#35b544] sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-[#35b544] px-3 py-3 text-sm font-semibold text-white hover:bg-[#2e9e3b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35b544] transition-colors"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
