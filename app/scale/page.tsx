import { pageMetadata } from "@/lib/metadata";
import { Button, TextLink } from "@/components/Button";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { StatusMark } from "@/components/StatusMark";
import {
  DOCS,
  INSTALL_ANCHOR,
  PROFILES,
  ROADMAP_URL,
  SCALE,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "Scale",
  path: "/scale",
  description:
    "How a Vidra instance grows: one image from a one-person box to an api+worker fleet, one variable apart — with the soak numbers, the shipped floor, the published roadmap, and the honest ceiling.",
});

/**
 * The page's discipline: every "proven" here means proven-in-validation, and
 * the page says so out loud — in the hero, in the ledger, and in the wall
 * band. The technical assessment's DO-NOT-SAY list is binding: no comparative
 * performance claims, no "enterprise version", never "live" joined to
 * "scale". "Enterprise" may name an audience, never a SKU — which is why this
 * route is /scale.
 */
const STEPS = [
  {
    title: "Start on one box",
    body: `The default role runs everything in one core process: it serves viewers and runs all ${SCALE.workers} background workers, video encoding included. The published profiles start at $${PROFILES.small.droplet} a month.`,
  },
  {
    title: "The library grows",
    body: "Flip canonical storage to S3-compatible object storage with a zero-downtime migration, hash-verified end to end. Uploads already stream straight to the backend — they never touch the server's local disk.",
  },
  {
    title: "The audience grows",
    body: `Split roles: api replicas behind a load balancer, worker hosts for encoding. Work rides durable Postgres queues, so adding workers adds throughput without double-processing — a two-replica soak delivered ${SCALE.soak} events with zero duplicates, then re-ran with the lease removed to prove the harness catches the failure it checks for. Put a CDN, with purge wired in, in front of public media. Encoding scales by adding hosts, not by stacking containers on one box — ffmpeg already uses the cores.`,
  },
  {
    title: "Past that, the roadmap",
    body: "Multi-CDN steering, studio DRM and multi-region replication are planned, written down with decision records, and not built. The roadmap is public, so you can judge the distance yourself.",
  },
];

const SHIPPED = [
  {
    title: "Roles and replicas",
    body: "One boot variable splits the same image into api and worker processes. Replicas take leases, elect a leader for sweeps, and drain behind /readyz — soak-tested at two replicas with a deliberate counterfactual.",
  },
  {
    title: "Zero-downtime storage migration",
    body: "Local to S3 with hash verification at every step; rollback is one settings change.",
  },
  {
    title: "CDN with purge",
    body: "Public media behind a CDN, with cache purge wired into the pipeline rather than left as an exercise.",
  },
  {
    title: "One-release rollback, enforced by CI",
    body: "A schema-compat gate proves the previous release runs on the new schema before anything ships, and vidra update arms the rollback.",
  },
];

const PLANNED = [
  {
    title: "Multi-CDN steering",
    body: "Content steering across CDNs — a decision record exists; nothing is built.",
  },
  {
    title: "Studio DRM",
    body: "Production DRM is not built. A test lane proves the seam, and nothing more.",
  },
  {
    title: "Multi-region replication",
    body: "A single region is the shipped shape; multi-region is on paper.",
  },
  {
    title: "Live beyond one host",
    body: "Live streaming runs on one host today, and no sentence on this site says otherwise.",
  },
];

export default function ScalePage() {
  return (
    <>
      {/* 1 — Hero. Ink. The honesty rides above the fold, not in a footnote. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-12 md:py-24">
          <Eyebrow ground="ink">Scale</Eyebrow>
          <Head as="h1" className="mt-3">
            From one box to a fleet.
          </Head>
          <Standfirst ground="ink" className="mt-5">
            A one-person instance on a box that costs $
            {PROFILES.small.droplet} a month and a replica fleet behind a load
            balancer run the same Vidra — the same image, one variable apart.
          </Standfirst>
          <p className="text-small mt-5 max-w-[60ch] text-onink-2">
            Validated at two api replicas and three workers; designed for more;
            not yet exercised by production traffic. This page says which is
            which.
          </p>
        </div>
      </section>

      {/* 2 — The four steps. Paper. Sequential prose, not tabs: this story is
          read start to finish, and it must be indexable. */}
      <Section ground="paper">
        <Eyebrow>How an instance grows</Eyebrow>
        <Head className="mt-3">One box or a fleet. Same image.</Head>
        <div className="mt-8 flex flex-col gap-8">
          {STEPS.map((step) => (
            <div key={step.title} className="border-t-2 border-ink pt-5">
              <h3 className="text-sub">{step.title}</h3>
              <p className="text-body mt-2 max-w-[66ch] text-onpaper-2">
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8">
          <TextLink href={ROADMAP_URL} external>
            The productionization plan, in full →
          </TextLink>
        </p>
        <p className="mt-3">
          <TextLink href="/use-cases#organisation">
            Running something bigger? →
          </TextLink>
        </p>
      </Section>

      {/* 3 — The ledger. Ink. Open, not disclosed: unlike NotYet's details
          element, the shipped/planned split IS the argument here, so it does
          not fold away. */}
      <Section ground="ink">
        <Eyebrow ground="ink">The ledger</Eyebrow>
        <Head className="mt-3">Shipped, and planned.</Head>
        <Standfirst ground="ink" className="mt-4">
          The floor below is soak-tested; the modules above it are written
          down, decision-recorded, and honestly unbuilt.
        </Standfirst>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <dl className="flex flex-col gap-5">
            {SHIPPED.map((item) => (
              <div key={item.title}>
                <dt className="text-body flex flex-wrap items-baseline gap-3 font-bold">
                  {item.title} <StatusMark status="shipped" />
                </dt>
                <dd className="text-small mt-1 text-onink-2">{item.body}</dd>
              </div>
            ))}
          </dl>
          <dl className="flex flex-col gap-5">
            {PLANNED.map((item) => (
              <div key={item.title}>
                <dt className="text-body flex flex-wrap items-baseline gap-3 font-bold">
                  {item.title} <StatusMark status="planned" />
                </dt>
                <dd className="text-small mt-1 text-onink-2">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 4 — The wall. Paper. The known limits stated by us before an
          evaluator finds them — this band is the page's trust engine, and it
          survives copy edits by design decision. */}
      <Section ground="paper">
        <Eyebrow>The ceiling</Eyebrow>
        <Head className="mt-3">The wall, named.</Head>
        <p className="text-body mt-5 max-w-[66ch] text-onpaper-2">
          The honest ceiling today: a single-region deployment — several api
          replicas and a worker fleet on one PostgreSQL, object storage as the
          canonical store, one CDN for public media, live streaming on one
          host. Validated at two replicas and three workers; designed for
          more; not yet exercised by production traffic.
        </p>
        <p className="text-body mt-4 max-w-[66ch] text-onpaper-2">
          And the first thing that needs rework past it: playback authorisation
          checks the database per request, which puts PostgreSQL on the byte
          path. It is in the plan; it is not done. You should know where the
          wall is before you pay to find it.
        </p>
      </Section>

      {/* 5 — Closing CTA. Ink. */}
      <Section ground="ink">
        <Head>Start with one command.</Head>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={INSTALL_ANCHOR} variant="vidra" size="large">
            Get started
          </Button>
          <Button href={DOCS.production} external variant="ice-outline" size="large">
            The production deployment
          </Button>
        </div>
      </Section>
    </>
  );
}
