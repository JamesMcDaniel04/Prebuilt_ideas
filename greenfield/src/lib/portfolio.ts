import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type {
  CareerPortfolioProfile,
  CareerSubmission,
  CareerSubmissionEvaluation,
  CareerTrack,
  CareerProject,
} from "@/lib/types";

const KEY = ["career_portfolio_profile"];

export function useMyPortfolio() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, user?.id],
    enabled: !!user && isSupabaseConfigured,
    queryFn: async (): Promise<CareerPortfolioProfile | null> => {
      const { data, error } = await supabase
        .from("career_portfolio_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as CareerPortfolioProfile | null) ?? null;
    },
  });
}

export function useUpdatePortfolio() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      patch: Partial<Omit<CareerPortfolioProfile, "user_id" | "created_at" | "updated_at" | "verified_track_slugs" | "human_verified_track_slugs">>,
    ): Promise<CareerPortfolioProfile> => {
      if (!user) throw new Error("Sign in first.");
      // Upsert so the first save creates the row.
      const { data, error } = await supabase
        .from("career_portfolio_profiles")
        .upsert(
          { user_id: user.id, username: patch.username ?? "", ...patch },
          { onConflict: "user_id" },
        )
        .select("*")
        .single();
      if (error) throw error;
      return data as CareerPortfolioProfile;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: Error) => toast.error(e.message),
  });
}

/**
 * Public portfolio lookup by username. Used by /portfolio/:username inside
 * MarketingLayout — no auth required (RLS allows public reads when is_public).
 */
export type PublicPortfolioPayload = {
  profile: CareerPortfolioProfile;
  tracks: CareerTrack[];
  projects: CareerProject[];
  passedSubmissions: CareerSubmission[];
  evaluationsBySubmission: Record<string, CareerSubmissionEvaluation | null>;
};

export function usePublicPortfolio(username: string | undefined) {
  return useQuery({
    queryKey: ["public_portfolio", username],
    enabled: !!username && isSupabaseConfigured,
    queryFn: async (): Promise<PublicPortfolioPayload | null> => {
      const { data: profile, error: pErr } = await supabase
        .from("career_portfolio_profiles")
        .select("*")
        .eq("username", username!)
        .eq("is_public", true)
        .maybeSingle();
      if (pErr) throw pErr;
      if (!profile) return null;
      const verified = (profile.verified_track_slugs as string[] | undefined) ?? [];
      if (verified.length === 0) {
        return { profile: profile as CareerPortfolioProfile, tracks: [], projects: [], passedSubmissions: [], evaluationsBySubmission: {} };
      }

      const [{ data: tracks }, { data: projects }] = await Promise.all([
        supabase.from("career_tracks").select("*").in("slug", verified),
        supabase.from("career_projects").select("*").in("track_slug", verified).eq("is_active", true).order("ordinal"),
      ]);

      // Enrollments owned by this user — but RLS only allows the owner to read
      // their own enrollments, so we can't load these as a public viewer.
      // The portfolio page therefore lists tracks + projects (from public
      // tables) plus the public profile row; deep evaluation detail is
      // intentionally not exposed to anonymous viewers in v1.
      return {
        profile: profile as CareerPortfolioProfile,
        tracks: (tracks ?? []) as CareerTrack[],
        projects: (projects ?? []) as CareerProject[],
        passedSubmissions: [],
        evaluationsBySubmission: {},
      };
    },
  });
}
