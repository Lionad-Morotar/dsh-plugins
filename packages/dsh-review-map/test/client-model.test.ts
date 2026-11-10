/**
 * The read model: pure projections over one snapshot, with no DOM and no React.
 *
 * Everything the view needs to decide is decided here, so the component only
 * places values. That split is what makes the awkward cases testable at all: a
 * `+0` that should have been omitted, a binary file that must not claim zero
 * lines, a rename that has to keep its old path visible.
 */
import { describe, expect, it } from "vitest";

import {
  churnOf,
  fill,
  sortFiles,
  splitPath,
  statusMark,
  summaryOf,
  type Churn,
} from "../src/client/model.ts";
import type { ChangedFile, ChangedFileStatus, ReviewSnapshot } from "../src/shared.ts";

/** One changed file, with the fields a case does not care about defaulted. */
function file(overrides: Partial<ChangedFile> & { path: string }): ChangedFile {
  return {
    status: "modified",
    additions: 1,
    deletions: 0,
    binary: false,
    untracked: false,
    ...overrides,
  };
}

/** A snapshot with the given files and no summary, so `summaryOf` must aggregate. */
function snapshot(files: readonly ChangedFile[], overrides: Partial<ReviewSnapshot> = {}): ReviewSnapshot {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "main", shortHash: "abc1234" },
    scope: "worktree",
    baseRef: null,
    uncommitted: files.length,
    files,
    summary: { files: files.length, additions: 0, deletions: 0 },
    ...overrides,
  };
}

describe("sorting the change list", () => {
  it("puts the larger change first", () => {
    // The case the ordering exists for: a big rewrite of a small file outranks
    // a small edit to a big one, because churn is what a reviewer triages by.
    const add = file({ path: "add.ts", additions: 82, deletions: 26 });
    const toast = file({ path: "toast-example.tsx", additions: 86, deletions: 0 });

    expect(sortFiles([toast, add]).map(entry => entry.path)).toEqual(["add.ts", "toast-example.tsx"]);
  });

  it("counts both sides of a change, not just the additions", () => {
    const rewritten = file({ path: "a.ts", additions: 1, deletions: 60 });
    const added = file({ path: "b.ts", additions: 50, deletions: 0 });

    expect(sortFiles([added, rewritten]).map(entry => entry.path)).toEqual(["a.ts", "b.ts"]);
  });

  it("sinks a file whose line counts are unknown", () => {
    const binary = file({ path: "logo.png", additions: null, deletions: null, binary: true });
    const tiny = file({ path: "a.ts", additions: 1, deletions: 0 });

    expect(sortFiles([binary, tiny]).map(entry => entry.path)).toEqual(["a.ts", "logo.png"]);
  });

  it("breaks a tie by path, ascending", () => {
    const b = file({ path: "b.ts", additions: 5, deletions: 0 });
    const a = file({ path: "a.ts", additions: 5, deletions: 0 });
    const c = file({ path: "c.ts", additions: 5, deletions: 0 });

    expect(sortFiles([c, b, a]).map(entry => entry.path)).toEqual(["a.ts", "b.ts", "c.ts"]);
  });

  it("leaves the input array alone", () => {
    const input = [file({ path: "b.ts", additions: 1, deletions: 0 }), file({ path: "a.ts", additions: 9, deletions: 0 })];
    const before = input.map(entry => entry.path);

    sortFiles(input);

    expect(input.map(entry => entry.path)).toEqual(before);
  });

  it("returns an empty list for an empty input", () => {
    expect(sortFiles([])).toEqual([]);
  });
});

describe("status marks", () => {
  it("maps every status to its one-letter mark", () => {
    const expected: Record<ChangedFileStatus, string> = {
      added: "A",
      modified: "M",
      deleted: "D",
      renamed: "R",
      copied: "C",
      "type-changed": "T",
      untracked: "U",
      conflicted: "!",
      unknown: "?",
    };
    for (const [status, mark] of Object.entries(expected)) {
      expect(statusMark(status as ChangedFileStatus)).toBe(mark);
    }
  });
});

