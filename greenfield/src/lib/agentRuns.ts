import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { AgentRun } from "@/lib/types";
import type { ClaimedIdea } from "@/lib/execution";
import { makeDemoRun, sampleRunsFor } from "@/lib/sampleAgentRuns";

const DEMO_RUNS_KEY = "greenfield.demoAgentRuns";

function readDemoRuns(): AgentRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DEMO_RUNS_KEY);
    return raw ? (JSON.parse(raw) as AgentRun[]) : [];
  } catch {
    return [];
  }
}

function writeDemoRuns(rows: AgentRun[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_RUNS_KEY, JSON.stringify(rows));
  window.dispatchEvent(new Event("greenfield:agent-runs-changed"));
}

/**
 * Returns the list of agent runs for a given claim + role.
 * In Supabase mode: live data from `agent_runs` joined for the active team.
 * In demo mode: localStorage + bundled sample runs for the solo-cpa fixture.
 */
export function useAgentRuns(claim: ClaimedIdea | null, role: AgentRun["agent_role"]) {
  const { user } = useAuth();
  const claimId = claim?.claim_id ?? null;

  // Demo-mode local state
  const [demoRuns, setDemoRuns] = useState<AgentRun[]>(() => readDemoRuns());
  useEffect(() => {
    if (isSupabaseConfigured) return;
    const handler = () => setDemoRuns(readDemoRuns());
    window.addEventListener("greenfield:agent-runs-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("greenfield:agent-runs-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const remoteQ = useQuery({
    queryKey: ["agent-runs", claimId, role, user?.id],
    enabled: isSupabaseConfigured && !!claimId && !!user,
    queryFn: async (): Promise<AgentRun[]> => {
      const { data, error } = await supabase
        .from("agent_runs")
        .select("*")
        .eq("claim_id", claimId!)
        .eq("agent_role", role)
        .order("started_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as AgentRun[];
    },
  });

  if (isSupabaseConfigured) {
    return {
      runs: remoteQ.data ?? [],
      isLoading: remoteQ.isLoading,
      error: remoteQ.error as Error | null,
    };
  }

  // Demo: bundled samples for the canonical fixture + any synthetic runs the user fired
  const bundled = claim ? sampleRunsFor(role, claim.opportunity_slug) : [];
  const synthetic = demoRuns.filter(
    (r) => r.agent_role === role && r.claim_id === (claim?.claim_id ?? `demo-claim-${claim?.opportunity_slug ?? ""}`),
  );
  return {
    runs: [...synthetic, ...bundled],
    isLoading: false,
    error: null as Error | null,
  };
}

/**
 * Hook for firing a new agent run. In Supabase mode this invokes the
 * `run-agent` edge function and refetches. In demo mode it appends a
 * canned run to localStorage so the UX has visible motion.
 */
export function useRunAgent(claim: ClaimedIdea | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: { agent_role: AgentRun["agent_role"]; prompt: string }) => {
      if (!claim) throw new Error("No active claim");

      if (!isSupabaseConfigured) {
        const demoClaimId = claim.claim_id ?? `demo-claim-${claim.opportunity_slug}`;
        const run = makeDemoRun({
          agent_role: args.agent_role,
          claim_id: demoClaimId,
          prompt: args.prompt,
        });
        writeDemoRuns([run, ...readDemoRuns()]);
        return run;
      }

      if (!claim.claim_id) throw new Error("Claim missing id");
      const { data, error } = await supabase.functions.invoke<{
        run_id: string;
        output_markdown: string;
        tool_calls: unknown[];
      }>("run-agent", {
        body: {
          claim_id: claim.claim_id,
          agent_role: args.agent_role,
          prompt: args.prompt,
        },
      });
      if (error) throw new Error(error.message);
      if (!data) throw new Error("No data returned from run-agent");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-runs"] });
    },
  });
}
