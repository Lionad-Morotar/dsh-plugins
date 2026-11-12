/**
 * The tab page's contract with the host strip.
 *
 * What this protects is the decision, not the rendering. A checkbox that hides a
 * tab by withdrawing its registration would also blank the open view, because the
 * host renders a selected view id whether or not it has a tab. So the cases here
 * pin what the choice is and how it reaches the strip: the preference survives a
 * reload (both halves of it — the hidden set and the order), a hidden tab reaches
 * the strip only as a rule for a button the plan could actually identify, the
 * order reaches it as inline `order` values that name every button or none, and
 * Chat is never offered as a choice nor moved by one. The page's own contract —
 * a fixed numbered slot for Chat and a drag that commits on the drop — is pinned
 * at the same level: what the paint writes, and what a simulated drag commits.
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
  applyStripOrders,
  createTabController,
  planHiddenButtons,
  planStripOrders,
  readPrefs,
  readStripButtons,
  stripMutationsTouchTabs,
  stripPositions,
  resolveViewLabel,
  stripRows,
  tabRows,
  writePrefs,
  type StripHostDocument,
  type StripStyleTag,
  type TabPrefs,
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

/** A preference set, spelled the way the page means it. */
function prefs(hidden: readonly string[] = [], order: readonly string[] = []): TabPrefs {
  return { hidden: new Set(hidden), order };
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

describe("readPrefs / writePrefs", () => {
  it("treats a missing, empty, or corrupt document as no choice", () => {
    const empty: TabPrefs = { hidden: new Set(), order: [] };
    expect(readPrefs(undefined)).toEqual(empty);
    expect(readPrefs(memoryStorage())).toEqual(empty);
    expect(readPrefs(memoryStorage("not json"))).toEqual(empty);
    expect(readPrefs(memoryStorage("{\"hidden\":true}"))).toEqual(empty);
    expect(readPrefs(memoryStorage("null"))).toEqual(empty);
  });

  it("reads the original array document as a hidden set only", () => {
    const storage = memoryStorage(JSON.stringify(["wakatime", "", 3, "chat", "files"]));
    expect(readPrefs(storage)).toEqual(prefs(["wakatime", "files"]));
  });

  it("reads the current document as both lists, and refuses chat in either", () => {
    const storage = memoryStorage(
      JSON.stringify({ version: 2, hidden: ["files", "chat", 5], order: ["git", "chat", "git", "files", ""] }),
    );
    expect(readPrefs(storage)).toEqual(prefs(["files"], ["git", "files"]));
  });

  it("round-trips both lists through one document", () => {
    const storage = memoryStorage();
    writePrefs(storage, prefs(["git", "wakatime"], ["wakatime", "git"]));
    expect(JSON.parse(storage.document.get(TABS_STORAGE_KEY) ?? "{}")).toEqual({
      version: 2,
      hidden: ["git", "wakatime"],
      order: ["wakatime", "git"],
    });
    expect(readPrefs(storage)).toEqual(prefs(["git", "wakatime"], ["wakatime", "git"]));
  });

  it("keeps the in-memory choice when storage refuses the write", () => {
    const storage: TabStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(() => writePrefs(storage, prefs(["files"]))).not.toThrow();
  });
});

describe("tabRows / stripRows", () => {
  it("lists registered views in ledger order when no order is remembered", () => {
    const rows = tabRows(
      [view("chat", "对话"), view("files", "文件"), view("wakatime", () => "WakaTime")],
      prefs(["files"]),
    );
    expect(rows.map(row => row.id)).toEqual(["files", "wakatime"]);
    expect(rows.map(row => row.enabled)).toEqual([false, true]);
    expect(rows.map(row => row.label)).toEqual(["文件", "WakaTime"]);
  });

  it("takes the remembered order first and appends views the memory never named", () => {
    const entries = [view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")];
    const rows = tabRows(entries, prefs([], ["git"]));
    expect(rows.map(row => row.id)).toEqual(["git", "files", "wakatime"]);
    // An id the ledger dropped keeps its place in the document but not on the
    // page; when the plugin comes back the slot is still there.
    expect(tabRows(entries, prefs([], ["gone", "wakatime"])).map(row => row.id)).toEqual([
      "wakatime",
      "files",
      "git",
    ]);
  });

  it("falls back to the id when a label throws or is empty", () => {
    expect(resolveViewLabel(() => {
      throw new Error("locale");
    }, "git")).toBe("git");
    expect(resolveViewLabel("", "git")).toBe("git");
    expect(resolveViewLabel(undefined, "git")).toBe("git");
  });

  it("collapses a shadowed cell to one row", () => {
    const rows = tabRows([view("files", "文件"), view("files", "文件（旧）")], prefs());
    expect(rows).toEqual([{ id: "files", label: "文件", enabled: true }]);
  });

  it("projects the same roster onto the strip, chat excluded there too", () => {
    expect(stripRows([view("chat", "对话"), view("files", "文件"), view("files", "旧")]))
      .toEqual([{ id: "files", label: "文件" }]);
  });
});

describe("stripPositions", () => {
  it("numbers the shown rows from 2, Chat being 1, and skips hidden ones", () => {
    const rows = tabRows(
      [view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")],
      prefs(["wakatime"], ["git"]),
    );
    // Order: git, files, wakatime. Shown: git, files. Hidden wakatime takes no
    // place — it is not in the strip to have one.
    expect(stripPositions(rows)).toEqual(new Map([["git", 2], ["files", 3]]));
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
    style: { order: string };
    hasAttribute(name: string): boolean;
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
  } {
    const attrs = new Set<string>();
    return {
      textContent: `${label}${tooltipFallback}`,
      querySelector: selector => (selector === "[class*='tabLabel']" ? { textContent: ` ${label} ` } : null),
      style: { order: "" },
      hasAttribute: name => attrs.has(name),
      setAttribute: (name, value) => {
        attrs.add(name);
        if (name === "style") return;
        void value;
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
            [{
              textContent: " 对话 ",
              querySelector: () => null,
              style: { order: "" },
              hasAttribute: () => false,
              setAttribute() {},
              removeAttribute() {},
            }],
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

describe("planStripOrders", () => {
  it("numbers every movable button after Chat, in the remembered order", () => {
    const entries = [view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")];
    const planned = planStripOrders(
      entries,
      prefs([], ["git"]),
      [shown("对话"), shown("文件"), shown("WakaTime"), shown("Git")],
    );
    // Remembered: git. Composed: git, files, wakatime — so Git takes 2.
    expect(planned).toEqual([null, 3, 4, 2]);
  });

  it("leaves Chat and unknown buttons unstamped", () => {
    // 对话 is Chat itself; an unknown label is a strip this plan cannot name.
    // Neither may take an order value: Chat must keep leading, and an unnamed
    // button has no place this plan can claim to know.
    const planned = planStripOrders(
      [view("files", "文件")],
      prefs(),
      [shown("对话"), shown("文件"), shown("看不懂的标签")],
    );
    expect(planned).toEqual([null, 2, null]);
  });

  it("gives a hidden view no number and compacts the ones after it", () => {
    const entries = [view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")];
    const planned = planStripOrders(
      entries,
      prefs(["files"], ["files", "wakatime"]),
      [shown("对话"), shown("文件"), shown("WakaTime"), shown("Git")],
    );
    // Hidden files is dropped from the numbering; wakatime takes its 2, git
    // follows with 3 — the numbers the strip actually shows.
    expect(planned).toEqual([null, null, 2, 3]);
  });

  it("voids the whole plan when two views share a label the strip shows", () => {
    const entries = [view("files", "文件"), view("clone", "文件")];
    const planned = planStripOrders(entries, prefs(), [shown("对话"), shown("文件"), shown("文件")]);
    expect(planned).toEqual([null, null, null]);
  });

  it("voids the whole plan when a view is named like Chat", () => {
    // The view's label matches two buttons, one of which is the one tab that
    // must never move; ordering by label would reorder Chat itself.
    const entries = [view("mimic", "对话"), view("files", "文件")];
    const planned = planStripOrders(entries, prefs(), [shown("对话"), shown("文件")]);
    expect(planned).toEqual([null, null]);
  });

  it("tolerates a ledger view the strip does not show", () => {
    // Developer tools off: trajectory has no button, and the remaining labels
    // are still unambiguous.
    const entries = [view("trajectory", "Trajectory"), view("files", "文件")];
    const planned = planStripOrders(entries, prefs([], ["files"]), [shown("对话"), shown("文件")]);
    expect(planned).toEqual([null, 2]);
  });
});

describe("applyStripOrders", () => {
  /** A button that records its own inline order, the way the DOM button does. */
  function ordered(label: string, order = ""): {
    label: string;
    hidden: boolean;
    order: string;
    mark(hidden: boolean): void;
    setOrder(next: string): void;
  } {
    const button = {
      label,
      hidden: false,
      order,
      mark(hidden: boolean) {
        button.hidden = hidden;
      },
      setOrder(next: string) {
        button.order = next;
      },
    };
    return button;
  }

  it("stamps only the buttons whose order disagrees with the plan", () => {
    const buttons = [ordered("对话"), ordered("Git", "2"), ordered("文件")];
    const changed = applyStripOrders(buttons, [null, 2, 3]);
    expect(changed).toBe(true);
    expect(buttons.map(button => button.order)).toEqual(["", "2", "3"]);
  });

  it("clears a stamp the plan no longer names", () => {
    // A stale order on a rebuilt button is a tab stuck in a place the reader
    // did not choose, so null clears rather than skips.
    const buttons = [ordered("对话"), ordered("文件", "3")];
    const changed = applyStripOrders(buttons, [null, null]);
    expect(changed).toBe(true);
    expect(buttons.map(button => button.order)).toEqual(["", ""]);
  });

  it("changes nothing when the strip already agrees", () => {
    const buttons = [ordered("对话"), ordered("文件", "2")];
    const changed = applyStripOrders(buttons, [null, 2]);
    expect(changed).toBe(false);
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
      { label: "对话", hidden: false, order: "", mark: (hidden: boolean) => marks.push([0, hidden]), setOrder: () => {} },
      { label: "WakaTime", hidden: false, order: "", mark: (hidden: boolean) => marks.push([1, hidden]), setOrder: () => {} },
      { label: "文件", hidden: true, order: "", mark: (hidden: boolean) => marks.push([2, hidden]), setOrder: () => {} },
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
    buttons: {
      label: string;
      hidden: boolean;
      order: string;
      style: { order: string };
      mark(hidden: boolean): void;
      setOrder(order: string): void;
    }[];
    set(labels: readonly string[] | undefined): void;
  } {
    let sheet: StripStyleTag | undefined;
    let buttons: {
      label: string;
      hidden: boolean;
      order: string;
      style: { order: string };
      mark(hidden: boolean): void;
      setOrder(order: string): void;
    }[] = texts === undefined ? [] : texts.map(label => liveButton(label));
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

  /** A button that records its own marker and order, the way the DOM button does. */
  function liveButton(label: string): {
    label: string;
    hidden: boolean;
    order: string;
    style: { order: string };
    mark(hidden: boolean): void;
    setOrder(order: string): void;
  } {
    const button = {
      label,
      hidden: false,
      order: "",
      style: { order: "" },
      mark(hidden: boolean) {
        button.hidden = hidden;
      },
      setOrder(order: string) {
        button.style.order = order;
        button.order = order;
      },
    };
    return button;
  }

  /** The labels currently marked hidden, in strip order. */
  function hiddenLabels(doc: ReturnType<typeof stripDoc>): string[] {
    return doc.buttons.filter(button => button.hidden).map(button => button.label);
  }

  /** Each button's inline order, paired with its label. */
  function orders(doc: ReturnType<typeof stripDoc>): [string, string][] {
    return doc.buttons.map(button => [button.label, button.style.order]);
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
    expect(readPrefs(storage)).toEqual(prefs(["wakatime"]));

    expect(controller.setEnabled("wakatime", true)).toBe(true);
    expect(hiddenLabels(doc)).toEqual([]);
    expect(readPrefs(storage)).toEqual(prefs());
    // Repeating a choice that already holds changes nothing.
    expect(controller.setEnabled("wakatime", true)).toBe(false);
    stop();
  });

  it("stamps the remembered order onto the strip, Chat untouched", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    const storage = memoryStorage();
    const doc = stripDoc(stripTexts(["文件", "WakaTime", "Git"]));
    const controller = controllerFor(views, doc, storage);
    const stop = controller.attach(doc);

    expect(controller.setOrder(["git", "wakatime"])).toBe(true);
    // Chat keeps the empty order; the movables carry their strip positions.
    expect(orders(doc)).toEqual([["对话", ""], ["文件", "4"], ["WakaTime", "3"], ["Git", "2"]]);
    expect(controller.rows().map(row => row.id)).toEqual(["git", "wakatime", "files"]);
    expect(JSON.parse(storage.document.get(TABS_STORAGE_KEY) ?? "{}")).toEqual({
      version: 2,
      hidden: [],
      order: ["git", "wakatime"],
    });

    // Hiding a view drops it from the numbering and clears its stamp; the
    // shown tabs compact around it.
    controller.setEnabled("files", false);
    expect(orders(doc)).toEqual([["对话", ""], ["文件", ""], ["WakaTime", "3"], ["Git", "2"]]);
    expect(readPrefs(storage)).toEqual(prefs(["files"], ["git", "wakatime"]));

    // Repeating a sequence that already holds changes nothing.
    expect(controller.setOrder(["git", "wakatime"])).toBe(false);
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
    controller.setOrder(["wakatime"]);
    // Hidden wakatime takes no number; files, the only shown view, is 2.
    expect(orders(doc)).toEqual([["对话", ""], ["文件", "2"], ["WakaTime", ""]]);

    // The host re-renders the header. The new buttons are born without the
    // marker or the order, which is the tab coming back on its own.
    const fresh = stripTexts(["文件", "WakaTime"]).map(label => liveButton(label));
    doc.buttons.splice(0, doc.buttons.length, ...fresh);
    expect(hiddenLabels(doc)).toEqual([]);
    expect(orders(doc)).toEqual([["对话", ""], ["文件", ""], ["WakaTime", ""]]);
    rebuilt?.();
    expect(hiddenLabels(doc)).toEqual(["WakaTime"]);
    expect(orders(doc)).toEqual([["对话", ""], ["文件", "2"], ["WakaTime", ""]]);

    stop();
    const again = stripTexts(["文件", "WakaTime"]).map(label => liveButton(label));
    doc.buttons.splice(0, doc.buttons.length, ...again);
    rebuilt?.();
    expect(hiddenLabels(doc)).toEqual([]);
    expect(orders(doc)).toEqual([["对话", ""], ["文件", ""], ["WakaTime", ""]]);
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
    expect(readPrefs(storage)).toEqual(prefs(["files"]));
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
 * This stands in for `Element` at the calls the paint makes: create, attribute,
 * text, append, the two moves a drag performs, and a query back by attribute.
 * It is a fake, so the assertions stay on what the page decided to write, not
 * on browser behaviour.
 */
class FakeElement {
  readonly ownerDocument: FakeDocument;
  readonly children: FakeElement[] = [];
  readonly attrs = new Map<string, string>();
  textContent = "";
  type = "";
  checked = false;
  readonly listeners = new Map<string, (event?: unknown) => void>();
  parentElement: FakeElement | null = null;

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

  removeAttribute(name: string): void {
    this.attrs.delete(name);
  }

  append(...nodes: FakeElement[]): void {
    for (const node of nodes) node.parentElement = this;
    this.children.push(...nodes);
  }

  replaceChildren(): void {
    for (const child of this.children) child.parentElement = null;
    this.children.length = 0;
  }

  insertBefore(node: FakeElement, reference: FakeElement | null): void {
    const prior = node.parentElement;
    const own = prior?.children.indexOf(node) ?? -1;
    let at = reference === null ? this.children.length : this.children.indexOf(reference);
    if (at < 0) {
      this.append(node);
      return;
    }
    // DOM semantics: the reference index is taken in the list the node joins,
    // so a removal on its left shifts the landing slot back by one.
    if (prior === this && own >= 0 && own < at) at -= 1;
    if (prior !== null && own >= 0) prior.children.splice(own, 1);
    node.parentElement = this;
    this.children.splice(at, 0, node);
  }

  get nextSibling(): FakeElement | null {
    const parent = this.parentElement;
    if (parent === null) return null;
    const at = parent.children.indexOf(this);
    return parent.children[at + 1] ?? null;
  }

  /** A stand-in geometry: every row is the same 100px tall band. */
  getBoundingClientRect(): { top: number; height: number } {
    return { top: 0, height: 100 };
  }

  addEventListener(type: string, listener: (event?: unknown) => void): void {
    this.listeners.set(type, listener);
  }

  dispatch(type: string, event?: unknown): void {
    this.listeners.get(type)?.(event);
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
  chatLabel: "对话",
  chatNote: "固定在标签栏最前，不可隐藏或拖动",
  empty: "还没有插件注册会话标签。",
  checkboxLabel: (label, enabled) => (enabled ? `隐藏${label}` : `显示${label}`),
};

/** A synthetic drag event: coordinates when the test cares about the midline. */
function dragEvent(clientY?: number): DragEvent {
  return {
    preventDefault: () => {},
    clientY,
    dataTransfer: { setData: () => {} },
  } as unknown as DragEvent;
}

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
    expect(rows).toEqual(["chat", "wakatime", "files"]);
    expect(section.querySelector("h2")?.textContent).toBe("Tab 管理");
    const box = section.querySelector("[data-dsh-better-tabs-check='files']");
    expect(box?.tag).toBe("input");
    expect(box?.checked).toBe(true);
  });

  it("renders the fixed slot first: numbered 1, named, noted, and carrying no control", () => {
    const controller = createTabController({ ledger: ledger([view("files", "文件")]) });
    const section = pageSection();
    paintRows(section as unknown as Element, { React: { createElement: () => null }, controller, copy: COPY });
    const fixed = section.querySelector("[data-dsh-better-tabs-row='chat']");
    expect(fixed).not.toBeNull();
    expect(fixed?.getAttribute("draggable")).toBeNull();
    // The number is the slot Chat already holds, so the first movable tab is 2.
    expect(fixed?.querySelector("[data-dsh-better-tabs-pos]")?.textContent).toBe("1");
    // A checkbox here would be a control that cannot do what it says, and a
    // control-less row reads as a broken one: the note is why it has none.
    expect(fixed?.querySelector("input")).toBeNull();
    expect(fixed?.querySelector("[data-dsh-better-tabs-note]")?.textContent).toBe(COPY.chatNote);
    const files = section.querySelector("[data-dsh-better-tabs-row='files']");
    expect(files?.querySelector("[data-dsh-better-tabs-pos]")?.textContent).toBe("2");
    expect(files?.getAttribute("draggable")).toBe("true");
    // The movable rows carry no note: the checkbox is its own explanation.
    expect(files?.querySelector("[data-dsh-better-tabs-note]")).toBeNull();
  });

  it("gives a hidden row no number, and numbers the shown ones around it", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    const controller = createTabController({ ledger: views });
    controller.setEnabled("wakatime", false);
    const section = pageSection();
    paintRows(section as unknown as Element, { React: { createElement: () => null }, controller, copy: COPY });
    const chipOf = (id: string): string | null | undefined =>
      section.querySelector(`[data-dsh-better-tabs-row='${id}']`)?.querySelector("[data-dsh-better-tabs-pos]")
        ?.textContent ?? null;
    expect(chipOf("wakatime")).toBeNull();
    expect(chipOf("files")).toBe("2");
    expect(chipOf("git")).toBe("3");
  });

  it("says so when nothing has registered, and repaints when a view arrives", () => {
    const views = ledger([]);
    const controller = createTabController({ ledger: views });
    const section = pageSection();
    paintRows(section as unknown as Element, { React: { createElement: () => null }, controller, copy: COPY });
    // The fixed slot stays: Chat is the strip even when nothing else is.
    expect(section.querySelector("[data-dsh-better-tabs-row='chat']")).not.toBeNull();
    expect(section.querySelector("[data-dsh-better-tabs-empty]")?.textContent).toBe(COPY.empty);

    views.set([view("git", "Git")]);
    paintRows(section as unknown as Element, { React: { createElement: () => null }, controller, copy: COPY });
    expect(section.querySelector("[data-dsh-better-tabs-empty]")).toBeNull();
    expect(section.querySelector("[data-dsh-better-tabs-row]")?.getAttribute("data-dsh-better-tabs-row")).toBe("chat");
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
    expect(section.querySelectorAll("[data-dsh-better-tabs-check]")).toHaveLength(1);
  });
});

describe("drag to reorder", () => {
  /** Three rows painted through the mounted page, ready for a simulated drag. */
  function painted(): {
    section: FakeElement;
    controller: ReturnType<typeof createTabController>;
    storage: ReturnType<typeof memoryStorage>;
    row(id: string): FakeElement | null;
  } {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    const storage = memoryStorage();
    const controller = createTabController({ ledger: views, storage });
    const React: PageReact = { createElement: (type, props) => ({ type, props }) };
    const element = TabSettingsPage({ React, controller, copy: COPY }) as {
      props: { ref?: (node: Element | null) => void };
    };
    const section = pageSection();
    // Mounting through the ref is what wires the paint subscription: the drop
    // commits through the controller, and the repaint it fires is part of the
    // contract under test.
    element.props.ref?.(section as unknown as Element);
    return {
      section,
      controller,
      storage,
      row: id => section.querySelector(`[data-dsh-better-tabs-row='${id}']`),
    };
  }

  /** The movable rows in the order the page shows them. */
  function pageOrder(section: FakeElement): readonly string[] {
    return section
      .querySelectorAll("[data-dsh-better-tabs-row]")
      .filter(row => row.getAttribute("draggable") === "true")
      .map(row => row.getAttribute("data-dsh-better-tabs-row") ?? "");
  }

  it("moves the dragged node live across the hovered row's midline", () => {
    const { section, row } = painted();
    const source = row("wakatime");
    source?.dispatch("dragstart", dragEvent());

    // Above the target's midline: the drag lands before 文件.
    row("files")?.dispatch("dragover", dragEvent(20));
    expect(pageOrder(section)).toEqual(["wakatime", "files", "git"]);

    // Below it: after, which walks the row one slot further down.
    row("files")?.dispatch("dragover", dragEvent(80));
    expect(pageOrder(section)).toEqual(["files", "wakatime", "git"]);
  });

  it("commits on the dragend, the one end-of-drag event the browser always fires", () => {
    const { section, row, controller, storage } = painted();
    const source = row("git");
    source?.dispatch("dragstart", dragEvent());
    // Drag Git up to the top of the list: above 文件's midline.
    row("files")?.dispatch("dragover", dragEvent(10));
    // No drop: the browser only delivers one to a row whose dragover was
    // prevented, and the dragged row follows the pointer, so a release over
    // itself ends the drag without one. The commit happens anyway.
    source?.dispatch("dragend");

    expect(controller.rows().map(row => row.id)).toEqual(["git", "files", "wakatime"]);
    expect(JSON.parse(storage.document.get("dsh-better.tabs") ?? "{}")).toEqual({
      version: 2,
      hidden: [],
      order: ["git", "files", "wakatime"],
    });
    // The repaint the commit fires renumbers the chips to the strip's places.
    expect(row("git")?.querySelector("[data-dsh-better-tabs-pos]")?.textContent).toBe("2");
    expect(row("wakatime")?.querySelector("[data-dsh-better-tabs-pos]")?.textContent).toBe("4");
  });

  it("keeps the drop deliverable over the dragged row itself", () => {
    // The dragged row follows the pointer, so the release lands on it more
    // often than not. Its dragover must still allow the drop — a dragover the
    // browser sees as not prevented turns the whole gesture into a failed
    // drag — while the list itself stays put.
    const { section, row } = painted();
    const source = row("wakatime");
    source?.dispatch("dragstart", dragEvent());
    let prevented = false;
    source?.dispatch("dragover", { preventDefault: () => { prevented = true; }, clientY: 10 });
    expect(prevented).toBe(true);
    expect(pageOrder(section)).toEqual(["files", "wakatime", "git"]);
    source?.dispatch("dragend");
    // Nothing moved, so the stored order stands.
    expect(pageOrder(section)).toEqual(["files", "wakatime", "git"]);
  });

  it("commits exactly once when a drop precedes the dragend", () => {
    // A real release fires drop and then dragend; the commit belongs to the
    // dragend alone, and a second write of the same order is a no-op.
    const { section, row, storage } = painted();
    const source = row("git");
    source?.dispatch("dragstart", dragEvent());
    row("files")?.dispatch("dragover", dragEvent(10));
    row("files")?.dispatch("drop", dragEvent());
    expect(storage.document.get("dsh-better.tabs")).toBeUndefined();
    source?.dispatch("dragend");
    expect(pageOrder(section)).toEqual(["git", "files", "wakatime"]);
    expect(JSON.parse(storage.document.get("dsh-better.tabs") ?? "{}")).toEqual({
      version: 2,
      hidden: [],
      order: ["git", "files", "wakatime"],
    });
  });

  it("leaves the stored order untouched when the drag never moved a node", () => {
    const { section, row, storage } = painted();
    const source = row("git");
    source?.dispatch("dragstart", dragEvent());
    source?.dispatch("dragend");
    expect(pageOrder(section)).toEqual(["files", "wakatime", "git"]);
    expect(storage.document.get("dsh-better.tabs")).toBeUndefined();
  });

  it("never moves the fixed slot, however the drag crosses it", () => {
    const { section, row } = painted();
    const source = row("files");
    source?.dispatch("dragstart", dragEvent());
    // The fixed row is not a drop target with a dragover listener; the first
    // row a drag can cross is the movable one below Chat.
    expect(row("chat")?.listeners.has("dragover")).toBe(false);
    // ...and Chat keeps leading the page however the movable rows move.
    const rows = section.querySelectorAll("[data-dsh-better-tabs-row]");
    expect(rows[0]?.getAttribute("data-dsh-better-tabs-row")).toBe("chat");
    expect(rows.slice(1).map(row => row.getAttribute("data-dsh-better-tabs-row"))).toEqual([
      "files",
      "wakatime",
      "git",
    ]);
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
    expect(DICTIONARIES.zh?.["tabs.chat"]).toBe("对话");
    expect(DICTIONARIES.en?.["tabs.chat"]).toBe("Chat");
    expect(DICTIONARIES.zh?.["tabs.chatNote"]).not.toBe("");
    expect(DICTIONARIES.en?.["tabs.chatNote"]).not.toBe("");
    expect(DICTIONARIES.zh?.["tabs.empty"]).not.toBe("");
    expect(DICTIONARIES.en?.["tabs.show"]).toContain("{label}");
    expect(DICTIONARIES.en?.["tabs.hide"]).toContain("{label}");
  });
});
