import type { Metadata } from "next";
import { Button, TextLink } from "@/components/Button";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, INSTALL_ANCHOR, VERSION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "The public Vidra demo instance is not up yet. What it will be when it is: a real instance with published credentials, running the same release you would install.",
};

export default function DemoPage() {
  return (
    <>
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-16 md:py-24">
          <Eyebrow ground="ink">Demo</Eyebrow>
          <Head as="h1" className="mt-3">
            The public demo instance is not up yet.
          </Head>
          <Standfirst ground="ink" className="mt-6">
            Rather than a screenshot tour standing in for one, here is what is
            missing and what will replace it.
          </Standfirst>
        </div>
      </section>

      <Section ground="paper">
        <div className="max-w-[66ch]">
          <p className="text-body text-onpaper-2">
            When it is up, it will be a real Vidra instance on the same release
            you would install — {VERSION} today — with the sign-in credentials
            published on this page. Not a sandbox with the interesting parts
            switched off: uploads, live ingest, federation and the admin console,
            reset on a schedule.
          </p>
          <p className="text-body mt-5 text-onpaper-2">
            It will also serve the videos embedded on this site, which is the
            honest test — if the demo is down, the marketing site notices.
          </p>
          <p className="text-body mt-5 text-onpaper-2">
            Until then, the fastest way to see it running is to run it. One
            command on a 4 vCPU box, and the{" "}
            <TextLink href={DOCS.root} external>
              documentation
            </TextLink>{" "}
            covers what the installer touches before you point it at anything you
            care about.
          </p>
          <div className="mt-10">
            <Button href={INSTALL_ANCHOR} variant="action">
              Get started
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
