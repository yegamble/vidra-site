import type { Metadata } from "next";
import { Button, TextLink } from "@/components/Button";
import { CommandBlock } from "@/components/CommandBlock";
import {
  RequirementsTable,
  RequirementsTruths,
} from "@/components/RequirementsTable";
import { Eyebrow, Head, Section, Standfirst } from "@/components/Section";
import { DOCS, GITHUB, INSTALL_COMMAND, VERSION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Four ways into a Vidra instance: the one-line installer, Docker Compose from a clone, a production compose deploy, or a migration from PeerTube.",
};

export default function GetStartedPage() {
  return (
    <>
      <section className="on-ink bg-ink text-onink">
        <div className="measure-text py-16 md:py-24">
          <Eyebrow ground="ink">Get started</Eyebrow>
          <Head as="h1" className="mt-3">
            Four routes in. Pick the one that matches the box.
          </Head>
          <Standfirst ground="ink" className="mt-6">
            All four end in the same place: a running instance on {VERSION} with
            an owner account you claimed yourself.
          </Standfirst>
        </div>
      </section>

      <Section ground="paper">
        <div className="flex flex-col gap-10">
          {/* 1 — one-line install */}
          <article className="rounded-card border border-paper-hairline bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-micro rounded-full bg-action px-3 py-1 uppercase text-white">
                Recommended
              </span>
              <span className="text-micro uppercase text-label">
                Route one
              </span>
            </div>
            <h2 className="text-sub mt-4">One-line install</h2>
            <p className="text-body mt-3 max-w-[66ch] text-onpaper-2">
              For a fresh server you control. Run it as a user who can use sudo.
            </p>
            <div className="mt-6">
              <CommandBlock command={INSTALL_COMMAND} />
            </div>
            <h3 className="text-micro mt-8 uppercase text-label">
              What happens next
            </h3>
            <ol className="text-body mt-4 max-w-[66ch] list-decimal space-y-3 pl-5 text-onpaper-2 marker:text-label">
              <li>
                Docker Engine and Compose v2 are installed if they are missing.
                Compose 2.20 is the floor and 2.24 is the production minimum.
              </li>
              <li>
                A checksum-verified release bundle is unpacked to{" "}
                <code className="text-mono text-onpaper">/opt/vidra</code> and the{" "}
                <code className="text-mono text-onpaper">vidra</code> CLI is
                installed.
              </li>
              <li>
                <code className="text-mono text-onpaper">vidra setup</code> runs a
                terminal interview — domain, storage, mail, federation. Pass{" "}
                <code className="text-mono text-onpaper">--web</code> for the
                browser wizard instead.
              </li>
              <li>
                Every signup path refuses on first boot. The boot log prints an
                owner-claim token; redeem it at{" "}
                <code className="text-mono text-onpaper">/setup/claim</code> and
                the instance is yours.
              </li>
            </ol>
            <p className="text-body mt-6 max-w-[66ch] text-onpaper-2">
              The script never writes over an existing env file, never opens a
              port, and never touches sshd. If you already have a configured host,
              that is the behaviour you want.
            </p>
            <p className="mt-6">
              <TextLink href={DOCS.root} external>
                Installer reference →
              </TextLink>
            </p>
          </article>

          {/* 2 — compose from a clone */}
          <article className="rounded-card border border-paper-hairline bg-white p-6 md:p-8">
            <span className="text-micro uppercase text-label">Route two</span>
            <h2 className="text-sub mt-4">Docker Compose from a clone</h2>
            <p className="text-body mt-3 max-w-[66ch] text-onpaper-2">
              For evaluating it on a laptop or a scratch VM, and for working on
              it. This is the development path, not the production one.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <CommandBlock
                command={`git clone ${GITHUB.meta}.git && cd vidra`}
                label="Clone command"
              />
              <CommandBlock command="make dev" label="Development command" />
            </div>
            <p className="text-body mt-6 max-w-[66ch] text-onpaper-2">
              The meta-repository pulls the three services — vidra-core,
              vidra-user and vidra-search — and brings them up together with
              PostgreSQL, Redis and object storage.
            </p>
            <p className="mt-6">
              <TextLink href={GITHUB.meta} external>
                github.com/yegamble/vidra →
              </TextLink>
            </p>
          </article>

          {/* 3 — production compose */}
          <article className="rounded-card border border-paper-hairline bg-white p-6 md:p-8">
            <span className="text-micro uppercase text-label">Route three</span>
            <h2 className="text-sub mt-4">Production compose</h2>
            <p className="text-body mt-3 max-w-[66ch] text-onpaper-2">
              For a host you already manage with your own conventions. You write
              the env file, you run the deploy script, and the CLI takes over from
              there.
            </p>
            <div className="mt-6">
              <CommandBlock
                command="deploy/compose.sh"
                label="Deploy command"
              />
            </div>
            <p className="text-body mt-6 max-w-[66ch] text-onpaper-2">
              Check the Compose version before anything else. Below 2.24, Compose
              silently publishes PostgreSQL and Redis on{" "}
              <code className="text-mono text-onpaper">0.0.0.0</code> — your
              database on the public internet, with no error to tell you. After
              that,{" "}
              <code className="text-mono text-onpaper">vidra doctor</code> runs 18
              checks against the running instance, and{" "}
              <code className="text-mono text-onpaper">vidra deploy</code>,{" "}
              <code className="text-mono text-onpaper">rollback</code>,{" "}
              <code className="text-mono text-onpaper">backup</code> and{" "}
              <code className="text-mono text-onpaper">restore</code> are scripted.
            </p>
            <p className="mt-6">
              <TextLink href={DOCS.root} external>
                Deployment guide →
              </TextLink>
            </p>
          </article>

          {/* 4 — migration */}
          <article className="rounded-card border border-paper-hairline bg-white p-6 md:p-8">
            <span className="text-micro uppercase text-label">Route four</span>
            <h2 className="text-sub mt-4">Migrating from PeerTube</h2>
            <p className="text-body mt-3 max-w-[66ch] text-onpaper-2">
              Vidra is not a PeerTube fork and is not PeerTube-API-compatible, so
              this is a migration rather than a drop-in swap. Moving an existing
              instance across is supported and has its own guide.
            </p>
            <p className="mt-6">
              <TextLink href={DOCS.migration} external>
                Migration overview →
              </TextLink>
            </p>
          </article>
        </div>
      </Section>

      <Section ground="mist">
        <Eyebrow>Before you start</Eyebrow>
        <Head className="mt-3">Size the box first.</Head>
        <div className="mt-10">
          <RequirementsTable compact />
        </div>
        <RequirementsTruths />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={DOCS.root} external variant="action">
            Read the docs
          </Button>
          <Button href="/use-cases" variant="ink-outline">
            See who runs it
          </Button>
        </div>
      </Section>
    </>
  );
}
