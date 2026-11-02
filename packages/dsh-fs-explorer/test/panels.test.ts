import { describe, expect, it, vi } from "vitest";

import { tabLabel } from "../src/client/copy.ts";
import { KEYMAP, createEscapeHandler, focusNearestComposer, hasOpenModal, isEditableTarget, matchesKeymap } from "../src/client/keyboard.ts";
import { consumeViewRequest, createPanelStack, createPanelStackRegistry, panelTitle } from "../src/client/panels.ts";

function fakeDocument(found: unknown) {
  return {
    querySelector: (selector: string) => (selector === "[data-composer-input]" ? found : null),
  };
}

describe("panel stack", () => {
  it("opens, dedupes and activates in one gesture", () => {
    const stack = createPanelStack();
    stack.open("a.ts");
    stack.open("b.ts");
    stack.open("a.ts");

    const snapshot = stack.snapshot();
    expect(snapshot.panels.map(panel => panel.path)).toEqual(["a.ts", "b.ts"]);
    expect(snapshot.active).toBe("a.ts");
    expect(stack.activeEntry()?.path).toBe("a.ts");
    expect(stack.isOpen("b.ts")).toBe(true);
  });

  it("keeps a tab beside its neighbour when the active one closes", () => {
    const stack = createPanelStack();
    stack.open("a.ts");
    stack.open("b.ts");
    stack.open("c.ts");
    stack.activate("b.ts");
    stack.close();
    expect(stack.snapshot().active).toBe("c.ts");
    stack.close("a.ts");
    expect(stack.snapshot().active).toBe("c.ts");
    stack.close("c.ts");
    expect(stack.snapshot()).toEqual({ panels: [], active: null });
  });

  it("walks the strip with wrap-around", () => {
    const stack = createPanelStack();
    stack.open("a.ts");
    stack.open("b.ts");
    stack.next();
    expect(stack.snapshot().active).toBe("a.ts");
    stack.previous();
    expect(stack.snapshot().active).toBe("b.ts");
  });

  it("publishes only on changes and resets on a session switch", () => {
    const stack = createPanelStack();
    const listener = vi.fn();
    stack.subscribe(listener);
    stack.open("a.ts");
    expect(listener).toHaveBeenCalledTimes(1);
    stack.activate("a.ts");
    expect(listener).toHaveBeenCalledTimes(1);
    stack.reset();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(stack.snapshot().active).toBeNull();
  });

  it("renders the basename as the tab caption", () => {
    expect(panelTitle("src/client/view.tsx")).toBe("view.tsx");
    expect(panelTitle("README.md")).toBe("README.md");
    expect(panelTitle("/Users/x/project/a.ts")).toBe("a.ts");
  });

  it("keeps an absolute path absolute and apart from its relative twin", () => {
    const stack = createPanelStack();
    stack.open("/Users/x/project/a.ts", 4, true);
    stack.open("Users/x/project/a.ts", 1);

    const panels = stack.snapshot().panels;
    expect(panels.map(panel => panel.path)).toEqual(["/Users/x/project/a.ts", "Users/x/project/a.ts"]);
    expect(panels[0]?.absolute).toBe(true);
    expect(panels[1]?.absolute).toBe(false);

    // Activating and closing go through the stored key, not a re-normalized one.
    stack.activate("/Users/x/project/a.ts");
    expect(stack.snapshot().active).toBe("/Users/x/project/a.ts");
    expect(stack.isOpen("/Users/x/project/a.ts")).toBe(true);
    stack.close("/Users/x/project/a.ts");
    expect(stack.isOpen("Users/x/project/a.ts")).toBe(true);
    // With the absolute row gone, the same spelling now falls through to the
    // workspace row of that name. A leading slash alone does not say which of
    // the two the caller means, so the ledger resolves it in the documented
    // order: the exact key first, the relative reading second.
    expect(stack.isOpen("/Users/x/project/a.ts")).toBe(true);
    stack.close("/Users/x/project/a.ts");
    expect(stack.snapshot().panels).toHaveLength(0);
  });

  it("finds a workspace panel through a path spelled with a leading slash", () => {
    const stack = createPanelStack();
    stack.open("src/a.ts");

    // A caller that only has a leading-slash spelling (a URL path, a link the
    // host did not tag as absolute) still reaches the workspace row.
    expect(stack.isOpen("/src/a.ts")).toBe(true);
    stack.activate("/src/a.ts");
    expect(stack.snapshot().active).toBe("src/a.ts");
    stack.close("/src/a.ts");
    expect(stack.isOpen("src/a.ts")).toBe(false);
    expect(stack.snapshot().panels).toHaveLength(0);
  });

  it("prefers the absolute row when both readings are open", () => {
    const stack = createPanelStack();
    stack.open("src/a.ts");
    stack.open("/src/a.ts", 9, true);

    stack.activate("/src/a.ts");
    expect(stack.snapshot().active).toBe("/src/a.ts");
    stack.close("/src/a.ts");
    expect(stack.isOpen("src/a.ts")).toBe(true);
  });

  it("keeps one stack per conversation", () => {
    const registry = createPanelStackRegistry();
    const first = registry.forSession("session-a");
    first.open("a.ts");
    expect(registry.forSession("session-a")).toBe(first);
    expect(registry.forSession("session-a").snapshot().active).toBe("a.ts");
    expect(registry.forSession("session-b")).not.toBe(first);
    expect(registry.forSession("session-b").snapshot().panels).toHaveLength(0);
    expect(registry.forSession(undefined)).toBe(registry.forSession(undefined));
  });

  it("keys a revision panel by the (revision, path) pair", () => {
    const stack = createPanelStack();
    stack.open("package.json", 1, false, "17b6a55");
    stack.open("package.json", 1, false, "26d4fd0");
    stack.open("package.json");

    const snapshot = stack.snapshot();
    // Two commit versions and the working-tree file are three panels.
    expect(snapshot.panels.map(panel => [panel.path, panel.revision])).toEqual([
      ["package.json", "17b6a55"],
      ["package.json", "26d4fd0"],
      ["package.json", undefined],
    ]);
    expect(snapshot.panels.map(panel => panel.key)).toEqual([
      "git:17b6a55:package.json",
      "git:26d4fd0:package.json",
      "package.json",
    ]);
    expect(snapshot.active).toBe("package.json");

    // Activation and closing address the panel by its key, so the two commit
    // versions of one path never collapse into each other.
    stack.activate("git:17b6a55:package.json");
    expect(stack.snapshot().active).toBe("git:17b6a55:package.json");
    stack.close("git:17b6a55:package.json");
    expect(stack.snapshot().panels.map(panel => panel.key)).toEqual([
      "git:26d4fd0:package.json",
      "package.json",
    ]);
    expect(stack.snapshot().active).toBe("git:26d4fd0:package.json");
  });

  it("dedupes a revision panel and updates its line, not its identity", () => {
    const stack = createPanelStack();
    stack.open("a.ts", 3, false, "ABC1234");
    stack.open("a.ts", 9, false, "abc1234");
    const snapshot = stack.snapshot();
    expect(snapshot.panels).toHaveLength(1);
    expect(snapshot.panels[0]).toMatchObject({ key: "git:abc1234:a.ts", line: 9, revision: "abc1234" });
  });

  it("leaves revision panels out of path-addressed lookups", () => {
    const stack = createPanelStack();
    stack.open("src/a.ts", 1, false, "17b6a55");
    // A path spelling reaches the working-tree row only; the commit version of
    // the same path is another panel and stays open.
    expect(stack.isOpen("src/a.ts")).toBe(false);
    expect(stack.isOpen("git:17b6a55:src/a.ts")).toBe(true);
    stack.open("src/a.ts");
    expect(stack.snapshot().panels).toHaveLength(2);
    stack.close("src/a.ts");
    expect(stack.snapshot().panels.map(panel => panel.key)).toEqual(["git:17b6a55:src/a.ts"]);
  });
});

