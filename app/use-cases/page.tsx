import type { Metadata } from "next";
import { Button, TextLink } from "@/components/Button";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "Four kinds of instance — an independent creator, a community, a newsroom, a course archive — with the features each one leans on and the server each one needs.",
};

type UseCase = {
  id: string;
  eyebrow: string;
  title: string;
  scenario: string[];
  matters: { feature: string; why: string }[];
  sizing: string;
};

const CASES: UseCase[] = [
  {
    id: "creator",
    eyebrow: "One person, one channel",
    title: "An independent creator",
    scenario: [
      "You publish on a schedule and your back catalogue is the asset. What you do not want is for that catalogue to sit inside a recommendation system you cannot see, on terms that change without notice.",
      "So you run one 4 vCPU box, put a CDN in front of it, and embed the player on your own pages. Your channel is addressable over ActivityPub, so people can follow it from wherever they already read. When a video is public, the IPFS tier can carry the bytes and your egress stops tracking your audience.",
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
    eyebrow: "Many uploaders, one owner",
    title: "A community or club",
    scenario: [
      "A few dozen members upload and a few hundred watch. The technical part is not the hard part — the hard part is that you are the person who answers for what appears on the instance.",
      "Registration approval keeps signups behind a human. Reports give members a way to flag something and give you a queue to work through. Per-user quotas stop one enthusiastic uploader from filling the disk, and ClamAV scanning is a flag rather than a project, as long as you have budgeted the extra 2 GB of RAM.",
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
    eyebrow: "Several channels, live and archived",
    title: "A newsroom or podcast network",
    scenario: [
      "You run several channels under one instance, and some of what you publish is live. A council meeting, a launch, a recorded interview that is embargoed until Thursday — each has a different audience and a different moment.",
      "RTMP ingest takes the stream, privacy-gated HLS controls who can watch it while it is running, and the replay becomes a VOD without a second workflow. Embargoed material sits behind a scoped playback token rather than an unlisted URL, so forwarding the link does not publish it. Channel auto-sync mirroring keeps a feed you do not own in step with your own archive.",
    ],
    matters: [
      {
        feature: "RTMP live with replay to VOD",
        why: "The stream and the archive are one pipeline, not two.",
      },
      {
        feature: "Password-protected videos with scoped playback tokens",
        why: "An embargo that survives somebody pasting the link into a group chat.",
      },
      {
        feature: "Channel auto-sync mirroring",
        why: "Keep a mirrored channel current without a manual re-upload.",
      },
      {
        feature: "109 runtime instance settings",
        why: "Change instance behaviour during an event without a redeploy.",
      },
    ],
    sizing:
      "Public launch: 8 vCPU, 16 GB, 160 GB — around $168 a month. Live plus concurrent transcodes is the case that needs the larger box.",
  },
  {
    id: "archive",
    eyebrow: "Hundreds of talks, kept legible",
    title: "A course or conference archive",
    scenario: [
      "You have four years of talks and every one of them has to stay findable. Nobody browses an archive; they search it, half-remember the title, and give up if the first result is wrong.",
      "Hybrid full-text and trigram search with typo-tolerant autosuggest is the difference between finding a 2023 keynote and not. Whisper captions make the spoken content searchable as well as accessible, storyboards and chapters make a 90-minute recording navigable, and WCAG 2.2 AA is enforced by axe as a hard CI gate — which matters when accessibility is an obligation rather than an aspiration.",
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
        feature: "WCAG 2.2 AA in CI",
        why: "Enforced by axe as a hard gate, so the obligation is checkable.",
      },
    ],
    sizing:
      "Small, private to start, moving to public launch as the back catalogue and concurrent viewers grow.",
  },
];

function Case({ item, ground }: { item: UseCase; ground: "ink" | "paper" }) {
  const ink = ground === "ink";

  return (
    <div id={item.id} className="scroll-mt-20">
      <Eyebrow ground={ground}>{item.eyebrow}</Eyebrow>
      <Head className="mt-3">{item.title}</Head>
      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
        <div
          className={`text-body space-y-5 ${ink ? "text-onink" : "text-onpaper-2"}`}
        >
          {item.scenario.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <div>
          <h3
            className={`text-micro uppercase ${ink ? "text-onink-2" : "text-label"}`}
          >
            What matters here
          </h3>
          <dl className="mt-4 space-y-5">
            {item.matters.map((m) => (
              <div key={m.feature}>
                <dt
                  className={`text-body font-bold ${ink ? "text-onink" : "text-onpaper"}`}
                >
                  {m.feature}
                </dt>
                <dd
                  className={`text-small mt-1 ${ink ? "text-onink-2" : "text-onpaper-2"}`}
                >
                  {m.why}
                </dd>
              </div>
            ))}
          </dl>
          <p
            className={`text-small mt-6 rounded-card p-4 ${
              ink
                ? "bg-ink-surface text-onink"
                : "border border-paper-hairline bg-white text-onpaper"
            }`}
          >
            <span
              className={`text-micro block uppercase ${ink ? "text-onink-2" : "text-label"}`}
            >
              Sizing
            </span>
            <span className="mt-2 block">{item.sizing}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UseCasesPage() {
  return (
    <>
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-16 md:py-24">
          <Eyebrow ground="ink">Use cases</Eyebrow>
          <Head as="h1" className="mt-3">
            Four instances, and what each one needs.
          </Head>
          <Standfirst ground="ink" className="mt-6">
            The same software, sized and configured four different ways. No
            testimonials here — nobody has run it long enough to give one worth
            printing.
          </Standfirst>
        </div>
      </section>

      <Section ground="paper">
        <Case item={CASES[0]} ground="paper" />
      </Section>

      <Section ground="ink">
        <Case item={CASES[1]} ground="ink" />
      </Section>

      <Section ground="paper">
        <Case item={CASES[2]} ground="paper" />
      </Section>

      <Section ground="ink">
        <Case item={CASES[3]} ground="ink" />
      </Section>

      <Section ground="mist">
        <Head>Whichever one you are, it is the same install.</Head>
        <p className="text-body mt-4 max-w-[66ch] text-onpaper-2">
          The difference between these four is the size of the box and which
          settings you change afterwards. Start on the small profile; the{" "}
          <TextLink href="/#requirements">sizing table</TextLink> says when to
          move up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/get-started" variant="action">
            Get started
          </Button>
          <Button href={DOCS.root} external variant="ink-outline">
            Read the docs
          </Button>
        </div>
      </Section>
    </>
  );
}
