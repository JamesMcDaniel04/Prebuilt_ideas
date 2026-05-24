# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Public shell >> /pricing shows Free and Pro tiers
- Location: tests/smoke.spec.ts:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^Pricing$/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /^Pricing$/ })

```

```yaml
- text: "[plugin:vite:css] Failed to load PostCSS config (searchPath: /Users/jamesmcdaniel/Prebuilt_ideas/greenfield): [Error] Loading PostCSS Plugin failed: Cannot find module 'tailwindcss' Require stack: - /Users/jamesmcdaniel/Prebuilt_ideas/greenfield/postcss.config.js (@/Users/jamesmcdaniel/Prebuilt_ideas/greenfield/postcss.config.js) Error: Loading PostCSS Plugin failed: Cannot find module 'tailwindcss' Require stack: - /Users/jamesmcdaniel/Prebuilt_ideas/greenfield/postcss.config.js (@/Users/jamesmcdaniel/Prebuilt_ideas/greenfield/postcss.config.js) at load (file:///Users/jamesmcdaniel/Prebuilt_ideas/greenfield/node_modules/vite/dist/node/chunks/node.js:19655:10) at async Promise.all (index 0) at async plugins (file:///Users/jamesmcdaniel/Prebuilt_ideas/greenfield/node_modules/vite/dist/node/chunks/node.js:19677:11) at async processResult (file:///Users/jamesmcdaniel/Prebuilt_ideas/greenfield/node_modules/vite/dist/node/chunks/node.js:19715:13) /Users/jamesmcdaniel/Prebuilt_ideas/greenfield/src/index.css Click outside, press Esc key, or fix the code to dismiss. You can also disable this overlay by setting"
- code: server.hmr.overlay
- text: to
- code: "false"
- text: in
- code: vite.config.ts
- text: .
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * Shell-rendering smoke tests.
  5  |  *
  6  |  * These run against the dev server with placeholder Supabase creds. They verify
  7  |  * that every route mounts and renders its chrome — they do NOT assert against
  8  |  * any backend-fetched content (since the backend is unreachable in this mode).
  9  |  */
  10 | 
  11 | test.describe("Public shell", () => {
  12 |   test("/ renders the hero and filter sidebar", async ({ page }) => {
  13 |     await page.goto("/");
  14 |     await expect(page.getByRole("heading", { level: 1 })).toContainText("Opportunities");
  15 |     await expect(page.getByPlaceholder(/Search opportunities/i)).toBeVisible();
  16 |     // Filter group headings
  17 |     await expect(page.getByText(/^Industry$/)).toBeVisible();
  18 |     await expect(page.getByText(/^Audience$/)).toBeVisible();
  19 |     await expect(page.getByText(/^Difficulty$/)).toBeVisible();
  20 |   });
  21 | 
  22 |   test("/pricing shows Free and Pro tiers", async ({ page }) => {
  23 |     await page.goto("/pricing");
> 24 |     await expect(page.getByRole("heading", { name: /^Pricing$/ })).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  25 |     await expect(page.getByRole("heading", { name: /^Free$/ })).toBeVisible();
  26 |     await expect(page.getByRole("heading", { name: /^Pro$/ })).toBeVisible();
  27 |     await expect(page.getByText("$0")).toBeVisible();
  28 |     await expect(page.getByText("$24")).toBeVisible();
  29 |   });
  30 | 
  31 |   test("/auth renders sign-in form by default", async ({ page }) => {
  32 |     await page.goto("/auth");
  33 |     await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
  34 |     await expect(page.getByLabel("Email")).toBeVisible();
  35 |     await expect(page.getByLabel("Password")).toBeVisible();
  36 |     await expect(page.getByRole("button", { name: /Continue with Google/i })).toBeVisible();
  37 |   });
  38 | 
  39 |   test("/auth?mode=signup renders sign-up form", async ({ page }) => {
  40 |     await page.goto("/auth?mode=signup");
  41 |     await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
  42 |   });
  43 | 
  44 |   test("/auth toggles between sign-in and sign-up", async ({ page }) => {
  45 |     await page.goto("/auth?mode=signin");
  46 |     await page.getByRole("button", { name: /^Create one$/ }).click();
  47 |     await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
  48 |   });
  49 | 
  50 |   test("unknown route renders the 404", async ({ page }) => {
  51 |     await page.goto("/this-page-does-not-exist");
  52 |     await expect(page.getByText("404")).toBeVisible();
  53 |     await expect(page.getByRole("heading", { name: /Off the trail/i })).toBeVisible();
  54 |   });
  55 | });
  56 | 
  57 | test.describe("Auth-gated redirects", () => {
  58 |   test("/saved redirects to /auth when signed out", async ({ page }) => {
  59 |     await page.goto("/saved");
  60 |     await expect(page).toHaveURL(/\/auth/);
  61 |   });
  62 | 
  63 |   test("/admin redirects to /auth when signed out", async ({ page }) => {
  64 |     await page.goto("/admin");
  65 |     await expect(page).toHaveURL(/\/auth/);
  66 |   });
  67 | });
  68 | 
  69 | test.describe("Header navigation", () => {
  70 |   test("logo link returns to /", async ({ page }) => {
  71 |     await page.goto("/pricing");
  72 |     await page.getByRole("link", { name: /Greenfield/ }).first().click();
  73 |     await expect(page).toHaveURL("http://localhost:5174/");
  74 |   });
  75 | 
  76 |   test("signed-out header shows Sign in + Get started", async ({ page }) => {
  77 |     await page.goto("/");
  78 |     await expect(page.getByRole("link", { name: /Sign in/i })).toBeVisible();
  79 |     await expect(page.getByRole("link", { name: /Get started/i })).toBeVisible();
  80 |   });
  81 | });
  82 | 
```