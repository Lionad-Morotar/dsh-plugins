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
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import Schema from "@deepseek-ai/schemastery";
import { spawn as nodeSpawn } from "node:child_process";
import { release as osRelease } from "node:os";

// src/host/documents.ts
var DEFAULT_DOCUMENTS_CONFIG = { maxBytes: 2 * 1024 * 1024 };
var MIN_BYTES = 64 * 1024;
var MAX_BYTES = 16 * 1024 * 1024;
var MAX_MESSAGE = 600;
var OPEN_RETRIES = 1;
function clampInt(value, fallback, min, max) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
function normalizeConfig(config) {
  return { maxBytes: clampInt(config?.maxBytes, DEFAULT_DOCUMENTS_CONFIG.maxBytes, MIN_BYTES, MAX_BYTES) };
}
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
function fail(code, message) {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE) } };
}
var FS_FAILURES = {
  FS_TOO_LARGE: "too-large",
  FS_NOT_TEXT: "not-text",
  FS_NOT_REGULAR_FILE: "not-regular-file",
  FS_STALE_VERSION: "stale-version"
};
function codeOf(error) {
  if (typeof error !== "object" || error === null) return void 0;
  const { code } = error;
  return typeof code === "string" ? code : void 0;
}
function failureOf(error) {
  const code = codeOf(error);
  return fail((code === void 0 ? void 0 : FS_FAILURES[code]) ?? "io-error", messageOf(error));
}
function absolutePathOf(fs, target) {
  return fs.processPath?.(target) ?? target.displayPath;
}
function blankPath(request) {
  return typeof request?.path !== "string" || request.path.trim() === "";
}
function utf8Bytes(text) {
  return Buffer.byteLength(text, "utf8");
}
function tooLarge(bytes, maxBytes) {
  return fail("too-large", `${String(bytes)} bytes exceeds the ${String(maxBytes)}-byte document limit`);
}
async function openDocument(deps, request, signal) {
  if (blankPath(request)) return fail("io-error", "path must be a non-empty string");
  try {
    const target = await deps.fs.resolve(request.path, { cwd: deps.cwd, signal });
    let before = await deps.fs.stat(target, signal);
    for (let attempt = 0; attempt <= OPEN_RETRIES; attempt += 1) {
      if (before === void 0) return fail("io-error", `${target.displayPath} does not exist`);
      if (before.type !== "file") return fail("not-regular-file", `${target.displayPath} is not a regular file`);
      if (typeof before.size === "number" && before.size > deps.maxBytes) return tooLarge(before.size, deps.maxBytes);
      const text = await deps.fs.readText(target, signal);
      const after = await deps.fs.stat(target, signal);
      if (after !== void 0 && after.version === before.version) {
        return {
          ok: true,
          document: {
            absolutePath: absolutePathOf(deps.fs, target),
            version: before.version,
            text,
            bytes: utf8Bytes(text)
          }
        };
      }
      before = after;
    }
    return fail("io-error", `${target.displayPath} kept changing while it was read; try again`);
  } catch (error) {
    return failureOf(error);
  }
}
async function saveDocument(deps, request, signal) {
  if (blankPath(request)) return fail("io-error", "path must be a non-empty string");
  if (typeof request.text !== "string") return fail("io-error", "text must be a string");
  const bytes = utf8Bytes(request.text);
  if (bytes > deps.maxBytes) return tooLarge(bytes, deps.maxBytes);
  try {
    const target = await deps.fs.resolve(request.path, { cwd: deps.cwd, signal });
    const outcome = await deps.fs.writeText(
      target,
      request.text,
      { kind: "replaceIfVersion", version: request.expectedVersion },
      signal
    );
    return { ok: true, document: { absolutePath: absolutePathOf(deps.fs, target), version: outcome.version, bytes } };
  } catch (error) {
    return failureOf(error);
  }
}
async function locatePath(deps, request, signal) {
  if (blankPath(request)) return fail("io-error", "path must be a non-empty string");
  try {
    const target = await deps.fs.resolve(request.path, { cwd: deps.cwd, signal });
    const info = await deps.fs.stat(target, signal);
    if (info === void 0) return fail("io-error", `${target.displayPath} does not exist`);
    if (info.type !== "file") return fail("not-regular-file", `${target.displayPath} is not a regular file`);
    const entry = await deps.fs.lstat?.(request.path, { cwd: deps.cwd }, signal);
    return {
      ok: true,
      located: { absolutePath: absolutePathOf(deps.fs, target), symlink: entry?.type === "symlink" }
    };
  } catch (error) {
    return failureOf(error);
  }
}

