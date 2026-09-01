#!/usr/bin/env node
/**
 * The envelope gate: keeps every count this site prints in step with the
 * vidra-core release the installer actually installs.
 *
 * WHY THIS EXISTS. Counts are the whole drift vector, and it is now measured
 * rather than suspected. Across v0.5.0 -> v0.6.0, none of the ~35 compiled
 * constants moved and every count checked did: OpenAPI paths 228 -> 230,
 * jobloop registrations 24 -> 25, migrations 120 -> 123. War-room cycle 2 cut
 * the number of places a count appears and explicitly did not build this; the
 * standing objection ("halving the mentions and calling it a fix") was
 * vindicated inside 24 hours, when v0.6.0 shipped mid-cycle and left the site
 * asserting a version its own installer no longer installs.
 *
 * WHAT IT DOES. `lib/envelope.json` is a committed record: a vidra-core tag,
 * and every count derived from that tag's source. This script is both halves
 * of keeping it honest.
 *
 *   node scripts/envelope-sync.mjs            # check  (npm run check:envelope)
 *   node scripts/envelope-sync.mjs --write    # rewrite (npm run sync:envelope)
 *
 * The check fails on two things, and both are the point:
 *
 *   1. THE PIN IS BEHIND. vidra-core has published a newer release than the
 *      one the envelope is pinned to. Everything the site says about versions
 *      and counts is now suspect at once, so CI goes red the day upstream
 *      moves — before a reader finds it. `lib/site.ts` reads VERSION out of
 *      this file, so the version and the counts can only move together.
 *   2. A COUNT DISAGREES with what the pinned tag actually contains. That is
 *      a hand-edited number, and hand-edited numbers are what this repo's
 *      failure log is made of.
 *
 * NETWORK. The check derives from source at the pinned tag, so it needs the
 * network, and it fails loudly rather than passing quietly when it cannot
 * reach GitHub. A gate that can be skipped is not a gate, and there is no
 * environment variable here that turns it off.
 *
 * It is built to avoid the one failure that would make it lie. Four of the
 * five counts come from raw.githubusercontent.com and the tag is resolved by
 * following github.com's own /releases/latest redirect, so neither touches
 * the rate-limited API. The migration count needs a DIRECTORY, which has no
 * raw URL, so it asks api.github.com — and if that answers 403 or 429,
 * because an unauthenticated CI address shares a 60-an-hour quota with
 * strangers, it falls through to jsDelivr's listing of the same git tag and
 * says which source it used. Set GITHUB_TOKEN to skip that path entirely.
 *
 * ADDING A COUNT. Put it in COUNTS below with the file it comes from and the
 * function that derives it, run `npm run sync:envelope`, and read the diff.
 * Never edit lib/envelope.json by hand — that is the thing this prevents.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENVELOPE = join(ROOT, "lib", "envelope.json");
const REPO = "yegamble/vidra-core";

const WRITE = process.argv.includes("--write");

/* ---------------------------------------------------------------- fetching */

