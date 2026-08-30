import type { ReactNode } from "react";

/**
 * The plain way a product capture appears on this site — one of exactly two
 * sanctioned treatments: this static figure, and AnnotatedScreen.tsx (marker
 * buttons over a capture, admitted in the design spec's Imagery section,
 * 2026-08-30). This component stays non-interactive by contract; anything
 * needing markers uses AnnotatedScreen, not props added here.
 *
 * Stills only, deliberately: no recording exists, and an untested video branch
 * would anyway have to argue its way past the motion spec. Imagery canon
 * verbatim: rounded card, hairline ring per ground, no shadow, Ink letterbox
 * behind the media while it loads.
 *
 * The provenance sentence is the anti-mockup contract made visible, enforced
 * twice: the prop is required, and an empty string renders nothing. It is a
 * frozen literal on every call site — never interpolate VERSION into it: the
 * site's version moves at the next release while the captures stay v0.5.0,
 * and an interpolated caption would silently start lying (the counts-drift
 * failure class, arriving through a new door). When captures are refreshed,
 * the strings update in the same commit as the assets.
 *
 * Indigo inside the frame is fine — the captures show the product, and indigo
 * is the product's accent; the firewall rule governs this site's components,
 * not the pixels of an honest photograph of the app.
 *
 * Not interactive: the figure is content. "See it larger" is a TextLink to
 * /demo, never a lightbox.
 */

type ScreenSource = {
  /** Path under /product/, e.g. "/product/watch-quality-2464.jpg". */
  src: string;
  /** Intrinsic pixel dimensions of the committed asset — these reserve the
      box before the bytes arrive (zero layout shift), scaling with the
      container rather than a hardcoded height. */
  width: number;
  height: number;
};

type ScreenFigureProps = ScreenSource & {
  /** What the screen shows, factually. May cite what is visibly in frame —
      the frame is the source. */
  alt: string;
  /** MANDATORY: the provenance sentence for the figcaption. A capture
      without provenance does not render. */
  provenance: string;
  /** Optional short claim line before the provenance. It is copy, so it
      gets the count sweep like any copy. */
  caption?: ReactNode;
  ground?: "ink" | "paper" | "mist";
  /** Art-directed phone capture of the SAME screen, swapped in below the sm
      breakpoint. Both sources are real captures; the caption must be true of
      both. */
  narrow?: ScreenSource;
  /** Opt into eager loading for a figure at the top of a page. */
  eager?: boolean;
  className?: string;
};

export function ScreenFigure({
  src,
  width,
  height,
  alt,
  provenance,
  caption,
  ground = "paper",
  narrow,
  eager = false,
  className = "",
}: ScreenFigureProps) {
  if (!provenance.trim()) return null;

  const ring = ground === "ink" ? "ring-ink-hairline" : "ring-paper-hairline";
  const capBody = ground === "ink" ? "text-onink-2" : "text-label";
  const capLead = ground === "ink" ? "text-onink" : "text-onpaper-2";

  return (
    <figure className={className}>
      <div
        className={`overflow-hidden rounded-card bg-ink ring-1 ring-inset ${ring}`}
      >
        {/* em in the media query tracks the reader's font size, matching the
            rem-based sm breakpoint: phones get the phone capture. */}
        <picture>
          {narrow ? (
            <source
              media="(max-width: 40em)"
              srcSet={narrow.src}
              width={narrow.width}
              height={narrow.height}
            />
          ) : null}
          <img
            src={src}
            width={width}
            height={height}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
      </div>
      <figcaption className={`text-small mt-3 max-w-[90ch] ${capBody}`}>
        {caption ? (
          <span className={`font-semibold ${capLead}`}>{caption} </span>
        ) : null}
        {provenance}
      </figcaption>
    </figure>
  );
}
