/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves both halves straight out of the installed package and
 * never runs a build step, so `lib/` is a build product that is committed, and
 * this script is the only thing that writes it.
 *
 *   lib/index.js            Host half, plain ESM (Node imports it directly).
 *   lib/client.js           Browser half: the renderer registration and body.
 *   lib/client.editor.js    Lazy chunk: CodeMirror and the decoration layer.
 *
 * The split is the cost model. `client.js` is parsed on every conversation
 * boot whether or not a Markdown file is ever opened, so it may not carry
 * CodeMirror; the body fetches the chunk through the loader's `require.async`
 * the first time it has a document to edit. The loader only accepts a
 * package-local chunk that declares its own file name in a `chunk:` field, and
 * it keys the chunk as `<package>/<file>`.
 *
 * With `--check` nothing is written: the build runs into memory and exits
 * non-zero when the committed `lib/` differs from what `src/` produces. That
 * flag is the only defence against a stale committed product, which is a real
 * failure mode here because profiles never rebuild.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/** The lazy chunk's name; must match `EDITOR_CHUNK` in src/shared.ts. */
const EDITOR_CHUNK = "client.editor.js";

/**
 * The four editable language blocks; must match `EDITABLE_LANG_CHUNKS` in
 * src/shared.ts.
 *
 * The edit surface's own chunk holds ten grammars statically. The other 44
 * languages live here, one chunk per batch, because adding them to the editor
 * chunk would push a Markdown first-open from about 214 KB to about 400 KB.
 */
const EDITABLE_LANG_BLOCKS = ["batch-systems", "batch-script", "batch-webstyle", "batch-datadoc"];

/** The artifact name for one editable language block. */
const editableLangChunk = block => `client.editor-langs-${block}.js`;

/**
 * Size ceilings for the editable language blocks, in gzipped bytes.
 *
 * A block inlines its own copy of CodeMirror plus its batch's grammars, so the
 * ceiling exists to catch a block that accidentally carries all 44 grammars, not
 * to police a few KB. The first measurement calibrated it: the four blocks came
 * out at 154,237 / 194,961 / 234,950 / 136,774 B, and webstyle is the heaviest
 * because four of its nine languages have a real grammar package (php, html,
 * less, sass) while the other batches lean on legacy stream modes. A probe of the
 * webstyle artifact found none of the other batches' markers, so the excess is
 * its own grammars rather than a leak. The ceiling is therefore 256 KB per block
 * and 1 MB for the set, which still fails loudly if a block doubles.
 */
const EDITABLE_LANG_BUDGET = {
  perBlock: 256000,
  total: 1024000,
};

/**
 * How much the editor chunk may grow.
 *
 * This slice only moves the colour table and the annotation into the shared kit,
 * so the editor chunk should be unchanged or slightly smaller. The allowance is
 * for the kit's own code being inlined into it, which is a few hundred bytes.
 */
const EDITOR_GROWTH_ALLOWANCE = 4096;

/**
 * Platform modules the host seeds for a third-party client bundle: React
 * itself and the shared primitive kit. Bundling either would ship a second
 * React and break every hook in the page.
 */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/** Modules the Harness install provides to the host half, resolved at runtime. */
const HOST_EXTERNALS = ["@deepseek-ai/*"];

/**
 * Symbols that belong to the lazy chunk and must never reach the startup
 * bundle. `marked` is listed with the editor and Markdown-engine markers
 * because any renderer in the entry defeats the split the same way.
 */
const STARTUP_BANNED = ["@codemirror", "react-markdown", "remark-gfm", "marked"];

/**
 * Marks the chunk must carry.
 *
 * `cm-editor` is CodeMirror's own root class, which survives minification
 * because it is a DOM string; the diagnostic marker is the value the chunk
 * exports. Together they catch a chunk built from the wrong entry or an empty
 * stub.
 */
const CHUNK_MARKERS = [/cm-editor/u];

