// src/clipboard.ts
var MISSING_TOOL = -2;
var ESC = "\x1B";
var BEL = "\x07";
var ST = "\x1B\\";
function osc52Sequence(text) {
  return ESC + "]52;c;" + Buffer.from(text, "utf8").toString("base64") + BEL;
}
function tmuxSequence(text) {
  const payload = ESC + "]52;c;" + Buffer.from(text, "utf8").toString("base64") + BEL;
  return ESC + "Ptmux;" + payload.replaceAll(ESC, ESC + ESC) + ST;
}
function nativeHelpers(platform) {
  if (platform === "darwin") return [["pbcopy", []]];
  if (platform === "win32") return [["clip", []]];
  if (platform === "linux") {
    return [
      ["wl-copy", []],
      ["xclip", ["-selection", "clipboard"]],
      ["xsel", ["--clipboard", "--input"]]
    ];
  }
  return [];
}
async function copyToClipboard(text, deps) {
  const bytes = Buffer.byteLength(text, "utf8");
  const inTmux = (deps.env["TMUX"] ?? "") !== "";
  const helpers = deps.env["SSH_CONNECTION"] === void 0 ? nativeHelpers(deps.platform) : [];
  let nativeLanded = false;
  let nativeRan = false;
  const nativeAttempt = (async () => {
    for (const [command, args] of helpers) {
      const code = await runSafely(() => deps.exec(command, args, text));
      if (code !== MISSING_TOOL) nativeRan = true;
      if (code === 0) {
        nativeLanded = true;
        return;
      }
    }
  })();
  let bufferLanded = false;
  if (inTmux) {
    const args = deps.env["LC_TERMINAL"] === "iTerm2" ? ["load-buffer", "-"] : ["load-buffer", "-w", "-"];
    bufferLanded = await runSafely(() => deps.exec("tmux", args, text)) === 0;
  }
  deps.write(bufferLanded ? tmuxSequence(text) : osc52Sequence(text));
  await nativeAttempt;
  const attempted = [];
  if (nativeRan) attempted.push("native");
  if (inTmux) attempted.push("tmux-buffer");
  attempted.push("osc52");
  const landed = [];
  if (nativeLanded) landed.push("native");
  if (bufferLanded) landed.push("tmux-buffer");
  const hadVerifiablePath = attempted.some((path) => path !== "osc52");
  return { attempted, landed, bytes, degraded: hadVerifiablePath && landed.length === 0 };
}
async function runSafely(run) {
  try {
    return await run();
  } catch {
    return 1;
  }
}

// src/archive.ts
var ARCHIVE_COMMAND_NAME = "archive";
var ARCHIVE_COMMAND_DESCRIPTION = "Archive the current session (--stop also stops its running work)";
var UNARCHIVE_COMMAND_NAME = "unarchive";
var UNARCHIVE_COMMAND_DESCRIPTION = "Bring the current session back from the archive";
var ARCHIVE_USAGE = "\u7528\u6CD5\uFF1A/archive [--stop]";
var UNARCHIVE_USAGE = "\u7528\u6CD5\uFF1A/unarchive";
var STOP_FLAG = "--stop";
function parseArchiveInput(rawInput) {
  const tokens = rawInput.trim().split(/\s+/u).filter((token) => token !== "");
  let stopActivity = false;
  for (const token of tokens) {
    if (token !== STOP_FLAG) return { ok: false, message: ARCHIVE_USAGE };
    if (stopActivity) return { ok: false, message: ARCHIVE_USAGE };
    stopActivity = true;
  }
  return { ok: true, stopActivity };
}
function parseUnarchiveInput(rawInput) {
  if (rawInput.trim().length !== 0) return { ok: false, message: UNARCHIVE_USAGE };
  return { ok: true };
}

