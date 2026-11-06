/**
 * Browser-half entry.
 *
 * Registers the Git conversation view. The core service arrives through
 * `inject`, never through a cross-package module import; the Git data service
 * is read lazily over the connection RPC so an unloaded host half renders the
 * panel's "service unavailable" state instead of keeping the tab hidden.
 */
import { EN, ZH } from "./copy.ts";
import { attachFontScale, type FontScaleContextLike } from "./font-scale.ts";
import {
  GIT_SERVICE,
  HEADER_ID,
  HEADER_ORDER,
  HEADER_SLOT,
  LOCALE_NAMESPACE,
  VIEW_ID,
  VIEW_ORDER,
  VIEW_SLOT,
} from "../shared.ts";
import { createBranchAction } from "./branch-action.tsx";
import { createBranchStore } from "./branch-store.ts";
import { computeWindow, createJump, formatCommitDetail, groupChanges } from "./model.ts";
import { insertStyles } from "./styles.ts";
import { registerGitReferenceSource, type ReferenceContextLike, type ReferenceInsert, type ReferenceSpan } from "./reference.ts";
import { createGitExplorerView, type ReferenceWiring, type ReferenceWiringResolver, type WorkbenchFace } from "./view.tsx";
import { createRpcRemoteFace, type GitRemoteFace, type RemoteResolver, type RpcCall } from "./wire.ts";

export { boot } from "./platform.ts";

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
  };
  readonly workbench: WorkbenchFace;
  /** Typert's client namespace table; `gitExplorer` appears when the host half is loaded. */
  readonly remote?: { readonly gitExplorer?: GitRemoteFace };
  /** Cordis's non-throwing resolver, used to probe a namespace not injected. */
  get?(name: string): unknown;
  /** Cordis's scoped injection, used to follow an optional host service. */
  inject?: FontScaleContextLike["inject"];
}
/**
 * Services this plugin waits for before applying.
 *
 * `remote.gitExplorer` is deliberately not listed: waiting for it would hide the
 * tab when the host half is missing, which is exactly the case the panel has an
 * empty state for.
 */
export const inject = ["slots", "locale", "workbench", "remote"];

/** Whether a value is the generated Git namespace rather than a cordis stub. */
function isGitRemote(value: unknown): value is GitRemoteFace {
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.snapshot === "function" && typeof record.query === "function" && typeof record.commit === "function";
}

/**
 * Read the Git face on every call, in the order the host makes it available.
 *
 * 1. `ctx.remote.gitExplorer` is the documented typed path, but it only exists
 *    when a generated client contribution was mounted with `ctx.remote.$mount()`.
 *    A third-party package ships no such artifact, so this branch is a courtesy
 *    for hosts that do mount one.
 * 2. The raw connection RPC is what reaches a hand-published host half: the same
 *    `/api/<namespace>/<method>` route the reference Git panel on this host uses.
 * 3. Nothing readable means the panel's empty state, never an exception.
 */
export function createRemoteResolver(ctx: ClientContextLike): RemoteResolver {
  return () => {
    try {
      const direct = ctx.remote?.gitExplorer;
      if (isGitRemote(direct)) return direct;
    } catch {
      // Namespace not injected or not mounted yet; fall through to the next probe.
    }
    try {
      const viaGet = ctx.get?.("remote.gitExplorer");
      if (isGitRemote(viaGet)) return viaGet;
    } catch {
      // A resolver that rejects an unknown name is the same as an absent face.
    }
    const call = createRpcCall(ctx);
    return call === undefined ? undefined : createRpcRemoteFace(call);
  };
}

/** The gateway's unary caller, as the connection service exposes it. */
interface GatewayRpc {
  call(scope: string, endpoint: string, payload: unknown, signal?: AbortSignal): Promise<unknown>;
}

/** The slice of the connection service this transport needs. */
interface ConnectionFace {
  readonly rpc?: GatewayRpc;
}

/**
 * Bind the gateway's unary caller to this package's namespace.
 *
 * `call` is invoked with the rpc object as its receiver: the connection service
 * exposes it as a method, so an unbound reference would lose `this`.
 * @param ctx - client context, read through the non-throwing resolver.
 * @returns the caller, or undefined on a host without the connection service.
 */
export function createRpcCall(ctx: ClientContextLike): RpcCall | undefined {
  const connection = ctx.get?.("connection") as ConnectionFace | undefined;
  const rpc = connection?.rpc;
  if (rpc === undefined || typeof rpc.call !== "function") return undefined;
  return (endpoint, payload, signal) => rpc.call("/api", `${GIT_SERVICE}/${endpoint}`, payload, signal);
}

