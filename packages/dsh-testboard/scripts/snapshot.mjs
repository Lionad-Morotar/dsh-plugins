/**
 * Generate the board's data snapshot from this repository's own test files.
 *
 * The board ships as a static prototype, so its data is a committed artifact
 * rather than a live read. That makes determinism the whole contract: the same
 * corpus must produce the same bytes on every machine, or every regeneration
 * shows up as a diff nobody can review. Nothing here may read the clock, the
 * absolute path of the checkout, or a random number.
 *
 *   node scripts/snapshot.mjs           rewrite src/client/data/snapshot.json
 *   node scripts/snapshot.mjs --check   regenerate and compare, exit 1 on drift
 *
 * Statuses and durations are synthetic and labelled as such (`statusSource`):
 * this prototype does not run the suites, it only needs a realistic board.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Repository root: `scripts/` -> package -> `packages/` -> root. */
const REPO_ROOT = resolve(here, "../../..");

/** Where the generated snapshot is committed. */
const SNAPSHOT_PATH = join(here, "..", "src", "client", "data", "snapshot.json");

/** Bumped when the shape changes, so a stale committed file is obvious. */
const SNAPSHOT_VERSION = 1;

/**
 * Share of cases reported as failed.
 *
 * The board exists to make failures legible, so the red state has to appear at
 * a glance; it must also stay rare enough that "failed" still means something.
 * 0.7% of ~4000 cases is ~28 rows, which fills a filtered view without turning
 * the default view red.
 */
const FAILED_SHARE = 0.007;

/** Share of cases reported as skipped, a little above the failed rate. */
const SKIPPED_SHARE = 0.012;

/** Duration band for a synthetic case, in milliseconds. */
const DURATION_MIN_MS = 1;
const DURATION_MAX_MS = 1200;

/** Directories under `test/` that hold support code, not suites. */
const SKIPPED_DIRECTORIES = new Set(["node_modules", "fixtures", "support", "helpers"]);

/**
 * A case call opening: `it(`, `test(`, and the modified forms.
 *
 * The lookbehind rejects a receiver, so a regex or method call that merely ends
 * in `.test(` is not mistaken for a case.
 */
const CASE_CALL = /(?<![\w$.])(?:it|test)(?:\.(?:only|skip|todo|concurrent|fails|sequential|each))*\s*\(/gu;

/**
 * Decode the escapes a test title can carry.
 *
 * Titles are read from source text, not evaluated, so only the escapes that
 * change the rendered string are handled; anything else is left as written.
 * @param raw - the quoted literal's body.
 * @returns the title as it would render.
 */
function unescapeTitle(raw) {
  return raw.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/gu, (_match, escape) => {
    if (escape.startsWith("u{")) return String.fromCodePoint(Number.parseInt(escape.slice(2, -1), 16));
    if (escape.startsWith("u")) return String.fromCharCode(Number.parseInt(escape.slice(1), 16));
    if (escape.startsWith("x")) return String.fromCharCode(Number.parseInt(escape.slice(1), 16));
    if (escape === "n" || escape === "t" || escape === "\n") return " ";
    return escape;
  });
}

/**
 * Skip whitespace and comments forward from `index`.
 * @param source - file text.
 * @param index - start offset.
 * @returns the offset of the next code character.
 */
function skipTrivia(source, index) {
  let cursor = index;
  while (cursor < source.length) {
    const character = source[cursor];
    if (character === " " || character === "\t" || character === "\n" || character === "\r") {
      cursor += 1;
      continue;
    }
    if (character === "/" && source[cursor + 1] === "/") {
      const end = source.indexOf("\n", cursor);
      cursor = end === -1 ? source.length : end + 1;
      continue;
    }
    if (character === "/" && source[cursor + 1] === "*") {
      const end = source.indexOf("*/", cursor);
      cursor = end === -1 ? source.length : end + 2;
      continue;
    }
    return cursor;
  }
  return cursor;
}

/**
 * Read the string literal starting at `index`, if there is one.
 * @param source - file text.
 * @param index - offset of the opening quote.
 * @returns the decoded body, or undefined when the argument is not a literal.
 */