// src/host/ignored.ts
import { spawn } from "node:child_process";

// src/host/workspace.ts
import path from "node:path";
import { randomUUID } from "node:crypto";
var MAX_MESSAGE2 = 600;
function messageOf2(error) {
  return error instanceof Error ? error.message : String(error);
}
function fail2(code, message) {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE2) } };
}
var FS_FAILURES2 = {
  FS_NOT_FOUND: "not-found",
  FS_NOT_DIRECTORY: "not-directory",
  FS_PERMISSION_DENIED: "permission",
  // The backend's own refusal of a guarded create onto an occupied path. It is
  // the only race-free way to answer "this name is taken".
  FS_NOT_OBSERVED: "exists"
};
function codeOf2(error) {
  if (typeof error !== "object" || error === null) return void 0;
  const { code } = error;
  return typeof code === "string" ? code : void 0;
}
function failureOf2(error) {
  const code = codeOf2(error);
  return fail2((code === void 0 ? void 0 : FS_FAILURES2[code]) ?? "io-error", messageOf2(error));
}
function present(value) {
  return value !== void 0 && value !== "";
}
function isWsl(env) {
  if (present(env.env.WSL_DISTRO_NAME) || present(env.env.WSL_INTEROP)) return true;
  return (env.release ?? "").toLowerCase().includes("microsoft");
}
function fileManagerOf(env) {
  if (env.platform === "darwin") return "finder";
  if (env.platform === "win32") return "explorer";
  if (env.platform !== "linux") return null;
  if (isWsl(env)) return "explorer";
  return present(env.env.DISPLAY) || present(env.env.WAYLAND_DISPLAY) ? "directory" : null;
}
function workspaceCapabilities(env) {
  const fileManager = fileManagerOf(env);
  return { fileManager, canReveal: fileManager !== null };
}
function pathOf(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}
async function resolveInside(deps, requestPath, signal) {
  if (typeof requestPath !== "string" || requestPath.trim() === "") {
    return fail2("not-found", "path must be a non-empty string");
  }
  if (typeof deps.fs.contains !== "function") {
    return fail2("unsupported", "this filesystem backend cannot prove workspace containment");
  }
  try {
    const root = await deps.fs.resolve(deps.cwd, { cwd: deps.cwd, signal });
    const target = await deps.fs.resolve(requestPath, { cwd: deps.cwd, signal });
    if (!deps.fs.contains(root, target)) {
      return fail2("outside-workspace", `${requestPath} is outside the session workspace`);
    }
    return { target, absolutePath: deps.fs.processPath?.(target) ?? target.displayPath, root };
  } catch (error) {
    return failureOf2(error);
  }
}
async function describeWorkspacePath(deps, request, signal) {
  const resolved = await resolveInside(deps, request?.path, signal);
  if ("ok" in resolved) return resolved;
  try {
    const info = await deps.fs.stat(resolved.target, signal);
    const described = {
      absolutePath: resolved.absolutePath,
      type: info?.type ?? "other",
      exists: info !== void 0
    };
    return { ok: true, info: described };
  } catch (error) {
    return failureOf2(error);
  }
}
function run(env, command, args, capture = false) {
  return new Promise((settle, reject) => {
    let child;
    try {
      child = env.spawn(command, args, {
        stdio: ["ignore", capture ? "pipe" : "ignore", "ignore"],
        windowsHide: true
      });
    } catch (error) {
      reject(error);
      return;
    }
    let stdout = "";
    let settled = false;
    const finish = (outcome) => {
      if (settled) return;
      settled = true;
      settle(outcome);
    };
    const abort = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    child.on("error", abort);
    if (capture) {
      child.stdout?.on("data", (chunk) => {
        stdout += typeof chunk === "string" ? chunk : Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
      });
    }
    child.on("exit", (code) => finish({ code, stdout }));
  });
}
async function revealOn(env, absolutePath) {
  const manager = fileManagerOf(env);
  if (manager === "finder") {
    const outcome = await run(env, "open", ["-R", absolutePath]);
    if (outcome.code !== 0) throw new Error(`open -R exited with ${String(outcome.code)}`);
    return;
  }
  if (manager === "explorer") {
    let windowsPath = absolutePath;
    if (env.platform === "linux") {
      const translated = await run(env, "wslpath", ["-w", absolutePath], true);
      if (translated.code !== 0) throw new Error(`wslpath exited with ${String(translated.code)}`);
      windowsPath = translated.stdout.replace(/[\r\n]+$/u, "");
      if (windowsPath === "") throw new Error("wslpath returned no Windows path");
    }
    const outcome = await run(env, "explorer.exe", ["/select,", windowsPath]);
    if (outcome.code !== 0 && outcome.code !== 1) {
      throw new Error(`explorer.exe exited with ${String(outcome.code)}`);
    }
    return;
  }
  if (manager === "directory") {
    const outcome = await run(env, "xdg-open", [pathOf(env.platform).dirname(absolutePath)]);
    if (outcome.code !== 0) throw new Error(`xdg-open exited with ${String(outcome.code)}`);
    return;
  }
  throw Object.assign(new Error(`no file manager on ${env.platform}`), { code: "unsupported" });
}
async function revealWorkspacePath(deps, request, signal) {
  const resolved = await resolveInside(deps, request?.path, signal);
  if ("ok" in resolved) return resolved;
  if (fileManagerOf(deps.env) === null) {
    return fail2("unsupported", `no file manager is available on ${deps.env.platform}`);
  }
  try {
    const info = await deps.fs.stat(resolved.target, signal);
    if (info === void 0) return fail2("not-found", `${request.path} does not exist`);
    await revealOn(deps.env, resolved.absolutePath);
    return { ok: true };
  } catch (error) {
    if (codeOf2(error) === "unsupported") return fail2("unsupported", messageOf2(error));
    return failureOf2(error);
  }
}
function capabilitiesResult(env) {
  return { ok: true, capabilities: workspaceCapabilities(env) };
}
var MAX_NAME = 200;
var SENTINEL_PREFIX = ".dsh-mkdir-";
function checkEntryName(raw) {
  if (typeof raw !== "string") return { ok: false, reason: "empty" };
  const name2 = raw.trim();
  if (name2 === "") return { ok: false, reason: "empty" };
  if (name2 === "." || name2 === "..") return { ok: false, reason: "dot" };
  if (name2.includes("/") || name2.includes("\\") || name2.includes("\0")) {
    return { ok: false, reason: "separator" };
  }
  if (name2.length > MAX_NAME) return { ok: false, reason: "too-long" };
  return { ok: true, name: name2 };
}
function joinRelative(parent, name2) {
  const base = parent.replace(/^\/+|\/+$/gu, "");
  return base === "" ? name2 : `${base}/${name2}`;
}
async function createWorkspaceEntry(deps, request, signal) {
  const checked = checkEntryName(request?.name);
  if (!checked.ok) {
    return fail2("invalid-name", `"${String(request?.name)}" is not a usable name (${checked.reason})`);
  }
  const name2 = checked.name;
  const kind = request?.kind === "directory" ? "directory" : "file";
  if (typeof deps.fs.writeText !== "function") {
    return fail2("unsupported", "this filesystem backend cannot create entries");
  }
  if (kind === "directory" && typeof deps.fs.deleteFile !== "function") {
    return fail2("unsupported", "this filesystem backend cannot remove the directory sentinel");
  }
  const parentPath = typeof request.parent === "string" ? request.parent : "";
  const resolved = await resolveInside(deps, parentPath === "" ? "." : parentPath, signal);
  if ("ok" in resolved) return resolved;
  try {
    const parentInfo = await deps.fs.stat(resolved.target, signal);
    if (parentInfo === void 0) return fail2("not-found", `${parentPath} does not exist`);
    if (parentInfo.type !== "directory") return fail2("not-directory", `${parentPath} is not a directory`);
    const target = await deps.fs.resolve(joinRelative(parentPath, name2), { cwd: deps.cwd, signal });
    if (typeof deps.fs.contains === "function" && !deps.fs.contains(resolved.root, target)) {
      return fail2("outside-workspace", `${name2} would land outside the session workspace`);
    }
    if (kind === "file") {
      await deps.fs.writeText(target, "", { kind: "createIfAbsent" }, signal);
      return { ok: true, path: joinRelative(parentPath, name2) };
    }
    if (await deps.fs.stat(target, signal) !== void 0) {
      return fail2("exists", `${joinRelative(parentPath, name2)} already exists`);
    }
    const sentinelPath = `${joinRelative(parentPath, name2)}/${SENTINEL_PREFIX}${randomUUID()}`;
    const sentinel = await deps.fs.resolve(sentinelPath, { cwd: deps.cwd, signal });
    if (typeof deps.fs.contains === "function" && !deps.fs.contains(resolved.root, sentinel)) {
      return fail2("outside-workspace", `${name2} would land outside the session workspace`);
    }
    await deps.fs.writeText(sentinel, "", { kind: "createIfAbsent" }, signal);
    try {
      await deps.fs.deleteFile?.(sentinel, void 0, signal);
    } catch (error) {
      const absolute = deps.fs.processPath?.(sentinel) ?? sentinel.displayPath;
      return fail2("io-error", `created the directory but could not remove ${absolute}: ${messageOf2(error)}`);
    }
    return { ok: true, path: joinRelative(parentPath, name2) };
  } catch (error) {
    return failureOf2(error);
  }
}

