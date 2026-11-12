import { execFile, spawn } from "node:child_process";
import { mkdtemp, mkdir, realpath, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { createGitRunner, type GitResult, type GitRunner, type SubprocessLike } from "../src/host/git.ts";
import {
  createAnchorLedger,
  createScopeResolver,
  readBranch,
  resolveScope,
  scopeKey,
  sessionExists,
} from "../src/host/scope.ts";

/** A runner that answers from a per-command table and records the calls. */
function createRunner(answers: Record<string, Partial<GitResult>>): GitRunner & { calls: string[][] } {
  const calls: string[][] = [];
  return {
    calls,
    async run(args) {
      calls.push([...args]);
      const answer = answers[args.join(" ")];
      return { argv: args, exitCode: 0, stdout: "", timedOut: false, ...answer };
    },
  };
}

describe("branch reading", () => {
  it("uses the symbolic ref, which also works before the first commit", async () => {
    const runner = createRunner({ "symbolic-ref --quiet --short HEAD": { stdout: "feat/dock\n" } });

    expect(await readBranch(runner, "/repo")).toEqual({ branch: "feat/dock", detached: false });
    expect(runner.calls).toEqual([["symbolic-ref", "--quiet", "--short", "HEAD"]]);
  });

  it("names a detached HEAD by its short commit", async () => {
    const runner = createRunner({
      "symbolic-ref --quiet --short HEAD": { exitCode: 128 },
      "rev-parse --short=7 HEAD": { stdout: "abc1234\n" },
    });

    expect(await readBranch(runner, "/repo")).toEqual({ branch: "detached@abc1234", detached: true });
  });

  it("answers no branch outside a repository", async () => {
    const runner = createRunner({
      "symbolic-ref --quiet --short HEAD": { exitCode: 128 },
      "rev-parse --short=7 HEAD": { exitCode: 128 },
    });

    expect(await readBranch(runner, "/tmp")).toEqual({ branch: null, detached: false });
  });
});

describe("scope key", () => {
  it("separates branches of one workspace and keeps non-repositories apart", () => {
    expect(scopeKey("/repo", "main")).not.toBe(scopeKey("/repo", "dev"));
    expect(scopeKey("/repo", null)).toBe("/repo::(no-branch)");
  });
});

describe("scope resolution", () => {
  let directory: string | undefined;

  afterEach(async () => {
    if (directory !== undefined) await rm(directory, { recursive: true, force: true });
    directory = undefined;
  });

  async function workspace(): Promise<string> {
    directory = await mkdtemp(join(tmpdir(), "term-dock-scope-"));
    return directory;
  }

  it("reads the live session's directory, canonicalizes it and claims the anchor", async () => {
    const root = await workspace();
    const runner = createRunner({ "symbolic-ref --quiet --short HEAD": { stdout: "main\n" } });
    const scopes = createScopeResolver({
      git: runner,
      sessions: { get: () => ({ header: { cwd: root } }) },
      persistence: undefined,
      anchors: createAnchorLedger(),
    });

    const resolved = await scopes.resolve("s1");

    expect(resolved?.anchor).toBe("s1");
    expect(resolved?.scope.workspace).toBe(await realpath(root));
    expect(resolved?.scope.branch).toBe("main");
    expect(resolved?.scope.detached).toBe(false);
    expect(resolved?.scope.key).toBe(scopeKey(await realpath(root), "main"));
  });

  it("canonicalizes a symlinked workspace to one scope", async () => {
    const root = await workspace();
    const target = join(root, "real");
    await mkdir(target);
    const link = join(root, "link");
    await symlink(target, link);
    const runner = createRunner({ "symbolic-ref --quiet --short HEAD": { stdout: "main\n" } });
    const scopes = createScopeResolver({
      git: runner,
      sessions: { get: () => ({ header: { cwd: link } }) },
      persistence: undefined,
      anchors: createAnchorLedger(),
    });

    expect((await scopes.resolve("s1"))?.scope.workspace).toBe(await realpath(target));
  });

  it("falls back to the persisted header for a session that is not live", async () => {
    const root = await workspace();
    const runner = createRunner({ "symbolic-ref --quiet --short HEAD": { stdout: "main\n" } });
    const scopes = createScopeResolver({
      git: runner,
      sessions: { get: () => undefined },
      persistence: { stat: async () => ({ header: { cwd: root } }) },
      anchors: createAnchorLedger(),
    });

    expect((await scopes.resolve("s1"))?.scope.workspace).toBe(await realpath(root));
  });

  it("answers undefined when neither store knows a directory", async () => {
    const runner = createRunner({});
    const scopes = createScopeResolver({
      git: runner,
      sessions: { get: () => undefined },
      persistence: { stat: async () => undefined },
      anchors: createAnchorLedger(),
    });

    expect(await scopes.resolve("s1")).toBeUndefined();
  });

  it("reuses the scope's anchor while it still exists", async () => {
    const root = await workspace();
    const runner = createRunner({ "symbolic-ref --quiet --short HEAD": { stdout: "main\n" } });
    const live = new Set(["s1", "s2"]);
    const input = {
      git: runner,
      sessions: { get: (id: string) => (live.has(id) ? { header: { cwd: root } } : undefined) },
      persistence: undefined,
      anchors: createAnchorLedger(),
    };
    const scopes = createScopeResolver(input);

    expect((await scopes.resolve("s1"))?.anchor).toBe("s1");
    expect((await scopes.resolve("s2"))?.anchor).toBe("s1");

    live.delete("s1");
    expect((await scopes.resolve("s2"))?.anchor).toBe("s2");
  });

  it("delegates existence to both stores", async () => {
    const input = {
      sessions: { get: (id: string) => (id === "live" ? {} : undefined) },
      persistence: { stat: async (id: string) => (id === "saved" ? {} : undefined) },
    };

    expect(await sessionExists("live", input)).toBe(true);
    expect(await sessionExists("saved", input)).toBe(true);
    expect(await sessionExists("gone", input)).toBe(false);
    expect(await sessionExists("", input)).toBe(false);
  });
});

/**
 * A subprocess service over the real `git`, shaped like the host's slice.
 *
 * The injected runner in most tests is a table of canned answers; this one makes
 * the branch reader prove itself against a repository whose HEAD actually moves.
 */
function nativeSubprocess(): SubprocessLike {
  return {
    spawn(spec) {
      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];
      const child = spawn(spec.argv[0] ?? "", spec.argv.slice(1), {
        cwd: spec.cwd,
        env: { ...process.env, ...spec.env },
        signal: spec.signal,
      });
      child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
      child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
      const done = new Promise<{ exitCode: number | null }>(resolve => {
        child.on("close", code => resolve({ exitCode: code }));
        child.on("error", () => resolve({ exitCode: null }));
      });
      const read = (chunks: Buffer[]) => () => ({ text: Buffer.concat(chunks).toString("utf8"), lossy: false });
      return {
        done,
        collected: {
          stdout: { readFrom: read(stdout) },
          stderr: { readFrom: read(stderr) },
        },
      };
    },
  };
}

