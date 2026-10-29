/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads both halves straight out of the installed package and never
 * runs a build step, so `lib/` is a committed product and this script is the
 * only thing that writes it.
 *
 *   lib/index.js          Host half, plain ESM (Node imports it directly).
 *   lib/client.js         Browser half: registration, tree, paging, first paint.
 *   lib/client.preview.js Lazy chunk: CodeMirror, its language packages, GFM.
 *
 * The split is the preview's cost model. `client.js` is parsed on every page
 * boot whether or not a file is ever selected, so it may not carry the editor;
 * the chunk is fetched through the loader's `require.async` the first time a
 * file is selected. The loader only accepts a package-local chunk that declares
 * its own file name in a `chunk:` field, and it keys the chunk as
 * `<package>/<file>`; a chunk that registers under the package id alone would be
 * rejected as a duplicate factory.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/** The package-local chunk name; must match `PREVIEW_CHUNK.chunk` in src/shared.ts. */
const PREVIEW_CHUNK = "client.preview.js";

/**
 * Platform modules the host seeds for a third-party client bundle: React itself
 * and the shared primitive kit. Bundling either would ship a second React and
 * break every hook in the page.
 */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/** Symbols that must never reach the startup bundle; checked after every build. */
const STARTUP_BANNED = ["@codemirror", "codemirror", "react-markdown", "remark-gfm", "marked"];

/**
 * Marks that must be present in the chunk for it to be the renderer it claims.
 *
 * The first is the diagnostic marker the chunk exports (`renderer`); the second
 * is the GFM pipeline's own vocabulary, which survives minification in its
 * node-type strings.
 */
const CHUNK_MARKERS = [/codemirror/iu, /remark|markdown/iu];

/**
 * The ModuleLoader wrapper for one client artifact.
 *
 * `window.__ModuleLoader__.load` accepts `{id, factory}` plus an optional
 * `chunk` file name. A chunk's id stays the package name because the loader
 * keys it as `<id>/<chunk>`; only the entry may add the `boot` hand-over, which
 * is the one place the factory's `require` is reachable.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: the
 * minified code may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself.
 * @param id - module-table id (the package name for both artifacts).
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
 * @param options - format, externals and minification.
 * @returns the bundled text.
 */
async function bundle(entry, options = {}) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: options.format ?? "cjs",
    platform: options.format === "esm" ? "node" : "browser",
    target: "es2022",
    minify: options.minify === true,
    write: false,
    legalComments: "none",
    external: options.external ?? [],
    jsx: "automatic",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

/**
 * Fail the build when the two client artifacts drift apart.
 *
 * Three names have to agree and live in three files that cannot import each
 * other: the route table the entry fetches through, the `chunk:` field the
 * chunk script registers with, and the file this script emitted. The startup
 * bundle also may not contain a single editor or Markdown-renderer symbol,
 * because that is the split's entire cost model.
 * @param entryText - built `client.js`.
 * @param chunkText - built `client.preview.js`.
 * @throws when a name or a boundary is wrong.
 */
function assertArtifacts(entryText, chunkText) {
  if (!entryText.includes(`chunk:"${PREVIEW_CHUNK}"`) && !entryText.includes(`chunk: "${PREVIEW_CHUNK}"`)) {
    throw new Error(`client.js no longer names its lazy chunk ${PREVIEW_CHUNK}; the preview would fetch a file nobody built`);
  }
  for (const symbol of STARTUP_BANNED) {
    if (entryText.includes(symbol)) throw new Error(`client.js contains ${symbol}; it must stay in ${PREVIEW_CHUNK}`);
  }
  for (const marker of CHUNK_MARKERS) {
    if (!marker.test(chunkText)) throw new Error(`${PREVIEW_CHUNK} does not look like the preview renderer (${String(marker)})`);
  }
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

await writeFile(join(libRoot, "index.js"), await bundle(join(packageRoot, "src", "index.ts"), { format: "esm" }), "utf8");

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const entryText = wrap(manifest.name, client, { boot: true });
await writeFile(join(libRoot, "client.js"), entryText, "utf8");

const preview = await bundle(join(packageRoot, "src", "client", "chunk", "preview.tsx"), {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const chunkText = wrap(manifest.name, preview, { chunk: PREVIEW_CHUNK });
await writeFile(join(libRoot, PREVIEW_CHUNK), chunkText, "utf8");

assertArtifacts(entryText, chunkText);

const written = ["index.js", "client.js", PREVIEW_CHUNK];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(22)} ${String(bytes.length).padStart(9)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
