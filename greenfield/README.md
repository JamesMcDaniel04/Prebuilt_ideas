# Greenfield

A curated catalogue of unbuilt startup opportunities — each with a Markdown build brief that drops into Claude Code, Cursor, or Codex.

**Stack:** Vite + React 19 + TypeScript + Tailwind v3 + Radix UI + TanStack Query + React Router + Supabase (auth, postgres, RLS, edge functions) + Anthropic API.

---

## One-time setup

### 1. Install

```bash
npm install
cp .env.example .env
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. From **Settings → API**, copy into `.env`:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key (reveal first — keep secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Run the schema migrations

Supabase dashboard → **SQL editor** → paste and run, in order:

1. [`supabase/migrations/0001_initial.sql`](supabase/migrations/0001_initial.sql) — tables, RLS, auth trigger
2. [`supabase/migrations/0002_admin_and_briefs.sql`](supabase/migrations/0002_admin_and_briefs.sql) — admin role + write policies

### 4. Enable Google OAuth (optional)

Supabase dashboard → **Authentication → Providers → Google** → toggle on, paste your OAuth client ID/secret. Add redirect URL `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.

### 5. Deploy the edge function (for on-demand brief generation)

Install the Supabase CLI (`brew install supabase/tap/supabase`), then from this directory:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy generate-brief
```

This powers two things:

- The "Generate brief" button on the admin list (for new opportunities you create manually).
- The Pro detail page fallback when a brief isn't cached yet.

Generated briefs are stored in `build_briefs` so the next request is free.

### 6. Generate seed content

Add `ANTHROPIC_API_KEY=sk-ant-...` to `.env`, then:

```bash
npm run seed
```

~50 opportunities across 15 industries, each with a build brief, inserted via the service-role key. Expect ~3–5 minutes and ~$5–8 of Anthropic spend. Uses prompt caching across batches.

---

## Day-to-day

```bash
npm run dev        # localhost:5173
npm run build      # typecheck + production bundle
npm run typecheck  # just tsc
npm run seed       # regenerate opportunities
npm run test       # Playwright smoke tests
npm run test:ui    # Playwright interactive UI
```

---

## Promoting users

### To Pro (manual, pre-Stripe)

```sql
update profiles
set is_pro = true, pro_since = now()
where user_id = (select id from auth.users where email = 'you@example.com');
```

### To Admin (gates `/admin` + write access)

```sql
update profiles
set is_admin = true
where user_id = (select id from auth.users where email = 'you@example.com');
```

Once admin, you'll see the "Admin" link in the header. From there you can create / edit / delete opportunities and generate briefs for any that don't have one cached.

---

## Project map

```text
src/
  components/
    ui/                   shadcn-style primitives (Button, Dialog, Checkbox, Textarea, SelectNative, …)
    layout/               Header, Footer, Layout
    opportunities/        OpportunityCard, FilterSidebar, SaveButton, BuildBriefPanel
    admin/                OpportunityForm (shared by create + edit)
  pages/
    BrowsePage, OpportunityDetailPage, SavedPage, AuthPage, PricingPage, NotFoundPage
    admin/AdminListPage, admin/AdminEditPage
  lib/
    supabase.ts           Supabase client (anon key, browser)
    auth.tsx              AuthProvider + useAuth hook
    admin.ts              useRequireAdmin hook + slugify()
    types.ts              Opportunity, Profile, Filters
    vocab.ts              Controlled vocabularies (mirrors scripts/seed.ts)
    utils.ts              cn(), formatRelative()
supabase/
  migrations/
    0001_initial.sql          base schema + RLS
    0002_admin_and_briefs.sql admin role + admin/Pro RLS
  functions/
    generate-brief/index.ts   Deno edge function: on-demand brief generation
scripts/
  seed.ts                 Claude API → opportunities + build briefs → Supabase
tests/
  smoke.spec.ts           Shell-rendering smoke tests (run without real Supabase)
  screenshots.spec.ts     Generates ./screenshots/ for documentation
```

---

## Testing

The Playwright smoke suite runs without real Supabase — the config injects placeholder env vars and asserts that every route mounts and renders its chrome. It does NOT exercise data flows.

```bash
npm test                                # all tests
npx playwright test tests/screenshots.spec.ts  # regenerate screenshots
```

For a real E2E run, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment before invoking — the config passes them through.

---

## What's next (post-MVP)

- **Stripe checkout** for the Pro upgrade (currently a placeholder toast on `/pricing`). Plumbing already in place: `profiles.stripe_customer_id`, `is_pro`, `pro_since`.
- **Image generation** for opportunity covers (Supabase Storage bucket already implied by `cover_image_url`).
- **Email digest** of new opportunities.
- **Public "I'm building this"** signals.
- **Bulk admin import** from CSV.
