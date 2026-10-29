/**
 * The `/archive` and `/unarchive` commands as the host registry sees them.
 *
 * This half runs on every composed host: the registry is the harness-wide
 * `commands` service, so one registration surfaces the commands on TUI, web
 * and desktop at once. The write itself belongs to the host's
 * `workspaceRegistry` — the same service the sidebar's archive action reaches
 * over rpc — so the command invents no second notion of what archiving means;
 * it is the row menu's click expressed as a slash command.
 *
 * Failure handling follows the host's own classes: a session with running
 * work is refused (`WorkspaceActiveSessionError`, carrying the activity the
 * providers reported) unless the invocation said `--stop`, and a session that
 * does not exist is a definite miss (`WorkspaceUnknownSessionError`). The
 * classes are detected by name because the package keeps no runtime
 * dependency on the harness' internal type packages, exactly as `/rename`
 * detects `SessionTitleInvalidError`.
 */
import {
  ARCHIVE_COMMAND_DESCRIPTION,
  ARCHIVE_COMMAND_NAME,
  ARCHIVE_USAGE,
  UNARCHIVE_COMMAND_DESCRIPTION,
  UNARCHIVE_COMMAND_NAME,
  parseArchiveInput,
  parseUnarchiveInput,
} from "./archive.ts";

/** One active item of a family that has per-item identity. */
export interface SessionActivityItemLike {
  readonly id: string;
  readonly label?: string;
}

/** One reason the host refused to archive: a family of running work. */
export interface SessionActivityLike {
  readonly kind: string;
  readonly items?: readonly SessionActivityItemLike[];
}

/** Why an archive or unarchive could not be applied, in words a user acts on. */
export type ArchiveRejection = "active" | "unknown" | "unavailable";

/** The registry service, narrowed to the two calls these commands make. */
export interface WorkspaceRegistryLike {
  archiveSession?(sessionId: string, options?: { readonly stopActivity?: boolean }): Promise<void>;
  unarchiveSession?(sessionId: string): Promise<void>;
}

/** The slice of the Cordis context these commands touch. */
export interface ArchiveContextLike {
  readonly workspaceRegistry?: WorkspaceRegistryLike;
  /** `strict: false` is the documented soft probe. */
  get?(name: string, strict?: boolean): unknown;
  readonly logger?: { info?: (message: string) => void; warn?: (message: string) => void };
}

/** The slice of a command invocation these commands read. */
export interface ArchiveInvocationLike {
  readonly agent: { readonly session?: { readonly id?: string } };
  readonly rawInput: string;
}

/** The slice of a command result an adapter renders. */
export interface ArchiveResultLike {
  readonly kind: "success" | "error";
  readonly text: string;
}

/** The slice of a command definition the registry accepts. */
export interface ArchiveDefinitionLike {
  readonly name: string;
  readonly description: string;
  /** Declared for /archive: the web/desktop slash input drops argument-bearing invocations of commands without one. */
  readonly input?: { readonly hint: string };
  handler(invocation: ArchiveInvocationLike): ArchiveResultLike | Promise<ArchiveResultLike>;
}

/** Human sentences for the service-backed failures. */
const ARCHIVE_DONE = "会话已归档。归档的会话可在会话列表的「归档」视图中找回。";
const ARCHIVE_DONE_WITH_STOP =
  "会话已归档，其运行中工作的停止已请求。归档的会话可在会话列表的「归档」视图中找回。";
const ARCHIVE_SESSION_MISSING = "/archive 当前会话不可用，无法归档";
const ARCHIVE_SERVICE_MISSING = "/archive 需要 workspace 服务，当前组合没有挂载它";
const UNARCHIVE_DONE = "会话已取消归档，回到会话列表。";
const UNARCHIVE_SESSION_MISSING = "/unarchive 当前会话不可用";
const UNARCHIVE_SERVICE_MISSING = "/unarchive 需要 workspace 服务，当前组合没有挂载它";

/**
 * Read the workspace registry softly, per invocation.
 *
 * The service is deliberately absent from the plugin's inject list: a
 * declaration gates the whole row on the service, and a minimal composition
 * without the workspace domain (headless boots are observed to lack it)
 * would then lose /rename and /copy too. A per-invocation soft read keeps
 * each command's availability independent — a missing registry is one
 * command's error message.
 *
 * The accessor is tried first because the host's sandbox context is where
 * order is load-bearing: `ctx.get(name)` is the one service read that does
 * not require a declaration (its second argument is dropped there, so an
 * unmounted service resolves to undefined rather than throwing), while a
 * property access to a mounted-but-undeclared service is a guard rejection.
 * The direct property stays second only for test contexts that hand the
 * service over as a plain field.
 */
function workspaceRegistryOf(ctx: ArchiveContextLike): WorkspaceRegistryLike | undefined {
  const viaGet = ctx.get?.("workspaceRegistry");
  if (typeof viaGet === "object" && viaGet !== null) return viaGet as WorkspaceRegistryLike;
  const direct = ctx.workspaceRegistry;
  return typeof direct === "object" && direct !== null ? direct : undefined;
}

/**
 * Classify a thrown archive failure.
 *
 * The activity list is kept when the host reported one: naming what still
 * runs is the difference between a refusal the user can act on and one they
 * have to investigate.
 */
export function archiveRejectionOf(
  error: unknown,
): { kind: ArchiveRejection; activity?: readonly SessionActivityLike[] } {
  const name = typeof error === "object" && error !== null ? (error as { name?: unknown }).name : undefined;
  if (name === "WorkspaceActiveSessionError") {
    const activity = (error as { activity?: unknown }).activity;
    return {
      kind: "active",
      ...(Array.isArray(activity) ? { activity: activity as readonly SessionActivityLike[] } : {}),
    };
  }
  if (name === "WorkspaceUnknownSessionError") return { kind: "unknown" };
  return { kind: "unavailable" };
}

