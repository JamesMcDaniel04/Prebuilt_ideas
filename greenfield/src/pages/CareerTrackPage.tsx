import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCareerTrack, useEnrollment, useEnroll, useTrackProjects } from "@/lib/career";
import { useCareerUsage } from "@/lib/careerUsage";
import { useSubmissions } from "@/lib/submissions";
import type { CareerSubmissionStatus } from "@/lib/types";

const STATUS_TONE: Record<CareerSubmissionStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-amber-100 text-amber-900",
  grading: "bg-amber-100 text-amber-900",
  passed: "bg-emerald-100 text-emerald-900",
  needs_revision: "bg-amber-100 text-amber-900",
  failed: "bg-destructive/10 text-destructive",
  withdrawn: "bg-muted text-muted-foreground",
};

export default function CareerTrackPage() {
  const { trackSlug } = useParams<{ trackSlug: string }>();
  const { user, loading } = useAuth();
  const trackQuery = useCareerTrack(trackSlug);
  const projectsQuery = useTrackProjects(trackSlug);
  const enrollmentQuery = useEnrollment(trackSlug);
  const enroll = useEnroll();
  const usage = useCareerUsage();
  const submissionsQuery = useSubmissions(enrollmentQuery.data?.id ?? null);

  if (loading) return null;
  if (!user) return <Navigate to={`/auth?mode=signin&next=/career/${trackSlug}`} replace />;
  if (trackQuery.isLoading) return <p className="container-wide py-10 text-muted-foreground">Loading…</p>;
  if (!trackQuery.data) return <Navigate to="/career" replace />;

  const track = trackQuery.data;
  const projects = projectsQuery.data ?? [];
  const enrolled = !!enrollmentQuery.data;
  const submissions = submissionsQuery.data ?? [];

  const statusByProject = new Map<string, CareerSubmissionStatus>();
  for (const s of submissions) {
    // Latest attempt wins (submissions are ordered desc by attempt_no).
    if (!statusByProject.has(s.project_slug)) {
      statusByProject.set(s.project_slug, s.status);
    }
  }
  const passedCount = projects.filter((p) => statusByProject.get(p.slug) === "passed").length;

  async function onEnroll() {
    if (!usage.unlocked) {
      toast.error("Enrollment needs the Career plan. Upgrade from /pricing.");
      return;
    }
    try {
      await enroll.mutateAsync(track.slug);
      toast.success(`You're enrolled in ${track.title}.`);
    } catch { /* enroll mutation already toasts */ }
  }

  return (
    <section className="container-wide py-10 max-w-5xl">
      <Link to="/career" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Career
      </Link>

      <header className="mt-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Track · {track.target_role}</p>
        <h1 className="mt-2 font-display text-3xl">{track.title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{track.hero_promise}</p>
        <p className="mt-2 text-sm text-muted-foreground">{track.summary}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {enrolled ? (
            <Badge variant="secondary" className="text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Enrolled · {passedCount} / {projects.length} passed
            </Badge>
          ) : (
            <Button onClick={onEnroll} disabled={enroll.isPending || !usage.unlocked}>
              {enroll.isPending ? "Enrolling…" : "Enroll in this track"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {!usage.unlocked && (
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Career plan unlocks enrollment & agent runs.{" "}
              <Link to="/pricing" className="underline">See plans</Link>
            </p>
          )}
        </div>
      </header>

      <ol className="mt-10 space-y-3">
        {projects.map((p) => {
          const status = statusByProject.get(p.slug);
          const passed = status === "passed";
          return (
            <li
              key={p.slug}
              className="rounded-2xl border bg-card p-5 flex flex-wrap items-start justify-between gap-4 hover:border-primary/40 transition"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Project {p.ordinal}</p>
                  <Badge variant="outline">{p.hireable_skill}</Badge>
                  {status && (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_TONE[status]}`}>
                      {status.replace("_", " ")}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-lg">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
              </div>
              <div className="flex items-center gap-2">
                {enrolled && (
                  <Button asChild variant={passed ? "outline" : "default"} size="sm">
                    <Link to={`/career/${track.slug}/${p.slug}`}>
                      {passed ? "Review" : status === "needs_revision" ? "Revise" : "Open"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
