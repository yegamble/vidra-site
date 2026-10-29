import { expect, test } from "@playwright/test";
import { VIEWPORTS } from "./routes";

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1366, height: 640 },
  { width: 1470, height: 843 },
]) {
  test(`entire launch page fits a ${viewport.width}x${viewport.height} laptop`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(viewport.height);
    const footer = await page.locator("footer").boundingBox();
    expect(footer!.y + footer!.height).toBeLessThanOrEqual(viewport.height);
    await expect(page.getByRole("link", { name: "Join waitlist" })).toBeInViewport({ ratio: 1 });
    await expect(page.locator("footer a")).toBeInViewport({ ratio: 1 });
  });
}

for (const vp of VIEWPORTS) {
  test(`launch layout and target visibility at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Join waitlist" })).toBeVisible();
    const logo = page.locator("header").getByRole("img", { name: "Vidra" });
    await expect(logo).toBeVisible();
    expect((await logo.boundingBox())!.height).toBeGreaterThanOrEqual(40);
    const layout = await page.evaluate(() => {
      const limit = innerWidth + 1;
      return {
        width: innerWidth, scroll: document.documentElement.scrollWidth,
        outside: [...document.querySelectorAll("header, footer, main section, h1, .standfirst, .streaming-illustration")]
          .filter(el => { const r = el.getBoundingClientRect(); return r.right > limit || r.left < -1; })
          .map(el => el.tagName),
      };
    });
    expect(layout.scroll).toBeLessThanOrEqual(layout.width);
    expect(layout.outside).toEqual([]);
    const heading = (await page.locator("h1").boundingBox())!;
    const art = (await page.locator(".streaming-illustration").boundingBox())!;
    if (vp.width < 768) expect(art.y).toBeGreaterThan(heading.y + heading.height);
    else expect(art.x).toBeGreaterThan(heading.x + heading.width - 10);
  });

  test(`reader font scaling at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto("/");
    const initial = await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    const scaled = await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(scaled).toBeGreaterThan(initial);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(vp.width);
    await expect(page.getByRole("link", { name: "Join waitlist" })).toBeVisible();
  });
}

test("brand ground and logo remain fixed in both OS appearances", async ({ page }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    expect(await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(241, 232, 223)");
    await expect(page.locator("header img")).toHaveAttribute("src", "/brand/vidra-lockup-horizontal.svg");
  }
});

test("the illustration floats without changing page height", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const movement = await page.locator(".streaming-illustration").evaluate(async (el) => {
    const animation = el.getAnimations()[0];
    await animation.ready;
    animation.pause();
    animation.currentTime = 0;
    const start = el.getBoundingClientRect().y;
    const pageHeight = document.documentElement.scrollHeight;
    animation.currentTime = 3000;
    return {
      rise: start - el.getBoundingClientRect().y,
      pageHeight,
      floatedPageHeight: document.documentElement.scrollHeight,
    };
  });
  expect(movement.rise).toBeGreaterThan(5);
  expect(movement.rise).toBeLessThanOrEqual(16);
  expect(movement.floatedPageHeight).toBe(movement.pageHeight);
});

test("reduced motion stops the illustration and action transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator(".waitlist-link").evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  expect(await page.locator(".streaming-illustration").evaluate(el => el.getAnimations().length)).toBe(0);
});
