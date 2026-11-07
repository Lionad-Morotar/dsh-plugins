/**
 * Host half: /arch/api routes over in-process LikeC4 rendering.
 *
 * Service wiring follows the structural-probe pattern (`dsh-git-explorer`,
 * `dsh-slash-commands`): none of the collaborators are declared in `inject`,
 * because a declaration makes the whole plugin row wait for the service and a
 * composition that lacks one (headless boots, desktop profiles) would keep
 * this plugin silently inactive forever. Each service is read per-activation
 * through `ctx.get?.(name)` instead; a missing one degrades exactly the
 * capability it serves:
 *
 * - `webServer` missing → no routes registered, plugin stays alive;
 * - `storageDomain` missing → state routes answer `degraded: true` and the
 *   client half keeps state in localStorage (its fallback layer);
 * - `sessions`/`sessionPersistence` missing → sessions resolve to the process
 *   cwd, the same last resort as the Git explorer.
 *
 * `@likec4/language-services/node` is imported on first request only (inside
 * `renderWorkspace`): the cold import costs ~232ms / +78MB RSS and the product
 * property "no Arch tab open, zero cost" forbids both at activation.
 */
import type { Context } from "@deepseek-ai/cordis";

import { openArchStore, type ArchStore, type StorageDomainFace } from "./host/arch-store.ts";
import { discoverC4ProjectDirs } from "./host/discover.ts";
import {
  collectElementSources,
  createRenderer,
  resolveElementCode,
  toModelPayload,
  toViewsPayload,
  type WorkspaceRenderer,
} from "./host/render.ts";
import { registerArchRoutes, type WebServerFace } from "./host/routes.ts";
import {
  canonicalPath,
  resolveSessionRoot,
  type SessionPersistenceFace,
  type SessionsFace,
} from "./host/workspace.ts";
import {
  PACKAGE_NAME,
  type ArchWorkspaceState,
  type WireModelResponse,
  type WireViewsResponse,
} from "./shared.ts";

export { PACKAGE_NAME };

/** Loader row name; matches `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/**
 * Nothing is declared: every collaborator is probed structurally in `apply`
 * so a partial host composition degrades features instead of blocking boot.
 */
export const inject: string[] = [];

/** Structural slice of the Cordis context this package reads. */
interface HostContext {
  get?(name: string): unknown;
  /**
   * Runs `setup` immediately and keeps the function it returns until the
   * fiber unloads. The return type mirrors cordis: a plain function is the
   * deferred teardown, a promise settles before its result is treated as one.
   */
  effect?(setup: () => (() => void | Promise<void>) | Promise<void> | void): void;
}

/**
 * How often to re-read `webServer` while it is still absent, and how long to
 * keep trying. The desktop web app provides it well inside the first second;
 * the cap exists so a host without one does not poll forever.
 */
const WEB_SERVER_POLL_MS = 250;
const WEB_SERVER_WAIT_MS = 15000;

function readService(ctx: HostContext, name: string): unknown {
  const value = ctx.get?.(name);
  return value === null ? undefined : value;
}

/**
 * Register the routes once `webServer` exists.
 *
 * A one-shot `ctx.get("webServer")` during `apply` misses the desktop
 * composition: this row activates before the web app provides the server, so
 * the probe reads undefined and the routes would never be registered.
 *
 * `ctx.inject` and the `internal/service` event only re-check the scope that
 * provided the service, and a loader row's scope does not inherit the root's
 * isolation table, so its own `ctx.get` never observes a service the root
 * provides (verified against cordis 4). The row therefore polls `ctx.get`
 * until the server is visible from its own scope, which is what happens once
 * the desktop host finishes composing.
 *
 * The interval is bounded. A host that never grows a web server (headless)
 * stops looking and stays alive, the same degraded outcome as a one-shot miss.
 *
 * @param host - the context `apply` received.
 * @param register - mounts the prefix; receives the context that owns the server.
 */
function whenWebServer(host: HostContext, register: (ctx: HostContext, webServer: WebServerFace) => void): void {
  const found = (): WebServerFace | undefined => readService(host, "webServer") as WebServerFace | undefined;
  const present = found();
  if (present !== undefined) {
    register(host, present);
    return;
  }
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = found();
    if (webServer === undefined) {
      if (Date.now() - startedAt > WEB_SERVER_WAIT_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    register(host, webServer);
  }, WEB_SERVER_POLL_MS);
}

