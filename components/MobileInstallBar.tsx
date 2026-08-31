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
 * And it yields, to two things. While a real command block is on screen — the
 * hero's, or the one that closes the homepage — the bar was a second, smaller
 * copy of the call to action sitting under the actual one, covering the bottom
 * of a 390-wide screen to advertise what the reader was already looking at.
 * And while the install band is on screen, the button is a no-op: its whole
 * job is to carry the reader to that band, so a reader already standing in it
 * gets nothing from pressing it.
 *
 * The band is the honest measure, and the command was not. A command block
 * that happens to be rendered is a proxy for "the reader has arrived", and the
 * proxy broke on the one Install tab with nothing to copy: "From PeerTube"
 * unmounts the command wrapper, and the bar came back over the very band it
 * points at. So the band is observed directly, whichever tab is selected. The
 * destination comes from INSTALL_ANCHOR rather than a second copy of the id,
 * so moving the anchor moves the yielding with it.
 *
 * Whether either is on screen is a fact about the viewport, so it is only
 * knowable on the client: the bar renders, and the observers take it away on
 * the first frame if the hero command is already in view. The state only ever
 * changes from an observer callback — a route with neither a command block nor
 * the band never touches it, which is why it needs no effect-body default.
 *
 * Two observers, because the two want different measures. Half of a command
 * block on screen is a command block on screen; half of the install band never
 * happens on a phone, where the band runs several viewports tall, so a
 * fraction of that element can never cross the same threshold.
 *
 * The anchors are re-read on every DOM change, not collected once. Collecting
 * once is what made this a dead control on the homepage: the Install band's
 * command lives inside a tab panel whose wrapper unmounts, and a list built in
 * an effect with `[]` deps can never observe a node mounted after it ran.
 */

/** The bar's own destination. It yields to the band it would scroll to. */
const INSTALL_BAND_ID = INSTALL_ANCHOR.split("#")[1] ?? "";

export function MobileInstallBar() {
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const observed = new Map<Element, IntersectionObserver>();

    const record: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setSuppressed(visible.size > 0);
    };

    // Half of it, so the bar does not flicker back as a block scrolls out.
    const commands = new IntersectionObserver(record, { threshold: 0.5 });

    // The band is taller than the phone it is read on, so half of it is a
    // threshold it can never cross. Any of it counts — once it has reached
    // the top four fifths of the screen, which is arrival rather than a
    // sliver appearing at the bottom edge.
    const bands = new IntersectionObserver(record, {
      threshold: 0,
      rootMargin: "0px 0px -20% 0px",
    });

    const sync = () => {
      const anchors = new Map<Element, IntersectionObserver>();

      for (const anchor of document.querySelectorAll("[data-command-anchor]")) {
        anchors.set(anchor, commands);
      }

      const band = INSTALL_BAND_ID
        ? document.getElementById(INSTALL_BAND_ID)
        : null;
      if (band) anchors.set(band, bands);

      for (const [anchor, observer] of anchors) {
        if (observed.has(anchor)) continue;
        observed.set(anchor, observer);
        observer.observe(anchor);
      }

      for (const [anchor, observer] of observed) {
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
      commands.disconnect();
      bands.disconnect();
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
