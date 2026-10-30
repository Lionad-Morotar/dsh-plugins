import { describe, expect, it } from "vitest";

import { parseReflogAction, selectMergeEntries, type ReflogEntry } from "../src/merge-steer/classify.ts";

function entry(sha: string, subject: string, time = 1_700_000_000): ReflogEntry {
  return { sha, time, subject };
}

describe("parseReflogAction", () => {
  it("accepts a merge commit action", () => {
    expect(parseReflogAction("merge feature/x: Merge made by the 'ort' strategy.", false)).toEqual({
      kind: "merge",
      sources: ["feature/x"],
      mode: "merge",
    });
  });

  it("marks a fast-forward merge", () => {
    expect(parseReflogAction("merge feature/x: Fast-forward", false)).toEqual({
      kind: "merge",
      sources: ["feature/x"],
      mode: "fast-forward",
    });
  });

  it("accepts a conflict-resolved commit as a merge with an unknown source", () => {
    expect(parseReflogAction("commit (merge): manual merge commit", false)).toEqual({
      kind: "merge",
      sources: [],
      mode: "merge",
    });
  });

  it("keeps every source of an octopus merge", () => {
    expect(parseReflogAction("merge a b c: Merge made by the 'octopus' strategy.", false)).toEqual({
      kind: "merge",
      sources: ["a", "b", "c"],
      mode: "merge",
    });
  });

  it("excludes pull by default and includes it on request", () => {
    expect(parseReflogAction("pull -q --ff-only: Fast-forward", false)).toBeNull();
    expect(parseReflogAction("pull -q --ff-only: Fast-forward", true)).toEqual({
      kind: "pull",
      sources: [],
      mode: "fast-forward",
    });
  });

  it("ignores ordinary commits, resets, rebases, fetches and checkouts", () => {
    for (const subject of [
      "commit: feat: add thing",
      "commit (amend): feat: add thing",
      "reset: moving to HEAD~1",
      "rebase (finish): returning to refs/heads/main",
      "fetch origin: fast-forward",
      "checkout: moving from main to feature",
    ]) {
      expect(parseReflogAction(subject, false)).toBeNull();
    }
  });
});

describe("selectMergeEntries", () => {
  it("returns only entries newer than the old sha, oldest first", () => {
    const entries = [
      entry("c", "commit: after merge"),
      entry("b", "merge feature: Merge made by the 'ort' strategy."),
      entry("a", "commit (initial): base"),
    ];
    expect(selectMergeEntries(entries, "a").map((candidate) => candidate.sha)).toEqual(["b"]);
  });

  it("returns two merges when both happened between polls", () => {
    const entries = [
      entry("d", "commit: after"),
      entry("c", "merge b: Fast-forward"),
      entry("b", "merge a: Merge made by the 'ort' strategy."),
      entry("a", "commit (initial): base"),
    ];
    expect(selectMergeEntries(entries, "a").map((candidate) => candidate.sha)).toEqual(["b", "c"]);
  });

  it("only checks the newest entry when the old sha fell out of the reflog window", () => {
    const entries = [
      entry("c", "merge b: Fast-forward"),
      entry("b", "merge a: Merge made by the 'ort' strategy."),
      entry("a", "commit (initial): base"),
    ];
    expect(selectMergeEntries(entries, "missing").map((candidate) => candidate.sha)).toEqual(["c"]);
  });

  it("returns nothing for a pure commit advance", () => {
    const entries = [entry("b", "commit: work"), entry("a", "commit (initial): base")];
    expect(selectMergeEntries(entries, "a")).toEqual([]);
  });
});
