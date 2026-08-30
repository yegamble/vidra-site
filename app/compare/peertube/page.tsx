import type { Metadata } from "next";
import { Button, TextLink } from "@/components/Button";
import { Comparison, type ComparisonRow } from "@/components/Comparison";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR, MESSAGING, SCALE, VERSION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vidra vs PeerTube",
  description:
    "Vidra and PeerTube, compared honestly: federation, Bluesky sign-in, direct messages, uploads, operability, scaling, in-player P2P — checked against PeerTube 8.2 — and the one-way migration path.",
};

/**
 * The PeerTube column is checked against PeerTube's own documentation and
 * repository, version-pinned and date-stamped in the visible caption below the
 * table, so the claims age honestly. The Vidra column traces to the Vidra
 * repositories, per hard rule 5.
 */
const COLUMNS = ["PeerTube", "Vidra"];

const ROWS: ComparisonRow[] = [
  {
    label: "Lineage",
    cells: [
      "The established ActivityPub video platform; current stable v8.2.4 (August 2026).",
      `A clean-room implementation, ${VERSION} — not a fork, and not PeerTube-API-compatible.`,
    ],
  },
  {
    label: "Federation",
    cells: [
      "ActivityPub (as of PeerTube 8.2, August 2026).",
      "ActivityPub federation, enabled per instance; once on, every channel federates by default and can opt out.",
    ],
  },
  {
    label: "Bluesky",
    cells: [
      "No ATProto support as of v8.2.4.",
      "Viewers sign in with Bluesky or any ATProto PDS; opt-in cross-posting of public videos. Outbound only — no inbound path.",
    ],
  },
  {
    label: "Direct messages",
    cells: [
      "None as of v8.2.4 (August 2026) — the closest surface is the moderation thread on an abuse report.",
      `One-to-one messages, with an opt-in end-to-end encrypted mode — encryption runs on the device, the server stores only ciphertext — and disappearing timers, ${MESSAGING.timerMin} to ${MESSAGING.timerMax}, on encrypted conversations.`,
    ],
  },
  {
    label: "In-player P2P",
    cells: [
      "Built in: playback shares bandwidth between viewers over WebRTC, and a viewer can turn it off.",
      `None in ${VERSION}. On the roadmap — do not size your bandwidth around it.`,
    ],
  },
  {
    // PeerTube cell checked against docs.joinpeertube.org/admin/remote-storage
    // on 2026-08-28, per the page's caption discipline.
    label: "Uploads and storage",
    cells: [
      "Uploads and transcodes work on local disk; with remote storage configured, files move to S3 after processing.",
      "Object-storage-native: upload chunks stream straight to the storage backend and never touch the server's local disk. A server dying mid-upload loses nothing.",
    ],
  },
  {
    label: "Operations",
    cells: [
      "Judge it from PeerTube's own admin documentation.",
      "One command in; vidra doctor runs 26 checks and names the failure; deploy, rollback, backup and restore are scripted.",
    ],
  },
  {
    // PeerTube cell checked against docs.joinpeertube.org/admin/remote-runners
    // on 2026-08-28.
    label: "Growing past one box",
    cells: [
      "Remote runners can take transcoding off the main server; judge the rest from PeerTube's own admin documentation.",
      `The same image splits into api and worker roles. Replicas hold leases and elect leaders — soak-tested at two replicas, ${SCALE.soak} deliveries, zero duplicates — and a CDN with purge is wired in. Multi-CDN steering, studio DRM and multi-region are the published roadmap, not the release.`,
    ],
  },
  {
    label: "What it costs to run",
    cells: [
      "Depends on your instance — check your own numbers.",
      "Two published profiles with prices — $56/mo (4 vCPU, 8 GB) and $168/mo (8 vCPU, 16 GB on dedicated cores) — and a calculator that shows its arithmetic, block storage and transfer allowance included.",
    ],
  },
  {
    label: "Moving an instance",
    cells: [
      "Home ground — nothing to move.",
      "A one-way importer reads a PeerTube database and media store read-only and maps users, channels, videos, comments, playlists and follows. Nothing exports back.",
    ],
  },
  {
    label: "Licence",
    cells: [
      "AGPL v3.",
      "AGPL v3 — the same licence. No difference to invent here.",
    ],
  },
];

