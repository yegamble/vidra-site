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

/**
 * Where the install flow lives. It is a section of the homepage rather than a
 * page of its own: /get-started is a permanent redirect here.
 */
export const INSTALL_ANCHOR = "/#get-started";

/** Every destination here exists. Nothing is a placeholder. */
export const NAV = [
  { label: "Features", href: "/features", external: false },
  { label: "Use cases", href: "/use-cases", external: false },
  { label: "Install", href: INSTALL_ANCHOR, external: false },
  { label: "Docs", href: DOCS.root, external: true },
  { label: "GitHub", href: GITHUB.meta, external: true },
] as const;

/**
 * The two sizing profiles from deploy/README, and the droplet list prices they
 * were measured on. The sizing calculator interpolates between them: it is the
 * only thing on the site that derives numbers rather than quoting them, so the
 * two anchors it derives from live here where they can be checked.
 */
export const PROFILES = {
  small: { vcpu: 4, ram: 8, disk: 160, droplet: 63 },
  launch: { vcpu: 8, ram: 16, disk: 160, droplet: 168 },
  /** ClamAV costs RAM, not cores. */
  clamavRamGb: 2,
  /** Block storage beyond the droplet's included 160 GB. */
  blockStoragePerGb: 0.1,
  /** The full HLS ladder, per hour of source. Varies with the source. */
  gbPerHour: 2,
  /** Scratch space a concurrent transcode job wants, at a 2 GB upload limit. */
  scratchGbPerJob: 8,
} as const;

/** The three things the site must never let itself imply are shipping. */
export const NOT_YET = [
  {
    title: "In-player peer-to-peer",
    body: `On the roadmap, not in ${VERSION}. Do not size your bandwidth around it.`,
  },
  {
    title: "DRM",
    body: "There is none. If your distributor requires encrypted playback, Vidra is the wrong tool.",
  },
  {
    title: "A hosted tier",
    body: "A design decision, not a gap in the roadmap.",
  },
] as const;
