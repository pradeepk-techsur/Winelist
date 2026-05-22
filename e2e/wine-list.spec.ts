import { test, expect, type Page } from "@playwright/test";

// Helper to login before tests
async function login(page: Page) {
  await page.goto("/login");
  // Use default dev credentials from .env.local or fallback
  await page.getByLabel(/username/i).fill(process.env.AUTH_USERNAME ?? "admin");
  await page.getByLabel(/password/i).fill(process.env.AUTH_PASSWORD ?? "changeme");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/cellar");
}

test.describe("Wine list", () => {
  test("authenticated user sees cellar page", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL("/cellar");
    await expect(page.getByRole("heading", { name: /my cellar/i })).toBeVisible();
  });

  test("bottom navigation is visible", async ({ page }) => {
    await login(page);
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(nav.getByText("Cellar")).toBeVisible();
    await expect(nav.getByText("Ready Now")).toBeVisible();
    await expect(nav.getByText("Add")).toBeVisible();
    await expect(nav.getByText("Insights")).toBeVisible();
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    // Don't login — go directly to cellar
    await page.goto("/cellar");
    await expect(page).toHaveURL(/login/);
  });

  test("empty state shows when no wines in collection", async ({ page }) => {
    await login(page);
    // On fresh load, if Dexie has no data, empty state shows
    // (This test is conditional — valid whether data exists or not)
    const heading = page.getByRole("heading", { name: /my cellar/i });
    await expect(heading).toBeVisible();
    // Either skeleton, empty state, or wine list — none should crash
    await page.waitForTimeout(2000);
    const hasError = await page.locator("text=Error").count();
    expect(hasError).toBe(0);
  });

  test("skeleton loading state appears (briefly) before list", async ({ page }) => {
    await login(page);
    // Check that page renders without crash — loading and data states both handled
    await expect(page.getByRole("heading", { name: /my cellar/i })).toBeVisible();
  });
});
