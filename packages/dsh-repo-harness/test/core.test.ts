import { describe, expect, it } from "vitest";

import { normalizeConfig } from "../src/merge-steer/config.ts";
import { createMergeSteerCore } from "../src/merge-steer/core.ts";
import type { AgentLike } from "../src/types.ts";
import type { GitRunner, GitRunResult } from "../src/git.ts";

const REPO = "/repo";
const WORKTREE = "/repo/wt";
const COMMON = "/repo/.git";
const OTHER = "/other";
const OTHER_COMMON = "/other/.git";

interface TestAgent extends AgentLike {
  status: "idle" | "running";
  readonly calls: { readonly text: string; readonly source: unknown }[];
}

function makeAgent(id: string, cwd: string, options: { status?: "idle" | "running"; origin?: "subagent" } = {}): TestAgent {
  const calls: { text: string; source: unknown }[] = [];
  return {
    id,
    status: options.status ?? "running",
    session: { header: { cwd, ...(options.origin === undefined ? {} : { origin: options.origin }) } },
    calls,
    steer(input) {
      calls.push({ text: input.content.map((part) => part.text).join(""), source: input.source });
    },
  };
}

interface World {
  readonly refs: Map<string, Map<string, string>>;
  readonly reflogs: Map<string, Map<string, { sha: string; time: number; subject: string }[]>>;
  readonly branches: Map<string, string | null>;
  readonly failBranches: Set<string>;
  refsGate: Promise<void> | null;
  gateStarted: (() => void) | null;
  failRefs: boolean;
  createRunner(cwd: string): GitRunner;
}

function createWorld(): World {
  const refs = new Map<string, Map<string, string>>([
    [COMMON, new Map([["refs/heads/main", "old-main"], ["refs/heads/feature", "old-feature"]])],
    [OTHER_COMMON, new Map()],
  ]);
  const reflogs = new Map<string, Map<string, { sha: string; time: number; subject: string }[]>>([
    [
      COMMON,
      new Map([
        ["refs/heads/main", [{ sha: "old-main", time: 1, subject: "commit (initial): base" }]],
        ["refs/heads/feature", [{ sha: "old-feature", time: 1, subject: "commit (initial): base" }]],
      ]),
    ],
    [OTHER_COMMON, new Map()],
  ]);
  const branches = new Map<string, string | null>([
    [REPO, "main"],
    [WORKTREE, "feature"],
    [OTHER, "main"],
  ]);
  const world: World = {
    refs,
    reflogs,
    branches,
    failBranches: new Set(),
    refsGate: null,
    gateStarted: null,
    failRefs: false,
    createRunner(cwd: string): GitRunner {
      const common = cwd === OTHER ? OTHER_COMMON : COMMON;
      return {
        cwd,
        async run(args): Promise<GitRunResult> {
          const ok = (stdout = "", exitCode = 0): GitRunResult => ({
            argv: ["git", ...args],
            exitCode,
            stdout,
            stderr: "",
            timedOut: false,
            cancelled: false,
            stdoutLossy: false,
          });
          if (args[0] === "rev-parse") {
            if (cwd !== REPO && cwd !== WORKTREE && cwd !== OTHER) return ok("false\n");
            return ok(`true\n${cwd}\n${common}\n`);
          }
          if (world.failRefs && args[0] === "for-each-ref") throw new Error("boom");
          if (args[0] === "for-each-ref") {
            if (world.refsGate !== null) {
              world.gateStarted?.();
              await world.refsGate;
            }
            const repoRefs = refs.get(common) ?? new Map();
            return ok([...repoRefs].map(([ref, sha]) => `${ref}\t${sha}`).join("\n"));
          }
          if (args[0] === "reflog") {
            const ref = args.at(-1) ?? "";
            const entries = reflogs.get(common)?.get(ref) ?? [];
            return ok(entries.map((entry) => `${entry.sha}\t${entry.time}\t${entry.subject}`).join("\n"));
          }
          if (args[0] === "show") return ok("merge feature");
          if (args[0] === "merge-base") return ok("", 0);
          if (args[0] === "symbolic-ref") {
            if (args.at(-1) === "HEAD" && world.failBranches.has(cwd)) throw new Error("branch probe failed");
            return ok(branches.get(cwd) ?? "", branches.get(cwd) === null ? 1 : 0);
          }
          if (args[0] === "config") return ok("", 1);
          if (args[0] === "show-ref") return ok("", args.includes("refs/heads/main") ? 0 : 1);
          return ok("", 1);
        },
      };
    },
  };
  return world;
}

function mergeMain(world: World): void {
  world.refs.get(COMMON)?.set("refs/heads/main", "merge-main");
  world.reflogs.get(COMMON)?.set("refs/heads/main", [
    { sha: "merge-main", time: 2, subject: "merge feature: Merge made by the 'ort' strategy." },
    { sha: "old-main", time: 1, subject: "commit (initial): base" },
  ]);
}

const config = normalizeConfig({ watch: false, pollMs: 15_000 });

