"use client";

import { Card, Button, Badge } from "@/components/ui";
import { User, Bell, Shield, Wallet } from "lucide-react";

export default function ClientSettings() {
    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Settings</h1>
                <p className="text-gray-500">Manage your company profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#35b544]">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Account Profile</h2>
                            <p className="text-sm text-gray-500">Update your company details and contact info.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Company Name</label>
                                <p className="text-gray-900">Kolaborate Africa</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Industry</label>
                                <p className="text-gray-900">Tech & Outsourcing</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#35b544]">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Notification Preferences</h2>
                            <p className="text-sm text-gray-500">Control how you receive project updates.</p>
                        </div>
                    </div>
                    <div className="space-y-3 font-medium text-sm text-gray-700">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>WhatsApp Alerts (New Proposals)</span>
                            <span className="text-[#35b544]">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Email Summaries (Weekly)</span>
                            <span>Inactive</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#35b544]">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Billing & Rates</h2>
                            <p className="text-sm text-gray-500">Manage your preferred currency and rate cards.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">Default Currency</span>
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">USD ($)</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
}