describe("view requests", () => {
  it("parses path:...:line and opens the panel", () => {
    const opened: Array<[string, number, boolean]> = [];
    const result = consumeViewRequest("path:src/a b.ts:42", {
      open: (path, line, absolute) => opened.push([path, line, absolute]),
    });
    expect(result).toBe(true);
    expect(opened).toEqual([["src/a b.ts", 42, false]]);
  });

  it("hands an absolute target over without touching its leading slash", () => {
    const opened: Array<[string, number, boolean]> = [];
    consumeViewRequest("abs:/Users/x/project/a.ts:7", {
      open: (path, line, absolute) => opened.push([path, line, absolute]),
    });
    expect(opened).toEqual([["/Users/x/project/a.ts", 7, true]]);
  });

  it("hands a git target over with its revision", () => {
    const opened: Array<[string, number, boolean, string | undefined]> = [];
    const result = consumeViewRequest("git:17b6a55:12:src/a b.ts", {
      open: (path, line, absolute, revision) => opened.push([path, line, absolute, revision]),
    });
    expect(result).toBe(true);
    expect(opened).toEqual([["src/a b.ts", 12, false, "17b6a55"]]);
  });

  it("leaves other focus payloads alone", () => {
    const open = vi.fn();
    expect(consumeViewRequest("", { open })).toBe(false);
    expect(consumeViewRequest("symbol:foo", { open })).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });
});

