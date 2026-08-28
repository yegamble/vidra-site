import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Buttons carry a 10px radius.
 * On Paper the fill is Action Cyan under pure white — the only cyan that clears
 * 4.5:1 under white, and only under white: Paper on Action Cyan is 4.26 and fails.
 * On Ink the fill is Vidra Cyan under Ink type, or an Ice outline.
 */
type Variant = "action" | "vidra" | "ice-outline" | "ink-outline";

const variants: Record<Variant, string> = {
  // Hover states stay inside the palette: Action Cyan darkens to Ink (white
  // stays legible at 16.32:1), Vidra Cyan drops to Deep Cyan (Ink at 5.73:1).
  action: "bg-action text-white hover:bg-ink",
  vidra: "bg-vidra text-ink hover:bg-deep",
  "ice-outline": "text-ice ring-1 ring-inset ring-ice/60 hover:bg-ice/10",
  "ink-outline":
    "text-onpaper ring-1 ring-inset ring-paper-hairline hover:bg-ink/5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-button px-5 py-3 " +
  "text-small font-semibold transition-colors";

export function Button({
  href,
  external = false,
  variant,
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  variant: Variant;
  className?: string;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/**
 * A quiet inline link. On Paper this is #0A6B8C (5.52:1), never Action Cyan,
 * which is a fill colour and does not clear AA as small text.
 */
export function TextLink({
  href,
  external = false,
  ground = "paper",
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  ground?: "ink" | "paper";
  className?: string;
  children: ReactNode;
}) {
  const cls = `underline decoration-1 underline-offset-4 ${
    ground === "ink"
      ? "text-ice hover:decoration-2"
      : "text-link hover:decoration-2"
  } ${className}`;

  if (external) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
