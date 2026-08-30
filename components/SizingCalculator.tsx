"use client";

import { useState } from "react";
import { PROFILES } from "@/lib/site";

/**
 * What a Vidra instance costs to run, with the working shown.
 *
 * (This used to open "Nobody publishes sizing for a self-hosted video
 * platform, so this does." The claim about everybody else was killed on the
 * record in the 2026-08-30 review — it is unscoped, unfalsifiable and false
 * one click away — and the comment goes with the headline it justified, so
 * nobody restores the line from here.)
 *
 * It is arithmetic, not a model. The two profiles in `lib/site.ts` are the
 * measured anchors from the deploy guide; everything between them is derived
 * in `size()` below, which is the whole of the maths and is meant to be read:
 *
 *   - two concurrent jobs, or live ingest, needs the 8 vCPU box
 *   - ClamAV costs 2 GB of RAM and no cores
 *   - disk is the HLS ladder (an assumed 2 GB an hour — an estimate, labelled
 *     as such in the UI; see the gbPerHour note in lib/site.ts) plus transcode
 *     scratch plus the instance itself, rounded up to the next 20 GiB and
 *     floored at the disk that particular plan includes
 *   - cost is the plan's list price plus block storage past that disk
 *
 * The included-disk floor is per profile, not one number for both. The two
 * plans do not carry the same disk: the small box ships 160 GiB and the
 * launch box ships 100 GiB, and pretending otherwise under-priced the launch
 * profile by hiding the block storage it needs on day one.
 *
 * The default state (1 job, 50 hours) derives exactly the small profile's
 * $56, so the first number the reader checks agrees with the first number the
 * site claims.
 */

function size(jobs: number, hours: number, live: boolean, clam: boolean) {
  const profile = jobs >= 2 || live ? PROFILES.launch : PROFILES.small;
  const vcpu = profile.vcpu;
  const ram = profile.ram + (clam ? PROFILES.clamavRamGb : 0);
  const raw =
    hours * PROFILES.gbPerHour + jobs * PROFILES.scratchGbPerJob + 40;
  const disk = Math.max(profile.disk, Math.ceil(raw / 20) * 20);
  const extra = Math.max(0, disk - profile.disk);
  const cost = Math.round(profile.droplet + extra * PROFILES.blockStoragePerGb);

  return { profile, vcpu, ram, disk, extra, cost };
}

/**
 * Thousands separators, done here rather than with `toLocaleString()`: this is
 * a client component that also prerenders, and the two runtimes do not have to
 * agree on a locale. A hydration mismatch on a price is not a place to find out.
 */