function readStringLiteral(source, index) {
  const quote = source[index];
  if (quote !== '"' && quote !== "'" && quote !== "`") return undefined;
  let cursor = index + 1;
  let raw = "";
  while (cursor < source.length) {
    const character = source[cursor];
    if (character === "\\") {
      raw += character + (source[cursor + 1] ?? "");
      cursor += 2;
      continue;
    }
    if (character === quote) return unescapeTitle(raw).replace(/\s+/gu, " ").trim();
    raw += character;
    cursor += 1;
  }
  return undefined;
}

/**
 * Skip one balanced bracket group starting at `index`.
 *
 * `it.each([...])` puts a table where a plain case puts its title, so the
 * scanner has to step over it to reach the real title in the next argument
 * list. Quote-aware, because a table of strings is full of brackets.
 * @param source - file text.
 * @param index - offset of the opening bracket.
 * @returns the offset just past the matching close, or the input on imbalance.
 */
function skipBalanced(source, index) {
  const open = source[index];
  const close = open === "(" ? ")" : open === "[" ? "]" : open === "{" ? "}" : open === "`" ? "`" : undefined;
  if (close === undefined) return index;
  let depth = 0;
  let cursor = index;
  while (cursor < source.length) {
    const character = source[cursor];
    if (character === "\\") {
      cursor += 2;
      continue;
    }
    if (character === '"' || character === "'") {
      const end = readStringLiteral(source, cursor);
      if (end === undefined) return cursor + 1;
      cursor = source.indexOf(character, cursor + 1);
      cursor = cursor === -1 ? source.length : cursor + 1;
      continue;
    }
    if (character === open) depth += 1;
    else if (character === close) {
      depth -= 1;
      if (depth === 0) return cursor + 1;
    }
    cursor += 1;
  }
  return source.length;
}

/**
 * Extract every case title from one test file's source.
 *
 * Titles are collected in source order, which is also the order the runner
 * reports them in, so the snapshot reads like the suite.
 *
 * A case whose title is not a string literal (a computed name) is skipped: the
 * board cannot render it, and inventing one would put a row on screen that no
 * suite contains.
 * @param source - file text.
 * @returns the titles, in source order.
 */
export function extractCaseTitles(source) {
  const titles = [];
  CASE_CALL.lastIndex = 0;
  for (const match of source.matchAll(CASE_CALL)) {
    let cursor = skipTrivia(source, (match.index ?? 0) + match[0].length);
    // `it.each(table)(title, fn)`: the match already consumed the `(` that
    // opened the table, so step over the table, close that call, then read the
    // title from the argument list that follows.
    if (match[0].includes(".each")) {
      cursor = skipTrivia(source, skipBalanced(source, cursor));
      if (source[cursor] === ")") cursor = skipTrivia(source, cursor + 1);
      if (source[cursor] !== "(") continue;
      cursor = skipTrivia(source, cursor + 1);
    }
    const title = readStringLiteral(source, cursor);
    if (title !== undefined && title.length > 0) titles.push(title);
  }
  return titles;
}

/**
 * A 32-bit FNV-1a hash.
 *
 * Small, stable across platforms and dependency-free: the snapshot must hash
 * identically on every machine that regenerates it.
 * @param text - the seed string.
 * @returns an unsigned 32-bit integer.
 */
function hash32(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Derive a case's synthetic status and duration from its identity.
 *
 * Seeded by `path + name` so a case keeps the same reading across regenerations
 * and machines; a case that moves between files legitimately changes, which is
 * what a real run would do too.
 * @param path - repo-relative test file path.
 * @param name - case title.
 * @returns the synthetic reading.
 */
function synthesize(path, name) {
  const seed = hash32(`${path}\u0000${name}`);
  // Two independent draws from one hash: the high half picks the status, the
  // low half the duration, so a slow case is not also always a failed one.
  const statusDraw = (seed >>> 16) / 0x10000;
  const durationDraw = (seed & 0xffff) / 0x10000;
  const status = statusDraw < FAILED_SHARE ? "failed" : statusDraw < FAILED_SHARE + SKIPPED_SHARE ? "skipped" : "passed";
  const durationMs = DURATION_MIN_MS + Math.round(durationDraw * (DURATION_MAX_MS - DURATION_MIN_MS));
  return { status, durationMs };
}

/**
 * List every test file under `packages/`, repo-relative and sorted.
 *
 * The walk is the single source for both generate and `--check`, so the two can
 * never disagree about which files exist.
 * @returns repo-relative paths using forward slashes.
 */
function listTestFiles() {
  const packagesRoot = join(REPO_ROOT, "packages");
  const found = [];
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (!/\.test\.tsx?$/u.test(entry.name)) continue;
      found.push(relative(REPO_ROOT, absolute).split(sep).join("/"));
    }
  };
  for (const entry of readdirSync(packagesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const testRoot = join(packagesRoot, entry.name, "test");
    try {
      if (!statSync(testRoot).isDirectory()) continue;
    } catch {
      continue;
    }
    walk(testRoot);
  }
  return found.sort();
}

