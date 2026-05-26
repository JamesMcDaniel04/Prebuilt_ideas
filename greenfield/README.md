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
3. [`supabase/migrations/0003_yc_rfs_tag.sql`](supabase/migrations/0003_yc_rfs_tag.sql) — YC RFS tag column on opportunities
4. [`supabase/migrations/0004_opportunity_signals.sql`](supabase/migrations/0004_opportunity_signals.sql) — research signals table (n8n ingestion target)
5. [`supabase/migrations/0005_teams_and_plans.sql`](supabase/migrations/0005_teams_and_plans.sql) — plan tiers + teams + personal-team auto-create trigger
6. [`supabase/migrations/0006_idea_claims.sql`](supabase/migrations/0006_idea_claims.sql) — exclusive idea claims + `visible_opportunities` view
7. [`supabase/migrations/0007_agent_runs.sql`](supabase/migrations/0007_agent_runs.sql) — agent run history (target of `run-agent` edge function)
8. [`supabase/migrations/0008_workflow_runs.sql`](supabase/migrations/0008_workflow_runs.sql) — multi-step workflow run + step tables (orchestrator persistence)
9. [`supabase/migrations/0009_team_invitations.sql`](supabase/migrations/0009_team_invitations.sql) — team invitation table + `accept_team_invitation` RPC
10. [`supabase/migrations/0010_stripe_billing.sql`](supabase/migrations/0010_stripe_billing.sql) — Stripe subscription columns on `teams`, idempotent webhook log, `apply_stripe_subscription()` RPC

### 4. Enable Google OAuth (optional)

Supabase dashboard → **Authentication → Providers → Google** → toggle on, paste your OAuth client ID/secret. Add redirect URL `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.

### 5. Deploy the edge functions

Install the Supabase CLI (`brew install supabase/tap/supabase`), then from this directory:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF

# Required for all agent + brief features
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# Required for the n8n ingestion endpoint
supabase secrets set INGEST_SIGNAL_TOKEN=$(openssl rand -hex 32)
# Optional — enables the web_search tool used by every agent
supabase secrets set BRAVE_API_KEY=...     # or SERPAPI_API_KEY

# Optional — role-specific tools (each falls back to web_search if missing)
supabase secrets set APOLLO_API_KEY=...       # Sales: find_companies (B2B prospect search)
supabase secrets set DATAFORSEO_LOGIN=...     # Marketing: keyword_volume
supabase secrets set DATAFORSEO_PASSWORD=...  # Marketing: keyword_volume
supabase secrets set GITHUB_TOKEN=ghp_...     # Engineering: search_github (lifts rate limit)

# Required for Stripe checkout + billing portal
supabase secrets set STRIPE_SECRET_KEY=sk_live_...        # or sk_test_... while testing
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...      # from the webhook endpoint you create in Stripe
supabase secrets set STRIPE_PRICE_ENTREPRENEUR=price_...  # annual $197 price
supabase secrets set STRIPE_PRICE_VENTURE_STUDIO=price_... # annual $12,000 price (used if you flip VS to self-serve)
supabase secrets set APP_URL=https://greenfield.app       # success/cancel/return redirects

# Deploy each function
supabase functions deploy generate-brief
supabase functions deploy ingest-signal --no-verify-jwt
supabase functions deploy claim-idea
supabase functions deploy release-claim
supabase functions deploy run-agent
supabase functions deploy invite-team-member
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook --no-verify-jwt   # Stripe signs the payload itself
```

Functions overview:

| Function | What it does | Used by |
| --- | --- | --- |
| `generate-brief`  | Pro-or-admin gated; calls Claude → caches a Markdown build brief per opportunity | "Generate brief" button (admin + Pro detail page) |
| `ingest-signal`   | Token-authed; appends a research signal row | n8n workflows (see `n8n-workflows/`) |
| `claim-idea`      | JWT-authed; atomically claims an opportunity (quota + exclusivity enforced) | `ClaimIdeaButton` |
| `release-claim`   | JWT-authed; releases an active claim | `ClaimIdeaButton` |
| `run-agent`       | JWT-authed; runs an Anthropic tool-use loop for a claim's GTM / Sales / Marketing / Engineering agent. Each role gets shared tools (read brief / signals, web search, fetch URL, save note) plus one role-specific tool (`find_competitors`, `find_companies`, `keyword_volume`, `search_github`). | `AgentRunDialog` on `/agents`, workflow orchestrator on `/workflows/:slug` |
| `invite-team-member` | Owner-only; checks seat limit, upserts `team_invitations`, sends a Supabase auth invite email | `TeamPage` on `/team` (Venture Studio plans) |
| `create-checkout-session` | JWT-authed; resolves the caller's owned team and creates a Stripe Checkout Session for the requested plan | `PricingPage` upgrade CTAs |
| `create-portal-session`   | JWT-authed; opens the Stripe Billing Portal for the caller's team customer | "Manage billing" buttons on `/pricing` and `/team` |
| `stripe-webhook`          | Signature-verified; handles `checkout.session.completed` + `customer.subscription.*` and flips `teams.plan` / `profiles.plan` via `apply_stripe_subscription()`. Idempotent on `event.id`. | Stripe → your project |

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

