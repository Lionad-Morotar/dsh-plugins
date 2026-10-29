import { describe, expect, it, vi } from "vitest";

import {
  createGlobalKeyRouter,
  GLOBAL_KEY_ROUTES,
  installGlobalKeyRouter,
  isWebShortcutRuntime,
  type GlobalKeyEvent,
} from "../src/client/shortcut-router.ts";

/** A complete event; tests override only the field under scrutiny. */
function keyEvent(overrides: Partial<GlobalKeyEvent> = {}): GlobalKeyEvent {
  return {
    code: "KeyE",
    ctrlKey: true,
    shiftKey: true,
    metaKey: false,
    altKey: false,
    defaultPrevented: false,
    preventDefault: () => {},
    ...overrides,
  };
}

describe("global key router", () => {
  it("routes the three host-refused chords to their commands", () => {
    const fired: string[] = [];
    const router = createGlobalKeyRouter({ run: id => fired.push(id) });
    for (const route of GLOBAL_KEY_ROUTES) {
      fired.length = 0;
      expect(router.handle(keyEvent({ code: route.code }))).toBe(true);
      expect(fired).toEqual([route.commandId]);
    }
  });

  it("does not claim an event the page already handled", () => {
    const preventDefault = vi.fn();
    const router = createGlobalKeyRouter({ run: () => {} });
    expect(router.handle(keyEvent({ defaultPrevented: true, preventDefault }))).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("requires Ctrl and Shift and rejects every extra modifier", () => {
    const router = createGlobalKeyRouter({ run: () => {} });
    const misses: Array<Partial<GlobalKeyEvent>> = [
      { ctrlKey: false },
      { shiftKey: false },
      { metaKey: true },
      { altKey: true },
      { code: "KeyP" },
      { code: undefined },
    ];
    for (const miss of misses) {
      const preventDefault = vi.fn();
      expect(router.handle(keyEvent({ ...miss, preventDefault }))).toBe(false);
      expect(preventDefault).not.toHaveBeenCalled();
    }
  });

  it("prevents the browser default only after a chord matched", () => {
    const preventDefault = vi.fn();
    const router = createGlobalKeyRouter({ run: () => {} });
    expect(router.handle(keyEvent({ code: "KeyQ", preventDefault }))).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(router.handle(keyEvent({ code: "KeyG", preventDefault }))).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("stops handling after dispose", () => {
    const fired: string[] = [];
    const router = createGlobalKeyRouter({ run: id => fired.push(id) });
    router.dispose();
    expect(router.handle(keyEvent())).toBe(false);
    expect(fired).toEqual([]);
  });
});

describe("web-only installation", () => {
  function fakeTarget() {
    const listeners: Array<{ type: string; listener: (event: KeyboardEvent) => void; capture: boolean | undefined }> = [];
    return {
      listeners,
      target: {
        addEventListener(type: "keydown", listener: (event: KeyboardEvent) => void, capture?: boolean) {
          listeners.push({ type, listener, capture });
        },
        removeEventListener(type: "keydown", listener: (event: KeyboardEvent) => void, capture?: boolean) {
          const index = listeners.findIndex(entry => entry.type === type && entry.listener === listener && entry.capture === capture);
          if (index >= 0) listeners.splice(index, 1);
        },
      },
    };
  }

  it("treats only the web runtime as web", () => {
    expect(isWebShortcutRuntime({ runtime: "web" })).toBe(true);
    expect(isWebShortcutRuntime({ runtime: "desktop" })).toBe(false);
    expect(isWebShortcutRuntime(undefined)).toBe(false);
  });

  it("attaches a capture-phase listener on web and removes it on dispose", () => {
    const { target, listeners } = fakeTarget();
    const fired: string[] = [];
    const dispose = installGlobalKeyRouter({ runtime: "web", run: id => fired.push(id), target });
    expect(listeners).toHaveLength(1);
    expect(listeners[0]).toMatchObject({ type: "keydown", capture: true });

    listeners[0]?.listener({ ctrlKey: true, shiftKey: true, code: "KeyM", preventDefault: () => {} } as KeyboardEvent);
    expect(fired).toEqual(["workbench.term.toggle"]);

    dispose();
    expect(listeners).toHaveLength(0);
  });

  it("never installs on desktop", () => {
    const { target, listeners } = fakeTarget();
    const dispose = installGlobalKeyRouter({ runtime: "desktop", run: () => {}, target });
    expect(listeners).toHaveLength(0);
    expect(() => dispose()).not.toThrow();
  });
});
