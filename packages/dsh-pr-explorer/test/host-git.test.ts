/**
 * The runner's contract: argv only, read-only environment, and failures that
 * resolve instead of rejecting.
 *
 * The environment assertions are the load-bearing ones. A PR panel reads a
 * repository it does not own, so the guards that stop a repository's own
 * configuration from running a program have to be on the spawn call, not only in
 * a comment above it.
 */
import { describe, expect, it } from "vitest";

import { createGitRunner, READ_ONLY_ENV, type SpawnedProcess, type SubprocessLike } from "../src/host/git.ts";

interface SpawnCall {
  readonly argv: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>> | undefined;
  readonly stdin: unknown;
  readonly maxBytes: number | undefined;
}

function fakeSubprocess(stdout: string, stderr = "", exitCode: number | null = 0) {
  const calls: SpawnCall[] = [];
  const subprocess: SubprocessLike = {
    spawn(spec): SpawnedProcess {
      calls.push({
        argv: spec.argv,
        cwd: spec.cwd,
        env: spec.env,
        stdin: spec.stdio.stdin,
        maxBytes: spec.stdio.stdout.collect.maxBytes,
      });
      return {
        done: Promise.resolve({ exitCode, signal: null }),
        collected: {
          stdout: { readFrom: () => ({ text: stdout, lossy: false }) },
          stderr: { readFrom: () => ({ text: stderr, lossy: false }) },
        },
      };
    },
  };
  return { subprocess, calls };
}

describe("the git runner", () => {
  it("passes git and its arguments as one argv array", async () => {
    const { subprocess, calls } = fakeSubprocess("ok\n");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    const result = await runner.run(["rev-parse", "--show-toplevel"]);

    expect(result.stdout).toBe("ok\n");
    expect(result.exitCode).toBe(0);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.argv).toEqual(["git", "rev-parse", "--show-toplevel"]);
    expect(calls[0]?.cwd).toBe("/tmp/repo");
  });

  it("runs every command under the read-only environment", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    await runner.run(["diff", "HEAD"]);

    // The empty GIT_EXTERNAL_DIFF is the guard that matters: a repository can
    // set diff.external to any program, and inheriting it would run that program.
    expect(calls[0]?.env).toEqual({ GIT_TERMINAL_PROMPT: "0", GIT_PAGER: "cat", GIT_EXTERNAL_DIFF: "" });
    expect(calls[0]?.env).toBe(READ_ONLY_ENV);
  });

  it("closes stdin unless the caller supplies data", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    await runner.run(["rev-parse", "HEAD"]);
    await runner.run(["rev-parse", "HEAD"], { stdinData: "x" });

    expect(calls[0]?.stdin).toBe("ignore");
    expect(calls[1]?.stdin).toEqual({ data: "x" });
  });

  it("honours a per-call cwd over the runner's own", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    await runner.run(["rev-parse", "HEAD"], { cwd: "/tmp/other" });

    expect(calls[0]?.cwd).toBe("/tmp/other");
  });

  it("rejects a NUL byte before spawning anything", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });

    await expect(runner.run(["log", "bad\0arg"])).rejects.toThrow(/NUL/u);
    expect(calls).toHaveLength(0);
  });

  it("rejects a non-string argument before spawning anything", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });

    // A caller bug, not a repository state: it must not become a child process.
    await expect(runner.run(["log", 42 as unknown as string])).rejects.toThrow(/NUL-free string/u);
    expect(calls).toHaveLength(0);
  });

  it("resolves a timed-out command instead of rejecting", async () => {
    const subprocess: SubprocessLike = {
      spawn(spec): SpawnedProcess {
        return {
          done: new Promise((_, reject) => {
            spec.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
          }),
          collected: {},
        };
      },
    };
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo", timeoutMs: 10 });
    const result = await runner.run(["log"]);

    expect(result.timedOut).toBe(true);
    expect(result.exitCode).toBeNull();
    expect(result.stdout).toBe("");
  });

  it("reports a cancellation separately from a timeout", async () => {
    const subprocess: SubprocessLike = {
      spawn(spec): SpawnedProcess {
        return {
          done: new Promise((_, reject) => {
            spec.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
          }),
          collected: {},
        };
      },
    };
    const controller = new AbortController();
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo", timeoutMs: 60_000 });
    const pending = runner.run(["log"], { signal: controller.signal });
    controller.abort();
    const result = await pending;

    expect(result.cancelled).toBe(true);
    expect(result.timedOut).toBe(false);
  });

  it("reads a spilled stream from disk instead of returning the truncated prefix", async () => {
    const { writeFile, rm } = await import("node:fs/promises");
    const spillPath = "/tmp/pr-explorer-spill-test.txt";
    await writeFile(spillPath, "the whole output\n", "utf8");
    const subprocess: SubprocessLike = {
      spawn(): SpawnedProcess {
        return {
          done: Promise.resolve({ exitCode: 0, signal: null }),
          collected: {
            stdout: { readFrom: () => ({ text: "the whole", lossy: true, spillPath }) },
            stderr: { readFrom: () => ({ text: "", lossy: false }) },
          },
        };
      },
    };
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    const result = await runner.run(["diff"]);
    await rm(spillPath, { force: true });

    expect(result.stdout).toBe("the whole output\n");
    expect(result.stdoutLossy).toBe(false);
  });

  it("stays lossy when the spill file cannot be read back", async () => {
    const subprocess: SubprocessLike = {
      spawn(): SpawnedProcess {
        return {
          done: Promise.resolve({ exitCode: 0, signal: null }),
          collected: {
            stdout: { readFrom: () => ({ text: "prefix", lossy: true, spillPath: "/tmp/pr-explorer-missing-spill" }) },
            stderr: { readFrom: () => ({ text: "", lossy: false }) },
          },
        };
      },
    };
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    const result = await runner.run(["diff"]);

    expect(result.stdout).toBe("prefix");
    expect(result.stdoutLossy).toBe(true);
  });

  it("carries a non-zero exit and its stderr without throwing", async () => {
    const { subprocess } = fakeSubprocess("", "fatal: not a git repository\n", 128);
    const runner = createGitRunner({ subprocess, cwd: "/tmp/plain" });
    const result = await runner.run(["rev-parse", "--show-toplevel"]);

    expect(result.exitCode).toBe(128);
    expect(result.stderr).toContain("not a git repository");
  });

  it("passes the collection budget through to the spawn", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo", maxBytes: 1024 });
    await runner.run(["diff"]);

    expect(calls[0]?.maxBytes).toBe(1024);
  });
});
