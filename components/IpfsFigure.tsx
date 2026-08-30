"use client";

import { useRef, useState } from "react";

/**
 * The IPFS topology, stepped through four states — a sibling of
 * FederationFigure, in its exact idiom: a true SVG whose every claim is
 * repeated in the tablist panel beside it, so a reader who never sees the
 * drawing loses nothing.
 *
 * What the drawing may NOT depict, per the technical assessment's
 * visual-truth verdict (binding): no world map, no geographic dots; no solid
 * third-party node anywhere; gateways never drawn as boxes — a box reads as
 * storage, and a gateway keeps nothing; no arrow leaving the private fence;
 * nothing implying either tier defaults on; no speed or permanence claims.
 * The one potential third party is a hollow, dashed circle whose label says
 * "may pin" — a possibility, never a promise, and never dash-alone.
 *
 * The travelling dash on the gateway conduit runs only while step three is
 * active: bytes pass through, they do not stay. Second instance of the
 * documented ambient-motion exception (see the design spec); the global
 * prefers-reduced-motion reset stops it dead.
 *
 * Raw hexes are palette values inside a drawing — the FederationFigure
 * vocabulary exactly, no additions. Same sanctioned exception.
 */

const STEPS = [
  {
    id: "copies",
    tab: "Two copies",
    label: "Step one of five",
    title: "Two copies, both yours",
    body: "The authoritative copy of every video stays in your storage — local disk or S3. The mirror is a second copy, pinned on your own IPFS node. Only public, published media is even eligible — the fence is default-deny — and the whole tier is off until you turn it on.",
  },
  {
    id: "replicas",
    tab: "Your replicas",
    label: "Step two of five",
    title: "Your replicas",
    body: "The only automatic replication in the system is across machines you run and pay for — a cluster that pins what your node pins.",
  },
  {
    id: "gateways",
    tab: "Gateways and peers",
    label: "Step three of five",
    title: "Gateways pass it through",
    body: "A gateway fetches on demand and verifies by hash — it serves your bytes, it does not keep them. Anyone holding the address may choose to pin a copy: a possibility, never a promise. Joining the public network is a second explicit opt-in.",
  },
  {
    id: "pinned",
    tab: "Pinned copies",
    label: "Step four of five",
    title: "Pinned copies, independently held",
    body: "Anyone holding a public video's address may pin it on a full node they run. Each pinned copy is another independent source — bytes can come from it instead of your server, and if your origin disappears, every copy that anyone pinned keeps the same address. A choice other people make, never a service the network performs.",
  },
  {
    id: "private",
    tab: "The private tier",
    label: "Step five of five",
    title: "Replication, not distribution",
    body: "Private media may mirror only to a separate, swarm-keyed node — no gateway, and its addresses never appear in any API response. Its job is durability across machines you run; nothing crosses out of the fence.",
  },
] as const;

const LIVE = "#0B7EA3";
const DIM = "#5C7285";

