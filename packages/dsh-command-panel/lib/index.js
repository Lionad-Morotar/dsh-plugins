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

// src/host/path-explorer.ts
import { readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, normalize, resolve } from "node:path";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// src/shared.ts
var PATH_SERVICE = "pathExplorer";

// src/host/path-explorer.ts
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
async function childrenOf(directory) {
  let dirents;
  try {
    dirents = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  const entries = dirents.map((dirent) => ({
    path: `${directory}${dirent.name}`,
    kind: dirent.isDirectory() ? "directory" : "file",
    exists: true
  }));
  entries.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === "directory" ? -1 : 1;
    return left.path.toLowerCase() < right.path.toLowerCase() ? -1 : 1;
  });
  return entries;
}
var _resolve_dec, _a, _init;
var PathExplorerService = class extends (_a = TypertRemoteService, _resolve_dec = [Remote("resolve")], _a) {
  constructor(ctx) {
    super(ctx, PATH_SERVICE);
    __runInitializers(_init, 5, this);
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
      const self = await statOf(target);
      if (self !== void 0) {
        entries.unshift({ path: target, kind: self.isDirectory() ? "directory" : "file", exists: true });
      }
    }
    return { ok: true, home, entries: entries.slice(0, clampLimit(request.limit)) };
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "resolve", _resolve_dec, PathExplorerService);
__decoratorMetadata(_init, PathExplorerService);
__publicField(PathExplorerService, "inject", []);

// src/index.ts
var name = "dsh-command-panel";
var inject = [];
var index_default = PathExplorerService;
export {
  PATH_SERVICE,
  PathExplorerService,
  index_default as default,
  inject,
  name
};
