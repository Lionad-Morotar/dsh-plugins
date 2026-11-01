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
import { createRenderer, toModelPayload, toViewsPayload, type WorkspaceRenderer } from "./host/render.ts";
import { registerArchRoutes, type WebServerFace } from "./host/routes.ts";
import {
  canonicalPath,
  resolveSessionRoot,
  type SessionPersistenceFace,
  type SessionsFace,
  type WorkspaceRegistryFace,
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
  effect?(onCleanup: () => void | Promise<void>): void;
}

function readService(ctx: HostContext, name: string): unknown {
  const value = ctx.get?.(name);
  return value === null ? undefined : value;
}

export function apply(ctx: Context): void {
  const host = ctx as unknown as HostContext;
  const webServer = readService(host, "webServer") as WebServerFace | undefined;
  const sessions = readService(host, "sessions") as SessionsFace | undefined;
  const sessionPersistence = readService(host, "sessionPersistence") as SessionPersistenceFace | undefined;
  const workspaceRegistry = readService(host, "workspaceRegistry") as WorkspaceRegistryFace | undefined;
  const storageDomain = readService(host, "storageDomain") as StorageDomainFace | undefined;

  // Activation observability: a silent pending fiber is indistinguishable from
  // a missing module from the outside, and both have bitten already.
  console.info(
    `[dsh-arch] activating; services=${JSON.stringify({
      webServer: webServer !== undefined,
      sessions: sessions !== undefined,
      sessionPersistence: sessionPersistence !== undefined,
      workspaceRegistry: workspaceRegistry !== undefined,
      storageDomain: storageDomain !== undefined,
    })}`,
  );

  if (webServer === undefined) return;

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
    return toModelPayload({ workspace, projectId: rendered.projectId, model: data });
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

  host.effect?.(() => {
    unregister();
    void renderer.dispose();
    void storePromise.then(store => store?.close());
  });
}
