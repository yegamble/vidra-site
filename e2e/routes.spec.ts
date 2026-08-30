import { expect, test } from "@playwright/test";
import { OG_CARD } from "../lib/metadata";
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

    // And every figure image must actually exist — a deleted or renamed
    // asset renders alt text over an empty Ink box and no other gate
    // notices. Checked over HTTP rather than by waiting on element load
    // events: lazy images below the fold never fire load in headless CI,
    // and a gate that hangs on that is testing the scheduler, not the site.
    const sources = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLImageElement>("figure img")].flatMap(
        (img) => {
          const urls = [img.src];
          const source = img
            .closest("picture")
            ?.querySelector("source")
            ?.getAttribute("srcset");
          if (source) urls.push(source);
          return urls;
        },
      ),
    );
    for (const src of sources) {
      const res = await page.request.get(src);
      expect(res.status(), `${route}: figure asset ${src}`).toBe(200);
    }
  });
}

// The share card is the first pixel of the brand for a project that travels
// by pasted link. Every route used to inherit the root layout's card, so all
// seven previewed as the homepage: one title, one description, and an og:url
// pointing at `/` no matter which page was shared.
test.describe("every route owns its share card", () => {
  for (const route of ROUTES) {
    test(route, async ({ page }) => {
      await page.goto(route);

      const content = async (selector: string) =>
        await page.locator(selector).getAttribute("content");

      const title = await content('meta[property="og:title"]');
      const description = await content('meta[property="og:description"]');
      const url = await content('meta[property="og:url"]');

      expect(title, `${route} has no og:title`).toBeTruthy();
      expect(description, `${route} has no og:description`).toBeTruthy();

      // Self-referential: the card names the page that was shared. The
      // origin's own trailing slash is Next's to normalise away.
      expect(url?.replace(/\/$/, ""), `${route} og:url`).toBe(
        `https://vidra.yosef.app${route === "/" ? "" : route}`,
      );

      // The card survives being replaced wholesale by the page's own object:
      // siteName and the image come back with it, or the preview is a bare
      // link with no picture.
      expect(await content('meta[property="og:site_name"]')).toBe("Vidra");
      expect(await content('meta[property="og:image"]')).toContain(OG_CARD.url);

      // Not the template collision the /compare page shipped, where "%s —
      // Vidra" turned "Vidra vs PeerTube" into "Vidra vs PeerTube — Vidra".
      // Scoped to a title that both opens and closes on the brand: /ipfs
      // renders "How Vidra uses IPFS — Vidra", which is a milder version of
      // the same thing and is recorded for the next cycle rather than
      // rewritten here.
      expect(title).not.toMatch(/^Vidra\b.*—\s*Vidra$/);
    });
  }

  // One test rather than a shared Map across the per-route ones: those run in
  // parallel workers that do not share module state.
  test("no two routes share a card title or description", async ({ page }) => {
    const cards: { route: string; title: string; description: string }[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      cards.push({
        route,
        title:
          (await page
            .locator('meta[property="og:title"]')
            .getAttribute("content")) ?? "",
        description:
          (await page
            .locator('meta[property="og:description"]')
            .getAttribute("content")) ?? "",
      });
    }

    for (const key of ["title", "description"] as const) {
      const seen = new Map<string, string>();
      for (const card of cards) {
        const clash = seen.get(card[key]);
        expect(
          clash,
          `${card.route} shares its og:${key} with ${clash}`,
        ).toBeUndefined();
        seen.set(card[key], card.route);
      }
    }
  });
});

test.describe("the running product is one click from anywhere", () => {
  // /demo carries the only pictures of Vidra actually running. It used to be
  // reachable from a single line on the homepage. This is reachability and
  // nothing more — no row on the site claims the demo settles whether anyone
  // other than its author runs an instance.
  for (const route of ROUTES) {
    test(route, async ({ page }) => {
      await page.goto(route);
      const link = page
        .locator("footer")
        .getByRole("link", { name: "See it running" });
      await expect(link).toHaveAttribute("href", "/demo");
    });
  }

  test("the primary nav is still five items", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.locator("header").getByRole("navigation").first();
    await expect(nav.getByRole("link")).toHaveCount(5);
  });
});

test("a rendered page names who maintains this and where to reach them", async ({
  page,
}) => {
  // The site asks a stranger to run an install script from these
  // repositories on a server they own. "Free software, and nothing behind
  // it" is a claim that needs a name attached to it.
  await page.goto("/");
  const band = page.locator("main > section").filter({ hasText: "The project" });
  await expect(band).toContainText("maintained by Yosef Gamble");
  await expect(
    band.getByRole("link", { name: "github.com/yegamble" }),
  ).toHaveAttribute("href", "https://github.com/yegamble");
});

test("the encryption claim names its mechanism and its status", async ({
  page,
}) => {
  // Never "audited" near E2EE: the 2016 NCC Group audit was of libolm, and
  // it is not an audit of Vidra. Naming the protocol without its state is
  // the same claim wearing a better coat.
  await page.goto("/features");
  const row = page.locator("dd", { hasText: "@matrix-org/olm" });
  await expect(row).toContainText("Olm");
  await expect(row).toContainText("deprecated");
  await expect(row).toContainText("not been independently audited");

  // And every occurrence of the word on the page is a denial, never a claim.
  const mentions = await page.locator("body").evaluate((el) =>
    [
      ...(el.textContent ?? "").replace(/\s+/g, " ").matchAll(/.{0,30}audited/gi),
    ].map((m) => m[0]),
  );
  expect(mentions.length, "the status is stated at all").toBeGreaterThan(0);
  for (const mention of mentions) {
    expect(mention, '"audited" may only appear as a denial').toMatch(
      /not been independently audited/i,
    );
  }
});

test("rich results no longer say the product is free of charge", async ({
  page,
}) => {
  // An Offer at price 0 renders as a price in search results, on a project
  // whose entire argument is that it costs a server. The licence claim is the
  // true one and it stays.
  await page.goto("/");
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const jsonLd = JSON.parse(raw!);

  expect(jsonLd.offers, "offers must be gone, not zeroed").toBeUndefined();
  expect(jsonLd.isAccessibleForFree).toBe(true);
  expect(jsonLd.license).toContain("LICENSE");
});

test("an unknown route is a 404, not a redirect or a 200", async ({ page }) => {
  const response = await page.goto("/nonexistent");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "does not exist",
  );
});
