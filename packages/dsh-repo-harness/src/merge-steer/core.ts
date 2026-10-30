/**
 * merge-steer scheduler and delivery core.
 *
 * The core is deliberately host-free: it receives the Agent registry, a runner
 * factory and an optional logger, so the whole behavior can be driven from a
 * fake world in tests. The 15-second poll is the correctness floor; `fs.watch`
 * and `agent/status` only request an earlier tick.
 */
import { watch as fsWatch } from "node:fs";
import { join } from "node:path";

import {
  detectDefaultBranch,
  isAncestor,
  readCommitMessage as readCommitMessageFromGit,
  readCommitParents,
  readCurrentBranch,
  readReflog,
  readRefs,
  resolveRepo,
  type GitRunner,
} from "../git.ts";
import type { AgentLike, AgentsLike, LoggerLike, MergeEvent, RepoRef, WorkingDirectoryLike } from "../types.ts";
import { selectMergeEntries } from "./classify.ts";
import { composeNotice } from "./message.ts";
import type { MergeSteerConfig } from "./config.ts";

const REPO_CACHE_MS = 30_000;
const BRANCH_CACHE_MS = 10_000;
const DEFAULT_BRANCH_CACHE_MS = 60_000;
const WATCHER_GRACE_MS = 60_000;
const DELIVERED_PER_SESSION = 256;
const MAX_ATTEMPTS = 3;
const WATCH_DEBOUNCE_MS = 80;

/** Dependencies the plugin wires into the feature. */
export interface MergeSteerDeps {
  readonly agents: AgentsLike;
  readonly createRunner: (cwd: string) => GitRunner;
  readonly workingDirectory?: WorkingDirectoryLike;
  readonly logger?: LoggerLike;
  readonly config: MergeSteerConfig;
  readonly now?: () => number;
  readonly on?: (event: string, handler: (...args: unknown[]) => void, options?: { global?: boolean }) => (() => void) | void;
  readonly readCommitMessage?: (runner: GitRunner, sha: string) => Promise<string>;
}

/** The feature handle the plugin starts and disposes. */
export interface MergeSteerCore {
  start(): void;
  dispose(): void;
  tick(): Promise<void>;
  requestTick(): void;
  status(): { readonly runningSessions: number; readonly repos: number; readonly delivered: number };
}

interface SessionBinding {
  readonly agent: AgentLike;
  readonly dir: string;
  readonly probeDir: string;
  readonly repo: RepoRef | null;
  branch: string | null;
  branchAt: number;
}

interface RepoWatcher {
  repo: RepoRef;
  probeDir: string;
  refs: Map<string, string> | null;
  lastSeen: number;
  lastSuccess: number;
  failures: number;
  defaultBranch: string | null;
  defaultBranchAt: number;
  watchClose: (() => void) | null;
  inFlight: boolean;
  dirty: boolean;
}

interface SessionCandidate {
  readonly agent: AgentLike;
  readonly dir: string;
}

