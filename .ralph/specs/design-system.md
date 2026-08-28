# Vidra Site — Design System

> Status: **BRAND SURFACE, v1 LANDED 2026-08-28** (palette + type ramp + section
> rhythm in `app/brand.css`, wired into Tailwind through `@theme inline` in
> `app/globals.css`; Playwright gates in `e2e/`). Source of truth: the
> **vidra-branding** repo — `guidelines/brand-guidelines.md` **v1.1** and
> `design-system/brand-tokens.css`. `app/brand.css` is a *copy* of that, and
> copies drift: **where this spec or `app/brand.css` diverges from the branding
> repo, the branding repo wins** — fix the copy, do not fork it. Two further
> sources are imported rather than invented: Apple's Human Interface Guidelines,
> and **HCL** — the `os-hcl-design` system (the AI-consumable, Apple-derived
> design repo at `github.com/yegamble/os-hcl-design`), whose *principles* are
> imported here as prose. Its component layer, its token names and its
> `blue.500 #0071e3` accent are **not** imported: that blue sits next to Bluesky
> blue, which is the exact collision Vidra's colour system was engineered to
> avoid. Every UI change MUST conform to this document — it is a Ralph
> guardrail, not a suggestion.

## Surface identity — what this repo is

vidra-site is a **brand surface**, not the product. That single fact decides
most of what follows.

- Interactive colour on Paper is **Action Cyan `#0B7EA3`**. Large fills and
  large type on Ink are **Vidra Cyan `#22BDE3`**.
- **Indigo never appears here.** systemIndigo is the product's accent and it
  stops at the app.
- The firewall rule, carried verbatim from the brand guidelines: *cyan never
  becomes an interactive colour in the app; indigo never appears on a brand
  surface. The seam is the sign-in screen.*
- The site is **single-theme by section** — Ink and Paper bands down one long
  scroll, not a mode switch. There is no `data-theme`, no `dark:` variant, and
  no `prefers-color-scheme` branch in any component. A `dark:` class in a
  component here is a review defect.

## Design philosophy — HIG, HCL, and the Vidra voice

Apple's HIG gives the three principles; `os-hcl-design/foundations/principles.md`
gives the discipline that makes them stick:

- **Deference** — chrome recedes, content is the star. Here that means the
  header is a thin Ink bar and the page is the product.
- **Clarity** — type and spacing carry the hierarchy. Never shrink type or
  tighten padding to fit more in.
- **Depth** — hairlines and one flat translucent surface (`--brand-ink-surface`)
  convey layering. Never heavy shadows, never glass.

The intangibles are binding, not advisory (HCL, "authorial discipline"):

- **Whitespace discipline.** Leave the space empty rather than fill it. If a
  section feels thin, cut a sentence — do not add a card.
- **One focal point per section.** Never ask the reader to choose between two
  pitches in one band.
- **Earned weight.** Bold is rare enough that it means something. Two weights,
  plus semibold at 13–15px labels only.
- **Precise hierarchy.** Every element has exactly one role. Nothing is "kind of
  important"; something is the biggest thing in the section and the rest
  supports it.

And the Vidra voice (`brand-guidelines.md` §05) governs every string:

> **Say the number, not the adjective.**

Plain, factual, confident, precise. "You", not "we" — the reader runs the
instance. Every claim carries a number or a mechanism traceable to the Vidra
repositories; `lib/site.ts` holds the ones that repeat.
(`scripts/brand-check.mjs` gates the banned hype words, emoji and indigo hexes.)

## Colour

Every value comes from `app/brand.css`, which carries the measured ratios in its
header comment. **Never write a raw hex in a component** — use the Tailwind
token (`bg-ink`, `text-onink-2`, `ring-paper-hairline`). The one sanctioned
exception is drawn artwork whose fills are part of the asset: `Lockup.tsx` and
`ArchitectureDiagram.tsx` (see "Documented exceptions").

