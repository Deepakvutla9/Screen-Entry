# Architecture Document — Screen Entry

> **Version:** 1.0
> **Last Updated:** 2026-05-06
> **Status:** Beta (Invite-Only)
> **Live URL:** https://www.screenentry.com

---

## 1. Executive Summary

Screen Entry is a professional casting platform built for the **Telugu film industry**. It connects actors with casting directors, production houses, and recruiters. The platform is currently in private beta, accessible only via invite code.

The application is a full-stack web app built on **Next.js 15** with **Supabase** as the backend. All auth flows are server-side. The frontend follows a cinematic dark design system with gold and red brand colors.

---

## 2. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│         Next.js React Components (Client + Server)       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                   Vercel (Hosting)                       │
│              www.screenentry.com                         │
│                                                          │
│  ┌─────────────────┐    ┌──────────────────────────┐    │
│  │  Next.js Pages  │    │   API Routes (Server)    │    │
│  │  (App Router)   │    │  /api/auth/login         │    │
│  │                 │    │  /api/auth/signup        │    │
│  │                 │    │  /api/auth/signout       │    │
│  └────────┬────────┘    └────────────┬─────────────┘    │
│           │                          │                   │
│           └──────────┬───────────────┘                   │
│                      │                                   │
└──────────────────────┼───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│                    Supabase                               │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Auth       │  │  PostgreSQL  │  │  Storage       │  │
│  │  (Sessions) │  │  (profiles)  │  │  (photos)      │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 15 | App Router, React Server Components |
| Language | TypeScript | ~5.8 | Strict mode |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| Components | shadcn/ui (Radix UI) | Latest | New-york style |
| Auth | Supabase Auth | ^0.5.2 | Email/password, cookie-based sessions |
| Database | Supabase (PostgreSQL) | — | Row Level Security enabled |
| Storage | Supabase Storage | — | Bucket: `Screen Entry` |
| ORM | None | — | Direct Supabase client queries |
| Hosting | Vercel | — | Auto-deploy from `main` branch |
| Domain | GoDaddy → Vercel DNS | — | www.screenentry.com |
| Package manager | npm | — | |

---

## 4. Project Structure

```
Screen-Entry/
├── src/
│   ├── app/                          Next.js App Router
│   │   ├── layout.tsx                Root layout — Navbar + Footer
│   │   ├── page.tsx                  Landing page (Server Component)
│   │   ├── globals.css               Tailwind base + theme tokens
│   │   ├── login/page.tsx            Login page
│   │   ├── signup/page.tsx           Signup page (invite-only)
│   │   ├── dashboard/page.tsx        Role-based dashboard (protected)
│   │   ├── profile/page.tsx          Profile settings (protected)
│   │   ├── feed/page.tsx             Casting feed (protected)
│   │   ├── browse/page.tsx           Browse actors (protected)
│   │   ├── actors/[id]/page.tsx      Public actor profile
│   │   ├── forgot-password/page.tsx  Password reset request
│   │   ├── reset-password/page.tsx   Password reset form
│   │   ├── auth/callback/route.ts    Handles email confirm + reset links
│   │   └── api/auth/
│   │       ├── login/route.ts        POST — server-side sign in
│   │       ├── signup/route.ts       POST — server-side sign up + invite check
│   │       └── signout/route.ts      POST — server-side sign out
│   │
│   ├── components/
│   │   ├── ui/                       shadcn/ui primitives (do not edit)
│   │   ├── Logo.tsx                  SVG clapperboard logo component
│   │   ├── Navbar.tsx                Auth-aware navigation + sign out
│   │   ├── AuthForm.tsx              Login / signup form
│   │   ├── DashboardClient.tsx       Actor + recruiter dashboards
│   │   ├── ProfileClient.tsx         Profile settings + photo uploads
│   │   ├── PublicActorProfile.tsx    Read-only actor profile page
│   │   ├── BrowseClient.tsx          Actor card grid
│   │   └── CastingFeedClient.tsx     Casting call feed
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             Browser Supabase client + Profile type
│   │   │   └── server.ts             Server Supabase client (RSCs + routes)
│   │   ├── auth.ts                   requireProfile() — redirects if no session
│   │   ├── data.ts                   Seed/mock data (server-safe)
│   │   ├── store.ts                  localStorage mock store (temporary)
│   │   └── utils.ts                  cn() Tailwind class helper
│   │
│   └── middleware.ts                 Refreshes Supabase session on every request
│
├── README.md
├── HANDBOOK.md
├── ARCHITECTURE.md                   (this file)
├── AGENT_PROMPTS.md
├── .env.local                        Secret keys (never committed)
└── .env.example                      Template for environment variables
```

---

## 5. Database Schema

### Supabase Project
- **ID:** `plcngksoavdaimosnvzy`
- **Region:** us-east-1

