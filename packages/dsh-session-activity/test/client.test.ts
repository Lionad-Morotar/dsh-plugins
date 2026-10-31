/**
 * The browser half as it runs in a page.
 *
 * Two subjects share this file because they are one pipeline: the writer owns
 * the single `<style>` element, and the entry decides what text goes into it.
 * The page is a fake DOM and the host is a fake pair of snapshot sources, so the
 * cases can assert the things that are invisible in a real sidebar: which rows get
 * painted at all, how often the DOM is touched, and what happens on unload.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apply, type ClientContextLike, type WorkspaceSnapshotWire } from "../src/client/entry.ts";
import type { SessionListWire } from "../src/client/reading.ts";
import { STYLE_TAG_ID } from "../src/client/styles.ts";
import { createWriter } from "../src/client/writer.ts";

const DAY_MS = 86_400_000;
const NOW = 1_800_000_000_000;

/** The invariants every stylesheet ends with. */
const BASE = [
  '[data-row-key^="workspace:"]:hover .JoiKIa_title{opacity:1}',
  '[data-row-key^="workspace:"]:has(.JoiKIa_folderActive) .JoiKIa_title{opacity:1}',
].join("\n");

/** The accent a hot workspace's title carries. */
const HOT = "color:var(--dsw-alias-state-business-primary);font-weight:600";

/** One `<style>` element as the writer creates it. */
class FakeStyleElement {
  readonly attributes = new Map<string, string>();
  writes = 0;
  removed = false;
  parent: FakeHead | undefined;
  #text = "";

  constructor(readonly tagName: string) {}

  get textContent(): string {
    return this.#text;
  }

  set textContent(value: string) {
    this.#text = value;
    this.writes += 1;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  remove(): void {
    this.removed = true;
    if (this.parent !== undefined) this.parent.children = this.parent.children.filter((one) => one !== this);
  }
}

/** The document head the writer mounts into. */
class FakeHead {
  children: FakeStyleElement[] = [];