describe("keymap", () => {
  it("never claims a single-modifier Command+O", () => {
    for (const entry of KEYMAP) {
      const singleModifierO = entry.code === "KeyO" && entry.modifiers.length === 1;
      expect(singleModifierO).toBe(false);
    }
  });

  it("declares next, previous and close chords", () => {
    expect(KEYMAP.map(entry => entry.code)).toEqual(["ArrowDown", "ArrowUp", "KeyW"]);
    expect(KEYMAP.find(entry => entry.code === "KeyW")?.modifiers).toEqual(["control"]);
  });

  it("matches exactly, including the platform primary modifier", () => {
    const next = KEYMAP[0];
    const previous = KEYMAP[1];
    const close = KEYMAP[2];
    expect(next).toBeDefined();
    expect(previous).toBeDefined();
    expect(close).toBeDefined();
    if (next === undefined || previous === undefined || close === undefined) return;

    expect(matchesKeymap({ code: "ArrowDown", metaKey: true, altKey: true }, next, "mac")).toBe(true);
    expect(matchesKeymap({ code: "ArrowDown", ctrlKey: true, altKey: true }, next, "other")).toBe(true);
    expect(matchesKeymap({ code: "ArrowDown", metaKey: true, altKey: true, shiftKey: true }, next, "mac")).toBe(false);
    expect(matchesKeymap({ code: "ArrowDown", ctrlKey: true, altKey: true }, next, "mac")).toBe(false);
    expect(matchesKeymap({ code: "KeyW", ctrlKey: true }, close, "mac")).toBe(true);
    expect(matchesKeymap({ code: "KeyW", metaKey: true }, close, "mac")).toBe(false);
    expect(matchesKeymap({ code: "KeyW", ctrlKey: true, isComposing: true }, close, "mac")).toBe(false);
  });

  it("recognizes text fields so a chord never shadows typing", () => {
    expect(isEditableTarget({ tagName: "INPUT" })).toBe(true);
    expect(isEditableTarget({ tagName: "textarea" })).toBe(true);
    expect(isEditableTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
    expect(isEditableTarget({ tagName: "BUTTON" })).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget("#document")).toBe(false);
  });
});

describe("escape handler", () => {
  it("consumes Escape and focuses the composer when no dialog is open", () => {
    const focusComposer = vi.fn();
    const handler = createEscapeHandler({ focusComposer, hasModal: () => false });
    const event = { key: "Escape", defaultPrevented: false, preventDefault: vi.fn(), stopPropagation: vi.fn() };

    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(focusComposer).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });

  it("lets a dialog own Escape untouched", () => {
    const handler = createEscapeHandler({ focusComposer: vi.fn(), hasModal: () => true });
    const event = { key: "Escape", defaultPrevented: false, preventDefault: vi.fn(), stopPropagation: vi.fn() };

    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("does not fight a handler that already consumed the key", () => {
    const focusComposer = vi.fn();
    const handler = createEscapeHandler({ focusComposer, hasModal: () => false });
    const event = { key: "Escape", defaultPrevented: true, preventDefault: vi.fn(), stopPropagation: vi.fn() };

    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(focusComposer).not.toHaveBeenCalled();
  });

  it("falls back to the nearest composer input and still prevents default", () => {
    const focus = vi.fn();
    const doc = fakeDocument({ focus });
    const handler = createEscapeHandler({ focusComposer: () => false, hasModal: () => false, doc });
    const event = { key: "Escape", defaultPrevented: false, preventDefault: vi.fn(), stopPropagation: vi.fn() };

    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(focusNearestComposer(doc)).toBe(true);
  });

  it("detects the dialog markers the shell and the palette use", () => {
    expect(hasOpenModal(undefined)).toBe(false);
    expect(hasOpenModal({ querySelector: () => null })).toBe(false);
    expect(hasOpenModal({ querySelector: () => ({}) })).toBe(true);
  });
});

describe("tab label", () => {
  it("follows the host locale", () => {
    expect(tabLabel("zh")).toBe("文件");
    expect(tabLabel("zh-CN")).toBe("文件");
    expect(tabLabel("en")).toBe("Files");
    expect(tabLabel(undefined)).toBe("Files");
  });
});