### `profiles` Table

| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID | No | Primary key — references `auth.users(id)` |
| name | TEXT | No | Full name |
| email | TEXT | No | Email address |
| role | TEXT | No | `actor` or `recruiter` |
| location | TEXT | Yes | City/region |
| age | INTEGER | Yes | Actors only |
| height | TEXT | Yes | Actors only (e.g. `5'10"`) |
| skills | TEXT[] | Yes | Actors only — comma-separated list |
| languages | TEXT[] | Yes | Actors only |
| video_reel | TEXT | Yes | YouTube/Vimeo URL — actors only |
| company_name | TEXT | Yes | Recruiters only |
| profile_photo | TEXT | Yes | Public Supabase Storage URL |
| photos | TEXT[] | Yes | Up to 5 portfolio photo URLs |
| instagram | TEXT | Yes | Full URL |
| twitter | TEXT | Yes | Full URL |
| youtube | TEXT | Yes | Full URL |
| website | TEXT | Yes | Personal site or IMDB URL |
| created_at | TIMESTAMPTZ | No | Auto-set on insert |
| updated_at | TIMESTAMPTZ | No | Auto-updated via trigger |

### Row Level Security Policies

| Policy | Operation | Rule |
|---|---|---|
| Public read | SELECT | Anyone can read all profiles |
| Own write | INSERT / UPDATE | `auth.uid() = id` |

### Database Triggers

| Trigger | Event | Action |
|---|---|---|
| `on_auth_user_created` | After INSERT on `auth.users` | Creates a `profiles` row, reads `name` and `role` from `raw_user_meta_data` |
| `profiles_updated_at` | Before UPDATE on `profiles` | Sets `updated_at = now()` |

---

## 6. Authentication Architecture

All auth is server-side. The browser never handles raw session tokens directly.

### Flows

| Flow | Endpoint | Description |
|---|---|---|
| Sign up | `POST /api/auth/signup` | Validates invite code server-side, calls `supabase.auth.signUp()`, sets cookie |
| Sign in | `POST /api/auth/login` | Calls `supabase.auth.signInWithPassword()` server-side, sets session cookie |
| Sign out | `POST /api/auth/signout` | Calls `supabase.auth.signOut()` server-side, clears cookie |
| Email confirm | `GET /auth/callback?code=` | `exchangeCodeForSession()`, redirects to `/dashboard` |
| Password reset | `GET /reset-password?code=` | `exchangeCodeForSession()` then `updateUser({ password })` |
| Session refresh | `middleware.ts` | Runs on every request, calls `getUser()` to refresh cookie |

### Invite-Only Access

Signup requires a valid invite code. The code is stored in the `INVITE_CODE` environment variable on Vercel (server-side only — never exposed to the browser). Invalid codes return a `403` error before `signUp` is even called.

### Key Rules
- All post-auth redirects use `window.location.href` (hard navigation), never `router.push()` — ensures the server reads the fresh session cookie
- Supabase client in React components is always created with `useRef(createClient()).current` to prevent re-creation on every render

---

## 7. Storage Architecture

### Supabase Storage Bucket: `Screen Entry`

| Path | Content | Upload rule |
|---|---|---|
| `{userId}/avatar.{ext}` | Profile photo | Upsert — replaces previous avatar |
| `{userId}/{timestamp}.{ext}` | Portfolio photos | Max 5 per user, max 5MB each |

Public URLs are cached-busted with a `?t={timestamp}` query param on avatar uploads to force browser refresh.

---

## 8. Page Architecture

### Public Pages (no auth required)
| Route | Type | Description |
|---|---|---|
| `/` | Server Component | Landing page |
| `/login` | Client Component | Login form |
| `/signup` | Client Component | Signup form (invite code required) |
| `/forgot-password` | Client Component | Password reset request |
| `/reset-password` | Client Component | Set new password |
| `/actors/[id]` | Server Component | Public actor profile |

### Protected Pages (redirect to `/login` if no session)
| Route | Type | Description |
|---|---|---|
| `/dashboard` | Server → Client | Role-based dashboard |
| `/profile` | Server → Client | Profile settings + uploads |
| `/feed` | Server → Client | Casting call feed |
| `/browse` | Server → Client | Browse actor talent |

---

## 9. Design System

| Token | Value | Usage |
|---|---|---|
| Primary red | `#8B1A1A` | Buttons, active states, accents |
| Hover red | `#5C0808` | Button hover states |
| Dark background | `#0a0a0a` | Dashboard background |
| Dark header | `#0D0000` | Navbar, banner backgrounds |
| Amber accent | `amber-500` / `#F59E0B` | CTAs, highlights, icons |
| Glass card | `bg-white/[0.04]` + `border-white/[0.07]` | Dashboard cards |