  appendChild(element: FakeStyleElement): void {
    element.parent = this;
    this.children.push(element);
  }
}

/** A document exposing only what the writer and the entry touch. */
function fakeDocument(): { document: Document; head: FakeHead } {
  const head = new FakeHead();
  const document = { head, createElement: (tagName: string) => new FakeStyleElement(tagName) };
  return { document: document as unknown as Document, head };
}

/** The stylesheet text currently in the page. */
function css(head: FakeHead): string {
  return head.children[0]?.textContent ?? "";
}

/** How many times the page's stylesheet text was written. */
function writes(head: FakeHead): number {
  return head.children.reduce((total, one) => total + one.writes, 0);
}

/** Let every queued microtask run, which is where a recompute lands. */
async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

/** One `sessionActivity` view as the host ships it. */
function view(lastActivityAt: number | null): Record<string, unknown> {
  return { lastActivityAt, promptCount: 0, turnCount: 0, toolCallCount: 0 };
}

/** A session list snapshot over the given sessions and shared projection cells. */
function sessions(
  byId: Record<string, Record<string, unknown>>,
  shared: Record<string, Record<string, unknown>> = {},
): SessionListWire {
  return { byId, projectionsBySession: shared } as unknown as SessionListWire;
}

/** A session row carrying its projection on the object layer. */
function session(lastActivityAt: number | null, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { running: false, updatedAt: NOW, projectionValues: { sessionActivity: view(lastActivityAt) }, ...overrides };
}

/** A workspaces snapshot listing one item per workspace. */
function workspaces(...items: readonly Record<string, unknown>[]): WorkspaceSnapshotWire {
  return { items } as unknown as WorkspaceSnapshotWire;
}

/** One workspace item carrying its member session ids. */
function workspace(workspaceId: string, sessionIds: readonly string[]): Record<string, unknown> {
  return { workspaceId, path: `/tmp/${workspaceId}`, title: workspaceId, sessionIds, createdAt: new Date(NOW).toISOString() };
}

/** A host double: two mutable snapshots and two listener sets. */
function fakeHost(initialSessions: SessionListWire, initialWorkspaces: WorkspaceSnapshotWire = workspaces()) {
  const { document, head } = fakeDocument();
  vi.stubGlobal("document", document);
  const sessionListeners = new Set<() => void>();
  const workspaceListeners = new Set<() => void>();
  let list = initialSessions;
  let groups = initialWorkspaces;
  const ctx: ClientContextLike = {
    sessions: {
      list: {
        getSnapshot: () => list,
        subscribe: (listener: () => void) => {
          sessionListeners.add(listener);
          return () => {
            sessionListeners.delete(listener);
          };
        },
      },
    },
    workspaces: {
      list: {
        getSnapshot: () => groups,
        subscribe: (listener: () => void) => {
          workspaceListeners.add(listener);
          return () => {
            workspaceListeners.delete(listener);
          };
        },
      },
    },
  };
  return {
    ctx,
    head,
    notifySessions: () => {
      for (const listener of [...sessionListeners]) listener();
    },
    notifyWorkspaces: () => {
      for (const listener of [...workspaceListeners]) listener();
    },
    setSessions: (next: SessionListWire) => {
      list = next;
    },
    setWorkspaces: (next: WorkspaceSnapshotWire) => {
      groups = next;
    },
    sessionListeners: () => sessionListeners.size,
    workspaceListeners: () => workspaceListeners.size,
  };
}

describe("createWriter", () => {
  it("mounts one tagged style element and fills it", () => {
    const { document, head } = fakeDocument();
    const writer = createWriter(document);
    writer.update("a{color:red}");
    expect(head.children).toHaveLength(1);
    expect(head.children[0]?.tagName).toBe("style");
    expect(head.children[0]?.attributes.get("data-plugin-css")).toBe(STYLE_TAG_ID);
    expect(css(head)).toBe("a{color:red}");
  });

  it("leaves the DOM alone when the text has not changed", () => {
    const { document, head } = fakeDocument();
    const writer = createWriter(document);
    writer.update("a{color:red}");
    writer.update("a{color:red}");
    expect(writes(head)).toBe(1);
    expect(head.children).toHaveLength(1);
  });

  it("rewrites the same element when the text changes", () => {
    const { document, head } = fakeDocument();
    const writer = createWriter(document);
    writer.update("a{color:red}");
    writer.update("a{color:blue}");
    expect(writes(head)).toBe(2);
    expect(head.children).toHaveLength(1);
    expect(css(head)).toBe("a{color:blue}");
  });

  it("removes the element on dispose and stays disposed", () => {
    const { document, head } = fakeDocument();
    const writer = createWriter(document);
    writer.update("a{color:red}");
    writer.dispose();
    expect(head.children).toHaveLength(0);
    expect(() => writer.dispose()).not.toThrow();
    writer.update("a{color:blue}");
    expect(head.children).toHaveLength(0);
  });
});

describe("apply", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("paints a workspace holding a running session hot, on its title", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([`[data-row-key="workspace:w1"] .JoiKIa_title{${HOT}}`, BASE].join("\n"));
    dispose();
  });

