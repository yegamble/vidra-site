import { pageMetadata } from "@/lib/metadata";
import { AnnotatedScreen } from "@/components/AnnotatedScreen";
import { Button, TextLink } from "@/components/Button";
import { ScreenFigure } from "@/components/ScreenFigure";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR, MESSAGING } from "@/lib/site";


export const metadata = pageMetadata({
  title: "See it running",
  path: "/demo",
  description:
    "Captures of Vidra v0.5.0 running locally — the player, the upload sheet, the jobs view, the admin console, search results that survive a typo, and an opt-in end-to-end encrypted conversation — with pressable markers explaining each frame. No public demo instance yet; this page is the evidence in the meantime.",
});

/**
 * Every version string on this page is a frozen literal, like the provenance
 * sentences: they describe the captures, and must not drift when the site's
 * VERSION constant moves. When captures are refreshed, the strings update in
 * the same commit as the assets.
 */
const PROVENANCE_FULL =
  "Captured 2026-08-29 from Vidra v0.5.0 running locally via docker compose — all four repositories at the v0.5.0 release tags. The video shown was uploaded through the studio and transcoded by the instance itself.";
const PROVENANCE_SHORT =
  "Same instance: Vidra v0.5.0, running locally, 2026-08-29.";
const PROVENANCE_CONVERSATION =
  "Captured 2026-08-30 from a Vidra v0.5.0 instance running locally via docker compose — a live conversation between two accounts on this instance, encrypted and decrypted in their own browsers.";
const PROVENANCE_SEEDED_SEAM =
  "Captured 2026-08-30 from a Vidra v0.5.0 instance running locally — ten generated clips uploaded and transcoded to seed search. The header's count reads zero while real matches list below: core counts its own text match; the results are vidra-search's trigram answer. A v0.5.0 seam, shown as captured.";

