import { describe, expect, it, vi } from "vitest";

import { createViewSwitcher, type ViewSwitcherElement } from "../src/client/view-switcher.ts";

interface Tab extends ViewSwitcherElement {
  readonly textContent: string;
}

/** A tab that records its own click. */
function tab(text: string, clicked: string[], id: string): Tab {
  return {
    textContent: text,
    getAttribute: () => null,
    click: () => clicked.push(id),
  };
}

describe("view switcher", () => {
  it("prefers a bound seam and leaves the DOM untouched", () => {
    const clicked: string[] = [];
    const opened: string[] = [];
    const switcher = createViewSwitcher({
      service: {
        open: (sessionId, id) => (opened.push(`${sessionId}:${id}`), true),
        showChat: () => true,
      },
      sessionId: "s1",
      doc: { querySelectorAll: () => [tab("文件", clicked, "fs")], querySelector: () => null },
    });

    expect(switcher.open("fs-explorer")).toBe(true);
    expect(opened).toEqual(["s1:fs-explorer"]);
    expect(clicked).toEqual([]);
  });

  it("clicks the host tab when the seam has no binding", () => {
    const clicked: string[] = [];
    const switcher = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: {
        querySelectorAll: () => [
          tab("对话", clicked, "chat"),
          tab("文件", clicked, "fs"),
          tab("Git", clicked, "git"),
        ],
        querySelector: () => null,
      },
    });

    expect(switcher.open("fs-explorer")).toBe(true);
    expect(clicked).toEqual(["fs"]);
    expect(switcher.open("git-explorer")).toBe(true);
    expect(clicked).toEqual(["fs", "git"]);
  });

  it("accepts an English tab label with surrounding whitespace", () => {
    const clicked: string[] = [];
    const switcher = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: {
        querySelectorAll: () => [tab("  Files\n", clicked, "fs")],
        querySelector: () => null,
      },
    });

    expect(switcher.open("fs-explorer")).toBe(true);
    expect(clicked).toEqual(["fs"]);
  });

  it("never clicks a partial match", () => {
    const clicked: string[] = [];
    const switcher = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: {
        querySelectorAll: () => [tab("文件树", clicked, "tree"), tab("文件预览", clicked, "preview")],
        querySelector: () => null,
      },
    });

    expect(switcher.open("fs-explorer")).toBe(false);
    expect(clicked).toEqual([]);
  });

  it("searches the tab-list container found through querySelector first", () => {
    const clicked: string[] = [];
    const container = {
      textContent: "",
      getAttribute: () => null,
      querySelectorAll: () => [tab("文件", clicked, "fs")],
    };
    const switcher = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: { querySelector: () => container, querySelectorAll: () => [] },
    });

    expect(switcher.open("fs-explorer")).toBe(true);
    expect(clicked).toEqual(["fs"]);
  });

  it("returns to chat through the seam or the chat tab", () => {
    const clicked: string[] = [];
    const viaSeam = createViewSwitcher({
      service: { open: () => false, showChat: () => true },
      sessionId: "s1",
      doc: { querySelectorAll: () => [tab("对话", clicked, "chat")], querySelector: () => null },
    });
    expect(viaSeam.showChat()).toBe(true);
    expect(clicked).toEqual([]);

    const viaDom = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: { querySelectorAll: () => [tab("对话", clicked, "chat")], querySelector: () => null },
    });
    expect(viaDom.showChat()).toBe(true);
    expect(clicked).toEqual(["chat"]);
  });

  it("answers false without a document and for an unknown view", () => {
    const switcher = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
    });
    expect(switcher.open("fs-explorer")).toBe(false);
    expect(switcher.showChat()).toBe(false);
  });

  it("reports only the tab-click path to onChatShown, so focus is handed back once", () => {
    const viaSeam = vi.fn();
    const seam = createViewSwitcher({
      service: { open: () => false, showChat: () => true },
      sessionId: "s1",
      doc: { querySelectorAll: () => [tab("对话", [], "chat")], querySelector: () => null },
      onChatShown: viaSeam,
    });
    expect(seam.showChat()).toBe(true);
    // The seam publishes its own success; reporting here would focus twice.
    expect(viaSeam).not.toHaveBeenCalled();

    const viaDom = vi.fn();
    const dom = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: { querySelectorAll: () => [tab("对话", [], "chat")], querySelector: () => null },
      onChatShown: viaDom,
    });
    expect(dom.showChat()).toBe(true);
    expect(viaDom).toHaveBeenCalledTimes(1);

    const missing = vi.fn();
    const nowhere = createViewSwitcher({
      service: { open: () => false, showChat: () => false },
      sessionId: "s1",
      doc: { querySelectorAll: () => [], querySelector: () => null },
      onChatShown: missing,
    });
    expect(nowhere.showChat()).toBe(false);
    expect(missing).not.toHaveBeenCalled();
  });

  it("opens a view without reporting a chat return", () => {
    const seen = vi.fn();
    const switcher = createViewSwitcher({
      service: { open: () => true, showChat: () => false },
      sessionId: "s1",
      onChatShown: seen,
    });
    expect(switcher.open("git-explorer")).toBe(true);
    expect(seen).not.toHaveBeenCalled();
  });
});