function headers() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return {
    "user-agent": "vidra-site-envelope-sync",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * fetch with three attempts, on TRANSPORT failures only.
 *
 * A dropped connection is not a finding, and six round trips a run is six
 * chances to have one. An HTTP status is never retried: a 404 or a 403 is an
 * answer, and answers are what this gate reads.
 */
async function attempt(url, init) {
  let last;
  for (let i = 0; i < 3; i += 1) {
    try {
      return await fetch(url, init);
    } catch (cause) {
      last = cause;
      await new Promise((r) => setTimeout(r, 250 * (i + 1)));
    }
  }
  throw last;
}

async function get(url, json = false) {
  let res;
  try {
    res = await attempt(url, { headers: headers() });
  } catch (cause) {
    throw new Error(
      `could not reach ${url} (${cause.message}). This check derives every ` +
        `count from vidra-core's source at the pinned tag, so it needs the ` +
        `network. It does not pass quietly when it cannot run.`,
    );
  }
  if (!res.ok) {
    const rate =
      res.status === 403 || res.status === 429
        ? " — that looks like a GitHub rate limit; set GITHUB_TOKEN and re-run"
        : "";
    throw new Error(`${url} returned ${res.status}${rate}`);
  }
  return json ? res.json() : res.text();
}

/** The latest published release tag, without touching the rate-limited API. */
async function latestTag() {
  const res = await attempt(`https://github.com/${REPO}/releases/latest`, {
    headers: headers(),
    redirect: "follow",
  }).catch((cause) => {
    throw new Error(
      `could not resolve ${REPO}'s latest release (${cause.message})`,
    );
  });
  const tag = res.url.match(/\/releases\/tag\/([^/?#]+)$/)?.[1];
  if (!tag) {
    throw new Error(
      `github.com/${REPO}/releases/latest did not redirect to a tag ` +
        `(landed on ${res.url}). If the repository has no releases, there is ` +
        `nothing for this site to pin to.`,
    );
  }
  return decodeURIComponent(tag);
}

const raw = (tag, path) =>
  get(`https://raw.githubusercontent.com/${REPO}/${tag}/${path}`);

/* ---------------------------------------------------------------- deriving */

/**
 * The entries of a Go composite literal, counted at the literal's own depth.
 *
 * `var checks = []check{ {…}, {…} }` — one entry per `{` that opens while the
 * scanner is at depth 0 inside the outer braces. Line-based, because Go's
 * gofmt guarantees these registries are one entry per line group and a real
 * parser is a dependency this repo will not take for a count.
 */
function goLiteralEntries(source, declaration, file) {
  const at = source.indexOf(declaration);
  if (at < 0) {
    throw new Error(
      `${file}: could not find \`${declaration}\`. The registry was renamed or ` +
        `restructured upstream, so this derivation is no longer counting what ` +
        `it claims to. Fix the derivation before you touch the number.`,
    );
  }
  let i = at + declaration.length;
  let depth = 1;
  let entries = 0;
  while (i < source.length && depth > 0) {
    const c = source[i];
    if (c === "{") {
      if (depth === 1) entries += 1;
      depth += 1;
    } else if (c === "}") {
      depth -= 1;
    }
    i += 1;
  }
  if (depth !== 0) throw new Error(`${file}: \`${declaration}\` never closes`);
  return entries;
}

/** Occurrences of a literal string, not lines containing it. */
function occurrences(source, needle) {
  return source.split(needle).length - 1;
}

/**
 * Every count the site is allowed to print, and the derivation that produces
 * it. The `cite` string is what copy points at when it uses the number.
 */
const COUNTS = {
  openapiPaths: {
    cite: "vidra-core/api/openapi.yaml, top-level paths",
    async derive(tag) {
      const lines = (await raw(tag, "api/openapi.yaml")).split("\n");
      const start = lines.findIndex((l) => /^paths:\s*$/.test(l));
      if (start < 0) throw new Error("api/openapi.yaml has no `paths:` block");
      let n = 0;
      for (const line of lines.slice(start + 1)) {
        if (/^\S/.test(line)) break; // the next top-level key ends the block
        if (/^ {2}\/\S*:\s*$/.test(line)) n += 1;
      }
      return n;
    },
  },
  jobLoops: {
    cite: "vidra-core/cmd/api/main.go, `jobloop.Loop{` registrations",
    async derive(tag) {
      return occurrences(await raw(tag, "cmd/api/main.go"), "jobloop.Loop{");
    },
  },
  doctorChecks: {
    cite: "vidra-core/internal/doctor/doctor.go, the `checks` slice",
    async derive(tag) {
      return goLiteralEntries(
        await raw(tag, "internal/doctor/doctor.go"),
        "var checks = []check{",
        "internal/doctor/doctor.go",
      );
    },
  },
  instanceSettings: {
    cite: "vidra-core/internal/instancesettings/service.go, the `specs` registry",
    async derive(tag) {
      return goLiteralEntries(
        await raw(tag, "internal/instancesettings/service.go"),
        "var specs = []spec{",
        "internal/instancesettings/service.go",
      );
    },
  },
  migrations: {
    cite: "vidra-core/migrations/*.up.sql",
    async derive(tag) {
      // The one derivation that needs a DIRECTORY, which has no raw URL.
      //
      // GitHub's tree API is the authoritative answer and is tried first. It
      // is also the only api.github.com call in this file, and unauthenticated
      // calls from a shared CI address are rate-limited at 60 an hour — so a
      // 403 or 429 falls through to jsDelivr's listing of the same git tag,
      // which needs no token and has no such limit. A gate that goes red
      // because somebody else's CI job used the quota is a gate that stops
      // meaning anything; a gate that goes quiet is worse. This does neither.
      const paths = await treePaths(tag);
      return paths.filter((p) => /^migrations\/.+\.up\.sql$/.test(p)).length;
    },
  },
};

/** Every blob path at `tag`, from GitHub, or from jsDelivr if GitHub says no. */
async function treePaths(tag) {
  try {
    const tree = await get(
      `https://api.github.com/repos/${REPO}/git/trees/${tag}?recursive=1`,
      true,
    );
    if (tree.truncated) {
      throw new Error(
        "the vidra-core tree listing came back truncated, so a count taken " +
          "from it would be a floor, not a count",
      );
    }
    return tree.tree.filter((e) => e.type === "blob").map((e) => e.path);
  } catch (err) {
    if (!/ (403|429)/.test(err.message)) throw err;
    const pkg = await get(
      `https://data.jsdelivr.com/v1/packages/gh/${REPO}@${tag}?structure=flat`,
      true,
    );
    console.warn(
      "  (github rate-limited the tree listing; used jsDelivr's listing of " +
        `the same tag. Set GITHUB_TOKEN to use the API directly.)`,
    );
    return pkg.files.map((f) => f.name.replace(/^\//, ""));
  }
}

async function derive(tag) {
  const counts = {};
  for (const [name, spec] of Object.entries(COUNTS)) {
    counts[name] = await spec.derive(tag);
  }
  return counts;
}

/* ------------------------------------------------------------------- modes */

function readEnvelope() {
  return JSON.parse(readFileSync(ENVELOPE, "utf8"));
}

async function write() {
  const tag = await latestTag();
  const counts = await derive(tag);
  const envelope = {
    $comment:
      "Derived by scripts/envelope-sync.mjs. Never edit by hand — run " +
      "`npm run sync:envelope`, read the diff, then sweep the copy. " +
      "`npm run check:envelope` re-derives this on every CI run and fails " +
      "both when a count disagrees and when vidra-core publishes a newer " +
      "release than the tag below.",
    repo: REPO,
    tag,
    derivedAt: new Date().toISOString().slice(0, 10),
    cites: Object.fromEntries(
      Object.entries(COUNTS).map(([k, v]) => [k, v.cite]),
    ),
    counts,
  };
  writeFileSync(ENVELOPE, `${JSON.stringify(envelope, null, 2)}\n`);
  console.log(`Envelope written at ${tag}:`);
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
}

async function check() {
  const envelope = readEnvelope();
  const failures = [];

  const tag = await latestTag();
  if (tag !== envelope.tag) {
    failures.push(
      `${REPO} has published ${tag}; lib/envelope.json is pinned at ` +
        `${envelope.tag}. The installer resolves ${REPO}/releases/latest, so ` +
        `the site is now claiming a version its own installer does not ` +
        `install, and every count below is derived from the wrong tree. ` +
        `Run \`npm run sync:envelope\`, read the diff, and sweep the copy.`,
    );
  }

  const derived = await derive(envelope.tag);
  for (const [name, value] of Object.entries(derived)) {
    if (envelope.counts[name] !== value) {
      failures.push(
        `${name}: lib/envelope.json says ${envelope.counts[name]}, ` +
          `${envelope.tag} contains ${value} (${COUNTS[name].cite})`,
      );
    }
  }
  for (const name of Object.keys(envelope.counts)) {
    if (!(name in COUNTS)) {
      failures.push(`${name}: in lib/envelope.json with no derivation here`);
    }
  }

  if (failures.length) {
    console.error(`Envelope check failed:\n- ${failures.join("\n- ")}`);
    process.exit(1);
  }
  console.log(
    `Envelope check passed: ${envelope.tag} is ${REPO}'s latest release, and ` +
      `all ${Object.keys(derived).length} counts re-derive from it.`,
  );
}

try {
  await (WRITE ? write() : check());
} catch (err) {
  console.error(`Envelope check failed:\n- ${err.message}`);
  process.exit(1);
}
