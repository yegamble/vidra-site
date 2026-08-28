import { expect, test } from "@playwright/test";
import { LAPTOP, PHONE, ROUTES, VIEWPORTS } from "./routes";

/**
 * Layout gates. Everything here failed on a real screen at least once: the
 * diagram was unreadable at 390 until it got a minimum width and a scroll
 * container, and the header lockup shrank to a smudge when it was sized in
 * fixed pixels. A feature is not complete if it only passes at 1440.
 */

test.describe("no horizontal overflow", () => {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route} at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);

        const { scrollWidth, innerWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(
          scrollWidth,
          `${route} scrolls sideways at ${vp.name}`,
        ).toBeLessThanOrEqual(innerWidth);
      });
    }
  }
});

test.describe("nothing sticks out of the right edge", () => {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route} at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);

        // A sample rather than every node: the three boxes that carry the
        // page's width. An element pushed past the edge here is the awkward
        // placement the scrollWidth check can miss when the overflow is
        // clipped by an ancestor.
        const overhang = await page.evaluate(() => {
          const limit = window.innerWidth + 1;
          const out: { tag: string; right: number }[] = [];
          const sample = [
            ...document.querySelectorAll("header, footer, main section"),
          ];
          for (const el of sample) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (r.right > limit) {
              out.push({
                tag: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}`,
                right: Math.round(r.right),
              });
            }
          }
          return { limit, out };
        });

        expect(
          overhang.out,
          `elements past the right edge (limit ${overhang.limit}px)`,
        ).toEqual([]);
      });
    }
  }
});

test.describe("header lockup", () => {
  for (const vp of VIEWPORTS) {
    test(`stays legible at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const lockup = page.locator("header").getByRole("img", { name: "Vidra" });
      await expect(lockup).toBeVisible();

      const box = await lockup.boundingBox();
      expect(box, "the header lockup has no box").not.toBeNull();
      // 30px is the floor, not the target: below it the drawn logotype stops
      // reading as words. The phone header renders it larger than the desktop
      // one for exactly this reason.
      expect(
        box!.height,
        `header lockup is ${box!.height}px tall at ${vp.name}`,
      ).toBeGreaterThanOrEqual(30);
      expect(box!.width).toBeGreaterThan(0);
    });
  }
});

test.describe("hero", () => {
  for (const vp of VIEWPORTS) {
    test(`headline and primary action exist at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();

      // Above-the-fold is deliberately NOT asserted: the standfirst is allowed
      // to push the buttons below 844px on a phone. What is asserted is that
      // the primary action is real — visible, in the document flow, and
      // pointing somewhere.
      const cta = page
        .getByRole("main")
        .getByRole("link", { name: "Get started" })
        .first();
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/get-started");
      await cta.scrollIntoViewIfNeeded();
      await expect(cta).toBeEnabled();
    });
  }
});

test.describe("architecture diagram", () => {
  const container = "Deployment topology diagram";

  test(`scrolls and is reachable by keyboard at ${PHONE.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const scroller = page.getByRole("group", { name: new RegExp(container) });
    await expect(scroller).toBeVisible();

    // A scrollable region has to be operable without a mouse (WCAG 2.1.1).
    await expect(scroller).toHaveAttribute("tabindex", "0");
    const name = await scroller.getAttribute("aria-label");
    expect(name?.trim().length ?? 0).toBeGreaterThan(0);

    const size = await scroller.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(
      size.scrollWidth,
      "the diagram must stay at its drawn width and scroll, not squash",
    ).toBeGreaterThan(size.clientWidth);
  });

  test(`fits without scrolling at ${LAPTOP.name}`, async ({ page }) => {
    await page.setViewportSize({ width: LAPTOP.width, height: LAPTOP.height });
    await page.goto("/");

    const scroller = page.getByRole("group", { name: new RegExp(container) });
    const size = await scroller.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth);
  });
});

test("the long scroll never puts two Ink sections in a row", async ({
  page,
}) => {
  await page.goto("/");

  // Brand rhythm (vidra-branding §07): Ink and Paper alternate, Mist is the
  // quiet third ground. Two Ink bands touching read as one very long band and
  // the page loses its beat.
  const grounds = await page.evaluate(() => {
    const ink = "rgb(12, 33, 54)";
    return [...document.querySelectorAll("main > section")].map((el) => ({
      ground: getComputedStyle(el).backgroundColor === ink ? "ink" : "light",
      first: (el.textContent ?? "").trim().slice(0, 40),
    }));
  });

  expect(grounds.length).toBeGreaterThan(1);
  const adjacent = grounds
    .map((g, i) => [g, grounds[i + 1]] as const)
    .filter(([a, b]) => b && a.ground === "ink" && b.ground === "ink")
    .map(([a, b]) => `"${a.first}" then "${b!.first}"`);

  expect(adjacent, "two Ink sections in a row").toEqual([]);
});

test.describe("comparison", () => {
  // The table and the stacked list hold the same data. Exactly one of them is
  // in the accessibility tree at any width — two would read the whole
  // comparison twice to a screen reader.
  const row = "Who sets the rules";

  test(`stacks at ${PHONE.name}`, async ({ page }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const stacked = page.getByRole("heading", { name: row, exact: true });
    const tabular = page.getByRole("rowheader", { name: row, exact: true });

    await expect(stacked).toBeVisible();
    await expect(tabular).toBeHidden();

    const comparison = page.locator("table", {
      has: page.locator("caption", { hasText: "Vidra compared with" }),
    });
    await expect(comparison).toBeHidden();
    // The `hidden md:block` sits on the table's wrapper, so that is where
    // display:none has to be — reading it off the table itself would report
    // "table" and prove nothing.
    const wrapperDisplay = await comparison.evaluate(
      (el) => getComputedStyle(el.parentElement!).display,
    );
    expect(wrapperDisplay).toBe("none");
  });

  for (const vp of VIEWPORTS.filter((v) => v.width >= 768)) {
    test(`is a table at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      await expect(
        page.getByRole("rowheader", { name: row, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: row, exact: true }),
      ).toBeHidden();
    });
  }
});
