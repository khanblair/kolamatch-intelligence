# KolaMatch Intelligence
## AI-Powered Project Scoping & Freelancer Matching Engine
### Kolaborate Build Challenge — Refined Concept Document v2.0

---

## 1. Executive Summary

**KolaMatch Intelligence** is a dual-sided AI command center built specifically for the Kolaborate marketplace. It eliminates the two biggest bottlenecks in the freelance economy: clients who cannot articulate what they need, and freelancers who waste unpaid hours writing proposals for jobs they are not sure they will win.

The system takes a single raw input — a client's unstructured project idea — and transforms it into two simultaneous outputs:

- A **polished, structured job post** the client can immediately use
- A **tailored proposal starter** a matched freelancer can personalize and submit

Everything runs locally on a personal machine (Next.js + Node.js). **Multi-channel messaging (WhatsApp + Telegram)** delivers real-time alerts to both parties. CVs uploaded by freelancers power the AI matching engine. A one-click PDF export turns every output into a shareable business document.

---

## 2. The Problem

### For Clients
A client posts: *"I need an app like Uber but for local logistics with mobile money integration. Budget: $1,000."*

This single sentence triggers a cascade of problems:
- Freelancers cannot price accurately without knowing deliverables
- Scope creep starts before the project begins
- The client receives wildly inconsistent proposals because every freelancer interpreted the brief differently

### For Freelancers
- Hours spent reading vague briefs and writing proposals that go unanswered
- No guidance on whether the client's budget is realistic for the scope
- No way to know if they are a strong match before investing time in a proposal

### For the Marketplace
Every failed or disputed project costs Kolaborate reputation. KolaMatch attacks the problem at the source — before the job is posted.

---

## 3. How It Works: The Full User Journey

### Phase 1 — The Client Scopes (Web Dashboard)

1. Client opens the KolaMatch web dashboard on their browser
2. Pastes their raw, unstructured project idea into a single text box — no forms to fill
3. KolaMatch AI Engine processes the input and returns:
   - A **Scope Clarity Score** (0–100) across four axes: Clarity, Feasibility, Budget Realism, Timeline Realism
   - A **Polished Job Post Draft** with: executive summary, technical deliverables, project phases, realistic timeline, and grounded budget range
   - Any **red flags** detected (e.g. "Timeline is aggressive for described scope", "Budget is below market rate for mobile app development")
4. Client reviews, edits if needed, and clicks **"Finalize Job Post"**
5. **Multi-channel notification** (WhatsApp/Telegram) fires instantly to all matched freelancers

---

### Phase 2 — The Freelancer Matches (CV Upload → AI Ranking)

Freelancers register once by uploading their CV (PDF). The system parses the CV and stores a structured profile:
- Skills extracted
- Years of experience inferred
- Past project- **Enhanced Field Extraction & Detailed Prompts**:
    - The AI now extracts `name`, `email`, `summary`, `notableProjects`, and `suggestedRate` in addition to skills and experience.
    - Added a detailed JSON schema to guide the AI in capturing all available professional data.
    - Instructions ensure that missing fields in the profile are filled from the CV, and existing ones are intelligently merged or updated.
    - The code now handles the full profile update using the AI-provided JSON structure, ensuring a robust "Full Platform Sync".
 the CV and reasoning about compatibility.

Matched freelancers receive an **Instant Alert**:
> *"🚨 New project match: [Project Title] — estimated $X–$Y. Your [Skill] experience is a strong fit. Tap to view scope and generate your proposal."*

---

### Phase 3 — The Freelancer Proposes (Web Dashboard)

1. Freelancer taps the WhatsApp link, opens their dashboard
2. Sees the fully structured job post — no guesswork about what the client actually needs
3. Clicks **"Generate Proposal Starter"**
4. AI drafts a personalized pitch that:
   - References the freelancer's specific relevant experience from their CV
   - Addresses the exact deliverables in the job post
   - Suggests a rate aligned with their experience level and the project scope
   - Selects tone based on freelancer preference: **Professional / Confident / Friendly**
5. Freelancer tweaks the draft and submits

---

### Phase 4 — The Client Closes (WhatsApp → Web)

Client receives an **Instant Alert**:
> *"🔔 New proposal received from a matched Kolaborator for [Project Title]. Tap to review."*

Client opens the dashboard, reads a highly relevant, well-structured proposal, and hires.

---

## 4. Budget Estimation Engine

Budget estimates are grounded in a **built-in rate card** derived from real market data (Upwork, Kolaborate Africa market context, and African freelance benchmarks). The AI does not guess — it identifies the component types in the brief, maps each to a rate range, and shows its working.

### Rate Card Reference (embedded in system prompt)

| Category | Junior | Mid-level | Senior |
|---|---|---|---|
| Web development (frontend) | $15–25/hr | $25–40/hr | $40–55/hr |
| Web development (full-stack) | $20–35/hr | $35–55/hr | $55–80/hr |
| Mobile app (React Native / Flutter) | $20–35/hr | $35–60/hr | $60–90/hr |
| UI/UX design | $15–25/hr | $25–40/hr | $40–60/hr |
| API / backend development | $20–35/hr | $35–55/hr | $55–80/hr |
| Data analysis / dashboards | $20–30/hr | $30–50/hr | $50–75/hr |
| Graphic design | $10–18/hr | $18–30/hr | $30–45/hr |
| Copywriting / content | $10–20/hr | $20–35/hr | $35–55/hr |
| Mobile money integration (Africa-specific) | +$200–500 flat premium |
| AI/ML integration | +30–40% rate premium |

