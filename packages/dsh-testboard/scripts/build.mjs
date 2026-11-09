/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves the client half straight out of the installed package
 * (`exports["./client"]`) and never runs a build step, so `lib/` is a build
 * product that is committed, and this script is the only thing that writes it.
 *
 *   lib/index.js             Host half, plain ESM (Node imports it directly).
 *   lib/client.js            Browser half, CJS wrapped in a ModuleLoader factory.
 *   lib/client.snapshot.js   Lazy chunk: the board's data snapshot.
 *   lib/client.sources.js    Lazy chunk: every test file's source text.
 *
 * The host half stays unminified so the committed output remains readable
 * evidence of what `src/` produced; only the browser halves pay for
 * minification, and only the startup one has a size budget that matters.
 */
import { build } from "esbuild";
import { cssTextPlugin } from "./css-plugin.mjs";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/**
 * The lazy chunks' file names; must match `SNAPSHOT_CHUNK` and `SOURCES_CHUNK`
 * in src/shared.ts.
 *
 * The build script cannot import the TS module, so the agreement is enforced by
 * asserting the bundled entry still names these literals instead of by trust.
 */
const SNAPSHOT_CHUNK = "client.snapshot.js";
const SOURCES_CHUNK = "client.sources.js";
const EDITOR_CHUNK = "client.editor.js";

/** Host-half platform packages: the Harness install provides its own copies. */
const HOST_EXTERNALS = ["@deepseek-ai/*"];

/** Platform modules the host seeds for a third-party client bundle. */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/**
 * Startup-bundle budget. `client.js` is evaluated on every page boot whether or
 * not the tab is ever opened, so growth here is a cost every user pays. The
 * split view, keyboard navigation and the resize handle are startup code, which
 * took the bundle from ~24KB to ~32.7KB; the ceiling moved to 40KB rather than
 * letting the split ship 90 bytes under the old line, where the next tweak
 * would fail for no user-visible reason. Gzipped it is under 10KB.
 */
const CLIENT_MAX_BYTES = 40 * 1024;

/**
 * The lazy chunks' budgets.
 *
 * Both are fetched once, on first mount, and cached by their loaders, so they
 * are allowed to be large; the ceilings exist to catch a regression that starts
 * inlining something else into them. The committed snapshot is ~550KB of
 * readable JSON and the source bundle is ~2.5MB of test text, which minify to
 * well under these numbers.
 */
const SNAPSHOT_MAX_BYTES = 700_000;
const SOURCES_MAX_BYTES = 4_200_000;
/** CodeMirror's view, state, language and JavaScript parser, minified. */
const EDITOR_MAX_BYTES = 1_200_000;

/**
 * Fields that only exist in the snapshot payload.
 *
 * The startup bundle must not contain any of them: if one appears, the data was
 * pulled into the boot path and every page pays for a tab most users never open.
 *
 * These are payload markers, not field names the model happens to mention.
 * `durationMs` is deliberately absent: the read model sums durations from the
 * cases it is handed, so the identifier legitimately appears in the startup half
 * while the data stays in the chunk.
 */
const SNAPSHOT_ONLY_FIELDS = ["statusSource"];

/**
 * Fields that only exist in the source bundle.
 *
 * Same rule as the snapshot's markers: the startup half must not carry the test
 * files' text, or every page pays for a code view most readers never open.
 */
const SOURCES_ONLY_FIELDS = ["packages/dsh-testboard/test/"];

/**
 * Literals that must survive bundling. The slot name and the view id are the
 * two halves of the registration the host keys on; if either drifts out of the
 * bundle the tab silently never appears, which no type check catches.
 */
const REQUIRED_LITERALS = ["conversation.view", "testboard"];

