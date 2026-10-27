#!/usr/bin/env node
/**
 * Build and validate the awesome-dsh-plugin entry for one package.
 *
 * The catalog validates entries with its own scripts/lib/entries.mjs, so this
 * script re-implements nothing: it writes the YAML from the package's own
 * metadata, then hands the result to that validator when a checkout is
 * available. An entry that fails here would fail CI.
 *
 *   node scripts/build-awesome-entry.mjs dsh-jump            # write the entry
 *   node scripts/build-awesome-entry.mjs dsh-jump --check    # validate only
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const OWNER = "Lionad-Morotar";
const REPO = "dsh-plugins";
/** awesome-dsh-plugin is a separate project; point at a checkout to run its validator. */
const CATALOG_ROOT = process.env.AWESOME_DSH_PLUGIN_ROOT ?? "/tmp/awesome-check";

/** Keyboard navigation and keybinding fixes are interface work; command surfacing is tooling. */
const CATEGORY = { "dsh-jump": "ui", "dsh-better-keybindings": "ui", "dsh-slash-commands": "tools" };

const args = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
const checkOnly = process.argv.includes("--check");
const name = args[0];
if (name === undefined) {
  console.error("usage: node scripts/build-awesome-entry.mjs <package-name> [--check]");
  process.exit(1);
}
const packageRoot = join(repoRoot, "packages", name);
if (!existsSync(join(packageRoot, "package.json"))) {
  console.error("error: packages/" + name + " has no package.json");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
const en = JSON.parse(readFileSync(join(packageRoot, "locale", "en.json"), "utf8")).meta;
const zh = JSON.parse(readFileSync(join(packageRoot, "locale", "zh.json"), "utf8")).meta;
if (pkg.private !== undefined) throw new Error(name + " is private; a catalog entry would promise an install that cannot happen");

/** The catalog folds the URL into a filename: owner__repo--sub-dir. */
const url = "https://github.com/" + OWNER + "/" + REPO + "/tree/main/packages/" + name;
const fileName = OWNER + "__" + REPO + "--packages-" + name + ".yml";
const iconUrl = "https://raw.githubusercontent.com/" + OWNER + "/" + REPO + "/main/packages/" + name + "/assets/icon-180.png";

if (!existsSync(join(packageRoot, "assets", "icon-180.png"))) {
  console.error("error: " + name + " has no assets/icon-180.png; the catalog rejects SVG and needs a GitHub-hosted raster");
  process.exit(1);
}

/** YAML single-quoted scalars: escape the one character that ends the string. */
const quote = (value) => "'" + value.replaceAll("'", "''") + "'";

const entry = [
  "url: " + url,
  "name: " + OWNER + "/" + REPO + "#" + name,
  "category: " + (CATEGORY[name] ?? "ui"),
  "icon: " + iconUrl,
  "description:",
  "  en: " + quote(en.description),
  "  zh: " + quote(zh.description),
].join("\n") + "\n";

if (checkOnly) {
  process.stdout.write(entry);
} else {
  const outDir = join(repoRoot, "market", "awesome");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, fileName), entry);
  console.log("wrote market/awesome/" + fileName);
}

// Validate with the catalog's own rules when its checkout is present.
if (existsSync(join(CATALOG_ROOT, "scripts", "lib", "entries.mjs"))) {
  const { validateEntries } = await import(join(CATALOG_ROOT, "scripts", "lib", "entries.mjs"));
  const { default: YAML } = await import("js-yaml").catch(() => ({ default: undefined }));
  if (YAML === undefined) {
    console.warn("warning: js-yaml is unavailable, skipping the catalog shape validation");
  } else {
    const parsed = YAML.load(entry);
    const problems = validateEntries([{ ...parsed, file: "data/plugins/" + fileName }]);
    if (problems.length > 0) {
      console.error("catalog validation failed:");
      for (const problem of problems) console.error("  - " + problem);
      process.exitCode = 1;
    } else {
      console.log("catalog validation passed for " + fileName);
    }
  }
} else {
  console.warn("warning: no awesome-dsh-plugin checkout at " + CATALOG_ROOT + ", skipping the catalog shape validation");
}
