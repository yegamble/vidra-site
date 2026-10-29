# Vidra site design system

Status: marketing v2, approved 29 October 2026 from the user’s supplied coming-soon reference. This replaces the v1 cyan/otter marketing treatment, technical homepage, section rhythm, and widgets. Historical decisions remain in Git history.

The canon is `vidra-branding/guidelines/brand-guidelines.md` v2.0 and `design-system/brand-tokens.css`. [Editable Figma guidelines](https://www.figma.com/design/3UVHlVHh4MXHoBUdufD2n7).

## Identity and layout

Use warm Paper, Navy headlines and actions, black V/play logo, muted supporting text, and one decorative isometric streaming scene. The site is a single coming-soon page: logo/status header, launch headline, supporting copy, Join waitlist action, artwork, and legal/contact footer. Remove obsolete marketing pages and controls; permanently redirect former URLs to `/`. Keep the `/docs/*` rewrite.

Desktop uses two columns. Mobile stacks copy, action, artwork, and footer naturally. No horizontal overflow at 390, 768, 1024, or 1440 CSS pixels, including reader font scaling. The logo is at least 2.75rem high. All visible sizing uses rem or scalable constraints; do not use fixed pixel text.

## Tokens, type, and accessibility

`app/brand.css` copies the canonical brand tokens; components reference them. No raw component hexes, cyan marketing accents, product indigo, theme switching, webfonts, emoji, or UI kit. System sans type; heavy tightly tracked H1; comfortable supporting text. Sentence case, with uppercase reserved for the 0.6875rem status label.

Keep WCAG 2.2 AA contrast, visible focus, a skip link, one H1 and main landmark, and 2.75rem interactive target floors. Honor reduced motion. Logo SVGs contain outlined lettering with fixed fills. The concept illustration is decorative and does not pretend to be a product capture or expose fake player controls.

## Copy and conversion

Launch copy lives in `lib/marketing.ts`. No unsupported quality, scale, release, or availability claims. Join waitlist currently opens a prefilled request to `support@vidra.media`; no site-side collection or success claim. Release counts still derive from the unchanged envelope pipeline. Do not hand-edit the envelope.

## Verification contract

Run the unchanged `npm run ci` chain. Tests cover the launch page, retired redirects, metadata and assets, not-found recovery, all four responsive widths, reader scaling, fixed brand appearance, keyboard navigation, axe, and touch targets. Retired feature/widget assertions are replaced because the user explicitly removed those features; accessibility and responsive thresholds remain unchanged.
