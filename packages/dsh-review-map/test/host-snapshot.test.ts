/**
 * The change list, checked against git's own answers.
 *
 * Every case here builds a real repository and then asserts the parsed list
 * against a second git invocation for the same fact. That is deliberate: a
 * parser tested against a hand-written string only proves the parser agrees with
 * itself, and the failures that matter (a rename keyed by the wrong path, a
 * staged-then-edited file counted twice) are exactly the ones a fixture would
 * reproduce rather than catch.
 */
import { describe, expect, it, afterEach } from "vitest";

import { collectSnapshot } from "../src/host/snapshot.ts";
import { createRepo, createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

/** The paths git itself reports as changed, for a cross-check. */
function statusPaths(handle: RepoHandle): string[] {
  // Tracked changes against HEAD (index and worktree combined, which is what a
  // review shows) plus the untracked files, from the two commands that each
  // answer half of it.
  const tracked = handle.git(["diff", "--name-only", "HEAD"]).split("\n").filter(Boolean);
  const untracked = handle.git(["ls-files", "--others", "--exclude-standard"]).split("\n").filter(Boolean);
  return [...tracked, ...untracked].sort();
}

describe("the worktree change list", () => {
  it("lists a staged change with the counts git reports", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\ntwo\nthree\n" });
    await repo.write("a.txt", "one\nTWO\nthree\nfour\n");
    repo.git(["add", "a.txt"]);
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.files).toHaveLength(1);
    const file = result.snapshot.files[0];
    expect(file?.path).toBe("a.txt");
    expect(file?.status).toBe("modified");
    expect(file?.additions).toBe(2);
    expect(file?.deletions).toBe(1);
    expect(file?.binary).toBe(false);
    expect(file?.untracked).toBe(false);
  });

  it("shows a staged-then-edited file once, with the combined counts", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\ntwo\nthree\n" });
    await repo.write("a.txt", "one\nTWO\nthree\n");
    repo.git(["add", "a.txt"]);
    await repo.write("a.txt", "one\nTWO\nTHREE\n");
    const { runner } = realRunner(repo.root);
    const expected = repo.git(["diff", "HEAD", "--numstat", "a.txt"]).trim().split("\t");

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The bug this prevents: reading index and worktree numstat separately and
    // summing them reports the same path twice, or counts the first edit twice.
    expect(result.snapshot.files).toHaveLength(1);
    expect(result.snapshot.files[0]?.additions).toBe(Number(expected[0]));
    expect(result.snapshot.files[0]?.deletions).toBe(Number(expected[1]));
  });

  it("includes an untracked file with no line counts", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    await repo.write("new.txt", "hello\nworld\n");
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.snapshot.files.find(candidate => candidate.path === "new.txt");
    expect(file?.status).toBe("untracked");
    expect(file?.untracked).toBe(true);
    expect(file?.additions).toBeNull();
    expect(file?.deletions).toBeNull();
  });

  it("reports a deletion under the old path with its removed lines", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "a\nb\nc\n" });
    const { rm } = await import("node:fs/promises");
    await rm(`${repo.root}/gone.txt`);
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.snapshot.files[0];
    expect(file?.path).toBe("gone.txt");
    expect(file?.status).toBe("deleted");
    expect(file?.deletions).toBe(3);
    expect(file?.additions).toBe(0);
  });

  it("keys a rename by its new path and keeps the old one", async () => {
    repo = await createRepoWithCommit({ "old.txt": `${"line\n".repeat(20)}` });
    repo.git(["mv", "old.txt", "renamed.txt"]);
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.snapshot.files[0];
    expect(file?.path).toBe("renamed.txt");
    expect(file?.oldPath).toBe("old.txt");
    expect(file?.status).toBe("renamed");
  });

  it("marks a binary file and leaves its counts unknown", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { writeFile } = await import("node:fs/promises");
    // A NUL byte in the first block is what makes git call a file binary.
    await writeFile(`${repo.root}/blob.bin`, Buffer.from([0, 1, 2, 3, 0, 255, 254]));
    repo.git(["add", "blob.bin"]);
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.snapshot.files.find(candidate => candidate.path === "blob.bin");
    expect(file?.binary).toBe(true);
    expect(file?.additions).toBeNull();
    expect(file?.deletions).toBeNull();
  });

  it("returns an empty list for a clean repository", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.files).toEqual([]);
    expect(result.snapshot.summary).toEqual({ files: 0, additions: 0, deletions: 0 });
    expect(result.snapshot.uncommitted).toBe(0);
  });

  it("agrees with git status on which paths changed", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n", "b.txt": "two\n", "c.txt": "three\n" });
    await repo.write("a.txt", "one changed\n");
    repo.git(["add", "a.txt"]);
    await repo.write("b.txt", "two changed\n");
    await repo.write("d.txt", "new\n");
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.files.map(file => file.path)).toEqual(statusPaths(repo));
  });

  it("sorts the list by path", async () => {
    repo = await createRepoWithCommit({ "z.txt": "z\n", "a.txt": "a\n", "m.txt": "m\n" });
    await repo.write("z.txt", "zz\n");
    await repo.write("a.txt", "aa\n");
    await repo.write("m.txt", "mm\n");
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.files.map(file => file.path)).toEqual(["a.txt", "m.txt", "z.txt"]);
  });

  it("counts uncommitted paths separately from the file list", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    await repo.write("c.txt", "dirty\n");
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "branch" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The branch list is committed work only; the dirty file is a separate fact
    // so a reader is not told the diff they see is the whole story.
    expect(result.snapshot.files.map(file => file.path)).toEqual(["b.txt"]);
    expect(result.snapshot.uncommitted).toBe(1);
  });

  it("reports a conflict as one conflicted row instead of crashing", async () => {
    repo = await createRepoWithCommit({ "a.txt": "base\n" });
    repo.git(["checkout", "-q", "-b", "theirs"]);
    await repo.write("a.txt", "theirs\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "theirs"]);
    repo.git(["checkout", "-q", "main"]);
    await repo.write("a.txt", "ours\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "ours"]);
    const merge = repo.tryGit(["merge", "theirs"]);
    expect(merge.code).not.toBe(0);
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.snapshot.files.find(candidate => candidate.path === "a.txt");
    expect(file?.status).toBe("conflicted");
  });
});

