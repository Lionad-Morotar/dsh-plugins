/**
 * The dock's contact surface with the rest of the client.
 *
 * Everything here is resolved on use, never captured at apply time: `apply` runs
 * before the page has necessarily mounted a terminal service, and the acceptance
 * probe applies the plugin against a context that has none at all. A missing
 * service therefore has to answer `undefined` rather than throw.
 *
 * Two seams are read:
 * - the core `workbench` service for "which session am I looking at" and for the
 *   single sanctioned way back to chat (`views.showChat`, blueprint D6);
 * - the host `webTerminals` service for the terminal views themselves.
 */
import type { TerminalViewLike } from "./binding.ts";
import type { DockVisibilitySource } from "./dock-controller.ts";

/** The host service that owns browser terminal views. */
export interface WebTerminalsFace {
  view(sessionId: string, key: string, contentId: string, terminalId?: string, shellPath?: string): TerminalViewLike;
}

/** The core service members this package reads. */
export interface WorkbenchFace {
  readonly version?: number;
  /** Observable dock switch; present from core contract version 1 onward. */
  readonly dockVisibility?: DockVisibilitySource;
  readonly dockVisible?: () => boolean;
  readonly currentSessionId?: () => string | undefined;
  readonly views?: { showChat?: (sessionId: string) => boolean };
  /** Announce the dock to the core's own registry; the core owns its ledger. */
  readonly registerDock?: (dock: { readonly id: string; readonly title: string }) => () => void;
}

/** Everything the dock needs from its host, as plain functions. */
export interface DockHost {
  /** The session the user is looking at, or undefined when none is open. */
  currentSessionId(): string | undefined;
  /** Return one session to the resident chat view; false when nothing is bound. */
  showChat(sessionId: string): boolean;
  /** The terminal service, or undefined when this deployment has none. */
  terminals(): WebTerminalsFace | undefined;
}

interface ContextLike {
  get?(name: string): unknown;
  [key: string]: unknown;
}

/**
 * Read a Cordis service by name, falling back to the plain property that test
 * doubles and pre-reflect hosts expose.
 * @param ctx - the client context.
 * @param name - service name.
 * @returns the raw value, or undefined.
 */
export function readHostService(ctx: unknown, name: string): unknown {
  if (ctx === null || typeof ctx !== "object") return undefined;
  const getter = (ctx as ContextLike).get;
  const resolved = typeof getter === "function" ? getter.call(ctx, name) : undefined;
  if (resolved !== undefined && resolved !== null) return resolved;
  return (ctx as ContextLike)[name];
}

const nonEmpty = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

/**
 * Whether the core wants this dock on screen.
 *
 * Absent switch means "visible": a core older than this plugin must not silently
 * hide the terminal.
 * @param workbench - the core service, when mounted.
 * @returns false only when the core explicitly says so.
 */
export function readDockVisible(workbench: WorkbenchFace | undefined): boolean {
  if (workbench === undefined || workbench === null) return false;
  if (typeof workbench.dockVisible !== "function") return true;
  return workbench.dockVisible() !== false;
}

/** Whether a value is the core's observable switch rather than a stray field. */
function isDockVisibilitySource(value: unknown): value is DockVisibilitySource {
  if (value === null || typeof value !== "object") return false;
  const source = value as { get?: unknown; subscribe?: unknown };
  return typeof source.get === "function" && typeof source.subscribe === "function";
}

/**
 * Resolve the dock switch as a subscribeable source.
 *
 * A core with the observable store is authoritative. An older core only has the
 * boolean pair, so it is wrapped as a static source: the dock still respects the
 * value it read at apply time, it just cannot react to a later flip.
 * @param workbench - the core service, when mounted.
 * @returns a source the dock controller can subscribe to; never undefined.
 */
export function readDockVisibility(workbench: WorkbenchFace | undefined): DockVisibilitySource {
  if (workbench !== undefined && workbench !== null && isDockVisibilitySource(workbench.dockVisibility)) {
    return workbench.dockVisibility;
  }
  return {
    get: () => readDockVisible(workbench),
    subscribe: () => () => {},
  };
}

/**
 * Build the host face for one client mount.
 * @param ctx - the client context `apply` received.
 * @returns lazily-resolved seams.
 */
export function createDockHost(ctx: unknown): DockHost {
  const workbench = (): WorkbenchFace | undefined => {
    const service = readHostService(ctx, "workbench") ?? (ctx as ContextLike).workbench;
    return service !== null && typeof service === "object" ? (service as WorkbenchFace) : undefined;
  };

  return {
    currentSessionId: () => nonEmpty(workbench()?.currentSessionId?.()),
    showChat(sessionId) {
      if (sessionId === "") return false;
      return workbench()?.views?.showChat?.(sessionId) === true;
    },
    terminals() {
      const service = readHostService(ctx, "webTerminals");
      if (service === null || service === undefined) return undefined;
      if (typeof service !== "object" && typeof service !== "function") return undefined;
      const view = (service as { view?: unknown }).view;
      return typeof view === "function" ? (service as WebTerminalsFace) : undefined;
    },
  };
}
