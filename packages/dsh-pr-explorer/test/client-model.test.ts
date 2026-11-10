/**
 * The read model: pure projections over one comparison.
 *
 * Everything the view has to decide is decided here, so the component only
 * places values. The split is not tidiness: the awkward cases (a `+0` that should
 * have been omitted, a binary file that must not claim zero lines, a default pair
 * that would compare a branch to itself) are the ones that get a component
 * wrong, and none of them need a DOM to test.
 */
import { describe, expect, it } from "vitest";

import {
  churnOf,
  churnText,
  defaultPair,
  diffLines,
  diffTitle,
  formatBytes,
  rangeLabel,
  refOptions,
  sortCommits,
  sortFiles,
  splitPath,
  statusMark,
  summaryReading,
} from "../src/client/model.ts";
import type {
  CommitEntry,
  CompareSnapshot,
  PrChangedFile,
  PrDiffHunk,
  PrFileDiff,
  RefListing,
} from "../src/shared.ts";

/** One changed file with the fields a case does not care about defaulted. */
function file(overrides: Partial<PrChangedFile> & { path: string }): PrChangedFile {
  return { status: "modified", additions: 1, deletions: 0, binary: false, ...overrides };
}

/** One commit with the fields a case does not care about defaulted. */
function commit(overrides: Partial<CommitEntry> & { hash: string }): CommitEntry {
  return { short: overrides.hash.slice(0, 7), subject: "a commit", author: "Someone", date: "2026-01-01", ...overrides };
}

/** A listing with the given refs. */
function listing(overrides: Partial<RefListing> = {}): RefListing {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "feature", shortHash: "abc1234" },
    refs: [
      { name: "feature", kind: "branch", isDefault: false },
      { name: "main", kind: "branch", isDefault: true },
    ],
    defaultBase: "main",
    ...overrides,
  };
}

/** A comparison over the given commits and files. */
function snapshot(overrides: Partial<CompareSnapshot> = {}): CompareSnapshot {
  return {
    reading: {
      base: { input: "main", hash: "a".repeat(40), short: "aaaaaaa" },
      head: { input: "feature", hash: "b".repeat(40), short: "bbbbbbb" },
      mergeBase: { hash: "c".repeat(40), short: "ccccccc" },
      ahead: 2,
      behind: 1,
    },
    commits: { commits: [], truncated: false },
    files: { files: [], summary: { files: 0, additions: 0, deletions: 0 } },
    ...overrides,
  };
}

describe("the ref picker's options", () => {
  it("groups branches, then remotes, then tags, each by name", () => {
    const value = listing({
      refs: [
        { name: "v2.0.0", kind: "tag", isDefault: false },
        { name: "origin/main", kind: "remote", isDefault: false },
        { name: "zeta", kind: "branch", isDefault: false },
        { name: "v1.0.0", kind: "tag", isDefault: false },
        { name: "alpha", kind: "branch", isDefault: false },
        { name: "origin/dev", kind: "remote", isDefault: false },
      ],
    });

    // A picker that mixed tags into the branch list would make a reader scroll
    // past every release to find the branch they want.
    expect(refOptions(value).map(option => `${option.kind}:${option.name}`)).toEqual([
      "branch:alpha",
      "branch:zeta",
      "remote:origin/dev",
      "remote:origin/main",
      "tag:v1.0.0",
      "tag:v2.0.0",
    ]);
  });

  it("keeps a current value that the listing does not contain", () => {
    const value = listing();

    // `HEAD` is the common case: a detached checkout has no branch to list, but
    // the selector still has to be able to show what is selected.
    const options = refOptions(value, { current: ["HEAD"] });

    expect(options.map(option => option.name)).toContain("HEAD");
  });

  it("does not duplicate a current value that is already listed", () => {
    const value = listing();

    const options = refOptions(value, { current: ["main"] });

    expect(options.filter(option => option.name === "main")).toHaveLength(1);
  });

  it("marks the default base", () => {
    const value = listing();

    const options = refOptions(value);

    expect(options.find(option => option.name === "main")?.isDefault).toBe(true);
    expect(options.find(option => option.name === "feature")?.isDefault).toBe(false);
  });
});

