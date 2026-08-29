import { ArchitectureExplorer } from "@/components/ArchitectureExplorer";
import {
  BookOpenIcon,
  RadioIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/icons";
import { Button, TextLink } from "@/components/Button";
import { CommandBlock } from "@/components/CommandBlock";
import { FederationFigure } from "@/components/FederationFigure";
import { InstallTabs } from "@/components/InstallTabs";
import { NotYet } from "@/components/NotYet";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { SizingCalculator } from "@/components/SizingCalculator";
import {
  DOCS,
  INSTALL_ANCHOR,
  INSTALL_COMMAND,
  LICENCE,
  VERSION,
} from "@/lib/site";

/** Four figures, each of which can be checked against a repository. */
const STATS = [
  { figure: "~$63", body: "a month runs a small private instance" },
  {
    figure: "Bluesky",
    body: "sign-in and cross-posting over ATProto; federation over ActivityPub",
  },
  { figure: "228", body: "API paths under one OpenAPI contract" },
  { figure: "AA", body: "axe gates CI in both frontends; this site pins WCAG 2.2 AA" },
];

const AUDIENCES = [
  {
    icon: VideoIcon,
    title: "An independent creator",
    body: "One 4 vCPU box, a CDN in front of it, and a channel people can follow over ActivityPub from wherever they already read.",
    leans: "Embeds · the bespoke player · resumable uploads",
    href: "/use-cases#creator",
    linkLabel: "More on the creator instance →",
  },
  {
    icon: UsersIcon,
    title: "A community or club",
    body: "A few dozen upload, a few hundred watch, and you answer for what appears. The moderation surface is in the box, not in a plugin.",
    leans: "Registration approval · reports · per-user quotas",
    href: "/use-cases#community",
    linkLabel: "More on the community instance →",
  },
  {
    icon: RadioIcon,
    title: "A newsroom or podcast network",
    body: "Live coverage that becomes an archive the moment it ends, and embargoed material that never turns into a public URL by accident.",
    leans: "RTMP to VOD · scoped playback tokens · auto-sync",
    href: "/use-cases#newsroom",
    linkLabel: "More on the newsroom instance →",
  },
  {
    icon: BookOpenIcon,
    title: "A course or conference archive",
    body: "Four years of talks that have to stay findable, with an accessibility obligation you cannot hand-wave away.",
    leans: "Whisper captions · chapters · hybrid search",
    href: "/use-cases#archive",
    linkLabel: "More on the archive instance →",
  },
];

const PROJECT = [
  {
    title: LICENCE,
    body: "Use it, study it, modify it, redistribute it. Run a modified version as a service and the network clause means your users get the source too.",
  },
  {
    title: "No hosted tier",
    body: "There is nothing to upsell you to and no pricing page that changes the day you depend on it. The only way to run Vidra is to run it.",
  },
  {
    title: "Clean room",
    body: "Not a PeerTube fork and not PeerTube-API-compatible. Migrating an existing instance across is supported and documented.",
  },
  {
    title: "Three repositories",
    body: "vidra-core (Go 1.26, Echo, PostgreSQL 18, Redis 8), vidra-user (Next.js 16) and vidra-search (Go), each with its own CI. Images build only from tags.",
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
              "radial-gradient(70% 62% at 18% -6%, rgb(34 189 227 / 0.22), rgb(34 189 227 / 0) 68%)",
          }}
        />
        {/* 72px graph paper, masked out before it reaches the type. */}
        <div
          aria-hidden="true"
          className="hero-grid pointer-events-none absolute inset-0 -z-10"
        />
        <div className="measure-text pt-12 pb-14 md:pt-22 md:pb-24">
          <p className="text-micro inline-flex items-center gap-2 rounded-full bg-ink-surface px-3 py-2 uppercase text-onink-2 ring-1 ring-inset ring-ink-hairline">
            <span
              aria-hidden="true"
              className="animate-pulse-dot h-2 w-2 rounded-full bg-vidra"
            />
            {VERSION} · {LICENCE}
          </p>
          {/* Two authored segments so the break never lands mid-claim: the
              canonical positioning line, then the mechanism in Vidra Cyan. */}
          <h1 className="text-hero mt-5 text-balance">
            <span className="block">Run your own video platform.</span>
            <span className="block text-vidra">One command.</span>
          </h1>
          <p className="text-standfirst mt-5 max-w-[54ch] text-pretty text-onink-2">
            Install it the way you install WordPress. No ads, nothing to upsell
            — and viewers can sign in with Bluesky.
          </p>
          {/* The headline says "One command." — the artifact is adjacent, and
              copying it is the page's primary conversion. */}
          <div className="mt-7 max-w-[620px]">
            <CommandBlock command={INSTALL_COMMAND} ground="ink" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/#calculator" variant="ice-outline" size="large">
              What will it cost me?
            </Button>
          </div>
          <dl className="mt-10 grid max-w-[820px] grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.figure}>
                <dt className="text-head text-vidra">{stat.figure}</dt>
                <dd className="text-small mt-2 text-onink-2">{stat.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2 — Who runs it. Paper. Self-recognition comes before the machinery:
          what is it → is it for me → what does it cost → how does it work. */}
      <Section ground="paper" id="use-cases" className="scroll-mt-18">
        <Eyebrow>Who runs it</Eyebrow>
        <Head className="mt-3">Four instances that look nothing alike.</Head>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {AUDIENCES.map((item) => (
            <article
              key={item.title}
              className="rounded-card border border-paper-hairline bg-white p-5"
            >
              {/* A drawn glyph in a Mist tile: the icon-tile idiom, Action
                  Cyan on the quiet tint, decorative beside the real heading. */}
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-mist text-action">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="text-card">{item.title}</h3>
              <p className="text-body mt-3 text-onpaper-2">{item.body}</p>
              <p className="text-small mt-4 text-link">{item.leans}</p>
              <p className="mt-4">
                <TextLink href={item.href}>{item.linkLabel}</TextLink>
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* 3 — Sizing. Ink. */}
      <Section ground="ink" id="calculator" className="scroll-mt-18">
        <Eyebrow ground="ink">Sizing</Eyebrow>
        <Head className="mt-3">Nobody publishes this. So here it is.</Head>
        <Standfirst ground="ink" className="mt-4">
          Move the sliders and the box changes. The two profiles come from the
          deploy guide; everything between them is arithmetic you can check.
        </Standfirst>
        <div className="mt-7">
          <SizingCalculator />
        </div>
        <p className="text-small mt-5 max-w-[70ch] text-onink-2">
          Two things that cost real money if you skip them: do not use a 2 GB
          droplet, and use Docker Compose 2.24 or newer. Older Compose silently
          publishes PostgreSQL and Redis on{" "}
          <code className="text-mono text-onink">0.0.0.0</code> — your database on
          the public internet, with no error to tell you.
        </p>
        <p className="mt-5">
          <TextLink href={DOCS.requirements} external ground="ink">
            The requirements, in detail →
          </TextLink>
        </p>
      </Section>

      {/* 4 — Install. Paper. */}
      <Section ground="paper" id="get-started" className="scroll-mt-18">
        <Eyebrow>Install</Eyebrow>
        <Head className="mt-3">Four ways in. Pick your box.</Head>
        <Standfirst className="mt-4">
          All four end in the same place: a running instance on {VERSION} with an
          owner account you claimed yourself.
        </Standfirst>
        <div className="mt-7">
          <InstallTabs />
        </div>
      </Section>

      {/* 5 — Architecture. Ink. */}
      <Section ground="ink" media>
        <Eyebrow ground="ink">Architecture</Eyebrow>
        <Head className="mt-3">Eight containers. Tap one.</Head>
        <Standfirst ground="ink" className="mt-4">
          This is the shipped compose file, not an architecture sketch. Each
          container does one job; tap it to see which.
        </Standfirst>
        <div className="mt-7">
          <ArchitectureExplorer />
        </div>
        <p className="text-small mt-5 max-w-[70ch] text-onink-2">
          Put a CDN in front of the HLS, or turn on the IPFS tier, and the bytes
          leave somebody else&apos;s network. What stays on your machine is
          encoding — and encoding is measurable.
        </p>
        <p className="mt-5">
          <TextLink href={DOCS.architecture} external ground="ink">
            The architecture, in the docs →
          </TextLink>
        </p>
      </Section>

      {/* 6 — Federation. Paper. */}
      <Section ground="paper">
        <Eyebrow>Federation</Eyebrow>
        <Head className="mt-3">Yours to enable. On for every channel once you do.</Head>
        <Standfirst className="mt-4">
          Three layers do three jobs. Step through them and watch what leaves
          your server.
        </Standfirst>
        <div className="mt-7">
          <FederationFigure />
        </div>
        <p className="mt-5">
          <TextLink href={DOCS.federation} external>
            How federation works, in the docs →
          </TextLink>
        </p>
      </Section>

      {/* 7 — Why not the alternatives. Ink. The teaser answers the two
          objections in prose and hands off to the full surfaces; a table here
          would fight the one-focal-point rule. */}
      <Section ground="ink">
        <Eyebrow ground="ink">Compared</Eyebrow>
        <Head className="mt-3">Why not YouTube? Why not PeerTube?</Head>
        <div className="mt-7 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-card">YouTube</h3>
            <p className="text-body mt-3 max-w-[60ch] text-onink-2">
              The terms, the moderation policy and the ranking are Google&apos;s
              to change, and the platform sells advertising against your
              audience. On your own instance there is no ad system and nobody
              between you and your viewers.
            </p>
            <p className="mt-4">
              <TextLink href="/features#comparison" ground="ink">
                The full comparison →
              </TextLink>
            </p>
          </div>
          <div>
            <h3 className="text-card">PeerTube</h3>
            <p className="text-body mt-3 max-w-[60ch] text-onink-2">
              PeerTube is the established choice, with years of maturity, a
              plugin ecosystem and in-player P2P that Vidra does not have.
              Vidra is a clean-room alternative that trades that head start for
              operability — a one-command install, a doctor, scripted backup
              and rollback — and viewers who can sign in with Bluesky.
            </p>
            <p className="mt-4">
              <TextLink href="/compare/peertube" ground="ink">
                Vidra vs PeerTube →
              </TextLink>
            </p>
          </div>
        </div>
      </Section>

      {/* 8 — The project. Mist, the quiet third ground. The trust subsection
          and NotYet sit in the same band: the evidence and the admission
          belong together — that adjacency is the trust design. */}
      <Section ground="mist">
        <Eyebrow>The project</Eyebrow>
        <Head className="mt-3">Free software, and nothing behind it.</Head>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {PROJECT.map((item) => (
            <div key={item.title}>
              <h3 className="text-card">{item.title}</h3>
              <p className="text-body mt-2 text-onpaper-2">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-[66ch]">
          <h3 className="text-sub">Is this ready?</h3>
          <p className="text-body mt-3 text-onpaper-2">
            Vidra is at {VERSION} — pre-1.0, and honest about it: the feature
            set is still growing, and three things it does not do are listed
            below. What is already fixed is the discipline it is built with.
            These gates run on every change, in every repository.
          </p>
          <dl className="mt-5 flex flex-col gap-4">
            <div>
              <dt className="text-body font-bold">Gates in every repo</dt>
              <dd className="text-small mt-1 text-onpaper-2">
                Race-detected tests, OpenAPI drift checks and integration
                suites against real Postgres and Redis — and a schema-compat
                gate proves the previous release runs on the new schema, so
                rollback is tested, not hoped for.
              </dd>
            </div>
            <div>
              <dt className="text-body font-bold">Releases, not branches</dt>
              <dd className="text-small mt-1 text-onpaper-2">
                Container images are built from release tags only — never from
                the main branch. What you pull is what was tagged.
              </dd>
            </div>
            <div>
              <dt className="text-body font-bold">Accessibility, gated</dt>
              <dd className="text-small mt-1 text-onpaper-2">
                axe accessibility failures fail CI in both frontends; this
                site&apos;s own CI additionally gates WCAG 2.2 AA explicitly.
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-7">
          <NotYet />
        </div>
      </Section>

      {/* 9 — Final CTA. Ink. */}
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
