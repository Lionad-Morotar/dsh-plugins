/**
 * Ref resolution and the default base: which two revisions a range is about.
 *
 * These run against real repositories, because every rule here is a statement
 * about git's own behaviour: what `rev-parse --verify` accepts, what
 * `merge-base` does with two unrelated histories, and whether a detached HEAD
 * can still be named. A stubbed runner would only restate the implementation.
 */
import { afterEach, describe, expect, it } from "vitest";

import {
  isRefused,
  readOnlyViolation,
  readRefs,
  resolveCompare,
  resolveDefaultBase,
  resolveRef,
  repoRoot,
  runReadOnly,
} from "../src/host/contract.ts";
import { commitAll, createRepo, createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

describe("resolving one ref", () => {
  it("resolves a branch to its full hash", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await resolveRef(runner, repo.root, "main");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hash).toBe(repo.git(["rev-parse", "main"]).trim());
    expect(result.hash).toHaveLength(40);
  });

  it("resolves HEAD", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await resolveRef(runner, repo.root, "HEAD");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hash).toBe(repo.git(["rev-parse", "HEAD"]).trim());
  });

  it("resolves a short hash to the same commit as its full form", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const full = repo.git(["rev-parse", "HEAD"]).trim();
    const short = repo.git(["rev-parse", "--short", "HEAD"]).trim();
    const { runner } = realRunner(repo.root);

    const result = await resolveRef(runner, repo.root, short);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hash).toBe(full);
  });

  it("resolves a tag to the commit it points at", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["tag", "v1.0.0"]);
    const { runner } = realRunner(repo.root);

    const result = await resolveRef(runner, repo.root, "v1.0.0");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hash).toBe(repo.git(["rev-parse", "HEAD"]).trim());
  });

  it("resolves a remote-tracking ref", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    const { runner } = realRunner(repo.root);

    const result = await resolveRef(runner, repo.root, "origin/main");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hash).toBe(repo.git(["rev-parse", "HEAD"]).trim());
  });

  it("reports invalid-ref for a name that does not exist", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await resolveRef(runner, repo.root, "no-such-branch");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid-ref");
  });

  it("reports invalid-ref for a blob, which is not a commit", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const blob = repo.git(["rev-parse", "HEAD:a.txt"]).trim();
    const { runner } = realRunner(repo.root);

    // `^{commit}` is what makes this a commit lookup rather than an object
    // lookup: a tree or blob hash must not pass as a comparison endpoint.
    const result = await resolveRef(runner, repo.root, blob);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid-ref");
  });

  it("resolves a ref from a detached HEAD", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "--detach"]);
    const { runner } = realRunner(repo.root);

    // Detached is a normal state here: every command names its revisions, so
    // nothing depends on there being a branch to name.
    expect(repo.tryGit(["symbolic-ref", "--short", "HEAD"]).code).not.toBe(0);
    const result = await resolveRef(runner, repo.root, "HEAD");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hash).toHaveLength(40);
  });
});

describe("pinning a comparison", () => {
  it("reports the merge base and both counts for two diverged branches", async () => {
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
    const { runner } = realRunner(repo.root);
    const expected = repo.git(["rev-list", "--left-right", "--count", "main...feature"]).trim().split(/\s+/u);

    const result = await resolveCompare(runner, repo.root, "main", "feature");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reading.mergeBase.hash).toBe(forkPoint);
    // Left is base-only (behind), right is head-only (ahead).
    expect(result.reading.behind).toBe(Number(expected[0]));
    expect(result.reading.ahead).toBe(Number(expected[1]));
    expect(result.reading.ahead).toBe(2);
    expect(result.reading.behind).toBe(1);
  });

  it("keeps the input spelling alongside the resolved hash", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("b.txt", "two\n");
    commitAll(repo, "feature");
    const { runner } = realRunner(repo.root);

    const result = await resolveCompare(runner, repo.root, "main", "feature");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The panel echoes what the reader typed, so the reading has to keep it.
    expect(result.reading.base.input).toBe("main");
    expect(result.reading.head.input).toBe("feature");
    expect(result.reading.base.hash).toBe(repo.git(["rev-parse", "main"]).trim());
    expect(result.reading.head.hash).toBe(repo.git(["rev-parse", "feature"]).trim());
    expect(result.reading.mergeBase.short).toHaveLength(7);
  });

  it("reports zero ahead and behind when the two refs are the same commit", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await resolveCompare(runner, repo.root, "main", "HEAD");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reading.ahead).toBe(0);
    expect(result.reading.behind).toBe(0);
    expect(result.reading.mergeBase.hash).toBe(repo.git(["rev-parse", "HEAD"]).trim());
  });

  it("reports invalid-ref when the base does not resolve", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await resolveCompare(runner, repo.root, "nope", "HEAD");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid-ref");
  });

  it("reports invalid-ref when the head does not resolve", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await resolveCompare(runner, repo.root, "HEAD", "nope");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid-ref");
  });

  it("reports no-merge-base for two unrelated histories", async () => {
    // Two repositories with no shared commit: the case `merge-base` answers with
    // exit 1 and no output, which is not the same as a bad ref.
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const other = await createRepoWithCommit({ "b.txt": "two\n" }, "pr-explorer-other");
    try {
      repo.git(["remote", "add", "other", other.root]);
      repo.git(["fetch", "-q", "other"]);
      const { runner } = realRunner(repo.root);

      const result = await resolveCompare(runner, repo.root, "main", "other/main");

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("no-merge-base");
    } finally {
      await other.dispose();
    }
  });
});