| Token | Hex | Job | Honest contrast |
|---|---|---|---|
| `ink` | `#0C2136` | dark ground | `#E6F6FA` on it: **14.71** |
| `paper` | `#F5F5F7` | light ground | `#0C2136` on it: **14.99** |
| `mist` | `#EEF7FB` | the quiet third ground, used once (requirements) | — |
| `ice` | `#CBF2F4` | tints, outlines on Ink, focus ring on Ink | `#0C2136` on it: **13.64** |
| `vidra` | `#22BDE3` | the brand cyan — fills, rules, large type on Ink | on Ink: **7.35**; Ink text on it: **7.35** |
| `deep` | `#16A3E2` | secondary fill, the `vidra` hover state | Ink on it: 5.73 |
| `action` | `#0B7EA3` | **the only cyan that may sit under white text: 4.64** | see the two traps below |
| `slate` | `#1D466A` | dividers and depth on Ink. Never body text on Paper | — |
| `onpaper` / `onpaper-2` | `#0C2136` / `#4C6478` | body / secondary on Paper | 14.99 / **5.67** |
| `label` | `#5C7285` | smallest labels on Paper | **4.59** |
| `link` | `#0A6B8C` | small cyan text on Paper | **5.52** |
| `onink` / `onink-2` | `#E6F6FA` / `#8FB4C9` | body / secondary on Ink | 14.71 / **7.42** |

**The two ratios that catch people out, stated plainly:**

1. `#0B7EA3` as *text* on Paper is **4.26 — under AA**. Action Cyan is a fill,
   not a link colour. Small cyan text on Paper is `#0A6B8C` (`text-link`).
2. `#F5F5F7` on `#0B7EA3` is **also 4.26**. Text on an Action Cyan fill is pure
   `#FFFFFF`, never Paper.

Never set cyan type on Paper below 20px (`brand-guidelines.md` §08).

**Section rhythm.** The long scroll alternates Ink and Paper and **never puts
two Ink sections in a row**; Mist is the quiet third ground and appears once.
(`e2e/responsive.spec.ts` asserts the rhythm on `/` by reading the computed
background of every `main > section`.)

**Never colour alone.** A state carries a glyph or a word as well as a colour.
The comparison table marks its third column with a heading colour *and* a fill
*and* its position — not colour alone.

## Typography

**System stack only** (`--brand-font-sans`), no webfonts, nothing licensed,
nothing downloads. Mono (`--brand-font-mono`) for commands, ports and CIDs.

| Level | Spec | Token |
|---|---|---|
| Hero | 64 / 64 · 700 · −0.05em, clamped down on phones | `text-hero` |
| Section head | 44 / 48 · 700 · −0.04em | `text-head` |
| Sub / card title | 24 / 20 · 700 | `text-sub` / `text-card` |
| Standfirst | 22 / 31 · 400 — one or two lines, never three | `text-standfirst` |
| Body | 17 / 26 · 400, 66-character measure | `text-body` |
| Small | 15 / 22.5 · 400 (and semibold labels) | `text-small` |
| Mono | 14 | `text-mono` |
| Micro | 11 all-caps — **the only place all caps is allowed** | `text-micro` |

**Sizing is `rem`, everywhere user-facing.** This is the accessibility rule that
matters most on a reading surface: a reader who has raised their browser
font-size gets a bigger site, including the header lockup, which is why
`Lockup.tsx` prefers a `className` height (`h-9`, `h-11`) over its numeric
`height` prop. A fixed `px` size on user-facing type or on a control is a review
defect. (`e2e/responsive.spec.ts` gates the lockup's rendered height at every
viewport; `e2e/touch-targets.spec.ts` gates controls.)

**Sentence case, always** — headlines, buttons, nav, section labels. Title Case
reads like a press release. (`scripts/brand-check.mjs` gates banned words and
emoji; sentence case is a review defect, not a machine check.)

**Two weights** — regular for reading, bold for headings; semibold exists for
13–15px labels. Light and black are not part of the brand.

## Layout and spacing

- **4px base unit.** Every gap, pad and offset is a multiple of it —
  4 · 8 · 12 · 16 · 24 · 32 · 48 · 96. This deliberately diverges from
  os-hcl's 80/160 section rhythm: the brand scale is the brand's.
- **Measures**: 1080px for text (`measure-text`), 1280px for media
  (`measure-media`), both with a 24px inline gutter.
- **Section padding**: 96px desktop, 48px mobile (`section-y`).
- **Prose measure**: 66ch for body, ~54ch for standfirsts. Never wider.
- **12-column grid.** Arbitrary Tailwind values (`p-[13px]`) are a defect; the
  handful that exist (`max-w-[66ch]`, `min-w-[820px]`) are measures and minimum
  drawn widths, which the scale does not cover.

## Components

