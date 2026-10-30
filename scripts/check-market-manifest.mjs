#!/usr/bin/env node
/**
 * Assert the surface a package exposes to a market index, before anything ships.
 *
 * A market entry is a promise about an install that happens on someone else's
 * machine, so every field checked here is one the host actually reads: the
 * compatibility gate consumes engines.dsh, the plugin manager resolves the icon
 * through exports, and the loader mounts dsh.bundle.patch. A package that fails
 * any check is unpublishable, not merely untidy.
 *
 *   node scripts/check-market-manifest.mjs            # every publishable package
 *   node scripts/check-market-manifest.mjs dsh-jump   # one of them
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

/**
 * Packages offered to an index. The other two plugins are deliberately absent:
 * they are still being validated in daily use, and an index entry is a promise
 * that a stranger can install the thing. Keeping them out of this list is what
 * makes the check refuse them, and each one therefore has to say `private` so
 * that npm cannot publish what the index does not offer.
 */
const PUBLISHABLE = ["dsh-jump"];
/** Workspace packages that must stay out of the index, and so must stay private. */
const UNPUBLISHED = [
  "dsh-better-keybindings",
  "dsh-slash-commands",
  "dsh-session-timing",
  "dsh-session-interruption",
  "dsh-better",
  "dsh-more-config",
];
const MAX_ICON_BYTES = 256 * 1024;
const ICON_TYPES = new Map([[".svg", "image/svg+xml"], [".png", "image/png"], [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".webp", "image/webp"]]);
/** Install lifecycle hooks would run code on a machine that only meant to add a plugin. */
const FORBIDDEN_SCRIPTS = ["preinstall", "install", "postinstall", "prepublish", "prepare"];
const EXACT_SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u;
const LANGUAGE_ID = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/u;

const errors = [];
const fail = (root, message) => {
  errors.push((relative(repoRoot, root) || ".") + ": " + message);
};

function checkIdentity(pkg, root) {
  if (pkg.private !== undefined) fail(root, "private must be absent; a private package cannot be installed by a stranger");
  if (typeof pkg.name !== "string" || pkg.name.trim() === "") fail(root, "name must be a non-empty string");
  if (typeof pkg.version !== "string" || !EXACT_SEMVER.test(pkg.version)) fail(root, "version must be an exact SemVer, saw " + JSON.stringify(pkg.version));
  if (pkg.license !== "MIT") fail(root, "license must be MIT to match the repository LICENSE");
  if (typeof pkg.description !== "string" || pkg.description.trim() === "") fail(root, "description must be non-empty");
}

