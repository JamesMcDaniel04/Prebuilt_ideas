import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Copy, Download, FileText, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Props = {
  opportunityId: string;
  opportunitySlug: string;
  opportunityTitle: string;
};

/**
 * The Pro feature. Anyone can SEE that a brief exists for this opportunity;
 * only Pro users can read its full content + download it as Markdown.
 */
export default function BuildBriefPanel({ opportunityId, opportunitySlug, opportunityTitle }: Props) {
  const { user, profile } = useAuth();
  const isPro = !!profile?.is_pro;
  const [open, setOpen] = useState(false);

  const { data: brief, isLoading } = useQuery({
    queryKey: ["build-brief", opportunityId, isPro],
    enabled: isPro,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("build_briefs")
        .select("markdown")
        .eq("opportunity_id", opportunityId)
        .maybeSingle();
      if (error) throw error;
      return data?.markdown ?? null;
    },
  });

  function download() {
    if (!brief) return;
    const blob = new Blob([brief], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${opportunitySlug}-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Brief downloaded");
  }

  async function copy() {
    if (!brief) return;
    await navigator.clipboard.writeText(brief);
    toast.success("Brief copied — paste it into Claude Code, Cursor, or Codex");
  }

  if (!user || !isPro) {
    return (
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-accent/10 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-accent/20 p-2">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-base">Build brief — Pro</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              A prescriptive Markdown spec for this opportunity: stack, schema, weekly milestones.
              Paste it into Claude Code, Cursor, or Codex and start shipping.
            </p>
            <div className="mt-3 flex gap-2">
              <Button asChild>
                <Link to={`/pricing?next=${encodeURIComponent(`/opportunity/${opportunitySlug}`)}`}>
                  <Lock className="h-4 w-4" />
                  Upgrade to unlock
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">Preview</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>What's in a build brief?</DialogTitle>
                    <DialogDescription>
                      Every opportunity in Greenfield ships with a structured Markdown brief.
                    </DialogDescription>
                  </DialogHeader>
                  <pre className="max-h-72 overflow-auto rounded-md bg-muted/60 p-3 text-xs leading-relaxed">
{`## Overview
## Stack (recommended)
## Data model
## Core flows
## Week-1 milestones
## Week-2 to launch
## Risks & open questions`}
                  </pre>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="flex items-center gap-1.5 font-display text-base">
            <FileText className="h-4 w-4" /> Build brief
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste this into Claude Code, Cursor, or Codex to scaffold {opportunityTitle}.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="h-3 w-3" /> Pro
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <Button onClick={() => setOpen(true)} disabled={isLoading || !brief}>
          <FileText className="h-4 w-4" />
          Open brief
        </Button>
        <Button variant="outline" onClick={copy} disabled={isLoading || !brief}>
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button variant="outline" onClick={download} disabled={isLoading || !brief}>
          <Download className="h-4 w-4" />
          Download .md
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{opportunityTitle} — Build brief</DialogTitle>
            <DialogDescription>
              Markdown spec, ready to paste into your coding agent.
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted/60 p-4 text-xs leading-relaxed whitespace-pre-wrap">
            {brief}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={copy}><Copy className="h-4 w-4" />Copy</Button>
            <Button onClick={download}><Download className="h-4 w-4" />Download .md</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
