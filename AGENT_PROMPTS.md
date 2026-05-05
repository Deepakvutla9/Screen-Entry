# AI Agent Prompts — Acting Platform

> Use these as starting points. Always paste the relevant one at the beginning of a new agent session along with a reminder to read `docs/HANDBOOK.md`.

---

## PROMPT 0 — Universal Session Opener

Paste this at the start of *every* new agent session:

```
Before doing anything else:
1. Read docs/HANDBOOK.md in full.
2. Read docs/ROADMAP.md to see current status.
3. Read docs/DECISIONS.md to understand past architectural choices.
4. Confirm you understand the stack and rules by summarizing them in 5 bullets.

Then wait for my task. Do not start coding until I give you a specific task.
```

---

## PROMPT 1 — Project Bootstrap (run once, very first session)

```
We are starting a new project: a professional networking platform for the acting industry. I am non-technical and will be directing you to build it.

Your first task: bootstrap the project.

Stack to use (do not substitute):
- Next.js (App Router) with TypeScript, strict mode
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL (Supabase)
- Clerk for auth
- pnpm as package manager
- ESLint + Prettier configured
- Vitest for unit tests, Playwright for e2e (set up but don't write tests yet)

Steps:
1. Initialize the Next.js project with TypeScript, Tailwind, App Router, src directory.
2. Install and configure shadcn/ui with neutral theme.
3. Install Prisma, set up an empty schema with a placeholder User model.
4. Install Clerk and set up middleware (don't wire UI yet).
5. Create the folder structure exactly as described in docs/HANDBOOK.md section 4.
6. Create stub doc files: HANDBOOK.md (I'll paste content), ARCHITECTURE.md, DATABASE.md, DECISIONS.md, ROADMAP.md.
7. Set up .env.example with every variable we'll need, with comments.
8. Configure ESLint, Prettier, TypeScript strict.
9. Create a basic README.md with setup instructions.
10. Make a single initial git commit: "chore: initial project bootstrap".

After each major step, pause and tell me what you did and what to verify before continuing.

Do NOT yet:
- Build any UI beyond the default Next.js page
- Define the full database schema
- Configure deployment

When done, list every command I need to run to get the project running locally.
```

---

## PROMPT 2 — Define the Database Schema

```
Read docs/HANDBOOK.md section 5 and 11 first.

Task: Define the complete Prisma schema for our MVP.

We need these models with proper relationships:
- User (linked to Clerk, has role: actor/casting/admin)
- ActorProfile (one-to-one with User where role=actor)
- CastingProfile (one-to-one with User where role=casting)
- Media (headshots, reels, resumes — typed, with order)
- Credit (acting credits — project, role, year, type, director)
- Skill (master list, e.g. "Stage combat", "British RP")
- ActorSkill (join table with proficiency)
- Project (job posting by casting user)
- RoleBreakdown (specific roles within a project)
- Application (actor → role)
- Follow (user follows user)
- Notification

Conventions:
- CUID string IDs
- createdAt, updatedAt on every model
- Soft delete via deletedAt on user-facing data
- Indexed foreign keys
- Enums for role types, application status, project status, media type, etc.

Steps:
1. Show me the proposed schema BEFORE writing it to the file.
2. Explain each model in plain English.
3. Flag any decisions you're unsure about and ask me.
4. Once I approve, write to prisma/schema.prisma and create the first migration named "initial_schema".
5. Update docs/DATABASE.md with a plain-English explanation of every model and field.
6. Add an entry to docs/DECISIONS.md explaining schema choices.

Commit message: "feat(db): define initial schema for users, profiles, projects, applications"
```

---

## PROMPT 3 — Authentication Wiring

```
Read docs/HANDBOOK.md sections 6 and 11 first.

Task: Wire up Clerk authentication end-to-end.

Requirements:
- Two separate signup flows: /signup/actor and /signup/casting
- Each flow sets the user's role in Clerk publicMetadata
- A webhook syncs Clerk users to our local users table
- A middleware protects authenticated routes
- A helper function getCurrentUser() returns our DB user (not just Clerk user)
- Sign-in at /sign-in, redirects to role-appropriate dashboard
- /dashboard/actor and /dashboard/casting (placeholder pages, just confirm role)
- Logout flow

Steps:
1. Outline the implementation plan in 5–8 bullets before coding.
2. Tell me exactly which Clerk env vars I need to add to .env.local.
3. Implement piece by piece. After each piece, tell me how to manually test it.
4. Add an entry to docs/DECISIONS.md about role storage choice.
5. Update docs/ROADMAP.md.

Do NOT proceed past Clerk webhook setup without confirming I've configured the webhook in the Clerk dashboard.

Commit message: "feat(auth): integrate Clerk with role-based signup and DB sync"
```

