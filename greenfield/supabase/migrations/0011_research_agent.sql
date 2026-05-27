-- 0011: research agent
--
-- Adds a 5th agent role ("research") used for upstream industry / competitor /
-- M&A work that feeds the existing execution-focused agents (GTM, Sales,
-- Marketing, Engineering). The role is enforced via CHECK constraints on both
-- agent_runs.agent_role and workflow_steps.owner_role.

alter table public.agent_runs
  drop constraint if exists agent_runs_agent_role_check;

alter table public.agent_runs
  add constraint agent_runs_agent_role_check
  check (agent_role in ('research', 'gtm', 'sales', 'marketing', 'engineering'));

alter table public.workflow_steps
  drop constraint if exists workflow_steps_owner_role_check;

alter table public.workflow_steps
  add constraint workflow_steps_owner_role_check
  check (owner_role in ('research', 'gtm', 'sales', 'marketing', 'engineering'));
