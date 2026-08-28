# AGENTS.md — vidra-site

These rules bind every AI tool working in this repo (Claude, Jules, Codex, …).

The marketing site for Vidra, at **vidra.yosef.app**. Next.js 16 App Router,
TypeScript, Tailwind v4. No UI library, no webfonts, no analytics. `/docs/*` is
a rewrite to `DOCS_ORIGIN`, not a route — link to it with a plain `<a>`.

## Verification gates (run before opening any PR; paste the output tail into the PR body)

```
npm run ci
```

One command, and it is the whole gate: `lint` → `check:brand`
(`scripts/brand-check.mjs`) → `build` (which type-checks) → `test:e2e`
(Playwright: `routes`, `responsive`, `a11y`, `touch-targets`).
`.github/workflows/ci.yml` runs exactly this after installing Chromium, so a
green check means what it means. First run on a new machine needs
`npx playwright install --with-deps chromium`. Details:
**`.ralph/specs/testing.md`**. Never weaken a spec to make a change fit, and
never claim a suite passed that you did not run.

## Hard rules

1. **Read `.ralph/specs/design-system.md` before ANY UI change.** It is the
   guardrail, not a suggestion; the brand canon it copies lives in
   `vidra-branding` and wins where the two disagree.
2. **Tokens only.** Colours come from `app/brand.css` via the Tailwind theme
   (`bg-ink`, `text-onink-2`, `ring-paper-hairline`). A raw hex in a component
   is a review defect, except inside vendored drawings (`Lockup.tsx`,
   `FederationFigure.tsx`). **No indigo anywhere** — this is a brand
   surface; indigo belongs to the product. No `dark:` variants: the site is
   Ink/Paper by section, not mode-switched.
3. **No webfonts, no emoji, no UI kit.** System stack only. Components here are
   custom; do not add a dependency to get a button.
4. **44×44px** on every interactive control, and **`rem` sizing** on everything
   user-facing so the reader's own font-size setting scales the page. Both are
   gated by Playwright, not by eye.
5. **Every claim in copy needs a number or a mechanism, sourced from the Vidra
   repositories** — `lib/site.ts` holds the ones that repeat. **Never invent a
   count, and never copy one from a README**: the meta-repo README says
   `vidra doctor` runs 18 checks; the code has 26. Cite code, or stay unpinned.
6. **Sentence case, always.** All caps is reserved for 11px micro-labels.
7. Do not bump dependencies, do not touch `.github/workflows` unless that is the
   task, never commit secrets or `.env` files.

## Git hygiene — finished means merged

1. **Commit early, push often.** Prefer several small scoped commits over one
   session-end mega-commit; push at every green checkpoint — unpushed work does
   not exist.
2. **A task is finished only when its work is on `main` and pushed** and the
   GitHub Actions run on it is green. If CI is red, the task is **open —
   awaiting a green run**, never done.
3. **Never force-push `main`.** Delete merged branches locally and remotely,
   then `git fetch --prune`.

## Known failure classes (real precedents; the full account is in the design spec)

- **The lockup SVG switches on the OS colour scheme** and renders Ink-on-Ink on
  a fixed light tile. A fixed-ground tile flips the asset with it, or inlines it
  and drives the colour explicitly (`Lockup.tsx`).
- **Counts drift** (hard rule 5) — and a count sweep greps the whole repo, not
  the pages you remember.
- **The diagram was unreadable at 390px three times, and then stopped being a
  diagram.** Scroll container, then a portrait variant, then eight buttons and
  a detail panel (`ArchitectureExplorer.tsx`). If a drawing needs a second
  drawing to survive a phone, the drawing is the wrong component — reach for
  reflowing text and controls first.
- **A count came back in through a design file** ("13 durable queues", in a
  finished HTML handoff). Design copy is copy, and copy gets the count sweep.

## PR conventions

Title `site: <summary>`. Body opens with a one-line WHY, then the tail of
`npm run ci`. List anything found but not fixed under "Also found (not fixed
here)".

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
