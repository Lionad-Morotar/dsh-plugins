#!/usr/bin/env node
/**
 * The highlight expansion's measurements, made re-runnable.
 *
 * M1 asks whether the startup bundles stayed affordable, M1b whether the heavy
 * chunks actually got lighter, M3 whether the block set matches the catalogue,
 * and M3b whether the startup bundles stayed free of grammar code. M4 (a
 * plain-text file fetches nothing) is a rendering behaviour and is covered by
 * vitest; M2 (both surfaces painting the same colours) is a browser screenshot.
 * Neither is measurable from the artifacts alone, so this script prints where
 * they are covered rather than inventing a second fixture for them.
 *
 * Everything is read from the committed `lib/` trees and gzipped with
 * `zlib.gzipSync`, the same call the build scripts use. A different gzip level
 * would make these numbers incomparable with the budgets written into the build,
 * which is why the system `gzip` command is not used.
 *
 *   node scripts/measure-highlight.mjs          # table, exit 1 if a check fails
 *   node scripts/measure-highlight.mjs --json   # JSON only
 *
 * Paths come from `import.meta.url`, so this runs the same in the worktree and in
 * the main checkout.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..");

/**
 * The `lib/` tree of one package.
 * @param {string} name - package directory name.
 * @returns {string} absolute path to its `lib/`.
 */
function libOf(name) {
  return join(repoRoot, "packages", name, "lib");
}

/**
 * Baselines taken from `546b0f8`, the commit before this slice started.
 *
 * Raw sizes are kept beside the gzipped ones because a gzip ratio that shifts
 * without the raw size moving means the content changed shape, not size.
 */
const BASELINES = {
  "dsh-fs-explorer/lib/client.js": { gzip: 66860, raw: 238034 },
  "dsh-fs-explorer/lib/client.preview.js": { gzip: 227634, raw: 665098 },
  "dsh-fs-markdown/lib/client.js": { gzip: 5642, raw: 15724 },
  "dsh-fs-markdown/lib/client.editor.js": { gzip: 189183, raw: 536994 },
};

/**
 * Budgets, in bytes.
 *
 * M1 allows 8 KiB of growth in each startup bundle. The language catalogue now
 * rides in both: the pane has to answer "which language is this file" the moment
 * a file opens, before any chunk could be fetched, so that data is a deliberate
 * cost rather than a leak.
 *
 * M1b is asymmetric on purpose. The read-only chunk gave up six grammars, so it
 * must be at least 20 KB lighter. The editor chunk kept its grammars in one
 * bundle (a grammar cannot cross a chunk boundary under the host contract) and
 * gained python plus the dialect table, so it is allowed to grow by 40 KB.
 */
const BUDGET = {
  startupGrowth: 8192,
  previewDrop: 20000,
  editorGrowth: 40960,
};

/**
 * Symbols that only appear when a grammar package is bundled.
 *
 * Language names are deliberately not on this list: the startup bundles carry the
 * catalogue, so `plaintext` and `markdown` appear there as data. These are the
 * editor's own vocabulary instead, and none of them has any business in a bundle
 * that never mounts an editor.
 */
const GRAMMAR_SYMBOLS = [
  "@codemirror",
  "@lezer",
  "EditorState",
  "EditorView",
  "syntaxHighlighting",
  "legacy-modes",
];

/**
 * Measure one artifact.
 * @param {string} file - absolute path.
 * @returns {{ raw: number, gzip: number }} sizes in bytes.
 */
function measure(file) {
  const bytes = readFileSync(file);
  return { raw: bytes.length, gzip: gzipSync(bytes).length };
}

/**
 * The language chunks a package emitted, sorted by name.
 * @param {string} lib - absolute path to the package's `lib/`.
 * @returns {string[]} file names matching `client.lang-<id>.js`.
 */
function languageChunks(lib) {
  return readdirSync(lib)
    .filter(name => /^client\.lang-.+\.js$/u.test(name))
    .sort();
}

/**
 * The catalogue's own view of the block set.
 *
 * Read from the catalogue rather than listed here: a copy would be the very drift
 * this check exists to catch. Node strips the TypeScript types on import, so the
 * source module loads directly.
 * @returns {Promise<object>} the two tables plus the rows that have no block.
 */
async function catalogueBlocks() {
  const catalogue = await import(join(repoRoot, "packages", "dsh-text-languages", "src", "index.ts"));
  return {
    /** language id -> artifact file name. */
    files: catalogue.LANGUAGE_CHUNKS,
    /** block name -> language ids, in the assignment table's order. */
    languages: catalogue.LANGUAGE_CHUNK_LANGUAGES,
    /** Rows with no block, which are the ones that stay monochrome. */
    uncoloured: catalogue.ALL_LANGUAGES.filter(row => row.chunk === undefined).map(row => row.id),
  };
}

