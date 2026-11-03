/**
 * Alias storage and matching.
 *
 * These cases pin the decisions the settings page and both trigger surfaces must
 * share: an unfinished row is a legal draft but never a match, an empty query
 * never adds a menu group, and a keyword only matches at the leading edge with
 * the whitespace delimiter included in the replacement span.
 */
import { describe, expect, it } from "vitest";

import {
  ALIAS_STORAGE_KEY,
  aliasExpansion,
  createAliasStore,
  matchAliasRows,
  matchBareAliasDraft,
  matchPrefixedAliasDraft,
  normalizeAliasConfig,
  readAliasConfig,
  rowsForKeyword,
  writeAliasConfig,
  type AliasConfig,
  type AliasStorage,
} from "../src/client/alias-store.ts";

/** An in-memory storage document. */
function memoryStorage(initial?: string): AliasStorage & { readonly document: Map<string, string> } {
  const document = new Map<string, string>();
  if (initial !== undefined) document.set(ALIAS_STORAGE_KEY, initial);
  return {
    document,
    getItem: key => document.get(key) ?? null,
    setItem: (key, value) => {
      document.set(key, value);
    },
  };
}

/** One configured row. */
function row(keyword: string, target: string, params = ""): {
  id: string;
  keyword: string;
  target: string;
  params: string;
} {
  return { id: `id-${keyword}-${target}`, keyword, target, params };
}

/** A config with rows. */
function config(rows: ReturnType<typeof row>[], prefix = true): AliasConfig {
  return { prefix, rows };
}

describe("readAliasConfig", () => {
  it("returns the empty document for a missing or corrupt value", () => {
    expect(readAliasConfig(undefined)).toEqual({ prefix: true, rows: [] });
    expect(readAliasConfig(memoryStorage("{oops"))).toEqual({ prefix: true, rows: [] });
    expect(readAliasConfig(memoryStorage(JSON.stringify({ rows: "nope" })))).toEqual({
      prefix: true,
      rows: [],
    });
  });

  it("keeps an unfinished row as a draft instead of dropping it", () => {
    const stored = JSON.stringify({
      v: 1,
      prefix: false,
      rows: [{ id: "a", keyword: "", target: "", params: "" }],
    });
    expect(readAliasConfig(memoryStorage(stored))).toEqual({
      prefix: false,
      rows: [{ id: "a", keyword: "", target: "", params: "" }],
    });
  });

  it("mints ids for old documents and de-duplicates colliding ones", () => {
    const normalized = normalizeAliasConfig({
      prefix: true,
      rows: [
        { keyword: "wf", target: "flow-workflow" },
        { id: "alias-1", keyword: "w", target: "flow-web" },
      ],
    });
    expect(new Set(normalized.rows.map(item => item.id)).size).toBe(2);
  });
});

describe("writeAliasConfig", () => {
  it("round-trips the document", () => {
    const storage = memoryStorage();
    const document = config([row("wf", "flow-workflow", "run")], false);
    writeAliasConfig(storage, document);
    expect(readAliasConfig(storage)).toEqual(document);
  });

  it("survives a storage that throws", () => {
    const storage: AliasStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(() => writeAliasConfig(storage, config([row("wf", "flow-workflow")]))).not.toThrow();
  });
});

