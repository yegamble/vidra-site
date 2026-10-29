import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MARKETING } from "@/lib/marketing";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vidra.yosef.app"),
  title: { default: MARKETING.title, template: "%s — Vidra" },
  description: MARKETING.description,
  applicationName: "Vidra",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: "Vidra", title: MARKETING.title,
    description: MARKETING.description, url: "/",
    images: [{ url: "/brand/og-card.png", width: 1200, height: 630,
      alt: "Vidra Beta — a new home for streaming is taking shape." }],
  },
  twitter: { card: "summary_large_image", title: MARKETING.title,
    description: MARKETING.description, images: ["/brand/og-card.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="launch-shell">
          <SiteHeader />
          <main id="main" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
