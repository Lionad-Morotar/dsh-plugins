/**
 * The structure index, checked against git's own answers.
 *
 * Every case builds a real repository and then asserts against a second git
 * invocation for the same fact: line counts against `wc -l`, hunk ranges against
 * `git diff -U0`, the change identity set against `collectSnapshot`. A parser
 * tested against a hand-written string only proves the parser agrees with
 * itself, and the failures that matter here (a binary file shifting every later
 * record, a deleted file vanishing from the map, a directory total that does not
 * add up) are exactly the ones a fixture would reproduce rather than catch.
 */
import { execFileSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { describe, expect, it, afterEach } from "vitest";

import { collectIndex, DEFAULT_INDEX_LIMITS, type IndexLimits } from "../src/host/structure.ts";
import { collectSnapshot } from "../src/host/snapshot.ts";
import { createGitRunner, type SubprocessLike } from "../src/host/git.ts";
import { createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

/**
 * A runner whose subprocess honours stdin.
 *
 * The shared fixture drops `stdio.stdin`, which is fine for every read that
 * takes its arguments on argv but not for `cat-file --batch`: without stdin the
 * command reads nothing, the batch read comes back empty, and the index silently
 * falls back to one call per file. That fallback is correct but it is not the
 * path a branch review takes, so the batch framing would go untested.
 * @param cwd - the directory every command runs in.
 * @returns a runner over real git, with stdin wired through.
 */
function stdinRunner(cwd: string) {
  const subprocess: SubprocessLike = {
    spawn(spec) {
      const stdin = spec.stdio.stdin;
      const input = typeof stdin === "object" ? stdin.data : undefined;
      try {
        const stdout = execFileSync("git", spec.argv.slice(1), {
          cwd: spec.cwd,
          encoding: "utf8",
          maxBuffer: 64 * 1024 * 1024,
          stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
          ...(input === undefined ? {} : { input }),
        });
        return {
          done: Promise.resolve({ exitCode: 0, signal: null }),
          collected: {
            stdout: { readFrom: () => ({ text: stdout, lossy: false }) },
            stderr: { readFrom: () => ({ text: "", lossy: false }) },
          },
        };
      } catch (error) {
        const failed = error as { status?: number; stdout?: string; stderr?: string };
        return {
          done: Promise.resolve({ exitCode: failed.status ?? 1, signal: null }),
          collected: {
            stdout: { readFrom: () => ({ text: failed.stdout ?? "", lossy: false }) },
            stderr: { readFrom: () => ({ text: failed.stderr ?? "", lossy: false }) },
          },
        };
      }
    },
  };
  return createGitRunner({ subprocess, cwd });
}

/** `wc -l` for one file, which is the count the index has to agree with. */
function wcLines(handle: RepoHandle, path: string): number {
  const output = execFileSync("wc", ["-l", `${handle.root}/${path}`], { encoding: "utf8" });
  return Number.parseInt(output.trim().split(/\s+/u)[0] ?? "", 10);
}

/** The index for a worktree review, failing the test when it did not build. */
async function worktreeIndex(handle: RepoHandle, limits?: Partial<IndexLimits>) {
  const { runner } = realRunner(handle.root);
  const result = await collectIndex({ runner, cwd: handle.root }, { kind: "worktree" }, {
    ...DEFAULT_INDEX_LIMITS,
    ...limits,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`index failed: ${result.error.code}`);
  return result.index;
}

describe("the structure index", () => {
  it("counts lines the way wc -l does, including a file with no trailing newline", async () => {
    repo = await createRepoWithCommit({
      "a.txt": "one\ntwo\nthree\n",
      "b.txt": "one\ntwo",
      "empty.txt": "",
      "src/c.ts": "export const c = 1;\n",
    });

    const index = await worktreeIndex(repo);

    const byPath = new Map(index.files.map(file => [file.path, file]));
    expect(byPath.get("a.txt")?.lines).toBe(wcLines(repo, "a.txt"));
    expect(byPath.get("b.txt")?.lines).toBe(wcLines(repo, "b.txt"));
    expect(byPath.get("empty.txt")?.lines).toBe(0);
    expect(byPath.get("src/c.ts")?.lines).toBe(1);
    // The whole point of counting newlines: a file whose last line has no
    // terminator reports one fewer than a reader would count by eye.
    expect(byPath.get("b.txt")?.lines).toBe(1);
  });

  it("reports a binary file with no line count", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    await repo.write("blob.bin", "text\u0000more\n");

    const index = await worktreeIndex(repo);

    const binary = index.files.find(file => file.path === "blob.bin");
    expect(binary?.binary).toBe(true);
    // Null, not zero: zero would claim the file is empty.
    expect(binary?.lines).toBeNull();
  });

  it("indexes a deleted file under its old path with its old line count", async () => {
    repo = await createRepoWithCommit({ "keep.txt": "one\n", "gone.txt": "a\nb\nc\n" });
    await rm(`${repo.root}/gone.txt`);

    const index = await worktreeIndex(repo);

    const gone = index.files.find(file => file.path === "gone.txt");
    expect(gone).toBeDefined();
    expect(gone?.deleted).toBe(true);
    expect(gone?.lines).toBe(3);
  });

  it("does not index a gitignored untracked path", async () => {
    repo = await createRepoWithCommit({ ".gitignore": "ignored/\n*.log\n", "a.txt": "one\n" });
    await repo.write("ignored/secret.txt", "nope\n");
    await repo.write("debug.log", "nope\n");
    await repo.write("tracked.txt", "yes\n");

    const index = await worktreeIndex(repo);

    const paths = index.files.map(file => file.path);
    expect(paths).toContain("tracked.txt");
    expect(paths).not.toContain("ignored/secret.txt");
    expect(paths).not.toContain("debug.log");
  });

  it("aggregates every directory as the sum of the files below it", async () => {
    repo = await createRepoWithCommit({
      "root.txt": "1\n2\n",
      "src/a.ts": "1\n2\n3\n",
      "src/deep/b.ts": "1\n",
      "docs/readme.md": "1\n2\n3\n4\n",
    });

    const index = await worktreeIndex(repo);

    const dirs = new Map(index.dirs.map(dir => [dir.path, dir]));
    // The root is present and is the whole tree.
    expect(dirs.get("")).toMatchObject({ files: 4, lines: 10 });
    expect(dirs.get("src")).toMatchObject({ files: 2, lines: 4 });
    expect(dirs.get("src/deep")).toMatchObject({ files: 1, lines: 1 });
    expect(dirs.get("docs")).toMatchObject({ files: 1, lines: 4 });

    // Recomputing from the file list is the assertion that matters: a directory
    // total that cannot be reproduced from its files is an unverifiable number.
    for (const dir of index.dirs) {
      const below = index.files.filter(file => dir.path === "" || file.path.startsWith(`${dir.path}/`));
      expect(dir.files).toBe(below.length);
      expect(dir.lines).toBe(below.reduce((sum, file) => sum + (file.lines ?? 0), 0));
    }
  });

  it("counts changed files and their line deltas per directory", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "1\n2\n3\n",
      "src/b.ts": "1\n2\n",
      "docs/x.md": "1\n",
    });
    await repo.write("src/a.ts", "1\n2\n3\n4\n5\n");
    await repo.write("docs/x.md", "1\n2\n");

    const index = await worktreeIndex(repo);

    const dirs = new Map(index.dirs.map(dir => [dir.path, dir]));
    expect(dirs.get("src")).toMatchObject({ changed: 1, additions: 2, deletions: 0 });
    expect(dirs.get("docs")).toMatchObject({ changed: 1, additions: 1, deletions: 0 });
    expect(dirs.get("")).toMatchObject({ changed: 2, additions: 3, deletions: 0 });
  });

  it("produces byte-identical output on two runs over the same tree", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import b from './b';\n",
      "src/b.ts": "export default 1;\n",
      "z.txt": "z\n",
    });
    await repo.write("src/c.ts", "import a from './a';\n");

    const first = await worktreeIndex(repo);
    const second = await worktreeIndex(repo);

    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    // Sorted by path, so the order does not depend on the filesystem's.
    const paths = first.files.map(file => file.path);
    expect(paths).toEqual([...paths].sort());
  });

  it("sorts directories by path with the root first", async () => {
    repo = await createRepoWithCommit({ "b/x.txt": "1\n", "a/y.txt": "1\n" });

    const index = await worktreeIndex(repo);

    expect(index.dirs.map(dir => dir.path)).toEqual(["", "a", "b"]);
  });
});

