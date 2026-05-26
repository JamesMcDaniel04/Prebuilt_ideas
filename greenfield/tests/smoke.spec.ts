import { test, expect } from "@playwright/test";

/**
 * Shell-rendering smoke tests.
 *
 * These run against the dev server with placeholder Supabase creds. They verify
 * that every route mounts and renders its chrome — they do NOT assert against
 * any backend-fetched content (since the backend is unreachable in this mode).
 */

test.describe("Marketing landing (/)", () => {
  test("demo-mode banner renders when no .env", async ({ page }) => {
    await page.goto("/");
    // Multiple "Demo mode" matches exist (banner + FAQ answer); we just need the banner.
    await expect(page.getByText(/Demo mode/i).first()).toBeVisible();
  });

  test("hero, featured cards, pricing tiers, and FAQ all render", async ({ page }) => {
    await page.goto("/");
    // Hero
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/startup/i);
    await expect(page.getByRole("link", { name: /Get instant access/i }).first()).toBeVisible();
    // Featured opportunity (one of the fixture titles)
    await expect(page.getByRole("heading", { name: /Workflow OS for solo CPAs/i })).toBeVisible();
    // Pricing section — all three self-serve tiers visible
    await expect(page.getByRole("heading", { name: /^Scout$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Entrepreneur$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Venture Studio$/ })).toBeVisible();
    await expect(page.getByText("$97").first()).toBeVisible();
    await expect(page.getByText("$197").first()).toBeVisible();
    await expect(page.getByText("$12,000").first()).toBeVisible();
    // No free tier
    await expect(page.getByText("$0")).toHaveCount(0);
    // FAQ
    await expect(page.getByText(/Where do the opportunities come from/i)).toBeVisible();
  });

  test("top nav shows Sign in + Get started when signed out", async ({ page }) => {
    await page.goto("/");
    // Footer also has a Sign in link — scope to the header.
    const banner = page.getByRole("banner");
    await expect(banner.getByRole("link", { name: /^Sign in$/ })).toBeVisible();
    await expect(banner.getByRole("link", { name: /^Get started$/ })).toBeVisible();
  });

  test("hero CTA navigates to signup", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Get instant access/i }).first().click();
    await expect(page).toHaveURL(/\/auth\?mode=signup/);
  });
});

test.describe("Catalogue (/browse)", () => {
  test("renders the hero and filter bar", async ({ page }) => {
    await page.goto("/browse");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Opportunities");
    await expect(page.getByPlaceholder(/Search opportunities/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Industry$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Audience$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Difficulty$/ })).toBeVisible();
  });

  test("filter chip opens a menu with options", async ({ page }) => {
    await page.goto("/browse");
    await page.getByRole("button", { name: /^Difficulty$/ }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menu").getByText("Easy")).toBeVisible();
    await expect(page.getByRole("menu").getByText("Expert")).toBeVisible();
  });

  test("shows sample opportunity cards", async ({ page }) => {
    await page.goto("/browse");
    await expect(page.getByRole("heading", { name: /Workflow OS for solo CPAs/i })).toBeVisible();
    await expect(page.getByText(/\d+ opportunities/i).first()).toBeVisible();
  });

  test("claiming an opportunity hides it from /browse (demo mode)", async ({ page }) => {
    // Make sure we start from a clean localStorage so prior runs don't pollute.
    await page.goto("/browse");
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
    });
    await page.reload();

    const opp = "Workflow OS for solo CPAs";
    await expect(page.getByRole("heading", { name: opp })).toBeVisible();

    await page.goto("/opportunity/solo-cpa-workflow-os");
    await page.getByRole("button", { name: /^Claim idea$/ }).first().click();

    await page.goto("/browse");
    await expect(page.getByRole("heading", { name: opp })).toHaveCount(0);
    await expect(page.getByText(/1 hidden \(claimed by you\)/)).toBeVisible();

    // Cleanup for subsequent tests.
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
    });
  });
});

test.describe("YC requests", () => {
  test("/yc-requests filters the catalogue to YC-seeded entries", async ({ page }) => {
    await page.goto("/yc-requests");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/YC/);
    await expect(page.getByRole("heading", { name: /immigration firm for startup/i })).toBeVisible();
  });
});

test.describe("Detail page", () => {
  test("opportunity detail renders all sections from fixtures", async ({ page }) => {
    await page.goto("/opportunity/solo-cpa-workflow-os");
    await expect(page.getByRole("heading", { level: 1, name: /Workflow OS for solo CPAs/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^The gap$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^The play$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Why now$/i })).toBeVisible();
  });
});