  it("dims a workspace from its newest member, not its oldest", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS), s2: session(NOW - 10 * DAY_MS) }),
      workspaces(workspace("w1", ["s1", "s2"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(['[data-row-key="workspace:w1"] .JoiKIa_title{opacity:0.55}', BASE].join("\n"));
    dispose();
  });

  it("leaves every session row untouched, whatever its own reading says", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS), s2: session(NOW - 10 * DAY_MS) }),
      workspaces(workspace("w1", ["s1"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).not.toContain('data-row-key="session:');
    expect(css(host.head)).not.toContain(".JoiKIa_sessionRow");
    dispose();
  });

  it("counts an archived member into the factor", async () => {
    // The archived set lives on the workspaces snapshot and must not exclude a
    // member: an archived session is still a session someone worked in.
    const host = fakeHost(
      sessions({ s1: session(NOW - 30 * 60_000) }),
      { items: [workspace("w1", ["s1"])], archivedSessionIds: ["s1"] } as unknown as WorkspaceSnapshotWire,
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([`[data-row-key="workspace:w1"] .JoiKIa_title{${HOT}}`, BASE].join("\n"));
    dispose();
  });

  it("leaves a warm workspace at the host's own styling", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 2 * 3_600_000) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("paints nothing for a workspace with no members, so a fresh workspace is never dimmed", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", [])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("paints nothing for a workspace whose members the session list cannot resolve", async () => {
    const host = fakeHost(sessions({}), workspaces(workspace("w1", ["gone"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("skips an item without a usable workspace id, because the ungrouped bucket has none", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces({ workspaceId: "", sessionIds: ["s1"] }, { sessionIds: ["s1"] }));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("reads a malformed workspaces snapshot as no workspace at all", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), {} as WorkspaceSnapshotWire);
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("repaints from the shared projection cell rather than the object layer", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS) }, { s1: { state: "ready", values: { sessionActivity: view(NOW - 10 * 60_000) } } }),
      workspaces(workspace("w1", ["s1"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain(HOT);
    dispose();
  });

  it("repaints when the session list notifies, coalescing one burst into one write", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(writes(host.head)).toBe(1);

    host.setSessions(sessions({ s1: session(NOW - 4 * DAY_MS) }));
    host.notifySessions();
    host.notifySessions();
    host.notifySessions();
    await flush();

    expect(writes(host.head)).toBe(2);
    expect(css(host.head)).toBe(['[data-row-key="workspace:w1"] .JoiKIa_title{opacity:0.55}', BASE].join("\n"));
    dispose();
  });

  it("repaints when the workspace list notifies, because membership can change without the session list", async () => {
    const host = fakeHost(
      sessions({ s1: session(null, { running: true }), s2: session(NOW - 4 * DAY_MS) }),
      workspaces(workspace("w1", ["s1"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain(HOT);

    host.setWorkspaces(workspaces(workspace("w1", ["s1", "s2"]), workspace("w2", ["s1"])));
    host.notifyWorkspaces();
    await flush();

    expect(css(host.head)).toBe(
      [
        `[data-row-key="workspace:w1"] .JoiKIa_title{${HOT}}`,
        `[data-row-key="workspace:w2"] .JoiKIa_title{${HOT}}`,
        BASE,
      ].join("\n"),
    );
    dispose();
  });

  it("drops a workspace from the sheet when the host removes it", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 4 * DAY_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain("opacity:0.55");

    host.setWorkspaces(workspaces());
    host.notifyWorkspaces();
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("survives a snapshot with no byId and repaints on the next readable one", async () => {
    const host = fakeHost({ projectionsBySession: {} } as unknown as SessionListWire, workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);

    host.setSessions(sessions({ s1: session(null, { running: true }) }));
    host.notifySessions();
    await flush();
    expect(css(host.head)).toContain(HOT);
    dispose();
  });

  it("recomputes on the sixty second tick, because titles do not rerender with time", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 30 * 60_000) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain(HOT);

    await vi.advanceTimersByTimeAsync(90 * 60_000);

    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("injects nothing when disabled", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx, { enabled: false });
    await flush();
    expect(host.head.children).toHaveLength(0);
    expect(host.sessionListeners()).toBe(0);
    expect(host.workspaceListeners()).toBe(0);
    expect(() => dispose()).not.toThrow();
  });

  it("unsubscribes both services, stops ticking and removes the element on dispose", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(host.sessionListeners()).toBe(1);
    expect(host.workspaceListeners()).toBe(1);

    dispose();

    expect(host.head.children).toHaveLength(0);
    expect(host.sessionListeners()).toBe(0);
    expect(host.workspaceListeners()).toBe(0);
    expect(() => dispose()).not.toThrow();

    host.notifySessions();
    host.notifyWorkspaces();
    await vi.advanceTimersByTimeAsync(5 * 60_000);
    expect(host.head.children).toHaveLength(0);
  });
});
