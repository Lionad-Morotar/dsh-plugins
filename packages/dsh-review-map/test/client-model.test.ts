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
  buildMapData,
  churnOf,
  directoryChain,
  fill,
  indexReadings,
  sortFiles,
  splitPath,
  statusMark,
  summaryOf,
  type Churn,
} from "../src/client/model.ts";
import type {
  ChangedFile,
  ChangedFileStatus,
  ChangedMapEntry,
  ReviewIndex,
  ReviewSnapshot,
  StructureDir,
  StructureFile,
} from "../src/shared.ts";

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

/** One structure file, with the fields a case does not care about defaulted. */
function structureFile(overrides: Partial<StructureFile> & { path: string }): StructureFile {
  return { lines: 10, binary: false, deleted: false, ...overrides };
}

/** One directory aggregate. */
function structureDir(overrides: Partial<StructureDir> & { path: string }): StructureDir {
  return { lines: 0, files: 0, changed: 0, additions: 0, deletions: 0, ...overrides };
}

/** One change entry. */
function changedEntry(overrides: Partial<ChangedMapEntry> & { path: string }): ChangedMapEntry {
  return { status: "modified", additions: 1, deletions: 0, binary: false, hunks: [], ...overrides };
}

/** A whole index over the given parts. */
function indexOf(parts: {
  files?: StructureFile[];
  dirs?: StructureDir[];
  changed?: ChangedMapEntry[];
  newImports?: number;
  droppedImports?: number;
  unresolved?: number;
  unresolvedFiles?: string[];
  edges?: { from: string; to: string; state: "added" | "removed" | "kept" }[];
  complete?: boolean;
  parsed?: number;
  total?: number;
}): ReviewIndex {
  return {
    files: parts.files ?? [],
    dirs: parts.dirs ?? [],
    changed: parts.changed ?? [],
    edges: parts.edges ?? [],
    imports: { newImports: parts.newImports ?? 0, droppedImports: parts.droppedImports ?? 0 },
    unresolved: { count: parts.unresolved ?? 0, files: parts.unresolvedFiles ?? [] },
    indexed: {
      files: parts.total ?? parts.files?.length ?? 0,
      parsed: parts.parsed ?? parts.files?.length ?? 0,
      complete: parts.complete ?? true,
      note: null,
    },
    snapshotId: "worktree:HEAD..HEAD",
  };
}

