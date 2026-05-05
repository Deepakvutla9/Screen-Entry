# Project Handbook — Screen Entry

> **For AI agents:** Read this entire document before making any change. If a request conflicts with this handbook, stop and ask the user. Do not assume.

---

## 1. What We're Building

A professional casting platform for the **Telugu film industry**. Two user types share the platform:

- **Actors** — build profiles with headshots, reels, skills, languages. Browse and apply to casting calls.
- **Recruiters** (casting directors, agents, producers) — post casting calls, browse talent, manage applicants, shortlist actors.

"LinkedIn meets Backstage, built specifically for Telugu cinema."

---

## 2. Who I Am (the User)

I am a non-technical founder building this solo with AI coding agents. I read code but do not write it. When you make changes:

- Explain what you changed and why, in plain English, after every meaningful edit.
- Flag anything risky, irreversible, or that touches auth/data.
- Never assume I'll catch a subtle bug — point it out.
- If I ask for something that will break existing functionality, warn me first.

---

## 3. Current State of the Project

> **This section must be updated at the end of every session.**
> Last updated: 2026-05-05

### What's been built

| Area | Status | Notes |
|---|---|---|
| Landing page | ✅ Done | Cinematic gold/red theme — hero, stats bar, steps, featured talent, casting calls, blog, CTA |
| Auth — Email/Password | ✅ Done | Server-side login via `/api/auth/login`; server-side logout via `/api/auth/signout` |
| Auth — Google OAuth | ❌ Removed | Removed — requires Google Cloud Console credit card setup which isn't ready |
| Profiles table (Supabase) | ✅ Done | RLS enabled, auto-populated via DB trigger on signup |
| Profile settings | ✅ Done | Saves to Supabase; redirects to dashboard on save |
| Avatar upload | ✅ Done | Supabase Storage, label+input pattern, cache-busted URL |
| Portfolio photos | ✅ Done | Up to 5 photos, Supabase Storage, inline remove button |
| Actor dashboard | ✅ Done | Stats, application history, media lightbox (avatar + photos + reel) |
| Recruiter dashboard | ✅ Done | Post casting calls, view applicants, shortlist (mock data) |
| Public actor profiles | ✅ Done | Read-only page at `/actors/[id]` — Backstage-style layout |
| Browse Talent | ✅ Done | Actor cards link to public profiles |
| Casting feed | ✅ Done | Browse active casting calls (mock data) |
| Logo component | ✅ Done | SVG clapperboard logo, light/dark variants, used across all pages |
| Navbar sign out | ✅ Done | Visible "Sign out" button on all pages; uses server-side signout route |
| Casting calls in Supabase | ❌ Not started | Still using localStorage mock store |
| Applications in Supabase | ❌ Not started | Still using localStorage mock store |
| Messaging | ❌ Not started | — |

### Current tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict | |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york style) | Components: Button, Card, Badge, Input, Label, Avatar |
| Auth | Supabase Auth via `@supabase/ssr` | Email/password only; login + logout are server-side API routes |
| Database | Supabase (PostgreSQL) | Profiles live; casting calls + applications still in localStorage |
| Storage | Supabase Storage | Bucket: `Screen Entry`; avatars + portfolio photos |
| State / mock data | localStorage (`src/lib/store.ts`) | To be replaced by Supabase queries |
| Package manager | npm | |
| Hosting | Vercel auto-deploys from `main` | |

### Folder structure