const MIGRATION_STEPS = [
  "Stand up the Vidra instance first, on the sizing your catalogue needs — the importer needs somewhere to land.",
  "Point the importer at your PeerTube database and media store. It reads the source read-only; the run is idempotent and resumable, and --dry-run shows the plan first.",
  "It maps users, channels, videos, thumbnails, chapters, comments, ratings, playlists and follows — original publication dates and view counts included.",
  "Cut over when it is done. The importer is one-way: nothing writes back to PeerTube, so your source instance stays untouched until you retire it.",
];

export default function ComparePeerTubePage() {
  return (
    <>
      {/* 1 — Hero. Ink. The clean-room admission leads: it is the page's
          credibility down-payment. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-12 md:py-24">
          <Eyebrow ground="ink">Compare</Eyebrow>
          <Head as="h1" className="mt-3">
            Vidra and PeerTube, compared.
          </Head>
          <Standfirst ground="ink" className="mt-5">
            Vidra is a clean-room implementation — not a fork, not
            PeerTube-API-compatible. Here is where the two differ, where
            PeerTube is ahead, and what moving an instance across involves.
          </Standfirst>
        </div>
      </section>

      {/* 2 — The short answer. Paper. Concessions come first. */}
      <Section ground="paper">
        <Eyebrow>The short answer</Eyebrow>
        <div className="text-body mt-5 flex max-w-[66ch] flex-col gap-4 text-onpaper-2">
          <p>
            PeerTube is the mature choice: years in production, a plugin
            system, a large ecosystem of instances, and in-player peer-to-peer
            that shares playback bandwidth between viewers. Vidra has none of
            those — it is at {VERSION}, it has no plugin system, and P2P is on
            the roadmap, not in the release.
          </p>
          <p>
            What Vidra offers instead is the operator&apos;s path: one command
            installs it, vidra doctor runs 26 checks and names the failure, and
            deploy, rollback, backup and restore are scripted, with published
            sizing that carries prices. It also speaks ATProto: viewers can
            sign in with Bluesky or any PDS, and public videos can cross-post
            to Bluesky — PeerTube federates over ActivityPub only. Vidra also
            ships direct messages — including an end-to-end encrypted mode
            with disappearing timers — where PeerTube has no user-to-user
            messaging at all.
          </p>
          <p>
            If you run PeerTube happily, keep running it. If operations are the
            pain, or your audience lives on Bluesky, Vidra was built for
            exactly that — and a one-way importer moves an existing instance
            across.
          </p>
        </div>
      </Section>

      {/* 3 — The table. Ink. Visible verification caption: the [verify]
          discipline, made legible. */}
      <Section ground="ink" media>
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">Side by side</Eyebrow>
          {/* Deliberately uncounted: a counted heading is the count-drift
              failure class waiting to recur every time a row is added. */}
          <Head className="mt-3">The differences that decide it.</Head>
        </div>
        <div className="mt-8">
          <Comparison
            columns={COLUMNS}
            rows={ROWS}
            emphasisIndex={1}
            srCaption="Vidra compared with PeerTube"
          />
        </div>
        <p className="text-small mt-6 text-onink-2">
          PeerTube column checked against PeerTube&apos;s own documentation,
          v8.2.4, August 2026.
        </p>
      </Section>

      {/* 4 — Migrating. Paper. */}
      <Section ground="paper">
        <Eyebrow>Migrating</Eyebrow>
        <Head className="mt-3">One way, read-only at the source.</Head>
        <ol className="text-body mt-5 flex max-w-[66ch] list-decimal flex-col gap-3 pl-6 text-onpaper-2 marker:text-label">
          {MIGRATION_STEPS.map((step) => (
            <li key={step.slice(0, 32)}>{step}</li>
          ))}
        </ol>
        <p className="mt-6">
          <TextLink href={DOCS.migration} external>
            Read the migration overview →
          </TextLink>
        </p>
      </Section>

      {/* 5 — Closing CTA. Ink. */}
      <Section ground="ink">
        <Head>One command to see for yourself.</Head>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={INSTALL_ANCHOR} variant="vidra" size="large">
            Install Vidra
          </Button>
          <Button href={DOCS.migration} external variant="ice-outline" size="large">
            Read the migration overview
          </Button>
        </div>
      </Section>
    </>
  );
}
