// src/index.ts
import { realpath as realpath2 } from "node:fs/promises";

// src/host/git.ts
import { readFile } from "node:fs/promises";
var DEFAULT_TIMEOUT_MS = 2e4;
var DEFAULT_MAX_BYTES = 4 * 1024 * 1024;
var SPILL_FACTOR = 16;
var READ_ONLY_ENV = {
  GIT_TERMINAL_PROMPT: "0",
  GIT_PAGER: "cat",
  GIT_EXTERNAL_DIFF: ""
};
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
  if (!read.lossy || read.spillPath === void 0) return { text: read.text, lossy: read.lossy };
  try {
    return { text: await readFile(read.spillPath, "utf8"), lossy: false };
  } catch {
    return { text: read.text, lossy: true };
  }
}
function createGitRunner(options) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const spillMaxBytes = maxBytes * SPILL_FACTOR;
  return {
    async run(args, runOptions = {}) {
      assertArgv(args);
      const argv = ["git", ...args];
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const callerSignal = runOptions.signal;
      const signal = callerSignal === void 0 ? controller.signal : AbortSignal.any([controller.signal, callerSignal]);
      try {
        const handle = options.subprocess.spawn({
          argv,
          cwd: runOptions.cwd ?? options.cwd,
          env: READ_ONLY_ENV,
          stdio: {
            stdin: runOptions.stdinData === void 0 ? "ignore" : { data: runOptions.stdinData },
            stdout: { collect: { maxBytes, spill: { maxBytes: spillMaxBytes } } },
            stderr: { collect: { maxBytes, spill: { maxBytes: spillMaxBytes } } }
          },
          graceMs: 200,
          signal
        });
        let outcome;
        try {
          outcome = await handle.done;
        } catch (error) {
          if (controller.signal.aborted || callerSignal?.aborted === true) {
            return {
              argv,
              exitCode: null,
              stdout: "",
              stderr: "",
              timedOut: controller.signal.aborted,
              cancelled: callerSignal?.aborted === true && !controller.signal.aborted,
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
          argv,
          exitCode: outcome.exitCode,
          stdout: stdout.text,
          stderr: stderr.text,
          timedOut: controller.signal.aborted,
          cancelled: callerSignal?.aborted === true && !controller.signal.aborted,
          stdoutLossy: stdout.lossy
        };
      } finally {
        clearTimeout(timer);
      }
    }
  };
}

// src/host/diff.ts
import { readFile as readFile2, realpath, stat } from "node:fs/promises";
import { join, sep } from "node:path";

// src/host/contract.ts
var READ_ONLY_SUBCOMMANDS = /* @__PURE__ */ new Set([
  "rev-parse",
  "symbolic-ref",
  "merge-base",
  "status",
  "diff",
  "cat-file",
  "ls-tree"
]);
var FORBIDDEN_FLAGS = ["--output", "--ext-diff", "--textconv", "--no-index", "--stdin"];
function fail(code, message) {
  return { ok: false, error: { code, message } };
}
function readOnlyViolation(args) {
  const subcommand = args[0];
  if (subcommand === void 0) return "empty command";
  if (!READ_ONLY_SUBCOMMANDS.has(subcommand)) return `subcommand ${subcommand} is not read-only here`;
  for (const arg of args) {
    for (const flag of FORBIDDEN_FLAGS) {
      if (arg === flag || arg.startsWith(`${flag}=`)) return `flag ${flag} is not allowed`;
    }
  }
  return null;
}
async function runReadOnly(runner, args, options = {}) {
  const violation = readOnlyViolation(args);
  if (violation !== null) return { refused: violation };
  return runner.run(args, options);
}
function isRefused(result) {
  return "refused" in result;
}
async function repoRoot(runner, cwd, signal) {
  const result = await runReadOnly(runner, ["rev-parse", "--show-toplevel"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const root = result.stdout.trim();
  return root === "" ? null : root;
}
async function refExists(runner, cwd, ref, signal) {
  const result = await runReadOnly(runner, ["rev-parse", "--quiet", "--verify", `${ref}^{commit}`], { cwd, signal });
  if (isRefused(result)) return false;
  return result.exitCode === 0 && result.stdout.trim() !== "";
}
async function mergeBaseWithHead(runner, cwd, ref, signal) {
  const result = await runReadOnly(runner, ["merge-base", ref, "HEAD"], { cwd, signal });
  if (isRefused(result)) return ref;
  const base = result.stdout.trim();
  return result.exitCode === 0 && base !== "" ? base : ref;
}
async function remoteDefaultRef(runner, cwd, signal) {
  const result = await runReadOnly(runner, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const ref = result.stdout.trim();
  return ref === "" ? null : ref;
}
async function resolveScope(runner, cwd, scope, signal) {
  if (scope.kind === "worktree") {
    if (!await refExists(runner, cwd, "HEAD", signal)) {
      return fail("no-base", "this repository has no commit to compare against");
    }
    return { ok: true, resolved: { kind: "worktree", baseRef: "HEAD" } };
  }
  const kind = scope.kind;
  if (kind !== "branch") return fail("bad-request", `unknown scope ${kind}`);
  const explicit = scope.baseRef;
  if (explicit !== void 0) {
    if (!await refExists(runner, cwd, explicit, signal)) {
      return fail("no-base", `base ref ${explicit} does not name a commit`);
    }
    return { ok: true, resolved: { kind: "branch", baseRef: await mergeBaseWithHead(runner, cwd, explicit, signal) } };
  }
  const candidates = [await remoteDefaultRef(runner, cwd, signal), "main", "master"];
  for (const candidate of candidates) {
    if (candidate === null) continue;
    if (!await refExists(runner, cwd, candidate, signal)) continue;
    return { ok: true, resolved: { kind: "branch", baseRef: await mergeBaseWithHead(runner, cwd, candidate, signal) } };
  }
  return fail("no-base", "no remote default branch, main or master to compare against");
}

// src/host/snapshot.ts
import { basename } from "node:path";
function takeFields(text, count) {
  const fields = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const separator = text.indexOf(" ", cursor);
    if (separator < 0) return null;
    fields.push(text.slice(cursor, separator));
    cursor = separator + 1;
  }
  return { fields, rest: text.slice(cursor) };
}
function parseStatusZ(text) {
  const records = text.split("\0");
  const parsed = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record === void 0 || record === "") continue;
    if (record.startsWith("# ")) continue;
    const kind = record[0];
    if (kind === "?") {
      const path = record.slice(2);
      if (path === "") continue;
      parsed.push({ path, index: "?", worktree: "?", untracked: true, unmerged: false });
      continue;
    }
    if (kind === "!") continue;
    if (kind === "1" || kind === "2") {
      const fields = takeFields(record.slice(2), kind === "1" ? 7 : 8);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      if (xy.length < 2) continue;
      let oldPath;
      if (kind === "2") {
        const next = records[index + 1];
        if (next === void 0 || next === "") continue;
        oldPath = next;
        index += 1;
      }
      parsed.push({
        path: fields.rest,
        index: xy[0] ?? ".",
        worktree: xy[1] ?? ".",
        untracked: false,
        unmerged: false,
        ...oldPath === void 0 ? {} : { oldPath }
      });
      continue;
    }
    if (kind === "u") {
      const fields = takeFields(record.slice(2), 9);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      parsed.push({
        path: fields.rest,
        index: xy[0] ?? "U",
        worktree: xy[1] ?? "U",
        untracked: false,
        unmerged: true
      });
    }
  }
  return parsed;
}
function parseNumStatZ(text) {
  const parts = text.split("\0");
  const stats = [];
  for (let index = 0; index < parts.length; index += 1) {
    const record = parts[index];
    if (record === void 0 || record === "") continue;
    const firstTab = record.indexOf("	");
    const secondTab = record.indexOf("	", firstTab + 1);
    if (firstTab < 0 || secondTab < 0) continue;
    const addRaw = record.slice(0, firstTab);
    const delRaw = record.slice(firstTab + 1, secondTab);
    const path = record.slice(secondTab + 1);
    const additions = addRaw === "-" ? null : Number.parseInt(addRaw, 10);
    const deletions = delRaw === "-" ? null : Number.parseInt(delRaw, 10);
    if (additions !== null && !Number.isFinite(additions)) continue;
    if (deletions !== null && !Number.isFinite(deletions)) continue;
    if (path === "") {
      const newPath = parts[index + 2];
      if (newPath === void 0 || newPath === "") continue;
      index += 2;
      stats.push({ path: newPath, additions, deletions });
      continue;
    }
    stats.push({ path, additions, deletions });
  }
  return stats;
}
function parseNameStatusZ(text) {
  const parts = text.split("\0");
  const records = [];
  for (let index = 0; index < parts.length; index += 1) {
    const code = parts[index];
    if (code === void 0 || code === "") continue;
    const letter = code.slice(0, 1);
    if (letter === "R" || letter === "C") {
      const oldPath = parts[index + 1];
      const newPath = parts[index + 2];
      if (oldPath === void 0 || newPath === void 0 || newPath === "") continue;
      index += 2;
      records.push({ path: newPath, oldPath, code: letter });
      continue;
    }
    const path = parts[index + 1];
    if (path === void 0 || path === "") continue;
    index += 1;
    records.push({ path, code: letter });
  }
  return records;
}
function statusFromLetter(letter) {
  switch (letter) {
    case "A":
      return "added";
    case "M":
      return "modified";
    case "D":
      return "deleted";
    case "R":
      return "renamed";
    case "C":
      return "copied";
    case "T":
      return "type-changed";
    case "U":
      return "conflicted";
    default:
      return "unknown";
  }
}
function statusOfRecord(record) {
  if (record.untracked) return "untracked";
  if (record.unmerged) return "conflicted";
  const { index, worktree } = record;
  const both = [index, worktree];
  if (both.includes("U")) return "conflicted";
  if (both.includes("R")) return "renamed";
  if (both.includes("C")) return "copied";
  if (both.includes("D")) return "deleted";
  if (both.includes("A")) return "added";
  if (both.includes("T")) return "type-changed";
  if (both.includes("M")) return "modified";
  return "unknown";
}
async function collectFiles(runner, cwd, resolved, signal) {
  const options = { cwd, signal };
  if (resolved.kind === "worktree") {
    const [status, numstat2] = await Promise.all([
      runReadOnly(runner, ["status", "--porcelain=v2", "-z"], options),
      runReadOnly(runner, ["diff", "HEAD", "-M", "--numstat", "-z", "--no-ext-diff", "--no-textconv"], options)
    ]);
    if (isRefused(status) || isRefused(numstat2)) return fail("bad-request", "a read-only command was refused");
    if (status.exitCode !== 0) return fail("not-a-repo", status.stderr.trim() || "git status failed");
    if (numstat2.exitCode !== 0) return fail("not-a-repo", numstat2.stderr.trim() || "git diff failed");
    if (status.stdoutLossy || numstat2.stdoutLossy) return fail("too-large", "the change list exceeded the read budget");
    return { ok: true, files: mergeRecords(parseStatusZ(status.stdout), parseNumStatZ(numstat2.stdout)) };
  }
  const [nameStatus, numstat] = await Promise.all([
    runReadOnly(runner, ["diff", "--name-status", "-M", "-z", "--no-ext-diff", "--no-textconv", resolved.baseRef, "HEAD"], options),
    runReadOnly(runner, ["diff", "-M", "--numstat", "-z", "--no-ext-diff", "--no-textconv", resolved.baseRef, "HEAD"], options)
  ]);
  if (isRefused(nameStatus) || isRefused(numstat)) return fail("bad-request", "a read-only command was refused");
  if (nameStatus.exitCode !== 0) return fail("no-base", nameStatus.stderr.trim() || "git diff failed");
  if (numstat.exitCode !== 0) return fail("no-base", numstat.stderr.trim() || "git diff failed");
  if (nameStatus.stdoutLossy || numstat.stdoutLossy) return fail("too-large", "the change list exceeded the read budget");
  return { ok: true, files: mergeRecords(parseNameStatusZ(nameStatus.stdout), parseNumStatZ(numstat.stdout)) };
}
function mergeRecords(records, stats) {
  const counts = new Map(stats.map((stat2) => [stat2.path, stat2]));
  const files = records.map((record) => {
    const status = "code" in record ? statusFromLetter(record.code) : statusOfRecord(record);
    const stat2 = counts.get(record.path);
    const untracked = status === "untracked";
    const binary = stat2 !== void 0 && stat2.additions === null && stat2.deletions === null;
    return {
      path: record.path,
      ...record.oldPath === void 0 ? {} : { oldPath: record.oldPath },
      status,
      additions: untracked || binary ? null : stat2?.additions ?? null,
      deletions: untracked || binary ? null : stat2?.deletions ?? null,
      binary,
      untracked
    };
  });
  return files.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}
async function readHead(runner, cwd, signal) {
  const options = { cwd, signal };
  const [short, branch] = await Promise.all([
    runReadOnly(runner, ["rev-parse", "--short", "HEAD"], options),
    runReadOnly(runner, ["symbolic-ref", "--short", "HEAD"], options)
  ]);
  if (isRefused(short) || isRefused(branch)) return fail("bad-request", "a read-only command was refused");
  const shortHash = short.stdout.trim();
  if (short.exitCode !== 0 || shortHash === "") return fail("no-base", "HEAD does not name a commit");
  const ref = branch.exitCode === 0 ? branch.stdout.trim() : "";
  return {
    ok: true,
    head: ref === "" ? { kind: "detached", ref: "HEAD", shortHash } : { kind: "branch", ref, shortHash }
  };
}
async function countUncommitted(runner, cwd, signal) {
  const result = await runReadOnly(runner, ["status", "--porcelain=v2", "-z"], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return parseStatusZ(result.stdout).length;
}
async function collectSnapshot(options, scope, signal) {
  const root = await repoRoot(options.runner, options.cwd, signal);
  if (root === null) return fail("not-a-repo", `${options.cwd} is not inside a git worktree`);
  const resolved = await resolveScope(options.runner, root, scope, signal);
  if (!resolved.ok) return resolved;
  const [files, head, uncommitted] = await Promise.all([
    collectFiles(options.runner, root, resolved.resolved, signal),
    readHead(options.runner, root, signal),
    countUncommitted(options.runner, root, signal)
  ]);
  if (!files.ok) return files;
  if (!head.ok) return head;
  const additions = files.files.reduce((sum, file) => sum + (file.additions ?? 0), 0);
  const deletions = files.files.reduce((sum, file) => sum + (file.deletions ?? 0), 0);
  return {
    ok: true,
    snapshot: {
      repo: basename(root),
      head: head.head,
      scope: resolved.resolved.kind,
      // A worktree review's old side is HEAD, which the client already knows;
      // sending it as a baseline would suggest it is a branch to compare to.
      baseRef: resolved.resolved.kind === "branch" ? resolved.resolved.baseRef : null,
      uncommitted: uncommitted ?? 0,
      files: files.files,
      summary: { files: files.files.length, additions, deletions }
    }
  };
}

// src/host/diff.ts
var MAX_DIFF_BYTES = 1024 * 1024;
var MAX_DIFF_LINES = 5e3;
var CONTEXT_LINES = 3;
function parseHunkHeader(line) {
  const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@ ?(.*)$/u.exec(line);
  if (match === null) return null;
  const heading = match[5] ?? "";
  return {
    oldStart: Number.parseInt(match[1] ?? "0", 10),
    oldLines: Number.parseInt(match[2] ?? "1", 10),
    newStart: Number.parseInt(match[3] ?? "0", 10),
    newLines: Number.parseInt(match[4] ?? "1", 10),
    ...heading === "" ? {} : { heading }
  };
}
function parseHunks(text) {
  const hunks = [];
  let current = null;
  const flush = () => {
    if (current === null) return;
    hunks.push({
      oldStart: current.header.oldStart,
      oldLines: current.header.oldLines,
      newStart: current.header.newStart,
      newLines: current.header.newLines,
      ...current.header.heading === void 0 ? {} : { heading: current.header.heading },
      lines: current.lines
    });
    current = null;
  };
  for (const raw of splitLines(text)) {
    if (raw.startsWith("@@")) {
      flush();
      const header = parseHunkHeader(raw);
      if (header === null) continue;
      current = { header, lines: [], oldLine: header.oldStart, newLine: header.newStart };
      continue;
    }
    if (current === null) continue;
    if (raw.startsWith("\\")) continue;
    const marker = raw.slice(0, 1);
    const body = raw.slice(1);
    if (marker === "+") {
      current.lines.push({ kind: "add", oldLine: null, newLine: current.newLine, text: body });
      current.newLine += 1;
      continue;
    }
    if (marker === "-") {
      current.lines.push({ kind: "del", oldLine: current.oldLine, newLine: null, text: body });
      current.oldLine += 1;
      continue;
    }
    current.lines.push({ kind: "context", oldLine: current.oldLine, newLine: current.newLine, text: body });
    current.oldLine += 1;
    current.newLine += 1;
  }
  flush();
  return hunks;
}
function splitLines(text) {
  if (text === "") return [];
  const trimmed = text.endsWith("\n") ? text.slice(0, -1) : text;
  return trimmed.split("\n");
}
async function readFromRevision(runner, cwd, rev, path, signal) {
  const result = await runReadOnly(runner, ["cat-file", "-p", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return result.stdout;
}
async function resolveInsideRepo(root, path) {
  try {
    const [realRoot, realTarget] = await Promise.all([realpath(root), realpath(join(root, path))]);
    if (realTarget === realRoot) return null;
    const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep;
    return realTarget.startsWith(prefix) ? realTarget : null;
  } catch {
    return null;
  }
}
async function readFromWorktree(root, path) {
  const target = await resolveInsideRepo(root, path);
  if (target === null) return null;
  try {
    return await readFile2(target, "utf8");
  } catch {
    return null;
  }
}
async function sizeOnDisk(root, path) {
  const target = await resolveInsideRepo(root, path);
  if (target === null) return null;
  try {
    const info = await stat(target);
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
}
function overBudget(bytes) {
  return bytes !== null && bytes > MAX_DIFF_BYTES;
}
async function collectFileDiff(options, request, signal) {
  if (request.path === "" || request.path.includes("\0")) {
    return fail("bad-request", "a file path is required");
  }
  const root = await repoRoot(options.runner, options.cwd, signal);
  if (root === null) return fail("not-a-repo", `${options.cwd} is not inside a git worktree`);
  const resolved = await resolveScope(options.runner, root, request.scope, signal);
  if (!resolved.ok) return resolved;
  const files = await collectFiles(options.runner, root, resolved.resolved, signal);
  if (!files.ok) return files;
  const file = files.files.find((candidate) => candidate.path === request.path);
  if (file === void 0) return fail("bad-request", `${request.path} is not changed in this comparison`);
  if (file.status === "conflicted") return fail("conflicted", `${request.path} is in conflict`);
  if (file.binary) {
    const bytes = await sizeOnDisk(root, file.path);
    if (overBudget(bytes)) return fail("too-large", `${file.path} is ${bytes ?? 0} bytes`);
    return { ok: true, diff: { kind: "binary", path: file.path, bytes } };
  }
  if (file.status === "untracked") {
    const text = await readFromWorktree(root, file.path);
    if (text === null) return fail("unreadable", `${file.path} could not be read from the working tree`);
    const lines = splitLines(text);
    if (lines.length > MAX_DIFF_LINES) return fail("too-large", `${file.path} has ${lines.length} lines`);
    return { ok: true, diff: { kind: "untracked", path: file.path, lines } };
  }
  if (file.status === "deleted") {
    const text = await readFromRevision(options.runner, root, resolved.resolved.baseRef, file.path, signal);
    if (text === null) return fail("unreadable", `${file.path} could not be read from ${resolved.resolved.baseRef}`);
    const lines = splitLines(text);
    if (lines.length > MAX_DIFF_LINES) return fail("too-large", `${file.path} has ${lines.length} lines`);
    return { ok: true, diff: { kind: "deleted", path: file.path, lines } };
  }
  return collectTextDiff(options.runner, root, resolved.resolved, file.path, file.oldPath, signal);
}
async function collectTextDiff(runner, root, resolved, path, oldPath, signal) {
  const paths = oldPath === void 0 ? ["--", path] : ["--", oldPath, path];
  const args = resolved.kind === "worktree" ? ["diff", "HEAD", "-M", `-U${CONTEXT_LINES}`, "--no-ext-diff", "--no-textconv", ...paths] : ["diff", "-M", `-U${CONTEXT_LINES}`, "--no-ext-diff", "--no-textconv", resolved.baseRef, "HEAD", ...paths];
  const result = await runReadOnly(runner, args, { cwd: root, signal });
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("unreadable", result.stderr.trim() || "git diff failed");
  if (result.stdoutLossy) return fail("too-large", `${path} exceeded the read budget`);
  const text = result.stdout;
  const hunks = parseHunks(text);
  const lineCount = hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
  const truncated = Buffer.byteLength(text, "utf8") > MAX_DIFF_BYTES || lineCount > MAX_DIFF_LINES;
  return { ok: true, diff: { kind: "text", path, hunks: truncated ? clampHunks(hunks) : hunks, truncated } };
}
function clampHunks(hunks) {
  const kept = [];
  let lines = 0;
  for (const hunk of hunks) {
    const room = MAX_DIFF_LINES - lines;
    if (room <= 0) break;
    if (hunk.lines.length <= room) {
      kept.push(hunk);
      lines += hunk.lines.length;
      continue;
    }
    kept.push({ ...hunk, lines: hunk.lines.slice(0, room) });
    lines += room;
    break;
  }
  return kept;
}

// src/host/routes.ts
import { posix } from "node:path";

// src/shared.ts
var PACKAGE_NAME = "dsh-review-map";
var ROUTE_PREFIX = "/review-map/api";

// src/host/routes.ts
function safeRelativePath(raw) {
  if (raw === "" || raw.includes("\0")) return void 0;
  const normalized = posix.normalize(raw.split("\\").join("/"));
  if (normalized === "" || normalized === ".") return void 0;
  if (normalized.startsWith("/") || normalized.startsWith("../") || normalized === "..") return void 0;
  return normalized;
}
function fail2(code, message, status = 400) {
  return { status, body: { ok: false, error: { code, message } } };
}
function scopeOf(url) {
  const raw = url.searchParams.get("scope");
  if (raw === null || raw === "") return { kind: "worktree" };
  if (raw === "worktree") return { kind: "worktree" };
  if (raw !== "branch") return void 0;
  const base = url.searchParams.get("base");
  return base === null || base === "" ? { kind: "branch" } : { kind: "branch", baseRef: base };
}
function sessionIdOf(url) {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? void 0 : raw;
}
function suffixOf(pathname) {
  if (pathname !== ROUTE_PREFIX && !pathname.startsWith(`${ROUTE_PREFIX}/`)) return void 0;
  return pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
}
async function handleReviewRequest(deps, request) {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, "http://review-map.local");
  const suffix = suffixOf(url.pathname);
  if (suffix === void 0) return fail2("bad-request", `no review-map route for ${url.pathname}`, 404);
  if (method !== "GET") return fail2("bad-request", `method ${method} is not allowed on ${suffix}`, 405);
  if (suffix !== "state" && suffix !== "diff") return fail2("bad-request", `no review-map route for ${suffix}`, 404);
  const sessionId = sessionIdOf(url);
  if (sessionId === void 0) return fail2("bad-request", "sessionId query parameter is required");
  const scope = scopeOf(url);
  if (scope === void 0) return fail2("bad-request", "scope must be worktree or branch");
  let path;
  if (suffix === "diff") {
    const raw = url.searchParams.get("path");
    if (raw === null || raw === "") return fail2("bad-request", "path query parameter is required");
    path = safeRelativePath(raw);
    if (path === void 0) return fail2("bad-request", "path escapes the workspace");
  }
  try {
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === void 0) return fail2("no-session", `session ${sessionId} has no workspace`, 404);
    if (path === void 0) {
      const result2 = await deps.loadSnapshot(workspace, scope);
      return { status: 200, body: result2 };
    }
    const result = await deps.loadDiff(workspace, scope, path);
    return { status: 200, body: result };
  } catch {
    return fail2("unreadable", "the review read failed", 500);
  }
}
function registerReviewRoutes(webServer, deps) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      const response = await handleReviewRequest(deps, {
        method: req.method ?? "GET",
        url: req.url ?? "/"
      });
      sendJson(res, response.status, response.body);
    }
  });
}
function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store"
  });
  res.end(text);
}

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["subprocess", "sessions", "sessionPersistence"];
var WEB_SERVER_POLL_MS = 250;
var WEB_SERVER_WAIT_MS = 15e3;
function readService(ctx, serviceName) {
  const value = ctx.get?.(serviceName);
  return value === null ? void 0 : value;
}
async function canonicalPath(dir) {
  try {
    return await realpath2(dir);
  } catch {
    return dir;
  }
}
async function resolveSessionRoot(sessionId, sessions, persistence) {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
  }
  return void 0;
}
function whenWebServer(host, register) {
  const found = () => readService(host, "webServer");
  const present = found();
  if (present !== void 0) {
    register(present);
    return;
  }
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = found();
    if (webServer === void 0) {
      if (Date.now() - startedAt > WEB_SERVER_WAIT_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    register(webServer);
  }, WEB_SERVER_POLL_MS);
}
function apply(ctx) {
  const host = ctx;
  const sessions = readService(host, "sessions");
  const sessionPersistence = readService(host, "sessionPersistence");
  const subprocess = readService(host, "subprocess");
  const runner = createGitRunner({
    subprocess: subprocess ?? {
      spawn: () => ({ done: Promise.reject(new Error("no subprocess service")), collected: {} })
    },
    cwd: process.cwd()
  });
  const deps = {
    resolveWorkspaceRoot: (sessionId) => resolveSessionRoot(sessionId, sessions, sessionPersistence),
    loadSnapshot: (workspace, scope, signal) => collectSnapshot({ runner, cwd: workspace }, scope, signal),
    loadDiff: (workspace, scope, path, signal) => collectFileDiff({ runner, cwd: workspace }, { scope, path }, signal)
  };
  whenWebServer(host, (webServer) => {
    const unregister = registerReviewRoutes(webServer, deps);
    host.effect?.(() => () => {
      unregister();
    });
  });
}
var index_default = { name, inject, apply };
export {
  PACKAGE_NAME,
  apply,
  index_default as default,
  inject,
  name,
  resolveSessionRoot
};
