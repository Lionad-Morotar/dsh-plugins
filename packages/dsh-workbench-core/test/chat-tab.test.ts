import { describe, expect, it, vi } from "vitest";

import {
  CHAT_TAB_LABELS,
  installChatTabFocus,
  isChatTabClick,
  type ChatTabClickTarget,
  type ChatTabElement,
} from "../src/client/chat-tab.ts";

/** A node whose `closest` walks the chain built for it. */
function node(
  options: { text?: string; ariaLabel?: string; role?: string; row?: boolean } = {},
): ChatTabElement & { closest(selector: string): ChatTabElement | null } {
  const self: ChatTabElement & { closest(selector: string): ChatTabElement | null } = {
    textContent: options.text ?? "",
    getAttribute(name: string): string | null {
      return name === "aria-label" ? (options.ariaLabel ?? null) : null;
    },
    closest(selector: string): ChatTabElement | null {
      if (selector.includes("role=\"tab\"")) return options.role === "tab" ? self : null;
      if (selector === "[data-conversation-tabs]") return options.row === true ? self : null;
      return null;
    },
  };
  return self;
}

/** A click that landed on one node. */
function clickOn(target: unknown): { target: unknown } {
  return { target };
}

/** A window-like click target that records what it was given. */
function fakeTarget(): ChatTabClickTarget & {
  fire(event: unknown): void;
  readonly listeners: number;
} {
  let listener: ((event: MouseEvent) => void) | undefined;
  return {
    get listeners(): number {
      return listener === undefined ? 0 : 1;
    },
    addEventListener(_type: "click", next: (event: MouseEvent) => void, capture?: boolean): void {
      expect(capture).toBe(true);
      listener = next;
    },
    removeEventListener(_type: "click", current: (event: MouseEvent) => void, capture?: boolean): void {
      expect(capture).toBe(true);
      if (listener === current) listener = undefined;
    },
    fire(event: unknown): void {
      listener?.(event as MouseEvent);
    },
  };
}

describe("isChatTabClick", () => {
  it("accepts the host chat tab and nothing beside it", () => {
    const chat = node({ text: "对话", role: "tab", row: true });
    expect(isChatTabClick(clickOn(chat))).toBe(true);

    const files = node({ text: "文件", role: "tab", row: true });
    expect(isChatTabClick(clickOn(files))).toBe(false);
  });

  it("rejects a same-named control outside the host tab row", () => {
    const stray = node({ text: "对话", role: "tab", row: false });
    expect(isChatTabClick(clickOn(stray))).toBe(false);
  });

  it("rejects a click that did not land inside a tab", () => {
    const plain = node({ text: "对话", role: "button", row: true });
    expect(isChatTabClick(clickOn(plain))).toBe(false);
    expect(isChatTabClick(clickOn(node({ text: "对话", role: "tab" })))).toBe(false);
  });

  it("tolerates a missing event or target", () => {
    expect(isChatTabClick(undefined)).toBe(false);
    expect(isChatTabClick(clickOn(undefined))).toBe(false);
    expect(isChatTabClick(clickOn({} as ChatTabElement))).toBe(false);
  });

  it("matches both locales plus a label attribute the way the host paints them", () => {
    expect(isChatTabClick(clickOn(node({ text: "Chat", role: "tab", row: true })))).toBe(true);
    expect(isChatTabClick(clickOn(node({ ariaLabel: "对话", role: "tab", row: true })))).toBe(true);
    expect(isChatTabClick(clickOn(node({ text: "  对话  ", role: "tab", row: true })))).toBe(true);
    expect(CHAT_TAB_LABELS).toContain("对话");
  });
});

describe("installChatTabFocus", () => {
  it("takes the click in the capture phase and answers only for the chat tab", () => {
    const target = fakeTarget();
    const onChatTab = vi.fn();
    installChatTabFocus({ onChatTab, target });
    expect(target.listeners).toBe(1);

    target.fire(clickOn(node({ text: "文件", role: "tab", row: true })));
    expect(onChatTab).not.toHaveBeenCalled();

    target.fire(clickOn(node({ text: "对话", role: "tab", row: true })));
    expect(onChatTab).toHaveBeenCalledTimes(1);
  });

  it("detaches once and stays quiet afterwards", () => {
    const target = fakeTarget();
    const onChatTab = vi.fn();
    const dispose = installChatTabFocus({ onChatTab, target });
    dispose();
    expect(target.listeners).toBe(0);

    target.fire(clickOn(node({ text: "对话", role: "tab", row: true })));
    expect(onChatTab).not.toHaveBeenCalled();

    dispose();
    expect(target.listeners).toBe(0);
  });

  it("is a no-op without a window, so the Node tests never need a DOM", () => {
    const onChatTab = vi.fn();
    const dispose = installChatTabFocus({ onChatTab });
    expect(typeof dispose).toBe("function");
    expect(() => dispose()).not.toThrow();
    expect(onChatTab).not.toHaveBeenCalled();
  });
});
