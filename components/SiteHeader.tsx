import Link from "next/link";
import Lockup from "@/components/Lockup";
import { MobileNav } from "@/components/MobileNav";
import { NAV } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="on-ink sticky top-0 z-50 bg-ink">
      <div className="measure-media relative flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Vidra, home" className="flex items-center">
          {/* Reversed logotype on Ink. The mark's own nine fills are untouched. */}
          <Lockup wordmark="#F5F5F7" height={30} />
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
            href="/get-started"
            className="hidden rounded-button bg-vidra px-4 py-2 text-small font-semibold text-ink transition-colors hover:bg-deep md:inline-flex"
          >
            Get started
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
