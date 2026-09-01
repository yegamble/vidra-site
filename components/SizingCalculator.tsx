"use client";

import { useState } from "react";
import { TextLink } from "@/components/Button";
import {
  DERIVATIVES_GIB_PER_HOUR,
  INSTALL_ANCHOR,
  LADDER,
  PROFILES,
  RETAINED,
  SCALE,
} from "@/lib/site";

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
 *   - disk is the HLS ladder plus the reader's own originals plus transcode
 *     scratch plus the instance itself, rounded up to the next 20 GiB and
 *     floored at the disk that particular plan includes
 *   - cost is the plan's list price plus block storage past that disk
 *
 * THE STORAGE FIGURE WAS WRONG UNTIL 2026-09-01, and wrong by about 8.7x.
 * `gbPerHour: 2` carried a note saying no repository pinned a GB-per-hour
 * number for the full HLS ladder. The repository pins it — a ladder IS a table
 * of bitrates, and bitrate times duration is bytes — so the number is now
 * derived from `LADDER` in `lib/site.ts` rather than assumed, and the panel
 * prints the five components it is the sum of. That is not decoration: four of
 * the five are things an operator can act on (drop a rung, delete the copy
 * nothing serves), which is the difference between a scary total and a bill a
 * reader can argue with.
 *
 * Two figures stay out of the total on purpose. The retained original is the
 * reader's own footage, so it is a slider rather than an invented constant.
 * Trick-play is encoded at CRF 28 with no rate target, so there is no bitrate
 * to multiply — it is named as unknown, never folded into the point estimate.
 *
 * The included-disk floor is per profile, not one number for both. The two
 * plans do not carry the same disk: the small box ships 160 GiB and the
 * launch box ships 100 GiB, and pretending otherwise under-priced the launch
 * profile by hiding the block storage it needs on day one.
 *
 * The default state (1 job, 5 hours, no originals entered) derives exactly the
 * small profile's $56, so the first number the reader checks agrees with the
 * first number the site claims. Five hours is the default because five hours
 * is what $56 buys: the plan's own 160 GiB holds about six source hours on the
 * shipped ladder, and the panel says so at every position of the slider rather
 * than leaving the reader to discover it at 50.
 */

function size(
  jobs: number,
  hours: number,
  originalGib: number,
  live: boolean,
  clam: boolean,
) {
  const profile = jobs >= 2 || live ? PROFILES.launch : PROFILES.small;
  const vcpu = profile.vcpu;
  const ram = profile.ram + (clam ? PROFILES.clamavRamGb : 0);
  const perHour = DERIVATIVES_GIB_PER_HOUR + originalGib;
  const scratch = jobs * PROFILES.scratchGbPerJob;
  const raw = hours * perHour + scratch + PROFILES.baseDiskGib;
  const disk = Math.max(profile.disk, Math.ceil(raw / 20) * 20);
  const extra = Math.max(0, disk - profile.disk);
  const cost = Math.round(profile.droplet + extra * PROFILES.blockStoragePerGb);

  // How much video the plan's own disk carries before block storage starts.
  // Derived from the same per-hour figure, so it can never disagree with the
  // number above it.
  const included = Math.max(
    0,
    Math.floor((profile.disk - PROFILES.baseDiskGib - scratch) / perHour),
  );

  return { profile, vcpu, ram, disk, extra, cost, perHour, included };
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

/**
 * One line of the working: what it is on the left, how many GiB on the right.
 *
 * The wrapping `<div>` is a DIRECT child of the `<dl>` and the `<dt>`/`<dd>`
 * are direct children of it. Nesting one more level — a bordered `<div>` for
 * the total, holding a `Row` — is axe `dlitem`, serious, and it failed the
 * gate on the first run. Border classes come in through `className` instead.
 */
function Row({
  label,
  value,
  strong = false,
  className = "",
}: {
  label: string;
  value: string;
  strong?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`text-small flex justify-between gap-4 ${
        strong ? "font-semibold text-onink" : "text-onink-2"
      } ${className}`}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums whitespace-nowrap">{value}</dd>
    </div>
  );
}

