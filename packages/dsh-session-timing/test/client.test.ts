/**
 * Client-half contracts that do not need a renderer.
 *
 * The pill's markup is a React tree, but everything it decides from data — which
 * rows the dialog prints, what the compact reading says, how the mode mirror
 * follows the settings form — is pure. These cases pin that half plus the
 * delivery shape the loader mounts.
 */
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createModeStore, DEFAULT_USAGE_MODE, normalizeUsageMode, type ConfigFormLike } from "../src/client/mode.ts";
import { decodeSpeed, formatDuration, formatTokensPerSecond, type Translate } from "../src/client/format.ts";
import { EN, ZH } from "../src/client/copy.ts";
import { compactReading, detailRows, hasDetails } from "../src/client/rows.ts";
import { CHAT_SETTINGS_NAMESPACE, ENTRY_ID, ENTRY_PRIORITY, LOCALE_NAMESPACE, SLOT } from "../src/client/registration.ts";
import { resolveKit } from "../src/client/entry.ts";
import type { TimingView } from "../src/schema.ts";

/** A translate seat over one dictionary, with the shipped parameter syntax. */
function seat(dictionary: Record<string, string>): Translate {
  return (key, params) => {
    const template = dictionary[key] ?? key;
    return template.replace(/\{(\w+)\}/gu, (_match, name: string) => String(params?.[name] ?? "{name}"));
  };
}

/** A timing view with every figure recorded. */
function recorded(overrides: Partial<TimingView> = {}): TimingView {
  return {
    turns: 3,
    steps: 5,
    llmMs: 60_000,
    toolMs: 2_000,
    ttftMs: 1_500,
    ttftSteps: 5,
    decodeMs: 30_000,
    decodeTokens: 4_500,
    retryMs: 0,
    retries: 0,
    ...overrides,
  };
}

describe("formatting", () => {
  it("prints one decimal below a minute and whole minutes above", () => {
    expect(formatDuration(45_200, seat(ZH))).toBe("45.2秒");
    expect(formatDuration(162_000, seat(ZH))).toBe("2分42秒");
    // The minute cut is 60.0s exactly, matching the shipped pill: 59.96s still
    // reads as seconds, which is why the boundary is asserted rather than guessed.
    expect(formatDuration(59_960, seat(ZH))).toBe("60秒");
    expect(formatDuration(60_000, seat(ZH))).toBe("1分0秒");
  });

  it("prints whole tokens from ten up and one decimal below", () => {
    expect(formatTokensPerSecond(155.33)).toBe("155");
    expect(formatTokensPerSecond(9.44)).toBe("9.4");
    expect(formatTokensPerSecond(-1)).toBe("0");
  });

  it("omits the speed reading when no decode time was recorded", () => {
    expect(decodeSpeed({ decodeMs: 0, decodeTokens: 100 }, seat(ZH))).toBeNull();
    expect(decodeSpeed({ decodeMs: 1_000, decodeTokens: 100 }, seat(ZH))).toBe("100 tok/s");
  });

  it("keeps both dictionaries on the same key set", () => {
    expect(Object.keys(EN).sort()).toEqual(Object.keys(ZH).sort());
  });

  it("labels the retry row in both languages", () => {
    expect(ZH["stats.retryTime"]).toBe("重试用时");
    expect(EN["stats.retryTime"]).toBe("Retry wait");
  });
});

