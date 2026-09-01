/**
 * Facts, not copy. Anything in here is a real command, a real URL or a real
 * number taken from the Vidra repositories. If a value cannot be pointed at a
 * source, it does not belong in this file.
 */

export const VERSION = "v0.6.0";
export const LICENCE = "AGPL v3";

export const INSTALL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/yegamble/vidra/main/install.sh | sh";

export const GITHUB = {
  /** The maintainer. One person, named, because the site asks readers to run
   *  a script from these repositories on a server they own. */
  profile: "https://github.com/yegamble",
  meta: "https://github.com/yegamble/vidra",
  core: "https://github.com/yegamble/vidra-core",
  user: "https://github.com/yegamble/vidra-user",
  search: "https://github.com/yegamble/vidra-search",
  branding: "https://github.com/yegamble/vidra-branding",
  licence: "https://github.com/yegamble/vidra/blob/main/LICENSE",
  /**
   * Where the version can actually be checked — and it is vidra-core, not the
   * meta repository.
   *
   * The installer never touches yegamble/vidra's releases. `install.sh:419`
   * resolves `api.github.com/repos/${OWNER}/vidra-core/releases/latest`,
   * `:604` builds its download base from
   * `github.com/${OWNER}/vidra-core/releases/download/${TAG}`, and `:645`
   * fetches SHA256SUMS from there. It then refuses at four separate points:
   * no `sha256sum` binary on the host (`:601`), no SHA256SUMS on the release
   * (`:653`), no line in it for the asset (`:679`), and a failed
   * `sha256sum -c` (`:681`) — nothing is unpacked before the sum checks out.
   *
   * So vidra-core's releases are what "the releases" and the version link
   * have to point at: they carry the assets a reader can verify the claim
   * against. Checked 2026-09-01 — v0.6.0 is latest, not draft, not
   * prerelease; /releases/latest resolves to /releases/tag/v0.6.0, titled
   * "Release v0.6.0 · yegamble/vidra-core"; and its six assets include
   * SHA256SUMS (which lists vidra-bundle_v0.6.0.tar.gz and the four CLI
   * binaries) and the bundle itself.
   *
   * The meta repository's own eight releases were batch-published on
   * 2026-09-01 in a fourteen-second window and carry ZERO assets, and its
   * latest is now v0.5.0 — behind the components it ships. A reader sent
   * there to check a checksum claim lands on a page that cannot answer it.
   * That repository is still `meta` above: it is where the install command,
   * the licence and the roadmap live.
   */
  releases: "https://github.com/yegamble/vidra-core/releases",
  latestRelease: "https://github.com/yegamble/vidra-core/releases/latest",
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
  /** Scratch space a concurrent transcode job wants, at a 2 GB upload limit. */
  scratchGbPerJob: 8,
  /** What the instance itself wants before any video: OS, images, database. */
  baseDiskGib: 40,
} as const;

/**
 * The shipped HLS ladder, read from vidra-core at the v0.6.0 tag:
 * `hlsRungBitrates` (internal/media/hls.go:52-61) keyed by
 * `DefaultHLSResolutionHeights` (:201), which is [1080, 720, 480, 360].
 *
 * Kbps, and the table is a ~30fps budget — hls.go says so in the comment above
 * it, and a high-frame-rate source is scaled up at planning time, so a 60fps
 * catalogue costs more than what is derived below, not less.
 *
 * The ladder is an operator setting (`transcoding_resolutions`), which is why
 * the calculator shows the rungs rather than one lump: dropping the 1080p rung
 * takes half the video bytes with it.
 */
export const LADDER = [
  { height: 1080, videoKbps: 5000, audioKbps: 160 },
  { height: 720, videoKbps: 2800, audioKbps: 128 },
  { height: 480, videoKbps: 1400, audioKbps: 128 },
  { height: 360, videoKbps: 800, audioKbps: 96 },
] as const;

/** One hour at `kbps`, in GiB. The site prices disk in GiB, so this is GiB. */
function gibPerHour(kbps: number) {
  return (kbps * 1000 * 3600) / 8 / 1024 ** 3;
}

const LADDER_VIDEO_KBPS = LADDER.reduce((n, r) => n + r.videoKbps, 0);
/**
 * CMAF stores ONE shared audio representation for the whole tree, and it is the
 * top rung's budget — `ladderPlan.audioBitrateKbps()`,
 * vidra-core/internal/media/packager.go:208-215. Which is also why every rung's
 * progressive MP4 carries 160 kbps of audio rather than its own rung's rate
 * (internal/media/web_video.go:104-135 says this about itself).
 */
const SHARED_AUDIO_KBPS = LADDER[0].audioKbps;

