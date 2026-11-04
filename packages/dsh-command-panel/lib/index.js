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
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/host/native-open.ts
import { spawn as nodeSpawn } from "node:child_process";
import { stat as nodeStat } from "node:fs/promises";
import { release } from "node:os";
import path from "node:path";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// src/shared.ts
var PATH_SERVICE = "pathExplorer";
var SHUTDOWN_SERVICE = "hostShutdown";
var OPEN_SERVICE = "nativeOpen";

// src/host/native-open.ts
var REAL_ENV = {
  platform: process.platform,
  env: process.env,
  stat: (target) => nodeStat(target),
  spawn: (command, args, options) => nodeSpawn(command, [...args], options),
  release: release()
};
function pathOf(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}
function isWsl(env) {
  if (env.env.WSL_DISTRO_NAME !== void 0 && env.env.WSL_DISTRO_NAME !== "") return true;
  if (env.env.WSL_INTEROP !== void 0 && env.env.WSL_INTEROP !== "") return true;
  return (env.release ?? "").toLowerCase().includes("microsoft");
}
function commandFor(target, env) {
  if (env.platform === "darwin") return { command: "open", args: [target] };
  if (env.platform === "win32") {
    return { command: "cmd.exe", args: ["/d", "/s", "/c", "start", "", target] };
  }
  if (env.platform === "linux") {
    const display = env.env.DISPLAY !== void 0 && env.env.DISPLAY !== "";
    const wayland = env.env.WAYLAND_DISPLAY !== void 0 && env.env.WAYLAND_DISPLAY !== "";
    if (!display && !wayland && !isWsl(env)) return void 0;
    return { command: "xdg-open", args: [target] };
  }
  return void 0;
}
async function openWithDefaultApp(target, env = REAL_ENV) {
  if (target === "") return "unavailable";
  const paths = pathOf(env.platform);
  if (!paths.isAbsolute(target)) return "unavailable";
  const absolute = paths.resolve(target);
  try {
    await env.stat(absolute);
  } catch {
    return "unavailable";
  }
  const command = commandFor(absolute, env);
  if (command === void 0) return "unavailable";
  return new Promise((settle) => {
    let child;
    try {
      child = env.spawn(command.command, command.args, { stdio: "ignore", windowsHide: true });
    } catch {
      settle("failed");
      return;
    }
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      settle(result);
    };
    child.on("error", () => {
      finish("failed");
    });
    child.on("exit", (code) => finish(code === 0 ? "opened" : "failed"));
  });
}
var _open_dec, _a, _init;
var NativeOpenService = class extends (_a = TypertRemoteService, _open_dec = [Remote("open")], _a) {
  constructor(ctx) {
    super(ctx, OPEN_SERVICE);
    __runInitializers(_init, 5, this);
  }
  async open(request, signal) {
    void signal;
    const path2 = request?.path;
    if (typeof path2 !== "string") return "unavailable";
    return openWithDefaultApp(path2);
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "open", _open_dec, NativeOpenService);
__decoratorMetadata(_init, NativeOpenService);
__publicField(NativeOpenService, "inject", []);

// src/host/path-explorer.ts
import { lstat, readdir, realpath, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, normalize, resolve } from "node:path";
import { Remote as Remote2, TypertRemoteService as TypertRemoteService2 } from "@deepseek-ai/dsh-typert-protocol";
var DEFAULT_LIMIT = 20;
var MAX_LIMIT = 100;
function clampLimit(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, Math.trunc(value)));
}
function expandHome(query, home) {
  if (query === "~") return home;
  if (query.startsWith("~/") || query.startsWith("~\\")) return `${home}${query.slice(1)}`;
  return query;
}
function invalid(message) {
  return { ok: false, error: { code: "invalid-request", message } };
}
async function statOf(target) {
  try {
    return await stat(target);
  } catch {
    return void 0;
  }
}
async function inspectPath(path2) {
  let entry;
  try {
    entry = await lstat(path2);
  } catch {
    return void 0;
  }
  if (!entry.isSymbolicLink()) {
    return { path: path2, kind: entry.isDirectory() ? "directory" : "file", exists: true };
  }
  const link = await realpath(path2).catch(() => void 0);
  const info = link === void 0 ? void 0 : await stat(link).catch(() => void 0);
  return {
    path: path2,
    kind: info?.isDirectory() === true ? "directory" : "file",
    exists: true,
    ...link === void 0 ? {} : { link }
  };
}
async function childrenOf(directory) {
  let dirents;
  try {
    dirents = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  const entries = [];
  for (const dirent of dirents) {
    const path2 = `${directory}${dirent.name}`;
    if (!dirent.isSymbolicLink()) {
      entries.push({ path: path2, kind: dirent.isDirectory() ? "directory" : "file", exists: true });
      continue;
    }
    const link = await realpath(path2).catch(() => void 0);
    const info = link === void 0 ? void 0 : await stat(link).catch(() => void 0);
    entries.push({
      path: path2,
      kind: info?.isDirectory() === true ? "directory" : "file",
      exists: true,
      ...link === void 0 ? {} : { link }
    });
  }
  entries.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === "directory" ? -1 : 1;
    return left.path.toLowerCase() < right.path.toLowerCase() ? -1 : 1;
  });
  return entries;
}
var _inspect_dec, _resolve_dec, _a2, _init2;
var PathExplorerService = class extends (_a2 = TypertRemoteService2, _resolve_dec = [Remote2("resolve")], _inspect_dec = [Remote2("inspect")], _a2) {
  constructor(ctx) {
    super(ctx, PATH_SERVICE);
    __runInitializers(_init2, 5, this);
  }
  async resolve(request, signal) {
    void signal;
    const home = homedir();
    const query = request.query;
    if (typeof query !== "string" || query === "") return invalid("query must be a non-empty string");
    if (query !== "~" && (query.split(/[\\/]/, 1)[0] ?? "") !== ".." && !query.includes("/") && !query.includes("\\")) {
      return invalid("query must contain a path separator or a parent step");
    }
    const expanded = expandHome(query, home);
    let target;
    if (isAbsolute(expanded)) {
      target = normalize(expanded);
    } else if (expanded.startsWith("~")) {
      target = normalize(expanded);
    } else {
      const base = request.base;
      if (typeof base !== "string" || base === "" || !isAbsolute(base)) {
        return invalid("relative queries need an absolute session base directory");
      }
      target = normalize(resolve(base, expanded));
    }
    const lastSeparator = Math.max(target.lastIndexOf("/"), target.lastIndexOf("\\"));
    const namesDirectory = query === "~" || query === ".." || query.endsWith("/..") || query.endsWith("\\..") || lastSeparator === target.length - 1;
    const directory = namesDirectory ? /[\\/]$/.test(target) ? target : `${target}/` : target.slice(0, lastSeparator + 1);
    const fragment = namesDirectory ? "" : target.slice(lastSeparator + 1);
    const needle = fragment.toLowerCase();
    const entries = [];
    if ((await statOf(directory))?.isDirectory() === true) {
      const children = await childrenOf(directory);
      for (const child of children) {
        if (child.path === target) continue;
        if (needle !== "" && !child.path.slice(directory.length).toLowerCase().startsWith(needle)) continue;
        entries.push(child);
      }
    }
    if (!namesDirectory) {
      const entry = await inspectPath(target);
      if (entry !== void 0) entries.unshift(entry);
    }
    return { ok: true, home, entries: entries.slice(0, clampLimit(request.limit)) };
  }
  async inspect(request, signal) {
    void signal;
    const raw = request?.path;
    if (typeof raw !== "string" || !isAbsolute(raw)) throw new Error("path must be an absolute path");
    const path2 = resolve(raw);
    let entry;
    try {
      entry = await lstat(path2);
    } catch {
      return { kind: "missing" };
    }
    if (!entry.isSymbolicLink()) {
      return { kind: entry.isFile() ? "file" : entry.isDirectory() ? "directory" : "other" };
    }
    try {
      const target = await realpath(path2);
      const info = await stat(target);
      return {
        kind: "symlink",
        target,
        targetKind: info.isFile() ? "file" : info.isDirectory() ? "directory" : "other"
      };
    } catch {
      return { kind: "symlink" };
    }
  }
};
_init2 = __decoratorStart(_a2);
__decorateElement(_init2, 1, "resolve", _resolve_dec, PathExplorerService);
__decorateElement(_init2, 1, "inspect", _inspect_dec, PathExplorerService);
__decoratorMetadata(_init2, PathExplorerService);
__publicField(PathExplorerService, "inject", []);

