import { Link, useParams } from "react-router-dom";
import { CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { usePublicPortfolio } from "@/lib/portfolio";

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const query = usePublicPortfolio(username);

  if (query.isLoading) {
    return (
      <section className="container-narrow py-16">
        <p className="text-muted-foreground">Loading…</p>
      </section>
    );
  }
  if (!query.data) {
    return (
      <section className="container-narrow py-16 text-center">
        <h1 className="font-display text-2xl">Portfolio not found.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No public portfolio exists at <code className="rounded bg-muted px-1 py-0.5 text-xs">/portfolio/{username}</code>.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm underline">Back to Greenfield</Link>
      </section>
    );
  }

  const { profile, tracks, projects } = query.data;
  const humanVerified = new Set(profile.human_verified_track_slugs);
  const projectsByTrack = new Map<string, typeof projects>();
  for (const p of projects) {
    const arr = projectsByTrack.get(p.track_slug) ?? [];
    arr.push(p);
    projectsByTrack.set(p.track_slug, arr);
  }

  return (
    <section className="container-narrow py-12 max-w-3xl">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Verified portfolio</p>
        <h1 className="mt-2 font-display text-3xl">@{profile.username}</h1>
        {profile.headline && <p className="mt-1 text-base">{profile.headline}</p>}
        {profile.bio && <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>}
      </header>

      {tracks.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No verified tracks yet.</p>
      ) : (
        <div className="mt-10 space-y-8">
          {tracks.map((t) => {
            const isHumanVerified = humanVerified.has(t.slug);
            const trackProjects = projectsByTrack.get(t.slug) ?? [];
            return (
              <article key={t.slug} className="rounded-2xl border bg-card p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl">{t.title}</h2>
                  <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                  {isHumanVerified && (
                    <Badge variant="secondary">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Human-verified
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.target_role}</p>

                {trackProjects.length > 0 && (
                  <ol className="mt-5 space-y-2 text-sm">
                    {trackProjects.map((p) => (
                      <li key={p.slug} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.hireable_skill}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            );
          })}
        </div>
      )}

      <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
        Verified portfolios are issued by{" "}
        <Link to="/career" className="underline">Greenfield Career</Link>.
        Each verified track required passing rubric-graded submissions for every project in the track.
      </footer>
    </section>
  );
}
