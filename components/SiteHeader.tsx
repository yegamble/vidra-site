import Link from "next/link";
import Lockup from "@/components/Lockup";
import { MobileNav } from "@/components/MobileNav";
import { INSTALL_ANCHOR, NAV } from "@/lib/site";

/**
 * Glass Ink chrome, on the navigation layer only. `.glass-chrome` carries a
 * solid Ink fallback for anything without `backdrop-filter` and forces the
 * solid ground back under prefers-reduced-transparency and prefers-contrast —
 * the translucent ground never ships without the blur that makes text on it
 * legible. See `.ralph/specs/design-system.md`, "Overturned rules".
 *
 * The brand mark is the drawn lockup, not an icon beside live text: logo
 * placements use the drawn logotype, which is a brand rule and outranks any
 * stand-in.
 */
export function SiteHeader() {
  return (
    <header className="glass-chrome on-ink sticky top-0 z-50 border-b border-slate/60">
      <div className="measure-media relative flex h-16 items-center justify-between gap-6">
        {/* h-11 is the 44px hit-target floor, not decoration: the lockup itself
            is 32–40px tall, which is a comfortable read and an uncomfortable tap. */}
        <Link
          href="/"
          aria-label="Vidra, home"
          className="flex h-11 items-center"
        >
          {/* Reversed logotype on Ink. The mark's own nine fills are untouched. */}
          {/* rem-sized so it follows the reader's font-size setting; larger on phones */}
          <Lockup wordmark="#F5F5F7" className="h-10 w-auto md:h-8" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="text-small text-onink-2 transition-colors hover:text-onink"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="text-small text-onink-2 transition-colors hover:text-onink"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={INSTALL_ANCHOR}
            className="hidden min-h-11 items-center rounded-button bg-vidra px-4 text-small font-semibold text-ink transition-colors hover:bg-deep md:inline-flex"
          >
            Get started
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
