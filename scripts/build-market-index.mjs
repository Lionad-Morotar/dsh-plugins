#!/usr/bin/env node
/**
 * Build the format-1 market index from the packages themselves.
 *
 * Every field below is derived rather than typed, because an index entry is a
 * claim about an install and a hand-written claim drifts the moment a version
 * bumps. The output is then re-parsed with the host's own validator, so a
 * successful run is a positive test, not a formatted file.
 *
 *   node scripts/build-market-index.mjs                 # npm sources, exact versions
 *   node scripts/build-market-index.mjs --source git    # git sources pinned at HEAD
 *   node scripts/build-market-index.mjs --check         # validate the committed file, write nothing
 *
 * `--check` validates market/index.json as it sits on disk, not the object this
 * run happened to build. A check that only ever inspects its own output says
 * nothing about the file that is actually served, so it also fails when the
 * committed file and a fresh build disagree.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const OUTPUT = join(repoRoot, "market", "index.json");
/** The URL the index is meant to be served from; relative icon references resolve against it. */
const INDEX_URL = "https://raw.githubusercontent.com/Lionad-Morotar/dsh-plugins/main/market/index.json";

/**
 * Packages the index offers. Only dsh-jump ships for now; the other two are
 * still being validated in daily use and stay out until they are not.
 */
const PUBLISHABLE = [
  { directory: "dsh-jump", category: "ui", keywords: ["keyboard", "navigation", "accessibility", "vimium"], labels: ["keyboard"] },
];

const CATEGORIES = {
  ui: { title: { en: "Interface", zh: "界面" } },
  tools: { title: { en: "Tools", zh: "工具" } },
};
/**
 * Labels an entry can carry. Every one of these is a claim a reader acts on, so
 * none of them may be assigned to every package by default. `official` in
 * particular means DeepSeek shipped it; a third-party plugin wearing it would be
 * misattributed, and the format-1 parser only checks the shape of this field, so
 * nothing downstream would catch it.
 */
const LABELS = {
  keyboard: { title: { en: "Keyboard", zh: "键盘" } },
};

const args = process.argv.slice(2);
// npm is the default now that the package is published: the index should point at
// the thing users install, and pinning a commit made every package edit require a
// regeneration cycle. Pass --source git only to preview a release that has not
// reached the registry yet.
const sourceMode = args.includes("--source") ? args[args.indexOf("--source") + 1] : "npm";
const checkOnly = args.includes("--check");
if (sourceMode !== "git" && sourceMode !== "npm") {
  console.error("error: --source must be git or npm");
  process.exit(1);
}

const headCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, stdio: "pipe" }).toString().trim();
if (!/^[0-9a-f]{40}$/u.test(headCommit)) throw new Error("HEAD is not a 40-hex commit");
const publishTimestamp = Number(execFileSync("git", ["log", "-1", "--format=%ct", "HEAD"], { cwd: repoRoot, stdio: "pipe" }).toString().trim());

/** Inline the icon so the index stays self-contained; format 1 admits up to 32 KiB decoded. */
function inlineIcon(packageRoot, relative) {
  const bytes = readFileSync(join(packageRoot, relative));
  if (bytes.length > 32 * 1024) throw new Error(relative + " exceeds the 32 KiB inline budget");
  const mediaType = relative.endsWith(".svg") ? "image/svg+xml" : relative.endsWith(".png") ? "image/png" : "image/webp";
  return "data:" + mediaType + ";base64," + bytes.toString("base64");
}

function localized(en, zh) {
  return { en, zh };
}

/**
 * Read the registry's own publish time for one version, in Unix seconds.
 *
 * The index renders this as "published X ago" next to the entry, so it has to be
 * the moment the version reached the registry. Failing loudly beats emitting a
 * timestamp from the wrong clock.
 */
function npmPublishTimestamp(name, version) {
  // `npm view <name> time.<version>` yields nothing for a nested field, so read the
  // whole time map and pick the version out of it.
  const raw = execFileSync("npm", ["view", name, "time", "--registry", "https://registry.npmjs.org", "--json"], { cwd: repoRoot, stdio: "pipe" }).toString().trim();
  const times = JSON.parse(raw);
  const iso = times[version];
  if (typeof iso !== "string") throw new Error("registry has no publish time for " + name + "@" + version + "; publish before building an npm-sourced index");
  const seconds = Math.floor(Date.parse(iso) / 1000);
  if (!Number.isInteger(seconds)) throw new Error("could not parse publish time for " + name + "@" + version + ": " + iso);
  return seconds;
}