describe("the default base", () => {
  it("prefers the remote's default branch", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    repo.git(["symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/main"]);
    const { runner } = realRunner(repo.root);

    const base = await resolveDefaultBase(runner, repo.root);

    // `symbolic-ref` on refs/remotes/origin/HEAD is the only place git records
    // the remote's choice; a local main is a guess by comparison.
    expect(base).toBe("origin/main");
  });

  it("falls back to the local main when no remote names one", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    expect(await resolveDefaultBase(runner, repo.root)).toBe("main");
  });

  it("falls back to master when the repository has no main", async () => {
    repo = await createRepo("pr-explorer-master");
    await repo.write("a.txt", "one\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "initial"]);
    repo.git(["branch", "-m", "main", "master"]);
    const { runner } = realRunner(repo.root);

    expect(await resolveDefaultBase(runner, repo.root)).toBe("master");
  });

  it("returns null when neither main nor master exists", async () => {
    repo = await createRepo("pr-explorer-trunk");
    await repo.write("a.txt", "one\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "initial"]);
    repo.git(["branch", "-m", "main", "trunk"]);
    const { runner } = realRunner(repo.root);

    expect(await resolveDefaultBase(runner, repo.root)).toBeNull();
  });
});

describe("the ref listing", () => {
  it("lists branches, remotes and tags with their kinds", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["branch", "feature"]);
    repo.git(["tag", "v1.0.0"]);
    repo.git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
    const { runner } = realRunner(repo.root);

    const result = await readRefs(runner, repo.root);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const names = result.listing.refs.map(ref => `${ref.kind}:${ref.name}`);
    expect(names).toContain("branch:main");
    expect(names).toContain("branch:feature");
    expect(names).toContain("tag:v1.0.0");
    expect(names).toContain("remote:origin/main");
  });

  it("marks the default base's branch and nothing else", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["branch", "feature"]);
    const { runner } = realRunner(repo.root);

    const result = await readRefs(runner, repo.root);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const defaults = result.listing.refs.filter(ref => ref.isDefault).map(ref => ref.name);
    expect(defaults).toEqual(["main"]);
    expect(result.listing.defaultBase).toBe("main");
  });

  it("reports HEAD as a branch with its short hash", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    const result = await readRefs(runner, repo.root);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.listing.head).toEqual({
      kind: "branch",
      ref: "main",
      shortHash: repo.git(["rev-parse", "--short", "HEAD"]).trim(),
    });
    expect(result.listing.repo).toBe(repo.root.split("/").pop());
  });

  it("reports a detached HEAD without inventing a branch name", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["checkout", "-q", "--detach"]);
    const { runner } = realRunner(repo.root);

    const result = await readRefs(runner, repo.root);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.listing.head.kind).toBe("detached");
    expect(result.listing.head.ref).toBe("HEAD");
  });

  it("lists a ref name once even when several refs share it", async () => {
    repo = await createRepoWithCommit({ "a.txt": "one\n" });
    repo.git(["branch", "feature"]);
    repo.git(["tag", "v1.0.0"]);
    const { runner } = realRunner(repo.root);

    const result = await readRefs(runner, repo.root);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const names = result.listing.refs.map(ref => ref.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("reports not-a-repo outside a repository", async () => {
    repo = await createRepo("pr-explorer-outside");
    const { mkdir, rm } = await import("node:fs/promises");
    const plain = `${repo.root}-plain`;
    await mkdir(plain, { recursive: true });
    const { runner } = realRunner(plain);

    const result = await readRefs(runner, plain);
    await rm(plain, { recursive: true, force: true });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("not-a-repo");
  });
});

describe("the read-only whitelist", () => {
  it("allows the commands a PR read needs", () => {
    for (const args of [
      ["rev-parse", "--show-toplevel"],
      ["symbolic-ref", "--short", "HEAD"],
      ["merge-base", "main", "HEAD"],
      ["rev-list", "--left-right", "--count", "main...HEAD"],
      ["log", "--format=%H", "HEAD"],
      ["diff", "--numstat", "-z", "main", "HEAD"],
      ["for-each-ref", "refs/heads"],
      ["cat-file", "-p", "HEAD:a.txt"],
      ["show", "-s", "HEAD"],
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

  it("finds the repository top level from a subdirectory", async () => {
    repo = await createRepoWithCommit({ "src/deep/a.txt": "one\n" });
    const { runner } = realRunner(repo.root);

    expect(await repoRoot(runner, `${repo.root}/src/deep`)).toBe(repo.root);
  });
});
