import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

/**
 * The route smoke test the CI workflow used to run inline with curl. It lives
 * here now so there is one gate rather than two, and so a 500 shows up with a
 * page, not just a status code.
 */

for (const route of ROUTES) {
  test(`${route} responds 200 and renders a heading`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status(), `${route} status`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("an unknown route is a 404, not a redirect or a 200", async ({ page }) => {
  const response = await page.goto("/nonexistent");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "does not exist",
  );
});
