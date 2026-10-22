/**
 * The `/copy` command as the host sees it: one definition, plus the only
 * decision that matters at registration time -- whether this activation may use
 * the host-mediated path.
 *
 * The mediated path (`tuiPluginHost.registerCommand`) is the honest one: it
 * stamps the command with this plugin's verified Component identity so the
 * channel can enforce per-owner `commands.invoke`. It refuses activations
 * without an admitted `dsh-plugin.json`, and a plugin that only ever fails
 * there would be a package that installs and does nothing, so the plain
 * `commands` registry is the fallback and the command keeps working.
 */
import { parseCopyInput } from "./arguments.ts";
import { copyToClipboard } from "./clipboard.ts";
import type { ClipboardDeps, ClipboardEnvironment } from "./clipboard.ts";
import { collectTurns, renderTurns } from "./history.ts";
import type { SessionEventLike } from "./history.ts";

/** Command name without the leading slash, shared with the manifest. */
export const COPY_COMMAND_NAME = "copy";
export const COPY_COMMAND_DESCRIPTION = "Copy the last n replies to the system clipboard";

/** The slice of a live session this command reads. */
export interface SessionLike {
  snapshotEvents?(): readonly unknown[];
  events?: readonly unknown[];
}

/** The slice of the Cordis context this plugin touches. */
export interface HostContextLike {
  /** `strict: false` is the documented soft probe: it finds a service whose
   *  providing fiber is not active yet, instead of reporting it missing. */
  get(name: string, strict?: boolean): unknown;
  readonly logger?: { info?: (message: string) => void; warn?: (message: string) => void };
  /** Raw terminal write for the OSC 52 escape. */
  write(sequence: string): void;
  /** Run a clipboard helper with the text on stdin; resolves to its exit code. */
  exec(command: string, args: readonly string[], text: string): Promise<number>;
}

/** The slice of the receiving agent this command reads. */
export interface AgentLike {
  readonly session?: SessionLike;
}

/** The slice of a command invocation this command reads. */
export interface InvocationLike {
  readonly agent: AgentLike;
  readonly rawInput: string;
}

/** The slice of a command result the TUI renders. */
export interface CommandResultLike {
  readonly kind: "success" | "error";
  readonly text?: string;
}

/** The slice of a command definition the registry accepts. */
export interface CommandDefinitionLike {
  readonly name: string;
  readonly description: string;
  readonly input?: { readonly hint?: string };
  readonly handler: (invocation: InvocationLike) => CommandResultLike | Promise<CommandResultLike>;
}

/** Read the live session log, tolerating both log shapes and a detached session. */
function logOf(session: SessionLike | undefined): readonly SessionEventLike[] {
  if (session === undefined) return [];
  const snapshot = typeof session.snapshotEvents === "function" ? session.snapshotEvents() : session.events;
  return Array.isArray(snapshot) ? (snapshot as readonly SessionEventLike[]) : [];
}

/** Byte counts, because a clipboard entry is measured in bytes, not characters. */
function bytesLabel(bytes: number): string {
  return bytes < 1024 ? bytes + " 字节" : (bytes / 1024).toFixed(1) + " KB";
}

/**
 * Build the command. `environment` is read by the caller at activation time, so
 * a test drives every clipboard branch without a terminal.
 */
export function createCopyCommand(ctx: HostContextLike, environment: ClipboardEnvironment): CommandDefinitionLike {
  const deps: ClipboardDeps = {
    ...environment,
    exec: (command, args, text) => ctx.exec(command, args, text),
    write: sequence => ctx.write(sequence),
  };

  /** Toast when the host mounted one; hand the text back for the other hosts. */
  const report = (text: string, color?: "success" | "warning" | "error", kind: CommandResultLike["kind"] = "success"): CommandResultLike => {
    const toast = ctx.get("tuiToast") as
      | { show?: (text: string, options?: { color?: string }) => boolean }
      | undefined;
    const delivered = toast?.show?.(text, color === undefined ? undefined : { color }) ?? false;
    // A delivered toast already reached the user; echoing the same words as a
    // transcript notice would say it twice.
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

      let events: readonly SessionEventLike[];
      try {
        events = logOf(invocation.agent.session);
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return report("/copy 读取会话历史失败：" + detail, "error", "error");
      }

      const turns = collectTurns(events, parsed);
      if (turns.length === 0) {
        return report("/copy 没有可复制的内容：这段会话里还没有助手正文回复", "warning");
      }

      const text = renderTurns(turns);
      const outcome = await copyToClipboard(text, deps);
      const scope = parsed.includeUser ? "含你的发言" : "仅回复";
      const copied = "已复制最近 " + turns.length + " 轮（" + scope + "，" + bytesLabel(outcome.bytes) + "）";

      if (outcome.degraded) {
        // Nothing local confirmed the copy: the text went out as a terminal
        // escape only. Say which terminal knob decides whether it lands instead
        // of claiming a success the plugin cannot see.
        return report(copied + "，仅经 OSC 52 转义发出，是否落地取决于终端设置", "warning");
      }
      return report(copied, "success");
    },
  };
}

/**
 * Register `/copy` on the best path this composition offers.
 *
 * Returns a disposer. Throws when neither registry exists: a plugin silently
 * doing nothing is harder to diagnose than an activation error in the log.
 */
export function registerCopyCommand(ctx: HostContextLike, environment: ClipboardEnvironment): () => void {
  const definition = createCopyCommand(ctx, environment);

  // #183 in the host's own notes: the plugin-host row is probed softly, because
  // a profile launched against a stale patch may not have mounted it yet, and
  // a strict read would report a live service as missing.
  const host = ctx.get("tuiPluginHost", false) as
    | { registerCommand?: (pluginCtx: unknown, definition: CommandDefinitionLike) => () => void }
    | undefined;
  if (typeof host?.registerCommand === "function") {
    try {
      return host.registerCommand(ctx, definition);
    } catch (error) {
      // Not admitted (no package-root dsh-plugin.json, or a refused manifest):
      // the command still works, it just cannot carry Component attribution.
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.warn?.("dsh-tui-copy: host-mediated registration refused (" + detail + "); falling back to the plain commands registry");
    }
  }

  const commands = ctx.get("commands") as
    | { register?: (definition: CommandDefinitionLike) => () => void }
    | undefined;
  if (typeof commands?.register !== "function") {
    throw new Error("/copy cannot register: neither tuiPluginHost nor the commands service is mounted on this context");
  }
  return commands.register(definition);
}
