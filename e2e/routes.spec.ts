import { expect, test } from "@playwright/test";
import { RETIRED_ROUTES } from "./routes";

// The user explicitly retired the technical marketing pages. Their former
// content contracts are replaced by launch and redirect contracts, while the
// responsive, accessibility, scaling, and hit-target thresholds stay intact.
test("the launch page presents one invitation and honest email registration", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A new home for streaming is taking shape.");
  await expect(page.getByText("Vidra Beta", { exact: true })).toBeVisible();
  await expect(page.getByText("Coming soon", { exact: true })).toBeVisible();
  const cta = page.getByRole("link", { name: "Join waitlist" });
  const href = await cta.getAttribute("href");
  const email = new URL(href!);
  expect(email.protocol).toBe("mailto:");
  expect(email.pathname).toBe("support@vidra.media");
  expect(email.searchParams.get("subject")).toBe("Vidra Beta waitlist");
  expect(email.searchParams.get("body")).toContain("Please add me");
  await expect(page.locator("footer").getByRole("link", { name: "support@vidra.media" })).toHaveAttribute("href", "mailto:support@vidra.media");
  await expect(page.locator("footer")).toContainText("Vidra Technologies LLC");
  await expect(page.locator("nav, input, button, video")).toHaveCount(0);
  await expect(page.locator(".streaming-illustration")).toHaveAttribute("aria-hidden", "true");
});

for (const route of RETIRED_ROUTES) {
  test(`${route} permanently redirects to the launch page`, async ({ request, page }) => {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe("/");
    const followed = await page.goto(route);
    expect(followed?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("A new home for streaming is taking shape.");
  });
}

test("unknown URLs return a real 404 with a home link", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn’t here.");
  await page.getByRole("link", { name: "Back to Vidra" }).click();
  await expect(page).toHaveURL("/");
});

test("metadata and all launch assets use the new identity", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Vidra — a new home for streaming");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Vidra — a new home for streaming");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Vidra");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://vidra.yosef.app");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/brand\/og-card.png$/);
  for (const asset of ["/brand/og-card.png", "/brand/vidra-lockup-horizontal.svg", "/icon.svg"]) {
    expect((await request.get(asset)).status(), asset).toBe(200);
  }
  const logo = await (await request.get("/brand/vidra-lockup-horizontal.svg")).text();
  expect(logo).not.toContain("prefers-color-scheme");
  expect(logo).not.toContain("<text");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(1);
  expect(sitemap).toContain("https://vidra.yosef.app/");
});

test("keyboard traversal reveals the skip link and visible focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  const box = await skip.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  const cta = page.getByRole("link", { name: "Join waitlist" });
  await expect(cta).toBeFocused();
  expect(await cta.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
});
