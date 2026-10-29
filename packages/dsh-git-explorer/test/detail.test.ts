import { describe, expect, it } from "vitest";

import { collectCommit } from "../src/host/detail.ts";
import type { GitRunner, GitRunResult } from "../src/host/git.ts";

function ok(argv: readonly string[], stdout: string): GitRunResult {
  return { argv, exitCode: 0, stdout, stderr: "", timedOut: false, cancelled: false, stdoutLossy: false };
}

function runnerFor(meta: string, status: string, stat: string): GitRunner {
  return {
    async run(args) {
      const argv = ["git", ...args];
      if (args[0] === "show") return ok(argv, meta);
      if (args[0] !== "diff-tree") throw new Error(`unexpected command ${args[0]}`);
      return ok(argv, args.includes("--numstat") ? stat : status);
    },
  };
}

describe("collectCommit", () => {
  it("merges name-status with line counts, including a rename", async () => {
    const meta = ["abc1234", "p1", "Alice", "1700000000", "feat: git view", "body line\n"].join("\0");
    const status = ["M", "src/a.ts", "R100", "old name.txt", "new name.txt", ""].join("\0");
    const stat = ["3\t1\tsrc/a.ts", "2\t0\t", "old name.txt", "new name.txt", ""].join("\0");
    const result = await collectCommit({ runner: runnerFor(meta, status, stat), cwd: "/repo" }, { hash: "abc1234" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.detail).toMatchObject({ hash: "abc1234", parents: ["p1"], author: "Alice", subject: "feat: git view", body: "body line" });
    expect(result.detail.files).toEqual([
      { path: "src/a.ts", status: "modified", additions: 3, deletions: 1 },
      { path: "new name.txt", origPath: "old name.txt", status: "renamed", additions: 2, deletions: 0 },
    ]);
  });

  it("rejects a revision expression before spawning git", async () => {
    let called = false;
    const runner: GitRunner = {
      async run() {
        called = true;
        throw new Error("must not run");
      },
    };
    const result = await collectCommit({ runner, cwd: "/repo" }, { hash: "--all" });
    expect(result).toEqual({ ok: false, error: { code: "invalid-request", message: "hash must be a hexadecimal object id" } });
    expect(called).toBe(false);
  });
});
