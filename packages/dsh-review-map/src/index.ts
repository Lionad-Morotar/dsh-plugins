/**
 * Host half: the Loader row, and nothing else yet.
 *
 * The tab lives entirely in the client bundle, but the Loader mounts both
 * halves by package name, so this module has to exist and has to export the
 * plugin shape `{name, inject, apply}`. `apply` is empty on purpose: this slice
 * registers no route, and a host half that touched the filesystem before there
 * is anything to read would be a service dependency the tab does not need.
 *
 * `inject` is empty for the same reason, and it is the shape the Loader reads
 * before it calls `apply`: declaring a service this half does not use would
 * keep the row pending on a host that never provides it, which takes the tab
 * down with it.
 */
import { PACKAGE_NAME } from "./shared.ts";

export { PACKAGE_NAME };

/** Loader row name; matches `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/** Services the host half needs before it can apply; none yet. */
export const inject: string[] = [];

/**
 * Mount the host half.
 *
 * Empty by design: the review data routes arrive with the slice that has data
 * to serve. Keeping the function present means the export shape is already the
 * one the Loader calls, so that slice adds a body instead of a shape.
 */
export function apply(): void {
  // Nothing to register yet.
}

export default { name, inject, apply };
