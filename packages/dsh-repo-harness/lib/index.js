// src/index.ts
import Schema from "@deepseek-ai/schemastery";

// src/git.ts
import { realpath } from "node:fs/promises";
import { basename, dirname, isAbsolute, resolve } from "node:path";
var DEFAULT_TIMEOUT_MS = 5e3;
var DEFAULT_MAX_BYTES = 1048576;
var SPILL_FACTOR = 16;
function assertArgv(args) {
  for (const arg of args) {
    if (typeof arg !== "string" || arg.includes("\0")) {
      throw new TypeError("git runner: every argv entry must be a NUL-free string");
    }
  }
}
async function readStream(reader) {
  if (reader === void 0) return { text: "", lossy: false };
  const read = reader.readFrom(0);
  return { text: read.text, lossy: read.lossy };
}
var GIT_ENV = {
  LC_ALL: "C",
  GIT_TERMINAL_PROMPT: "0",
  GIT_OPTIONAL_LOCKS: "0",
  GIT_PAGER: "cat"
};
function createGitRunner(options) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  return {
    cwd: options.cwd,
    async run(args, runOptions = {}) {
      assertArgv(args);
      const budget = runOptions.maxBytes ?? maxBytes;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const signal = runOptions.signal === void 0 ? controller.signal : AbortSignal.any([controller.signal, runOptions.signal]);
      try {
        const handle = options.subprocess.spawn({
          argv: ["git", ...args],
          cwd: options.cwd,
          env: GIT_ENV,
          stdio: {
            stdin: "ignore",
            stdout: { collect: { maxBytes: budget, spill: { maxBytes: budget * SPILL_FACTOR } } },
            stderr: { collect: { maxBytes: budget, spill: { maxBytes: budget * SPILL_FACTOR } } }
          },
          graceMs: 200,
          signal
        });
        let outcome;
        try {
          outcome = await handle.done;
        } catch (error) {
          if (controller.signal.aborted || runOptions.signal?.aborted === true) {
            return {
              argv: ["git", ...args],
              exitCode: null,
              stdout: "",
              stderr: "",
              timedOut: controller.signal.aborted,
              cancelled: runOptions.signal?.aborted === true && !controller.signal.aborted,
              stdoutLossy: false
            };
          }
          throw error;
        }
        const [stdout, stderr] = await Promise.all([
          readStream(handle.collected.stdout),
          readStream(handle.collected.stderr)
        ]);
        return {
          argv: ["git", ...args],
          exitCode: outcome.exitCode,
          stdout: stdout.text,
          stderr: stderr.text,
          timedOut: controller.signal.aborted,
          cancelled: runOptions.signal?.aborted === true && !controller.signal.aborted,
          stdoutLossy: stdout.lossy
        };
      } finally {
        clearTimeout(timer);
      }
    }
  };
}
async function safeRealpath(path) {
  try {
    return await realpath(path);
  } catch {
    return path;
  }
}
function repositoryLabel(root, commonDir) {
  return basename(commonDir) === ".git" ? basename(dirname(commonDir)) : basename(root);
}
async function resolveRepo(runner) {
  let result = await runner.run([
    "rev-parse",
    "--path-format=absolute",
    "--is-inside-work-tree",
    "--show-toplevel",
    "--git-common-dir"
  ]);
  if (result.exitCode !== 0) {
    result = await runner.run(["rev-parse", "--is-inside-work-tree", "--show-toplevel", "--git-common-dir"]);
  }
  if (result.exitCode !== 0) return null;
  const lines = result.stdout.split(/\r?\n/u).filter((line) => line.length > 0);
  if (lines[0] !== "true") return null;
  const rawRoot = lines[1];
  const rawCommon = lines[2];
  if (rawRoot === void 0 || rawCommon === void 0) return null;
  const root = await safeRealpath(isAbsolute(rawRoot) ? rawRoot : resolve(runner.cwd, rawRoot));
  const commonDir = await safeRealpath(isAbsolute(rawCommon) ? rawCommon : resolve(runner.cwd, rawCommon));
  return { root, commonDir, label: repositoryLabel(root, commonDir) };
}
function failure(argv, result) {
  const detail = result.stderr.trim() || `exit ${String(result.exitCode)}`;
  return new Error(`git ${argv.join(" ")} failed: ${detail}`);
}
async function readRefs(runner) {
  const argv = ["for-each-ref", "--format=%(refname)%09%(objectname)", "refs/heads"];
  const result = await runner.run(argv);
  if (result.exitCode !== 0) throw failure(argv, result);
  const refs = /* @__PURE__ */ new Map();
  for (const line of result.stdout.split(/\r?\n/u)) {
    if (line.length === 0) continue;
    const [ref, sha] = line.split("	");
    if (ref !== void 0 && sha !== void 0 && ref.length > 0 && sha.length > 0) refs.set(ref, sha);
  }
  return refs;
}
async function readReflog(runner, ref, limit = 64) {
  const argv = ["reflog", "show", "-n", String(limit), "--format=%H%x09%ct%x09%gs", ref];
  const result = await runner.run(argv);
  if (result.exitCode !== 0) throw failure(argv, result);
  const entries = [];
  for (const line of result.stdout.split(/\r?\n/u)) {
    if (line.length === 0) continue;
    const first = line.indexOf("	");
    const second = first < 0 ? -1 : line.indexOf("	", first + 1);
    if (first < 0 || second < 0) continue;
    const sha = line.slice(0, first);
    const time = Number(line.slice(first + 1, second));
    const subject = line.slice(second + 1);
    if (sha.length === 0 || !Number.isFinite(time)) continue;
    entries.push({ sha, time, subject });
  }
  return entries;
}
async function readCommitMessage(runner, sha) {
  const argv = ["show", "-s", "--format=%s%n%b", sha];
  const result = await runner.run(argv, { maxBytes: 16 * 1024 });
  if (result.exitCode !== 0) throw failure(argv, result);
  return result.stdout.trim();
}
async function readCommitParents(runner, sha) {
  const argv = ["rev-list", "--parents", "-n", "1", sha];
  const result = await runner.run(argv);
  if (result.exitCode !== 0) throw failure(argv, result);
  return result.stdout.trim().split(/\s+/u).filter((part) => part.length > 0);
}
async function isAncestor(runner, ancestor, descendant) {
  const argv = ["merge-base", "--is-ancestor", ancestor, descendant];
  const result = await runner.run(argv);
  if (result.exitCode === 0) return true;
  if (result.exitCode === 1) return false;
  throw failure(argv, result);
}
async function readCurrentBranch(runner) {
  const argv = ["symbolic-ref", "--short", "-q", "HEAD"];
  const result = await runner.run(argv);
  if (result.exitCode === 0) {
    const branch = result.stdout.trim();
    return branch.length > 0 ? branch : null;
  }
  if (result.exitCode === 1) return null;
  throw failure(argv, result);
}
async function detectDefaultBranch(runner) {
  const origin = await runner.run(["symbolic-ref", "--short", "-q", "refs/remotes/origin/HEAD"]);
  if (origin.exitCode === 0) {
    const value = origin.stdout.trim();
    if (value.startsWith("origin/")) return value.slice("origin/".length);
    if (value.length > 0) return value;
  }
  const configured = await runner.run(["config", "--get", "init.defaultBranch"]);
  if (configured.exitCode === 0) {
    const value = configured.stdout.trim();
    if (value.length > 0) return value;
  }
  for (const branch of ["main", "master"]) {
    const local = await runner.run(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
    if (local.exitCode === 0) return branch;
  }
  return null;
}

// src/merge-steer/config.ts
var DEFAULT_CONFIG = {
  pollMs: 15e3,
  watch: true,
  maxCatchUpMs: 3e5,
  maxNoticeChars: 420,
  maxMessageChars: 200,
  includePulls: false,
  notifySubagents: false,
  audienceAll: false
};
function clampInt(value, fallback, min, max) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
function bool(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function normalizeConfig(raw) {
  const record = typeof raw === "object" && raw !== null ? raw : {};
  const maxNoticeChars = clampInt(record["maxNoticeChars"], DEFAULT_CONFIG.maxNoticeChars, 160, 1200);
  const requestedMessageChars = clampInt(record["maxMessageChars"], DEFAULT_CONFIG.maxMessageChars, 40, 800);
  const maxMessageChars = Math.max(40, Math.min(requestedMessageChars, maxNoticeChars - 120));
  return {
    pollMs: clampInt(record["pollMs"], DEFAULT_CONFIG.pollMs, 1e3, 6e4),
    watch: bool(record["watch"], DEFAULT_CONFIG.watch),
    maxCatchUpMs: clampInt(record["maxCatchUpMs"], DEFAULT_CONFIG.maxCatchUpMs, 6e4, 36e5),
    maxNoticeChars,
    maxMessageChars,
    includePulls: bool(record["includePulls"], DEFAULT_CONFIG.includePulls),
    notifySubagents: bool(record["notifySubagents"], DEFAULT_CONFIG.notifySubagents),
    audienceAll: bool(record["audienceAll"], DEFAULT_CONFIG.audienceAll)
  };
}

// src/merge-steer/core.ts
import { watch as fsWatch } from "node:fs";
import { join } from "node:path";

// src/merge-steer/classify.ts
var MERGE = /^merge\s+(.+?):\s*(.*)$/u;
var COMMIT_MERGE = /^commit \(merge\):\s*(.*)$/u;
var PULL = /^pull(?:\s+[^:]*)?:\s*(.*)$/u;
function modeOf(result) {
  return /fast-forward/iu.test(result) ? "fast-forward" : "merge";
}
function parseReflogAction(subject, includePulls) {
  const merge = MERGE.exec(subject);
  if (merge !== null) {
    const sources = merge[1]?.trim().split(/\s+/u).filter((source) => source.length > 0) ?? [];
    return { kind: "merge", sources, mode: modeOf(merge[2] ?? "") };
  }
  if (COMMIT_MERGE.test(subject)) {
    return { kind: "merge", sources: [], mode: "merge" };
  }
  if (includePulls) {
    const pull = PULL.exec(subject);
    if (pull !== null) return { kind: "pull", sources: [], mode: modeOf(pull[1] ?? "") };
  }
  return null;
}
function selectMergeEntries(entries, oldSha, includePulls = false) {
  const window = [];
  let foundOld = false;
  for (const entry of entries) {
    if (entry.sha === oldSha) {
      foundOld = true;
      break;
    }
    window.push(entry);
  }
  if (!foundOld) window.length = Math.min(window.length, 1);
  const candidates = [];
  for (const entry of window) {
    const parsed = parseReflogAction(entry.subject, includePulls);
    if (parsed === null) continue;
    candidates.push({ sha: entry.sha, sources: parsed.sources, mode: parsed.mode, subject: entry.subject });
  }
  return candidates.reverse();
}

// src/merge-steer/message.ts
var segmenter = new Intl.Segmenter("zh", { granularity: "grapheme" });
var BOUNDARIES = /* @__PURE__ */ new Set(["\u3002", "\uFF01", "\uFF1F", ".", "!", "?", "\uFF1B", ";", "\uFF0C", ",", " "]);
var BOUNDARY_WINDOW = 24;
function sanitizeCommitMessage(raw) {
  return String(raw).replace(/\u001b\[[0-9;]*[A-Za-z]|\u001b\][^\u0007]*\u0007/g, " ").replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, " ").replace(/\s+/g, " ").trim();
}
function countGraphemes(text) {
  let count = 0;
  for (const _ of segmenter.segment(text)) count += 1;
  return count;
}
function clampGraphemes(text, max) {
  if (max <= 0) return "";
  if (max === 1) return "\u2026";
  const parts = [...segmenter.segment(text)].map((part) => part.segment);
  if (parts.length <= max) return text;
  const keep = max - 1;
  let slice = parts.slice(0, keep);
  const window = slice.slice(-BOUNDARY_WINDOW);
  let boundary = -1;
  for (let index = window.length - 1; index >= 0; index -= 1) {
    const candidate = window[index];
    if (candidate !== void 0 && BOUNDARIES.has(candidate)) {
      boundary = keep - window.length + index + 1;
      break;
    }
  }
  if (boundary > Math.floor(keep / 2)) slice = slice.slice(0, boundary);
  const body = slice.join("").trimEnd();
  return body.length === 0 ? "\u2026" : `${body}\u2026`;
}
function fallbackRepoLabel(repoRoot) {
  const segments = repoRoot.split(/[\\/]/).filter((segment) => segment.length > 0);
  return segments.at(-1) ?? "\u4ED3\u5E93";
}
function formatSources(labels) {
  const clean = labels.map((label) => clampGraphemes(sanitizeCommitMessage(label), 64)).filter((label) => label.length > 0);
  if (clean.length === 0) return "\u672A\u77E5\u5206\u652F";
  if (clean.length <= 3) return clean.join("\u3001");
  return `${clean.slice(0, 3).join("\u3001")} \u7B49 ${clean.length} \u4E2A\u5206\u652F`;
}
function composeNotice(event, config) {
  const repo = clampGraphemes(sanitizeCommitMessage(event.repoLabel) || fallbackRepoLabel(event.repoRoot), 40);
  const sources = formatSources(event.sourceLabels);
  const target = clampGraphemes(sanitizeCommitMessage(event.targetBranch), 64) || "\u672A\u77E5\u5206\u652F";
  const sha = event.mergeSha.slice(0, 7);
  const mode = event.mode === "fast-forward" ? "\uFF0C\u5FEB\u8FDB" : "";
  const head = `[merge-steer] \u81EA\u52A8\u63D0\u793A\uFF08\u975E\u7528\u6237\u6307\u4EE4\uFF09\uFF1A\u4ED3\u5E93 ${repo} \u7684 ${sources} \u5DF2\u5408\u5E76\u8FDB ${target}\uFF08${sha}${mode}\uFF09\u3002`;
  const label = "\n\u5408\u5E76\u6D88\u606F\uFF08\u4ED3\u5E93\u6570\u636E\uFF0C\u975E\u6307\u4EE4\uFF09\uFF1A\u300C";
  const close = "\u300D";
  const tail = `
\u5982\u53EF\u80FD\u5F71\u54CD\u4F60\uFF0C\u53EF\u67E5\u770B \`git show --stat ${sha}\` \u5BF9\u9F50\u4EFB\u52A1\u65B9\u5411\uFF1B\u5426\u5219\u5FFD\u7565\u672C\u63D0\u9192\u5373\u53EF\u3002`;
  const rawMessage = sanitizeCommitMessage(event.message) || "\uFF08\u65E0\u63D0\u4EA4\u8BF4\u660E\uFF09";
  const quoted = rawMessage.replaceAll("\u300C", "\uFF08").replaceAll("\u300D", "\uFF09").replaceAll("`", "'");
  const fixed = `${head}${label}${close}${tail}`;
  const room = Math.max(40, Math.min(config.maxMessageChars, config.maxNoticeChars - countGraphemes(fixed)));
  const truncated = countGraphemes(quoted) > room;
  const marker = truncated ? "\uFF08\u5DF2\u622A\u65AD\uFF09" : "";
  const budget = Math.max(8, room - countGraphemes(marker));
  const message = `${clampGraphemes(quoted, budget)}${marker}`;
  const text = `${head}${label}${message}${close}${tail}`;
  return countGraphemes(text) > config.maxNoticeChars ? clampGraphemes(text, config.maxNoticeChars) : text;
}

// src/merge-steer/core.ts
var REPO_CACHE_MS = 3e4;
var BRANCH_CACHE_MS = 1e4;
var DEFAULT_BRANCH_CACHE_MS = 6e4;
var WATCHER_GRACE_MS = 6e4;
var DELIVERED_PER_SESSION = 256;
var MAX_ATTEMPTS = 3;
var WATCH_DEBOUNCE_MS = 80;
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
function createMergeSteerCore(deps) {
  const now = deps.now ?? Date.now;
  const readCommitMessage2 = deps.readCommitMessage ?? readCommitMessage;
  const bindings = /* @__PURE__ */ new Map();
  const repoCache = /* @__PURE__ */ new Map();
  const watchers = /* @__PURE__ */ new Map();
  const delivered = /* @__PURE__ */ new Map();
  const attempts = /* @__PURE__ */ new Map();
  const retryQueue = /* @__PURE__ */ new Map();
  const disposers = [];
  let started = false;
  let disposed = false;
  let ticking = false;
  let dirty = false;
  let intervalHandle = null;
  let requestHandle = null;
  let deliveredCount = 0;
  const logger = deps.logger;
  function dirOf(agent) {
    if (deps.workingDirectory !== void 0) {
      try {
        const current = deps.workingDirectory.get(agent.session);
        if (typeof current === "string" && current.length > 0) return current;
      } catch {
      }
    }
    const cwd = agent.session.header?.cwd;
    return typeof cwd === "string" && cwd.length > 0 ? cwd : null;
  }
  async function repoForDir(dir) {
    const at = now();
    const cached = repoCache.get(dir);
    if (cached !== void 0 && at - cached.at < REPO_CACHE_MS) return cached.repo;
    let repo = null;
    try {
      repo = await resolveRepo(deps.createRunner(dir));
    } catch {
      repo = null;
    }
    repoCache.set(dir, { repo, at });
    return repo;
  }
  async function bind(agent, dir) {
    const cached = bindings.get(agent.id);
    if (cached !== void 0 && cached.agent === agent && cached.dir === dir) return cached;
    let repo = await repoForDir(dir);
    let probeDir = dir;
    if (repo === null) {
      const headerCwd = agent.session.header?.cwd;
      if (typeof headerCwd === "string" && headerCwd.length > 0 && headerCwd !== dir) {
        repo = await repoForDir(headerCwd);
        if (repo !== null) probeDir = headerCwd;
      }
    }
    const sameRepo = cached !== void 0 && cached.repo?.commonDir === repo?.commonDir;
    const binding = {
      agent,
      dir,
      probeDir,
      repo,
      branch: sameRepo ? cached.branch : null,
      branchAt: sameRepo ? cached.branchAt : 0
    };
    bindings.set(agent.id, binding);
    return binding;
  }
  function collectSessions() {
    const candidates = [];
    for (const agent of deps.agents.list()) {
      if (agent.status !== "running") continue;
      if (!deps.config.notifySubagents && agent.session.header?.origin === "subagent") continue;
      const dir = dirOf(agent);
      if (dir !== null) candidates.push({ agent, dir });
    }
    return candidates;
  }
  function ensureWatch(watcher) {
    if (!deps.config.watch || watcher.watchClose !== null) return;
    const attach = (path, recursive) => {
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
  function ensureWatcher(key, repo, probeDir) {
    let watcher = watchers.get(key);
    if (watcher === void 0) {
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
        dirty: false
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
  async function classifyRef(runner, ref, oldSha, newSha) {
    const accepted = [];
    try {
      const entries = await readReflog(runner, ref);
      const candidates = selectMergeEntries(entries, oldSha, deps.config.includePulls);
      for (const candidate of candidates) {
        try {
          if (await isAncestor(runner, candidate.sha, newSha)) accepted.push(candidate);
        } catch {
        }
      }
      if (accepted.length > 0) return accepted;
    } catch {
    }
    try {
      const parents = await readCommitParents(runner, newSha);
      if (parents.length >= 3 && parents[1] === oldSha) {
        return [{ sha: newSha, sources: [], mode: "merge", subject: "" }];
      }
    } catch {
    }
    return [];
  }
  async function collectEvents(runner, previous, refs, watcher) {
    const events = [];
    for (const [ref, newSha] of refs) {
      const oldSha = previous.get(ref);
      if (oldSha === void 0 || oldSha === newSha) continue;
      const candidates = await classifyRef(runner, ref, oldSha, newSha);
      const targetBranch = ref.startsWith("refs/heads/") ? ref.slice("refs/heads/".length) : ref;
      for (const candidate of candidates) {
        let message = candidate.subject;
        try {
          message = await readCommitMessage2(runner, candidate.sha);
        } catch {
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
          message
        });
      }
    }
    return events;
  }
  async function ensureDefaultBranch(watcher, runner, at) {
    if (watcher.defaultBranchAt !== 0 && at - watcher.defaultBranchAt < DEFAULT_BRANCH_CACHE_MS) return;
    try {
      watcher.defaultBranch = await detectDefaultBranch(runner);
    } catch {
      watcher.defaultBranch = null;
    }
    watcher.defaultBranchAt = at;
  }
  async function branchOf(binding, at) {
    if (binding.branchAt !== 0 && at - binding.branchAt < BRANCH_CACHE_MS) return binding.branch;
    try {
      binding.branch = await readCurrentBranch(deps.createRunner(binding.probeDir));
    } catch {
      binding.branch = null;
    }
    binding.branchAt = at;
    return binding.branch;
  }
  async function selectAudience(event, group, watcher, runner) {
    const at = now();
    await ensureDefaultBranch(watcher, runner, at);
    if (deps.config.audienceAll || watcher.defaultBranch === null || event.targetBranch === watcher.defaultBranch) {
      return group;
    }
    const resolved = await Promise.all(group.map(async (binding) => ({ binding, branch: await branchOf(binding, at) })));
    return resolved.filter((entry) => entry.branch === event.targetBranch).map((entry) => entry.binding);
  }
  function noticeKey(event) {
    return `${event.targetRef}\0${event.mergeSha}`;
  }
  function trySteer(event, binding) {
    const agent = binding.agent;
    if (agent.status !== "running") return "skipped";
    const key = noticeKey(event);
    const seen = delivered.get(agent.id) ?? /* @__PURE__ */ new Set();
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
          sha: event.mergeSha
        }
      });
      seen.add(key);
      if (seen.size > DELIVERED_PER_SESSION) {
        const oldest = seen.values().next().value;
        if (oldest !== void 0) seen.delete(oldest);
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
  async function notify(event, group, watcher, runner) {
    const audience = await selectAudience(event, group, watcher, runner);
    for (const binding of audience) {
      if (trySteer(event, binding) !== "failed") continue;
      const attemptKey = `${binding.agent.id}\0${noticeKey(event)}`;
      if ((attempts.get(attemptKey) ?? 0) < MAX_ATTEMPTS) retryQueue.set(attemptKey, { event, binding });
    }
  }
  async function retryPending() {
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
  async function pollRepo(key, group) {
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
  function pruneWatchers(activeKeys) {
    const at = now();
    for (const [key, watcher] of watchers) {
      if (activeKeys.has(key)) continue;
      if (at - watcher.lastSeen <= WATCHER_GRACE_MS) continue;
      watcher.watchClose?.();
      watchers.delete(key);
    }
  }
  function requestTick() {
    if (disposed || requestHandle !== null) return;
    requestHandle = setTimeout(() => {
      requestHandle = null;
      void tick();
    }, WATCH_DEBOUNCE_MS);
  }
  async function tick() {
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
      const groups = /* @__PURE__ */ new Map();
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
  function register(event, handler) {
    if (deps.on === void 0) return;
    const dispose2 = deps.on(event, handler, { global: true });
    if (typeof dispose2 === "function") disposers.push(dispose2);
  }
  function start() {
    if (started || disposed) return;
    started = true;
    intervalHandle = setInterval(() => {
      void tick();
    }, deps.config.pollMs);
    register("agent/status", () => requestTick());
    register("agent/disposed", () => requestTick());
    void tick();
  }
  function dispose() {
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
  function status() {
    return { runningSessions: bindings.size, repos: watchers.size, delivered: deliveredCount };
  }
  return { start, dispose, tick, requestTick, status };
}

// src/index.ts
var name = "repo-harness";
var inject = ["agents", "subprocess"];
var Config = Schema.object({
  mergeSteer: Schema.object({
    pollMs: Schema.number().default(15e3).description("\u8F6E\u8BE2\u95F4\u9694\uFF08\u6BEB\u79D2\uFF09\uFF0C15 \u79D2\u662F\u6B63\u786E\u6027\u5730\u677F"),
    watch: Schema.boolean().default(true).description("\u662F\u5426\u7528 fs.watch \u63D0\u524D\u89E6\u53D1\u8F6E\u8BE2"),
    maxCatchUpMs: Schema.number().default(3e5).description("\u4F11\u7720\u6216\u6682\u505C\u8D85\u8FC7\u8BE5\u65F6\u957F\u540E\u91CD\u5EFA\u57FA\u7EBF\uFF0C\u4E0D\u8865\u53D1\u5386\u53F2\u5408\u5E76"),
    maxNoticeChars: Schema.number().default(420).description("\u5355\u6761\u63D0\u9192\u7684\u5B57\u7D20\u786C\u4E0A\u9650"),
    maxMessageChars: Schema.number().default(200).description("\u63D0\u4EA4\u8BF4\u660E\u7684\u5B57\u7D20\u4E0A\u9650"),
    includePulls: Schema.boolean().default(false).description("\u662F\u5426\u628A git pull \u7684 reflog \u4E5F\u89C6\u4E3A\u5408\u5E76"),
    notifySubagents: Schema.boolean().default(false).description("\u662F\u5426\u63D0\u9192\u5B50\u4EE3\u7406\u4F1A\u8BDD"),
    audienceAll: Schema.boolean().default(false).description("\u662F\u5426\u5BF9\u540C\u4ED3\u5E93\u6240\u6709 running \u4F1A\u8BDD\u5E7F\u64AD")
  }).default({}).description("merge-steer \u7279\u6027\u914D\u7F6E")
});
function workingDirectoryOf(ctx) {
  const candidate = ctx.get?.("workingDirectory");
  if (typeof candidate === "object" && candidate !== null) {
    const get = candidate.get;
    if (typeof get === "function") return candidate;
  }
  return void 0;
}
function mergeSteerConfigOf(raw) {
  return typeof raw === "object" && raw !== null ? raw["mergeSteer"] : void 0;
}
function apply(ctx, rawConfig) {
  const { agents, subprocess } = ctx;
  if (agents === void 0 || subprocess === void 0) {
    ctx.logger?.warn?.("repo-harness: agents or subprocess is unavailable; merge-steer stays inert");
    return;
  }
  const config = normalizeConfig(mergeSteerConfigOf(rawConfig));
  const workingDirectory = workingDirectoryOf(ctx);
  const core = createMergeSteerCore({
    agents,
    createRunner: (cwd) => createGitRunner({ subprocess, cwd }),
    ...workingDirectory === void 0 ? {} : { workingDirectory },
    ...ctx.logger === void 0 ? {} : { logger: ctx.logger },
    config,
    ...ctx.on === void 0 ? {} : { on: (event, handler, options) => ctx.on?.(event, handler, options) }
  });
  const start = () => {
    core.start();
    ctx.logger?.info?.(`repo-harness: merge-steer active; poll=${String(config.pollMs)}ms`);
  };
  const stop = () => {
    core.dispose();
  };
  if (ctx.effect !== void 0) {
    ctx.effect(() => {
      start();
      return stop;
    }, "repo-harness:merge-steer");
    return;
  }
  ctx.logger?.warn?.("repo-harness: ctx.effect is unavailable; merge-steer has no disposal hook");
  start();
}
export {
  Config,
  apply,
  inject,
  name
};
