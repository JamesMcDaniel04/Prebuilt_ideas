# Greenfield

A curated catalogue of unbuilt startup opportunities — each with a Markdown build brief that drops into Claude Code, Cursor, or Codex.

**Stack:** Vite + React 19 + TypeScript + Tailwind v3 + Radix UI + TanStack Query + React Router + Supabase (auth, postgres, RLS).

---

## One-time setup

### 1. Install

```bash
npm install
cp .env.example .env
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once provisioned, grab from **Settings → API**:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key (under "Reveal" — keep secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. Paste into `.env`.

### 3. Run the schema migration

In the Supabase dashboard → **SQL editor** → paste the contents of [`supabase/migrations/0001_initial.sql`](supabase/migrations/0001_initial.sql) and run.

### 4. Enable Google OAuth (optional but used in the auth page)

Supabase dashboard → **Authentication → Providers → Google** → toggle on, fill in client ID/secret from a Google Cloud OAuth consent screen. Add redirect URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.

### 5. Generate seed content

Add an Anthropic API key to `.env` (`ANTHROPIC_API_KEY=sk-ant-...`), then:

```bash
npm run seed
```

This produces ~50 opportunities across 15 industries plus a Markdown build brief for each, and inserts everything via the service-role key. Expect ~3–5 minutes and ~$5–8 of Anthropic spend.

---

## Day-to-day

```bash
npm run dev        # localhost:5173
npm run build      # typecheck + production bundle
npm run typecheck  # just tsc
npm run seed       # regenerate opportunities (idempotent-ish; will insert dupes)
```

---

## Flipping a user to Pro (manual, pre-Stripe)

For now, upgrade users by hand in the Supabase SQL editor:

```sql
update profiles
set is_pro = true, pro_since = now()
where user_id = (select id from auth.users where email = 'you@example.com');
```

The Pro flag controls visibility of `build_briefs` (RLS-enforced) and unlocks the brief panel UI.

---

## Project map

```text
src/
  components/
    ui/                   shadcn-style primitives (Button, Dialog, Checkbox, …)
    layout/               Header, Footer, Layout
    opportunities/        OpportunityCard, FilterSidebar, SaveButton, BuildBriefPanel
  pages/                  BrowsePage, OpportunityDetailPage, SavedPage, AuthPage, PricingPage, NotFoundPage
  lib/
    supabase.ts           Supabase client (anon key, browser)
    auth.tsx              AuthProvider + useAuth hook
    types.ts              Opportunity, Profile, Filters
    vocab.ts              Controlled vocabularies (mirrors scripts/seed.ts)
    utils.ts              cn(), formatRelative()
supabase/
  migrations/0001_initial.sql
scripts/
  seed.ts                 Claude API → opportunities + build briefs → Supabase
```

---

## What's next (post-MVP)

- **Stripe checkout** for the Pro upgrade (currently a placeholder toast on `/pricing`).
- **On-demand brief regeneration** for Pro users (edge function calling Anthropic).
- **Admin UI** for adding/editing opportunities without re-seeding.
- **Email digest** of new opportunities.
- **Public opportunity comments / "I'm building this"** signals.