/** Run one git command in a test repository. */
function git(cwd: string, ...args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd }, error => (error === null ? resolve() : reject(error)));
  });
}

describe("branch reading against a real repository", () => {
  let directory: string | undefined;

  afterEach(async () => {
    if (directory !== undefined) await rm(directory, { recursive: true, force: true });
    directory = undefined;
  });

  it("follows the checked-out branch, the branch of an unborn HEAD, and detachment", async () => {
    directory = await mkdtemp(join(tmpdir(), "term-dock-git-"));
    await git(directory, "init", "-b", "main");
    const runner = createGitRunner({ subprocess: nativeSubprocess() });

    // An unborn HEAD still names its branch: the first commit must not be a
    // different scope from the branch the reader is already on.
    expect((await readBranch(runner, directory)).branch).toBe("main");

    await git(directory, "-c", "user.email=term-dock@example.invalid", "-c", "user.name=term-dock",
      "commit", "--allow-empty", "-m", "init");
    expect((await readBranch(runner, directory)).branch).toBe("main");

    await git(directory, "checkout", "-b", "feat/dock");
    expect((await readBranch(runner, directory)).branch).toBe("feat/dock");

    await git(directory, "checkout", "--detach");
    const detached = await readBranch(runner, directory);
    expect(detached.detached).toBe(true);
    expect(detached.branch).toMatch(/^detached@[0-9a-f]{7}$/u);
  });

  it("answers no branch for a directory that is not a repository", async () => {
    directory = await mkdtemp(join(tmpdir(), "term-dock-plain-"));
    const runner = createGitRunner({ subprocess: nativeSubprocess() });

    expect(await readBranch(runner, directory)).toEqual({ branch: null, detached: false });
  });
});