interface RepoGroup {
  readonly repo: RepoRef;
  readonly bindings: SessionBinding[];
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Create the merge-steer feature.
 * @param deps - host seams and normalized config.
 * @returns a startable, disposable feature handle.
 */
export function createMergeSteerCore(deps: MergeSteerDeps): MergeSteerCore {
  const now = deps.now ?? Date.now;
  const readCommitMessage = deps.readCommitMessage ?? readCommitMessageFromGit;
  const bindings = new Map<string, SessionBinding>();
  const repoCache = new Map<string, { repo: RepoRef | null; at: number }>();
  const watchers = new Map<string, RepoWatcher>();
  const delivered = new Map<string, Set<string>>();
  const attempts = new Map<string, number>();
  const retryQueue = new Map<string, { event: MergeEvent; binding: SessionBinding }>();
  const disposers: (() => void)[] = [];
  let started = false;
  let disposed = false;
  let ticking = false;
  let dirty = false;
  let intervalHandle: ReturnType<typeof setInterval> | null = null;
  let requestHandle: ReturnType<typeof setTimeout> | null = null;
  let deliveredCount = 0;

  const logger = deps.logger;

  function dirOf(agent: AgentLike): string | null {
    if (deps.workingDirectory !== undefined) {
      try {
        const current = deps.workingDirectory.get(agent.session);
        if (typeof current === "string" && current.length > 0) return current;
      } catch {
        // Fall through to the durable header.
      }
    }
    const cwd = agent.session.header?.cwd;
    return typeof cwd === "string" && cwd.length > 0 ? cwd : null;
  }

  async function repoForDir(dir: string): Promise<RepoRef | null> {
    const at = now();
    const cached = repoCache.get(dir);
    if (cached !== undefined && at - cached.at < REPO_CACHE_MS) return cached.repo;
    let repo: RepoRef | null = null;
    try {
      repo = await resolveRepo(deps.createRunner(dir));
    } catch {
      repo = null;
    }
    repoCache.set(dir, { repo, at });
    return repo;
  }

  async function bind(agent: AgentLike, dir: string): Promise<SessionBinding> {
    const cached = bindings.get(agent.id);
    if (cached !== undefined && cached.agent === agent && cached.dir === dir) return cached;

    let repo = await repoForDir(dir);
    let probeDir = dir;
    if (repo === null) {
      const headerCwd = agent.session.header?.cwd;
      if (typeof headerCwd === "string" && headerCwd.length > 0 && headerCwd !== dir) {
        repo = await repoForDir(headerCwd);
        if (repo !== null) probeDir = headerCwd;
      }
    }

    const sameRepo = cached !== undefined && cached.repo?.commonDir === repo?.commonDir;
    const binding: SessionBinding = {
      agent,
      dir,
      probeDir,
      repo,
      branch: sameRepo ? cached.branch : null,
      branchAt: sameRepo ? cached.branchAt : 0,
    };
    bindings.set(agent.id, binding);
    return binding;
  }

  function collectSessions(): SessionCandidate[] {
    const candidates: SessionCandidate[] = [];
    for (const agent of deps.agents.list()) {
      if (agent.status !== "running") continue;
      if (!deps.config.notifySubagents && agent.session.header?.origin === "subagent") continue;
      const dir = dirOf(agent);
      if (dir !== null) candidates.push({ agent, dir });
    }
    return candidates;
  }

  function ensureWatch(watcher: RepoWatcher): void {
    if (!deps.config.watch || watcher.watchClose !== null) return;
    const attach = (path: string, recursive: boolean): boolean => {
      try {
        const handle = fsWatch(path, { recursive }, () => {
          requestTick();
        });
        handle.on("error", () => {
          watcher.watchClose?.();
          watcher.watchClose = null;
        });
        watcher.watchClose = () => {
          handle.close();
        };
        return true;
      } catch {
        return false;
      }
    };
    if (attach(join(watcher.repo.commonDir, "logs"), true)) return;
    attach(watcher.repo.commonDir, false);
  }

  function ensureWatcher(key: string, repo: RepoRef, probeDir: string): RepoWatcher {
    let watcher = watchers.get(key);
    if (watcher === undefined) {
      watcher = {
        repo,
        probeDir,
        refs: null,
        lastSeen: now(),
        lastSuccess: 0,
        failures: 0,
        defaultBranch: null,
        defaultBranchAt: 0,
        watchClose: null,
        inFlight: false,
        dirty: false,
      };
      watchers.set(key, watcher);
      ensureWatch(watcher);
    } else {
      watcher.repo = repo;
      watcher.probeDir = probeDir;
    }
    watcher.lastSeen = now();
    return watcher;
  }

  async function classifyRef(
    runner: GitRunner,
    ref: string,
    oldSha: string,
    newSha: string,
  ): Promise<{ sha: string; sources: readonly string[]; mode: "merge" | "fast-forward" | "unknown"; subject: string }[]> {
    const accepted: { sha: string; sources: readonly string[]; mode: "merge" | "fast-forward" | "unknown"; subject: string }[] = [];
    try {
      const entries = await readReflog(runner, ref);
      const candidates = selectMergeEntries(entries, oldSha, deps.config.includePulls);
      for (const candidate of candidates) {
        try {
          if (await isAncestor(runner, candidate.sha, newSha)) accepted.push(candidate);
        } catch {
          // A missing object is not merge evidence; keep the ref baseline and move on.
        }
      }
      if (accepted.length > 0) return accepted;
    } catch {
      // Fall through to the commit-graph fallback.
    }
    try {
      const parents = await readCommitParents(runner, newSha);
      if (parents.length >= 3 && parents[1] === oldSha) {
        return [{ sha: newSha, sources: [], mode: "merge", subject: "" }];
      }
    } catch {
      // No reflog and no usable graph: skip this ref.
    }
    return [];
  }

  async function collectEvents(
    runner: GitRunner,
    previous: Map<string, string>,
    refs: Map<string, string>,
    watcher: RepoWatcher,
  ): Promise<MergeEvent[]> {
    const events: MergeEvent[] = [];
    for (const [ref, newSha] of refs) {
      const oldSha = previous.get(ref);
      if (oldSha === undefined || oldSha === newSha) continue;
      const candidates = await classifyRef(runner, ref, oldSha, newSha);
      const targetBranch = ref.startsWith("refs/heads/") ? ref.slice("refs/heads/".length) : ref;
      for (const candidate of candidates) {
        let message = candidate.subject;
        try {
          message = await readCommitMessage(runner, candidate.sha);
        } catch {
          // Fall back to the reflog subject.
        }
        events.push({
          repoRoot: watcher.repo.root,
          commonDir: watcher.repo.commonDir,
          repoLabel: watcher.repo.label,
          targetRef: ref,
          targetBranch,
          sourceLabels: candidate.sources,
          mergeSha: candidate.sha,
          mode: candidate.mode,
          message,
        });
      }
    }
    return events;
  }

  async function ensureDefaultBranch(watcher: RepoWatcher, runner: GitRunner, at: number): Promise<void> {
    if (watcher.defaultBranchAt !== 0 && at - watcher.defaultBranchAt < DEFAULT_BRANCH_CACHE_MS) return;
    try {
      watcher.defaultBranch = await detectDefaultBranch(runner);
    } catch {
      watcher.defaultBranch = null;
    }
    watcher.defaultBranchAt = at;
  }

  async function branchOf(binding: SessionBinding, at: number): Promise<{ branch: string | null; failed: boolean }> {
    if (binding.branchAt !== 0 && at - binding.branchAt < BRANCH_CACHE_MS) {
      return { branch: binding.branch, failed: false };
    }
    try {
      binding.branch = await readCurrentBranch(deps.createRunner(binding.probeDir));
      binding.branchAt = at;
      return { branch: binding.branch, failed: false };
    } catch {
      // Leave the cache unset so the next event retries the probe instead of
      // caching a transient failure for a whole branch-cache window.
      binding.branchAt = 0;
      return { branch: null, failed: true };
    }
  }

  async function selectAudience(
    event: MergeEvent,
    group: readonly SessionBinding[],
    watcher: RepoWatcher,
    runner: GitRunner,
  ): Promise<readonly SessionBinding[]> {
    const at = now();
    await ensureDefaultBranch(watcher, runner, at);
    if (deps.config.audienceAll || watcher.defaultBranch === null || event.targetBranch === watcher.defaultBranch) {
      return group;
    }
    const resolved = await Promise.all(
      group.map(async (binding) => ({ binding, probe: await branchOf(binding, at) })),
    );
    for (const entry of resolved) {
      if (entry.probe.failed) {
        logger?.warn?.(
          `merge-steer: branch probe failed for session ${entry.binding.agent.id}; notifying conservatively`,
        );
      }
    }
    // An unreadable branch is unknown, not "confirmed elsewhere": dropping the
    // notice would lose the event because the ref baseline already advanced.
    return resolved
      .filter((entry) => entry.probe.failed || entry.probe.branch === event.targetBranch)
      .map((entry) => entry.binding);
  }

  function noticeKey(event: MergeEvent): string {
    return `${event.targetRef}\0${event.mergeSha}`;
  }

  function trySteer(event: MergeEvent, binding: SessionBinding): "delivered" | "skipped" | "failed" {
    if (disposed) return "skipped";
    const agent = binding.agent;
    // Check and steer in the same synchronous task: no await may sit between
    // them or an idle transition could let steer open a fresh turn.
    if (agent.status !== "running") return "skipped";
    const key = noticeKey(event);
    const seen = delivered.get(agent.id) ?? new Set<string>();
    if (seen.has(key)) return "delivered";
    const attemptKey = `${agent.id}\0${key}`;
    const attempt = attempts.get(attemptKey) ?? 0;
    if (attempt >= MAX_ATTEMPTS) return "failed";
    try {
      agent.steer({
        content: [{ type: "text", text: composeNotice(event, deps.config) }],
        source: {
          kind: "merge-steer",
          repo: event.repoRoot,
          target: event.targetBranch,
          sha: event.mergeSha,
        },
      });
      seen.add(key);
      if (seen.size > DELIVERED_PER_SESSION) {
        const oldest = seen.values().next().value;
        if (oldest !== undefined) seen.delete(oldest);
      }
      delivered.set(agent.id, seen);
      attempts.delete(attemptKey);
      retryQueue.delete(attemptKey);
      deliveredCount += 1;
      return "delivered";
    } catch (error) {
      attempts.set(attemptKey, attempt + 1);
      logger?.warn?.(`merge-steer: could not steer session ${agent.id}: ${messageOf(error)}`);
      return "failed";
    }
  }

  async function notify(
    event: MergeEvent,
    group: readonly SessionBinding[],
    watcher: RepoWatcher,
    runner: GitRunner,
  ): Promise<void> {
    const audience = await selectAudience(event, group, watcher, runner);
    for (const binding of audience) {
      if (trySteer(event, binding) !== "failed") continue;
      const attemptKey = `${binding.agent.id}\0${noticeKey(event)}`;
      if ((attempts.get(attemptKey) ?? 0) < MAX_ATTEMPTS) retryQueue.set(attemptKey, { event, binding });
    }
  }

  async function retryPending(): Promise<void> {
    for (const [attemptKey, entry] of [...retryQueue]) {
      if (bindings.get(entry.binding.agent.id) !== entry.binding) {
        retryQueue.delete(attemptKey);
        continue;
      }
      const result = trySteer(entry.event, entry.binding);
      if (result !== "failed") {
        retryQueue.delete(attemptKey);
        continue;
      }
      if ((attempts.get(attemptKey) ?? 0) >= MAX_ATTEMPTS) {
        retryQueue.delete(attemptKey);
        logger?.warn?.(`merge-steer: giving up on session ${entry.binding.agent.id} after ${MAX_ATTEMPTS} attempts`);
      }
    }
  }

  async function pollRepo(key: string, group: RepoGroup): Promise<void> {
    const probeDir = group.bindings[0]?.probeDir ?? group.repo.root;
    const watcher = ensureWatcher(key, group.repo, probeDir);
    if (watcher.inFlight) {
      watcher.dirty = true;
      return;
    }
    watcher.inFlight = true;
    try {
      const runner = deps.createRunner(watcher.probeDir);
      const at = now();
      if (watcher.refs !== null && watcher.lastSuccess !== 0 && at - watcher.lastSuccess > deps.config.maxCatchUpMs) {
        watcher.refs = await readRefs(runner);
        watcher.lastSuccess = at;
        return;
      }
      const refs = await readRefs(runner);
      if (watcher.refs === null) {
        watcher.refs = refs;
        watcher.lastSuccess = at;
        watcher.failures = 0;
        return;
      }
      const previous = watcher.refs;
      const events = await collectEvents(runner, previous, refs, watcher);
      watcher.refs = refs;
      watcher.lastSuccess = at;
      watcher.failures = 0;
      for (const event of events) await notify(event, group.bindings, watcher, runner);
    } catch (error) {
      watcher.failures += 1;
      logger?.warn?.(`merge-steer: repository ${group.repo.label} poll failed: ${messageOf(error)}`);
    } finally {
      watcher.inFlight = false;
      if (watcher.dirty) {
        watcher.dirty = false;
        requestTick();
      }
    }
  }

  function pruneWatchers(activeKeys: ReadonlySet<string>): void {
    const at = now();
    for (const [key, watcher] of watchers) {
      if (activeKeys.has(key)) continue;
      if (at - watcher.lastSeen <= WATCHER_GRACE_MS) continue;
      watcher.watchClose?.();
      watchers.delete(key);
    }
  }

  function requestTick(): void {
    if (disposed || requestHandle !== null) return;
    requestHandle = setTimeout(() => {
      requestHandle = null;
      void tick();
    }, WATCH_DEBOUNCE_MS);
  }

  async function tick(): Promise<void> {
    if (disposed) return;
    if (ticking) {
      dirty = true;
      return;
    }
    ticking = true;
    try {
      await retryPending();
      const candidates = collectSessions();
      const activeIds = new Set(candidates.map((candidate) => candidate.agent.id));
      for (const id of bindings.keys()) if (!activeIds.has(id)) bindings.delete(id);

      const resolved = await Promise.all(candidates.map((candidate) => bind(candidate.agent, candidate.dir)));
      const groups = new Map<string, RepoGroup>();
      for (const binding of resolved) {
        if (binding.repo === null) continue;
        const group = groups.get(binding.repo.commonDir) ?? { repo: binding.repo, bindings: [] };
        group.bindings.push(binding);
        groups.set(binding.repo.commonDir, group);
      }
      await Promise.all([...groups].map(([key, group]) => pollRepo(key, group)));
      pruneWatchers(new Set(groups.keys()));
    } catch (error) {
      logger?.warn?.(`merge-steer: tick failed: ${messageOf(error)}`);
    } finally {
      ticking = false;
      if (dirty) {
        dirty = false;
        requestTick();
      }
    }
  }

  function register(event: string, handler: (...args: unknown[]) => void): void {
    if (deps.on === undefined) return;
    const dispose = deps.on(event, handler, { global: true });
    if (typeof dispose === "function") disposers.push(dispose);
  }

  function start(): void {
    if (started || disposed) return;
    started = true;
    intervalHandle = setInterval(() => {
      void tick();
    }, deps.config.pollMs);
    register("agent/status", () => requestTick());
    register("agent/disposed", () => requestTick());
    void tick();
  }

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    if (intervalHandle !== null) clearInterval(intervalHandle);
    intervalHandle = null;
    if (requestHandle !== null) clearTimeout(requestHandle);
    requestHandle = null;
    for (const disposer of disposers.splice(0)) disposer();
    for (const watcher of watchers.values()) watcher.watchClose?.();
    watchers.clear();
    bindings.clear();
    repoCache.clear();
    delivered.clear();
    attempts.clear();
    retryQueue.clear();
  }

  function status(): { runningSessions: number; repos: number; delivered: number } {
    return { runningSessions: bindings.size, repos: watchers.size, delivered: deliveredCount };
  }

  return { start, dispose, tick, requestTick, status };
}
