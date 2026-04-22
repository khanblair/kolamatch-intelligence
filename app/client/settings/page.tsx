"use client";

import { Card, Button, Badge } from "@/components/ui";
import { User, Bell, Shield, Wallet, MessageSquare } from "lucide-react";

export default function ClientSettings() {
    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Settings</h1>
                <p className="text-gray-500">Manage your company profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Account Profile Section */}
                <Card className="p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Account Profile</h2>
                            <p className="text-sm text-gray-500 font-medium">Update your company details and contact info.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Name</label>
                            <p className="text-gray-900 font-semibold text-lg">Kolaborate Africa</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Industry</label>
                            <p className="text-gray-900 font-semibold text-lg">Tech & Outsourcing</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <Button variant="outline" className="px-6 rounded-xl font-bold border-gray-200">Edit Profile</Button>
                    </div>
                </Card>

                {/* Notification Preferences Section */}
                <Card className="p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                            <p className="text-sm text-gray-500 font-medium">Control how you receive project updates.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800">WhatsApp Alerts</span>
                                <Badge className="bg-green-100 text-[#35b544] border-green-200 hover:bg-green-100">Recommended</Badge>
                            </div>
                            <Button className="gap-2 font-bold px-6 rounded-xl bg-[#35b544] hover:bg-[#2e9e3b]">
                                <MessageSquare className="h-4 w-4" />
                                Connect WhatsApp
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                            <span className="font-bold text-gray-800">Email Summaries (Weekly)</span>
                            <Badge className="text-gray-400 border-gray-200 bg-transparent">Inactive</Badge>
                        </div>
                    </div>
                </Card>

                {/* Billing & Rates Section */}
                <Card className="p-8 shadow-sm border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#35b544]">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Billing & Rates</h2>
                            <p className="text-sm text-gray-500 font-medium">Manage your preferred currency and rate cards.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">Default Currency</span>
                        <Badge className="bg-gray-900 text-white border-transparent px-4 py-1.5 font-bold">USD ($)</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
}
