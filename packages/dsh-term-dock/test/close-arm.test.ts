import { describe, expect, it } from "vitest";

import { CLOSE_ARM_MS, IDLE_ARM, isArmed, pressClose, reconcileArm } from "../src/client/close-arm.ts";

describe("close arm", () => {
  it("arms on the first press and closes only the same panel on the second", () => {
    const first = pressClose(IDLE_ARM, "terminal-1", 1000);
    const other = pressClose(first.arm, "terminal-2", 1000 + 10);
    const second = pressClose(first.arm, "terminal-1", 1000 + 10);

    expect(first.close).toBe(false);
    expect(isArmed(first.arm, 1000 + CLOSE_ARM_MS - 1)).toBe(true);
    expect(other.close).toBe(false);
    expect(other.arm.panelId).toBe("terminal-2");
    expect(second).toEqual({ arm: IDLE_ARM, close: true });
  });

  it("drops an expired mark instead of closing", () => {
    const first = pressClose(IDLE_ARM, "terminal-1", 1000);
    const late = pressClose(first.arm, "terminal-1", 1000 + CLOSE_ARM_MS);

    expect(isArmed(first.arm, 1000 + CLOSE_ARM_MS)).toBe(false);
    expect(late.close).toBe(false);
    expect(late.arm.panelId).toBe("terminal-1");
  });

  it("drops the mark when its panel is gone and keeps it otherwise", () => {
    const armed = pressClose(IDLE_ARM, "terminal-1", 0).arm;

    expect(reconcileArm(armed, ["terminal-1", "terminal-2"])).toBe(armed);
    expect(reconcileArm(armed, ["terminal-2"])).toBe(IDLE_ARM);
    expect(reconcileArm(IDLE_ARM, [])).toBe(IDLE_ARM);
  });
});