// src/archive-command.ts
var ARCHIVE_DONE = "\u4F1A\u8BDD\u5DF2\u5F52\u6863\u3002\u5F52\u6863\u7684\u4F1A\u8BDD\u53EF\u5728\u4F1A\u8BDD\u5217\u8868\u7684\u300C\u5F52\u6863\u300D\u89C6\u56FE\u4E2D\u627E\u56DE\u3002";
var ARCHIVE_DONE_WITH_STOP = "\u4F1A\u8BDD\u5DF2\u5F52\u6863\uFF0C\u5176\u8FD0\u884C\u4E2D\u5DE5\u4F5C\u7684\u505C\u6B62\u5DF2\u8BF7\u6C42\u3002\u5F52\u6863\u7684\u4F1A\u8BDD\u53EF\u5728\u4F1A\u8BDD\u5217\u8868\u7684\u300C\u5F52\u6863\u300D\u89C6\u56FE\u4E2D\u627E\u56DE\u3002";
var ARCHIVE_SESSION_MISSING = "/archive \u5F53\u524D\u4F1A\u8BDD\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u5F52\u6863";
var ARCHIVE_SERVICE_MISSING = "/archive \u9700\u8981 workspace \u670D\u52A1\uFF0C\u5F53\u524D\u7EC4\u5408\u6CA1\u6709\u6302\u8F7D\u5B83";
var UNARCHIVE_DONE = "\u4F1A\u8BDD\u5DF2\u53D6\u6D88\u5F52\u6863\uFF0C\u56DE\u5230\u4F1A\u8BDD\u5217\u8868\u3002";
var UNARCHIVE_SESSION_MISSING = "/unarchive \u5F53\u524D\u4F1A\u8BDD\u4E0D\u53EF\u7528";
var UNARCHIVE_SERVICE_MISSING = "/unarchive \u9700\u8981 workspace \u670D\u52A1\uFF0C\u5F53\u524D\u7EC4\u5408\u6CA1\u6709\u6302\u8F7D\u5B83";
function workspaceRegistryOf(ctx) {
  const viaGet = ctx.get?.("workspaceRegistry");
  if (typeof viaGet === "object" && viaGet !== null) return viaGet;
  const direct = ctx.workspaceRegistry;
  return typeof direct === "object" && direct !== null ? direct : void 0;
}
function archiveRejectionOf(error) {
  const name2 = typeof error === "object" && error !== null ? error.name : void 0;
  if (name2 === "WorkspaceActiveSessionError") {
    const activity = error.activity;
    return {
      kind: "active",
      ...Array.isArray(activity) ? { activity } : {}
    };
  }
  if (name2 === "WorkspaceUnknownSessionError") return { kind: "unknown" };
  return { kind: "unavailable" };
}
var FAMILY_LABELS = {
  turn: "\u4E00\u8F6E\u5BF9\u8BDD\u8FDB\u884C\u4E2D",
  subagent: "\u5B50\u4EE3\u7406",
  job: "\u540E\u53F0\u4EFB\u52A1",
  schedule: "\u5B9A\u65F6\u4EFB\u52A1"
};
var MAX_LISTED_LABELS = 3;
function activityPhrase(entry) {
  const family = FAMILY_LABELS[entry.kind] ?? entry.kind;
  if (entry.kind === "turn") return family;
  const items = entry.items ?? [];
  const labels = items.map((item) => item.label ?? item.id).filter((label) => label !== "");
  if (labels.length === 0) return items.length > 0 ? `${family} \xD7${items.length}` : family;
  const shown = labels.slice(0, MAX_LISTED_LABELS);
  const rest = labels.length - shown.length;
  const listed = rest > 0 ? `${shown.join("\u3001")} \u7B49 ${labels.length} \u4E2A` : shown.join("\u3001");
  return `${family}\uFF08${listed}\uFF09`;
}
function activitySentence(activity) {
  if (activity.length === 0) return "\u4F1A\u8BDD\u4ECD\u5728\u8FD0\u884C";
  return activity.map(activityPhrase).join("\u3001");
}
function archiveRejectionMessage(rejection) {
  switch (rejection.kind) {
    case "active":
      return `\u4F1A\u8BDD\u4ECD\u5728\u8FD0\u884C\uFF08${activitySentence(rejection.activity ?? [])}\uFF09\u3002\u7528 /archive --stop \u505C\u6B62\u5B83\u4EEC\u5E76\u5F52\u6863\u3002`;
    case "unknown":
      return "\u4F1A\u8BDD\u4E0D\u5B58\u5728\u6216\u5DF2\u7ED3\u675F\uFF0C\u65E0\u6CD5\u5F52\u6863\u3002";
    case "unavailable":
      return "\u5F52\u6863\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002";
  }
}
function createArchiveCommand(ctx) {
  return {
    name: ARCHIVE_COMMAND_NAME,
    description: ARCHIVE_COMMAND_DESCRIPTION,
    // The descriptor is load-bearing beyond its hint: the web/desktop slash
    // input only hands argument-bearing invocations to commands that declare
    // an input, so without it `/archive --stop` would never reach this
    // handler at all — the whole line would go to the model as a prompt
    // (found by the closing review against the host's matchEnter).
    input: { hint: "[--stop]" },
    async handler(invocation) {
      const parsed = parseArchiveInput(invocation.rawInput);
      if (!parsed.ok) return { kind: "error", text: parsed.message };
      const registry = workspaceRegistryOf(ctx);
      const archive = registry?.archiveSession;
      if (typeof archive !== "function") return { kind: "error", text: ARCHIVE_SERVICE_MISSING };
      const sessionId = invocation.agent.session?.id;
      if (sessionId === void 0) return { kind: "error", text: ARCHIVE_SESSION_MISSING };
      try {
        await archive.call(registry, sessionId, parsed.stopActivity ? { stopActivity: true } : void 0);
        return { kind: "success", text: parsed.stopActivity ? ARCHIVE_DONE_WITH_STOP : ARCHIVE_DONE };
      } catch (error) {
        const rejection = archiveRejectionOf(error);
        if (rejection.kind === "unavailable") {
          const detail = error instanceof Error ? error.message : String(error);
          ctx.logger?.warn?.(`/archive failed: ${detail}`);
          return { kind: "error", text: `\u5F52\u6863\u5931\u8D25\uFF1A${detail}` };
        }
        return { kind: "error", text: archiveRejectionMessage(rejection) };
      }
    }
  };
}
function createUnarchiveCommand(ctx) {
  return {
    name: UNARCHIVE_COMMAND_NAME,
    description: UNARCHIVE_COMMAND_DESCRIPTION,
    async handler(invocation) {
      const parsed = parseUnarchiveInput(invocation.rawInput);
      if (!parsed.ok) return { kind: "error", text: parsed.message };
      const registry = workspaceRegistryOf(ctx);
      const unarchive = registry?.unarchiveSession;
      if (typeof unarchive !== "function") return { kind: "error", text: UNARCHIVE_SERVICE_MISSING };
      const sessionId = invocation.agent.session?.id;
      if (sessionId === void 0) return { kind: "error", text: UNARCHIVE_SESSION_MISSING };
      try {
        await unarchive.call(registry, sessionId);
        return { kind: "success", text: UNARCHIVE_DONE };
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return { kind: "error", text: `/unarchive \u53D6\u6D88\u5F52\u6863\u5931\u8D25\uFF1A${detail}` };
      }
    }
  };
}
function registerArchiveCommands(ctx) {
  const commands = ctx.get?.("commands", false) ?? ctx.commands;
  if (typeof commands?.register !== "function") {
    throw new Error("archive commands cannot register: the commands service is not mounted on this context");
  }
  const disposeArchive = commands.register(createArchiveCommand(ctx));
  const disposeUnarchive = commands.register(createUnarchiveCommand(ctx));
  return () => {
    disposeUnarchive();
    disposeArchive();
  };
}

