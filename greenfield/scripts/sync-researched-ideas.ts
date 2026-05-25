import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

import { RESEARCH_OPPORTUNITIES } from "../src/lib/researchedIdeas";

const SUPABASE_URL = required("VITE_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = required("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const rows = RESEARCH_OPPORTUNITIES.map((opp) => ({
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
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Upserted ${rows.length} researched opportunities.`);
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
