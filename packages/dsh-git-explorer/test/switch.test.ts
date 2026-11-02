import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { GitRunner, GitRunResult } from "../src/host/git.ts";
import { switchToBranch } from "../src/host/switch.ts";

const ENUM_ARGV = ["for-each-ref", "--format=%(refname)", "refs/heads"];
const STATUS_ARGV = ["status", "--porcelain=v2", "-z", "--untracked-files=normal"];
const SWITCH_ARGV = ["switch", "--no-guess", "feat/one"];
const STASH_TOP_ARGV = ["stash", "list", "--format=%H", "-1"];
const POP_ARGV = ["stash", "pop", "stash@{0}"];
const PUSH_ARGV = ["stash", "push", "--include-untracked", "-m", "git-explorer: 切换 feat/one 前自动暂存"];
const REFS = ["refs/heads/main", "refs/heads/feat/one"].join("\n");
const DIRTY_STATUS = "1 .M N... 100644 100644 100644 aaa bbb src/a.ts\0? notes.txt\0";
const CLEAN_STASH = { stashed: false, restored: false };
const USER_STASH = "1".repeat(40);
const AUTO_STASH = "2".repeat(40);

interface FakeStashStack {
  readonly top: (argv: readonly string[]) => GitRunResult;
  readonly created: () => void;
}

/** Models the stack top so a push can either create an entry or leave it alone. */
function fakeStashStack(before: string | null): FakeStashStack {
  let top = before;
  return {
    top: argv => ok(argv, top === null ? "" : `${top}\n`),
    created: () => {
      top = AUTO_STASH;
    },
  };
}

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

