/**
 * The entry as the loader mounts it.
 *
 * The cases pin the contract the host depends on: three root services are
 * declared, the dictionaries and the keyed icon renderer are registered, and
 * the workspace contribution carries the id, target, and order the shared menu
 * expects. The last case drives the registered `resolve` end to end through a
 * stubbed page fetch, so the wiring between locale, host face, and rows is
 * exercised rather than only described.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  APPLICATION_ICON_KEY,
  CONTRIBUTION_ID,
  CONTRIBUTION_ORDER,
  LOCALE_NAMESPACE,
  apply,
  inject,
  type ClientContextLike,
  type MenuContributionLike,
} from "../src/client/entry.ts";

/** What the fake context recorded, plus the disposers the effects returned. */
interface Recording {
  readonly ctx: ClientContextLike;
  readonly dictionaries: { namespace: string; languages: Record<string, Record<string, string>> }[];
  readonly icons: { name: string; key: string; component: unknown }[];
  readonly contributions: MenuContributionLike[];
  /** Run every effect once; this is what Cordis does at apply time. */
  mount(): void;
}

function recordingContext(): Recording {
  const dictionaries: Recording["dictionaries"] = [];
  const icons: Recording["icons"] = [];
  const contributions: MenuContributionLike[] = [];
  const effects: (() => () => void)[] = [];
  const ctx: ClientContextLike = {
    contextMenus: {
      register(contribution) {
        contributions.push(contribution);
        return () => {};
      },
    },
    slots: {
      inject(slot, callback) {
        expect(slot).toBe("contextMenu.icon");
        callback();
        return () => {};
      },
      register(options, component) {
        icons.push({ ...options, component });
        return () => {};
      },
    },
    locale: {
      register(namespace, languages) {
        dictionaries.push({ namespace, languages });
        return () => {};
      },
      bind() {
        return (key) => `${key}:bound`;
      },
    },
    effect(callback) {
      effects.push(callback);
    },
  };
  return {
    ctx,
    dictionaries,
    icons,
    contributions,
    mount() {
      for (const effect of effects) effect();
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("client entry", () => {
  it("injects the two registries and the dictionary service", () => {
    expect(inject).toEqual(["slots", "contextMenus", "locale"]);
  });

  it("registers the zh/en dictionaries under this package's namespace", () => {
    const recording = recordingContext();
    apply(recording.ctx);
    recording.mount();

    expect(recording.dictionaries).toHaveLength(1);
    const [dictionary] = recording.dictionaries;
    expect(dictionary?.namespace).toBe(LOCALE_NAMESPACE);
    expect(Object.keys(dictionary?.languages ?? {})).toEqual(["zh", "en"]);
    // Same key set in both languages: a missing one would fall back silently.
    expect(Object.keys(dictionary?.languages.zh ?? {}).sort()).toEqual(
      Object.keys(dictionary?.languages.en ?? {}).sort(),
    );
    expect(dictionary?.languages.zh?.["menu.open"]).toBe("在本地打开");
    expect(dictionary?.languages.en?.["menu.open"]).toBe("Open in app");
    expect(dictionary?.languages.zh?.["menu.failed"]).toBe("打开失败");
    expect(dictionary?.languages.en?.["menu.failed"]).toBe("Could not open");
  });

  it("registers the application icon renderer on the keyed icon slot", () => {
    const recording = recordingContext();
    apply(recording.ctx);
    recording.mount();

    expect(recording.icons).toHaveLength(1);
    expect(recording.icons[0]).toMatchObject({ name: "contextMenu.icon", key: APPLICATION_ICON_KEY });
    expect(typeof recording.icons[0]?.component).toBe("function");
  });

  it("registers one workspace contribution between rename and delete", () => {
    const recording = recordingContext();
    apply(recording.ctx);
    recording.mount();

    expect(recording.contributions).toHaveLength(1);
    expect(recording.contributions[0]).toMatchObject({
      id: CONTRIBUTION_ID,
      target: "workspace",
      order: CONTRIBUTION_ORDER,
    });
    expect(CONTRIBUTION_ORDER).toBeGreaterThan(100);
    expect(CONTRIBUTION_ORDER).toBeLessThan(300);
    expect(typeof recording.contributions[0]?.resolve).toBe("function");
  });

  it("resolves rows through the host routes and the bound copy", async () => {
    vi.stubGlobal("fetch", async () => ({
      ok: true,
      status: 200,
      json: async () => ({ apps: ["finder"] }),
    }));
    const recording = recordingContext();
    apply(recording.ctx);
    recording.mount();

    const contribution = recording.contributions[0];
    const actions = await contribution?.resolve(
      { workspaceId: "ws-1", displayTitle: "work", path: "/work" },
      new AbortController().signal,
    );

    expect(actions?.[0]).toMatchObject({ label: "menu.open:bound" });
    expect(actions?.[0]?.children?.[0]).toMatchObject({
      id: "app:finder",
      label: "finder",
      failureLabel: "menu.failed:bound",
      icon: { key: APPLICATION_ICON_KEY, src: "open-in-app/icon/finder" },
    });
  });
});
