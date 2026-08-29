/**
 * Rasterise the social card: the vidra-branding banner, centred on an Ink
 * 1200×630 ground, written to public/brand/og-card.png.
 *
 * Crawlers that matter (X, Slack, older LinkedIn) drop SVG cards, so the PNG
 * is committed and this script regenerates it deterministically whenever the
 * banner changes. It renders with the repo's own Playwright Chromium — no
 * extra dependency — and the artwork stays inside a centred ~1120×550 safe
 * area for crop tolerance.
 *
 * The banner was checked for an internal prefers-color-scheme switch (the
 * lockup failure class documented in .ralph/specs/design-system.md): it has
 * none — a fixed Ink ground baked into the file. If the asset ever grows one,
 * render the explicit fixed-ground variant instead; never let the rasteriser
 * pick a mode.
 *
 * Canon note: the durable home for this template is vidra-branding (so the
 * product repos and the docs stop solving social cards independently) — filed
 * as a canon-evolution suggestion, not shipped unilaterally.
 *
 * Usage: node scripts/og-card.mjs [path-to-banner.svg]
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const banner = resolve(
  process.argv[2] ?? "../vidra-branding/assets/readme/banner.svg",
);
const svg = readFileSync(banner, "utf8");

const html = `<!doctype html>
<html><head><style>
  html, body { margin: 0; width: 1200px; height: 630px; background: #0c2136; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { width: 1120px; height: auto; }
</style></head><body>${svg}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: "public/brand/og-card.png" });
await browser.close();
console.log("wrote public/brand/og-card.png (1200×630)");