describe("switchToBranch", () => {
  it("checks the name against refs/heads, reads the worktree, then switches with --no-guess", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], `${REFS}\n`);
      if (args[0] === "status") return ok(["git", ...args], "");
      if (args[0] === "switch") return ok(["git", ...args], "Switched to branch 'feat/one'\n");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: true, branch: "feat/one", stash: CLEAN_STASH });
    expect(calls.map(call => call.argv)).toEqual([ENUM_ARGV, STATUS_ARGV, SWITCH_ARGV]);
    expect(calls.every(call => call.cwd === "/repo")).toBe(true);
  });

  it("parks a dirty worktree in a stash and restores it after the switch", async () => {
    const stack = fakeStashStack(null);
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") {
        stack.created();
        return ok(["git", ...args], "Saved working directory\n");
      }
      if (args[0] === "switch") return ok(["git", ...args], "Switched to branch 'feat/one'\n");
      if (args[0] === "stash" && args[1] === "pop") return ok(["git", ...args], "Dropped refs/stash@{0}\n");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: true, branch: "feat/one", stash: { stashed: true, restored: true } });
    expect(calls.map(call => call.argv)).toEqual([
      ENUM_ARGV,
      STATUS_ARGV,
      STASH_TOP_ARGV,
      PUSH_ARGV,
      STASH_TOP_ARGV,
      SWITCH_ARGV,
      POP_ARGV,
    ]);
  });

  it("treats an unchanged stash top as a no-op and leaves the user's entry alone", async () => {
    // `stash push -u` exits 0 without creating an entry when the dirty state is
    // one it cannot capture. The top stays the user's entry, so a pop here
    // would apply and drop their stash on the new branch.
    const stack = fakeStashStack(USER_STASH);
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") return ok(["git", ...args], "No local changes to save\n");
      if (args[0] === "switch") return ok(["git", ...args], "Switched to branch 'feat/one'\n");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: true, branch: "feat/one", stash: CLEAN_STASH });
    expect(calls.map(call => call.argv)).toEqual([
      ENUM_ARGV,
      STATUS_ARGV,
      STASH_TOP_ARGV,
      PUSH_ARGV,
      STASH_TOP_ARGV,
      SWITCH_ARGV,
    ]);
  });

  it("does not pop the user's entry when a no-op push is followed by a refused switch", async () => {
    const stack = fakeStashStack(USER_STASH);
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") return ok(["git", ...args], "No local changes to save\n");
      if (args[0] === "switch") return failed(["git", ...args], 1, "fatal: cannot switch\n");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: false, error: { code: "git-failed", message: "fatal: cannot switch" } });
    expect(calls.some(call => call.argv[1] === "pop")).toBe(false);
  });

  it("refuses to stash when the stack top cannot be read", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      return failed(["git", ...args], 128, "fatal: unable to read stash reflog\n");
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({
      ok: false,
      error: { code: "git-failed", message: "fatal: unable to read stash reflog" },
    });
    expect(calls.map(call => call.argv)).toEqual([ENUM_ARGV, STATUS_ARGV, STASH_TOP_ARGV]);
  });

  it("stops before switching when the stash itself is refused", async () => {
    const stack = fakeStashStack(null);
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") return failed(["git", ...args], 1, "error: pre-commit hook refused\n");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: false, error: { code: "git-failed", message: "error: pre-commit hook refused" } });
    expect(calls.map(call => call.argv)).toEqual([ENUM_ARGV, STATUS_ARGV, STASH_TOP_ARGV, PUSH_ARGV]);
  });

  it("pops the stash back when the switch is refused", async () => {
    const refusal = "fatal: 'feat/one' is already used by worktree at '/tmp/other'\nhint: use --ignore-other-worktrees\n";
    const stack = fakeStashStack(null);
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") {
        stack.created();
        return ok(["git", ...args], "");
      }
      if (args[0] === "switch") return failed(["git", ...args], 1, refusal);
      if (args[0] === "stash" && args[1] === "pop") return ok(["git", ...args], "");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({
      ok: false,
      error: {
        code: "git-failed",
        message:
          "fatal: 'feat/one' is already used by worktree at '/tmp/other'; hint: use --ignore-other-worktrees; auto-stash restored",
      },
    });
    expect(calls.map(call => call.argv)).toEqual([
      ENUM_ARGV,
      STATUS_ARGV,
      STASH_TOP_ARGV,
      PUSH_ARGV,
      STASH_TOP_ARGV,
      SWITCH_ARGV,
      POP_ARGV,
    ]);
  });

  it("restores the stash even when the request was cancelled before the rollback", async () => {
    const controller = new AbortController();
    const calls: string[][] = [];
    const stack = fakeStashStack(null);
    const runner: GitRunner = {
      async run(args, options = {}) {
        calls.push([...args]);
        if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
        if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
        if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
        if (args[0] === "stash" && args[1] === "push") {
          stack.created();
          return ok(["git", ...args], "");
        }
        if (args[0] === "switch") {
          controller.abort();
          return {
            argv: ["git", ...args],
            exitCode: null,
            stdout: "",
            stderr: "",
            timedOut: false,
            cancelled: true,
            stdoutLossy: false,
          };
        }
        if (args[0] === "stash" && args[1] === "pop") {
          // A cancelled request would have killed this pop; cleanup must not inherit it.
          return options.signal?.aborted === true
            ? {
                argv: ["git", ...args],
                exitCode: null,
                stdout: "",
                stderr: "",
                timedOut: false,
                cancelled: true,
                stdoutLossy: false,
              }
            : ok(["git", ...args], "");
        }
        throw new Error(`unexpected command ${String(args[0])}`);
      },
    };
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" }, controller.signal);
    expect(result).toEqual({
      ok: false,
      error: { code: "git-failed", message: "cancelled; auto-stash restored" },
    });
    expect(calls.map(args => args[0])).toEqual([
      "for-each-ref",
      "status",
      "stash",
      "stash",
      "stash",
      "switch",
      "stash",
    ]);
  });

  it("says so when the rollback of a refused switch also fails", async () => {
    const stack = fakeStashStack(null);
    const { runner } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") {
        stack.created();
        return ok(["git", ...args], "");
      }
      if (args[0] === "switch") return failed(["git", ...args], 1, "fatal: cannot switch\n");
      return failed(["git", ...args], 1, "error: could not restore\n");
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({
      ok: false,
      error: { code: "git-failed", message: "fatal: cannot switch; auto-stash rollback failed: error: could not restore" },
    });
  });

  it("keeps the stash entry and reports the conflict when the restore conflicts", async () => {
    const stderr = [
      "Auto-merging shared.txt",
      "CONFLICT (content): Merge conflict in shared.txt",
      "",
      "The stash entry is kept in case you need it again.",
      "a fourth line is dropped",
    ].join("\n");
    const stack = fakeStashStack(null);
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], DIRTY_STATUS);
      if (args[0] === "stash" && args[1] === "list") return stack.top(["git", ...args]);
      if (args[0] === "stash" && args[1] === "push") {
        stack.created();
        return ok(["git", ...args], "");
      }
      if (args[0] === "switch") return ok(["git", ...args], "");
      return failed(["git", ...args], 1, stderr);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({
      ok: true,
      branch: "feat/one",
      stash: {
        stashed: true,
        restored: false,
        conflict: true,
        message: "Auto-merging shared.txt; CONFLICT (content): Merge conflict in shared.txt; The stash entry is kept in case you need it again.",
      },
    });
    expect(calls.map(call => call.argv)).toEqual([
      ENUM_ARGV,
      STATUS_ARGV,
      STASH_TOP_ARGV,
      PUSH_ARGV,
      STASH_TOP_ARGV,
      SWITCH_ARGV,
      POP_ARGV,
    ]);
  });

  it("refuses to switch when the worktree state cannot be read", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      return failed(["git", ...args], 128, "fatal: index file corrupt\n");
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: false, error: { code: "git-failed", message: "fatal: index file corrupt" } });
    expect(calls.map(call => call.argv)).toEqual([ENUM_ARGV, STATUS_ARGV]);
  });

  it("rejects names git could read as an option or a revision without running anything", async () => {
    const hostile = ["-f", "--discard-changes", "HEAD~1", "a b", "a..b", "a\0b", "", "x".repeat(256)];
    for (const name of hostile) {
      const { runner, calls } = fakeRunner(() => {
        throw new Error("the runner must not run for a rejected name");
      });
      const result = await switchToBranch({ runner, cwd: "/repo" }, { name });
      expect(result, name).toEqual({ ok: false, error: { code: "invalid-request", message: expect.any(String) } });
      expect(calls, name).toHaveLength(0);
    }
  });

  it("rejects a non-string name before touching the repository", async () => {
    const { runner, calls } = fakeRunner(() => {
      throw new Error("the runner must not run for a rejected name");
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: 42 as unknown as string });
    expect(result).toEqual({ ok: false, error: { code: "invalid-request", message: "name must be a non-empty string" } });
    expect(calls).toHaveLength(0);
  });

  it("reports a name no local branch carries after one enumeration", async () => {
    const { runner, calls } = fakeRunner(args => ok(["git", ...args], "refs/heads/main\n"));
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/missing" });
    expect(result).toEqual({ ok: false, error: { code: "invalid-request", message: "branch not found: feat/missing" } });
    expect(calls.map(call => call.argv)).toEqual([ENUM_ARGV]);
  });

  it("collapses a failed switch into three stderr lines on one line", async () => {
    const stderr = [
      "fatal: 'feat/one' is already used by worktree at '/tmp/other'",
      "hint: use --ignore-other-worktrees to force",
      "",
      "hint: third line",
      "hint: the fourth line is dropped",
    ].join("\n");
    const { runner } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], "");
      return failed(["git", ...args], 1, stderr);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({
      ok: false,
      error: {
        code: "git-failed",
        message:
          "fatal: 'feat/one' is already used by worktree at '/tmp/other'; hint: use --ignore-other-worktrees to force; hint: third line",
      },
    });
  });

  it("maps a timed-out switch to the timeout code", async () => {
    const { runner } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], "");
      return {
        argv: ["git", ...args],
        exitCode: null,
        stdout: "",
        stderr: "",
        timedOut: true,
        cancelled: false,
        stdoutLossy: false,
      };
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: false, error: { code: "timeout", message: "the command exceeded its deadline" } });
  });

  it("keeps a cancelled call in the failure union", async () => {
    const { runner } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], REFS);
      if (args[0] === "status") return ok(["git", ...args], "");
      return {
        argv: ["git", ...args],
        exitCode: null,
        stdout: "",
        stderr: "",
        timedOut: false,
        cancelled: true,
        stdoutLossy: false,
      };
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: false, error: { code: "git-failed", message: "cancelled" } });
  });

  it("surfaces a failed enumeration with git's own message", async () => {
    const { runner, calls } = fakeRunner(args =>
      failed(["git", ...args], 128, "fatal: not a git repository (or any of the parent directories): .git\n"),
    );
    const result = await switchToBranch({ runner, cwd: "/plain" }, { name: "main" });
    expect(result).toEqual({
      ok: false,
      error: { code: "git-failed", message: "fatal: not a git repository (or any of the parent directories): .git" },
    });
    expect(calls).toHaveLength(1);
  });
});

