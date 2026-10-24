/**
 * The `/rename` command as the host registry sees it.
 *
 * This half runs on every composed host (web, desktop, TUI): the command
 * registry it registers into is the harness-wide `commands` service, and each
 * UI adapter reads its catalog through the same remote surface. That is why
 * `/rename` needs no per-surface code even though `/copy` is terminal-only.
 *
 * The title itself belongs to `sessionTitle`, the service that owns
 * normalization, the byte limit, and the durable `session/title` event.
 * Reimplementing any of that here would create a second source of truth for
 * what a valid title is.
 */
import { parseRenameInput, RENAME_COMMAND_DESCRIPTION, RENAME_COMMAND_NAME } from "./rename.ts";

/** The slice of one session this command reads. */
export interface RenameSessionLike {
  readonly id?: string;
}

/** Why a rename could not be applied, in words a user can act on. */
export type TitleRejection = "invalid" | "not-live" | "disposed";

/** The title service, narrowed to the two calls this command makes. */
export interface TitleServiceLike {
  /**
   * Rename one live session.
   * @throws when the title normalizes to empty or the session is not live.
   */
  rename?(session: unknown, title: string): { readonly title: string };
}

/** The slice of the Cordis context this command touches. */
export interface RenameContextLike {
  readonly sessionTitle?: TitleServiceLike;
  /** `strict: false` is the documented soft probe. */
  get?(name: string, strict?: boolean): unknown;
  readonly logger?: { info?: (message: string) => void; warn?: (message: string) => void };
}

/** The slice of a command invocation this command reads. */
export interface RenameInvocationLike {
  readonly agent: { readonly session?: RenameSessionLike };
  readonly rawInput: string;
}

/** The slice of a command result an adapter renders. */
export interface RenameResultLike {
  readonly kind: "success" | "error";
  readonly text: string;
}

/** The slice of a command definition the registry accepts. */
export interface RenameDefinitionLike {
  readonly name: string;
  readonly description: string;
  readonly input?: { readonly hint: string };
  readonly handler: (invocation: RenameInvocationLike) => RenameResultLike | Promise<RenameResultLike>;
}

/**
 * Read the title service.
 *
 * The direct property is the supported path: the plugin declares
 * `inject: ["sessionTitle"]` so Cordis mounts the service before `apply` runs.
 * A soft `get` is kept as a fallback for a context handed in by a test or a
 * composition that exposes services only through the accessor.
 */
function titleServiceOf(ctx: RenameContextLike): TitleServiceLike | undefined {
  const direct = ctx.sessionTitle;
  if (direct !== undefined) return direct;
  const viaGet = ctx.get?.("sessionTitle", false);
  return typeof viaGet === "object" && viaGet !== null ? (viaGet as TitleServiceLike) : undefined;
}

/**
 * Classify a thrown rename failure.
 *
 * `SessionTitleInvalidError` is the one failure that blames the input, and the
 * service documents it by name rather than by exported type identity (the
 * plugin keeps no runtime dependency on the harness' internal packages), so
 * the detection is the class name. Everything else is liveness or disposal:
 * a different problem with a different remedy.
 */
export function titleRejectionOf(error: unknown): TitleRejection {
  const name = typeof error === "object" && error !== null ? (error as { name?: unknown }).name : undefined;
  if (name === "SessionTitleInvalidError") return "invalid";
  const message = error instanceof Error ? error.message : String(error);
  return /is not live|disposed|not active/iu.test(message) ? "not-live" : "disposed";
}

/** Human sentence for one rejection class. */
export function rejectionMessage(rejection: TitleRejection): string {
  switch (rejection) {
    case "invalid":
      return "/rename 标题不能为空（去掉首尾空白后没有可见字符）";
    case "not-live":
      return "/rename 当前会话不在活动状态，无法改名";
    case "disposed":
      return "/rename 会话标题服务已停用，无法改名";
  }
}

/**
 * Build the command. The title service is resolved per invocation, not at
 * registration time: the registry outlives individual sessions, and a
 * composition can mount the service after this row.
 */
export function createRenameCommand(ctx: RenameContextLike): RenameDefinitionLike {
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
        return { kind: "error", text: "/rename 需要 session-title 服务，当前组合没有挂载它" };
      }
      const session = invocation.agent.session;
      if (session === undefined) {
        return { kind: "error", text: "/rename 当前会话不可用，无法改名" };
      }

      try {
        const snapshot = service.rename(session, parsed.title);
        return { kind: "success", text: "会话已改名为：" + snapshot.title };
      } catch (error) {
        return { kind: "error", text: rejectionMessage(titleRejectionOf(error)) };
      }
    },
  };
}

/**
 * Register `/rename` on the composed command registry.
 *
 * Returns the registry's disposer, or throws when no commands service is
 * mounted: a plugin that silently registers nothing is harder to diagnose than
 * an activation error in the log.
 */
export function registerRenameCommand(ctx: RenameContextLike): () => void {
  const definition = createRenameCommand(ctx);
  const commands = (ctx.get?.("commands", false) ?? (ctx as { commands?: unknown }).commands) as
    | { register?: (definition: RenameDefinitionLike) => () => void }
    | undefined;
  if (typeof commands?.register !== "function") {
    throw new Error("/rename cannot register: the commands service is not mounted on this context");
  }
  return commands.register(definition);
}