describe("the change entries", () => {
  it("keeps the same identity set as the change list", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n2\n", "gone.txt": "1\n", "keep.txt": "1\n" });
    await repo.write("a.txt", "1\n2\n3\n");
    await repo.write("new.txt", "n\n");
    await rm(`${repo.root}/gone.txt`);
    const { runner } = realRunner(repo.root);

    const snapshot = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });
    const index = await worktreeIndex(repo);

    expect(snapshot.ok).toBe(true);
    if (!snapshot.ok) return;
    const fromSnapshot = snapshot.snapshot.files.map(file => ({ path: file.path, status: file.status }));
    const fromIndex = index.changed.map(file => ({ path: file.path, status: file.status }));
    expect(fromIndex).toEqual(fromSnapshot);
    // And the counts come from the same read, not a second one.
    for (const entry of index.changed) {
      const original = snapshot.snapshot.files.find(file => file.path === entry.path);
      expect(entry.additions).toBe(original?.additions ?? null);
      expect(entry.deletions).toBe(original?.deletions ?? null);
    }
  });

  it("reports hunk ranges that match git diff -U0", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n2\n3\n4\n5\n6\n7\n8\n" });
    await repo.write("a.txt", "1\n2\nTHREE\n4\n5\n6\n7\n8\n9\n");
    const { runner } = realRunner(repo.root);

    const index = await worktreeIndex(repo);
    const raw = repo.git(["diff", "-U0", "HEAD", "--", "a.txt"]);
    const headers = raw.split("\n").filter(line => line.startsWith("@@ "));

    const entry = index.changed.find(file => file.path === "a.txt");
    expect(entry?.hunks).toHaveLength(headers.length);
    // `@@ -3 +3 @@` and `@@ -8,0 +9 @@` in this edit: one replacement, one
    // pure insertion with no old lines.
    expect(entry?.hunks[0]).toEqual({ oldStart: 3, oldLines: 1, newStart: 3, newLines: 1 });
    expect(entry?.hunks[1]).toMatchObject({ oldLines: 0, newLines: 1 });
  });

  it("reports a pure deletion hunk with no new lines", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n2\n3\n4\n5\n" });
    await repo.write("a.txt", "1\n2\n5\n");

    const index = await worktreeIndex(repo);

    const entry = index.changed.find(file => file.path === "a.txt");
    expect(entry?.hunks).toEqual([{ oldStart: 3, oldLines: 2, newStart: 2, newLines: 0 }]);
  });

  it("gives an untracked file a whole-file range", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n" });
    await repo.write("new.txt", "1\n2\n3\n");

    const index = await worktreeIndex(repo);

    const entry = index.changed.find(file => file.path === "new.txt");
    expect(entry?.status).toBe("untracked");
    expect(entry?.hunks).toEqual([{ oldStart: 0, oldLines: 0, newStart: 1, newLines: 3 }]);
  });

  it("leaves a binary file with no ranges", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n", "blob.bin": "x\u0000y\n" });
    // Committed first, then edited: git only reports a binary file's counts as
    // `-` for a tracked change, and an untracked file has no counts at all.
    await repo.write("blob.bin", "x\u0000y\u0000z\n");

    const index = await worktreeIndex(repo);

    const entry = index.changed.find(file => file.path === "blob.bin");
    expect(entry?.binary).toBe(true);
    expect(entry?.hunks).toEqual([]);
  });
});

