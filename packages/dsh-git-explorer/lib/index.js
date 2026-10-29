var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name2, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name2, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name2, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name2]() {
    return __privateGet(this, extra);
  }, set [name2](x) {
    return __privateSet(this, extra, x);
  } }, name2));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name2) : __name(target, name2);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name2, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name2 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name2];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name2] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name2, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/index.ts
import { isAbsolute } from "node:path";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import Schema from "@deepseek-ai/schemastery";

// src/host/failure.ts
var MAX_MESSAGE = 600;
function fail(code, message) {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE) } };
}
function runFailure(result) {
  if (result.timedOut) return { code: "timeout", message: "the command exceeded its deadline" };
  if (result.cancelled) return { code: "internal", message: "the command was cancelled" };
  if (result.exitCode !== 0) {
    const fallback = result.exitCode === null ? "the command was terminated by a signal" : `the command exited with code ${String(result.exitCode)}`;
    const detail = result.stderr.trim() === "" ? fallback : result.stderr.trim();
    return { code: "git-failed", message: detail };
  }
  return null;
}

// src/host/parse.ts
var LOG_FIELDS = 5;
var MAX_REF_NAME = 512;
function splitBounded(line, fieldCount) {
  const fields = [];
  let start = 0;
  for (let index = 0; index < fieldCount - 1; index += 1) {
    const separator = line.indexOf("|", start);
    if (separator < 0) return null;
    fields.push(line.slice(start, separator));
    start = separator + 1;
  }
  fields.push(line.slice(start));
  return fields;
}
function parseLog(text) {
  const commits = [];
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line === "") continue;
    const fields = splitBounded(line, LOG_FIELDS);
    if (fields === null) continue;
    const hash = fields[0] ?? "";
    if (hash === "") continue;
    const parentsRaw = (fields[1] ?? "").trim();
    const seconds = Number.parseInt(fields[3] ?? "", 10);
    commits.push({
      hash,
      parents: parentsRaw === "" ? [] : parentsRaw.split(/\s+/u),
      author: fields[2] ?? "",
      time: Number.isFinite(seconds) ? seconds : 0,
      subject: fields[4] ?? ""
    });
  }
  return commits;
}
function refKind(name2) {
  return name2.startsWith("origin/") || name2.includes("/") ? "remote" : "branch";
}
function parseRefs(decoration) {
  const refs = [];
  for (const raw of decoration.split(",")) {
    let token = raw.trim();
    if (token === "" || token.length > MAX_REF_NAME) continue;
    let head = false;
    if (token.startsWith("HEAD -> ")) {
      head = true;
      token = token.slice("HEAD -> ".length).trim();
    } else if (token === "HEAD") {
      continue;
    }
    if (token.startsWith("tag: ")) {
      const name2 = token.slice("tag: ".length).trim().replace(/^refs\/tags\//u, "");
      refs.push({ kind: "tag", name: name2, head: false });
    } else if (token.startsWith("refs/tags/")) {
      refs.push({ kind: "tag", name: token.slice("refs/tags/".length), head: false });
    } else if (token.startsWith("refs/remotes/")) {
      refs.push({ kind: "remote", name: token.slice("refs/remotes/".length), head });
    } else if (token.startsWith("refs/heads/")) {
      refs.push({ kind: "branch", name: token.slice("refs/heads/".length), head });
    } else if (head) {
      refs.push({ kind: "branch", name: token, head });
    } else {
      refs.push({ kind: refKind(token), name: token, head });
    }
  }
  return refs;
}
function parseRefListing(text) {
  const entries = [];
  for (const line of text.split("\n")) {
    if (line === "") continue;
    const parts = line.split("\0");
    const refname = parts[0] ?? "";
    const hash = parts[1] ?? "";
    if (refname === "" || hash === "") continue;
    const head = (parts[2] ?? "") === "*";
    if (refname.startsWith("refs/heads/")) {
      entries.push({ kind: "branch", name: refname.slice("refs/heads/".length), hash, head });
    } else if (refname.startsWith("refs/remotes/")) {
      const name2 = refname.slice("refs/remotes/".length);
      if (name2.endsWith("/HEAD")) continue;
      entries.push({ kind: "remote", name: name2, hash, head });
    } else if (refname.startsWith("refs/tags/")) {
      entries.push({ kind: "tag", name: refname.slice("refs/tags/".length), hash, head });
    }
  }
  return entries;
}
function statusFromCode(code) {
  switch (code) {
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
      return "typechange";
    case "U":
      return "conflicted";
    default:
      return null;
  }
}
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
function changePath(path) {
  if (path === "") return null;
  if (path.endsWith("/")) return { path: path.replace(/\/+$/u, ""), isDirectory: true };
  return { path, isDirectory: false };
}
function parseStatusZ(text) {
  const records = text.split("\0");
  const changes = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record === void 0 || record === "") continue;
    if (record.startsWith("# ")) continue;
    const kind = record[0];
    if (kind === "?") {
      if (record[1] !== " ") continue;
      const parsed = changePath(record.slice(2));
      if (parsed === null) continue;
      changes.push({ ...parsed, status: "untracked", staged: false, index: "?", worktree: "?" });
      continue;
    }
    if (kind === "!") continue;
    if (kind === "1" || kind === "2") {
      const fields = takeFields(record.slice(2), kind === "1" ? 7 : 8);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      const parsed = changePath(fields.rest);
      if (parsed === null || xy.length < 2) continue;
      const x = xy[0] ?? ".";
      const y = xy[1] ?? ".";
      let origPath;
      if (kind === "2") {
        const next = records[index + 1];
        if (next === void 0 || next === "") continue;
        origPath = next;
        index += 1;
      }
      const stagedStatus = statusFromCode(x);
      const worktreeStatus = statusFromCode(y);
      if (stagedStatus !== null) {
        changes.push({
          ...parsed,
          status: stagedStatus,
          staged: true,
          index: x,
          worktree: y,
          ...origPath === void 0 ? {} : { origPath }
        });
      }
      if (worktreeStatus !== null) {
        changes.push({
          ...parsed,
          status: worktreeStatus,
          staged: false,
          index: x,
          worktree: y,
          ...origPath === void 0 ? {} : { origPath }
        });
      }
      continue;
    }
    if (kind === "u") {
      const fields = takeFields(record.slice(2), 9);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      const parsed = changePath(fields.rest);
      if (parsed === null) continue;
      changes.push({
        ...parsed,
        status: "conflicted",
        staged: false,
        index: xy[0] ?? ".",
        worktree: xy[1] ?? "."
      });
    }
  }
  return changes;
}
function parseStatusBranch(text) {
  let hash = null;
  let branch = null;
  let detached = false;
  let upstream;
  let ahead;
  let behind;
  for (const record of text.split("\0")) {
    if (!record.startsWith("# ")) continue;
    if (record.startsWith("# branch.oid ")) {
      const value = record.slice("# branch.oid ".length);
      hash = value === "(initial)" ? null : value;
    } else if (record.startsWith("# branch.head ")) {
      const value = record.slice("# branch.head ".length);
      if (value === "(detached)") {
        detached = true;
        branch = null;
      } else {
        branch = value;
      }
    } else if (record.startsWith("# branch.upstream ")) {
      upstream = record.slice("# branch.upstream ".length);
    } else if (record.startsWith("# branch.ab ")) {
      const match = /^\+(\d+) -(\d+)$/u.exec(record.slice("# branch.ab ".length));
      if (match !== null) {
        ahead = Number(match[1]);
        behind = Number(match[2]);
      }
    }
  }
  return {
    hash,
    branch,
    detached,
    ...upstream === void 0 ? {} : { upstream },
    ...ahead === void 0 ? {} : { ahead },
    ...behind === void 0 ? {} : { behind }
  };
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
      const origPath = parts[index + 1];
      const nextPath = parts[index + 2];
      if (origPath === void 0 || nextPath === void 0 || nextPath === "") continue;
      index += 2;
      stats.push({ path: nextPath, origPath, additions, deletions });
    } else {
      stats.push({ path, additions, deletions });
    }
  }
  return stats;
}
function parseNameStatusZ(text) {
  const parts = text.split("\0");
  const files = [];
  for (let index = 0; index < parts.length; index += 1) {
    const code = parts[index];
    if (code === void 0 || code === "") continue;
    const letter = code.slice(0, 1);
    const status = statusFromCode(letter);
    if (status === null) continue;
    if (letter === "R" || letter === "C") {
      const origPath = parts[index + 1];
      const path = parts[index + 2];
      if (origPath === void 0 || path === void 0 || path === "") continue;
      index += 2;
      files.push({ path, origPath, status });
    } else {
      const path = parts[index + 1];
      if (path === void 0 || path === "") continue;
      index += 1;
      files.push({ path, status });
    }
  }
  return files;
}
function parseCommitMeta(text) {
  const fields = text.split("\0");
  if (fields.length < 5) return null;
  const hash = fields[0] ?? "";
  if (hash === "") return null;
  const parentsRaw = fields[1] ?? "";
  const author = fields[2] ?? "";
  const timeRaw = fields[3] ?? "";
  const subject = fields[4] ?? "";
  const body = fields.slice(5).join("\0").replace(/\n$/u, "");
  const time = Number.parseInt(timeRaw, 10);
  if (!Number.isFinite(time)) return null;
  return {
    hash,
    parents: parentsRaw === "" ? [] : parentsRaw.split(" ").filter(Boolean),
    author,
    time,
    subject,
    body
  };
}

