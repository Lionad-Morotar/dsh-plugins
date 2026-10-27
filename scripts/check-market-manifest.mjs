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

/** Packages offered to an index; pure logic layers are not entries. */
const PUBLISHABLE = ["dsh-jump", "dsh-better-keybindings", "dsh-slash-commands"];
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
  if (typeof repo === "object" && repo !== null && repo.directory !== "packages/" + pkg.name) {
    fail(root, "repository.directory must be packages/" + pkg.name + " in this monorepo, saw " + JSON.stringify(repo.directory));
  }
  if (typeof pkg.homepage !== "string" || !pkg.homepage.startsWith("https://")) fail(root, "homepage must be an https URL");
  if (!Array.isArray(pkg.keywords) || pkg.keywords.length === 0) fail(root, "keywords must be a non-empty array");
  else if (!pkg.keywords.includes("dsh-plugin")) fail(root, "keywords must include \"dsh-plugin\"");
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
  const core = (v) => v.split("-")[0].split(".").map(Number);
  const cmp = (a, b) => {
    const pa = core(a), pb = core(b);
    for (let i = 0; i < 3; i += 1) if (pa[i] !== pb[i]) return pa[i] - pb[i];
    return 0;
  };
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
  } catch {
    return;
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

if (errors.length > 0) {
  console.error("market manifest check failed (" + errors.length + "):");
  for (const error of errors) console.error("  - " + error);
  process.exitCode = 1;
} else {
  console.log("market manifest check passed for " + targets.join(", ") + (runtimeVersion === undefined ? "" : " against dsh " + runtimeVersion));
}