describe("the churn projection", () => {
  it("keeps both sides when both moved", () => {
    expect(churnOf(file({ path: "a.ts", additions: 12, deletions: 3 }))).toEqual<Churn>({
      additions: 12,
      deletions: 3,
      note: null,
    });
  });

  it("omits a side that did not move", () => {
    // `+0` is noise: a file that only grew should read as one number, not two.
    expect(churnOf(file({ path: "a.ts", additions: 7, deletions: 0 }))).toEqual<Churn>({
      additions: 7,
      deletions: null,
      note: null,
    });
    expect(churnOf(file({ path: "a.ts", additions: 0, deletions: 4 }))).toEqual<Churn>({
      additions: null,
      deletions: 4,
      note: null,
    });
  });

  it("shows no numbers at all when nothing moved", () => {
    // A pure rename or a mode flip has no line counts worth printing.
    expect(churnOf(file({ path: "a.ts", additions: 0, deletions: 0 }))).toEqual<Churn>({
      additions: null,
      deletions: null,
      note: null,
    });
  });

  it("labels a binary file instead of counting it", () => {
    expect(churnOf(file({ path: "logo.png", additions: null, deletions: null, binary: true }))).toEqual<Churn>({
      additions: null,
      deletions: null,
      note: "binary",
    });
  });

  it("labels an untracked file instead of counting it", () => {
    expect(churnOf(file({ path: "new.ts", additions: null, deletions: null, untracked: true }))).toEqual<Churn>({
      additions: null,
      deletions: null,
      note: "untracked",
    });
  });

  it("labels a conflict ahead of any other note", () => {
    // A conflicted path may also be binary; the conflict is what the reader has
    // to act on, so it wins.
    expect(
      churnOf(file({ path: "a.ts", status: "conflicted", additions: null, deletions: null, binary: true })),
    ).toEqual<Churn>({ additions: null, deletions: null, note: "conflicted" });
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
    expect(splitPath("packages/dsh-review-map/src/client/view.tsx")).toEqual({
      dir: "packages/dsh-review-map/src/client/",
      name: "view.tsx",
    });
  });

  it("handles a file with no extension", () => {
    expect(splitPath("Makefile")).toEqual({ dir: "", name: "Makefile" });
    expect(splitPath("scripts/build")).toEqual({ dir: "scripts/", name: "build" });
  });

  it("handles a dotfile without inventing a directory", () => {
    expect(splitPath(".gitignore")).toEqual({ dir: "", name: ".gitignore" });
  });
});

describe("the summary projection", () => {
  it("takes the snapshot's own totals", () => {
    const value = snapshot([file({ path: "a.ts", additions: 3, deletions: 1 })], {
      summary: { files: 1, additions: 3, deletions: 1 },
    });

    expect(summaryOf(value)).toEqual({ files: 1, additions: 3, deletions: 1 });
  });

  it("aggregates from the files when the summary is missing", () => {
    const value = snapshot(
      [
        file({ path: "a.ts", additions: 3, deletions: 1 }),
        file({ path: "b.ts", additions: 2, deletions: 5 }),
        file({ path: "c.bin", additions: null, deletions: null, binary: true }),
      ],
      { summary: undefined as unknown as ReviewSnapshot["summary"] },
    );

    // The binary file contributes nothing rather than zero: its counts are
    // unknown, and a zero would understate the change.
    expect(summaryOf(value)).toEqual({ files: 3, additions: 5, deletions: 6 });
  });

  it("falls back to the file count when only that field is missing", () => {
    const value = snapshot([file({ path: "a.ts", additions: 4, deletions: 2 })], {
      summary: { files: 0, additions: 4, deletions: 2 },
    });

    expect(summaryOf(value).files).toBe(1);
  });
});

describe("filling a template", () => {
  it("replaces every named placeholder", () => {
    expect(fill("对比 {base} 的改动", { base: "abc1234" })).toBe("对比 abc1234 的改动");
  });

  it("leaves an unknown placeholder alone rather than printing undefined", () => {
    expect(fill("对比 {base}", {})).toBe("对比 {base}");
  });
});
