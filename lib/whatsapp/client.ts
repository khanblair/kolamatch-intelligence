/**
 * WhatsApp Messaging Utility
 * Note: WPPConnect runs locally as a separate Node.js process.
 * This utility acts as a bridge to that process or a mock for the demo.
 */

export async function sendWhatsAppNotification(phone: string, message: string) {
    console.log(`[WhatsApp] Sending to ${phone}: ${message}`);

    try {
        const response = await fetch('http://127.0.0.1:3001/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, message })
        });

        return await response.json();
    } catch (error) {
        console.error("WhatsApp Send Error:", error);
        return { success: false, error: "Bridge not connected" };
    }
}

export const NOTIFICATION_TEMPLATES = {
    NEW_MATCH: (projectTitle: string, budget: string) =>
        `🚨 New project match: ${projectTitle} — estimated ${budget}. Tap to view scope and generate your proposal.`,
    NEW_PROPOSAL: (projectTitle: string, freelancerName: string) =>
        `🔔 New proposal received from ${freelancerName} for ${projectTitle}. Tap to review.`
};