describe("createMergeSteerCore", () => {
  it("establishes a baseline without notifying", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    expect(agent.calls).toHaveLength(0);
  });

  it("steers every running session in the repository on a default-branch merge", async () => {
    const world = createWorld();
    const main = makeAgent("main", REPO);
    const worktree = makeAgent("worktree", WORKTREE);
    const core = createMergeSteerCore({
      agents: { list: () => [main, worktree] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    mergeMain(world);
    await core.tick();

    expect(main.calls).toHaveLength(1);
    expect(worktree.calls).toHaveLength(1);
    expect(main.calls[0]?.text).toContain("feature 已合并进 main");
    expect(main.calls[0]?.text).toContain("merge feature");
    expect(main.calls[0]?.source).toMatchObject({ kind: "merge-steer" });
  });

  it("does not wake idle sessions, subagents or sessions in another repository", async () => {
    const world = createWorld();
    const idle = makeAgent("idle", REPO, { status: "idle" });
    const subagent = makeAgent("subagent", REPO, { origin: "subagent" });
    const other = makeAgent("other", OTHER);
    const core = createMergeSteerCore({
      agents: { list: () => [idle, subagent, other] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    mergeMain(world);
    await core.tick();

    expect(idle.calls).toHaveLength(0);
    expect(subagent.calls).toHaveLength(0);
    expect(other.calls).toHaveLength(0);
  });

  it("notifies only the target branch for a non-default-branch merge", async () => {
    const world = createWorld();
    const main = makeAgent("main", REPO);
    const worktree = makeAgent("worktree", WORKTREE);
    const core = createMergeSteerCore({
      agents: { list: () => [main, worktree] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    world.refs.get(COMMON)?.set("refs/heads/feature", "merge-feature");
    world.reflogs.get(COMMON)?.set("refs/heads/feature", [
      { sha: "merge-feature", time: 2, subject: "merge main: Fast-forward" },
      { sha: "old-feature", time: 1, subject: "commit (initial): base" },
    ]);
    await core.tick();

    expect(main.calls).toHaveLength(0);
    expect(worktree.calls).toHaveLength(1);
    expect(worktree.calls[0]?.text).toContain("main 已合并进 feature");
  });

  it("deduplicates the same merge for the same session", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    mergeMain(world);
    await core.tick();
    await core.tick();

    expect(agent.calls).toHaveLength(1);
  });

  it("clamps a very long commit message", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
      readCommitMessage: async () => "长".repeat(10_000),
    });

    await core.tick();
    mergeMain(world);
    await core.tick();

    expect(agent.calls).toHaveLength(1);
    expect(agent.calls[0]?.text.length).toBeLessThanOrEqual(1_000);
    expect(agent.calls[0]?.text).toContain("…");
  });

  it("survives a Git failure and keeps the next poll usable", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    const warnings: string[] = [];
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
      logger: { warn: (message) => warnings.push(message) },
    });

    await core.tick();
    world.failRefs = true;
    await expect(core.tick()).resolves.toBeUndefined();
    expect(warnings.length).toBeGreaterThan(0);

    world.failRefs = false;
    mergeMain(world);
    await core.tick();
    expect(agent.calls).toHaveLength(1);
  });

  it("retries a transient steer failure on a later tick", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    let failures = 1;
    const steer = agent.steer.bind(agent);
    agent.steer = (input) => {
      if (failures > 0) {
        failures -= 1;
        throw new Error("transient");
      }
      steer(input);
    };
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
      logger: { warn: () => {} },
    });

    await core.tick();
    mergeMain(world);
    await core.tick();
    expect(agent.calls).toHaveLength(0);

    await core.tick();
    expect(agent.calls).toHaveLength(1);
  });

  it("does not steer after dispose while a tick is in flight", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    mergeMain(world);
    let release!: () => void;
    let started!: () => void;
    const startedPromise = new Promise<void>((resolve) => {
      started = resolve;
    });
    world.refsGate = new Promise<void>((resolve) => {
      release = resolve;
    });
    world.gateStarted = started;

    const pending = core.tick();
    await startedPromise;
    core.dispose();
    release();
    await pending;

    expect(agent.calls).toHaveLength(0);
  });

  it("notifies conservatively when a session branch probe fails", async () => {
    const world = createWorld();
    const main = makeAgent("main", REPO);
    const worktree = makeAgent("worktree", WORKTREE);
    const core = createMergeSteerCore({
      agents: { list: () => [main, worktree] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    world.failBranches.add(REPO);
    world.refs.get(COMMON)?.set("refs/heads/feature", "merge-feature");
    world.reflogs.get(COMMON)?.set("refs/heads/feature", [
      { sha: "merge-feature", time: 2, subject: "merge main: Fast-forward" },
      { sha: "old-feature", time: 1, subject: "commit (initial): base" },
    ]);
    await core.tick();

    expect(main.calls).toHaveLength(1);
    expect(worktree.calls).toHaveLength(1);
  });

  it("does not deliver after dispose", async () => {
    const world = createWorld();
    const agent = makeAgent("main", REPO);
    const core = createMergeSteerCore({
      agents: { list: () => [agent] },
      createRunner: world.createRunner,
      config,
    });

    await core.tick();
    core.dispose();
    mergeMain(world);
    await core.tick();

    expect(agent.calls).toHaveLength(0);
  });
});
