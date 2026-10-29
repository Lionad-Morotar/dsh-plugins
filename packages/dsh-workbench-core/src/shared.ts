/**
 * Values both halves of the package agree on.
 *
 * The client half is what provides the service, but the host half is a Loader
 * row too and must be able to describe the package without importing browser
 * code from `lib/client.js`.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-workbench-core";

/** Cordis service name the client half provides and the feature packages inject. */
export const WORKBENCH_SERVICE = "workbench";

/**
 * Version of the workbench service contract.
 *
 * Feature packages read this from `ctx.workbench.version`; bump it whenever a
 * field they consume changes shape, so an older feature package can refuse to
 * mount instead of failing on a missing member.
 */
export const WORKBENCH_VERSION = 1;
