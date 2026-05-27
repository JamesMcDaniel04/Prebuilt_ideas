import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type {
  CareerSubmission,
  CareerSubmissionEvaluation,
} from "@/lib/types";

const KEY = ["career_submissions"];
const EVAL_KEY = ["career_submission_evaluations"];

export function useSubmissions(enrollmentId: string | null | undefined, projectSlug?: string) {
  return useQuery({
    queryKey: [...KEY, enrollmentId, projectSlug ?? null],
    enabled: !!enrollmentId && isSupabaseConfigured,
    queryFn: async (): Promise<CareerSubmission[]> => {
      let q = supabase
        .from("career_submissions")
        .select("*")
        .eq("enrollment_id", enrollmentId!)
        .order("attempt_no", { ascending: false });
      if (projectSlug) q = q.eq("project_slug", projectSlug);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as CareerSubmission[];
    },
  });
}

export function useSubmission(id: string | null | undefined) {
  return useQuery({
    queryKey: [...KEY, "one", id],
    enabled: !!id && isSupabaseConfigured,
    queryFn: async (): Promise<CareerSubmission | null> => {
      const { data, error } = await supabase
        .from("career_submissions")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as CareerSubmission | null) ?? null;
    },
  });
}

/**
 * Returns the learner's "current attempt" for a project — the latest draft,
 * or null if they haven't started. Used by the project workspace to anchor
 * mentor runs to a submission row.
 */
export function useCurrentAttempt(enrollmentId: string | null | undefined, projectSlug: string | null | undefined) {
  return useQuery({
    queryKey: [...KEY, "current", enrollmentId, projectSlug],
    enabled: !!enrollmentId && !!projectSlug && isSupabaseConfigured,
    queryFn: async (): Promise<CareerSubmission | null> => {
      const { data, error } = await supabase
        .from("career_submissions")
        .select("*")
        .eq("enrollment_id", enrollmentId!)
        .eq("project_slug", projectSlug!)
        .order("attempt_no", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as CareerSubmission | null) ?? null;
    },
  });
}

export function useEnsureDraftSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ enrollmentId, projectSlug }: { enrollmentId: string; projectSlug: string }): Promise<CareerSubmission> => {
      // Reuse the latest attempt if it's still editable, else create attempt+1.
      const { data: existing } = await supabase
        .from("career_submissions")
        .select("*")
        .eq("enrollment_id", enrollmentId)
        .eq("project_slug", projectSlug)
        .order("attempt_no", { ascending: false })
        .limit(1)
        .maybeSingle();
      const editable = existing && (existing.status === "draft" || existing.status === "needs_revision");
      if (editable) return existing as CareerSubmission;

      const nextAttempt = ((existing?.attempt_no as number | undefined) ?? 0) + 1;
      const { data, error } = await supabase
        .from("career_submissions")
        .insert({ enrollment_id: enrollmentId, project_slug: projectSlug, attempt_no: nextAttempt })
        .select("*")
        .single();
      if (error) throw error;
      return data as CareerSubmission;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSubmissionDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<CareerSubmission> }) => {
      const { data, error } = await supabase
        .from("career_submissions")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as CareerSubmission;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: Error) => toast.error(e.message),
  });
}

function prettySubmitError(raw: string): string {
  if (raw.includes("CAREER_PLAN_REQUIRED")) return "Submitting needs the Career plan.";
  if (raw.includes("CAREER_QUOTA_EXCEEDED")) return "You've used your Career agent runs for this month.";
  if (raw.includes("MISSING_ARTIFACTS")) return "Fill in every required artifact before submitting.";
  if (raw.includes("ANSWERS_TOO_SHORT")) return "One or more written answers don't meet the minimum length.";
  if (raw.includes("SUBMISSION_NOT_DRAFT")) return "That submission has already been submitted.";
  if (raw.includes("EVALUATOR_FAILED")) return "Evaluator agent failed — try again.";
  if (raw.includes("EVALUATOR_OUTPUT_UNPARSEABLE")) return "Evaluator returned unparseable output — re-submit.";
  return raw;
}

export function useSubmitProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (submission_id: string): Promise<{ evaluation: CareerSubmissionEvaluation; overall_pass: boolean }> => {
      if (!isSupabaseConfigured) throw new Error("Submission requires Supabase.");
      const { data, error } = await supabase.functions.invoke<{
        evaluation: CareerSubmissionEvaluation;
        overall_pass: boolean;
      }>("submit-project", { body: { submission_id } });
      if (error) throw new Error(prettySubmitError(error.message));
      if (!data) throw new Error("submit-project returned no body");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: EVAL_KEY });
      qc.invalidateQueries({ queryKey: ["career_usage_monthly"] });
      qc.invalidateQueries({ queryKey: ["career_portfolio_profile"] });
    },
  });
}

export function useSubmissionEvaluations(submissionId: string | null | undefined) {
  return useQuery({
    queryKey: [...EVAL_KEY, submissionId],
    enabled: !!submissionId && isSupabaseConfigured,
    queryFn: async (): Promise<CareerSubmissionEvaluation[]> => {
      const { data, error } = await supabase
        .from("career_submission_evaluations")
        .select("*")
        .eq("submission_id", submissionId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CareerSubmissionEvaluation[];
    },
  });
}