/**
 * The ModuleLoader wrapper for the client half.
 *
 * `window.__ModuleLoader__.load` accepts only `{id, factory}` and the id must
 * equal the package name, because the loader keys its module table on it. The
 * factory must return the plugin object `{name, inject, apply}`; an IIFE result
 * is rejected at mount.
 *
 * The bundle text is inserted verbatim and deliberately NOT re-indented: the
 * minified code may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself. esbuild emits a lone
 * default export as `module.exports.default`, hence the unwrap.
 * @param id - module-table id, the package name.
 * @param code - bundled CJS text.
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
 * Bundle one entry. The halves differ in module system and getting this wrong
 * is a boot failure, not a warning: the host half is imported by Node from an
 * ESM package, while the client half is evaluated by the browser as a classic
 * script inside the factory.
 * @param entry - entry file path.
 * @param format - "esm" for the host half, "cjs" for the client half.
 * @param options - externals, minification.
 * @returns the bundled text.
 */
async function bundle(entry, format, { external = [], minify = false } = {}) {
  const host = format === "esm";
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    // esbuild writes its source comments relative to this directory, so pinning
    // it keeps the committed bytes identical no matter where the build runs.
    absWorkingDir: packageRoot,
    format,
    platform: host ? "node" : "browser",
    target: "es2022",
    minify,
    write: false,
    legalComments: "none",
    external,
    jsx: "automatic",
    plugins: [cssTextPlugin()],
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

/**
 * Assert the client half still carries the registration the host keys on and
 * fits its boot budget.
 * @param clientText - built `client.js`, wrapper included.
 * @throws when a literal is missing or the bundle is over budget.
 */
function assertClientHalf(clientText) {
  for (const literal of REQUIRED_LITERALS) {
    if (!clientText.includes(literal)) {
      throw new Error(`lib/client.js lost the literal ${literal}; the tab would never register`);
    }
  }
  if (!clientText.includes("__ModuleLoader__")) {
    throw new Error("lib/client.js is not wrapped in the ModuleLoader factory");
  }
  for (const chunk of [SNAPSHOT_CHUNK, SOURCES_CHUNK, EDITOR_CHUNK]) {
    if (!clientText.includes(`"${chunk}"`)) {
      throw new Error(`lib/client.js no longer names its lazy chunk ${chunk}; the tab would fetch a file nobody built`);
    }
  }
  for (const field of SNAPSHOT_ONLY_FIELDS) {
    if (clientText.includes(field)) {
      throw new Error(`lib/client.js contains ${field}; the snapshot data must stay in ${SNAPSHOT_CHUNK}`);
    }
  }
  for (const field of SOURCES_ONLY_FIELDS) {
    if (clientText.includes(field)) {
      throw new Error(`lib/client.js contains ${field}; the test source must stay in ${SOURCES_CHUNK}`);
    }
  }
  // The editor must stay in its chunk: a stray import here would pull
  // CodeMirror into every page boot.
  for (const symbol of ["EditorView", "CodeMirror", "@codemirror/"]) {
    if (clientText.includes(symbol)) {
      throw new Error(`lib/client.js contains ${symbol}; the editor must stay in ${EDITOR_CHUNK}`);
    }
  }
  const bytes = Buffer.byteLength(clientText);
  if (bytes > CLIENT_MAX_BYTES) {
    throw new Error(`lib/client.js is ${bytes}B (> ${CLIENT_MAX_BYTES}B); the startup bundle blew its budget`);
  }
}

/**
 * Assert the snapshot chunk registers its own file name and carries the data.
 * @param chunkText - built `client.snapshot.js`, wrapper included.
 * @throws when the chunk field or the payload is missing, or it is over budget.
 */
function assertSnapshotChunk(chunkText) {
  if (!chunkText.includes(`chunk: "${SNAPSHOT_CHUNK}"`)) {
    throw new Error(`${SNAPSHOT_CHUNK} does not register its own name in its chunk: field`);
  }
  if (!chunkText.includes("statusSource")) {
    throw new Error(`${SNAPSHOT_CHUNK} does not carry the snapshot payload`);
  }
  const bytes = Buffer.byteLength(chunkText);
  if (bytes > SNAPSHOT_MAX_BYTES) {
    throw new Error(`${SNAPSHOT_CHUNK} is ${bytes}B (> ${SNAPSHOT_MAX_BYTES}B); the snapshot chunk blew its budget`);
  }
}

/**
 * Assert the sources chunk registers its own file name and carries the text.
 * @param chunkText - built `client.sources.js`, wrapper included.
 * @throws when the chunk field or the payload is missing, or it is over budget.
 */
function assertSourcesChunk(chunkText) {
  if (!chunkText.includes(`chunk: "${SOURCES_CHUNK}"`)) {
    throw new Error(`${SOURCES_CHUNK} does not register its own name in its chunk: field`);
  }
  if (!chunkText.includes("packages/")) {
    throw new Error(`${SOURCES_CHUNK} does not carry any file text`);
  }
  const bytes = Buffer.byteLength(chunkText);
  if (bytes > SOURCES_MAX_BYTES) {
    throw new Error(`${SOURCES_CHUNK} is ${bytes}B (> ${SOURCES_MAX_BYTES}B); the sources chunk blew its budget`);
  }
}

/**
 * Assert the editor chunk registers its own name and really carries CodeMirror.
 * @param chunkText - built `client.editor.js`, wrapper included.
 * @throws when the chunk field, the renderer marker or the budget is wrong.
 */
function assertEditorChunk(chunkText) {
  if (!chunkText.includes(`chunk: "${EDITOR_CHUNK}"`)) {
    throw new Error(`${EDITOR_CHUNK} does not register its own name in its chunk: field`);
  }
  if (!chunkText.includes("codemirror")) {
    throw new Error(`${EDITOR_CHUNK} does not carry the CodeMirror renderer`);
  }
  const bytes = Buffer.byteLength(chunkText);
  if (bytes > EDITOR_MAX_BYTES) {
    throw new Error(`${EDITOR_CHUNK} is ${bytes}B (> ${EDITOR_MAX_BYTES}B); the editor chunk blew its budget`);
  }
}

/**
 * Assert the host half is a plugin object the Loader can mount.
 *
 * Imported for real rather than pattern-matched: the Loader calls `apply` on
 * this module, so a shape that only looks right in the text is the failure this
 * check exists to catch.
 * @param file - path to the written host half.
 * @throws when the module does not expose `{name, inject, apply}`.
 */
async function assertHostHalf(file) {
  const module = await import(pathToFileURL(file).href);
  const ok = typeof module.name === "string" && Array.isArray(module.inject) && typeof module.apply === "function";
  if (!ok) throw new Error("lib/index.js does not export {name, inject, apply}");
  if (module.name !== manifest.name) {
    throw new Error(`lib/index.js exports name ${module.name}, expected ${manifest.name}`);
  }
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

const hostText = await bundle(join(packageRoot, "src", "index.ts"), "esm", { external: HOST_EXTERNALS });
await writeFile(join(libRoot, "index.js"), hostText, "utf8");

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const clientText = wrap(manifest.name, client, { boot: true });
await writeFile(join(libRoot, "client.js"), clientText, "utf8");

const snapshot = await bundle(join(packageRoot, "src", "client", "snapshot-chunk.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const snapshotText = wrap(manifest.name, snapshot, { chunk: SNAPSHOT_CHUNK });
await writeFile(join(libRoot, SNAPSHOT_CHUNK), snapshotText, "utf8");

const sources = await bundle(join(packageRoot, "src", "client", "sources-chunk.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const sourcesText = wrap(manifest.name, sources, { chunk: SOURCES_CHUNK });
await writeFile(join(libRoot, SOURCES_CHUNK), sourcesText, "utf8");

const editor = await bundle(join(packageRoot, "src", "client", "editor-chunk.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const editorText = wrap(manifest.name, editor, { chunk: EDITOR_CHUNK });
await writeFile(join(libRoot, EDITOR_CHUNK), editorText, "utf8");

assertClientHalf(clientText);
assertSnapshotChunk(snapshotText);
assertSourcesChunk(sourcesText);
assertEditorChunk(editorText);
await assertHostHalf(join(libRoot, "index.js"));

const written = ["index.js", "client.js", SNAPSHOT_CHUNK, SOURCES_CHUNK, EDITOR_CHUNK];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
