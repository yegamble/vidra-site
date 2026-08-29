"use client";

import { useRef, useState } from "react";
import { CommandBlock } from "@/components/CommandBlock";
import { TextLink } from "@/components/Button";
import { DOCS, GITHUB, INSTALL_COMMAND } from "@/lib/site";

/**
 * Four ways into an instance, one panel. Every tab ends in the same place, so
 * the differences are the content, not four separate pages of scaffolding.
 *
 * Keyboard support is the WAI-ARIA tablist pattern with a roving tabindex:
 * Tab reaches the tablist once and lands on the selected tab; Left/Right (and
 * Home/End) move between tabs and select as they go. That is the automatic-
 * activation variant, which is the right one when switching a tab is cheap —
 * nothing here loads.
 */

type Tab = {
  id: string;
  label: string;
  /** Empty when the route has no single command to run. */
  command: string;
  intro: string;
  steps: string[];
  link: { label: string; href: string; external: boolean };
};

const TABS: Tab[] = [
  {
    id: "oneline",
    label: "One-line",
    command: INSTALL_COMMAND,
    intro:
      "For a fresh server you control. Run it as a user who can use sudo. It never writes over an existing env file, never opens a port, and never touches sshd.",
    link: {
      label: "Installer reference",
      href: DOCS.oneLineInstall,
      external: true,
    },
    steps: [
      "Docker Engine and Compose v2 are installed if they are missing. Compose 2.20 is the floor; 2.24 is the production minimum.",
      "A checksum-verified release bundle is unpacked to /opt/vidra and the vidra CLI is installed.",
      "vidra setup runs a terminal interview — domain, storage, mail, federation. Pass --web for the browser wizard instead.",
      "Every signup path refuses on first boot. The boot log prints an owner-claim token; redeem it at /setup/claim and the instance is yours.",
    ],
  },
  {
    id: "compose",
    label: "Compose clone",
    command: `git clone ${GITHUB.meta}.git && cd vidra && make dev`,
    intro:
      "For evaluating it on a laptop or a scratch VM, and for working on it. This is the development path, not the production one.",
    link: {
      label: "github.com/yegamble/vidra",
      href: GITHUB.meta,
      external: true,
    },
    steps: [
      "The meta-repository pulls the three services: vidra-core, vidra-user and vidra-search.",
      "make dev brings them up together with PostgreSQL, Redis and object storage.",
      "Everything runs locally, so nothing here is hardened for a public address.",
    ],
  },
  {
    id: "prod",
    label: "Production",
    command: "deploy/compose.sh",
    intro:
      "For a host you already manage with your own conventions. You write the env file, you run the deploy script, and the CLI takes over from there.",
    link: { label: "Deployment guide", href: DOCS.production, external: true },
    steps: [
      "Check the Compose version first. Below 2.24, Compose silently publishes PostgreSQL and Redis on 0.0.0.0.",
      // 26 is the length of the `checks` slice in
      // vidra-core/internal/doctor/doctor.go. The meta-repo README still says
      // 18; the code is the source, not the README.
      "vidra doctor runs 26 checks against the running instance and names the failure.",
      "vidra deploy, rollback, backup and restore are scripted.",
    ],
  },
  {
    id: "peer",
    label: "From PeerTube",
    command: "",
    intro:
      "Vidra is not a PeerTube fork and is not PeerTube-API-compatible, so this is a migration rather than a drop-in swap. Moving an existing instance across is supported and has its own guide.",
    link: {
      label: "Migration overview",
      href: DOCS.migration,
      external: true,
    },
    steps: [
      "Stand up the Vidra instance first, on the sizing your catalogue needs.",
      "Channels, videos and captions move across; the API surface does not.",
      "Read the migration overview before you point it at anything you care about.",
    ],
  },
];

export function InstallTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (next: number) => {
    const i = (next + TABS.length) % TABS.length;
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
        move(TABS.length - 1);
        break;
    }
  };

  const tab = TABS[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Install method"
        data-testid="install-tablist"
        className="flex flex-wrap gap-2"
      >
        {TABS.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`install-tab-${t.id}`}
              aria-selected={selected}
              aria-controls="install-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-small font-semibold ring-1 ring-inset ring-paper-hairline transition-colors ${
                selected
                  ? "bg-action text-white"
                  : "bg-transparent text-onpaper hover:bg-ink/5"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        id="install-panel"
        role="tabpanel"
        aria-live="polite"
        aria-labelledby={`install-tab-${tab.id}`}
        className="mt-5"
      >
        <p className="text-body max-w-[66ch] text-onpaper-2">{tab.intro}</p>

        {tab.command ? (
          <div className="mt-4">
            <CommandBlock command={tab.command} />
          </div>
        ) : null}

        <ol className="text-body mt-5 flex max-w-[66ch] list-decimal flex-col gap-3 pl-6 text-onpaper-2 marker:text-label">
          {tab.steps.map((step) => (
            <li key={step.slice(0, 32)}>{step}</li>
          ))}
        </ol>

        <p className="mt-5">
          <TextLink href={tab.link.href} external={tab.link.external}>
            {tab.link.label} →
          </TextLink>
        </p>
      </div>
    </div>
  );
}
