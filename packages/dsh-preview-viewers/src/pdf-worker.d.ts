/**
 * Build-time virtual module carrying the pdf.js worker.
 *
 * The worker cannot be fetched at runtime: pdf.js finds it by URL through
 * `GlobalWorkerOptions.workerSrc`, and a plugin's chunks are served from a
 * versioned route with no file layout to resolve against. The consuming
 * package's build provides this module's contents (see build/pdf-worker-plugin.mjs)
 * from the same pdfjs-dist it bundles, so the shipped chunk carries the exact
 * worker version its main library speaks to.
 *
 * The declaration enters a program through the reference directive in the chunk
 * that imports the module, not through an `include` pattern here: a consumer
 * compiling that chunk under its own tsconfig never lists this directory.
 */
declare module "virtual:pdf-worker" {
  /** The worker module's source text (`pdf.worker.min.mjs`). */
  export const workerSource: string;
}