---

## PROMPT 4 — Build a Feature (Generic Template)

Use this template for any new feature:

```
Read docs/HANDBOOK.md before coding.

Feature: [NAME]

User story: As a [actor/casting], I want to [do X] so that [outcome].

Acceptance criteria:
- [ ] [specific behavior 1]
- [ ] [specific behavior 2]
- [ ] [edge case]
- [ ] Mobile layout works
- [ ] Loading + empty + error states present
- [ ] Inputs validated with Zod
- [ ] Auth/permission checks enforced

Out of scope (do NOT build):
- [thing 1]
- [thing 2]

Steps I want you to follow:
1. Restate the feature in your own words.
2. List files you'll create or modify.
3. Flag any new dependencies and wait for approval.
4. Build it incrementally — pause after each meaningful chunk.
5. After completion, give me a manual test script (3–5 click-throughs).
6. Suggest commit message.

If anything in the handbook conflicts with this request, stop and ask.
```

---

## PROMPT 5 — Debugging Session

```
Bug report: [DESCRIBE]

Steps to reproduce:
1. [step]
2. [step]
3. [what I expect vs what happens]

Before changing any code:
1. Read the relevant code and tell me your hypothesis.
2. Add console logs / debug output if needed to confirm.
3. Tell me what you'll change and why.
4. Make the smallest possible fix.
5. Verify the bug is gone before touching anything else.
6. If your fix doesn't work, REVERT it before trying a different approach.

Do not refactor while fixing. One concern at a time.
```

---

## PROMPT 6 — Code Review (use the second AI as reviewer)

When Claude builds something, paste this into Codex (or vice versa):

```
You are reviewing code written by another AI agent. Be skeptical.

Context: [paste the handbook section relevant to this feature]
Changes made: [paste the diff or list of files]

Review for:
1. Bugs and edge cases the original agent missed
2. Security issues (auth bypasses, input validation gaps, exposed secrets)
3. Violations of our handbook conventions
4. Performance issues (N+1 queries, unnecessary re-renders)
5. Missing error/loading/empty states
6. Type safety holes (any, casts, ignored errors)
7. Things that will break on mobile

Output format:
- 🔴 Critical (must fix before merging)
- 🟡 Warning (should fix soon)
- 🟢 Suggestion (nice to have)

Do NOT make changes. Just review.
```

---

## PROMPT 7 — End-of-Session Wrap-Up

Run this before closing every session:

```
Wrap up this session:
1. Summarize what we accomplished in 3–5 bullets.
2. Update docs/ROADMAP.md with completed items moved to "Done" and any new items.
3. If we made architectural decisions, add them to docs/DECISIONS.md.
4. List anything left in a broken or half-done state — be honest.
5. Recommend the next 1–2 tasks for the next session.
6. Confirm git status is clean (everything committed) or list uncommitted changes.
```

---

## PROMPT 8 — When You're Stuck

If you've been going in circles for 30+ minutes:

```
Stop. We're stuck. Don't try another fix.

1. Summarize what we've tried and why each attempt failed.
2. State the simplest possible explanation of the bug.
3. List 3 alternative approaches we haven't tried — ranked by simplicity.
4. Recommend whether to: (a) try the simplest alternative, (b) revert all changes from this session and start fresh, or (c) escalate (I'll ask the other AI or a human).

Do not write code until I pick an approach.
```

---

## PROMPT 9 — Adding a Dependency

```
You want to add a new dependency: [package name]

Before installing, tell me:
1. What problem does it solve that we can't solve with what we have?
2. Is it actively maintained? (Check last release date.)
3. How many weekly downloads on npm?
4. What's its bundle size impact?
5. Does it conflict with anything in our stack?
6. Is there a simpler alternative?

Wait for my approval before running pnpm add.
```

---

## PROMPT 10 — Pre-Deploy Checklist

Run this before deploying to production:

```
We're about to deploy. Run this checklist:

1. All tests pass (run them).
2. No TypeScript errors (run tsc --noEmit).
3. No lint errors (run lint).
4. Build succeeds locally (run build).
5. .env.example is up to date with every variable used.
6. No secrets in committed code (grep for common patterns).
7. Database migrations are committed and ordered.
8. README setup instructions are accurate.
9. docs/ROADMAP.md reflects what's actually done.
10. Smoke test passes manually.

Output a pass/fail for each. Do not deploy if any fail.
```