// src/arguments.ts
var MAX_COUNT = 50;
var USAGE = "Usage: /copy [<number=1>] [--all]";
var INCLUDE_USER_FLAGS = /* @__PURE__ */ new Set(["--all", "-a"]);
function parseCopyInput(rawInput) {
  const tokens = rawInput.trim().split(/\s+/u).filter((token) => token !== "");
  let count;
  let includeUser = false;
  for (const token of tokens) {
    if (INCLUDE_USER_FLAGS.has(token.toLowerCase())) {
      if (includeUser) return { ok: false, message: USAGE };
      includeUser = true;
      continue;
    }
    if (!/^\d+$/u.test(token)) return { ok: false, message: USAGE };
    if (count !== void 0) return { ok: false, message: USAGE };
    const parsed = Number.parseInt(token, 10);
    if (!Number.isSafeInteger(parsed) || parsed < 1) return { ok: false, message: USAGE };
    count = parsed;
  }
  return { ok: true, count: Math.min(count ?? 1, MAX_COUNT), includeUser };
}

// src/history.ts
function textOf(blocks) {
  if (blocks === void 0) return "";
  let text = "";
  for (const block of blocks) {
    if (block.type === "text" && typeof block.text === "string") text += block.text;
  }
  return text.trim();
}
function collectTurns(events, request) {
  const assistantByTurn = /* @__PURE__ */ new Map();
  const userByTurn = /* @__PURE__ */ new Map();
  let currentTurn;
  for (const event of events) {
    const turn = event.data?.turn;
    if ((event.type === "turn/start" || event.type === "step/start") && typeof turn === "number") {
      currentTurn = turn;
      continue;
    }
    if (event.type === "assistant/message" && typeof turn === "number") {
      currentTurn = turn;
      const text = textOf(event.data?.message?.content);
      if (text !== "") assistantByTurn.set(turn, text);
      continue;
    }
    if (event.type === "user/message") {
      const owner = typeof turn === "number" ? turn : currentTurn;
      if (owner === void 0) continue;
      if (event.data?.source?.kind !== "user") continue;
      const text = textOf(event.data?.content);
      if (text === "") continue;
      const already = userByTurn.get(owner);
      userByTurn.set(owner, already === void 0 ? text : already + "\n\n" + text);
    }
  }
  const turns = [...assistantByTurn.keys()].sort((a, b) => a - b).slice(-request.count);
  return turns.map((turn) => ({
    turn,
    assistant: assistantByTurn.get(turn) ?? "",
    user: request.includeUser ? userByTurn.get(turn) : void 0
  }));
}
function renderTurns(turns) {
  return turns.map((turn) => turn.user === void 0 ? turn.assistant : `${turn.user}

${turn.assistant}`).join("\n\n");
}

