/**
 * The tuning panel as its own chunk.
 *
 * lil-gui is half the weight of this plugin and is only reachable from one
 * button, so it is not in the entry bundle. The Client's module loader serves
 * package-local chunks by file name, which is why this file is built to
 * `lib/client.gui.js` and fetched as `require.async("./client.gui.js")`.
 *
 * A chunk is a plugin module like any other: it must register itself with the id
 * `<package>/<file name>`, which the build wrapper does, and it bundles its own
 * dependencies because they are not platform seeds.
 */
export { createGui, rangeAround } from "./gui.ts";
export type { GuiCallbacks, GuiHandle, GuiOptions } from "./gui.ts";
