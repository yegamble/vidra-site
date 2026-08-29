"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@/components/icons";
import { INSTALL_ANCHOR, NAV } from "@/lib/site";

/**
 * The phone menu is a full-screen Ink overlay under the header, not a dropdown:
 * five 56px rows separated by hairlines, with the call to action at the end.
 *
 * Solid Ink, deliberately — glass is a navigation-layer material and this is a
 * full-bleed content surface once it is open. Blurring the page behind a sheet
 * of text is exactly the case the reduced-transparency rule exists for.
 */
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

  const row =
    "flex min-h-14 items-center border-b border-slate/60 text-sub text-onink";

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-button text-onink ring-1 ring-inset ring-ice/40"
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="animate-panel-in fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-ink"
        >
          <nav aria-label="Mobile" className="measure-text flex flex-col py-3">
            {NAV.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href} className={row}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={row}>
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href={INSTALL_ANCHOR}
              className="mt-6 inline-flex min-h-13 items-center justify-center rounded-button bg-vidra px-5 text-body font-semibold text-ink"
            >
              Get started
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