```
src/
├── app/
│   ├── layout.tsx                root layout (Navbar + footer)
│   ├── page.tsx                  landing page (Server Component)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx        calls requireProfile(), protected
│   ├── feed/page.tsx
│   ├── profile/page.tsx          profile settings, protected
│   ├── browse/page.tsx           browse actors, protected
│   ├── actors/[id]/page.tsx      public actor profile
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── auth/callback/route.ts    handles email confirm + password reset links
│   └── api/auth/
│       ├── login/route.ts        POST — signs in server-side, sets session cookie
│       └── signout/route.ts      POST — signs out server-side, clears session cookie
├── components/
│   ├── ui/                       shadcn/ui primitives (generated — do not edit manually)
│   ├── Logo.tsx                  SVG logo, props: size (sm/md/lg), variant (light/dark), href
│   ├── Navbar.tsx                client component — auth-aware nav + sign out button
│   ├── AuthForm.tsx              shared login/signup form
│   ├── DashboardClient.tsx       actor/recruiter dashboard with lightbox
│   ├── ProfileClient.tsx         profile settings + avatar + photo gallery
│   ├── PublicActorProfile.tsx    read-only actor profile with lightbox
│   ├── BrowseClient.tsx          actor card grid
│   └── CastingFeedClient.tsx     casting call feed
├── lib/
│   ├── supabase/
│   │   ├── client.ts             browser client; exports Profile type
│   │   └── server.ts             server client for RSCs and route handlers
│   ├── auth.ts                   requireProfile() — redirects to /login if no session
│   ├── data.ts                   server-safe seed/mock data
│   ├── store.ts                  localStorage helpers (mock casting calls/applications)
│   └── utils.ts                  cn() Tailwind helper
└── middleware.ts                 refreshes Supabase session cookie on every request
```

---

## 4. Target Architecture (Where We're Heading)

| Layer | Target Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript strict | Current |
| Styling | Tailwind CSS + shadcn/ui | Current |
| Database | PostgreSQL via Supabase | Current |
| Auth | Supabase Auth | Current — email/password; Google OAuth deferred |
| File storage | Supabase Storage | Current for photos; Cloudflare R2 or Mux for video later |
| Video | Mux | Reels — never store raw video |
| Email | Resend | Transactional only |
| Chat | Stream Chat | Do not build from scratch |
| Search | Postgres full-text → Algolia later | |
| Hosting | Vercel | Current |
| Background jobs | Inngest | Email, video processing |

> If you think a different tool is better, **tell me and wait**. Do not swap silently.

---

## 5. Supabase Project Details

- **Project name:** Deepakvutla9's Project (org: ScreenEntry)
- **Project ID:** `plcngksoavdaimosnvzy`
- **Region:** us-east-1
- **URL:** `https://plcngksoavdaimosnvzy.supabase.co`
- **Storage bucket:** `Screen Entry` (public)
- **Env file:** `.env.local` (never committed)

### Database schema

#### `profiles` table

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key, references auth.users(id) |
| name | TEXT | Required |
| email | TEXT | Required |
| role | TEXT | `actor` or `recruiter` |
| location | TEXT | Default: 'Hyderabad' |
| age | INTEGER | Actors only |
| height | TEXT | Actors only |
| skills | TEXT[] | Actors only |
| languages | TEXT[] | Actors only |
| video_reel | TEXT | YouTube/Vimeo URL, actors only |
| company_name | TEXT | Recruiters only |
| profile_photo | TEXT | Public URL (Supabase Storage) with cache-bust `?t=` param |
| photos | TEXT[] | Up to 5 portfolio photo URLs |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

**RLS policies:**
- Anyone can read all profiles (public talent browsing)
- Users can only update/insert their own profile (`auth.uid() = id`)

**Triggers:**
- `on_auth_user_created` — auto-creates a profile row on signup (reads `name` and `role` from `raw_user_meta_data`)
- `profiles_updated_at` — auto-updates `updated_at` on every row change

---

## 6. Auth Architecture

All auth flows are server-side to ensure session cookies work reliably on all connection speeds and devices.

| Flow | Route | How |
|---|---|---|
| Sign up | Client `supabase.auth.signUp()` | User gets email confirmation |
| Email confirm | `/auth/callback?code=...` | `exchangeCodeForSession` then redirect to `/dashboard` |
| Sign in | `POST /api/auth/login` | Server-side `signInWithPassword`, sets cookie, returns `{ ok: true }` |
| Sign out | `POST /api/auth/signout` | Server-side `signOut`, clears cookie, returns `{ ok: true }` |
| Forgot password | Client `supabase.auth.resetPasswordForEmail()` | Sends reset email |
| Reset password | `/reset-password?code=...` | `exchangeCodeForSession` then `updateUser({ password })` |
| Session refresh | `middleware.ts` | Runs on every request, calls `getUser()` to refresh cookie |