The AI breaks the project into components, assigns hours per component, multiplies by the appropriate tier rate, and returns a **total range** with a line-item breakdown. The client sees exactly what they are paying for.

> Example output: *"This project breaks into: mobile frontend (est. 40hrs × $25–35/hr), backend API (est. 30hrs × $30–45/hr), and mobile money integration (+$300 flat). Total estimated range: **$2,900–$4,550**. Note: your stated budget of $1,000 is below the estimated minimum — consider reducing scope or phasing the build."*

---

---

## 6. Multi-Channel Messaging (WhatsApp & Telegram)

**WhatsApp (wppconnect):**
- **Technology:** Local Node.js server — no cloud dependency.
- **Setup:** One-time QR code scan to link a WhatsApp number.

**Telegram (Telegraf):**
- **Technology:** Dedicated Telegram Bot API.
- **Setup:** Zero local setup — simply provide a `TELEGRAM_BOT_TOKEN`. Perfect for rapid deployment and instant alerts.

**Unified Notification Router:**
System events map to templated messages delivered to the user's preferred channel:
- **Job matching alerts** (to freelancers)
- **Proposal received alerts** (to clients)

---

## 6. CV-Powered Freelancer Matching

### Upload Flow
1. Freelancer visits `/register`
2. Uploads CV as PDF
3. System uses OpenRouter API to parse the CV and extract: name, skills, experience level, notable past projects, and availability signals

### Matching Flow
When a job post is finalized, OpenRouter receives:
- The structured job post (deliverables, required skills, timeline, budget)
- All freelancer profiles from the JSON store

OpenRouter ranks the top 3 matches and returns for each:
- Match score (0–100)
- One-sentence fit explanation
- Suggested rate range based on their experience level
- Any skill gaps worth noting

This is transparent, explainable AI matching — not a black-box algorithm.

### Demo Profiles (Seeded)
Five pre-built demo freelancer CVs covering: full-stack development, UI/UX design, mobile development, data analysis, and graphic design. Realistic Ugandan/African names, skills, and experience levels.

---

## 7. PDF Export

Every output in KolaMatch can be exported as a formatted PDF:

| Document | Contents |
|---|---|
| **Scope Report** | Client brief, Scope Clarity Score, deliverables, timeline, budget breakdown, red flags |
| **Job Post** | Final polished job post ready to share with team or board |
| **Proposal** | Freelancer's finalized proposal, formatted professionally |

**Technology:** `jsPDF` + `html2canvas` (client-side, no server required). Single "Export PDF" button on every output panel. The PDF header includes the KolaMatch + Kolaborate branding.

---

## 8. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 16 + Tailwind CSS | Component reuse, fast iteration, built-in routing |
| AI Engine | OpenRouter API (google/gemini-2.0-flash-exp) | Scoping, matching, proposal generation |
| Backend | Next.js API routes | No separate server needed |
| CV Parsing | OpenRouter API (PDF input) | Native PDF reading, no external parser |
| WhatsApp | wppconnect (local Node.js) | No Meta cloud API needed, works offline |
| Telegram | Telegraf (Bot API) | Zero-setup, instant multi-channel alerts |
| Data Store | Local JSON files | Zero setup, sufficient for demo + hackathon |
| PDF Export | jsPDF + html2canvas | Client-side, no backend dependency |
| Hosting | Local (localhost:3000) | Demo runs on personal machine |

---

## 9. Key Screens

1. **Client Dashboard** — Brief input box, Scope Clarity Score card, structured job post output, red flags panel, Finalize button
2. **Client Jobs** — View and manage previously posted projects and incoming proposals
3. **Freelancer Dashboard** — Matched jobs feed, proposal drafting tool
4. **Freelancer Jobs** — View and track status of submitted proposals
5. **Settings** — Profile management and CV upload (for freelancers)
6. **Login** — Secure access for both clients and freelancers
7. **Match Results** — Top 3 freelancer cards with match score, fit explanation, and suggested rate
8. **PDF Export** — Available on every output screen via a single button

---

## 10. Demo Script (3 Minutes)

| Time | Action |
|---|---|
| 0:00–0:30 | Paste the "Uber for logistics with mobile money" brief. Show raw, messy input. |
| 0:30–1:00 | Scope Clarity Score appears. Show red flags: low budget, vague timeline. |
| 1:00–1:30 | Structured job post generates. Show budget breakdown line items. |
| 1:30–2:00 | Click Finalize. Show WhatsApp notification firing to matched freelancer. |
| 2:00–2:30 | Switch to freelancer dashboard. Show matched job post. Click Generate Proposal. |
| 2:30–3:00 | Show tailored proposal with freelancer's CV skills woven in. Export PDF. Done. |

---

## 11. Strategic Fit for Kolaborate

- **Serves both sides** of the marketplace simultaneously — double the value proposition
- **Attacks scope creep** at the source, before disputes happen — directly protects platform reputation
- **WhatsApp-first** delivery matches how business moves in African markets
- **CV-powered matching** means freelancers compete on merit, not just availability
- **Immediately deployable** architecture — the AI layer sits cleanly between the data store and the UI, realistic for production integration
- **Kolaborate Academy synergy** — the Scope Clarity Score and skill gap flags create natural entry points into Academy learning paths

---

## 12. Out of Scope (Acknowledged)

The following are intentionally deferred to a post-hackathon phase:

- Direct Kolaborate platform API integration (job post publishing)
- Cloud hosting / Vercel deployment
- Real user authentication / accounts
- Multi-language support (English only for v1)
- Payment processing

---

*Built for the Kolaborate Build Challenge — April 21–27, 2026*
*Stack: Next.js · OpenRouter API · wppconnect · jsPDF · Local JSON*
