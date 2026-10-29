/**
 * The file workbench's panel stack.
 *
 * A panel is one open file, and the stack owns tab order, the active panel and
 * the neighbour rule after a close. It stays React-free so the same object can
 * back `useSyncExternalStore` in the view, be driven by unit tests, and be
 * asserted by the acceptance probe without a renderer.
 */
import { parseFocus } from "./model.ts";

/** One open file panel. */
export interface PanelEntry {
  readonly path: string;
  /** The 1-based line the opener asked for; the tab keeps it for later jumps. */
  readonly line: number;
}

/** One immutable view of the stack. */
export interface PanelSnapshot {
  readonly panels: readonly PanelEntry[];
  readonly active: string | null;
}

/** The panel ledger the view and the probe share. */
export interface PanelStack {
  /** Open a file, or activate it when it is already a panel. */
  open(path: string, line?: number): void;
  /** Close one panel, or the active one; the neighbour takes over. */
  close(path?: string): void;
  /** Make an open panel active; unknown paths are ignored. */
  activate(path: string): void;
  /** Activate the next panel, wrapping at the end. */
  next(): void;
  /** Activate the previous panel, wrapping at the start. */
  previous(): void;
  /** Drop every panel, e.g. when the conversation changes. */
  reset(): void;
  isOpen(path: string): boolean;
  activeEntry(): PanelEntry | undefined;
  /** Stable snapshot object; a new one is published only on change. */
  snapshot(): PanelSnapshot;
  subscribe(listener: () => void): () => void;
}

/** The tab caption for a workspace path: its basename. */
export function panelTitle(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1);
  return base === "" ? path : base;
}

function normalizePath(path: string): string | undefined {
  if (typeof path !== "string") return undefined;
  const clean = path.trim().replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/^\/+/u, "");
  return clean === "" ? undefined : clean;
}

const EMPTY: PanelSnapshot = Object.freeze({ panels: Object.freeze([] as PanelEntry[]), active: null });

/**
 * Build one panel stack.
 * @returns the stack; its snapshot is stable between changes.
 */
export function createPanelStack(): PanelStack {
  let rows: readonly PanelEntry[] = [];
  let active: string | null = null;
  let snapshot: PanelSnapshot = EMPTY;
  const listeners = new Set<() => void>();

  const publish = (): void => {
    snapshot = Object.freeze({ panels: Object.freeze(rows.slice()), active });
    for (const listener of [...listeners]) listener();
  };

  const indexOf = (path: string): number => rows.findIndex(row => row.path === path);

  const step = (delta: 1 | -1): void => {
    if (rows.length === 0) return;
    const current = active === null ? -1 : indexOf(active);
    const target = rows[(current + delta + rows.length) % rows.length];
    if (target === undefined || target.path === active) return;
    active = target.path;
    publish();
  };

  return {
    open(path, line = 1) {
      const clean = normalizePath(path);
      if (clean === undefined) return;
      const nextLine = Number.isFinite(line) && line > 0 ? Math.trunc(line) : 1;
      const index = indexOf(clean);
      if (index >= 0) {
        const current = rows[index];
        if (current !== undefined && current.line !== nextLine) {
          rows = rows.map((row, at) => (at === index ? { path: clean, line: nextLine } : row));
        }
        if (active === clean) {
          if (current !== undefined && current.line !== nextLine) publish();
          return;
        }
        active = clean;
        publish();
        return;
      }
      // A fresh tab joins the active one, the way an editor inserts beside the
      // file the reader is looking at instead of at the far end of the strip.
      const insertAt = active === null ? rows.length : indexOf(active) + 1;
      rows = [...rows.slice(0, insertAt), { path: clean, line: nextLine }, ...rows.slice(insertAt)];
      active = clean;
      publish();
    },
    close(path) {
      const target = path ?? active;
      if (target === null) return;
      const index = indexOf(target);
      if (index < 0) return;
      rows = rows.filter(row => row.path !== target);
      if (active === target) {
        const neighbour = rows[index] ?? rows[index - 1];
        active = neighbour?.path ?? null;
      }
      publish();
    },
    activate(path) {
      const clean = normalizePath(path);
      if (clean === undefined || indexOf(clean) < 0 || active === clean) return;
      active = clean;
      publish();
    },
    next() {
      step(1);
    },
    previous() {
      step(-1);
    },
    reset() {
      if (rows.length === 0 && active === null) return;
      rows = [];
      active = null;
      publish();
    },
    isOpen(path) {
      const clean = normalizePath(path);
      return clean !== undefined && indexOf(clean) >= 0;
    },
    activeEntry() {
      return rows.find(row => row.path === active);
    },
    snapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** The surface a view request opens panels through. */
export interface ViewRequestSink {
  open(path: string, line: number): void;
}

/** One stack per conversation, owned by the view factory that mounts them. */
export interface PanelStackRegistry {
  forSession(sessionId: string | undefined): PanelStack;
}

/**
 * Build the session-keyed stack registry.
 *
 * The host unmounts a conversation view whenever the reader switches to the
 * Git or chat tab, so a stack owned by the component would silently drop every
 * open file on the way back. The registry lives in the view factory closure:
 * separate conversations never share tabs, and returning to a session restores
 * what was open there.
 * @returns the registry; the empty session id backs a session-less mount.
 */
export function createPanelStackRegistry(): PanelStackRegistry {
  const stacks = new Map<string, PanelStack>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = stacks.get(key);
      if (existing !== undefined) return existing;
      const created = createPanelStack();
      stacks.set(key, created);
      return created;
    },
  };
}

/**
 * Parse and consume one `openView("fs-explorer", focus)` request.
 *
 * The Git panel hands over `path:<workspace path>:<line>`; anything else is
 * left alone. The caller owns `completeViewRequest()` because only the host
 * knows when the request has been painted.
 * @param focus - the request payload, or undefined when the tab was opened directly.
 * @param sink - opens the parsed path at the parsed line.
 * @returns whether the focus was a path request.
 */
export function consumeViewRequest(focus: string | undefined, sink: ViewRequestSink): boolean {
  const target = parseFocus(focus);
  if (target === undefined) return false;
  sink.open(target.path, target.line);
  return true;
}