**Important:** Never use `router.push()` for auth redirects — use `window.location.href` to force a full page reload so the server reads the fresh session cookie.

---

## 7. UI/UX Principles

- **Cinematic gold and red theme.** Primary: `#8B1A1A` (deep red). Accent: `amber-500` / `#F59E0B`. Dark backgrounds: `#0D0000`.
- **Consistent Logo.** Use the `<Logo>` component everywhere — never inline SVG or text. Props: `size` (sm/md/lg), `variant` (light for dark backgrounds, dark for light backgrounds), `href` (default `/`).
- **Navbar on every page** via root layout. Sign out button always visible when logged in.
- **Mobile-first.** Build mobile layout first, then desktop.
- **Headshots and reels lead.** Visual content is the product — never bury it.
- **Two distinct experiences.** Actor and recruiter users see different dashboards, navigation, and CTAs.
- **Loading states everywhere.** Use `Loader2` spinner from lucide-react.
- **Empty states are designed**, not blank pages.

---

## 8. Code Style

- TypeScript strict mode. No `any`. Use `unknown` and narrow.
- Components: PascalCase files (`ComponentName.tsx`).
- Supabase browser client: always created with `useRef(createClient()).current` inside components to avoid re-creating on every render.
- File uploads: always use `<label htmlFor>` + `className="sr-only"` on the `<input>` — never programmatic `.click()`.
- Auth redirects: always `window.location.href`, never `router.push()`.
- No unused imports.
- Comments explain *why*, not *what*.

---

## 9. Workflow Rules for Agents

When building a feature:

1. **Restate what you'll build** in 2–3 sentences before writing code.
2. **List files you'll create or modify** before touching them.
3. **Flag any new dependencies** before installing.
4. **Make one logical change at a time.**
5. **After the change, summarize:** what changed, what to test, what could break.

When debugging:

1. **State your hypothesis** before changing code.
2. **One fix at a time.** If the first fix doesn't work, revert before trying another.
3. **Do not refactor while fixing.**

When unsure:

- **Ask, don't assume.**
- **Re-read this handbook** before answering architectural questions.

---

## 10. Things You Must Never Do

- Never run `git push --force` or `git reset --hard` without me typing the command myself.
- Never run any Supabase command that wipes data without explicit confirmation.
- Never commit `.env.local`, secrets, or API keys.
- Never install a package without telling me first.
- Never modify the auth system without flagging it as high-risk first.
- Never rewrite working code "for clarity" unless I ask.
- Never invent libraries, APIs, or function signatures — if unsure something exists, check or ask.
- Never use `router.push()` for post-auth navigation — always `window.location.href`.
- Never call `createClient()` directly inside a component body — always `useRef(createClient()).current`.

---

## 11. Definition of Done (per feature)

A feature is "done" only when:

- [ ] Works end-to-end in the browser
- [ ] Has loading and error states
- [ ] Has empty state if applicable
- [ ] Mobile layout works
- [ ] Auth/permissions are enforced
- [ ] No TypeScript or lint errors
- [ ] Smoke test passes (sign up → confirm email → sign in → core action → sign out)
- [ ] This handbook's "Current State" table is updated

---

## 12. Next Priorities (Suggested)

1. **Move casting calls to Supabase** — create `casting_calls` table, replace `store.ts` mock reads/writes
2. **Move applications to Supabase** — create `applications` table, replace mock store
3. **Activate Google OAuth** — complete Google Cloud Console + Supabase dashboard config when ready
4. **Email notifications** — integrate Resend for casting call applications
5. **Search / filters** — full-text search on actor profiles and casting calls
