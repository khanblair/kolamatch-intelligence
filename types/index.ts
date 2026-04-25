export type Role = "client" | "freelancer";

export interface FreelancerProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    skills: string[];
    experienceYears: number;
    seniority: "junior" | "mid" | "senior";
    notableProjects: string[];
    cvText?: string;
    suggestedRate?: string;
    telegramChatId?: string;
    summary?: string;
    additionalInfo?: Record<string, unknown>;
}

export interface ClientProfile {
    id: string;
    name: string;
    industry: string;
    description: string;
    contactPerson: string;
    email: string;
    phone?: string;
    telegramChatId?: string;
}

export interface ScopeScore {
    clarity: number;
    feasibility: number;
    budgetRealism: number;
    timelineRealism: number;
    overall: number;
}

export interface ProjectPhase {
    name: string;
    duration: string;
    deliverables: string[];
}

export interface JobPost {
    id: string;
    clientId: string;
    rawInput: string;
    title: string;
    summary: string;
    deliverables: string[];
    phases: ProjectPhase[];
    suggestedRateRange: string;
    estimatedHours: number;
    redFlags: string[];
    scopeScore: ScopeScore;
    status: "draft" | "published" | "closed";
    createdAt: string;
    budget?: string;
    matchScore?: number;
    skills?: string[];
    sources?: { title: string; url: string }[];
    topMatches?: { id: string; name: string; matchReason: string; matchScore: number; skills: string[]; seniority: string; experienceYears: number; suggestedRate: string; notableProjects: string[] }[];
    futureImplementations?: string[];
}

export interface MatchingResult {
    jobId: string;
    freelancerId: string;
    matchScore: number;
    fitExplanation: string;
    suggestedRate: string;
    skillGaps: string[];
}
