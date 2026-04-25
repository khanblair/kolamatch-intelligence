"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { Save, ArrowLeft, Loader2, CheckCircle2, Trash2, Plus, X, AlertCircle, Globe, Coins, Clock, Users } from "lucide-react";
import { JobPost } from "@/types";
import { cn } from "@/lib/utils/cn";
import { FreelancerInviteModal } from "./FreelancerInviteModal";

interface JobDetailsEditorProps {
    initialJob: JobPost;
    onSaveSuccess?: () => void;
}

export function JobDetailsEditor({ initialJob, onSaveSuccess }: JobDetailsEditorProps) {
    const [job, setJob] = useState<JobPost>(initialJob);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<any[]>([]);
    const router = useRouter();

    useState(() => {
        const fetchApplicants = async () => {
            try {
                const [appsRes, freelancersRes] = await Promise.all([
                    fetch("/api/applications"),
                    fetch("/api/freelancers")
                ]);
                const apps = await appsRes.json();
                const freelancers = await freelancersRes.json();

                const jobApplicants = apps
                    .filter((a: any) => a.jobId === job.id)
                    .map((a: any) => ({
                        ...a,
                        freelancer: freelancers.find((f: any) => f.id === a.freelancerId)
                    }));
                setApplicants(jobApplicants);
            } catch (err) {
                console.error("Failed to fetch applicants:", err);
            }
        };
        fetchApplicants();
    });

    const handleSave = async (statusOverride?: string) => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/jobs/${job.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...job, status: statusOverride || job.status }),
            });
            if (!res.ok) throw new Error("Failed to save project");
            if (onSaveSuccess) onSaveSuccess();
            router.refresh();
            if (statusOverride === "published") {
                router.push("/client/jobs");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete project");
            router.push(job.status === "draft" ? "/client/drafts" : "/client/jobs");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete");
        }
    };

    const addDeliverable = () => {
        setJob({
            ...job,
            deliverables: [...(job.deliverables || []), "New deliverable"]
        });
    };

    const removeDeliverable = (index: number) => {
        setJob({
            ...job,
            deliverables: job.deliverables?.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-black h-10 px-4 transition-all">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Scope
                    </Button>

                    {job.status === "draft" && (
                        <>
                            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving} className="text-[#35b544] border-[#35b544]/30 hover:bg-green-50 font-black h-10 px-4">
                                {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Update Draft
                            </Button>
                            <Button onClick={() => handleSave("published")} disabled={saving} className="bg-[#35b544] hover:bg-[#2e9e3b] font-black h-10 px-6 shadow-lg shadow-green-100/50">
                                {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                Post Job Now
                            </Button>
                        </>
                    )}

                    {job.status !== "draft" && (
                        <Button onClick={() => handleSave()} disabled={saving} className="bg-[#35b544] hover:bg-[#2e9e3b] font-bold h-10 px-6 shadow-lg shadow-green-100">
                            {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Update Job
                        </Button>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Main Form */}
            <Card className="p-8 space-y-8 border-gray-100 shadow-sm">
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Project Title</label>
                            <Badge variant="outline" className={cn(
                                "text-[10px] uppercase font-black px-2 py-0.5",
                                job.status === "draft" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-green-50 text-[#35b544] border-green-100"
                            )}>
                                {job.status}
                            </Badge>
                        </div>
                        <input
                            type="text"
                            value={job.title}
                            onChange={e => setJob({ ...job, title: e.target.value })}
                            className="w-full text-2xl font-black p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#35b544] outline-none transition-all tracking-tight text-gray-900 shadow-sm"
                            placeholder="Enter project title..."
                        />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2 ml-1">Executive Summary</label>
                        <textarea
                            value={job.summary}
                            onChange={e => setJob({ ...job, summary: e.target.value })}
                            className="w-full h-32 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#35b544] outline-none transition-all resize-none text-gray-900 text-sm font-medium leading-relaxed shadow-sm"
                            placeholder="Describe the project goal..."
                        />
                    </div>

                    {/* Deliverables */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Key Deliverables</label>
                            <button onClick={addDeliverable} className="text-[10px] font-black text-[#35b544] uppercase tracking-widest hover:underline flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Add Item
                            </button>
                        </div>
                        <div className="grid gap-3">
                            {job.deliverables?.map((d, i) => (
                                <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 group transition-all hover:border-[#35b544]/30 shadow-sm">
                                    <div className="mt-1">
                                        <CheckCircle2 className="h-4 w-4 text-[#35b544]" />
                                    </div>
                                    <input
                                        value={d}
                                        onChange={e => {
                                            const newDel = [...(job.deliverables || [])];
                                            newDel[i] = e.target.value;
                                            setJob({ ...job, deliverables: newDel });
                                        }}
                                        className="w-full bg-transparent outline-none text-sm font-semibold text-gray-900"
                                    />
                                    <button onClick={() => removeDeliverable(i)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phases section */}
                    {job.phases && job.phases.length > 0 && (
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2 ml-1">Development Roadmap (Phases)</label>
                            <div className="grid gap-4">
                                {job.phases.map((phase, i) => (
                                    <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
                                        <div className="flex justify-between items-center">
                                            <input
                                                className="font-bold text-gray-900 bg-transparent outline-none flex-1 mr-4"
                                                value={phase.name}
                                                onChange={e => {
                                                    const newPhases = [...(job.phases || [])];
                                                    newPhases[i] = { ...phase, name: e.target.value };
                                                    setJob({ ...job, phases: newPhases });
                                                }}
                                            />
                                            <input
                                                className="text-xs font-bold text-[#35b544] bg-green-50 px-2 py-1 rounded outline-none w-24 text-center"
                                                value={phase.duration}
                                                onChange={e => {
                                                    const newPhases = [...(job.phases || [])];
                                                    newPhases[i] = { ...phase, duration: e.target.value };
                                                    setJob({ ...job, phases: newPhases });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            {phase.deliverables.map((del, di) => (
                                                <div key={di} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                                    <input
                                                        className="flex-1 bg-transparent outline-none"
                                                        value={del}
                                                        onChange={e => {
                                                            const newPhases = [...(job.phases || [])];
                                                            const newDels = [...phase.deliverables];
                                                            newDels[di] = e.target.value;
                                                            newPhases[i] = { ...phase, deliverables: newDels };
                                                            setJob({ ...job, phases: newPhases });
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Red Flags */}
                    {job.redFlags && (Array.isArray(job.redFlags) ? job.redFlags.length > 0 : !!job.redFlags) && (
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                            <h3 className="text-xs font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Potential Risks & Red Flags
                            </h3>
                            <ul className="space-y-2">
                                {Array.isArray(job.redFlags) ? (
                                    job.redFlags.map((flag, i) => (
                                        <li key={i} className="text-xs text-amber-800 font-medium flex gap-2">
                                            <span className="text-amber-400">•</span>
                                            <input
                                                className="flex-1 bg-transparent outline-none"
                                                value={flag}
                                                onChange={e => {
                                                    const flags = [...(job.redFlags as string[])];
                                                    flags[i] = e.target.value;
                                                    setJob({ ...job, redFlags: flags });
                                                }}
                                            />
                                        </li>
                                    ))
                                ) : job.redFlags && (
                                    <li className="text-xs text-amber-800 font-medium flex gap-2">
                                        <span className="text-amber-400">•</span>
                                        <input
                                            className="flex-1 bg-transparent outline-none"
                                            value={job.redFlags}
                                            onChange={e => setJob({ ...job, redFlags: e.target.value })}
                                        />
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Sources */}
                    {job.sources && job.sources.length > 0 && (
                        <div>
                            <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3 ml-1">Market Research Sources</label>
                            <div className="flex flex-wrap gap-2">
                                {job.sources.map((source, i) => (
                                    <a key={i} href={source.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 hover:text-[#35b544] hover:bg-white transition-all shadow-sm">
                                        <Globe className="h-3 w-3" />
                                        {source.title.length > 40 ? source.title.substring(0, 40) + "..." : source.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#35b544]/5 p-6 rounded-2xl border border-[#35b544]/10">
                        {/* ... existing budget/stats content ... */}
                    </div>

                    {/* Applicants Section */}
                    {job.status !== "draft" && (
                        <div className="space-y-6 pt-10 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Applicants & Proposals</h2>
                                    <p className="text-sm font-medium text-gray-500">Review submissions from elite experts.</p>
                                </div>
                                <Badge className="bg-gray-100 text-gray-600 border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest">
                                    {applicants.length} Submissions
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {applicants.length === 0 && (
                                    <Card className="p-12 text-center border-dashed border-gray-200">
                                        <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-gray-400">Waiting for first applicant...</p>
                                    </Card>
                                )}
                                {applicants.map((applicant: any) => (
                                    <Card key={applicant.id} className="p-6 border-gray-100 bg-white shadow-sm hover:border-[#35b544]/30 transition-all">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-[#35b544]/10 rounded-2xl flex items-center justify-center text-[#35b544] font-black text-lg">
                                                        {applicant.freelancer?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 leading-none">{applicant.freelancer?.name}</h4>
                                                        <p className="text-[10px] text-[#35b544] font-black uppercase tracking-widest mt-1.5">{applicant.freelancer?.seniority} Level • {applicant.freelancer?.id === "f2" ? "Ivan Ssempijja" : "Match Found"}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                                                    <p className="text-xs font-semibold text-gray-600 leading-relaxed italic">
                                                        "{applicant.proposal}"
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col gap-3 justify-end">
                                                <Button variant="ghost" className="h-11 px-6 font-black text-[10px] text-[#35b544] border border-[#35b544]/20 uppercase tracking-widest rounded-2xl">
                                                    Profile
                                                </Button>
                                                <Button className="h-11 px-6 bg-gray-900 hover:bg-black font-black text-[10px] text-white uppercase tracking-widest rounded-2xl">
                                                    Messenger
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Freelancer Matches */}
                    {job.topMatches && job.topMatches.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-4 ml-1">Curated Expert Matches</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {job.topMatches.map((match, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedFreelancerId(match.id)}
                                        className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#35b544]/50 transition-all flex items-start gap-4 cursor-pointer group/card"
                                    >
                                        <div className="w-10 h-10 bg-[#35b544]/10 rounded-full flex items-center justify-center text-[#35b544] font-bold group-hover/card:bg-[#35b544] group-hover/card:text-white transition-all">
                                            {match.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm group-hover/card:text-[#35b544] transition-colors">{match.name}</div>
                                            <div className="text-[10px] font-black text-[#35b544] uppercase tracking-tighter">{match.matchScore}% Match Score</div>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {match.skills.slice(0, 3).map((skill, si) => (
                                                    <span key={si} className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded-md font-bold text-gray-500">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {selectedFreelancerId && (
                <FreelancerInviteModal
                    freelancerId={selectedFreelancerId}
                    jobTitle={job.title}
                    clientId={job.clientId}
                    onClose={() => setSelectedFreelancerId(null)}
                />
            )}
        </div>
    );
}
