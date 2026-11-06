/**
 * The ignored-paths endpoint: what git says is ignored under one session's
 * working directory, as paths the file tree can key on.
 *
 * Three properties are under test and none is a formatting detail. A directory
 * that is not a repository is an empty answer rather than an error, because the
 * client only ever degrades to "nothing is dimmed" and an error would be a
 * message nobody can act on. The entries are working-directory-relative, the
 * same key space the tree already uses, so `--full-name` must never appear in
 * the argv. And a git that hangs or dies is a failure, not a silent empty list:
 * an empty list would quietly un-dim every ignored row.
 */
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { devNull, tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { Context } from "@deepseek-ai/cordis";
import { describe, expect, it } from "vitest";

import {
  MAX_IGNORED_ENTRIES,
  createGitRunner,
  listIgnoredPaths,
  type IgnoredRunResult,
  type IgnoredRunner,
} from "../src/host/ignored.ts";
import type { FsTargetFace } from "../src/host/types.ts";
import { FsExplorerWorkspaceService } from "../src/index.ts";
import type { WorkspaceEnv } from "../src/host/workspace.ts";

/** One recorded call, kept so the argv itself can be asserted. */
interface FakeGit extends IgnoredRunner {
  readonly calls: (readonly string[])[];
}

/**
 * A git that answers from a handler instead of spawning.
 *
 * The handler sees the argv, so a test can answer `rev-parse` and `ls-files`
 * differently without matching on call order.
 */
function fakeGit(handler: (argv: readonly string[]) => IgnoredRunResult | Promise<IgnoredRunResult>): FakeGit {
  const calls: (readonly string[])[] = [];
  return {
    calls,
    run: async (argv, options) => {
      void options;
      calls.push(argv);
      return handler(argv);
    },
  };
}

/** A repository root, as `rev-parse` prints it. */
const TOPLEVEL: IgnoredRunResult = { code: 0, stdout: "/workspace\n", stderr: "" };

/** A git that reports a repository and then lists whatever the test wants. */
function repoListing(stdout: string, extra: Partial<IgnoredRunResult> = {}): FakeGit {
  return fakeGit(argv =>
    argv[0] === "rev-parse" ? TOPLEVEL : { code: 0, stdout, stderr: "", ...extra },
  );
}

/** NUL-join entries the way `ls-files -z` does. */
function nulList(entries: readonly string[]): string {
  return entries.map(entry => `${entry}\u0000`).join("");
}

describe("listIgnoredPaths", () => {
  it("answers an empty list outside a repository instead of failing", async () => {
    const git = fakeGit(() => ({ code: 128, stdout: "", stderr: "fatal: not a git repository" }));
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toEqual({
      ok: true,
      ignored: { root: null, entries: [], truncated: false },
    });
    // Nothing else is asked: without a repository there is no ignore information
    // to collect, and a second spawn would only repeat the same refusal.
    expect(git.calls).toEqual([["rev-parse", "--show-toplevel"]]);
  });

  it("asks for working-directory-relative paths, never full-name ones", async () => {
    const git = repoListing(nulList(["x.log"]));
    await listIgnoredPaths({ cwd: "/workspace/sub", git }, { sessionId: "s1" });
    expect(git.calls[1]).toEqual([
      "ls-files",
      "--others",
      "--ignored",
      "--exclude-standard",
      "--directory",
      "-z",
    ]);
  });

  it("parses NUL-separated entries, folding collapsed directories and duplicates", async () => {
    // `--directory` folds a wholly ignored directory into one entry with a
    // trailing slash; the tree keys on the directory path itself, so the slash
    // has to go. Duplicates arrive when a directory is ignored twice over, and
    // `.` arrives when the working directory itself is ignored — that names the
    // container, not a row.
    const git = repoListing(
      nulList(["node_modules/", ".env.local", "文档/笔记 一.md", "node_modules/", "x.log/", "./", ""]),
    );
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toEqual({
      ok: true,
      ignored: {
        root: "/workspace",
        entries: ["node_modules", ".env.local", "文档/笔记 一.md", "x.log"],
        truncated: false,
      },
    });
  });

  it("cuts the list at the cap and says so", async () => {
    const many = Array.from({ length: MAX_IGNORED_ENTRIES + 5 }, (_, index) => `dir${index}/`);
    const git = repoListing(nulList(many));
    const result = await listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ignored.entries).toHaveLength(MAX_IGNORED_ENTRIES);
    expect(result.ignored.entries[0]).toBe("dir0");
    expect(result.ignored.truncated).toBe(true);
  });

  it("reports a runner that cut its own capture as truncated", async () => {
    const git = repoListing(nulList(["a.log"]), { truncated: true });
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toMatchObject({
      ok: true,
      ignored: { truncated: true },
    });
  });

  it("drops the half-written last entry of a cut capture", async () => {
    // A capture cut at the byte cap ends mid-path; that fragment names nothing
    // in the tree, so keeping it would only add an entry that can never match.
    const git = repoListing("a.log\u0000b.lo", { truncated: true });
    const result = await listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ignored.entries).toEqual(["a.log"]);
  });

  it("reports a timed-out listing as io-error", async () => {
    const git = repoListing("", { code: null, stderr: "killed", timedOut: true });
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });

  it("reports a timed-out repository probe as io-error, not as a missing repository", async () => {
    // A probe killed for taking too long says nothing about whether this is a
    // repository. Reading it as "not a repository" would answer an empty list
    // and silently un-dim every ignored row, which is the one outcome the
    // timeout exists to avoid.
    const git = fakeGit(() => ({ code: null, stdout: "", stderr: "", timedOut: true }));
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
    expect(git.calls).toEqual([["rev-parse", "--show-toplevel"]]);
  });

  it("keeps a listing that was cut at the byte cap instead of failing on its exit code", async () => {
    // The runner kills the child once stdout crosses the cap, so a truncated
    // capture always arrives with a non-zero code. Judging the exit code first
    // would reject the very answer the cap was built to deliver: a huge ignore
    // list would lose its dimming entirely rather than arrive cut.
    const git = repoListing("a.log\u0000b.log\u0000c.lo", { code: null, truncated: true });
    const result = await listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ignored.entries).toEqual(["a.log", "b.log"]);
    expect(result.ignored.entries).not.toContain("c.lo");
    expect(result.ignored.truncated).toBe(true);
  });

  it("reports a listing that exited non-zero as io-error", async () => {
    const git = repoListing("", { code: 129, stderr: "fatal: bad revision" });
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });

  it("still fails a non-truncated listing that exited non-zero", async () => {
    // The truncation exemption must not swallow a real failure: a git that died
    // without filling the cap has no entries to trust.
    const git = repoListing("", { code: 128, stderr: "fatal: not a git repository" });
    const result = await listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("io-error");
    expect(result.error.message).toContain("fatal");
  });

  it("reports a runner that threw as io-error", async () => {
    const git = fakeGit(argv => {
      if (argv[0] === "rev-parse") return TOPLEVEL;
      throw new Error("spawn EACCES");
    });
    await expect(listIgnoredPaths({ cwd: "/workspace", git }, { sessionId: "s1" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });
});

/** A filesystem slice wide enough for the workspace service to construct. */
function fakeFs(): {
  readonly resolve: (path: string) => Promise<FsTargetFace>;
  readonly stat: () => Promise<undefined>;
} {
  return {
    resolve: async (target: string) => ({ targetKey: `tk:${target}`, displayPath: target }),
    stat: async () => undefined,
  };
}

/** The platform facts the workspace service needs, with a git that never spawns. */
function serviceEnv(git?: IgnoredRunner): WorkspaceEnv {
  return {
    platform: "darwin",
    env: {},
    spawn: () => {
      throw new Error("this test never spawns");
    },
    git,
  };
}

describe("FsExplorerWorkspaceService.ignored", () => {
  it("answers no-workspace before asking git anything", async () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    const git = repoListing(nulList(["x.log"]));
    const service = new FsExplorerWorkspaceService(ctx, serviceEnv(git));
    await expect(service.ignored({ sessionId: "ghost" })).resolves.toMatchObject({
      ok: false,
      error: { code: "no-workspace" },
    });
    expect(git.calls).toEqual([]);
  });

  it("answers io-error when the host has no git runner", async () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    ctx.provide("sessions", { get: () => ({ header: { cwd: "/workspace" } }) });
    const service = new FsExplorerWorkspaceService(ctx, serviceEnv());
    await expect(service.ignored({ sessionId: "s1" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });

  it("runs git in the session's working directory", async () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    ctx.provide("sessions", { get: () => ({ header: { cwd: "/workspace/sub" } }) });
    const seen: string[] = [];
    const git: IgnoredRunner = {
      run: async (argv, options) => {
        seen.push(options.cwd);
        return argv[0] === "rev-parse" ? TOPLEVEL : { code: 0, stdout: nulList(["x.log"]), stderr: "" };
      },
    };
    const service = new FsExplorerWorkspaceService(ctx, serviceEnv(git));
    await expect(service.ignored({ sessionId: "s1" })).resolves.toMatchObject({
      ok: true,
      ignored: { entries: ["x.log"] },
    });
    expect(seen).toEqual(["/workspace/sub", "/workspace/sub"]);
  });
});

describe("createGitRunner against a real repository", () => {
  const run = promisify(execFile);

  /** One throwaway directory, removed by whichever test made it. */
  async function scratch(prefix: string): Promise<string> {
    return mkdtemp(path.join(tmpdir(), prefix));
  }

  it("lists the ignored directory and file, and nothing that is merely untracked", async () => {
    const dir = await scratch("dsh-ignored-");
    try {
      await run("git", ["init", "--quiet"], { cwd: dir });
      // The reader's global excludes file would otherwise add ignores this test
      // never wrote, so the repository pins its own to the null device.
      await run("git", ["config", "core.excludesFile", devNull], { cwd: dir });
      await writeFile(path.join(dir, ".gitignore"), "ignored-dir/\n*.log\n");
      await mkdir(path.join(dir, "ignored-dir"));
      await writeFile(path.join(dir, "ignored-dir", "a.txt"), "a");
      await writeFile(path.join(dir, "x.log"), "x");
      await writeFile(path.join(dir, "kept.txt"), "k");
      await mkdir(path.join(dir, "kept-dir"));
      await writeFile(path.join(dir, "kept-dir", "y.txt"), "y");

      const result = await listIgnoredPaths({ cwd: dir, git: createGitRunner() }, { sessionId: "s1" });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.ignored.root).toBe(await realpath(dir));
      expect(result.ignored.entries).toContain("ignored-dir");
      expect(result.ignored.entries).toContain("x.log");
      expect(result.ignored.entries).not.toContain("kept.txt");
      expect(result.ignored.entries).not.toContain("kept-dir");
      expect(result.ignored.truncated).toBe(false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("answers an empty list for a directory that is not a repository", async () => {
    const dir = await scratch("dsh-plain-");
    try {
      await expect(
        listIgnoredPaths({ cwd: dir, git: createGitRunner() }, { sessionId: "s1" }),
      ).resolves.toEqual({ ok: true, ignored: { root: null, entries: [], truncated: false } });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("keeps entries relative to the working directory inside a subdirectory", async () => {
    const dir = await scratch("dsh-sub-");
    try {
      await run("git", ["init", "--quiet"], { cwd: dir });
      await run("git", ["config", "core.excludesFile", devNull], { cwd: dir });
      await writeFile(path.join(dir, ".gitignore"), "*.log\n");
      await mkdir(path.join(dir, "pkg"));
      await writeFile(path.join(dir, "pkg", "y.log"), "y");

      const result = await listIgnoredPaths({ cwd: path.join(dir, "pkg"), git: createGitRunner() }, {
        sessionId: "s1",
      });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      // The tree keys on paths relative to the session, so `pkg/` must not
      // appear even though the repository root is one level up.
      expect(result.ignored.entries).toEqual(["y.log"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
