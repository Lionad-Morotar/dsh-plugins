import { describe, expect, it, vi } from "vitest";

import { settleDirectSelection } from "../src/client/popup.ts";

describe("direct model settlement", () => {
  it("consumes the open-time command token after success, but never after failure", async () => {
    const events: string[] = [];
    const segment = { via: "enter", token: "/model" };
    const binding = { segment };
    const consume = vi.fn((actual: unknown) => {
      expect(actual).toBe(segment);
      events.push("consume");
      return true;
    });
    const dismiss = vi.fn(() => {
      events.push("dismiss");
    });
    const popup = { binding, deps: { consume }, dismiss };

    await settleDirectSelection(popup, async () => {
      events.push("select");
    });

    expect(events).toEqual(["select", "consume", "dismiss"]);

    await expect(
      settleDirectSelection(popup, async () => {
        throw new Error("selection failed");
      }),
    ).rejects.toThrow("selection failed");
    expect(consume).toHaveBeenCalledTimes(1);
  });
});
