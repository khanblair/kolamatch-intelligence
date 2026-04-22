/**
 * WhatsApp Messaging Utility
 * Note: WPPConnect runs locally as a separate Node.js process.
 * This utility acts as a bridge to that process or a mock for the demo.
 */

export async function sendWhatsAppNotification(phone: string, message: string) {
    console.log(`[WhatsApp] Sending to ${phone}: ${message}`);

    // In a real demo with wppconnect running locally, we would fetch a local endpoint:
    // await fetch('http://localhost:3001/message/sendText', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone, message })
    // });

    return { success: true };
}

export const NOTIFICATION_TEMPLATES = {
    NEW_MATCH: (projectTitle: string, budget: string) =>
        `🚨 New project match: ${projectTitle} — estimated ${budget}. Tap to view scope and generate your proposal.`,
    NEW_PROPOSAL: (projectTitle: string, freelancerName: string) =>
        `🔔 New proposal received from ${freelancerName} for ${projectTitle}. Tap to review.`
};