function Figure({ step }: { step: (typeof STEPS)[number] }) {
  const on = (id: string) => step.id === id;
  const tone = (active: boolean) => (active ? LIVE : DIM);
  const fill = (active: boolean) => (active ? "#EEF7FB" : "#F5F5F7");

  return (
    <svg
      viewBox="0 0 560 280"
      className="block h-auto w-full"
      role="img"
      aria-label={`IPFS topology — ${step.title}`}
    >
      {/* Your instance: the Ink block holding both copies. */}
      <rect x={20} y={70} width={200} height={120} rx={12} fill="#0C2136" />
      <rect x={34} y={86} width={82} height={60} rx={8} fill={fill(on("copies"))} stroke={tone(on("copies"))} strokeWidth={on("copies") ? 1.8 : 1.3} />
      <text x={75} y={112} textAnchor="middle" fontSize="12" fontWeight="700" fill={on("copies") ? "#0C2136" : "#5C7285"} fontFamily="system-ui, sans-serif">
        object store
      </text>
      <text x={75} y={128} textAnchor="middle" fontSize="10" fill="#5C7285" fontFamily="ui-monospace, Menlo, monospace">
        canonical
      </text>
      <rect x={124} y={86} width={82} height={60} rx={8} fill={fill(on("copies"))} stroke={tone(on("copies"))} strokeWidth={on("copies") ? 1.8 : 1.3} />
      <text x={165} y={112} textAnchor="middle" fontSize="12" fontWeight="700" fill={on("copies") ? "#0C2136" : "#5C7285"} fontFamily="system-ui, sans-serif">
        IPFS node
      </text>
      <text x={165} y={128} textAnchor="middle" fontSize="10" fill="#5C7285" fontFamily="ui-monospace, Menlo, monospace">
        pinned
      </text>
      <text x={120} y={174} textAnchor="middle" fontSize="12" fill="#8FB4C9" fontFamily="system-ui, sans-serif">
        your instance
      </text>

      {/* Your cluster: the only automatic replication in the system. */}
      <line x1={220} y1={100} x2={272} y2={72} stroke={tone(on("replicas"))} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={288} cy={64} r={15} fill={fill(on("replicas"))} stroke={tone(on("replicas"))} strokeWidth={on("replicas") ? 1.8 : 1.3} />
      <circle cx={326} cy={44} r={15} fill={fill(on("replicas"))} stroke={tone(on("replicas"))} strokeWidth={on("replicas") ? 1.8 : 1.3} />
      <circle cx={330} cy={84} r={15} fill={fill(on("replicas"))} stroke={tone(on("replicas"))} strokeWidth={on("replicas") ? 1.8 : 1.3} />
      <text x={310} y={118} textAnchor="middle" fontSize="12" fontWeight="700" fill={on("replicas") ? "#0C2136" : "#5C7285"} fontFamily="system-ui, sans-serif">
        your cluster
      </text>

      {/* The gateway: an open conduit — rails and a wire passing through,
          never a box. The dash travels only while this step is live. */}
      <line x1={400} y1={120} x2={548} y2={120} stroke={tone(on("gateways"))} strokeWidth={on("gateways") ? 1.8 : 1.3} strokeLinecap="round" />
      <line x1={400} y1={156} x2={548} y2={156} stroke={tone(on("gateways"))} strokeWidth={on("gateways") ? 1.8 : 1.3} strokeLinecap="round" />
      <path
        d="M220,138 H400 M400,138 H548"
        fill="none"
        stroke={on("gateways") ? LIVE : DIM}
        strokeWidth={on("gateways") ? 2.2 : 1.3}
        strokeLinecap="round"
        strokeDasharray={on("gateways") ? "6 6" : undefined}
        className={on("gateways") ? "animate-flow" : undefined}
      />
      <text x={474} y={178} textAnchor="middle" fontSize="12" fontWeight="700" fill={on("gateways") ? "#0C2136" : "#5C7285"} fontFamily="system-ui, sans-serif">
        gateway
      </text>

      {/* The third parties: three hollow rings, exactly — more would read as
          a worldwide mirror field, the forbidden picture. Two-axis vocabulary:
          filled = yours, ring = not yours; dashed = possibility, solid =
          chosen-and-running. In the pinned step the rings resolve to solid
          LIVE with one static wire each exiting the canvas — "exists as a
          source", so no travelling dash: the motion exception stays at two
          instances. Never a filled third-party node, never a viewer node,
          never an arrow from the conduit into the rings. */}
      {/* The possibility tail ties the rings to the gateway rail only while
          pinning is still a maybe. In the pinned state it is cut entirely:
          the exit wires carry the connectivity story, and a stub toward your
          own gateway would contradict the step's claim — bytes come from the
          pinned copies instead of your server. */}
      {!on("pinned") ? (
        <line
          x1={466}
          y1={102}
          x2={478}
          y2={119}
          stroke={DIM}
          strokeWidth={1.3}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      ) : null}
      {[
        { cx: 466, cy: 88 },
        { cx: 500, cy: 62 },
        { cx: 532, cy: 38 },
      ].map((ring) => (
        <g key={`${ring.cx}-${ring.cy}`}>
          <circle
            cx={ring.cx}
            cy={ring.cy}
            r={14}
            fill="none"
            stroke={on("pinned") ? LIVE : DIM}
            strokeWidth={on("pinned") ? 1.8 : 1.3}
            strokeDasharray={on("pinned") ? undefined : "4 4"}
          />
          {on("pinned") ? (
            <line
              x1={ring.cx + 14}
              y1={ring.cy}
              x2={556}
              y2={ring.cy}
              stroke={LIVE}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          ) : null}
        </g>
      ))}
      <text x={462} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill={on("pinned") ? "#0C2136" : "#5C7285"} fontFamily="system-ui, sans-serif">
        {on("pinned") ? "pinned copies — each one chosen" : "peers that may pin"}
      </text>

      {/* The private tier: a sealed solid fence; arrows only inside. */}
      <rect x={250} y={196} width={290} height={72} rx={12} fill="none" stroke={tone(on("private"))} strokeWidth={on("private") ? 1.8 : 1.3} />
      <circle cx={294} cy={232} r={14} fill={fill(on("private"))} stroke={tone(on("private"))} strokeWidth={on("private") ? 1.8 : 1.3} />
      <circle cx={352} cy={232} r={14} fill={fill(on("private"))} stroke={tone(on("private"))} strokeWidth={on("private") ? 1.8 : 1.3} />
      <line x1={310} y1={232} x2={336} y2={232} stroke={tone(on("private"))} strokeWidth={1.3} strokeLinecap="round" />
      <text x={452} y={237} textAnchor="middle" fontSize="12" fontWeight="700" fill={on("private") ? "#0C2136" : "#5C7285"} fontFamily="system-ui, sans-serif">
        private tier — sealed
      </text>
    </svg>
  );
}

