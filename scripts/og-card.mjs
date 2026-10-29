/**
 * The canonical Vidra social card — one template for every surface.
 *
 * Rasterises the README banner, centred on an Paper 1200×630 ground, to a PNG.
 * Crawlers that matter (X, Slack, older LinkedIn) drop SVG cards, so each
 * consuming repo commits the PNG and regenerates it from here whenever the
 * banner changes: vidra-site's `public/brand/og-card.png` and the docs' social
 * card both come from this script, not from per-repo exports. The artwork
 * stays inside a centred ~1120×550 safe area for crop tolerance.
 *
 * The banner must not carry a `prefers-color-scheme` switch — the lockup
 * failure class: an asset that flips with the OS mode renders unreadable artwork when
 * rasterised onto a fixed Paper ground. The check below is mechanical and fails
 * the run; if the banner ever grows a switch, render a fixed-ground variant
 * instead. Never let the rasteriser pick a mode.
 *
 * Renders with Playwright Chromium and no other dependency. This repo does
 * not ship one, so the loader also resolves Playwright from the *calling*
 * repo — run it from any checkout that has Playwright installed (vidra-site
 * does):
 *
 *   node ../vidra-branding/assets/social/og-card.mjs public/brand/og-card.png
 *
 * Usage: node og-card.mjs [output.png] [banner.svg]
 *   output.png  where to write the card (default: ./og-card.png)
 *   banner.svg  the artwork (default: this repo's assets/readme/banner.svg)
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? "og-card.png");
const banner = resolve(process.argv[3] ?? resolve(here, "../public/brand/banner.svg"));

const svg = readFileSync(banner, "utf8");
if (svg.includes("prefers-color-scheme")) {
  console.error(
    `${banner} carries a prefers-color-scheme switch. On the card's fixed Paper ` +
      "ground that renders unreadable artwork in one mode. Render a fixed-ground " +
      "variant of the artwork instead — never let the rasteriser pick a mode.",
  );
  process.exit(1);
}

async function loadChromium() {
  const pick = (mod) => mod?.chromium ?? mod?.default?.chromium;
  for (const pkg of ["@playwright/test", "playwright", "playwright-core"]) {
    try {
      const found = pick(await import(pkg));
      if (found) return found;
    } catch {}
    try {
      const req = createRequire(resolve(process.cwd(), "noop.js"));
      const found = pick(await import(pathToFileURL(req.resolve(pkg)).href));
      if (found) return found;
    } catch {}
  }
  console.error(
    "No Playwright found next to this repo or the current directory. Run " +
      "from a checkout that has it (vidra-site does), or `npm i --no-save " +
      "playwright` here and `npx playwright install chromium`.",
  );
  process.exit(1);
}

const html = `<!doctype html>
<html><head><style>
  html, body { margin: 0; width: 1200px; height: 630px; background: #f1e8df; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { width: 1120px; height: auto; }
</style></head><body>${svg}</body></html>`;

const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out} (1200×630)`);
