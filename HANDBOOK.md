# Project Handbook — Screen Entry

> **For AI agents:** Read this entire document before making any change. If a request conflicts with this handbook, stop and ask the user. Do not assume.

---

## 1. What We're Building

A professional casting platform for the **Telugu film industry**. Two user types share the platform:

- **Actors** — build profiles with headshots, reels, credits, skills. Browse and apply to casting calls. Network with peers.
- **Recruiters** (casting directors, agents, producers) — post casting calls, browse talent, manage applicants, shortlist actors.

Think "LinkedIn meets Backstage, but social-first and built specifically for Telugu cinema."

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
> Last updated: 2026-05-04

### What's been built

| Area | Status | Notes |
|---|---|---|
| Landing page | ✅ Done | Hero, features, featured actors, casting calls preview, blog section |
| Auth — Email/Password | ✅ Done | Signup + login via Supabase Auth |
| Auth — Google OAuth | 🟡 UI done, needs config | Button built; requires Google Cloud + Supabase dashboard setup |
| Profiles table (Supabase) | ✅ Done | Created with RLS, auto-populated via DB trigger on signup |
| Casting feed | ✅ Done | Browse active casting calls, one-click apply (mock data) |
| Actor dashboard | ✅ Done | Application history, stats (mock data) |
| Recruiter dashboard | ✅ Done | Post casting calls, view applicants, shortlist (mock data) |
| Profile settings page | ✅ Done | Form UI only — save not yet wired to Supabase |
| Casting calls in Supabase | ❌ Not started | Still using localStorage mock store |
| Applications in Supabase | ❌ Not started | Still using localStorage mock store |
| File uploads (headshots/reels) | ❌ Not started | — |
| Messaging | ❌ Not started | — |
| Deployment | ❌ Not started | — |

### Current tech stack (what's actually running)

| Layer | Current Choice | Notes |
|---|---|---|
| Framework | React 19 + Vite | Prototype — not Next.js yet |
| Styling | Tailwind CSS v4 | No shadcn/ui yet |
| Auth | Supabase Auth | Email/password live; Google OAuth button built but not activated |
| Database | Supabase (PostgreSQL) | Profiles table live; casting calls + applications still in localStorage |
| ORM/Client | @supabase/supabase-js | Direct client, no Prisma yet |
| State / mock data | localStorage (MockStore) | `src/lib/store.ts` — to be replaced by Supabase queries |
| Package manager | npm | |
| Hosting | Not deployed yet | Runs locally on port 3000 |

---

## 4. Target Architecture (Where We're Heading)

This is the production stack from the original vision. We are not there yet.

| Layer | Target Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript strict | Migration from current Vite prototype |
| Styling | Tailwind CSS + shadcn/ui | Neutral theme |
| Database | PostgreSQL via Supabase | Already set up |
| ORM | Prisma | All schema changes via migrations |
| Auth | Clerk | Replace Supabase Auth when migrating to Next.js |
| File storage | Cloudflare R2 (or Supabase Storage initially) | Headshots, resumes |
| Video | Mux | Reels — never store raw video ourselves |
| Email | Resend | Transactional only |
| Chat | Stream Chat | Do not build chat from scratch |
| Search | Postgres full-text search → Algolia later | |
| Hosting | Vercel | |
| Background jobs | Inngest | Email, video processing |

> If you think a different tool is better, **tell me and wait**. Do not swap silently.

---

## 5. Supabase Project Details

- **Project name:** Deepakvutla9's Project (org: ScreenEntry)
- **Project ID:** `plcngksoavdaimosnvzy`
- **Region:** us-east-1
- **URL:** `https://plcngksoavdaimosnvzy.supabase.co`
- **Env file:** `.env.local` (not committed to git)

### Database schema (current)

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
| video_reel | TEXT | YouTube URL, actors only |
| company_name | TEXT | Recruiters only |
| profile_photo | TEXT | URL |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

**RLS policies:**
- Anyone can read all profiles (public talent browsing)
- Users can only update/insert their own profile (`auth.uid() = id`)

