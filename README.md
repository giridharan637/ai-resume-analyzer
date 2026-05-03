# Resume.AI — Premium AI Resume Analyzer

## High-level Strategy and Goal

A premium, futuristic AI SaaS workspace for analyzing, improving, and optimizing resumes. Combines a glassmorphic + neon-gradient dark UI with 3D animations, manual authentication (signup / login / logout), a protected dashboard, and a full suite of AI-powered tools: resume scoring, ATS compatibility, smart suggestions, sentence enhancement, version comparison, job match, and saved history.

## Changes Implemented

### Authentication (manual)
- `/signup` page: Full Name, Email, Password, Confirm Password with email-format validation, 6+ char password rule, and password match check. On success the user is saved and redirected to `/login`.
- `/login` page: Email + Password. On success, creates a session and redirects to `/dashboard`.
- Logout: clears the session and returns to `/login`.
- Protected routes: every `/dashboard/*` page redirects unauthenticated visitors to `/login`.
- Accounts are stored in `localStorage` with SHA-256 password hashing (no plaintext passwords). Implemented in `src/lib/local-auth.ts`. The previous Jane Doe demo fallback has been removed — there is no auto-login. In production, the real Vybe org session is preferred when available; otherwise the manual session is used.

### Login / Signup UI (3D high-end)
- Fullscreen animated background: particle network, glowing animated grid, conic wave glow, multiple animated blobs.
- Floating 3D shapes — orbs, rotating cube (3 faces with translateZ), neon ring, pyramid, gradient sphere — each with float / spin / shadow.
- Center glassmorphism card with neon halo + pulse-glow ring.
- Inputs with glow border on focus (violet on login, cyan on signup).
- Gradient neon button with hover scale + ripple.
- Smooth fade + scale transitions, animated link to switch between login and signup.

### Dashboard
- Welcome message: "Welcome back, [Name]" pulled from the active session.
- Animated profile card (avatar generated from initials with neon gradient, name, email).
- Floating stat tiles with depth and entry animation.
- Sidebar shell: Dashboard, Analyzer, History, Compare, Settings.
- Sticky glass topbar with search + theme toggle.
- Logout button in the sidebar profile pill.

### Resume Analyzer
- Drag-and-drop upload with glowing border + scanning beam + "Analyzing…" pulse.
- Structured scoring: Skills 30% / Projects 20% / Experience 20% / Formatting 15% / Keywords 15%.
- Animated circular Resume Score and ATS Score with bands: 80+ ATS Friendly ✅, 50–79 Moderate ⚠️, <50 Not ATS Friendly ❌.
- Section breakdown bars, missing-elements warnings, matched vs missing keyword chips.
- Smart suggestions (action verbs, summary, projects, formatting, technical skills).
- AI Sentence Enhancer powered by the built-in AI integration.
- Job Match + Keyword Gap with role library.
- PDF download via print styles.

### Other pages
- `/` Landing — hero, features grid, demo CTA, job match teaser. Navbar links to Sign in / Get started.
- `/dashboard/history` — per-account saved analyses with view / delete / clear.
- `/dashboard/compare` — two upload slots, side-by-side per-section diffs.
- `/dashboard/settings` — profile, theme, animation switches.

## Architecture and Technical Decisions

- **Manual auth on the client.** Vybe doesn't support custom server-side credential storage, so accounts are persisted in `localStorage` with hashed passwords (`crypto.subtle` SHA-256). This delivers a complete signup → login → protected dashboard → logout flow without violating platform constraints. The route guard lives in `DashboardShell` (`useEffect` + `router.replace('/login')`).
- **Production fallback to platform auth.** `useCurrentUser` prefers the Vybe org session in production when present, and falls back to the manual session otherwise — so the app works whether deployed inside an org or used as a standalone tool.
- **Custom dashboard layout.** Uses a fully branded glass shell (`NAV_LINKS` is intentionally length 1 so the platform sidebar in `RootLayout` is not rendered).
- **Theme.** Defaults to dark; the in-app toggle works. Glass utilities have `:root:not(.dark)` overrides for legibility in light mode.
- **History.** Stored in `localStorage`, scoped by user email, last 50 entries. A `history-change` event keeps components in sync.
- **Resume parsing.** Deterministic mock derived from file name (real client-side PDF/DOCX parsing would require heavy deps). The AI Sentence Enhancer uses the real built-in AI integration.
- **PDF download.** `window.print()` + `@media print` styles strip glass effects.
- **Performance.** Animations are CSS-driven; particles are canvas-based and capped; no heavy libraries added.