// src/host/detail.ts
var SAFE_HASH = /^[0-9a-fA-F]{4,64}$/u;
var META_FORMAT = "--format=%H%x00%P%x00%an%x00%at%x00%s%x00%b";
async function collectCommit(options, request, signal) {
  const hash = typeof request.hash === "string" ? request.hash.trim() : "";
  if (!SAFE_HASH.test(hash)) return fail("invalid-request", "hash must be a hexadecimal object id");
  const cwd = request.cwd ?? options.cwd;
  const metaRun = options.runner.run(["show", "-s", META_FORMAT, "--end-of-options", hash], { cwd, signal });
  const statusRun = options.runner.run(
    ["diff-tree", "--no-commit-id", "--name-status", "-r", "-z", "-M", "--root", "-m", "--first-parent", hash],
    { cwd, signal }
  );
  const statRun = options.runner.run(
    ["diff-tree", "--no-commit-id", "--numstat", "-r", "-z", "-M", "--root", "-m", "--first-parent", hash],
    { cwd, signal }
  );
  const [metaResult, statusResult, statResult] = await Promise.all([metaRun, statusRun, statRun]);
  for (const result of [metaResult, statusResult, statResult]) {
    const failure = runFailure(result);
    if (failure !== null) return { ok: false, error: failure };
    if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  }
  const meta = parseCommitMeta(metaResult.stdout);
  if (meta === null) return fail("git-failed", "the commit record could not be parsed");
  const stats = new Map(parseNumStatZ(statResult.stdout).map((stat) => [stat.path, stat]));
  const files = parseNameStatusZ(statusResult.stdout).map((file) => {
    const stat = stats.get(file.path);
    return {
      path: file.path,
      status: file.status,
      additions: stat?.additions ?? null,
      deletions: stat?.deletions ?? null,
      ...file.origPath === void 0 ? {} : { origPath: file.origPath }
    };
  });
  const detail = { ...meta, files };
  return { ok: true, detail };
}

