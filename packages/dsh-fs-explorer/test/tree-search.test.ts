/**
 * The tree's search, driven without a renderer.
 *
 * The two paths answer different questions and must not be confused: the index
 * path answers "which file in this workspace", the fallback answers "which file
 * I have already seen listed". What is worth pinning is that the panel can tell
 * the two apart, because it puts that difference on screen.
 */
import { describe, expect, it } from "vitest";

import type { TreeLevel } from "../src/client/model.ts";
import {
  createFileReferencesResolver,
  filterListedEntries,
  isFileReferencesFace,
  listedEntries,
  normalizeReferences,
  referenceRows,
  resultDirectory,
  revealChain,
  searchQuery,
} from "../src/client/tree-search.ts";

/** A ready level holding the given names. */
function ready(names: readonly { readonly name: string; readonly kind: "directory" | "file" }[]): TreeLevel {
  return { status: "ready", nodes: names, truncated: false, total: names.length };
}

describe("resolving the workspace index", () => {
  it("finds the face on the context directly", () => {
    const face = { list: async () => ({ ok: true as const, value: [] }) };
    const resolve = createFileReferencesResolver({ fileReferences: face });
    expect(resolve?.()).toBe(face);
  });

  it("finds it under the dotted remote namespace", () => {
    const face = { list: async () => ({ ok: true as const, value: [] }) };
    const resolve = createFileReferencesResolver({ get: name => (name === "remote.fileReferences" ? face : undefined) });
    expect(resolve?.()).toBe(face);
  });

  it("answers undefined rather than throwing on an unmounted stub", () => {
    const resolve = createFileReferencesResolver({
      get: () => {
        throw new Error("service not mounted");
      },
    });
    expect(resolve?.()).toBeUndefined();
  });

  it("re-reads the context, so a late mount starts working", () => {
    let face: unknown;
    const resolve = createFileReferencesResolver({ get: name => (name === "remote.fileReferences" ? face : undefined) });
    expect(resolve?.()).toBeUndefined();
    const mounted = { list: async () => ({ ok: true as const, value: [] }) };
    face = mounted;
    expect(resolve?.()).toBe(mounted);
  });

  it("rejects a stub without the list method", () => {
    expect(isFileReferencesFace({})).toBe(false);
    expect(isFileReferencesFace({ list: "nope" })).toBe(false);
    expect(isFileReferencesFace(null)).toBe(false);
  });
});

describe("normalizing an index answer", () => {
  it("unwraps the Remote envelope", () => {
    expect(normalizeReferences({ ok: true, value: [{ path: "a/b.ts", kind: "file" }] })).toEqual([
      { path: "a/b.ts", kind: "file" },
    ]);
  });

  it("accepts a bare array from a direct service", () => {
    expect(normalizeReferences([{ path: "a.ts", kind: "file" }])).toEqual([{ path: "a.ts", kind: "file" }]);
  });

  it("reads a refusal as no candidates", () => {
    expect(normalizeReferences({ ok: false, error: { code: "nope" } })).toEqual([]);
  });

  it("drops entries the row vocabulary cannot paint", () => {
    expect(
      normalizeReferences([
        { path: "keep.ts", kind: "file" },
        { path: "", kind: "file" },
        { path: "no-kind.ts" },
        { path: "weird.ts", kind: "socket" },
        null,
      ]),
    ).toEqual([{ path: "keep.ts", kind: "file" }]);
  });
});

describe("searchQuery", () => {
  it("trims and rejects an empty query", () => {
    expect(searchQuery("  docs  ")).toBe("docs");
    expect(searchQuery("   ")).toBeUndefined();
  });
});

describe("referenceRows", () => {
  it("builds flat entry rows from the index's own order", () => {
    const rows = referenceRows(
      [
        { path: "src/client/tree.tsx", kind: "file" },
        { path: "docs", kind: "directory" },
      ],
      undefined,
    );
    expect(rows.map(row => (row.type === "entry" ? [row.name, row.path, row.depth, row.kind] : null))).toEqual([
      ["tree.tsx", "src/client/tree.tsx", 0, "file"],
      ["docs", "docs", 0, "directory"],
    ]);
  });

  it("carries the file's Git status onto the result row", () => {
    const rows = referenceRows([{ path: "src/a.ts", kind: "file" }], {
      "src/a.ts": { status: "modified", additions: null, deletions: null },
    });
    expect(rows[0]?.type === "entry" ? rows[0].status : undefined).toBe("modified");
  });

  it("drops duplicate and empty paths", () => {
    const rows = referenceRows(
      [
        { path: "a.ts", kind: "file" },
        { path: "a.ts", kind: "file" },
        { path: "./b.ts", kind: "file" },
      ],
      undefined,
    );
    expect(rows.map(row => (row.type === "entry" ? row.path : ""))).toEqual(["a.ts", "b.ts"]);
  });
});

describe("resultDirectory", () => {
  it("answers the parent path a row would otherwise spell by indentation", () => {
    expect(resultDirectory("src/client/tree.tsx")).toBe("src/client");
    expect(resultDirectory("README.md")).toBe("");
  });
});

describe("the loaded-row fallback", () => {
  const levels = new Map<string, TreeLevel>([
    ["", ready([{ name: "src", kind: "directory" }, { name: "README.md", kind: "file" }])],
    ["src", ready([{ name: "tree.tsx", kind: "file" }, { name: "view.tsx", kind: "file" }])],
  ]);

  it("names every entry the ledger holds, not only the expanded ones", () => {
    const paths = listedEntries(levels).map(entry => entry.path);
    expect(paths).toEqual(["src", "README.md", "src/tree.tsx", "src/view.tsx"]);
  });

  it("filters by name, case-insensitively", () => {
    const entries = listedEntries(levels);
    expect(filterListedEntries(entries, "TREE").map(entry => entry.path)).toEqual(["src/tree.tsx"]);
    expect(filterListedEntries(entries, "readme").map(entry => entry.path)).toEqual(["README.md"]);
  });

  it("matches a row's own name, never its parent's", () => {
    // The directory row matches because `src` is its name; its children do not,
    // because `src` appears only in their directory part and their own rows
    // would then carry no visible reason for the hit.
    const entries = listedEntries(levels);
    expect(filterListedEntries(entries, "src").map(entry => entry.path)).toEqual(["src"]);
  });
});

describe("revealChain", () => {
  it("names the ancestors a result row needs opened", () => {
    expect(revealChain("src/client/tree.tsx")).toEqual(["src", "src/client"]);
    expect(revealChain("README.md")).toEqual([]);
  });
});