test.describe("Pricing", () => {
  test("/pricing shows Scout, Entrepreneur, Venture Studio + University", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /^Scout$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Entrepreneur$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Venture Studio$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /University/i })).toBeVisible();
    await expect(page.getByText("$97").first()).toBeVisible();
    await expect(page.getByText("$197").first()).toBeVisible();
    await expect(page.getByText("$12,000").first()).toBeVisible();
    await expect(page.getByText("$0")).toHaveCount(0);
  });
});

test.describe("Auth", () => {
  test("/auth renders sign-in form by default", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /Continue with Google/i })).toBeVisible();
  });

  test("/auth?mode=signup renders sign-up form", async ({ page }) => {
    await page.goto("/auth?mode=signup");
    await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
  });

  test("/auth toggles between sign-in and sign-up", async ({ page }) => {
    await page.goto("/auth?mode=signin");
    await page.getByRole("button", { name: /^Create one$/ }).click();
    await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
  });
});

test.describe("Auth-gated routes", () => {
  test("/saved shows demo-mode empty state when Supabase isn't configured", async ({ page }) => {
    await page.goto("/saved");
    await expect(page.getByRole("heading", { name: /Your saved opportunities/i })).toBeVisible();
    await expect(page.getByText(/Saved lists need an account/i)).toBeVisible();
  });

  test("/admin redirects to /auth when signed out", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/auth/);
  });
});

test.describe("Agents workspace", () => {
  test("/agents shows empty state with no active claim", async ({ page }) => {
    await page.goto("/browse");
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
      localStorage.removeItem("greenfield.demoAgentRuns");
    });
    await page.goto("/agents");
    await expect(page.getByText(/No claimed idea yet/i)).toBeVisible();
  });

  test("claim an idea then open /agents → see the 4-agent team + Run buttons", async ({ page }) => {
    await page.goto("/browse");
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
      localStorage.removeItem("greenfield.demoAgentRuns");
    });
    await page.goto("/opportunity/solo-cpa-workflow-os");
    await page.getByRole("button", { name: /^Claim idea$/ }).first().click();

    await page.goto("/agents");
    // Idea title rendered as the active claim
    await expect(page.getByRole("heading", { name: /Workflow OS for solo CPAs/i }).first()).toBeVisible();
    // All 4 agent role chips
    for (const label of ["GTM", "Sales", "Marketing", "Engineering"]) {
      await expect(page.getByRole("button", { name: new RegExp(`^${label}$`) }).first()).toBeVisible();
    }
    // Run button visible on the default selected agent (GTM)
    await expect(page.getByRole("button", { name: /^Run agent$/ }).first()).toBeVisible();

    // Cleanup
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
      localStorage.removeItem("greenfield.demoAgentRuns");
    });
  });
});

test.describe("Workflows", () => {
  test("/workflows lists library cards", async ({ page }) => {
    await page.goto("/workflows");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Workflow/i);
    await expect(page.getByRole("heading", { name: /ICP wedge builder/i })).toBeVisible();
  });

  test("workflow detail renders steps + Run button (no claim)", async ({ page }) => {
    await page.goto("/browse");
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
      localStorage.removeItem("greenfield.demoWorkflowRuns");
    });

    await page.goto("/workflows/icp-wedge-builder");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/ICP wedge builder/i);
    // Step cards
    await expect(page.getByRole("heading", { name: /Agent handoff/i })).toBeVisible();
    // Without a claim, the CTA renders as a link to /browse (Button asChild)
    await expect(page.getByRole("link", { name: /Claim an idea to run this/i }).first()).toBeVisible();
  });

  test("Run button updates after claiming an idea", async ({ page }) => {
    await page.goto("/browse");
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
      localStorage.removeItem("greenfield.demoWorkflowRuns");
    });
    await page.goto("/opportunity/solo-cpa-workflow-os");
    await page.getByRole("button", { name: /^Claim idea$/ }).first().click();

    await page.goto("/workflows/icp-wedge-builder");
    await expect(page.getByRole("button", { name: /Run on Workflow OS for solo CPAs/i }).first()).toBeVisible();

    // Cleanup
    await page.evaluate(() => {
      localStorage.removeItem("greenfield.claimedIdeas");
      localStorage.removeItem("greenfield.activeClaimSlug");
      localStorage.removeItem("greenfield.demoWorkflowRuns");
    });
  });
});

test.describe("Team workspace (/team)", () => {
  test("/team shows the demo notice when Supabase isn't configured", async ({ page }) => {
    await page.goto("/team");
    await expect(page.getByRole("heading", { name: /Team workspace needs Supabase/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /See Venture Studio plan/i })).toBeVisible();
  });
});

test.describe("Misc", () => {
  test("unknown route renders the 404", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Off the trail/i })).toBeVisible();
  });

  test("logo link returns to /", async ({ page }) => {
    await page.goto("/pricing");
    await page.getByRole("link", { name: /Greenfield/ }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
