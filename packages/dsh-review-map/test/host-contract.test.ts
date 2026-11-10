/**
 * Baseline resolution: which two revisions a review compares, and what happens
 * when there is nothing to compare against.
 *
 * These run against real repositories, because every rule here is a statement
 * about git's own behaviour: what `symbolic-ref` says about a remote's default
 * branch, what `merge-base` does with a base that has moved on, and whether a
 * detached HEAD can still be read. A stubbed runner would only restate the
 * implementation.
 */
import { describe, expect, it, afterEach } from "vitest";

import { readOnlyViolation, repoRoot, resolveScope, runReadOnly, isRefused } from "../src/host/contract.ts";
import { createRepo, createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

describe("scope resolution", () => {
  it("compares a worktree review against HEAD", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "worktree" });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.resolved).toEqual({ kind: "worktree", baseRef: "HEAD" });
  });

  it("reduces an explicit base ref to its merge base with HEAD", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    const expectedBase = repo.git(["rev-parse", "main"]).trim();
    // main moves on after the branch was cut, which is the case a plain two-dot
    // diff would misreport as this branch's work.
    repo.git(["checkout", "-q", "main"]);
    await repo.write("c.txt", "three\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "main moves on"]);
    repo.git(["checkout", "-q", "feature"]);
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "branch", baseRef: "main" });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.resolved.kind).toBe("branch");
    expect(resolved.resolved.baseRef).toBe(expectedBase);
  });

  it("falls back to the local main when no remote names a default branch", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    const mainTip = repo.git(["rev-parse", "main"]).trim();
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "branch" });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.resolved.baseRef).toBe(mainTip);
  });

  it("prefers the remote's default branch over a local main", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    // A remote-tracking default without a network: the symbolic ref is what git
    // records on clone, and it is the only place the remote's choice is stored.
    repo.git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    repo.git(["symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/main"]);
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    const originTip = repo.git(["rev-parse", "origin/main"]).trim();
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "branch" });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.resolved.baseRef).toBe(originTip);
  });

  it("falls back to master when the repository has no main", async () => {
    repo = await createRepo("review-map-master");
    await repo.write("a.txt", "one\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "initial"]);
    repo.git(["branch", "-m", "main", "master"]);
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    const masterTip = repo.git(["rev-parse", "master"]).trim();
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "branch" });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.resolved.baseRef).toBe(masterTip);
  });

  it("reports no-base when there is no remote default, main or master", async () => {
    repo = await createRepo("review-map-nobase");
    await repo.write("a.txt", "one\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "initial"]);
    repo.git(["branch", "-m", "main", "trunk"]);
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "branch" });

    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.error.code).toBe("no-base");
  });

  it("reports no-base for an explicit ref that does not exist", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "branch", baseRef: "no-such-branch" });

    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.error.code).toBe("no-base");
  });

  it("resolves a branch review from a detached HEAD", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature work"]);
    const mainTip = repo.git(["rev-parse", "main"]).trim();
    repo.git(["checkout", "-q", "--detach"]);
    const { runner } = realRunner(repo.root);

    // Detached is a normal review state: every command names its revisions, so
    // nothing depends on there being a branch to name.
    expect(repo.tryGit(["symbolic-ref", "--short", "HEAD"]).code).not.toBe(0);
    const resolved = await resolveScope(runner, repo.root, { kind: "branch" });

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.resolved.baseRef).toBe(mainTip);
  });

  it("reports no-base for a worktree review of a repository with no commit", async () => {
    repo = await createRepo("review-map-unborn");
    await repo.write("a.txt", "one\n");
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "worktree" });

    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.error.code).toBe("no-base");
  });

  it("finds no repository above a plain directory", async () => {
    repo = await createRepo("review-map-plain");
    const { runner } = realRunner(repo.root);
    const plain = `${repo.root}-not-a-repo`;
    const { mkdir, rm } = await import("node:fs/promises");
    await mkdir(plain, { recursive: true });

    const root = await repoRoot(runner, plain);
    await rm(plain, { recursive: true, force: true });

    expect(root).toBeNull();
  });

  it("finds the top level from a subdirectory", async () => {
    repo = await createRepoWithCommit({ "src/deep/a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const root = await repoRoot(runner, `${repo.root}/src/deep`);

    expect(root).toBe(repo.root);
  });

  it("rejects an unknown scope kind", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const resolved = await resolveScope(runner, repo.root, { kind: "nonsense" } as never);

    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.error.code).toBe("bad-request");
  });
});

describe("the read-only whitelist", () => {
  it("allows the commands a review needs", () => {
    for (const args of [
      ["rev-parse", "--show-toplevel"],
      ["symbolic-ref", "--short", "HEAD"],
      ["merge-base", "main", "HEAD"],
      ["status", "--porcelain=v2", "-z"],
      ["diff", "HEAD", "--numstat", "-z"],
      ["cat-file", "-p", "HEAD:a.txt"],
    ]) {
      expect(readOnlyViolation(args)).toBeNull();
    }
  });

  it("refuses a subcommand that can write", () => {
    for (const args of [["commit", "-m", "x"], ["checkout", "main"], ["stash"], ["clean", "-fd"], ["fetch"], ["update-index", "--add", "a"]]) {
      expect(readOnlyViolation(args)).not.toBeNull();
    }
  });

  it("refuses the flags that turn a read into a write or run a program", () => {
    expect(readOnlyViolation(["diff", "--output=/tmp/x", "HEAD"])).not.toBeNull();
    expect(readOnlyViolation(["diff", "--ext-diff", "HEAD"])).not.toBeNull();
    expect(readOnlyViolation(["diff", "--textconv", "HEAD"])).not.toBeNull();
    expect(readOnlyViolation(["diff", "--no-index", "a", "b"])).not.toBeNull();
  });

  it("refuses to spawn a command outside the whitelist", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner, calls } = realRunner(repo.root);

    const result = await runReadOnly(runner, ["commit", "-m", "should not happen"]);

    expect(isRefused(result)).toBe(true);
    expect(calls).toHaveLength(0);
  });

  it("runs a whitelisted command for real", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await runReadOnly(runner, ["rev-parse", "--show-toplevel"], { cwd: repo.root });

    expect(isRefused(result)).toBe(false);
    if (isRefused(result)) return;
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe(repo.root);
  });
});
