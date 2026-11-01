/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads both halves straight out of the installed package and never
 * runs a build step, so `lib/` is a committed product and this script is the
 * only thing that writes it.
 *
 *   lib/index.js             Host half, plain ESM (Node imports it directly).
 *   lib/client.js            Browser half shell: plugin entry, view-state,
 *                            chunk loader, renderer mount point.
 *   lib/client.diagram.js    Lazy chunk: the SVG renderer.
 *
 * The split mirrors dsh-term-dock: client.js is evaluated on every page boot
 * whether or not an Arch panel ever mounts, so the renderer stays in a
 * package-local chunk fetched through the loader's `require.async` the first
 * time a panel mounts. The loader only accepts a chunk that declares its own
 * file name in a `chunk:` field, keyed as `<package>/<file>` — a chunk
 * registering under the package id alone is rejected as a duplicate factory.
 *
 * The host half bundles small pure code only: `@deepseek-ai/*` stays external
 * (class identity is what the gateway uses to find services) and `@likec4/*`
 * + `bundle-require` stay external because the LikeC4 import is a deliberate
 * lazy `import()` — inlining the parser would put ~78MB of RSS into every
 * boot, and shipping it eagerly would break the "no Arch tab open, zero
 * cost" property at the bundle level, not just at runtime.
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

/**
 * The package-local chunk name; must match `DIAGRAM_CHUNK` in src/shared.ts.
 * The build script cannot import the TS module, so the agreement is enforced
 * by assertArtifacts against the bundled loader reference instead of trust.
 */
const DIAGRAM_CHUNK = "client.diagram.js";

/** Host-half platform packages: the Harness install provides its own copies. */
const HOST_EXTERNALS = ["@deepseek-ai/*", "@likec4/*", "bundle-require"];

/** Platform modules the host seeds for a third-party client bundle. */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/** The lazy import specifier that must survive bundling verbatim. */
const LAZY_IMPORT = "@likec4/language-services/node";

/** Readable ESM host half must stay small; growth here means eager bundling. */
const HOST_MAX_BYTES = 256 * 1024;

/**
 * Startup-bundle budgets. client.js boots on every page; the diagram chunk is
 * only fetched when a panel mounts. The prototype renderer was ~3.7KB raw, so
 * these leave room for interaction features, not for a second renderer.
 */
const SIZE_BUDGETS = {
  "client.js": 32 * 1024,
  [DIAGRAM_CHUNK]: 24 * 1024,
};

/**
 * Symbols that must never reach the startup bundle. The SVG namespace, the
 * edge dash pattern and pointer capture only exist inside the renderer; the
 * chunk's `createDiagram` property access in the mount point is a loader
 * contract, not a renderer symbol, and stays allowed.
 */
const STARTUP_BANNED = ["www.w3.org/2000/svg", "stroke-dasharray", "setPointerCapture"];

/**
 * The ModuleLoader wrapper for one client artifact.
 *
 * `window.__ModuleLoader__.load` accepts `{id, factory}` plus an optional
 * `chunk` file name. A chunk's id stays the package name because the loader
 * keys it as `<id>/<chunk>`; only the entry adds the `boot` hand-over, the
 * one place the factory's `require` is reachable.
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
 * Bundle one entry. The halves differ in module system and getting this wrong
 * is a boot failure, not a warning: the host half is imported by Node from an
 * ESM package, while the client halves are evaluated by the browser as classic
 * scripts inside the factory. The host half stays unminified so the committed
 * output remains readable evidence of what `src/` produced.
 * @param entry - entry file path.
 * @param format - "esm" for the host half, "cjs" for the client halves.
 * @param options - externals, minification.
 * @returns the bundled text.
 */
async function bundle(entry, format, { external = [], minify = false } = {}) {
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
    jsx: "automatic",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

/**
 * Guard the lazy boundary at build time. A regression that turns the dynamic
 * import into a static one (or lets esbuild inline the parser) shows up here
 * as a missing specifier or an exploding size, before it ships.
 */
function assertHostHalf(hostText) {
  if (!hostText.includes(`"${LAZY_IMPORT}"`)) {
    throw new Error(`lib/index.js lost the external ${LAZY_IMPORT} import; the LikeC4 loader must stay lazy`);
  }
  if (hostText.byteLength > HOST_MAX_BYTES) {
    throw new Error(`lib/index.js is ${hostText.byteLength}B (> ${HOST_MAX_BYTES}B); check for eagerly bundled code`);
  }
}

/**
 * Fail the build when the client artifacts drift apart.
 *
 * The chunk name has to agree in three places that cannot import each other:
 * the file this script emits, the `chunk:` field the chunk script registers
 * with, and the loader reference bundled into the entry (which comes from
 * `DIAGRAM_CHUNK` in src/shared.ts). The startup bundle also may not contain
 * a single renderer symbol — that split is the entire cost model.
 * @param entryText - built `client.js`.
 * @param chunkText - built `client.diagram.js`.
 * @throws when a name or a boundary is wrong.
 */
function assertArtifacts(entryText, chunkText) {
  // The minifier may hoist DIAGRAM_CHUNK into a variable initializer, so the
  // loader reference is asserted as the name literal itself: if src/shared.ts
  // drifts, the literal disappears from the entry entirely.
  if (!entryText.includes(`"${DIAGRAM_CHUNK}"`)) {
    throw new Error(`client.js no longer names its lazy chunk ${DIAGRAM_CHUNK}; the panel would fetch a file nobody built`);
  }
  if (!chunkText.includes(`chunk: "${DIAGRAM_CHUNK}"`)) {
    throw new Error(`${DIAGRAM_CHUNK} does not register its own name in its chunk: field`);
  }
  for (const symbol of STARTUP_BANNED) {
    if (entryText.includes(symbol)) throw new Error(`client.js contains ${symbol}; the renderer must stay in ${DIAGRAM_CHUNK}`);
  }
  if (!/www\.w3\.org\/2000\/svg/u.test(chunkText) || !/setPointerCapture/u.test(chunkText)) {
    throw new Error(`${DIAGRAM_CHUNK} does not look like it contains the SVG renderer`);
  }
}

function assertSizes(artifacts) {
  for (const [file, text] of Object.entries(artifacts)) {
    const budget = SIZE_BUDGETS[file];
    if (budget !== undefined && text.byteLength > budget) {
      throw new Error(`${file} is ${text.byteLength}B (> ${budget}B); the ${file === "client.js" ? "startup bundle" : "renderer chunk"} blew its size budget`);
    }
  }
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

const hostText = await bundle(join(packageRoot, "src", "index.ts"), "esm", { external: HOST_EXTERNALS });
await writeFile(join(libRoot, "index.js"), hostText, "utf8");
assertHostHalf(hostText);

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const entryText = wrap(manifest.name, client, { boot: true });
await writeFile(join(libRoot, "client.js"), entryText, "utf8");

const diagram = await bundle(join(packageRoot, "src", "client", "chunk", "diagram.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const chunkText = wrap(manifest.name, diagram, { chunk: DIAGRAM_CHUNK });
await writeFile(join(libRoot, DIAGRAM_CHUNK), chunkText, "utf8");

assertArtifacts(entryText, chunkText);
assertSizes({ "client.js": entryText, [DIAGRAM_CHUNK]: chunkText });

const written = ["index.js", "client.js", DIAGRAM_CHUNK];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(20)} ${String(bytes.length).padStart(9)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
