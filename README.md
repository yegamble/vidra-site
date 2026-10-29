<p align="center"><img src="public/brand/logo.svg" width="268" alt="Vidra"></p>

# vidra-site

The coming-soon marketing site for [Vidra](https://vidra.yosef.app), built with Next.js App Router, TypeScript, and Tailwind v4. System fonts, custom components, no analytics.

## Running and checking

```sh
npm ci
npm run dev
npm run ci
```

The complete gate runs lint, brand check, release-envelope verification, production build, and Playwright. Install Chromium once with `npx playwright install --with-deps chromium`. See [.ralph/specs/testing.md](.ralph/specs/testing.md).

## Marketing and assets

[vidra-branding](https://github.com/yegamble/vidra-branding) owns the v2 guidelines, V/play vector logos, warm Paper/Navy palette, README assets, and social card. [Figma guidelines](https://www.figma.com/design/3UVHlVHh4MXHoBUdufD2n7). `app/brand.css` and `public/brand/` are copies of the canon. The streaming illustration is decorative concept artwork, not a product screenshot.

The single launch page replaces the old marketing routes, which permanently redirect to `/`. Copy and email links live in `lib/marketing.ts`. **Join waitlist opens a prefilled email request** to support; the site does not collect addresses or confirm registration. The footer uses the same support mailbox.

## Documentation

`/docs/*` remains a rewrite to `DOCS_ORIGIN` (default `https://vidra-docs.pages.dev`). Link to it with a plain `<a>`; it is not a Next.js route.

## Licence

See the Vidra project. Vidra itself is AGPL v3.
