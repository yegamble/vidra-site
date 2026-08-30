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

/**
 * Every path below exists in vidra-docs/sidebars.ts (checked 2026-08-30).
 * Deep links go through this map only — never a literal in a component.
 */
export const DOCS = {
  root: "/docs",
  quickstart: "/docs/start/quickstart",
  requirements: "/docs/start/requirements",
  architecture: "/docs/concepts/architecture",
  videoPipeline: "/docs/concepts/video-pipeline",
  federation: "/docs/concepts/federation",
  search: "/docs/concepts/search",
  oneLineInstall: "/docs/install/one-line-install",
  production: "/docs/install/production",
  cli: "/docs/operate/cli",
  moderation: "/docs/operate/moderation",
  migration: "/docs/migration/overview",
  migrationPlanning: "/docs/migration/planning",
  migrationCutover: "/docs/migration/cutover",
  migrationTroubleshooting: "/docs/migration/troubleshooting",
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
 * The two sizing profiles from deploy/README, and the droplet plans they are
 * bought on. The sizing calculator interpolates between them: it is the only
 * thing on the site that derives numbers rather than quoting them, so the two
 * anchors it derives from live here where they can be checked.
 *
 * Every figure below is a DigitalOcean list price or a DigitalOcean plan
 * specification, checked 2026-08-30 against the provider's own pricing page —
 * the same discipline `blockStoragePerGb` has always carried. They are not
 * deploy/ figures: deploy/README names the shape of each box, and the plan
 * that sells that shape is looked up here.
 *
 * The previous values were wrong in two ways and both are corrected here. The
 * small profile was priced at $63, which is no plan; the plan that carries
 * 4 vCPU and 8 GB is Premium AMD at $56.00. The launch profile was labelled
 * with a shared-core class and a copied 160 GiB disk; the box deploy/README
 * actually asks for — dedicated cores, because sustained ffmpeg is the whole
 * point of it — is the CPU-Optimized c-8, which ships 100 GiB of disk, not
 * 160. That is the more expensive correction: a launch instance now prices
 * block storage sooner rather than later.
 *
 * Recorded as the defensible alternative NOT chosen: a shared-core 8 vCPU /
 * 16 GB / 320 GiB box at $112.00/mo. It is cheaper and has more disk, and it
 * shares its cores — which is exactly the thing a transcode queue cannot
 * afford.
 */
export const PROFILES = {
  small: {
    vcpu: 4,
    ram: 8,
    /** GiB of SSD included with the plan. */
    disk: 160,
    droplet: 56,
    /** GiB of outbound transfer included per month. */
    transfer: 5000,
    class: "Premium AMD",
    slug: "s-4vcpu-8gb-amd",
  },
  launch: {
    vcpu: 8,
    ram: 16,
    disk: 100,
    droplet: 168,
    transfer: 6000,
    class: "CPU-Optimized",
    slug: "c-8",
  },
  /** ClamAV costs RAM, not cores. */
  clamavRamGb: 2,
  /**
   * Block storage beyond the disk the plan includes. Source: DigitalOcean
   * volume list pricing, $0.10/GiB-month (checked 2026-08-30) — a provider
   * price, not a deploy/ figure.
   */
  blockStoragePerGb: 0.1,
  /**
   * Outbound transfer past the pooled monthly allowance, $0.01/GiB. The
   * allowance pools across every droplet on the team and accrues per second
   * over a 28-day month, so it is never a per-droplet number; inbound
   * transfer is free. Source: docs.digitalocean.com/platform/billing/bandwidth
   * (checked 2026-08-30).
   */
  egressPerGb: 0.01,
  /**
   * ASSUMPTION, not a measured figure. No repository pins a GB-per-hour number
   * for the full HLS ladder; anything derived from this must be labelled an
   * estimate in the UI. Durable fix: measure a real encode corpus, document the
   * figure in deploy/README, then re-pin and drop the label.
   */
  gbPerHour: 2,
  /** Scratch space a concurrent transcode job wants, at a 2 GB upload limit. */
  scratchGbPerJob: 8,
} as const;

/**
 * Scale and pipeline figures. Each one is pinned to a source; the counts-drift
 * failure class applies to every number here, so change the source before you
 * change the value.
 */
export const SCALE = {
  /** 24 `jobloop.Loop{` registrations in vidra-core/cmd/api/main.go. */
  workers: 24,
  /**
   * Two-replica soak: 406 of 406 deliveries, zero duplicates; the deliberate
   * counterfactual (lease removed) produced 17 duplicates, proving the
   * harness catches the failure it checks for.
   * vidra/docs/productionization/phase-3-media-pipeline.md:166.
   */
  soak: "406 of 406",
  /**
   * Lean encoding on object storage: full-source decodes 13 → 3, source
   * reads "up to 8" → 1; peak scratch ~10.3 → ~3.6 GB (computed from the
   * ladder table, not measured — copy must say "computes to").
   * vidra/docs/productionization/lean-encoding-on-object-storage.md:358-360.
   *
   * `readsBefore` is a ceiling, not a fixed count: the source says "up to 8",
   * so copy says "down from up to 8". "down from 8" claims every job read it
   * eight times, which is not what the old path did.
   */
  decodesBefore: 13,
  decodesAfter: 3,
  readsBefore: 8,
  readsAfter: 1,
  scratchBeforeGb: 10.3,
  scratchAfterGb: 3.6,
} as const;

/**
 * Messaging figures, from vidra-core: E2EE disappearing-message timers
 * (internal/e2ee/service.go:24-34, 30 s to 90 days) and the plaintext-lane
 * attachment cap (internal/messaging/service.go:76-81, 100 MiB). E2EE
 * conversations refuse attachments; never join "messages" and "IPFS" in copy.
 */
export const MESSAGING = {
  timerMin: "30 seconds",
  timerMax: "90 days",
  attachmentCapMiB: 100,
} as const;

/** The public productionization corpus — the "published roadmap" links here. */
export const ROADMAP_URL =
  "https://github.com/yegamble/vidra/tree/main/docs/productionization";

/**
 * The three things the site must never let itself imply are shipping.
 *
 * `surfaced` marks the one that does not go behind a disclosure. DRM is the
 * only entry here that can waste a reader's entire evaluation: peer-to-peer
 * and the hosted tier change what an instance costs, and DRM decides whether
 * Vidra is usable at all for anyone whose distributor requires encrypted
 * playback. A negative with that much leverage does not belong behind a
 * summary element.
 */
export const NOT_YET = [
  {
    title: "In-player peer-to-peer",
    body: `On the roadmap, not in ${VERSION}. Do not size your bandwidth around it.`,
    surfaced: false,
  },
  {
    title: "DRM",
    body: "None shipped: a test lane proves the seam, and production DRM sits behind an unbuilt roadmap item. If your distributor requires encrypted playback today, Vidra is the wrong tool.",
    surfaced: true,
  },
  {
    title: "A hosted tier",
    body: "A design decision, not a gap in the roadmap.",
    surfaced: false,
  },
] as const;
