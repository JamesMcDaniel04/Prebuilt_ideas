import {
  BriefcaseBusiness, FileSearch, GitBranch, GraduationCap, Wallet,
} from "lucide-react";

import Sparkline from "@/components/opportunities/Sparkline";
import { practiceMetaForOpportunity } from "@/lib/practiceIdeas";
import type { Opportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  opp: Opportunity;
  compact?: boolean;
};

const ICONS = {
  git: GitBranch,
  briefcase: BriefcaseBusiness,
  library: FileSearch,
  school: GraduationCap,
  wallet: Wallet,
} as const;

export default function OpportunityThumbnail({ opp, compact = false }: Props) {
  const practiceMeta = practiceMetaForOpportunity(opp);

  if (!practiceMeta) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-transparent bg-gradient-to-br from-primary/[0.04] to-accent/[0.06]">
        <Sparkline seed={opp.slug} trend={opp.demand_trend} width={compact ? 140 : 240} height={compact ? 48 : 96} />
      </div>
    );
  }

  const Icon = ICONS[practiceMeta.icon];
  const tools = compact ? practiceMeta.tools.slice(0, 2) : practiceMeta.tools.slice(0, 2);
  const skillLine = compact ? practiceMeta.skills[0] : practiceMeta.skills.slice(0, 2).join(" · ");

  if (compact) {
    return (
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-xl border bg-gradient-to-r px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
          practiceMeta.thumbnail_class,
        )}
      >
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/35 blur-2xl" />
        <div className="absolute bottom-2 right-3 flex items-end gap-1 opacity-45">
          <span className="h-2 w-1 rounded-full bg-slate-600/50" />
          <span className="h-4 w-1 rounded-full bg-slate-600/50" />
          <span className="h-6 w-1 rounded-full bg-slate-600/50" />
        </div>

        <div className="relative flex h-full items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/85 shadow-sm">
            <Icon className="h-[18px] w-[18px] text-slate-700" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Practice Build
            </p>
            <p className="truncate text-sm font-semibold leading-tight text-slate-900">
              {practiceMeta.label}
            </p>
            <p className="truncate text-[11px] text-slate-600">
              {tools.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-xl border bg-gradient-to-br p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        practiceMeta.thumbnail_class,
      )}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-20 w-20 rounded-tl-[2rem] border-l border-t border-white/30 bg-white/10" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
          <span className="rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
            Practice
          </span>
        </div>

        <div className="space-y-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Skill Track
            </p>
            <p className="mt-1 font-display text-[1.05rem] leading-tight text-slate-900">
              {practiceMeta.label}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/70 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm"
              >
                {tool}
              </span>
            ))}
          </div>

          <p className="max-w-[14rem] text-[11px] leading-relaxed text-slate-600">
            {skillLine}
          </p>
        </div>
      </div>
    </div>
  );
}
