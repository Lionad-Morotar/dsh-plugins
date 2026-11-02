import { describe, expect, it, vi } from "vitest";

import {
  createViewDigitKeyRouter,
  createViewDigitPreference,
  installViewDigitKeyRouter,
  VIEW_DIGIT_COMMANDS,
  VIEW_DIGIT_COUNT,
  VIEW_DIGIT_STORAGE_KEY,
  VIEW_LAST_COMMAND,
  VIEW_TAB_COMMANDS,
  viewDigitChord,
  viewDigitCommandId,
  viewDigitIndexFromCode,
  type ViewDigitKeyEvent,
} from "../src/client/view-digits.ts";
import {
  listViewTabs,
  switchToLastViewTab,
  switchToViewTab,
  type ViewSwitcherDocument,
  type ViewSwitcherElement,
} from "../src/client/view-switcher.ts";

/** A storage that keeps its document in memory and records writes. */
function memoryStorage(seed?: string) {
  const entries = new Map<string, string>();
  if (seed !== undefined) entries.set(VIEW_DIGIT_STORAGE_KEY, seed);
  return {
    getItem: (key: string): string | null => entries.get(key) ?? null,
    setItem: (key: string, value: string): void => void entries.set(key, value),
    removeItem: (key: string): void => void entries.delete(key),
    /** The raw persisted document, or undefined when nothing was written. */
    raw: (): string | undefined => entries.get(VIEW_DIGIT_STORAGE_KEY),
  };
}

interface Tab extends ViewSwitcherElement {
  readonly textContent: string;
}

/** One tab that records its own click into the shared log. */
function tab(text: string, clicked: string[]): Tab {
  return { textContent: text, getAttribute: () => null, click: () => clicked.push(text) };
}

/** A document whose tab strip lists the given labels in order. */
function documentWith(labels: readonly string[], clicked: string[]): ViewSwitcherDocument {
  const tabs = labels.map(label => tab(label, clicked));
  return {
    querySelector: () => ({ querySelectorAll: () => tabs }),
    querySelectorAll: () => tabs,
  };
}

describe("view digit preference", () => {
  it("ships enabled and answers the default without storage", () => {
    const preference = createViewDigitPreference();
    expect(preference.get()).toBe(true);
  });

  it("persists a change and restores it on the next mount", () => {
    const storage = memoryStorage();
    const preference = createViewDigitPreference({ storage });
    preference.set(false);

    expect(JSON.parse(storage.raw() ?? "null")).toEqual({ enabled: false });
    expect(createViewDigitPreference({ storage }).get()).toBe(false);
  });

  it("treats a corrupt or foreign document as the default", () => {
    expect(createViewDigitPreference({ storage: memoryStorage("{not json") }).get()).toBe(true);
    expect(createViewDigitPreference({ storage: memoryStorage(JSON.stringify({ enabled: "no" })) }).get()).toBe(true);
    expect(createViewDigitPreference({ storage: memoryStorage(JSON.stringify({ other: 1 })) }).get()).toBe(true);
  });

  it("survives a storage that throws on read or write", () => {
    const hostile = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };
    const preference = createViewDigitPreference({ storage: hostile });
    expect(preference.get()).toBe(true);
    expect(() => preference.set(false)).not.toThrow();
    expect(preference.get()).toBe(false);
  });

  it("notifies only on a real transition and stops after unsubscribe", () => {
    const preference = createViewDigitPreference({ storage: memoryStorage() });
    const seen: boolean[] = [];
    const off = preference.subscribe(enabled => seen.push(enabled));

    preference.set(true);
    expect(seen).toEqual([]);

    preference.toggle();
    expect(seen).toEqual([false]);
    off();
    preference.toggle();
    expect(seen).toEqual([false]);
    expect(preference.get()).toBe(true);
  });
});

