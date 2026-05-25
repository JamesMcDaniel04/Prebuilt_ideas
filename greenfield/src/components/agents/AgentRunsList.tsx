import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useAgentRuns } from "@/lib/agentRuns";
import type { ClaimedIdea } from "@/lib/execution";
import type { AgentRun } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  claim: ClaimedIdea;
  role: AgentRun["agent_role"];
};

export default function AgentRunsList({ claim, role }: Props) {
  const { runs, isLoading } = useAgentRuns(claim, role);
  const [selected, setSelected] = useState<AgentRun | null>(null);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading history…</p>;
  }
  if (runs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No runs yet. Hit <span className="font-medium text-foreground">Run agent</span> above to kick off the first one.
      </p>
    );
  }

  return (
    <div className="divide-y rounded-md border bg-card">
      {runs.map((run) => (
        <button
          key={run.id}
          type="button"
          onClick={() => setSelected(run)}
          className={cn(
            "w-full px-3 py-2.5 text-left text-sm transition-colors",
            "hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <StatusDot status={run.status} />
              <span className="truncate font-medium">
                {firstLine(run.prompt)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo(run.started_at)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(run.started_at, run.completed_at)}</span>
            <span>·</span>
            <span>{run.tool_calls.length} tool call{run.tool_calls.length === 1 ? "" : "s"}</span>
            {run.tokens_output != null && (
              <>
                <span>·</span>
                <span>{run.tokens_output.toLocaleString()} tokens out</span>
              </>
            )}
          </div>
        </button>
      ))}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && <RunDetail run={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RunDetail({ run }: { run: AgentRun }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <StatusDot status={run.status} />
          Run · {firstLine(run.prompt)}
        </DialogTitle>
        <DialogDescription>
          {new Date(run.started_at).toLocaleString()} · {formatDuration(run.started_at, run.completed_at)}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <details className="rounded border bg-muted/30 px-3 py-2 text-xs">
          <summary className="cursor-pointer font-medium">Prompt</summary>
          <pre className="mt-2 whitespace-pre-wrap font-mono">{run.prompt}</pre>
        </details>
        <pre className="max-h-[55vh] overflow-auto rounded-md bg-muted/50 p-4 text-xs leading-relaxed whitespace-pre-wrap">
          {run.output_markdown ?? "_(no output)_"}
        </pre>
        {run.tool_calls.length > 0 && (
          <details className="rounded border bg-muted/30 px-3 py-2 text-xs">
            <summary className="cursor-pointer font-medium">
              Tool call trace ({run.tool_calls.length})
            </summary>
            <ol className="mt-2 space-y-2">
              {run.tool_calls.map((tc, i) => (
                <li key={`${tc.name}-${i}`} className="rounded bg-background p-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium">{tc.name}</span>
                    {tc.duration_ms != null && (
                      <span className="text-muted-foreground">{tc.duration_ms}ms</span>
                    )}
                  </div>
                  <pre className="mt-1 overflow-x-auto text-[11px]">{JSON.stringify(tc.input, null, 2)}</pre>
                  <pre className="mt-1 overflow-x-auto text-[11px] text-foreground/70">{JSON.stringify(tc.result, null, 2)}</pre>
                </li>
              ))}
            </ol>
          </details>
        )}
        {run.error && (
          <div className="rounded border border-destructive/40 bg-destructive/5 p-3 text-xs">
            <p className="font-medium text-destructive">Error</p>
            <p className="mt-1">{run.error}</p>
          </div>
        )}
      </div>
    </>
  );
}

function StatusDot({ status }: { status: AgentRun["status"] }) {
  const meta =
    status === "succeeded"
      ? { tone: "text-emerald-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> }
      : status === "failed"
      ? { tone: "text-destructive",  icon: <XCircle className="h-3.5 w-3.5" /> }
      : status === "running"
      ? { tone: "text-amber-600",    icon: <ArrowRight className="h-3.5 w-3.5 animate-pulse" /> }
      : { tone: "text-muted-foreground", icon: <Clock className="h-3.5 w-3.5" /> };
  return <span className={cn("inline-flex items-center", meta.tone)}>{meta.icon}</span>;
}

function firstLine(s: string): string {
  const line = s.split("\n")[0].trim();
  return line.length > 90 ? line.slice(0, 87) + "…" : line;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return "ongoing";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

// Re-export for AgentsPage convenience
export { Badge, Button };