There is **no UI kit and no Radix** here. Every component in `components/` is
custom and token-driven, matching the vidra-user rule. Do not add a dependency
to get a button.

- **Buttons** (`Button.tsx`): 10px radius (`rounded-button`), `px-5 py-3`,
  `text-small font-semibold`. Variants: `action` (Action Cyan under **pure
  white**), `vidra` (Vidra Cyan under Ink), `ice-outline`, `ink-outline`.
  Every interactive control clears **44×44px** (HIG; WCAG 2.5.5).
  (`e2e/touch-targets.spec.ts` gates this by `boundingBox()`, not by eye.)
- **Cards / panels**: 16px radius (`rounded-card`), hairline border
  (`border-paper-hairline` on Paper, `border-slate/70` on Ink), white fill on
  Paper, `bg-ink-surface` on Ink. No shadows.
- **Focus rings**: 2px with a 2px–3px offset, **Action Cyan on Paper, Ice on
  Ink** — the `.on-ink` class on a section flips the ring. Defined once in
  `app/globals.css` under `:focus-visible`. Removing the ring, or replacing it
  with a colour change alone, is a defect.
  (`e2e/a11y.spec.ts` + `:focus-visible`.)
- **Scrollable regions** must be focusable and named: `tabIndex={0}`,
  `role="group"`, `aria-label` (see Accessibility).
- **No glass on this site.** No `backdrop-filter`, no translucent chrome. The
  one permitted non-flat treatment is the single radial atmosphere on the home
  hero. No gradients otherwise — the tri-protocol ribbon is a *product* asset
  and does not belong here.

## Imagery

**Show the product, or show nothing.** No stock photography, no illustration
library, no mockups, and above all **no fabricated screenshots** — a rendered
"screenshot" of a screen that does not exist is a lie with a 16px radius on it.

- Real captures from running instances only, on Ink or Paper, 16px radius, no
  drop shadow, cropped to the region that proves the point.
- Until a capture exists, the slot is a **labelled placeholder**
  (`ScreenSlot.tsx`): a hatched, dashed 16:9 box whose caption says out loud
  that it is empty on purpose.
- Drawn diagrams are allowed where they are *true*: `ArchitectureDiagram.tsx`
  is the shipped compose file, and every port on it is the port the container
  listens on.

## Motion

- **Hard cap 300ms.** 150ms for fills, 200ms for lifts. Nothing longer.
- **No parallax, no bounce, no scroll-driven reveals.** Motion explains cause
  and effect or it does not ship.
- **`prefers-reduced-motion` is neutralised globally** in `app/globals.css`
  (it zeroes animation and transition durations and `scroll-behavior`).
  **Components never branch on it** — no `motion-reduce:` variants, no
  `matchMedia` checks.

  This **deliberately diverges from os-hcl-design** (`foundations/motion.md`),
  which treats the global reset as "a floor, not a full contract" and requires a
  per-animation opacity-only fallback. That contract exists to protect
  transform-and-parallax-heavy hero choreography. This site has none of that:
  its entire motion vocabulary is `transition-colors` on hover. A per-animation
  contract here would be ceremony around a rule that the global reset already
  fully satisfies. If this site ever ships a transform-based reveal, the os-hcl
  contract comes back with it.

## Accessibility

**WCAG 2.2 AA** is the floor. (os-hcl-design says 2.1; we take 2.2, for parity
with the product, which enforces 2.2 in its own CI.)

- **axe serious/critical is a hard gate** on every route at 390 and 1440.
  Moderate and minor findings are printed in the failure message and do **not**
  gate — same scoping as vidra-user, so "a11y is green" means the same thing in
  both repos. (`e2e/a11y.spec.ts`.)
- **Landmarks**: exactly one `<main>` per page; every `<nav>` has an accessible
  name. (`e2e/a11y.spec.ts` asserts both.)
- **Hit targets ≥ 44×44px** on every visible `<a>` and `<button>`.
  (`e2e/touch-targets.spec.ts`.)
