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

// src/shared.ts
var PACKAGE_NAME = "dsh-fs-explorer";
var VIEW_SLOT = "conversation.view";
var VIEW_ID = "fs-explorer";
var VIEW_ORDER = 100;
var DOCUMENTS_SERVICE = "fsExplorerDocuments";

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["fs", "sessions", "sessionPersistence"];
function describe() {
  return { name: PACKAGE_NAME, slot: VIEW_SLOT, id: VIEW_ID, order: VIEW_ORDER };
}
var _save_dec, _open_dec, _a, _init;
var FsExplorerDocumentsService = class extends (_a = TypertRemoteService, _open_dec = [Remote("open")], _save_dec = [Remote("save")], _a) {
  constructor(ctx, config) {
    super(ctx, DOCUMENTS_SERVICE);
    __runInitializers(_init, 5, this);
    __publicField(this, "fs");
    __publicField(this, "sessions");
    __publicField(this, "sessionPersistence");
    __publicField(this, "config");
    this.config = normalizeConfig(config);
    const reader = ctx;
    const read = (service) => {
      const value = reader.get?.call(ctx, service);
      return value === null ? void 0 : value;
    };
    const fs = read("fs");
    console.info(
      `[dsh-fs-explorer] documents activating; services=${JSON.stringify({
        fs: fs !== void 0,
        sessions: read("sessions") !== void 0,
        sessionPersistence: read("sessionPersistence") !== void 0
      })}`
    );
    if (fs === void 0) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs;
    this.sessions = read("sessions");
    this.sessionPersistence = read("sessionPersistence");
  }
  /**
   * Resolve the working directory a request's path is relative to.
   *
   * Order: live session header, then persisted header. There is deliberately no
   * `process.cwd()` last resort — a save must never land in whatever directory
   * the host process happens to run from.
   */
  async baseDirectory(sessionId) {
    const live = this.sessions?.get(sessionId)?.header?.cwd;
    if (typeof live === "string" && live !== "") return live;
    try {
      const persisted = (await this.sessionPersistence?.stat(sessionId))?.header?.cwd;
      if (typeof persisted === "string" && persisted !== "") return persisted;
    } catch {
    }
    return void 0;
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
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "open", _open_dec, FsExplorerDocumentsService);
__decorateElement(_init, 1, "save", _save_dec, FsExplorerDocumentsService);
__decoratorMetadata(_init, FsExplorerDocumentsService);
__publicField(FsExplorerDocumentsService, "inject", inject);
__publicField(FsExplorerDocumentsService, "Config", Schema.object({
  maxBytes: Schema.number().default(DEFAULT_DOCUMENTS_CONFIG.maxBytes).description("\u5355\u4EFD\u53EF\u8BFB\u53D6\u4E0E\u4FDD\u5B58\u7684\u6587\u6863\u5B57\u8282\u4E0A\u9650")
}));
var index_default = FsExplorerDocumentsService;
export {
  DEFAULT_DOCUMENTS_CONFIG,
  DOCUMENTS_SERVICE,
  FsExplorerDocumentsService,
  PACKAGE_NAME,
  VIEW_ID,
  VIEW_ORDER,
  VIEW_SLOT,
  index_default as default,
  describe,
  inject,
  name,
  normalizeConfig
};