/**
 * Local runner for the integration cases: it mirrors the host subprocess
 * contract with `execFileSync` and honours the per-call cwd, which is what the
 * switch command needs to land in the repository under test.
 */
const localRunner: GitRunner = {
  async run(args, options = {}) {
    const argv = ["git", ...args];
    try {
      const stdout = execFileSync("git", args, {
        cwd: options.cwd,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        // Expected failures are part of these cases; keep their stderr in the
        // result instead of echoing it over the test report.
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      });
      return ok(argv, stdout);
    } catch (error) {
      const failure = error as { status?: number; stderr?: string };
      return failed(argv, failure.status ?? 1, failure.stderr ?? String(error));
    }
  },
};

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function stashCount(repo: string): number {
  return git(repo, "stash", "list").split("\n").filter(Boolean).length;
}

async function withTempDirectory(run: (root: string) => Promise<void>): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "dsh-switch-"));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function makeRepository(root: string): Promise<string> {
  git(root, "init", "-q", "-b", "main", "repo");
  const repo = join(root, "repo");
  git(repo, "config", "user.name", "Switch Test");
  git(repo, "config", "user.email", "switch@example.com");
  git(repo, "commit", "-q", "--allow-empty", "-m", "init");
  return repo;
}

/** A repository with one committed text file, so a case can modify it. */
async function makeTrackedRepository(root: string): Promise<string> {
  const repo = await makeRepository(root);
  await writeFile(join(repo, "tracked.txt"), "base\n");
  git(repo, "add", "tracked.txt");
  git(repo, "commit", "-q", "-m", "tracked");
  return repo;
}