// src/command.ts
var COPY_COMMAND_NAME = "copy";
var COPY_COMMAND_DESCRIPTION = "Copy the last n replies to the system clipboard";
function logOf(session) {
  if (session === void 0) return [];
  const snapshot = typeof session.snapshotEvents === "function" ? session.snapshotEvents() : session.events;
  return Array.isArray(snapshot) ? snapshot : [];
}
function bytesLabel(bytes) {
  return bytes < 1024 ? bytes + " \u5B57\u8282" : (bytes / 1024).toFixed(1) + " KB";
}
function createCopyCommand(ctx, environment, effects) {
  const deps = {
    ...environment,
    exec: (command, args, text) => effects.exec(command, args, text),
    write: (sequence) => effects.write(sequence)
  };
  const report = (text, color, kind = "success") => {
    const toast = ctx.get("tuiToast");
    const delivered = toast?.show?.(text, color === void 0 ? void 0 : { color }) ?? false;
    return delivered && kind === "success" ? { kind, text: "" } : { kind, text };
  };
  return {
    name: COPY_COMMAND_NAME,
    description: COPY_COMMAND_DESCRIPTION,
    // The TUI wraps this hint in its own brackets, so it carries no outer ones.
    input: { hint: "<number=1> --all" },
    async handler(invocation) {
      const parsed = parseCopyInput(invocation.rawInput);
      if (!parsed.ok) return { kind: "error", text: parsed.message };
      let events;
      try {
        events = logOf(invocation.agent.session);
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return report("/copy \u8BFB\u53D6\u4F1A\u8BDD\u5386\u53F2\u5931\u8D25\uFF1A" + detail, "error", "error");
      }
      const turns = collectTurns(events, parsed);
      if (turns.length === 0) {
        return report("/copy \u6CA1\u6709\u53EF\u590D\u5236\u7684\u5185\u5BB9\uFF1A\u8FD9\u6BB5\u4F1A\u8BDD\u91CC\u8FD8\u6CA1\u6709\u52A9\u624B\u6B63\u6587\u56DE\u590D", "warning");
      }
      const text = renderTurns(turns);
      const outcome = await copyToClipboard(text, deps);
      const scope = parsed.includeUser ? "\u542B\u4F60\u7684\u53D1\u8A00" : "\u4EC5\u56DE\u590D";
      const copied = "\u5DF2\u590D\u5236\u6700\u8FD1 " + turns.length + " \u8F6E\uFF08" + scope + "\uFF0C" + bytesLabel(outcome.bytes) + "\uFF09";
      if (outcome.degraded) {
        return report(copied + "\uFF0C\u4EC5\u7ECF OSC 52 \u8F6C\u4E49\u53D1\u51FA\uFF0C\u662F\u5426\u843D\u5730\u53D6\u51B3\u4E8E\u7EC8\u7AEF\u8BBE\u7F6E", "warning");
      }
      return report(copied, "success");
    }
  };
}
function registerCopyCommand(ctx, environment, effects) {
  const definition = createCopyCommand(ctx, environment, effects);
  const host = ctx.get("tuiPluginHost", false);
  if (typeof host?.registerCommand === "function") {
    try {
      return host.registerCommand(ctx, definition);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.info?.("dsh-slash-commands: registering /copy without Component attribution (" + detail + ")");
    }
  }
  const commands = ctx.get("commands");
  if (typeof commands?.register !== "function") {
    throw new Error("/copy cannot register: neither tuiPluginHost nor the commands service is mounted on this context");
  }
  return commands.register(definition);
}

