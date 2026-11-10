/**
 * The workflow catalogue panel's pure decisions.
 *
 * The panel is a DOM job for `skill-enhancer.tsx`; what is decided here is what
 * to show and where to put it, and every one of these has a failure mode that is
 * silent rather than loud:
 *
 *   - the open condition, because a panel that opens one token too late never
 *     appears and one that opens a token too early covers the composer while the
 *     user is still typing a flag;
 *   - the ranking, because a prefix hit buried under a summary hit is a list that
 *     looks broken to anyone who typed the first letters of the slug;
 *   - the highlight ranges, because an offset computed against the wrong string
 *     marks the wrong characters and the row stops explaining itself.
 */
import { describe, expect, it } from "vitest";

import {
  catalogCompletionText,
  filterCatalog,
  highlightRanges,
  matchCatalogDraft,
} from "../src/client/catalog-panel.ts";
import type { AssistSpec } from "../src/assist-spec.ts";
import type { WorkflowEntry } from "../src/workflow-catalog.ts";

/** The declaration a workflow skill carries: one catalog panel on its `run` word. */
const RUN_ASSIST: readonly AssistSpec[] = [{ slot: "run", kind: "catalog", source: "workflows" }];

/** Every name is a skill, for cases that are about the slot rule rather than membership. */
const anySkill = (): boolean => true;

/** A catalogue in the order the host merged it. */
const ENTRIES: readonly WorkflowEntry[] = [
  { slug: "improve-arch", summary: "批量执行域深化" },
  { slug: "dev", summary: "把单个任务描述按拆解交付" },
  { slug: "devmap", summary: "自动推进蓝图" },
  { slug: "impeccable", summary: "设计施工生产线" },
];

describe("matchCatalogDraft", () => {
  it("opens on a slot word followed by one space", () => {
    expect(matchCatalogDraft("/flow-workflow run ", anySkill, RUN_ASSIST)).toEqual({
      name: "flow-workflow",
      slot: "run",
      query: "",
      start: 19,
    });
  });

  it("carries the value being typed as the query", () => {
    expect(matchCatalogDraft("/flow-workflow run dev", anySkill, RUN_ASSIST)).toEqual({
      name: "flow-workflow",
      slot: "run",
      query: "dev",
      start: 19,
    });
  });

  it("opens when the slot word follows a flag", () => {
    // `--dynamic` is a complete token of its own, so the slot word is still a
    // complete token and the panel has no reason to stay shut.
    expect(matchCatalogDraft("/flow-workflow --dynamic run ", anySkill, RUN_ASSIST)).toEqual({
      name: "flow-workflow",
      slot: "run",
      query: "",
      start: 29,
    });
  });

  it("closes once the value is finished and another token follows", () => {
    expect(matchCatalogDraft("/flow-workflow run dev extra", anySkill, RUN_ASSIST)).toBeUndefined();
  });

  it("closes on a bare slot word with no space after it", () => {
    // The slot word is not its own value: the panel opens on the space that
    // starts one.
    expect(matchCatalogDraft("/flow-workflow run", anySkill, RUN_ASSIST)).toBeUndefined();
  });

  it("closes when the trailing token is a flag", () => {
    // Two panels would otherwise hang off the same caret.
    expect(matchCatalogDraft("/flow-workflow run --", anySkill, RUN_ASSIST)).toBeUndefined();
    expect(matchCatalogDraft("/flow-workflow run --dynamic", anySkill, RUN_ASSIST)).toBeUndefined();
  });

  it("closes when the slot word is only part of a token", () => {
    expect(matchCatalogDraft("/flow-workflow runx ", anySkill, RUN_ASSIST)).toBeUndefined();
    expect(matchCatalogDraft("/flow-workflow xrun ", anySkill, RUN_ASSIST)).toBeUndefined();
  });

  it("closes when the slot word comes after the value position", () => {
    expect(matchCatalogDraft("/flow-workflow dev run", anySkill, RUN_ASSIST)).toBeUndefined();
  });

  it("closes for a skill that declares no assist", () => {
    expect(matchCatalogDraft("/flow-workflow run ", anySkill, [])).toBeUndefined();
  });

  it("closes when the declaration is for another slot", () => {
    const other: readonly AssistSpec[] = [{ slot: "review", kind: "catalog", source: "workflows" }];
    expect(matchCatalogDraft("/flow-workflow run ", anySkill, other)).toBeUndefined();
  });

  it("closes for a draft that does not open with a known skill", () => {
    expect(matchCatalogDraft("hello run ", anySkill, RUN_ASSIST)).toBeUndefined();
    expect(matchCatalogDraft("/flow-workflow run ", () => false, RUN_ASSIST)).toBeUndefined();
  });

  it("closes on an empty draft and a bare skill token", () => {
    expect(matchCatalogDraft("", anySkill, RUN_ASSIST)).toBeUndefined();
    expect(matchCatalogDraft("/flow-workflow", anySkill, RUN_ASSIST)).toBeUndefined();
    expect(matchCatalogDraft("/flow-workflow ", anySkill, RUN_ASSIST)).toBeUndefined();
  });

  it("tolerates the whitespace a user actually types", () => {
    // Tabs and repeated spaces are the same separator, and the value still starts
    // right after the last one.
    expect(matchCatalogDraft("/flow-workflow\trun ", anySkill, RUN_ASSIST)?.query).toBe("");
    expect(matchCatalogDraft("/flow-workflow  run   dev", anySkill, RUN_ASSIST)).toEqual({
      name: "flow-workflow",
      slot: "run",
      query: "dev",
      start: 22,
    });
  });

  it("never throws on adversarial drafts", () => {
    const drafts = ["/", "//", "/flow-workflow run \n", " ".repeat(100), "/flow-workflow run " + "a".repeat(5000)];
    for (const draft of drafts) {
      expect(() => matchCatalogDraft(draft, anySkill, RUN_ASSIST)).not.toThrow();
    }
  });
});