/**
 * Whether a startup bundle carries any grammar symbol.
 * @param {string} file - absolute path to a `client.js`.
 * @returns {string[]} the symbols found, empty when clean.
 */
function grammarSymbolsIn(file) {
  const text = readFileSync(file, "utf8");
  return GRAMMAR_SYMBOLS.filter(symbol => text.includes(symbol));
}

/**
 * Build one row of the size table.
 * @param {string} key - `package/file` label used by the baselines.
 * @param {number} gzip - measured gzipped size.
 * @param {number} raw - measured raw size.
 * @returns {object} the row, with its delta against the baseline when there is one.
 */
function row(key, { gzip, raw }) {
  const baseline = BASELINES[key];
  const delta = baseline === undefined ? null : gzip - baseline.gzip;
  return {
    artifact: key,
    gzip,
    raw,
    baselineGzip: baseline?.gzip ?? null,
    baselineRaw: baseline?.raw ?? null,
    deltaGzip: delta,
  };
}

/**
 * Run every measurement and evaluate every check.
 * @returns {Promise<object>} the report.
 */
async function report() {
  const explorerLib = libOf("dsh-fs-explorer");
  const markdownLib = libOf("dsh-fs-markdown");

  // Named fields rather than spreading the measurement: the two sizes are both
  // numbers, so a spread would put raw where gzip belongs and silently compare
  // the wrong pair.
  const startup = [
    row("dsh-fs-explorer/lib/client.js", measure(join(explorerLib, "client.js"))),
    row("dsh-fs-markdown/lib/client.js", measure(join(markdownLib, "client.js"))),
  ];
  const heavy = [
    row("dsh-fs-explorer/lib/client.preview.js", measure(join(explorerLib, "client.preview.js"))),
    row("dsh-fs-markdown/lib/client.editor.js", measure(join(markdownLib, "client.editor.js"))),
  ];

  const explorerChunks = languageChunks(explorerLib);
  const markdownChunks = languageChunks(markdownLib);
  const chunkRows = explorerChunks.map(name => ({ file: name, ...measure(join(explorerLib, name)) }));
  const chunkTotal = chunkRows.reduce((sum, entry) => sum + entry.gzip, 0);
  const python = chunkRows.find(entry => entry.file === "client.lang-python.js");

  const catalogue = await catalogueBlocks();
  // One artifact per block, so the expected file set is the catalogue's values
  // deduplicated: several languages share a block.
  const expectedFiles = [...new Set(Object.values(catalogue.files))].sort();
  const emittedFiles = explorerChunks.slice().sort();
  const filesMatch =
    emittedFiles.length === expectedFiles.length && emittedFiles.every((name, index) => name === expectedFiles[index]);
  const blockCount = Object.keys(catalogue.languages).length;
  const coveredCount = Object.keys(catalogue.files).length;
  // The explicit plaintext row is repo-owned rather than a language, so it is
  // reported apart from the twelve language rows that stay monochrome.
  const uncolouredLanguages = catalogue.uncoloured.filter(id => id !== "plaintext");
  const uncolouredInBlocks = uncolouredLanguages.filter(id => catalogue.files[id] !== undefined);

  const startupSymbols = {
    "dsh-fs-explorer/lib/client.js": grammarSymbolsIn(join(explorerLib, "client.js")),
    "dsh-fs-markdown/lib/client.js": grammarSymbolsIn(join(markdownLib, "client.js")),
  };

  const explorerStartup = startup[0];
  const markdownStartup = startup[1];
  const preview = heavy[0];
  const editor = heavy[1];

  const checks = {
    M1: {
      status:
        explorerStartup.deltaGzip <= BUDGET.startupGrowth && markdownStartup.deltaGzip <= BUDGET.startupGrowth
          ? "pass"
          : "fail",
      budget: BUDGET.startupGrowth,
      measured: { explorer: explorerStartup.deltaGzip, markdown: markdownStartup.deltaGzip },
      detail: "startup bundles may grow by at most 8 KiB; the language catalogue rides in both by design",
    },
    M1b: {
      status: preview.deltaGzip <= -BUDGET.previewDrop && editor.deltaGzip <= BUDGET.editorGrowth ? "pass" : "fail",
      budget: { previewDrop: -BUDGET.previewDrop, editorGrowth: BUDGET.editorGrowth },
      measured: { preview: preview.deltaGzip, editor: editor.deltaGzip },
      detail:
        "the read-only chunk must shed at least 20 KB; the editor chunk may grow by at most 40 KB, because it keeps its grammars in one bundle",
    },
    M3: {
      // The edit surface deliberately ships no language chunks: a grammar cannot
      // cross a chunk boundary under the host contract, so its grammars stay in
      // the one editor bundle. Asserting blocks there would demand the very split
      // that was ruled out, so the check pins the split that actually shipped.
      status:
        filesMatch && blockCount === 14 && coveredCount === 64 && uncolouredInBlocks.length === 0 && markdownChunks.length === 0
          ? "pass"
          : "fail",
      measured: {
        blocks: blockCount,
        artifacts: emittedFiles.length,
        coveredLanguages: coveredCount,
        uncolouredLanguages: uncolouredLanguages.length,
        editSurfaceBlocks: markdownChunks.length,
      },
      detail:
        "the read-only surface ships one artifact per catalogue block, the block set matches the catalogue, 64 languages are covered and the 12 uncoloured rows are in no block",
    },
    M3b: {
      status: Object.values(startupSymbols).every(found => found.length === 0) ? "pass" : "fail",
      measured: startupSymbols,
      detail: "no grammar symbol may appear in a startup bundle; language names are excluded because the catalogue carries them",
    },
  };

  return {
    baselinesFrom: "546b0f8",
    startup,
    heavy,
    languageChunks: { explorer: chunkRows, totalGzip: chunkTotal, markdown: markdownChunks },
    pythonChunkGzip: python?.gzip ?? null,
    blocks: {
      count: blockCount,
      artifacts: emittedFiles,
      coveredLanguages: coveredCount,
      uncolouredLanguages,
      languagesPerBlock: catalogue.languages,
    },
    checks,
  };
}

