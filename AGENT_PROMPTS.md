# AI Agent Prompts — Screen Entry

> Paste the relevant prompt at the start of a new agent session. Always include a reminder to read `HANDBOOK.md` first.

---

## PROMPT 0 — Universal Session Opener

Paste this at the start of **every** new agent session:

```
Before doing anything else:
1. Read HANDBOOK.md in full.
2. Confirm you understand the stack and rules by summarizing them in 5 bullets.
Then wait for my task. Do not start coding until I give you a specific task.
```

---

## PROMPT 1 — Build a Feature

```
Read HANDBOOK.md before coding.

Feature: [NAME]

User story: As a [actor/recruiter], I want to [do X] so that [outcome].

Acceptance criteria:
- [ ] [specific behavior 1]
- [ ] [specific behavior 2]
- [ ] [edge case]
- [ ] Mobile layout works
- [ ] Loading + empty + error states present
- [ ] Auth/permission checks enforced

Out of scope (do NOT build):
- [thing 1]

Steps:
1. Restate the feature in your own words.
2. List files you'll create or modify.
3. Flag any new dependencies and wait for approval.
4. Build incrementally — pause after each meaningful chunk.
5. After completion, give me a manual test script (3–5 click-throughs).
6. Suggest commit message.

If anything in the handbook conflicts with this request, stop and ask.
```

---

## PROMPT 2 — Debugging Session

```
Bug report: [DESCRIBE THE BUG]

Steps to reproduce:
1. [step]
2. [step]
3. Expected: [X] — Actual: [Y]

Before changing any code:
1. Read the relevant code and tell me your hypothesis.
2. Tell me what you'll change and why.
3. Make the smallest possible fix.
4. Verify the bug is gone before touching anything else.
5. If your first fix doesn't work, REVERT it before trying a different approach.

Do not refactor while fixing. One concern at a time.
```

---

## PROMPT 3 — Adding a Dependency

```
You want to add: [package name]

Before installing, tell me:
1. What problem does it solve that we can't solve with what we have?
2. Is it actively maintained? (Check last release date.)
3. Does it conflict with anything in our stack?
4. Is there a simpler alternative?

Wait for my approval before running npm install.
```

---

## PROMPT 4 — Code Review

Paste this into a second AI instance to get an independent review:

```
You are reviewing code written by another AI agent. Be skeptical.

Context: [paste the relevant HANDBOOK.md section]
Changes made: [paste the diff or list of files]

Review for:
1. Bugs and edge cases the original agent missed
2. Security issues (auth bypasses, input validation gaps, exposed secrets)
3. Violations of handbook conventions (especially: window.location.href not router.push, useRef for supabase client, label pattern for file inputs)
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

## PROMPT 5 — Pre-Deploy Checklist

```
We're about to deploy. Run this checklist:

1. No TypeScript errors (run: npx tsc --noEmit)
2. No lint errors (run: npm run lint)
3. Build succeeds locally (run: npm run build)
4. .env.example is up to date with every variable used
5. No secrets in committed code
6. HANDBOOK.md "Current State" table is accurate
7. Smoke test passes manually: sign up → confirm email → sign in → update profile → sign out

Output pass/fail for each. Do not deploy if any fail.
```

---

## PROMPT 6 — When Stuck

If going in circles for 30+ minutes:

```
Stop. We're stuck. Don't try another fix.

1. Summarize what we've tried and why each attempt failed.
2. State the simplest possible explanation of the bug.
3. List 3 alternative approaches we haven't tried — ranked by simplicity.
4. Recommend whether to: (a) try the simplest alternative, (b) revert all changes from this session and start fresh, or (c) ask a human.

Do not write code until I pick an approach.
```

---

## PROMPT 7 — End-of-Session Wrap-Up

Run this before closing every session:

```
Wrap up this session:
1. Summarize what we accomplished in 3–5 bullets.
2. List anything left in a broken or half-done state — be honest.
3. Update HANDBOOK.md section 3 "Current State" to reflect what's done.
4. Recommend the next 1–2 tasks for the next session.
5. Confirm git status is clean (everything committed) or list uncommitted changes.
```

---

## Key Conventions (Quick Reference)

These trip up agents most often — check these first when reviewing any auth or UI change:

| Convention | Rule |
|---|---|
| Auth redirects | Always `window.location.href`, never `router.push()` |
| Supabase client in components | Always `useRef(createClient()).current`, never `createClient()` directly in component body |
| File input triggering | Always `<label htmlFor="...">` + `className="sr-only"` on `<input>`, never `.click()` |
| Login flow | POST to `/api/auth/login` (server-side), not client `signInWithPassword` |
| Logout flow | POST to `/api/auth/signout` (server-side), then `window.location.href = '/'` |
| Logo | Always use `<Logo>` component — never inline SVG or plain text |
| Brand colors | Red: `#8B1A1A`, hover: `#5C0808`, amber: `amber-500`, dark bg: `#0D0000` |
