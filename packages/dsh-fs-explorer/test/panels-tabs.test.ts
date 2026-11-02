// @vitest-environment jsdom
/**
 * Panel chrome over a live draft: the unsaved dot on a tab, the three-way close
 * confirmation, the save chord outside the editor, and the answers the pane
 * paints when the write is refused.
 *
 * The rule these tests protect is the product decision behind the slice: a
 * dirty panel never closes without the reader choosing, and a save that failed
 * must leave the panel — and its draft — where it is.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createDocumentStore, type DocumentSession, type DocumentStore } from "../src/client/document-session.ts";
import { PanelEmpty, PanelTabs } from "../src/client/panel-tabs.tsx";
import type { PanelEntry } from "../src/client/panels.ts";
import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";
import { VIEW_ID } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function panel(path: string): PanelEntry {
  return { path, line: 1, absolute: false };
}

const t = (key: string): string => key;

interface Harness {
  readonly host: HTMLDivElement;
  readonly root: Root;
  readonly store: DocumentStore;
  readonly session: DocumentSession;
  readonly saves: { text: string; expectedVersion: string | null }[];
  fail: boolean;
  /** The next save answers stale-version, as an external edit would. */
  stale: boolean;
  /** The disk text the next reload reads. */
  onDisk: string;
}

/**
 * Mount the whole view over one dirty draft at `a.md`.
 *
 * The body's renderer is never reached on purpose: this file is about the chrome
 * around a draft, so the document session is acquired here and the view only
 * has to see it through the store.
 */
async function mountView(options: { dirty: boolean }): Promise<Harness> {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  const saves: { text: string; expectedVersion: string | null }[] = [];
  const harness = { host, root, saves, fail: false, stale: false, onDisk: "# hello" } as unknown as Harness;

  const store = createDocumentStore({
    open: async () => ({ ok: true, text: harness.onDisk, version: "v1" }),
    save: async request => {
      saves.push({ text: request.text, expectedVersion: request.expectedVersion });
      if (harness.stale) return { ok: false, code: "stale-version", message: "the file changed on disk" };
      return harness.fail
        ? { ok: false, code: "io-error", message: "disk full" }
        : { ok: true, version: "v2" };
    },
  });
  const session = store.acquire("s1", "a.md");
  await session.reload();
  if (options.dirty) session.setDraft("# hello, edited");

  const workbench: WorkbenchFace = {
    version: 1,
    currentSessionId: () => "s1",
    openViewOrSwitch: () => ({ opened: true, focused: true }),
  };
  const files = () => ({
    list: async () => ({ entries: [{ name: "a.md", kind: "file" }] }),
    read: async () => ({ text: "# hello", offset: 1, total: 1, eof: true }),
  });

  const View = createFsExplorerView({
    workbench,
    version: 1,
    t,
    files,
    status: () => undefined,
    documents: store,
  });

  await act(async () => {
    root.render(
      createElement(View, {
        sessionId: "s1",
        viewRequest: { view: VIEW_ID, focus: "path:a.md:1" },
        completeViewRequest: () => undefined,
      }),
    );
  });
  await flush();

  return Object.assign(harness, { store, session });
}