// src/host/ignored.ts
var MAX_IGNORED_ENTRIES = 2e4;
var GIT_IGNORED_TIMEOUT_MS = 1e4;
var MAX_STDOUT_BYTES = 8 * 1024 * 1024;
var MAX_STDERR_BYTES = 4096;
var LS_FILES_ARGV = [
  "ls-files",
  "--others",
  "--ignored",
  "--exclude-standard",
  "--directory",
  "-z"
];
function messageOf3(error) {
  return error instanceof Error ? error.message : String(error);
}
function createGitRunner() {
  return {
    run: (argv, options) => new Promise((settle) => {
      if (options.signal?.aborted === true) {
        settle({ code: null, stdout: "", stderr: "aborted before git started" });
        return;
      }
      let child;
      try {
        child = spawn("git", [...argv], {
          cwd: options.cwd,
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"]
        });
      } catch (error) {
        settle({ code: null, stdout: "", stderr: messageOf3(error) });
        return;
      }
      const chunks = [];
      let bytes = 0;
      let stderr = "";
      let truncated = false;
      let timedOut = false;
      let settled = false;
      const stop = () => {
        clearTimeout(timer);
        options.signal?.removeEventListener("abort", onAbort);
      };
      const finish = (code) => {
        if (settled) return;
        settled = true;
        stop();
        settle({
          code,
          stdout: Buffer.concat(chunks).toString("utf8"),
          stderr,
          ...truncated ? { truncated: true } : {},
          ...timedOut ? { timedOut: true } : {}
        });
      };
      const kill = () => {
        child.kill("SIGKILL");
      };
      const onAbort = () => kill();
      const timer = setTimeout(() => {
        timedOut = true;
        kill();
      }, GIT_IGNORED_TIMEOUT_MS);
      options.signal?.addEventListener("abort", onAbort, { once: true });
      child.on("error", (error) => {
        if (settled) return;
        settled = true;
        stop();
        settle({ code: null, stdout: "", stderr: messageOf3(error) });
      });
      child.stdout?.on("data", (chunk) => {
        if (truncated) return;
        bytes += chunk.length;
        if (bytes > MAX_STDOUT_BYTES) {
          truncated = true;
          chunks.push(chunk);
          kill();
          return;
        }
        chunks.push(chunk);
      });
      child.stderr?.on("data", (chunk) => {
        if (stderr.length >= MAX_STDERR_BYTES) return;
        stderr += chunk.toString("utf8").slice(0, MAX_STDERR_BYTES - stderr.length);
      });
      child.on("close", (code) => finish(code));
    })
  };
}
function noIgnored() {
  return { ok: true, ignored: { root: null, entries: [], truncated: false } };
}
function parseIgnored(stdout, cut) {
  const segments = stdout.split("\0");
  if (cut && !stdout.endsWith("\0")) segments.pop();
  const entries = [];
  const seen = /* @__PURE__ */ new Set();
  let truncated = cut;
  for (const segment of segments) {
    const entry = segment.replace(/\/+$/u, "");
    if (entry === "" || entry === "." || seen.has(entry)) continue;
    if (entries.length >= MAX_IGNORED_ENTRIES) {
      truncated = true;
      break;
    }
    seen.add(entry);
    entries.push(entry);
  }
  return { entries, truncated };
}
async function listIgnoredPaths(deps, request, signal) {
  void request;
  const options = { cwd: deps.cwd, signal };
  let probe;
  try {
    probe = await deps.git.run(["rev-parse", "--show-toplevel"], options);
  } catch {
    return noIgnored();
  }
  if (probe.timedOut === true) {
    return fail2("io-error", `git rev-parse did not finish within ${String(GIT_IGNORED_TIMEOUT_MS)}ms`);
  }
  if (probe.code !== 0) return noIgnored();
  const root = probe.stdout.trim() === "" ? null : probe.stdout.trim();
  let listing;
  try {
    listing = await deps.git.run(LS_FILES_ARGV, options);
  } catch (error) {
    return fail2("io-error", messageOf3(error));
  }
  if (listing.timedOut === true) {
    return fail2("io-error", `git ls-files did not finish within ${String(GIT_IGNORED_TIMEOUT_MS)}ms`);
  }
  if (listing.truncated !== true && listing.code !== 0) {
    const reason = listing.stderr.trim();
    return fail2("io-error", reason === "" ? `git ls-files exited with ${String(listing.code)}` : reason);
  }
  const parsed = parseIgnored(listing.stdout, listing.truncated === true);
  const ignored = { root, entries: parsed.entries, truncated: parsed.truncated };
  return { ok: true, ignored };
}