describe("filterCatalog", () => {
  it("lists everything in catalogue order for an empty query", () => {
    expect(filterCatalog(ENTRIES, "").map(entry => entry.slug)).toEqual([
      "improve-arch",
      "dev",
      "devmap",
      "impeccable",
    ]);
  });

  it("matches a slug substring case insensitively", () => {
    expect(filterCatalog(ENTRIES, "DEV").map(entry => entry.slug)).toEqual(["dev", "devmap"]);
  });

  it("matches a summary substring", () => {
    expect(filterCatalog(ENTRIES, "蓝图").map(entry => entry.slug)).toEqual(["devmap"]);
  });

  it("ranks a slug prefix hit above a slug contains hit", () => {
    // `my-dev` contains the needle but does not start with it, so it is the
    // genuine second tier; `devmap` would not do, since it starts with `dev`.
    const entries: readonly WorkflowEntry[] = [
      { slug: "my-dev", summary: "contains hit" },
      { slug: "dev", summary: "prefix hit" },
    ];

    expect(filterCatalog(entries, "dev").map(entry => entry.slug)).toEqual(["dev", "my-dev"]);
  });

  it("ranks both slug tiers above a summary hit", () => {
    const entries: readonly WorkflowEntry[] = [
      { slug: "alpha", summary: "mentions dev in prose" },
      { slug: "my-dev", summary: "contains dev" },
      { slug: "dev", summary: "prefix hit" },
    ];

    expect(filterCatalog(entries, "dev").map(entry => entry.slug)).toEqual(["dev", "my-dev", "alpha"]);
  });

  it("keeps catalogue order inside one tier", () => {
    const entries: readonly WorkflowEntry[] = [
      { slug: "one-dev", summary: "a" },
      { slug: "two-dev", summary: "b" },
    ];

    expect(filterCatalog(entries, "dev").map(entry => entry.slug)).toEqual(["one-dev", "two-dev"]);
  });

  it("returns nothing when the query matches nothing", () => {
    expect(filterCatalog(ENTRIES, "zzz")).toEqual([]);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterCatalog(ENTRIES, "  dev  ").map(entry => entry.slug)).toEqual(["dev", "devmap"]);
  });

  it("returns nothing for an empty catalogue", () => {
    expect(filterCatalog([], "dev")).toEqual([]);
  });
});

describe("highlightRanges", () => {
  it("finds one occurrence", () => {
    expect(highlightRanges("devmap", "dev")).toEqual([{ start: 0, end: 3 }]);
  });

  it("finds every occurrence, case insensitively", () => {
    expect(highlightRanges("Dev and dev", "dev")).toEqual([
      { start: 0, end: 3 },
      { start: 8, end: 11 },
    ]);
  });

  it("returns nothing for an empty query or no hit", () => {
    expect(highlightRanges("devmap", "")).toEqual([]);
    expect(highlightRanges("devmap", "zzz")).toEqual([]);
  });

  it("does not overlap ranges", () => {
    // `aa` in `aaa` must not produce two ranges sharing a character, or the
    // renderer would nest two marks over the same text.
    expect(highlightRanges("aaa", "aa")).toEqual([{ start: 0, end: 2 }]);
  });

  it("never throws on adversarial input", () => {
    expect(() => highlightRanges("a".repeat(5000), "a")).not.toThrow();
    expect(() => highlightRanges("", "x")).not.toThrow();
  });
});

describe("catalogCompletionText", () => {
  it("appends exactly one trailing space", () => {
    expect(catalogCompletionText("dev")).toBe("dev ");
  });

  it("does not double a space the slug already ends with", () => {
    expect(catalogCompletionText("dev ")).toBe("dev ");
  });
});