describe("createAliasStore", () => {
  it("adds, edits and removes rows, publishing each time", () => {
    const storage = memoryStorage();
    const store = createAliasStore(storage, () => "row-1");
    const seen: string[] = [];
    store.subscribe(() => seen.push(store.getSnapshot().rows.length > 0 ? "rows" : "empty"));

    const id = store.addRow();
    expect(id).toBe("row-1");
    expect(store.getSnapshot().rows).toEqual([{ id, keyword: "", target: "", params: "" }]);

    store.updateRow(id, { keyword: "wf", target: "flow-workflow", params: "run" });
    expect(store.getSnapshot().rows[0]).toEqual({
      id,
      keyword: "wf",
      target: "flow-workflow",
      params: "run",
    });
    expect(readAliasConfig(storage).rows).toHaveLength(1);

    store.removeRow(id);
    expect(store.getSnapshot().rows).toEqual([]);
    expect(seen.length).toBeGreaterThanOrEqual(3);
  });

  it("toggles the prefix only when it changes", () => {
    const store = createAliasStore(undefined, () => "row-1");
    let changes = 0;
    store.subscribe(() => {
      changes += 1;
    });
    store.setPrefix(true);
    expect(changes).toBe(0);
    store.setPrefix(false);
    expect(store.getSnapshot().prefix).toBe(false);
    expect(changes).toBe(1);
  });
});

describe("aliasExpansion", () => {
  it("builds the canonical invocation with one trailing space", () => {
    expect(aliasExpansion(row("wf", "flow-workflow"))).toBe("/flow-workflow ");
    expect(aliasExpansion(row("wf", "/flow-workflow", "run"))).toBe("/flow-workflow run ");
    expect(aliasExpansion(row("wf", "flow-workflow", "  run  "))).toBe("/flow-workflow run ");
  });

  it("refuses an incomplete target", () => {
    expect(aliasExpansion(row("wf", "  "))).toBe("");
  });
});

describe("matchAliasRows", () => {
  it("hides the group for an empty query unless asked", () => {
    const document = config([row("wf", "flow-workflow"), row("gw", "git-work")]);
    expect(matchAliasRows(document, "")).toEqual([]);
    expect(matchAliasRows(document, "", true)).toHaveLength(2);
  });

  it("ranks exact, prefix then substring, preserving source order inside a rank", () => {
    const document = config([
      row("awfx", "a"),
      row("wf", "flow-workflow"),
      row("wfx", "b"),
      row("gwf", "c"),
    ]);
    expect(matchAliasRows(document, "wf").map(item => item.target)).toEqual([
      "flow-workflow",
      "b",
      "a",
      "c",
    ]);
  });

  it("ignores rows missing a keyword or target", () => {
    const document = config([row("", "flow-workflow"), row("wf", "  "), row("gw", "git-work")]);
    expect(matchAliasRows(document, "w", true).map(item => item.target)).toEqual(["git-work"]);
    expect(rowsForKeyword(document, "wf")).toEqual([]);
  });

  it("is case-insensitive and tolerates a slash typed into the query", () => {
    const document = config([row("WF", "flow-workflow")]);
    expect(matchAliasRows(document, "/wf")).toHaveLength(1);
    expect(rowsForKeyword(document, "/WF")).toHaveLength(1);
  });
});

describe("draft matching", () => {
  const document = config([row("wf", "flow-workflow", "run"), row("gw", "git-work", "")]);

  it("matches the bare keyword with and without its delimiter", () => {
    expect(matchBareAliasDraft(document, "wf")?.end).toBe(2);
    const spaced = matchBareAliasDraft(document, "wf ");
    expect(spaced?.end).toBe(3);
    expect(spaced?.query).toBe("wf");
  });

  it("does not open on a prefix of a keyword", () => {
    expect(matchBareAliasDraft(document, "w")).toBeUndefined();
    expect(matchBareAliasDraft(document, "wfx")).toBeUndefined();
  });

  it("matches only the leading token", () => {
    expect(matchBareAliasDraft(document, "say wf")).toBeUndefined();
    expect(matchBareAliasDraft(document, "/wf ")).toBeUndefined();
  });

  it("matches a prefixed keyword and includes the delimiter in the span", () => {
    const match = matchPrefixedAliasDraft(document, "/wf ");
    expect(match?.query).toBe("wf");
    expect(match?.start).toBe(0);
    expect(match?.end).toBe(4);
    expect(matchPrefixedAliasDraft(document, "wf ")).toBeUndefined();
    expect(matchPrefixedAliasDraft(document, "/wfx ")).toBeUndefined();
  });
});
