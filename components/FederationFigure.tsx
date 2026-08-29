"use client";

import { useState } from "react";

/**
 * Three federation layers, stepped through one at a time.
 *
 * The figure is a *supplementary* drawing: every word in it is repeated in the
 * text beside it (label, title, body, counter), so a reader who never sees the
 * SVG loses nothing. That is why it does not carry a portrait variant the way
 * the topology explorer's data does — there is no information in here that is
 * only in here. It is `role="img"` with a label that names the live layer.
 *
 * The active wires are dashed and the dashes travel. That is an infinite
 * animation and therefore a documented exception to the 300ms motion cap: the
 * direction of travel is the thing the figure is saying, and a 300ms one-shot
 * cannot say it. The global prefers-reduced-motion reset stops it dead.
 *
 * Raw hexes below are palette values inside a drawing — SVG fill/stroke cannot
 * read a Tailwind token. Same sanctioned exception as `Lockup.tsx`.
 */

const LAYERS = [
  {
    id: "ap",
    label: "Layer one of three",
    title: "ActivityPub",
    body: "Your channels and videos are addressable from the rest of the fediverse. A follow from Mastodon or another PeerTube instance travels over the protocol, not over an integration someone bolted on afterwards.",
  },
  {
    id: "at",
    label: "Layer two of three",
    title: "ATProto",
    body: "Viewers sign in with Bluesky, or with any ATProto PDS they already have. Cross-posting a public video to Bluesky is optional and stays off until you switch it on.",
  },
  {
    id: "ipfs",
    label: "Layer three of three",
    title: "IPFS, dual tier",
    body: "Public media offloads to gateways, so the bytes leave somebody else's network. A private tier keyed to your own swarm carries anything that should not.",
  },
] as const;

/* Palette values only (documented exception 4): #5C7285 is `label`, the same
   value the figure's own off-state text uses — off wires and off labels share
   one colour. */
const DIM = "#5C7285";
const LIVE = "#0B7EA3";

function Wire({ on, d }: { on: boolean; d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={on ? LIVE : DIM}
      strokeWidth={on ? 2.2 : 1.3}
      strokeLinecap="round"
      strokeDasharray={on ? "6 6" : undefined}
      className={on ? "animate-flow" : undefined}
    />
  );
}

function Label({
  x,
  y,
  on,
  children,
}: {
  x: number;
  y: number;
  on: boolean;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="15"
      fontWeight="700"
      fill={on ? "#0C2136" : "#5C7285"}
      fontFamily="system-ui, sans-serif"
    >
      {children}
    </text>
  );
}

function Figure({ layer }: { layer: (typeof LAYERS)[number] }) {
  const on = (id: string) => layer.id === id;

  return (
    <svg
      viewBox="0 0 560 250"
      className="block h-auto w-full"
      role="img"
      aria-label={`Your instance federating over ${layer.title}`}
    >
      <Wire on={on("ap")} d="M200,112 H172 Q160,112 160,100 V84 Q160,72 148,72 H113" />
      <Wire on={on("at")} d="M200,140 H172 Q160,140 160,152 V168 Q160,180 148,180 H113" />
      <Wire on={on("ipfs")} d="M360,112 H388 Q400,112 400,100 V84 Q400,72 412,72 H450" />
      <Wire on={on("ipfs")} d="M360,140 H388 Q400,140 400,152 V168 Q400,180 412,180 H450" />

      <rect x={200} y={95} width={160} height={62} rx={12} fill="#0C2136" />
      <text
        x={280}
        y={120}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#E6F6FA"
        fontFamily="system-ui, sans-serif"
      >
        your instance
      </text>
      <text
        x={280}
        y={140}
        textAnchor="middle"
        fontSize="13"
        fill="#8FB4C9"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        video.example.org
      </text>

      <circle
        cx={68}
        cy={72}
        r={44}
        fill={on("ap") ? "#EEF7FB" : "#F5F5F7"}
        stroke={on("ap") ? LIVE : DIM}
        strokeWidth={on("ap") ? 1.8 : 1.3}
      />
      <Label x={68} y={77} on={on("ap")}>
        fediverse
      </Label>
      <circle
        cx={68}
        cy={180}
        r={44}
        fill={on("at") ? "#EEF7FB" : "#F5F5F7"}
        stroke={on("at") ? LIVE : DIM}
        strokeWidth={on("at") ? 1.8 : 1.3}
      />
      <Label x={68} y={185} on={on("at")}>
        bluesky
      </Label>

      <rect
        x={450}
        y={50}
        width={100}
        height={44}
        rx={10}
        fill={on("ipfs") ? "#EEF7FB" : "#F5F5F7"}
        stroke={on("ipfs") ? LIVE : DIM}
        strokeWidth={on("ipfs") ? 1.8 : 1.3}
      />
      <Label x={500} y={78} on={on("ipfs")}>
        gateways
      </Label>
      <rect
        x={450}
        y={158}
        width={100}
        height={44}
        rx={10}
        fill={on("ipfs") ? "#EEF7FB" : "#F5F5F7"}
        stroke={on("ipfs") ? LIVE : DIM}
        strokeWidth={on("ipfs") ? 1.8 : 1.3}
      />
      <Label x={500} y={186} on={on("ipfs")}>
        your swarm
      </Label>

      <text
        x={280}
        y={234}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={LIVE}
        fontFamily="system-ui, sans-serif"
      >
        {`${layer.title} — live on this instance`}
      </text>
    </svg>
  );
}

export function FederationFigure() {
  const [step, setStep] = useState(0);
  const layer = LAYERS[step];

  return (
    <div className="rounded-card border border-paper-hairline bg-white">
      <div className="px-5 pt-5 pb-1">
        <Figure layer={layer} />
      </div>
      <div className="px-5 pt-1 pb-5" aria-live="polite">
        <p className="text-micro uppercase text-label">{layer.label}</p>
        <h3 className="text-card mt-2">{layer.title}</h3>
        {/* 5.2em reserves the tallest of the three bodies, so the buttons
            below do not jump as you step through. A reserved line count, like
            the ch measures elsewhere — not a magic pixel. */}
        <p className="text-body mt-2 min-h-[5.2em] max-w-[60ch] text-onpaper-2">
          {layer.body}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous layer"
            onClick={() => setStep((s) => (s + LAYERS.length - 1) % LAYERS.length)}
            className="text-small inline-flex min-h-11 min-w-11 items-center justify-center rounded-button px-4 font-semibold text-onpaper ring-1 ring-inset ring-paper-hairline transition-colors hover:bg-ink/5"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) % LAYERS.length)}
            className="text-small inline-flex min-h-11 items-center justify-center rounded-button bg-action px-4 font-semibold text-white transition-colors hover:bg-ink"
          >
            Next layer →
          </button>
          <span className="text-small ml-auto tabular-nums text-label">
            {step + 1} / {LAYERS.length}
          </span>
        </div>
      </div>
    </div>
  );
}
