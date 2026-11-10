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
 *
 * The constants are asserted here as well as in `src/shared.ts`, because the
 * build script, the tests and the host all key on the same literals and a
 * second spelling of any of them is a tab that silently never appears.
 */
import { describe, expect, it } from "vitest";

import { EN, ZH } from "../src/client/copy.ts";
import clientPlugin, { apply } from "../src/client/entry.ts";
import { LOCALE_NAMESPACE, PACKAGE_NAME, ROUTE_PREFIX, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../src/shared.ts";

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

describe("pr explorer contract", () => {
  it("pins the literals the host, the build and the tests all key on", () => {
    expect(PACKAGE_NAME).toBe("dsh-pr-explorer");
    expect(VIEW_SLOT).toBe("conversation.view");
    expect(VIEW_ID).toBe("pr-explorer");
    // Files 100, Git 110, PR 115, arch 120, board 130, review 140: the PR tab
    // sits between Git and the architecture map.
    expect(VIEW_ORDER).toBe(115);
    expect(LOCALE_NAMESPACE).toBe("pr-explorer");
    expect(ROUTE_PREFIX).toBe("/pr-explorer/api");
  });

  it("translates the tab label and the empty state in both locales", () => {
    expect(ZH["pr-explorer.tabTitle"]).toBe("PR");
    expect(EN["pr-explorer.tabTitle"]).toBe("PR");
    expect(ZH["pr-explorer.empty"]).toBeTruthy();
    expect(EN["pr-explorer.empty"]).toBeTruthy();
    // A key present in one dictionary and missing from the other renders as a
    // blank label on the other language, which no type check catches.
    expect(Object.keys(ZH).sort()).toEqual(Object.keys(EN).sort());
  });
});

describe("pr explorer client entry", () => {
  it("waits for exactly the slots and locale services", () => {
    expect(clientPlugin.name).toBe("dsh-pr-explorer");
    expect(clientPlugin.inject).toEqual(["slots", "locale"]);
  });

  it("registers the conversation view tab between Git and the architecture map", () => {
    const { ctx, slots, dictionaries } = createContext();
    apply(ctx);

    expect(slots).toHaveLength(1);
    const options = slots[0]?.options;
    expect(options?.name).toBe("conversation.view");
    expect(options?.id).toBe("pr-explorer");
    expect(options?.order).toBe(115);
    expect(options?.locale).toBe("pr-explorer");
    expect(typeof slots[0]?.component).toBe("function");
    expect([...(dictionaries.get("pr-explorer")?.keys() ?? [])].sort()).toEqual(["en", "zh"]);
  });

  it("reads the workbench through get, never through an undeclared service property", () => {
    // The real client context throws when a plugin reads a service property it
    // did not declare in `inject`. The PR tab keeps the workbench optional, so
    // the read must go through `get`: the throwing getter below is the host
    // rule, and this test fails the day the code reads `ctx.workbench` again.
    const { ctx, slots } = createContext();
    const seen: string[] = [];
    Object.defineProperty(ctx, "get", {
      value: (name: string) => {
        seen.push(name);
        return undefined;
      },
      configurable: true,
    });
    Object.defineProperty(ctx, "workbench", {
      get() {
        throw new Error("undeclared service property was read");
      },
      configurable: true,
    });

    expect(() => apply(ctx)).not.toThrow();
    expect(slots).toHaveLength(1);
    expect(seen).toContain("workbench");
  });

  it("resolves the tab label per active locale at call time", () => {
    const zh = createContext({ active: "zh" });
    apply(zh.ctx);
    const zhLabel = zh.slots[0]?.options.label as () => string;
    expect(zhLabel()).toBe("PR");

    const en = createContext({ active: "en" });
    apply(en.ctx);
    const enLabel = en.slots[0]?.options.label as () => string;
    expect(enLabel()).toBe("PR");
  });

  it("survives the desktop double apply by replacing its own registration", () => {
    const { ctx, slots, dictionaries } = createContext();

    expect(() => apply(ctx)).not.toThrow();
    expect(() => apply(ctx)).not.toThrow();

    const live = slots.filter(registration => !registration.disposed);
    expect(live).toHaveLength(1);
    expect(live[0]).toBe(slots[1]);
    expect(dictionaries.get("pr-explorer")?.size).toBe(2);
  });

  it("drops both the dictionary and the tab on dispose", () => {
    const { ctx, slots, dictionaries } = createContext();
    const dispose = apply(ctx);

    dispose();

    expect(slots[0]?.disposed).toBe(true);
    expect(dictionaries.get("pr-explorer")?.size ?? 0).toBe(0);
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
    expect(dictionaries.get("pr-explorer")?.size).toBe(2);

    disposeSecond();

    expect(slots[1]?.disposed).toBe(true);
    expect(dictionaries.get("pr-explorer")?.size ?? 0).toBe(0);
  });
});
