import { describe, expect, it } from "vitest";

import {
  computeWindow,
  createJump,
  formatCommitDetail,
  graphLaneCount,
  groupChanges,
  layoutGraph,
  parsePorcelain,
  relativeTime,
  statusLetter,
} from "../src/client/model.ts";

const STATUS = [
  "# branch.oid abcdef",
  "# branch.head main",
  "1 .M N... 100644 100644 100644 hh ii keep.txt",
  "2 R. N... 100644 100644 100644 hh ii R100 new name.txt",
  "old name.txt",
  "? dir/",
  "? 中文 文件.txt",
  "u UU N... 100644 100644 100644 100644 h1 h2 h3 conflict.txt",
  "1 MM N... 100644 100644 100644 hh ii mixed.txt",
  "1 AM N... 000000 100644 100644 0000000 hh added then edited.txt",
].join("\0") + "\0";

describe("groupChanges", () => {
  it("groups porcelain v2 records by directory, including rename pairs", () => {
    const groups = groupChanges(STATUS);
    const flat = groups.flatMap(group => group.files);
    expect(flat.map(file => file.path)).toEqual([
      "added then edited.txt",
      "conflict.txt",
      "dir",
      "keep.txt",
      "mixed.txt",
      "new name.txt",
      "中文 文件.txt",
    ]);
    const renamed = flat.find(file => file.path === "new name.txt");
    expect(renamed).toMatchObject({ status: "renamed", origPath: "old name.txt" });
    expect(flat.find(file => file.path === "dir")).toMatchObject({ status: "untracked", isDirectory: true });
    expect(flat.find(file => file.path === "conflict.txt")?.status).toBe("conflicted");
    expect(flat.find(file => file.path === "added then edited.txt")?.status).toBe("added");
    expect(groups.map(group => group.dir)).toEqual([""]);
  });

  it("merges the two records of a partially staged file into one row", () => {
    const files = parsePorcelain(STATUS).filter(file => file.path === "mixed.txt");
    expect(files).toHaveLength(1);
    expect(files[0]).toMatchObject({ status: "modified", staged: true });
  });

  it("labels every status for the badge", () => {
    expect(statusLetter("added")).toBe("A");
    expect(statusLetter("renamed")).toBe("R");
    expect(statusLetter("untracked")).toBe("U");
    expect(statusLetter("conflicted")).toBe("!");
  });
});

describe("formatCommitDetail", () => {
  it("formats the header fields and a compact age", () => {
    const now = 1_700_000_000_000;
    const detail = formatCommitDetail(
      { hash: "0123456789abcdef", parents: ["p1"], author: "Alice", time: now / 1000 - 7200, subject: "feat: x" },
      now,
    );
    expect(detail).toEqual({ shortHash: "0123456", author: "Alice", subject: "feat: x", relative: "2h" });
  });

  it("keeps sub-minute ages language-neutral", () => {
    expect(relativeTime(1_700_000_000, 1_700_000_030_000)).toBe("now");
  });
});

describe("createJump", () => {
  it("addresses the fs explorer with a path focus and defaults the line to one", () => {
    const calls: unknown[] = [];
    const jump = createJump({ views: { open: (...args) => calls.push(args) }, sessionId: "s1" });
    jump("src/main.ts");
    jump("./README.md", 12);
    expect(calls).toEqual([
      ["s1", "fs-explorer", "path:src/main.ts:1"],
      ["s1", "fs-explorer", "path:README.md:12"],
    ]);
  });
});

describe("computeWindow", () => {
  const rows = Array.from({ length: 5000 }, (_, row) => ({ row }));

  it("mounts at most the viewport plus overscan around the scroll offset", () => {
    const win = computeWindow(rows, { scrollTop: 2400, height: 400, rowHeight: 20 });
    expect(win.rows.length).toBeLessThanOrEqual(40);
    expect(win.rows[0]?.row).toBeGreaterThanOrEqual(100);
    expect(win.rows[0]?.row).toBeLessThanOrEqual(130);
    expect(win.startIndex).toBe(114);
  });

  it("clamps the last page so the viewport stays full", () => {
    const win = computeWindow(rows, { scrollTop: 5000 * 20, height: 400, rowHeight: 20 });
    expect(win.rows.at(-1)?.row).toBe(4999);
    expect(win.rows.length).toBe(32);
  });
});

describe("layoutGraph", () => {
  it("keeps a linear history in one lane", () => {
    const rows = layoutGraph([
      { hash: "c", parents: ["b"] },
      { hash: "b", parents: ["a"] },
      { hash: "a", parents: [] },
    ]);
    expect(rows.map(row => row.lane)).toEqual([0, 0, 0]);
    expect(graphLaneCount(rows)).toBe(1);
    expect(rows[0]?.segments.map(segment => segment.kind)).toEqual(["out"]);
    expect(rows[1]?.segments.map(segment => segment.kind).sort()).toEqual(["into", "out"]);
  });

  it("opens one lane per extra parent and converges at the merge base", () => {
    const rows = layoutGraph([
      { hash: "m", parents: ["a", "b"] },
      { hash: "a", parents: ["root"] },
      { hash: "b", parents: ["root"] },
      { hash: "root", parents: [] },
    ]);
    expect(rows[0]?.merge).toBe(true);
    expect(rows[1]?.lane).not.toBe(rows[2]?.lane);
    expect(rows[3]?.lane).toBe(0);
    const intoRoot = rows[3]?.segments.filter(segment => segment.kind === "into");
    expect(intoRoot).toHaveLength(2);
    expect(new Set(intoRoot?.map(segment => segment.from))).toEqual(new Set([0, 1]));
  });
});
