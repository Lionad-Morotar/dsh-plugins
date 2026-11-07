/**
 * The focus hand-off between a chip click and the mounted panel.
 *
 * The store is module-level state, so every test clears it first: a request
 * left behind by one case would be consumed by the next one's mount and make
 * the failure look like a missing request rather than a leaked one.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearArchFocus,
  requestArchFocus,
  subscribeArchFocus,
  takeArchFocus,
} from "../src/client/focus-store.ts";
import { consumeArchFocus } from "../src/client/view.tsx";

beforeEach(() => {
  clearArchFocus();
});

describe("arch focus store", () => {
  it("hands one request to exactly one taker", () => {
    requestArchFocus("dshPlugins.jump.jumpApp");
    expect(takeArchFocus()).toBe("dshPlugins.jump.jumpApp");
    // A second consumer would move the diagram under a reader who has already
    // moved on, so the request is consumed rather than read.
    expect(takeArchFocus()).toBeUndefined();
  });

  it("keeps only the latest request", () => {
    requestArchFocus("a");
    requestArchFocus("b");
    expect(takeArchFocus()).toBe("b");
    expect(takeArchFocus()).toBeUndefined();
  });

  it("ignores an empty id instead of clearing a real one", () => {
    requestArchFocus("a");
    requestArchFocus("   ");
    expect(takeArchFocus()).toBe("a");
  });

  it("trims the id it was handed", () => {
    requestArchFocus("  dshPlugins.jump.jumpApp  ");
    expect(takeArchFocus()).toBe("dshPlugins.jump.jumpApp");
  });

  it("notifies every subscriber and stops after unsubscribe", () => {
    const first = vi.fn();
    const second = vi.fn();
    const off = subscribeArchFocus(first);
    subscribeArchFocus(second);
    requestArchFocus("a");
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    off();
    requestArchFocus("b");
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);
  });

  it("lets a subscriber take the request that woke it", () => {
    const seen: string[] = [];
    const off = subscribeArchFocus(() => {
      const id = takeArchFocus();
      if (id !== undefined) seen.push(id);
    });
    requestArchFocus("a");
    expect(seen).toEqual(["a"]);
    // The store is module-level, so a listener left behind would consume the
    // next case's request before its own consumer saw it.
    off();
  });

  it("drops a request the caller could not honour", () => {
    requestArchFocus("a");
    clearArchFocus();
    expect(takeArchFocus()).toBeUndefined();
  });
});

describe("consumeArchFocus", () => {
  it("hands the waiting id to the mounted chrome", () => {
    const focus = vi.fn();
    requestArchFocus("dshPlugins.jump.jumpApp");
    consumeArchFocus({ focus });
    expect(focus).toHaveBeenCalledWith("dshPlugins.jump.jumpApp");
    // Consumed, so a second mount does not replay it.
    expect(takeArchFocus()).toBeUndefined();
  });

  it("does nothing when no chrome has filled the seam in yet", () => {
    requestArchFocus("a");
    expect(() => {
      consumeArchFocus({});
    }).not.toThrow();
    // The request is spent either way: the view that could have used it is gone.
    expect(takeArchFocus()).toBeUndefined();
  });

  it("does nothing when nothing is waiting", () => {
    const focus = vi.fn();
    consumeArchFocus({ focus });
    expect(focus).not.toHaveBeenCalled();
  });
});
