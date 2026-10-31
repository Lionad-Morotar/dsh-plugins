/**
 * The browser half as it runs in a page.
 *
 * Two subjects share this file because they are one pipeline: the writer owns the
 * single `<style>` element, and the entry decides what text goes into it. The page
 * is a fake DOM and the host is a fake pair of snapshot sources, so the cases can
 * assert the things that are invisible in a real sidebar: which rows get painted at
 * all, how often the DOM is touched, and what happens on unload.
 *
 * The case that matters most is the one a human reported: a workspace whose own
 * header is thirteen minutes old must not carry its two-day-old member into the
 * accent. A session is painted on its own clock, and that is asserted here rather
 * than inferred from the rule builder's text.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apply, type ClientContextLike, type WorkspaceSnapshotWire } from "../src/client/entry.ts";
import type { PaintedTier, SessionListWire } from "../src/client/reading.ts";
import { STYLE_TAG_ID } from "../src/client/styles.ts";
import { createWriter } from "../src/client/writer.ts";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const NOW = 1_800_000_000_000;

/** The emphasis token. */
const ACCENT = "var(--dsw-alias-state-business-primary)";

/** The body colour the faint mix is pulled towards. */
const BODY = "var(--dsw-alias-label-primary)";

/** The faint colour at the shipped mix percentage. */
const FAINT = `color-mix(in srgb, ${ACCENT} 55%, ${BODY})`;

/** The colour one painted tier carries. */
function colorOf(tier: PaintedTier): string {
  return tier === "strong" ? ACCENT : FAINT;
}

/** The title and icon rules one workspace contributes. */
function workspaceRules(id: string, tier: PaintedTier): string[] {
  const key = `[data-row-key="workspace:${id}"]`;
  const weight = tier === "strong" || tier === "mid" ? ";font-weight:600" : "";
  return [`${key} .JoiKIa_title{color:${colorOf(tier)}${weight}}`, `${key} > .JoiKIa_slot{color:${colorOf(tier)}}`];
}

