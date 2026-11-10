/**
 * One file's detail, checked against git's own diff.
 *
 * The hunk assertions compare against `git diff -U3` run directly, so a line
 * number that drifts is caught by git rather than by a fixture that drifted with
 * it. The deleted-file cases are the ones worth reading closely: the old side has
 * to be the scope's baseline, and a branch review whose baseline is several
 * commits back is where a hard-coded `HEAD` shows up as "the file is still
 * there".
 */
import { describe, expect, it, afterEach } from "vitest";

import { collectFileDiff, MAX_DIFF_LINES, parseHunkHeader, parseHunks, splitLines } from "../src/host/diff.ts";
import { createRepo, createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

/** A file with three well-separated blocks, so a change in each makes three hunks. */
const THREE_BLOCKS = Array.from({ length: 40 }, (_, index) => `line ${index + 1}`).join("\n") + "\n";

/**
 * Change one line in each of three separated blocks.
 * @param text - the original file text.
 * @returns the edited text.
 */
function editThreeBlocks(text: string): string {
  const lines = text.split("\n");
  lines[0] = "line 1 changed";
  lines[19] = "line 20 changed";
  lines[38] = "line 39 changed";
  return lines.join("\n");
}

describe("hunk parsing", () => {
  it("reads a header with explicit counts", () => {
    expect(parseHunkHeader("@@ -1,3 +1,4 @@")).toEqual({ oldStart: 1, oldLines: 3, newStart: 1, newLines: 4 });
  });

  it("defaults a missing count to one line", () => {
    expect(parseHunkHeader("@@ -7 +7 @@")).toEqual({ oldStart: 7, oldLines: 1, newStart: 7, newLines: 1 });
  });

  it("keeps the function heading after the closing marker", () => {
    expect(parseHunkHeader("@@ -10,4 +10,5 @@ function example() {")?.heading).toBe("function example() {");
  });

  it("rejects a line that is not a header", () => {
    expect(parseHunkHeader("--- a/file.txt")).toBeNull();
  });

  it("does not invent a trailing empty line when splitting file text", () => {
    expect(splitLines("a\nb\n")).toEqual(["a", "b"]);
    expect(splitLines("a\nb")).toEqual(["a", "b"]);
    expect(splitLines("")).toEqual([]);
  });
});

describe("a modified file's diff", () => {
  it("reports the same hunk headers git does, for three separated changes", async () => {
    repo = await createRepoWithCommit({ "a.txt": THREE_BLOCKS });
    await repo.write("a.txt", editThreeBlocks(THREE_BLOCKS));
    const { runner } = realRunner(repo.root);
    const raw = repo.git(["diff", "-U3", "HEAD", "--", "a.txt"]);
    const expectedHeaders = raw
      .split("\n")
      .filter(line => line.startsWith("@@"))
      .map(line => parseHunkHeader(line));

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    expect(result.diff.truncated).toBe(false);
    expect(expectedHeaders).toHaveLength(3);
    expect(result.diff.hunks.map(hunk => [hunk.oldStart, hunk.oldLines, hunk.newStart, hunk.newLines])).toEqual(
      expectedHeaders.map(header => [header?.oldStart, header?.oldLines, header?.newStart, header?.newLines]),
    );
  });

  it("numbers the lines of each hunk from the header", async () => {
    repo = await createRepoWithCommit({ "a.txt": THREE_BLOCKS });
    await repo.write("a.txt", editThreeBlocks(THREE_BLOCKS));
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    const first = result.diff.hunks[0];
    expect(first?.oldStart).toBe(1);
    // The first block's change is line 1: one deletion, one addition, then the
    // three context lines that follow it.
    expect(first?.lines[0]).toEqual({ kind: "del", oldLine: 1, newLine: null, text: "line 1" });
    expect(first?.lines[1]).toEqual({ kind: "add", oldLine: null, newLine: 1, text: "line 1 changed" });
    expect(first?.lines[2]).toEqual({ kind: "context", oldLine: 2, newLine: 2, text: "line 2" });
  });

  it("carries the changed text verbatim", async () => {
    repo = await createRepoWithCommit({ "a.txt": "alpha\nbeta\n" });
    await repo.write("a.txt", "alpha\ngamma\n");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    const lines = result.diff.hunks.flatMap(hunk => hunk.lines);
    expect(lines.find(line => line.kind === "del")?.text).toBe("beta");
    expect(lines.find(line => line.kind === "add")?.text).toBe("gamma");
  });

  it("returns an empty hunk list for a change that moves no lines", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { chmod } = await import("node:fs/promises");
    await chmod(`${repo.root}/a.txt`, 0o755);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    expect(result.diff.hunks).toEqual([]);
  });
});

describe("a deleted file's diff", () => {
  it("returns the old side's whole text for a worktree deletion", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "alpha\nbeta\ngamma\n" });
    const { rm } = await import("node:fs/promises");
    await rm(`${repo.root}/gone.txt`);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "gone.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "deleted") return;
    expect(result.diff.lines).toEqual(["alpha", "beta", "gamma"]);
  });

  it("returns the base ref's version, not HEAD's, for a branch deletion", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "at the base\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    // The file changes on the branch and is then deleted, so HEAD no longer has
    // it and only the base can answer what it used to say.
    await repo.write("gone.txt", "changed on the branch\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "change it"]);
    repo.git(["rm", "-q", "gone.txt"]);
    repo.git(["commit", "-qm", "delete it"]);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(
      { runner, cwd: repo.root },
      { scope: { kind: "branch", baseRef: "main" }, path: "gone.txt" },
    );

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "deleted") return;
    // A hard-coded HEAD would return nothing here, or the branch's version.
    expect(result.diff.lines).toEqual(["at the base"]);
  });

  it("reads a file deleted several commits back on the branch", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "original\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    repo.git(["rm", "-q", "gone.txt"]);
    repo.git(["commit", "-qm", "delete it"]);
    await repo.write("later.txt", "later work\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "later work"]);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(
      { runner, cwd: repo.root },
      { scope: { kind: "branch", baseRef: "main" }, path: "gone.txt" },
    );

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "deleted") return;
    expect(result.diff.lines).toEqual(["original"]);
  });
});

