import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useMyPortfolio, useUpdatePortfolio } from "@/lib/portfolio";

export default function PortfolioSettingsPage() {
  const { user, loading } = useAuth();
  const portfolioQuery = useMyPortfolio();
  const update = useUpdatePortfolio();

  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const p = portfolioQuery.data;
    if (!p) return;
    setUsername(p.username);
    setHeadline(p.headline ?? "");
    setBio(p.bio ?? "");
    setIsPublic(p.is_public);
  }, [portfolioQuery.data]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth?mode=signin&next=/settings/portfolio" replace />;

  const profile = portfolioQuery.data;
  const verified = profile?.verified_track_slugs ?? [];
  const humanVerified = profile?.human_verified_track_slugs ?? [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[a-z0-9][a-z0-9-]{2,30}$/.test(username)) {
      toast.error("Username must be 3–31 chars: lowercase letters, digits, hyphens.");
      return;
    }
    try {
      await update.mutateAsync({
        username: username.trim(),
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        is_public: isPublic,
        published_at: isPublic ? new Date().toISOString() : null,
      });
      toast.success("Portfolio updated.");
    } catch { /* mutation already toasts */ }
  }

  return (
    <section className="container-wide py-10 max-w-2xl">
      <Link to="/career" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Career
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl">Portfolio settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your public profile is at <code className="rounded bg-muted px-1 py-0.5 text-xs">/portfolio/{username || "your-username"}</code>.
        </p>
      </header>

      {verified.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-5">
          <p className="text-sm font-medium">Verified tracks</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {verified.map((t) => (
              <Badge key={t} variant="secondary">
                {t} {humanVerified.includes(t) && <span className="ml-1">· human-verified</span>}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 rounded-2xl border bg-card p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="jamie"
            required
            maxLength={31}
          />
          <p className="text-xs text-muted-foreground">3–31 chars · lowercase letters, digits, hyphens.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="AI Automation Specialist · open to roles"
            maxLength={140}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={800}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Two or three sentences. Who you are, what you build, what you're looking for."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Publish this portfolio publicly.
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save"}
          </Button>
          {profile?.is_public && username && (
            <Link to={`/portfolio/${username}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
              View public page
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