**Triggers:**
- `on_auth_user_created` — auto-creates a profile row when a new auth user signs up (reads `name` and `role` from `raw_user_meta_data`)
- `profiles_updated_at` — auto-updates `updated_at` on every row change

---

## 6. Google OAuth Setup (Pending)

The UI button is built. To activate it:

1. **Google Cloud Console** → Create OAuth 2.0 Client ID (Web app)
   - Authorized redirect URI: `https://plcngksoavdaimosnvzy.supabase.co/auth/v1/callback`
2. **Supabase Dashboard** → Authentication → Providers → Google → paste Client ID + Secret

---

## 7. Architecture Principles (Current Prototype)

- **All auth goes through Supabase Auth.** Never roll custom auth.
- **Database access via `@supabase/supabase-js`** in `src/lib/supabase.ts`.
- **MockStore (`src/lib/store.ts`)** handles casting calls and applications for now — replace with Supabase queries as features are built out.
- **Validate every input** with at minimum HTML required attributes; use Zod when migrating to Next.js.
- **No `any` in TypeScript.** Use `unknown` and narrow.

---

## 8. UI/UX Principles

- **Mobile-first.** Build mobile layout first, then desktop.
- **Visual: clean editorial.** Neutral palette (slate/stone), emerald accent, generous whitespace, strong typography.
- **Primary brand colors:** `#1a3a5f` (navy) + `emerald-600` (green)
- **Headshots and reels lead.** Visual content is the product — never bury it.
- **Two distinct experiences.** Actor and recruiter users see different dashboards, navigation, and CTAs.
- **Loading states everywhere.** No bare spinners — use skeleton screens.
- **Empty states are designed**, not blank pages.
- **Accessible** — WCAG AA, keyboard navigation, alt text, semantic HTML.

---

## 9. Code Style

- TypeScript strict mode on. No suppressions without comments explaining why.
- Components: PascalCase. Component files: `ComponentName.tsx`.
- Hooks: `useThing.ts`, camelCase.
- Comments explain *why*, not *what*.
- Functions stay short — if over ~50 lines, suggest splitting.
- No unused imports.

---

## 10. Workflow Rules for Agents

When I ask you to build a feature:

1. **Restate what you'll build** in 2–3 sentences before writing code.
2. **List files you'll create or modify** before touching them.
3. **Flag any new dependencies** before installing.
4. **Make one logical change at a time.** Don't bundle unrelated edits.
5. **After the change, summarize:** what changed, what to test, what could break.
6. **Suggest the git commit message** in conventional-commit format.

When debugging:

1. **Reproduce the issue first.** Don't guess.
2. **State your hypothesis** before changing code.
3. **One fix at a time.** If the first fix doesn't work, revert before trying another.

When unsure:

- **Ask, don't assume.**
- **Re-read this handbook** before answering architectural questions.

---

## 11. Things You Must Never Do

- Never run `git push --force` or `git reset --hard` without me typing the command myself.
- Never run any Supabase command that wipes data without explicit confirmation.
- Never commit `.env.local`, secrets, or API keys.
- Never install a package without telling me first.
- Never modify the auth system without flagging it as high-risk first.
- Never rewrite working code "for clarity" unless I ask.
- Never invent libraries, APIs, or function signatures — if unsure something exists, check or ask.

---

## 12. Definition of Done (per feature)

A feature is "done" only when:

- [ ] Works end-to-end in the browser
- [ ] Has loading and error states
- [ ] Has empty state if applicable
- [ ] Mobile layout works
- [ ] Auth/permissions are enforced
- [ ] No TypeScript or lint errors
- [ ] Smoke test still passes (sign up, sign in, core action, sign out)
- [ ] This handbook's "Current State" table is updated

---

## 13. Next Priorities (Suggested)

1. **Activate Google OAuth** — complete the Google Cloud + Supabase dashboard config
2. **Wire profile save** — connect the Profile Settings form to `UPDATE profiles` in Supabase
3. **Move casting calls to Supabase** — create `casting_calls` table, replace mock store reads/writes
4. **Move applications to Supabase** — create `applications` table, replace mock store
5. **Profile photo upload** — connect to Supabase Storage