describe("an untracked file's diff", () => {
  it("returns the working tree's whole text", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    await repo.write("new.txt", "first\nsecond\n");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "new.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "untracked") return;
    expect(result.diff.lines).toEqual(["first", "second"]);
  });
});

describe("a binary file's diff", () => {
  it("reports its size instead of its content", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { writeFile } = await import("node:fs/promises");
    const bytes = Buffer.from([0, 1, 2, 3, 0, 255, 254]);
    await writeFile(`${repo.root}/blob.bin`, bytes);
    repo.git(["add", "blob.bin"]);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "blob.bin" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "binary") return;
    expect(result.diff.bytes).toBe(bytes.length);
  });
});

describe("a renamed file's diff", () => {
  it("reports the edit, not a whole-file addition", async () => {
    const body = Array.from({ length: 30 }, (_, index) => `line ${index + 1}`).join("\n") + "\n";
    repo = await createRepoWithCommit({ "old.txt": body });
    repo.git(["mv", "old.txt", "renamed.txt"]);
    await repo.write("renamed.txt", body.replace("line 15", "line 15 changed"));
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "renamed.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    // Naming only the new path would make git report every line as added,
    // because the old side has no file at that path.
    const added = result.diff.hunks.flatMap(hunk => hunk.lines).filter(line => line.kind === "add");
    expect(added).toHaveLength(1);
    expect(added[0]?.text).toBe("line 15 changed");
  });
});

describe("the diff budget", () => {
  it("truncates a diff past the line budget and says so", async () => {
    repo = await createRepoWithCommit({ "big.txt": "one\n" });
    // Every line changes, so the diff is as long as the file.
    const lines = Array.from({ length: MAX_DIFF_LINES + 200 }, (_, index) => `changed ${index}`);
    await repo.write("big.txt", `${lines.join("\n")}\n`);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "big.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    expect(result.diff.truncated).toBe(true);
    const kept = result.diff.hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
    expect(kept).toBeLessThanOrEqual(MAX_DIFF_LINES);
    expect(kept).toBeGreaterThan(0);
  });

  it("reports too-large for an untracked file past the line budget", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const lines = Array.from({ length: MAX_DIFF_LINES + 10 }, (_, index) => `line ${index}`);
    await repo.write("huge.txt", `${lines.join("\n")}\n`);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "huge.txt" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("too-large");
  });
});

describe("diff failures", () => {
  it("reports conflicted for a path in conflict", async () => {
    repo = await createRepoWithCommit({ "a.txt": "base\n" });
    repo.git(["checkout", "-q", "-b", "theirs"]);
    await repo.write("a.txt", "theirs\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "theirs"]);
    repo.git(["checkout", "-q", "main"]);
    await repo.write("a.txt", "ours\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "ours"]);
    expect(repo.tryGit(["merge", "theirs"]).code).not.toBe(0);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("conflicted");
  });

  it("reports bad-request for a path that is not changed", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n", "b.txt": "two\n" });
    await repo.write("a.txt", "one changed\n");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "b.txt" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("bad-request");
  });

  it("reports bad-request for an empty path", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("bad-request");
  });

  it("reports not-a-repo outside a repository", async () => {
    repo = await createRepo("review-map-diff-outside");
    const { mkdir, rm } = await import("node:fs/promises");
    const plain = `${repo.root}-plain`;
    await mkdir(plain, { recursive: true });
    const { runner } = realRunner(plain);

    const result = await collectFileDiff({ runner, cwd: plain }, { scope: { kind: "worktree" }, path: "a.txt" });
    await rm(plain, { recursive: true, force: true });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("not-a-repo");
  });

  it("reports no-base when the branch scope has no baseline", async () => {
    repo = await createRepo("review-map-diff-nobase");
    await repo.write("a.txt", "one\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "initial"]);
    repo.git(["branch", "-m", "main", "trunk"]);
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "branch" }, path: "a.txt" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("no-base");
  });
});

describe("hunk parsing over a real diff", () => {
  it("keeps the line count of every hunk equal to the header's claim", async () => {
    repo = await createRepoWithCommit({ "a.txt": THREE_BLOCKS });
    await repo.write("a.txt", editThreeBlocks(THREE_BLOCKS));
    const { runner } = realRunner(repo.root);
    const raw = repo.git(["diff", "-U3", "HEAD", "--", "a.txt"]);

    const hunks = parseHunks(raw);

    expect(hunks).toHaveLength(3);
    for (const hunk of hunks) {
      // The header's counts are git's own claim about the hunk; a parser that
      // drops or duplicates a line breaks this equality.
      expect(hunk.lines.filter(line => line.kind !== "add")).toHaveLength(hunk.oldLines);
      expect(hunk.lines.filter(line => line.kind !== "del")).toHaveLength(hunk.newLines);
    }
  });
});
