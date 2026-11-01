import { describe, expect, it } from "vitest";

import {
  changeDiff,
  directoryChanges,
  headLabel,
  joinChangeStats,
  parseStatusZ,
  statusBadge,
  statusOf,
  statusTone,
  type StatusMap,
} from "../src/client/status.ts";

const FIXTURE =
  [
    "1 .M N... 100644 100644 100644 aaaa bbbb src/有 空格.ts",
    "1 D. N... 100644 000000 000000 cccc dddd src/gone.ts",
    "1 A. N... 100644 000000 000000 cccc dddd src/added.ts",
    "2 R. N... 100644 100644 100644 eeee ffff R100 src/new name.ts",
    "src/old name.ts",
    "? 未命名.md",
    "u UU N... 100644 100644 100644 100644 gggg hhhh iiii src/conflict.ts",
    "u UU N... 100644 100644 100644 100644 gggg hhhh iiii src/冲突 文件.ts",
    "? temp/",
  ].join("\0") + "\0";

describe("parseStatusZ", () => {
  it("reads porcelain v2 records with spaces, Chinese names, renames and conflicts", () => {
    const parsed = parseStatusZ(FIXTURE);
    expect(parsed).toEqual({
      "src/有 空格.ts": { status: "modified" },
      "src/gone.ts": { status: "deleted" },
      "src/added.ts": { status: "added" },
      "src/new name.ts": { status: "renamed" },
      "未命名.md": { status: "untracked" },
      "src/conflict.ts": { status: "conflicted" },
      "src/冲突 文件.ts": { status: "conflicted" },
      "temp/": { status: "untracked" },
    });
  });

  it("keeps only the new path of a rename and skips its original field", () => {
    const parsed = parseStatusZ(FIXTURE);
    expect(parsed["src/old name.ts"]).toBeUndefined();
    expect(parsed["src/new name.ts"]).toEqual({ status: "renamed" });
  });

  it("ignores headers, ignored entries and malformed records", () => {
    const raw = ["# branch.head main", "! ignored.txt", "1 bad", "? ok.txt", ""].join("\0") + "\0";
    expect(parseStatusZ(raw)).toEqual({ "ok.txt": { status: "untracked" } });
  });

  it("answers an empty map for empty or non-string input", () => {
    expect(parseStatusZ("")).toEqual({});
    expect(parseStatusZ(undefined as unknown as string)).toEqual({});
  });
});

describe("statusTone", () => {
  it("keeps the five common statuses in distinct colour families", () => {
    const tones = {
      modified: statusTone("modified"),
      deleted: statusTone("deleted"),
      untracked: statusTone("untracked"),
      renamed: statusTone("renamed"),
      conflicted: statusTone("conflicted"),
    };
    expect(new Set(Object.values(tones)).size).toBeGreaterThanOrEqual(4);
    expect(tones.deleted).not.toBe(tones.modified);
  });

  it("reads unknown values as neutral", () => {
    expect(statusTone("copied")).toBe("neutral");
    expect(statusTone("")).toBe("neutral");
  });
});

describe("statusBadge", () => {
  it("maps every status to its one-letter badge", () => {
    expect(statusBadge("modified")).toBe("M");
    expect(statusBadge("added")).toBe("A");
    expect(statusBadge("deleted")).toBe("D");
    expect(statusBadge("renamed")).toBe("R");
    expect(statusBadge("untracked")).toBe("U");
    expect(statusBadge("conflicted")).toBe("!");
  });
});

describe("statusOf", () => {
  const statuses: StatusMap = {
    "src/main.ts": { status: "modified" },
    "temp/": { status: "untracked" },
  };

  it("matches a file exactly and a directory through git's trailing slash", () => {
    expect(statusOf("src/main.ts", statuses)).toBe("modified");
    expect(statusOf("temp", statuses)).toBe("untracked");
    expect(statusOf("src", statuses)).toBeUndefined();
  });
});

describe("directoryChanges", () => {
  const statuses: StatusMap = {
    "src/client/view.tsx": { status: "modified" },
    "src/client/tree.tsx": { status: "modified" },
    "src/host/parse.ts": { status: "conflicted" },
    "README.md": { status: "untracked" },
    "temp/": { status: "untracked" },
  };

  it("counts every changed path below a directory once", () => {
    expect(directoryChanges("src", statuses)).toEqual({ count: 3, tone: "conflict" });
    expect(directoryChanges("src/client", statuses)).toEqual({ count: 2, tone: "warning" });
    expect(directoryChanges("temp", statuses)).toEqual({ count: 1, tone: "info" });
  });

  it("answers undefined for a clean directory or missing status map", () => {
    expect(directoryChanges("docs", statuses)).toBeUndefined();
    expect(directoryChanges("src", undefined)).toBeUndefined();
    expect(directoryChanges("", statuses)).toBeUndefined();
  });
});

describe("joinChangeStats", () => {
  it("indexes stats by path and decorates the matching markers", () => {
    const joined = joinChangeStats(parseStatusZ(FIXTURE), [
      { path: "src/有 空格.ts", additions: 12, deletions: 4 },
      { path: "src/new name.ts", additions: 9, deletions: 0 },
    ]);
    expect(joined["src/有 空格.ts"]).toEqual({ status: "modified", additions: 12, deletions: 4 });
    // A rename's counts key the new path, the same path the status map keys.
    expect(joined["src/new name.ts"]).toEqual({ status: "renamed", additions: 9, deletions: 0 });
    // Untracked paths have no counts and stay as they were.
    expect(joined["未命名.md"]).toEqual({ status: "untracked" });
  });

  it("keeps binary markers as null counts on both sides", () => {
    const joined = joinChangeStats({ "logo.png": { status: "modified" } }, [
      { path: "logo.png", additions: null, deletions: null },
    ]);
    expect(joined["logo.png"]).toEqual({ status: "modified", additions: null, deletions: null });
  });

  it("ignores stat entries whose path is not in the status map", () => {
    const joined = joinChangeStats({ "a.ts": { status: "modified" } }, [{ path: "b.ts", additions: 1, deletions: 1 }]);
    expect(joined["b.ts"]).toBeUndefined();
    expect(joined["a.ts"]).toEqual({ status: "modified" });
  });
});

describe("changeDiff", () => {
  it("maps counted, binary and uncounted markers", () => {
    expect(changeDiff({ status: "modified", additions: 12, deletions: 4 })).toEqual({ additions: 12, deletions: 4 });
    expect(changeDiff({ status: "modified", additions: null, deletions: null })).toEqual({ binary: true });
    // A half-null pair is not a shape git produces; either null reads binary.
    expect(changeDiff({ status: "modified", additions: 1, deletions: null })).toEqual({ binary: true });
    expect(changeDiff({ status: "untracked" })).toBeUndefined();
  });
});

describe("headLabel", () => {
  it("names the branch, or the first seven hash characters when detached", () => {
    expect(headLabel({ hash: "9af31c2e6bd2", branch: "main", detached: false })).toBe("main");
    expect(headLabel({ hash: "9af31c2e6bd2", branch: null, detached: true })).toBe("9af31c2");
    expect(headLabel({ hash: null, branch: null, detached: false })).toBeNull();
    expect(headLabel(undefined)).toBeNull();
  });
});
