# 🚀 KolaMatch Intelligence
### The AI-Powered Career Broker & Matchmaking Engine for Kolaborate

**KolaMatch Intelligence** is a high-fidelity AI Command Center built specifically for the Kolaborate marketplace. It eliminates the bottlenecks of the freelance economy by transforming unstructured project ideas into professional, actionable job posts and proposals, while managing the entire communication lifecycle through a state-of-the-art Multi-Channel AI Broker.

---

## 💎 Core Value Proposition

### 🦾 Eliminating the "Vague Brief" Problem
Clients often struggle to articulate technical requirements. KolaMatch takes raw text (e.g., *"I want a food delivery app"*) and uses LLM reasoning to map out project phases, technical deliverables (API, Mobile, Backend), and realistic budget ranges based on African market benchmarks. This "Scoping Engine" acts as a first-line consultant, ensuring projects are viable before they even reach a freelancer.

### ⚡ Proposal Friction Reduction
Freelancers often spend hours writing proposals for jobs they might not win. Our engine generates a **Tailored Proposal Starter** that weaves the freelancer's specific CV skills directly into the client's deliverables. This provides a 70-80% completed draft that only requires a quick peer review or final tweak before submission, dramatically increasing the speed-to-apply (STA) metric.

### 🤝 The Multi-Channel AI Broker
By moving project management to WhatsApp and Telegram, we match the pace of business in emerging markets. The AI doesn't just notify—it **brokers** the conversation. It synthesizes intents from natural language replies and bridges them between parties without requiring constant dashboard logins. This ensures that a simple *"i accept"* on any chat platform translates into a formal system update.

---

## ✨ Key Features & Functionalities

### 1. 🔗 Bidirectional WhatsApp Bridging
The platform's primary bridge is the `whatsapp-server.ts` execution engine. 
- **Intent Synthesis:** The AI detects complex user intents (Accept, Reject, Ask Question, Schedule Call) within natural language replies.
- **Automated Forwarding:** Using `NOTIFY_CLIENT` and `NOTIFY_FREELANCER` hooks, the bot contextually summarizes a client's reply and sends it directly to the freelancer's private chat.
- **History Migration & Sanitization:** Automatically handles multi-device WhatsApp suffixes (like `:1` or `.0:1`) and cleans phone numbers to ensure context persistence across server restarts.

### 2. ✈️ Telegram Notification Network
A secondary, high-speed bridge powered by the `telegram-server.ts` engine using the **Telegraf** framework.
- **Instant Alerts:** Zero-latency delivery for match results and proposal updates.
- **Zero-Cloud Dependency:** Like our WhatsApp bridge, the Telegram bot runs entirely on your local machine, connecting directly to the Telegram Bot API.
- **Chat ID Persistence:** Automatically maps User IDs in KolaMatch to Telegram Chat IDs for reliable alerting without requiring phone numbers.
- **Unified Routing:** System events map to templated messages delivered based on the user's platform preference.

### 3. 🧠 AI Project Scoping (Clarity Score)
When a client submits a brief, they receive an immediate "Clarity Audit":
- **Four-Axis Analysis:** 
  - **Clarity:** Is the goal well-defined?
  - **Feasibility:** Can this be built with currently available tech?
  - **Budget Realism:** Is the budget aligned with the complexity?
  - **Timeline Realism:** Is there enough time for the stated deliverables?
- **Red Flag Detection:** Instant warnings if the budget is too low for the requested stack or if the timeline is too aggressive.
- **Phased Roadmapping:** Automatically suggests how to break a large project into Phased releases (MVP vs. v2.0).

### 4. 📄 CV-to-Match Engine
- **Intelligent PDF Parsing:** Uses LLM vision and `pdf-parse` to extract structured professional data from raw resumes.
- **Skill Mapping:** Identifies not just keywords, but the *depth* of expertise based on project descriptions within the CV.
- **Recursive Profile Enrichment:** Every time a freelancer interacts with the bot or updates their CV, their JSON profile is intelligently merged with the new data.

### 5. 🎨 State-of-the-Art Glassmorphic UI
Built with **Tailwind CSS 4**, the web dashboard is designed to feel premium and futuristic:
- **High-Fidelity Aesthetics:** Extensive use of `backdrop-blur`, subtle borders, and layered shadows.
- **Micro-Animations:** Fluid transitions and interactive states (hover, focus, active) that provide immediate tactile feedback.

