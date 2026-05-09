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
> Last updated: 2026-05-09

### What's been built

| Area | Status | Notes |
|---|---|---|
| Landing page | ✅ Done | Cinematic gold/red theme — hero, stats bar, steps, featured talent, casting calls, blog, CTA |
| Auth — Email/Password | ✅ Done | Browser-side `signInWithPassword`; server-side logout via `/api/auth/signout` |
| Auth — Google OAuth | ❌ Removed | Removed — requires Google Cloud Console credit card setup which isn't ready |
| Profiles table (Supabase) | ✅ Done | Recreated 2026-05-09 to match code schema; RLS enabled; trigger auto-creates on signup |
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
| Admin panel | ❌ Not started | Planned — see Section 13 |
| Photo moderation | ❌ Not started | Planned — see Section 13 |
| User lifecycle management | ❌ Not started | Planned — see Section 13 |
| Legal pages | ❌ Not started | Privacy Policy, Terms, Grievance Officer — see Section 14 |
| Subscriptions | ❌ Not started | Razorpay integration planned — see Section 15 |
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

1. **⚠️ Admin account setup (PENDING — blocked)** — see note below
2. **Photo moderation wiring** — uploads go to moderation queue, not directly to profile
3. **Legal pages** — Privacy Policy, Terms, Grievance Officer — see Section 14
4. **User lifecycle + subscriptions** — see Section 15
5. **Move casting calls to Supabase** — create `casting_calls` table, replace `store.ts` mock reads/writes
6. **Move applications to Supabase** — create `applications` table, replace mock store
7. **Email notifications** — integrate Resend for casting call applications
8. **Search / filters** — full-text search on actor profiles and casting calls

### ⚠️ Pending: Admin Account Setup
- Admin panel is built and deployed at `https://www.screenentry.com/admin-saheb90-se26`
- Currently `ADMIN_EMAILS` is set to `aamohammad0786@gmail.com` (shah saaheb's user profile)
- **Blocked:** password for this account is not known
- **To fix when ready:**
  1. Either recover the password for `aamohammad0786@gmail.com` via forgot-password flow
  2. Or create a brand new dedicated admin account (e.g. `screenentry.admin@gmail.com`), then update `ADMIN_EMAILS` in Vercel env vars and `.env.local`
- Admin key is `ScreenEntryAdmin1` (stored in Vercel env var `ADMIN_SECRET_KEY`)

---

## 13. Admin Panel

### Access Model (Three-Layer Security)
- **Layer 1 — Secret URL:** Admin panel lives at `/admin-[secret-string]`. This path is never linked anywhere in the UI. If you don't know the URL, you can't even find the page.
- **Layer 2 — Email whitelist:** Even if someone reaches the URL, only `deepakvutla9@gmail.com` (and any other whitelisted emails) can access it. Anyone else sees a 404.
- **Layer 3 — Admin key:** A standard secret key stored in `.env.local` as `ADMIN_SECRET_KEY`. Must be entered on first access per session. Long random string — never stored in the database.

The secret URL path is stored in `.env.local` as `ADMIN_URL_SLUG`. Never hardcode it in source.

### Admin Dashboard Features

#### Analytics
- Total users (actors vs recruiters)
- New signups this week / this month
- Photos pending moderation
- Total casting calls posted
- Suspended / pending deletion accounts count

#### Photo Moderation
- When a user uploads a photo it goes into **pending** state — not visible on public profiles
- Admin sees a queue of all pending photos with the uploader's name
- Admin can **Approve** (makes photo public) or **Reject** (deletes from storage + DB)
- Every approve/reject is logged with timestamp and admin email (audit log — IT Rules 2021 compliance)
- Target: review within 36 hours (IT Rules 2021 requirement)

#### User Management
- View all users with their status, role, signup date, subscription status
- **Suspend** — hides profile from public, user cannot log in, reversible
- **Reinstate** — restores a suspended account
- **Hard Delete** — permanently deletes profile + storage files, requires double confirmation, one at a time only
- Suspended accounts auto-delete after 90 days (background job via Inngest)

### Database changes required
```sql
-- Add status to profiles
ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'suspended', 'pending_deletion'));
ALTER TABLE profiles ADD COLUMN suspended_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN delete_after TIMESTAMPTZ; -- suspended_at + 90 days

-- Photo moderation table
CREATE TABLE photo_moderation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT, -- admin email
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin audit log
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'approve_photo', 'reject_photo', 'suspend_user', 'reinstate_user', 'delete_user'
  target_id UUID, -- profile_id or photo_moderation_id
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### New files to create
```
src/
├── app/
│   └── [admin-slug]/
│       ├── page.tsx           admin login (key entry)
│       ├── dashboard/page.tsx analytics overview
│       ├── photos/page.tsx    photo moderation queue
│       └── users/page.tsx     user management
├── components/
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── PhotoModerationQueue.tsx
│       └── UserManagementTable.tsx
└── lib/
    └── admin.ts               requireAdmin() guard
```

---

## 14. Indian Legal Compliance

Platform primarily serves Indian users. Compliance with **IT Act 2000** and **IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021** is mandatory before accepting payments.

### Required pages

| Page | URL | Deadline |
|---|---|---|
| Privacy Policy | `/privacy` | Before paid signups |
| Terms of Service | `/terms` | Before paid signups |
| Grievance Officer | `/grievance` | Immediately (IT Rules 2021) |
| Contact Us | `/contact` | Immediately |

### Grievance Officer (IT Rules 2021 — Mandatory)
- Must be an Indian resident
- Name and contact details publicly visible
- Must acknowledge complaints within **24 hours**
- Must resolve within **15 days**
- For now: founder's name + email on `/grievance` page

### Content Removal (IT Rules 2021)
- Objectionable content must be removed within **36 hours** of being flagged
- Photo moderation system (Section 13) fulfills this requirement
- Keep audit logs of all removals

### Data Deletion (IT Rules 2021)
- User data must be deleted within **72 hours** of a formal deletion request
- Add "Delete My Account" option in profile settings
- Deletion removes: profile row, storage files, auth user

### Privacy Policy must state
- What data is collected (name, email, photos, location)
- How it is used (casting platform — connecting actors and recruiters)
- Data retention period (active accounts indefinitely; suspended accounts 90 days then deleted)
- User rights (access, correction, deletion)
- Grievance Officer contact details

---

## 15. Subscriptions & User Lifecycle

### Profile Lifecycle States

| State | Meaning | Visible to public? | Can log in? |
|---|---|---|---|
| `active` | Paid or in free trial | Yes | Yes |
| `suspended` | Payment lapsed or admin action | No | No |
| `pending_deletion` | Suspended 90+ days | No | No |
| Deleted | Hard deleted | — | — |

### Flow
1. User signs up → **active** (free trial, duration TBD)
2. Trial ends → email warning sent (Resend) → **suspended** if no payment
3. 90 days suspended → auto **hard delete** (Inngest background job cleans storage + DB + auth)
4. Admin can manually move any user between states at any time

### User-initiated deletion
- "Delete My Account" button in profile settings
- Triggers immediate hard delete (profile + storage + auth user)
- Must complete within 72 hours (IT Rules 2021)
- Confirmation email sent to user

### Payment (when ready)
- Use **Razorpay** (RBI approved)
- Never store card data — handled entirely by Razorpay
- Issue proper GST invoices
- Subscription plans TBD (monthly/yearly for actors; per-posting or subscription for recruiters)

### Email notifications (Resend)
- Trial ending warning (7 days before)
- Account suspended notice
- Deletion warning (30 days before auto-delete)
- Payment confirmation
- Grievance acknowledgement (within 24 hours)