// src/rename.ts
var RENAME_COMMAND_NAME = "rename";
var RENAME_COMMAND_DESCRIPTION = "Rename the current session";
var RENAME_USAGE = "\u7528\u6CD5\uFF1A/rename <\u65B0\u6807\u9898>";
function parseRenameInput(rawInput) {
  const title = rawInput.trim();
  if (title.length === 0) return { ok: false, message: RENAME_USAGE };
  return { ok: true, title };
}

// src/rename-command.ts
function titleServiceOf(ctx) {
  const direct = ctx.sessionTitle;
  if (direct !== void 0) return direct;
  const viaGet = ctx.get?.("sessionTitle", false);
  return typeof viaGet === "object" && viaGet !== null ? viaGet : void 0;
}
function titleRejectionOf(error) {
  const name2 = typeof error === "object" && error !== null ? error.name : void 0;
  if (name2 === "SessionTitleInvalidError") return "invalid";
  const message = error instanceof Error ? error.message : String(error);
  return /is not live|disposed|not active/iu.test(message) ? "not-live" : "disposed";
}
function rejectionMessage(rejection) {
  switch (rejection) {
    case "invalid":
      return "/rename \u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A\uFF08\u53BB\u6389\u9996\u5C3E\u7A7A\u767D\u540E\u6CA1\u6709\u53EF\u89C1\u5B57\u7B26\uFF09";
    case "not-live":
      return "/rename \u5F53\u524D\u4F1A\u8BDD\u4E0D\u5728\u6D3B\u52A8\u72B6\u6001\uFF0C\u65E0\u6CD5\u6539\u540D";
    case "disposed":
      return "/rename \u4F1A\u8BDD\u6807\u9898\u670D\u52A1\u5DF2\u505C\u7528\uFF0C\u65E0\u6CD5\u6539\u540D";
  }
}
function createRenameCommand(ctx) {
  return {
    name: RENAME_COMMAND_NAME,
    description: RENAME_COMMAND_DESCRIPTION,
    // The TUI wraps hints in its own brackets; keep this one bracket-free.
    input: { hint: "<new title>" },
    handler(invocation) {
      const parsed = parseRenameInput(invocation.rawInput);
      if (!parsed.ok) return { kind: "error", text: parsed.message };
      const service = titleServiceOf(ctx);
      if (typeof service?.rename !== "function") {
        return { kind: "error", text: "/rename \u9700\u8981 session-title \u670D\u52A1\uFF0C\u5F53\u524D\u7EC4\u5408\u6CA1\u6709\u6302\u8F7D\u5B83" };
      }
      const session = invocation.agent.session;
      if (session === void 0) {
        return { kind: "error", text: "/rename \u5F53\u524D\u4F1A\u8BDD\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u6539\u540D" };
      }
      try {
        const snapshot = service.rename(session, parsed.title);
        return { kind: "success", text: "\u4F1A\u8BDD\u5DF2\u6539\u540D\u4E3A\uFF1A" + snapshot.title };
      } catch (error) {
        return { kind: "error", text: rejectionMessage(titleRejectionOf(error)) };
      }
    }
  };
}
function registerRenameCommand(ctx) {
  const definition = createRenameCommand(ctx);
  const commands = ctx.get?.("commands", false) ?? ctx.commands;
  if (typeof commands?.register !== "function") {
    throw new Error("/rename cannot register: the commands service is not mounted on this context");
  }
  return commands.register(definition);
}

