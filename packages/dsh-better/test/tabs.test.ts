/**
 * The tab page's contract with the host strip.
 *
 * What this protects is the decision, not the rendering. A checkbox that hides a
 * tab by withdrawing its registration would also blank the open view, because the
 * host renders a selected view id whether or not it has a tab. So the cases here
 * pin three things: the preference survives a reload, it reaches the strip only
 * as rules for buttons the plan could actually identify, and Chat is never
 * offered as a choice.
 */
import { describe, expect, it, vi } from "vitest";

import { DICTIONARIES } from "../src/client/dictionaries.ts";
import { paintRows, TabSettingsPage, type PageReact, type TabCopy } from "../src/client/tabs-page.tsx";
import {
  FIXED_VIEW_ID,
  STRIP_CONTAINER_SELECTOR,
  STRIP_STYLE_TAG,
  TABS_SECTION_ID,
  TABS_SECTION_ORDER,
  TABS_SECTION_SLOT,
  TABS_STORAGE_KEY,
  VIEW_SLOT,
  createTabController,
  planHiddenRules,
  readHidden,
  resolveViewLabel,
  stripRows,
  tabRows,
  writeHidden,
  type StripHostDocument,
  type StripStyleTag,
  type TabStorage,
  type ViewEntry,
  type ViewLedger,
} from "../src/client/tabs.ts";

/** An in-memory document with the one method pair the preference uses. */
function memoryStorage(initial?: string): TabStorage & { readonly document: Map<string, string> } {
  const document = new Map<string, string>();
  if (initial !== undefined) document.set(TABS_STORAGE_KEY, initial);
  return {
    document,
    getItem: key => document.get(key) ?? null,
    setItem: (key, value) => {
      document.set(key, value);
    },
  };
}

/** One registered view, with only the fields the decision reads. */
function view(id: string, label?: unknown): ViewEntry {
  return { options: { id, ...label === undefined ? {} : { label } } };
}

