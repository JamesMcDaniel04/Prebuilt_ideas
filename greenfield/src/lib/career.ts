import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  CAREER_PROJECTS,
  CAREER_TRACKS_SEED,
  seedProjectBySlug,
  seedProjectsForTrack,
} from "@/lib/careerSeed";
import type { CareerEnrollment, CareerProject, CareerTrack } from "@/lib/types";

const TRACKS_KEY = ["career_tracks"];
const PROJECTS_KEY = ["career_projects"];
const ENROLLMENT_KEY = ["career_enrollments"];

export function useCareerTracks() {
  return useQuery({
    queryKey: TRACKS_KEY,
    queryFn: async (): Promise<CareerTrack[]> => {
      if (!isSupabaseConfigured) return CAREER_TRACKS_SEED;
      const { data, error } = await supabase
        .from("career_tracks")
        .select("*")
        .eq("is_active", true)
        .order("slug");
      if (error) throw error;
      return (data ?? []) as CareerTrack[];
    },
  });
}

export function useCareerTrack(slug: string | undefined) {
  return useQuery({
    queryKey: [...TRACKS_KEY, "one", slug],
    enabled: !!slug,
    queryFn: async (): Promise<CareerTrack | null> => {
      if (!isSupabaseConfigured) {
        return CAREER_TRACKS_SEED.find((t) => t.slug === slug) ?? null;
      }
      const { data, error } = await supabase
        .from("career_tracks")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as CareerTrack | null) ?? null;
    },
  });
}

export function useTrackProjects(trackSlug: string | undefined) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, trackSlug],
    enabled: !!trackSlug,
    queryFn: async (): Promise<CareerProject[]> => {
      if (!isSupabaseConfigured) return seedProjectsForTrack(trackSlug!);
      const { data, error } = await supabase
        .from("career_projects")
        .select("*")
        .eq("track_slug", trackSlug)
        .eq("is_active", true)
        .order("ordinal");
      if (error) throw error;
      return (data ?? []) as CareerProject[];
    },
  });
}

export function useCareerProject(slug: string | undefined) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, "one", slug],
    enabled: !!slug,
    queryFn: async (): Promise<CareerProject | null> => {
      if (!isSupabaseConfigured) return seedProjectBySlug(slug!);
      const { data, error } = await supabase
        .from("career_projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as CareerProject | null) ?? CAREER_PROJECTS.find((p) => p.slug === slug) ?? null;
    },
  });
}

export function useEnrollment(trackSlug: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...ENROLLMENT_KEY, user?.id, trackSlug],
    enabled: !!user && !!trackSlug && isSupabaseConfigured,
    queryFn: async (): Promise<CareerEnrollment | null> => {
      const { data, error } = await supabase
        .from("career_enrollments")
        .select("*")
        .eq("user_id", user!.id)
        .eq("track_slug", trackSlug)
        .maybeSingle();
      if (error) throw error;
      return (data as CareerEnrollment | null) ?? null;
    },
  });
}

export function useEnroll() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (trackSlug: string): Promise<CareerEnrollment> => {
      if (!user) throw new Error("Sign in to enroll.");
      if (!isSupabaseConfigured) throw new Error("Enrollment requires Supabase.");
      const { data, error } = await supabase
        .from("career_enrollments")
        .insert({ user_id: user.id, track_slug: trackSlug })
        .select("*")
        .single();
      if (error) throw error;
      return data as CareerEnrollment;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ENROLLMENT_KEY }),
    onError: (e: Error) => toast.error(e.message),
  });
}
