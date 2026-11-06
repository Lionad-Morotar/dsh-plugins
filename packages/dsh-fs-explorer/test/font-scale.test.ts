// @vitest-environment jsdom
/**
 * The panel's type scale: where the size comes from, how it becomes a row
 * height, and the stylesheet contract that keeps CSS on the same axis.
 *
 * The store is module state read at import time, so each test re-imports it
 * after setting the body variable the host presenter would have written.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FS_STYLES } from "../src/client/styles.ts";

const TEXT_VARIABLE = "--dsh-content-font-size";

/** A stand-in for the host's theme service: one mutable snapshot and listeners. */
interface FakeTheme {
  getTheme(): unknown;
  setText(px: number): void;
  readonly listeners: Set<() => void>;
}

/** Build the smallest theme service that answers `getTheme` and emits `theme/change`. */
function fakeTheme(text: number): FakeTheme {
  const snapshot = { fontSizes: { text } };
  const listeners = new Set<() => void>();
  return {
    listeners,
    getTheme: () => snapshot,
    setText(px: number): void {
      snapshot.fontSizes.text = px;
      for (const listener of [...listeners]) listener();
    },
  };
}

/** The scope Cordis hands an injection callback, narrowed to what the store reads. */
interface FakeScope {
  get(name: string): unknown;
  on(event: string, listener: () => void): () => boolean;
}

/** A context whose `inject` runs the callback immediately, like a mounted service. */
interface FakeContext {
  inject(services: string[], callback: (scope: FakeScope) => void | (() => void)): unknown;
}

/** Build the injected context and remember the disposer the callback returned. */
function fakeContext(theme: FakeTheme): { ctx: FakeContext; disposed: () => boolean } {
  let off: (() => void) | undefined;
  let released = false;
  return {
    disposed: () => released,
    ctx: {
      inject(services, callback) {
        expect(services).toEqual(["theme"]);
        const result = callback({
          get: (name: string) => (name === "theme" ? theme : undefined),
          on: (event: string, listener: () => void) => {
            expect(event).toBe("theme/change");
            theme.listeners.add(listener);
            return () => theme.listeners.delete(listener);
          },
        });
        if (typeof result === "function") off = result;
        return {
          dispose: () => {
            released = true;
            off?.();
          },
        };
      },
    },
  };
}

/** Set the variable the host's theme presenter writes on `body`. */
function writeBodySize(value: string | undefined): void {
  if (value === undefined) document.body.style.removeProperty(TEXT_VARIABLE);
  else document.body.style.setProperty(TEXT_VARIABLE, value);
}

/** Load the store fresh, after the DOM has been prepared. */
async function loadStore(): Promise<typeof import("../src/client/font-scale.ts")> {
  vi.resetModules();
  return import("../src/client/font-scale.ts");
}

describe("the host's text size", () => {
  beforeEach(() => {
    writeBodySize(undefined);
  });

  it("starts from the value the host presenter wrote on body", async () => {
    writeBodySize("17px");
    const store = await loadStore();
    expect(store.getTextSize()).toBe(17);
  });

  it("falls back to the design baseline when the variable is junk", async () => {
    writeBodySize("not-a-size");
    const store = await loadStore();
    expect(store.getTextSize()).toBe(14);
  });

  it("adopts the theme service's snapshot and follows theme/change", async () => {
    const store = await loadStore();
    const theme = fakeTheme(18);
    const { ctx } = fakeContext(theme);
    store.attachFontScale(ctx);
    expect(store.getTextSize()).toBe(18);

    const seen: number[] = [];
    store.subscribeTextSize(() => seen.push(store.getTextSize()));
    theme.setText(20);
    expect(store.getTextSize()).toBe(20);
    // A repeated size is not news; the subscriber must not repaint for it.
    theme.setText(20);
    expect(seen).toEqual([20]);
  });

  it("stops following the service once the injection is released", async () => {
    const store = await loadStore();
    const theme = fakeTheme(18);
    const { ctx, disposed } = fakeContext(theme);
    const off = store.attachFontScale(ctx);
    off();
    // The callback's own disposer removed the listener; a later change is not ours.
    expect(theme.listeners.size).toBe(0);
    expect(disposed()).toBe(true);
  });

  it("keeps the body variable as the fallback when the snapshot has no sizes", async () => {
    const store = await loadStore();
    // The host writes the variable once the settings read lands; a snapshot with
    // no sizes must not throw the panel back to the design baseline.
    writeBodySize("15px");
    const theme: FakeTheme = {
      getTheme: () => ({}),
      listeners: new Set(),
      setText: () => undefined,
    };
    store.attachFontScale(fakeContext(theme).ctx);
    expect(store.getTextSize()).toBe(15);
  });

  it("survives a context that cannot inject the service", async () => {
    const store = await loadStore();
    expect(() => store.attachFontScale({})).not.toThrow();
    expect(store.getTextSize()).toBe(14);
  });
});

describe("row height arithmetic", () => {
  it("keeps the design baseline at the design text size", async () => {
    const store = await loadStore();
    expect(store.scaledRowHeight(22, 14)).toBe(22);
    expect(store.scaledRowHeight(24, 14)).toBe(24);
  });

  it("grows with the text size in whole pixels", async () => {
    const store = await loadStore();
    expect(store.scaledRowHeight(22, 16)).toBe(25);
    expect(store.scaledRowHeight(22, 18)).toBe(28);
    expect(store.scaledRowHeight(24, 16)).toBe(27);
  });

  it("never shrinks below the design height, matching the CSS floor", async () => {
    const store = await loadStore();
    expect(store.scaledRowHeight(22, 10)).toBe(22);
  });
});

describe("the stylesheet contract", () => {
  it("takes both axes from the host", () => {
    expect(FS_STYLES).toContain("--fx-fs: var(--dsh-content-font-size, 14px);");
    expect(FS_STYLES).toContain("--fx-fs-code: var(--dsh-code-font-size, 11px);");
  });

  it("derives the row height from the same variable the component scales", () => {
    // 22 / 14, floored at the design row height: the TS helper computes the same
    // value, and a disagreement would drift the virtual window off the CSS.
    expect(FS_STYLES).toContain("--fx-row-h: max(22px, calc(var(--fx-fs) * 1.5714));");
  });

  it("expresses interface text as a ratio of the body size", () => {
    // 12px of panel per 14px of conversation body.
    expect(FS_STYLES).toContain("font-size: calc(var(--fx-fs) * 0.8571);");
    expect(FS_STYLES).toMatch(/\.fx-name \{[^}]*font-size: calc\(var\(--fx-fs\) \* 0\.8571\)/u);
  });

  it("expresses monospace text as a ratio of the code size", () => {
    // 10px of monospace per 11px of code.
    expect(FS_STYLES).toMatch(/\.fx-size \{[^}]*font-size: calc\(var\(--fx-fs-code\) \* 0\.9091\)/u);
    expect(FS_STYLES).toMatch(/\.fx-pre \{[^}]*font-size: calc\(var\(--fx-fs-code\) \* 1\.0909\)/u);
  });

  it("leaves no font size hard-coded in pixels", () => {
    // Relative em sizes inside the markdown document are fine: they inherit the
    // scaled document size.
    expect(FS_STYLES).not.toMatch(/font-size: [\d.]+px/u);
  });
});
