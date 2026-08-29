import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { IpfsFigure } from "@/components/IpfsFigure";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Vidra uses IPFS",
  description:
    "Vidra can mirror public media to IPFS for gateway delivery, and replicate private media across a swarm-keyed private tier. What content addressing buys — integrity, location-independence, survivability if pinned — and what it does not: automatic hosting by others, speed, permanence.",
};

/**
 * The page whose honesty is the differentiator: every competitor's IPFS pitch
 * overclaims, and this page refuses to. Every Vidra-side fact traces to the
 * technical assessment (which cites vidra-core line by line); ecosystem facts
 * cite IPFS's own documentation, dated. The assessment's forbidden list is
 * absolute here: no speed claims, no permanence claims, no "others host your
 * files" as automatic — and never a sentence joining "messages" and "IPFS".
 */
export default function IpfsPage() {
  return (
    <>
      {/* 1 — Hero. Ink. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-12 md:py-24">
          <Eyebrow ground="ink">IPFS</Eyebrow>
          <Head as="h1" className="mt-3">
            What IPFS actually does here.
          </Head>
          <Standfirst ground="ink" className="mt-5">
            Vidra can mirror media to IPFS — a public tier for delivery, a
            private tier for replication. Both are off by default, and neither
            one means strangers host your videos. Here is the mechanism,
            without the folklore.
          </Standfirst>
        </div>
      </section>

      {/* 2 — The mirror, and the drawing. Paper. */}
      <Section ground="paper" media>
        <Eyebrow>The mechanism</Eyebrow>
        <Head className="mt-3">The mirror, not the master.</Head>
        <p className="text-body mt-5 max-w-[66ch] text-onpaper-2">
          The authoritative copy of every video stays in your storage — local
          disk or S3. IPFS is a mirror running beside it, and the compose file
          says so outright: an IPFS outage never blocks uploads or playback.
          Turning the mirror off costs you nothing but the mirror.
        </p>
        <div className="mt-7">
          <IpfsFigure />
        </div>
        <p className="text-small mt-5 max-w-[72ch] text-onpaper-2">
          The solid nodes are yours: your object store, your IPFS node, and any
          cluster replicas you run. Gateways pass content through and verify it
          by hash — they do not keep it. The dashed peer is potential: anyone
          with a public CID can choose to pin it. The sealed loop is the
          private tier; nothing crosses out of it.
        </p>
      </Section>

      {/* 3 — The fence. Ink. */}
      <Section ground="ink">
        <Eyebrow ground="ink">Eligibility</Eyebrow>
        <Head className="mt-3">The privacy fence decides first.</Head>
        <p className="text-body mt-5 max-w-[66ch] text-onink-2">
          Before anything is mirrored, an eligibility check runs — and its
          default answer is no. Only public, published videos (plus public
          playlist covers and active accounts&apos; identity images) can reach
          the public tier. Unlisted is treated as private. Direct-message
          attachments, exports, upload chunks, the live edge and anything the
          check does not recognise are refused on both tiers.
        </p>
      </Section>

      {/* 4 — The public tier. Paper. */}
      <Section ground="paper">
        <Eyebrow>The public tier</Eyebrow>
        <Head className="mt-3">Delivery, addressed.</Head>
        <p className="text-body mt-5 max-w-[66ch] text-onpaper-2">
          For eligible media, a durable queue streams the bytes from your
          storage into your own IPFS node, which computes the content address —
          the CID — and pins it. A full HLS ladder becomes one addressed
          directory with a single root, so every rendition and segment
          resolves as a path under one hash. From there, the gateway you
          configure serves it: small media redirects there automatically, and
          the watch page offers viewers an opt-in IPFS source for full videos.
          Gateway delivery takes those bytes off your application entirely. At
          rest you now hold two copies, both yours: the canonical object, and
          the pinned blocks on your node.
        </p>
      </Section>

      {/* 5 — The private tier. Ink. */}
      <Section ground="ink">
        <Eyebrow ground="ink">The private tier</Eyebrow>
        <Head className="mt-3">Replication, not distribution.</Head>
        <p className="text-body mt-5 max-w-[66ch] text-onink-2">
          Private media may mirror only to a separate, swarm-keyed node — a
          private network with no gateway, whose content addresses never
          appear in any API response. Its job is durability: your private
          media replicated across machines you run, a backup fabric rather
          than a delivery layer. The two tiers cannot share a node; routing
          between them fails closed.
        </p>
      </Section>

      {/* 6 — What it buys, and what it does not. Paper. */}
      <Section ground="paper">
        <Eyebrow>Content addressing</Eyebrow>
        <Head className="mt-3">What it buys, and what it does not.</Head>
        <div className="mt-5 flex max-w-[66ch] flex-col gap-4">
          <p className="text-body text-onpaper-2">
            Three things, and IPFS&apos;s own documentation is precise about
            them (docs.ipfs.tech, &ldquo;Content addressing&rdquo; and
            &ldquo;Gateways&rdquo;, 2026). Integrity: the address is a hash of
            the content, so anything served under it can be verified byte for
            byte, whoever serves it. Location-independence: the same address
            resolves through any gateway or peer that can reach a copy — the
            URL is not welded to one host. Survivability, if pinned: if
            someone pins your public video, it outlives your server. That
            last word is doing the work — persistence on IPFS requires
            pinning, and caches are garbage-collected.
          </p>
          <p className="text-body text-onpaper-2">
            Nobody hosts your files automatically. Pinning happens on your
            node and, if you run one, your cluster. Anyone holding a public
            CID may choose to pin it — that is a choice other people make, not
            a service the network performs, and it is also why joining the
            public network is treated as a permanent decision in the config:
            once another peer has fetched your blocks, switching the network
            off cannot recall them. No speed claim either: gateway latency has
            never been measured here, and the public gateway fleet has thinned
            — Cloudflare&apos;s closed in 2024, Infura&apos;s in August 2026,
            and ipfs.io rate-limits video. And no permanence: unpinned content
            is not guaranteed anywhere, including by us. Both switches — the
            mirror itself, and the public network — default to off.
          </p>
          <p className="text-body font-bold text-onpaper">
            Your video, stored where you put it, addressed so that anyone —
            including future mirrors you do not control — can serve it and
            verify it. Not: your video, hosted by the crowd.
          </p>
        </div>
      </Section>

      {/* 7 — Closing CTA. Ink. */}
      <Section ground="ink">
        <Head>Off by default. Yours to enable.</Head>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={INSTALL_ANCHOR} variant="vidra" size="large">
            Get started
          </Button>
          <Button
            href={DOCS.federation}
            external
            variant="ice-outline"
            size="large"
          >
            Federation and delivery, in the docs
          </Button>
        </div>
      </Section>
    </>
  );
}
