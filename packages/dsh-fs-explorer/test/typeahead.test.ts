/**
 * Prefix jump decisions, driven without a renderer.
 *
 * The tree flattens to one list, so the interesting questions are which slice
 * one keystroke searches and how a run of characters folds into a name. Both
 * are pure, which is what keeps the keyboard gesture assertable.
 */
import { describe, expect, it } from "vitest";

import { firstChildIndex, flattenTree, type TreeLevel, type TreeRow } from "../src/client/model.ts";
import {
  entriesInScope,
  liveTypeaheadQuery,
  TYPEAHEAD_WINDOW_MS,
  typeaheadScopeKey,
  typeaheadStep,
  type TypeaheadInput,
} from "../src/client/typeahead.ts";

/** A ready level holding the given names, directories first by convention of the caller. */
function ready(names: readonly { readonly name: string; readonly kind: "directory" | "file" }[]): TreeLevel {
  return {
    status: "ready",
    nodes: names.map(entry => ({ name: entry.name, kind: entry.kind })),
    truncated: false,
    total: names.length,
  };
}

/**
 * The shape from the screenshot: `app` expanded over `assets` and `docs`,
 * `docs` itself expanded over three files.
 */
function fixture(): TreeRow[] {
  const levels = new Map<string, TreeLevel>([
    [
      "",
      ready([
        { name: "app", kind: "directory" },
        { name: "docs", kind: "directory" },
        { name: "README.md", kind: "file" },
      ]),
    ],
    [
      "app",
      ready([
        { name: "assets", kind: "directory" },
        { name: "content", kind: "directory" },
        { name: "docs", kind: "directory" },
        { name: "graphify-out", kind: "directory" },
      ]),
    ],
    [
      "app/docs",
      ready([
        { name: "a.md", kind: "file" },
        { name: "b.md", kind: "file" },
        { name: "data.md", kind: "file" },
      ]),
    ],
  ]);
  return flattenTree(levels, new Set(["app", "app/docs"]));
}

/** Index of one entry path, failing loudly when the fixture moved. */
function at(rows: readonly TreeRow[], path: string): number {
  const index = rows.findIndex(row => row.type === "entry" && row.path === path);
  if (index < 0) throw new Error(`missing ${path}`);
  return index;
}

/** A keystroke with the modifiers a plain character carries. */
function press(over: Partial<TypeaheadInput> & Pick<TypeaheadInput, "names" | "key">): TypeaheadInput {
  return {
    query: "",
    composing: false,
    alt: false,
    meta: false,
    ctrl: false,
    repeat: false,
    active: -1,
    ...over,
  };
}

/** Basenames of one scope, the list the step function actually compares. */
function namesOf(rows: readonly TreeRow[], key: string): string[] {
  return entriesInScope(rows, key).map(index => {
    const row = rows[index];
    if (row?.type !== "entry") throw new Error("scope pointed at a status row");
    return row.name;
  });
}

describe("typeahead scope", () => {
  const rows = fixture();

  it("searches a focused directory's own children, not its grandchildren", () => {
    const cursor = at(rows, "app");
    expect(typeaheadScopeKey(rows, cursor)).toBe("app");
    const indexes = entriesInScope(rows, "app");
    expect(indexes.map(index => (rows[index] as { path: string }).path)).toEqual([
      "app/assets",
      "app/content",
      "app/docs",
      "app/graphify-out",
    ]);
  });

  it("searches a focused file's siblings", () => {
    expect(typeaheadScopeKey(rows, at(rows, "app/docs/b.md"))).toBe("app/docs");
    expect(namesOf(rows, "app/docs")).toEqual(["a.md", "b.md", "data.md"]);
  });

  it("treats the workspace root as the scope when the cursor rests on a root row", () => {
    expect(typeaheadScopeKey(rows, at(rows, "README.md"))).toBe("");
    expect(namesOf(rows, "")).toEqual(["app", "docs", "README.md"]);
  });

  it("finds nothing under a directory that is collapsed, because its rows are not on screen", () => {
    expect(entriesInScope(rows, "docs")).toEqual([]);
    expect(entriesInScope(rows, "app/missing")).toEqual([]);
  });

  it("starts at the root when no cursor rests anywhere", () => {
    expect(typeaheadScopeKey(rows, undefined)).toBe("");
  });
});

