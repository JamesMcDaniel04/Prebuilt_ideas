export type PlanTier = "scout" | "career";

export type Team = {
  id: string;
  name: string;
  plan: PlanTier;
  seat_limit: number;
  stripe_subscription_id: string | null;
  created_at: string;
};

export type TeamMember = {
  team_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
};

export type AgentRunStatus = "queued" | "running" | "succeeded" | "failed";

export type AgentToolCall = {
  /** Tool name e.g. "web_search". */
  name: string;
  /** What the model passed to the tool. */
  input: Record<string, unknown>;
  /** What the tool returned. May contain { error } when a tool failed. */
  result: unknown;
  /** Milliseconds the tool took to execute. */
  duration_ms?: number;
};

export type AgentRun = {
  id: string;
  submission_id: string | null;
  agent_role: "mentor" | "evaluator";
  status: AgentRunStatus;
  prompt: string;
  output_markdown: string | null;
  tool_calls: AgentToolCall[];
  model: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  started_at: string;
  completed_at: string | null;
  error: string | null;
};

export type Profile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_pro: boolean;
  is_admin: boolean;
  pro_since: string | null;
  stripe_customer_id: string | null;
  personal_team_id: string | null;
  plan: PlanTier;
  created_at: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Career: tracks, projects, enrollments, submissions, evaluations, portfolio
// ─────────────────────────────────────────────────────────────────────────

export type RubricCriterion = {
  id: string;
  criterion: string;
  weight: number;
  pass_threshold: number;
  max: number;
};

export type RubricScore = {
  criterion_id: string;
  score: number;
  max: number;
  notes?: string;
};

export type AntiCheatQuestion = {
  id: string;
  prompt: string;
  min_words: number;
};

export type CareerTrack = {
  slug: string;
  title: string;
  target_role: string;
  summary: string;
  hero_promise: string;
  est_duration: string;
  project_count: number;
  is_active: boolean;
  created_at: string;
};

export type CareerProject = {
  slug: string;
  track_slug: string;
  ordinal: number;
  title: string;
  summary: string;
  hireable_skill: string;
  required_artifacts: string[];
  anti_cheat_questions: AntiCheatQuestion[];
  rubric: RubricCriterion[];
  starter_brief_md: string | null;
  is_active: boolean;
  created_at: string;
};

export type CareerEnrollmentStatus = "active" | "completed" | "paused" | "withdrawn";

export type CareerEnrollment = {
  id: string;
  user_id: string;
  track_slug: string;
  started_at: string;
  completed_at: string | null;
  status: CareerEnrollmentStatus;
};

export type CareerSubmissionStatus =
  | "draft"
  | "submitted"
  | "grading"
  | "passed"
  | "needs_revision"
  | "failed"
  | "withdrawn";

export type CareerSubmission = {
  id: string;
  enrollment_id: string;
  project_slug: string;
  repo_url: string | null;
  deploy_url: string | null;
  demo_url: string | null;
  written_answers: Record<string, string>;
  status: CareerSubmissionStatus;
  attempt_no: number;
  submitted_at: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HumanReviewState = "none" | "requested" | "in_review" | "approved" | "rejected";

export type CareerSubmissionEvaluation = {
  id: string;
  submission_id: string;
  evaluator_agent_run_id: string | null;
  rubric_scores: RubricScore[];
  overall_pass: boolean;
  model_feedback_md: string | null;
  human_reviewer_id: string | null;
  human_review_state: HumanReviewState;
  human_review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type CareerPortfolioProfile = {
  user_id: string;
  username: string;
  headline: string | null;
  bio: string | null;
  is_public: boolean;
  verified_track_slugs: string[];
  human_verified_track_slugs: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerUsageRow = {
  team_id: string;
  year_month: string;
  runs_used: number;
  updated_at: string;
};