async function flush(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

function press(target: EventTarget, init: KeyboardEventInit): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

describe("unsaved marker", () => {
  let host: HTMLDivElement;
  let root: Root;
  let store: DocumentStore;
  let session: DocumentSession;

  beforeEach(async () => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    store = createDocumentStore({
      open: async () => ({ ok: true, text: "one", version: "v1" }),
      save: async () => ({ ok: true, version: "v2" }),
    });
    session = store.acquire("s1", "docs/a.md");
    await session.reload();
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
    session.dispose();
  });

  async function show(panels: readonly PanelEntry[], active = panels[0]?.path ?? null): Promise<void> {
    await act(async () => {
      root.render(
        createElement(PanelTabs, {
          panels,
          active,
          t,
          onActivate: () => undefined,
          onClose: () => undefined,
          onStep: () => undefined,
          documents: store,
          sessionId: "s1",
        }),
      );
    });
  }

  function dots(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="fs-tab-dirty"]')];
  }

  it("renders no dot for a clean draft", async () => {
    await show([panel("docs/a.md")]);
    expect(dots()).toHaveLength(0);
    expect(host.querySelector('[data-testid="fs-tab"]')).not.toBeNull();
  });

  it("puts one dot on the dirty tab and drops it after a save", async () => {
    await show([panel("docs/a.md")]);

    await act(async () => {
      session.setDraft("one edited");
    });
    expect(dots()).toHaveLength(1);
    expect(dots()[0]?.getAttribute("data-dirty")).toBe("true");

    await act(async () => {
      await session.save();
    });
    expect(dots()).toHaveLength(0);
  });

  it("marks only the tab whose draft is dirty", async () => {
    const other = store.acquire("s1", "docs/b.md");
    await other.reload();
    await show([panel("docs/a.md"), panel("docs/b.md")]);

    await act(async () => {
      session.setDraft("dirty a");
      other.setDraft("dirty b");
    });
    await act(async () => {
      await other.save();
    });

    expect(dots()).toHaveLength(1);
    expect(dots()[0]?.closest('[data-testid="fs-tab"]')?.getAttribute("data-path")).toBe("docs/a.md");
    other.dispose();
  });

  it("tolerates a store that has no draft for the panel", async () => {
    await show([panel("docs/a.md")], null);
    expect(host.querySelector('[data-testid="fs-panel-empty"]')).toBeNull();
    expect(dots()).toHaveLength(0);
    await act(async () => {
      root.render(createElement(PanelEmpty, { t }));
    });
    expect(host.querySelector('[data-testid="fs-panel-empty"]')).not.toBeNull();
  });
});