export default function DemoPage() {
  return (
    <>
      {/* 1 — Hero. Ink. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-16 md:py-24">
          <Eyebrow ground="ink">Demo</Eyebrow>
          {/* Grammar, not deletion — the literal is frozen like the
              provenance sentences and stays exactly as it is. What changed is
              what the sentence is about. With the interpolated mentions gone
              from the hero, the install band and /features, this page's frozen
              literals make it the only place on the site carrying a version,
              and "Vidra v0.5.0, running." met that reader as a statement about
              the product with nothing else on the page to date it. It is now a
              statement about the capture, which is what it always was. */}
          <Head as="h1" className="mt-3">
            Captures of Vidra v0.5.0, running.
          </Head>
          <Standfirst ground="ink" className="mt-6">
            There is no public instance to click around yet. There is a running
            one: these are captures of v0.5.0 on a local machine.
          </Standfirst>
        </div>
      </section>

      {/* 2 — Watch. Paper. The transcode-ladder claim lives here. */}
      <Section ground="paper" media>
        <div className="max-w-[1080px]">
          <Eyebrow>Watch</Eyebrow>
          <Head className="mt-3">The watch page.</Head>
          <div className="mt-5 flex max-w-[66ch] flex-col gap-4">
            <p className="text-body text-onpaper-2">
              Every image on this page is a screenshot of the real frontend
              talking to the real backend, all four repositories checked out at
              the v0.5.0 release tags. The 47-second clip was uploaded through
              the studio, transcoded by the instance&apos;s own pipeline to a
              four-rendition H.264 HLS ladder, and is what the player is
              playing.
            </p>
            <p className="text-body text-onpaper-2">
              The numbered markers walk the frame — the quality menu, the
              controls, the page around the player. Press one and the panel
              under the capture answers.
            </p>
          </div>
        </div>
        {/* No narrow source here, deliberately: marker 1 claims the quality
            menu, so the figure must show it at every width — and band 6
            already gives the phone capture its own moment. Below sm the wide
            capture stays and the markers render as chips beneath it. */}
        <AnnotatedScreen
          className="mt-8"
          eager
          src="/product/watch-quality-2464.jpg"
          width={2464}
          height={1540}
          alt="The Vidra watch page mid-playback with the quality menu open, listing Auto, 1080p, 720p, 480p and 360p, with Auto currently playing 1080p."
          provenance={PROVENANCE_FULL}
          annotations={[
            {
              id: "quality",
              label: "Quality menu",
              x: 83,
              y: 68,
              body: "Auto plus 1080p, 720p, 480p and 360p — the ladder this instance built from a single 1080p upload. Auto is selected and playing 1080p; any rung is switchable mid-playback.",
            },
            {
              id: "controls",
              label: "Player controls",
              x: 38,
              y: 76,
              body: "The control bar mid-playback: timeline, volume, and the quality control that opened this menu. What's playing is the 47-second clip the instance transcoded itself.",
            },
            {
              id: "page",
              label: "Title and actions",
              x: 58,
              y: 87,
              body: "Under the player: title, views and follow — the watch page of a real channel on this instance, not a composite.",
            },
          ]}
        />
      </Section>

      {/* 3 — Publish. Ink. */}
      <Section ground="ink" media>
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">Publish</Eyebrow>
          <Head className="mt-3">The upload sheet.</Head>
          <p className="text-body mt-5 max-w-[66ch] text-onink-2">
            Upload starts on file pick and processing runs in the background
            while the metadata gets filled in — title, category, language,
            license and tags.
          </p>
        </div>
        <ScreenFigure
          className="mt-8"
          ground="ink"
          src="/product/upload-2464.jpg"
          width={2464}
          height={1540}
          narrow={{ src: "/product/upload-780.jpg", width: 780, height: 1688 }}
          alt="The studio upload sheet: vidra-demo.mp4 at 100 percent and processing, with title, description, category, language, license and tags fields filled in and an ActivityPub badge in the corner."
          provenance={PROVENANCE_SHORT}
        />
      </Section>

      {/* 4 — Operate. Paper. No queue counts in copy: the image may show
          them, but a durable-queue count in words is the documented drift
          class — the frame is evidence, not a licence to type the number. */}
      <Section ground="paper" media>
        <div className="max-w-[1080px]">
          <Eyebrow>Operate</Eyebrow>
          <Head className="mt-3">The jobs view.</Head>
          <p className="text-body mt-5 max-w-[66ch] text-onpaper-2">
            The operator&apos;s view of the pipeline. The markers pick out what
            an operator actually reads here: queue health, the job that built
            the ladder above, and the failure count you want empty.
          </p>
        </div>
        {/* The "13 durable queues" precedent is exactly this frame: the image
            may show a count; no body ever repeats it. */}
        <AnnotatedScreen
          className="mt-8"
          src="/product/jobs-2464.jpg"
          width={2464}
          height={1540}
          narrow={{ src: "/product/jobs-780.jpg", width: 780, height: 1688 }}
          alt="The admin console's jobs view: queue cards each reporting ok, and a transcode jobs card showing its job done with none failed."
          provenance={PROVENANCE_SHORT}
          annotations={[
            {
              id: "health",
              label: "Queue health",
              x: 50,
              y: 29,
              body: "One card per queue, each reporting ok — the pipeline's health readable on one screen of the admin console, not assembled from logs.",
            },
            {
              id: "transcode",
              label: "The transcode job",
              x: 72,
              y: 62,
              body: "The job that built the ladder on the watch page above: the same upload, transcoded to four renditions by this instance's own workers.",
            },
            {
              id: "failed",
              label: "None failed",
              x: 76,
              y: 68,
              body: "Done and failed sit side by side, and failed reads zero. When something does break, this card is where an operator sees it first.",
            },
          ]}
        />
      </Section>

      {/* 5 — Search. Ink. The typo is the proof: the capture's query is
          misspelled on purpose, and the frame's own zero-count seam is named
          in the provenance rather than cropped away. */}
      <Section ground="ink" media>
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">Search</Eyebrow>
          <Head className="mt-3">The search results.</Head>
          <p className="text-body mt-5 max-w-[66ch] text-onink-2">
            The query in this capture is misspelled on purpose. Search runs as
            its own service, vidra-search, querying full-text and trigram
            indexes together — so a half-remembered, half-mistyped title still
            resolves to the right upload among the videos this instance is
            hosting.
          </p>
        </div>
        <AnnotatedScreen
          className="mt-8"
          ground="ink"
          src="/product/search-typo-2464.jpg"
          width={2464}
          height={1540}
          alt="Search results for the misspelled query 'sordough starter': two Sourdough starter videos from the Bakehouse channel listed under a result count that reads zero."
          provenance={PROVENANCE_SEEDED_SEAM}
          annotations={[
            {
              id: "query",
              label: "The query",
              x: 45,
              y: 4,
              body: "The query is misspelled on purpose. It still resolves because trigram matching scores letter-groups rather than exact words — a half-remembered title is enough.",
            },
            {
              id: "indexes",
              label: "Two indexes",
              x: 66,
              y: 28,
              body: "Full-text and trigram indexes are queried together: full-text for the words you got right, trigrams for the ones you didn't, merged into one ranked answer.",
            },
            {
              id: "results",
              label: "Ranked results",
              x: 66,
              y: 45,
              body: "Real uploads on this instance, ranked. The service answering is vidra-search — its own Go service with its own CI, separate from the core API.",
            },
          ]}
        />
      </Section>

      {/* 6 — Configure. Paper (flipped from Ink when Search took the fifth
          slot; the alternation holds I·P·I·P·I·P·I·P·I). */}
      <Section ground="paper" media>
        <div className="max-w-[1080px]">
          <Eyebrow>Configure</Eyebrow>
          <Head className="mt-3">The admin console.</Head>
          <p className="text-body mt-5 max-w-[66ch] text-onpaper-2">
            Instance configuration: this instance&apos;s name and description
            were changed here at runtime, no restart of the API.
          </p>
        </div>
        <ScreenFigure
          className="mt-8"
          src="/product/config-2464.jpg"
          width={2464}
          height={1540}
          narrow={{ src: "/product/config-780.jpg", width: 780, height: 1688 }}
          alt="The admin console's instance configuration page: general settings with the instance name and short description overridden from their defaults, sections for VOD, live, federation and customization, and a save changes button."
          provenance={PROVENANCE_SHORT}
        />
      </Section>

      {/* 7 — Messages. Ink. Every body fenced by the messaging truth: the
          opt-in distinction gets its own marker, the band intro carries what
          markers can't hold (text-only, metadata visibility), and "messages"
          and "IPFS" never share a frame, a body, or a band. */}
      <Section ground="ink" media>
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">Messages</Eyebrow>
          <Head className="mt-3">The encrypted conversation.</Head>
          <p className="text-body mt-5 max-w-[66ch] text-onink-2">
            Direct messages ship in two lanes, and the one captured here is
            the opt-in end-to-end encrypted type: text only, encrypted in the
            browser with Olm — the Matrix protocol&apos;s ratchet — and stored
            as ciphertext the server cannot read, though the server still sees
            who is talking to whom and when. It has not been independently
            audited;{" "}
            <TextLink href="/features#g-connect" ground="ink">
              the full statement is on the features page →
            </TextLink>
          </p>
        </div>
        <AnnotatedScreen
          className="mt-8"
          ground="ink"
          src="/product/messaging-2464.jpg"
          width={2464}
          height={1540}
          alt="An end-to-end encrypted conversation: a lock-marked header, a banner reading 'Only you two can read this' with a view-safety-numbers link, messages tagged 'disappears', a disappearing-message timer set to one day, and a conversation list showing one encrypted and one standard thread."
          provenance={PROVENANCE_CONVERSATION}
          annotations={[
            {
              id: "optin",
              label: "Opt-in encryption",
              x: 67,
              y: 10,
              body: "The badge marks an end-to-end encrypted conversation — a type you chose when starting it. Keys live on your devices; the server stores ciphertext it cannot read.",
            },
            {
              id: "plaintext",
              label: "Plaintext by default",
              x: 27,
              y: 30,
              body: "Standard conversations are the default and stay readable to the server — that is what lets attachments be scanned. Encryption is a lane you opt into, not a claim about every message.",
            },
            {
              id: "safety",
              label: "Safety number",
              x: 57,
              y: 26,
              body: "A fingerprint of the devices in this conversation. Compare it out of band and you've verified no key was swapped in the middle. Verification is per-device, and you do it.",
            },
            {
              id: "timer",
              label: "Disappearing messages",
              x: 59,
              y: 74,
              body: `Encrypted conversations can auto-delete on a timer — ${MESSAGING.timerMin} to ${MESSAGING.timerMax}. Expired messages vanish from every read at once; a sweeper hard-deletes them from the server.`,
            },
          ]}
        />
      </Section>

      {/* 8 — In your pocket. Paper. This figure IS the narrow capture at
          every width — no art direction needed. */}
      <Section ground="paper">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <Eyebrow>In your pocket</Eyebrow>
            <Head className="mt-3">The same instance, at phone width.</Head>
            <p className="text-body mt-5 max-w-[66ch] text-onpaper-2">
              The watch page again at 390 pixels wide: the player with its
              controls, then the title, actions, tags and description — the
              frontend reflows rather than shrinks.
            </p>
          </div>
          <ScreenFigure
            className="mx-auto w-full max-w-sm"
            src="/product/watch-780.jpg"
            width={780}
            height={1688}
            alt="The Vidra watch page at phone width: the player with controls, then the title, view count, follow button, like and save actions, category, tags and description."
            provenance={PROVENANCE_SHORT}
          />
        </div>
      </Section>

      {/* 9 — What this page is not. Ink. The honesty that round 1 shipped
          stays: no public instance is implied, and the CTA is the truth. */}
      <Section ground="ink">
        <Head>What this page is not.</Head>
        <p className="text-body mt-5 max-w-[66ch] text-onink-2">
          A public demo instance still does not exist. When there is one to
          try, it will be here: a real instance on the current release,
          sign-in credentials published on this page, reset on a schedule —
          not a sandbox with the interesting parts switched off. Until then,
          the fastest way to click around a Vidra instance is to run one.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button href={INSTALL_ANCHOR} variant="vidra" size="large">
            Get started
          </Button>
          {/* The p wrapper keeps the standalone link inside the inline
              exemption the touch-target gate encodes — same idiom as every
              other band-level TextLink. */}
          <p>
            <TextLink href={DOCS.root} external ground="ink">
              Read the documentation →
            </TextLink>
          </p>
        </div>
      </Section>
    </>
  );
}
