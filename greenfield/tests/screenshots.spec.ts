import { test } from "@playwright/test";

/**
 * Generates screenshots into ./screenshots/ for documentation.
 * Run with: npx playwright test tests/screenshots.spec.ts
 */

const PAGES = [
  { name: "01-browse",   path: "/" },
  { name: "02-pricing",  path: "/pricing" },
  { name: "03-auth-signin", path: "/auth?mode=signin" },
  { name: "04-auth-signup", path: "/auth?mode=signup" },
  { name: "05-not-found", path: "/this-route-does-not-exist" },
];

for (const p of PAGES) {
  test(`screenshot ${p.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.path);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `screenshots/${p.name}.png`, fullPage: true });
  });
}
