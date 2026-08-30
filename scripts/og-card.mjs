#!/usr/bin/env node
/**
 * The site's share card: the canonical banner, plus the install command.
 *
 * The base card was the positioning line and nothing else — a card any of a
 * dozen self-hosting projects could have posted, on a project that travels
 * almost entirely by pasted link. This one carries the artifact instead: the
 * command a reader runs, rendered the way the hero renders it, wrapped rather
 * than clipped. It is the one thing on the card that is checkably ours.
 *
 * The command is read out of `lib/site.ts` rather than typed here, so the card
 * cannot drift from the fact table without this script failing.
 *
 * Ink and the two type colours are literal here for the same reason
 * `Lockup.tsx` and `FederationFigure.tsx` carry literals: this is a rasteriser
 * template for a drawn asset, not a styled component. The values are the
 * palette's.
 *
 * The banner must not carry a `prefers-color-scheme` switch — the documented
 * lockup failure class: an asset that flips with the OS mode renders
 * Ink-on-Ink when rasterised onto a fixed Ink ground. The check below is
 * mechanical and fails the run, exactly as the canonical generator in
 * vidra-branding does.
 *
 * Renders with the Playwright Chromium this repo already installs. Run it when
 * the banner or the command changes, and commit the PNG:
 *
 *   node scripts/og-card.mjs
 *
 * Upstream: the evidence-carrying card should be canonised in vidra-branding
 * beside `assets/social/og-card.mjs`, so the docs site gets it too.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

// Filenames of their own, deliberately. `og-card.png` is the canon's card and
// vidra-branding's generator writes it; overwriting it here would fork the
// canon at the same path, so the next person to run the canonical command
// would silently revert the evidence without ever seeing a conflict.
//
// `line: null` means the install command, read from the fact table. The two
// page cards carry that page's own evidence instead — a card is only worth
// making per page when it says something that page says and its neighbours do
// not, and these two are the pages that actually get pasted into threads.
const CARDS = [
  { out: "public/brand/og-card-install.png", line: null },
  {
    out: "public/brand/og-card-peertube.png",
    line: "PeerTube 8.2.4 · every cell checked 2026-08-30",
  },
  {
    out: "public/brand/og-card-ipfs.png",
    line: "every public video's CIDs are in the API · pin one yourself",
  },
];

const bannerPath = resolve("public/brand/banner.svg");

const banner = readFileSync(bannerPath, "utf8");
if (banner.includes("prefers-color-scheme")) {
  console.error(
    `${bannerPath} carries a prefers-color-scheme switch. On the card's fixed ` +
      "Ink ground that renders Ink-on-Ink in one mode. Render a fixed-ground " +
      "variant of the artwork instead — never let the rasteriser pick a mode.",
  );
  process.exit(1);
}

const site = readFileSync(resolve("lib/site.ts"), "utf8");
const command = site.match(/INSTALL_COMMAND\s*=\s*\n?\s*"([^"]+)"/)?.[1];
if (!command) {
  console.error(
    "Could not read INSTALL_COMMAND out of lib/site.ts. The card quotes the " +
      "fact table rather than a copy of it; fix the read rather than typing " +
      "the command in here.",
  );
  process.exit(1);
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html, body { margin: 0; width: 1200px; height: 630px; background: #0c2136; }
  body {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Helvetica Neue", Arial, sans-serif;
  }
  /* 1120px is the canonical card's safe area, so the mark lands at the size
     it lands at on every other Vidra card. */
  .banner { width: 1120px; height: auto; }
  .banner svg { width: 100%; height: auto; display: block; }
  .command {
    width: 1040px; box-sizing: border-box;
    padding: 28px 32px; border-radius: 16px;
    background: rgb(29 70 106 / 0.32);
    box-shadow: inset 0 0 0 1px rgb(29 70 106 / 0.6);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 30px; line-height: 1.5; letter-spacing: -0.01em;
    color: #e6f6fa; white-space: pre-wrap; word-break: break-all;
  }
  .prompt { color: #8fb4c9; }
</style></head><body>
  <div class="banner">${banner}</div>
  <div class="command">__LINE__</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

for (const card of CARDS) {
  // The prompt glyph belongs to the command; an evidence line is not
  // something you type, so it does not wear a `$`.
  const body = card.line
    ? card.line
    : `<span class="prompt">$ </span>${command}`;
  await page.setContent(html.replace("__LINE__", body), {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: resolve(card.out) });
  console.log(`wrote ${card.out} (1200×630) — ${card.line ?? command}`);
}

await browser.close();
