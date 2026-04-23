/**
 * WHATSAPP CONNECTION SIMULATOR
 * Use this to test the UI flow without a real WhatsApp device.
 * Run with: bun run scripts/simulate-whatsapp.ts
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const QR_FILE = path.join(DATA_DIR, "whatsapp-qr.json");

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const saveData = (data: any) => {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    fs.writeFileSync(QR_FILE, JSON.stringify(data, null, 2));
    console.log(`[SIMULATOR] Status updated: ${data.status}`);
};

async function simulate() {
    console.log("🚀 Starting WhatsApp Connection Simulation...");

    // 1. Initial State: Waiting for Server
    saveData({ status: "loading", updatedAt: new Date().toISOString() });
    await sleep(2000);

    // 2. QR Code Generated
    saveData({
        status: "waiting",
        qr: "https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=KolaMatchSimulation",
        updatedAt: new Date().toISOString()
    });
    console.log("👉 CHECK THE UI: You should see a placeholder QR code now.");
    await sleep(5000);

    // 3. User Scanned QR
    saveData({ status: "qrReadSuccess", updatedAt: new Date().toISOString() });
    console.log("👉 CHECK THE UI: It should say 'Connecting to WhatsApp...'");
    await sleep(4000);

    // 4. Final Success: Logged In
    saveData({
        status: "isLogged",
        updatedAt: new Date().toISOString(),
        user: {
            phone: "256700000000",
            name: "John Doe (Simulated)",
            device: "Android (Simulation)"
        }
    });
    console.log("👉 CHECK THE UI: It should show 'WhatsApp Connected!' and then close the modal.");
    console.log("👉 Settings Page should now show 'Account Linked' with John Doe's info.");

    console.log("\n✅ Simulation Complete. You can run this again anytime.");
}

simulate().catch(console.error);
