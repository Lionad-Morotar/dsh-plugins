import { describe, expect, it } from "vitest";

import { createDockController, type DockVisibilitySource } from "../src/client/dock-controller.ts";

/** A minimal observable switch with a manual publish. */
function createSource(initial: boolean) {
  let visible = initial;
  const listeners = new Set<(visible: boolean) => void>();
  const source: DockVisibilitySource = {
    get: () => visible,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  return {
    source,
    publish(next: boolean) {
      visible = next;
      for (const listener of [...listeners]) listener(next);
    },
    listeners,
  };
}

describe("dock controller", () => {
  it("delivers the current value on creation and every transition after", () => {
    const { source, publish } = createSource(true);
    const seen: boolean[] = [];
    createDockController({ visibility: source, onChange: visible => seen.push(visible) });

    expect(seen).toEqual([true]);
    publish(false);
    publish(true);
    expect(seen).toEqual([true, false, true]);
  });

  it("stops forwarding after dispose", () => {
    const { source, publish, listeners } = createSource(false);
    const seen: boolean[] = [];
    const controller = createDockController({ visibility: source, onChange: visible => seen.push(visible) });
    controller.dispose();
    controller.dispose();

    expect(listeners.size).toBe(0);
    publish(true);
    expect(seen).toEqual([false]);
  });
});