/**
 * Build the snapshot from the current corpus.
 *
 * Files whose source yields no title are kept with an empty case list rather
 * than dropped: a file that stops parsing should be visible on the board, not
 * silently absent from it.
 * @returns the snapshot object.
 */
export function buildSnapshot() {
  const byPackage = new Map();
  for (const path of listTestFiles()) {
    const packageName = path.split("/")[1] ?? "";
    const source = readFileSync(join(REPO_ROOT, path), "utf8");
    const cases = extractCaseTitles(source).map(name => ({ path, name, ...synthesize(path, name) }));
    const files = byPackage.get(packageName) ?? [];
    files.push({ path, cases });
    byPackage.set(packageName, files);
  }
  const packages = [...byPackage.entries()]
    .map(([name, files]) => ({ name, files }))
    .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
  return { version: SNAPSHOT_VERSION, statusSource: "synthetic", packages };
}

/**
 * Serialize a snapshot to the exact bytes committed to disk.
 *
 * One case per line: the file is reviewed in diffs, and a single-line array of
 * four thousand cases makes every regeneration unreadable. The shape is written
 * by hand rather than through `JSON.stringify` so the layout is stable and the
 * `--check` comparison is a plain byte compare.
 * @param snapshot - the snapshot object.
 * @returns the file text.
 */
export function serialize(snapshot) {
  const lines = ["{", `  "version": ${snapshot.version},`, `  "statusSource": ${JSON.stringify(snapshot.statusSource)},`, '  "packages": ['];
  snapshot.packages.forEach((pkg, packageIndex) => {
    lines.push("    {", `      "name": ${JSON.stringify(pkg.name)},`, '      "files": [');
    pkg.files.forEach((file, fileIndex) => {
      lines.push("        {", `          "path": ${JSON.stringify(file.path)},`, '          "cases": [');
      file.cases.forEach((entry, caseIndex) => {
        const body = `{"name":${JSON.stringify(entry.name)},"status":${JSON.stringify(entry.status)},"durationMs":${entry.durationMs}}`;
        lines.push(`            ${body}${caseIndex === file.cases.length - 1 ? "" : ","}`);
      });
      lines.push("          ]");
      lines.push(fileIndex === pkg.files.length - 1 ? "        }" : "        },");
    });
    lines.push("      ]");
    lines.push(packageIndex === snapshot.packages.length - 1 ? "    }" : "    },");
  });
  lines.push("  ]", "}");
  return `${lines.join("\n")}\n`;
}

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const text = serialize(buildSnapshot());
  if (process.argv.includes("--check")) {
    let committed = "";
    try {
      committed = readFileSync(SNAPSHOT_PATH, "utf8");
    } catch {
      process.stderr.write(`snapshot: ${relative(REPO_ROOT, SNAPSHOT_PATH)} is missing; run without --check\n`);
      process.exit(1);
    }
    if (committed !== text) {
      process.stderr.write(`snapshot: ${relative(REPO_ROOT, SNAPSHOT_PATH)} is stale; run without --check\n`);
      process.exit(1);
    }
    process.stdout.write(`snapshot: up to date (${text.length} bytes)\n`);
  } else {
    writeFileSync(SNAPSHOT_PATH, text, "utf8");
    process.stdout.write(`snapshot: wrote ${relative(REPO_ROOT, SNAPSHOT_PATH)} (${text.length} bytes)\n`);
  }
}
