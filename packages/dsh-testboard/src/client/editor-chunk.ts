/**
 * Entry of the lazy editor chunk.
 *
 * A named export rather than a default: the ModuleLoader factory unwraps
 * `module.exports.default ?? module.exports`, so a default here would hand the
 * loader the bare component and its `renderer` marker would disappear.
 */
export const renderer = "codemirror";

export { CodeView } from "./code-view.tsx";