/** The title rule one session contributes. */
function sessionRules(id: string, tier: PaintedTier): string[] {
  return [`[data-row-key="session:${id}"]:where(:not(.JoiKIa_archived)) .JoiKIa_title{color:${colorOf(tier)}}`];
}

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

  it("paints a running session and its workspace in the strong tier", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...workspaceRules("w1", "strong"), ...sessionRules("s1", "strong")].join("\n"));
    dispose();
  });

  it("colours a session by its own age, not by its workspace's", async () => {
    // The reported bug: a workspace whose newest member moved thirteen minutes ago
    // must not carry its two-day-old member into the accent.
    const host = fakeHost(
      sessions({ s1: session(NOW - 13 * MINUTE_MS), s2: session(NOW - 2 * DAY_MS) }),
      workspaces(workspace("w1", ["s1", "s2"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    const sheet = css(host.head);
    expect(sheet).toBe([...workspaceRules("w1", "strong"), ...sessionRules("s1", "strong")].join("\n"));
    expect(sheet).not.toContain("session:s2");
    dispose();
  });

  it("leaves a session past the fifth hour at the host's own colour", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 6 * HOUR_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe("");
    dispose();
  });

  it("steps a session down through mid and faint as its own clock moves", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 90 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...workspaceRules("w1", "mid"), ...sessionRules("s1", "mid")].join("\n"));

    host.setSessions(sessions({ s1: session(NOW - 3 * HOUR_MS) }));
    host.notifySessions();
    await flush();
    expect(css(host.head)).toBe([...workspaceRules("w1", "faint"), ...sessionRules("s1", "faint")].join("\n"));
    dispose();
  });

  it("never bolds a session title, only the workspace above it", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 13 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    const sheet = css(host.head);
    expect(sheet.split("\n").filter((line) => line.includes("session:"))).toHaveLength(1);
    for (const line of sheet.split("\n").filter((one) => one.includes("session:"))) expect(line).not.toContain("font-weight");
    expect(sheet.split("\n").filter((one) => one.includes("workspace:"))[0]).toContain("font-weight:600");
    dispose();
  });

  it("counts an archived member into the workspace factor but paints neither row", async () => {
    // The archived set lives on the workspaces snapshot: archiving is a sidebar
    // filter, so the member still decides the header's tier, while the row itself
    // keeps the host's caption grey.
    const host = fakeHost(
      sessions({ s1: session(NOW - 30 * MINUTE_MS), s2: session(NOW - 20 * MINUTE_MS) }),
      { items: [workspace("w1", ["s1", "s2"])], archivedSessionIds: ["s2"] } as unknown as WorkspaceSnapshotWire,
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...workspaceRules("w1", "strong"), ...sessionRules("s1", "strong")].join("\n"));
    dispose();
  });

  it("carries the archived condition on every session rule, so a lagging archive set cannot repaint an archived row", async () => {
    // The class on the row is the paint-time truth; the snapshot set can be a tick
    // behind, so every session rule carries the condition as well.
    const host = fakeHost(sessions({ s1: session(NOW - 30 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    for (const line of css(host.head).split("\n").filter((one) => one.includes("session:"))) {
      expect(line).toContain(":where(:not(.JoiKIa_archived))");
    }
    dispose();
  });

  it("paints a session that lives outside any workspace, since it no longer follows one", async () => {
    // The ungrouped bucket is not a snapshot item: the host synthesizes it from the
    // session list minus every accounted member, so the id set has to come from the
    // session list or those rows would never be reached.
    const host = fakeHost(sessions({ s1: session(NOW - 13 * MINUTE_MS) }), workspaces());
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(sessionRules("s1", "strong").join("\n"));
    dispose();
  });

  it("paints nothing for a workspace with no members, so a fresh workspace is never coloured", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", [])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(sessionRules("s1", "strong").join("\n"));
    dispose();
  });

  it("paints nothing for a workspace whose members the session list cannot resolve", async () => {
    const host = fakeHost(sessions({}), workspaces(workspace("w1", ["gone"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe("");
    dispose();
  });

  it("skips an item without a usable workspace id, because the ungrouped bucket has none", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 13 * MINUTE_MS) }),
      workspaces({ workspaceId: "", sessionIds: ["s1"] }, { sessionIds: ["s1"] }),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(sessionRules("s1", "strong").join("\n"));
    dispose();
  });

  it("reads a malformed workspaces snapshot as no workspace, and still paints the sessions", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 13 * MINUTE_MS) }), {} as WorkspaceSnapshotWire);
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(sessionRules("s1", "strong").join("\n"));
    dispose();
  });

  it("repaints from the shared projection cell rather than the object layer", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS) }, { s1: { state: "ready", values: { sessionActivity: view(NOW - 10 * MINUTE_MS) } } }),
      workspaces(workspace("w1", ["s1"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...workspaceRules("w1", "strong"), ...sessionRules("s1", "strong")].join("\n"));
    dispose();
  });

  it("repaints when the session list notifies, coalescing one burst into one write", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 13 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(writes(host.head)).toBe(1);

    host.setSessions(sessions({ s1: session(NOW - 90 * MINUTE_MS) }));
    host.notifySessions();
    host.notifySessions();
    host.notifySessions();
    await flush();

    expect(writes(host.head)).toBe(2);
    expect(css(host.head)).toBe([...workspaceRules("w1", "mid"), ...sessionRules("s1", "mid")].join("\n"));
    dispose();
  });

  it("does not touch the DOM when a notification leaves every row where it was", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 13 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(writes(host.head)).toBe(1);

    host.notifySessions();
    host.notifyWorkspaces();
    await flush();
    expect(writes(host.head)).toBe(1);
    dispose();
  });

  it("repaints when the workspace list notifies, because membership can change without the session list", async () => {
    const host = fakeHost(
      sessions({ s1: session(null, { running: true }), s2: session(NOW - 13 * MINUTE_MS) }),
      workspaces(workspace("w1", ["s1"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(
      [...workspaceRules("w1", "strong"), ...sessionRules("s1", "strong"), ...sessionRules("s2", "strong")].join("\n"),
    );

    host.setWorkspaces(workspaces(workspace("w1", ["s1"]), workspace("w2", ["s2"])));
    host.notifyWorkspaces();
    await flush();

    expect(css(host.head)).toBe(
      [
        ...workspaceRules("w1", "strong"),
        ...workspaceRules("w2", "strong"),
        ...sessionRules("s1", "strong"),
        ...sessionRules("s2", "strong"),
      ].join("\n"),
    );
    dispose();
  });

  it("drops a workspace and its session from the sheet when the host removes them", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 13 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain("workspace:w1");

    host.setWorkspaces(workspaces());
    host.setSessions(sessions({}));
    host.notifyWorkspaces();
    host.notifySessions();
    await flush();
    expect(css(host.head)).toBe("");
    dispose();
  });

  it("survives a snapshot with no byId and repaints on the next readable one", async () => {
    const host = fakeHost({ projectionsBySession: {} } as unknown as SessionListWire, workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe("");

    host.setSessions(sessions({ s1: session(null, { running: true }) }));
    host.notifySessions();
    await flush();
    expect(css(host.head)).toContain(ACCENT);
    dispose();
  });

  it("recomputes on the sixty second tick, because titles do not rerender with time", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 30 * MINUTE_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...workspaceRules("w1", "strong"), ...sessionRules("s1", "strong")].join("\n"));

    await vi.advanceTimersByTimeAsync(5 * HOUR_MS);

    expect(css(host.head)).toBe("");
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
    await vi.advanceTimersByTimeAsync(5 * MINUTE_MS);
    expect(host.head.children).toHaveLength(0);
  });
});
