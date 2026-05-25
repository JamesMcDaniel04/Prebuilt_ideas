import { SAMPLE_OPPORTUNITIES } from "@/lib/fixtures";
import type { Opportunity } from "@/lib/types";

type OpportunityLike = Partial<Opportunity> & Pick<Opportunity, "slug">;

const publishedBySlug = new Map(SAMPLE_OPPORTUNITIES.map((opp) => [opp.slug, opp]));

export function publishedOpportunityFromRow(row: OpportunityLike | null | undefined): Opportunity | null {
  if (!row) return null;
  const base = publishedBySlug.get(row.slug);
  if (!base) return null;
  return { ...base, ...row, sources: base.sources };
}

export function publishedOpportunitiesFromRows(rows: OpportunityLike[] | null | undefined): Opportunity[] {
  const rowBySlug = new Map((rows ?? []).map((row) => [row.slug, row]));

  return SAMPLE_OPPORTUNITIES.map((base) => {
    const row = rowBySlug.get(base.slug);
    return row ? { ...base, ...row, sources: base.sources } : base;
  });
}
