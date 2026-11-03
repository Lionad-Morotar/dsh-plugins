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

interface SlotRegistration {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
}

function createContext(options: { workbench?: boolean } = {}) {
  const registrations: KindRegistration[] = [];
  const slots: SlotRegistration[] = [];
  const localeCalls: string[] = [];
  const dictionaries = new Map<string, () => void>();
  const ctx = {
    slots: {
      inject(_slot: string, factory: () => () => void) {
        return factory();
      },
      register(slotOptions: Record<string, unknown>, component: unknown) {
        slots.push({ options: slotOptions, component });
        return () => {};
      },
    },
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
      getSnapshot: () => ({ active: "zh" }),
    },
    ...(options.workbench === false
      ? {}
      : {
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
        }),
    get: () => undefined,
  };
  return { ctx, registrations, slots, localeCalls, dictionaries };
}

describe("arch entry wiring", () => {
  it("declares the slots, locale and workbench services it waits for", () => {
    expect(clientPlugin.name).toBe("dsh-arch");
    // workbench is not waited on: a hot reload that catches it momentarily
    // absent must still register the conversation tab instead of parking the
    // plugin. The dock kind registers from inside apply when it is present.
    expect(clientPlugin.inject).toEqual(["slots", "locale"]);
  });

  it("registers an architecture conversation view beside files and git", () => {
    const { ctx, slots } = createContext();
    apply(ctx);

    expect(slots).toHaveLength(1);
    const options = slots[0]?.options;
    expect(options?.name).toBe("conversation.view");
    expect(options?.id).toBe("arch");
    expect(options?.order).toBe(120);
    expect(typeof options?.label).toBe("function");
    expect((options?.label as () => string)()).toBe("\u67b6\u6784");
    expect(typeof slots[0]?.component).toBe("function");
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

  it("keeps the conversation tab when the dock kind face is absent", () => {
    const { ctx, registrations, slots } = createContext({ workbench: false });
    const dispose = apply(ctx);
    expect(slots).toHaveLength(1);
    expect(registrations).toHaveLength(0);
    expect(typeof dispose).toBe("function");
  });

  it("survives a host that throws on an undeclared service read", () => {
    // Real Cordis does not return undefined for a service the plugin did not
    // declare in `inject`; it throws from the property read. `workbench` is
    // deliberately not injected, so both probes must be guarded or `apply`
    // throws and the plugin never activates.
    const { ctx, slots } = createContext({ workbench: false });
    const throwing = {
      ...ctx,
      get(name: string): unknown {
        throw new Error(`cannot get property "${name}" without inject`);
      },
    };
    Object.defineProperty(throwing, "workbench", {
      get(): never {
        throw new Error('cannot get property "workbench" without inject');
      },
    });

    expect(() => apply(throwing)).not.toThrow();
    expect(slots).toHaveLength(1);
    expect(slots[0]?.options.id).toBe("arch");
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

  it("hides the conversation width handle while the architecture view is mounted, and restores it on exit", () => {
    apply(createContext().ctx);
    const content = document.createElement("div");
    content.setAttribute("data-conversation-content", "");
    const scroll = document.createElement("div");
    const arch = document.createElement("div");
    arch.setAttribute("data-arch-view", "");
    scroll.append(arch);
    const handle = document.createElement("div");
    handle.setAttribute("data-width-handle", "left");
    content.append(scroll, handle);
    document.body.append(content);

    expect(getComputedStyle(handle).display).toBe("none");

    arch.remove();
    expect(getComputedStyle(handle).display).not.toBe("none");
  });
});