/**
 * Build the per-session reference writer.
 *
 * Every service is read on each call. Two reasons: the facade is per session
 * generation and throws once that generation is released, so caching one would
 * hand a stale composer to the next click; and this resolver is built during
 * `apply`, which can run before `sessions` and `conversation` are up, so
 * capturing them there would freeze a legitimate absence into a permanent one.
 * @param ctx - client context, read through the non-throwing resolver.
 * @returns a resolver that answers undefined when the input plane is absent.
 */
export function createReferenceResolver(ctx: ClientContextLike): ReferenceWiringResolver {
  return (sessionId: string): ReferenceWiring | undefined => {
    const sessions = ctx.get?.("sessions") as { scope?(sessionId: string): unknown } | undefined;
    const conversation = ctx.get?.("conversation") as
      | { input?: { for(actx: unknown): SessionInputFace } }
      | undefined;
    if (sessions?.scope === undefined || conversation?.input?.for === undefined) return undefined;
    let facade: SessionInputFace;
    try {
      const actx = sessions.scope(sessionId);
      if (actx === undefined) return undefined;
      facade = conversation.input.for(actx);
    } catch {
      // The controller refuses a Context whose generation was released: the
      // session was switched away from between the render and this click.
      return undefined;
    }
    if (facade === undefined || facade === null) return undefined;
    return {
      insertReference: (insert, span) => facade.insertReference(insert, span),
      focus: () => facade.focus(),
      notify: (level, text) => facade.notify(level, text),
    };
  };
}

/** The slice of the session input facade the reference writer calls. */
interface SessionInputFace {
  insertReference(insert: ReferenceInsert, span: ReferenceSpan): boolean;
  focus(): void;
  notify(level: "info" | "error", text: string): void;
}

/** Disposer of the dictionary currently sitting in the host's locale table.
* A repeat apply on one host process (the desktop sync pass followed by the
* mount pass) meets the same table, and the table refuses a second
* registration for the same namespace and locale. Dropping ours first turns
* that would-be throw into a plain replacement: the disposer deletes by
* dictionary identity, so the module-singleton dictionaries are always
* removable by the very disposer that registered them. */
let registeredDictionaries: (() => void) | undefined;

/**
 * Mount the header branch action and, when the workbench is present, the tab.
 *
 * The two registrations have different requirements. The header action only
 * needs the slot table, the dictionary and the Remote face, so it mounts on
 * hosts without the workbench core; the tab needs `workbench` for its view
 * seam and stays absent there.
 */
export function apply(ctx: ClientContextLike): () => void {
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;
  const offStyles = insertStyles(typeof document === "undefined" ? undefined : document);
  // Optional: without the host's theme service the panel keeps the sizes the
  // host wrote on `body`, so this never blocks the header action from mounting.
  const offFontScale = attachFontScale(ctx);
  const remote = createRemoteResolver(ctx);
  const reference = createReferenceResolver(ctx);
  // The chip's send-time identity. Without it the chip still lands in the draft,
  // but the host would reject the send for a missing codec, so the writer only
  // reaches for a chip when this registration succeeded.
  const offReferenceSource = registerGitReferenceSource(ctx as ReferenceContextLike);

  const BranchAction = createBranchAction({ store: createBranchStore(remote), t });
  ctx.slots.inject(HEADER_SLOT, () =>
    ctx.slots.register(
      {
        name: HEADER_SLOT,
        id: HEADER_ID,
        order: HEADER_ORDER,
        locale: LOCALE_NAMESPACE,
      },
      BranchAction,
    ),
  );

  const workbench = ctx.workbench;
  if (workbench !== undefined && workbench !== null) {
    const View = createGitExplorerView({
      workbench,
      version: workbench.version,
      t,
      remote,
      reference,
    });
    ctx.slots.inject(VIEW_SLOT, () =>
      ctx.slots.register(
        {
          name: VIEW_SLOT,
          id: VIEW_ID,
          order: VIEW_ORDER,
          label: () => t("tab.label"),
          locale: LOCALE_NAMESPACE,
        },
        View,
      ),
    );
  }

  return () => {
    offStyles();
    offFontScale();
    offReferenceSource();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
  };
}

/**
 * Pure surfaces for the acceptance probe and the unit tests.
 *
 * They are attached to the default export because the loader hands the browser
 * bundle's default export to the host; there is no other module handle.
 */
export const __test = { groupChanges, formatCommitDetail, createJump, computeWindow };

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-git-explorer", inject, apply, __test };

export default clientPlugin;
