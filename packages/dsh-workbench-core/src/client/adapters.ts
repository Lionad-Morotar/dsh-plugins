/**
 * The workbench's only contact surface with host internals.
 *
 * Every adapter is structural: it probes a Cordis service by name and required
 * members, or a DOM anchor by attribute, and reports absence instead of
 * throwing. Host upgrades therefore break at most one file, and a deployment
 * that does not mount a service degrades its own panel instead of taking the
 * whole row down.
 *
 * Shapes mirror the pinned host packages:
 * - `workspaceFiles` — list / read / stat / changes (file explorer data source)
 * - `subprocess` — spawn (Git argv runner)
 * - `webTerminals` — view / close / recover (the browser PTY service)
 * - composer overlay — the `data-conversation-composer-overlay` DOM anchor
 */

/** The slice of `workspaceFiles` the file explorer will consume. */
export interface WorkspaceFilesFace {
  list(...args: unknown[]): unknown;
  read(...args: unknown[]): unknown;
  stat(...args: unknown[]): unknown;
  changes?(...args: unknown[]): unknown;
}

/** The slice of `subprocess` the Git explorer will consume. */
export interface SubprocessFace {
  spawn(...args: unknown[]): unknown;
}

/** The slice of `webTerminals` the terminal dock will consume. */
export interface WebTerminalsFace {
  view(...args: unknown[]): unknown;
  close(...args: unknown[]): unknown;
  recover(...args: unknown[]): unknown;
}

/** A host service read on each call, never captured as a hard dependency. */
export interface ServiceFace<T> {
  /** Cordis service name. */
  readonly name: string;
  /** Whether the service is mounted and shaped as expected. */
  available(): boolean;
  /** The service, or undefined when it is absent or half-shaped. */
  get(): T | undefined;
}

/** The attribute the conversation shell puts on its composer overlay. */
export const COMPOSER_OVERLAY_ATTRIBUTE = "data-conversation-composer-overlay";

/** Selector form of {@link COMPOSER_OVERLAY_ATTRIBUTE}. */
export const COMPOSER_OVERLAY_SELECTOR = `[${COMPOSER_OVERLAY_ATTRIBUTE}]`;

/** Measured box of the composer overlay anchor. */
export interface OverlayMetrics {
  readonly width: number;
  readonly height: number;
}

/** DOM seam used to decide whether the terminal dock sits above the composer. */
export interface ComposerOverlayAdapter {
  readonly selector: string;
  available(): boolean;
  element(): Element | null;
  measure(): OverlayMetrics | null;
}

/** Everything the workbench adapts from the host. */
export interface WorkbenchAdapters {
  readonly files: ServiceFace<WorkspaceFilesFace>;
  readonly subprocess: ServiceFace<SubprocessFace>;
  readonly terminals: ServiceFace<WebTerminalsFace>;
  readonly composerOverlay: ComposerOverlayAdapter;
}

interface ContextLike {
  get?(name: string): unknown;
}

/**
 * Read a service through the context's resolver, falling back to a plain
 * property for test doubles and pre-reflect hosts.
 * @param ctx - the client context.
 * @param name - Cordis service name.
 * @returns the raw service value, or undefined.
 */
export function readHostService(ctx: unknown, name: string): unknown {
  if (ctx === null || typeof ctx !== "object") return undefined;
  const getter = (ctx as ContextLike).get;
  // Cordis's `get` is the non-throwing resolver and works without declaring the
  // service in `inject`; a property read on a real context throws for exactly
  // that reason. Only contexts without `get` (the plain objects unit tests use)
  // are read directly.
  if (typeof getter === "function") {
    const value = getter.call(ctx, name);
    return value === null ? undefined : value;
  }
  return (ctx as unknown as Record<string, unknown>)[name];
}

/**
 * Probe one host service by name and member names.
 * @param ctx - the client context.
 * @param name - Cordis service name.
 * @param members - methods that must be functions for the face to count as present.
 * @returns a lazy face; nothing is captured.
 */
export function probeService<T extends object>(
  ctx: unknown,
  name: string,
  members: readonly string[],
): ServiceFace<T> {
  const read = (): T | undefined => {
    const value = readHostService(ctx, name);
    if (value === null || typeof value !== "object") return undefined;
    const record = value as Record<string, unknown>;
    for (const member of members) {
      if (typeof record[member] !== "function") return undefined;
    }
    return value as T;
  };
  return { name, get: read, available: () => read() !== undefined };
}

/**
 * Build the DOM seam for the conversation composer overlay.
 *
 * The document is passed in rather than read from the module scope so the
 * package stays evaluable in Node (the acceptance probe and unit tests load the
 * bundle without a browser).
 * @param doc - the document to query, or undefined outside a browser.
 * @returns the adapter; all methods answer null when the anchor is absent.
 */
export function createComposerOverlayAdapter(doc: Document | undefined): ComposerOverlayAdapter {
  const element = (): Element | null => doc?.querySelector(COMPOSER_OVERLAY_SELECTOR) ?? null;
  return {
    selector: COMPOSER_OVERLAY_SELECTOR,
    available: () => element() !== null,
    element,
    measure() {
      const found = element();
      if (found === null || typeof found.getBoundingClientRect !== "function") return null;
      const rect = found.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    },
  };
}

/**
 * Build every adapter for one mount.
 * @param ctx - the client context.
 * @param doc - the browser document, when one exists.
 * @returns the adapter bundle.
 */
export function createHostAdapters(ctx: unknown, doc: Document | undefined): WorkbenchAdapters {
  return {
    files: probeService<WorkspaceFilesFace>(ctx, "workspaceFiles", ["list", "read", "stat"]),
    subprocess: probeService<SubprocessFace>(ctx, "subprocess", ["spawn"]),
    terminals: probeService<WebTerminalsFace>(ctx, "webTerminals", ["view", "close", "recover"]),
    composerOverlay: createComposerOverlayAdapter(doc),
  };
}
