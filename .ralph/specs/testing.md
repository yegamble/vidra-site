# Vidra Site — Testing

Status: living document. Tests serve the site; they are not busywork. This is a
four-route marketing site, so the tests that matter are the ones that catch a
page looking wrong on a screen nobody developed on.

## Layers

| Layer | Command | What it catches |
|---|---|---|
| Lint | `npm run lint` | ESLint + `eslint-config-next`, type-aware rules |
| Brand gate | `npm run check:brand` (`scripts/brand-check.mjs`) | banned hype words, emoji/dingbats, indigo hexes in `app/`, `components/`, `lib/` |
| Build | `npm run build` | compile **and** the TypeScript check — `next build` type-checks everything `tsconfig.json` includes, `e2e/` included |
| Route smoke | `e2e/routes.spec.ts` | every route 200s and renders an `h1`; `/get-started` is a 308 to `/#get-started`; an unknown route is a real 404 |
| Responsive | `e2e/responsive.spec.ts` | horizontal overflow, elements past the right edge, lockup height, the glass header's ground, hero headline + CTA, the eight-node architecture explorer, the install tablist, the sizing calculator's profile flip, the mobile install bar and menu overlay, the federation walkthrough, the comparison's stacked/table swap on `/features`, the Ink/Paper/Mist rhythm |
| Accessibility | `e2e/a11y.spec.ts` | axe serious/critical on every route at 390 and 1440; one `<main>`; every `<nav>` named |
| Hit targets | `e2e/touch-targets.spec.ts` | every visible `<a>`/`<button>` ≥ 44×44px at 390, incl. the open mobile menu |

Viewports are parameterised inside the specs (390×844, 768×1024, 1024×768,
1440×900), not split into Playwright projects, so a failure names the width it
failed at. Chromium only: these are layout and landmark assertions, not
rendering-engine comparisons.

## How to run

```bash
npm run ci          # the canonical gate — lint, brand, build, e2e
npm run test:e2e    # Playwright alone (needs a build: run `npm run build` first)
npx playwright test e2e/a11y.spec.ts --headed     # watch one suite
npx playwright test -g "390"                      # one viewport
npx playwright show-report                        # after a failure
```

First run on a new machine: `npx playwright install --with-deps chromium`.

The Playwright `webServer` starts `npm run start`, which serves the **build**
— it does not build for you. `npm run ci` chains them in the right order.

## Conventions

- **The canonical gate is `npm run ci`. GitHub Actions runs exactly that and
  nothing else** (`.github/workflows/ci.yml` installs Chromium, then runs
  `npm run ci`). CI parity is the point: a green check must mean what it means.
  If you add a check, add it to `npm run ci`, not to the workflow.
- **A feature is not complete if it only passes at 1440px.** Phone first — 390
  is a supported width, not a degraded one.
- **No screenshot baselines.** No committed PNGs, no pixel diffs. Every
  assertion here is a measurement or a role query, so it survives a copy edit.
- **Keep the suite under ~3 minutes.** It currently runs in well under one.
- Never weaken or delete a spec to make a change fit. If an assertion is wrong,
  say so in the diff and fix the assertion; if the site is wrong, fix the site.
- **Record anything not run.** Naming what you skipped is cheap; claiming a
  green suite you did not run is not.

## Deployment

A `deploy` job in the same workflow runs after `test` succeeds on a `main` push
and executes exactly the local command (`npm run deploy` → OpenNext build +
`wrangler deploy` to the vidra.yosef.app custom domain). It needs the
`CLOUDFLARE_API_TOKEN` repo secret; while the secret is absent it skips with a
notice rather than failing. Manual deploys remain `npm run deploy` locally.
