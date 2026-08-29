import type { Metadata } from "next";
import {
  BookOpenIcon,
  RadioIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/icons";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "Four kinds of instance — an independent creator, a community, a newsroom, a course archive — with the features each one leans on and the server each one needs.",
};

type UseCase = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  scenario: [string, string];
  matters: { feature: string; why: string }[];
  sizing: string;
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
    sizing: "Small, private: 4 vCPU, 8 GB, 160 GB — around $63 a month.",
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
    sizing: "Public launch: 8 vCPU, 16 GB, 160 GB — around $168 a month.",
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
        why: "axe serious and critical failures fail the frontend build, so the obligation is checkable.",
      },
    ],
    sizing:
      "Small, private to start, moving to public launch as the catalogue and concurrent viewers grow.",
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
            Four instances, and what each one needs.
          </Head>
          <Standfirst ground="ink" className="mt-5">
            The same software, sized and configured four different ways.
          </Standfirst>
        </div>
      </section>

      {/* 2 — The four, as cards. Paper. */}
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
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
