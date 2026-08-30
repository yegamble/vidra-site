import Link from "next/link";
import Lockup from "@/components/Lockup";
import { DOCS, GITHUB, INSTALL_ANCHOR, LICENCE } from "@/lib/site";

type Item = { label: string; href: string; external: boolean };

const columns: { heading: string; items: Item[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "Features", href: "/features", external: false },
      // /demo had no link from anywhere but one line on the homepage, so the
      // page carrying the only pictures of the running product was reachable
      // from one place. The footer is on every page; the nav stays at five.
      { label: "See it running", href: "/demo", external: false },
      { label: "Use cases", href: "/use-cases", external: false },
      { label: "Scale", href: "/scale", external: false },
      { label: "IPFS", href: "/ipfs", external: false },
      { label: "Get started", href: INSTALL_ANCHOR, external: false },
    ],
  },
  {
    heading: "Project",
    items: [
      { label: "Docs", href: DOCS.root, external: true },
      { label: "GitHub", href: GITHUB.meta, external: true },
      { label: `Licence — ${LICENCE}`, href: GITHUB.licence, external: true },
    ],
  },
  {
    heading: "Repos",
    items: [
      { label: "vidra-core", href: GITHUB.core, external: true },
      { label: "vidra-user", href: GITHUB.user, external: true },
      { label: "vidra-search", href: GITHUB.search, external: true },
    ],
  },
  {
    heading: "Compare",
    items: [
      { label: "Vidra vs PeerTube", href: "/compare/peertube", external: false },
      { label: "Migrating from PeerTube", href: DOCS.migration, external: true },
      {
        label: "How Vidra compares",
        href: "/features#comparison",
        external: false,
      },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-onink">
      <div className="measure-media py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_repeat(4,minmax(0,1fr))]">
          <div>
            {/* h-9: the mark's 24-grid frame renders at 27px, clear of the
                brand's 24px UI minimum — quieter than the h-11 header lockup
                on purpose; the footer is a signature, not a masthead. */}
            <Lockup wordmark="#F5F5F7" className="h-9 w-auto" />
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-micro uppercase text-onink-2">
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.items.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        className="text-small text-onink transition-colors hover:text-ice"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-small text-onink transition-colors hover:text-ice"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate/60 pt-6 text-small text-onink-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Vidra. {LICENCE}.</p>
          <p>Run your own video platform.</p>
        </div>
      </div>
    </footer>
  );
}
