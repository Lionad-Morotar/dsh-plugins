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
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";

import { FAMILY_CHUNKS, MERMAID_CHUNK, PREVIEW_CHUNK } from "../src/shared.ts";

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
 * Symbols that only appear when mermaid is bundled.
 *
 * Mirrors `MERMAID_MARKERS` in `scripts/build.mjs`. The bare word `mermaid` is
 * not one of them: the route table names the file `client.mermaid.js`, so both
 * bundles contain it by design and a check on it would fail on a correct build.
 * These are mermaid's own namespace, its layout engine and two of its
 * dependencies, which survive minification as property names and literals.
 */
const MERMAID_MARKERS = ["@mermaid-js", "cytoscape", "dagre", "mermaidAPI"];

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

  it("carries no mermaid", async () => {
    // The startup bundle is parsed on every conversation boot, so the diagram
    // renderer may not be in it under any circumstances.
    const entry = await entryBundle();
    for (const marker of MERMAID_MARKERS) {
      expect(entry.includes(marker), `${marker} leaked into the entry`).toBe(false);
    }
  });
});

/**
 * The family chunks draw bytes and must not know about the language catalogue.
 *
 * This reads the committed `lib/` rather than bundling in memory: two of the five
 * chunks need the build's Draco and pdf-worker plugins to bundle at all, and
 * duplicating that wiring here would test a different pipeline than the one that
 * ships. `lib/` is the artifact the host loads, so it is also the honest target.
 *
 * The regression this guards against: `family-view.tsx` imported the failure
 * classifier from `preview.ts`, which re-exports the catalogue, so all 74
 * language rows landed in every family chunk (+5.5 KB each) and nothing failed.
 * The ids below exist only in the catalogue, so their presence is proof the
 * table arrived.
 */
describe("family chunk boundary", () => {
  const CATALOGUE_ONLY_IDS = ["dockercompose", "jsx-tags", "markdown_latex_combined", "cpp_embedded_latex"];

  for (const [family, file] of Object.entries(FAMILY_CHUNKS)) {
    it(`keeps the language catalogue out of ${family}`, () => {
      const chunk = readFileSync(join(packageRoot, "lib", file), "utf8");
      for (const id of CATALOGUE_ONLY_IDS) {
        expect(chunk.includes(id), `${id} leaked into ${file}`).toBe(false);
      }
    });
  }
});

/**
 * The committed artifacts, read from `lib/` rather than rebuilt.
 *
 * These are the files the host actually loads, so they are the honest target for
 * an assertion about what a reader downloads. `lib/` is a committed product here
 * (profiles never rebuild), which is also why `build --check` exists.
 */
describe("committed artifacts", () => {
  const libFiles = readdirSync(join(packageRoot, "lib")).sort();

  it("emits 23 files: two host halves and 21 chunks", () => {
    // 2 host files (index.js, client.js) plus the preview chunk, the diagram
    // chunk, five family chunks and fourteen language chunks.
    expect(libFiles).toHaveLength(23);
    expect(libFiles).toContain("index.js");
    expect(libFiles).toContain("client.js");
    expect(libFiles).toContain(MERMAID_CHUNK.chunk);
  });

  it("ships the diagram chunk as its own file", () => {
    const chunk = readFileSync(join(packageRoot, "lib", MERMAID_CHUNK.chunk), "utf8");
    // The exported module object, which is what survives minification: the
    // `renderer` constant is folded into the literal, so the string `"mermaid"`
    // itself is gone by the time this file is written.
    expect(chunk).toMatch(/\{renderer:\w+,renderDiagram:\w+\}/u);
    for (const marker of MERMAID_MARKERS) {
      expect(chunk.includes(marker), `${marker} is missing from ${MERMAID_CHUNK.chunk}`).toBe(true);
    }
  });

  it("keeps mermaid out of the preview chunk", () => {
    // The preview chunk is fetched by every source file and every README; the
    // diagram renderer is fetched only by a document that fences one.
    const preview = readFileSync(join(packageRoot, "lib", PREVIEW_CHUNK.chunk), "utf8");
    expect(preview).toContain(`"${MERMAID_CHUNK.chunk}"`);
    for (const marker of MERMAID_MARKERS) {
      expect(preview.includes(marker), `${marker} leaked into ${PREVIEW_CHUNK.chunk}`).toBe(false);
    }
  });

  it("keeps the diagram chunk inside its size budget", () => {
    // 1,700,000 B gzipped is the ceiling `scripts/build.mjs` enforces; measured
    // at about 1.53 MB, which leaves roughly a tenth of headroom for an upgrade.
    const gzipped = gzipSync(readFileSync(join(packageRoot, "lib", MERMAID_CHUNK.chunk))).length;
    expect(gzipped).toBeLessThanOrEqual(1_700_000);
  });
});
