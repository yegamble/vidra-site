import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Button, TextLink } from "@/components/Button";
import { CommandBlock } from "@/components/CommandBlock";
import { NotYet } from "@/components/NotYet";
import {
  RequirementsTable,
  RequirementsTruths,
} from "@/components/RequirementsTable";
import { ScreenSlot } from "@/components/ScreenSlot";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, GITHUB, INSTALL_COMMAND, LICENCE, VERSION } from "@/lib/site";

const FEDERATION = [
  {
    name: "ActivityPub",
    body: "Your channels and videos are addressable from the rest of the fediverse. Follows and replies travel over the protocol, not over an integration someone bolted on afterwards.",
  },
  {
    name: "ATProto",
    body: "Viewers sign in with Bluesky, or with any ATProto PDS they already have. Cross-posting a public video to Bluesky is optional and stays off until you switch it on.",
  },
  {
    name: "IPFS",
    body: "Media storage is dual-tier: a public tier that offloads delivery to gateways, and a private tier keyed to your own swarm for anything that should not leave it.",
  },
];

const CAPABILITIES = [
  {
    title: "Live",
    body: "RTMP ingest, privacy-gated HLS, and a replay that becomes a VOD the moment the stream ends.",
  },
  {
    title: "Uploads",
    body: "Resumable, chunked, or fetched from a URL. The URL path is SSRF-guarded, with a sandboxed yt-dlp you can enable.",
  },
  {
    title: "Player and captions",
    body: "A bespoke player with keyboard shortcuts, picture-in-picture and theatre mode. WebVTT captions you supply, or Whisper generating them.",
  },
  {
    title: "Search",
    body: "Hybrid full-text and trigram matching with typo-tolerant autosuggest, and a LightGBM ranker evaluated in shadow before it decides anything.",
  },
  {
    title: "Messages",
    body: "One-to-one direct messages, with optional end-to-end encryption using client-side Olm.",
  },
  {
    title: "API",
    body: "A 228-path OpenAPI contract, with /healthz, /readyz, /schemaz and /version probes behind it.",
  },
  {
    title: "Accessibility",
    body: "WCAG 2.2 AA, enforced by axe as a hard gate in CI. A regression fails the build rather than shipping.",
  },
  {
    title: "Storage and data",
    body: "Local disk or S3, your choice per instance. PostgreSQL 18 and Redis 8 behind 121 SQL migrations.",
  },
  {
    title: "Operating it",
    body: "More than a hundred instance settings you can change at runtime, durable job queues, Prometheus metrics and OpenTelemetry traces.",
  },
];