// src/host/git.ts
import { readFile } from "node:fs/promises";
var DEFAULT_TIMEOUT_MS = 2e4;
var DEFAULT_MAX_BYTES = 4 * 1024 * 1024;
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
          // A network command in a repository without credentials must fail
          // fast instead of waiting for a prompt that has no stdin to read.
          env: { GIT_TERMINAL_PROMPT: "0" },
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

// src/host/lanes.ts
var LaneHeap = class {
  items = [];
  push(value) {
    const items = this.items;
    items.push(value);
    let index = items.length - 1;
    while (index > 0) {
      const parent = index - 1 >> 1;
      const parentValue = items[parent];
      if (parentValue === void 0 || parentValue <= value) break;
      items[index] = parentValue;
      index = parent;
    }
    items[index] = value;
  }
  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length === 0 || last === void 0) return top;
    let index = 0;
    for (; ; ) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      let smallestValue = last;
      const leftValue = items[left];
      if (leftValue !== void 0 && leftValue < smallestValue) {
        smallest = left;
        smallestValue = leftValue;
      }
      const rightValue = items[right];
      if (rightValue !== void 0 && rightValue < smallestValue) {
        smallest = right;
        smallestValue = rightValue;
      }
      if (smallest === index) break;
      items[index] = smallestValue;
      index = smallest;
    }
    items[index] = last;
    return top;
  }
};
function assignLanes(commits) {
  const present = /* @__PURE__ */ new Set();
  for (const commit of commits) present.add(commit.hash);
  const occupants = [];
  const waiting = /* @__PURE__ */ new Map();
  const free = new LaneHeap();
  const removeWaiter = (hash, lane) => {
    const lanes = waiting.get(hash);
    if (lanes === void 0) return;
    const at = lanes.indexOf(lane);
    if (at >= 0) lanes.splice(at, 1);
    if (lanes.length === 0) waiting.delete(hash);
  };
  const occupy = (lane, hash) => {
    occupants[lane] = hash;
    const lanes = waiting.get(hash);
    if (lanes === void 0) waiting.set(hash, [lane]);
    else lanes.push(lane);
  };
  const release = (lane) => {
    const hash = occupants[lane] ?? null;
    if (hash !== null) {
      occupants[lane] = null;
      removeWaiter(hash, lane);
    }
    free.push(lane);
  };
  const acquire = () => {
    const reused = free.pop();
    if (reused !== void 0) return reused;
    occupants.push(null);
    return occupants.length - 1;
  };
  const rows = [];
  for (let row = 0; row < commits.length; row += 1) {
    const commit = commits[row];
    if (commit === void 0) continue;
    const incoming = waiting.get(commit.hash);
    let lane;
    let held;
    if (incoming !== void 0 && incoming.length > 0) {
      lane = incoming[0] ?? 0;
      for (let index = 1; index < incoming.length; index += 1) {
        const candidate = incoming[index];
        if (candidate !== void 0 && candidate < lane) lane = candidate;
      }
      for (let index = incoming.length - 1; index >= 0; index -= 1) {
        const candidate = incoming[index];
        if (candidate !== void 0 && candidate !== lane) release(candidate);
      }
      occupants[lane] = null;
      removeWaiter(commit.hash, lane);
      held = lane;
    } else {
      lane = acquire();
      held = lane;
    }
    const edges = [];
    let releaseHeld = false;
    for (let index = 0; index < commit.parents.length; index += 1) {
      const parent = commit.parents[index];
      if (parent === void 0) continue;
      edges.push({ from: commit.hash, to: parent });
      if (!present.has(parent)) continue;
      const parentWaiters = waiting.get(parent);
      const parentHasLane = parentWaiters !== void 0 && parentWaiters.length > 0;
      if (held !== null && index === 0) {
        if (parentHasLane) releaseHeld = true;
        else occupy(held, parent);
        held = null;
        continue;
      }
      if (!parentHasLane) occupy(acquire(), parent);
    }
    if (held !== null) release(held);
    else if (releaseHeld) release(lane);
    rows.push({ hash: commit.hash, row, lane, edges });
  }
  return rows;
}

