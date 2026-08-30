"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * The second sanctioned way a capture appears on this site (the design spec's
 * Imagery section records the admission): positioned marker buttons over a
 * REAL capture, each selecting an explanation in a live panel. Nothing is
 * fabricated — every pixel behind the markers is a photograph of the running
 * product, the markers assert only position, and every body is copy that
 * gets the count sweep like all copy. It is the ArchitectureExplorer
 * interaction idiom (select-one, detail panel, reserved height) laid over
 * ScreenFigure's frame contract (mandatory provenance, rounded card,
 * hairline ring, no shadow). ScreenFigure itself stays non-interactive.
 *
 * One DOM list of markers, repositioned by CSS — never two hand-synced
 * copies (the portrait-variant cost, named in Known failure classes):
 * - At sm (40em) and up the list stacks over the image cell; each button is
 *   an absolute 44px hit area drawing a centred 28px numbered dot at
 *   percentage coordinates over the WIDE capture.
 * - Below sm the same list renders as labelled chips in flow UNDER the
 *   frame. No marker ever floats over a phone-width image — the diagram
 *   failure class, refused structurally rather than by review.
 * The sm gate equals the picture source-switch, so the narrow capture never
 * has coordinates; x/y describe the wide source only.
 *
 * Semantics: aria-pressed toggles (the widget spec's route for toggles;
 * markers over a photo have no spatial axis that makes arrow-roving honest).
 * State is fill + aria-pressed + the panel lead repeating the name — three
 * channels, never colour alone. Motion: transition-colors only.
 *
 * Coordinates are content data, like ArchitectureExplorer's node table;
 * they are clamped so the hit area never clips the frame.
 */

export type Annotation = {
  id: string;
  /** Marker accessible name, chip label, and the panel's semibold lead. */
  label: string;
  /** Percentage coordinates over the WIDE capture only. Clamped 4–92.
      Anchor on whitespace ADJACENT to the referent, never dead-centre — a
      dot centred on small text hides the thing it cites. */
  x: number;
  y: number;
  /** Panel body. Copy: count sweep, claim classes. ≤220 characters. */
  body: ReactNode;
};

type ScreenSource = { src: string; width: number; height: number };

type AnnotatedScreenProps = ScreenSource & {
  narrow?: ScreenSource;
  /** Describes the whole frame; true of both sources. Markers never
      substitute for it. */
  alt: string;
  /** MANDATORY, same guard as ScreenFigure: empty renders nothing. */
  provenance: string;
  /** 3–4. Five is a listicle. First is selected from first paint, so the
      panel's reserved height is honest. */
  annotations: Annotation[];
  ground?: "ink" | "paper" | "mist";
  eager?: boolean;
  className?: string;
};

const clamp = (n: number) => Math.min(92, Math.max(4, n));

export function AnnotatedScreen({
  src,
  width,
  height,
  narrow,
  alt,
  provenance,
  annotations,
  ground = "paper",
  eager = false,
  className = "",
}: AnnotatedScreenProps) {
  const [activeId, setActiveId] = useState(annotations[0]?.id);
  if (!provenance.trim() || annotations.length === 0) return null;
  const active =
    annotations.find((a) => a.id === activeId) ?? annotations[0];

  const ring = ground === "ink" ? "ring-ink-hairline" : "ring-paper-hairline";
  const capBody = ground === "ink" ? "text-onink-2" : "text-label";
  const panelLead = ground === "ink" ? "text-onink" : "text-onpaper";
  const panelBody = ground === "ink" ? "text-onink-2" : "text-onpaper-2";
  const chipIdle =
    ground === "ink"
      ? "ring-ink-hairline text-onink"
      : "ring-paper-hairline text-onpaper";

  return (
    <figure className={className}>
      <div className="grid">
        <div
          className={`[grid-area:1/1] overflow-hidden rounded-card bg-ink ring-1 ring-inset ${ring}`}
        >
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
        <ul className="mt-4 flex flex-wrap gap-2 sm:relative sm:m-0 sm:block sm:[grid-area:1/1]">
          {annotations.map((a, i) => {
            const selected = a.id === active.id;
            return (
              <li
                key={a.id}
                className="sm:absolute sm:-translate-x-1/2 sm:-translate-y-1/2 sm:left-[var(--x)] sm:top-[var(--y)]"
                style={
                  {
                    "--x": `${clamp(a.x)}%`,
                    "--y": `${clamp(a.y)}%`,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveId(a.id)}
                  className={`flex min-h-11 items-center gap-2 rounded-full px-3 ring-1 ring-inset transition-colors sm:h-11 sm:w-11 sm:justify-center sm:bg-transparent sm:p-0 sm:ring-0 ${
                    selected ? "" : "hover:bg-ink/5"
                  } ${selected ? "ring-transparent" : chipIdle}`}
                >
                  {/* The dot: solid fills only — no translucency over
                      content. Unselected Ink + Ice ring + white numeral;
                      selected Vidra Cyan + Ink numeral (7.35:1). */}
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-small font-semibold ring-1 ring-inset ring-ice/60 ${
                      selected ? "bg-vidra text-ink" : "bg-ink text-white"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-small font-semibold sm:sr-only">
                    {a.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {/* The "bubble", transformed: one reserved-height live panel under the
          figure — floating callouts over the capture would cover the
          evidence, clip at edges, and fail at 390. */}
      <div
        aria-live="polite"
        className="mt-4 min-h-[10em] max-w-[66ch] sm:min-h-[5.5em]"
      >
        <p className={`text-body font-semibold ${panelLead}`}>{active.label}</p>
        <p className={`text-body mt-1 ${panelBody}`}>{active.body}</p>
      </div>
      <figcaption className={`text-small mt-3 max-w-[90ch] ${capBody}`}>
        {provenance}
      </figcaption>
    </figure>
  );
}
