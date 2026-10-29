import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

import { detectPlatform } from "../src/client/entry.ts";
import { createPanelStore } from "../src/client/store.ts";
import { ROOT_ATTR, STYLE_ATTR, STYLE_TAG, insertPanelStyles } from "../src/client/styles.ts";

describe("createPanelStore", () => {
  it("starts closed with the default mode and no rows", () => {
    const store = createPanelStore("command");
    expect(store.getSnapshot()).toMatchObject({
      open: false,
      rows: [],
      status: "idle",
      model: { mode: "command" },
    });
  });

  it("notifies subscribers on set and update, and stops after unsubscribe", () => {
    const store = createPanelStore();
    const listener = vi.fn();
    const stop = store.subscribe(listener);

    store.set({ open: true });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().open).toBe(true);

    store.update(snapshot => ({ ...snapshot, status: "ready" }));
    expect(listener).toHaveBeenCalledTimes(2);

    stop();
    store.set({ open: false });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe("insertPanelStyles", () => {
  it("injects one scoped tag and removes only that tag on dispose", () => {
    const { window } = new JSDOM("<!doctype html><html><head></head><body></body></html>");
    const doc = window.document;
    const foreign = doc.createElement("style");
    foreign.textContent = "body{color:red}";
    doc.head.append(foreign);

    const dispose = insertPanelStyles(doc);
    expect(doc.querySelectorAll(`style[${STYLE_ATTR}="${STYLE_TAG}"]`)).toHaveLength(1);

    // A second call is a no-op rather than a duplicate sheet.
    insertPanelStyles(doc)();
    expect(doc.querySelectorAll(`style[${STYLE_ATTR}="${STYLE_TAG}"]`)).toHaveLength(1);

    const css = doc.querySelector(`style[${STYLE_ATTR}="${STYLE_TAG}"]`)?.textContent ?? "";
    // Every rule is scoped, and the token layer is read rather than hard-coded.
    expect(css).toContain(`[${ROOT_ATTR}]`);
    expect(css).toContain("--dsw-alias-bg-layer-2");
    expect(css).not.toMatch(/^body\s*\{/m);

    dispose();
    expect(doc.querySelectorAll(`style[${STYLE_ATTR}="${STYLE_TAG}"]`)).toHaveLength(0);
    expect(doc.head.contains(foreign)).toBe(true);
  });
});

describe("detectPlatform", () => {
  it("maps the navigator spellings onto the host vocabulary", () => {
    expect(detectPlatform("MacIntel")).toBe("macos");
    expect(detectPlatform("Win32")).toBe("windows");
    expect(detectPlatform("Linux x86_64")).toBe("linux");
    expect(detectPlatform("")).toBe("linux");
  });
});
