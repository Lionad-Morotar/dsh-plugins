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
 *
 * 2: `views.onChatShown` was added, and the entry now drives composer focus
 * from it, so a chat return observed by the seam no longer leaves the keyboard
 * on the clicked tab.
 *
 * 3: `registerPageCloser` was added so a mounted view can claim the host's
 * close-page fallback (⌘W) before it closes the window. Cores older than this
 * still show every view; they just cannot intercept the chord.
 */
export const WORKBENCH_VERSION = 3;