// src/bookmarks.ts
var BOOKMARK_DOMAIN_NAME = "dsh_fs_explorer";
var BOOKMARK_TABLE_NAME = "bookmarks";
var MAX_BOOKMARK_DEPTH = 32;
var MAX_NAME2 = 200;
var MAX_PATH = 4096;
function fail3(message) {
  throw new Error(`bookmarks: ${message}`);
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireText(value, field, max) {
  if (typeof value !== "string") fail3(`${field} must be a string`);
  const text = value.trim();
  if (text === "") fail3(`${field} must not be empty`);
  if (text.length > max) fail3(`${field} must be at most ${String(max)} characters`);
  return text;
}
function parseNode(value, where, depth, seen) {
  if (depth > MAX_BOOKMARK_DEPTH) {
    fail3(`${where} is nested deeper than ${String(MAX_BOOKMARK_DEPTH)} levels`);
  }
  if (!isRecord(value)) fail3(`${where} must be an object`);
  const id = requireText(value.id, `${where}.id`, MAX_NAME2);
  if (seen.has(id)) fail3(`duplicate id "${id}" at ${where}`);
  seen.add(id);
  const name2 = requireText(value.name, `${where}.name`, MAX_NAME2);
  const createdAt = value.createdAt;
  if (typeof createdAt !== "number" || !Number.isFinite(createdAt)) {
    fail3(`${where}.createdAt must be a finite number`);
  }
  const kind = value.kind;
  if (kind === "group") {
    const children = value.children;
    if (!Array.isArray(children)) fail3(`${where}.children must be an array`);
    return {
      id,
      kind: "group",
      name: name2,
      createdAt,
      children: children.map((child, index) => parseNode(child, `${where}.children[${String(index)}]`, depth + 1, seen))
    };
  }
  if (kind === "file" || kind === "folder") {
    const path2 = requireText(value.path, `${where}.path`, MAX_PATH);
    return { id, kind, name: name2, createdAt, path: path2 };
  }
  return fail3(`${where}.kind must be "group", "file" or "folder"`);
}
function parseBookmarkTree(value) {
  if (!isRecord(value)) fail3("a bookmark tree must be an object");
  if (value.version !== 1) fail3(`version must be 1, received ${JSON.stringify(value.version)}`);
  const updatedAt = requireText(value.updatedAt, "updatedAt", MAX_PATH);
  const roots = value.roots;
  if (!Array.isArray(roots)) fail3("roots must be an array");
  const seen = /* @__PURE__ */ new Set();
  return {
    version: 1,
    roots: roots.map((node, index) => parseNode(node, `roots[${String(index)}]`, 1, seen)),
    updatedAt
  };
}
var BOOKMARK_DOMAIN_SPEC = {
  name: BOOKMARK_DOMAIN_NAME,
  version: 1,
  invalidRecords: "backup-and-skip",
  tables: {
    [BOOKMARK_TABLE_NAME]: {
      valueSchema: { parse: parseBookmarkTree }
    }
  }
};

// src/host/bookmarks.ts
async function openBookmarkStore(storageDomain) {
  if (storageDomain === void 0) return null;
  const domain = await storageDomain.open(BOOKMARK_DOMAIN_SPEC);
  const table = domain.table(BOOKMARK_TABLE_NAME);
  return {
    async load(key) {
      const stored = table.get(key);
      if (stored === void 0 || stored === null) return null;
      try {
        return parseBookmarkTree(stored);
      } catch {
        return null;
      }
    },
    async save(key, tree) {
      await table.put(key, parseBookmarkTree(tree));
    },
    async close() {
      await domain.close();
    }
  };
}

// src/shared.ts
var PACKAGE_NAME = "dsh-fs-explorer";
var VIEW_SLOT = "conversation.view";
var VIEW_ID = "fs-explorer";
var VIEW_ORDER = 100;
var DOCUMENTS_SERVICE = "fsExplorerDocuments";
var WORKSPACE_SERVICE = "fsExplorerWorkspace";

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["fs", "sessions", "sessionPersistence"];
function describe() {
  return { name: PACKAGE_NAME, slot: VIEW_SLOT, id: VIEW_ID, order: VIEW_ORDER };
}
function realWorkspaceEnv() {
  const spawn2 = (command, args, options) => nodeSpawn(command, [...args], options);
  return { platform: process.platform, env: process.env, spawn: spawn2, release: osRelease(), git: createGitRunner() };
}
function readService(ctx, service) {
  const reader = ctx;
  const value = reader.get?.call(ctx, service);
  return value === null ? void 0 : value;
}
async function baseDirectory(sessions, sessionPersistence, sessionId) {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return live;
  try {
    const persisted = (await sessionPersistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return persisted;
  } catch {
  }
  return void 0;
}
var _locate_dec, _save_dec, _open_dec, _a, _init;
var FsExplorerDocumentsService = class extends (_a = TypertRemoteService, _open_dec = [Remote("open")], _save_dec = [Remote("save")], _locate_dec = [Remote("locate")], _a) {
  constructor(ctx, config) {
    super(ctx, DOCUMENTS_SERVICE);
    __runInitializers(_init, 5, this);
    __publicField(this, "fs");
    __publicField(this, "sessions");
    __publicField(this, "sessionPersistence");
    __publicField(this, "config");
    this.config = normalizeConfig(config);
    const fs = readService(ctx, "fs");
    if (fs === void 0) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs;
    this.sessions = readService(ctx, "sessions");
    this.sessionPersistence = readService(ctx, "sessionPersistence");
  }
  /** Resolve the working directory this request's path is relative to. */
  async baseDirectory(sessionId) {
    return baseDirectory(this.sessions, this.sessionPersistence, sessionId);
  }
  async open(request, signal) {
    const cwd = await this.baseDirectory(request.sessionId);
    if (cwd === void 0) return fail("no-workspace", `session ${request.sessionId} has no workspace directory`);
    return openDocument({ fs: this.fs, cwd, maxBytes: this.config.maxBytes }, request, signal);
  }
  async save(request, signal) {
    const cwd = await this.baseDirectory(request.sessionId);
    if (cwd === void 0) return fail("no-workspace", `session ${request.sessionId} has no workspace directory`);
    return saveDocument({ fs: this.fs, cwd, maxBytes: this.config.maxBytes }, request, signal);
  }
  async locate(request, signal) {
    const cwd = await this.baseDirectory(request.sessionId);
    if (cwd === void 0) return fail("no-workspace", `session ${request.sessionId} has no workspace directory`);
    return locatePath({ fs: this.fs, cwd, maxBytes: this.config.maxBytes }, request, signal);
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "open", _open_dec, FsExplorerDocumentsService);
__decorateElement(_init, 1, "save", _save_dec, FsExplorerDocumentsService);
__decorateElement(_init, 1, "locate", _locate_dec, FsExplorerDocumentsService);
__decoratorMetadata(_init, FsExplorerDocumentsService);
__publicField(FsExplorerDocumentsService, "inject", inject);
__publicField(FsExplorerDocumentsService, "Config", Schema.object({
  maxBytes: Schema.number().default(DEFAULT_DOCUMENTS_CONFIG.maxBytes).description("\u5355\u4EFD\u53EF\u8BFB\u53D6\u4E0E\u4FDD\u5B58\u7684\u6587\u6863\u5B57\u8282\u4E0A\u9650")
}));
var _saveBookmarks_dec, _loadBookmarks_dec, _ignored_dec, _create_dec, _reveal_dec, _info_dec, _capabilities_dec, _a2, _init2;
var FsExplorerWorkspaceService = class extends (_a2 = TypertRemoteService, _capabilities_dec = [Remote("capabilities")], _info_dec = [Remote("info")], _reveal_dec = [Remote("reveal")], _create_dec = [Remote("create")], _ignored_dec = [Remote("ignored")], _loadBookmarks_dec = [Remote("loadBookmarks")], _saveBookmarks_dec = [Remote("saveBookmarks")], _a2) {
  constructor(ctx, env) {
    super(ctx, WORKSPACE_SERVICE);
    __runInitializers(_init2, 5, this);
    __publicField(this, "fs");
    __publicField(this, "sessions");
    __publicField(this, "sessionPersistence");
    __publicField(this, "storageDomain");
    __publicField(this, "env");
    /**
     * The bookmark store, opened once and remembered.
     *
     * Lazy because opening it touches the host's storage directory, and a session
     * that never opens the bookmark bar should not pay for that. Remembered
     * because the domain holds an open handle: reopening it per request would leak
     * one handle per bookmark action.
     *
     * A host without `storageDomain` resolves to null, which every endpoint below
     * turns into `no-storage` rather than an error the reader cannot act on.
     */
    __publicField(this, "storePromise");
    const fs = readService(ctx, "fs");
    if (fs === void 0) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs;
    this.sessions = readService(ctx, "sessions");
    this.sessionPersistence = readService(ctx, "sessionPersistence");
    this.storageDomain = readService(ctx, "storageDomain");
    this.env = env ?? realWorkspaceEnv();
  }
  /** Resolve one request's dependencies, or the failure to answer with. */
  async deps(sessionId) {
    const cwd = await baseDirectory(this.sessions, this.sessionPersistence, sessionId);
    if (cwd === void 0) return fail2("no-workspace", `session ${sessionId} has no workspace directory`);
    return { fs: this.fs, cwd, env: this.env };
  }
  async capabilities(request) {
    void request;
    return capabilitiesResult(this.env);
  }
  async info(request, signal) {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    return describeWorkspacePath(deps, request, signal);
  }
  async reveal(request, signal) {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    return revealWorkspacePath(deps, request, signal);
  }
  async create(request, signal) {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    return createWorkspaceEntry(deps, request, signal);
  }
  async ignored(request, signal) {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    const git = this.env.git;
    if (git === void 0) return fail2("io-error", "this host has no git runner");
    return listIgnoredPaths({ cwd: deps.cwd, git }, request, signal);
  }
  bookmarkStore() {
    this.storePromise ??= openBookmarkStore(this.storageDomain).catch(() => {
      this.storePromise = void 0;
      return null;
    });
    return this.storePromise;
  }
  /**
   * The storage key one session's bookmarks live under.
   *
   * The workspace's canonical path, not the session id: two sessions in one
   * workspace are the same place, and a reader who opens a second conversation
   * there expects the same bookmarks. `processPath` is the one value a backend
   * documents as an absolute path in its execution world; `displayPath` is the
   * fallback for a fake that omits it.
   * @param sessionId - the session whose workspace to key.
   * @returns the key, or the failure to answer with.
   */
  async bookmarkKey(sessionId) {
    const deps = await this.deps(sessionId);
    if ("ok" in deps) return deps;
    try {
      const target = await deps.fs.resolve(deps.cwd, { cwd: deps.cwd });
      return deps.fs.processPath?.(target) ?? target.displayPath;
    } catch (error) {
      return fail2("io-error", error instanceof Error ? error.message : String(error));
    }
  }
  async loadBookmarks(request) {
    const key = await this.bookmarkKey(request.sessionId);
    if (typeof key !== "string") return key;
    const store = await this.bookmarkStore();
    if (store === null) {
      return fail2("no-storage", "this host has no storage domain; bookmarks stay in the browser");
    }
    try {
      return { ok: true, tree: await store.load(key) };
    } catch (error) {
      return fail2("io-error", error instanceof Error ? error.message : String(error));
    }
  }
  async saveBookmarks(request) {
    const key = await this.bookmarkKey(request.sessionId);
    if (typeof key !== "string") return key;
    const store = await this.bookmarkStore();
    if (store === null) {
      return fail2("no-storage", "this host has no storage domain; bookmarks stay in the browser");
    }
    try {
      await store.save(key, request.tree);
      return { ok: true };
    } catch (error) {
      return fail2("io-error", error instanceof Error ? error.message : String(error));
    }
  }
};
_init2 = __decoratorStart(_a2);
__decorateElement(_init2, 1, "capabilities", _capabilities_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "info", _info_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "reveal", _reveal_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "create", _create_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "ignored", _ignored_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "loadBookmarks", _loadBookmarks_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "saveBookmarks", _saveBookmarks_dec, FsExplorerWorkspaceService);
__decoratorMetadata(_init2, FsExplorerWorkspaceService);
__publicField(FsExplorerWorkspaceService, "inject", ["fs"]);
function apply(ctx, config) {
  new FsExplorerDocumentsService(ctx, config);
  new FsExplorerWorkspaceService(ctx);
}
apply.inject = inject;
var index_default = apply;
export {
  DEFAULT_DOCUMENTS_CONFIG,
  DOCUMENTS_SERVICE,
  FsExplorerDocumentsService,
  FsExplorerWorkspaceService,
  PACKAGE_NAME,
  VIEW_ID,
  VIEW_ORDER,
  VIEW_SLOT,
  WORKSPACE_SERVICE,
  apply,
  index_default as default,
  describe,
  inject,
  name,
  normalizeConfig
};