- **Never colour alone** for state.
- **Alt text and names**: the lockup is `role="img"` with `aria-label="Vidra"`;
  decorative marks are `aria-hidden`; icon-only controls carry an `aria-label`
  (the hamburger's label flips with its state).
- **Scrollable regions are focusable and named.** Anything with
  `overflow-x-auto` that actually scrolls must carry `tabIndex={0}`,
  `role="group"` and an `aria-label` that says what it is and that it scrolls —
  otherwise a keyboard user cannot reach the content past the fold (WCAG 2.1.1;
  axe `scrollable-region-focusable`, which is **serious**). The canonical
  implementation is **`ArchitectureDiagram.tsx`**; `CommandBlock.tsx`'s `<pre>`
  and `RequirementsTable.tsx`'s wrapper were retrofitted to match it after this
  gate first ran and found them.
- **Skip link** to `#main` on every page.
- **`rem` sizing** so the reader's own font-size setting scales the site
  (os-hcl's "Dynamic Type equivalence").

## Documented exceptions

The only sanctioned departures. Anything else is a defect.

1. **The `→` (U+2192) in link labels.** "Read what the installer does →" and
   friends. It is a typographic mark, not an emoji and not an icon; the brand
   check allows it explicitly, and the "no emoji" rule is not weakened by it.
2. **Hatched placeholder slots** (`ScreenSlot.tsx`) — a `repeating-linear-gradient`
   crosshatch. It is the one background image on the site, and it exists to
   look unmistakably like a placeholder rather than a design.
3. **The radial atmosphere on the home Ink hero** — one
   `radial-gradient(70% 62% at 18% -6%, …)` in Vidra Cyan at 0.20 alpha, inline
   because it is a one-off. This is the only non-flat treatment on any brand
   surface here, and there is exactly one of it. A second one is a defect.
4. **Raw hex inside drawn artwork.** `Lockup.tsx` (the otter's nine fills, which
   are never recoloured) and `ArchitectureDiagram.tsx` (SVG `fill`/`stroke`,
   which cannot read Tailwind tokens). Both are vendored drawings, not styled
   components; every hex in them is a palette value.

## Known failure classes (real precedents from this repo)

- **The lockup asset switches on the OS colour scheme, and the header does
  not.** `public/brand/vidra-lockup-horizontal.svg` carries its own
  `@media (prefers-color-scheme: dark) { .wm { color: #f4f4f5 } }`. That is the
  right signal for a file dropped into a README and the *wrong* one for a
  permanently dark header: on a fixed Ink tile with the OS in light mode it
  renders Ink-on-Ink and disappears. This is why the header inlines
  `Lockup.tsx` and passes the wordmark colour as a prop. **A tile with a fixed
  ground must flip the asset with it, or inline the asset and drive its colour
  explicitly** — never rely on the SVG's internal switch.
- **Counts drift, and the README is not the source.** The meta-repo README says
  `vidra doctor` runs **18** checks; the `checks` slice in
  `vidra-core/internal/doctor/doctor.go` has **26**. Commit `5cc436c` swept the
  site for that number and fixed three pages — and missed `/get-started`, which
  carried the wrong count for another two commits. **A count on this site cites
  code, or it stays unpinned** ("a few dozen", "more than a hundred"), and a
  count sweep greps the whole repo, not the pages you remember. The same applies
  to the 228-path OpenAPI contract and the 121 migrations — if you change one,
  check the source, do not copy the neighbouring prose.
- **The diagram was unreadable at 390px.** A `viewBox` that fits 960px of boxes
  scaled to a 342px phone column renders 12px labels at ~4px. The fix is a
  minimum drawn width (`min-w-[820px]`) inside an `overflow-x-auto` container
  that is `tabIndex={0}` and named — keep the drawing at a legible size and let
  it scroll, rather than squashing it. (`e2e/responsive.spec.ts` asserts it
  scrolls at 390 and does not need to at 1440.)
- **Hit targets that are comfortable with a mouse and a miss with a thumb.**
  The header home link wrapped a 36px lockup with no height of its own; the
  `CommandBlock` copy button was 69×39. Both passed every visual review and
  failed the first run of `e2e/touch-targets.spec.ts`. Measure, do not eyeball.
- **`overflow-x-auto` without keyboard access.** Three regions (the install
  command's `<pre>`, the requirements table, the diagram) scroll sideways on a
  phone. Two of them were unreachable by keyboard — axe *serious*, invisible in
  review, caught on the first `e2e/a11y.spec.ts` run.

## Overturned rules

None yet. When a rule here is overturned, **say so in place** — strike the old
rule, state that it is overturned and why. Silently editing a guardrail loses
the reason it existed, and the next agent re-introduces the bug it prevented.