function thousands(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-small font-semibold ring-1 ring-inset ring-ice/40 transition-colors ${
        pressed ? "bg-vidra text-ink" : "bg-transparent text-ice hover:bg-ice/10"
      }`}
    >
      {children}
    </button>
  );
}

export function SizingCalculator() {
  const [jobs, setJobs] = useState(1);
  const [hours, setHours] = useState(50);
  const [live, setLive] = useState(false);
  const [clam, setClam] = useState(false);

  const { profile, vcpu, ram, disk, extra, cost } = size(
    jobs,
    hours,
    live,
    clam,
  );

  const profileName =
    vcpu === PROFILES.launch.vcpu
      ? "Public launch profile — live or concurrent transcodes need dedicated cores."
      : "Small, private profile — a channel or two and a handful of viewers.";

  // The class is named because it is the difference that costs money: the
  // launch profile is priced on dedicated cores, and a shared-core box of the
  // same shape is cheaper and wrong for a transcode queue.
  const costNote =
    `${profile.class} list price for the ${profile.vcpu} vCPU / ${profile.ram} GB plan` +
    (extra > 0
      ? `, plus ${extra} GiB of block storage at $0.10 a GiB — DigitalOcean volume list pricing. The plan itself includes ${profile.disk} GiB.`
      : `. Its ${profile.disk} GiB of disk is enough here.`) +
    (ram > profile.ram
      ? ` ClamAV wants ${PROFILES.clamavRamGb} GB beyond what the plan carries, so take the next size up if you turn it on.`
      : "");

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-card bg-ink-surface p-5 ring-1 ring-inset ring-ink-hairline">
        <div className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="calc-jobs"
              className="text-small flex justify-between gap-3 font-semibold text-onink"
            >
              Concurrent transcode jobs
              <span className="tabular-nums text-vidra">{jobs}</span>
            </label>
            <input
              id="calc-jobs"
              type="range"
              min={1}
              max={6}
              step={1}
              value={jobs}
              onChange={(e) => setJobs(Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-small text-onink-2">
              A 1080p job runs 12 encode passes and wants about{" "}
              {PROFILES.scratchGbPerJob} GB of scratch.
            </p>
          </div>

          <div>
            <label
              htmlFor="calc-hours"
              className="text-small flex justify-between gap-3 font-semibold text-onink"
            >
              Hours of video stored
              <span className="tabular-nums text-vidra">{hours}</span>
            </label>
            <input
              id="calc-hours"
              type="range"
              min={0}
              max={2000}
              step={25}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-small text-onink-2">
              Assumes roughly {PROFILES.gbPerHour} GB per source hour for the
              full HLS ladder — an estimate, not a measured figure.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Toggle pressed={live} onClick={() => setLive((v) => !v)}>
              RTMP live streaming
            </Toggle>
            <Toggle pressed={clam} onClick={() => setClam((v) => !v)}>
              ClamAV upload scanning
            </Toggle>
          </div>
        </div>
      </div>

      <div
        aria-live="polite"
        data-testid="calc-result"
        className="rounded-card bg-ink-surface p-5 ring-1 ring-inset ring-vidra"
      >
        <p className="text-micro uppercase text-onink-2">Your box</p>
        <p data-testid="calc-cost" className="text-head mt-2 tabular-nums">
          ~${cost}
          <span className="text-small font-semibold text-onink-2"> / month</span>
        </p>
        <p className="text-small mt-2 text-onink-2">{profileName}</p>
        <dl className="mt-5 grid grid-cols-3 gap-4">
          <div>
            <dt className="text-micro uppercase text-onink-2">vCPU</dt>
            <dd className="mt-1 text-sub tabular-nums text-onink">{vcpu}</dd>
          </div>
          <div>
            <dt className="text-micro uppercase text-onink-2">RAM</dt>
            <dd className="mt-1 text-sub tabular-nums text-onink">{ram} GB</dd>
          </div>
          <div>
            <dt className="text-micro uppercase text-onink-2">Disk</dt>
            <dd className="mt-1 text-sub tabular-nums text-onink">{disk} GiB</dd>
          </div>
        </dl>
        <p className="text-small mt-5 text-onink-2">{costNote}</p>
        {/* The axis that makes video different from every other thing you
            self-host, and the one the figure above does not contain. It is
            stated rather than modelled: how much anyone watches is the
            reader's number, not ours, so the calculator hands over the
            allowance and the rate and lets them do it. */}
        <div className="mt-5 border-t border-ink-hairline pt-4">
          <p className="text-micro uppercase text-onink-2">
            Transfer, on top
          </p>
          <p className="text-small mt-2 text-onink-2">
            {thousands(profile.transfer)} GiB a month comes with the plan —
            pooled across every droplet on the team and accruing per second
            over a 28-day month, so it is never a per-box allowance. Inbound
            costs nothing. Past the pool, outbound is $
            {PROFILES.egressPerGb.toFixed(2)} a GiB, which is the number a CDN
            in front of your HLS is spent against.
          </p>
        </div>
        <p className="text-small mt-4 text-onink-2">
          Droplet, volume and bandwidth prices are DigitalOcean list prices,
          checked 2026-08-30.
        </p>
      </div>
    </div>
  );
}
