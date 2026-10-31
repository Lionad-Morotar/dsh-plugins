/**
 * The browser half as it runs in a page.
 *
 * Two subjects share this file because they are one pipeline: the writer owns
 * the single `<style>` element, and the entry decides what text goes into it.
 * The page is a fake DOM and the host is a fake snapshot source, so the cases can
 * assert the two things that are invisible in a real sidebar: how often the DOM
 * is touched, and what happens on unload.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apply, type ClientContextLike } from "../src/client/entry.ts";
import type { SessionListWire } from "../src/client/reading.ts";
import { STYLE_TAG_ID } from "../src/client/styles.ts";
import { createWriter } from "../src/client/writer.ts";

const DAY_MS = 86_400_000;
const NOW = 1_800_000_000_000;

/** The invariants every stylesheet ends with. */
const BASE = ['[data-row-key^="session:"]:hover{opacity:1}', '[data-row-key^="session:"][aria-selected="true"]{opacity:1}'].join("\n");

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

/** A list snapshot over the given sessions and shared projection cells. */
function snapshot(
  sessions: Record<string, Record<string, unknown>>,
  shared: Record<string, Record<string, unknown>> = {},
): SessionListWire {
  return { byId: sessions, projectionsBySession: shared } as unknown as SessionListWire;
}

/** A session row carrying its projection on the object layer. */
function session(lastActivityAt: number | null, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { running: false, updatedAt: NOW, projectionValues: { sessionActivity: view(lastActivityAt) }, ...overrides };
}

/** A host double: one mutable list snapshot, one archive set, one listener set. */
function fakeHost(initial: SessionListWire, archived: readonly string[] = []) {
  const { document, head } = fakeDocument();
  vi.stubGlobal("document", document);
  const listeners = new Set<() => void>();
  let list = initial;
  let archivedSessionIds: readonly string[] | undefined = archived;
  const ctx: ClientContextLike = {
    sessions: {
      list: {
        getSnapshot: () => list,
        subscribe: (listener: () => void) => {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      },
    },
    workspaces: { list: { getSnapshot: () => ({ archivedSessionIds }) } },
  };
  return {
    ctx,
    head,
    notify: () => {
      for (const listener of [...listeners]) listener();
    },
    setList: (next: SessionListWire) => {
      list = next;
    },
    setArchived: (ids: readonly string[] | undefined) => {
      archivedSessionIds = ids;
    },
    listenerCount: () => listeners.size,
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

  it("paints a running session hot on mount", async () => {
    const host = fakeHost(snapshot({ s1: session(null, { running: true }) }));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(
      ['[data-row-key="session:s1"]{color:var(--dsw-alias-brand-primary);font-weight:600}', BASE].join("\n"),
    );
    dispose();
  });

  it("dims a session that went quiet days ago", async () => {
    const host = fakeHost(snapshot({ s1: session(NOW - 4 * DAY_MS) }));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(['[data-row-key="session:s1"]{opacity:0.55}', BASE].join("\n"));
    dispose();
  });

  it("repaints from the shared projection cell rather than the object layer", async () => {
    const host = fakeHost(
      snapshot({ s1: session(NOW - 4 * DAY_MS) }, { s1: { state: "ready", values: { sessionActivity: view(NOW - 10 * 60_000) } } }),
    );
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain("color:var(--dsw-alias-brand-primary)");
    dispose();
  });

  it("leaves a session with no instant at all untouched", async () => {
    const host = fakeHost(snapshot({ s1: { running: false } }));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("skips a row the snapshot lists as undefined", async () => {
    const host = fakeHost({ byId: { s1: undefined }, projectionsBySession: {} } as unknown as SessionListWire);
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("repaints when the host notifies, coalescing one burst into one write", async () => {
    const host = fakeHost(snapshot({ s1: session(null, { running: true }) }));
    const dispose = apply(host.ctx);
    await flush();
    expect(writes(host.head)).toBe(1);

    host.setList(snapshot({ s1: session(NOW - 4 * DAY_MS) }));
    host.notify();
    host.notify();
    host.notify();
    await flush();

    expect(writes(host.head)).toBe(2);
    expect(css(host.head)).toBe(['[data-row-key="session:s1"]{opacity:0.55}', BASE].join("\n"));
    dispose();
  });

  it("recomputes on the sixty second tick, because rows do not rerender with time", async () => {
    const host = fakeHost(snapshot({ s1: session(NOW - 30 * 60_000) }));
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain("color:var(--dsw-alias-brand-primary)");

    await vi.advanceTimersByTimeAsync(90 * 60_000);

    expect(css(host.head)).toBe(BASE);
    dispose();
  });

  it("dims an archived session without recolouring it", async () => {
    const host = fakeHost(snapshot({ s1: session(NOW - 4 * DAY_MS, { running: true }) }), ["s1"]);
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toBe(['[data-row-key="session:s1"]{opacity:1}', BASE].join("\n"));
    dispose();
  });

  it("treats a workspaces snapshot without an archive set as nothing archived", async () => {
    const host = fakeHost(snapshot({ s1: session(null, { running: true }) }));
    host.setArchived(undefined);
    const dispose = apply(host.ctx);
    await flush();
    expect(css(host.head)).toContain("color:var(--dsw-alias-brand-primary)");
    dispose();
  });

  it("injects nothing when disabled", async () => {
    const host = fakeHost(snapshot({ s1: session(null, { running: true }) }));
    const dispose = apply(host.ctx, { enabled: false });
    await flush();
    expect(host.head.children).toHaveLength(0);
    expect(host.listenerCount()).toBe(0);
    expect(() => dispose()).not.toThrow();
  });

  it("unsubscribes, stops ticking and removes the element on dispose", async () => {
    const host = fakeHost(snapshot({ s1: session(null, { running: true }) }));
    const dispose = apply(host.ctx);
    await flush();
    expect(host.listenerCount()).toBe(1);

    dispose();

    expect(host.head.children).toHaveLength(0);
    expect(host.listenerCount()).toBe(0);
    expect(() => dispose()).not.toThrow();

    host.notify();
    await vi.advanceTimersByTimeAsync(5 * 60_000);
    expect(host.head.children).toHaveLength(0);
  });
});
