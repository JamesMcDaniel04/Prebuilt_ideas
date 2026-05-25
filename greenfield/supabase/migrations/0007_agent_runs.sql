-- 0007: agent_runs
--
-- Persists every Claude-powered agent run against a claimed idea. The run-agent
-- edge function inserts a row at queue-time, updates it through running ->
-- succeeded/failed, and stores the full tool-call trace as JSONB so the UI can
-- show a transparent timeline of what the agent actually did.

create table public.agent_runs (
  id              uuid primary key default gen_random_uuid(),
  claim_id        uuid not null references public.idea_claims on delete cascade,
  agent_role      text not null check (agent_role in ('gtm', 'sales', 'marketing', 'engineering')),

  status          text not null default 'queued'
                    check (status in ('queued', 'running', 'succeeded', 'failed')),

  prompt          text not null,
  output_markdown text,
  tool_calls      jsonb not null default '[]'::jsonb,

  model           text,
  tokens_input    integer,
  tokens_output   integer,

  started_at      timestamptz default now(),
  completed_at    timestamptz,
  error           text
);

create index agent_runs_claim_role_idx
  on public.agent_runs (claim_id, agent_role, started_at desc);

create index agent_runs_status_idx
  on public.agent_runs (status, started_at desc);

----------------------------------------------------------------------
-- RLS
----------------------------------------------------------------------
alter table public.agent_runs enable row level security;

-- A run is visible to team members of the claim's owning team, plus admins.
create policy "team or admin reads agent runs"
  on public.agent_runs for select using (
    public.is_current_user_admin()
    or exists (
      select 1
        from public.idea_claims c
        join public.team_members tm on tm.team_id = c.team_id
       where c.id = agent_runs.claim_id
         and tm.user_id = auth.uid()
    )
  );

-- All writes go through the run-agent edge function under service-role.
-- (No client-side insert / update / delete policies on purpose.)
