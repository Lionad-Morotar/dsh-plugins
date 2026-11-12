// @vitest-environment jsdom
/**
 * The browser half's behaviour around one host archive.
 *
 * These cases stand in for the host's own wiring: a snapshot store for
 * `selection`, another for `workspaces.list`, the sidebar's session rows, and
 * the two navigation calls. The host order matters and is mirrored here: the
 * archive set changes first (the plugin has to snapshot the sidebar before React
 * repaints the row away), then `clearMain()` empties `selection`, and only then
 * does the plugin's zero-delay timer run.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mountLanding, type UiWorkspaceWire } from "../src/client/entry.ts";

/** One workspace as `workspaces.list` publishes it. */
interface WorkspaceItem {
  readonly workspaceId: string;
  readonly sessionIds: readonly string[];
}

/** The slice of the workspaces snapshot these cases write. */
interface ListSnapshot {
  readonly phase: "pending" | "ready";
  readonly items: readonly WorkspaceItem[];
  readonly archivedSessionIds: readonly string[];
  readonly pinnedSessionIds: readonly string[];
}

/** A snapshot store with the host's two-method face plus a test setter. */
interface Store<T> {
  getSnapshot(): T;
  subscribe(listener: () => void): () => void;
  set(next: T): void;
  readonly listenerCount: number;
}

/**
 * Build a snapshot store whose listeners run synchronously on `set`, like the
 * host's cordis-free snapshot stores.
 * @param initial - the first snapshot.
 * @returns the store.
 */
