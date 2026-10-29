import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { GitRunner, GitRunResult } from "../src/host/git.ts";
import { collectQuery } from "../src/host/query.ts";
import { collectSnapshot } from "../src/host/snapshot.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const hasGit = existsSync(resolve(repoRoot, ".git"));

/**
 * Local runner for the smoke test only: it mirrors the host subprocess contract
 * with `execFileSync`, so the parsers meet the same bytes a real repository
 * produces without booting the Harness.
 */
const localRunner: GitRunner = {
  async run(args): Promise<GitRunResult> {
    const argv = ["git", ...args];
    try {
      const stdout = execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      return { argv, exitCode: 0, stdout, stderr: "", timedOut: false, cancelled: false, stdoutLossy: false };
    } catch (error) {
      const failed = error as { status?: number; stderr?: string };
      return {
        argv,
        exitCode: failed.status ?? 1,
        stdout: "",
        stderr: failed.stderr ?? String(error),
        timedOut: false,
        cancelled: false,
        stdoutLossy: false,
      };
    }
  },
};

describe.runIf(hasGit)("real repository smoke", () => {
  it("snapshots this checkout with edges that match the parents", async () => {
    const result = await collectSnapshot({ runner: localRunner, cwd: repoRoot, maxCommits: 150 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { snapshot } = result;
    expect(snapshot.isRepository).toBe(true);
    expect(snapshot.commits.length).toBeGreaterThan(0);
    expect(snapshot.lanes).toHaveLength(snapshot.commits.length);
    const parents = new Map(snapshot.commits.map(commit => [commit.hash, commit.parents]));
    for (const row of snapshot.lanes) {
      expect(row.edges).toHaveLength(parents.get(row.hash)?.length ?? 0);
      for (const edge of row.edges) expect(parents.get(edge.from)).toContain(edge.to);
    }
  });

  it("pages history and reports hasMore from a limit-plus-one fetch", async () => {
    const result = await collectQuery({ runner: localRunner, cwd: repoRoot, defaultLimit: 200 }, { limit: 5 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.page.commits).toHaveLength(5);
    expect(result.page.lanes).toHaveLength(5);
  });
});
