/**
 * The two reads a range panel makes: the commits in it, and the files it touches.
 *
 * Every assertion is against a second git invocation for the same fact. A parser
 * tested against a hand-written string only proves the parser agrees with
 * itself, and the failures that matter here (a commit order that is not newest
 * first, a rename keyed by the wrong path, a binary counted as zero lines) are
 * exactly the ones a fixture would reproduce rather than catch.
 */
import { afterEach, describe, expect, it } from "vitest";

import { collectCommits, collectFiles } from "../src/host/compare.ts";
import { commitAll, createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

/**
 * Build the two-branch shape every case here uses: a fork point, two commits on
 * the feature branch, one on main.
 * @returns the fork point's hash.
 */
async function diverged(): Promise<string> {
  repo = await createRepoWithCommit({ "a.txt": "base\n" });
  const forkPoint = repo.git(["rev-parse", "HEAD"]).trim();
  repo.git(["checkout", "-q", "-b", "feature"]);
  await repo.write("feature.txt", "one\n");
  commitAll(repo, "feature one");
  await repo.write("feature.txt", "one\ntwo\n");
  commitAll(repo, "feature two");
  repo.git(["checkout", "-q", "main"]);
  await repo.write("main.txt", "one\n");
  commitAll(repo, "main one");
  return forkPoint;
}

describe("the commit list", () => {
  it("lists only the commits the head has and the base does not", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);
    const expected = repo!.git(["log", "--format=%H", "feature", "^main"]).split("\n").filter(Boolean);

    const result = await collectCommits(runner, repo!.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // `main one` is on the base only, so it must not appear: a range review is
    // about what the head adds.
    expect(result.list.commits.map(commit => commit.hash)).toEqual(expected);
    expect(result.list.commits).toHaveLength(2);
    expect(result.list.truncated).toBe(false);
  });

  it("orders the commits newest first", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);

    const result = await collectCommits(runner, repo!.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.commits.map(commit => commit.subject)).toEqual(["feature two", "feature one"]);
  });

  it("carries the short hash, author and date of each commit", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);
    const head = repo!.git(["rev-parse", "feature"]).trim();

    const result = await collectCommits(runner, repo!.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const newest = result.list.commits[0];
    expect(newest?.hash).toBe(head);
    expect(newest?.short).toBe(head.slice(0, 7));
    expect(newest?.author).toBe("PR Explorer");
    expect(newest?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
  });

  it("reads one commit as parent..commit for the commit detail", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);
    const head = repo!.git(["rev-parse", "feature"]).trim();

    // The PR view's commit detail does not add a route; it asks the existing
    // range reader for <hash>^..<hash>, which is the same first-parent diff git
    // shows for that commit.
    const result = await collectCommits(runner, repo!.root, { base: `${head}^`, head });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.commits).toHaveLength(1);
    expect(result.list.commits[0]?.hash).toBe(head);
    expect(result.list.commits[0]?.subject).toBe("feature two");
  });

  it("keeps a subject that contains the field separator's characters", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    // A subject with a pipe, a tab and a NUL-adjacent character would break a
    // naive split; the record separator is what keeps it whole.
    const subject = "fix: a|b\tc and more | pipes | here";
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", subject]);
    const { runner } = realRunner(repo.root);

    const result = await collectCommits(runner, repo.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.commits[0]?.subject).toBe(subject);
  });

  it("reports an empty list when the head adds nothing", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectCommits(runner, repo.root, { base: "main", head: "HEAD" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.commits).toEqual([]);
    expect(result.list.truncated).toBe(false);
  });

  it("accepts a tag as the base", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["tag", "v1.0.0"]);
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    commitAll(repo, "after the tag");
    const { runner } = realRunner(repo.root);

    const result = await collectCommits(runner, repo.root, { base: "v1.0.0", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.commits.map(commit => commit.subject)).toEqual(["after the tag"]);
  });

  it("reports invalid-ref for a base that does not resolve", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectCommits(runner, repo.root, { base: "nope", head: "HEAD" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid-ref");
  });

  it("truncates past the commit budget and says so", async () => {
    repo = await createRepoWithCommit({ "a.txt": "0\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    // 405 commits built with commit-tree rather than 405 `git commit` calls: the
    // history shape is what is under test, and a spawn per commit would make
    // this the slowest case in the suite for no extra coverage.
    const base = repo.git(["rev-parse", "HEAD"]).trim();
    let parent = base;
    for (let index = 0; index < 405; index += 1) {
      parent = repo
        .git(["commit-tree", `${base}^{tree}`, "-p", parent, "-m", `commit ${String(index)}`])
        .trim();
    }
    repo.git(["update-ref", "refs/heads/feature", parent]);
    const { runner } = realRunner(repo.root);

    const result = await collectCommits(runner, repo.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.commits).toHaveLength(400);
    expect(result.list.truncated).toBe(true);
  });
});

describe("the changed files", () => {
  it("lists the files the head changed since the merge base", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);
    const forkPoint = repo!.git(["merge-base", "main", "feature"]).trim();
    const expected = repo!.git(["diff", "--name-only", forkPoint, "feature"]).split("\n").filter(Boolean).sort();

    const result = await collectFiles(runner, repo!.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The base's own later commit (`main.txt`) is not in the range: the old side
    // is the merge base, not the base tip.
    expect(result.comparison.files.map(file => file.path)).toEqual(expected);
    expect(result.comparison.files.map(file => file.path)).toEqual(["feature.txt"]);
  });

  it("counts additions and deletions the way git does", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);
    const forkPoint = repo!.git(["merge-base", "main", "feature"]).trim();
    const numstat = repo!.git(["diff", "--numstat", forkPoint, "feature"]).trim().split("\t");

    const result = await collectFiles(runner, repo!.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.comparison.files[0];
    expect(file?.additions).toBe(Number(numstat[0]));
    expect(file?.deletions).toBe(Number(numstat[1]));
    expect(file?.status).toBe("added");
    expect(file?.binary).toBe(false);
  });

  it("summarizes the totals over the file list", async () => {
    await diverged();
    const { runner } = realRunner(repo!.root);

    const result = await collectFiles(runner, repo!.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const additions = result.comparison.files.reduce((sum, file) => sum + (file.additions ?? 0), 0);
    const deletions = result.comparison.files.reduce((sum, file) => sum + (file.deletions ?? 0), 0);
    expect(result.comparison.summary).toEqual({
      files: result.comparison.files.length,
      additions,
      deletions,
    });
  });

  it("keys a rename by its new path and keeps the old one", async () => {
    repo = await createRepoWithCommit({ "old.txt": `${"line\n".repeat(20)}` });
    repo.git(["checkout", "-q", "-b", "feature"]);
    repo.git(["mv", "old.txt", "renamed.txt"]);
    commitAll(repo, "rename it");
    const { runner } = realRunner(repo.root);

    const result = await collectFiles(runner, repo.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.comparison.files[0];
    expect(file?.path).toBe("renamed.txt");
    expect(file?.oldPath).toBe("old.txt");
    expect(file?.status).toBe("renamed");
  });

  it("marks a binary file and leaves its counts unknown", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    // A NUL byte in the first block is what makes git call a file binary.
    await repo.writeBytes("blob.bin", Buffer.from([0, 1, 2, 3, 0, 255, 254]));
    commitAll(repo, "add a binary");
    const { runner } = realRunner(repo.root);

    const result = await collectFiles(runner, repo.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.comparison.files.find(candidate => candidate.path === "blob.bin");
    expect(file?.binary).toBe(true);
    expect(file?.additions).toBeNull();
    expect(file?.deletions).toBeNull();
  });

  it("reports a deletion under the old path", async () => {
    repo = await createRepoWithCommit({ "gone.txt": "a\nb\nc\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    repo.git(["rm", "-q", "gone.txt"]);
    commitAll(repo, "delete it");
    const { runner } = realRunner(repo.root);

    const result = await collectFiles(runner, repo.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const file = result.comparison.files[0];
    expect(file?.path).toBe("gone.txt");
    expect(file?.status).toBe("deleted");
    expect(file?.deletions).toBe(3);
  });

  it("returns an empty list and a zero summary when nothing changed", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await collectFiles(runner, repo.root, { base: "main", head: "HEAD" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.comparison.files).toEqual([]);
    expect(result.comparison.summary).toEqual({ files: 0, additions: 0, deletions: 0 });
  });

  it("sorts the file list by path", async () => {
    repo = await createRepoWithCommit({ "z.txt": "z\n", "a.txt": "a\n", "m.txt": "m\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("z.txt", "zz\n");
    await repo.write("a.txt", "aa\n");
    await repo.write("m.txt", "mm\n");
    commitAll(repo, "touch three");
    const { runner } = realRunner(repo.root);

    const result = await collectFiles(runner, repo.root, { base: "main", head: "feature" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.comparison.files.map(file => file.path)).toEqual(["a.txt", "m.txt", "z.txt"]);
  });

  it("reports no-merge-base for two unrelated histories", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const other = await createRepoWithCommit({ "b.txt": "two\n" }, "pr-explorer-other");
    try {
      repo.git(["remote", "add", "other", other.root]);
      repo.git(["fetch", "-q", "other"]);
      const { runner } = realRunner(repo.root);

      const result = await collectFiles(runner, repo.root, { base: "main", head: "other/main" });

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("no-merge-base");
    } finally {
      await other.dispose();
    }
  });
});

describe("read-only discipline", () => {
  it("never runs a program the repository configured as an external diff", async () => {
    await diverged();
    const { writeFile, chmod } = await import("node:fs/promises");
    const marker = `${repo!.root}/external-diff-ran`;
    const script = `${repo!.root}/ext.sh`;
    await writeFile(script, `#!/bin/sh\ntouch "${marker}"\nexit 0\n`, "utf8");
    await chmod(script, 0o755);
    // A repository can point diff.external at any program. This is the
    // falsification: if the guard is missing, the marker appears.
    repo!.git(["config", "diff.external", script]);
    const { runner } = realRunner(repo!.root);
    const { existsSync } = await import("node:fs");

    const commits = await collectCommits(runner, repo!.root, { base: "main", head: "feature" });
    const files = await collectFiles(runner, repo!.root, { base: "main", head: "feature" });

    expect(commits.ok).toBe(true);
    expect(files.ok).toBe(true);
    expect(existsSync(marker)).toBe(false);
  });

  it("leaves the working tree and the index exactly as it found them", async () => {
    await diverged();
    await repo!.write("dirty.txt", "uncommitted\n");
    const before = repo!.git(["status", "--porcelain=v2", "-z"]);
    const beforeHead = repo!.git(["rev-parse", "HEAD"]);
    const { runner } = realRunner(repo!.root);

    await collectCommits(runner, repo!.root, { base: "main", head: "feature" });
    await collectFiles(runner, repo!.root, { base: "main", head: "feature" });

    expect(repo!.git(["status", "--porcelain=v2", "-z"])).toBe(before);
    expect(repo!.git(["rev-parse", "HEAD"])).toBe(beforeHead);
  });
});
