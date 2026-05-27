import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { AgentRun } from "@/lib/types";

function prettyError(raw: string): string {
  if (raw.includes("CAREER_PLAN_REQUIRED")) return "Mentor runs need the Career plan.";
  if (raw.includes("CAREER_QUOTA_EXCEEDED")) return "You've used your Career agent runs for this month.";
  if (raw.includes("UNAUTHENTICATED")) return "Sign in first.";
  if (raw.includes("SUBJECT_NOT_FOUND")) return "That submission no longer exists.";
  return raw;
}

/**
 * Recent agent_runs for a submission subject (mentor + evaluator). RLS only
 * lets the owning learner see them.
 */
export function useSubmissionAgentRuns(submissionId: string | null | undefined, role: AgentRun["agent_role"]) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["submission-agent-runs", submissionId, role, user?.id],
    enabled: !!submissionId && !!user && isSupabaseConfigured,
    queryFn: async (): Promise<AgentRun[]> => {
      const { data, error } = await supabase
        .from("agent_runs")
        .select("*")
        .eq("submission_id", submissionId!)
        .eq("agent_role", role)
        .order("started_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as AgentRun[];
    },
  });
}

/**
 * Fire a mentor run against a submission. Mentor runs go through the existing
 * run-agent edge function with { submission_id, agent_role: 'mentor' }.
 * Evaluator runs are triggered server-side by submit-project, not from here.
 */
export function useRunMentor(submissionId: string | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { prompt: string }) => {
      if (!submissionId) throw new Error("No submission selected.");
      if (!isSupabaseConfigured) throw new Error("Mentor runs require Supabase.");
      const { data, error } = await supabase.functions.invoke<{
        run_id: string;
        output_markdown: string;
        tool_calls: unknown[];
      }>("run-agent", {
        body: { submission_id: submissionId, agent_role: "mentor", prompt: args.prompt },
      });
      if (error) throw new Error(prettyError(error.message));
      if (!data) throw new Error("run-agent returned no body");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submission-agent-runs"] });
      qc.invalidateQueries({ queryKey: ["career_usage_monthly"] });
    },
  });
}
