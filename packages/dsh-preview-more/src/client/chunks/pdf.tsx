/**
 * The pdf chunk this package ships.
 *
 * The surface itself lives in `dsh-preview-viewers`; this file exists so the
 * build keeps emitting one chunk per family under this package's own name. The
 * chunk name is a contract with the loader — `entry.ts` fetches
 * `./client.<family>.js` and the loader keys a chunk as `<package>/<file>` — so
 * the file has to stay in this package even though its contents do not.
 *
 * A re-export is not a wrapper: esbuild inlines the shared module into this
 * entry, so the emitted chunk is the same single file it was before the split,
 * and its own imports stay static (a chunk has no route for a sibling file).
 * That last point is why the build mounts the worker-inlining plugin here: the
 * pdf.js worker has to be text inside this file, not a second file beside it.
 */
export { Body, Viewer } from "dsh-preview-viewers/chunks/pdf.tsx";
