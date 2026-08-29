import { expect, test } from "@playwright/test";
import { LAPTOP, PHONE, ROUTES, VIEWPORTS } from "./routes";

/**
 * Layout gates. Everything here failed on a real screen at least once: the
 * topology was unreadable at 390 until it stopped being a drawing, and the
 * header lockup shrank to a smudge when it was sized in fixed pixels. A
 * feature is not complete if it only passes at 1440.
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

test.describe("header chrome", () => {
  // Glass is permitted on the navigation layer, and only with a ground behind
  // it. A transparent header would put #8FB4C9 nav links straight onto
  // whatever happened to scroll underneath.
  test("the sticky header has an opaque-enough Ink ground", async ({ page }) => {
    await page.goto("/");
    const background = await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    // Either the solid Ink fallback or the .92 translucent ground.
    expect(background).toMatch(
      /^rgba?\(12, 33, 54(, 0\.9[0-9]*)?\)$/,
    );
  });
});

test.describe("hero", () => {
  for (const vp of VIEWPORTS) {
    test(`headline and primary action exist at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("Your videos. Your server. Your rules.");

      // Above-the-fold is deliberately NOT asserted: the standfirst is allowed
      // to push the buttons below 844px on a phone. What is asserted is that
      // the primary action is real — visible, in the document flow, and
      // pointing at the install section.
      const cta = page
        .getByRole("main")
        .getByRole("link", { name: "Install it in one command" });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/#get-started");
      await cta.scrollIntoViewIfNeeded();
      await expect(cta).toBeEnabled();
    });
  }
});

test.describe("architecture explorer", () => {
  // The drawn topology is gone: two SVG variants of the same data could not
  // both stay legible and stay in step. Eight real buttons reflow instead,
  // and the detail panel says what each container is for.

  for (const vp of [PHONE, LAPTOP]) {
    test(`the eight nodes fit and answer at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const nodes = page.getByTestId("arch-nodes");
      await expect(nodes).toBeVisible();
      await expect(nodes.getByRole("button")).toHaveCount(8);

      // Nothing cut off, at either width.
      const box = (await nodes.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);

      const panel = page.getByTestId("arch-detail");
      const heading = panel.getByRole("heading", { level: 3 });

      // vidra-core is the default; tapping redis has to move the panel.
      await expect(heading).toHaveText("vidra-core");
      const redis = nodes.getByRole("button", { name: /^redis/ });
      await expect(redis).toHaveAttribute("aria-pressed", "false");
      await redis.click();
      await expect(heading).toHaveText("redis");
      await expect(redis).toHaveAttribute("aria-pressed", "true");
      await expect(panel).toContainText("Redis 8");
    });
  }
});

test.describe("install tabs", () => {
  test(`four tabs, all thumb-sized, at ${PHONE.name}`, async ({ page }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const tablist = page.getByRole("tablist", { name: "Install method" });
    await expect(tablist).toBeVisible();

    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    for (const tab of await tabs.all()) {
      const box = (await tab.boundingBox())!;
      expect(
        Math.min(box.width, box.height),
        `"${(await tab.textContent())?.trim()}" is ${Math.round(
          box.width,
        )}x${Math.round(box.height)}`,
      ).toBeGreaterThanOrEqual(44);
    }
  });

  test("the PeerTube route has no command row, and the others do", async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const command = page.getByRole("group", { name: /Install command/ });
    await expect(command).toBeVisible();

    // A migration is not a command, so that panel does not pretend to have one.
    await page.getByRole("tab", { name: "From PeerTube" }).click();
    await expect(command).toBeHidden();
    await expect(page.getByRole("tabpanel")).toContainText(
      "not a PeerTube fork",
    );

    await page.getByRole("tab", { name: "One-line" }).click();
    await expect(command).toBeVisible();
  });
});

test.describe("install command block", () => {
  // One line tall, always: the command scrolls sideways and the copy button
  // stays pinned on the right (never wraps underneath).
  test(`single row with the copy button on the right at ${PHONE.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const pre = page.getByRole("group", { name: /Install command/ }).first();
    const button = page
      .getByRole("button", { name: /Copy install command/ })
      .first();
    await expect(pre).toBeVisible();
    await expect(button).toBeVisible();

    // The command overflows a phone and scrolls; keyboard-operable (WCAG 2.1.1).
    await expect(pre).toHaveAttribute("tabindex", "0");
    const size = await pre.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(size.scrollWidth).toBeGreaterThan(size.clientWidth);

    // Same row: the button's vertical span overlaps the command's, and it
    // sits to the right of it.
    const preBox = (await pre.boundingBox())!;
    const btnBox = (await button.boundingBox())!;
    expect(btnBox.x).toBeGreaterThan(preBox.x + preBox.width - 1);
    const overlap =
      Math.min(preBox.y + preBox.height, btnBox.y + btnBox.height) -
      Math.max(preBox.y, btnBox.y);
    expect(overlap, "copy button must share the command's row").toBeGreaterThan(
      0,
    );
  });
});

test.describe("sizing calculator", () => {
  test(`a second concurrent job moves the box up a profile at ${PHONE.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const result = page.getByTestId("calc-result");
    const cost = page.getByTestId("calc-cost");

    // The result is a live region: a slider that changes a number silently is
    // a slider a screen-reader user cannot use.
    await expect(result).toHaveAttribute("aria-live", "polite");

    await expect(result).toContainText("Small, private profile");
    // The default state must derive the hero's quoted number: the first thing
    // the reader checks has to agree with the first thing the site claims.
    await expect(cost).toContainText("$63");
    const before = (await cost.textContent())?.trim();

    // One job fits the 4 vCPU box; two do not.
    const jobs = page.getByLabel(/Concurrent transcode jobs/);
    await jobs.fill("2");

    await expect(result).toContainText("Public launch profile");
    const after = (await cost.textContent())?.trim();
    expect(after, "the cost must move with the profile").not.toBe(before);
    await expect(result).toContainText("8 vCPU / 16 GB");

    // Stored video past what the included disk holds prices block storage on
    // top of the droplet — the headline figure is $168 plus the disk, not a
    // flat $168.
    await page.getByLabel(/Hours of video stored/).fill("200");
    await expect(result).toContainText("block storage at $0.10 a GB");

    // With nothing stored, the disk that comes with the droplet is enough and
    // the figure lands exactly on the deploy guide's public-launch price.
    await page.getByLabel(/Hours of video stored/).fill("0");
    await expect(cost).toContainText("$168");
    await expect(result).toContainText("160 GB is included with the droplet");
  });
});

test.describe("mobile install bar", () => {
  test(`is there at ${PHONE.name} and gone at ${LAPTOP.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const bar = page.getByTestId("mobile-install-bar");
    await expect(bar).toBeVisible();

    const link = bar.getByRole("link", { name: "Install" });
    const box = (await link.boundingBox())!;
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);

    // It is sticky, not fixed: the page scrolls under it, and the bar sits
    // against the bottom of the viewport rather than over the footer's text.
    expect(box.y + box.height).toBeLessThanOrEqual(PHONE.height + 1);

    await page.setViewportSize({ width: LAPTOP.width, height: LAPTOP.height });
    await expect(bar).toBeHidden();
  });
});

test.describe("mobile menu", () => {
  test("opens as a full-screen overlay and closes on navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    const panel = page.locator("#mobile-nav");
    await expect(panel).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(panel).toBeVisible();

    // Full-bleed under the header, and the page behind it does not scroll.
    const box = (await panel.boundingBox())!;
    expect(box.x).toBe(0);
    expect(box.width).toBe(PHONE.width);
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    // The rows are the design's 56px, comfortably past the 44px floor.
    const rows = panel.getByRole("link");
    for (const row of await rows.all()) {
      const r = (await row.boundingBox())!;
      expect(r.height).toBeGreaterThanOrEqual(44);
    }

    // Navigating closes it, and hands the scroll back.
    await panel.getByRole("link", { name: "Features" }).click();
    await expect(page).toHaveURL(/\/features$/);
    await expect(panel).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});

test("the long scroll never puts two Ink sections in a row", async ({
  page,
}) => {
  await page.goto("/");

  // Brand rhythm (vidra-branding §07): Ink and Paper alternate, Mist is the
  // quiet third ground. Two Ink bands touching read as one very long band and
  // the page loses its beat. The redesigned homepage runs
  // Ink · Paper · Ink · Paper · Ink · Paper · Mist · Ink.
  const grounds = await page.evaluate(() => {
    const ink = "rgb(12, 33, 54)";
    const mist = "rgb(238, 247, 251)";
    return [...document.querySelectorAll("main > section")].map((el) => {
      const bg = getComputedStyle(el).backgroundColor;
      return {
        ground: bg === ink ? "ink" : bg === mist ? "mist" : "light",
        first: (el.textContent ?? "").trim().slice(0, 40),
      };
    });
  });

  expect(grounds.length).toBeGreaterThan(1);
  const adjacent = grounds
    .map((g, i) => [g, grounds[i + 1]] as const)
    .filter(([a, b]) => b && a.ground === "ink" && b.ground === "ink")
    .map(([a, b]) => `"${a.first}" then "${b!.first}"`);

  expect(adjacent, "two Ink sections in a row").toEqual([]);

  // Mist is the quiet third ground and appears once.
  expect(grounds.filter((g) => g.ground === "mist")).toHaveLength(1);
});

test.describe("comparison", () => {
  // Moved to /features with the redesign: the homepage carries the sizing
  // calculator and the topology explorer instead, and a comparison table
  // belongs beside the feature list it draws from.
  //
  // The table and the stacked list hold the same data. Exactly one of them is
  // in the accessibility tree at any width — two would read the whole
  // comparison twice to a screen reader.
  const row = "Who sets the rules";

  test(`stacks at ${PHONE.name}`, async ({ page }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/features");

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
      await page.goto("/features");

      await expect(
        page.getByRole("rowheader", { name: row, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: row, exact: true }),
      ).toBeHidden();
    });
  }
});

test.describe("federation walkthrough", () => {
  test("steps through three layers and wraps", async ({ page }) => {
    await page.goto("/");

    const next = page.getByRole("button", { name: "Next layer" });
    const figure = page.getByRole("img", { name: /federating over/ });

    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over ActivityPub",
    );
    await next.click();
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over ATProto",
    );
    await next.click();
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over IPFS, dual tier",
    );
    await next.click();
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over ActivityPub",
    );

    await page.getByRole("button", { name: "Previous layer" }).click();
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over IPFS, dual tier",
    );
  });
});
