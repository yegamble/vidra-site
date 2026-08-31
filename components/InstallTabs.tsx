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
  /**
   * The one-line route shows a permit instead of a numbered list. Piping a
   * stranger's script into a shell with sudo is the single largest ask on
   * this site, and a list of what the script achieves is not what a cautious
   * reader needs — they need to know what it will not touch before they read
   * what it does.
   *
   * Every clause below is quoted from `install.sh` at `ce605f3`: the refusal
   * block at lines 69-80, the usage text at 116-124, the Compose floor at
   * 363-367 and 580, the `/dev/tty` read at 448-496, and the hand-back at
   * 981-988. No line here may be added without one.
   */
  permit?: { heading: string; body: string }[];
  link: { label: string; href: string; external: boolean };
};

const TABS: Tab[] = [
  {
    id: "oneline",
    label: "One-line",
    command: INSTALL_COMMAND,
    intro:
      "For a fresh server you control. Run it as a user who can use sudo. Here is what it will and will not do, before you run it.",
    link: {
      label: "Installer reference",
      href: DOCS.oneLineInstall,
      external: true,
    },
    steps: [],
    permit: [
      {
        heading: "What it will not touch",
        body: "It never writes or overwrites env/production.env. That file holds the keys sealing MFA, federation and ATProto data in the database, and re-minting them orphans everything already sealed — so vidra setup owns the file, refuses to rewrite an existing one without --yes, and this script never passes --yes. It never runs docker compose up: deploying is a separate step. It opens no port and does not touch sshd.",
      },
      {
        heading: "What it will change",
        body: "It installs Docker Engine and the Compose v2 plugin if they are missing, and stops if Compose is below 2.24 — docker-compose.prod.yml uses the !reset and !override merge tags, and an older Compose ignores them without a word, leaving PostgreSQL and Redis published on 0.0.0.0. It unpacks the release bundle into /opt/vidra, checksum-verified and without a git clone, and puts the vidra CLI in /usr/local/bin.",
      },
      {
        heading: "How you sign it",
        body: "It asks before any of that, and reads your answer from /dev/tty rather than stdin — under curl … | sh, stdin is the script itself, so a script that read from it would answer its own questions. On a host with no terminal it stops instead of guessing. Unattended runs pass --yes, which is your decision to make, not its default.",
      },
      {
        heading: "How it hands back",
        body: "vidra setup asks nine questions — domain, storage, mail, federation — in the terminal, or in a browser with --web. Then every signup path answers 403 until the instance is claimed: the api mints a one-time token at boot and prints it to its own log. Read the most recent log. A restart mints a new token and the previous one stops working.",
      },
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
      // The 2.20 floor is this tab's, and only this tab's: it comes from the
      // root docker-compose.yml's `include:` key (deploy/README.md:220). The
      // production overlay's floor is 2.24, which is what install.sh and
      // deploy.sh both refuse to go below.
      "make dev brings them up together with PostgreSQL, Redis and object storage. The root compose file uses the include: key, so Compose 2.20 or newer.",
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

        {/* `data-command-anchor` marks this as a command block like the
            hero's, so the phone's sticky install bar stands down over it. It
            is no longer what carries the band, though: this wrapper unmounts
            on the "From PeerTube" tab, and a bar that measured the command
            came back over the band its own button points at. The bar now
            observes the band itself. See MobileInstallBar. */}
        {tab.command ? (
          <div className="mt-4" data-command-anchor>
            <CommandBlock command={tab.command} />
          </div>
        ) : null}

        {tab.permit ? (
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {tab.permit.map((clause) => (
              <div key={clause.heading}>
                <dt className="text-micro uppercase text-label">
                  {clause.heading}
                </dt>
                <dd className="text-small mt-2 max-w-[60ch] text-onpaper-2">
                  {clause.body}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {tab.steps.length > 0 ? (
          <ol className="text-body mt-5 flex max-w-[66ch] list-decimal flex-col gap-3 pl-6 text-onpaper-2 marker:text-label">
            {tab.steps.map((step) => (
              <li key={step.slice(0, 32)}>{step}</li>
            ))}
          </ol>
        ) : null}

        <p className="mt-5">
          <TextLink href={tab.link.href} external={tab.link.external}>
            {tab.link.label} →
          </TextLink>
        </p>
      </div>
    </div>
  );
}
