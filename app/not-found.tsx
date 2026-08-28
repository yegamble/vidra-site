import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Eyebrow, Head, Section } from "@/components/Section";
import { DOCS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist. The docs and the homepage do.",
};

export default function NotFound() {
  return (
    <Section ground="paper">
      <div className="py-8 md:py-16">
        <Eyebrow>404</Eyebrow>
        <Head as="h1" className="mt-3">
          This page does not exist.
        </Head>
        <p className="text-standfirst mt-6 max-w-[54ch] text-onpaper-2">
          The docs and the homepage do.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/" variant="action">
            Go to the homepage
          </Button>
          <Button href={DOCS.root} external variant="ink-outline">
            Read the docs
          </Button>
        </div>
      </div>
    </Section>
  );
}
