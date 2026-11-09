/**
 * The lazy chunk that carries the board's data.
 *
 * The snapshot is ~500KB of JSON and the startup bundle boots on every page
 * whether or not the tab is opened, so the data lives here and is fetched on
 * first mount. This module is the chunk's entry: it is bundled on its own and
 * must export `snapshot` for the loader's shape check.
 */
import type { TestSnapshot } from "./model.ts";
import data from "./data/snapshot.json" with { type: "json" };

/** The board's committed data snapshot. */
export const snapshot = data as unknown as TestSnapshot;

// No default export on purpose. The ModuleLoader factory returns
// `module.exports.default ?? module.exports`, so a default here would unwrap the
// chunk to the bare snapshot and the loader's `chunk.snapshot` check would fail
// with the data sitting right there in hand.
