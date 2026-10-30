import { describe, expect, it, vi } from "vitest";

import { settleDirectSelection, type PopupStateLike } from "../src/client/popup.ts";

function popupState() {
  let snapshot: PopupStateLike = {
    open: true,
    command: "model",
    status: "ready",
    options: [],
    search: "",
    searchLabels: null,
    searchMode: "substring",
    active: 0,
    submitting: false,
    confirming: null,
    acknowledged: false,
    error: null,
  };
  return {
    store: {
      getSnapshot: () => snapshot,
      set: (next: PopupStateLike) => {
        snapshot = next;
      },
      subscribe: () => () => undefined,
    },
    snapshot: () => snapshot,
  };
}

function deferred() {
  let resolve = (): void => undefined;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

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
    const state = popupState();
    const dismiss = vi.fn(() => {
      events.push("dismiss");
      state.store.set({ ...state.snapshot(), open: false, submitting: false });
    });
    const popup = { binding, state: state.store, deps: { consume }, dismiss };

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
    expect(dismiss).toHaveBeenCalledTimes(2);
  });

  it("keeps the command token when the directory selection entry is unavailable", async () => {
    const consume = vi.fn();
    const dismiss = vi.fn();
    const state = popupState();
    const popup = { binding: { segment: { via: "enter", token: "/model" } }, state: state.store, deps: { consume }, dismiss };

    await settleDirectSelection(popup, () => undefined);

    expect(consume).not.toHaveBeenCalled();
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it("admits only one submission while a direct selection is in flight", async () => {
    const pending = deferred();
    const select = vi.fn(() => pending.promise);
    const consume = vi.fn();
    const dismiss = vi.fn();
    const state = popupState();
    const popup = {
      binding: { segment: { via: "enter", token: "/model" } },
      state: state.store,
      deps: { consume },
      dismiss,
    };

    const first = settleDirectSelection(popup, select);
    const second = settleDirectSelection(popup, select);
    const callsDuringFlight = select.mock.calls.length;
    const lockedDuringFlight = state.snapshot().submitting;
    pending.resolve();
    await Promise.all([first, second]);

    expect(callsDuringFlight).toBe(1);
    expect(lockedDuringFlight).toBe(true);
    expect(consume).toHaveBeenCalledTimes(1);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it("does not submit when the picker has no open binding", async () => {
    const select = vi.fn(() => Promise.resolve());
    const consume = vi.fn();
    const dismiss = vi.fn();
    const state = popupState();
    const popup = { binding: null, state: state.store, deps: { consume }, dismiss };

    await settleDirectSelection(popup, select);

    expect(select).not.toHaveBeenCalled();
    expect(consume).not.toHaveBeenCalled();
    expect(dismiss).not.toHaveBeenCalled();
  });

  it("does not consume or dismiss after the open binding is superseded", async () => {
    const pending = deferred();
    const consume = vi.fn();
    const dismiss = vi.fn();
    const state = popupState();
    const popup = {
      binding: { segment: { via: "enter", token: "/model" } },
      state: state.store,
      deps: { consume },
      dismiss,
    };

    const settlement = settleDirectSelection(popup, () => pending.promise);
    popup.binding = { segment: { via: "enter", token: "/model other" } };
    pending.resolve();
    await settlement;

    expect(consume).not.toHaveBeenCalled();
    expect(dismiss).not.toHaveBeenCalled();
  });

  it("still closes after success when the native consumer is unavailable", async () => {
    const dismiss = vi.fn();
    const state = popupState();
    const popup = {
      binding: { segment: { via: "enter", token: "/model" } },
      state: state.store,
      dismiss,
    };

    await settleDirectSelection(popup, async () => undefined);

    expect(dismiss).toHaveBeenCalledTimes(1);
  });
});