function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set: (next) => {
      value = next;
      for (const listener of [...listeners]) listener();
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

/** One mounted plugin instance with its stores and spies. */
interface Mounted {
  readonly selection: Store<{ sessionId?: string }>;
  readonly list: Store<ListSnapshot>;
  readonly openSession: ReturnType<typeof vi.fn>;
  readonly startSession: ReturnType<typeof vi.fn>;
  /** Repaint the sidebar rows in the given order. */
  rows(ids: readonly string[]): void;
  /** Archive a session on the host: the set changes, then `clearMain` runs. */
  archive(id: string): void;
  dispose(): void;
}

let mounted: Mounted | undefined;

/**
 * Paint sidebar session rows in visual order.
 * @param ids - the session ids, top to bottom.
 */
function paintRows(ids: readonly string[]): void {
  document.body.innerHTML = "";
  for (const id of ids) {
    const row = document.createElement("div");
    row.setAttribute("data-row-key", `session:${id}`);
    document.body.append(row);
  }
}

/**
 * Mount the plugin against fake host services.
 * @param options - the starting selection, workspaces, archive set and rows.
 * @returns the mounted instance.
 */
function mount(options: {
  selection?: string;
  items?: readonly WorkspaceItem[];
  archived?: readonly string[];
  pinned?: readonly string[];
  phase?: "pending" | "ready";
  rows?: readonly string[];
}): Mounted {
  const selection = createStore<{ sessionId?: string }>(
    options.selection === undefined ? {} : { sessionId: options.selection },
  );
  const list = createStore<ListSnapshot>({
    phase: options.phase ?? "ready",
    items: options.items ?? [],
    archivedSessionIds: options.archived ?? [],
    pinnedSessionIds: options.pinned ?? [],
  });
  paintRows(options.rows ?? (options.items ?? []).flatMap((item) => item.sessionIds));
  const openSession = vi.fn();
  const startSession = vi.fn();
  const uiWorkspace: UiWorkspaceWire = {
    selection,
    workspaces: { list },
    openSession,
    startSession,
  };
  const dispose = mountLanding(uiWorkspace);
  const snapshot = (): ListSnapshot => list.getSnapshot();
  return {
    selection,
    list,
    openSession,
    startSession,
    rows: paintRows,
    archive: (id) => {
      list.set({ ...snapshot(), archivedSessionIds: [...snapshot().archivedSessionIds, id] });
      // The host's clearMain runs after the registry write; in the `/archive`
      // path it runs inside the same notification.
      selection.set({});
    },
    dispose,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = "";
});

afterEach(() => {
  mounted?.dispose();
  mounted = undefined;
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("landing after a current-session archive", () => {
  it("opens the session below the archived one", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    });
    mounted.archive("b");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("c");
    expect(mounted.startSession).not.toHaveBeenCalled();
  });

  it("opens the session above when the archived one was last", () => {
    mounted = mount({
      selection: "c",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    });
    mounted.archive("c");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("b");
  });

  it("starts a conversation in the same workspace when no other session is left", () => {
    mounted = mount({
      selection: "a",
      items: [{ workspaceId: "w1", sessionIds: ["a"] }],
    });
    mounted.archive("a");
    vi.advanceTimersByTime(0);
    expect(mounted.startSession).toHaveBeenCalledWith("w1");
    expect(mounted.openSession).not.toHaveBeenCalled();
  });

  it("leaves the main view alone when a different session is archived", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    });
    mounted.archive("a");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).not.toHaveBeenCalled();
    expect(mounted.startSession).not.toHaveBeenCalled();
  });

  it("does not override a session the user opened before the timer ran", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    });
    mounted.list.set({
      ...mounted.list.getSnapshot(),
      archivedSessionIds: ["b"],
    });
    mounted.selection.set({ sessionId: "z" });
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).not.toHaveBeenCalled();
    expect(mounted.startSession).not.toHaveBeenCalled();
  });

  it("falls back to the workspace data order when the sidebar painted no rows", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
      rows: [],
    });
    mounted.archive("b");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("c");
  });

  it("keeps the pre-archive data order when the updated workspace no longer lists the session", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
      rows: [],
    });
    mounted.list.set({
      ...mounted.list.getSnapshot(),
      items: [{ workspaceId: "w1", sessionIds: ["a", "c"] }],
      archivedSessionIds: ["b"],
    });
    mounted.selection.set({});
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("c");
  });

  it("follows the last selection change, not the session selected at mount", () => {
    mounted = mount({
      selection: "a",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    });
    mounted.selection.set({ sessionId: "b" });
    mounted.archive("b");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("c");
  });

  it("continues below a row that is the last painted one because the list is folded", () => {
    mounted = mount({
      selection: "c",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c", "d", "e"] }],
      rows: ["a", "b", "c"],
    });
    mounted.archive("c");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("d");
  });

  it("skips a neighbour that is itself archived", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c", "d"] }],
      archived: ["c"],
    });
    mounted.archive("b");
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).toHaveBeenCalledWith("d");
  });

  it("resolves the workspace at archive time when the list loads after mount", () => {
    mounted = mount({ selection: "a", phase: "pending", items: [] });
    mounted.list.set({
      phase: "ready",
      items: [{ workspaceId: "w1", sessionIds: ["a"] }],
      archivedSessionIds: [],
      pinnedSessionIds: [],
    });
    mounted.archive("a");
    vi.advanceTimersByTime(0);
    expect(mounted.startSession).toHaveBeenCalledWith("w1");
  });

  it("asks the host for a conversation without a workspace when the session has none", () => {
    mounted = mount({ selection: "a", items: [] });
    mounted.archive("a");
    vi.advanceTimersByTime(0);
    expect(mounted.startSession).toHaveBeenCalledTimes(1);
    expect(mounted.startSession.mock.calls[0]).toEqual([]);
  });

  it("ignores an archive set that was already populated when the plugin mounted", () => {
    mounted = mount({ selection: "a", phase: "pending", items: [] });
    mounted.list.set({
      phase: "ready",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b"] }],
      archivedSessionIds: ["a"],
      pinnedSessionIds: [],
    });
    vi.advanceTimersByTime(0);
    expect(mounted.openSession).not.toHaveBeenCalled();
    expect(mounted.startSession).not.toHaveBeenCalled();
  });

  it("stops watching and drops the pending landing when disposed", () => {
    mounted = mount({
      selection: "b",
      items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    });
    const instance = mounted;
    instance.list.set({ ...instance.list.getSnapshot(), archivedSessionIds: ["b"] });
    instance.dispose();
    vi.advanceTimersByTime(0);
    expect(instance.openSession).not.toHaveBeenCalled();
    expect(instance.selection.listenerCount).toBe(0);
    expect(instance.list.listenerCount).toBe(0);
  });
});