describe("view digit table", () => {
  it("declares nine digits, each bound to its own primary+Digit code", () => {
    expect(VIEW_DIGIT_COMMANDS).toHaveLength(VIEW_DIGIT_COUNT);
    expect(VIEW_DIGIT_COMMANDS.map(command => command.desktop.code)).toEqual([
      "Digit1",
      "Digit2",
      "Digit3",
      "Digit4",
      "Digit5",
      "Digit6",
      "Digit7",
      "Digit8",
      "Digit9",
    ]);
    for (const command of VIEW_DIGIT_COMMANDS) {
      expect(command.desktop.modifiers).toEqual(["primary"]);
      expect(command.id).toBe(viewDigitCommandId(command.index));
    }
    expect(viewDigitCommandId(3)).toBe("workbench.view.digit3");
    expect(VIEW_TAB_COMMANDS).toEqual([...VIEW_DIGIT_COMMANDS, VIEW_LAST_COMMAND]);
    expect(VIEW_LAST_COMMAND).toMatchObject({
      index: 0,
      id: "workbench.view.last",
      labelKey: "keymap.viewLast",
      desktop: { code: "Digit0", modifiers: ["primary"] },
    });
  });

  it("prints the chord the runtime actually delivers", () => {
    expect(viewDigitChord("desktop", "macos")).toBe("⌘");
    expect(viewDigitChord("desktop", "other")).toBe("Ctrl");
    expect(viewDigitChord("web", "macos")).toBe("⌥");
    expect(viewDigitChord("web", "other")).toBe("Alt");
  });

  it("reads a position from Digit1–9 and the last-tab sentinel from Digit0", () => {
    expect(viewDigitIndexFromCode("Digit1")).toBe(1);
    expect(viewDigitIndexFromCode("Digit9")).toBe(9);
    expect(viewDigitIndexFromCode("Digit0")).toBe(0);
    expect(viewDigitIndexFromCode("Key1")).toBeNull();
    expect(viewDigitIndexFromCode("Numpad0")).toBeNull();
    expect(viewDigitIndexFromCode("Numpad1")).toBeNull();
    expect(viewDigitIndexFromCode(undefined)).toBeNull();
  });
});

describe("switching by tab index", () => {
  it("lists the host tabs in visible order", () => {
    const clicked: string[] = [];
    expect(listViewTabs(documentWith(["对话", "轨迹", "文件", "Git"], clicked)).map(entry => entry.textContent)).toEqual([
      "对话",
      "轨迹",
      "文件",
      "Git",
    ]);
  });

  it("clicks the 1-based tab the digit addresses", () => {
    const clicked: string[] = [];
    const doc = documentWith(["对话", "轨迹", "文件", "Git"], clicked);

    expect(switchToViewTab(doc, 1)).toBe(true);
    expect(switchToViewTab(doc, 3)).toBe(true);
    expect(clicked).toEqual(["对话", "文件"]);
  });

  it("refuses an index past the last tab instead of wrapping", () => {
    const clicked: string[] = [];
    const doc = documentWith(["对话", "轨迹"], clicked);
    expect(switchToViewTab(doc, 3)).toBe(false);
    expect(switchToViewTab(doc, 0)).toBe(false);
    expect(clicked).toEqual([]);
  });

  it("clicks the last visible tab, including when that tab is not the ninth", () => {
    const clicked: string[] = [];
    expect(switchToLastViewTab(documentWith(["对话", "轨迹", "文件", "Git"], clicked))).toBe(true);
    expect(clicked).toEqual(["Git"]);
    expect(switchToLastViewTab(documentWith(["对话"], clicked))).toBe(true);
    expect(clicked).toEqual(["Git", "对话"]);
  });

  it("answers false for the last tab when the strip is empty or missing", () => {
    const clicked: string[] = [];
    expect(switchToLastViewTab(documentWith([], clicked))).toBe(false);
    expect(switchToLastViewTab(undefined)).toBe(false);
    expect(switchToLastViewTab({ querySelector: () => null, querySelectorAll: () => [] })).toBe(false);
    expect(clicked).toEqual([]);
  });

  it("answers false without a document or without a tab strip", () => {
    expect(switchToViewTab(undefined, 1)).toBe(false);
    expect(switchToViewTab({ querySelector: () => null, querySelectorAll: () => [] }, 1)).toBe(false);
  });
});