---

## 📊 Detailed Data Schema

### Freelancer Profile (`freelancers.json`)
```json
{
  "id": "f2",
  "name": "Ivan Ssempijja",
  "email": "ivan@freelancer.com",
  "skills": ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
  "experienceYears": 7,
  "seniority": "Senior",
  "phone": "256742736501",
  "telegramChatId": "5367731807",
  "summary": "Experienced professional with a background in digital media...",
  "suggestedRate": "$55-80/hr"
}
```

### Job Posting (`jobs.json`)
```json
{
  "id": "u78uo",
  "title": "WhatsApp-Style Messaging MVP",
  "clientId": "c3",
  "budget": "$1,500 - $3,000",
  "deliverables": [
    "Real-time chat integration",
    "Mobile Money payment hooks"
  ],
  "status": "active",
  "postedAt": "2026-04-22T10:00:00Z"
}
```

---

## 🛡 Security & Privacy
- **Local Persistence:** Your chat history, profiles, and job data never leave your machine except when passed to the OpenRouter gateway for processing.
- **History Privacy:** The `whatsapp_chats.json` store maintains private, session-based context that is never shared across users.
- **No Meta Cloud API Required:** Our WhatsApp bridge bypasses expensive cloud API costs by using a headless browser session.

---

## 🛠 Advanced Tech Stack

### Frontend & UI Layer
- **Next.js 16:** Leveraging the latest Server Components and optimized routing.
- **React 19:** Utilizing `useActionState` and advanced concurrent rendering.
- **Tailwind CSS 4:** The styling engine powering our glassmorphic design system.

### AI & Reasoning Layer
- **OpenRouter Gateway:** Accessing `google/gemini-2.0-flash-exp` for near-instant reasoning.
- **Context Management:** A sophisticated windowing system that manages `userHistories` to ensure the AI remembers past interactions.
- **Regional Rate Card:** Embedded knowledge base of African freelance rates.

### Connectivity & Communication
- **WPPConnect:** Local WhatsApp bridge using Puppeteer for full session control.
- **Telegraf:** Framework powering the Telegram bot for instant developer notifications.
- **Bun Runtime:** The ultra-fast JavaScript runtime for bot script execution.

---

## 📂 Detailed Folder Structure

```text
kolamatch-intelligence/
├── app/                        # Next.js 16 Application Root
│   ├── (auth)/                 # Login and User Authentication
│   ├── api/                    # Backend API Endpoints
│   │   ├── ai/                 # AI prompt generation logic
│   │   ├── jobs/               # Scoping and application logic
│   │   ├── profile/            # Universal profile management
│   │   └── whatsapp/           # Bot management status
│   ├── client/                 # Client Workflows (Dashboard, Drafts, Jobs)
│   └── freelancer/             # Freelancer Workflows (Jobs Feed, Applications)
├── components/                 # Atomic Design Component Library
│   ├── ui/                     # Shaded/Glass primitives (Buttons, Inputs, Modals)
│   ├── client/                 # Domain-specific client UI components
│   ├── freelancer/             # Domain-specific freelancer UI components
│   └── shared/                 # Multi-use components (e.g., ConnectWhatsApp)
├── data/                       # Persistent File-Based Storage
│   ├── clients.json            # Client database records
│   ├── freelancers.json        # Freelancer profiles (enriched via AI)
│   ├── jobs.json               # Full project scoping records
│   ├── applications.json       # Proposal and bid tracking
│   └── whatsapp_chats.json     # Encrypted multi-party conversation logs
├── scripts/                    # Standalone Communication Servers
│   ├── whatsapp-server.ts      # The "AI Broker" and notification bridge
│   └── telegram-server.ts      # Secondary Telegram notification service
├── lib/                        # Core Application Logic
│   ├── ai/                     # Prompt templates and rate card logic
│   ├── storage/                # JSON helper wrappers for CRUD
│   └── utils/                  # Formatting and phone sanitization helpers
└── public/                     # Static media, icons, and platform logos
```

---

## 🛠 Developer Guide: Extending KolaMatch