describe("dialog rows", () => {
  it("shows the retry row between model time and tool time", () => {
    const rows = detailRows(recorded({ retryMs: 90_000, retries: 2 }), "150 tok/s", seat(ZH));
    expect(rows.map((row) => row.key)).toEqual(["llmMs", "retryMs", "toolMs", "ttft", "speed"]);
    expect(rows.find((row) => row.key === "retryMs")?.value).toBe("1分30秒");
  });

  it("drops the retry row when nothing was retried", () => {
    const keys = detailRows(recorded(), "150 tok/s", seat(ZH)).map((row) => row.key);
    expect(keys).toEqual(["llmMs", "toolMs", "ttft", "speed"]);
  });

  it("drops every unrecorded figure", () => {
    const empty = recorded({ turns: 1, steps: 1, llmMs: 0, toolMs: 0, ttftMs: 0, ttftSteps: 0, decodeMs: 0, decodeTokens: 0 });
    expect(detailRows(empty, null, seat(ZH))).toEqual([]);
    expect(hasDetails(empty, null)).toBe(false);
    expect(hasDetails(recorded({ llmMs: 0, retryMs: 1, toolMs: 0, ttftSteps: 0 }), null)).toBe(true);
  });

  it("keeps the compact reading to the speed alone", () => {
    expect(compactReading(null)).toBeNull();
    expect(compactReading("150 tok/s")).toBe("150 tok/s");
  });
});

describe("mode mirror", () => {
  /** A configuration form over a mutable value, with real change notification. */
  function form(initial: unknown): ConfigFormLike & { set(value: unknown): void } {
    let value = { performanceUsage: initial };
    const listeners = new Set<() => void>();
    return {
      getSnapshot: () => ({ value }),
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      set: (next) => {
        value = { performanceUsage: next };
        for (const listener of listeners) listener();
      },
    };
  }

  it("falls back to the shipped default when the field is absent or unknown", () => {
    expect(normalizeUsageMode(undefined)).toBe(DEFAULT_USAGE_MODE);
    expect(normalizeUsageMode("verbose")).toBe(DEFAULT_USAGE_MODE);
    expect(normalizeUsageMode("compact")).toBe("compact");
  });

  it("reads the shipped ui-chat field on construction", () => {
    expect(createModeStore(form("compact")).getSnapshot()).toBe("compact");
    expect(createModeStore(undefined).getSnapshot()).toBe(DEFAULT_USAGE_MODE);
  });

  it("notifies only when the accepted mode actually changes", () => {
    const source = form("detailed");
    const store = createModeStore(source);
    const listener = vi.fn();
    store.subscribe(listener);
    source.set("detailed");
    expect(listener).not.toHaveBeenCalled();
    source.set("compact");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe("compact");
  });
});

describe("registration", () => {
  it("takes over the shipped activity seat one priority lower", () => {
    expect(SLOT).toBe("conversation.composer.dock");
    expect(ENTRY_ID).toBe("activity");
    expect(ENTRY_PRIORITY).toBeLessThan(0);
    expect(CHAT_SETTINGS_NAMESPACE).toBe("ui-chat");
    expect(LOCALE_NAMESPACE).toBe("session-timing");
  });

  it("refuses a kit with any platform member missing", () => {
    const primitives = { IconGaugeOutlineRegular: () => null, useAnchoredPosition: () => null, useDismissOnOutsidePointer: () => undefined };
    expect(resolveKit(null)).toBeUndefined();
    expect(resolveKit(() => ({ ...primitives, createPortal: () => null }))).toBeDefined();
    expect(resolveKit(() => primitives)).toBeUndefined();
    expect(resolveKit(() => ({ ...primitives, createPortal: () => null, useAnchoredPosition: undefined }))).toBeUndefined();
  });
});

describe("client bundle", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");
  const quote = String.fromCharCode(34);

  it("keeps the ModuleLoader wrapper keyed on the package name", () => {
    expect(bundle).toContain("window.__ModuleLoader__.load");
    expect(bundle).toContain(quote + "dsh-session-timing" + quote);
  });

  it("registers the priority shadow and resolves the platform through require", () => {
    expect(bundle).toContain("conversation.composer.dock");
    expect(bundle).toContain("sessionTiming");
    expect(bundle).toContain("dsh-client-ui-primitives");
    expect(bundle).toContain("createPortal");
    expect(bundle).toContain("module.exports.boot(require)");
    expect(bundle).not.toContain("node:");
  });

  it("ships the plugin object shape the loader mounts", () => {
    expect(bundle).toContain("factory");
    expect(bundle).toContain("apply");
    expect(bundle).toContain("inject");
  });
});