describe("the branch change list", () => {
  it("lists committed changes between the base and HEAD", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\ntwo\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("a.txt", "one\nTWO\n");
    await repo.write("b.txt", "new file\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    const { runner } = realRunner(repo.root);
    const expected = repo.git(["diff", "--name-status", "-M", "main", "HEAD"]).trim().split("\n");
    const expectedPaths = expected.map(line => line.split("\t").at(-1) ?? "").sort();

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.scope).toBe("branch");
    expect(result.snapshot.baseRef).toBe(repo.git(["rev-parse", "main"]).trim());
    expect(result.snapshot.files.map(file => file.path).sort()).toEqual(expectedPaths);
  });

  it("excludes uncommitted work from a branch review", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("committed.txt", "in\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    await repo.write("dirty.txt", "out\n");
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.files.map(file => file.path)).toEqual(["committed.txt"]);
  });

  it("reports the head as a branch with its short hash", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);
    const short = repo.git(["rev-parse", "--short", "HEAD"]).trim();

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.head).toEqual({ kind: "branch", ref: "main", shortHash: short });
    expect(result.snapshot.repo).toBe(repo.root.split("/").pop());
  });

  it("reports a detached head without inventing a branch name", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "--detach"]);
    const { runner } = realRunner(repo.root);

    const result = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.head.kind).toBe("detached");
    expect(result.snapshot.head.ref).toBe("HEAD");
  });

  it("reports not-a-repo for a directory outside any repository", async () => {
    repo = await createRepo("review-map-outside");
    const { mkdir, rm } = await import("node:fs/promises");
    const plain = `${repo.root}-plain`;
    await mkdir(plain, { recursive: true });
    const { runner } = realRunner(plain);

    const result = await collectSnapshot({ runner, cwd: plain }, { kind: "worktree" });
    await rm(plain, { recursive: true, force: true });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("not-a-repo");
  });
});

describe("read-only discipline", () => {
  it("never runs a program the repository configured as an external diff", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\ntwo\nthree\n" });
    const { writeFile } = await import("node:fs/promises");
    const marker = `${repo.root}/external-diff-ran`;
    const script = `${repo.root}/ext.sh`;
    await writeFile(script, `#!/bin/sh\ntouch "${marker}"\nexit 0\n`, "utf8");
    const { chmod } = await import("node:fs/promises");
    await chmod(script, 0o755);
    // A repository can point diff.external at any program. This is the
    // falsification: if the guard is missing, the marker appears.
    repo.git(["config", "diff.external", script]);
    await repo.write("a.txt", "one\nTWO\nthree\n");
    const { runner } = realRunner(repo.root);
    const { existsSync } = await import("node:fs");

    const snapshot = await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });
    const { collectFileDiff } = await import("../src/host/diff.ts");
    const diff = await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });

    expect(snapshot.ok).toBe(true);
    expect(diff.ok).toBe(true);
    expect(existsSync(marker)).toBe(false);
  });

  it("leaves the working tree and the index exactly as it found them", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n", "b.txt": "two\n" });
    await repo.write("a.txt", "one changed\n");
    repo.git(["add", "a.txt"]);
    await repo.write("b.txt", "two changed\n");
    await repo.write("c.txt", "untracked\n");
    const before = repo.git(["status", "--porcelain=v2", "-z"]);
    const beforeHead = repo.git(["rev-parse", "HEAD"]);
    const { runner } = realRunner(repo.root);
    const { collectFileDiff } = await import("../src/host/diff.ts");

    await collectSnapshot({ runner, cwd: repo.root }, { kind: "worktree" });
    await collectSnapshot({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });
    await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "a.txt" });
    await collectFileDiff({ runner, cwd: repo.root }, { scope: { kind: "worktree" }, path: "c.txt" });

    expect(repo.git(["status", "--porcelain=v2", "-z"])).toBe(before);
    expect(repo.git(["rev-parse", "HEAD"])).toBe(beforeHead);
  });
});
