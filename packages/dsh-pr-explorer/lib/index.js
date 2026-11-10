// src/index.ts
import { realpath } from "node:fs/promises";

// src/host/contract.ts
import { basename } from "node:path";
var READ_ONLY_SUBCOMMANDS = /* @__PURE__ */ new Set([
  "rev-parse",
  "symbolic-ref",
  "merge-base",
  "rev-list",
  "log",
  "diff",
  "for-each-ref",
  "cat-file",
  "show"
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
async function resolveRef(runner, cwd, ref, signal) {
  if (ref === "" || ref.includes("\0")) return fail("invalid-ref", "a ref name is required");
  const result = await runReadOnly(runner, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { cwd, signal });
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  const hash = result.stdout.trim();
  if (result.exitCode !== 0 || hash === "") return fail("invalid-ref", `${ref} does not name a commit`);
  return { ok: true, hash };
}
async function readRef(runner, cwd, input, signal) {
  const resolved = await resolveRef(runner, cwd, input, signal);
  if (!resolved.ok) return resolved;
  return { ok: true, reading: { input, hash: resolved.hash, short: resolved.hash.slice(0, 7) } };
}
async function resolveCompare(runner, cwd, baseInput, headInput, signal) {
  const base = await readRef(runner, cwd, baseInput, signal);
  if (!base.ok) return base;
  const head = await readRef(runner, cwd, headInput, signal);
  if (!head.ok) return head;
  const mergeBaseResult = await runReadOnly(runner, ["merge-base", base.reading.hash, head.reading.hash], { cwd, signal });
  if (isRefused(mergeBaseResult)) return fail("bad-request", "a read-only command was refused");
  const mergeBase = mergeBaseResult.stdout.trim();
  if (mergeBaseResult.exitCode !== 0 || mergeBase === "") {
    return fail("no-merge-base", `${baseInput} and ${headInput} share no commit`);
  }
  const counts = await runReadOnly(
    runner,
    ["rev-list", "--left-right", "--count", `${base.reading.hash}...${head.reading.hash}`],
    { cwd, signal }
  );
  if (isRefused(counts)) return fail("bad-request", "a read-only command was refused");
  if (counts.exitCode !== 0) return fail("unreadable", counts.stderr.trim() || "git rev-list failed");
  const [behindRaw, aheadRaw] = counts.stdout.trim().split(/\s+/u);
  const behind = Number.parseInt(behindRaw ?? "", 10);
  const ahead = Number.parseInt(aheadRaw ?? "", 10);
  if (!Number.isFinite(behind) || !Number.isFinite(ahead)) {
    return fail("unreadable", "git rev-list did not report both counts");
  }
  const reading = {
    base: base.reading,
    head: head.reading,
    mergeBase: { hash: mergeBase, short: mergeBase.slice(0, 7) },
    ahead,
    behind
  };
  return { ok: true, reading };
}
async function refExists(runner, cwd, ref, signal) {
  const result = await runReadOnly(runner, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { cwd, signal });
  if (isRefused(result)) return false;
  return result.exitCode === 0 && result.stdout.trim() !== "";
}
async function remoteDefaultRef(runner, cwd, signal) {
  const result = await runReadOnly(runner, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const ref = result.stdout.trim();
  return ref === "" ? null : ref;
}
async function resolveDefaultBase(runner, cwd, signal) {
  const candidates = [await remoteDefaultRef(runner, cwd, signal), "main", "master"];
  for (const candidate of candidates) {
    if (candidate === null) continue;
    if (await refExists(runner, cwd, candidate, signal)) return candidate;
  }
  return null;
}
function kindOf(refname) {
  if (refname.startsWith("refs/heads/")) return "branch";
  if (refname.startsWith("refs/remotes/")) return "remote";
  if (refname.startsWith("refs/tags/")) return "tag";
  return null;
}
async function readHead(runner, cwd, signal) {
  const options = { cwd, signal };
  const [short, branch] = await Promise.all([
    runReadOnly(runner, ["rev-parse", "--short", "HEAD"], options),
    runReadOnly(runner, ["symbolic-ref", "--short", "HEAD"], options)
  ]);
  if (isRefused(short) || isRefused(branch)) return null;
  const shortHash = short.stdout.trim();
  if (short.exitCode !== 0 || shortHash === "") return null;
  const ref = branch.exitCode === 0 ? branch.stdout.trim() : "";
  return ref === "" ? { kind: "detached", ref: "HEAD", shortHash } : { kind: "branch", ref, shortHash };
}
function parseRefListing(text) {
  const seen = /* @__PURE__ */ new Set();
  const entries = [];
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line === "") continue;
    const tab = line.indexOf("	");
    if (tab < 0) continue;
    const refname = line.slice(0, tab);
    const kind = kindOf(refname);
    if (kind === null) continue;
    const name2 = kind === "branch" ? refname.slice("refs/heads/".length) : kind === "remote" ? refname.slice("refs/remotes/".length) : refname.slice("refs/tags/".length);
    if (name2 === "" || name2.endsWith("/HEAD")) continue;
    if (seen.has(name2)) continue;
    seen.add(name2);
    entries.push({ name: name2, kind });
  }
  return entries;
}
var KIND_ORDER = { branch: 0, remote: 1, tag: 2 };
async function readRefs(runner, cwd, signal) {
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);
  const [listing, head, defaultBase] = await Promise.all([
    runReadOnly(runner, ["for-each-ref", "--format=%(refname)%09%(objecttype)", "refs/heads", "refs/remotes", "refs/tags"], {
      cwd: root,
      signal
    }),
    readHead(runner, root, signal),
    resolveDefaultBase(runner, root, signal)
  ]);
  if (isRefused(listing)) return fail("bad-request", "a read-only command was refused");
  if (listing.exitCode !== 0) return fail("unreadable", listing.stderr.trim() || "git for-each-ref failed");
  if (head === null) return fail("invalid-ref", "HEAD does not name a commit");
  const refs = parseRefListing(listing.stdout).map((entry) => ({ ...entry, isDefault: entry.name === defaultBase })).sort((left, right) => {
    const byKind = KIND_ORDER[left.kind] - KIND_ORDER[right.kind];
    if (byKind !== 0) return byKind;
    return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
  });
  const value = { repo: basename(root), head, refs, defaultBase };
  return { ok: true, listing: value };
}

