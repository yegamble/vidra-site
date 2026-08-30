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
      // 40px floor, raised from 30 as a recorded decision (2026-08): the old
      // md:h-8 header put the otter's 24-grid frame at exactly the brand
      // canon's 24px UI minimum and the drawn wordmark at ~12px — smaller
      // than the 15px nav labels beside it, and the owner read it as small.
      // The header now renders the lockup at h-11 (44px) at every viewport:
      // mark frame 33px, wordmark ~16px. The floor sits under that with only
      // subpixel slack, so a regression to the minimum-size lockup fails here.
      expect(
        box!.height,
        `header lockup is ${box!.height}px tall at ${vp.name}`,
      ).toBeGreaterThanOrEqual(40);
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
      await expect(h1).toHaveText("Run your own video platform.One command.");

      // Above-the-fold is deliberately NOT asserted: the standfirst is allowed
      // to push the actions below 844px on a phone. What is asserted is that
      // the primary action is real: the install command itself sits in the
      // hero with a working copy control, and the cost question is one tap.
      const hero = page.locator("main > section").first();
      const copy = hero.getByRole("button", { name: /copy install command/i });
      await expect(copy).toBeVisible();
      await expect(copy).toBeEnabled();
      const cta = hero.getByRole("link", { name: "What will it cost me?" });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/#calculator");
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

    // Scoped to the install panel: the hero carries its own command block now,
    // and this test is about the tabs.
    const command = page
      .locator("#install-panel")
      .getByRole("group", { name: /Install command/ });
    await expect(command).toBeVisible();

    // A migration is not a command, so that panel does not pretend to have one.
    await page.getByRole("tab", { name: "From PeerTube" }).click();
    await expect(command).toBeHidden();
    await expect(page.locator("#install-panel")).toContainText(
      "not a PeerTube fork",
    );

    await page.getByRole("tab", { name: "One-line" }).click();
    await expect(command).toBeVisible();
  });
});

test.describe("install command block", () => {
  // This suite used to assert the opposite: that the command stayed on one
  // line and its `<pre>` scrolled sideways. It did — and at 390 that left
  // roughly a tenth of the command on screen, getting worse as the reader's
  // font size rose, on the artifact the hero exists to hand over. The command
  // now wraps the way a terminal wraps, so the contract inverts: nothing is
  // ever past the right edge of the box, at any supported width and at 200%
  // text zoom.

  for (const vp of VIEWPORTS) {
    test(`the whole command is legible without scrolling at ${vp.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const pre = page.getByTestId("command-text").first();
      await expect(pre).toBeVisible();
      await expect(pre).toContainText("install.sh | sh");

      const size = await pre.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
      expect(
        size.scrollWidth,
        `the command is clipped at ${vp.name}: ${size.scrollWidth}px of text in a ${size.clientWidth}px box`,
      ).toBeLessThanOrEqual(size.clientWidth + 1);
    });
  }

  test(`the command survives 200% text zoom at ${PHONE.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: PHONE.width, height: PHONE.height });
    await page.goto("/");

    // The reader's own font-size setting, doubled. Everything user-facing is
    // sized in rem precisely so this works, and the primary conversion
    // artifact is the last thing that may stop working when it is used.
    await page.addStyleTag({ content: "html { font-size: 200% }" });

    const pre = page.getByTestId("command-text").first();
    const size = await pre.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      fontSize: getComputedStyle(el).fontSize,
    }));
    expect(parseFloat(size.fontSize)).toBeGreaterThan(20);
    expect(
      size.scrollWidth,
      `the command is clipped at 200% zoom: ${size.scrollWidth}px of text in a ${size.clientWidth}px box`,
    ).toBeLessThanOrEqual(size.clientWidth + 1);
  });

  test(`the copy button shares the command's row at ${PHONE.name}`, async ({
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

    // Still reachable from the keyboard — now so the text can be selected by
    // hand, which is the fallback when the clipboard refuses.
    await expect(pre).toHaveAttribute("tabindex", "0");

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

  test("a refused clipboard is stated, not swallowed", async ({ page }) => {
    // The clipboard can be refused: an insecure origin, a permissions policy,
    // a browser with no async clipboard. The old catch reset the button to
    // "Copy", so the reader pressed a button that did nothing and was told
    // nothing.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("refused")) },
      });
    });
    await page.goto("/");

    const button = page
      .getByRole("button", { name: /Copy install command/ })
      .first();
    await expect(button).toHaveText("Copy");
    await button.click();
    await expect(button).toHaveText("Copy failed");
    await expect(page.getByRole("status").first()).toContainText(
      "Select it and copy it yourself",
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
    await expect(cost).toContainText("$56");
    const before = (await cost.textContent())?.trim();

    // One job fits the 4 vCPU box; two do not.
    const jobs = page.getByLabel(/Concurrent transcode jobs/);
    await jobs.fill("2");

    await expect(result).toContainText("Public launch profile");
    const after = (await cost.textContent())?.trim();
    expect(after, "the cost must move with the profile").not.toBe(before);
    await expect(result).toContainText("8 vCPU / 16 GB");
    // The class is named, because it is the difference that costs money.
    await expect(result).toContainText("CPU-Optimized");

    // The included-disk floor is per plan. The launch box ships 100 GiB, not
    // the small box's 160, so at the launch profile's own baseline it is
    // already buying block storage: $168 + $6, not a flat $168.
    await expect(cost).toContainText("$174");
    await expect(result).toContainText("block storage at $0.10 a GiB");

    // Stored video pushes it further, and the arithmetic stays visible.
    await page.getByLabel(/Hours of video stored/).fill("200");
    await expect(result).toContainText("block storage at $0.10 a GiB");

    // With nothing stored, the plan's own disk is enough and the figure lands
    // exactly on the published launch price.
    await page.getByLabel(/Hours of video stored/).fill("0");
    await expect(cost).toContainText("$168");
    await expect(result).toContainText("Its 100 GiB of disk is enough here");
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
  // the page loses its beat. The homepage runs its full ten-band target order
  // — Ink · Paper · Ink · Paper · Ink · Paper · Ink · Paper · Mist · Ink —
  // now that the capture band holds the reserved fifth slot.
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

  // The exact beat, so a reorder is a decision recorded here rather than a
  // drift: comprehension order is what is it → is it for me → what does it
  // cost → how does it work → see it running → why not the alternatives →
  // can I trust it. Ten bands is the ceiling; anything new displaces.
  expect(grounds.map((g) => g.ground)).toEqual([
    "ink", // hero
    "light", // who runs it
    "ink", // sizing
    "light", // install
    "ink", // the player, running
    "light", // federation
    "ink", // architecture
    "light", // why not the alternatives
    "mist", // the project + is this ready
    "ink", // final CTA
  ]);
});

