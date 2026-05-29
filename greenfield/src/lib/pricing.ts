import type { PlanTier } from "@/lib/types";

export type PricingTier = {
  plan: PlanTier;
  name: string;
  /** Display price like "$199". */
  priceLabel: string;
  per: string;
  /** Optional sub-line under the price (e.g. "About $17/month"). */
  priceFootnote?: string;
  tagline: string;
  features: string[];
  /** True for the visually highlighted "recommended" tier. */
  highlight?: boolean;
  /** True when the tier sells by contact rather than self-serve checkout. */
  contactOnly?: boolean;
  cta: string;
  seat_limit: number;
  /** Included Career-track agent runs (mentor + evaluator) per month. 0 means Career is locked. */
  career_runs_per_month_quota: number;
};

export const CAREER_TIER: PricingTier = {
  plan: "career",
  name: "Career",
  priceLabel: "$199",
  per: "/ year",
  priceFootnote: "About $17/month",
  tagline: "Become a verifiable AI Automation Specialist.",
  features: [
    "AI Automation Specialist track (5 hireable projects)",
    "60 mentor + evaluator agent runs / month",
    "Rubric-based grading with specific feedback",
    "Verified public portfolio at /portfolio/your-name",
    "Optional human review for borderline scores",
  ],
  highlight: true,
  cta: "Start the track",
  seat_limit: 1,
  career_runs_per_month_quota: 60,
};

export const TIERS: PricingTier[] = [CAREER_TIER];

/** Partial — a plan with no paid tier (e.g. the free `scout` default) returns undefined. */
export const TIER_BY_PLAN: Partial<Record<PlanTier, PricingTier>> = TIERS.reduce(
  (acc, t) => {
    acc[t.plan] = t;
    return acc;
  },
  {} as Partial<Record<PlanTier, PricingTier>>,
);
