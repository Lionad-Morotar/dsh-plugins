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

// src/clipboard.ts
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
  const nativeAttempt = (async () => {
    for (const [command, args] of helpers) {
      const code = await runSafely(() => deps.exec(command, args, text));
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
  if (helpers.length > 0) attempted.push("native");
  if (inTmux) attempted.push("tmux-buffer");
  attempted.push("osc52");
  const landed = [];
  if (nativeLanded) landed.push("native");
  if (bufferLanded) landed.push("tmux-buffer");
  return { attempted, landed, bytes, degraded: landed.length === 0 };
}
async function runSafely(run) {
  try {
    return await run();
  } catch {
    return 1;
  }
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
      if (text !== "" && !userByTurn.has(owner)) userByTurn.set(owner, text);
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
function createCopyCommand(ctx, environment) {
  const deps = {
    ...environment,
    exec: (command, args, text) => ctx.exec(command, args, text),
    write: (sequence) => ctx.write(sequence)
  };
  const report = (text, color, kind = "success") => {
    const toast = ctx.get("tuiToast");
    const delivered = toast?.show?.(text, color === void 0 ? void 0 : { color }) ?? false;
    return delivered ? { kind, text: "" } : { kind, text };
  };
  return {
    name: COPY_COMMAND_NAME,
    description: COPY_COMMAND_DESCRIPTION,
    // The TUI wraps this hint in its own brackets, so it must not carry outer ones.
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
function registerCopyCommand(ctx, environment) {
  const definition = createCopyCommand(ctx, environment);
  const host = ctx.get("tuiPluginHost");
  if (typeof host?.registerCommand === "function") {
    try {
      return host.registerCommand(ctx, definition);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.warn?.("dsh-tui-copy: host-mediated registration refused (" + detail + "); falling back to the plain commands registry");
    }
  }
  const commands = ctx.get("commands");
  if (typeof commands?.register !== "function") {
    throw new Error("/copy cannot register: neither tuiPluginHost nor the commands service is mounted on this context");
  }
  return commands.register(definition);
}

// src/index.ts
var name = "dsh-tui-copy";
var inject = ["commands"];
async function runHelper(command, args, text) {
  const { spawn } = await import("node:child_process");
  return await new Promise((resolve) => {
    let settled = false;
    const finish = (code) => {
      if (settled) return;
      settled = true;
      resolve(code);
    };
    try {
      const child = spawn(command, [...args], { stdio: ["pipe", "ignore", "ignore"] });
      child.on("error", () => finish(1));
      child.on("close", (code) => finish(typeof code === "number" ? code : 1));
      child.stdin?.on("error", () => finish(1));
      child.stdin?.end(text, "utf8");
    } catch {
      finish(1);
    }
  });
}
function writeRaw(sequence) {
  process.stdout.write(sequence);
}
function apply(ctx) {
  const environment = { platform: process.platform, env: { ...process.env } };
  const commandContext = {
    get: (serviceName) => ctx.get(serviceName),
    write: writeRaw,
    exec: runHelper,
    logger: ctx.logger
  };
  try {
    registerCopyCommand(commandContext, environment);
    ctx.logger?.info?.("/copy is ready: /copy [<number=1>] [--all]");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    ctx.logger?.warn?.("dsh-tui-copy: /copy is unavailable on this composition: " + detail);
  }
}
export {
  apply,
  inject,
  name
};
