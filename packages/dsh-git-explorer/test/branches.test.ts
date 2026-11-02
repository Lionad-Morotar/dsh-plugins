import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { collectBranches, parseBranchRefs, parseWorktreeList } from "../src/host/branches.ts";
import type { GitRunner, GitRunResult } from "../src/host/git.ts";
import type { GitWorktreeDirty } from "../src/host/types.ts";

const BRANCH_FORMAT = "--format=%(refname)%00%(objectname)%00%(HEAD)%00%(upstream)";
const STATUS_ARGS = ["status", "--porcelain=v2", "-z", "--untracked-files=normal"];
const NUMSTAT_ARGS = ["diff", "HEAD", "--numstat"];
const CLEAN: GitWorktreeDirty = { dirty: false, additions: 0, deletions: 0, trackedFiles: 0, untrackedFiles: 0 };

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

/** Answer the two dirty probes with a clean worktree. */
function cleanProbe(args: readonly string[]): GitRunResult | null {
  if (args[0] === "status" || args[0] === "diff") return ok(["git", ...args], "");
  return null;
}

const REFS = [
  "refs/heads/feat/one\0bbb\0 \0refs/remotes/origin/feat/one",
  "refs/heads/main\0aaa\0*\0refs/remotes/origin/main",
  "refs/heads/no-upstream\0ccc\0 \0",
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
    expect(parseBranchRefs("refs/heads/main\0aaa\0*\0\r\n")).toEqual([{ name: "main", hash: "aaa", current: true }]);
    expect(parseBranchRefs("refs/heads/no-hash\0\0*\0\n")).toEqual([]);
    // A short name is not a branch inventory record: the endpoint reads full refs.
    expect(parseBranchRefs("heads/topic\0aaa\0*\0\n")).toEqual([]);
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
  it("reads the inventory and a clean worktree by argv, and marks a held branch", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "worktree") return ok(["git", ...args], WORKTREES);
      const probe = cleanProbe(args);
      if (probe !== null) return probe;
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
        worktree: CLEAN,
      },
    });
    expect(calls.map(call => call.argv)).toEqual([
      ["rev-parse", "--show-toplevel"],
      ["for-each-ref", BRANCH_FORMAT, "refs/heads"],
      ["worktree", "list", "--porcelain"],
      STATUS_ARGS,
      NUMSTAT_ARGS,
    ]);
    expect(calls.every(call => call.cwd === "/repo")).toBe(true);
  });

  it("counts the current linked worktree as the home of its own branch", async () => {
    const linkedRefs = [
      "refs/heads/feat/one\0bbb\0*\0refs/remotes/origin/feat/one",
      "refs/heads/main\0aaa\0 \0refs/remotes/origin/main",
    ].join("\n");
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "rev-parse") return ok(["git", ...args], "/tmp/feature one\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], linkedRefs);
      if (args[0] === "worktree") return ok(["git", ...args], WORKTREES);
      const probe = cleanProbe(args);
      if (probe !== null) return probe;
      throw new Error(`unexpected command ${args[0]}`);
    });
    const result = await collectBranches({ runner, cwd: "/tmp/feature one" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.branches).toEqual([
      { name: "feat/one", hash: "bbb", current: true, upstream: "origin/feat/one" },
      { name: "main", hash: "aaa", current: false, upstream: "origin/main", worktreePath: "/repo" },
    ]);
    expect(calls).toHaveLength(5);
  });

  it("reports a detached HEAD with a short hash and no current branch", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "rev-parse" && args[1] === "--short") return ok(["git", ...args], "aaa1234\n");
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") {
        return ok(
          ["git", ...args],
          [
            "refs/heads/feat/one\0bbb\0 \0refs/remotes/origin/feat/one",
            "refs/heads/main\0aaa\0 \0refs/remotes/origin/main",
          ].join("\n"),
        );
      }
      if (args[0] === "worktree") return ok(["git", ...args], ["worktree /repo", "HEAD aaa", "detached", ""].join("\n"));
      const probe = cleanProbe(args);
      if (probe !== null) return probe;
      throw new Error(`unexpected command ${args[0]}`);
    });
    const result = await collectBranches({ runner, cwd: "/repo" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list).toMatchObject({ root: "/repo", isRepository: true, detached: true, headHash: "aaa1234", worktree: CLEAN });
    expect(result.list.branches.some(branch => branch.current)).toBe(false);
    expect(calls.map(call => call.argv[0])).toEqual(["rev-parse", "for-each-ref", "worktree", "status", "diff", "rev-parse"]);
    expect(calls[3]?.argv).toEqual(STATUS_ARGS);
    expect(calls[4]?.argv).toEqual(NUMSTAT_ARGS);
    expect(calls[5]?.argv).toEqual(["rev-parse", "--short", "HEAD"]);
  });

  it("keeps a repository with no commits unborn and its line counts at zero", async () => {
    const { runner } = fakeRunner(args => {
      if (args[0] === "rev-parse" && args[1] === "--short") return failed(["git", ...args], 128, "fatal: Needed a single revision\n");
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], "");
      if (args[0] === "worktree") {
        return ok(["git", ...args], ["worktree /repo", "HEAD 0000000000000000000000000000000000000000", "branch refs/heads/main", ""].join("\n"));
      }
      if (args[0] === "status") return ok(["git", ...args], "1 A. N... 000000 100644 100644 0000000 1111111 staged.txt\0");
      if (args[0] === "diff") {
        // The translated message is deliberate: the all-zero HEAD in the worktree
        // list is what has to carry this state, not git's wording.
        return failed(["git", ...args], 128, "致命错误：有歧义的参数 'HEAD'：未知的版本或路径不存在于工作区中。\n");
      }
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
        branches: [],
        worktree: { dirty: true, additions: 0, deletions: 0, trackedFiles: 1, untrackedFiles: 0 },
      },
    });
  });

  it("answers a directory outside a repository without running more commands", async () => {
    const { runner, calls } = fakeRunner(args => failed(["git", ...args], 128, "fatal: not a git repository\n"));
    const result = await collectBranches({ runner, cwd: "/plain" });
    expect(result).toEqual({
      ok: true,
      list: { root: "/plain", isRepository: false, detached: false, headHash: null, branches: [], worktree: CLEAN },
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

describe("worktree dirtiness", () => {
  function dirtyRunner(replies: { readonly status?: string; readonly numstat?: string }): {
    runner: GitRunner;
    calls: RunnerCall[];
  } {
    return fakeRunner(args => {
      if (args[0] === "rev-parse") return ok(["git", ...args], "/repo\n");
      if (args[0] === "for-each-ref") return ok(["git", ...args], "refs/heads/main\0aaa\0*\0refs/remotes/origin/main\n");
      if (args[0] === "worktree") {
        return ok(["git", ...args], ["worktree /repo", "HEAD aaa", "branch refs/heads/main", ""].join("\n"));
      }
      if (args[0] === "status") return ok(["git", ...args], replies.status ?? "");
      if (args[0] === "diff") return ok(["git", ...args], replies.numstat ?? "");
      throw new Error(`unexpected command ${args[0]}`);
    });
  }

  async function worktreeOf(replies: { readonly status?: string; readonly numstat?: string }): Promise<GitWorktreeDirty> {
    const result = await collectBranches({ runner: dirtyRunner(replies).runner, cwd: "/repo" });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected a branch list");
    return result.list.worktree;
  }

  it("counts tracked changes and untracked files separately", async () => {
    const status = [
      "1 .M N... 100644 100644 100644 aaa bbb src/a.ts",
      "1 A. N... 000000 100644 100644 0000000 ccc src/b.ts",
      "? notes.txt",
      "? tmp/two.txt",
      "",
    ].join("\0");
    const worktree = await worktreeOf({ status, numstat: "2\t0\tsrc/a.ts\n0\t3\tsrc/b.ts\n" });
    expect(worktree).toEqual({ dirty: true, additions: 2, deletions: 3, trackedFiles: 2, untrackedFiles: 2 });
  });

  it("counts a rename once even though its old path follows as a second NUL field", async () => {
    const status = ["2 R. N... 100644 100644 100644 aaa bbb R100 new/name.ts", "old/name.ts", ""].join("\0");
    expect(await worktreeOf({ status })).toEqual({
      dirty: true,
      additions: 0,
      deletions: 0,
      trackedFiles: 1,
      untrackedFiles: 0,
    });
  });

  it("skips binary numstat rows instead of returning NaN", async () => {
    const status = "1 .M N... 100644 100644 100644 aaa bbb logo.png\0";
    expect(await worktreeOf({ status, numstat: "-\t-\tlogo.png\n" })).toEqual({
      dirty: true,
      additions: 0,
      deletions: 0,
      trackedFiles: 1,
      untrackedFiles: 0,
    });
  });

  it("counts a staged-only change through diff HEAD", async () => {
    const { runner, calls } = dirtyRunner({
      status: "1 M. N... 100644 100644 100644 aaa bbb src/a.ts\0",
      numstat: "4\t1\tsrc/a.ts\n",
    });
    const result = await collectBranches({ runner, cwd: "/repo" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.worktree).toEqual({
      dirty: true,
      additions: 4,
      deletions: 1,
      trackedFiles: 1,
      untrackedFiles: 0,
    });
    expect(calls.find(call => call.argv[0] === "diff")?.argv).toEqual(NUMSTAT_ARGS);
  });
});

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const hasGit = existsSync(resolve(repoRoot, ".git"));

function localRunnerAt(cwd: string): GitRunner {
  return {
    async run(args): Promise<GitRunResult> {
      const argv = ["git", ...args];
      try {
        const stdout = execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
        return ok(argv, stdout);
      } catch (error) {
        const failedRun = error as { status?: number; stderr?: string };
        return failed(argv, failedRun.status ?? 1, failedRun.stderr ?? String(error));
      }
    },
  };
}

const localRunner = localRunnerAt(repoRoot);

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
      execFileSync("git", ["for-each-ref", "--format=%(refname)", "refs/heads"], { cwd: repoRoot, encoding: "utf8" })
        .split("\n")
        .filter(Boolean).length,
    );
    for (const branch of list.branches) {
      expect(branch.hash).toMatch(/^[0-9a-f]{40,64}$/u);
      expect(branch.worktreePath).not.toBe(list.root);
    }
  });
});

