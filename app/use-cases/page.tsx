import { pageMetadata } from "@/lib/metadata";
import { Button, TextLink } from "@/components/Button";
import {
  BookOpenIcon,
  HostsIcon,
  RadioIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/icons";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Use cases",
  path: "/use-cases",
  description:
    "Who runs Vidra and on what: an independent creator, a community, a newsroom, a course archive, an organisation outgrowing one box — the features each one leans on, and what the server costs, from $56 a month.",
});

type UseCase = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  scenario: [string, string];
  matters: { feature: string; why: string }[];
  sizing: string;
  docs: { href: string; label: string };
};

const CASES: UseCase[] = [
  {
    id: "creator",
    icon: VideoIcon,
    eyebrow: "One person, one channel",
    title: "An independent creator",
    scenario: [
      "You publish on a schedule and your back catalogue is the asset. What you do not want is for that catalogue to sit inside a recommendation system you cannot see, on terms that change without notice.",
      "So you run one 4 vCPU box, put a CDN in front of it, and embed the player on your own pages. Your channel is addressable over ActivityPub, so people can follow it from wherever they already read.",
    ],
    matters: [
      {
        feature: "Embeds, oEmbed, RSS and a sitemap",
        why: "Your video plays on other people's pages and your archive stays indexable.",
      },
      {
        feature: "The bespoke player",
        why: "Keyboard shortcuts, picture-in-picture and theatre mode on a page you control.",
      },
      {
        feature: "ActivityPub and ATProto, per channel",
        why: "Followers reach you over protocols rather than over an account you rent.",
      },
      {
        feature: "Resumable uploads",
        why: "A 90-minute master over a domestic connection resumes instead of restarting.",
      },
    ],
    sizing: "Small, private: 4 vCPU, 8 GB, 160 GiB — $56 a month.",
    docs: { href: DOCS.quickstart, label: "Read the quickstart →" },
  },
  {
    id: "community",
    icon: UsersIcon,
    eyebrow: "Many uploaders, one owner",
    title: "A community or club",
    scenario: [
      "A few dozen members upload and a few hundred watch. The technical part is not the hard part — the hard part is that you are the person who answers for what appears on the instance.",
      "Registration approval keeps signups behind a human. Per-user quotas stop one enthusiastic uploader from filling the disk, and ClamAV scanning is a flag rather than a project.",
    ],
    matters: [
      {
        feature: "Registration approval",
        why: "New accounts wait for a person to let them in.",
      },
      {
        feature: "Reports and moderation",
        why: "A reporting path for members and a queue for acting on it.",
      },
      {
        feature: "Per-user quotas",
        why: "Storage limits per account, set before they matter rather than after.",
      },
      {
        feature: "Optional ClamAV scanning",
        why: "Uploads scanned on the way in. Costs about 2 GB of RAM.",
      },
    ],
    sizing:
      "Small, private with headroom: 4 vCPU and 8 GB, plus 2 GB if you enable ClamAV.",
    docs: { href: DOCS.moderation, label: "Moderation, from day two →" },
  },
  {
    id: "newsroom",
    icon: RadioIcon,
    eyebrow: "Several channels, live and archived",
    title: "A newsroom or podcast network",
    scenario: [
      "You run several channels under one instance, and some of what you publish is live. A council meeting, a launch, a recorded interview embargoed until Thursday — each has a different audience and a different moment.",
      "RTMP ingest takes the stream, privacy-gated HLS controls who can watch it while it runs, and the replay becomes a VOD without a second workflow. Embargoed material sits behind a scoped playback token rather than an unlisted URL.",
    ],
    matters: [
      {
        feature: "RTMP live with replay to VOD",
        why: "The stream and the archive are one pipeline, not two.",
      },
      {
        feature: "Password-protected videos",
        why: "An embargo that survives somebody pasting the link into a group chat.",
      },
      {
        feature: "Channel auto-sync mirroring",
        why: "Keep a mirrored channel current without a manual re-upload.",
      },
      {
        feature: "Runtime-editable instance settings",
        why: "Change instance behaviour during an event without a redeploy.",
      },
    ],
    sizing:
      "Public launch: 8 vCPU, 16 GB on dedicated cores — $168 a month, plus block storage past the plan's 100 GiB.",
    docs: { href: DOCS.videoPipeline, label: "The pipeline, live to VOD →" },
  },
  {
    id: "archive",
    icon: BookOpenIcon,
    eyebrow: "Hundreds of talks, kept legible",
    title: "A course or conference archive",
    scenario: [
      "You have four years of talks and every one of them has to stay findable. Nobody browses an archive; they search it, half-remember the title, and give up if the first result is wrong.",
      "Hybrid full-text and trigram search with typo-tolerant autosuggest is the difference between finding a 2023 keynote and not. Whisper captions make the spoken content searchable as well as accessible.",
    ],
    matters: [
      {
        feature: "Whisper captions and WebVTT",
        why: "Generated captions you can correct, on hundreds of hours of talks.",
      },
      {
        feature: "Chapters and storyboards",
        why: "A long recording becomes navigable instead of a single scrubbing bar.",
      },
      {
        feature: "Hybrid search with autosuggest",
        why: "Full-text and trigram together, so a wrong spelling still lands.",
      },
      {
        feature: "Accessibility gates in CI",
        why: "Accessibility failures fail the frontend build — axe gates serious and critical findings — so the obligation is checkable.",
      },
    ],
    sizing:
      "Small, private to start, moving to public launch as the catalogue and concurrent viewers grow.",
    docs: { href: DOCS.search, label: "How search works →" },
  },
  {
    id: "organisation",
    icon: HostsIcon,
    eyebrow: "Many channels, a team behind them",
    title: "An organisation outgrowing one box",
    scenario: [
      "Your catalogue and audience no longer fit the launch profile: encoding queues back up on release days, and one machine is a single point of failure that you answer for.",
      "The image you installed on day one splits into roles — api replicas behind a load balancer, worker hosts for encoding — with object storage as the canonical store and a CDN with purge in front of public media. What is not built yet — multi-CDN steering, studio DRM, multi-region — is written down in a public roadmap with decision records, so you can judge the distance before you commit.",
    ],
    matters: [
      {
        feature: "Role-split deployment",
        why: "One image, split into api and worker by a boot variable. No fork, and no separate enterprise build to buy.",
      },
      {
        feature: "Durable Postgres queues",
        why: "Adding worker hosts adds encode throughput without double-processing — soak-tested with a deliberate counterfactual.",
      },
      {
        feature: "One-release rollback, enforced by CI",
        why: "In vidra-core, every migration runs the previous release's own integration suite against the new schema before it merges, and vidra update puts the previous tags back if the deploy's health probes fail.",
      },
      {
        feature: "Zero-downtime storage migration",
        why: "Local to S3 with hash verification at every step; rollback is one settings change.",
      },
    ],
    sizing:
      "Beyond the published profiles. Validated at two api replicas and three workers on one PostgreSQL; a single-region deployment is the honest ceiling today, and live streaming stays on one host.",
    docs: { href: DOCS.production, label: "The production deployment →" },
  },
];

