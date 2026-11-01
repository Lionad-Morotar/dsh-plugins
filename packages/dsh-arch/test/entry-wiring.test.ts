// @vitest-environment jsdom
/**
 * The entry's workbench wiring: register the "arch" panel kind, hand the dock
 * a mount that lands in the chrome, survive the desktop double apply
 * (dispose-then-register), and give the chrome the locale-bound strings.
 */
import { describe, expect, it } from "vitest";

import clientPlugin, { apply } from "../src/client/entry.ts";

interface KindRegistration {
  readonly descriptor: { kind: string; title: string; mount: (host: HTMLElement, context: { sessionId: string }) => (() => void) | void };
  disposed: boolean;
}

function createContext() {
  const registrations: KindRegistration[] = [];
  const localeCalls: string[] = [];
  const dictionaries = new Map<string, () => void>();
  const ctx = {
    locale: {
      register(namespace: string, dictionariesForNamespace: Record<string, Record<string, string>>) {
        localeCalls.push(namespace);
        expect(Object.keys(dictionariesForNamespace).sort()).toEqual(["en", "zh"]);
        const dispose = (): void => {
          dictionaries.delete(namespace);
        };
        dictionaries.set(namespace, dispose);
        return dispose;
      },
      bind: (namespace: string) => (key: string) => `${namespace}:${key}`,
    },
    workbench: {
      version: 1,
      registerDockPanelKind: (descriptor: KindRegistration["descriptor"]) => {
        const registration: KindRegistration = { descriptor, disposed: false };
        registrations.push(registration);
        return () => {
          registration.disposed = true;
        };
      },
    },
    get: () => undefined,
  };
  return { ctx, registrations, localeCalls, dictionaries };
}

describe("arch entry wiring", () => {
  it("declares the locale and workbench services it waits for", () => {
    expect(clientPlugin.name).toBe("dsh-arch");
    expect(clientPlugin.inject).toEqual(["locale", "workbench"]);
  });

  it("registers the arch kind whose mount lands in the chrome", () => {
    const { ctx, registrations, localeCalls } = createContext();
    const dispose = apply(ctx);

    expect(localeCalls).toEqual(["dsh-arch"]);
    expect(registrations).toHaveLength(1);
    const { descriptor } = registrations[0] ?? {};
    expect(descriptor?.kind).toBe("arch");
    // The title is locale-bound, not a hard-coded string in the dock's picker.
    expect(descriptor?.title).toBe("dsh-arch:arch.tabTitle");

    const host = document.createElement("div");
    document.body.append(host);
    const offMount = descriptor?.mount(host, { sessionId: "s1" });
    expect(host.getAttribute("data-arch-chrome")).toBe("");
    // The waiting note is the first paint; the fetch only starts after a tick.
    expect(host.textContent).toContain("dsh-arch:arch.waitingSession");
    if (typeof offMount === "function") offMount();
    expect(host.children.length).toBe(0);

    dispose();
    expect(registrations[0]?.disposed).toBe(true);
  });

  it("does nothing without the workbench registration face", () => {
    const dispose = apply({ locale: createContext().ctx.locale });
    expect(typeof dispose).toBe("function");
  });

  it("re-registers instead of stacking on a second apply (desktop double apply)", () => {
    const first = createContext();
    const disposeOne = apply(first.ctx);
    const second = createContext();
    const disposeTwo = apply(second.ctx);

    // The first registration was retired by the second apply, on whichever
    // service instance held it.
    expect(first.registrations[0]?.disposed).toBe(true);
    expect(second.registrations).toHaveLength(1);
    expect(second.registrations[0]?.descriptor.kind).toBe("arch");

    disposeOne();
    disposeTwo();
    expect(second.registrations[0]?.disposed).toBe(true);
  });
});
