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
  "ls-tree",
  // The structure index lists the working tree with `ls-files`, which reads the
  // index and the untracked set and writes neither.
  "ls-files"
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
  const counts = new Map(stats.map((stat3) => [stat3.path, stat3]));
  const files = records.map((record) => {
    const status = "code" in record ? statusFromLetter(record.code) : statusOfRecord(record);
    const stat3 = counts.get(record.path);
    const untracked = status === "untracked";
    const binary = stat3 !== void 0 && stat3.additions === null && stat3.deletions === null;
    return {
      path: record.path,
      ...record.oldPath === void 0 ? {} : { oldPath: record.oldPath },
      status,
      additions: untracked || binary ? null : stat3?.additions ?? null,
      deletions: untracked || binary ? null : stat3?.deletions ?? null,
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
  if (suffix !== "state" && suffix !== "diff" && suffix !== "index") {
    return fail2("bad-request", `no review-map route for ${suffix}`, 404);
  }
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
    if (suffix === "index") {
      const result2 = await deps.loadIndex(workspace, scope);
      return { status: 200, body: result2 };
    }
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

// src/host/structure.ts
import { createReadStream } from "node:fs";
import { readFile as readFile3, stat as stat2 } from "node:fs/promises";
import { join as join2, posix as posix3 } from "node:path";

// src/host/imports.ts
import { posix as posix2 } from "node:path";
import ts from "typescript";
var SCRIPT_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
function isScriptPath(path) {
  return SCRIPT_EXTENSIONS.some((extension) => path.endsWith(extension));
}
function skipTemplate(scanner) {
  for (; ; ) {
    let token = scanner.scan();
    while (token !== ts.SyntaxKind.CloseBraceToken && token !== ts.SyntaxKind.EndOfFileToken) {
      token = scanner.scan();
    }
    if (token === ts.SyntaxKind.EndOfFileToken) return;
    const resumed = scanner.reScanTemplateToken(false);
    if (resumed === ts.SyntaxKind.LastTemplateToken || resumed === ts.SyntaxKind.EndOfFileToken) return;
  }
}
function countDynamicCalls(text) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, text);
  let count = 0;
  let twoBack = ts.SyntaxKind.Unknown;
  let previous = ts.SyntaxKind.Unknown;
  let token = scanner.scan();
  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (token === ts.SyntaxKind.OpenParenToken) {
      const importCall = previous === ts.SyntaxKind.ImportKeyword;
      const requireCall = previous === ts.SyntaxKind.RequireKeyword && twoBack !== ts.SyntaxKind.DotToken;
      if (importCall || requireCall) {
        const argument = scanner.scan();
        if (argument === ts.SyntaxKind.TemplateHead) {
          count += 1;
          skipTemplate(scanner);
        } else if (argument !== ts.SyntaxKind.StringLiteral && argument !== ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
          count += 1;
        }
        twoBack = token;
        previous = argument;
        token = scanner.scan();
        continue;
      }
    }
    twoBack = previous;
    previous = token;
    token = scanner.scan();
  }
  return count;
}
function extractImports(text) {
  const pre = ts.preProcessFile(text, true, true);
  return {
    specifiers: pre.importedFiles.map((reference) => reference.fileName),
    dynamic: countDynamicCalls(text)
  };
}
function parseTsconfig(configText, fileName) {
  const parsed = ts.parseConfigFileTextToJson(fileName, configText);
  const config = parsed.config;
  const options = config?.compilerOptions;
  const rawPaths = options?.paths;
  const aliases = [];
  if (rawPaths !== null && typeof rawPaths === "object") {
    for (const [pattern, value] of Object.entries(rawPaths)) {
      if (!Array.isArray(value)) continue;
      const targets = value.filter((entry) => typeof entry === "string");
      if (targets.length > 0) aliases.push({ pattern, targets });
    }
  }
  const baseUrl = typeof options?.baseUrl === "string" ? options.baseUrl : "";
  const rawExtends = config?.extends;
  return {
    paths: aliases.length === 0 ? null : { baseUrl, aliases },
    extendsPath: typeof rawExtends === "string" ? rawExtends : null
  };
}
function probe(base, files) {
  if (base === "" || base.startsWith("..")) return null;
  if (files.has(base)) return base;
  for (const extension of SCRIPT_EXTENSIONS) {
    const candidate = `${base}${extension}`;
    if (files.has(candidate)) return candidate;
  }
  for (const [from, to] of [
    [".js", ".ts"],
    [".js", ".tsx"],
    [".jsx", ".tsx"],
    [".mjs", ".mts"],
    [".cjs", ".cts"]
  ]) {
    if (base.endsWith(from)) {
      const swapped = `${base.slice(0, -from.length)}${to}`;
      if (files.has(swapped)) return swapped;
    }
  }
  for (const extension of SCRIPT_EXTENSIONS) {
    const candidate = `${base}/index${extension}`;
    if (files.has(candidate)) return candidate;
  }
  return null;
}
function matchAlias(alias, specifier) {
  const star = alias.pattern.indexOf("*");
  if (star < 0) return alias.pattern === specifier ? "" : null;
  const head = alias.pattern.slice(0, star);
  const tail = alias.pattern.slice(star + 1);
  if (specifier.length < head.length + tail.length) return null;
  if (!specifier.startsWith(head) || !specifier.endsWith(tail)) return null;
  return specifier.slice(head.length, specifier.length - tail.length);
}
function createResolver(files, paths) {
  return (from, specifier) => {
    if (specifier === "" || specifier.includes("\0")) return null;
    if (specifier.startsWith(".")) {
      const joined = posix2.normalize(posix2.join(posix2.dirname(from), specifier));
      return probe(joined, files);
    }
    if (paths === null) return null;
    for (const alias of paths.aliases) {
      const captured = matchAlias(alias, specifier);
      if (captured === null) continue;
      for (const target of alias.targets) {
        const substituted = target.includes("*") ? target.replace("*", captured) : target;
        const joined = posix2.normalize(posix2.join(paths.baseUrl, substituted));
        const resolved = probe(joined, files);
        if (resolved !== null) return resolved;
      }
    }
    return null;
  };
}
function diffEdges(newEdges, oldEdges, changedPaths) {
  const edges = [];
  let newImports = 0;
  let droppedImports = 0;
  const touched = (from, to) => changedPaths.has(from) || changedPaths.has(to);
  for (const [from, targets] of newEdges) {
    const before = oldEdges.get(from);
    for (const to of targets) {
      if (before?.has(to) === true) {
        edges.push({ from, to, state: "kept" });
        continue;
      }
      edges.push({ from, to, state: "added" });
      if (touched(from, to)) newImports += 1;
    }
  }
  for (const [from, targets] of oldEdges) {
    const after = newEdges.get(from);
    for (const to of targets) {
      if (after?.has(to) === true) continue;
      edges.push({ from, to, state: "removed" });
      if (touched(from, to)) droppedImports += 1;
    }
  }
  edges.sort((left, right) => {
    if (left.from !== right.from) return left.from < right.from ? -1 : 1;
    if (left.to !== right.to) return left.to < right.to ? -1 : 1;
    return 0;
  });
  return { edges, newImports, droppedImports };
}

