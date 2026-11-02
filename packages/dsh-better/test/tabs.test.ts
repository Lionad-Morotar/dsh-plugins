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
  HIDDEN_TAB_RULE,
  applyHiddenButtons,
  createTabController,
  planHiddenButtons,
  readHidden,
  readStripButtons,
  stripMutationsTouchTabs,
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

describe("readStripButtons", () => {
  /**
   * The host's tab: a button whose visible label lives in a nested span, with
   * the tooltip's own fallback text as a sibling the reader must not see.
   */
  function hostButton(label: string, tooltipFallback: string): {
    textContent: string;
    querySelector(selector: string): { textContent: string } | null;
    hasAttribute(name: string): boolean;
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
  } {
    const attrs = new Set<string>();
    return {
      textContent: `${label}${tooltipFallback}`,
      querySelector: selector => (selector === "[class*='tabLabel']" ? { textContent: ` ${label} ` } : null),
      hasAttribute: name => attrs.has(name),
      setAttribute: name => {
        attrs.add(name);
      },
      removeAttribute: name => {
        attrs.delete(name);
      },
    };
  }

  it("reads the nested label rather than the tooltip's fallback text", () => {
    const buttons = [hostButton("对话", ""), hostButton("WakaTime", "WakaTime"), hostButton("文件", "")];
    const doc = {
      querySelector: () => ({
        querySelectorAll: () => Object.assign([...buttons], { length: buttons.length }),
      }),
    };
    expect(readStripButtons(doc)?.map(button => button.label)).toEqual(["对话", "WakaTime", "文件"]);
  });

  it("falls back to the button's own text when the host renders the label bare", () => {
    const doc = {
      querySelector: () => ({
        querySelectorAll: () =>
          Object.assign(
            [{ textContent: " 对话 ", querySelector: () => null, hasAttribute: () => false, setAttribute() {}, removeAttribute() {} }],
            { length: 1 },
          ),
      }),
    };
    expect(readStripButtons(doc)?.map(button => button.label)).toEqual(["对话"]);
  });
});

/** A strip button the planner can see: its label and whether it is already marked. */
function shown(label: string, hidden = false): { label: string; hidden: boolean } {
  return { label, hidden };
}

