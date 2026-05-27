import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCareerTracks, useTrackProjects } from "@/lib/career";
import { useCareerUsage } from "@/lib/careerUsage";
import { CAREER_TRACK_AI_AUTOMATION_SPECIALIST } from "@/lib/careerSeed";

export default function CareerPage() {
  const tracksQuery = useCareerTracks();
  const projectsQuery = useTrackProjects(CAREER_TRACK_AI_AUTOMATION_SPECIALIST.slug);
  const usage = useCareerUsage();

  const tracks = tracksQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const headline = tracks[0] ?? CAREER_TRACK_AI_AUTOMATION_SPECIALIST;

  return (
    <section className="container-wide py-10">
      <header className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Career</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">
          A project-based AI career platform.
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Build real-world AI systems. Get graded against a rubric like a junior AI engineer would be.
          Graduate with a verified portfolio you can use to get hired.
        </p>
      </header>

      <article className="mt-10 rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">{headline.title}</h2>
              <Badge variant="secondary">{headline.est_duration}</Badge>
            </div>
            <p className="mt-3 text-base text-muted-foreground">{headline.hero_promise}</p>
            <p className="mt-2 text-sm text-muted-foreground">{headline.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button asChild>
              <Link to={`/career/${headline.slug}`}>
                {usage.unlocked ? "Open the track" : "See the track"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {!usage.unlocked && (
              <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground">
                Unlock with Career plan →
              </Link>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {projects.map((p) => (
              <li key={p.slug} className="rounded-xl border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">Project {p.ordinal} · {p.hireable_skill}</p>
                <p className="mt-2 font-medium leading-snug">{p.title}</p>
              </li>
            ))}
          </ol>
        )}
      </article>

      <section className="mt-12 max-w-3xl">
        <h3 className="font-display text-xl">Why this is different</h3>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span><span className="text-foreground font-medium">No video courses.</span> You build, you don't watch.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span><span className="text-foreground font-medium">Anti-cheat checkpoints.</span> Every project asks you to explain decisions in your own words. Generic answers fail.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span><span className="text-foreground font-medium">Rubric-based grading.</span> Specific scores per criterion, with feedback you can act on. Optional human review for borderline calls.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span><span className="text-foreground font-medium">Verified public portfolio.</span> Pass all 5 projects → your <code className="rounded bg-muted px-1 py-0.5 text-xs">/portfolio/your-name</code> page goes live with the verified badge.</span>
          </li>
        </ul>
      </section>
    </section>
  );
}
