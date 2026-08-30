"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { INSTALL_ANCHOR } from "@/lib/site";

/**
 * The phone-only bottom bar. Below `md` the install call to action would
 * otherwise be a scroll away from wherever the reader stopped, so it stays put
 * — glass Ink on the navigation layer, with the same solid fallback the header
 * has (see `.glass-chrome` in `app/globals.css`).
 *
 * It is sticky rather than fixed: the page scrolls under it and the footer's
 * last line finishes above it rather than behind it. It traps nothing and
 * covers nothing.
 *
 * And it yields. While a real command block is on screen — the hero's, or the
 * one that closes the homepage — the bar was a second, smaller copy of the
 * call to action sitting under the actual one, covering the bottom of a
 * 390-wide screen to advertise what the reader was already looking at.
 *
 * Whether a command block is on screen is a fact about the viewport, so it is
 * only knowable on the client: the bar renders, and the observer takes it away
 * on the first frame if the hero command is already in view. The state only
 * ever changes from the observer's callback — a route with no command block
 * never touches it, which is why it needs no effect-body default.
 */
export function MobileInstallBar() {
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    const anchors = [...document.querySelectorAll("[data-command-anchor]")];
    if (anchors.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setSuppressed(visible.size > 0);
      },
      // Half of it, so the bar does not flicker back as a block scrolls out.
      { threshold: 0.5 },
    );
    for (const anchor of anchors) observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-testid="mobile-install-bar"
      className={`glass-chrome glass-chrome-bar sticky bottom-0 z-40 items-center gap-3 border-t border-slate/60 px-6 py-3 md:hidden ${
        suppressed ? "hidden" : "flex"
      }`}
    >
      <p className="text-small min-w-0 flex-1 text-onink-2">
        One command. 4 vCPU. $56 a month.
      </p>
      <Link
        href={INSTALL_ANCHOR}
        className="text-small inline-flex min-h-11 shrink-0 items-center justify-center rounded-button bg-vidra px-4 font-semibold text-ink transition-colors hover:bg-deep"
      >
        Install
      </Link>
    </div>
  );
}