### 1. Modifying the Scoping Intelligence
The scoping logic is defined in `lib/ai/prompts.ts`. To add a new verification axis (e.g., "Architecture Scalability"), update the JSON instructions in the `SYSTEM_PROMPT`. The UI will automatically render any new fields returned in the "Red Flags" or "Score" objects.

### 2. Implementing New Bot Commands
The "AI Broker" (`scripts/whatsapp-server.ts`) is designed to be extensible. 
- **Tag Integration:** If you want the AI to perform a new action (like `GENERATE_INVOICE`), simply add the tag to the `SYSTEM_PROMPT` instructions.
- **Handler Implementation:** Add an `if (payload.type === '...')` block in the bridge execution loop to trigger the desired script.

### 3. Styling the Custom "Glass" Theme
We use a custom design system defined in `app/globals.css`.
- **Glossy Surface:** `bg-white/10 backdrop-blur-md border-white/20`
- **Premium Shadow:** `shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`
Always use translucent values to keep the "Glass" effect consistent across components.

---

## 🚦 Installation & Detailed Setup

### 1. Prerequisites
- **Bun installed:** `curl -fsSL https://bun.sh/install | bash`
- **Chrome/Chromium:** Required by Puppeteer for the WhatsApp bridge.

### 2. Environment Configuration
Create a `.env.local` file with the following keys:
```env
# REQUIRED: Get your key at https://openrouter.ai/
OPENROUTER_API_KEY=your_key_here

# OPTIONAL: Model selection
MODEL=google/gemini-2.0-flash-exp

# PORT CONFIG
WHATSAPP_PORT=3001
PORT=3000

# TELEGRAM
TELEGRAM_BOT_TOKEN=your_token_here
```

### 3. Launching the System
**Web Dashboard:**
```bash
bun run dev
```
**WhatsApp Bridge:**
```bash
bun run whatsapp
```
**Telegram Bridge:**
```bash
bun run telegram
```

---

## 📋 Command Quick Reference

| Action | WhatsApp Command | Telegram Availability |
| :--- | :--- | :--- |
| **Link Profile** | `link-[ID]` | Yes (automatic on ID match) |
| **Check Matches** | `/jobs` | Yes |
| **Sync CV** | Attach PDF | Pending v1.1 |
| **Audit Profile** | `/profile` | Yes |
| **Direct Pitch** | Natural Language | Yes (AI mediated) |

---

## 📈 Strategic Fit for Kolaborate
KolaMatch Intelligence is designed to be a platform enhancement:
- **Trust & Safety:** Reduces disputed milestones by clarifying scope early.
- **Engagement:** WhatsApp/Telegram delivery increases response rates by an estimated 40%.
- **Retention:** Matched freelancers compete on merit and specific project fit.
- **Synergy:** Skill gaps identified by AI act as natural entries for Kolaborate Academy.

---

## ❓ Troubleshooting & Common Issues

| Symptom | Probable Cause | Resolution |
| :--- | :--- | :--- |
| **Guest Mode** | Phone mismatch. | Type `link-[ID]` in WhatsApp to re-verify. |
| **CV Upload Fails** | Large PDF. | Ensure the PDF is under 5MB for the CV parser. |
| **Telegram no alerts** | Token missing. | Verify `TELEGRAM_BOT_TOKEN` in `.env.local`. |
| **QR Scan fails** | Stale session. | Delete the `.wppconnect` folder and restart. |

---

## 🗺 Future Roadmap
- **[ ] Payments Bridge:** Enabling escrow deposits directly through Mobile Money prompts in-chat.
- **[ ] Multi-Language Support:** Swahili, Luganda, and French localized prompt templates.
- **[ ] Academy Integration:** Linking "Skill Gaps" to Kolaborate Academy courses.
- **[ ] Voice Integration:** AI-powered scoping calls via WhatsApp Voice Notes.
- **[ ] Desktop App:** Electron-based wrapper for heavy project management.

---

### Credits
Built with ♥ for the **Kolaborate Build Challenge — April 21–27, 2026**
*Stack: Next.js 16 · Tailwind 4 · Bun · OpenRouter · WPPConnect · Telegraf · jsPDF*

*"Transforming the future of African freelancing via agentic AI."*