describe("planHiddenButtons", () => {
  it("hides the one button whose label the preference names", () => {
    const entries = [view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")];
    const planned = planHiddenButtons(
      entries,
      new Set(["wakatime", "not-registered"]),
      [shown("对话"), shown("文件"), shown("WakaTime"), shown("Git")],
    );
    expect(planned).toEqual([false, false, true, false]);
  });

  it("never hides chat, even when the preference names it", () => {
    const entries = [view(FIXED_VIEW_ID, "对话"), view("files", "文件")];
    const planned = planHiddenButtons(entries, new Set([FIXED_VIEW_ID, "files"]), [shown("对话"), shown("文件")]);
    expect(planned).toEqual([false, true]);
  });

  it("plans nothing for an empty strip", () => {
    expect(planHiddenButtons([view("files", "文件")], new Set(["files"]), [])).toEqual([]);
  });

  it("still finds the button when the host dropped a view the ledger has", () => {
    // Developer tools off: the host omits `trajectory`, so the button is not
    // where a positional count would put it. The label is what remains.
    const entries = [view("trajectory", "Trajectory"), view("files", "文件"), view("wakatime", "WakaTime")];
    const planned = planHiddenButtons(
      entries,
      new Set(["wakatime"]),
      [shown("对话"), shown("文件"), shown("WakaTime")],
    );
    expect(planned).toEqual([false, false, true]);
  });

  it("hides nothing when a label is shared by two buttons", () => {
    const entries = [view("files", "文件"), view("clone", "文件")];
    const planned = planHiddenButtons(
      entries,
      new Set(["clone", "files"]),
      [shown("文件"), shown("文件"), shown("其他")],
    );
    expect(planned).toEqual([false, false, false]);
  });

  it("hides nothing when the strip shows labels the ledger does not", () => {
    const planned = planHiddenButtons([view("files", "文件")], new Set(["files"]), [shown("看不懂的标签")]);
    expect(planned).toEqual([false]);
  });
});

describe("stripMutationsTouchTabs", () => {
  /** A node the predicate can recognise as the tab strip, or as something else. */
  function node(holdsStrip: boolean): {
    matches(selector: string): boolean;
    querySelector(selector: string): object | null;
    contains(target: unknown): boolean;
  } {
    return {
      matches: selector => holdsStrip && selector === STRIP_CONTAINER_SELECTOR,
      querySelector: selector => (holdsStrip && selector === STRIP_CONTAINER_SELECTOR ? {} : null),
      contains: () => false,
    };
  }

  it("notices a change inside the tab strip", () => {
    const strip = node(true);
    expect(stripMutationsTouchTabs([{ target: strip }], strip)).toBe(true);
  });

  it("ignores a change that never touches the tab strip", () => {
    const strip = node(true);
    const chat = node(false);
    expect(stripMutationsTouchTabs([{ target: chat, addedNodes: [node(false)] }], strip)).toBe(false);
  });

  it("notices the header being replaced, which takes the strip with it", () => {
    const strip = node(true);
    expect(stripMutationsTouchTabs([{ target: node(false), removedNodes: [node(true)] }], strip)).toBe(true);
  });
});

describe("applyHiddenButtons", () => {
  it("marks only the buttons whose state disagrees with the plan", () => {
    const marks: [number, boolean][] = [];
    const buttons = [
      { label: "对话", hidden: false, mark: (hidden: boolean) => marks.push([0, hidden]) },
      { label: "WakaTime", hidden: false, mark: (hidden: boolean) => marks.push([1, hidden]) },
      { label: "文件", hidden: true, mark: (hidden: boolean) => marks.push([2, hidden]) },
    ];
    const changed = applyHiddenButtons(buttons, [false, true, false]);
    expect(changed).toBe(true);
    // The first button already agrees, so it is not touched.
    expect(marks).toEqual([[1, true], [2, false]]);
  });
});

describe("createTabController", () => {
  /** A bare document that records the sheet and answers the strip reader. */
  function stripDoc(
    texts: readonly string[] | undefined,
  ): StripHostDocument & {
    readonly sheet: StripStyleTag | undefined;
    /** The buttons the strip currently shows, Chat included. */
    buttons: { label: string; hidden: boolean; mark(hidden: boolean): void }[];
    set(labels: readonly string[] | undefined): void;
  } {
    let sheet: StripStyleTag | undefined;
    let buttons: { label: string; hidden: boolean; mark(hidden: boolean): void }[] =
      texts === undefined ? [] : texts.map(label => liveButton(label));
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
        const replacement = next === undefined ? [] : next.map(label => liveButton(label));
        buttons.splice(0, buttons.length, ...replacement);
        for (const callback of callbacks.splice(0)) callback();
      },
    };
    const face = {
      ...doc,
      get sheet() {
        return sheet;
      },
      // The same array the reader walks. A getter would hand back a fresh
      // view, and the marks the controller writes would land on a copy the
      // assertion never sees. `set` replaces the contents in place so the
      // reader, which closed over this array, sees the replacement.
      buttons,
    };
    return face;
  }

  /** A button that records its own marker, the way the DOM button does. */
  function liveButton(label: string): { label: string; hidden: boolean; mark(hidden: boolean): void } {
    const button = {
      label,
      hidden: false,
      mark(hidden: boolean) {
        button.hidden = hidden;
      },
    };
    return button;
  }

  /** The labels currently marked hidden, in strip order. */
  function hiddenLabels(doc: ReturnType<typeof stripDoc>): string[] {
    return doc.buttons.filter(button => button.hidden).map(button => button.label);
  }

  /** The controller wired to read its strip from the fake document. */
  function controllerFor(
    views: ViewLedger,
    doc: ReturnType<typeof stripDoc>,
    storage?: TabStorage,
  ): ReturnType<typeof createTabController> {
    return createTabController({
      ledger: views,
      storage,
      readButtons: () => (doc.buttons.length === 0 ? undefined : doc.buttons),
    });
  }

  it("applies a stored choice once the strip renders, and follows a plugin that registers later", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const storage = memoryStorage(JSON.stringify(["wakatime"]));
    const doc = stripDoc(undefined);
    const controller = controllerFor(views, doc, storage);
    const stop = controller.attach(doc);

    // Before the strip renders nothing is marked; the retry lands it.
    expect(hiddenLabels(doc)).toEqual([]);
    doc.set(stripTexts(["文件", "WakaTime"]));
    expect(hiddenLabels(doc)).toEqual(["WakaTime"]);
    expect(controller.rows().map(row => [row.id, row.enabled])).toEqual([
      ["files", true],
      ["wakatime", false],
    ]);

    views.set([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    expect(controller.rows().map(row => row.id)).toEqual(["files", "wakatime", "git"]);
    // A newly registered view is shown: the preference only hides what it names.
    doc.set(stripTexts(["文件", "WakaTime", "Git"]));
    views.set([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    expect(hiddenLabels(doc)).toEqual(["WakaTime"]);
    stop();
  });

  it("hides and restores a tab without touching the ledger", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const storage = memoryStorage();
    const doc = stripDoc(stripTexts(["文件", "WakaTime"]));
    const controller = controllerFor(views, doc, storage);
    const stop = controller.attach(doc);

    expect(controller.setEnabled("wakatime", false)).toBe(true);
    expect(hiddenLabels(doc)).toEqual(["WakaTime"]);
    expect(views.entriesOfSlot(VIEW_SLOT).map(entry => entry.options.id)).toEqual(["files", "wakatime"]);
    expect(readHidden(storage)).toEqual(new Set(["wakatime"]));

    expect(controller.setEnabled("wakatime", true)).toBe(true);
    expect(hiddenLabels(doc)).toEqual([]);
    expect(readHidden(storage)).toEqual(new Set());
    // Repeating a choice that already holds changes nothing.
    expect(controller.setEnabled("wakatime", true)).toBe(false);
    stop();
  });

  it("restamps a hidden tab after the host rebuilds the strip, and stops once detached", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const doc = stripDoc(stripTexts(["文件", "WakaTime"]));
    let watching = true;
    let rebuilt: (() => void) | undefined;
    const controller = createTabController({
      ledger: views,
      storage: memoryStorage(),
      readButtons: () => (doc.buttons.length === 0 ? undefined : doc.buttons),
      watch(_doc, onChange) {
        rebuilt = () => {
          if (watching) onChange();
        };
        return () => {
          watching = false;
        };
      },
    });
    const stop = controller.attach(doc);
    controller.setEnabled("wakatime", false);
    expect(hiddenLabels(doc)).toEqual(["WakaTime"]);

    // The host re-renders the header. The new buttons are born without the
    // marker, which is the tab coming back on its own.
    const fresh = stripTexts(["文件", "WakaTime"]).map(label => liveButton(label));
    doc.buttons.splice(0, doc.buttons.length, ...fresh);
    expect(hiddenLabels(doc)).toEqual([]);
    rebuilt?.();
    expect(hiddenLabels(doc)).toEqual(["WakaTime"]);

    stop();
    const again = stripTexts(["文件", "WakaTime"]).map(label => liveButton(label));
    doc.buttons.splice(0, doc.buttons.length, ...again);
    rebuilt?.();
    expect(hiddenLabels(doc)).toEqual([]);
  });

  it("stops following the ledger once detached, and removes the sheet", () => {
    const views = ledger([view("files", "文件")]);
    const storage = memoryStorage();
    const doc = stripDoc(stripTexts(["文件"]));
    const controller = controllerFor(views, doc, storage);
    const stop = controller.attach(doc);
    controller.setEnabled("files", false);
    expect(hiddenLabels(doc)).toEqual(["文件"]);
    stop();
    // The sheet is gone, and a ledger change afterwards does not come back to
    // mark anything: there is no strip subscription left to fire.
    expect(doc.sheet).toBeUndefined();
    views.set([view("files", "文件"), view("wakatime", "WakaTime")]);
    expect(doc.sheet).toBeUndefined();
    // The choice is the part that survives. A new controller, the shape a
    // reload gets, reads it back and marks the strip it is given.
    expect(readHidden(storage)).toEqual(new Set(["files"]));
    const next = stripDoc(stripTexts(["文件", "WakaTime"]));
    const reloaded = controllerFor(views, next, storage);
    const stopNext = reloaded.attach(next);
    expect(hiddenLabels(next)).toEqual(["文件"]);
    stopNext();
  });

  it("names the sheet so a reload cannot stack a second copy", () => {
    const views = ledger([view("files", "文件")]);
    const doc = stripDoc(stripTexts(["文件"]));
    const controller = controllerFor(views, doc);
    controller.attach(doc);
    expect(doc.sheet?.dataset.plugin).toBe("dsh-better");
    expect(doc.sheet?.dataset.pluginCss).toBe(STRIP_STYLE_TAG);
    // The rule addresses the marker, not a child position: the host puts text
    // and comment nodes between the buttons, so a positional selector matches
    // nothing.
    expect(doc.sheet?.textContent).toBe(HIDDEN_TAB_RULE);
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
