"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close on navigation, adjusted during render rather than in an effect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // The panel covers the viewport, so the page behind it should not scroll.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-button ring-1 ring-inset ring-ice/40"
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          aria-hidden="true"
          fill="none"
        >
          {open ? (
            <>
              <path d="M2 2L16 12" stroke="#E6F6FA" strokeWidth="2" />
              <path d="M16 2L2 12" stroke="#E6F6FA" strokeWidth="2" />
            </>
          ) : (
            <>
              <path d="M0 1h18" stroke="#E6F6FA" strokeWidth="2" />
              <path d="M0 7h18" stroke="#E6F6FA" strokeWidth="2" />
              <path d="M0 13h18" stroke="#E6F6FA" strokeWidth="2" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-slate/60 bg-ink"
        >
          <ul className="measure-text flex flex-col py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="block py-3 text-body text-onink"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-3 text-body text-onink"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/get-started"
                className="mt-2 mb-3 inline-flex rounded-button bg-vidra px-5 py-3 text-small font-semibold text-ink"
              >
                Get started
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
