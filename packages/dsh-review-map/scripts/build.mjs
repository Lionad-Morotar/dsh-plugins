/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves the client half straight out of the installed package
 * (`exports["./client"]`) and never runs a build step, so `lib/` is a build
 * product that is committed, and this script is the only thing that writes it.
 *
 *   lib/index.js             Host half, plain ESM (Node imports it directly).
 *   lib/client.js            Browser half, CJS wrapped in a ModuleLoader factory.
 *   lib/client.map.js        Lazy chunk: the directory map renderer.
 *
 * The map renderer is a chunk rather than part of the entry because `client.js`
 * is evaluated on every page boot whether or not the review tab is ever opened.
 * The entry only names the file; the renderer is fetched through the loader's
 * `require.async` the first time a map actually mounts. The loader accepts a
 * chunk only when it declares its own file name in a `chunk:` field, keyed as
 * `<package>/<file>` — a chunk registering under the package id alone is
 * rejected as a duplicate factory.
 */
import { build } from "esbuild";
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
 * The package-local chunk name; must match `MAP_CHUNK` in src/shared.ts.
 * The build script cannot import the TS module, so the agreement is enforced by
 * `assertArtifacts` against the bundled loader reference instead of by trust.
 */
const MAP_CHUNK = "client.map.js";

/**
 * Host-half platform packages: the Harness install provides its own copies.
 *
 * `typescript` is external for a different reason than the platform packages:
 * it is a real dependency of this package, but inlining it would put a whole
 * compiler into `lib/index.js` (tens of megabytes of committed build product).
 * The import stays in the output and Node resolves it from the installed tree.
 */
const HOST_EXTERNALS = ["@deepseek-ai/*", "typescript"];

/** Platform modules the host seeds for a third-party client bundle. */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/**
 * Startup-bundle budget. `client.js` is evaluated on every page boot whether or
 * not the tab is ever opened, so growth here is a cost every user pays.
 *
 * 48KB is roughly four times what this frame needs; the ceiling is there to
 * catch a dependency creeping into the startup half (a renderer, a charting
 * library, a parser), not to be approached. When a slice needs more, the answer
 * is a lazy chunk, not a bigger number.
 */
const CLIENT_MAX_BYTES = 48 * 1024;

/**
 * Literals that must survive bundling. The slot name and the view id are the
 * two halves of the registration the host keys on; if either drifts out of the
 * bundle the tab silently never appears, which no type check catches.
 */
const REQUIRED_LITERALS = ["conversation.view", "review-map"];

/**
 * The ModuleLoader wrapper for one client artifact.
 *
 * `window.__ModuleLoader__.load` accepts `{id, factory}` plus an optional
 * `chunk` file name. A chunk's id stays the package name because the loader
 * keys it as `<id>/<chunk>`; only the entry adds the `boot` hand-over, the one
 * place the factory's `require` is reachable.
 *
 * The bundle text is inserted verbatim and deliberately NOT re-indented: the
 * minified code may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself. esbuild emits a lone
 * default export as `module.exports.default`, hence the unwrap.
 * @param id - module-table id, the package name.
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
  const bytes = Buffer.byteLength(clientText);
  if (bytes > CLIENT_MAX_BYTES) {
    throw new Error(`lib/client.js is ${bytes}B (> ${CLIENT_MAX_BYTES}B); the startup bundle blew its budget`);
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

/**
 * Assert the client artifacts agree about the lazy boundary.
 *
 * The chunk name has to agree in three places that cannot import each other:
 * the file this script emits, the `chunk:` field the chunk script registers
 * with, and the loader reference bundled into the entry (which comes from
 * `MAP_CHUNK` in src/shared.ts). A drift in any of them is a tab that fetches a
 * file nobody built, which no type check catches.
 * @param entryText - built `client.js`.
 * @param chunkText - built `client.map.js`.
 * @throws when a name or a boundary is wrong.
 */
function assertMapChunk(entryText, chunkText) {
  // The minifier may hoist MAP_CHUNK into a variable initializer, so the loader
  // reference is asserted as the name literal itself: if src/shared.ts drifts,
  // the literal disappears from the entry entirely.
  if (!entryText.includes(`"${MAP_CHUNK}"`)) {
    throw new Error(`client.js no longer names its lazy chunk ${MAP_CHUNK}; the map would fetch a file nobody built`);
  }
  if (!chunkText.includes(`chunk: "${MAP_CHUNK}"`)) {
    throw new Error(`${MAP_CHUNK} does not register its own name in its chunk: field`);
  }
  // The renderer must not be reachable from the startup bundle: the SVG
  // namespace only exists inside the chunk, so its presence in the entry means
  // the split collapsed.
  if (entryText.includes("www.w3.org/2000/svg")) {
    throw new Error(`client.js contains the SVG namespace; the renderer must stay in ${MAP_CHUNK}`);
  }
  if (!chunkText.includes("www.w3.org/2000/svg")) {
    throw new Error(`${MAP_CHUNK} does not look like it contains the SVG renderer`);
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

const map = await bundle(join(packageRoot, "src", "client", "map", "index.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const mapText = wrap(manifest.name, map, { chunk: MAP_CHUNK });
await writeFile(join(libRoot, MAP_CHUNK), mapText, "utf8");

assertClientHalf(clientText);
assertMapChunk(clientText, mapText);
await assertHostHalf(join(libRoot, "index.js"));

const written = ["index.js", "client.js", MAP_CHUNK];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
