/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves the client half straight out of the installed package
 * (`exports["./client"]`) and never runs a build step, so `lib/` is a build
 * product that is committed, and this script is the only thing that writes it.
 *
 *   lib/index.js            Host half, plain ESM.
 *   lib/client.js           Entry, wrapped so the loader sees a factory.
 *   lib/client.<family>.js  One lazy chunk per renderer family, same wrapper.
 *
 * The wrapper is not cosmetic: `window.__ModuleLoader__` accepts only
 * `{id, factory}`, and a chunk's id must be `<package>/<file name>` or the
 * loader refuses to register it. The entry additionally gets a `boot(require)`
 * handover, because a bundle's top level runs before the factory and only the
 * factory can reach the loader's `require` (needed for `require.async` and the
 * seeded React instance).
 *
 * The Draco decoder is embedded here, not fetched at runtime: three's
 * DRACOLoader resolves it through `new URL(..., import.meta.url)`, which cannot
 * work in a plugin served from a versioned asset route. The virtual module
 * `virtual:draco-assets` carries the payloads as text and bytes.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/** Renderer families, each one lazy chunk. Mirrors src/client/formats.ts. */
const CHUNKS = ["scene3d", "raster"];

/**
 * The ModuleLoader wrapper shared by the entry and every chunk.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: a
 * minified bundle may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself.
 * @param id - module-table id: the package name, or `<package>/<file>` for a chunk.
 * @param code - bundled CJS text.
 * @param options - `boot` adds the `require` handover for the entry.
 * @returns the script text the browser evaluates.
 */
function wrap(id, code, { boot = false } = {}) {
  const handover = boot ? "\nmodule.exports.boot(require);" : "";
  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(id)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}${handover}
    return module.exports.default ?? module.exports;
  }
});
`;
}

/**
 * Bundle one entry to minified text.
 * @param entry - absolute entry path.
 * @param format - `esm` for the Node host half, `cjs` for the browser halves.
 * @param external - specifiers left to the platform (React, virtual modules).
 * @param loader - esbuild loader overrides, e.g. text files.
 * @param plugins - esbuild plugins, e.g. the Draco virtual module.
 * @returns minified bundle text.
 */
async function bundle(entry, format, { external = [], loader = {}, plugins = [] } = {}) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format,
    platform: format === "esm" ? "node" : "browser",
    target: "es2022",
    minify: true,
    write: false,
    legalComments: "none",
    external,
    loader,
    plugins,
    jsx: "automatic",
    // The Draco emscripten wrapper branches on `process.versions.node` and only
    // then reaches for fs/path. Folding that probe to undefined lets the minifier
    // drop the branch, so a renderer that happens to expose `process` cannot trip
    // the factory require over a module the bundle does not have.
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.versions.node": "undefined",
    },
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

/**
 * The Draco payloads, read from the installed three package.
 *
 * Reading them from three's own `libs/draco/gltf` directory pins the decoder to
 * the exact loader version this package bundles; a hand-copied payload would
 * drift silently at the next three upgrade.
 * @returns the wrapper text and wasm bytes.
 */
async function dracoPayloads() {
  const dracoRoot = join(dirname(require.resolve("three/addons/loaders/DRACOLoader.js")), "..", "libs", "draco", "gltf");
  const [wasmWrapper, wasmBinary] = await Promise.all([
    readFile(join(dracoRoot, "draco_wasm_wrapper.js"), "utf8"),
    readFile(join(dracoRoot, "draco_decoder.wasm")),
  ]);
  return { wasmWrapper, wasmBinary };
}

/**
 * esbuild plugin serving `virtual:draco-assets`.
 * @param payloads - decoder text and bytes.
 * @returns the plugin.
 */
function dracoPlugin(payloads) {
  return {
    name: "draco-assets",
    setup(buildContext) {
      buildContext.onResolve({ filter: /^virtual:draco-assets$/ }, () => ({ path: "draco-assets", namespace: "draco" }));
      buildContext.onLoad({ filter: /.*/, namespace: "draco" }, () => ({
        contents: [
          `export const wasmWrapper = ${JSON.stringify(payloads.wasmWrapper)};`,
          `export const wasmBinary = new Uint8Array(${JSON.stringify(Array.from(payloads.wasmBinary))});`,
        ].join("\n"),
        loader: "js",
      }));
    },
  };
}

/**
 * Build every artifact and report sizes.
 *
 * With `--check` nothing is written: the build runs into memory and the script
 * exits non-zero when the committed `lib/` differs from what `src/` produces.
 * That flag is the only defence against a stale committed product, which is a
 * real failure mode here because profiles never rebuild: a plugin installed from
 * a commit whose `lib/` lags its `src/` activates the old code.
 * @param checkOnly - compare against the committed tree instead of writing it.
 */
async function main(checkOnly) {
  if (!checkOnly) {
    await rm(libRoot, { recursive: true, force: true });
    await mkdir(libRoot, { recursive: true });
  }

  const written = [];
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

  await emit("index.js", await bundle(join(packageRoot, "src", "index.ts"), "esm"));
  written.push("index.js");

  // React is a platform module the loader seeds: bundling it would ship a second
  // React and break every hook in the bodies.
  const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", { external: ["react", "react/jsx-runtime"] });
  await emit("client.js", wrap(manifest.name, client, { boot: true }));
  written.push("client.js");

  const payloads = await dracoPayloads();
  for (const family of CHUNKS) {
    const code = await bundle(join(packageRoot, "src", "client", "chunks", `${family}.tsx`), "cjs", {
      external: ["react", "react/jsx-runtime"],
      plugins: family === "scene3d" ? [dracoPlugin(payloads)] : [],
    });
    const file = `client.${family}.js`;
    await emit(file, wrap(`${manifest.name}/${file}`, code));
    written.push(file);
  }

  if (checkOnly) {
    const stale = [];
    for (const file of written) {
      const next = produced.get(file) ?? "";
      const committed = await readFile(join(libRoot, file), "utf8").catch(() => null);
      if (committed !== next) stale.push(file);
    }
    if (stale.length > 0) {
      process.stderr.write(`lib/ is stale for: ${stale.join(", ")}\ncommit the rebuilt lib/ or the installed plugin runs the old code\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`lib/ matches src/ (${String(written.length)} files)\n`);
    return;
  }

  const sizes = await Promise.all(
    written.map(async (file) => {
      const bytes = await readFile(join(libRoot, file));
      return `${file.padEnd(22)} ${String(bytes.length).padStart(9)} B`;
    }),
  );
  process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
}

await main(process.argv.includes("--check"));