/**
 * Chinese labels for the activity families the composed providers report.
 *
 * The set is open (`SessionActivityKindMap` is extended by every provider),
 * so an unknown kind renders verbatim rather than guessing a label that
 * would claim a meaning it does not have.
 */
const FAMILY_LABELS: Record<string, string> = {
  turn: "一轮对话进行中",
  subagent: "子代理",
  job: "后台任务",
  schedule: "定时任务",
};

/** How many item labels one family lists before collapsing into a count. */
const MAX_LISTED_LABELS = 3;

/** One family as a phrase: the turn in words, the rest naming their items. */
function activityPhrase(entry: SessionActivityLike): string {
  const family = FAMILY_LABELS[entry.kind] ?? entry.kind;
  if (entry.kind === "turn") return family;
  const items = entry.items ?? [];
  const labels = items.map(item => item.label ?? item.id).filter(label => label !== "");
  if (labels.length === 0) return items.length > 0 ? `${family} ×${items.length}` : family;
  const shown = labels.slice(0, MAX_LISTED_LABELS);
  const rest = labels.length - shown.length;
  const listed = rest > 0 ? `${shown.join("、")} 等 ${labels.length} 个` : shown.join("、");
  return `${family}（${listed}）`;
}

/** The running-work report, joined into one sentence a refusal can quote. */
export function activitySentence(activity: readonly SessionActivityLike[]): string {
  if (activity.length === 0) return "会话仍在运行";
  return activity.map(activityPhrase).join("、");
}

/** Human sentence for one rejection class. */
export function archiveRejectionMessage(rejection: {
  kind: ArchiveRejection;
  activity?: readonly SessionActivityLike[];
}): string {
  switch (rejection.kind) {
    case "active":
      return `会话仍在运行（${activitySentence(rejection.activity ?? [])}）。用 /archive --stop 停止它们并归档。`;
    case "unknown":
      return "会话不存在或已结束，无法归档。";
    case "unavailable":
      return "归档失败，请稍后重试。";
  }
}

/**
 * Build `/archive`. The registry is resolved per invocation, not at
 * registration time: the registry outlives individual sessions, and a
 * composition can mount the service after this row.
 */
export function createArchiveCommand(ctx: ArchiveContextLike): ArchiveDefinitionLike {
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
      if (sessionId === undefined) return { kind: "error", text: ARCHIVE_SESSION_MISSING };

      try {
        // The plain form passes no options at all: absence is what asks the
        // host to run its activity check, and forwarding a synthetic `{}` for
        // it would read as a stop request that was never made.
        await archive.call(registry, sessionId, parsed.stopActivity ? { stopActivity: true } : undefined);
        // The stop is requested after the durable write and never awaited, so
        // the --stop answer promises a request, not a stopped session.
        return { kind: "success", text: parsed.stopActivity ? ARCHIVE_DONE_WITH_STOP : ARCHIVE_DONE };
      } catch (error) {
        const rejection = archiveRejectionOf(error);
        if (rejection.kind === "unavailable") {
          // Unknown failures carry no class the user can act on, but they do
          // distinguish a transient carrier fault from a permanent one — the
          // detail goes to the log, and the reply quotes it the way
          // /unarchive does, instead of swallowing it behind a retry hint.
          const detail = error instanceof Error ? error.message : String(error);
          ctx.logger?.warn?.(`/archive failed: ${detail}`);
          return { kind: "error", text: `归档失败：${detail}` };
        }
        return { kind: "error", text: archiveRejectionMessage(rejection) };
      }
    },
  };
}

/**
 * Build `/unarchive`. Unarchiving is idempotent on the host (an id that is
 * not archived resolves without writing), so the command does not pre-check
 * the archive set — a snapshot read here would race the push stream and the
 * host's own answer is the only current one.
 */
export function createUnarchiveCommand(ctx: ArchiveContextLike): ArchiveDefinitionLike {
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
      if (sessionId === undefined) return { kind: "error", text: UNARCHIVE_SESSION_MISSING };

      try {
        await unarchive.call(registry, sessionId);
        return { kind: "success", text: UNARCHIVE_DONE };
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return { kind: "error", text: `/unarchive 取消归档失败：${detail}` };
      }
    },
  };
}

/** The registry slice registration needs, resolved the way `/rename` does it. */
function commandsOf(ctx: ArchiveContextLike): { register(definition: ArchiveDefinitionLike): () => void } {
  const register = (
    (ctx.get?.("commands", false) ?? (ctx as { commands?: unknown }).commands) as
      | { register?: (definition: ArchiveDefinitionLike) => () => void }
      | undefined
  )?.register;
  if (typeof register !== "function") {
    throw new Error("archive commands cannot register: the commands service is not mounted on this context");
  }
  return { register };
}

/**
 * Register `/archive` on the composed command registry. It is a constant on
 * every surface: archiving is meaningful for the session in use unless it is
 * already archived (idempotent), so there is nothing to gate on.
 */
export function registerArchiveCommand(ctx: ArchiveContextLike): () => void {
  return commandsOf(ctx).register(createArchiveCommand(ctx));
}

/**
 * Register `/unarchive` on the composed command registry — terminal surfaces
 * only. Web and desktop take the client contribution instead, which gates the
 * row on the session actually being archived; registering both would collide
 * by name at candidate synthesis, and a registry row could not gate anyway.
 */
export function registerUnarchiveCommand(ctx: ArchiveContextLike): () => void {
  return commandsOf(ctx).register(createUnarchiveCommand(ctx));
}

/** Re-exported so the wiring module and tests share one usage-line source. */
export { ARCHIVE_USAGE };