const AUDIENCES = [
  {
    title: "An independent creator",
    body: "You publish on a schedule and you would rather your archive did not live inside someone else's recommendation system. One 4 vCPU box, a CDN in front of it, and your channel is addressable from the fediverse.",
    matters: [
      "Embeds, RSS, oEmbed and a sitemap",
      "The bespoke player, on your own page",
      "ActivityPub and ATProto, per channel",
    ],
  },
  {
    title: "A community or club",
    body: "A few dozen people upload, a few hundred watch, and you are the one who answers for what gets posted. The moderation surface is in the box rather than in a plugin you have to trust.",
    matters: [
      "Registration approval and reports",
      "Per-user storage quotas",
      "Optional ClamAV scanning on upload",
    ],
  },
  {
    title: "A newsroom or podcast network",
    body: "Several channels under one instance, and live coverage that has to become an archive the moment it ends. One workflow covers both, and embargoed material never becomes a public URL by accident.",
    matters: [
      "RTMP live with replay to VOD",
      "Password-protected videos with scoped playback tokens",
      "Channel auto-sync mirroring",
    ],
  },
  {
    title: "A course or conference archive",
    body: "Hundreds of talks that have to stay findable years after the event, and an accessibility obligation you cannot hand-wave away. The archive has to read as well as it plays.",
    matters: [
      "Whisper captions, chapters and storyboards",
      "Hybrid search with typo-tolerant autosuggest",
      "WCAG 2.2 AA enforced in CI",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero. Ink. */}
      <section className="on-ink relative isolate overflow-hidden bg-ink text-onink">
        {/* Flat radial atmosphere. The one permitted radial on Ink. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 62% at 18% -6%, rgb(34 189 227 / 0.20), rgb(34 189 227 / 0) 68%)",
          }}
        />
        <div className="measure-text pt-16 pb-20 md:pt-28 md:pb-32">
          <h1 className="text-hero max-w-[16ch] text-balance">
            Run your own video platform.
          </h1>
          <p className="text-standfirst mt-6 max-w-[72ch] text-pretty text-onink-2">
            A federated video platform you install yourself, the way you would
            install WordPress. ActivityPub and ATProto federation, with media on
            IPFS if you want it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/get-started" variant="vidra">
              Get started
            </Button>
            <Button href="/demo" variant="ice-outline">
              See it running
            </Button>
          </div>
          <p className="text-mono mt-7 text-onink-2">
            {LICENCE} · one command to install · {VERSION}
          </p>
        </div>
      </section>

      {/* 2 — Install strip. Paper. */}
      <Section ground="paper">
        <Eyebrow>Install</Eyebrow>
        <Head className="mt-3">One command, then an interview.</Head>
        <div className="mt-8">
          <CommandBlock command={INSTALL_COMMAND} />
        </div>
        <p className="text-body mt-6 max-w-[66ch] text-onpaper-2">
          The script installs Docker Engine and Compose v2 if they are missing,
          unpacks a checksum-verified release bundle to{" "}
          <code className="text-mono text-onpaper">/opt/vidra</code>, installs the{" "}
          <code className="text-mono text-onpaper">vidra</code> CLI, and runs{" "}
          <code className="text-mono text-onpaper">vidra setup</code> — a terminal
          interview, or a{" "}
          <code className="text-mono text-onpaper">--web</code> wizard if you
          prefer a browser. It never writes over an existing env file, never opens
          a port, and never touches sshd.
        </p>
        <p className="text-body mt-4 max-w-[66ch] text-onpaper-2">
          On first boot every signup path refuses, including yours. The boot log
          prints an owner-claim token; you redeem it at{" "}
          <code className="text-mono text-onpaper">/setup/claim</code> and the
          instance is yours.
        </p>
        <p className="mt-6">
          <TextLink href={DOCS.root} external>
            Read what the installer does →
          </TextLink>
        </p>
      </Section>

      {/* 3 — Egress. Ink. */}
      <Section ground="ink" media>
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">Egress</Eyebrow>
          <Head className="mt-3">One small server. A million viewers.</Head>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="text-body space-y-5 text-onink">
              <p>
                Your box serves HLS. Put a CDN in front of it and the CDN serves
                the segments instead. Turn on the IPFS tier and public media is
                fetched from gateways. In each case the bytes leave somebody
                else&apos;s network, so your egress bill stops tracking your
                viewer count.
              </p>
              <p>
                What stays on your machine is encoding, and encoding is
                measurable. A 1080p <code className="text-mono">TargetAll</code>{" "}
                job runs 12 encode passes and takes roughly 1.5 to 2.5 times the
                source duration on 4 vCPU. Two concurrent jobs want about 16 GB
                of scratch at a 2 GB upload limit.
              </p>
            </div>
            <div className="text-body space-y-5 text-onink-2">
              <p>
                There is no DRM, and in-player peer-to-peer delivery is on the
                roadmap rather than in {VERSION}. Size your bandwidth for HLS, a
                CDN and IPFS gateways — the three things that actually carry
                bytes today.
              </p>
              <p>
                The topology below is the shipped compose file, not an
                architecture sketch. Every port is the port the container listens
                on.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <ArchitectureDiagram />
        </div>
      </Section>

      {/* 4 — Federation. Paper. */}
      <Section ground="paper">
        <Eyebrow>Federation</Eyebrow>
        <Head className="mt-3">
          Federation is on by default. Turn it off per channel.
        </Head>
        <Standfirst className="mt-6">
          Two protocols and one storage layer, each doing a specific job. None of
          them is a checkbox that phones an integration partner.
        </Standfirst>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEDERATION.map((item) => (
            <div
              key={item.name}
              className="rounded-card border border-paper-hairline bg-white p-6"
            >
              <h3 className="text-card">{item.name}</h3>
              <p className="text-body mt-3 text-onpaper-2">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 — What you get. Ink. */}
      <Section ground="ink">
        <Eyebrow ground="ink">What you get</Eyebrow>
        <Head className="mt-3">Shipped in {VERSION}, not planned.</Head>
        <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div key={item.title} className="border-t border-slate/70 pt-5">
              <dt className="text-card text-onink">{item.title}</dt>
              <dd className="text-small mt-2 text-onink-2">{item.body}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14">
          <NotYet ground="ink" />
        </div>

        <ScreenSlot label="The admin console, on a running instance" ground="ink" />

        <p className="mt-10">
          <TextLink href="/features" ground="ink">
            Every feature, grouped by lifecycle →
          </TextLink>
        </p>
      </Section>

      {/* 6 — Who runs it. Paper. */}
      <Section ground="paper">
        <Eyebrow>Who runs it</Eyebrow>
        <Head className="mt-3">Four instances that look nothing alike.</Head>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {AUDIENCES.map((item) => (
            <article
              key={item.title}
              className="rounded-card border border-paper-hairline bg-white p-6 md:p-8"
            >
              <h3 className="text-card">{item.title}</h3>
              <p className="text-body mt-3 text-onpaper-2">{item.body}</p>
              <h4 className="text-micro mt-6 uppercase text-label">
                What matters here
              </h4>
              <ul className="text-small mt-3 space-y-2 text-onpaper-2">
                {item.matters.map((m) => (
                  <li key={m} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action"
                    />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-10">
          <TextLink href="/use-cases">
            The four, in more detail →
          </TextLink>
        </p>
      </Section>

      {/* 7 — Requirements. Mist, the quiet tint. */}
      <Section ground="mist" id="requirements">
        <Eyebrow>Requirements</Eyebrow>
        <Head className="mt-3">What it costs to run.</Head>
        <Standfirst className="mt-6">
          Sizing from the deploy guide, with the prices of the droplets it was
          measured on. Nobody publishes this; you need it before you start, not
          after.
        </Standfirst>
        <div className="mt-10">
          <RequirementsTable />
        </div>
        <RequirementsTruths />
      </Section>

      {/* 8 — Project. Ink. */}
      <Section ground="ink">
        <Eyebrow ground="ink">The project</Eyebrow>
        <Head className="mt-3">Free software, and nothing behind it.</Head>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12">
          <div>
            <h3 className="text-card text-onink">The licence</h3>
            <p className="text-body mt-3 text-onink-2">
              Vidra is {LICENCE}. You can use it, study it, modify it and
              distribute it, as long as your changes carry the same licence — and
              if you run a modified version as a service, the network clause means
              your users get the source too.
            </p>
          </div>
          <div>
            <h3 className="text-card text-onink">Clean room</h3>
            <p className="text-body mt-3 text-onink-2">
              Vidra is not a PeerTube fork and it is not PeerTube-API-compatible.
              It is a clean-room implementation that happens to serve the same
              purpose. Migrating an existing PeerTube instance into Vidra is
              supported and documented.
            </p>
          </div>
          <div>
            <h3 className="text-card text-onink">Nobody to upsell you</h3>
            <p className="text-body mt-3 text-onink-2">
              There is no hosted tier and no plan for one — nothing to upsell you
              to, and no pricing page that changes the day you depend on it. The
              only way to run Vidra is to run it.
            </p>
          </div>
          <div>
            <h3 className="text-card text-onink">Releases</h3>
            <p className="text-body mt-3 text-onink-2">
              {VERSION} today. Three repositories carry the services — vidra-core
              (Go 1.26, Echo, PostgreSQL 18, Redis 8), vidra-user (Next.js 16) and
              vidra-search (Go) — each with its own CI. Container images are built
              only from tags.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={GITHUB.meta} external variant="ice-outline">
            Read the source
          </Button>
        </div>
      </Section>

      {/* 9 — Final CTA. Paper. */}
      <Section ground="paper">
        <Head>Start with one command.</Head>
        <div className="mt-8">
          <CommandBlock command={INSTALL_COMMAND} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={DOCS.root} external variant="ink-outline">
            Read the docs
          </Button>
          <Button href="/get-started" variant="action">
            Get started
          </Button>
        </div>
        <p className="text-small mt-6 text-label">
          Or clone the repository and bring up the compose file — the{" "}
          <Link href="/get-started" className="text-link underline underline-offset-4">
            four routes in
          </Link>{" "}
          are laid out side by side.
        </p>
      </Section>
    </>
  );
}
