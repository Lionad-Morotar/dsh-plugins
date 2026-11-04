/**
 * The pdf.js worker, inlined into a chunk at build time.
 *
 * pdf.js spawns its parser in a Web Worker and finds it by URL: `PDFWorker`
 * reads `GlobalWorkerOptions.workerSrc` and hands it to `new Worker(...)`. In a
 * Harness plugin there is no file layout to resolve that URL against (chunks are
 * served from a versioned asset route) and no network the worker may use, so the
 * worker source has to travel inside the chunk and be turned into a URL at
 * runtime from a `Blob`.
 *
 * This module is the build half of that arrangement. It lives beside the Draco
 * helper because it is the same technique for the same reason: a second file
 * emitted next to a chunk has no route to be fetched from, so the payload is
 * embedded as text and the surface reconstructs it.
 *
 * The worker file is a self-contained ES module with no static imports, which is
 * what makes embedding it as one string safe: there is no second module for the
 * blob URL to resolve against.
 */

import { readFile } from "node:fs/promises";

/**
 * The worker source, read from the pdfjs-dist the caller builds against.
 *
 * `resolve` is injected rather than created here for the same reason the Draco
 * helper takes one: the worker has to come from the exact pdfjs-dist version the
 * main library is bundled from, or the two halves speak different message
 * protocols. A resolver rooted at this package would pin whichever copy *it*
 * resolves, which is only correct by coincidence.
 * @param resolve - resolves a specifier from the calling package (`require.resolve`).
 * @returns the worker module's text.
 */
export async function loadPdfWorkerPayload(resolve) {
  const workerPath = resolve("pdfjs-dist/build/pdf.worker.min.mjs");
  return readFile(workerPath, "utf8");
}

/**
 * esbuild plugin serving `virtual:pdf-worker`.
 *
 * The payload travels as a string so the bundle stays a single file. It is
 * exported as a plain string rather than a `Uint8Array` because the surface only
 * ever hands it to a `Blob`, and a string is what a `Blob` part wants.
 *
 * The plugin also rewrites pdf.js's own Node probe while the module is loaded.
 * A `define` is not enough for this one: pdf.js writes the probe as a single
 * `const isNodeJS = ...` over `typeof process`, and esbuild folds that to `false`
 * but keeps the guarded body, because the guard sits inside a class static block
 * where the minifier does not eliminate dead branches. So the declaration is
 * rewritten to a constant and the assignment it guards is removed. What is left
 * is a chunk with no relative worker URL in it at all, which makes the explicit
 * port the surface passes the only way a worker is ever created.
 * @param payload - worker source text, from {@link loadPdfWorkerPayload}.
 * @returns the plugin.
 */
export function pdfWorkerPlugin(payload) {
  return {
    name: "pdf-worker",
    setup(buildContext) {
      buildContext.onResolve({ filter: /^virtual:pdf-worker$/ }, () => ({ path: "pdf-worker", namespace: "pdf-worker" }));
      buildContext.onLoad({ filter: /.*/, namespace: "pdf-worker" }, () => ({
        contents: `export const workerSource = ${JSON.stringify(payload)};`,
        loader: "js",
      }));

      // The main library, not the worker: the worker never probes for Node.
      // The filter is a Go regexp, so it is deliberately plain: no `u` flag and
      // no escape classes. `pdf.mjs` is the file the package's `main` points at,
      // which is what esbuild resolves; `pdf.worker.mjs` does not end this way.
      buildContext.onLoad({ filter: /pdf\.mjs$/ }, async args => {
        const source = await readFile(args.path, "utf8");
        const folded = source.replace(NODE_PROBE, "const isNodeJS = false;");
        if (folded === source) {
          throw new Error("pdf.js no longer declares isNodeJS the way this build folds it; the worker URL would ship");
        }
        const rewritten = folded.replace(WORKER_SRC_ASSIGNMENT, "");
        if (rewritten === folded) {
          throw new Error("pdf.js no longer assigns a default workerSrc the way this build strips it; a relative worker URL would ship");
        }
        return { contents: rewritten, loader: "js" };
      });
    },
  };
}

/**
 * pdf.js's Node probe, as one declaration.
 *
 * Matched rather than hard-coded so a pdfjs-dist bump that rewrites the
 * expression still folds, and one that removes it fails the build loudly instead
 * of quietly shipping a relative worker URL.
 */
const NODE_PROBE = /const isNodeJS = [^;]+;/u;

/**
 * The default worker URL pdf.js assigns under Node.
 *
 * It is the only relative worker path in the library, and this host has no route
 * for it. The surface always passes an explicit port, so the assignment is dead
 * either way; removing it is what keeps the artifact free of a URL that could
 * only ever 404.
 */
const WORKER_SRC_ASSIGNMENT = /GlobalWorkerOptions\.workerSrc\s*\|\|=\s*"\.\/pdf\.worker\.mjs";/u;

/**
 * The `define` overrides a pdf.js chunk needs.
 *
 * pdf.js decides at module scope whether it is running under Node, and that
 * decision has two consequences a browser bundle cannot live with:
 *
 *   - the Node branch assigns `GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs"`,
 *     a relative URL this host has no route for. Folding the probe to undefined
 *     lets the minifier drop the branch, so the literal never reaches the
 *     artifact and the surface's explicit `workerPort` is the only way a worker
 *     is ever created;
 *   - the same branch reaches for `process.getBuiltinModule`, which does not
 *     exist in a browser.
 *
 * `process` is defined rather than `process.versions.node` because pdf.js probes
 * the object itself (`typeof process === "object" && process + "" ===
 * "[object process]"`), not a member of it.
 * @returns the `define` entries to merge into a build.
 */
export function pdfDefines() {
  return {
    process: "undefined",
  };
}
