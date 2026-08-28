#!/usr/bin/env node
/**
 * Brand gate: fails CI when site copy violates the Vidra brand rules
 * (vidra-branding/guidelines/brand-guidelines.md).
 * Checks source, where all copy lives: banned hype words, emoji, indigo hexes.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTS = new Set([".ts", ".tsx", ".css", ".mdx", ".md"]);

const BANNED_WORDS =
  /\b(powerful|simply|seamless(?:ly)?|revolutionary|blazing|effortless(?:ly)?|unleash|supercharge|cutting-edge|game-changing|best-in-class|next-generation)\b/i;
const INDIGO = /#(5856d6|5e5ce6|6366f1|4f46e5|818cf8)\b/i;
// Emoji and dingbats. The brand allows typographic marks (· – — − →) which sit
// outside these ranges; drawn SVG glyphs replace check/cross characters.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B50}\u{2B55}]/u;

const failures = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXTS.has(extname(name))) check(p);
  }
}

function check(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const [label, re] of [
      ["banned word", BANNED_WORDS],
      ["indigo hex", INDIGO],
      ["emoji/dingbat", EMOJI],
    ]) {
      const m = line.match(re);
      if (m) failures.push(`${file}:${i + 1} ${label} "${m[0]}"`);
    }
  });
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    /* root may not exist */
  }
}

if (failures.length) {
  console.error("Brand check failed:\n" + failures.join("\n"));
  process.exit(1);
}
console.log("Brand check passed.");