// src/host/compare.ts
var MAX_COMMITS = 400;
var RECORD = "";
var FIELD = "%x00";
var LOG_FORMAT = `--format=%H${FIELD}%h${FIELD}%an${FIELD}%ad${FIELD}%s${FIELD}%D${RECORD}`;
var DATE_FORMAT = "--date=short";
function parseLog(text) {
  const entries = [];
  for (const raw of text.split(RECORD)) {
    const record = raw.replace(/^\n/u, "");
    if (record.trim() === "") continue;
    const fields = record.split("\0");
    const hash = fields[0] ?? "";
    if (hash === "") continue;
    const refs = fields[5] ?? "";
    entries.push({
      hash,
      short: fields[1] ?? hash.slice(0, 7),
      author: fields[2] ?? "",
      date: fields[3] ?? "",
      subject: fields[4] ?? "",
      ...refs === "" ? {} : { refs }
    });
  }
  return entries;
}
async function collectCommits(runner, cwd, range, signal) {
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);
  const pinned = await resolveCompare(runner, root, range.base, range.head, signal);
  if (!pinned.ok) return pinned;
  const result = await runReadOnly(
    runner,
    ["log", `${pinned.reading.head.hash}`, `^${pinned.reading.base.hash}`, LOG_FORMAT, DATE_FORMAT, `-n`, String(MAX_COMMITS + 1)],
    { cwd: root, signal }
  );
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("unreadable", result.stderr.trim() || "git log failed");
  if (result.stdoutLossy) return fail("too-large", "the commit list exceeded the read budget");
  const all = parseLog(result.stdout);
  const truncated = all.length > MAX_COMMITS;
  return { ok: true, list: { commits: truncated ? all.slice(0, MAX_COMMITS) : all, truncated } };
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
    default:
      return "unknown";
  }
}
function mergeRecords(records, stats) {
  const counts = new Map(stats.map((stat) => [stat.path, stat]));
  const files = records.map((record) => {
    const stat = counts.get(record.path);
    const binary = stat !== void 0 && stat.additions === null && stat.deletions === null;
    return {
      path: record.path,
      ...record.oldPath === void 0 ? {} : { oldPath: record.oldPath },
      status: statusFromLetter(record.code),
      additions: binary ? null : stat?.additions ?? null,
      deletions: binary ? null : stat?.deletions ?? null,
      binary
    };
  });
  return files.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}
