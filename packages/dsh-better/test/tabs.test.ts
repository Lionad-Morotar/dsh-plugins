/**
 * The tab page's contract with the host strip.
 *
 * What this protects is the decision, not the rendering. A checkbox that hides a
 * tab by withdrawing its registration would also blank the open view, because the
 * host renders a selected view id whether or not it has a tab. So the cases here
 * pin three things: the preference survives a reload, it reaches the host only
 * through the pin seam, and Chat is never offered as a choice.
 */
import { describe, expect, it } from "vitest";

import { DICTIONARIES } from "../src/client/dictionaries.ts";
import {
  FIXED_VIEW_ID,
  TABS_SECTION_ID,
  TABS_SECTION_ORDER,
  TABS_SECTION_SLOT,
  TABS_STORAGE_KEY,
  VIEW_SLOT,
  applyHidden,
  createTabController,
  readHidden,
  resolveViewLabel,
  tabRows,
  writeHidden,
  type TabStorage,
  type ViewEntry,
  type ViewLedger,
  type ViewPins,
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

/** The host's pin list, recording every change the controller asks for. */
function pins(initial: readonly string[] = []): ViewPins & { readonly calls: [string, boolean][] } {
  let unpinned = [...initial];
  const listeners = new Set<() => void>();
  const calls: [string, boolean][] = [];
  return {
    calls,
    unpinned: {
      getSnapshot: () => unpinned,
      subscribe: listener => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    },
    setPinned(id, pinned) {
      calls.push([id, pinned]);
      unpinned = pinned ? unpinned.filter(item => item !== id) : [...unpinned, id];
      for (const listener of [...listeners]) listener();
    },
  };
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

describe("tabRows", () => {
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
});

describe("applyHidden", () => {
  it("pins exactly the registered views the preference hides", () => {
    const seam = pins();
    const changed = applyHidden(
      [view("chat"), view("files"), view("wakatime")],
      new Set(["wakatime", "not-registered"]),
      seam,
    );
    expect(changed).toBe(true);
    expect(seam.calls).toEqual([["wakatime", false]]);
    expect(seam.unpinned.getSnapshot()).toEqual(["wakatime"]);
  });

  it("restores a view the preference shows, and skips a list that already agrees", () => {
    const seam = pins(["files"]);
    const changed = applyHidden([view("files"), view("git")], new Set(), seam);
    expect(changed).toBe(true);
    expect(seam.calls).toEqual([["files", true]]);
    expect(applyHidden([view("files")], new Set(), seam)).toBe(false);
  });

  it("never asks the host to unpin chat", () => {
    const seam = pins();
    applyHidden([view(FIXED_VIEW_ID)], new Set([FIXED_VIEW_ID]), seam);
    expect(seam.calls).toEqual([]);
  });
});

describe("createTabController", () => {
  it("applies a stored choice when the seam arrives, and follows a plugin that registers later", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const storage = memoryStorage(JSON.stringify(["wakatime"]));
    const controller = createTabController({ ledger: views, storage });
    const seam = pins();
    const stop = controller.start(seam);

    expect(seam.unpinned.getSnapshot()).toEqual(["wakatime"]);
    expect(controller.rows().map(row => [row.id, row.enabled])).toEqual([
      ["files", true],
      ["wakatime", false],
    ]);

    views.set([view("files", "文件"), view("wakatime", "WakaTime"), view("git", "Git")]);
    expect(controller.rows().map(row => row.id)).toEqual(["files", "wakatime", "git"]);
    // A newly registered view is shown: the preference only hides what it names.
    expect(seam.unpinned.getSnapshot()).toEqual(["wakatime"]);
    stop();
  });

  it("hides and restores a tab through the seam without touching the ledger", () => {
    const views = ledger([view("files", "文件"), view("wakatime", "WakaTime")]);
    const storage = memoryStorage();
    const controller = createTabController({ ledger: views, storage });
    const seam = pins();
    controller.start(seam);

    expect(controller.setEnabled("wakatime", false)).toBe(true);
    expect(seam.unpinned.getSnapshot()).toEqual(["wakatime"]);
    expect(views.entriesOfSlot(VIEW_SLOT).map(entry => entry.options.id)).toEqual(["files", "wakatime"]);
    expect(readHidden(storage)).toEqual(new Set(["wakatime"]));

    expect(controller.setEnabled("wakatime", true)).toBe(true);
    expect(seam.unpinned.getSnapshot()).toEqual([]);
    expect(readHidden(storage)).toEqual(new Set());
    // Repeating a choice that already holds changes nothing.
    expect(controller.setEnabled("wakatime", true)).toBe(false);
  });

  it("puts a tab back after the host unpins it on its own", () => {
    const views = ledger([view("files", "文件")]);
    const controller = createTabController({ ledger: views, storage: memoryStorage() });
    const seam = pins();
    controller.start(seam);
    seam.setPinned("files", false);
    expect(seam.unpinned.getSnapshot()).toEqual([]);
  });

  it("hides every named tab in one pass even though the seam notifies synchronously", () => {
    const views = ledger([view("files"), view("git"), view("wakatime")]);
    const controller = createTabController({
      ledger: views,
      storage: memoryStorage(JSON.stringify(["git", "wakatime"])),
    });
    const seam = pins();
    controller.start(seam);
    expect(new Set(seam.unpinned.getSnapshot())).toEqual(new Set(["git", "wakatime"]));
  });

  it("refuses to hide chat", () => {
    const views = ledger([view("chat", "对话"), view("files", "文件")]);
    const controller = createTabController({ ledger: views });
    expect(controller.setEnabled("chat", false)).toBe(false);
    expect(controller.rows().map(row => row.id)).toEqual(["files"]);
  });

  it("stops applying once the header generation is gone", () => {
    const views = ledger([view("files", "文件")]);
    const controller = createTabController({ ledger: views, storage: memoryStorage() });
    const seam = pins();
    const stop = controller.start(seam);
    stop();
    controller.setEnabled("files", false);
    expect(seam.calls).toEqual([]);
    // The choice itself is kept: the next header generation applies it.
    const next = pins();
    controller.start(next);
    expect(next.unpinned.getSnapshot()).toEqual(["files"]);
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
