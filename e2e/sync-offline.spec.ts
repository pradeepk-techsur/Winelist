import { test, expect } from "@playwright/test";

test.describe("Offline sync infrastructure", () => {
  test("app loads and /api/ping responds", async ({ page, request }) => {
    // Ping endpoint responds
    const pingResponse = await request.head("/api/ping");
    expect(pingResponse.status()).toBe(200);
  });

  test("offline page is accessible", async ({ page }) => {
    await page.goto("/~offline");
    await expect(page.getByText(/You're offline/i)).toBeVisible();
  });

  test("login page renders username and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("invalid credentials show error message", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/username/i).fill("wrong");
    await page.getByLabel(/password/i).fill("wrong");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/Invalid username or password/i)).toBeVisible();
  });
});
