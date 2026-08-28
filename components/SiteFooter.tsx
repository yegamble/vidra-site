import Link from "next/link";
import Lockup from "@/components/Lockup";
import { DOCS, GITHUB, LICENCE } from "@/lib/site";

type Item = { label: string; href: string; external: boolean };

const columns: { heading: string; items: Item[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "Features", href: "/features", external: false },
      { label: "Use cases", href: "/use-cases", external: false },
      { label: "Get started", href: "/get-started", external: false },
      { label: "Demo", href: "/demo", external: false },
    ],
  },
  {
    heading: "Project",
    items: [
      { label: "Docs", href: DOCS.root, external: true },
      { label: "GitHub", href: GITHUB.meta, external: true },
      { label: `Licence — ${LICENCE}`, href: GITHUB.licence, external: true },
      { label: "Brand", href: GITHUB.branding, external: true },
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
    heading: "Migrate",
    items: [
      { label: "Migrating from PeerTube", href: DOCS.migration, external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-onink">
      <div className="measure-media py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_repeat(4,minmax(0,1fr))]">
          <div>
            <Lockup wordmark="#F5F5F7" height={28} />
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
