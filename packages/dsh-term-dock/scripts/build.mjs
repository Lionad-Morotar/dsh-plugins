/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads both halves straight out of the installed package and never
 * runs a build step, so `lib/` is a committed product and this script is the only
 * thing that writes it.
 *
 *   lib/index.js             Host half, plain ESM (Node imports it directly).
 *   lib/client.js            Browser half: registration, dock chrome, state machine.
 *   lib/client.terminal.js   Lazy chunk: xterm, FitAddon and their stylesheet.
 *
 * The split is not cosmetic. `client.js` is parsed on every page boot whether or
 * not a terminal is ever opened, so it may not carry the emulator; the chunk is
 * fetched through the loader's `require.async` the first time a panel mounts. The
 * loader only accepts a package-local chunk that declares its own file name in a
 * `chunk:` field, and it keys the chunk as `<package>/<file>` — a chunk that
 * registers under the package id alone would be rejected as a duplicate factory.
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

/** The package-local chunk name; must match `TERMINAL_CHUNK.chunk` in src/shared.ts. */
const TERMINAL_CHUNK = "client.terminal.js";

/**
 * Platform modules the host seeds for a third-party client bundle: React itself
 * and the shared primitive kit. Bundling either would ship a second React and
 * break every hook in the page.
 */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/** Symbols that must never reach the startup bundle; checked after every build. */
const STARTUP_BANNED = ["@xterm/xterm", "xterm.js", "FitAddon"];

/**
 * The ModuleLoader wrapper for one client artifact.
 *
 * `window.__ModuleLoader__.load` accepts `{id, factory}` plus an optional `chunk`
 * file name. A chunk's id stays the package name because the loader keys it as
 * `<id>/<chunk>`; only the entry may add the `boot` hand-over, which is the one
 * place the factory's `require` is reachable.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: the
 * minified code may contain multi-line template literals, and padding every line
 * would inject that padding into the string itself.
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
 * Bundle one entry. The halves differ in module system and getting this wrong is
 * a boot failure, not a warning: the host half is imported by Node from an ESM
 * package, while the client half is evaluated by the browser as a classic script
 * inside the factory. The host half stays unminified so the committed output
 * remains readable evidence of what `src/` produced.
 * @param entry - entry file path.
 * @param format - "esm" for the host half, "cjs" for the client halves.
 * @param options - externals, minification and loader overrides.
 * @returns the bundled text.
 */
async function bundle(entry, format, { external = [], minify = false, loader = {} } = {}) {
  const host = format === "esm";
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format,
    platform: host ? "node" : "browser",
    target: "es2022",
    minify,
    write: false,
    legalComments: "none",
    external,
    loader,
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
 * Three names have to agree and live in three files that cannot import each other:
 * the route table the entry fetches through, the `chunk:` field the chunk script
 * registers with, and the file this script emitted. The startup bundle also may
 * not contain a single xterm symbol — that is the split's entire cost model.
 * @param entryText - built `client.js`.
 * @param chunkText - built `client.terminal.js`.
 * @throws when a name or a boundary is wrong.
 */
function assertArtifacts(entryText, chunkText) {
  if (!entryText.includes(`chunk:"${TERMINAL_CHUNK}"`) && !entryText.includes(`chunk: "${TERMINAL_CHUNK}"`)) {
    throw new Error(`client.js no longer names its lazy chunk ${TERMINAL_CHUNK}; the dock would fetch a file nobody built`);
  }
  for (const symbol of STARTUP_BANNED) {
    if (entryText.includes(symbol)) throw new Error(`client.js contains ${symbol}; xterm must stay in ${TERMINAL_CHUNK}`);
  }
  // Minification renames the classes, so the markers are the two things that
  // survive by contract: the emulator's own stylesheet/class names and FitAddon's
  // public `proposeDimensions`.
  if (!/xterm/iu.test(chunkText) || !/proposeDimensions/u.test(chunkText)) {
    throw new Error(`${TERMINAL_CHUNK} does not look like it contains the emulator and FitAddon`);
  }
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

await writeFile(join(libRoot, "index.js"), await bundle(join(packageRoot, "src", "index.ts"), "esm"), "utf8");

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const entryText = wrap(manifest.name, client, { boot: true });
await writeFile(join(libRoot, "client.js"), entryText, "utf8");

const terminal = await bundle(join(packageRoot, "src", "client", "chunk", "terminal.tsx"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
  // xterm ships its stylesheet as a file; the chunk injects it as one owned
  // <style> tag, so the CSS is bundled as text rather than emitted beside the
  // chunk where nothing would load it.
  loader: { ".css": "text" },
});
const chunkText = wrap(manifest.name, terminal, { chunk: TERMINAL_CHUNK });
await writeFile(join(libRoot, TERMINAL_CHUNK), chunkText, "utf8");

assertArtifacts(entryText, chunkText);

const written = ["index.js", "client.js", TERMINAL_CHUNK];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(22)} ${String(bytes.length).padStart(9)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
