/**
 * The Draco decoder, inlined into a chunk at build time.
 *
 * three's `DRACOLoader` resolves its decoder with `new URL(..., import.meta.url)`
 * and fetches it. In a Harness plugin there is no file layout to resolve against
 * (chunks are served from a versioned asset route) and no network the decoder may
 * use, so the decoder has to be embedded in the chunk and handed back through the
 * one seam the loader leaves open: `_loadLibrary(url, responseType)`.
 *
 * This module is the half of that arrangement a build script can own. It lives
 * here, beside the surfaces that import `virtual:draco-assets`, so that every
 * package bundling a Draco-capable surface uses one implementation: the wrapper
 * text, the wasm bytes, the virtual module and the two `define` overrides that
 * make the emscripten wrapper safe in a browser bundle are easy to get subtly
 * wrong, and the failure mode (a chunk that throws during evaluation) is not one
 * a build log explains.
 */

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * The decoder payloads, read from the three package the caller builds against.
 *
 * `resolve` is injected rather than created here on purpose: the payload has to
 * come from the same three version the caller's bundle will contain, or the
 * wrapper and the wasm binary can disagree with the loader that calls them. A
 * resolver created inside this module would be rooted at this package and pin
 * whichever three *it* resolves, which is only correct by coincidence.
 * @param resolve - resolves a specifier from the calling package (`require.resolve`).
 * @returns the wrapper text and the wasm bytes.
 */
export async function loadDracoPayloads(resolve) {
  const dracoRoot = join(dirname(resolve("three/addons/loaders/DRACOLoader.js")), "..", "libs", "draco", "gltf");
  const [wasmWrapper, wasmBinary] = await Promise.all([
    readFile(join(dracoRoot, "draco_wasm_wrapper.js"), "utf8"),
    readFile(join(dracoRoot, "draco_decoder.wasm")),
  ]);
  return { wasmWrapper, wasmBinary };
}

/**
 * esbuild plugin serving `virtual:draco-assets`.
 *
 * The payloads travel as text and bytes so the bundle stays a single file: a
 * chunk is fetched by the loader as one script, and a second file emitted beside
 * it has no route to be fetched from.
 * @param payloads - decoder text and bytes, from {@link loadDracoPayloads}.
 * @returns the plugin.
 */
export function dracoPlugin(payloads) {
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
 * The `define` overrides a Draco-capable chunk needs.
 *
 * Both exist because the decoder is emscripten output wrapped in code that
 * assumes a Node or a browser-with-a-file-layout environment:
 *
 *   - the wrapper branches on `process.versions.node` before reaching for
 *     fs/path. Folding that probe to undefined lets the minifier drop the
 *     branch, so a renderer that happens to expose `process` cannot trip the
 *     factory require over a module the bundle does not have;
 *   - `DRACOLoader` builds its decoder URLs at module scope. A CJS bundle has no
 *     import.meta, so esbuild substitutes an empty object and the URL
 *     constructor throws while the chunk is still evaluating — before any loader
 *     is reached. The URLs are never fetched (the decoder is inlined and
 *     `_loadLibrary` is overridden), so they only have to be valid; any reserved
 *     host satisfies that.
 * @param reservedUrl - absolute URL the never-fetched decoder paths resolve against.
 * @returns the `define` entries to merge into a build.
 */
export function dracoDefines(reservedUrl) {
  return {
    "process.versions.node": "undefined",
    "import.meta.url": JSON.stringify(reservedUrl),
  };
}