export default function UseCasesPage() {
  return (
    <>
      {/* 1 — Hero. Ink. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-12 md:py-24">
          <Eyebrow ground="ink">Use cases</Eyebrow>
          <Head as="h1" className="mt-3">
            Five instances, and what each one needs.
          </Head>
          <Standfirst ground="ink" className="mt-5">
            The same software, sized and configured five different ways.
          </Standfirst>
        </div>
      </section>

      {/* 2 — The five, as cards. Paper. */}
      <Section ground="paper">
        <div className="flex flex-col gap-11">
          {CASES.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="rounded-card border border-paper-hairline bg-white p-6 scroll-mt-18"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mist text-action">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-micro uppercase text-label">{item.eyebrow}</p>
                  <h2 className="text-head mt-2">{item.title}</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="text-body flex flex-col gap-4 text-onpaper-2">
                  {item.scenario.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                <div>
                  <h3 className="text-micro uppercase text-label">
                    What matters here
                  </h3>
                  <dl className="mt-4 flex flex-col gap-4">
                    {item.matters.map((m) => (
                      <div key={m.feature}>
                        <dt className="text-body font-bold">{m.feature}</dt>
                        <dd className="text-small mt-1 text-onpaper-2">
                          {m.why}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-small mt-5 rounded-xl bg-mist p-4 text-onpaper">
                    <span className="text-micro block uppercase text-label">
                      Sizing
                    </span>
                    <span className="mt-2 block">{item.sizing}</span>
                    <TextLink href="/#calculator" className="mt-3 inline-block">
                      Check the arithmetic →
                    </TextLink>
                  </p>
                  <p className="mt-5">
                    <TextLink href={item.docs.href} external>
                      {item.docs.label}
                    </TextLink>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 3 — Closing CTA. Ink. The page where readers recognise themselves
          must not be a dead end. */}
      <Section ground="ink">
        <Head>Start with one command.</Head>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={INSTALL_ANCHOR} variant="vidra" size="large">
            Get started
          </Button>
          <Button href="/#calculator" variant="ice-outline" size="large">
            What will it cost me?
          </Button>
        </div>
      </Section>
    </>
  );
}