export function SizingCalculator() {
  const [jobs, setJobs] = useState(1);
  const [hours, setHours] = useState(5);
  const [originalGib, setOriginalGib] = useState(0);
  const [live, setLive] = useState(false);
  const [clam, setClam] = useState(false);

  const { profile, vcpu, ram, disk, extra, cost, included } = size(
    jobs,
    hours,
    originalGib,
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
      ? `, plus ${thousands(extra)} GiB of block storage at $0.10 a GiB — DigitalOcean volume list pricing. The plan itself includes ${profile.disk} GiB.`
      : `. Its ${profile.disk} GiB of disk is enough here.`) +
    (ram > profile.ram
      ? ` ClamAV wants ${PROFILES.clamavRamGb} GB beyond what the plan carries, so take the next size up if you turn it on.`
      : "");

  return (
    // Result above controls on a phone: the answer is what the reader came
    // for, and burying it under four controls means scrolling past the
    // question to find it. At `md` the grid takes over and the controls sit
    // on the left, where they read as the thing you touch first.
    <div className="flex flex-col-reverse gap-5 md:grid md:grid-cols-2">
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
            {/* The two scratch figures are not two answers to one question:
                3.6 GB is what one job's ladder computes to, 8 GB is the
                budget, and the gap is the admission floor being generous on
                purpose. Saying only one of them has read as a contradiction
                against the other everywhere else on the site. */}
            <p className="text-small text-onink-2">
              One job&apos;s ladder computes to a ~{SCALE.scratchAfterGb} GB
              peak; budget ~{PROFILES.scratchGbPerJob} GB of scratch per
              concurrent job, because the floor that admits work is
              deliberately generous.
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
              max={500}
              step={5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1"
            />
            {/* The rungs are an operator setting (transcoding_resolutions),
                which is why the sentence ends on the one an operator can act
                on: 1080p carries 5,000 of the ladder's 10,000 kbps of video,
                so dropping it is exactly half. */}
            <p className="text-small text-onink-2">
              The shipped {LADDER.length}-rung ladder computes to{" "}
              {DERIVATIVES_GIB_PER_HOUR.toFixed(1)} GiB a source hour, from the
              bitrate table below. After the instance itself and this
              box&apos;s scratch, its {profile.disk} GiB carries about{" "}
              {included} {included === 1 ? "hour" : "hours"} before it starts
              buying block storage. Dropping the {LADDER[0].height}p rung takes
              half the video bitrate with it.
            </p>
          </div>

          <div>
            <label
              htmlFor="calc-originals"
              className="text-small flex justify-between gap-3 font-semibold text-onink"
            >
              Your originals, GiB a source hour
              <span className="tabular-nums text-vidra">{originalGib}</span>
            </label>
            <input
              id="calc-originals"
              type="range"
              min={0}
              max={20}
              step={1}
              value={originalGib}
              onChange={(e) => setOriginalGib(Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-small text-onink-2">
              Vidra keeps the file it ingested, and no setting deletes it.
              What yours weigh is your number, not ours, so it starts at zero.
              Set it to your own footage.
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
        className="self-start rounded-card bg-ink-surface p-5 ring-1 ring-inset ring-vidra"
      >
        <p className="text-micro uppercase text-onink-2">Your box</p>
        <p data-testid="calc-cost" className="text-head mt-2 tabular-nums">
          ~${thousands(cost)}
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
            <dd className="mt-1 text-sub tabular-nums text-onink">
              {thousands(disk)} GiB
            </dd>
          </div>
        </dl>
        <p className="text-small mt-5 text-onink-2">{costNote}</p>
        {/* The band is called "Check our arithmetic", so the arithmetic is
            here rather than in a footnote. Every line is bitrate times
            duration off the ladder in lib/site.ts, which is the table in
            vidra-core's hls.go — and four of the five are lines an operator
            can move. */}
        <div className="mt-5 border-t border-ink-hairline pt-4">
          <p className="text-micro uppercase text-onink-2">
            Per source hour, retained
          </p>
          <dl data-testid="calc-working" className="mt-3 flex flex-col gap-2">
            {RETAINED.perSourceHourGib.map((row) => (
              <Row
                key={row.label}
                label={row.label}
                value={`${row.gib.toFixed(2)} GiB`}
              />
            ))}
            <Row
              label="Derivatives, computed from the ladder"
              value={`${DERIVATIVES_GIB_PER_HOUR.toFixed(1)} GiB`}
              strong
              className="mt-1 border-t border-ink-hairline pt-3"
            />
            <Row
              label="Your originals, which Vidra keeps"
              value={originalGib > 0 ? `${originalGib.toFixed(2)} GiB` : "yours"}
            />
            <Row
              label="Trick-play, one dense rendition a rung"
              value="not derivable"
            />
          </dl>
          <p className="text-small mt-3 text-onink-2">
            Bitrate times duration, off the {LADDER.length}-rung table in
            vidra-core&apos;s hls.go, on the shipped CMAF and H.264 defaults.
            Trick-play is encoded at CRF 28 with no rate target, so there is no
            bitrate to multiply: it is named rather than guessed at. Turning on
            VP9, HEVC or AV1 adds a whole second set of representations.
          </p>
        </div>
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
        {/* A next step that names what happens rather than saying "get
            started": the reader has a box in mind and the question is what
            puts Vidra on it. */}
        <p className="text-small mt-5">
          <TextLink href={INSTALL_ANCHOR} ground="ink">
            The one-line installer sets up a box this size →
          </TextLink>
        </p>
      </div>
    </div>
  );
}
