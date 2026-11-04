/**
 * The probe has to live on a slot that is mounted even when the sidebar shows
 * no session row, because that is exactly when a workspace still needs its
 * directory published. These cases pin the slot the entry registers.
 */
import { describe, expect, it } from "vitest";

import { PROBE_SLOT, apply, type ClientContextLike, type SlotsLike } from "../src/client/entry.ts";

/** A slots face that records what was injected and registered, and runs the factory. */
function recordingSlots(): SlotsLike & { readonly registrations: { name: string; id: string; order: number }[] } {
  const registrations: { name: string; id: string; order: number }[] = [];
  return {
    registrations,
    inject(slot, factory) {
      expect(slot).toBe(PROBE_SLOT);
      factory();
    },
    register(options) {
      registrations.push({ name: options.name, id: options.id, order: options.order });
      return () => {};
    },
  };
}

describe("client entry", () => {
  it("registers the path probe on the frame overlay, which stays mounted without session rows", () => {
    const slots = recordingSlots();
    const effects: (() => () => void)[] = [];
    const ctx: ClientContextLike = {
      slots,
      effect(callback) {
        effects.push(callback);
      },
    };

    apply(ctx);
    for (const effect of effects) effect();

    expect(PROBE_SLOT).toBe("shell.overlay");
    expect(slots.registrations).toHaveLength(1);
    expect(slots.registrations[0]).toMatchObject({ name: "shell.overlay", id: "workspace-open-local-probe" });
    expect(typeof slots.registrations[0]?.order).toBe("number");
  });
});
