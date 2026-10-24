/**
 * The `/copy` command as the host sees it: one definition, plus the only
 * decision that matters at registration time -- whether this activation may use
 * the host-mediated path.
 *
 * The mediated path (`tuiPluginHost.registerCommand`) is the honest one: it
 * stamps the command with this plugin's verified Component identity so the
 * channel can enforce per-owner `commands.invoke`. It refuses anything that is
 * not a live activation context of the host composition (it checks the Cordis
 * activation marker), so the context handed to it MUST be the one `apply`
 * received, never a hand-built object. That is why effects live in their own
 * parameter here: the command needs `write`/`exec`, registration needs identity,
 * and conflating the two silently downgrades the command to an unattributed
 * root command that per-plugin grants no longer govern.
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

/** The effects the command needs, kept apart from the context that carries
 *  identity: the host rejects a synthesized object as a registration context. */
export interface ClipboardEffects {
  /** Raw terminal write for the OSC 52 escape. */
  write(sequence: string): void;
  /** Run a clipboard helper with the text on stdin; resolves to its exit code. */
  exec(command: string, args: readonly string[], text: string): Promise<number>;
}

/** The slice of the Cordis context this plugin touches. */
export interface HostContextLike {
  /** `strict: false` is the documented soft probe: it finds a service whose
   *  providing fiber is not active yet, instead of reporting it missing. */
  get(name: string, strict?: boolean): unknown;
  readonly logger?: { info?: (message: string) => void; warn?: (message: string) => void };
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
export function createCopyCommand(
  ctx: HostContextLike,
  environment: ClipboardEnvironment,
  effects: ClipboardEffects,
): CommandDefinitionLike {
  const deps: ClipboardDeps = {
    ...environment,
    exec: (command, args, text) => effects.exec(command, args, text),
    write: sequence => effects.write(sequence),
  };

  /**
   * Report through a toast when the host mounted one, otherwise through the
   * command result text.
   *
   * An error result must still carry text: the registry rejects
   * `{kind: "error", text: ""}` with a TypeError, which would replace the
   * real diagnosis in the transcript with an internal wording.
   */
  const report = (text: string, color?: "success" | "warning" | "error", kind: CommandResultLike["kind"] = "success"): CommandResultLike => {
    const toast = ctx.get("tuiToast") as
      | { show?: (text: string, options?: { color?: string }) => boolean }
      | undefined;
    const delivered = toast?.show?.(text, color === undefined ? undefined : { color }) ?? false;
    // A delivered toast already reached the user; echoing the same words as a
    // transcript notice would say it twice (errors must still echo: see above).
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
        // A verifiable path was available and failed: the text went out as a
        // terminal escape only. Say which terminal knob decides whether it
        // lands instead of claiming a success the plugin cannot see.
        return report(copied + "，仅经 OSC 52 转义发出，是否落地取决于终端设置", "warning");
      }
      return report(copied, "success");
    },
  };
}

/**
 * Register `/copy` on the best path this composition offers.
 *
 * `ctx` is the live activation context `apply` received; `effects` supplies the
 * terminal write and the helper runner. Keeping them apart is what lets the
 * mediated path succeed, and it is the difference between a command the host
 * can attribute and revoke per plugin, and one it cannot.
 *
 * Returns a disposer. Throws when neither registry exists: a plugin silently
 * doing nothing is harder to diagnose than an activation error in the log.
 */
export function registerCopyCommand(
  ctx: HostContextLike,
  environment: ClipboardEnvironment,
  effects: ClipboardEffects,
): () => void {
  const definition = createCopyCommand(ctx, environment, effects);

  // #183 in the host's own notes: the plugin-host row is probed softly, because
  // a profile launched against a stale patch may not have mounted it yet, and
  // a strict read would report a live service as missing.
  const host = ctx.get("tuiPluginHost", false) as
    | { registerCommand?: (pluginCtx: unknown, definition: CommandDefinitionLike) => () => void }
    | undefined;
  if (typeof host?.registerCommand === "function") {
    try {
      // The first argument must be this very activation context: the host
      // checks the Cordis activation marker, so a synthesized object is
      // refused before identity or the command contract is even consulted.
      return host.registerCommand(ctx, definition);
    } catch (error) {
      // The normal outcome on a composition that does not admit third-party
      // activations: the command still works, it just cannot carry Component
      // attribution. Logged at info so a routine fallback stops looking like a
      // failure and drowning the warning that matters.
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.info?.("dsh-slash-commands: registering /copy without Component attribution (" + detail + ")");
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