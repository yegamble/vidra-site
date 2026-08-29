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

test("/get-started is a permanent redirect to the install section", async ({
  page,
  request,
}) => {
  // The install page became a section of the homepage. The old URL has to keep
  // working — a 404 here is somebody's bookmark, somebody's README and every
  // link the site itself used to carry.
  const raw = await request.get("/get-started", { maxRedirects: 0 });
  expect(raw.status(), "/get-started must be a permanent redirect").toBe(308);
  expect(raw.headers()["location"]).toBe("/#get-started");

  // And following it lands on a real page with the section on it.
  const followed = await page.goto("/get-started");
  expect(followed?.status()).toBe(200);
  await expect(page.locator("#get-started")).toBeVisible();
});

// The anti-mockup contract, machine-enforced: every product capture on the
// site renders inside a <figure> whose <figcaption> carries its provenance
// ("Captured …" in full, or the sanctioned "Same instance: …" short form).
// A capture without provenance is a defect, by spec — not a style choice.
for (const route of ROUTES) {
  test(`${route}: every figure image carries a provenance caption`, async ({
    page,
  }) => {
    await page.goto(route);
    const figures = page.locator("figure:has(img)");
    const count = await figures.count();
    for (let i = 0; i < count; i++) {
      const caption = figures.nth(i).locator("figcaption");
      await expect(
        caption,
        `${route} figure ${i} must have a figcaption`,
      ).toHaveCount(1);
      await expect(
        caption,
        `${route} figure ${i} caption must state provenance`,
      ).toContainText(/Captured|Same instance:/);
    }
  });
}

test("an unknown route is a 404, not a redirect or a 200", async ({ page }) => {
  const response = await page.goto("/nonexistent");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "does not exist",
  );
});
