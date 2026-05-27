/**
 * Local seed of the Career track and its projects. Mirrors the SQL seed in
 * migration 0015 so the UI can render the track/project surface in demo mode
 * (no Supabase) and the rubric / anti-cheat copy lives in one auditable place.
 *
 * The DB row is the source of truth at runtime when Supabase is configured;
 * this file is the source the migration was generated from.
 */

import type {
  AntiCheatQuestion,
  CareerProject,
  CareerTrack,
  RubricCriterion,
} from "@/lib/types";

export const CAREER_TRACK_AI_AUTOMATION_SPECIALIST: CareerTrack = {
  slug: "ai-automation-specialist",
  title: "AI Automation Specialist",
  target_role: "AI Automation Specialist",
  summary:
    "Build 5 production-grade AI automation systems. Get evaluated like a junior AI engineer would be. Leave with a verified portfolio employers can actually trust.",
  hero_promise:
    "In 30 days, build 5 AI automation projects and walk away with a verified portfolio for AI Automation Specialist roles.",
  est_duration: "~30 days",
  project_count: 5,
  is_active: true,
  created_at: "2026-05-27T00:00:00Z",
};

const RUBRIC_RAG: RubricCriterion[] = [
  { id: "grounding", criterion: "Answers are grounded in retrieved chunks with visible citations", weight: 3, pass_threshold: 3, max: 5 },
  { id: "chunking_quality", criterion: "Chunking strategy fits the corpus and is defended in writing", weight: 2, pass_threshold: 3, max: 5 },
  { id: "deploy", criterion: "Bot is reachable at a live URL and answers a held-out test query correctly", weight: 3, pass_threshold: 3, max: 5 },
  { id: "failure_analysis", criterion: "Learner identifies a concrete failure case and a credible fix", weight: 2, pass_threshold: 3, max: 5 },
];

const ANTI_CHEAT_RAG: AntiCheatQuestion[] = [
  { id: "chunking", prompt: "How did you chunk the source documents, and what tradeoff did your chunk size close?", min_words: 80 },
  { id: "retrieval", prompt: "Walk through one query end-to-end: what gets embedded, what the retriever returns, and how you handled a near-miss.", min_words: 120 },
  { id: "failure", prompt: "Describe one query where your bot was wrong. Why was it wrong, and what would you change to fix it without ballooning context?", min_words: 100 },
];

const RUBRIC_SALES: RubricCriterion[] = [
  { id: "end_to_end", criterion: "Automation runs end-to-end: trigger → research → extraction → CRM write", weight: 3, pass_threshold: 3, max: 5 },
  { id: "validation", criterion: "Extracted fields are validated before write-back", weight: 3, pass_threshold: 3, max: 5 },
  { id: "observability", criterion: "Run logs / audit trail exist for every automated write", weight: 2, pass_threshold: 3, max: 5 },
  { id: "failure_handling", criterion: "Failure modes are anticipated and contained", weight: 2, pass_threshold: 3, max: 5 },
];

const ANTI_CHEAT_SALES: AntiCheatQuestion[] = [
  { id: "trigger", prompt: "What triggers your automation, and why is that trigger reliable in production?", min_words: 80 },
  { id: "extraction", prompt: "Show one extracted record and explain how you'd validate the model's output before writing to the CRM.", min_words: 120 },
  { id: "failure_mode", prompt: "What is the worst-case failure of this automation, and how does your code prevent it from silently corrupting the CRM?", min_words: 120 },
];

const RUBRIC_MEETING: RubricCriterion[] = [
  { id: "ingest", criterion: "Real audio or transcript ingestion works (not hand-typed input)", weight: 2, pass_threshold: 3, max: 5 },
  { id: "faithfulness", criterion: "Summaries reflect the source; action items have source quotes", weight: 3, pass_threshold: 3, max: 5 },
  { id: "delivery", criterion: "Summary is delivered to at least one real destination (email/Slack/Notion)", weight: 2, pass_threshold: 3, max: 5 },
  { id: "prod_design", criterion: "Production constraints (cost, latency, privacy) are addressed in writing", weight: 3, pass_threshold: 3, max: 5 },
];

const ANTI_CHEAT_MEETING: AntiCheatQuestion[] = [
  { id: "faithfulness", prompt: "How do you keep the summary faithful to the source and not invent action items?", min_words: 100 },
  { id: "action_items", prompt: "Show one extracted action item with its source quote. How would you handle a meeting that has no real action items?", min_words: 80 },
  { id: "prod_constraints", prompt: "What are the production constraints (cost, latency, privacy) and how did your design choices address them?", min_words: 120 },
];

const RUBRIC_KB: RubricCriterion[] = [
  { id: "sources", criterion: "At least 2 real sources are wired up", weight: 2, pass_threshold: 3, max: 5 },
  { id: "freshness", criterion: "Incremental refresh is implemented (not full re-index every run)", weight: 2, pass_threshold: 3, max: 5 },
  { id: "auth", criterion: "User auth + per-source permissions are respected", weight: 3, pass_threshold: 3, max: 5 },
  { id: "answer_quality", criterion: "At least one demo query combines info across sources correctly", weight: 3, pass_threshold: 3, max: 5 },
];