function canRunGit(): boolean {
  try {
    execFileSync("git", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

describe.runIf(canRunGit())("branch name shadowed by a tag", () => {
  let dir = "";

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "dsh-git-explorer-"));
    const git = (args: readonly string[]): string =>
      execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    git(["init", "-q"]);
    git(["config", "user.email", "qa@example.com"]);
    git(["config", "user.name", "qa"]);
    git(["commit", "-q", "--allow-empty", "-m", "seed"]);
    git(["branch", "topic"]);
    git(["tag", "topic"]);
    const branch = git(["branch", "--show-current"]).trim();
    // A local upstream is the shortest shape that also gets a `heads/` prefix
    // from `%(upstream:short)` once the tag above exists.
    git(["config", `branch.${branch}.remote`, "."]);
    git(["config", `branch.${branch}.merge`, "refs/heads/topic"]);
  });

  afterAll(() => {
    if (dir !== "") rmSync(dir, { recursive: true, force: true });
  });

  it("lists topic instead of heads/topic", async () => {
    const result = await collectBranches({ runner: localRunnerAt(dir), cwd: dir });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const names = result.list.branches.map(branch => branch.name);
    expect(names).toContain("topic");
    expect(names).not.toContain("heads/topic");
  });

  it("normalizes the same ambiguous prefix on the upstream", async () => {
    const result = await collectBranches({ runner: localRunnerAt(dir), cwd: dir });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.list.branches.find(branch => branch.current)?.upstream).toBe("topic");
  });
});

