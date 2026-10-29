import { describe, expect, it } from "vitest";

import type { GitRunner, GitRunResult } from "../src/host/git.ts";
import { collectQuery } from "../src/host/query.ts";
import { collectSnapshot } from "../src/host/snapshot.ts";

function ok(argv: readonly string[], stdout: string): GitRunResult {
  return { argv, exitCode: 0, stdout, stderr: "", timedOut: false, cancelled: false, stdoutLossy: false };
}

const STATUS = [
  "# branch.oid aaa",
  "# branch.head main",
  "# branch.ab +4 -2",
  "1 .M N... 100644 100644 100644 hh ii keep.txt",
].join("\0") + "\0";

const LOG = ["aaa|bbb|Alice|1700000002|third", "bbb|ccc|Bob|1700000001|second", "ccc||Carol|1700000000|first"].join("\n");

function fakeRunner(options: { log?: string } = {}): GitRunner {
  return {
    async run(args) {
      const argv = ["git", ...args];
      switch (args[0]) {
        case "rev-parse":
          return args[1] === "--quiet" ? ok(argv, "aaa\n") : ok(argv, "/repo\n");
        case "status":
          return ok(argv, STATUS);
        case "diff":
          return ok(argv, args.includes("--cached") ? "" : "2\t1\tkeep.txt\0");
        case "for-each-ref":
          return ok(argv, ["refs/heads/main\0aaa\0*\0", "refs/remotes/origin/main\0aaa\0\0"].join("\n"));
        case "log":
          return ok(argv, options.log ?? LOG);
        case "rev-list":
          return ok(argv, "3\n");
        default:
          throw new Error(`unexpected command ${args[0]}`);
      }
    },
  };
}

describe("collectSnapshot", () => {
  it("merges refs, changes and lanes into one first-paint value", async () => {
    const result = await collectSnapshot({ runner: fakeRunner(), cwd: "/repo", maxCommits: 100 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot).toMatchObject({
      root: "/repo",
      isRepository: true,
      head: { hash: "aaa", branch: "main", detached: false, ahead: 4, behind: 2 },
      counts: { commits: 3, branches: 2, changes: 1 },
    });
    expect(result.snapshot.commits[0]?.refs).toEqual([
      { kind: "branch", name: "main", head: true },
      { kind: "remote", name: "origin/main", head: false },
    ]);
    expect(result.snapshot.lanes.map(row => row.hash)).toEqual(["aaa", "bbb", "ccc"]);
    expect(result.snapshot.status).toContain("# branch.oid aaa");
    expect(result.snapshot.stats).toEqual([{ path: "keep.txt", additions: 2, deletions: 1 }]);
  });

  it("treats an unborn HEAD as an empty repository", async () => {
    const runner: GitRunner = {
      async run(args) {
        const argv = ["git", ...args];
        if (args[0] === "rev-parse") {
          return args[1] === "--quiet"
            ? { argv, exitCode: 1, stdout: "", stderr: "fatal: Needed a single revision", timedOut: false, cancelled: false, stdoutLossy: false }
            : ok(argv, "/repo\n");
        }
        if (args[0] === "status") return ok(argv, "# branch.oid (initial)\0# branch.head main\0? a.txt\0");
        if (args[0] === "for-each-ref" || args[0] === "diff") return ok(argv, "");
        throw new Error(`unexpected command ${args[0]}`);
      },
    };
    const result = await collectSnapshot({ runner, cwd: "/repo", maxCommits: 10 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.snapshot.isRepository).toBe(true);
    expect(result.snapshot.commits).toEqual([]);
    expect(result.snapshot.counts).toEqual({ commits: 0, branches: 0, changes: 1 });
    expect(result.snapshot.head?.branch).toBe("main");
    expect(result.snapshot.status).toContain("? a.txt");
  });

  it("treats a non-repository directory as an empty snapshot", async () => {
    const runner: GitRunner = {
      async run(args) {
        return { argv: ["git", ...args], exitCode: 128, stdout: "", stderr: "fatal: not a git repository", timedOut: false, cancelled: false, stdoutLossy: false };
      },
    };
    const result = await collectSnapshot({ runner, cwd: "/tmp", maxCommits: 10 });
    expect(result).toEqual({
      ok: true,
      snapshot: {
        root: "/tmp",
        isRepository: false,
        head: null,
        branches: [],
        changes: [],
        commits: [],
        lanes: [],
        counts: { commits: 0, branches: 0, changes: 0 },
        status: "",
        stats: [],
      },
    });
  });
});

describe("collectQuery", () => {
  it("asks for one extra commit and trims it before laying out lanes", async () => {
    const result = await collectQuery({ runner: fakeRunner(), cwd: "/repo", defaultLimit: 200 }, { limit: 2 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.page.hasMore).toBe(true);
    expect(result.page.commits.map(commit => commit.hash)).toEqual(["aaa", "bbb"]);
    expect(result.page.lanes).toHaveLength(2);
  });

  it("rejects a ref that could be read as a revision or an option", async () => {
    const result = await collectQuery({ runner: fakeRunner(), cwd: "/repo", defaultLimit: 200 }, { ref: "--upload-pack=x" });
    expect(result).toEqual({
      ok: false,
      error: { code: "invalid-request", message: "ref must be a branch, tag or commit name" },
    });
  });
});