async function collectFiles(runner, cwd, range, signal) {
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);
  const pinned = await resolveCompare(runner, root, range.base, range.head, signal);
  if (!pinned.ok) return pinned;
  const [nameStatus, numstat] = await Promise.all([
    runReadOnly(
      runner,
      ["diff", "--name-status", "-M", "-z", "--no-ext-diff", "--no-textconv", pinned.reading.mergeBase.hash, pinned.reading.head.hash],
      { cwd: root, signal }
    ),
    runReadOnly(
      runner,
      ["diff", "-M", "--numstat", "-z", "--no-ext-diff", "--no-textconv", pinned.reading.mergeBase.hash, pinned.reading.head.hash],
      { cwd: root, signal }
    )
  ]);
  if (isRefused(nameStatus) || isRefused(numstat)) return fail("bad-request", "a read-only command was refused");
  if (nameStatus.exitCode !== 0) return fail("unreadable", nameStatus.stderr.trim() || "git diff failed");
  if (numstat.exitCode !== 0) return fail("unreadable", numstat.stderr.trim() || "git diff failed");
  if (nameStatus.stdoutLossy || numstat.stdoutLossy) return fail("too-large", "the file list exceeded the read budget");
  const files = mergeRecords(parseNameStatusZ(nameStatus.stdout), parseNumStatZ(numstat.stdout));
  const additions = files.reduce((sum, file) => sum + (file.additions ?? 0), 0);
  const deletions = files.reduce((sum, file) => sum + (file.deletions ?? 0), 0);
  return { ok: true, comparison: { files, summary: { files: files.length, additions, deletions } } };
}
async function pinRange(runner, cwd, range, signal) {
  return resolveCompare(runner, cwd, range.base, range.head, signal);
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
function splitLines(text) {
  if (text === "") return [];
  const trimmed = text.endsWith("\n") ? text.slice(0, -1) : text;
  return trimmed.split("\n");
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
async function readFromRevision(runner, cwd, rev, path, signal) {
  const result = await runReadOnly(runner, ["cat-file", "-p", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return result.stdout;
}
async function sizeInRevision(runner, cwd, rev, path, signal) {
  const result = await runReadOnly(runner, ["cat-file", "-s", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  const bytes = Number.parseInt(result.stdout.trim(), 10);
  return Number.isFinite(bytes) ? bytes : null;
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
async function collectFileDiff(runner, cwd, request, signal) {
  if (request.path === "" || request.path.includes("\0")) return fail("bad-request", "a file path is required");
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);
  const pinned = await pinRange(runner, root, { base: request.base, head: request.head }, signal);
  if (!pinned.ok) return pinned;
  const files = await collectFiles(runner, root, { base: request.base, head: request.head }, signal);
  if (!files.ok) return files;
  const file = files.comparison.files.find((candidate) => candidate.path === request.path);
  if (file === void 0) return fail("bad-request", `${request.path} is not changed in this range`);
  const mergeBase = pinned.reading.mergeBase.hash;
  const head = pinned.reading.head.hash;
  if (file.binary) {
    const bytes = await sizeInRevision(runner, root, head, file.path, signal);
    if (bytes !== null && bytes > MAX_DIFF_BYTES) return fail("too-large", `${file.path} is ${String(bytes)} bytes`);
    return { ok: true, diff: { kind: "binary", path: file.path, bytes } };
  }
  if (file.status === "deleted") {
    const text = await readFromRevision(runner, root, mergeBase, file.path, signal);
    if (text === null) return fail("unreadable", `${file.path} could not be read from the merge base`);
    const lines = splitLines(text);
    if (lines.length > MAX_DIFF_LINES) return fail("too-large", `${file.path} has ${String(lines.length)} lines`);
    return { ok: true, diff: { kind: "deleted", path: file.path, lines } };
  }
  return collectTextDiff(runner, root, mergeBase, head, file.path, file.oldPath, signal);
}
async function collectTextDiff(runner, root, mergeBase, head, path, oldPath, signal) {
  const paths = oldPath === void 0 ? ["--", path] : ["--", oldPath, path];
  const result = await runReadOnly(
    runner,
    ["diff", "-M", `-U${String(CONTEXT_LINES)}`, "--no-ext-diff", "--no-textconv", mergeBase, head, ...paths],
    { cwd: root, signal }
  );
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("unreadable", result.stderr.trim() || "git diff failed");
  if (result.stdoutLossy) return fail("too-large", `${path} exceeded the read budget`);
  const text = result.stdout;
  const hunks = parseHunks(text);
  const lineCount = hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
  const truncated = Buffer.byteLength(text, "utf8") > MAX_DIFF_BYTES || lineCount > MAX_DIFF_LINES;
  const diff = { kind: "text", path, hunks: truncated ? clampHunks(hunks) : hunks, truncated };
  return { ok: true, diff };
}

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

// src/host/routes.ts
import { posix } from "node:path";

// src/shared.ts
var PACKAGE_NAME = "dsh-pr-explorer";
var ROUTE_PREFIX = "/pr-explorer/api";

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
function sessionIdOf(url) {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? void 0 : raw;
}
function refOf(url, name2) {
  const raw = url.searchParams.get(name2);
  return raw === null || raw === "" ? void 0 : raw;
}
function suffixOf(pathname) {
  if (pathname !== ROUTE_PREFIX && !pathname.startsWith(`${ROUTE_PREFIX}/`)) return void 0;
  return pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
}
var ROUTES = /* @__PURE__ */ new Set(["refs", "compare", "diff"]);
async function handlePrRequest(deps, request) {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, "http://pr-explorer.local");
  const suffix = suffixOf(url.pathname);
  if (suffix === void 0) return fail2("bad-request", `no pr-explorer route for ${url.pathname}`, 404);
  if (method !== "GET") return fail2("bad-request", `method ${method} is not allowed on ${suffix}`, 405);
  if (!ROUTES.has(suffix)) return fail2("bad-request", `no pr-explorer route for ${suffix}`, 404);
  const sessionId = sessionIdOf(url);
  if (sessionId === void 0) return fail2("bad-request", "sessionId query parameter is required");
  let range;
  if (suffix !== "refs") {
    const base = refOf(url, "base");
    const head = refOf(url, "head");
    if (base === void 0) return fail2("bad-request", "base query parameter is required");
    if (head === void 0) return fail2("bad-request", "head query parameter is required");
    range = { base, head };
  }
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
    if (range === void 0) {
      const result2 = await deps.loadRefs(workspace);
      return { status: 200, body: result2 };
    }
    if (path === void 0) {
      const result2 = await deps.loadCompare(workspace, range);
      return { status: 200, body: result2 };
    }
    const result = await deps.loadDiff(workspace, { base: range.base, head: range.head, path });
    return { status: 200, body: result };
  } catch {
    return fail2("unreadable", "the pr read failed", 500);
  }
}
function registerPrRoutes(webServer, deps) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      const response = await handlePrRequest(deps, {
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
    return await realpath(dir);
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
  async function loadCompare(workspace, range, signal) {
    const pinned = await pinRange(runner, workspace, range, signal);
    if (!pinned.ok) return pinned;
    const pinnedRange = { base: pinned.reading.base.hash, head: pinned.reading.head.hash };
    const [commits, files] = await Promise.all([
      collectCommits(runner, workspace, pinnedRange, signal),
      collectFiles(runner, workspace, pinnedRange, signal)
    ]);
    if (!commits.ok) return commits;
    if (!files.ok) return files;
    return {
      ok: true,
      compare: { reading: pinned.reading, commits: commits.list, files: files.comparison }
    };
  }
  const deps = {
    resolveWorkspaceRoot: (sessionId) => resolveSessionRoot(sessionId, sessions, sessionPersistence),
    loadRefs: (workspace, signal) => readRefs(runner, workspace, signal),
    loadCompare,
    loadDiff: (workspace, range, signal) => collectFileDiff(runner, workspace, range, signal)
  };
  whenWebServer(host, (webServer) => {
    const unregister = registerPrRoutes(webServer, deps);
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