// src/host/query.ts
var MAX_LIMIT = 5e3;
var MAX_SKIP = 1e6;
var LOG_FORMAT = "--pretty=format:%H|%P|%an|%at|%s";
var SAFE_REF = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u;
function clampInt(value, fallback, min, max) {
  if (value === void 0 || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
function cleanFilter(value) {
  if (value === void 0) return void 0;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.includes("\0")) return void 0;
  return trimmed;
}
async function collectQuery(options, request = {}, signal) {
  const cwd = request.cwd ?? options.cwd;
  const ref = request.ref === void 0 ? void 0 : request.ref.trim();
  if (ref !== void 0 && (ref === "" || ref.length > 512 || !SAFE_REF.test(ref) || ref.includes(".."))) {
    return { ok: false, error: { code: "invalid-request", message: "ref must be a branch, tag or commit name" } };
  }
  const limit = clampInt(request.limit, options.defaultLimit, 1, MAX_LIMIT);
  const skip = clampInt(request.skip, 0, 0, MAX_SKIP);
  const argv = ["log", "--topo-order", "--parents", LOG_FORMAT, `--max-count=${limit + 1}`];
  if (skip > 0) argv.push(`--skip=${skip}`);
  const search = cleanFilter(request.search);
  if (search !== void 0) argv.push(`--grep=${search}`);
  const author = cleanFilter(request.author);
  if (author !== void 0) argv.push(`--author=${author}`);
  if (ref === void 0) argv.push("--all");
  else argv.push("--end-of-options", ref);
  const result = await options.runner.run(argv, { cwd, signal });
  const failure = runFailure(result);
  if (failure !== null) return { ok: false, error: failure };
  if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  const parsed = parseLog(result.stdout);
  const hasMore = parsed.length > limit;
  const commits = parsed.slice(0, limit);
  return { ok: true, page: { commits, lanes: assignLanes(commits), hasMore } };
}

// src/host/snapshot.ts
var MAX_SNAPSHOT_COMMITS = 5e3;
var REF_FORMAT = "--format=%(refname)%00%(objectname)%00%(HEAD)";
var LOG_FORMAT2 = "--pretty=format:%H|%P|%an|%at|%s";
function emptySnapshot(root) {
  return {
    root,
    isRepository: false,
    head: null,
    branches: [],
    changes: [],
    commits: [],
    lanes: [],
    counts: { commits: 0, branches: 0, changes: 0 },
    status: "",
    stats: []
  };
}
function mergeStats(staged, worktree) {
  const merged = /* @__PURE__ */ new Map();
  for (const stat of [...staged, ...worktree]) {
    const previous = merged.get(stat.path);
    if (previous === void 0) {
      merged.set(stat.path, { additions: stat.additions, deletions: stat.deletions });
      continue;
    }
    merged.set(stat.path, {
      additions: previous.additions === null || stat.additions === null ? null : previous.additions + stat.additions,
      deletions: previous.deletions === null || stat.deletions === null ? null : previous.deletions + stat.deletions
    });
  }
  return [...merged.entries()].map(([path, counts]) => ({ path, ...counts })).sort((left, right) => left.path.localeCompare(right.path));
}
function toHead(branch) {
  return {
    hash: branch.hash,
    branch: branch.branch,
    detached: branch.detached,
    ...branch.upstream === void 0 ? {} : { upstream: branch.upstream },
    ...branch.ahead === void 0 ? {} : { ahead: branch.ahead },
    ...branch.behind === void 0 ? {} : { behind: branch.behind }
  };
}
function groupRefs(entries) {
  const grouped = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const ref = { kind: entry.kind, name: entry.name, head: entry.head };
    const list = grouped.get(entry.hash);
    if (list === void 0) grouped.set(entry.hash, [ref]);
    else list.push(ref);
  }
  return grouped;
}
function clampCommits(requested, fallback) {
  const value = requested === void 0 || !Number.isFinite(requested) ? fallback : Math.trunc(requested);
  return Math.min(MAX_SNAPSHOT_COMMITS, Math.max(1, value));
}
async function collectSnapshot(options, request = {}, signal) {
  const cwd = request.cwd ?? options.cwd;
  const probe = await options.runner.run(["rev-parse", "--show-toplevel"], { cwd, signal });
  const probeFailure = runFailure(probe);
  if (probeFailure !== null) {
    if (probeFailure.code === "git-failed") {
      return { ok: true, snapshot: emptySnapshot(cwd) };
    }
    return { ok: false, error: probeFailure };
  }
  const root = probe.stdout.trim();
  if (root === "") return { ok: true, snapshot: emptySnapshot(cwd) };
  const headProbe = await options.runner.run(["rev-parse", "--quiet", "--verify", "HEAD"], { cwd: root, signal });
  const headFailure = runFailure(headProbe);
  if (headFailure !== null && headFailure.code !== "git-failed") return { ok: false, error: headFailure };
  const unborn = headFailure !== null;
  const maxCommits = clampCommits(request.maxCommits, options.maxCommits);
  const commands = [
    options.runner.run(["status", "--porcelain=v2", "-z", "--branch"], { cwd: root, signal }),
    options.runner.run(["for-each-ref", REF_FORMAT, "refs/heads", "refs/remotes", "refs/tags"], { cwd: root, signal }),
    options.runner.run(["diff", "--numstat", "-z"], { cwd: root, signal }),
    options.runner.run(["diff", "--cached", "--numstat", "-z"], { cwd: root, signal })
  ];
  const historyCommands = unborn ? null : [
    options.runner.run(["log", "--all", "--topo-order", "--parents", LOG_FORMAT2, `--max-count=${maxCommits}`], {
      cwd: root,
      signal
    }),
    options.runner.run(["rev-list", "--count", "--all"], { cwd: root, signal })
  ];
  const [status, refs, worktreeStats, stagedStats] = await Promise.all(commands);
  const history = historyCommands === null ? null : await Promise.all(historyCommands);
  const log = history?.[0];
  const count = history?.[1];
  for (const result of [status, refs, worktreeStats, stagedStats, ...history ?? []]) {
    const failure = runFailure(result);
    if (failure !== null) return { ok: false, error: failure };
    if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  }
  const branch = parseStatusBranch(status.stdout);
  const changes = parseStatusZ(status.stdout);
  const branches = parseRefListing(refs.stdout);
  const commits = log === void 0 ? [] : parseLog(log.stdout);
  const refsByHash = groupRefs(branches);
  const nodes = commits.map((commit) => ({
    ...commit,
    refs: refsByHash.get(commit.hash) ?? []
  }));
  const lanes = assignLanes(commits);
  const total = count === void 0 ? 0 : Number.parseInt(count.stdout.trim(), 10);
  return {
    ok: true,
    snapshot: {
      root,
      isRepository: true,
      head: toHead(branch),
      branches,
      changes,
      commits: nodes,
      lanes,
      counts: {
        commits: Number.isFinite(total) ? total : commits.length,
        branches: branches.length,
        changes: changes.length
      },
      status: status.stdout,
      stats: mergeStats(parseNumStatZ(stagedStats.stdout), parseNumStatZ(worktreeStats.stdout))
    }
  };
}

