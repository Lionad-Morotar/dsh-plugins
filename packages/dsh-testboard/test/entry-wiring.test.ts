// @vitest-environment jsdom
/**
 * The client half's wiring contract: one conversation view tab, registered
 * under the locale namespace, surviving the desktop's double apply.
 *
 * The fake context below is not a convenience stub, it is the host's two
 * refusal rules restated so a regression fails here instead of in the app:
 * a second registration for the same namespace and locale throws, and a
 * disposer only removes the dictionary it was handed (not whatever happens to
 * sit under that key later). Those two rules are why `apply` drops its own
 * previous registration before taking a new one.
 */
import { describe, expect, it } from "vitest";

import clientPlugin, { apply } from "../src/client/entry.ts";

interface SlotRegistration {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
  disposed: boolean;
}

function createContext(options: { readonly active?: "zh" | "en" } = {}) {
  const slots: SlotRegistration[] = [];
  const dictionaries = new Map<string, Map<string, Record<string, string>>>();

  const ctx = {
    slots: {
      inject(_slot: string, factory: () => () => void): () => void {
        return factory();
      },
      register(slotOptions: Record<string, unknown>, component: unknown): () => void {
        const registration: SlotRegistration = { options: slotOptions, component, disposed: false };
        slots.push(registration);
        return () => {
          registration.disposed = true;
        };
      },
    },
    locale: {
      register(namespace: string, entries: Record<string, Record<string, string>>): () => void {
        const table = dictionaries.get(namespace) ?? new Map<string, Record<string, string>>();
        for (const locale of Object.keys(entries)) {
          if (table.has(locale)) throw new Error(`locale ${namespace}/${locale} is already registered`);
        }
        for (const [locale, dictionary] of Object.entries(entries)) table.set(locale, dictionary);
        dictionaries.set(namespace, table);
        return () => {
          for (const [locale, dictionary] of Object.entries(entries)) {
            if (table.get(locale) === dictionary) table.delete(locale);
          }
        };
      },
      bind: (namespace: string) => (key: string) => `${namespace}:${key}`,
      getSnapshot: () => ({ active: options.active ?? "zh" }),
    },
  };

  return { ctx, slots, dictionaries };
}

describe("testboard client entry", () => {
  it("waits for exactly the slots and locale services", () => {
    expect(clientPlugin.name).toBe("dsh-testboard");
    expect(clientPlugin.inject).toEqual(["slots", "locale"]);
  });

  it("registers the conversation view tab beside files and git", () => {
    const { ctx, slots, dictionaries } = createContext();
    apply(ctx);

    expect(slots).toHaveLength(1);
    const options = slots[0]?.options;
    expect(options?.name).toBe("conversation.view");
    expect(options?.id).toBe("testboard");
    expect(options?.order).toBe(130);
    expect(options?.locale).toBe("testboard");
    expect(typeof slots[0]?.component).toBe("function");
    expect([...(dictionaries.get("testboard")?.keys() ?? [])].sort()).toEqual(["en", "zh"]);
  });

  it("resolves the tab label per active locale at call time", () => {
    const zh = createContext({ active: "zh" });
    apply(zh.ctx);
    const zhLabel = zh.slots[0]?.options.label as () => string;
    expect(zhLabel()).toBe("测试");

    const en = createContext({ active: "en" });
    apply(en.ctx);
    const enLabel = en.slots[0]?.options.label as () => string;
    expect(enLabel()).toBe("Tests");
  });

  it("survives the desktop double apply by replacing its own registration", () => {
    const { ctx, slots, dictionaries } = createContext();

    expect(() => apply(ctx)).not.toThrow();
    expect(() => apply(ctx)).not.toThrow();

    const live = slots.filter(registration => !registration.disposed);
    expect(live).toHaveLength(1);
    expect(live[0]).toBe(slots[1]);
    expect(dictionaries.get("testboard")?.size).toBe(2);
  });

  it("drops both the dictionary and the tab on dispose", () => {
    const { ctx, slots, dictionaries } = createContext();
    const dispose = apply(ctx);

    dispose();

    expect(slots[0]?.disposed).toBe(true);
    expect(dictionaries.get("testboard")?.size ?? 0).toBe(0);
  });

  it("leaves the replacement alone when the superseded disposer runs", () => {
    // The desktop applies the plugin twice on one process and may tear down the
    // first application afterwards. That teardown must not reach the tab the
    // second application registered: the first one no longer owns it.
    const { ctx, slots, dictionaries } = createContext();

    const disposeFirst = apply(ctx);
    const disposeSecond = apply(ctx);

    disposeFirst();

    expect(slots[0]?.disposed).toBe(true);
    expect(slots[1]?.disposed).toBe(false);
    expect(dictionaries.get("testboard")?.size).toBe(2);

    disposeSecond();

    expect(slots[1]?.disposed).toBe(true);
    expect(dictionaries.get("testboard")?.size ?? 0).toBe(0);
  });
});
