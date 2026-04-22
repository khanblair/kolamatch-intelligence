# KolaMatch Intelligence

AI-Powered Project Scoping & Matchmaking Platform.

## 🚀 Getting Started

### 1. Installation
Ensure you have [Bun](https://bun.sh) installed.
```bash
bun install
```

### 2. Configuration
Copy the `.env.local` template and add your OpenRouter API Key.
```bash
cp .env.local.example .env.local # Or create manually
```

### 3. Run the Development Server
```bash
bun run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 4. Run WhatsApp Notification Bridge (Optional)
This project is designed to work with a local `wppconnect` server running on port `3001`.
```bash
# In a separate terminal, run your wppconnect server
bun run whatsapp
```

## 🛠 Features
- **Landing Page:** Professional entry point at `/`.
- **Project Scoping:** AI analysis of raw briefs at `/dashboard` (Client).
- **CV Matching:** Skills extraction and project matching for Freelancers.
- **Role-based Views:** Dedicated dashboards for Clients and Freelancers.
- **Export Utilities:** PDF export for scopes and proposals.

## 📁 Key Directories
- `/app`: Role-based route groups `(client)`, `(freelancer)`, and `(auth)`.
- `/components`: Shared and role-specific UI components.
- `/lib/ai`: OpenRouter configuration and prompts.
- `/data`: Local JSON store for demo persistence.
