/**
 * Tool definitions for the run-agent edge function.
 *
 * Five shared tools (all four agent roles can call them):
 *   - read_opportunity_brief: returns the claim's opportunity context + cached build brief
 *   - read_signals:           returns recent cited research signals for the opportunity
 *   - web_search:             Brave Search API (key: BRAVE_API_KEY); falls back to SerpAPI if BRAVE not set
 *   - fetch_url:              fetches a URL and returns plain-text body (truncated)
 *   - save_note:              persists a structured note into agent_runs.tool_calls metadata
 *
 * Plus four role-specific tools (Phase 3 — flagged for later):
 *   - GTM:        find_competitors
 *   - Sales:      find_companies (Apollo/Clearbit, optional key)
 *   - Marketing:  keyword_volume
 *   - Engineering: search_github
 *
 * Each tool times out after TOOL_TIMEOUT_MS and returns { error, hint } on
 * failure so the model can see and recover from problems.
 */

// @ts-expect-error — Deno-style URL imports resolve at runtime
import { type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOOL_TIMEOUT_MS = 15_000;
const MAX_URL_BYTES   = 60_000;       // truncate fetch_url responses

export type ToolContext = {
  claim_id: string;
  opportunity_id: string;
  opportunity_slug: string;
  admin: SupabaseClient;
  // @ts-expect-error — Deno global at runtime
  env: typeof Deno.env;
};

export type ToolDefinition = {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  exec: (input: Record<string, unknown>, ctx: ToolContext) => Promise<unknown>;
};

// ─────────────────────────────────────────────────────────────────────────
// Shared tools
// ─────────────────────────────────────────────────────────────────────────

export const TOOLS: ToolDefinition[] = [
  {
    name: "read_opportunity_brief",
    description:
      "Read the full opportunity context (title, one_liner, gap, play, market, " +
      "timing, build_path, classifications) plus the cached Markdown build brief, " +
      "if one exists. Call this at the start of a session to ground yourself.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
    exec: async (_input, ctx) => {
      const { data: opp, error: oppErr } = await ctx.admin
        .from("opportunities")
        .select(
          "title, one_liner, the_gap, the_play, market_size_summary, " +
          "timing_rationale, build_path, model_type, audience, industry, niche, " +
          "revenue_ceiling, founder_path, difficulty, starting_capital, " +
          "time_to_launch, build_stack_hint, moat, distribution_play, demand_trend",
        )
        .eq("id", ctx.opportunity_id)
        .maybeSingle();
      if (oppErr || !opp) return { error: "Opportunity not found" };

      const { data: brief } = await ctx.admin
        .from("build_briefs")
        .select("markdown, model, generated_at")
        .eq("opportunity_id", ctx.opportunity_id)
        .maybeSingle();

      return { opportunity: opp, build_brief: brief ?? null };
    },
  },
  {
    name: "read_signals",
    description:
      "Read recent cited research signals (TechCrunch / Reddit / HN / etc.) " +
      "attached to this opportunity. Use these to ground claims in real, dated " +
      "sources rather than speculation. Pass limit (default 10).",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
      additionalProperties: false,
    },
    exec: async (input, ctx) => {
      const limit = Math.min(Number(input.limit ?? 10), 50);
      const { data, error } = await ctx.admin
        .from("opportunity_signals")
        .select("source_type, url, title, snippet, published_at")
        .eq("opportunity_id", ctx.opportunity_id)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) return { error: error.message };
      return { signals: data ?? [] };
    },
  },
  {
    name: "web_search",
    description:
      "Search the public web. Use for fresh market info, competitor research, " +
      "and recent news. Returns top results with title, url, and snippet.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 2, maxLength: 200 },
        num_results: { type: "integer", minimum: 1, maximum: 10, default: 5 },
      },
      required: ["query"],
      additionalProperties: false,
    },
    exec: async (input, ctx) => {
      const query = String(input.query ?? "").trim();
      const n = Math.min(Number(input.num_results ?? 5), 10);
      if (!query) return { error: "query required" };

      const braveKey = ctx.env.get("BRAVE_API_KEY");
      const serpKey  = ctx.env.get("SERPAPI_API_KEY");

      if (braveKey) {
        const url = new URL("https://api.search.brave.com/res/v1/web/search");
        url.searchParams.set("q", query);
        url.searchParams.set("count", String(n));
        const res = await fetch(url, {
          headers: { "X-Subscription-Token": braveKey, "Accept": "application/json" },
        });
        if (!res.ok) return { error: `Brave search ${res.status}` };
        const json = await res.json() as { web?: { results?: Array<{ title: string; url: string; description: string }> } };
        const results = (json.web?.results ?? []).slice(0, n).map((r) => ({
          title: r.title, url: r.url, snippet: r.description,
        }));
        return { provider: "brave", query, results };
      }

      if (serpKey) {
        const url = new URL("https://serpapi.com/search.json");
        url.searchParams.set("q", query);
        url.searchParams.set("num", String(n));
        url.searchParams.set("api_key", serpKey);
        const res = await fetch(url);
        if (!res.ok) return { error: `SerpAPI ${res.status}` };
        const json = await res.json() as { organic_results?: Array<{ title: string; link: string; snippet: string }> };
        const results = (json.organic_results ?? []).slice(0, n).map((r) => ({
          title: r.title, url: r.link, snippet: r.snippet,
        }));
        return { provider: "serpapi", query, results };
      }

      return {
        error: "web_search unavailable: set BRAVE_API_KEY or SERPAPI_API_KEY",
        hint: "Carry on using read_signals + read_opportunity_brief, and recommend the founder run their own search.",
      };
    },
  },
  {
    name: "fetch_url",
    description:
      "Fetch a URL and return its body as plain text (HTML stripped, truncated " +
      `to ${MAX_URL_BYTES} bytes). Use to read articles, blog posts, or docs ` +
      "that web_search surfaced.",
    input_schema: {
      type: "object",
      properties: { url: { type: "string", pattern: "^https?://" } },
      required: ["url"],
      additionalProperties: false,
    },
    exec: async (input) => {
      const url = String(input.url ?? "");
      if (!/^https?:\/\//.test(url)) return { error: "url must be http(s)" };
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "GreenfieldAgent/1.0 (+hello@greenfield.app)" },
          redirect: "follow",
        });
        if (!res.ok) return { error: `fetch ${res.status}`, status: res.status };
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.startsWith("text/") && !ct.includes("html") && !ct.includes("json")) {
          return { error: `unsupported content-type ${ct}` };
        }
        let text = await res.text();
        if (ct.includes("html")) {
          text = text
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        }
        const truncated = text.length > MAX_URL_BYTES;
        return {
          url,
          status: res.status,
          content: truncated ? text.slice(0, MAX_URL_BYTES) : text,
          truncated,
        };
      } catch (e) {
        return { error: (e as Error).message };
      }
    },
  },
  {
    name: "save_note",
    description:
      "Save a structured note that will appear on the run's timeline. Use this " +
      "for explicit handoffs to other agents on the team (e.g. \"GTM -> Sales: " +
      "5 target accounts attached\") or to bookmark a finding worth re-using.",
    input_schema: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["handoff", "insight", "todo", "decision"] },
        title: { type: "string", minLength: 1, maxLength: 200 },
        body: { type: "string", maxLength: 4000 },
      },
      required: ["kind", "title"],
      additionalProperties: false,
    },
    // save_note is a no-op exec; the run loop captures the call in tool_calls.
    // (We could write to a separate agent_notes table later — for v1 it's enough
    // to surface the note in the run's tool-call timeline.)
    exec: async (input) => ({
      saved: true,
      kind: String(input.kind),
      title: String(input.title),
      body: input.body ? String(input.body) : null,
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Tool runner with per-call timeout + error capture
// ─────────────────────────────────────────────────────────────────────────

export async function executeTool(
  tool: ToolDefinition,
  input: Record<string, unknown>,
  ctx: ToolContext,
): Promise<{ result: unknown; duration_ms: number }> {
  const started = Date.now();
  try {
    const result = await Promise.race([
      tool.exec(input, ctx),
      new Promise<{ error: string }>((_, reject) =>
        setTimeout(() => reject(new Error(`tool ${tool.name} timed out after ${TOOL_TIMEOUT_MS}ms`)), TOOL_TIMEOUT_MS),
      ),
    ]);
    return { result, duration_ms: Date.now() - started };
  } catch (e) {
    return {
      result: { error: (e as Error).message },
      duration_ms: Date.now() - started,
    };
  }
}
