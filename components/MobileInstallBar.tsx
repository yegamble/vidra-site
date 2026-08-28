import Link from "next/link";
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
 */
export function MobileInstallBar() {
  return (
    <div
      data-testid="mobile-install-bar"
      className="glass-chrome glass-chrome-bar sticky bottom-0 z-40 flex items-center gap-3 border-t border-slate/60 px-6 py-3 md:hidden"
    >
      <p className="text-small min-w-0 flex-1 text-onink-2">
        One command. 4 vCPU. About $63 a month.
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
