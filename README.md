# Screen Entry

A professional casting platform for the **Telugu film industry** — connecting actors with production houses, casting directors, and recruiters.

> Think "LinkedIn meets Backstage, but social-first and built specifically for Telugu cinema."

## Features

- **Two role-based experiences** — separate flows for actors and recruiters
- **Email/password & Google** sign-in via Supabase Auth
- **Casting feed** — browse open roles, search, one-click apply
- **Actor dashboard** — track applications, see shortlisted roles
- **Recruiter dashboard** — post casting calls, manage applicants, shortlist talent
- **Profile pages** — name, location, age, skills, languages, video reels

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) |
| Auth | [Supabase Auth](https://supabase.com/auth) (email/password + Google OAuth) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Client | `@supabase/supabase-js` + `@supabase/ssr` for cookie-based sessions |
| Hosting | Vercel (auto-deploy from `main`) |

## Run Locally

**Prerequisites:** Node.js 20+, a Supabase project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
   Get these from your Supabase dashboard → **Settings → API**.

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    Next.js App Router pages
│   ├── page.tsx              landing
│   ├── login, signup/        auth pages
│   ├── dashboard/            role-based dashboard
│   ├── feed/                 casting feed
│   ├── profile/              profile settings
│   └── applicants/[id]/      recruiter applicant view
├── components/
│   ├── ui/                   shadcn/ui primitives
│   └── *.tsx                 feature components
├── lib/
│   ├── supabase/             browser + server clients
│   ├── auth.ts               requireProfile() helper
│   ├── data.ts               server-safe seed data
│   └── store.ts              localStorage helpers (transitional)
├── types.ts
└── middleware.ts             refreshes Supabase session per request
```

## Database

The Supabase database has a single `profiles` table linked to `auth.users`. New auth users get a profile row automatically via a database trigger that reads `name` and `role` from the signup metadata.

See [`HANDBOOK.md`](./HANDBOOK.md) for the full schema, RLS policies, and architecture conventions.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Lint with Next.js ESLint config |

## Documentation

- [`HANDBOOK.md`](./HANDBOOK.md) — Tech stack, architecture, conventions, current state
- [`AGENT_PROMPTS.md`](./AGENT_PROMPTS.md) — Reusable prompts for AI-driven development
