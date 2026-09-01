# Vidra Site — Design System

> Status: **BRAND SURFACE, v1 LANDED 2026-08-28; REDESIGN LANDED 2026-08-28**
> (palette + type ramp + section rhythm in `app/brand.css`, wired into Tailwind
> through `@theme inline` in `app/globals.css`; Playwright gates in `e2e/`. The
> redesign added the four interactive widgets, glass navigation chrome and the
> mobile install bar — see "Interactive widgets" and "Overturned rules".)
> Source of truth: the
> **vidra-branding** repo — `guidelines/brand-guidelines.md` **v1.3** and
> `design-system/brand-tokens.css`. (The 2026-08-28 v1.2 amendments absorbed
> this site's type ramp, alpha hairlines, surface/chrome tokens and motion
> exceptions, admitted nav-layer glass in identity §7, and codified the
> comparison idiom and the tabular number voice — the audit-era disagreements
> between this spec and the canon are closed. v1.3, 2026-08-29, canonised the
> status-mark pattern this site's `StatusMark.tsx` originated, as §11.)
> `app/brand.css` is a *copy*, and
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
  convey layering. Never heavy shadows. Glass is confined to the navigation
  layer (see "Overturned rules"); in content it is still a defect.

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
`FederationFigure.tsx` (see "Documented exceptions").

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
The homepage runs Ink · Paper · Ink · Paper · Ink · Paper · Mist · Ink.
(`e2e/responsive.spec.ts` asserts the rhythm on `/` by reading the computed
background of every `main > section`, and asserts Mist appears exactly once.)

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
- ~~**No glass on this site.** No `backdrop-filter`, no translucent chrome.~~
  **Overturned 2026-08-28 — see "Overturned rules".** Glass is permitted on the
  **navigation layer only** (`.glass-chrome` in `app/globals.css`: the sticky
  header and the sticky mobile install bar), always with a solid Ink fallback.
  **Never in a content section.**
- **No gradients** beyond the two documented atmospheres on the home hero — the
  tri-protocol ribbon is a *product* asset and does not belong here.

### Icons

- **Drawn glyphs only, from `components/icons.tsx`** — the single source of
  truth, matching the product's contract: feather-style paths vendored
  verbatim (MIT, © Cole Bemis), 24×24 viewBox, `currentColor` stroke at
  1.8px, round caps and joins. No emoji, no ad-hoc inline icon `<svg>`s in
  pages, and **never a vendor's logo** (PostgreSQL's elephant, Redis's mark)
  on a brand surface — the glyph names the *job*, not the brand.
- Icons are decorative by default (`aria-hidden`) and sit beside real text;
  pass `label` only when an icon must stand alone, which on this site it
  should not.
- The tile idiom for cards: a 40px `bg-mist` rounded-lg tile with the glyph
  at 20px in Action Cyan. On Ink, glyphs ride the text colour of their row
  (`text-onink-2`, `text-vidra` when selected) with no tile.

### Interactive widgets

The redesign added four. The rules they share, all of them gated:

- **Everything clears 44×44px**, including a tab in a tablist and a node button
  in a grid. `min-h-11` is the floor; `min-h-13` (52px) is the primary action
  at the top and bottom of a page; node buttons are `min-h-16` because they
  carry two lines.
- **Tabs** (`InstallTabs.tsx`) follow the WAI-ARIA tablist pattern with a
  **roving tabindex**: `role="tablist"` with an `aria-label`, `role="tab"` with
  `aria-selected` and `aria-controls`, `tabIndex={0}` on the selected tab and
  `-1` on the rest, Left/Right/Up/Down/Home/End moving focus *and* selection
  (automatic activation — nothing here loads, so deferring selection would only
  add a keystroke). The panel is `role="tabpanel"` + `aria-live="polite"`,
  labelled by its tab.
- **Toggles** (the calculator's two option pills, the eight node buttons) are
  `<button aria-pressed>`, never a styled checkbox and never colour alone: the
  pressed state changes fill *and* is announced.
- **Result panels** that change without the reader moving focus —
  `SizingCalculator`'s box, `ArchitectureExplorer`'s detail, the federation
  body — are `aria-live="polite"`. A number that changes silently is a control
  a screen-reader user cannot use.
- **Sliders** are native `<input type="range">`, labelled with `<label for>`,
  with the live value in the label so it is announced with the name. The 44px
  track height lives in `app/globals.css`, not on the element.
- **Panels reserve their tallest state** (`min-h-[4.6em]`, `min-h-[5.2em]`) so
  the controls under them do not jump between steps. A reserved line count is a
  measure, like `max-w-[66ch]` — not an arbitrary pixel.

## Imagery

**Show the product, or show nothing.** No stock photography, no illustration
library, no mockups, and above all **no fabricated screenshots** — a rendered
"screenshot" of a screen that does not exist is a lie with a 16px radius on it.

- Real captures from running instances only, on Ink or Paper, 16px radius, no
  drop shadow, cropped to the region that proves the point.
- Until a capture exists, **the slot is nothing.** The hatched placeholder
  (`ScreenSlot.tsx`) is gone: a labelled empty box is more honest than a
  mockup, but it is still a hole in the page, and three of them read as an
  unfinished site rather than a candid one. Where a screenshot would have gone,
  the page now carries something real — the calculator, the topology explorer,
  the federation walkthrough. **Show the product, show a true drawing, or say
  the thing in words.**
- Drawn diagrams are allowed where they are *true*: `FederationFigure.tsx` is
  the three federation layers, and nothing in it is a claim that is not made in
  words beside it.
- **Annotation over a capture is the second sanctioned capture treatment**
  (added 2026-08-30, argued in place per this spec's own protocol — an
  addition, not an overturn). `AnnotatedScreen.tsx` positions `aria-pressed`
  marker buttons over a real capture, each selecting an explanation in a
  reserved-height `aria-live` panel *under* the figure. The pixels stay the
  capture's; the markers assert only position; every body is copy and gets
  the count sweep. Floating callout bubbles over the image are not permitted
  (they cover the evidence and fail at phone width), markers never float
  over the narrow source (below `sm` the same DOM list renders as labelled
  chips beneath the frame), and a simulated product UI remains the hardest
  ban in this section — annotation explains a photograph; it never performs
  the product.

## Motion

- **Hard cap 300ms.** 150ms for fills, 200ms for lifts. Nothing longer. Two
  looping exceptions are documented below; both are ambient, both stop dead
  under `prefers-reduced-motion`, and a third would need the same argument
  made in writing before it shipped.
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
  implementation is **`CommandBlock.tsx`**'s `<pre>`. Scrolling is for *rows of
  data and commands* — a whole diagram must not rely on it (see the overturned
  rule in Known failure classes).
- **Skip link** to `#main` on every page.
- **`rem` sizing** so the reader's own font-size setting scales the site
  (os-hcl's "Dynamic Type equivalence").

## Documented exceptions

The only sanctioned departures. Anything else is a defect.

1. **The `→` (U+2192) in link labels.** "Read what the installer does →" and
   friends. It is a typographic mark, not an emoji and not an icon; the brand
   check allows it explicitly, and the "no emoji" rule is not weakened by it.
2. **The radial atmosphere on the home Ink hero** — one
   `radial-gradient(70% 62% at 18% -6%, …)` in Vidra Cyan at 0.22 alpha, inline
   because it is a one-off. There is exactly one of it, on one section.
3. **The 72px grid mask on the home Ink hero** (`hero-grid` in
   `app/globals.css`) — two 1px `linear-gradient` rules in Slate at 0.35 alpha,
   at a 72px pitch, faded out by a radial `mask-image` before it reaches the
   type. It sits on the same `aria-hidden` layer as the radial and behind the
   same `-z-10`. It is atmosphere on Ink, not a fill on an element, and like
   the radial there is exactly one of it. A second grid, or a grid on any other
   section, is a defect.
4. **Raw hex inside drawn artwork.** `Lockup.tsx` (the otter's nine fills, which
   are never recoloured) and `FederationFigure.tsx` (SVG `fill`/`stroke`, which
   cannot read Tailwind tokens). Both are drawings, not styled components;
   every hex in them is a palette value.
5. ~~**The pulse on the hero version pill** — `vd-pulse`, a 2.4s opacity loop
   on a 8px dot. Ambient, `aria-hidden`, and the only thing it says is "this is
   the current release".~~
   **Struck 2026-08-31.** The version left the hero pill (war-room cycle 2,
   P1.1: the first text above the H1 should be something a reader can act on,
   and "v0.5.0 · AGPL v3" swaps to "v8.2.4 · AGPL v3" under a competitor's name
   with two characters changed). The dot went with it — the exception was
   granted for a loop whose *only* content was "this is the current release",
   so with the release gone there is nothing left for it to say, and a pulse on
   a licence would be decorative motion, which the anti-slop gates ban.
   `vd-pulse` and `animate-pulse-dot` are deleted from `app/globals.css` rather
   than left dead: a documented exception with no call site is an invitation to
   re-introduce it. **The rule this exception carved out of is unchanged** —
   ambient looping motion needs its case made in writing first, and a new pulse
   would need a new entry here, not this one restored.
6. **The travelling dash on the federation and IPFS figures** — `vd-dash`, a
   1.1s linear `stroke-dashoffset` loop on the active wires. This is an
   **infinite animation and a deliberate exception to the 300ms cap**: each
   figure's whole job is to say which way bytes travel, and direction of
   travel is not something a 300ms one-shot can express — a static dashed
   line says "connection", a moving one says "flow, this way". Two instances
   carry it (amended 2026-08-28, canon §09's ambient-exception clause):
   `FederationFigure.tsx`, on the two or three wires live for the current
   step, and `IpfsFigure.tsx`, on the gateway conduit only while its
   gateways step is active — bytes pass *through* a gateway, and the moving
   dash passing through and out is that exact claim drawn. Neither carries
   information that is not also in the text beside it, and the global
   `prefers-reduced-motion` reset neutralises both completely (the dashes
   remain, they simply stop). A further instance needs this paragraph
   written for it first.
7. **The federation figure's in-drawing labels fall below the type ramp on a
   phone.** The `560 × 250` viewBox scaled into a ~302px phone column renders
   its 15-unit labels at roughly 8px — under the 11px micro floor. This is
   accepted, and it is accepted *only* because of what the figure is: at that
   width it is read as a shape (one instance, three destinations, one live
   wire) and **every word in it is repeated immediately beneath it** in the
   step's label, title, body and counter, plus the SVG's own `aria-label`. It
   is also why the figure is not a candidate for the portrait-variant rule —
   there is nothing in it to rescue. The labels were already raised from the
   handoff's 12.5 units to 15. **Do not put a claim in this drawing that is
   not also in the paragraph under it**, and if the figure ever has to carry
   something on its own, it stops being an SVG (see Known failure classes).

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
  to the 230-path OpenAPI contract and the 123 migrations — if you change one,
  check the source, do not copy the neighbouring prose.
- **A count came back in through a design file.** The 2026-08 redesign arrived
  as a finished HTML design whose copy said **"13 durable queues"** — once in
  the `vidra-core` node body and again in the Operate feature row. That number
  is not checkable against the tree: the same class of defect as the doctor
  count, arriving through a door nobody was watching, because *design* copy
  reads as settled rather than as a claim. The pre-build sweep caught it and
  both places are unpinned ("durable queues"; "queued work survives a
  restart"). **Copy from a design handoff is copy, and copy gets the count
  sweep** — a handoff is not a source. Both sites carry a comment
  (`components/ArchitectureExplorer.tsx`, `app/features/page.tsx`) so the next
  person to "restore the design's wording" reads why the number is not there.
- **The diagram was unreadable at 390px — three times, and then it stopped
  being a diagram.** A `viewBox` that fits 960px of boxes scaled to a 342px
  phone column renders 12px labels at ~4px. Fix one (a `min-w-[820px]` drawing
  in a focusable `overflow-x-auto` container) kept the labels legible and
  pushed half the topology off the screen with no cue that it scrolled. Fix two
  (a portrait variant below `md`, `hidden`/`md:hidden` paired) was legible, and
  cost two copies of the same topology that had to be kept in step by hand.
  **Fix three deleted the drawing.** `ArchitectureExplorer.tsx` is eight
  buttons and a detail panel: it reflows instead of being redrawn, every label
  is live text at the reader's own font size, and it had room for the thing the
  drawing never had room for — what each container is *for*.
  **The rule: if a drawing needs a second drawing to survive a phone, the
  drawing is the wrong component.** Reach for reflowing text and controls
  first; keep SVG for figures that are genuinely pictorial and whose content is
  repeated in words (`FederationFigure.tsx`). The portrait-variant rule still
  stands for anything that *is* inherently drawn — it is the fallback, not the
  first move. (`e2e/responsive.spec.ts` asserts the eight nodes fit and the
  panel answers at both 390 and 1440.)
- **Hit targets that are comfortable with a mouse and a miss with a thumb.**
  The header home link wrapped a 36px lockup with no height of its own; the
  `CommandBlock` copy button was 69×39. Both passed every visual review and
  failed the first run of `e2e/touch-targets.spec.ts`. Measure, do not eyeball.
- **`overflow-x-auto` without keyboard access.** Three regions (the install
  command's `<pre>`, the requirements table, the diagram) scroll sideways on a
  phone. Two of them were unreachable by keyboard — axe *serious*, invisible in
  review, caught on the first `e2e/a11y.spec.ts` run.

## Overturned rules

When a rule here is overturned, **say so in place** — strike the old rule,
state that it is overturned and why. Silently editing a guardrail loses the
reason it existed, and the next agent re-introduces the bug it prevented.

### 2026-08-28 — "No glass on this site" is overturned for the navigation layer

**Canon has since agreed**: identity-system §7 was amended the same day
(brand v1.2, decision-logged) to admit glass on the navigation layer of brand
surfaces under exactly the conditions below — this entry is no longer a
site-side deviation, it is the canon's rule restated.

**The old rule** (Components, and the "never glass" clause under Depth):

> No `backdrop-filter`, no translucent chrome.

**The new rule:** glass — blurred, translucent Ink — is permitted on the
**navigation layer only**: the sticky header and the sticky mobile install bar.
It is a defect anywhere else, and specifically in any content section.

**Why it was overturned.** The original rule was written to stop glass being
used as decoration on content, which is where it fails: text over a blurred,
moving background is the contrast bug you cannot compute in advance. It was
written as "never", which was the right shape for a site whose chrome was a
thin opaque bar. It is the wrong shape now that the header is sticky over eight
alternating grounds. Apple's HIG puts materials on the navigation layer and
nowhere else, for exactly this reason: chrome that floats over content should
read as chrome, and an opaque bar sliding over an Ink section looks like a
seam. The product's own `.glass-chrome` rule already says the same thing. So
the rule was too broad, not wrong — it is narrowed to its actual target rather
than deleted.

**What the permission costs, in full — all of it non-negotiable:**

1. **A solid Ink fallback is the default, not the fallback.**
   `.glass-chrome` in `app/globals.css` sets `background-color:
   var(--brand-ink)` unconditionally, and only *then* opts into the
   translucent ground inside `@supports ((backdrop-filter: blur(14px)) or
   (-webkit-backdrop-filter: blur(14px)))`. No browser is ever handed a
   translucent ground it cannot blur — that combination is how nav links land
   on a moving background.
2. **`prefers-reduced-transparency: reduce` and `prefers-contrast: more`
   force the solid ground back** and drop the filter. A reader who has asked
   the OS for less of this gets none of it.
3. **Ink at 0.92 (header) / 0.94 (bar), never lower.** Composited over the
   lightest ground on the site (Paper `#F5F5F7`) that is ~`#1F3245`, on which
   `#8FB4C9` nav links still clear AA comfortably and `#E6F6FA` clears AAA. The
   alpha is a contrast floor, not a taste setting: lowering it is a contrast
   regression, and `e2e/responsive.spec.ts` asserts the header's computed
   ground is Ink at ≥ 0.90 or solid.
4. **Navigation layer means navigation layer.** Sticky header, sticky mobile
   bar. The mobile menu overlay is *solid* Ink despite being nav-adjacent,
   because once it is open it is a full-bleed surface of text, not chrome.
5. **Content sections stay flat.** `--brand-ink-surface` is still the only
   translucent surface in content, and it is flat — no filter behind it.

The tokens live in `app/brand.css` as `--brand-chrome-ink`,
`--brand-chrome-ink-bar` and `--brand-chrome-blur`, so the values are named
once rather than being an `rgba()` copied into two components and drifting.

### 2026-08-28 — the home headline (overturned later the same day; see below)

~~The hero H1 is **"Your videos. Your server. Your rules."** — three claims of
ownership, which is the thing the reader is actually deciding about.
**"Run your own video platform." remains the brand positioning line** and is
unchanged where positioning belongs: the `<title>`/OpenGraph metadata and the
footer's bottom bar. The two are not competing; one is the page's argument and
the other is the brand's sentence. Do not "unify" them.~~

**Overturned 2026-08-28.** Two reasons, one of authority and one of substance.
Authority: `brand-guidelines.md` §06 says the positioning line "appears in the
banner, **site heroes**, social bios and meta descriptions" — the entry above
overturned a *canon* rule from the site side, which is not this repo's call
(canon wins, AGENTS hard rule 1). Substance: a claims sweep and a positioning
review found "Your videos. Your server. Your rules." is the generic
self-hosting promise — any competitor could run it — while the checkable
differentiator (one command in, an operator CLI out) sat below the fold. The
hero H1 is now **two authored segments**: the canonical line, then
**"One command."** in Vidra Cyan (large type on Ink is exactly what the canon
reserves that colour for), with the install command itself in the hero as the
primary conversion. The `<title>` now carries the category query
("self-hosted, federated video platform") instead of duplicating the hero.
If a future page argues for a bespoke hero again, that argument goes to
vidra-branding §06 first — not into this file.