const ANTI_CHEAT_KB: AntiCheatQuestion[] = [
  { id: "sources", prompt: "List your sources and explain how you keep them fresh without re-indexing everything every time.", min_words: 120 },
  { id: "auth", prompt: "Walk through how a user authenticates and what they're authorized to see. What happens if a doc's permissions change after indexing?", min_words: 120 },
  { id: "answer_quality", prompt: "Show one query where the answer required combining info from two sources. Why does combination work here?", min_words: 100 },
];

const RUBRIC_PROD: RubricCriterion[] = [
  { id: "product_scope", criterion: "Product has a clear user, a clear job, and a working flow end-to-end", weight: 3, pass_threshold: 3, max: 5 },
  { id: "auth_db", criterion: "Real auth + persistent DB are wired up (not in-memory)", weight: 2, pass_threshold: 3, max: 5 },
  { id: "evals", criterion: "An eval harness exists, runs against the AI feature, and has caught at least one regression", weight: 3, pass_threshold: 3, max: 5 },
  { id: "deploy", criterion: "App is live at a real URL; a guest user can complete the core flow", weight: 2, pass_threshold: 3, max: 5 },
];

const ANTI_CHEAT_PROD: AntiCheatQuestion[] = [
  { id: "product", prompt: "What does the product do and who is the target user? Be specific about the smallest useful version.", min_words: 80 },
  { id: "eval", prompt: "Describe your eval harness. What does pass/fail look like, how often does it run, and what did it catch?", min_words: 150 },
  { id: "tradeoffs", prompt: "What did you cut from v1 to ship, and why was that the right cut?", min_words: 100 },
];

const ARTIFACTS = ["repo_url", "deploy_url", "demo_url"];

export const CAREER_PROJECTS: CareerProject[] = [
  {
    slug: "rag-customer-support-bot",
    track_slug: "ai-automation-specialist",
    ordinal: 1,
    title: "RAG customer support chatbot",
    summary: "A customer-support chatbot that answers from a private knowledge base. Retrieval over a real docs corpus, grounded answers with citations, and a deployed demo.",
    hireable_skill: "Retrieval-augmented generation (RAG) over private docs",
    required_artifacts: ARTIFACTS,
    anti_cheat_questions: ANTI_CHEAT_RAG,
    rubric: RUBRIC_RAG,
    starter_brief_md: null,
    is_active: true,
    created_at: "2026-05-27T00:00:00Z",
  },
  {
    slug: "sales-research-crm-automation",
    track_slug: "ai-automation-specialist",
    ordinal: 2,
    title: "Sales research + CRM automation",
    summary: "An agent that researches inbound leads, enriches them, and updates a CRM. Web search + structured extraction + an API write. The kind of automation a real revenue team would deploy.",
    hireable_skill: "Agent-driven research + structured data extraction + write-back to a CRM",
    required_artifacts: ARTIFACTS,
    anti_cheat_questions: ANTI_CHEAT_SALES,
    rubric: RUBRIC_SALES,
    starter_brief_md: null,
    is_active: true,
    created_at: "2026-05-27T00:00:00Z",
  },
  {
    slug: "ai-meeting-summarizer",
    track_slug: "ai-automation-specialist",
    ordinal: 3,
    title: "AI meeting summarizer",
    summary: "Takes a meeting recording or transcript, produces a faithful summary + action items, and ships the summary to a destination (email, Slack, Notion).",
    hireable_skill: "Audio/transcript ingestion + structured summarization + delivery",
    required_artifacts: ARTIFACTS,
    anti_cheat_questions: ANTI_CHEAT_MEETING,
    rubric: RUBRIC_MEETING,
    starter_brief_md: null,
    is_active: true,
    created_at: "2026-05-27T00:00:00Z",
  },
  {
    slug: "internal-kb-assistant",
    track_slug: "ai-automation-specialist",
    ordinal: 4,
    title: "Internal knowledge-base assistant",
    summary: "A multi-source assistant that answers from a company's internal docs (Notion + Slack + Drive, or real equivalents). Real auth, real sources, real freshness handling.",
    hireable_skill: "Multi-source retrieval + auth + freshness handling",
    required_artifacts: ARTIFACTS,
    anti_cheat_questions: ANTI_CHEAT_KB,
    rubric: RUBRIC_KB,
    starter_brief_md: null,
    is_active: true,
    created_at: "2026-05-27T00:00:00Z",
  },
  {
    slug: "production-ai-app",
    track_slug: "ai-automation-specialist",
    ordinal: 5,
    title: "Production AI app with auth, database, and evals",
    summary: "A small but real product: AI feature, user auth, persistent database, and a written eval harness for the AI part. The capstone — proves you can ship.",
    hireable_skill: "Full-stack AI app + auth + DB + evals",
    required_artifacts: ARTIFACTS,
    anti_cheat_questions: ANTI_CHEAT_PROD,
    rubric: RUBRIC_PROD,
    starter_brief_md: null,
    is_active: true,
    created_at: "2026-05-27T00:00:00Z",
  },
];

export const CAREER_TRACKS_SEED: CareerTrack[] = [CAREER_TRACK_AI_AUTOMATION_SPECIALIST];

export function seedProjectsForTrack(trackSlug: string): CareerProject[] {
  return CAREER_PROJECTS.filter((p) => p.track_slug === trackSlug).sort((a, b) => a.ordinal - b.ordinal);
}

export function seedProjectBySlug(slug: string): CareerProject | null {
  return CAREER_PROJECTS.find((p) => p.slug === slug) ?? null;
}