// src/host/structure.ts
var DEFAULT_INDEX_LIMITS = {
  timeBudgetMs: 4e3,
  maxFiles: 8e3,
  // Deliberately well under the runner's 4 MiB collect budget. That budget
  // covers the whole `cat-file --batch` output, which is every blob body plus a
  // `<sha> blob <size>` header per record, so packing chunks to 4 MiB of bodies
  // guaranteed an overflow on every chunk and a fallback to one subprocess per
  // file — 1200 spawns, which is what spent the deadline on a real repository.
  maxChunkBytes: 2 * 1024 * 1024
};
var BINARY_SNIFF_BYTES = 8e3;
var STREAM_THRESHOLD_BYTES = 1024 * 1024;
function countNewlines(buffer) {
  let count = 0;
  for (const byte of buffer) {
    if (byte === 10) count += 1;
  }
  return count;
}
function looksBinary(buffer) {
  return buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0);
}
async function scanLargeFile(path) {
  let lines = 0;
  let binary = false;
  let seen = 0;
  for await (const chunk of createReadStream(path)) {
    const buffer = chunk;
    if (seen < BINARY_SNIFF_BYTES) {
      if (buffer.subarray(0, BINARY_SNIFF_BYTES - seen).includes(0)) binary = true;
    }
    seen += buffer.length;
    lines += countNewlines(buffer);
  }
  return { lines, binary };
}
async function readWorktreeFile(root, path) {
  const absolute = join2(root, path);
  let size;
  try {
    size = (await stat2(absolute)).size;
  } catch {
    return null;
  }
  const script = isScriptPath(path);
  if (size > STREAM_THRESHOLD_BYTES && !script) {
    const scanned = await scanLargeFile(absolute);
    return { lines: scanned.binary ? null : scanned.lines, binary: scanned.binary };
  }
  let buffer;
  try {
    buffer = await readFile3(absolute);
  } catch {
    return null;
  }
  const binary = looksBinary(buffer);
  if (binary) return { lines: null, binary: true };
  const lines = countNewlines(buffer);
  return script ? { lines, binary, imports: extractImports(buffer.toString("utf8")) } : { lines, binary };
}
function sliceByBytes(text, start, bytes) {
  let index = start;
  let consumed = 0;
  while (index < text.length && consumed < bytes) {
    const code = text.charCodeAt(index);
    if (code < 128) consumed += 1;
    else if (code < 2048) consumed += 2;
    else if (code >= 55296 && code <= 56319) {
      consumed += 4;
      index += 1;
    } else consumed += 3;
    index += 1;
  }
  return { value: text.slice(start, index), next: index };
}
var BATCH_HEADER = /\n[0-9a-f]{40} (?:blob \d+|missing|ambiguous)\n/gu;
function nextHeaderStart(text, from) {
  BATCH_HEADER.lastIndex = from;
  const found = BATCH_HEADER.exec(text);
  return found === null ? -1 : found.index + 1;
}
async function readBlobs(runner, cwd, rev, paths, signal) {
  const blobs = /* @__PURE__ */ new Map();
  const binary = /* @__PURE__ */ new Set();
  if (paths.length === 0) return { blobs, binary, framed: true };
  const stdinData = `${paths.map((path) => `${rev}:${path}`).join("\n")}
`;
  const result = await runReadOnly(runner, ["cat-file", "--batch"], { cwd, signal, stdinData });
  if (isRefused(result) || result.exitCode !== 0) {
    for (const path of paths) blobs.set(path, null);
    return { blobs, binary, framed: true };
  }
  const text = result.stdout;
  let cursor = 0;
  let framed = true;
  for (const path of paths) {
    const headerEnd = text.indexOf("\n", cursor);
    if (headerEnd < 0) {
      blobs.set(path, null);
      framed = false;
      continue;
    }
    const header = text.slice(cursor, headerEnd);
    cursor = headerEnd + 1;
    if (header.endsWith(" missing") || header.endsWith(" ambiguous")) {
      blobs.set(path, null);
      continue;
    }
    const size = Number.parseInt(header.slice(header.lastIndexOf(" ") + 1), 10);
    if (!Number.isFinite(size) || size < 0) {
      blobs.set(path, null);
      framed = false;
      continue;
    }
    const slice = sliceByBytes(text, cursor, size);
    if (text[slice.next] === "\n") {
      blobs.set(path, slice.value);
      cursor = slice.next + 1;
      continue;
    }
    binary.add(path);
    blobs.set(path, null);
    const next = nextHeaderStart(text, cursor);
    if (next < 0) {
      if (path !== paths[paths.length - 1]) framed = false;
      break;
    }
    cursor = next;
  }
  return { blobs, binary, framed };
}
async function readOneBlob(runner, cwd, rev, path, signal) {
  const result = await runReadOnly(runner, ["cat-file", "blob", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return result.stdout;
}
async function readBlobChunks(runner, cwd, rev, entries, limits, signal) {
  const blobs = /* @__PURE__ */ new Map();
  const binary = /* @__PURE__ */ new Set();
  let chunk = [];
  let chunkBytes = 0;
  let lossy = false;
  const flush = async () => {
    if (chunk.length === 0) return;
    const read = await readBlobs(runner, cwd, rev, chunk.map((entry) => entry.path), signal);
    for (const [path, text] of read.blobs) blobs.set(path, text);
    for (const path of read.binary) binary.add(path);
    if (!read.framed) {
      for (const entry of chunk) {
        if (read.binary.has(entry.path)) continue;
        blobs.set(entry.path, await readOneBlob(runner, cwd, rev, entry.path, signal));
      }
    }
    chunk = [];
    chunkBytes = 0;
  };
  for (const entry of entries) {
    if (chunk.length > 0 && chunkBytes + entry.size > limits.maxChunkBytes) await flush();
    chunk.push(entry);
    chunkBytes += entry.size;
    if (chunkBytes >= limits.maxChunkBytes) await flush();
  }
  await flush();
  return { blobs, binary, lossy };
}
function parseHunkRange(line) {
  const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/u.exec(line);
  if (match === null) return null;
  const oldStart = Number.parseInt(match[1] ?? "", 10);
  const oldLines = match[2] === void 0 ? 1 : Number.parseInt(match[2], 10);
  const newStart = Number.parseInt(match[3] ?? "", 10);
  const newLines = match[4] === void 0 ? 1 : Number.parseInt(match[4], 10);
  if (![oldStart, oldLines, newStart, newLines].every(Number.isFinite)) return null;
  return { oldStart, oldLines, newStart, newLines };
}
function unquotePath(raw) {
  if (!raw.startsWith('"') || !raw.endsWith('"') || raw.length < 2) return raw;
  const body = raw.slice(1, -1);
  const bytes = [];
  const escapes = { n: 10, t: 9, r: 13, '"': 34, "\\": 92 };
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index] ?? "";
    if (char !== "\\") {
      for (const byte of Buffer.from(char, "utf8")) bytes.push(byte);
      continue;
    }
    const next = body[index + 1] ?? "";
    index += 1;
    if (/[0-7]/u.test(next)) {
      bytes.push(Number.parseInt(body.slice(index, index + 3), 8));
      index += 2;
      continue;
    }
    const value = escapes[next];
    if (value !== void 0) bytes.push(value);
  }
  return Buffer.from(bytes).toString("utf8");
}
function diffSidePath(raw) {
  const path = raw.split("	")[0] ?? "";
  if (path === "/dev/null") return null;
  return unquotePath(path).replace(/^[ab]\//u, "");
}
function parseHunkRanges(text) {
  const ranges = /* @__PURE__ */ new Map();
  let oldPath = null;
  let newPath = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("diff --git ")) {
      oldPath = null;
      newPath = null;
      continue;
    }
    if (line.startsWith("--- ")) {
      oldPath = diffSidePath(line.slice(4));
      continue;
    }
    if (line.startsWith("+++ ")) {
      newPath = diffSidePath(line.slice(4));
      continue;
    }
    if (!line.startsWith("@@ ")) continue;
    const range = parseHunkRange(line);
    if (range === null) continue;
    const key = newPath ?? oldPath;
    if (key === null) continue;
    const list = ranges.get(key);
    if (list === void 0) ranges.set(key, [range]);
    else list.push(range);
  }
  return ranges;
}
async function readHunkRanges(runner, cwd, resolved, signal) {
  const args = ["diff", "-U0", "-M", "--no-ext-diff", "--no-textconv"];
  if (resolved.kind === "branch") args.push(resolved.baseRef, "HEAD");
  else args.push("HEAD");
  const result = await runReadOnly(runner, args, { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return /* @__PURE__ */ new Map();
  return parseHunkRanges(result.stdout);
}
async function listNewSide(runner, cwd, resolved, signal) {
  if (resolved.kind === "worktree") {
    const result2 = await runReadOnly(runner, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd, signal });
    if (isRefused(result2)) return fail("bad-request", "a read-only command was refused");
    if (result2.exitCode !== 0) return fail("not-a-repo", result2.stderr.trim() || "git ls-files failed");
    if (result2.stdoutLossy) return fail("too-large", "the file list exceeded the read budget");
    const entries2 = result2.stdout.split("\0").filter((path) => path !== "").map((path) => ({ path, size: 0 }));
    return { ok: true, entries: entries2 };
  }
  const result = await runReadOnly(runner, ["ls-tree", "-r", "-z", "-l", "HEAD"], { cwd, signal });
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("no-base", result.stderr.trim() || "git ls-tree failed");
  if (result.stdoutLossy) return fail("too-large", "the file list exceeded the read budget");
  const entries = [];
  for (const record of result.stdout.split("\0")) {
    if (record === "") continue;
    const tab = record.indexOf("	");
    if (tab < 0) continue;
    const fields = record.slice(0, tab).split(/\s+/u);
    if (fields[1] !== "blob") continue;
    const size = Number.parseInt(fields[3] ?? "", 10);
    entries.push({ path: record.slice(tab + 1), size: Number.isFinite(size) ? size : 0 });
  }
  return { ok: true, entries };
}
async function loadCompilerPaths(readText) {
  const own = await readText("tsconfig.json");
  if (own === null) return null;
  const parsed = parseTsconfig(own, "tsconfig.json");
  if (parsed.paths !== null) return { baseUrl: normalizeDir(parsed.paths.baseUrl), aliases: parsed.paths.aliases };
  if (parsed.extendsPath === null || !parsed.extendsPath.startsWith(".")) return null;
  const extended = posix3.normalize(parsed.extendsPath);
  for (const candidate of [extended, `${extended}.json`, `${extended}/tsconfig.json`]) {
    const text = await readText(candidate);
    if (text === null) continue;
    const base = parseTsconfig(text, candidate);
    if (base.paths === null) continue;
    return { baseUrl: normalizeDir(posix3.join(posix3.dirname(candidate), base.paths.baseUrl)), aliases: base.paths.aliases };
  }
  return null;
}
function normalizeDir(path) {
  const normalized = posix3.normalize(path === "" ? "." : path);
  return normalized === "." ? "" : normalized.replace(/\/+$/u, "");
}
function aggregateDirs(files, changed) {
  const totals = /* @__PURE__ */ new Map();
  const touch = (path) => {
    const existing = totals.get(path);
    if (existing !== void 0) return existing;
    const fresh = { lines: 0, files: 0, changed: 0, additions: 0, deletions: 0 };
    totals.set(path, fresh);
    return fresh;
  };
  touch("");
  for (const file of files) {
    const entry = changed.get(file.path);
    const own = posix3.dirname(file.path);
    let directory = own === "." ? "" : own;
    for (; ; ) {
      const total = touch(directory);
      total.files += 1;
      total.lines += file.lines ?? 0;
      if (entry !== void 0) {
        total.changed += 1;
        total.additions += entry.additions ?? 0;
        total.deletions += entry.deletions ?? 0;
      }
      if (directory === "") break;
      const parent = posix3.dirname(directory);
      directory = parent === "." ? "" : parent;
    }
  }
  return [...totals.entries()].map(([path, total]) => ({ path, ...total })).sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}
function buildChanged(files, ranges, linesOf) {
  return files.map((file) => {
    const whole = file.untracked && !file.binary;
    const lines = whole ? linesOf(file.path) : null;
    const hunks = whole && lines !== null ? [{ oldStart: 0, oldLines: 0, newStart: 1, newLines: lines }] : ranges.get(file.path) ?? [];
    return {
      path: file.path,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      binary: file.binary,
      hunks
    };
  });
}
async function runStructurePass(options, resolved, limits, signal) {
  const { runner, cwd } = options;
  const startedAt = Date.now();
  const expired = () => Date.now() - startedAt > limits.timeBudgetMs;
  const [listed, changedFiles, ranges] = await Promise.all([
    listNewSide(runner, cwd, resolved, signal),
    collectFiles(runner, cwd, resolved, signal),
    readHunkRanges(runner, cwd, resolved, signal)
  ]);
  if (!listed.ok) return listed;
  if (!changedFiles.ok) return changedFiles;
  const deletedPaths = new Set(
    changedFiles.files.filter((file) => file.status === "deleted").map((file) => file.path)
  );
  const addedPaths = new Set(
    changedFiles.files.filter((file) => file.status === "added" || file.status === "untracked").map((file) => file.path)
  );
  const newEntries = listed.entries.filter((entry) => !deletedPaths.has(entry.path));
  let complete = true;
  let note = null;
  const changedOnNewSide = new Set(
    changedFiles.files.filter((file) => file.status !== "deleted").map((file) => file.path)
  );
  const ordered = [...newEntries].sort((left, right) => {
    const leftChanged = changedOnNewSide.has(left.path) ? 0 : 1;
    const rightChanged = changedOnNewSide.has(right.path) ? 0 : 1;
    if (leftChanged !== rightChanged) return leftChanged - rightChanged;
    return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
  });
  let readOrder = ordered;
  if (readOrder.length > limits.maxFiles) {
    readOrder = readOrder.slice(0, limits.maxFiles);
    complete = false;
    note = `file budget ${limits.maxFiles}`;
  }
  const contents = /* @__PURE__ */ new Map();
  const newImports = /* @__PURE__ */ new Map();
  let parsed = 0;
  let stopped = false;
  if (resolved.kind === "worktree") {
    for (const entry of readOrder) {
      if (expired()) {
        stopped = true;
        break;
      }
      const content = await readWorktreeFile(cwd, entry.path);
      if (content === null) continue;
      contents.set(entry.path, content);
      if (content.imports !== void 0) {
        newImports.set(entry.path, content.imports);
        parsed += 1;
      }
    }
  } else if (expired()) {
    stopped = true;
  } else {
    const read = await readBlobChunks(runner, cwd, "HEAD", readOrder, limits, signal);
    for (const entry of readOrder) {
      if (expired()) {
        stopped = true;
        break;
      }
      if (read.binary.has(entry.path)) {
        contents.set(entry.path, { lines: null, binary: true });
        continue;
      }
      const text = read.blobs.get(entry.path);
      if (text === null || text === void 0) continue;
      const buffer = Buffer.from(text, "utf8");
      const binary = looksBinary(buffer);
      const content = {
        lines: binary ? null : countNewlines(buffer),
        binary,
        ...isScriptPath(entry.path) && !binary ? { imports: extractImports(text) } : {}
      };
      contents.set(entry.path, content);
      if (content.imports !== void 0) {
        newImports.set(entry.path, content.imports);
        parsed += 1;
      }
    }
  }
  if (stopped) {
    complete = false;
    note = `time budget ${limits.timeBudgetMs}ms`;
  }
  const deletedEntries = [...deletedPaths].map((path) => ({ path, size: 0 }));
  const deletedRead = await readBlobChunks(runner, cwd, resolved.baseRef, deletedEntries, limits, signal);
  const oldImports = /* @__PURE__ */ new Map();
  for (const entry of deletedEntries) {
    const text = deletedRead.blobs.get(entry.path);
    if (text === null || text === void 0) continue;
    const buffer = Buffer.from(text, "utf8");
    const binary = looksBinary(buffer);
    contents.set(entry.path, { lines: binary ? null : countNewlines(buffer), binary });
    if (isScriptPath(entry.path) && !binary) oldImports.set(entry.path, extractImports(text));
  }
  const differing = changedFiles.files.filter(
    (file) => file.status !== "added" && file.status !== "untracked" && file.status !== "deleted"
  );
  const differingEntries = differing.map((file) => ({ path: file.oldPath ?? file.path, size: 0 }));
  const differingRead = await readBlobChunks(runner, cwd, resolved.baseRef, differingEntries, limits, signal);
  for (const file of differing) {
    const oldPath = file.oldPath ?? file.path;
    const text = differingRead.blobs.get(oldPath);
    if (text === null || text === void 0) continue;
    if (!isScriptPath(oldPath)) continue;
    const buffer = Buffer.from(text, "utf8");
    if (looksBinary(buffer)) continue;
    oldImports.set(oldPath, extractImports(text));
  }
  const files = [];
  for (const entry of readOrder) {
    const content = contents.get(entry.path);
    if (content === void 0) {
      files.push({ path: entry.path, lines: null, binary: false, deleted: false, unindexed: true });
      continue;
    }
    files.push({ path: entry.path, lines: content.lines, binary: content.binary, deleted: false });
  }
  for (const path of deletedPaths) {
    const content = contents.get(path);
    if (content === void 0) {
      files.push({ path, lines: null, binary: false, deleted: true, unindexed: true });
      continue;
    }
    files.push({ path, lines: content.lines, binary: content.binary, deleted: true });
  }
  files.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  const linesByPath = new Map(files.map((file) => [file.path, file.lines]));
  const changed = buildChanged(changedFiles.files, ranges, (path) => linesByPath.get(path) ?? null);
  const dirs = aggregateDirs(files, new Map(changed.map((entry) => [entry.path, entry])));
  const changedPaths = /* @__PURE__ */ new Set();
  for (const file of changedFiles.files) {
    changedPaths.add(file.path);
    if (file.oldPath !== void 0) changedPaths.add(file.oldPath);
  }
  return {
    ok: true,
    pass: { files, dirs, changed, newImports, oldImports, changedPaths, parsed, complete, note }
  };
}
function buildEdges(imports, resolve) {
  const edges = /* @__PURE__ */ new Map();
  const missed = /* @__PURE__ */ new Map();
  for (const [from, extracted] of imports) {
    const targets = /* @__PURE__ */ new Set();
    let count = extracted.dynamic;
    for (const specifier of extracted.specifiers) {
      const to = resolve(from, specifier);
      if (to === null) {
        count += 1;
        continue;
      }
      if (to !== from) targets.add(to);
    }
    if (count > 0) missed.set(from, count);
    if (targets.size > 0) edges.set(from, targets);
  }
  return { edges, missed };
}
async function collectIndex(options, scope, limits = DEFAULT_INDEX_LIMITS, signal) {
  const { runner, cwd } = options;
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);
  const resolved = await resolveScope(runner, root, scope, signal);
  if (!resolved.ok) return resolved;
  const pass = await runStructurePass({ runner, cwd: root }, resolved.resolved, limits, signal);
  if (!pass.ok) return pass;
  const readText = async (path) => {
    if (resolved.resolved.kind === "worktree") {
      try {
        return await readFile3(join2(root, path), "utf8");
      } catch {
        return null;
      }
    }
    return readOneBlob(runner, root, "HEAD", path, signal);
  };
  const compilerPaths = await loadCompilerPaths(readText);
  const newPaths = new Set(pass.pass.files.filter((file) => !file.deleted).map((file) => file.path));
  const oldPaths = /* @__PURE__ */ new Set([...newPaths, ...pass.pass.files.filter((file) => file.deleted).map((file) => file.path)]);
  for (const path of newPaths) {
    if (pass.pass.changed.some((entry) => entry.path === path && (entry.status === "added" || entry.status === "untracked"))) {
      oldPaths.delete(path);
    }
  }
  const oldImports = new Map(pass.pass.oldImports);
  for (const [path, extracted] of pass.pass.newImports) {
    if (oldImports.has(path)) continue;
    if (!oldPaths.has(path)) continue;
    oldImports.set(path, extracted);
  }
  const newSide = buildEdges(pass.pass.newImports, createResolver(newPaths, compilerPaths));
  const oldSide = buildEdges(oldImports, createResolver(oldPaths, compilerPaths));
  const diff = diffEdges(newSide.edges, oldSide.edges, pass.pass.changedPaths);
  const edges = diff.edges;
  const missedByFile = new Map(oldSide.missed);
  for (const [path, count] of newSide.missed) missedByFile.set(path, count);
  const unresolvedFiles = [...missedByFile.keys()].sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
  const unresolvedCount = unresolvedFiles.reduce((sum, path) => sum + (missedByFile.get(path) ?? 0), 0);
  return {
    ok: true,
    index: {
      files: pass.pass.files,
      dirs: pass.pass.dirs,
      changed: pass.pass.changed,
      edges,
      imports: { newImports: diff.newImports, droppedImports: diff.droppedImports },
      unresolved: { count: unresolvedCount, files: unresolvedFiles },
      indexed: {
        files: pass.pass.files.length,
        parsed: pass.pass.parsed,
        complete: pass.pass.complete,
        note: pass.pass.note
      },
      snapshotId: `${resolved.resolved.kind}:${resolved.resolved.baseRef}..HEAD`
    }
  };
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
    loadDiff: (workspace, scope, path, signal) => collectFileDiff({ runner, cwd: workspace }, { scope, path }, signal),
    loadIndex: (workspace, scope, signal) => collectIndex({ runner, cwd: workspace }, scope, void 0, signal)
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
