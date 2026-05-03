# 🗳️ V-O-T-E

### **Voter Outreach & Timely Engagement**

**Problem:** In Indian general elections, millions of first-time and rural voters struggle with a fragmented process — verifying their name on the Electoral Roll, locating their assigned polling booth, understanding EVM/VVPAT operation, and knowing which documents (EPIC, Aadhaar, DL) are accepted. Information is scattered across multiple government portals, leading to confusion, long queues, and disenfranchisement — especially for PwD (Persons with Disabilities) voters who face additional accessibility barriers.

**Solution:** V-O-T-E is an AI-powered, single-screen election day assistant that consolidates every step of the Indian voting process into a 4-panel dashboard. It uses Firebase Auth for secure identity, Firestore for persistent voter profiles, Gemini AI for contextual guidance on EVM usage and booth procedures, Google Maps SDK for polling station navigation, and the Civic Information API for real-time registration verification — all wrapped in an accessible, mobile-responsive interface designed for Bharat's diverse electorate.

## What It Does

V-O-T-E is a 4-panel dashboard that guides voters through every step of election day:

| Panel | Feature | Google Service |
|---|---|---|
| **🪪 Voter Profile Status** | Electoral Roll verification, EPIC/address check, readiness checklist (ID, polling booth) | Firebase Auth, Firestore, Civic Info API |
| **📅 Election Journey** | Timeline with ECI milestones, dynamic countdown, Google Calendar sync | Google Calendar |
| **📖 Smart Tutorial Assist** | AI chatbot for EVM/VVPAT guidance, required documents (EPIC, Aadhaar), booth procedures, PwD accommodations | Gemini 2.0 Flash |
| **📍 Logistics & Traffic** | Interactive polling station map, estimated wait times, PwD accessibility info (ramp entry, volunteers) | Google Maps SDK |

---

## Google Services Integration

| Service | Implementation | File |
|---|---|---|
| **Firebase Auth** | `signInWithPopup()` with `GoogleAuthProvider` — real Google sign-in | `src/services/firebaseService.ts` |
| **Cloud Firestore** | `getDoc` / `setDoc` with `serverTimestamp()` — voter profile persistence at `users/{uid}` | `src/hooks/useAuth.ts` |
| **Firestore Security Rules** | Field-level validation, owner-only access, `updatedAt == request.time` enforcement | `firestore.rules` |
| **Gemini AI** | `GoogleGenAI` → `gemini-2.0-flash` with system prompt, prompt caching, error fallback | `src/services/geminiService.ts` |
| **Google Maps SDK** | `@googlemaps/js-api-loader` → `importLibrary("maps")` + `Marker` for polling station | `src/services/googleService.ts` → `NavigationCard.tsx` |
| **Civic Information API** | `civicinfo/v2/voterinfo` — Electoral Roll / polling location lookup with graceful fallback | `src/services/googleService.ts` → `VoterStatus.tsx` |
| **Google Calendar** | Deep link with `TEMPLATE` action, pre-filled ECI election date details | `src/components/Timeline.tsx` |
| **Google Analytics** | `getAnalytics()` with `isSupported()` check | `src/services/firebaseService.ts` |

---

## Architecture

```
src/
├── App.tsx                    # Root layout — 2×2 grid, ErrorBoundary wrapper
├── main.tsx                   # Entry point with StrictMode
├── index.css                  # Design system (Inter + Space Grotesk, oklch tokens)
│
├── components/
│   ├── VoterStatus.tsx        # Auth-gated voter profile with Civic API / Electoral Roll
│   ├── Timeline.tsx           # ECI election milestones with dynamic countdown
│   ├── TutorialAssistant.tsx  # Gemini-powered chat for EVM/VVPAT guidance
│   ├── NavigationCard.tsx     # Maps SDK + polling booth logistics + PwD info
│   └── ErrorBoundary.tsx      # React error boundary with accessible alert UI
│
├── hooks/
│   └── useAuth.ts             # Firebase Auth + Firestore voter profile management
│
└── services/
    ├── firebaseService.ts     # Firebase init, Auth, Firestore, Analytics exports
    ├── geminiService.ts       # Gemini AI with caching and error handling
    ├── aiService.ts           # Local response engine (EVM, EPIC, booth procedures)
    └── googleService.ts       # Maps SDK loader + Civic Information API
```

---

## Accessibility

- **Skip-to-content** link as first focusable element for keyboard users
- **`aria-live="polite"`** on chat messages for screen reader announcements
- **`role="checkbox"`** with `aria-checked` + keyboard handlers (Space/Enter) on readiness checklist
- **`role="list"` / `role="listitem"`** with descriptive `aria-label` on timeline steps
- **`role="alert"`** on ErrorBoundary fallback UI
- **Semantic HTML** — `<header>`, `<main>`, `<footer>`, `<button>` (no `<span>` as interactive elements)
- **Focus management** — all interactive elements reachable via Tab, `tabIndex={0}` on custom controls
- **PwD awareness** — polling booth accessibility info (ramp entry, volunteers, parking) displayed prominently

---

## Security

- **Content Security Policy** — restrictive CSP via `<meta>` tag with allowlisted Google domains (no `unsafe-eval`)
- **Firestore Security Rules** — field-level validation, owner-only read/write, UID consistency checks
- **`rel="noopener noreferrer"`** on all external links
- **Firebase Auth** — real Google OAuth, no mock users
- **`serverTimestamp()`** — server-side timestamp validation prevents client clock manipulation

---

## Testing

```bash
npm test
```

Test suite covers:
- **Components** — VoterStatus (7 tests), TutorialAssistant (5), Timeline (4), NavigationCard (6), App (6), ErrorBoundary (3)
- **Services** — geminiService (5 tests: API call, caching, error fallback, empty response, model string), aiService (3 tests: EVM response, registration, cache)
- **Hooks** — useAuth (6 tests: init state, login, logout, updateProfile guard, cleanup, error handling)
- All external dependencies mocked (Firebase, Gemini, Google Maps, Civic API)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 4 + shadcn/ui components |
| **AI** | Google Gemini 2.0 Flash via `@google/genai` |
| **Backend** | Firebase Auth + Cloud Firestore |
| **Maps** | Google Maps SDK via `@googlemaps/js-api-loader` |
| **Testing** | Vitest + React Testing Library + jsdom |
| **Fonts** | Inter (body) + Space Grotesk (headings) via Google Fonts |