describe("web digit router", () => {
  /** A complete alt+digit event; tests override only the field under scrutiny. */
  function altDigit(index: number, overrides: Partial<ViewDigitKeyEvent> = {}): ViewDigitKeyEvent {
    return {
      code: `Digit${index}`,
      altKey: true,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      defaultPrevented: false,
      preventDefault: () => {},
      ...overrides,
    };
  }

  function router(options: { enabled?: boolean; tabs?: number } = {}) {
    const switched: number[] = [];
    const count = options.tabs ?? 4;
    const instance = createViewDigitKeyRouter({
      isEnabled: () => options.enabled ?? true,
      switchTab: index => {
        if (index > count) return false;
        switched.push(index);
        return true;
      },
    });
    return { instance, switched };
  }

  it("switches on alt+digit and consumes the event", () => {
    const { instance, switched } = router();
    const preventDefault = vi.fn();
    expect(instance.handle(altDigit(3, { preventDefault }))).toBe(true);
    expect(switched).toEqual([3]);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("stays out of the way while the toggle is off", () => {
    const { instance, switched } = router({ enabled: false });
    const preventDefault = vi.fn();
    expect(instance.handle(altDigit(2, { preventDefault }))).toBe(false);
    expect(switched).toEqual([]);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("switches to the last tab on alt+0 and consumes the event", () => {
    const { instance, switched } = router();
    const preventDefault = vi.fn();
    expect(instance.handle(altDigit(0, { preventDefault }))).toBe(true);
    expect(switched).toEqual([0]);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("rejects every other modifier and keys that are not number-row digits", () => {
    const { instance, switched } = router();
    const misses: Array<Partial<ViewDigitKeyEvent>> = [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: false },
      { code: "Numpad0" },
      { code: "Key1" },
      { code: undefined },
      { defaultPrevented: true },
    ];
    for (const miss of misses) {
      const preventDefault = vi.fn();
      expect(instance.handle(altDigit(2, { ...miss, preventDefault }))).toBe(false);
      expect(preventDefault).not.toHaveBeenCalled();
    }
    expect(switched).toEqual([]);
  });

  it("lets an index the tab strip cannot satisfy pass through", () => {
    const { instance } = router({ tabs: 2 });
    const preventDefault = vi.fn();
    expect(instance.handle(altDigit(5, { preventDefault }))).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("stops handling after dispose", () => {
    const { instance, switched } = router();
    instance.dispose();
    expect(instance.handle(altDigit(1))).toBe(false);
    expect(switched).toEqual([]);
  });

  it("installs a capture-phase listener on web only", () => {
    const listeners: Array<{ listener: (event: KeyboardEvent) => void; capture: boolean | undefined }> = [];
    const target = {
      addEventListener(_type: "keydown", listener: (event: KeyboardEvent) => void, capture?: boolean) {
        listeners.push({ listener, capture });
      },
      removeEventListener(_type: "keydown", listener: (event: KeyboardEvent) => void, capture?: boolean) {
        const index = listeners.findIndex(entry => entry.listener === listener && entry.capture === capture);
        if (index >= 0) listeners.splice(index, 1);
      },
    };
    const switched: number[] = [];
    const options = { isEnabled: () => true, switchTab: (index: number) => (switched.push(index), true) };

    const offDesktop = installViewDigitKeyRouter({ runtime: "desktop", ...options, target });
    expect(listeners).toHaveLength(0);
    offDesktop();

    const offWeb = installViewDigitKeyRouter({ runtime: "web", ...options, target });
    expect(listeners).toHaveLength(1);
    expect(listeners[0]?.capture).toBe(true);
    listeners[0]?.listener({ code: "Digit2", altKey: true, preventDefault: () => {} } as KeyboardEvent);
    expect(switched).toEqual([2]);

    offWeb();
    expect(listeners).toHaveLength(0);
  });
});
