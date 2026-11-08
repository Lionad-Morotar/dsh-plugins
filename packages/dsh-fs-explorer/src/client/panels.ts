/**
 * The file workbench's panel stack.
 *
 * A panel is one open file, and the stack owns tab order, the active panel and
 * the neighbour rule after a close. It stays React-free so the same object can
 * back `useSyncExternalStore` in the view, be driven by unit tests, and be
 * asserted by the acceptance probe without a renderer.
 */
import { baseName } from "dsh-preview-viewers/address.ts";

import { parseFocus } from "./model.ts";

/** One open file panel. */
export interface PanelEntry {
  /** Stable identity: the workspace path, or `git` + NUL + revision + NUL + path. */
  readonly key: string;
  readonly path: string;
  /** The 1-based line the opener asked for; the tab keeps it for later jumps. */
  readonly line: number;
  /** Whether {@link path} is a filesystem path outside the workspace root. */
  readonly absolute: boolean;
  /** Commit object id when this panel shows a commit version. */
  readonly revision?: string;
}

/** One immutable view of the stack. */
export interface PanelSnapshot {
  readonly panels: readonly PanelEntry[];
  readonly active: string | null;
}

/** The panel ledger the view and the probe share. */
export interface PanelStack {
  /**
   * Open a file, or activate it when it is already a panel.
   * @param path - workspace-relative path, or a filesystem path when `absolute`.
   * @param line - the 1-based line to show.
   * @param absolute - keep the leading `/` and hand the path to the file service unchanged.
   * @param revision - commit object id when the panel shows that commit's version.
   */
  open(path: string, line?: number, absolute?: boolean, revision?: string): void;
  /** Close one panel by its key or path; the neighbour takes over. */
  close(path?: string): void;
  /** Make an open panel active by its key or path; unknown targets are ignored. */
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
  const base = baseName(path);
  return base === "" ? path : base;
}

/**
 * Normalize one opener's path.
 *
 * A relative path loses its leading slashes because the host resolves it
 * against the session workspace root, which is the tree's own key space. An
 * absolute path keeps them: stripping `/Users/x/a.ts` to `Users/x/a.ts` would
 * silently address a different file inside the workspace.
 * @param path - the raw path from a focus string or a tree row.
 * @param absolute - whether the path is a filesystem path.
 * @returns the path to key the panel by, or undefined for an empty one.
 */
function normalizePath(path: string, absolute: boolean): string | undefined {
  if (typeof path !== "string") return undefined;
  const slashed = path.trim().replace(/\\/gu, "/").replace(/^(?:\.\/)+/u, "");
  const clean = absolute ? slashed : slashed.replace(/^\/+/u, "");
  return clean === "" ? undefined : clean;
}

const EMPTY: PanelSnapshot = Object.freeze({ panels: Object.freeze([] as PanelEntry[]), active: null });

/**
 * The stable identity of one panel.
 *
 * A commit version is not keyed by `git:<revision>:<path>`: that string is a
 * legal workspace path, so the two panels would dedupe into each other. NUL
 * cannot occur in a path, so the stored key is `git` + NUL + revision + NUL +
 * path. Callers may still spell a commit panel as `git:<revision>:<path>`.
 */
export function panelKey(path: string, revision?: string): string {
  return revision === undefined ? path : `git\u0000${revision}\u0000${path}`;
}

/** Caller spelling `git:<revision>:<path>` for a commit version. The stored key uses NULs. */
const GIT_KEY = /^git:([0-9a-f]{4,64}):(.+)$/iu;

/** Which side of a tab a batch close takes, or every tab but it. */
export type CloseScope = "others" | "right";

/**
 * The panels a batch close from one tab drops, in strip order.
 *
 * Order is the strip's, not the caller's: the caller closes them one by one,
 * and each close republishes the stack, so a list read from one snapshot must
 * stay meaningful while it is consumed.
 * @param panels - the strip as the gesture saw it.
 * @param key - the tab the gesture opened on.
 * @param scope - `others` for every other tab, `right` for the ones after it.
 * @returns the keys to close; empty when the tab is not in the strip.
 */