function entryFor({ directory, category, keywords, labels }) {
  const packageRoot = join(repoRoot, "packages", directory);
  const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
  const en = JSON.parse(readFileSync(join(packageRoot, "locale", "en.json"), "utf8"));
  const zh = JSON.parse(readFileSync(join(packageRoot, "locale", "zh.json"), "utf8"));
  if (pkg.private !== undefined) throw new Error(directory + " is still private");
  if (pkg.engines?.dsh === undefined) throw new Error(directory + " has no engines.dsh");
  const iconRelative = (pkg.icon ?? pkg.exports?.["./icon"] ?? "").replace(/^\.\//u, "");
  if (iconRelative === "" || !existsSync(join(packageRoot, iconRelative))) throw new Error(directory + " declares no readable icon");
  // The declared set is the whole set: a label nobody listed in LABELS would be
  // dropped by a strict reader, and a label outside this list is a claim the
  // index did not decide to make.
  for (const label of labels ?? []) {
    if (LABELS[label] === undefined) throw new Error(directory + " asks for label \"" + label + "\" which LABELS does not declare");
  }
  // Coordinates come from the package, not from this monorepo: a package that
  // lives in a repository of its own (as a submodule here) must be described by
  // its own URL, or the index would promise an install from the wrong place.
  const repoUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  const slug = typeof repoUrl === "string" ? /github\.com[/:]([^/]+)\/([^/#.]+?)(?:\.git)?(?:#.*)?$/u.exec(repoUrl.trim()) : null;
  if (slug === null) throw new Error(directory + " declares no github.com/owner/repo in repository.url");
  const repositoryUrl = "https://github.com/" + slug[1] + "/" + slug[2];
  const repositoryDirectory = pkg.repository?.directory;
  const source = sourceMode === "npm"
    ? { type: "npm" }
    : { type: "git", url: repositoryUrl, commit: headCommit, ...(repositoryDirectory === undefined ? {} : { path: repositoryDirectory }) };
  // In npm mode the version's publish time is whatever the registry recorded, not
  // whenever this checkout happened to commit. A git timestamp here would be a
  // plausible-looking lie: the field means "when did this version reach users".
  const versionTimestamp = sourceMode === "npm" ? npmPublishTimestamp(pkg.name, pkg.version) : publishTimestamp;
  return {
    name: pkg.name,
    title: localized(en.meta.title, zh.meta.title),
    description: localized(en.meta.description, zh.meta.description),
    icon: inlineIcon(packageRoot, iconRelative),
    author: pkg.author,
    homepage: pkg.homepage,
    repository: { url: repositoryUrl, ...(repositoryDirectory === undefined ? {} : { directory: repositoryDirectory }) },
    metadata: { category, keywords, labels: labels ?? [], sortKeys: {} },
    versions: [
      {
        version: pkg.version,
        publishTimestamp: versionTimestamp,
        source,
        engines: { dsh: pkg.engines.dsh },
      },
    ],
  };
}

const index = {
  format: 1,
  title: localized("Lionad's DSH plugins", "Lionad 的 DSH 插件"),
  description: localized(
    "Plugins for the DeepSeek Harness: jump navigation, keybinding fixes, and slash commands.",
    "给 DeepSeek Harness 的插件：跳跃导航、按键修正与 slash 命令。",
  ),
  metadata: { categories: CATEGORIES, labels: LABELS, sortKeys: {} },
  plugins: PUBLISHABLE.map(entryFor),
};

/**
 * The host's own parser, as a hard requirement.
 *
 * This used to degrade to a warning, which made a green run mean "the index was
 * written" rather than "the index parses". A validator that silently steps
 * aside turns the whole positive-test premise of this script into decoration,
 * so a missing validator is a failure now.
 */
let validator;
try {
  validator = await import("@deepseek-ai/dsh-plugin-market-index");
} catch (error) {
  console.error("error: cannot load @deepseek-ai/dsh-plugin-market-index, so the index cannot be validated");
  console.error("  install dependencies first: pnpm install");
  console.error("  cause: " + (error instanceof Error ? error.message : String(error)));
  process.exit(1);
}

/** Parse an index with the host validator and print the install spec of each entry. */
function validate(candidate, label) {
  let parsed;
  try {
    parsed = validator.parseMarketIndex(candidate, INDEX_URL);
  } catch (error) {
    console.error("error: " + label + " is not a valid format-1 index");
    console.error("  " + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
  const specs = parsed.plugins.map((plugin) => {
    const target = validator.marketInstallTarget(plugin.name, plugin.versions[0]);
    return plugin.name + " -> " + target.spec;
  });
  return specs;
}

if (checkOnly) {
  // Validate what is on disk. The object built above is only a reference to
  // diff against, so a stale or hand-edited file cannot ride on a green build.
  if (!existsSync(OUTPUT)) {
    console.error("error: " + relative(repoRoot, OUTPUT) + " does not exist; run without --check to create it");
    process.exit(1);
  }
  let committed;
  try {
    committed = JSON.parse(readFileSync(OUTPUT, "utf8"));
  } catch (error) {
    console.error("error: " + relative(repoRoot, OUTPUT) + " is not valid JSON");
    console.error("  " + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
  for (const spec of validate(committed, relative(repoRoot, OUTPUT))) console.log("  " + spec);

  const fresh = JSON.stringify(index, null, 2) + "\n";
  const onDisk = JSON.stringify(committed, null, 2) + "\n";
  if (fresh !== onDisk) {
    console.error("error: " + relative(repoRoot, OUTPUT) + " is out of date with the packages");
    console.error("  run: node scripts/build-market-index.mjs");
    process.exit(1);
  }
  console.log("check only, nothing written");
} else {
  for (const spec of validate(index, "the index about to be written")) console.log("  " + spec);
  writeFileSync(OUTPUT, JSON.stringify(index, null, 2) + "\n");
  console.log("wrote " + relative(repoRoot, OUTPUT));
}
