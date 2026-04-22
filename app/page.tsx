"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Sparkles, Zap, ShieldCheck, MessageCircle, BarChart3, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-green-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#35b544] rounded-xl flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#35b544] to-[#2e9e3b]">
              KolaMatch Intelligence
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 text-sm uppercase tracking-wider font-bold">
            Built for Kolaborate Build Challenge
          </Badge>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            The AI Command Center for <br />
            <span className="text-[#35b544]">Freelance Intelligence.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
            Eliminate scope creep and proposal fatigue.
            Transform raw project ideas into structured job posts and perfectly matched proposals in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-16 px-10 text-lg gap-2 shadow-xl shadow-green-200">
                Start Scoping Now
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg">
              View Demo CV Matching
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-[#35b544]" />}
              title="AI Project Scoping"
              description="Turn a single sentence into a full project brief with deliverables, phases, and budget benchmarks."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-[#35b544]" />}
              title="CV-Powered Matching"
              description="Our AI reads resumes to find the top 3 best-fit freelancers based on merit, not just keywords."
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8 text-[#35b544]" />}
              title="WhatsApp Real-time"
              description="Instant alerts for matches and proposals delivered directly to your phone via local integration."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <StatBox label="Clarity Score" value="0-100" />
          <StatBox label="Matching Engine" value="Claude 3.5" />
          <StatBox label="Delivery" value="WhatsApp" />
          <StatBox label="Rate Cards" value="African Market" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 KolaMatch Intelligence. Powered by OpenRouter & WPPConnect.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-xs font-bold text-[#35b544] uppercase tracking-widest">{label}</div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-[#35b544] border border-green-100", className)}>
      {children}
    </span>
  );
}
