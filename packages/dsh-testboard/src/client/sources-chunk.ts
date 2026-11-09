/**
 * The lazy chunk that carries every test file's source text.
 *
 * The bundle is ~2.5MB of test source and the startup bundle boots on every page
 * whether or not the tab is opened, so it lives here and is fetched on first
 * mount. This module is the chunk's entry: it is bundled on its own and must
 * export `sources` for the loader's shape check.
 */
import type { SourceBundle } from "./source.ts";
import data from "./data/sources.json" with { type: "json" };

/** Every scanned test file's text, keyed by repo-relative path. */
export const sources = data as unknown as SourceBundle;

// No default export on purpose. The ModuleLoader factory returns
// `module.exports.default ?? module.exports`, so a default here would unwrap the
// chunk to the bare bundle and the loader's `chunk.sources` check would fail
// with the data sitting right there in hand.