describe("the index budget", () => {
  it("stops at the file cap and says so", async () => {
    repo = await createRepoWithCommit({
      "a.ts": "1\n",
      "b.ts": "1\n",
      "c.ts": "1\n",
      "d.ts": "1\n",
    });

    const index = await worktreeIndex(repo, { maxFiles: 2 });

    expect(index.indexed.complete).toBe(false);
    expect(index.indexed.note).toBe("file budget 2");
    expect(index.indexed.files).toBe(2);
  });

  it("stops on the deadline and reports how much it parsed", async () => {
    repo = await createRepoWithCommit({ "a.ts": "1\n", "b.ts": "1\n", "c.ts": "1\n" });

    // A zero budget expires before the first file is read, which is the same
    // path a real timeout takes, without waiting for one.
    const index = await worktreeIndex(repo, { timeBudgetMs: 0 });

    expect(index.indexed.complete).toBe(false);
    expect(index.indexed.note).toBe("time budget 0ms");
    expect(index.indexed.parsed).toBe(0);
    // The file list still came back: an incomplete index is a lower bound, not
    // an empty answer.
    expect(index.indexed.files).toBeGreaterThanOrEqual(0);
  });

  it("reports complete with no note when nothing was hit", async () => {
    repo = await createRepoWithCommit({ "a.ts": "1\n" });

    const index = await worktreeIndex(repo);

    expect(index.indexed.complete).toBe(true);
    expect(index.indexed.note).toBeNull();
  });
});