// src/host/shutdown-remote.ts
import { Remote as Remote3, TypertRemoteService as TypertRemoteService3 } from "@deepseek-ai/dsh-typert-protocol";

// src/host/shutdown.ts
function requestShutdown(ctx) {
  try {
    const exit = ctx.get?.("appExit", false);
    if (typeof exit !== "function") return "unavailable";
    exit(0);
    return "requested";
  } catch {
    return "unavailable";
  }
}

// src/host/shutdown-remote.ts
var _request_dec, _a3, _ctx, _init3;
var HostShutdownService = class extends (_a3 = TypertRemoteService3, _request_dec = [Remote3("request")], _a3) {
  constructor(ctx) {
    super(ctx, SHUTDOWN_SERVICE);
    __runInitializers(_init3, 5, this);
    __privateAdd(this, _ctx);
    __privateSet(this, _ctx, ctx);
  }
  async request() {
    return requestShutdown(__privateGet(this, _ctx));
  }
};
_init3 = __decoratorStart(_a3);
_ctx = new WeakMap();
__decorateElement(_init3, 1, "request", _request_dec, HostShutdownService);
__decoratorMetadata(_init3, HostShutdownService);
__publicField(HostShutdownService, "inject", []);

// src/index.ts
var name = "dsh-command-panel";
var inject = [];
function apply(ctx) {
  new PathExplorerService(ctx);
  new HostShutdownService(ctx);
  new NativeOpenService(ctx);
}
export {
  HostShutdownService,
  NativeOpenService,
  OPEN_SERVICE,
  PATH_SERVICE,
  PathExplorerService,
  SHUTDOWN_SERVICE,
  apply as default,
  inject,
  name,
  requestShutdown
};