/**
 * The ModuleLoader wrapper for one client artifact.
 *
 * `window.__ModuleLoader__.load` accepts `{id, factory}` plus an optional
 * `chunk` file name. A chunk keeps the package id because the loader keys it
 * as `<id>/<chunk>`; only the entry adds the `boot` hand-over, which is the
 * one place the factory's `require` is reachable.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: the
 * minified code may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself.
 * @param id - module-table id (the package name for every artifact here).
 * @param code - bundled CJS text.
 * @param options - `boot` adds the require hand-over, `chunk` marks a lazy chunk.
 * @returns the script text the browser evaluates.
 */
function wrap(id, code, { boot = false, chunk } = {}) {
  const handover = boot ? "\nmodule.exports.boot?.(require);" : "";
  const chunkField = chunk === undefined ? "" : `  chunk: ${JSON.stringify(chunk)},\n`;
  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(id)},
${chunkField}  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}${handover}
    return module.exports.default ?? module.exports;
  }
});
`;
}

/**
 * Bundle one entry.
 * @param entry - entry file path.
 * @param format - `esm` for the host half, `cjs` for the browser halves.
 * @param external - module specifiers left to the host.
 * @returns the bundled text.
 */
async function bundle(entry, format, external) {
  const host = format === "esm";
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format,
    platform: host ? "node" : "browser",
    target: "es2022",
    minify: true,
    write: false,
    legalComments: "none",
    external,
    jsx: "automatic",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

/**
 * Fail the build when the artifacts drift apart.
 *
 * The chunk name has to agree across three files that cannot import each
 * other: the route table the body fetches through, the `chunk:` field the
 * chunk registers with, and the file this script emitted. The startup bundle
 * also may not contain a single Markdown-engine symbol, and the chunk must
 * still be the GFM renderer rather than an empty stub.
 * @param entryText - built `client.js`.
 * @param chunkText - built chunk text.
 * @throws when a name, a boundary or a marker is wrong.
 */
function assertArtifacts(entryText, chunkText, langTexts) {
  if (!entryText.includes(`"${EDITOR_CHUNK}"`)) {
    throw new Error(`client.js no longer names its lazy chunk ${EDITOR_CHUNK}; the body would fetch nothing`);
  }
  for (const symbol of STARTUP_BANNED) {
    if (entryText.includes(symbol)) throw new Error(`client.js contains ${symbol}; it must stay in the lazy chunk`);
  }
  for (const marker of CHUNK_MARKERS) {
    if (!marker.test(chunkText)) throw new Error(`${EDITOR_CHUNK} does not look like the editor (${String(marker)})`);
  }
  if (!chunkText.includes('"codemirror"')) {
    throw new Error(`${EDITOR_CHUNK} does not carry its renderer marker`);
  }

  // Every block must be the block it claims: the marker is the block name, so a
  // chunk built from the wrong entry is caught here rather than at mount time.
  for (const block of EDITABLE_LANG_BLOCKS) {
    const file = editableLangChunk(block);
    const text = langTexts[file] ?? "";
    if (text === "") throw new Error(`${file} was not emitted`);
    if (!text.includes(JSON.stringify(block))) {
      throw new Error(`${file} does not carry its renderer marker (${block})`);
    }
    // A block that lost its editor is not a block: `cm-editor` is CodeMirror's
    // own root class and survives minification because it is a DOM string.
    if (!text.includes("cm-editor")) throw new Error(`${file} does not look like an editor`);
  }
}

/**
 * Compare the emitted block set against the catalogue's batch blocks.
 *
 * Both directions matter: a missing block means a language the catalogue says is
 * editable has nowhere to mount, and an extra one means a file ships that nothing
 * claims.
 * @param emitted - block names this build produced.
 * @param expected - batch block names the catalogue declares.
 * @throws when the two differ.
 */
function assertBlockSet(emitted, expected) {
  const missing = expected.filter(block => !emitted.includes(block));
  const extra = emitted.filter(block => !expected.includes(block));
  if (missing.length === 0 && extra.length === 0) return;
  const problems = [
    ...missing.map(block => `${block} is in the catalogue but was not emitted`),
    ...extra.map(block => `${block} was emitted but the catalogue declares no such batch`),
  ];
  throw new Error(`editable block set and catalogue disagree:\n  ${problems.join("\n  ")}`);
}

/**
 * Build every artifact and report sizes.
 * @param checkOnly - compare against the committed tree instead of writing it.
 */
async function main(checkOnly) {
  if (!checkOnly) {
    await rm(libRoot, { recursive: true, force: true });
    await mkdir(libRoot, { recursive: true });
  }

  /** Artifacts held in memory while only comparing. */
  const produced = new Map();

  /** Write one artifact, or keep it in memory when only comparing. */
  const emit = async (file, text) => {
    if (checkOnly) {
      produced.set(file, text);
      return;
    }
    await writeFile(join(libRoot, file), text, "utf8");
  };

  await emit("index.js", await bundle(join(packageRoot, "src", "index.ts"), "esm", HOST_EXTERNALS));

  const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", CLIENT_EXTERNALS);
  const entryText = wrap(manifest.name, client, { boot: true });
  await emit("client.js", entryText);

  const editor = await bundle(join(packageRoot, "src", "client", "chunk", "editor.tsx"), "cjs", CLIENT_EXTERNALS);
  const chunkText = wrap(manifest.name, editor, { chunk: EDITOR_CHUNK });
  await emit(EDITOR_CHUNK, chunkText);

  // The four editable language blocks. Each is its own bundle, so each carries a
  // copy of CodeMirror; that is the chunk contract's cost, not a mistake to
  // optimise away.
  const langTexts = {};
  for (const block of EDITABLE_LANG_BLOCKS) {
    const code = await bundle(
      join(packageRoot, "src", "client", "chunk", `editor-langs-${block}.tsx`),
      "cjs",
      CLIENT_EXTERNALS,
    );
    const file = editableLangChunk(block);
    const text = wrap(manifest.name, code, { chunk: file });
    langTexts[file] = text;
    await emit(file, text);
  }

  assertArtifacts(entryText, chunkText, langTexts);

  const written = ["index.js", "client.js", EDITOR_CHUNK, ...EDITABLE_LANG_BLOCKS.map(editableLangChunk)];

  if (checkOnly) {
    const stale = [];
    for (const file of written) {
      const next = Buffer.from(produced.get(file) ?? "", "utf8");
      const committed = await readFile(join(libRoot, file)).catch(() => null);
      if (committed === null || !committed.equals(next)) stale.push(file);
    }
    // The reverse direction matters as much: an artifact src/ no longer
    // produces stays in the package forever if only produced files are read.
    for (const entry of await readdir(libRoot).catch(() => [])) {
      if (!written.includes(entry)) stale.push(`${entry} (present in lib/, not produced by src/)`);
    }
    if (stale.length > 0) {
      process.stderr.write(
        `lib/ is stale for: ${stale.join(", ")}\ncommit the rebuilt lib/ or the installed plugin runs the old code\n`,
      );
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`lib/ matches src/ (${String(written.length)} files)\n`);
    return;
  }

  const sizes = await Promise.all(
    written.map(async file => {
      const bytes = await readFile(join(libRoot, file));
      const gzipped = gzipSync(bytes).length;
      return `${file.padEnd(34)} ${String(bytes.length).padStart(9)} B ${String(gzipped).padStart(8)} B gzip`;
    }),
  );
  process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);

  // The budgets are printed as well as asserted: a block that grows toward its
  // ceiling is worth seeing in the build log before it crosses it.
  const over = [];
  let langTotal = 0;
  for (const block of EDITABLE_LANG_BLOCKS) {
    const gzipped = gzipSync(await readFile(join(libRoot, editableLangChunk(block)))).length;
    langTotal += gzipped;
    if (gzipped > EDITABLE_LANG_BUDGET.perBlock) {
      over.push(`${editableLangChunk(block)}: ${String(gzipped)} B gzipped, budget ${String(EDITABLE_LANG_BUDGET.perBlock)} B`);
    }
  }
  if (langTotal > EDITABLE_LANG_BUDGET.total) {
    over.push(`editable blocks total: ${String(langTotal)} B gzipped, budget ${String(EDITABLE_LANG_BUDGET.total)} B`);
  }
  if (over.length > 0) {
    process.stderr.write(`over size budget:\n  ${over.join("\n  ")}\n`);
    process.exitCode = 1;
  }
}

await main(process.argv.includes("--check"));
