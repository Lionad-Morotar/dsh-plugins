import { describe, expect, it } from "vitest";

import { createGitRunner, type SpawnedProcess, type SubprocessLike } from "../src/host/git.ts";

interface SpawnCall {
  readonly argv: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>> | undefined;
  readonly stdin: unknown;
}

function fakeSubprocess(stdout: string, stderr = "", exitCode: number | null = 0) {
  const calls: SpawnCall[] = [];
  const subprocess: SubprocessLike = {
    spawn(spec): SpawnedProcess {
      calls.push({ argv: spec.argv, cwd: spec.cwd, env: spec.env, stdin: spec.stdio.stdin });
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

describe("createGitRunner", () => {
  it("passes git and its arguments as one argv array", async () => {
    const { subprocess, calls } = fakeSubprocess("ok\n");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    const result = await runner.run(["status", "--porcelain=v2", "-z"]);
    expect(result.stdout).toBe("ok\n");
    expect(result.exitCode).toBe(0);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.argv).toEqual(["git", "status", "--porcelain=v2", "-z"]);
    expect(calls[0]?.cwd).toBe("/tmp/repo");
    expect(calls[0]?.env).toEqual({ GIT_TERMINAL_PROMPT: "0" });
    expect(calls[0]?.stdin).toBe("ignore");
  });

  it("honours a per-call cwd and stdin", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    await runner.run(["rev-parse", "HEAD"], { cwd: "/tmp/other", stdinData: "x" });
    expect(calls[0]?.cwd).toBe("/tmp/other");
    expect(calls[0]?.stdin).toEqual({ data: "x" });
  });

  it("rejects NUL bytes before spawning", async () => {
    const { subprocess, calls } = fakeSubprocess("");
    const runner = createGitRunner({ subprocess, cwd: "/tmp/repo" });
    await expect(runner.run(["log", "bad\0arg"])).rejects.toThrow(/NUL/u);
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
  });
});