describe("the default pair", () => {
  it("compares the default base to the current branch", () => {
    expect(defaultPair(listing())).toEqual({ base: "main", head: "feature" });
  });

  it("falls back to the first local branch when no default is named", () => {
    const value = listing({
      defaultBase: null,
      refs: [
        { name: "trunk", kind: "branch", isDefault: false },
        { name: "other", kind: "branch", isDefault: false },
      ],
    });

    expect(defaultPair(value).base).toBe("trunk");
  });

  it("falls back to HEAD when the repository has no local branch", () => {
    const value = listing({
      defaultBase: null,
      refs: [{ name: "v1.0.0", kind: "tag", isDefault: false }],
    });

    expect(defaultPair(value).base).toBe("HEAD");
  });

  it("uses HEAD as the head on a detached checkout", () => {
    const value = listing({ head: { kind: "detached", ref: "HEAD", shortHash: "abc1234" } });

    expect(defaultPair(value).head).toBe("HEAD");
  });

  it("moves the head to HEAD when the pair would compare a ref to itself", () => {
    // A branch checked out against itself is a range with nothing in it, which
    // reads as "no changes" rather than "you picked the same thing twice".
    const value = listing({
      head: { kind: "branch", ref: "main", shortHash: "abc1234" },
      defaultBase: "main",
    });

    expect(defaultPair(value)).toEqual({ base: "main", head: "HEAD" });
  });
});

describe("sorting the commit list", () => {
  it("keeps the order the host sent", () => {
    const commits = [commit({ hash: "c".repeat(40) }), commit({ hash: "b".repeat(40) }), commit({ hash: "a".repeat(40) })];

    // The host reads `git log`, which is already newest first. Re-sorting here
    // would be a second opinion about history, and it would be wrong.
    expect(sortCommits(commits).map(entry => entry.hash)).toEqual(commits.map(entry => entry.hash));
  });

  it("does not mutate the input", () => {
    const commits = [commit({ hash: "b".repeat(40) }), commit({ hash: "a".repeat(40) })];
    const before = commits.map(entry => entry.hash);

    sortCommits(commits);

    expect(commits.map(entry => entry.hash)).toEqual(before);
  });
});

describe("sorting the file list", () => {
  it("puts the larger change first", () => {
    const add = file({ path: "add.ts", additions: 82, deletions: 26 });
    const toast = file({ path: "toast-example.tsx", additions: 86, deletions: 0 });

    expect(sortFiles([toast, add]).map(entry => entry.path)).toEqual(["add.ts", "toast-example.tsx"]);
  });

  it("sinks a file whose line counts are unknown", () => {
    const binary = file({ path: "logo.png", additions: null, deletions: null, binary: true });
    const tiny = file({ path: "a.ts", additions: 1, deletions: 0 });

    expect(sortFiles([binary, tiny]).map(entry => entry.path)).toEqual(["a.ts", "logo.png"]);
  });

  it("breaks a tie by path, ascending", () => {
    const b = file({ path: "b.ts", additions: 5, deletions: 0 });
    const a = file({ path: "a.ts", additions: 5, deletions: 0 });

    expect(sortFiles([b, a]).map(entry => entry.path)).toEqual(["a.ts", "b.ts"]);
  });

  it("leaves the input array alone", () => {
    const input = [file({ path: "b.ts", additions: 1, deletions: 0 }), file({ path: "a.ts", additions: 9, deletions: 0 })];
    const before = input.map(entry => entry.path);

    sortFiles(input);

    expect(input.map(entry => entry.path)).toEqual(before);
  });
});

describe("status marks", () => {
  it("maps every status to its one-letter mark", () => {
    expect(statusMark("added")).toBe("A");
    expect(statusMark("modified")).toBe("M");
    expect(statusMark("deleted")).toBe("D");
    expect(statusMark("renamed")).toBe("R");
    expect(statusMark("copied")).toBe("C");
    expect(statusMark("type-changed")).toBe("T");
    expect(statusMark("unknown")).toBe("?");
  });
});

describe("the churn projection", () => {
  it("keeps both sides when both moved", () => {
    expect(churnOf(file({ path: "a.ts", additions: 12, deletions: 3 }))).toEqual({
      additions: 12,
      deletions: 3,
      note: null,
    });
  });

  it("omits a side that did not move", () => {
    // `+0` is noise: a file that only grew should read as one number, not two.
    expect(churnText(churnOf(file({ path: "a.ts", additions: 7, deletions: 0 })))).toBe("+7");
    expect(churnText(churnOf(file({ path: "a.ts", additions: 0, deletions: 4 })))).toBe("−4");
  });

  it("shows no numbers at all when nothing moved", () => {
    expect(churnText(churnOf(file({ path: "a.ts", additions: 0, deletions: 0 })))).toBe("");
  });

  it("labels a binary file instead of counting it", () => {
    expect(churnOf(file({ path: "logo.png", additions: null, deletions: null, binary: true })).note).toBe("binary");
  });
});

