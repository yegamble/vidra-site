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
 *
 * The anchors are re-read on every DOM change, not collected once. Collecting
 * once is what made this a dead control on the homepage: the Install band's
 * command lives inside a tab panel, that wrapper unmounts on the "From
 * PeerTube" tab, which has no command to copy, and a list built in an effect
 * with `[]` deps can never observe a node mounted after it ran. The bar then
 * sat over the live command with its button pointing at the section the reader
 * was already standing in, which is the exact failure the yielding above was
 * written to avoid.
 */
export function MobileInstallBar() {
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const observed = new Set<Element>();

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

    const sync = () => {
      const anchors = new Set<Element>([
        ...document.querySelectorAll("[data-command-anchor]"),
      ]);

      for (const anchor of anchors) {
        if (observed.has(anchor)) continue;
        observed.add(anchor);
        observer.observe(anchor);
      }

      for (const anchor of observed) {
        if (anchors.has(anchor)) continue;
        observed.delete(anchor);
        observer.unobserve(anchor);
        // An unobserved node reports nothing ever again, so its last verdict
        // would otherwise outlive it and pin the bar off the screen for good.
        if (visible.delete(anchor)) setSuppressed(visible.size > 0);
      }
    };

    // Coalesced to a frame: the sliders and the tablist can mutate the tree
    // many times in a row, and each pass is a fresh querySelectorAll.
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    sync();
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
    };
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
