-- 0010: Stripe billing linkage
--
-- Extends teams with subscription metadata so the webhook can keep `plan`,
-- `is_pro`, quotas, and seat limits in sync with the Stripe source of truth.
-- Adds a webhook_events log for idempotency (Stripe retries on non-2xx).

----------------------------------------------------------------------
-- teams: subscription metadata
----------------------------------------------------------------------
alter table public.teams
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_price_id        text,
  add column if not exists stripe_subscription_status text
    check (stripe_subscription_status in (
      'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'
    )),
  add column if not exists current_period_end     timestamptz,
  add column if not exists cancel_at_period_end   boolean default false;

create index if not exists teams_stripe_customer_idx     on public.teams (stripe_customer_id);
create index if not exists teams_stripe_subscription_idx on public.teams (stripe_subscription_id);

----------------------------------------------------------------------
-- Webhook idempotency log
----------------------------------------------------------------------
create table if not exists public.stripe_webhook_events (
  id             text primary key,                       -- Stripe event.id
  type           text not null,
  received_at    timestamptz not null default now(),
  processed_at   timestamptz,
  payload        jsonb not null
);

alter table public.stripe_webhook_events enable row level security;
-- service-role only; no client policies

----------------------------------------------------------------------
-- apply_stripe_subscription: idempotent helper invoked by the webhook.
-- Updates the team's plan + subscription metadata AND the owner's profile.
-- Calls sync_team_plan_defaults() to refresh quota/seat counts to match the
-- new tier (so a Scout → Venture Studio upgrade immediately bumps the team
-- to 10 claims/week and 5 seats).
----------------------------------------------------------------------
create or replace function public.apply_stripe_subscription(
  p_team_id              uuid,
  p_customer_id          text,
  p_subscription_id      text,
  p_price_id             text,
  p_plan                 public.plan_tier,
  p_status               text,
  p_current_period_end   timestamptz,
  p_cancel_at_period_end boolean
)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  owner_id uuid;
  pro_flag boolean;
begin
  pro_flag := p_status in ('trialing', 'active') and p_plan <> 'scout';

  update public.teams
     set plan                       = p_plan,
         stripe_customer_id         = p_customer_id,
         stripe_subscription_id     = p_subscription_id,
         stripe_price_id            = p_price_id,
         stripe_subscription_status = p_status,
         current_period_end         = p_current_period_end,
         cancel_at_period_end       = coalesce(p_cancel_at_period_end, false)
   where id = p_team_id;

  perform public.sync_team_plan_defaults(p_team_id);

  -- Sync the owner's profile so the frontend gating (`profile.plan`) updates too.
  select user_id into owner_id
    from public.team_members
    where team_id = p_team_id and role = 'owner'
    limit 1;

  if owner_id is not null then
    update public.profiles
       set plan               = p_plan,
           is_pro             = pro_flag,
           pro_since          = coalesce(pro_since, case when pro_flag then now() end),
           stripe_customer_id = p_customer_id
     where user_id = owner_id;
  end if;
end;
$$;
