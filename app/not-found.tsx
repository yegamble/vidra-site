import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found", robots: { index: false, follow: true },
};

export default function NotFound() {
  return <section className="not-found">
    <p className="eyebrow">404</p>
    <h1>This page isn’t here.</h1>
    <p>Vidra’s new home is taking shape.</p>
    <Link className="waitlist-link" href="/">Back to Vidra <span aria-hidden="true">→</span></Link>
  </section>;
}
