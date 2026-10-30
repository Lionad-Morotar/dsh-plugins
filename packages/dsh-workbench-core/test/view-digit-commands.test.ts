import { describe, expect, it, vi } from "vitest";

import { registerViewDigitCommands, type ShortcutCommandRegistration } from "../src/client/commands.ts";
import { createWorkbenchService } from "../src/client/service.ts";
import { createViewDigitPreference, VIEW_DIGIT_STORAGE_KEY } from "../src/client/view-digits.ts";

/** A preference backed by an empty in-memory document. */
function preference(enabled?: boolean) {
  const entries = new Map<string, string>();
  const store = createViewDigitPreference({
    storage: {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => void entries.set(key, value),
    },
  });
  if (enabled !== undefined) store.set(enabled);
  return { store, entries, key: VIEW_DIGIT_STORAGE_KEY };
}

/** A shortcut registry that records registrations and their disposers. */
function harness() {
  const registered: ShortcutCommandRegistration[] = [];
  const disposed: string[] = [];
  const shortcuts = {
    register(command: ShortcutCommandRegistration) {
      registered.push(command);
      return () => void disposed.push(command.id);
    },
  };
  return { registered, disposed, shortcuts };
}

/** A service whose current session is "s1". */
function serviceWithSession() {
  return createWorkbenchService({
    get: (name: string) =>
      name === "uiSession" ? { adapter: { current: { getSnapshot: () => ({ key: "s1" }) } } } : undefined,
  });
}

/** The translate seat: `key:index` so assertions can see the params. */
const label = (key: string, params?: Record<string, string | number>): string =>
  params === undefined ? key : `${key}:${String(params.index)}`;

describe("view digit command registration", () => {
  it("registers nine digits when the preference ships enabled", () => {
    const { store } = preference();
    const { registered, shortcuts } = harness();
    registerViewDigitCommands(shortcuts, serviceWithSession(), label, store, {
      available: () => true,
      switchTo: () => true,
    });

    expect(registered).toHaveLength(9);
    expect(registered.map(command => command.id)).toEqual([
      "workbench.view.digit1",
      "workbench.view.digit2",
      "workbench.view.digit3",
      "workbench.view.digit4",
      "workbench.view.digit5",
      "workbench.view.digit6",
      "workbench.view.digit7",
      "workbench.view.digit8",
      "workbench.view.digit9",
    ]);
    for (const command of registered) {
      // Desktop profiles only: web delivers the chord through the local router,
      // so declaring a web default would be a promise the host cannot keep.
      expect(Object.keys(command.defaults)).toEqual(["desktop:macos", "desktop:windows", "desktop:linux"]);
      expect(command.defaults["desktop:macos"]).toEqual({ code: expect.stringMatching(/^Digit[1-9]$/u), modifiers: ["primary"] });
      expect(command.label()).toMatch(/^keymap\.viewDigit:[1-9]$/u);
    }
  });

  it("registers nothing while the toggle is off and follows later flips", () => {
    const { store } = preference(false);
    const { registered, disposed, shortcuts } = harness();
    registerViewDigitCommands(shortcuts, serviceWithSession(), label, store, {
      available: () => true,
      switchTo: () => true,
    });
    expect(registered).toHaveLength(0);

    store.set(true);
    expect(registered).toHaveLength(9);

    store.set(false);
    expect(disposed).toHaveLength(9);
  });

  it("disposes every registration when the caller tears the mount down", () => {
    const { store } = preference();
    const { registered, disposed, shortcuts } = harness();
    const off = registerViewDigitCommands(shortcuts, serviceWithSession(), label, store, {
      available: () => true,
      switchTo: () => true,
    });
    expect(registered).toHaveLength(9);

    off();
    expect(disposed).toHaveLength(9);

    // The store subscription is gone too: a later flip cannot resurrect rows.
    store.set(false);
    store.set(true);
    expect(registered).toHaveLength(9);
  });

  it("switches to the addressed tab and reports nothing to do past the strip", () => {
    const { store } = preference();
    const { registered, shortcuts } = harness();
    const switched: number[] = [];
    registerViewDigitCommands(shortcuts, serviceWithSession(), label, store, {
      available: index => index <= 2,
      switchTo: index => (switched.push(index), true),
    });

    const third = registered[2];
    expect(third?.resolve({ region: "page", modal: null, target: null })).toEqual({ status: "pass" });

    const first = registered[0];
    const resolution = first?.resolve({ region: "page", modal: null, target: null });
    expect(resolution?.status).toBe("handled");
    if (resolution?.status === "handled") resolution.run();
    expect(switched).toEqual([1]);
  });

  it("blocks every digit while no session is selected", () => {
    const { store } = preference();
    const { registered, shortcuts } = harness();
    const switched: number[] = [];
    registerViewDigitCommands(shortcuts, createWorkbenchService({ get: () => undefined }), label, store, {
      available: () => true,
      switchTo: index => (switched.push(index), true),
    });

    expect(registered[0]?.resolve({ region: "page", modal: null, target: null })).toEqual({
      status: "blocked",
      reason: "command.noSession",
    });
    expect(switched).toEqual([]);
  });

  it("keeps the remaining digits after one host rejection", () => {
    const { store } = preference();
    const onError = vi.fn();
    let first = true;
    const shortcuts = {
      register() {
        if (first) {
          first = false;
          throw new Error("conflict");
        }
        return () => {};
      },
    };
    registerViewDigitCommands(shortcuts, serviceWithSession(), label, store, {
      available: () => true,
      switchTo: () => true,
    }, onError);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0]).toContain("workbench.view.digit1");
  });

  it("is a no-op outside a host that carries the shortcut service", () => {
    const { store } = preference();
    expect(() =>
      registerViewDigitCommands(undefined, serviceWithSession(), label, store, {
        available: () => true,
        switchTo: () => true,
      }),
    ).not.toThrow();
  });
});
