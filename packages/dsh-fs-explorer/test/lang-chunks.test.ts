import { describe, expect, it } from "vitest";

import {
  assertLanguageChunkMarkers,
  assertLanguageChunkSet,
  chunkFileName,
  languageChunkIds,
  languagesOfChunk,
} from "dsh-text-languages/build/lang-chunks.mjs";

/**
 * The three failures these assertions exist for are the three ways a lazy chunk
 * set goes wrong without anyone noticing: a language the catalogue promises but
 * nothing built, a chunk nobody asked for, and a chunk wired to the wrong
 * grammar. Each one is silent at runtime until a reader opens that file type, so
 * they are checked here instead.
 */
describe("language chunk ids", () => {
  it("reads the blocks from the catalogue rather than a copied list", async () => {
    const blocks = await languageChunkIds();
    expect(blocks).toHaveLength(14);
    expect(blocks.filter(block => block.startsWith("batch-")).sort()).toEqual([
      "batch-datadoc",
      "batch-script",
      "batch-systems",
      "batch-webstyle",
    ]);
  });

  it("names each artifact after its block", () => {
    expect(chunkFileName("python")).toBe("client.lang-python.js");
    expect(chunkFileName("batch-script")).toBe("client.lang-batch-script.js");
  });

  it("knows which languages a block draws", async () => {
    const languages = await languagesOfChunk("batch-systems");
    expect(languages).toContain("cpp");
    expect(languages).toContain("csharp");
    expect(await languagesOfChunk("no-such-block")).toEqual([]);
  });
});

describe("assertLanguageChunkSet", () => {
  const ids = ["python", "json"];

  it("accepts a set that matches the catalogue", () => {
    expect(() =>
      assertLanguageChunkSet({ ids, emitted: ["client.lang-python.js", "client.lang-json.js"] }),
    ).not.toThrow();
  });

  it("rejects a missing chunk and names it", () => {
    expect(() => assertLanguageChunkSet({ ids, emitted: ["client.lang-python.js"] })).toThrow(
      /client\.lang-json\.js/u,
    );
  });

  it("rejects an extra chunk and names it", () => {
    expect(() =>
      assertLanguageChunkSet({
        ids,
        emitted: ["client.lang-python.js", "client.lang-json.js", "client.lang-cobol.js"],
      }),
    ).toThrow(/client\.lang-cobol\.js/u);
  });

  it("reports both directions in one message", () => {
    expect(() => assertLanguageChunkSet({ ids, emitted: ["client.lang-cobol.js"] })).toThrow(
      /client\.lang-python\.js[\s\S]*client\.lang-cobol\.js|client\.lang-cobol\.js[\s\S]*client\.lang-python\.js/u,
    );
  });
});

describe("assertLanguageChunkMarkers", () => {
  const emitted = ["client.lang-python.js", "client.lang-json.js"];
  // The shape esbuild actually produces: the export binding and the id literal
  // end up apart, so the assertion cannot rely on them being adjacent.
  const texts = {
    "client.lang-python.js": 'var xu="python";function Su(){return Ma()}export{Su as language,xu as renderer}',
    "client.lang-json.js": 'var yq="json";function Zq(){return Jq()}export{Zq as language,yq as renderer}',
  };

  it("accepts chunks that carry their own marker", () => {
    expect(() => assertLanguageChunkMarkers({ emitted, texts })).not.toThrow();
  });

  it("rejects a chunk missing its own marker", () => {
    expect(() =>
      assertLanguageChunkMarkers({
        emitted,
        texts: { ...texts, "client.lang-python.js": "function Su(){return Ma()}export{Su as language}" },
      }),
    ).toThrow(/client\.lang-python\.js/u);
  });

  it("rejects a chunk that carries another language's marker", () => {
    // The failure this catches: an entry file that imports the wrong grammar, so
    // .py files would be coloured as JSON and nothing else would notice.
    expect(() =>
      assertLanguageChunkMarkers({
        emitted,
        texts: { ...texts, "client.lang-python.js": 'var yq="json";export{yq as renderer}' },
      }),
    ).toThrow(/client\.lang-python\.js/u);
  });

  it("rejects a chunk that exports another language's renderer as well as its own", () => {
    // Two renderer bindings in one chunk means the entry was assembled from two
    // language files, so which grammar it actually returns is a coin toss.
    expect(() =>
      assertLanguageChunkMarkers({
        emitted,
        texts: {
          ...texts,
          "client.lang-python.js": 'var xu="python",yq="json";export{xu as renderer,yq as renderer}',
        },
      }),
    ).toThrow(/client\.lang-python\.js/u);
  });

  it("accepts a chunk whose text mentions another language without exporting it", () => {
    // Grammars contain each other's names in their own vocabulary, so a bare id
    // literal is not evidence of a wrong wiring; only the export binding is.
    expect(() =>
      assertLanguageChunkMarkers({
        emitted,
        texts: {
          ...texts,
          "client.lang-python.js": 'var xu="python",yq="json";function Su(){return yq}export{Su as language,xu as renderer}',
        },
      }),
    ).not.toThrow();
  });

  it("rejects a chunk with no text at all", () => {
    expect(() => assertLanguageChunkMarkers({ emitted, texts: {} })).toThrow(/client\.lang-python\.js/u);
  });
});
