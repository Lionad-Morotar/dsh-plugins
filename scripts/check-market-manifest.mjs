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
 *   node scripts/check-market-manifest.mjs --selftest # comparator, asar and oracle cases
 *
 * The runtime version this gate compares against comes from the desktop bundle
 * that actually serves the checkout, not from whatever `dsh` happens to be on
 * PATH: see `runtimeVersionProbes` for the precedence.
 */
import { execFileSync } from "node:child_process";
import { closeSync, existsSync, mkdtempSync, openSync, readFileSync, readdirSync, readSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

/**
 * Packages offered to an index. Only dsh-jump ships for now: the rest are still
 * being validated in daily use, and an index entry is a promise that a stranger
 * can install the thing. Keeping them out of this list is what makes the check
 * refuse them, and each one therefore has to say `private` so that npm cannot
 * publish what the index does not offer.
 */
const PUBLISHABLE = ["dsh-jump"];
/** Workspace packages that must stay out of the index, and so must stay private. */
const UNPUBLISHED = [
  "dsh-arch",
  "dsh-better-keybindings",
  "dsh-slash-commands",
  "dsh-session-timing",
  "dsh-session-interruption",
  "dsh-workspace-open-local",
  "dsh-better",
  "dsh-more-config",
  "dsh-repo-harness",
  "dsh-text-languages",
];
const MAX_ICON_BYTES = 256 * 1024;
const ICON_TYPES = new Map([[".svg", "image/svg+xml"], [".png", "image/png"], [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".webp", "image/webp"]]);
/** Install lifecycle hooks would run code on a machine that only meant to add a plugin. */
const FORBIDDEN_SCRIPTS = ["preinstall", "install", "postinstall", "prepublish", "prepare"];
const EXACT_SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u;
const LANGUAGE_ID = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/u;
/** Default install location of the desktop app; override with DSH_DESKTOP_APP. */
const DEFAULT_DESKTOP_APP = "/Applications/DeepSeek Harness.app";
/** The asar header is a JSON tree; anything near this size means we are parsing garbage. */
const MAX_ASAR_HEADER_BYTES = 64 * 1024 * 1024;
const ASAR_HEADER_BYTES = 16;

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

/**
 * The range assertion is shared by two callers with different obligations.
 *
 * A publishable package must declare the range *and* fit it; a private package
 * only has to fit the range it already declares. Keeping the judgement here
 * means both paths apply the same prerelease semantics: the host checks with
 * `includePrerelease: true`, so 0.2.2-rc.1 has to count as satisfying a
 * `>=0.2.1-rc.3` floor instead of being rejected as a prerelease.
 */
function engineRangeProblem(range, runtimeVersion) {
  if (typeof range !== "string" || range.trim() === "") {
    return "engines.dsh must be a string; without it the host falls back to every @deepseek-ai/dsh* peer";
  }
  if (range.includes("workspace:")) return "engines.dsh must not use a workspace: protocol; it is unmet on an installed profile";
  const parsed = /^>=(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\s+<(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/u.exec(range.trim());
  if (parsed === null) return "engines.dsh must be an explicit >=floor <ceiling pair so the upper bound stays visible, saw " + range;
  if (runtimeVersion === undefined) return undefined;
  if (!(compareSemver(runtimeVersion, parsed[1]) >= 0 && compareSemver(runtimeVersion, parsed[2]) < 0)) {
    return "engines.dsh " + range + " excludes the installed runtime " + runtimeVersion;
  }
  return undefined;
}

function checkCompatibility(pkg, root, runtimeVersion) {
  const problem = engineRangeProblem(pkg.engines && pkg.engines.dsh, runtimeVersion);
  if (problem !== undefined) fail(root, problem);
}

/**
 * A package that declares a runtime floor is making a promise to the host's
 * compatibility gate whether or not it is offered to an index. The publishable
 * checks above only cover PUBLISHABLE, so every other package gets this one
 * assertion without any of the market-surface requirements.
 */
function checkDeclaredEngines(pkg, root, runtimeVersion) {
  const range = pkg.engines && pkg.engines.dsh;
  if (range === undefined) return;
  const problem = engineRangeProblem(range, runtimeVersion);
  if (problem !== undefined) fail(root, problem);
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

/**
 * The runtime that actually serves this checkout is the desktop app, not the
 * global CLI. On this machine the CLI reported 0.2.1-rc.5 while the app ran
 * 0.2.2-rc.1, so a gate built on `dsh --version` passed without testing the
 * version in use. Read the desktop bundle first, and keep the CLI as the last
 * resort so the script still works on a machine without the app installed.
 */
function asVersion(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return EXACT_SEMVER.test(trimmed) ? trimmed : undefined;
}

/**
 * An asar starts with [pickle][header size][json size][json][padding][data].
 * The documented offsets are enough to slice one file out without unpacking
 * the archive: jsonSize at byte 12, JSON at 16, payload at 8 + headerSize.
 * Every step validates its bounds because a corrupt or truncated archive must
 * fall through to the next oracle, not crash the check.
 */
function parseAsarHeader(buffer) {
  if (buffer.length < ASAR_HEADER_BYTES) throw new Error("asar header is truncated");
  const headerSize = buffer.readUInt32LE(4);
  const jsonSize = buffer.readUInt32LE(12);
  if (jsonSize === 0 || jsonSize > MAX_ASAR_HEADER_BYTES) throw new Error("asar header size is out of range");
  if (ASAR_HEADER_BYTES + jsonSize > buffer.length) throw new Error("asar header is truncated");
  if (8 + headerSize < ASAR_HEADER_BYTES + jsonSize) throw new Error("asar header offsets are inconsistent");
  let header;
  try {
    header = JSON.parse(buffer.subarray(ASAR_HEADER_BYTES, ASAR_HEADER_BYTES + jsonSize).toString("utf8"));
  } catch {
    throw new Error("asar header is not JSON");
  }
  if (header === null || typeof header !== "object" || header.files === null || typeof header.files !== "object") {
    throw new Error("asar header has no files tree");
  }
  return { header, dataStart: 8 + headerSize };
}

function asarEntry(header, entryPath) {
  let node = header;
  for (const segment of entryPath.split("/")) {
    if (segment === "") continue;
    if (node === null || typeof node !== "object" || node.files === null || typeof node.files !== "object") {
      throw new Error("asar path not found: " + entryPath);
    }
    node = node.files[segment];
  }
  if (node === null || typeof node !== "object" || node.files !== undefined) throw new Error("asar entry is not a file: " + entryPath);
  if (node.unpacked === true) throw new Error("asar entry is unpacked: " + entryPath);
  const offset = Number(node.offset);
  const size = Number(node.size);
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(size) || size < 0) {
    throw new Error("asar entry has no usable offset/size: " + entryPath);
  }
  return { offset, size };
}

/** Pure half of the asar reader; `--selftest` exercises it on a synthetic archive. */
function readAsarEntryFromBuffer(buffer, entryPath) {
  const { header, dataStart } = parseAsarHeader(buffer);
  const { offset, size } = asarEntry(header, entryPath);
  if (dataStart + offset + size > buffer.length) throw new Error("asar entry runs past the archive: " + entryPath);
  return buffer.subarray(dataStart + offset, dataStart + offset + size);
}

/** Read one entry with two bounded reads: the header, then the requested slice. */
function readAsarEntryFromFile(asarPath, entryPath) {
  const total = statSync(asarPath).size;
  const fd = openSync(asarPath, "r");
  try {
    const head = Buffer.alloc(ASAR_HEADER_BYTES);
    if (readSync(fd, head, 0, ASAR_HEADER_BYTES, 0) !== ASAR_HEADER_BYTES) throw new Error("asar header is truncated");
    const jsonSize = head.readUInt32LE(12);
    if (jsonSize === 0 || jsonSize > MAX_ASAR_HEADER_BYTES || ASAR_HEADER_BYTES + jsonSize > total) {
      throw new Error("asar header size is out of range");
    }
    const headerBytes = Buffer.alloc(ASAR_HEADER_BYTES + jsonSize);
    head.copy(headerBytes, 0);
    if (readSync(fd, headerBytes, ASAR_HEADER_BYTES, jsonSize, ASAR_HEADER_BYTES) !== jsonSize) {
      throw new Error("asar header is truncated");
    }
    const { header, dataStart } = parseAsarHeader(headerBytes);
    const { offset, size } = asarEntry(header, entryPath);
    if (dataStart + offset + size > total) throw new Error("asar entry runs past the archive: " + entryPath);
    const content = Buffer.alloc(size);
    if (size > 0 && readSync(fd, content, 0, size, dataStart + offset) !== size) {
      throw new Error("asar entry is truncated: " + entryPath);
    }
    return content;
  } finally {
    closeSync(fd);
  }
}

function desktopRuntimeVersionFromAsar(asarPath) {
  const pkg = JSON.parse(readAsarEntryFromFile(asarPath, "dsh/package.json").toString("utf8"));
  return asVersion(pkg && pkg.version);
}

function plistVersion(xml) {
  const match = /<key>\s*CFBundleShortVersionString\s*<\/key>\s*<string>([^<]*)<\/string>/u.exec(xml);
  return match === null ? undefined : asVersion(match[1]);
}

function desktopRuntimeVersionFromPlist(plistPath) {
  const version = plistVersion(readFileSync(plistPath, "utf8"));
  if (version !== undefined) return version;
  // A binary plist has no XML to scan; `defaults` is part of macOS.
  if (process.platform !== "darwin") return undefined;
  return asVersion(execFileSync("defaults", ["read", plistPath, "CFBundleShortVersionString"], { stdio: "pipe" }).toString());
}

function cliRuntimeVersion() {
  const parts = execFileSync("dsh", ["--version"], { stdio: "pipe" }).toString().trim().split(/\s+/u);
  return asVersion(parts[parts.length - 1]);
}

function runtimeVersionProbes(env) {
  const app = typeof env.DSH_DESKTOP_APP === "string" && env.DSH_DESKTOP_APP.trim() !== "" ? env.DSH_DESKTOP_APP : DEFAULT_DESKTOP_APP;
  const asarPath = join(app, "Contents", "Resources", "app.asar");
  const plistPath = join(app, "Contents", "Info.plist");
  return [
    { id: "env", describe: (version) => "runtime " + version + " (DSH_RUNTIME_VERSION)", read: () => env.DSH_RUNTIME_VERSION },
    { id: "asar", describe: (version) => "desktop runtime " + version + " (asar)", read: () => desktopRuntimeVersionFromAsar(asarPath) },
    { id: "plist", describe: (version) => "desktop runtime " + version + " (Info.plist)", read: () => desktopRuntimeVersionFromPlist(plistPath) },
    { id: "cli", describe: (version) => "dsh " + version + " (dsh --version)", read: () => cliRuntimeVersion() },
  ];
}

/** First probe that yields a usable version wins; each failure is just a skip. */
function firstVersion(probes) {
  for (const probe of probes) {
    let value;
    try {
      value = probe.read();
    } catch {
      continue;
    }
    const version = asVersion(value);
    if (version !== undefined) return { version, source: probe.id, description: probe.describe(version) };
  }
  return undefined;
}

function resolveRuntimeVersion(env = process.env) {
  return firstVersion(runtimeVersionProbes(env));
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

/**
 * The engine cases pin behaviour that the real gate depends on: the desktop
 * runtime is a prerelease, the global CLI is an older prerelease, and a range
 * raised to 0.2.2 has to reject that CLI.
 */
const ENGINE_CASES = [
  [">=0.2.1-rc.3 <0.3.0-0", "0.2.2-rc.1", undefined, "desktop runtime satisfies the repo floor"],
  [">=0.2.1-rc.3 <0.3.0-0", "0.2.1-rc.5", undefined, "older prerelease is still inside the range"],
  [">=0.2.2-rc.1 <0.3.0-0", "0.2.1-rc.5", "excludes", "a raised floor rejects the global CLI"],
  [">=0.2.1-rc.3 <0.3.0-0", "0.3.0-0", "excludes", "the ceiling is exclusive"],
  [">=0.2.1-rc.3", "0.2.2-rc.1", "explicit", "an open-ended range is rejected"],
  ["workspace:*", "0.2.2-rc.1", "workspace:", "the workspace protocol is rejected"],
  [">=0.2.1-rc.3 <0.3.0-0", undefined, undefined, "shape checks still run without a runtime"],
];

/** Build a minimal asar with one padding byte pair, mirroring the real layout. */
function fakeAsar(entries) {
  const tree = { files: {} };
  const contents = [];
  let offset = 0;
  for (const [entryPath, text] of Object.entries(entries)) {
    const segments = entryPath.split("/");
    let node = tree;
    for (const segment of segments.slice(0, -1)) {
      if (node.files[segment] === undefined) node.files[segment] = { files: {} };
      node = node.files[segment];
    }
    const content = Buffer.from(text, "utf8");
    node.files[segments[segments.length - 1]] = { size: content.length, offset: String(offset) };
    contents.push(content);
    offset += content.length;
  }
  const json = JSON.stringify(tree);
  const jsonSize = Buffer.byteLength(json);
  const headerSize = jsonSize + 10;
  const dataStart = 8 + headerSize;
  const buffer = Buffer.alloc(dataStart + offset);
  buffer.writeUInt32LE(4, 0);
  buffer.writeUInt32LE(headerSize, 4);
  buffer.writeUInt32LE(headerSize - 4, 8);
  buffer.writeUInt32LE(jsonSize, 12);
  buffer.write(json, 16, "utf8");
  let cursor = dataStart;
  for (const content of contents) {
    content.copy(buffer, cursor);
    cursor += content.length;
  }
  return buffer;
}

function selftest() {
  let total = 0;
  let failures = 0;
  const check = (condition, label) => {
    total += 1;
    if (!condition) {
      failures += 1;
      console.error("FAIL " + label);
    }
  };
  const throws = (fn, label) => {
    total += 1;
    try {
      fn();
      failures += 1;
      console.error("FAIL " + label + " (did not throw)");
    } catch {
      // expected
    }
  };

  for (const [a, b, expected, note] of SEMVER_CASES) {
    check(Math.sign(compareSemver(a, b)) === expected, a + " vs " + b + ": want " + expected + " (" + note + ")");
  }

  for (const [range, runtime, needle, note] of ENGINE_CASES) {
    const problem = engineRangeProblem(range, runtime);
    const ok = needle === undefined ? problem === undefined : typeof problem === "string" && problem.includes(needle);
    check(ok, "engines " + range + " @ " + String(runtime) + " (" + note + ") saw " + String(problem));
  }

  const asar = fakeAsar({
    "dsh/package.json": JSON.stringify({ name: "@deepseek-ai/dsh-desktop-runtime", version: "0.2.2-rc.1" }),
    "dsh/other.txt": "payload",
  });
  const manifest = JSON.parse(readAsarEntryFromBuffer(asar, "dsh/package.json").toString("utf8"));
  check(manifest.version === "0.2.2-rc.1", "asar slice reads the target file at its own offset");
  check(readAsarEntryFromBuffer(asar, "dsh/other.txt").toString("utf8") === "payload", "asar slice honours the second file offset");
  check(plistVersion("<key>CFBundleShortVersionString</key><string>0.2.2-rc.1</string>") === "0.2.2-rc.1", "plist version is extracted from XML");
  check(plistVersion("<key>CFBundleShortVersionString</key><string>not-a-version</string>") === undefined, "a malformed plist version is ignored");
  throws(() => parseAsarHeader(Buffer.alloc(8)), "a truncated asar header is rejected");
  throws(() => readAsarEntryFromBuffer(asar, "dsh/missing.json"), "a missing asar entry is rejected");
  throws(() => readAsarEntryFromBuffer(asar, "dsh"), "a directory is not accepted as a file entry");
  const corrupt = Buffer.from(asar);
  corrupt.writeUInt32LE(corrupt.length + 1, 12);
  throws(() => parseAsarHeader(corrupt), "an out-of-range asar json size is rejected");

  const picked = firstVersion([
    { id: "env", describe: (version) => "env " + version, read: () => "0.2.2-rc.1" },
    { id: "asar", describe: (version) => "asar " + version, read: () => "0.1.0" },
  ]);
  check(picked !== undefined && picked.version === "0.2.2-rc.1" && picked.source === "env", "the environment override outranks the asar");
  const skipped = firstVersion([
    { id: "bad", describe: (version) => version, read: () => "latest" },
    { id: "boom", describe: (version) => version, read: () => { throw new Error("unreadable"); } },
    { id: "plist", describe: (version) => "plist " + version, read: () => "0.2.1-rc.5" },
  ]);
  check(skipped !== undefined && skipped.version === "0.2.1-rc.5" && skipped.source === "plist", "invalid and throwing probes fall through");
  check(firstVersion([{ id: "none", describe: (version) => version, read: () => undefined }]) === undefined, "no probe leaves the version undefined");

  const tmp = mkdtempSync(join(tmpdir(), "dsh-check-market-"));
  try {
    const file = join(tmp, "app.asar");
    writeFileSync(file, asar);
    const fromFile = JSON.parse(readAsarEntryFromFile(file, "dsh/package.json").toString("utf8"));
    check(fromFile.version === "0.2.2-rc.1", "the file reader slices the same bytes with bounded reads");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  if (failures > 0) {
    console.error("selftest failed (" + failures + " of " + total + ")");
    process.exit(1);
  }
  console.log("selftest passed (" + total + " cases)");
}

if (process.argv.includes("--selftest")) {
  selftest();
  process.exit(0);
}

const requested = process.argv.slice(2).filter((argument) => !argument.startsWith("-"));
const targets = requested.length > 0 ? requested : PUBLISHABLE;
const runtime = resolveRuntimeVersion();
const runtimeVersion = runtime === undefined ? undefined : runtime.version;
if (runtimeVersion === undefined) {
  console.warn("warning: no runtime version found (DSH_RUNTIME_VERSION, desktop asar, Info.plist and dsh --version all failed), skipping the runtime compatibility check");
} else {
  console.log("runtime: " + runtime.description);
  if (runtime.source === "cli") console.warn("warning: no desktop runtime found, the gate is checking the global CLI instead of the app that serves this checkout; set DSH_DESKTOP_APP if the app lives elsewhere");
}

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

// Every package that declares a runtime floor is a promise to the host's
// compatibility gate, whether or not it is offered to an index. The targeted
// loop above only applies the publishable-surface checks to market packages,
// so the rest of the workspace gets the range assertion on its own.
for (const name of readdirSync(join(repoRoot, "packages")).sort()) {
  if (targets.includes(name)) continue;
  const root = join(repoRoot, "packages", name);
  if (!existsSync(join(root, "package.json"))) continue;
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  } catch {
    fail(root, "package.json is not valid JSON");
    continue;
  }
  checkDeclaredEngines(pkg, root, runtimeVersion);
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
  console.log("market manifest check passed for " + targets.join(", ") + (runtimeVersion === undefined ? "" : " against " + runtime.description));
}