describe("splitting a path for display", () => {
  it("separates a directory from its file name", () => {
    expect(splitPath("src/index.ts")).toEqual({ dir: "src/", name: "index.ts" });
  });

  it("keeps a root-level file without a directory", () => {
    expect(splitPath("index.ts")).toEqual({ dir: "", name: "index.ts" });
  });

  it("keeps the whole directory for a deep path", () => {
    expect(splitPath("packages/dsh-pr-explorer/src/view.tsx")).toEqual({
      dir: "packages/dsh-pr-explorer/src/",
      name: "view.tsx",
    });
  });

  it("handles a dotfile without inventing a directory", () => {
    expect(splitPath(".gitignore")).toEqual({ dir: "", name: ".gitignore" });
  });
});

describe("the range label", () => {
  it("spells the three-dot range", () => {
    expect(rangeLabel("main", "feature")).toBe("main...feature");
  });
});

describe("the summary reading", () => {
  it("carries both counts, the file totals and the commit count", () => {
    const value = snapshot({
      commits: { commits: [commit({ hash: "a".repeat(40) }), commit({ hash: "b".repeat(40) })], truncated: false },
      files: { files: [file({ path: "a.ts", additions: 3, deletions: 1 })], summary: { files: 1, additions: 3, deletions: 1 } },
    });

    expect(summaryReading(value)).toEqual({
      ahead: 2,
      behind: 1,
      files: 1,
      additions: 3,
      deletions: 1,
      commits: 2,
      truncatedCommitList: false,
    });
  });

  it("reports a truncated commit list as its own fact", () => {
    const value = snapshot({ commits: { commits: [commit({ hash: "a".repeat(40) })], truncated: true } });

    // The commit list and the file list have separate truncation flags: 400
    // commits and 5000 diff lines are two different things to tell a reader.
    expect(summaryReading(value).truncatedCommitList).toBe(true);
  });
});

describe("the diff line projection", () => {
  const HUNKS: PrDiffHunk[] = [
    {
      oldStart: 1,
      oldLines: 3,
      newStart: 1,
      newLines: 3,
      lines: [
        { kind: "context", oldLine: 1, newLine: 1, text: "keep" },
        { kind: "del", oldLine: 2, newLine: null, text: "before" },
        { kind: "add", oldLine: null, newLine: 2, text: "after" },
      ],
    },
  ];

  it("emits a hunk header and its three line kinds with both numbers", () => {
    const rows = diffLines({ kind: "text", path: "a.ts", hunks: HUNKS, truncated: false });

    expect(rows[0]).toEqual({ kind: "hunk", header: "@@ -1,3 +1,3 @@" });
    const lines = rows.filter(row => row.kind === "line");
    expect(lines.map(row => (row.kind === "line" ? row.lineKind : ""))).toEqual(["context", "del", "add"]);
    expect(lines.map(row => (row.kind === "line" ? [row.oldLine, row.newLine] : []))).toEqual([
      [1, 1],
      [2, null],
      [null, 2],
    ]);
  });

  it("keeps the hunk's function heading", () => {
    const rows = diffLines({
      kind: "text",
      path: "a.ts",
      truncated: false,
      hunks: [{ ...HUNKS[0]!, heading: "function example() {" }],
    });

    expect(rows[0]).toEqual({ kind: "hunk", header: "@@ -1,3 +1,3 @@ function example() {" });
  });

  it("numbers a deleted file's whole text from one, all removed", () => {
    const rows = diffLines({ kind: "deleted", path: "gone.ts", lines: ["alpha", "beta"] });

    expect(rows.every(row => row.kind === "line")).toBe(true);
    expect(rows.map(row => (row.kind === "line" ? [row.oldLine, row.newLine, row.lineKind] : []))).toEqual([
      [1, null, "del"],
      [2, null, "del"],
    ]);
  });

  it("produces no rows for a binary file", () => {
    // The panel shows a size instead; an empty table with a header would read as
    // a broken render.
    expect(diffLines({ kind: "binary", path: "logo.png", bytes: 2048 })).toEqual([]);
  });

  it("produces no rows for a text diff with no hunks", () => {
    expect(diffLines({ kind: "text", path: "a.ts", hunks: [], truncated: false })).toEqual([]);
  });
});

describe("the diff title", () => {
  it("names the file the panel is about", () => {
    const diff: PrFileDiff = { kind: "text", path: "src/a.ts", hunks: [], truncated: false };

    expect(diffTitle(diff)).toBe("src/a.ts");
  });
});

describe("byte sizes", () => {
  it("formats bytes, kilobytes and megabytes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(1536 * 1024)).toBe("1.5 MB");
  });
});
