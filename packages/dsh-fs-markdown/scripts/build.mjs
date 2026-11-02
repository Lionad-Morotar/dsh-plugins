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

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/** The lazy chunk's name; must match `EDITOR_CHUNK` in src/shared.ts. */
const EDITOR_CHUNK = "client.editor.js";

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
function assertArtifacts(entryText, chunkText) {
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

  assertArtifacts(entryText, chunkText);

  const written = ["index.js", "client.js", EDITOR_CHUNK];

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
      return `${file.padEnd(22)} ${String(bytes.length).padStart(9)} B`;
    }),
  );
  process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
}

await main(process.argv.includes("--check"));
