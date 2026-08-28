"use client";

import { useState } from "react";
import { PROFILES } from "@/lib/site";

/**
 * Nobody publishes sizing for a self-hosted video platform, so this does.
 *
 * It is arithmetic, not a model. The two profiles in `lib/site.ts` are the
 * measured anchors from the deploy guide; everything between them is derived
 * in `size()` below, which is the whole of the maths and is meant to be read:
 *
 *   - two concurrent jobs, or live ingest, needs the 8 vCPU box
 *   - ClamAV costs 2 GB of RAM and no cores
 *   - disk is the HLS ladder (2 GB an hour) plus transcode scratch plus the
 *     instance itself, rounded up to the next 20 GB and floored at the 160 GB
 *     that comes with the droplet
 *   - cost is the droplet list price plus block storage past that 160 GB
 */

function size(jobs: number, hours: number, live: boolean, clam: boolean) {
  const profile = jobs >= 2 || live ? PROFILES.launch : PROFILES.small;
  const vcpu = profile.vcpu;
  const ram = profile.ram + (clam ? PROFILES.clamavRamGb : 0);
  const raw =
    hours * PROFILES.gbPerHour + jobs * PROFILES.scratchGbPerJob + 40;
  const disk = Math.max(PROFILES.small.disk, Math.ceil(raw / 20) * 20);
  const extra = Math.max(0, disk - PROFILES.small.disk);
  const cost = Math.round(profile.droplet + extra * PROFILES.blockStoragePerGb);

  return { vcpu, ram, disk, extra, cost };
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
  const [hours, setHours] = useState(200);
  const [live, setLive] = useState(false);
  const [clam, setClam] = useState(false);

  const { vcpu, ram, disk, extra, cost } = size(jobs, hours, live, clam);

  const profileName =
    vcpu === PROFILES.launch.vcpu
      ? "Public launch profile — live or concurrent transcodes need the larger box."
      : "Small, private profile — a channel or two and a handful of viewers.";

  const costNote =
    `Droplet list price for ${vcpu} vCPU / ${ram} GB` +
    (extra > 0
      ? `, plus ${extra} GB of block storage at $0.10 a GB.`
      : `. ${PROFILES.small.disk} GB is included with the droplet.`);

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
              Estimated at {PROFILES.gbPerHour} GB per hour for the full HLS
              ladder. Your mileage varies with the source.
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
          ${cost}
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
            <dd className="mt-1 text-sub tabular-nums text-onink">{disk} GB</dd>
          </div>
        </dl>
        <p className="text-small mt-5 text-onink-2">{costNote}</p>
      </div>
    </div>
  );
}