describe.runIf(canRunGit())("real worktree dirtiness", () => {
  let dir = "";

  function git(args: readonly string[]): string {
    return execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  }

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "dsh-git-explorer-dirty-"));
    git(["init", "-q", "-b", "main"]);
    git(["config", "user.email", "qa@example.com"]);
    git(["config", "user.name", "qa"]);
    writeFileSync(join(dir, "tracked.txt"), "one\n");
    writeFileSync(join(dir, "asset.bin"), Buffer.from([0, 1, 2, 0, 255]));
    git(["add", "-A"]);
    git(["commit", "-q", "-m", "seed"]);
  });

  afterAll(() => {
    if (dir !== "") rmSync(dir, { recursive: true, force: true });
  });

  it("counts unstaged, staged and untracked changes and skips the binary row", async () => {
    writeFileSync(join(dir, "tracked.txt"), "one\ntwo\n");
    writeFileSync(join(dir, "untracked.txt"), "new\n");
    const unstaged = await collectBranches({ runner: localRunnerAt(dir), cwd: dir });
    expect(unstaged.ok).toBe(true);
    if (!unstaged.ok) return;
    expect(unstaged.list.worktree).toEqual({
      dirty: true,
      additions: 1,
      deletions: 0,
      trackedFiles: 1,
      untrackedFiles: 1,
    });

    git(["add", "tracked.txt"]);
    const staged = await collectBranches({ runner: localRunnerAt(dir), cwd: dir });
    expect(staged.ok).toBe(true);
    if (!staged.ok) return;
    // Only `git diff HEAD` includes the staged half; a bare `git diff` would drop it.
    expect(staged.list.worktree).toEqual({
      dirty: true,
      additions: 1,
      deletions: 0,
      trackedFiles: 1,
      untrackedFiles: 1,
    });

    appendFileSync(join(dir, "asset.bin"), Buffer.from([7]));
    const binary = await collectBranches({ runner: localRunnerAt(dir), cwd: dir });
    expect(binary.ok).toBe(true);
    if (!binary.ok) return;
    expect(binary.list.worktree).toEqual({
      dirty: true,
      additions: 1,
      deletions: 0,
      trackedFiles: 2,
      untrackedFiles: 1,
    });
  });
});
