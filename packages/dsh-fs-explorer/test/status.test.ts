import { describe, expect, it } from "vitest";

import {
  directoryChanges,
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
