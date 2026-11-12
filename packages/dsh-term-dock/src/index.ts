/**
 * Host half.
 *
 * The terminal dock itself is a browser surface over the host's `webTerminals`
 * service; process lifetime belongs to the host. What the host half adds is the
 * one fact a browser cannot read: the session's workspace and Git branch, which
 * is what lets one terminal set follow a working tree instead of a conversation.
 *
 * Scope resolution needs three host guarantees — `subprocess` for Git,
 * `sessions` for the live header and `sessionPersistence` for a session that is
 * not live. They are declared in `inject` because the row is materially useless
 * without them: a host missing one should keep the row pending rather than let it
 * answer half-truths. `webServer` is deliberately NOT declared: it arrives after
 * this row activates in the desktop composition, and a declaration would keep the
 * plugin pending forever on a host that never provides it. Polling for it is the
 * only thing that observes it from a loader row's isolated scope.
 *
 * A client that cannot reach this route (an older host, a page still connecting)
 * falls back to per-session terminals on its own, so this half failing to mount
 * degrades the feature instead of taking the dock down.
 */
import { createGitRunner, type SubprocessLike } from "./host/git.ts";
import { registerTermDockRoutes, type WebServerFace } from "./host/routes.ts";
import { createAnchorLedger, createScopeResolver, type SessionPersistenceFace, type SessionsFace } from "./host/scope.ts";
import { DOCK_ID, DOCK_SLOT, PACKAGE_NAME } from "./shared.ts";

export { DOCK_ID, DOCK_SLOT, PACKAGE_NAME };

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = PACKAGE_NAME;

/** Services the host half reads; each is a host guarantee on the surfaces that mount a dock. */
export const inject = ["subprocess", "sessions", "sessionPersistence"];

/** Structural slice of the Cordis context this half reads. */
interface HostContext {
  get?(serviceName: string): unknown;
  effect?(setup: () => (() => void | Promise<void>) | Promise<void> | void): void;
}

/**
 * How often to re-read `webServer` while it is still absent, and how long to keep
 * trying. The desktop web app provides it well inside the first second; the cap
 * exists so a host without one does not poll forever.
 */
const WEB_SERVER_POLL_MS = 250;
const WEB_SERVER_WAIT_MS = 15_000;

/** Read one service, treating null as absent. */
function readService(ctx: HostContext, serviceName: string): unknown {
  const value = ctx.get?.(serviceName);
  return value === null ? undefined : value;
}

/** Whether a value exposes the spawn method the Git runner needs. */
function asSubprocess(value: unknown): SubprocessLike | undefined {
  if (value === null || typeof value !== "object") return undefined;
  return typeof (value as { spawn?: unknown }).spawn === "function" ? (value as SubprocessLike) : undefined;
}

/**
 * Run `register` once `webServer` exists, then stop polling.
 * @param ctx - the host context.
 * @param register - the mount callback.
 * @returns a disposer that cancels the wait.
 */
function whenWebServer(ctx: HostContext, register: (webServer: WebServerFace) => void): () => void {
  const found = (): WebServerFace | undefined => {
    const service = readService(ctx, "webServer");
    if (service === null || typeof service !== "object") return undefined;
    return typeof (service as { register?: unknown }).register === "function" ? (service as WebServerFace) : undefined;
  };
  const immediate = found();
  if (immediate !== undefined) {
    register(immediate);
    return () => {};
  }
  let stopped = false;
  const started = Date.now();
  const timer = setInterval(() => {
    if (stopped) return;
    const webServer = found();
    if (webServer !== undefined) {
      stopped = true;
      clearInterval(timer);
      register(webServer);
      return;
    }
    if (Date.now() - started > WEB_SERVER_WAIT_MS) {
      stopped = true;
      clearInterval(timer);
    }
  }, WEB_SERVER_POLL_MS);
  // A loader row's scope may not keep a Node timer alive by itself.
  timer.unref?.();
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

/**
 * Mount the scope route.
 * @param ctx - the host context, with the services named in {@link inject}.
 * @returns nothing; the route lives as long as the row.
 */
export function apply(ctx: HostContext): void {
  const scopes = createScopeResolver({
    git: createGitRunner({ subprocess: asSubprocess(readService(ctx, "subprocess")) }),
    sessions: readService(ctx, "sessions") as SessionsFace | undefined,
    persistence: readService(ctx, "sessionPersistence") as SessionPersistenceFace | undefined,
    anchors: createAnchorLedger(),
  });
  const cancelWait = whenWebServer(ctx, webServer => {
    const unregister = registerTermDockRoutes(webServer, { scopes });
    ctx.effect?.(() => unregister);
  });
  ctx.effect?.(() => () => cancelWait());
}

/** Registration coordinates, useful to host-side diagnostics. */
export function describe(): { name: string; slot: string; id: string } {
  return { name: PACKAGE_NAME, slot: DOCK_SLOT, id: DOCK_ID };
}
