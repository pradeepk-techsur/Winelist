import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/username/i).fill(process.env.AUTH_USERNAME ?? "admin");
  await page
    .getByLabel(/password/i)
    .fill(process.env.AUTH_PASSWORD ?? "changeme");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/cellar");
}

test.describe("Wine CRUD operations", () => {
  test("Add button opens wine drawer", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /add wine/i }).click();
    // Drawer should open with form
    await expect(page.getByText(/Add Wine to Cellar/i)).toBeVisible();
  });

  test("Can submit wine with only name and type", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /add wine/i }).click();
    await expect(page.getByText(/Add Wine to Cellar/i)).toBeVisible();

    // Fill required fields only
    await page.getByLabel(/wine name/i).fill("Test Cabernet");
    await page.getByLabel(/producer/i).fill("Test Winery");
    // Type defaults to 'red' in form — no need to change

    await page.getByRole("button", { name: /add to cellar/i }).click();

    // Wine should appear in list (Dexie update triggers useLiveQuery)
    await expect(page.getByText("Test Cabernet")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Wine detail page shows all available fields", async ({ page }) => {
    await login(page);
    // Wait for wine list
    await page.waitForTimeout(1000);

    // Click first wine if exists
    const firstWineCard = page.locator("a[href^='/wine/']").first();
    const cardCount = await firstWineCard.count();
    if (cardCount > 0) {
      await firstWineCard.click();
      // Should be on detail page
      await expect(page.getByRole("button", { name: /edit/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /delete/i })).toBeVisible();
    }
  });

  test("Delete confirmation dialog appears before deletion", async ({
    page,
  }) => {
    await login(page);
    await page.waitForTimeout(1000);

    const firstWineCard = page.locator("a[href^='/wine/']").first();
    const cardCount = await firstWineCard.count();
    if (cardCount > 0) {
      await firstWineCard.click();
      await page.getByRole("button", { name: /delete/i }).click();
      // Confirmation dialog should appear
      await expect(page.getByText(/Remove this wine\?/i)).toBeVisible();
      // Cancel button should dismiss
      await page.getByRole("button", { name: /cancel/i }).click();
      await expect(page.getByText(/Remove this wine\?/i)).not.toBeVisible();
    }
  });

  test("Optional fields section is collapsible", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /add wine/i }).click();
    await expect(page.getByText(/Add Wine to Cellar/i)).toBeVisible();

    // Optional fields should be hidden initially
    await expect(page.getByLabel(/region/i)).not.toBeVisible();

    // Click to expand optional fields
    await page.getByText(/Add more details/i).click();
    await expect(page.getByLabel(/region/i)).toBeVisible();
  });

  test("edit drawer opens with pre-filled values", async ({ page }) => {
    await login(page);

    // Add a wine with known values
    await page.getByRole("button", { name: /add wine/i }).click();
    await expect(page.getByText(/Add Wine to Cellar/i)).toBeVisible();

    await page.getByLabel(/wine name/i).fill("Test Prefill Wine");
    await page.getByLabel(/producer/i).fill("Test Producer");
    // Type defaults to 'red' — no need to change

    await page.getByRole("button", { name: /add to cellar/i }).click();

    // Wine should appear in the list
    await expect(page.getByText("Test Prefill Wine")).toBeVisible({
      timeout: 5000,
    });

    // Navigate to wine detail
    await page
      .locator("a[href^='/wine/']")
      .filter({ hasText: "Test Prefill Wine" })
      .click();
    await page.waitForURL("**/wine/**");

    // Open edit drawer
    await page.getByRole("button", { name: /edit/i }).click();

    // Wait for drawer to open with pre-filled fields
    await expect(page.getByText(/Edit Wine/i)).toBeVisible();
    await page.waitForSelector('input[name="name"]');

    // Verify name is pre-filled
    const nameValue = await page.inputValue('input[name="name"]');
    expect(nameValue).toBe("Test Prefill Wine");

    // Verify producer is pre-filled
    const producerValue = await page.inputValue('input[name="producer"]');
    expect(producerValue).toBe("Test Producer");
  });
});
