import type { Metadata } from "next";
import { OG_CARD } from "@/lib/metadata";
import { MobileInstallBar } from "@/components/MobileInstallBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

/**
 * The brand paragraph, opened with the phrase people actually search for.
 * "Self-hosted alternative to YouTube" is the query; everything after it is the
 * brand paragraph doing its usual job.
 */
const DESCRIPTION =
  "Vidra is a self-hosted, federated alternative to YouTube, written in Go. You " +
  "install it yourself, the way you would install WordPress: your domain, your " +
  "storage, your rules, no ads. It federates over ActivityPub, speaks ATProto " +
  "for Bluesky sign-in and cross-posting, mirrors public media to IPFS if you " +
  "want it to, and it is free software under AGPL v3.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vidra.yosef.app"),
  title: {
    default: "Vidra — self-hosted, federated video platform",
    template: "%s — Vidra",
  },
  description: DESCRIPTION,
  applicationName: "Vidra",
  openGraph: {
    type: "website",
    siteName: "Vidra",
    title: "Vidra — self-hosted, federated video platform",
    description: DESCRIPTION,
    url: "/",
    // A PNG, deliberately: X, Slack and older LinkedIn drop SVG cards.
    // The card and its regeneration live in lib/metadata.ts and
    // scripts/og-card.mjs. Every other route builds its own object through the
    // same helper, because Next replaces this whole object rather than
    // merging into it.
    images: [OG_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidra — self-hosted, federated video platform",
    description: DESCRIPTION,
    images: [OG_CARD.url],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-paper">
        <a
          href="#main"
          className="sr-only rounded-button focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-action focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileInstallBar />
      </body>
    </html>
  );
}