describe("buildMapData", () => {
  it("always produces a root level", () => {
    const data = buildMapData(indexOf({}), "repo");

    expect(data.rootPath).toBe("");
    expect(data.levels.has("")).toBe(true);
    expect(data.levels.get("")?.dirs).toEqual([]);
    expect(data.levels.get("")?.files).toEqual([]);
  });

  it("puts a root file on the root level", () => {
    const data = buildMapData(indexOf({ files: [structureFile({ path: "readme.md", lines: 7 })] }), "repo");

    const root = data.levels.get("");
    expect(root?.files).toHaveLength(1);
    expect(root?.files[0]?.path).toBe("readme.md");
    expect(root?.files[0]?.lines).toBe(7);
  });

  it("puts a nested file on its own directory's level", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "src/deep/a.ts" })],
        dirs: [structureDir({ path: "", lines: 10, files: 1 }), structureDir({ path: "src", lines: 10, files: 1 }), structureDir({ path: "src/deep", lines: 10, files: 1 })],
      }),
      "repo",
    );

    expect(data.levels.get("src/deep")?.files.map(file => file.path)).toEqual(["src/deep/a.ts"]);
    // A directory is a child of its parent level, not of the root.
    expect(data.levels.get("src")?.dirs.map(dir => dir.path)).toEqual(["src/deep"]);
    expect(data.levels.get("")?.dirs.map(dir => dir.path)).toEqual(["src"]);
  });

  it("gives a directory its subtree totals rather than re-summing them", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "src/a.ts" })],
        dirs: [
          structureDir({ path: "", lines: 500, files: 9 }),
          structureDir({ path: "src", lines: 500, files: 9, changed: 2, additions: 30, deletions: 4 }),
        ],
      }),
      "repo",
    );

    const src = data.levels.get("")?.dirs[0];
    expect(src).toMatchObject({ path: "src", lines: 500, files: 9, changedFiles: 2, additions: 30, deletions: 4 });
    // A folder whose changes are deeper still lights up.
    expect(src?.changed).toBe(true);
  });

  it("keeps a directory with no changes unlit", () => {
    const data = buildMapData(
      indexOf({ dirs: [structureDir({ path: "", lines: 0 }), structureDir({ path: "docs", lines: 40, files: 2 })] }),
      "repo",
    );

    expect(data.levels.get("")?.dirs[0]?.changed).toBe(false);
  });

  it("passes the change fields through to the file", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "a.ts", lines: 20 })],
        changed: [changedEntry({ path: "a.ts", status: "deleted", additions: 0, deletions: 12 })],
      }),
      "repo",
    );

    const file = data.levels.get("")?.files[0];
    expect(file?.changed).toBe(true);
    expect(file?.status).toBe("deleted");
    expect(file?.additions).toBe(0);
    expect(file?.deletions).toBe(12);
  });

  it("passes hunk ranges through for the distribution bar", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "a.ts", lines: 100 })],
        changed: [
          changedEntry({
            path: "a.ts",
            hunks: [
              { oldStart: 1, oldLines: 0, newStart: 1, newLines: 5 },
              { oldStart: 60, oldLines: 2, newStart: 61, newLines: 3 },
            ],
          }),
        ],
      }),
      "repo",
    );

    expect(data.levels.get("")?.files[0]?.hunks).toEqual([
      { newStart: 1, newLines: 5, oldLines: 0 },
      { newStart: 61, newLines: 3, oldLines: 2 },
    ]);
  });

  it("keeps a binary file's line count null", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "logo.png", lines: null, binary: true })],
        changed: [changedEntry({ path: "logo.png", binary: true, additions: null, deletions: null })],
      }),
      "repo",
    );

    const file = data.levels.get("")?.files[0];
    expect(file?.lines).toBeNull();
    expect(file?.binary).toBe(true);
  });

  it("includes non-code files, filtered by nothing", () => {
    const data = buildMapData(
      indexOf({
        files: [
          structureFile({ path: "a.ts" }),
          structureFile({ path: "notes.md" }),
          structureFile({ path: "icon.png", lines: null, binary: true }),
          structureFile({ path: "data.json" }),
        ],
      }),
      "repo",
    );

    // R9.3: the map shows the whole tree. An extension filter would quietly turn
    // it into a code-only view.
    expect(data.levels.get("")?.files.map(file => file.path)).toEqual(["a.ts", "data.json", "icon.png", "notes.md"]);
  });

  it("sorts every level by path so the layout is deterministic", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "z.ts" }), structureFile({ path: "a.ts" }), structureFile({ path: "m.ts" })],
        dirs: [structureDir({ path: "" }), structureDir({ path: "zz" }), structureDir({ path: "aa" })],
      }),
      "repo",
    );

    expect(data.levels.get("")?.files.map(file => file.path)).toEqual(["a.ts", "m.ts", "z.ts"]);
    expect(data.levels.get("")?.dirs.map(dir => dir.path)).toEqual(["aa", "zz"]);
  });

  it("marks an unchanged file as unchanged", () => {
    const data = buildMapData(indexOf({ files: [structureFile({ path: "quiet.ts" })] }), "repo");

    expect(data.levels.get("")?.files[0]?.changed).toBe(false);
    expect(data.levels.get("")?.files[0]?.status).toBeUndefined();
  });
});

describe("indexReadings", () => {
  it("sums the change entries into the four headline numbers", () => {
    const readings = indexReadings(
      indexOf({
        changed: [
          changedEntry({ path: "a.ts", additions: 10, deletions: 2 }),
          changedEntry({ path: "b.ts", additions: 5, deletions: 1 }),
        ],
        newImports: 3,
        droppedImports: 1,
      }),
    );

    expect(readings.additions).toBe(15);
    expect(readings.deletions).toBe(3);
    expect(readings.files).toBe(2);
    expect(readings.newImports).toBe(3);
    expect(readings.droppedImports).toBe(1);
  });

  it("treats a null line count as contributing nothing", () => {
    const readings = indexReadings(
      indexOf({
        changed: [
          changedEntry({ path: "a.ts", additions: 4, deletions: 0 }),
          changedEntry({ path: "b.png", binary: true, additions: null, deletions: null }),
        ],
      }),
    );

    expect(readings.additions).toBe(4);
    expect(readings.deletions).toBe(0);
    // The binary file is still a changed file.
    expect(readings.files).toBe(2);
  });

  it("reports no partial marker when the index finished", () => {
    const readings = indexReadings(indexOf({ files: [structureFile({ path: "a.ts" })], complete: true }));

    expect(readings.partial).toBeNull();
  });

  it("reports parsed-of-total when the index stopped early", () => {
    const readings = indexReadings(indexOf({ complete: false, parsed: 320, total: 400 }));

    expect(readings.partial).toEqual({ parsed: 320, total: 400 });
  });

  it("carries the unresolved count as a lower bound", () => {
    const readings = indexReadings(indexOf({ unresolved: 12 }));

    expect(readings.unresolved).toBe(12);
  });

  it("reports a real zero when nothing is unresolved", () => {
    const readings = indexReadings(indexOf({ unresolved: 0 }));

    // Zero here is a fact, not a placeholder: the index looked and found none.
    expect(readings.unresolved).toBe(0);
  });

  it("reports an empty change set as a real zero", () => {
    const readings = indexReadings(indexOf({}));

    expect(readings.files).toBe(0);
    expect(readings.additions).toBe(0);
    expect(readings.partial).toBeNull();
  });
});

