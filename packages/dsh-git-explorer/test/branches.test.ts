import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { collectBranches, parseBranchRefs, parseWorktreeList } from "../src/host/branches.ts";
import type { GitRunner, GitRunResult } from "../src/host/git.ts";

const BRANCH_FORMAT = "--format=%(refname:short)%00%(objectname)%00%(HEAD)%00%(upstream:short)";

function ok(argv: readonly string[], stdout: string): GitRunResult {
  return { argv, exitCode: 0, stdout, stderr: "", timedOut: false, cancelled: false, stdoutLossy: false };
}

function failed(argv: readonly string[], exitCode: number, stderr: string): GitRunResult {
  return { argv, exitCode, stdout: "", stderr, timedOut: false, cancelled: false, stdoutLossy: false };
}

interface RunnerCall {
  readonly argv: readonly string[];
  readonly cwd: string | undefined;
}

function fakeRunner(reply: (args: readonly string[]) => GitRunResult): { runner: GitRunner; calls: RunnerCall[] } {
  const calls: RunnerCall[] = [];
  const runner: GitRunner = {
    async run(args, options = {}) {
      calls.push({ argv: [...args], cwd: options.cwd });
      return reply(args);
    },
  };
  return { runner, calls };
}

const REFS = [
  "feat/one\0bbb\0 \0origin/feat/one",
  "main\0aaa\0*\0origin/main",
  "no-upstream\0ccc\0 \0",
].join("\n");

const WORKTREES = [
  "worktree /repo",
  "HEAD aaa",
  "branch refs/heads/main",
  "",
  "worktree /tmp/feature one",
  "HEAD bbb",
  "branch refs/heads/feat/one",
  "",
  "worktree /tmp/peek",
  "HEAD ccc",
  "detached",
  "",
].join("\n");

describe("parseBranchRefs", () => {
  it("reads the current marker, the upstream and an empty last field", () => {
    expect(parseBranchRefs(REFS)).toEqual([
      { name: "feat/one", hash: "bbb", current: false, upstream: "origin/feat/one" },
      { name: "main", hash: "aaa", current: true, upstream: "origin/main" },
      { name: "no-upstream", hash: "ccc", current: false },
    ]);
  });

  it("tolerates CRLF and drops malformed records", () => {
    expect(parseBranchRefs("main\0aaa\0*\0\r\n")).toEqual([{ name: "main", hash: "aaa", current: true }]);
    expect(parseBranchRefs("\nsolo\n\0aaa\0*\0\n")).toEqual([]);
  });
});

describe("parseWorktreeList", () => {
  it("reads the main checkout, a path with spaces and a detached worktree", () => {
    expect(parseWorktreeList(WORKTREES)).toEqual([
      { path: "/repo", head: "aaa", branch: "main", detached: false, bare: false, locked: false, prunable: false },
      {
        path: "/tmp/feature one",
        head: "bbb",
        branch: "feat/one",
        detached: false,
        bare: false,
        locked: false,
        prunable: false,
      },
      { path: "/tmp/peek", head: "ccc", detached: true, bare: false, locked: false, prunable: false },
    ]);
  });

  it("reads bare, locked and prunable blocks without taking their reason as a field", () => {
    const text = [
      "worktree /srv/repo.git",
      "bare",
      "",
      "worktree /srv/box",
      "HEAD ddd",
      "branch refs/heads/box",
      "locked use --force to remove",
      "",
      "worktree /srv/gone",
      "HEAD eee",
      "branch refs/heads/gone",
      "prunable gitdir file points to non-existent location",
      "",
    ].join("\n");
    expect(parseWorktreeList(text)).toEqual([
      { path: "/srv/repo.git", detached: false, bare: true, locked: false, prunable: false },
      { path: "/srv/box", head: "ddd", branch: "box", detached: false, bare: false, locked: true, prunable: false },
      { path: "/srv/gone", head: "eee", branch: "gone", detached: false, bare: false, locked: false, prunable: true },
    ]);
  });
});

