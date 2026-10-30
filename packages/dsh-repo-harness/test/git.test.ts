import { mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  createGitRunner,
  detectDefaultBranch,
  isAncestor,
  readCommitMessage,
  readCommitParents,
  readCurrentBranch,
  readReflog,
  readRefs,
  resolveRepo,
  type GitRunner,
  type GitRunResult,
} from "../src/git.ts";
import { createNodeSubprocess, createTempRepo } from "./helpers/real-git.ts";

function result(overrides: Partial<GitRunResult> = {}): GitRunResult {
  return {
    argv: ["git"],
    exitCode: 0,
    stdout: "",
    stderr: "",
    timedOut: false,
    cancelled: false,
    stdoutLossy: false,
    ...overrides,
  };
}

function fakeRunner(handler: (args: readonly string[]) => GitRunResult): GitRunner {
  return {
    cwd: "/work/repo",
    async run(args) {
      return handler(args);
    },
  };
}

describe("resolveRepo", () => {
  it("parses the rev-parse contract", async () => {
    const runner = fakeRunner(() =>
      result({ stdout: "true\n/work/repo\n/work/repo/.git\n" }),
    );
    await expect(resolveRepo(runner)).resolves.toEqual({
      root: "/work/repo",
      commonDir: "/work/repo/.git",
      label: "repo",
    });
  });

  it("falls back when --path-format is unsupported", async () => {
    const runner = fakeRunner((args) => {
      if (args.includes("--path-format=absolute")) return result({ exitCode: 129, stderr: "unknown option" });
      return result({ stdout: "true\n/work/repo\n.git\n" });
    });
    await expect(resolveRepo(runner)).resolves.toEqual({
      root: "/work/repo",
      commonDir: "/work/repo/.git",
      label: "repo",
    });
  });

  it("returns null outside a work tree", async () => {
    const runner = fakeRunner(() => result({ stdout: "false\n" }));
    await expect(resolveRepo(runner)).resolves.toBeNull();
  });
});

describe("git readers", () => {
  it("reads refs as a map", async () => {
    const runner = fakeRunner(() =>
      result({ stdout: "refs/heads/main\tabc\nrefs/heads/feature\tdef\n" }),
    );
    await expect(readRefs(runner)).resolves.toEqual(
      new Map([
        ["refs/heads/main", "abc"],
        ["refs/heads/feature", "def"],
      ]),
    );
  });

  it("parses reflog entries", async () => {
    const runner = fakeRunner(() =>
      result({ stdout: "c\t1700\tmerge feature: Fast-forward\nb\t1699\tcommit: work\n" }),
    );
    await expect(readReflog(runner, "refs/heads/main")).resolves.toEqual([
      { sha: "c", time: 1700, subject: "merge feature: Fast-forward" },
      { sha: "b", time: 1699, subject: "commit: work" },
    ]);
  });

  it("reads a commit message", async () => {
    const runner = fakeRunner(() => result({ stdout: "Merge feature\n\nbody\n" }));
    await expect(readCommitMessage(runner, "abc")).resolves.toBe("Merge feature\n\nbody");
  });

  it("reads parents", async () => {
    const runner = fakeRunner(() => result({ stdout: "c b a\n" }));
    await expect(readCommitParents(runner, "c")).resolves.toEqual(["c", "b", "a"]);
  });

  it("answers ancestor checks by exit code", async () => {
    await expect(isAncestor(fakeRunner(() => result({ exitCode: 0 })), "a", "b")).resolves.toBe(true);
    await expect(isAncestor(fakeRunner(() => result({ exitCode: 1 })), "a", "b")).resolves.toBe(false);
  });

  it("returns null for a detached HEAD", async () => {
    await expect(readCurrentBranch(fakeRunner(() => result({ exitCode: 1 })))).resolves.toBeNull();
  });

  it("detects the default branch from origin/HEAD, config, then a local main", async () => {
    const origin = fakeRunner((args) => {
      if (args[0] === "symbolic-ref") return result({ stdout: "origin/trunk\n" });
      return result({ exitCode: 1 });
    });
    await expect(detectDefaultBranch(origin)).resolves.toBe("trunk");

    const configured = fakeRunner((args) => {
      if (args[0] === "symbolic-ref") return result({ exitCode: 1 });
      if (args[0] === "config") return result({ stdout: "develop\n" });
      return result({ exitCode: 1 });
    });
    await expect(detectDefaultBranch(configured)).resolves.toBe("develop");

    const local = fakeRunner((args) => {
      if (args[0] === "symbolic-ref") return result({ exitCode: 1 });
      if (args[0] === "config") return result({ exitCode: 1 });
      if (args[0] === "show-ref" && args.includes("refs/heads/main")) return result({ exitCode: 0 });
      return result({ exitCode: 1 });
    });
    await expect(detectDefaultBranch(local)).resolves.toBe("main");

    const none = fakeRunner(() => result({ exitCode: 1 }));
    await expect(detectDefaultBranch(none)).resolves.toBeNull();
  });
});

describe("real git integration", () => {
  it("resolves a repository and reads a real merge", async () => {
    const repo = createTempRepo();
    repo.git("checkout", "-b", "feature");
    const featureSha = repo.commitFile("feature.txt", "feature\n", "feature work");
    repo.git("checkout", "main");
    const mainSha = repo.git("rev-parse", "HEAD");
    repo.git("merge", "--no-ff", "feature", "-m", "merge feature");
    const mergeSha = repo.git("rev-parse", "HEAD");
    const runner = createGitRunner({ subprocess: createNodeSubprocess(), cwd: repo.root });

    await expect(resolveRepo(runner)).resolves.toEqual({
      root: realpathSync(repo.root),
      commonDir: realpathSync(join(repo.root, ".git")),
      label: basename(repo.root),
    });

    const refs = await readRefs(runner);
    expect(refs.get("refs/heads/main")).toBe(mergeSha);
    expect(refs.get("refs/heads/feature")).toBe(featureSha);

    const entries = await readReflog(runner, "refs/heads/main");
    expect(entries[0]?.subject).toContain("merge feature");

    await expect(readCommitMessage(runner, mergeSha)).resolves.toContain("merge feature");
    await expect(readCommitParents(runner, mergeSha)).resolves.toEqual([mergeSha, mainSha, featureSha]);
    await expect(isAncestor(runner, featureSha, mergeSha)).resolves.toBe(true);
    await expect(readCurrentBranch(runner)).resolves.toBe("main");
    await expect(detectDefaultBranch(runner)).resolves.toBe("main");
  });

  it("resolves a linked worktree to the same common directory", async () => {
    const repo = createTempRepo();
    const worktreePath = join(tmpdir(), `${basename(repo.root)}-wt`);
    repo.git("worktree", "add", "-b", "topic", worktreePath);
    const runner = createGitRunner({ subprocess: createNodeSubprocess(), cwd: worktreePath });

    const resolved = await resolveRepo(runner);
    expect(resolved?.commonDir).toBe(realpathSync(join(repo.root, ".git")));
    await expect(readCurrentBranch(runner)).resolves.toBe("topic");
  });

  it("returns null outside any repository", async () => {
    const outside = mkdtempSync(join(tmpdir(), "dsh-repo-harness-outside-"));
    const runner = createGitRunner({ subprocess: createNodeSubprocess(), cwd: outside });
    await expect(resolveRepo(runner)).resolves.toBeNull();
  });
});