export function IpfsFigure() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = STEPS[active];

  const move = (next: number) => {
    const i = (next + STEPS.length) % STEPS.length;
    setActive(i);
    refs.current[i]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(active - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(STEPS.length - 1);
        break;
    }
  };

  return (
    <div className="rounded-card border border-paper-hairline bg-white">
      <div
        role="tablist"
        aria-label="IPFS topology steps"
        className="flex flex-wrap gap-2 px-5 pt-5"
      >
        {STEPS.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`ipfs-tab-${s.id}`}
              aria-selected={selected}
              aria-controls="ipfs-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-small font-semibold ring-1 ring-inset ring-paper-hairline transition-colors ${
                selected
                  ? "bg-action text-white"
                  : "bg-transparent text-onpaper hover:bg-ink/5"
              }`}
            >
              {s.tab}
            </button>
          );
        })}
      </div>
      <div className="px-5 pt-4 pb-1">
        <Figure step={step} />
      </div>
      <div
        id="ipfs-panel"
        role="tabpanel"
        aria-live="polite"
        aria-labelledby={`ipfs-tab-${step.id}`}
        className="px-5 pt-1 pb-5"
      >
        <p className="text-micro uppercase text-label">{step.label}</p>
        <h3 className="text-card mt-2">{step.title}</h3>
        {/* 9.2em reserves the tallest of the five bodies (the pinned step's,
            six lines at the 60ch measure), so nothing below jumps as you
            switch steps. The reserve holds at the desktop measure; at phone
            width the longest body exceeds it and the panel grows — accepted,
            as every reserved-height panel on the site does at 390. A
            reserved line count, not a pixel. */}
        <p className="text-body mt-2 min-h-[9.2em] max-w-[60ch] text-onpaper-2">
          {step.body}
        </p>
      </div>
    </div>
  );
}
