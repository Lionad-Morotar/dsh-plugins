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
  'div.Kjh-qa_groupSection:has(> [data-row-key^="workspace:"], > * > [data-row-key^="workspace:"]):hover [data-row-key^="session:"] .JoiKIa_title{opacity:1}',
  'div.Kjh-qa_groupSection:has([data-row-key^="workspace:"] .JoiKIa_folderActive) [data-row-key^="session:"] .JoiKIa_title{opacity:1}',
].join("\n");

/** The accent a hot workspace's title carries. */
const HOT = "color:var(--dsw-alias-state-business-primary);font-weight:600";

/**
 * The group whose own header row is one workspace.
 *
 * Two branches because the host wraps a row carrying a hover card in a `span`: a
 * real workspace's row is a grandchild of the group, one without a hover card is a
 * child.
 */
function groupOf(workspaceId: string): string {
  const row = `[data-row-key="workspace:${workspaceId}"]`;
  return `div.Kjh-qa_groupSection:has(> ${row}, > * > ${row})`;
}

/**
 * The selectors for one workspace's member titles, one per row depth.
 * @param workspaceId - the workspace whose members are addressed.
 * @param excludeArchived - whether the host's archived rows are left out.
 */
function membersOf(workspaceId: string, excludeArchived = false): string {
  const group = groupOf(workspaceId);
  const sessionRow = `[data-row-key^="session:"]${excludeArchived ? ":where(:not(.JoiKIa_archived))" : ""}`;
  return `${group} > ${sessionRow} .JoiKIa_title,${group} > * > ${sessionRow} .JoiKIa_title`;
}

/** Split a selector list at its top level commas. */
function splitSelectorList(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < list.length; index += 1) {
    const char = list[index];
    if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(list.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(list.slice(start));
  return parts;
}

/** The three rules one hot workspace contributes: title, icon slots, members. */
function hot(workspaceId: string): string[] {
  const key = `[data-row-key="workspace:${workspaceId}"]`;
  return [
    `${key} .JoiKIa_title{${HOT}}`,
    `${key} > .JoiKIa_slot{color:var(--dsw-alias-state-business-primary)}`,
    `${membersOf(workspaceId, true)}{${HOT}}`,
  ];
}

/** The two rules a hot workspace contributes when every member is archived. */
function hotHeaderOnly(workspaceId: string): string[] {
  return hot(workspaceId).slice(0, 2);
}

/** The four rules one dim workspace contributes: both surfaces, both themes. */
function dim(workspaceId: string, light: number, dark: number): string[] {
  const key = `[data-row-key="workspace:${workspaceId}"]`;
  const title = `${key} .JoiKIa_title`;
  const members = membersOf(workspaceId);
  return [
    `${title}{opacity:${light}}`,
    `${members}{opacity:${light}}`,
    `:where(body[data-ds-dark-theme]) ${title}{opacity:${dark}}`,
    `${splitSelectorList(members)
      .map((one) => `:where(body[data-ds-dark-theme]) ${one}`)
      .join(",")}{opacity:${dark}}`,
  ];
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

  it("paints a workspace holding a running session hot, on its title, icons and members", async () => {
    const host = fakeHost(sessions({ s1: session(null, { running: true }) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...hot("w1"), BASE].join("\n"));
    dispose();
  });

  it("dims a workspace from its newest member, not its oldest", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS), s2: session(NOW - 10 * DAY_MS) }),
      workspaces(workspace("w1", ["s1", "s2"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...dim("w1", 0.4, 0.55), BASE].join("\n"));
    dispose();
  });

  it("follows a workspace's member session titles through the group, never through a session id", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS), s2: session(NOW - 10 * DAY_MS) }),
      workspaces(workspace("w1", ["s1", "s2"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    const sheet = css(host.head);
    expect(sheet).toContain(`${membersOf("w1")}`);
    expect(sheet).not.toContain('data-row-key="session:');
    expect(sheet).not.toContain(".JoiKIa_sessionRow");
    dispose();
  });

  it("leaves a session row outside any painted workspace at the host's own styling", async () => {
    // Only the members of a painted workspace follow it: a session whose own
    // reading is old, inside a warm workspace, must keep the host's rendering.
    const host = fakeHost(
      sessions({ s1: session(NOW - 2 * 3_600_000), s2: session(NOW - 30 * DAY_MS) }),
      workspaces(workspace("w1", ["s1"])),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("counts an archived member into the factor", async () => {
    // The archived set lives on the workspaces snapshot and must not exclude a
    // member: an archived session is still a session someone worked in, so this
    // workspace still reads as hot.
    const host = fakeHost(
      sessions({ s1: session(NOW - 30 * 60_000) }),
      { items: [workspace("w1", ["s1"])], archivedSessionIds: ["s1"] } as unknown as WorkspaceSnapshotWire,
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...hotHeaderOnly("w1"), BASE].join("\n"));
    dispose();
  });

  it("keeps an archived session title out of the accent, so the host's caption grey survives", async () => {
    // The host paints an archived row's title with `--dsw-alias-label-caption`, and
    // that grey is the archive signal. One archived member next to a live one is the
    // case that matters: the workspace is hot, so the accent exists, but it must not
    // reach the archived row.
    const host = fakeHost(
      sessions({ s1: session(NOW - 30 * 60_000), s2: session(NOW - 20 * 60_000) }),
      { items: [workspace("w1", ["s1", "s2"])], archivedSessionIds: ["s2"] } as unknown as WorkspaceSnapshotWire,
    );
    const dispose = apply(host.ctx);
    await flush();
    const sheet = css(host.head);
    expect(sheet).toBe([...hot("w1"), BASE].join("\n"));
    expect(sheet).toContain(":where(:not(.JoiKIa_archived))");
    // The exclusion is a condition, not a weight: the accent rule keeps the weight
    // it had before, so the interaction invariants still outrank it.
    const accent = sheet.split("\n").find((line) => line.includes("session:") && line.includes(HOT));
    expect(accent).toBe(`${membersOf("w1", true)}{${HOT}}`);
    dispose();
  });

  it("still dims an archived session title, because fading cannot erase the caption grey", async () => {
    const host = fakeHost(
      sessions({ s1: session(NOW - 4 * DAY_MS) }),
      { items: [workspace("w1", ["s1"])], archivedSessionIds: ["s1"] } as unknown as WorkspaceSnapshotWire,
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...dim("w1", 0.4, 0.55), BASE].join("\n"));
    dispose();
  });

  it("repaints when a session is archived, because the accent has to stop reaching its row", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 30 * 60_000) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe([...hot("w1"), BASE].join("\n"));

    host.setWorkspaces({
      items: [workspace("w1", ["s1"])],
      archivedSessionIds: ["s1"],
    } as unknown as WorkspaceSnapshotWire);
    host.notifyWorkspaces();
    await flush();

    expect(css(host.head)).toBe([...hotHeaderOnly("w1"), BASE].join("\n"));
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
    expect(css(host.head)).toBe([...dim("w1", 0.4, 0.55), BASE].join("\n"));
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
        ...hot("w1"),
        ...hot("w2"),
        BASE,
      ].join("\n"),
    );
    dispose();
  });

  it("drops a workspace from the sheet when the host removes it", async () => {
    const host = fakeHost(sessions({ s1: session(NOW - 4 * DAY_MS) }), workspaces(workspace("w1", ["s1"])));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain("opacity:0.4");

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