export function closeBatch(panels: readonly PanelEntry[], key: string, scope: CloseScope): readonly string[] {
  const index = panels.findIndex(panel => panel.key === key);
  if (index < 0) return [];
  const targets = scope === "others" ? panels.filter((_, at) => at !== index) : panels.slice(index + 1);
  return targets.map(panel => panel.key);
}

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

  const indexOf = (key: string): number => rows.findIndex(row => row.key === key);

  /** A path spelling reaches the working-tree row only, never a commit version. */
  const indexOfWorkspace = (path: string): number => rows.findIndex(row => row.revision === undefined && row.key === path);

  /**
   * Resolve one caller-supplied key or path to the key the ledger stores.
   *
   * The exact stored key is tried first because the tab strip hands that back.
   * A `git:<revision>:<path>` spelling names a commit version and is mapped
   * onto the stored key. Anything else is a workspace path: an absolute panel
   * of that name wins, and only its absence lets the relative row answer. A
   * commit version never answers a plain path spelling.
   * @param spelling - key or path as the caller spells it.
   * @returns the key of an open row, or undefined when nothing matches.
   */
  const keyOf = (spelling: string): string | undefined => {
    if (typeof spelling !== "string") return undefined;
    if (indexOf(spelling) >= 0) return spelling;
    const gitMatch = GIT_KEY.exec(spelling);
    if (gitMatch !== null) {
      const revision = (gitMatch[1] ?? "").toLowerCase();
      const path = normalizePath(gitMatch[2] ?? "", false);
      if (path === undefined) return undefined;
      const key = panelKey(path, revision);
      return indexOf(key) >= 0 ? key : undefined;
    }
    const exact = normalizePath(spelling, true);
    if (exact === undefined) return undefined;
    if (indexOfWorkspace(exact) >= 0) return exact;
    const relative = normalizePath(spelling, false);
    if (relative === undefined || relative === exact) return undefined;
    return indexOfWorkspace(relative) >= 0 ? relative : undefined;
  };

  const step = (delta: 1 | -1): void => {
    if (rows.length === 0) return;
    const current = active === null ? -1 : indexOf(active);
    const target = rows[(current + delta + rows.length) % rows.length];
    if (target === undefined || target.key === active) return;
    active = target.key;
    publish();
  };

  return {
    open(path, line = 1, absolute = false, revision) {
      const clean = normalizePath(path, absolute);
      if (clean === undefined) return;
      const cleanRevision = typeof revision === "string" && revision.trim() !== "" ? revision.trim().toLowerCase() : undefined;
      const key = panelKey(clean, cleanRevision);
      const nextLine = Number.isFinite(line) && line > 0 ? Math.trunc(line) : 1;
      const index = indexOf(key);
      if (index >= 0) {
        const current = rows[index];
        const changed = current !== undefined && (current.line !== nextLine || current.absolute !== absolute);
        if (changed) {
          rows = rows.map((row, at) => (at === index ? { ...row, line: nextLine, absolute } : row));
        }
        if (active === key) {
          if (changed) publish();
          return;
        }
        active = key;
        publish();
        return;
      }
      // A fresh tab joins the active one, the way an editor inserts beside the
      // file the reader is looking at instead of at the far end of the strip.
      const insertAt = active === null ? rows.length : indexOf(active) + 1;
      const entry: PanelEntry = {
        key,
        path: clean,
        line: nextLine,
        absolute,
        ...(cleanRevision === undefined ? {} : { revision: cleanRevision }),
      };
      rows = [...rows.slice(0, insertAt), entry, ...rows.slice(insertAt)];
      active = key;
      publish();
    },
    close(path) {
      const target = path === undefined ? active : keyOf(path) ?? null;
      if (target === null) return;
      const index = indexOf(target);
      if (index < 0) return;
      rows = rows.filter(row => row.key !== target);
      if (active === target) {
        const neighbour = rows[index] ?? rows[index - 1];
        active = neighbour?.key ?? null;
      }
      publish();
    },
    activate(path) {
      const key = keyOf(path);
      if (key === undefined || indexOf(key) < 0 || active === key) return;
      active = key;
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
      const key = keyOf(path);
      return key !== undefined && indexOf(key) >= 0;
    },
    activeEntry() {
      return rows.find(row => row.key === active);
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
  /**
   * Open one requested file.
   * @param path - normalized target path.
   * @param line - the 1-based line to show.
   * @param absolute - whether the path is a filesystem path outside the workspace.
   * @param revision - commit object id when the request names a commit version.
   */
  open(path: string, line: number, absolute: boolean, revision?: string): void;
  /**
   * Select one requested row without opening a panel.
   *
   * A `reveal:` request names a row to put the tree cursor on; a sink that
   * cannot move a cursor has nothing to do with it, and the request is then
   * left unconsumed rather than opened as a panel.
   * @param path - normalized workspace-relative path.
   */
  reveal?(path: string): void;
  /**
   * Enter one requested directory: select it and open its front page.
   *
   * The path is absolute when the prose wrote it in full, because resolving it
   * against the workspace is the view's job; a sink that cannot do that leaves
   * the request unconsumed.
   * @param path - workspace-relative or absolute directory path.
   * @param absolute - whether the path is a filesystem path rather than a workspace one.
   */
  enter?(path: string, absolute: boolean): void;
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
 * Callers hand over `path:<workspace path>:<line>` (the Git changes pane, the
 * command palette), `abs:<filesystem path>:<line>` (the address bridge),
 * `git:<hash>:<line>:<path>` (commit details), `reveal:<workspace path>` (the
 * side bars, which want the row selected and no panel opened) or
 * `enter:<path>` (the chat prose, which wants a directory entered); anything
 * else is left alone. The caller owns `completeViewRequest()` because only the
 * host knows when the request has been painted.
 * @param focus - the request payload, or undefined when the tab was opened directly.
 * @param sink - opens the parsed path at the parsed line, or selects it.
 * @returns whether the focus was a path request.
 */
export function consumeViewRequest(focus: string | undefined, sink: ViewRequestSink): boolean {
  const target = parseFocus(focus);
  if (target === undefined) return false;
  if (target.reveal === true) {
    if (sink.reveal === undefined) return false;
    sink.reveal(target.path);
    return true;
  }
  if (target.enter === true) {
    if (sink.enter === undefined) return false;
    sink.enter(target.path, target.absolute);
    return true;
  }
  sink.open(target.path, target.line, target.absolute, target.revision);
  return true;
}
