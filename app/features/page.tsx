import type { Metadata } from "next";
import { Comparison } from "@/components/Comparison";
import { NotYet } from "@/components/NotYet";
import { Button, TextLink } from "@/components/Button";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR, VERSION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description:
    "What Vidra ships: resumable uploads, HLS transcoding, live streaming with replay-to-VOD, Whisper captions, hybrid search, ActivityPub federation, Bluesky sign-in, moderation and the operator CLI — and what it does not do yet.",
};

type Group = {
  name: string;
  intro: string;
  rows: { feature: string; detail: string }[];
};

const GROUPS: Group[] = [
  {
    name: "Publish",
    intro: "Getting video in, and getting it encoded.",
    rows: [
      {
        feature: "Resumable and chunked uploads",
        detail:
          "A dropped connection picks up where it stopped rather than starting the file again.",
      },
      {
        feature: "Upload from a URL",
        detail:
          "Asynchronous fetch, SSRF-guarded, with a sandboxed yt-dlp path you can enable.",
      },
      {
        feature: "Per-user quotas",
        detail:
          "Storage limits per account, so one uploader cannot fill the disk.",
      },
      {
        feature: "ClamAV scanning",
        detail:
          "Optional scanning on upload. Budget an extra 2 GB of RAM if you turn it on.",
      },
      {
        feature: "HLS ladder",
        detail:
          "H.264 and AAC. A 1080p TargetAll job runs 12 encode passes, about 1.5 to 2.5 times the source duration on 4 vCPU.",
      },
      {
        feature: "CMAF packaging and DASH",
        detail: "Packaged alongside HLS from the same renditions.",
      },
      {
        feature: "VP9 and WebM download",
        detail:
          "An optional downloadable rendition next to the streaming ladder.",
      },
      {
        feature: "Codec profile flags",
        detail: "HEVC and AV1 are behind flags and default to off.",
      },
      {
        feature: "Live streaming",
        detail:
          "RTMP ingest with privacy-gated HLS output, and a replay that becomes a VOD when the stream ends.",
      },
      {
        feature: "Channel auto-sync mirroring",
        detail: "Mirror a channel into your instance and keep it in step.",
      },
    ],
  },
  {
    name: "Watch",
    intro: "The player and everything around it.",
    rows: [
      {
        feature: "Bespoke player",
        detail:
          "Keyboard shortcuts, picture-in-picture and theatre mode, written for this platform rather than skinned onto a generic one.",
      },
      {
        feature: "I-frame trick-play",
        detail:
          "Scrubbing runs against an I-frame rendition, so the preview keeps up with the pointer.",
      },
      {
        feature: "Thumbnails, storyboards, chapters",
        detail:
          "Storyboards drive scrub previews; chapters break a long recording into parts.",
      },
      {
        feature: "WebVTT captions",
        detail:
          "Upload them, or have Whisper generate them and edit what it produced.",
      },
      {
        feature: "Password-protected videos",
        detail:
          "Scoped playback tokens, not an unlisted URL that leaks the moment somebody forwards it.",
      },
      {
        feature: "Embeds, oEmbed, RSS, sitemap, PWA",
        detail:
          "Your video plays on other people's pages, and your instance is readable by the things that index it.",
      },
    ],
  },
  {
    name: "Find",
    intro: "Search and ranking, with the parts still on probation labelled.",
    rows: [
      {
        feature: "Hybrid full-text and trigram search",
        detail:
          "Two indexes queried together, so a half-remembered title still resolves.",
      },
      {
        feature: "Typo-tolerant autosuggest",
        detail: "Suggestions while typing, tolerant of the wrong letters.",
      },
      {
        feature: "Decayed-counter trending",
        detail:
          "View counters decay with age, so last quarter's hit does not sit at the top forever.",
      },
      {
        feature: "Co-visitation recommendations",
        detail: "Built from what viewers actually watched next.",
      },
      {
        feature: "LightGBM ranker",
        detail:
          "Shadow-evaluated: it scores results and its scores are compared, but it does not decide the order until you promote it.",
      },
    ],
  },
  {
    name: "Connect",
    intro: "Two federation protocols, one storage network, and identity.",
    rows: [
      {
        feature: "ActivityPub",
        detail:
          "Your channels and videos are addressable from the rest of the fediverse.",
      },
      {
        feature: "ATProto",
        detail: "Viewers sign in with Bluesky, or with any ATProto PDS.",
      },
      {
        feature: "Cross-posting to Bluesky",
        detail: "Optional, for public videos, and off until you enable it.",
      },
      {
        feature: "IPFS media, dual-tier",
        detail:
          "A public tier that offloads delivery to gateways, and a private tier keyed to your own swarm.",
      },
      {
        feature: "Direct messages",
        detail:
          "One to one, with optional end-to-end encryption using client-side Olm.",
      },
      {
        feature: "OAuth, OIDC and TOTP two-factor",
        detail:
          "Sign in through an identity provider you already run, with a TOTP second factor either way.",
      },
    ],
  },
  {
    name: "Moderate",
    intro: "The work that starts on day two.",
    rows: [
      {
        feature: "Reports and moderation",
        detail: "A reporting path for viewers and a queue for acting on it.",
      },
      {
        feature: "Registration approval",
        detail: "New accounts wait for a person to let them in.",
      },
      {
        feature: "Admin console",
        detail:
          "More than a hundred instance settings, changeable at runtime rather than through a redeploy.",
      },
    ],
  },
  {
    name: "Operate",
    intro: "What you touch after it is live.",
    rows: [
      {
        feature: "The vidra CLI",
        detail:
          "setup, doctor, status, logs, deploy, rollback, backup and restore, all scripted.",
      },
      {
        // 26 is the length of the `checks` slice in
        // vidra-core/internal/doctor/doctor.go. The meta-repo README still
        // says 18; the code is the source, not the README.
        feature: "vidra doctor",
        detail: "26 checks against a running instance, with the failure named.",
      },
      {
        feature: "Probes",
        detail: "/healthz, /readyz, /schemaz and /version.",
      },
      {
        feature: "Metrics and traces",
        detail: "Prometheus metrics and OpenTelemetry traces, both first-party.",
      },
      {
        // Deliberately unpinned. A draft of this line said "13 of them"; that
        // count is not checkable against the tree, and a count on this site
        // cites code or stays unpinned.
        feature: "Durable queues",
        detail: "Queued work survives a restart.",
      },
      {
        feature: "Schema history",
        detail: "121 SQL migrations, versioned with the code.",
      },
      {
        feature: "API surface",
        detail: "228 paths under one OpenAPI contract.",
      },
      {
        feature: "Accessibility",
        detail:
          "Accessibility failures fail the build: axe gates CI in both frontends, and this site's own CI gates WCAG 2.2 AA explicitly.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* 1 — Hero. Ink. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-12 md:py-24">
          <Eyebrow ground="ink">Features</Eyebrow>
          <Head as="h1" className="mt-3">
            Everything in {VERSION}, in the order you meet it.
          </Head>
          <Standfirst ground="ink" className="mt-5">
            Grouped by lifecycle rather than by marketing category. Every line
            carries the detail that makes it checkable against a running
            instance.
          </Standfirst>
        </div>
      </section>

      {/* 2 — Publish · Watch · Find. Paper, opened by the jump nav: a reader
          who arrived to check one thing should not have to scroll blind
          through 38 rows. Non-sticky by design — glass and stickiness belong
          to the navigation layer alone. */}
      <Section ground="paper">
        <nav aria-label="Feature groups">
          <ul className="flex flex-wrap gap-3">
            {[...GROUPS.map((g) => g.name), "How it compares"].map((name) => (
              <li key={name}>
                <a
                  href={
                    name === "How it compares"
                      ? "#comparison"
                      : `#g-${name.toLowerCase()}`
                  }
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-small font-semibold text-onpaper ring-1 ring-inset ring-paper-hairline transition-colors hover:bg-ink/5"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 flex flex-col gap-11">
          {GROUPS.slice(0, 3).map((group) => (
            <FeatureGroup key={group.name} group={group} />
          ))}
        </div>
      </Section>

      {/* 3 — How it compares. Ink, mid-page: the strongest objection-handling
          content sits where the funnel actually reaches it, not at the foot
          of the page. */}
      <Section ground="ink" media id="comparison" className="scroll-mt-18">
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">How it compares</Eyebrow>
          <Head className="mt-3">Where Vidra differs, and where it does not.</Head>
          <Standfirst ground="ink" className="mt-5">
            Two of these columns agree more often than they differ — self-hosting
            is the thing they share. Where Vidra parts company is federation,
            runtime, and what you can do about egress.
          </Standfirst>
        </div>
        <div className="mt-8">
          <Comparison />
        </div>
        <p className="text-small mt-6 max-w-[72ch] text-onink-2">
          Vidra is a clean-room implementation rather than a fork of anything,
          and it is not PeerTube-API-compatible. Comparing against PeerTube
          specifically? That has{" "}
          <TextLink href="/compare/peertube" ground="ink">
            its own page
          </TextLink>
          . Moving an existing instance across is supported and documented —{" "}
          <TextLink href={DOCS.migration} external ground="ink">
            read the migration overview
          </TextLink>
          .
        </p>
      </Section>

      {/* 4 — Connect · Moderate · Operate. Paper. */}
      <Section ground="paper">
        <div className="flex flex-col gap-11">
          {GROUPS.slice(3).map((group) => (
            <FeatureGroup key={group.name} group={group} />
          ))}
        </div>

        {/* The three negatives stay on this page: a feature list is exactly
            where a reader goes looking for what is missing. */}
        <div className="mt-11">
          <NotYet />
        </div>
      </Section>

      {/* 5 — Closing CTA. Ink, the homepage's closing idiom: the page now has
          a conversion path instead of ending at the footer. */}
      <Section ground="ink">
        <Head>Start with one command.</Head>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={INSTALL_ANCHOR} variant="vidra" size="large">
            Get started
          </Button>
          <Button href={DOCS.root} external variant="ice-outline" size="large">
            Read the docs
          </Button>
        </div>
      </Section>
    </>
  );
}

function FeatureGroup({ group }: { group: Group }) {
  return (
    <section
      aria-labelledby={`g-${group.name.toLowerCase()}`}
      className="scroll-mt-18"
    >
      <div className="border-t-2 border-ink pt-5">
        <h2 id={`g-${group.name.toLowerCase()}`} className="text-sub">
          {group.name}
        </h2>
        <p className="text-body mt-2 text-onpaper-2">{group.intro}</p>
      </div>
      <dl className="mt-6 grid gap-x-9 gap-y-6 sm:grid-cols-2">
        {group.rows.map((row) => (
          <div key={row.feature}>
            <dt className="text-body font-bold">{row.feature}</dt>
            <dd className="text-small mt-1 text-onpaper-2">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