// src/shared.ts
var PACKAGE_NAME = "dsh-git-explorer";
var GIT_SERVICE = "gitExplorer";

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["subprocess", "sessions", "sessionPersistence"];
var DEFAULT_CONFIG = {
  timeoutMs: 2e4,
  maxBytes: 4 * 1024 * 1024,
  maxCommits: 400
};
function clampInt2(value, fallback, min, max) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
function normalizeConfig(config) {
  return {
    timeoutMs: clampInt2(config?.timeoutMs, DEFAULT_CONFIG.timeoutMs, 1e3, 12e4),
    maxBytes: clampInt2(config?.maxBytes, DEFAULT_CONFIG.maxBytes, 64 * 1024, 64 * 1024 * 1024),
    maxCommits: clampInt2(config?.maxCommits, DEFAULT_CONFIG.maxCommits, 1, 5e3)
  };
}
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
var _run_dec, _commit_dec, _query_dec, _snapshot_dec, _a, _init;
var GitExplorerService = class extends (_a = TypertRemoteService, _snapshot_dec = [Remote("snapshot")], _query_dec = [Remote("query")], _commit_dec = [Remote("commit")], _run_dec = [Remote("run")], _a) {
  constructor(ctx, config) {
    super(ctx, GIT_SERVICE);
    __runInitializers(_init, 5, this);
    __publicField(this, "subprocess");
    __publicField(this, "sessions");
    __publicField(this, "sessionPersistence");
    __publicField(this, "config");
    this.config = normalizeConfig(config);
    const reader = ctx;
    const read = (name2) => {
      const value = reader.get?.call(ctx, name2);
      return value === null ? void 0 : value;
    };
    const subprocess = read("subprocess");
    if (subprocess === void 0) {
      throw new Error("dsh-git-explorer: subprocess service is unavailable");
    }
    this.subprocess = subprocess;
    this.sessions = read("sessions");
    this.sessionPersistence = read("sessionPersistence");
  }
  /**
   * Resolve the repository base directory for one call.
   *
   * Order: explicit absolute override, the live session header, the persisted
   * session header, then the process cwd. Every step tolerates absence, so a
   * closed session still renders a panel rooted at the deployment directory
   * instead of failing the request.
   */
  async baseDirectory(sessionId, override) {
    if (override !== void 0 && isAbsolute(override)) return override;
    const live = this.sessions?.get(sessionId)?.header?.cwd;
    if (typeof live === "string" && live !== "") return live;
    try {
      const persisted = (await this.sessionPersistence?.stat(sessionId))?.header?.cwd;
      if (typeof persisted === "string" && persisted !== "") return persisted;
    } catch {
    }
    return process.cwd();
  }
  runnerFor(cwd) {
    return createGitRunner({
      subprocess: this.subprocess,
      cwd,
      timeoutMs: this.config.timeoutMs,
      maxBytes: this.config.maxBytes
    });
  }
  async snapshot(request, signal) {
    const cwd = await this.baseDirectory(request.sessionId, request.cwd);
    try {
      return await collectSnapshot({ runner: this.runnerFor(cwd), cwd, maxCommits: this.config.maxCommits }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }
  async query(request, signal) {
    const cwd = await this.baseDirectory(request.sessionId, request.cwd);
    try {
      return await collectQuery({ runner: this.runnerFor(cwd), cwd, defaultLimit: this.config.maxCommits }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }
  async commit(request, signal) {
    const cwd = await this.baseDirectory(request.sessionId, request.cwd);
    try {
      return await collectCommit({ runner: this.runnerFor(cwd), cwd }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }
  async run(request = {}) {
    void request;
    return {
      ok: false,
      error: { code: "not-implemented", message: "actions arrive in a later slice; the data layer is read-only" }
    };
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "snapshot", _snapshot_dec, GitExplorerService);
__decorateElement(_init, 1, "query", _query_dec, GitExplorerService);
__decorateElement(_init, 1, "commit", _commit_dec, GitExplorerService);
__decorateElement(_init, 1, "run", _run_dec, GitExplorerService);
__decoratorMetadata(_init, GitExplorerService);
__publicField(GitExplorerService, "inject", inject);
__publicField(GitExplorerService, "Config", Schema.object({
  timeoutMs: Schema.number().default(DEFAULT_CONFIG.timeoutMs).description("\u5355\u6761 git \u547D\u4EE4\u7684\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09"),
  maxBytes: Schema.number().default(DEFAULT_CONFIG.maxBytes).description("\u5355\u6761 git \u547D\u4EE4\u7684\u8F93\u51FA\u4E0A\u9650\uFF08\u5B57\u8282\uFF09"),
  maxCommits: Schema.number().default(DEFAULT_CONFIG.maxCommits).description("\u5FEB\u7167\u4E0E\u67E5\u8BE2\u9ED8\u8BA4\u7684\u63D0\u4EA4\u6761\u6570\u4E0A\u9650")
}));
var __test = { parseLog, parseRefs, parseStatusZ, assignLanes };
var index_default = GitExplorerService;
export {
  DEFAULT_CONFIG,
  GIT_SERVICE,
  GitExplorerService,
  PACKAGE_NAME,
  __test,
  index_default as default,
  inject,
  name,
  normalizeConfig
};