describe("buildMapData edges and unresolved", () => {
  it("carries an edge whose importing end changed", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "a.ts" }), structureFile({ path: "b.ts" })],
        changed: [changedEntry({ path: "a.ts" })],
        edges: [{ from: "a.ts", to: "b.ts", state: "added" }],
      }),
      "repo",
    );

    expect(data.edges ?? []).toEqual([{ from: "a.ts", to: "b.ts", state: "added" }]);
  });

  it("carries an edge whose imported end changed", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "a.ts" }), structureFile({ path: "b.ts" })],
        changed: [changedEntry({ path: "b.ts" })],
        edges: [{ from: "a.ts", to: "b.ts", state: "kept" }],
      }),
      "repo",
    );

    // The "imported by" direction is the whole point of the map: an unchanged
    // file that depends on a changed one is exactly what a reviewer must see.
    expect(data.edges ?? []).toEqual([{ from: "a.ts", to: "b.ts", state: "kept" }]);
  });

  it("drops an edge between two untouched files", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "a.ts" }), structureFile({ path: "b.ts" }), structureFile({ path: "c.ts" })],
        changed: [changedEntry({ path: "c.ts" })],
        edges: [
          { from: "a.ts", to: "b.ts", state: "kept" },
          { from: "c.ts", to: "a.ts", state: "kept" },
        ],
      }),
      "repo",
    );

    // A fact about the repository, not about this review.
    expect(data.edges ?? []).toEqual([{ from: "c.ts", to: "a.ts", state: "kept" }]);
  });

  it("keeps all three edge states", () => {
    const data = buildMapData(
      indexOf({
        files: [structureFile({ path: "a.ts" }), structureFile({ path: "b.ts" }), structureFile({ path: "c.ts" })],
        changed: [changedEntry({ path: "a.ts" })],
        edges: [
          { from: "a.ts", to: "b.ts", state: "added" },
          { from: "a.ts", to: "c.ts", state: "removed" },
        ],
      }),
      "repo",
    );

    expect((data.edges ?? []).map(edge => edge.state)).toEqual(["added", "removed"]);
  });

  it("passes the unresolved files through as per-file counts", () => {
    const data = buildMapData(
      indexOf({ files: [structureFile({ path: "a.ts" })], unresolvedFiles: ["a.ts", "b.ts"] }),
      "repo",
    );

    expect(data.unresolvedFiles).toEqual({ "a.ts": 1, "b.ts": 1 });
  });

  it("reports no unresolved files when the host listed none", () => {
    const data = buildMapData(indexOf({ files: [structureFile({ path: "a.ts" })] }), "repo");

    expect(data.unresolvedFiles).toEqual({});
  });

  it("passes the index completeness through", () => {
    const data = buildMapData(indexOf({ complete: false, parsed: 320, total: 400 }), "repo");

    expect(data.indexed).toEqual({ parsed: 320, total: 400, complete: false, note: null });
  });

  it("reports a complete index as complete", () => {
    const data = buildMapData(indexOf({ files: [structureFile({ path: "a.ts" })], complete: true }), "repo");

    expect(data.indexed?.complete).toBe(true);
  });
});

describe("buildMapData and unindexed files", () => {
  it("passes the unindexed flag through to the map's file input", () => {
    const data = buildMapData(
      indexOf({ files: [structureFile({ path: "a.ts", lines: null, unindexed: true })] }),
      "repo",
    );

    const file = data.levels.get("")?.files[0];
    // The map needs to tell "no reading" from "no lines": a binary file has a
    // measurement that says it has no line count, an unindexed one has none.
    expect(file?.unindexed).toBe(true);
    expect(file?.lines).toBeNull();
  });

  it("leaves an indexed file without the flag", () => {
    const data = buildMapData(indexOf({ files: [structureFile({ path: "a.ts", lines: 12 })] }), "repo");

    expect(data.levels.get("")?.files[0]?.unindexed).toBeUndefined();
  });
});
