"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Beaker, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [role, setRole] = useState<"client" | "freelancer">("client");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/${role}/dashboard`);
    };

    const fillTestData = () => {
        if (role === "client") {
            setEmail("client@kolaborate.com");
            setPassword("client123");
        } else {
            setEmail("ivan@freelancer.com");
            setPassword("ivan123");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#35b544] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                        <span className="text-white text-3xl font-bold">K</span>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome to KolaMatch
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Sign in to start matching
                    </p>
                </div>

                <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-xl">
                    <button
                        onClick={() => setRole("client")}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                            role === "client" ? "bg-white shadow-sm text-[#35b544]" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        I'm a Client
                    </button>
                    <button
                        onClick={() => setRole("freelancer")}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                            role === "freelancer" ? "bg-white shadow-sm text-[#35b544]" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        I'm a Freelancer
                    </button>
                </div>

                <form className="mt-10 space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="email-address" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-xl border-gray-200 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#35b544] focus:shadow-[0_0_20px_-5px_rgba(53,181,68,0.3)] transition-all outline-none sm:text-sm"
                                placeholder="e.g. name@company.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-xl border-gray-200 py-3.5 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#35b544] focus:shadow-[0_0_20px_-5px_rgba(53,181,68,0.3)] transition-all outline-none sm:text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-xl bg-[#35b544] px-4 py-4 text-sm font-bold text-white hover:bg-[#2e9e3b] shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                        >
                            Sign in to Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={fillTestData}
                            className="flex items-center justify-center w-full gap-2 py-3 px-4 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-gray-400 hover:border-[#35b544] hover:text-[#35b544] hover:bg-green-50/50 transition-all active:scale-[0.98]"
                        >
                            <Beaker className="h-3.5 w-3.5" />
                            Use Test {role === "client" ? "Client" : "Freelancer"} Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
