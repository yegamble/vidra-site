/**
 * Facts, not copy. Anything in here is a real command, a real URL or a real
 * number taken from the Vidra repositories. If a value cannot be pointed at a
 * source, it does not belong in this file.
 */

export const VERSION = "v0.5.0";
export const LICENCE = "AGPL v3";

export const INSTALL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/yegamble/vidra/main/install.sh | sh";

export const GITHUB = {
  meta: "https://github.com/yegamble/vidra",
  core: "https://github.com/yegamble/vidra-core",
  user: "https://github.com/yegamble/vidra-user",
  search: "https://github.com/yegamble/vidra-search",
  branding: "https://github.com/yegamble/vidra-branding",
  licence: "https://github.com/yegamble/vidra/blob/main/LICENSE",
} as const;

export const DOCS = {
  root: "/docs",
  migration: "/docs/migration/overview",
} as const;

/** Every destination here exists. Nothing is a placeholder. */
export const NAV = [
  { label: "Features", href: "/features", external: false },
  { label: "Use cases", href: "/use-cases", external: false },
  { label: "Docs", href: DOCS.root, external: true },
  { label: "Demo", href: "/demo", external: false },
  { label: "GitHub", href: GITHUB.meta, external: true },
] as const;

/** From deploy/README. Cost figures are droplet list prices, hence "~". */
export const REQUIREMENTS = [
  {
    profile: "Small, private instance",
    detail: "A channel or two, a handful of viewers.",
    vcpu: "4",
    ram: "8 GB",
    disk: "160 GB",
    cost: "~$63/mo",
  },
  {
    profile: "Public launch",
    detail: "Open signups, concurrent transcodes.",
    vcpu: "8",
    ram: "16 GB",
    disk: "160 GB",
    cost: "~$168/mo",
  },
  {
    profile: "Add ClamAV scanning",
    detail: "Optional upload scanning, on top of either profile.",
    vcpu: "—",
    ram: "+2 GB",
    disk: "—",
    cost: "—",
  },
] as const;

/** The three things the site must never let itself imply are shipping. */
export const NOT_YET = [
  {
    title: "In-player peer-to-peer delivery",
    body: `On the roadmap. It is not in ${VERSION}, so do not size your bandwidth around it.`,
  },
  {
    title: "DRM",
    body: "There is none. If your distributor requires encrypted playback, Vidra is the wrong tool.",
  },
  {
    title: "A hosted tier",
    body: "There is no hosted service and there will not be one. That is a design decision, not a gap in the roadmap.",
  },
] as const;
