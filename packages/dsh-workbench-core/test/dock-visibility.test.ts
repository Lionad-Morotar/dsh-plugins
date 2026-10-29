import { describe, expect, it } from "vitest";

import { createDockVisibility } from "../src/client/dock-visibility.ts";

describe("dock visibility store", () => {
  it("starts with the given value and flips through toggle", () => {
    const store = createDockVisibility(true);
    expect(store.get()).toBe(true);
    store.toggle();
    expect(store.get()).toBe(false);
    store.toggle();
    expect(store.get()).toBe(true);
  });

  it("notifies subscribers once per accepted transition", () => {
    const store = createDockVisibility(true);
    const seen: boolean[] = [];
    const off = store.subscribe(visible => seen.push(visible));
    store.set(false);
    store.set(false);
    store.set(true);
    expect(seen).toEqual([false, true]);
    off();
    store.set(false);
    expect(seen).toEqual([false, true]);
  });

  it("lets a listener unsubscribe while being notified", () => {
    const store = createDockVisibility(true);
    const seen: boolean[] = [];
    const off = store.subscribe(visible => {
      seen.push(visible);
      off();
    });
    store.set(false);
    store.set(true);
    expect(seen).toEqual([false]);
  });
});