## Pricing tiers (in-product)

| Tier | Price | Claims | Seats | Agent runs |
| --- | --- | --- | --- | --- |
| **Scout**           | $97/year     | — | 1 | — |
| **Entrepreneur**    | $197/year    | 1 active at a time (year-long; release to claim again) | 1 | unlimited on the claimed idea |
| **Venture Studio**  | $12,000/year | 10/week shared across the team | up to 5 | unlimited on every team claim |
| **University & Accelerator** | Custom | 50/week (default) | 25 (default) | unlimited |

`src/lib/pricing.ts` is the single source of truth — the SQL `plan_defaults()` helper mirrors the same numbers so DB enforcement and marketing copy stay in sync.

---

## Promoting users

### To Entrepreneur or Venture Studio (manual, pre-Stripe)

```sql
-- Set the user's plan + sync their personal team's quota
update profiles
set plan = 'entrepreneur', is_pro = true, pro_since = now()
where user_id = (select id from auth.users where email = 'you@example.com');

select sync_team_plan_defaults(personal_team_id)
from profiles
where user_id = (select id from auth.users where email = 'you@example.com');
```

For Venture Studio, set `plan = 'venture_studio'` instead. Once the owner is upgraded
they can invite teammates from `/team` (uses the `invite-team-member` edge function).
Invitees receive a Supabase auth email; on first sign-in they're added to the team and
immediately see every shared claim, workflow run, and agent run.

For backfilling members directly in SQL (skipping the email flow):

```sql
insert into team_members (team_id, user_id, role)
select
  (select personal_team_id from profiles where user_id = (select id from auth.users where email = 'studio-owner@example.com')),
  id,
  'member'
from auth.users
where email in ('teammate1@example.com', 'teammate2@example.com');
```

### To Pro (legacy flag — kept for build-brief gating)

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

## Stripe setup

1. Create three annual recurring **Products** in the Stripe dashboard: Scout $97/yr, Entrepreneur $197/yr, Venture Studio $12,000/yr. Copy each `price_...` id into `supabase secrets set` (see above).
2. In **Developers → Webhooks**, add an endpoint pointing at `https://YOUR-PROJECT.functions.supabase.co/stripe-webhook`. Subscribe to: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET`.
3. In **Settings → Billing → Customer portal**, enable the portal and choose what customers can do (recommend: update payment method, view invoices, cancel — cancellation flips `teams.plan` back to `scout` via the webhook).
4. The frontend exposes upgrade on `/pricing` (Entrepreneur self-serve; Venture Studio is contact-sales by default — flip `contactOnly` off in [src/lib/pricing.ts](src/lib/pricing.ts) to allow self-serve VS too) and "Manage billing" on `/pricing` + `/team`.
5. Test mode flow:

   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook   # local
   stripe trigger checkout.session.completed                                 # smoke
   ```

   Or just complete a real test-mode checkout from `/pricing` and watch the `stripe_webhook_events` table fill.

---

## n8n research pipeline

Workflows under [`n8n-workflows/`](n8n-workflows/) ingest demand signals via the
`ingest-signal` edge function. Authenticate with the `INGEST_SIGNAL_TOKEN` you set
above as a bearer header; each workflow stores URL + title + publish date + a short
factual snippet (no full body content).

| File | Schedule | Purpose |
| --- | --- | --- |
| `01-techcrunch-funding.json` | Daily 9am UTC | Pulls fresh funding rounds from TechCrunch RSS |
| `02-reddit-pain.json`        | Every 6 hours | Surfaces high-engagement pain posts from target subreddits |
| `03-x-startup-signals.json`  | Every 4 hours | Captures X (Twitter) posts mentioning configured keywords |
| `04-hackernews-launch.json`  | Hourly | Catches HN Show/Launch threads + engagement metrics |
| `05-weekly-deep-research.json` | Weekly | Claude-powered topic sweep for every active industry |
| `06-weekly-claim-research.json` | Monday 2pm UTC | For every **active claim**, asks Claude for 3–5 fresh demand signals scoped to that opportunity → posts to `ingest-signal` so the claim's detail page keeps refreshing |

Required n8n env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`GREENFIELD_INGEST_URL` (your `ingest-signal` URL), `GREENFIELD_INGEST_TOKEN`
(the value of `INGEST_SIGNAL_TOKEN`), `ANTHROPIC_API_KEY`.

---

## What's next (post-MVP)

- **Per-team cost guardrail** on `run-agent` — currently capped per-run via `MAX_ITERATIONS=8` but no daily cap on number of runs.
- **Image generation** for opportunity covers (Supabase Storage bucket already implied by `cover_image_url`).
- **Email digest** of new opportunities.
- **Public "I'm building this"** signals.
- **Bulk admin import** from CSV.
