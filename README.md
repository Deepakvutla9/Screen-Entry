# Screen Entry

A professional casting platform for the **Telugu film industry** — connecting actors with production houses, casting directors, and recruiters.

> "LinkedIn meets Backstage, built specifically for Telugu cinema."

## Features

- **Two role-based experiences** — separate flows for actors and recruiters
- **Email/password sign-in** via Supabase Auth (server-side, cookie-based)
- **Cinematic landing page** — hero, stats, steps, featured talent, casting calls, blog sections
- **Casting feed** — browse open roles, search, one-click apply
- **Actor dashboard** — profile stats, application history, media lightbox
- **Recruiter dashboard** — post casting calls, manage applicants, shortlist talent
- **Profile settings** — name, location, age, skills, languages, video reel, photo gallery (up to 5), avatar upload
- **Public actor profiles** — read-only Backstage-style page at `/actors/[id]`
- **Browse Talent** — recruiter-facing actor cards, each linking to the public profile
- **Server-side auth** — login and logout go through API routes so session cookies are set/cleared reliably on all connections and devices

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york style) |
| Auth | Supabase Auth — email/password only (server-side login/logout API routes) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Storage | Supabase Storage (`Screen Entry` bucket — avatars + portfolio photos) |
| Client | `@supabase/supabase-js` + `@supabase/ssr` for cookie-based sessions |
| Hosting | Vercel (auto-deploy from `main`) |

## Run Locally

**Prerequisites:** Node.js 20+, a Supabase project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
   Get these from Supabase dashboard → **Settings → API**.

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                root layout (Navbar + footer)
│   ├── page.tsx                  landing page (Server Component)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx        role-based dashboard (protected)
│   ├── feed/page.tsx             casting feed
│   ├── profile/page.tsx          profile settings (protected)
│   ├── browse/page.tsx           browse actors (protected)
│   ├── actors/[id]/page.tsx      public actor profile
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── auth/callback/route.ts    Supabase auth callback (email confirm, reset)
│   └── api/auth/
│       ├── login/route.ts        server-side sign in → sets session cookie
│       └── signout/route.ts      server-side sign out → clears session cookie
├── components/
│   ├── ui/                       shadcn/ui primitives
│   ├── Logo.tsx                  reusable SVG logo (light/dark variants)
│   ├── Navbar.tsx                client — auth-aware, sign out button
│   ├── AuthForm.tsx              login + signup form
│   ├── DashboardClient.tsx       actor/recruiter dashboard
│   ├── ProfileClient.tsx         profile settings form + photo uploads
│   ├── PublicActorProfile.tsx    read-only actor profile with lightbox
│   ├── BrowseClient.tsx          actor card grid linking to public profiles
│   └── CastingFeedClient.tsx     casting call feed
├── lib/
│   ├── supabase/
│   │   ├── client.ts             browser client (Profile type exported here)
│   │   └── server.ts             server client (RSCs + route handlers)
│   ├── auth.ts                   requireProfile() — protects server pages
│   ├── data.ts                   server-safe seed/mock data
│   ├── store.ts                  localStorage helpers (casting calls mock — to be replaced)
│   └── utils.ts                  cn() helper
└── middleware.ts                 refreshes Supabase session on every request
```

## Database

Single `profiles` table linked to `auth.users`. A database trigger auto-creates a profile row on signup, reading `name` and `role` from signup metadata.

See [`HANDBOOK.md`](./HANDBOOK.md) for the full schema, RLS policies, and architecture decisions.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Lint with Next.js ESLint config |

## Documentation

- [`HANDBOOK.md`](./HANDBOOK.md) — Architecture, conventions, schema, current state
- [`AGENT_PROMPTS.md`](./AGENT_PROMPTS.md) — Reusable prompts for AI-assisted development
