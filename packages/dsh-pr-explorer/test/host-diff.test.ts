/**
 * One file's detail inside a range.
 *
 * The hunk assertions compare against `git diff -U3` run directly, so a line
 * number that drifts is caught by git rather than by a fixture that drifted with
 * it. The deleted-file case is the one worth reading closely: the old side has to
 * be the merge base, and a range whose base is several commits back is where a
 * hard-coded `HEAD` shows up as "the file is still there".
 */
import { afterEach, describe, expect, it } from "vitest";

import { collectFileDiff, MAX_DIFF_LINES, parseHunkHeader, parseHunks, splitLines } from "../src/host/diff.ts";
import { commitAll, createRepo, createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

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
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("a.txt", editThreeBlocks(THREE_BLOCKS));
    commitAll(repo, "edit three blocks");
    const { runner } = realRunner(repo.root);
    const raw = repo.git(["diff", "-U3", "main", "feature", "--", "a.txt"]);
    const expectedHeaders = raw
      .split("\n")
      .filter(line => line.startsWith("@@"))
      .map(line => parseHunkHeader(line));

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "a.txt" });

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
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("a.txt", editThreeBlocks(THREE_BLOCKS));
    commitAll(repo, "edit three blocks");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    const first = result.diff.hunks[0];
    expect(first?.oldStart).toBe(1);
    expect(first?.lines[0]).toEqual({ kind: "del", oldLine: 1, newLine: null, text: "line 1" });
    expect(first?.lines[1]).toEqual({ kind: "add", oldLine: null, newLine: 1, text: "line 1 changed" });
    expect(first?.lines[2]).toEqual({ kind: "context", oldLine: 2, newLine: 2, text: "line 2" });
  });

  it("carries the changed text verbatim", async () => {
    repo = await createRepoWithCommit({ "a.txt": "alpha\nbeta\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("a.txt", "alpha\ngamma\n");
    commitAll(repo, "swap a line");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    const lines = result.diff.hunks.flatMap(hunk => hunk.lines);
    expect(lines.find(line => line.kind === "del")?.text).toBe("beta");
    expect(lines.find(line => line.kind === "add")?.text).toBe("gamma");
  });

  it("returns an empty hunk list for a change that moves no lines", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    const { chmod } = await import("node:fs/promises");
    await chmod(`${repo.root}/a.txt`, 0o755);
    commitAll(repo, "flip the mode");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "a.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    expect(result.diff.hunks).toEqual([]);
  });
});

describe("a deleted file's diff", () => {
  it("returns the merge base's whole text, not the head's", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "at the base\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    // The file changes on the branch and is then deleted, so the head no longer
    // has it and only the merge base can answer what it used to say.
    await repo.write("gone.txt", "changed on the branch\n");
    commitAll(repo, "change it");
    repo.git(["rm", "-q", "gone.txt"]);
    commitAll(repo, "delete it");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "gone.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "deleted") return;
    // A hard-coded HEAD would return nothing here, or the branch's version.
    expect(result.diff.lines).toEqual(["at the base"]);
  });

  it("reads a file deleted several commits back on the branch", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "original\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    repo.git(["rm", "-q", "gone.txt"]);
    commitAll(repo, "delete it");
    await repo.write("later.txt", "later work\n");
    commitAll(repo, "later work");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "gone.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "deleted") return;
    expect(result.diff.lines).toEqual(["original"]);
  });
});

describe("a binary file's diff", () => {
  it("reports its size instead of its content", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    const bytes = Buffer.from([0, 1, 2, 3, 0, 255, 254]);
    await repo.writeBytes("blob.bin", bytes);
    commitAll(repo, "add a binary");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "blob.bin" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "binary") return;
    expect(result.diff.bytes).toBe(bytes.length);
  });
});

describe("the diff budget", () => {
  it("truncates a diff past the line budget and says so", async () => {
    repo = await createRepoWithCommit({ "big.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    // Every line changes, so the diff is as long as the file.
    const lines = Array.from({ length: MAX_DIFF_LINES + 200 }, (_, index) => `changed ${String(index)}`);
    await repo.write("big.txt", `${lines.join("\n")}\n`);
    commitAll(repo, "rewrite the file");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "big.txt" });

    expect(result.ok).toBe(true);
    if (!result.ok || result.diff.kind !== "text") return;
    expect(result.diff.truncated).toBe(true);
    const kept = result.diff.hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
    expect(kept).toBeLessThanOrEqual(MAX_DIFF_LINES);
    expect(kept).toBeGreaterThan(0);
  });
});

describe("diff failures", () => {
  it("reports bad-request for a path the range does not change", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n", "b.txt": "two\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("a.txt", "one changed\n");
    commitAll(repo, "touch a");
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "feature", path: "b.txt" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("bad-request");
  });

  it("reports bad-request for an empty path", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "main", head: "HEAD", path: "" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("bad-request");
  });

  it("reports not-a-repo outside a repository", async () => {
    repo = await createRepo("pr-explorer-diff-outside");
    const { mkdir, rm } = await import("node:fs/promises");
    const plain = `${repo.root}-plain`;
    await mkdir(plain, { recursive: true });
    const { runner } = realRunner(plain);

    const result = await collectFileDiff(runner, plain, { base: "main", head: "HEAD", path: "a.txt" });
    await rm(plain, { recursive: true, force: true });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("not-a-repo");
  });

  it("reports invalid-ref when the base does not resolve", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectFileDiff(runner, repo.root, { base: "nope", head: "HEAD", path: "a.txt" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid-ref");
  });
});

describe("hunk parsing over a real diff", () => {
  it("keeps the line count of every hunk equal to the header's claim", async () => {
    repo = await createRepoWithCommit({ "a.txt": THREE_BLOCKS });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("a.txt", editThreeBlocks(THREE_BLOCKS));
    commitAll(repo, "edit three blocks");
    const { runner } = realRunner(repo.root);
    const raw = repo.git(["diff", "-U3", "main", "feature", "--", "a.txt"]);

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
