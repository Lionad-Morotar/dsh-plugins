import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { GitRunner, GitRunResult } from "../src/host/git.ts";
import { switchToBranch } from "../src/host/switch.ts";

const ENUM_ARGV = ["for-each-ref", "--format=%(refname)", "refs/heads"];
const REFS = ["refs/heads/main", "refs/heads/feat/one"].join("\n");

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
  it("checks the name against refs/heads, then switches with --no-guess", async () => {
    const { runner, calls } = fakeRunner(args => {
      if (args[0] === "for-each-ref") return ok(["git", ...args], `${REFS}\n`);
      if (args[0] === "switch") return ok(["git", ...args], "Switched to branch 'feat/one'\n");
      throw new Error(`unexpected command ${String(args[0])}`);
    });
    const result = await switchToBranch({ runner, cwd: "/repo" }, { name: "feat/one" });
    expect(result).toEqual({ ok: true, branch: "feat/one" });
    expect(calls.map(call => call.argv)).toEqual([ENUM_ARGV, ["switch", "--no-guess", "feat/one"]]);
    expect(calls.every(call => call.cwd === "/repo")).toBe(true);
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

describe("switchToBranch in a real repository", () => {
  it("leaves the worktree on the branch it switched to", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      git(repo, "branch", "feat/one", "HEAD");
      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "feat/one" });
      expect(result).toEqual({ ok: true, branch: "feat/one" });
      expect(git(repo, "branch", "--show-current").trim()).toBe("feat/one");
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

  it("reports git's own refusal when another worktree holds the branch", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      git(repo, "branch", "held", "HEAD");
      git(repo, "worktree", "add", "-q", join(root, "occupied"), "held");
      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "held" });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("git-failed");
      expect(result.error.message).not.toBe("");
      expect(result.error.message).toMatch(/already checked out|already used by worktree/u);
      expect(result.error.message).not.toContain("\n");
    });
  });

  it("switches to a branch whose name a tag also uses", async () => {
    await withTempDirectory(async root => {
      const repo = await makeRepository(root);
      git(repo, "tag", "topic");
      git(repo, "branch", "topic", "HEAD");
      const result = await switchToBranch({ runner: localRunner, cwd: repo }, { name: "topic" });
      expect(result).toEqual({ ok: true, branch: "topic" });
      expect(git(repo, "branch", "--show-current").trim()).toBe("topic");
    });
  });
});