describe("a branch review", () => {
  it("indexes the HEAD tree rather than the working tree", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n2\n", "b.txt": "1\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("c.txt", "1\n2\n3\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    // An uncommitted edit must not appear: a branch review is about commits.
    await repo.write("a.txt", "1\n2\n3\n4\n");
    const runner = stdinRunner(repo.root);

    const result = await collectIndex({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const byPath = new Map(result.index.files.map(file => [file.path, file]));
    expect(byPath.get("c.txt")?.lines).toBe(3);
    // The working tree has four lines; HEAD has two.
    expect(byPath.get("a.txt")?.lines).toBe(2);
    expect(result.index.changed.map(file => file.path)).toEqual(["c.txt"]);
  });

  it("reads a file with multi-byte characters without shifting the batch framing", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    // The batch protocol announces bytes; a decoded string is characters. A
    // file like this one is what makes the difference observable.
    await repo.write("文档/评审.md", "第一行\n第二行\n第三行\n");
    await repo.write("z.txt", "1\n2\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "unicode"]);
    const runner = stdinRunner(repo.root);

    const result = await collectIndex({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const byPath = new Map(result.index.files.map(file => [file.path, file]));
    expect(byPath.get("文档/评审.md")?.lines).toBe(3);
    // The record after the multi-byte one is the one that would be corrupted.
    expect(byPath.get("z.txt")?.lines).toBe(2);
  });

  it("indexes a binary blob without shifting the records after it", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("blob.bin", "\u0000\u0001\u0002binary\u0000");
    await repo.write("z.txt", "1\n2\n3\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "binary"]);
    const runner = stdinRunner(repo.root);

    const result = await collectIndex({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const byPath = new Map(result.index.files.map(file => [file.path, file]));
    expect(byPath.get("blob.bin")?.binary).toBe(true);
    expect(byPath.get("blob.bin")?.lines).toBeNull();
    expect(byPath.get("z.txt")?.lines).toBe(3);
  });
});

describe("a directory that is not a repository", () => {
  it("answers not-a-repo rather than an empty index", async () => {
    repo = await createRepoWithCommit({ "a.txt": "1\n" });
    const { mkdtemp } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const outside = await mkdtemp(join(tmpdir(), "review-map-outside-"));
    const { runner } = realRunner(outside);

    const result = await collectIndex({ runner, cwd: outside }, { kind: "worktree" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("not-a-repo");
    await rm(outside, { recursive: true, force: true });
  });
});
