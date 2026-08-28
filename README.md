# vidra-site

The marketing site for [Vidra](https://github.com/yegamble/vidra), served at
**vidra.yosef.app**. Next.js App Router, TypeScript, Tailwind v4, no UI library,
no webfonts, no analytics.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## The docs are not in this repo

`/docs/*` is a rewrite, not a route. It proxies to `DOCS_ORIGIN`, which defaults
to `https://vidra-docs.pages.dev`. Set the variable to work against a preview
build:

```bash
DOCS_ORIGIN=http://localhost:8788 npm run dev
```

Because `/docs` is not a Next.js route, link to it with a plain `<a>` rather than
`next/link` — a client-side navigation to a rewritten path has nothing to render.

## Brand

The rules live in
[vidra-branding](https://github.com/yegamble/vidra-branding). What this repo
holds is a copy, and copies drift, so the boundaries are worth stating:

- `app/brand.css` — the palette and the type scale as custom properties, wired
  into Tailwind through `@theme inline` in `app/globals.css`. Header comment
  records where it came from. The measured contrast ratios are in the file; the
  two that catch people out are that Action Cyan fails as *text* on Paper
  (4.26), and that Paper fails as text *on* Action Cyan (4.26). Buttons use
  pure white. Small links use `#0A6B8C`.
- `public/brand/` — the approved assets, copied verbatim. Do not edit them here;
  edit them in vidra-branding and re-copy.
- `components/Lockup.tsx` — the horizontal lockup inlined so the drawn logotype
  can be reversed on Ink. The asset's own `.wm` class switches on the *operating
  system's* colour scheme, which is the wrong signal for a permanently dark
  header. The otter mark's nine fills are copied unchanged; only the logotype,
  which is single-colour by nature, takes a colour prop.
- No indigo anywhere. That is the one colour rule the brand treats as a
  boundary: cyan outside the product, indigo inside it.

Sections alternate Ink and Paper down the page and never repeat Ink. Mist
(`#EEF7FB`) is the quiet third ground, used once, for requirements.

## Imagery

There is none, on purpose. The brand shows the product or shows nothing, and
there are no screenshots yet. What stands in:

- `components/ArchitectureDiagram.tsx` — a drawn topology, where every port is
  the port the container actually listens on.
- `components/ScreenSlot.tsx` — a hatched, labelled 16:9 slot that says out loud
  that a real capture goes there. Replace it with a screenshot; do not replace
  it with a mockup.

## Copy

Every number on this site comes from the Vidra repositories. `lib/site.ts` holds
the ones that repeat, so a version bump is one edit. If a claim cannot be traced
to a repository or a measurement, it does not go on the page — which is why
there are no testimonials, no logo wall, and a `Not yet` block naming the three
things Vidra does not do.

## Licence

Site content and code: see the Vidra project. Vidra itself is AGPL v3.