describe("collectBranches", () => {
  it("reads three commands by argv and marks a branch held by another worktree", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "worktree") return ok(["git", ...args], WORKTREES);
      throw new Error(`unexpected command ${args[0]}`);
    });
    const result = await collectBranches({ runner, cwd: "/repo" });
    expect(result).toEqual({
      ok: true,
      list: {
        root: "/repo",
        isRepository: true,
        detached: false,
        headHash: null,
        branches: [
          { name: "feat/one", hash: "bbb", current: false, upstream: "origin/feat/one", worktreePath: "/tmp/feature one" },
          { name: "main", hash: "aaa", current: true, upstream: "origin/main" },
          { name: "no-upstream", hash: "ccc", current: false },
        ],
      },
    });
    expect(calls.map(call => call.argv)).toEqual([
      ["rev-parse", "--show-toplevel"],
      ["for-each-ref", BRANCH_FORMAT, "refs/heads"],
      ["worktree", "list", "--porcelain"],
    ]);
    expect(calls.every(call => call.cwd === "/repo")).toBe(true);
  });

  it("counts the current linked worktree as the home of its own branch", async () => {
    const linkedRefs = ["feat/one\0bbb\0*\0origin/feat/one", "main\0aaa\0 \0origin/main"].join("\n");
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "rev-parse") return ok(["git", ...args], "/tmp/feature one\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], linkedRefs);
      if (args[0] === "worktree") return ok(["git", ...args], WORKTREES);
      throw new Error(`unexpected command ${args[0]}`);
    });
    const result = await collectBranches({ runner, cwd: "/tmp/feature one" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.branches).toEqual([
      { name: "feat/one", hash: "bbb", current: true, upstream: "origin/feat/one" },
      { name: "main", hash: "aaa", current: false, upstream: "origin/main", worktreePath: "/repo" },
    ]);
    expect(calls).toHaveLength(3);
  });

  it("reports a detached HEAD with a short hash and no current branch", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "rev-parse" && args[1] === "--short") return ok(["git", ...args], "aaa1234\n");
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") {
        return ok(["git", ...args], "feat/one\0bbb\0 \0origin/feat/one\nmain\0aaa\0 \0origin/main\n");
      }
      if (args[0] === "worktree") return ok(["git", ...args], ["worktree /repo", "HEAD aaa", "detached", ""].join("\n"));
      throw new Error(`unexpected command ${args[0]}`);
    });
    const result = await collectBranches({ runner, cwd: "/repo" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list).toMatchObject({ root: "/repo", isRepository: true, detached: true, headHash: "aaa1234" });
    expect(result.list.branches.some(branch => branch.current)).toBe(false);
    expect(calls.map(call => call.argv[0])).toEqual(["rev-parse", "for-each-ref", "worktree", "rev-parse"]);
    expect(calls[3]?.argv).toEqual(["rev-parse", "--short", "HEAD"]);
  });

  it("keeps a repository with no commits unborn instead of detached", async () => {
    const { runner } = fakeRunner(args => {
      if (args[0] === "rev-parse" && args[1] === "--short") return failed(["git", ...args], 128, "fatal: Needed a single revision\n");
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], "");
      if (args[0] === "worktree") {
        return ok(["git", ...args], ["worktree /repo", "HEAD 0000000000000000000000000000000000000000", "branch refs/heads/main", ""].join("\n"));
      }
      throw new Error(`unexpected command ${args[0]}`);
    });
    const result = await collectBranches({ runner, cwd: "/repo" });
    expect(result).toEqual({
      ok: true,
      list: { root: "/repo", isRepository: true, detached: false, headHash: null, branches: [] },
    });
  });

  it("answers a directory outside a repository without running more commands", async () => {
    const { runner, calls } = fakeRunner(args => failed(["git", ...args], 128, "fatal: not a git repository\n"));
    const result = await collectBranches({ runner, cwd: "/plain" });
    expect(result).toEqual({
      ok: true,
      list: { root: "/plain", isRepository: false, detached: false, headHash: null, branches: [] },
    });
    expect(calls.map(call => call.argv)).toEqual([["rev-parse", "--show-toplevel"]]);
  });

  it("propagates a failed ref listing as the error union", async () => {
    const { runner } = fakeRunner(args => {
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") return failed(["git", ...args], 128, "fatal: bad object\n");
      return ok(["git", ...args], "");
    });
    const result = await collectBranches({ runner, cwd: "/repo" });
    expect(result).toEqual({ ok: false, error: { code: "git-failed", message: "fatal: bad object" } });
  });
});

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const hasGit = existsSync(resolve(repoRoot, ".git"));

const localRunner: GitRunner = {
  async run(args): Promise<GitRunResult> {
    const argv = ["git", ...args];
    try {
      const stdout = execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      return ok(argv, stdout);
    } catch (error) {
      const failedRun = error as { status?: number; stderr?: string };
      return failed(argv, failedRun.status ?? 1, failedRun.stderr ?? String(error));
    }
  },
};

describe.runIf(hasGit)("real repository branch list", () => {
  it("agrees with git branch --show-current and never claims this worktree's own branch", async () => {
    const result = await collectBranches({ runner: localRunner, cwd: repoRoot });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { list } = result;
    const toplevel = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: repoRoot, encoding: "utf8" }).trim();
    const current = execFileSync("git", ["branch", "--show-current"], { cwd: repoRoot, encoding: "utf8" }).trim();
    expect(list.isRepository).toBe(true);
    expect(list.root).toBe(toplevel);
    expect(list.detached).toBe(false);
    expect(list.headHash).toBeNull();
    expect(list.branches.find(branch => branch.current)?.name).toBe(current);
    expect(list.branches).toHaveLength(
      execFileSync("git", ["for-each-ref", "--format=%(refname:short)", "refs/heads"], { cwd: repoRoot, encoding: "utf8" })
        .split("\n")
        .filter(Boolean).length,
    );
    for (const branch of list.branches) {
      expect(branch.hash).toMatch(/^[0-9a-f]{40,64}$/u);
      expect(branch.worktreePath).not.toBe(list.root);
    }
  });
});
