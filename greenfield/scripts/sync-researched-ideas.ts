import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

import { ALL_SAMPLE_OPPORTUNITIES, SAMPLE_OPPORTUNITIES } from "../src/lib/fixtures";

const SUPABASE_URL = required("VITE_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = required("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const publishedRows = SAMPLE_OPPORTUNITIES.map((opp) => ({
    slug: opp.slug,
    title: opp.title,
    one_liner: opp.one_liner,
    the_gap: opp.the_gap,
    the_play: opp.the_play,
    market_size_summary: opp.market_size_summary,
    timing_rationale: opp.timing_rationale,
    build_path: opp.build_path,
    model_type: opp.model_type,
    audience: opp.audience,
    industry: opp.industry,
    niche: opp.niche,
    revenue_ceiling: opp.revenue_ceiling,
    founder_path: opp.founder_path,
    difficulty: opp.difficulty,
    starting_capital: opp.starting_capital,
    time_to_launch: opp.time_to_launch,
    build_stack_hint: opp.build_stack_hint,
    moat: opp.moat,
    distribution_play: opp.distribution_play,
    demand_trend: opp.demand_trend,
    featured: opp.featured,
    rank: opp.rank,
    cover_image_url: opp.cover_image_url,
    yc_rfs_slug: opp.yc_rfs_slug,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("opportunities")
    .upsert(publishedRows, { onConflict: "slug" });

  if (error) {
    console.error(error);
    process.exit(1);
  }

  const allSlugs = ALL_SAMPLE_OPPORTUNITIES.map((opp) => opp.slug);
  const publishedSlugs = new Set(SAMPLE_OPPORTUNITIES.map((opp) => opp.slug));
  const unpublishedSlugs = allSlugs.filter((slug) => !publishedSlugs.has(slug));

  if (unpublishedSlugs.length) {
    const { error: deleteError } = await supabase
      .from("opportunities")
      .delete()
      .in("slug", unpublishedSlugs);
    if (deleteError) {
      console.error(deleteError);
      process.exit(1);
    }
  }

  const { data: insertedRows, error: fetchError } = await supabase
    .from("opportunities")
    .select("id, slug")
    .in("slug", [...publishedSlugs]);

  if (fetchError) {
    console.error(fetchError);
    process.exit(1);
  }

  const idBySlug = new Map((insertedRows ?? []).map((row) => [row.slug, row.id]));
  const sourceRows = SAMPLE_OPPORTUNITIES.flatMap((opp) => {
    const opportunityId = idBySlug.get(opp.slug);
    if (!opportunityId) return [];
    return opp.sources.map((source) => ({
      opportunity_id: opportunityId,
      source_type: source.source_type,
      url: source.url,
      title: source.title,
      snippet: source.snippet ?? null,
      published_at: source.published_at,
      ingested_at: source.ingested_at ?? new Date().toISOString(),
      metadata: null,
    }));
  });

  const opportunityIds = [...idBySlug.values()];
  if (opportunityIds.length) {
    const { error: signalDeleteError } = await supabase
      .from("opportunity_signals")
      .delete()
      .in("opportunity_id", opportunityIds);
    if (signalDeleteError) {
      console.error(signalDeleteError);
      process.exit(1);
    }
  }

  if (sourceRows.length) {
    const { error: signalInsertError } = await supabase
      .from("opportunity_signals")
      .insert(sourceRows);
    if (signalInsertError) {
      console.error(signalInsertError);
      process.exit(1);
    }
  }

  console.log(`Published ${publishedRows.length} evidence-backed opportunities and pruned ${unpublishedSlugs.length} unsourced entries.`);
}

function required(name: string) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