/** A ledger whose roster is replaced wholesale, the way a slot subscription fires. */
function ledger(initial: readonly ViewEntry[]): ViewLedger & {
  set(entries: readonly ViewEntry[]): void;
} {
  let entries = initial;
  const listeners = new Set<() => void>();
  return {
    entriesOfSlot: key => (key === VIEW_SLOT ? entries : []),
    subscribe: (key, listener) => {
      if (key !== VIEW_SLOT) return () => {};
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(next) {
      entries = next;
      for (const listener of [...listeners]) listener();
    },
  };
}

/** The strip's button texts, Chat first, the way the host renders them. */
function stripTexts(rows: readonly string[]): readonly string[] {
  return ["对话", ...rows];
}

describe("readHidden / writeHidden", () => {
  it("treats a missing, empty, or corrupt document as nothing hidden", () => {
    expect(readHidden(undefined)).toEqual(new Set());
    expect(readHidden(memoryStorage())).toEqual(new Set());
    expect(readHidden(memoryStorage("not json"))).toEqual(new Set());
    expect(readHidden(memoryStorage("{\"hidden\":true}"))).toEqual(new Set());
  });

  it("keeps only real view ids and refuses chat", () => {
    const storage = memoryStorage(JSON.stringify(["wakatime", "", 3, "chat", "files"]));
    expect(readHidden(storage)).toEqual(new Set(["wakatime", "files"]));
  });

  it("round-trips through a sorted document", () => {
    const storage = memoryStorage();
    writeHidden(storage, new Set(["git", "wakatime"]));
    expect(storage.document.get(TABS_STORAGE_KEY)).toBe(JSON.stringify(["git", "wakatime"]));
    expect(readHidden(storage)).toEqual(new Set(["git", "wakatime"]));
  });

  it("keeps the in-memory choice when storage refuses the write", () => {
    const storage: TabStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(() => writeHidden(storage, new Set(["files"]))).not.toThrow();
  });
});

describe("tabRows / stripRows", () => {
  it("lists registered views in ledger order and never offers chat", () => {
    const rows = tabRows(
      [view("chat", "对话"), view("files", "文件"), view("wakatime", () => "WakaTime")],
      new Set(["files"]),
    );
    expect(rows.map(row => row.id)).toEqual(["files", "wakatime"]);
    expect(rows.map(row => row.enabled)).toEqual([false, true]);
    expect(rows.map(row => row.label)).toEqual(["文件", "WakaTime"]);
  });

  it("falls back to the id when a label throws or is empty", () => {
    expect(resolveViewLabel(() => {
      throw new Error("locale");
    }, "git")).toBe("git");
    expect(resolveViewLabel("", "git")).toBe("git");
    expect(resolveViewLabel(undefined, "git")).toBe("git");
  });

  it("collapses a shadowed cell to one row", () => {
    const rows = tabRows([view("files", "文件"), view("files", "文件（旧）")], new Set());
    expect(rows).toEqual([{ id: "files", label: "文件", enabled: true }]);
  });

  it("projects the same roster onto the strip, chat excluded there too", () => {
    expect(stripRows([view("chat", "对话"), view("files", "文件"), view("files", "旧")]))
      .toEqual([{ id: "files", label: "文件" }]);
  });
});

describe("planHiddenRules", () => {
  it("hides exactly the named views by position when the strip matches the ledger", () => {
    const entries = [view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")];
    const rules = planHiddenRules(entries, new Set(["wakatime", "not-registered"]), stripTexts(["文件", "WakaTime", "Git"]));
    // Chat is child 1; wakatime is the second ledger row, so child 3.
    expect(rules).toEqual([`${STRIP_CONTAINER_SELECTOR} > button:nth-child(3)`]);
  });

  it("never plans a rule for chat", () => {
    const entries = [view(FIXED_VIEW_ID), view("files", "文件")];
    const rules = planHiddenRules(entries, new Set([FIXED_VIEW_ID, "files"]), stripTexts(["文件"]));
    expect(rules).toEqual([`${STRIP_CONTAINER_SELECTOR} > button:nth-child(2)`]);
  });

  it("plans nothing before the strip has rendered", () => {
    const entries = [view("files", "文件")];
    expect(planHiddenRules(entries, new Set(["files"]), undefined)).toEqual([]);
    expect(planHiddenRules(entries, new Set(["files"]), [])).toEqual([]);
  });

  it("falls back to a label scan when the host filtered a view the ledger still has", () => {
    // Developer tools off: the host drops `trajectory` from the strip, so the
    // positional walk disagrees and the plan must not trust positions.
    const entries = [view("trajectory", "Trajectory"), view("files", "文件"), view("wakatime", "WakaTime")];
    const texts = stripTexts(["文件", "WakaTime"]);
    expect(planHiddenRules(entries, new Set(["wakatime"]), texts))
      .toEqual([`${STRIP_CONTAINER_SELECTOR} > button:nth-child(3)`]);
  });

  it("skips a hidden view whose label is ambiguous or absent", () => {
    const entries = [view("files", "文件"), view("clone", "文件")];
    const rules = planHiddenRules(entries, new Set(["clone", "files"]), stripTexts(["文件", "文件", "其他"]));
    expect(rules).toEqual([]);
  });

  it("shows everything when the strip cannot be read at all", () => {
    const entries = [view("files", "文件")];
    expect(planHiddenRules(entries, new Set(["files"]), stripTexts(["看不懂的标签"]))).toEqual([]);
  });
});

describe("createTabController", () => {
  /** A bare document that records the sheet and answers the strip reader. */
  function stripDoc(
    texts: readonly string[] | undefined,
  ): StripHostDocument & {
    readonly sheet: StripStyleTag | undefined;
    readonly texts: readonly string[] | undefined;
    set(texts: readonly string[] | undefined): void;
  } {
    let sheet: StripStyleTag | undefined;
    let texts$ = texts;
    const callbacks: (() => void)[] = [];
    const doc = {
      querySelector: (selector: string) => (selector === STRIP_CONTAINER_SELECTOR ? {} : null),
      createElement(tag: string) {
        expect(tag).toBe("style");
        const node: StripStyleTag = {
          dataset: {},
          textContent: "",
          remove: () => {
            sheet = undefined;
          },
        };
        sheet = node;
        return node;
      },
      head: {
        append(node: StripStyleTag) {
          sheet = node;
        },
      },
      defaultView: {
        requestAnimationFrame(callback: () => void) {
          callbacks.push(callback);
          return callbacks.length;
        },
        cancelAnimationFrame() {},
      },
      set(next: readonly string[] | undefined) {
        texts$ = next;
        for (const callback of callbacks.splice(0)) callback();
      },
    };
    return {
      ...doc,
      // Getters, not copied values: `sheet` tracks the teardown and `texts`
      // tracks `set`, which is the whole point of reading them afterwards.
      get sheet() {
        return sheet;
      },
      get texts() {
        return texts$;
      },
    };
  }

  /** The controller wired to read its strip from the fake document. */
  function controllerFor(
    views: ViewLedger,
    doc: ReturnType<typeof stripDoc>,
    storage?: TabStorage,
  ): ReturnType<typeof createTabController> {
    return createTabController({ ledger: views, storage, readButtons: () => doc.texts });
  }

  it("applies a stored choice once the strip renders, and follows a plugin that registers later", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const storage = memoryStorage(JSON.stringify(["wakatime"]));
    const doc = stripDoc(undefined);
    const controller = controllerFor(views, doc, storage);
    const stop = controller.attach(doc);

    // Before the strip renders the sheet stays empty; the retry lands it.
    expect(doc.sheet?.textContent).toBe("");
    doc.set(stripTexts(["文件", "WakaTime"]));
    expect(doc.sheet?.textContent).toBe(`${STRIP_CONTAINER_SELECTOR} > button:nth-child(3)`);
    expect(controller.rows().map(row => [row.id, row.enabled])).toEqual([
      ["files", true],
      ["wakatime", false],
    ]);

    views.set([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    expect(controller.rows().map(row => row.id)).toEqual(["files", "wakatime", "git"]);
    // A newly registered view is shown: the preference only hides what it names.
    // Positions shifted, and the plan re-walked the ledger on its own.
    doc.set(stripTexts(["文件", "WakaTime", "Git"]));
    expect(doc.sheet?.textContent).toBe(`${STRIP_CONTAINER_SELECTOR} > button:nth-child(3)`);
    stop();
  });

  it("hides and restores a tab without touching the ledger", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const storage = memoryStorage();
    const doc = stripDoc(stripTexts(["文件", "WakaTime"]));
    const controller = controllerFor(views, doc, storage);
    const stop = controller.attach(doc);

    expect(controller.setEnabled("wakatime", false)).toBe(true);
    expect(doc.sheet?.textContent).toBe(`${STRIP_CONTAINER_SELECTOR} > button:nth-child(3)`);
    expect(views.entriesOfSlot(VIEW_SLOT).map(entry => entry.options.id)).toEqual(["files", "wakatime"]);
    expect(readHidden(storage)).toEqual(new Set(["wakatime"]));

    expect(controller.setEnabled("wakatime", true)).toBe(true);
    expect(doc.sheet?.textContent).toBe("");
    expect(readHidden(storage)).toEqual(new Set());
    // Repeating a choice that already holds changes nothing.
    expect(controller.setEnabled("wakatime", true)).toBe(false);
    stop();
  });

  it("stops following the ledger once detached, and removes the sheet", () => {
    const views = ledger([view("files", "文件")]);
    const doc = stripDoc(stripTexts(["文件"]));
    const controller = controllerFor(views, doc, memoryStorage());
    const stop = controller.attach(doc);
    stop();
    expect(doc.sheet).toBeUndefined();
    views.set([view("files", "文件"), view("wakatime", "WakaTime")]);
    expect(doc.sheet).toBeUndefined();
    // The choice itself is kept: the next attach applies it again.
    controller.setEnabled("files", false);
    const next = stripDoc(stripTexts(["文件", "WakaTime"]));
    const stopNext = controller.attach(next);
    expect(next.sheet?.textContent).toBe(`${STRIP_CONTAINER_SELECTOR} > button:nth-child(2)`);
    stopNext();
  });

  it("names the sheet so a reload cannot stack a second copy", () => {
    const views = ledger([view("files", "文件")]);
    const doc = stripDoc(stripTexts(["文件"]));
    const controller = controllerFor(views, doc);
    controller.attach(doc);
    expect(doc.sheet?.dataset.plugin).toBe("dsh-better");
    expect(doc.sheet?.dataset.pluginCss).toBe(STRIP_STYLE_TAG);
  });
});

/**
 * One element, with exactly the surface the page paints through.
 *
 * The test runtime has no DOM and the package does not take one on to get it.
 * This stands in for `Element` at the four calls the paint makes: create,
 * attribute, text, append, and a query back by attribute. It is a fake, so the
 * assertions stay on what the page decided to write, not on browser behaviour.
 */
class FakeElement {
  readonly ownerDocument: FakeDocument;
  readonly children: FakeElement[] = [];
  readonly attrs = new Map<string, string>();
  textContent = "";
  type = "";
  checked = false;
  readonly listeners = new Map<string, () => void>();

  constructor(
    readonly tag: string,
    ownerDocument: FakeDocument,
  ) {
    this.ownerDocument = ownerDocument;
  }

  setAttribute(name: string, value: string): void {
    this.attrs.set(name, value);
  }

  getAttribute(name: string): string | null {
    return this.attrs.get(name) ?? null;
  }

  append(...nodes: FakeElement[]): void {
    this.children.push(...nodes);
  }

  replaceChildren(): void {
    this.children.length = 0;
  }

  addEventListener(type: string, listener: () => void): void {
    this.listeners.set(type, listener);
  }

  querySelector(selector: string): FakeElement | null {
    return this.queryAll(selector)[0] ?? null;
  }

  querySelectorAll(selector: string): FakeElement[] {
    return this.queryAll(selector);
  }

  private queryAll(selector: string): FakeElement[] {
    const found: FakeElement[] = [];
    const match = (element: FakeElement): void => {
      if (matches(element, selector)) found.push(element);
      for (const child of element.children) match(child);
    };
    for (const child of this.children) match(child);
    return found;
  }
}

/** `[name]` or `[name='value']`, the only selectors the page tests use. */
function matches(element: FakeElement, selector: string): boolean {
  const parsed = /^\[([a-z-]+)(?:='([^']*)')?\]$/u.exec(selector);
  if (parsed === null) return element.tag === selector;
  const [, name, value] = parsed;
  return element.attrs.has(name ?? "") && (value === undefined || element.attrs.get(name ?? "") === value);
}

class FakeDocument {
  createElement(tag: string): FakeElement {
    return new FakeElement(tag, this);
  }
}

/** A section the page can paint into and a test can read back. */
function pageSection(): FakeElement {
  return new FakeDocument().createElement("section");
}

const COPY: TabCopy = {
  heading: "Tab 管理",
  empty: "还没有插件注册会话标签。",
  checkboxLabel: (label, enabled) => (enabled ? `隐藏${label}` : `显示${label}`),
};

describe("settings page paint", () => {
  it("writes one row per registered view, and never calls a hook", () => {
    const hooks = { useState: vi.fn(), useSyncExternalStore: vi.fn(), useEffect: vi.fn() };
    const React: PageReact = { createElement: (type, props) => ({ type, props }), ...hooks };
    const controller = createTabController({
      ledger: ledger([view("chat", "对话"), view("wakatime", "WakaTime"), view("files", "文件")]),
    });
    const element = TabSettingsPage({ React, controller, copy: COPY }) as {
      type: unknown;
      props: { ref?: (node: Element | null) => void };
    };
    expect(element.type).toBe("section");
    // The render itself must not have touched a hook: the host calls this
    // function with no dispatcher, and a hook there is what blanks the panel.
    expect(hooks.useState).not.toHaveBeenCalled();
    expect(hooks.useSyncExternalStore).not.toHaveBeenCalled();
    expect(hooks.useEffect).not.toHaveBeenCalled();

    const section = pageSection();
    element.props.ref?.(section as unknown as Element);
    const rows = [...section.querySelectorAll("[data-dsh-better-tabs-row]")].map(row => row.getAttribute("data-dsh-better-tabs-row"));
    expect(rows).toEqual(["wakatime", "files"]);
    expect(section.querySelector("h2")?.textContent).toBe("Tab 管理");
    const box = section.querySelector("[data-dsh-better-tabs-check='files']");
    expect(box?.tag).toBe("input");
    expect(box?.checked).toBe(true);
  });

  it("says so when nothing has registered, and repaints when a view arrives", () => {
    const views = ledger([]);
    const controller = createTabController({ ledger: views });
    const section = pageSection();
    paintRows(section as unknown as Element, { React: { createElement: () => null }, controller, copy: COPY });
    expect(section.querySelector("[data-dsh-better-tabs-empty]")?.textContent).toBe(COPY.empty);

    views.set([view("git", "Git")]);
    paintRows(section as unknown as Element, { React: { createElement: () => null }, controller, copy: COPY });
    expect(section.querySelector("[data-dsh-better-tabs-empty]")).toBeNull();
    expect(section.querySelector("[data-dsh-better-tabs-row]")?.getAttribute("data-dsh-better-tabs-row")).toBe("git");
  });

  it("stops repainting once the host unmounts the section", () => {
    const views = ledger([view("files", "文件")]);
    const controller = createTabController({ ledger: views });
    const React: PageReact = { createElement: (_type, props) => ({ props }) };
    const element = TabSettingsPage({ React, controller, copy: COPY }) as {
      props: { ref?: (node: Element | null) => void };
    };
    const section = pageSection();
    element.props.ref?.(section as unknown as Element);
    element.props.ref?.(null);
    views.set([view("files", "文件"), view("git", "Git")]);
    // The detached section keeps its last paint. A subscription that outlived
    // the page would throw on the node it no longer owns.
    expect(section.querySelectorAll("[data-dsh-better-tabs-row]")).toHaveLength(1);
  });
});

describe("settings section placement", () => {
  it("takes a fresh section id ahead of the workbench page", () => {
    expect(TABS_SECTION_SLOT).toBe("settings.section");
    expect(TABS_SECTION_ID).toBe("tabs");
    // The workbench page is 60 and the host's own pages end at 20, so this sits
    // between them rather than on either.
    expect(TABS_SECTION_ORDER).toBeGreaterThan(20);
    expect(TABS_SECTION_ORDER).toBeLessThan(60);
  });

  it("has a nav label in both dictionaries", () => {
    expect(DICTIONARIES.zh?.["tabs.nav"]).toBe("Tab 管理");
    expect(DICTIONARIES.en?.["tabs.nav"]).toBe("Tabs");
    expect(DICTIONARIES.zh?.["tabs.empty"]).not.toBe("");
    expect(DICTIONARIES.en?.["tabs.show"]).toContain("{label}");
    expect(DICTIONARIES.en?.["tabs.hide"]).toContain("{label}");
  });
});
