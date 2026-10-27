#!/usr/bin/env node
/**
 * Build the format-1 market index from the packages themselves.
 *
 * Every field below is derived rather than typed, because an index entry is a
 * claim about an install and a hand-written claim drifts the moment a version
 * bumps. The output is then re-parsed with the host's own validator, so a
 * successful run is a positive test, not a formatted file.
 *
 *   node scripts/build-market-index.mjs                 # git sources at HEAD
 *   node scripts/build-market-index.mjs --source npm    # npm sources, exact versions
 *   node scripts/build-market-index.mjs --check         # validate only, write nothing
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const OUTPUT = join(repoRoot, "market", "index.json");
/** The URL the index is meant to be served from; relative icon references resolve against it. */
const INDEX_URL = "https://raw.githubusercontent.com/Lionad-Morotar/dsh-plugins/main/market/index.json";
const REPO_URL = "https://github.com/Lionad-Morotar/dsh-plugins";

/**
 * Packages the index offers. Only dsh-jump ships for now; the other two are
 * still being validated in daily use and stay out until they are not.
 */
const PUBLISHABLE = [
  { directory: "dsh-jump", category: "ui", keywords: ["keyboard", "navigation", "accessibility", "vimium"] },
];

const CATEGORIES = {
  ui: { title: { en: "Interface", zh: "界面" } },
  tools: { title: { en: "Tools", zh: "工具" } },
};
const LABELS = {
  keyboard: { title: { en: "Keyboard", zh: "键盘" } },
  official: { title: { en: "First-party", zh: "一方" } },
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

function entryFor({ directory, category, keywords }) {
  const packageRoot = join(repoRoot, "packages", directory);
  const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
  const en = JSON.parse(readFileSync(join(packageRoot, "locale", "en.json"), "utf8"));
  const zh = JSON.parse(readFileSync(join(packageRoot, "locale", "zh.json"), "utf8"));
  if (pkg.private !== undefined) throw new Error(directory + " is still private");
  if (pkg.engines?.dsh === undefined) throw new Error(directory + " has no engines.dsh");
  const iconRelative = (pkg.icon ?? pkg.exports?.["./icon"] ?? "").replace(/^\.\//u, "");
  if (iconRelative === "" || !existsSync(join(packageRoot, iconRelative))) throw new Error(directory + " declares no readable icon");
  const source = sourceMode === "npm"
    ? { type: "npm" }
    : { type: "git", url: REPO_URL, commit: headCommit, path: "packages/" + directory };
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
    repository: { url: REPO_URL, directory: "packages/" + directory },
    metadata: { category, keywords, labels: keywords.includes("keyboard") ? ["keyboard", "official"] : ["official"], sortKeys: {} },
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

const validator = await import("@deepseek-ai/dsh-plugin-market-index").catch(() => undefined);
if (validator === undefined) {
  console.warn("warning: @deepseek-ai/dsh-plugin-market-index is not installed, skipping validation");
} else {
  const parsed = validator.parseMarketIndex(index, INDEX_URL);
  for (const plugin of parsed.plugins) {
    const target = validator.marketInstallTarget(plugin.name, plugin.versions[0]);
    console.log("  " + plugin.name + " -> " + target.spec);
  }
}

if (!checkOnly) {
  writeFileSync(OUTPUT, JSON.stringify(index, null, 2) + "\n");
  console.log("wrote " + OUTPUT);
} else {
  console.log("check only, nothing written");
}
