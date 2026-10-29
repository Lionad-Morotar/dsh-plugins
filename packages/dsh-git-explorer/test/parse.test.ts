import { describe, expect, it } from "vitest";

import { parseLog, parseRefListing, parseRefs, parseStatusBranch, parseStatusZ } from "../src/host/parse.ts";

describe("parseLog", () => {
  it("splits the five fields and keeps a pipe inside the subject", () => {
    const text = [
      "aaa|bbb ccc|Alice|1700000000|merge branch 'x'",
      "bbb||Bob|1699999999|subject with | pipe",
      "ccc||Carol|1699999998|root",
      "",
    ].join("\n");
    const commits = parseLog(text);
    expect(commits).toHaveLength(3);
    expect(commits[0]).toEqual({
      hash: "aaa",
      parents: ["bbb", "ccc"],
      author: "Alice",
      time: 1700000000,
      subject: "merge branch 'x'",
    });
    expect(commits[1]?.parents).toEqual([]);
    expect(commits[1]?.subject).toBe("subject with | pipe");
    expect(commits[2]?.subject).toBe("root");
  });

  it("keeps an empty subject and drops empty lines", () => {
    const commits = parseLog("aaa||Alice|1700000000|\n\n");
    expect(commits).toHaveLength(1);
    expect(commits[0]?.subject).toBe("");
  });

  it("ignores a truncated line instead of fabricating a commit", () => {
    expect(parseLog("aaa|bbb|Alice")).toEqual([]);
  });
});

describe("parseRefs", () => {
  it("classifies full decorations and the checked-out branch", () => {
    const refs = parseRefs(
      "HEAD -> refs/heads/main, refs/remotes/origin/main, tag: refs/tags/v1.0.0, refs/heads/feat/x",
    );
    expect(refs).toEqual([
      { kind: "branch", name: "main", head: true },
      { kind: "remote", name: "origin/main", head: false },
      { kind: "tag", name: "v1.0.0", head: false },
      { kind: "branch", name: "feat/x", head: false },
    ]);
  });

  it("accepts short decorations and skips a bare HEAD", () => {
    expect(parseRefs("HEAD, main, origin/dev, v2")).toEqual([
      { kind: "branch", name: "main", head: false },
      { kind: "remote", name: "origin/dev", head: false },
      { kind: "branch", name: "v2", head: false },
    ]);
  });
});

describe("parseRefListing", () => {
  it("reads for-each-ref records and hides the symbolic remote HEAD", () => {
    const text = [
      "refs/heads/main\0aaa\0*\0",
      "refs/remotes/origin/main\0aaa\0\0",
      "refs/remotes/origin/HEAD\0aaa\0\0",
      "refs/tags/v1\0bbb\0\0",
      "",
    ].join("\n");
    expect(parseRefListing(text)).toEqual([
      { kind: "branch", name: "main", hash: "aaa", head: true },
      { kind: "remote", name: "origin/main", hash: "aaa", head: false },
      { kind: "tag", name: "v1", hash: "bbb", head: false },
    ]);
  });
});

const STATUS = [
  "# branch.oid abcdef",
  "# branch.head main",
  "# branch.upstream origin/main",
  "# branch.ab +2 -1",
  "1 .M N... 100644 100644 100644 hh ii keep.txt",
  "2 R. N... 100644 100644 100644 hh ii R100 new name.txt\0old name.txt",
  "? dir/",
  "? 中文 文件.txt",
  "u UU N... 100644 100644 100644 100644 h1 h2 h3 conflict.txt",
  "1 MM N... 100644 100644 100644 hh ii mixed.txt",
].join("\0") + "\0";

describe("parseStatusZ", () => {
  it("parses headers, spaces, unicode, renames and conflicts", () => {
    expect(parseStatusBranch(STATUS)).toEqual({
      hash: "abcdef",
      branch: "main",
      detached: false,
      upstream: "origin/main",
      ahead: 2,
      behind: 1,
    });
    const changes = parseStatusZ(STATUS);
    expect(changes).toEqual([
      { path: "keep.txt", status: "modified", staged: false, isDirectory: false, index: ".", worktree: "M" },
      {
        path: "new name.txt",
        status: "renamed",
        staged: true,
        isDirectory: false,
        index: "R",
        worktree: ".",
        origPath: "old name.txt",
      },
      { path: "dir", status: "untracked", staged: false, isDirectory: true, index: "?", worktree: "?" },
      { path: "中文 文件.txt", status: "untracked", staged: false, isDirectory: false, index: "?", worktree: "?" },
      { path: "conflict.txt", status: "conflicted", staged: false, isDirectory: false, index: "U", worktree: "U" },
      { path: "mixed.txt", status: "modified", staged: true, isDirectory: false, index: "M", worktree: "M" },
      { path: "mixed.txt", status: "modified", staged: false, isDirectory: false, index: "M", worktree: "M" },
    ]);
  });

  it("reads a detached head and an initial repository", () => {
    expect(parseStatusBranch("# branch.oid (initial)\0# branch.head (detached)\0")).toEqual({
      hash: null,
      branch: null,
      detached: true,
    });
  });
});