### Logo Component
- File: `src/components/Logo.tsx`
- Props: `size` (sm/md/lg), `variant` (light/dark), `href` (default `/`)
- Always use this component — never inline the logo

---

## 10. Environment Variables

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anon key (public) |
| `INVITE_CODE` | Vercel only | Secret beta invite code (server-side only) |

---

## 11. Deployment Pipeline

```
Developer pushes to main
        │
        ▼
   GitHub (main branch)
        │
        ▼ Auto-deploy trigger
   Vercel Build
   (npm run build)
        │
        ▼
   Production Deploy
   www.screenentry.com
```

- Every push to `main` auto-deploys to production
- No staging environment currently — all changes go live immediately
- Domain: `screenentry.com` → redirects to `www.screenentry.com`
- SSL: Managed automatically by Vercel

---

## 12. What's Working (Current State)

| Feature | Status |
|---|---|
| Landing page | ✅ Live |
| Email/password auth (signup + login + logout) | ✅ Live |
| Invite-only signup with server-side code check | ✅ Live |
| Email confirmation flow | ✅ Live |
| Forgot / reset password | ✅ Live |
| Actor dashboard (cinematic dark UI) | ✅ Live |
| Recruiter dashboard | ✅ Live |
| Profile settings (name, age, height, skills, languages, reel) | ✅ Live |
| Avatar upload (Supabase Storage) | ✅ Live |
| Portfolio photos upload (up to 5) | ✅ Live |
| Social links (Instagram, Twitter, YouTube, Website) | ✅ Live |
| Public actor profile page `/actors/[id]` | ✅ Live |
| Browse Talent page (actor cards → public profiles) | ✅ Live |
| Casting feed (mock data) | ✅ Live |
| Media lightbox (photos + video reel) | ✅ Live |
| Custom domain (www.screenentry.com) | ✅ Live |
| Logo component (consistent across all pages) | ✅ Live |

---

## 13. Pending Work

### High Priority

| # | Feature | Description |
|---|---|---|
| 1 | **Casting calls in Supabase** | Replace `localStorage` mock store with a real `casting_calls` table. Recruiters post calls, actors see them in the feed. |
| 2 | **Applications in Supabase** | Replace mock store with a real `applications` table. Track actor → casting call relationships with status (pending / shortlisted / rejected). |
| 3 | **Recruiter applicant view** | `/applicants/[id]` page needs to pull real applicants from Supabase instead of mock data. |

### Medium Priority

| # | Feature | Description |
|---|---|---|
| 4 | **Credits persistence** | Actor credits (film/TV/theater) are currently only in component state — lost on refresh. Need a `credits` table in Supabase. |
| 5 | **Education persistence** | Same issue — education/training entries are in-memory only. |
| 6 | **Highlights persistence** | Same issue — awards/highlights are in-memory only. |
| 7 | **Search & filters** | Full-text search on actor profiles (by name, skill, language, location). Filter casting calls by role type, location, age range. |
| 8 | **Notifications** | In-app notifications when an actor is shortlisted or a new casting call matches their profile. |

### Low Priority / Future

| # | Feature | Description |
|---|---|---|
| 9 | **Google OAuth** | Already scaffolded — blocked on Google Cloud Console credit card setup. |
| 10 | **Messaging / Chat** | Direct messaging between recruiters and actors. Planned with Stream Chat. |
| 11 | **Email notifications** | Transactional emails via Resend (application received, shortlisted, etc.). |
| 12 | **Video hosting** | Native video reel upload via Mux — currently only YouTube/Vimeo links. |
| 13 | **Staging environment** | Separate Vercel preview + Supabase branch for testing before going live. |
| 14 | **Mobile app** | React Native port — long-term goal. |
| 15 | **Public launch** | Remove invite-only restriction when ready to open to all users. |

---

## 14. Known Technical Debt

| Item | Description | Impact |
|---|---|---|
| `src/lib/store.ts` | localStorage mock store for casting calls and applications | Will be replaced when Supabase tables are built — medium |
| No staging environment | All pushes go directly to production | Risk of shipping bugs to live users — medium |
| Credits/Education/Highlights in state | Data lost on page refresh | Poor UX for dashboard sections — high |
| No input sanitization on profile fields | No Zod validation on server-side routes | Low risk currently, should be added before scaling |

---

## 15. Security Considerations

| Area | Current State |
|---|---|
| Auth | Server-side only — no tokens exposed to browser |
| Invite code | Server-side env variable — not in client bundle |
| RLS | Enabled on `profiles` — users can only edit their own row |
| Storage | Public bucket — all uploaded photos are publicly accessible via URL |
| API routes | No rate limiting currently |
| Input validation | Basic HTML validation only — no Zod schema validation yet |
