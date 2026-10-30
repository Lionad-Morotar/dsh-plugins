/**
 * The startup bundle's cost model, asserted from source.
 *
 * `scripts/build.mjs` already fails the build when an engine leaks into the
 * entry, but that gate only runs on a build. This test bundles the entry the
 * same way and checks the boundary from the source graph, so a change that
 * imports three into the entry fails `pnpm test` even when nobody rebuilt.
 *
 * The bundle is built in memory rather than read out of `lib/`: a committed
 * artifact would make the test pass or fail on build ordering instead of on the
 * code in front of it.
 */
import { build } from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { FAMILY_CHUNKS, PREVIEW_CHUNK } from "../src/shared.ts";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Platform modules the host seeds; mirrors `CLIENT_EXTERNALS` in build.mjs.
 *
 * A mismatch would only change what is inlined, never whether an engine symbol
 * appears, which is the property under test here.
 */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/**
 * Symbols that belong to a lazy chunk's engine, never to the entry.
 *
 * These are the same markers `scripts/build.mjs` uses: a library's own string
 * literal or property name, which survives minification.
 */
const ENGINE_MARKERS = ["THREE.WebGLRenderer", "UTIF", "_ProcessDxfEntity"];

/** The editor and Markdown symbols the entry may not carry either. */
const EDITOR_MARKERS = ["@codemirror", "codemirror", "react-markdown", "remark-gfm", "marked"];

/**
 * Bundle the browser entry exactly as the build does, once per run.
 *
 * The result is memoized because both assertions read the same artifact and
 * bundling it twice would only make the suite slower.
 */
const entryBundle = (() => {
  let pending: Promise<string> | null = null;
  return (): Promise<string> => {
    pending ??= build({
      entryPoints: [join(packageRoot, "src", "client", "entry.ts")],
      bundle: true,
      format: "cjs",
      platform: "browser",
      target: "es2022",
      minify: true,
      write: false,
      legalComments: "none",
      external: CLIENT_EXTERNALS,
      jsx: "automatic",
      logLevel: "silent",
    }).then(result => {
      const output = result.outputFiles?.[0];
      if (output === undefined) throw new Error("esbuild produced nothing for the client entry");
      return output.text;
    });
    return pending;
  };
})();

describe("client entry bundle", () => {
  it("names every lazy chunk it will fetch", async () => {
    const entry = await entryBundle();
    for (const file of [PREVIEW_CHUNK.chunk, ...Object.values(FAMILY_CHUNKS)]) {
      expect(entry, file).toContain(`"${file}"`);
    }
  });

  it("carries no renderer engine or editor", async () => {
    const entry = await entryBundle();
    for (const marker of [...ENGINE_MARKERS, ...EDITOR_MARKERS]) {
      expect(entry.includes(marker), `${marker} leaked into the entry`).toBe(false);
    }
  });
});