/**
 * A repository whose dirty state can be confined to a submodule. The
 * superproject sees the submodule as modified while `stash push` has no
 * superproject change it can capture, which is exactly the no-op shape.
 */
async function makeSubmoduleRepository(root: string): Promise<string> {
  git(root, "init", "-q", "-b", "main", "sub-origin");
  const sub = join(root, "sub-origin");
  git(sub, "config", "user.name", "Switch Test");
  git(sub, "config", "user.email", "switch@example.com");
  await writeFile(join(sub, "inner.txt"), "base\n");
  git(sub, "add", "inner.txt");
  git(sub, "commit", "-q", "-m", "inner base");

  const repo = await makeTrackedRepository(root);
  git(repo, "-c", "protocol.file.allow=always", "submodule", "add", "-q", "../sub-origin", "sub");
  git(repo, "commit", "-q", "-m", "add submodule");
  return repo;
}

describe("switchToBranch in a real repository", () => {
  it("leaves the worktree on the branch it switched to without a stash entry", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      git(repo, "branch", "feat/one", "HEAD");
      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "feat/one" });
      expect(result).toEqual({ ok: true, branch: "feat/one", stash: { stashed: false, restored: false } });
      expect(git(repo, "branch", "--show-current").trim()).toBe("feat/one");
      expect(stashCount(repo)).toBe(0);
    });
  });

  it("rejects a name no local branch carries and stays where it was", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "ghost" });
      expect(result).toEqual({ ok: false, error: { code: "invalid-request", message: "branch not found: ghost" } });
      expect(git(repo, "branch", "--show-current").trim()).toBe("main");
    });
  });

  it("stashes a dirty worktree, switches, and puts the changes back", async () => {
    await withTempDirectory(async root => {
      const repo = await makeTrackedRepository(root);
      git(repo, "branch", "feat/one");
      await writeFile(join(repo, "tracked.txt"), "base\nlocal\n");
      await writeFile(join(repo, "untracked.txt"), "new\n");

      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "feat/one" });

      expect(result).toEqual({ ok: true, branch: "feat/one", stash: { stashed: true, restored: true } });
      expect(git(repo, "branch", "--show-current").trim()).toBe("feat/one");
      expect(await readFile(join(repo, "tracked.txt"), "utf8")).toBe("base\nlocal\n");
      expect(existsSync(join(repo, "untracked.txt"))).toBe(true);
      expect(stashCount(repo)).toBe(0);
    });
  });

  it("switches without touching a user stash when only submodule content is dirty", async () => {
    await withTempDirectory(async root => {
      const repo = await makeSubmoduleRepository(root);
      git(repo, "branch", "feat/one");
      await writeFile(join(repo, "tracked.txt"), "base\nuser\n");
      git(repo, "stash", "push", "-q", "-m", "user-entry");
      const userStash = git(repo, "stash", "list", "--format=%H", "-1").trim();
      expect(userStash).not.toBe("");
      // Only the submodule moved: `stash push -u` prints "No local changes to
      // save" and exits 0, so the user's entry stays at the top.
      await writeFile(join(repo, "sub", "inner.txt"), "base\nsub\n");

      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "feat/one" });

      expect(result).toEqual({ ok: true, branch: "feat/one", stash: CLEAN_STASH });
      expect(git(repo, "branch", "--show-current").trim()).toBe("feat/one");
      expect(stashCount(repo)).toBe(1);
      expect(git(repo, "stash", "list", "--format=%H", "-1").trim()).toBe(userStash);
      // The pre-existing stash was neither applied nor dropped.
      expect(await readFile(join(repo, "tracked.txt"), "utf8")).toBe("base\n");
    });
  });

  it("reports git's refusal when another worktree holds the branch and leaves the changes in place", async () => {
    await withTempDirectory(async root => {
      const repo = await makeTrackedRepository(root);
      git(repo, "branch", "held");
      git(repo, "worktree", "add", "-q", join(root, "occupied"), "held");
      await writeFile(join(repo, "tracked.txt"), "base\nlocal\n");
      await writeFile(join(repo, "untracked.txt"), "new\n");

      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "held" });

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("git-failed");
      expect(result.error.message).toMatch(/already checked out|already used by worktree/u);
      expect(result.error.message).toContain("auto-stash restored");
      expect(await readFile(join(repo, "tracked.txt"), "utf8")).toBe("base\nlocal\n");
      expect(existsSync(join(repo, "untracked.txt"))).toBe(true);
      expect(stashCount(repo)).toBe(0);
      expect(git(repo, "branch", "--show-current").trim()).toBe("main");
    });
  });

  it("keeps the stash entry when the restored changes conflict with the new branch", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      await writeFile(join(repo, "shared.txt"), "base\n");
      git(repo, "add", "shared.txt");
      git(repo, "commit", "-q", "-m", "shared base");
      git(repo, "branch", "other");
      await writeFile(join(repo, "shared.txt"), "main\n");
      git(repo, "commit", "-qam", "main side");
      git(repo, "switch", "-q", "other");
      await writeFile(join(repo, "shared.txt"), "other\n");
      git(repo, "commit", "-qam", "other side");
      git(repo, "switch", "-q", "main");
      await writeFile(join(repo, "shared.txt"), "local\n");

      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "other" });

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.branch).toBe("other");
      expect(result.stash).toMatchObject({ stashed: true, restored: false, conflict: true });
      expect(result.stash.message).toBeTruthy();
      // A conflicting pop keeps the entry; nothing is dropped behind the user's back.
      expect(stashCount(repo)).toBe(1);
      expect(git(repo, "branch", "--show-current").trim()).toBe("other");
    });
  });

  it("switches to a branch whose name a tag also uses", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      git(repo, "tag", "topic");
      git(repo, "branch", "topic", "HEAD");
      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "topic" });
      expect(result).toEqual({ ok: true, branch: "topic", stash: { stashed: false, restored: false } });
      expect(git(repo, "branch", "--show-current").trim()).toBe("topic");
    });
  });
});