describe("drill landing", () => {
  const rows = fixture();

  it("lands on the first child of a directory once it is open", () => {
    const child = firstChildIndex(rows, "app");
    expect(child).toBe(at(rows, "app/assets"));
    // Deeper levels answer with their own first row, not the parent's.
    expect(firstChildIndex(rows, "app/docs")).toBe(at(rows, "app/docs/a.md"));
  });

  it("waits rather than guessing when the directory is collapsed or unknown", () => {
    expect(firstChildIndex(rows, "docs")).toBeUndefined();
    expect(firstChildIndex(rows, "missing")).toBeUndefined();
  });

  it("keeps waiting while the opened directory only shows a placeholder row", () => {
    const loading: TreeRow[] = [
      { type: "entry", path: "app", name: "app", kind: "directory", depth: 0, expanded: true },
      { type: "status", key: "app:loading", path: "app", depth: 1, state: "loading" },
    ];
    expect(firstChildIndex(loading, "app")).toBeUndefined();
  });
});

describe("typeahead step", () => {
  const names = ["assets", "content", "docs", "graphify-out"];

  it("accumulates a prefix and stays on the row it already spells", () => {
    const first = typeaheadStep(press({ names, key: "d", active: -1 }));
    expect(first).toEqual({ kind: "jump", index: 2, query: "d" });
    // `do` still names `docs`, so the cursor does not leap past it.
    const second = typeaheadStep(press({ names, key: "o", query: "d", active: 2 }));
    expect(second).toEqual({ kind: "jump", index: 2, query: "do" });
    expect(typeaheadStep(press({ names, key: "c", query: "do", active: 2 }))).toEqual({
      kind: "jump",
      index: 2,
      query: "doc",
    });
    expect(typeaheadStep(press({ names, key: "s", query: "doc", active: 2 }))).toEqual({
      kind: "jump",
      index: 2,
      query: "docs",
    });
  });

  it("matches case-insensitively and wraps to the first hit when nothing later matches", () => {
    expect(typeaheadStep(press({ names, key: "G" }))).toEqual({ kind: "jump", index: 3, query: "g" });
    expect(typeaheadStep(press({ names, key: "a", active: 3 }))).toEqual({ kind: "jump", index: 0, query: "a" });
  });

  it("cycles to the next name when the same single character is typed again", () => {
    const doubled = ["data.md", "docs.md", "draft.md"];
    const first = typeaheadStep(press({ names: doubled, key: "d" }));
    expect(first).toEqual({ kind: "jump", index: 0, query: "d" });
    expect(typeaheadStep(press({ names: doubled, key: "d", query: "d", active: 0 }))).toEqual({
      kind: "jump",
      index: 1,
      query: "d",
    });
    expect(typeaheadStep(press({ names: doubled, key: "d", query: "d", active: 2 }))).toEqual({
      kind: "jump",
      index: 0,
      query: "d",
    });
  });

  it("keeps the prefix on a miss so one stray key does not throw the spelling away", () => {
    expect(typeaheadStep(press({ names, key: "z", query: "doc", active: 2 }))).toEqual({ kind: "miss" });
  });

  it("ignores chords, key repeat and an unfinished composition, and clears on Escape", () => {
    expect(typeaheadStep(press({ names, key: "d", meta: true })).kind).toBe("ignore");
    expect(typeaheadStep(press({ names, key: "d", ctrl: true })).kind).toBe("ignore");
    expect(typeaheadStep(press({ names, key: "d", alt: true })).kind).toBe("ignore");
    expect(typeaheadStep(press({ names, key: "d", repeat: true })).kind).toBe("ignore");
    expect(typeaheadStep(press({ names, key: "d", composing: true })).kind).toBe("ignore");
    expect(typeaheadStep(press({ names, key: "ArrowDown" })).kind).toBe("ignore");
    expect(typeaheadStep(press({ names, key: "Escape", query: "doc" }))).toEqual({ kind: "clear" });
  });
});

describe("typeahead window", () => {
  it("forgets the prefix once the pause has elapsed and keeps it just inside the window", () => {
    expect(liveTypeaheadQuery("doc", 1_000, 1_000 + TYPEAHEAD_WINDOW_MS)).toBe("doc");
    expect(liveTypeaheadQuery("doc", 1_000, 1_000 + TYPEAHEAD_WINDOW_MS + 1)).toBe("");
  });
});