test.describe("annotated screens", () => {
  // AnnotatedScreen's structural promise: markers float over the capture at
  // desktop and NEVER over a phone-width image — below sm the same DOM list
  // renders as labelled chips beneath the frame. Both states must answer a
  // press in the live panel.
  test("markers sit inside the figure at 1440 and answer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/demo");

    const quality = page.getByRole("button", { name: "Quality menu" });
    await quality.scrollIntoViewIfNeeded();
    const frame = page
      .locator("figure")
      .filter({ has: quality })
      .locator("img")
      .first();
    const frameBox = (await frame.boundingBox())!;
    const markerBox = (await quality.boundingBox())!;
    expect(markerBox.x).toBeGreaterThanOrEqual(frameBox.x);
    expect(markerBox.x + markerBox.width).toBeLessThanOrEqual(
      frameBox.x + frameBox.width + 1,
    );
    expect(markerBox.y).toBeGreaterThanOrEqual(frameBox.y);

    const controls = page.getByRole("button", { name: "Player controls" });
    await controls.click();
    await expect(controls).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText("The control bar mid-playback", { exact: false }),
    ).toBeVisible();
  });

  test("chips render below the frame at 390 and answer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");

    const quality = page.getByRole("button", { name: "Quality menu" });
    await quality.scrollIntoViewIfNeeded();
    const frame = page
      .locator("figure")
      .filter({ has: quality })
      .locator("img")
      .first();
    const frameBox = (await frame.boundingBox())!;
    const markerBox = (await quality.boundingBox())!;
    // Below sm no marker overlaps the image box: chips sit beneath it.
    expect(markerBox.y).toBeGreaterThanOrEqual(
      frameBox.y + frameBox.height - 1,
    );

    const timer = page.getByRole("button", { name: "Disappearing messages" });
    await timer.scrollIntoViewIfNeeded();
    await timer.click();
    await expect(timer).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText("Expired messages vanish", { exact: false }),
    ).toBeVisible();
  });
});

test("/ipfs keeps its beat: no adjacent Ink, Mist exactly once", async ({
  page,
}) => {
  await page.goto("/ipfs");

  // The viral-case band took the sanctioned Mist slot beside the public tier
  // (I·P·I·P·M·I·P·I) — recorded here the way the homepage's beat is, so a
  // future band is a decision, not a drift.
  const grounds = await page.evaluate(() => {
    const ink = "rgb(12, 33, 54)";
    const mist = "rgb(238, 247, 251)";
    return [...document.querySelectorAll("main > section")].map((el) => {
      const bg = getComputedStyle(el).backgroundColor;
      return bg === ink ? "ink" : bg === mist ? "mist" : "light";
    });
  });

  expect(grounds).toEqual([
    "ink", // hero
    "light", // the mirror + figure
    "ink", // the fence
    "light", // the public tier
    "mist", // when a video takes off
    "ink", // the private tier
    "light", // what it buys
    "ink", // closing CTA
  ]);
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
  test("three named layer tabs select directly and wrap on arrows", async ({
    page,
  }) => {
    await page.goto("/");

    // Direct selection: the reader sees the three layers before touching
    // anything, and any layer is one activation away.
    const tablist = page.getByRole("tablist", { name: "Federation layers" });
    const figure = page.getByRole("img", { name: /federating over/ });

    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over ActivityPub",
    );
    await tablist.getByRole("tab", { name: "IPFS" }).click();
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over IPFS, dual tier",
    );
    await tablist.getByRole("tab", { name: "ATProto" }).click();
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over ATProto",
    );

    // Roving tabindex: arrows move focus and selection, and wrap.
    await page.keyboard.press("ArrowRight");
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over IPFS, dual tier",
    );
    await page.keyboard.press("ArrowRight");
    await expect(figure).toHaveAttribute(
      "aria-label",
      "Your instance federating over ActivityPub",
    );
  });
});