export function apply(ctx: Context): void {
  const host = ctx as unknown as HostContext;

  whenWebServer(host, (ready, webServer) => {
    mountRoutes(ready, webServer);
  });
}

/**
 * Mount `/arch/api` on one live web server.
 *
 * Collaborators other than the server stay one-shot probes: a missing store or
 * session catalogue degrades that one capability, it does not withhold the routes.
 *
 * @param host - the context that owns the server (the deferred one when we waited).
 * @param webServer - the server the routes register on.
 */
function mountRoutes(host: HostContext, webServer: WebServerFace): void {
  const sessions = readService(host, "sessions") as SessionsFace | undefined;
  const sessionPersistence = readService(host, "sessionPersistence") as SessionPersistenceFace | undefined;
  const storageDomain = readService(host, "storageDomain") as StorageDomainFace | undefined;

  // Activation observability: a silent pending fiber is indistinguishable from
  // a missing module from the outside, and both have bitten already.
  console.info(
    `[dsh-arch] activating; services=${JSON.stringify({
      webServer: true,
      sessions: sessions !== undefined,
      sessionPersistence: sessionPersistence !== undefined,
      storageDomain: storageDomain !== undefined,
    })}`,
  );

  const renderer: WorkspaceRenderer = createRenderer();
  // Awaited per request, not assigned on resolve: assigning would leave a
  // window where an early request reads the not-yet-open store as degraded.
  const storePromise: Promise<ArchStore | null> = openArchStore(storageDomain);

  async function resolveWorkspaceRoot(sessionId: string): Promise<string | undefined> {
    const root = await resolveSessionRoot(sessionId, sessions, sessionPersistence);
    return root === undefined ? await canonicalPath(process.cwd()) : root;
  }

  async function loadViews(workspace: string): Promise<WireViewsResponse> {
    const [dir] = await discoverC4ProjectDirs(workspace);
    if (dir === undefined) {
      // No C4 model is a legal workspace state, not an error.
      return { workspace, projectId: "", views: [], hasErrors: false, errors: [] };
    }
    const rendered = await renderer.get(dir);
    return toViewsPayload({
      workspace,
      projectId: rendered.projectId,
      views: rendered.views,
      hasErrors: rendered.hasErrors,
      errors: rendered.errors,
    });
  }

  async function loadModel(workspace: string): Promise<WireModelResponse> {
    const [dir] = await discoverC4ProjectDirs(workspace);
    if (dir === undefined) {
      return { workspace, projectId: "", elements: {}, relations: {}, specification: null };
    }
    const rendered = await renderer.get(dir);
    const model = await rendered.instance.layoutedModel(rendered.projectId);
    const data = model.$data as {
      elements?: Record<string, unknown>;
      relations?: Record<string, unknown>;
      specification?: unknown;
    };
    // Both maps are derived here rather than in the renderer: they are only
    // needed by this one route, and the source walk reads the AST that the
    // instance already holds, so neither costs a second boot.
    const elements = data.elements ?? {};
    return toModelPayload({
      workspace,
      projectId: rendered.projectId,
      model: data,
      elementSources: collectElementSources(rendered.instance, workspace, new Set(Object.keys(elements))),
      elementCode: resolveElementCode(workspace, elements as Record<string, { title?: unknown }>),
    });
  }

  async function loadState(workspace: string): Promise<ArchWorkspaceState | null | undefined> {
    const store = await storePromise;
    return store === null ? undefined : await store.loadWorkspace(workspace);
  }

  async function saveState(workspace: string, state: ArchWorkspaceState): Promise<boolean> {
    const store = await storePromise;
    if (store === null) return false;
    await store.saveWorkspace(workspace, state);
    return true;
  }

  const unregister = registerArchRoutes(webServer, {
    resolveWorkspaceRoot,
    loadViews,
    loadModel,
    loadState,
    saveState,
  });

  // The body runs immediately; only the function it returns is deferred
  // until the fiber unloads. Calling the teardown directly here unregistered
  // the routes in the same turn they were added.
  host.effect?.(() => () => {
    unregister();
    void renderer.dispose();
    void storePromise.then(store => store?.close());
  });
}
