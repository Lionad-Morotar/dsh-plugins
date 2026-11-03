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

// src/host/workspace.ts
import path from "node:path";
var MAX_MESSAGE2 = 600;
function messageOf2(error) {
  return error instanceof Error ? error.message : String(error);
}
function fail2(code, message) {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE2) } };
}
var FS_FAILURES2 = {
  FS_NOT_FOUND: "not-found",
  FS_NOT_DIRECTORY: "not-found",
  FS_PERMISSION_DENIED: "permission"
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
  const spawn = (command, args, options) => nodeSpawn(command, [...args], options);
  return { platform: process.platform, env: process.env, spawn, release: osRelease() };
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
var _reveal_dec, _info_dec, _capabilities_dec, _a2, _init2;
var FsExplorerWorkspaceService = class extends (_a2 = TypertRemoteService, _capabilities_dec = [Remote("capabilities")], _info_dec = [Remote("info")], _reveal_dec = [Remote("reveal")], _a2) {
  constructor(ctx, env) {
    super(ctx, WORKSPACE_SERVICE);
    __runInitializers(_init2, 5, this);
    __publicField(this, "fs");
    __publicField(this, "sessions");
    __publicField(this, "sessionPersistence");
    __publicField(this, "env");
    const fs = readService(ctx, "fs");
    if (fs === void 0) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs;
    this.sessions = readService(ctx, "sessions");
    this.sessionPersistence = readService(ctx, "sessionPersistence");
    this.env = env ?? realWorkspaceEnv();
  }
  /** Resolve one request's dependencies, or the failure to answer with. */
  async deps(sessionId) {
    const cwd = await baseDirectory(this.sessions, this.sessionPersistence, sessionId);
    if (cwd === void 0) return fail2("no-workspace", `session ${sessionId} has no workspace directory`);
    return { fs: this.fs, cwd, env: this.env };
  }
  capabilities(request) {
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
};
_init2 = __decoratorStart(_a2);
__decorateElement(_init2, 1, "capabilities", _capabilities_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "info", _info_dec, FsExplorerWorkspaceService);
__decorateElement(_init2, 1, "reveal", _reveal_dec, FsExplorerWorkspaceService);
__decoratorMetadata(_init2, FsExplorerWorkspaceService);
__publicField(FsExplorerWorkspaceService, "inject", ["fs"]);
function apply(ctx, config) {
  new FsExplorerDocumentsService(ctx, config);
  new FsExplorerWorkspaceService(ctx);
}
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