// src/index.ts
var name = "dsh-slash-commands";
var inject = ["commands", "sessionTitle"];
var HELPER_TIMEOUT_MS = 2e3;
async function runHelper(command, args, text) {
  const { spawn } = await import("node:child_process");
  return await new Promise((resolve) => {
    let settled = false;
    let timer;
    const child = (() => {
      try {
        return spawn(command, [...args], { stdio: ["pipe", "ignore", "ignore"] });
      } catch {
        return void 0;
      }
    })();
    const finish = (code) => {
      if (settled) return;
      settled = true;
      if (timer !== void 0) clearTimeout(timer);
      if (code !== 0) {
        try {
          child?.kill();
        } catch {
        }
      }
      resolve(code);
    };
    if (child === void 0) {
      finish(MISSING_TOOL);
      return;
    }
    timer = setTimeout(() => finish(1), HELPER_TIMEOUT_MS);
    child.on("error", (error) => finish(error.code === "ENOENT" ? MISSING_TOOL : 1));
    child.on("close", (code) => finish(typeof code === "number" ? code : 1));
    child.stdin?.on("error", () => finish(1));
    child.stdin?.end(text, "utf8");
  });
}
function writeRaw(sequence) {
  process.stdout.write(sequence);
}
function isTerminalSurface(ctx) {
  return ctx.get("tuiPluginHost", false) !== void 0 || ctx.get("tuiToast", false) !== void 0;
}
function apply(ctx) {
  const environment = { platform: process.platform, env: { ...process.env } };
  const effects = { write: writeRaw, exec: runHelper };
  try {
    registerRenameCommand(ctx);
    ctx.logger?.info?.("/rename is ready: /rename <new title>");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    ctx.logger?.info?.("dsh-slash-commands: /rename is unavailable on this composition: " + detail);
  }
  try {
    registerArchiveCommands(ctx);
    ctx.logger?.info?.("/archive and /unarchive are ready: /archive [--stop], /unarchive");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    ctx.logger?.info?.("dsh-slash-commands: /archive and /unarchive are unavailable on this composition: " + detail);
  }
  setTimeout(() => {
    if (!isTerminalSurface(ctx)) {
      return;
    }
    try {
      registerCopyCommand(ctx, environment, effects);
      ctx.logger?.info?.("/copy is ready: /copy [<number=1>] --all");
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.warn?.("dsh-slash-commands: /copy is unavailable on this composition: " + detail);
    }
  }, 0);
}
export {
  apply,
  inject,
  name,
  runHelper
};
