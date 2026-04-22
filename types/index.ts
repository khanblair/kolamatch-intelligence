export type Role = "client" | "freelancer";

export interface FreelancerProfile {
    id: string;
    name: string;
    email: string;
    skills: string[];
    experienceYears: number;
    seniority: "junior" | "mid" | "senior";
    notableProjects: string[];
    cvText?: string;
    suggestedRate?: string;
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
}

export interface MatchingResult {
    jobId: string;
    freelancerId: string;
    matchScore: number;
    fitExplanation: string;
    suggestedRate: string;
    skillGaps: string[];
}
