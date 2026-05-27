import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Bot, CheckCircle2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useCareerProject, useCareerTrack, useEnrollment } from "@/lib/career";
import { useCareerUsage } from "@/lib/careerUsage";
import {
  useCurrentAttempt,
  useEnsureDraftSubmission,
  useSubmissionEvaluations,
  useSubmitProject,
  useUpdateSubmissionDraft,
} from "@/lib/submissions";
import { useRunMentor, useSubmissionAgentRuns } from "@/lib/submissionAgentRuns";
import type { CareerSubmission } from "@/lib/types";

type Tab = "brief" | "mentor" | "submit" | "results";

export default function CareerProjectPage() {
  const { trackSlug, projectSlug } = useParams<{ trackSlug: string; projectSlug: string }>();
  const { user, loading } = useAuth();
  const usage = useCareerUsage();
  const trackQuery = useCareerTrack(trackSlug);
  const projectQuery = useCareerProject(projectSlug);
  const enrollmentQuery = useEnrollment(trackSlug);
  const enrollmentId = enrollmentQuery.data?.id ?? null;
  const attemptQuery = useCurrentAttempt(enrollmentId, projectSlug);
  const ensureDraft = useEnsureDraftSubmission();
  const [tab, setTab] = useState<Tab>("brief");

  // Auto-create a draft submission as soon as the user lands on the page so
  // mentor runs (subject-scoped) have a row to attach to.
  useEffect(() => {
    if (!enrollmentId || !projectSlug) return;
    if (attemptQuery.isLoading) return;
    if (attemptQuery.data) return;
    ensureDraft.mutate({ enrollmentId, projectSlug });
  }, [enrollmentId, projectSlug, attemptQuery.isLoading, attemptQuery.data]);

  if (loading) return null;
  if (!user) return <Navigate to={`/auth?mode=signin&next=/career/${trackSlug}/${projectSlug}`} replace />;
  if (trackQuery.isLoading || projectQuery.isLoading) {
    return <p className="container-wide py-10 text-muted-foreground">Loading…</p>;
  }
  if (!trackQuery.data || !projectQuery.data) return <Navigate to="/career" replace />;

  const project = projectQuery.data;
  const submission = attemptQuery.data ?? null;

  return (
    <section className="container-wide py-10 max-w-5xl">
      <Link to={`/career/${trackSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to {trackQuery.data.title}
      </Link>

      <header className="mt-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Project {project.ordinal} · {project.hireable_skill}
        </p>
        <h1 className="mt-2 font-display text-3xl">{project.title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{project.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {submission && (
            <Badge variant="outline">Attempt {submission.attempt_no} · {submission.status.replace("_", " ")}</Badge>
          )}
          <span>Career runs this month: <span className="font-medium text-foreground">{usage.runsUsed} / {usage.monthlyQuota}</span></span>
        </div>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border">
        {(["brief", "mentor", "submit", "results"] as Tab[]).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={
              "px-3 py-2 text-sm capitalize border-b-2 -mb-px " +
              (tab === t ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "brief" && <BriefTab project={project} />}
        {tab === "mentor" && <MentorTab submission={submission} usage={usage} />}
        {tab === "submit" && (
          <SubmitTab
            submission={submission}
            project={project}
            usage={usage}
            onSubmitted={() => setTab("results")}
          />
        )}
        {tab === "results" && <ResultsTab submission={submission} />}
      </div>
    </section>
  );
}

function BriefTab({ project }: { readonly project: ReturnType<typeof useCareerProject>["data"] & object }) {
  return (
    <div className="space-y-6">
      <article className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg">Project brief</h2>
        {project.starter_brief_md ? (
          <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{project.starter_brief_md}</pre>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>
        )}
      </article>

      <article className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg">Rubric</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {project.rubric.map((r) => (
            <li key={r.id} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">{r.criterion}</p>
                <p className="text-xs text-muted-foreground">Weight {r.weight} · pass at ≥ {r.pass_threshold}/{r.max}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg">Anti-cheat questions</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Each answer must meet the minimum length in your own words. Generic AI-default answers fail evaluation.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {project.anti_cheat_questions.map((q) => (
            <li key={q.id}>
              <p className="font-medium">{q.prompt}</p>
              <p className="text-xs text-muted-foreground">Minimum {q.min_words} words</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function MentorTab({
  submission,
  usage,
}: {
  readonly submission: CareerSubmission | null;
  readonly usage: ReturnType<typeof useCareerUsage>;
}) {
  const runMentor = useRunMentor(submission?.id);
  const runsQuery = useSubmissionAgentRuns(submission?.id, "mentor");
  const [prompt, setPrompt] = useState("");

  async function onAsk(e: FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      await runMentor.mutateAsync({ prompt: prompt.trim() });
      setPrompt("");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (!submission) {
    return <p className="text-muted-foreground">Setting up your draft submission…</p>;
  }
  const canRun = usage.reason === "ok";

  return (
    <div className="space-y-6">
      <article className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg">Ask the Mentor</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The mentor agent is Socratic — it points at concepts, refuses to paste working code, and reacts to your reasoning.
        </p>
        <form onSubmit={onAsk} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="mentor-prompt">Question or decision you're stuck on</Label>
            <Input
              id="mentor-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I'm choosing a chunk size and want to talk through the tradeoff…"
              maxLength={1000}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!canRun || runMentor.isPending}>
              {runMentor.isPending ? (<><Loader2 className="h-4 w-4 animate-spin" />Asking…</>) : (<><Bot className="h-4 w-4" />Ask Mentor</>)}
            </Button>
            {usage.reason === "quota_exhausted" && (
              <p className="text-xs text-destructive">Career quota exhausted for the month.</p>
            )}
            {usage.reason === "plan_locked" && (
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Needs the Career plan. <Link to="/pricing" className="underline">See plans</Link>
              </p>
            )}
          </div>
        </form>
      </article>

      <article className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg">Recent mentor responses</h2>
        {runsQuery.isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : (runsQuery.data ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No mentor exchanges yet for this attempt.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(runsQuery.data ?? []).map((run) => (
              <li key={run.id} className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">{new Date(run.started_at).toLocaleString()}</p>
                <p className="mt-1 text-sm font-medium">You: {run.prompt}</p>
                {run.output_markdown && (
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{run.output_markdown}</pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}

function SubmitTab({
  submission,
  project,
  usage,
  onSubmitted,
}: {
  readonly submission: CareerSubmission | null;
  readonly project: NonNullable<ReturnType<typeof useCareerProject>["data"]>;
  readonly usage: ReturnType<typeof useCareerUsage>;
  readonly onSubmitted: () => void;
}) {
  const update = useUpdateSubmissionDraft();
  const submit = useSubmitProject();
  const [repoUrl, setRepoUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Hydrate local state from the draft (once).
  const hydrated = useMemo(() => submission?.id, [submission?.id]);
  useEffect(() => {
    if (!submission) return;
    setRepoUrl(submission.repo_url ?? "");
    setDeployUrl(submission.deploy_url ?? "");
    setDemoUrl(submission.demo_url ?? "");
    setAnswers((submission.written_answers as Record<string, string>) ?? {});
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!submission) {
    return <p className="text-muted-foreground">Setting up your draft submission…</p>;
  }
  const isDraftLike = submission.status === "draft" || submission.status === "needs_revision";
  if (!isDraftLike) {
    return (
      <p className="text-muted-foreground">
        This attempt is already {submission.status.replace("_", " ")}. Open the Results tab to see feedback, or start a new attempt from the track page.
      </p>
    );
  }

  async function onSaveDraft() {
    if (!submission) return;
    try {
      await update.mutateAsync({
        id: submission.id,
        patch: {
          repo_url: repoUrl.trim() || null,
          deploy_url: deployUrl.trim() || null,
          demo_url: demoUrl.trim() || null,
          written_answers: answers,
        },
      });
      toast.success("Draft saved.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!submission) return;
    // Persist the latest input as a draft, then call submit-project.
    try {
      await update.mutateAsync({
        id: submission.id,
        patch: {
          repo_url: repoUrl.trim() || null,
          deploy_url: deployUrl.trim() || null,
          demo_url: demoUrl.trim() || null,
          written_answers: answers,
        },
      });
      const res = await submit.mutateAsync(submission.id);
      toast.success(res.overall_pass ? "Submission passed!" : "Graded — see feedback in Results.");
      onSubmitted();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const canSubmit = usage.reason === "ok";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <article className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-display text-lg">Artifacts</h2>
        <div className="space-y-1.5">
          <Label htmlFor="repo">Repo URL</Label>
          <Input id="repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deploy">Deploy URL</Label>
          <Input id="deploy" value={deployUrl} onChange={(e) => setDeployUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demo">Demo URL (Loom / screen recording)</Label>
          <Input id="demo" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://loom.com/..." />
        </div>
      </article>

      <article className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-display text-lg">Anti-cheat answers</h2>
        <p className="text-xs text-muted-foreground">
          In your own words. Generic answers will fail the evaluator.
        </p>
        {project.anti_cheat_questions.map((q) => {
          const value = answers[q.id] ?? "";
          const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
          const short = wordCount < q.min_words;
          return (
            <div key={q.id} className="space-y-1.5">
              <Label htmlFor={`q-${q.id}`}>{q.prompt}</Label>
              <textarea
                id={`q-${q.id}`}
                value={value}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className={`text-xs ${short ? "text-destructive" : "text-muted-foreground"}`}>
                {wordCount} / {q.min_words} words {short ? "(below minimum)" : ""}
              </p>
            </div>
          );
        })}
      </article>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={onSaveDraft} disabled={update.isPending}>
          {update.isPending ? "Saving…" : "Save draft"}
        </Button>
        <Button type="submit" disabled={!canSubmit || submit.isPending}>
          {submit.isPending ? (<><Loader2 className="h-4 w-4 animate-spin" />Grading…</>) : "Submit for grading"}
        </Button>
        {!canSubmit && (
          <p className="text-xs text-muted-foreground">
            {usage.reason === "plan_locked"
              ? <><Link to="/pricing" className="underline">Upgrade to Career</Link> to submit for grading.</>
              : "Career quota exhausted for the month."}
          </p>
        )}
      </div>
    </form>
  );
}

function ResultsTab({ submission }: { readonly submission: CareerSubmission | null }) {
  const evalsQuery = useSubmissionEvaluations(submission?.id ?? null);

  if (!submission) return <p className="text-muted-foreground">No submission yet.</p>;
  if (evalsQuery.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  const evals = evalsQuery.data ?? [];
  if (evals.length === 0) return <p className="text-muted-foreground">No evaluations yet. Submit your draft from the Submit tab.</p>;

  return (
    <ul className="space-y-4">
      {evals.map((evalRow) => (
        <li key={evalRow.id} className="rounded-2xl border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={evalRow.overall_pass ? "default" : "outline"} className={evalRow.overall_pass ? "bg-emerald-600 hover:bg-emerald-600" : ""}>
                {evalRow.overall_pass ? "Passed" : "Needs revision"}
              </Badge>
              {evalRow.human_review_state !== "none" && (
                <Badge variant="secondary" className="text-xs">Human review: {evalRow.human_review_state}</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{new Date(evalRow.created_at).toLocaleString()}</p>
          </div>

          {evalRow.rubric_scores.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {evalRow.rubric_scores.map((rs) => (
                <li key={rs.criterion_id} className="rounded-md border bg-background p-3">
                  <p className="font-medium">{rs.criterion_id} · {rs.score} / {rs.max}</p>
                  {rs.notes && <p className="mt-1 text-xs text-muted-foreground">{rs.notes}</p>}
                </li>
              ))}
            </ul>
          )}

          {evalRow.model_feedback_md && (
            <pre className="mt-4 whitespace-pre-wrap text-sm text-foreground/90">{evalRow.model_feedback_md}</pre>
          )}
        </li>
      ))}
    </ul>
  );
}