/**
 * Print the report as a fixed-width table.
 * @param {object} data - the report.
 */
function printTable(data) {
  const line = (label, gzip, delta, note = "") => {
    const sign = delta === null ? "" : delta > 0 ? `+${String(delta)}` : String(delta);
    process.stdout.write(
      `${label.padEnd(54)}${String(gzip).padStart(9)}${sign.padStart(9)}  ${note}\n`,
    );
  };

  process.stdout.write(`\n=== startup bundles (M1) ===\n`);
  process.stdout.write(`${"artifact".padEnd(54)}${"gzip".padStart(9)}${"vs base".padStart(9)}\n`);
  for (const entry of data.startup) line(entry.artifact, entry.gzip, entry.deltaGzip);

  process.stdout.write(`\n=== heavy chunks (M1b) ===\n`);
  process.stdout.write(`${"artifact".padEnd(54)}${"gzip".padStart(9)}${"vs base".padStart(9)}\n`);
  for (const entry of data.heavy) line(entry.artifact, entry.gzip, entry.deltaGzip);

  process.stdout.write(`\n=== language blocks (M3) ===\n`);
  process.stdout.write(`${"artifact".padEnd(54)}${"gzip".padStart(9)}${"vs base".padStart(9)}\n`);
  for (const entry of data.languageChunks.explorer) {
    line(`dsh-fs-explorer/lib/${entry.file}`, entry.gzip, null, entry.file === "client.lang-python.js" ? "budget anchor" : "");
  }
  line(`  total (${String(data.blocks.count)} blocks)`, data.languageChunks.totalGzip, null);
  process.stdout.write(
    `dsh-fs-markdown/lib/client.lang-*.js${String(data.languageChunks.markdown.length).padStart(9)}${"".padStart(9)}  by design: grammars stay in client.editor.js\n`,
  );
  process.stdout.write(
    `\n  ${String(data.blocks.coveredLanguages)} languages are drawn by these ${String(data.blocks.count)} blocks; ` +
      `${String(data.blocks.uncolouredLanguages.length)} stay monochrome:\n`,
  );
  process.stdout.write(`    ${data.blocks.uncolouredLanguages.join(", ")}\n`);

  process.stdout.write(
    `\n=== covered elsewhere ===\n` +
      `M4   a plain-text file fetches no chunk: covered by vitest (test/preview-pane.test.ts)\n` +
      `M2   both surfaces paint the same colours: covered by the browser evidence in docs/qa/261111\n`,
  );

  process.stdout.write(`\n=== checks ===\n`);
  for (const [id, check] of Object.entries(data.checks)) {
    process.stdout.write(`${id.padEnd(5)}${check.status.toUpperCase().padEnd(6)}${check.detail}\n`);
  }
  const failed = Object.values(data.checks).filter(check => check.status !== "pass").length;
  process.stdout.write(`\n${failed === 0 ? "all checks passed" : `${String(failed)} check(s) failed`}\n`);
}

const data = await report();
if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
} else {
  printTable(data);
}
const failed = Object.values(data.checks).some(check => check.status !== "pass");
if (failed) process.exitCode = 1;
