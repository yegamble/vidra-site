"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import {
  CpuIcon,
  DatabaseIcon,
  GlobeIcon,
  HardDriveIcon,
  MonitorIcon,
  SearchIcon,
  Share2Icon,
  ZapIcon,
} from "@/components/icons";
import { COUNTS } from "@/lib/site";

/**
 * The eight containers in the shipped compose file, as buttons rather than as
 * a drawing.
 *
 * This replaces both variants of the old SVG topology. The drawing was true
 * but it was a drawing: at 390px it needed a portrait redraw of the same data
 * to stay legible, which meant two copies of the topology to keep in step. A
 * two-column grid of real buttons reflows instead of being redrawn, every
 * label is live text at the reader's own font size, and the detail that used
 * to be nowhere — what each container is *for* — now has somewhere to go.
 *
 * The selected node is announced through `aria-pressed` on the button and a
 * polite live region on the panel, so the state is never carried by colour
 * alone.
 */

type Node = {
  id: string;
  name: string;
  sub: string;
  role: string;
  body: string;
  facts: string[];
  icon: ComponentType<{ className?: string }>;
};

const NODES: Node[] = [
  {
    id: "caddy",
    icon: GlobeIcon,
    name: "Caddy",
    sub: "Edge",
    role: "Edge",
    body: "Everything a viewer touches arrives here. Caddy terminates TLS and routes to the frontend and the API.",
    facts: ["TLS", "reverse proxy"],
  },
  {
    id: "user",
    icon: MonitorIcon,
    name: "vidra-user",
    sub: "Frontend",
    role: "Frontend",
    body: "The Next.js 16 application: channels, the video page and the bespoke player with keyboard shortcuts, picture-in-picture and theatre mode.",
    facts: ["Next.js 16"],
  },
  {
    id: "core",
    icon: CpuIcon,
    name: "vidra-core",
    sub: "API",
    role: "API",
    // The queue count is deliberately unpinned. An earlier draft said "13
    // durable queues"; that number is not checkable against the tree, and a
    // count on this site cites code or stays unpinned.
    body: `The Go backend. ${COUNTS.openapiPaths} OpenAPI paths, durable queues, the transcode pipeline, federation and the admin console behind it.`,
    facts: ["Go 1.26", "Echo", "/healthz"],
  },
  {
    id: "search",
    icon: SearchIcon,
    name: "vidra-search",
    sub: "Internal service",
    role: "Internal service",
    body: "Hybrid full-text and trigram search with typo-tolerant autosuggest. Internal only — it is never exposed at the edge.",
    facts: ["internal", "LightGBM shadow"],
  },
  {
    id: "postgres",
    icon: DatabaseIcon,
    name: "postgres",
    sub: "Shared state",
    role: "Shared state",
    body: `PostgreSQL 18 behind ${COUNTS.migrations} versioned SQL migrations. Both vidra-core and vidra-search read from it.`,
    facts: ["PostgreSQL 18", `${COUNTS.migrations} migrations`],
  },
  {
    id: "redis",
    icon: ZapIcon,
    name: "redis",
    sub: "Shared state",
    role: "Shared state",
    body: "Redis 8 carries queues and cache. Below Compose 2.24 it silently publishes on 0.0.0.0 — check your version.",
    facts: ["Redis 8", "queues + cache"],
  },
  {
    id: "minio",
    icon: HardDriveIcon,
    name: "minio",
    sub: "S3 storage",
    role: "Object storage",
    body: "S3-compatible storage for media. Local disk or an external S3 bucket instead, chosen per instance.",
    facts: ["S3 API", "local or remote"],
  },
  {
    id: "ipfs",
    icon: Share2Icon,
    name: "IPFS",
    sub: "Offload tier",
    role: "Offload tier",
    body: "Public media serves by content address through the gateway you configure, and any copy someone else pins is another source your server does not carry. A private tier stays keyed to your own swarm.",
    facts: ["gateway tier", "swarm-keyed tier"],
  },
];

export function ArchitectureExplorer() {
  const [selected, setSelected] = useState("core");
  const node = NODES.find((n) => n.id === selected) ?? NODES[0];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <p className="text-micro mb-3 uppercase text-onink-2">Your server</p>
        <div
          role="group"
          aria-label="Containers"
          data-testid="arch-nodes"
          className="grid grid-cols-2 gap-3"
        >
          {NODES.map((n) => {
            const on = n.id === selected;
            return (
              <button
                key={n.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(n.id)}
                className={`flex min-h-16 items-start gap-3 rounded-xl px-4 py-3 text-left ring-inset transition-colors ${
                  on
                    ? "bg-vidra-tint ring-2 ring-vidra"
                    : "bg-ink-surface ring-1 ring-ink-hairline hover:bg-slate/40"
                }`}
              >
                <n.icon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    on ? "text-vidra" : "text-onink-2"
                  }`}
                />
                <span className="min-w-0">
                  <span className="text-small block font-bold text-onink">
                    {n.name}
                  </span>
                  <span
                    className={`text-small mt-1 block ${
                      on ? "text-vidra" : "text-onink-2"
                    }`}
                  >
                    {n.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-live="polite"
        data-testid="arch-detail"
        className="rounded-card bg-ink-surface p-5 ring-1 ring-inset ring-ink-hairline"
      >
        <p className="text-micro uppercase text-vidra">{node.role}</p>
        <div className="mt-2 flex items-center gap-2.5">
          <node.icon className="h-5 w-5 shrink-0 text-vidra" />
          <h3 className="text-card text-onink">{node.name}</h3>
        </div>
        {/* 4.6em reserves the tallest body, so the fact chips below hold still
            as you move between nodes. A reserved line count, not a magic pixel. */}
        <p className="text-body mt-3 min-h-[4.6em] max-w-[60ch] text-onink-2">
          {node.body}
        </p>
        {/* A list of chips, not a definition list: there is nothing being
            defined here, and a <dl> with no dt/dd pairs is an axe violation
            rather than a shortcut. */}
        <ul className="mt-4 flex list-none flex-wrap gap-2">
          {node.facts.map((fact) => (
            <li
              key={fact}
              className="text-mono rounded-full bg-ink-chip px-3 py-2 text-ice ring-1 ring-inset ring-ink-hairline"
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