/**
 * What an instance RETAINS per source hour, DERIVED from the ladder above —
 * not assumed. This replaces a "2 GB an hour" assumption whose own note in this
 * file said "no repository pins a GB-per-hour number for the full HLS ladder".
 * The repository pins it: the ladder is a table of bitrates, and bitrate times
 * duration is bytes. Copy says "computes to", per the verb rule this file
 * already carries for the scratch figures.
 *
 * Shipped defaults only: CMAF packaging (`DefaultTranscodingPackager = "cmaf"`,
 * internal/config/config.go:2181) and H.264 alone — VP9, HEVC and AV1 all
 * default false at config.go:1061, 1065, 1066. Turning any of them on adds a
 * whole second set of representations.
 *
 * Persistence, so none of these five is scratch that gets swept: cmaf.go:530
 * stores each rung's tree and :534 removes only the local copy;
 * packager.go:486-489 describes the two progressive MP4s per rung;
 * web_video.go:165 PUTs the duplicate under its own prefix (:181).
 *
 * TWO THINGS ARE DELIBERATELY NOT IN THIS TOTAL:
 *   - The retained original. Vidra keeps the file it ingested and no
 *     configuration setting deletes it, but its size is the reader's own
 *     footage, so the calculator takes it as an input rather than inventing a
 *     figure for it.
 *   - Trick-play. One dense all-IDR rendition per rung, encoded at `-crf 28`
 *     with no rate target (`trickPlayEncodeArgs`, hls.go:831-847), so there is
 *     no bitrate to multiply and nothing to derive. It stays unknown and named
 *     as unknown rather than being folded into a point estimate.
 */
export const RETAINED = {
  perSourceHourGib: [
    {
      label: "CMAF segments — four video representations, one shared audio",
      gib: gibPerHour(LADDER_VIDEO_KBPS + SHARED_AUDIO_KBPS),
    },
    {
      label: "video.mp4 per rung, remuxed from those segments",
      gib: gibPerHour(LADDER_VIDEO_KBPS + LADDER.length * SHARED_AUDIO_KBPS),
    },
    {
      label: "video-only.mp4 per rung, beside it",
      gib: gibPerHour(LADDER_VIDEO_KBPS),
    },
    {
      label: "A second copy of each video.mp4, which nothing serves",
      gib: gibPerHour(LADDER_VIDEO_KBPS + LADDER.length * SHARED_AUDIO_KBPS),
    },
    { label: "audio.m4a", gib: gibPerHour(SHARED_AUDIO_KBPS) },
  ],
} as const;

/** The sum of the five: what one source hour costs in derivatives, in GiB. */
export const DERIVATIVES_GIB_PER_HOUR = RETAINED.perSourceHourGib.reduce(
  (n, row) => n + row.gib,
  0,
);

/**
 * Scale and pipeline figures. Each one is pinned to a source; the counts-drift
 * failure class applies to every number here, so change the source before you
 * change the value.
 */
export const SCALE = {
  /** 25 `jobloop.Loop{` registrations in vidra-core/cmd/api/main.go, counted
   *  at the v0.6.0 tag. It was 24 at v0.5.0: one release moved it. */
  workers: 25,
  /**
   * Two-replica soak: 406 deliveries for 406 unique events, zero duplicates,
   * draining 400 outbox events concurrently against one PostgreSQL.
   * vidra/docs/productionization/phase-3-media-pipeline.md:166-171.
   *
   * The counterfactual is not optional decoration and the site's claims gate
   * treats it as part of the number: with the lease AND `SKIP LOCKED` removed
   * and the image rebuilt, the same run produced 423 deliveries with 17
   * duplicates. Both safeguards came out, not just the lease — say both.
   * A clean run whose harness cannot fail is not evidence, so "406 of 406"
   * never appears on this site without 423 and 17 beside it.
   */
  soak: "406 of 406",
  soakControlDeliveries: 423,
  soakControlDuplicates: 17,
  /**
   * The second control: with `FOR UPDATE SKIP LOCKED` removed, verified
   * against real PostgreSQL, the double claim reproduces in 5 runs out of 5.
   * phase-3-media-pipeline.md:147-152.
   */
  skipLockedControlRuns: 5,
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
 * The published peer-to-peer decision. In-player P2P is **not** a roadmap
 * item, and copy that says it is contradicts the repositories:
 * `docs/productionization/p2p-delivery-decision.md` (Decided 2026-08-22) rules
 * "DEFER. Do not build P2P in phase 4", records that "the build half is not
 * scheduled", reserves the name only, and names DON'T BUILD as the correct
 * final state if its trigger never fires. `phase-4-delivery.md` marks item 6
 * closed. The site's /ipfs page has always framed it as a decision; every
 * other surface now says the same. URL checked 2026-08-31.
 */
export const P2P_DECISION_URL =
  "https://github.com/yegamble/vidra/blob/main/docs/productionization/p2p-delivery-decision.md";

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
    // A decision, not a gap — see P2P_DECISION_URL above. This entry stays in
    // NOT_YET because the feature does not ship; what changed is the claim
    // class, from PLANNED to a published decision.
    body: "A decision, not a gap: Vidra adds no peer-to-peer in the player, so watching a video never exposes a viewer's IP address to other viewers. The reasoning is published. Size your bandwidth for every byte the instance serves.",
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
