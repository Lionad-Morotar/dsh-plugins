/**
 * Branch filtering, highlighting ranges and the keyboard cursor.
 *
 * These are the product decisions behind the popover: a query is a
 * case-insensitive subsequence of the branch name, a contiguous run of hits
 * outranks scattered ones, and a row another worktree holds is never the
 * cursor. Keeping them in plain functions makes the rules cheap to state.
 */
import { describe, expect, it } from "vitest";

import {
  filterBranches,
  firstAvailableIndex,
  moveActive,
  pickActive,
  type BranchMatch,
} from "../src/client/branch-search.ts";
import type { GitBranch } from "../src/host/types.ts";

function branch(name: string, extra: Partial<GitBranch> = {}): GitBranch {
  return { name, hash: "0000000", current: false, ...extra };
}

function names(matches: readonly BranchMatch[]): string[] {
  return matches.map(match => match.branch.name);
}

function rangesOf(matches: readonly BranchMatch[], name: string): readonly (readonly [number, number])[] {
  const match = matches.find(entry => entry.branch.name === name);
  if (match === undefined) throw new Error(`no match for ${name}`);
  return match.ranges;
}

describe("filterBranches", () => {
  it("returns every branch in host order with no ranges for an empty or blank query", () => {
    const branches = [branch("main", { current: true }), branch("feature"), branch("发布/1.0")];

    for (const query of ["", "   ", "\t\n"]) {
      const matches = filterBranches(branches, query);
      expect(names(matches)).toEqual(["main", "feature", "发布/1.0"]);
      for (const match of matches) expect(match.ranges).toEqual([]);
    }
  });

  it("matches case insensitively and reports the name indices", () => {
    const matches = filterBranches([branch("main"), branch("feature")], "MI");

    expect(names(matches)).toEqual(["main"]);
    expect(rangesOf(matches, "main")).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it("matches a scattered subsequence and reports the real name indices", () => {
    const matches = filterBranches([branch("main")], "mn");

    expect(names(matches)).toEqual(["main"]);
    // m at 0, n at 3: the skipped "ai" splits the hits into two ranges.
    expect(rangesOf(matches, "main")).toEqual([
      [0, 1],
      [3, 4],
    ]);
  });

  it("merges adjacent hits into one contiguous range", () => {
    const matches = filterBranches([branch("main")], "mai");

    expect(rangesOf(matches, "main")).toEqual([[0, 3]]);
  });

  it("keeps a full-name query as a single range", () => {
    const matches = filterBranches([branch("main")], "MAIN");

    expect(rangesOf(matches, "main")).toEqual([[0, 4]]);
  });

  it("drops branches that cannot match", () => {
    expect(filterBranches([branch("main"), branch("feature")], "xyz")).toEqual([]);
  });

  it("ranks the longest contiguous run first and keeps equal scores stable", () => {
    const branches = [branch("main"), branch("maint"), branch("feature/main"), branch("m-a-i-n")];

    const matches = filterBranches(branches, "mai");

    expect(names(matches)).toEqual(["main", "maint", "feature/main", "m-a-i-n"]);
    expect(rangesOf(matches, "feature/main")).toEqual([[8, 11]]);
    expect(rangesOf(matches, "m-a-i-n")).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
    ]);
  });

  it("sorts a contiguous hit ahead of a scattered one", () => {
    const matches = filterBranches([branch("a-b"), branch("ab")], "ab");

    expect(names(matches)).toEqual(["ab", "a-b"]);
    expect(rangesOf(matches, "ab")).toEqual([[0, 2]]);
    expect(rangesOf(matches, "a-b")).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it("treats regex metacharacters as literal text", () => {
    const branches = [branch("feature/main"), branch("release.1"), branch("main")];

    expect(rangesOf(filterBranches(branches, "/"), "feature/main")).toEqual([[7, 8]]);
    expect(rangesOf(filterBranches(branches, "."), "release.1")).toEqual([[7, 8]]);
    expect(filterBranches([branch("main")], "a.*")).toEqual([]);
    expect(filterBranches([branch("main")], "m in")).toEqual([]);
  });

  it("trims the query before matching", () => {
    expect(names(filterBranches([branch("main")], "  mn  "))).toEqual(["main"]);
  });

  it("keeps unicode branch names intact and splits by name index", () => {
    const matches = filterBranches([branch("功能/搜索"), branch("main")], "搜索");

    expect(names(matches)).toEqual(["功能/搜索"]);
    expect(rangesOf(matches, "功能/搜索")).toEqual([[3, 5]]);
    const range = rangesOf(matches, "功能/搜索")[0];
    expect("功能/搜索".slice(range?.[0], range?.[1])).toBe("搜索");
  });
});

describe("keyboard cursor", () => {
  const matches = filterBranches(
    [branch("main"), branch("taken", { worktreePath: "/repo/.worktrees/taken" }), branch("feature")],
    "",
  );

  it("starts on the first available row and skips occupied ones", () => {
    expect(firstAvailableIndex(matches)).toBe(0);
    expect(firstAvailableIndex([matches[1] as BranchMatch])).toBe(-1);
    expect(firstAvailableIndex([])).toBe(-1);
  });

  it("moves down past an occupied row and clamps at the end", () => {
    expect(moveActive(matches, 0, 1)).toBe(2);
    expect(moveActive(matches, 2, 1)).toBe(2);
  });

  it("moves up past an occupied row and clamps at the start", () => {
    expect(moveActive(matches, 2, -1)).toBe(0);
    expect(moveActive(matches, 0, -1)).toBe(0);
  });

  it("lands on the first available row when the cursor has no position yet", () => {
    expect(moveActive(matches, -1, 1)).toBe(0);
    expect(moveActive(matches, -1, -1)).toBe(0);
    expect(moveActive([], -1, 1)).toBe(-1);
  });

  it("only picks a row that Enter may activate", () => {
    expect(pickActive(matches, 0)?.name).toBe("main");
    expect(pickActive(matches, 1)).toBeUndefined();
    expect(pickActive(matches, -1)).toBeUndefined();
    expect(pickActive(matches, 99)).toBeUndefined();
  });
});
