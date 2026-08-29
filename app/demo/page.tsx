import type { Metadata } from "next";
import { Button, TextLink } from "@/components/Button";
import { ScreenFigure } from "@/components/ScreenFigure";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "See it running",
  description:
    "Captures of Vidra v0.5.0 running locally: the player, the upload sheet, the admin console and the jobs view, all showing a clip the instance transcoded itself. No public demo instance yet — this page is the evidence in the meantime.",
};

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

export default function DemoPage() {
  return (
    <>
      {/* 1 — Hero. Ink. */}
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-16 md:py-24">
          <Eyebrow ground="ink">Demo</Eyebrow>
          <Head as="h1" className="mt-3">
            Vidra v0.5.0, running.
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
              The quality menu shows the result: Auto plus 1080p, 720p, 480p
              and 360p — the ladder the instance produced from a single 1080p
              upload, selectable mid-playback.
            </p>
          </div>
        </div>
        {/* No narrow source here, deliberately: the paragraph above claims
            the quality menu, so the figure must show it at every width — and
            band 6 already gives the phone capture its own moment. */}
        <ScreenFigure
          className="mt-8"
          eager
          src="/product/watch-quality-2464.jpg"
          width={2464}
          height={1540}
          alt="The Vidra watch page mid-playback with the quality menu open, listing Auto, 1080p, 720p, 480p and 360p, with Auto currently playing 1080p."
          provenance={PROVENANCE_FULL}
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
            The operator&apos;s view of the pipeline: every queue&apos;s health
            on one screen, and the transcode job that built the ladder above,
            finished with nothing failed.
          </p>
        </div>
        <ScreenFigure
          className="mt-8"
          src="/product/jobs-2464.jpg"
          width={2464}
          height={1540}
          narrow={{ src: "/product/jobs-780.jpg", width: 780, height: 1688 }}
          alt="The admin console's jobs view: queue cards each reporting ok, and a transcode jobs card showing its job done with none failed."
          provenance={PROVENANCE_SHORT}
        />
      </Section>

      {/* 5 — Configure. Ink. */}
      <Section ground="ink" media>
        <div className="max-w-[1080px]">
          <Eyebrow ground="ink">Configure</Eyebrow>
          <Head className="mt-3">The admin console.</Head>
          <p className="text-body mt-5 max-w-[66ch] text-onink-2">
            Instance configuration: this instance&apos;s name and description
            were changed here at runtime, no restart of the API.
          </p>
        </div>
        <ScreenFigure
          className="mt-8"
          ground="ink"
          src="/product/config-2464.jpg"
          width={2464}
          height={1540}
          narrow={{ src: "/product/config-780.jpg", width: 780, height: 1688 }}
          alt="The admin console's instance configuration page: general settings with the instance name and short description overridden from their defaults, sections for VOD, live, federation and customization, and a save changes button."
          provenance={PROVENANCE_SHORT}
        />
      </Section>

      {/* 6 — In your pocket. Paper. This figure IS the narrow capture at
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

      {/* 7 — What this page is not. Ink. The honesty that round 1 shipped
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