function checkRepository(pkg, root) {
  const repo = pkg.repository;
  const url = typeof repo === "string" ? repo : repo && repo.url;
  if (typeof url !== "string" || url.trim() === "") {
    fail(root, "repository.url must be set; the index derives the install command from it");
  } else {
    const slug = /github\.com[/:]([^/]+)\/([^/#.]+?)(?:\.git)?(?:#.*)?$/u.exec(url.trim());
    if (slug === null) fail(root, "repository.url must normalize to github.com/owner/repo, saw " + url);
  }
  // A package that is its own repository declares no directory, and an index
  // entry for it must not carry one either. A package that still lives inside a
  // monorepo declares the subdirectory, which has to be where it actually sits.
  // Either way the two halves have to agree: a stale directory would send an
  // install to a path that no longer holds the package.
  if (typeof repo === "object" && repo !== null && repo.directory !== undefined) {
    const actual = relative(repoRoot, root).split("\\").join("/");
    if (repo.directory !== actual) {
      fail(root, "repository.directory is " + JSON.stringify(repo.directory) + " but the package sits at " + JSON.stringify(actual));
    }
  }
  if (typeof pkg.homepage !== "string" || !pkg.homepage.startsWith("https://")) fail(root, "homepage must be an https URL");
  if (!Array.isArray(pkg.keywords) || pkg.keywords.length === 0) fail(root, "keywords must be a non-empty array");
  else if (!pkg.keywords.includes("dsh-plugin")) fail(root, "keywords must include \"dsh-plugin\"");
}

/**
 * SemVer 2.0.0 precedence, including prereleases.
 *
 * Dropping the `-rc.N` suffix before comparing makes 0.2.0-rc.1 look equal to
 * 0.2.0, so a runtime older than the declared floor passes. Every version this
 * repo declares is a prerelease, which is exactly the case that bug hides in.
 */
function compareSemver(a, b) {
  const split = (v) => {
    const [release, prerelease = ""] = v.split("-", 2);
    return { parts: release.split(".").map(Number), prerelease };
  };
  const left = split(a);
  const right = split(b);
  for (let i = 0; i < 3; i += 1) {
    const pa = left.parts[i] ?? 0;
    const pb = right.parts[i] ?? 0;
    if (pa !== pb) return pa - pb;
  }
  // A version without a prerelease outranks one that has it.
  if (left.prerelease === right.prerelease) return 0;
  if (left.prerelease === "") return 1;
  if (right.prerelease === "") return -1;
  const la = left.prerelease.split(".");
  const lb = right.prerelease.split(".");
  for (let i = 0; i < Math.max(la.length, lb.length); i += 1) {
    const ia = la[i];
    const ib = lb[i];
    if (ia === undefined) return -1;
    if (ib === undefined) return 1;
    const na = /^\d+$/u.test(ia);
    const nb = /^\d+$/u.test(ib);
    if (na && nb) {
      const diff = Number(ia) - Number(ib);
      if (diff !== 0) return diff;
    } else if (na !== nb) {
      // Numeric identifiers rank below alphanumeric ones.
      return na ? -1 : 1;
    } else if (ia !== ib) {
      return ia < ib ? -1 : 1;
    }
  }
  return 0;
}

function checkCompatibility(pkg, root, runtimeVersion) {
  const range = pkg.engines && pkg.engines.dsh;
  if (typeof range !== "string" || range.trim() === "") {
    return fail(root, "engines.dsh must be a string; without it the host falls back to every @deepseek-ai/dsh* peer");
  }
  if (range.includes("workspace:")) fail(root, "engines.dsh must not use a workspace: protocol; it is unmet on an installed profile");
  const parsed = /^>=(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\s+<(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/u.exec(range.trim());
  if (parsed === null) return fail(root, "engines.dsh must be an explicit >=floor <ceiling pair so the upper bound stays visible, saw " + range);
  if (runtimeVersion === undefined) return;
  const cmp = compareSemver;
  if (!(cmp(runtimeVersion, parsed[1]) >= 0 && cmp(runtimeVersion, parsed[2]) < 0)) {
    fail(root, "engines.dsh " + range + " excludes the installed runtime " + runtimeVersion);
  }
}

function checkBundle(pkg, root) {
  const bundle = pkg.dsh && pkg.dsh.bundle;
  if (bundle === undefined) return fail(root, "dsh.bundle is missing; a market entry without a bundle row cannot be mounted");
  const patch = bundle.patch;
  if (typeof patch !== "string" || patch.trim() === "") return fail(root, "dsh.bundle.patch must be a relative path");
  if (isAbsolute(patch) || !patch.startsWith("./")) fail(root, "dsh.bundle.patch must be a ./ relative path, saw " + patch);
  if (!existsSync(resolve(root, patch))) fail(root, "dsh.bundle.patch points at a missing file: " + patch);
  const bare = patch.replace(/^\.\//u, "");
  if (!(pkg.files || []).includes(bare)) fail(root, "files must include " + bare + " so the patch survives packing");
  const client = pkg.dsh && pkg.dsh.client;
  if (client !== undefined && client.platform !== "web") fail(root, "dsh.client.platform must be \"web\"; the desktop shell loads the same bundle");
}

function checkEntryPoints(pkg, root) {
  const ex = pkg.exports;
  if (typeof ex !== "object" || ex === null) return fail(root, "exports must be an object");
  for (const key of [".", "./client", "./package.json"]) if (ex[key] === undefined) fail(root, "exports[\"" + key + "\"] is required");
  if (ex["./icon"] === undefined && pkg.icon === undefined) fail(root, "declare the icon through exports[\"./icon\"] or a top-level icon field");
  if (ex["./locale/*.json"] === undefined && existsSync(join(root, "locale"))) fail(root, "locale/ exists but exports[\"./locale/*.json\"] is missing");
  for (const required of ["lib", "README.md", "LICENSE"]) if (!(pkg.files || []).includes(required)) fail(root, "files must include " + required);
  for (const entry of pkg.files || []) if (entry.startsWith("src") || entry.startsWith("test")) fail(root, "files must not ship " + entry);
}

function checkScripts(pkg, root) {
  for (const name of FORBIDDEN_SCRIPTS) {
    if (pkg.scripts && pkg.scripts[name] !== undefined) fail(root, "scripts." + name + " would run on install and must not ship");
  }
}

function checkIcon(pkg, root) {
  const declared = pkg.icon !== undefined ? pkg.icon : pkg.exports && pkg.exports["./icon"];
  if (typeof declared !== "string") return;
  const target = resolve(root, declared);
  const local = relative(root, target);
  if (local.startsWith("..") || isAbsolute(local)) return fail(root, "icon must stay inside the package directory");
  if (!existsSync(target)) return fail(root, "icon file is missing: " + declared);
  const ext = declared.slice(declared.lastIndexOf(".")).toLowerCase();
  const mediaType = ICON_TYPES.get(ext);
  if (mediaType === undefined) return fail(root, "icon must be SVG, PNG, JPEG or WebP, saw " + ext);
  const size = statSync(target).size;
  if (size > MAX_ICON_BYTES) fail(root, "icon exceeds the host 256 KiB cap (" + size + " bytes)");
  const bare = declared.replace(/^\.\//u, "");
  if (!(pkg.files || []).some((entry) => bare.startsWith(entry))) fail(root, "files does not ship the icon at " + declared);
  const bytes = readFileSync(target);
  if (mediaType === "image/png" && bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") fail(root, "icon declares .png but has no PNG signature");
  if (mediaType === "image/svg+xml") {
    if (!bytes.toString("utf8").includes("<svg")) fail(root, "icon declares .svg but contains no <svg element");
    try {
      execFileSync("xmllint", ["--noout", target], { stdio: "pipe" });
    } catch (error) {
      if (error.code !== "ENOENT") fail(root, "icon is not well-formed XML; a browser would refuse it");
    }
  }
}

function checkLocale(pkg, root) {
  const dir = join(root, "locale");
  if (!existsSync(dir)) return fail(root, "locale/ is missing; the host would fall back to the long package description");
  const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
  if (!files.includes("en.json")) fail(root, "locale/en.json is the file the host resolves first");
  for (const name of files) {
    if (!LANGUAGE_ID.test(name.slice(0, -5))) fail(root, "locale/" + name + " must be named after a language id");
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(join(dir, name), "utf8"));
    } catch (error) {
      fail(root, "locale/" + name + " is not valid JSON");
      continue;
    }
    for (const field of ["title", "description"]) {
      const value = parsed && parsed.meta && parsed.meta[field];
      if (typeof value !== "string" || value.trim() === "") fail(root, "locale/" + name + " needs meta." + field);
    }
  }
}

function checkPackedSurface(pkg, root) {
  let out;
  try {
    out = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: root, stdio: "pipe" }).toString();
  } catch (error) {
    // This is the only place the `files` whitelist is checked against the tarball
    // that would actually ship. Returning silently here meant an npm that could
    // not pack produced a green run with none of those checks executed.
    const detail = error && error.stderr ? String(error.stderr).trim().split("\n").slice(-3).join(" ") : String(error);
    return fail(root, "npm pack --dry-run failed, so the packed surface is unverified: " + detail);
  }
  let entries;
  try {
    entries = JSON.parse(out)[0].files || [];
  } catch {
    return fail(root, "npm pack --dry-run did not emit parseable JSON");
  }
  const packed = new Set(entries.map((entry) => entry.path));
  for (const required of ["package.json", "cordis.patch.yml", "README.md", "LICENSE"]) {
    if (!packed.has(required)) fail(root, "packed tarball is missing " + required);
  }
  if (![...packed].some((path) => path.startsWith("lib/"))) fail(root, "packed tarball is missing lib/");
  if (pkg.icon !== undefined && !packed.has(pkg.icon.replace(/^\.\//u, ""))) fail(root, "packed tarball is missing the icon at " + pkg.icon);
  if (existsSync(join(root, "locale")) && ![...packed].some((path) => path.startsWith("locale/"))) fail(root, "packed tarball is missing locale/");
  for (const path of packed) {
    if (path.startsWith("src/") || path.startsWith("test/")) fail(root, "packed tarball must not contain " + path);
  }
}

function installedRuntimeVersion() {
  try {
    const parts = execFileSync("dsh", ["--version"], { stdio: "pipe" }).toString().trim().split(/\s+/u);
    return parts[parts.length - 1];
  } catch {
    return undefined;
  }
}

/**
 * Precedence cases the gate depends on.
 *
 * There is no test harness around these scripts, and this comparator decides
 * whether a package may ship to a given runtime, so the cases that matter are
 * asserted here rather than trusted to inspection. `--selftest` runs them.
 */
const SEMVER_CASES = [
  ["0.2.0-rc.1", "0.2.0-rc.2", -1, "rc.1 ranks below rc.2"],
  ["0.2.0-rc.2", "0.2.0-rc.2", 0, "identical prereleases"],
  ["0.2.1-rc.2", "0.2.0-rc.2", 1, "patch bump with prerelease"],
  ["0.2.0-rc.2", "0.2.0", -1, "prerelease ranks below its release"],
  ["0.2.0-rc.10", "0.2.0-rc.2", 1, "numeric identifiers compare as numbers"],
  ["0.2.0-rc", "0.2.0-rc.1", -1, "fewer identifiers ranks lower"],
  ["0.2.0-alpha", "0.2.0-rc", -1, "alphanumeric identifiers compare lexically"],
  ["0.2.0-1", "0.2.0-alpha", -1, "numeric ranks below alphanumeric"],
];

function selftest() {
  let failures = 0;
  for (const [a, b, expected, note] of SEMVER_CASES) {
    const actual = Math.sign(compareSemver(a, b));
    if (actual !== expected) {
      failures += 1;
      console.error("FAIL " + a + " vs " + b + ": got " + actual + ", want " + expected + " (" + note + ")");
    }
  }
  if (failures > 0) {
    console.error("selftest failed (" + failures + " of " + SEMVER_CASES.length + ")");
    process.exit(1);
  }
  console.log("selftest passed (" + SEMVER_CASES.length + " precedence cases)");
}

if (process.argv.includes("--selftest")) {
  selftest();
  process.exit(0);
}

const requested = process.argv.slice(2).filter((argument) => !argument.startsWith("-"));
const targets = requested.length > 0 ? requested : PUBLISHABLE;
const runtimeVersion = installedRuntimeVersion();
if (runtimeVersion === undefined) console.warn("warning: dsh --version unavailable, skipping the runtime compatibility check");

for (const name of targets) {
  const root = join(repoRoot, "packages", name);
  if (!existsSync(join(root, "package.json"))) {
    errors.push("packages/" + name + ": no package.json");
    continue;
  }
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  checkIdentity(pkg, root);
  checkRepository(pkg, root);
  checkCompatibility(pkg, root, runtimeVersion);
  checkBundle(pkg, root);
  checkEntryPoints(pkg, root);
  checkScripts(pkg, root);
  checkIcon(pkg, root);
  checkLocale(pkg, root);
  checkPackedSurface(pkg, root);
}

// An unpublished plugin is not a smaller version of a published one: it must be
// `private`, or a stray `npm publish` would ship something the index never
// promised and nothing here had checked.
for (const name of UNPUBLISHED) {
  const root = join(repoRoot, "packages", name);
  if (!existsSync(join(root, "package.json"))) continue;
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  if (pkg.private !== true) {
    fail(root, "not in the market list, so it must be private: true; otherwise npm could publish it unchecked");
  }
}

if (errors.length > 0) {
  console.error("market manifest check failed (" + errors.length + "):");
  for (const error of errors) console.error("  - " + error);
  process.exitCode = 1;
} else {
  console.log("market manifest check passed for " + targets.join(", ") + (runtimeVersion === undefined ? "" : " against dsh " + runtimeVersion));
}