describe("closing a dirty panel", () => {
  let mounted: Harness | null = null;

  afterEach(async () => {
    if (mounted === null) return;
    await act(async () => {
      mounted?.root.unmount();
    });
    mounted.host.remove();
    mounted.session.dispose();
    mounted = null;
  });

  function testId(id: string): HTMLElement | null {
    return mounted?.host.querySelector<HTMLElement>(`[data-testid="${id}"]`) ?? null;
  }

  function tabs(): number {
    return mounted?.host.querySelectorAll('[data-testid="fs-tab"]').length ?? 0;
  }

  it("asks before dropping a dirty panel and offers three answers", async () => {
    mounted = await mountView({ dirty: true });
    expect(tabs()).toBe(1);

    const closed = press(document.body, { key: "w", code: "KeyW", ctrlKey: true });
    expect(closed.defaultPrevented).toBe(true);

    expect(testId("fs-close-confirm")).not.toBeNull();
    expect(testId("fs-close-save")).not.toBeNull();
    expect(testId("fs-close-discard")).not.toBeNull();
    expect(testId("fs-close-cancel")).not.toBeNull();
    expect(tabs()).toBe(1);
  });

  it("closes a clean panel without asking", async () => {
    mounted = await mountView({ dirty: false });

    press(document.body, { key: "w", code: "KeyW", ctrlKey: true });

    expect(testId("fs-close-confirm")).toBeNull();
    expect(tabs()).toBe(0);
  });

  it("keeps the panel when the save fails, then closes once it succeeds", async () => {
    mounted = await mountView({ dirty: true });
    mounted.fail = true;
    press(document.body, { key: "w", code: "KeyW", ctrlKey: true });

    await act(async () => {
      testId("fs-close-save")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await flush();

    expect(mounted.saves).toEqual([{ text: "# hello, edited", expectedVersion: "v1" }]);
    expect(tabs()).toBe(1);
    expect(testId("fs-close-confirm")).not.toBeNull();
    expect(testId("fs-close-error")).not.toBeNull();

    mounted.fail = false;
    await act(async () => {
      testId("fs-close-save")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await flush();

    expect(tabs()).toBe(0);
    expect(testId("fs-close-confirm")).toBeNull();
  });

  it("drops the draft when the reader discards it", async () => {
    mounted = await mountView({ dirty: true });
    press(document.body, { key: "w", code: "KeyW", ctrlKey: true });

    await act(async () => {
      testId("fs-close-discard")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(tabs()).toBe(0);
  });

  it("lets Escape dismiss the confirmation before it reaches the composer", async () => {
    mounted = await mountView({ dirty: true });
    press(document.body, { key: "w", code: "KeyW", ctrlKey: true });

    const escape = press(document.body, { key: "Escape" });

    expect(escape.defaultPrevented).toBe(true);
    expect(testId("fs-close-confirm")).toBeNull();
    expect(tabs()).toBe(1);
  });
});

describe("a refused save in the pane", () => {
  let mounted: Harness | null = null;

  afterEach(async () => {
    if (mounted === null) return;
    await act(async () => {
      mounted?.root.unmount();
    });
    mounted.host.remove();
    mounted.session.dispose();
    mounted = null;
  });

  function testId(id: string): HTMLElement | null {
    return mounted?.host.querySelector<HTMLElement>(`[data-testid="${id}"]`) ?? null;
  }

  it("reports a stale version as a conflict and leaves the draft alone", async () => {
    mounted = await mountView({ dirty: true });
    mounted.stale = true;

    await act(async () => {
      testId("fs-preview-save")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await flush();

    expect(testId("fs-preview-conflict")).not.toBeNull();
    expect(testId("fs-preview-save-error")).toBeNull();
    expect(testId("fs-conflict-reload")).not.toBeNull();
    expect(testId("fs-conflict-copy")).not.toBeNull();
    expect(mounted.session.getSnapshot()).toMatchObject({
      text: "# hello, edited",
      savedText: "# hello",
      dirty: true,
      conflict: true,
    });
  });

  it("replaces the draft when the reader reloads from the conflict bar", async () => {
    mounted = await mountView({ dirty: true });
    mounted.stale = true;
    await act(async () => {
      testId("fs-preview-save")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await flush();
    mounted.onDisk = "# theirs";

    await act(async () => {
      testId("fs-conflict-reload")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await flush();

    expect(testId("fs-preview-conflict")).toBeNull();
    expect(mounted.session.getSnapshot()).toMatchObject({
      text: "# theirs",
      savedText: "# theirs",
      dirty: false,
      conflict: false,
    });
  });
});

describe("the save chord outside the editor", () => {
  let mounted: Harness | null = null;

  afterEach(async () => {
    if (mounted === null) return;
    await act(async () => {
      mounted?.root.unmount();
    });
    mounted.host.remove();
    mounted.session.dispose();
    mounted = null;
  });

  it("saves the active panel's draft and swallows the chord", async () => {
    mounted = await mountView({ dirty: true });

    const event = press(document.body, { key: "s", code: "KeyS", ctrlKey: true });
    await flush();

    expect(event.defaultPrevented).toBe(true);
    expect(mounted.saves).toEqual([{ text: "# hello, edited", expectedVersion: "v1" }]);
    expect(mounted.session.getSnapshot().dirty).toBe(false);
  });

  it("leaves the chord to the editor when the focus is editable", async () => {
    mounted = await mountView({ dirty: true });
    // jsdom implements no contenteditable behaviour, so the flag CodeMirror's
    // content element carries has to be spelled out for the shim.
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    Object.defineProperty(editable, "isContentEditable", { value: true });
    mounted.host.append(editable);

    const event = press(editable, { key: "s", code: "KeyS", ctrlKey: true });
    await flush();

    expect(event.defaultPrevented).toBe(false);
    expect(mounted.saves).toEqual([]);
  });
});
