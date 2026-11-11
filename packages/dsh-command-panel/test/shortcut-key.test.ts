import { describe, expect, it } from "vitest";

import { matchesShortcut, usableShortcut, type KeyFacts } from "../src/client/shortcut-key.ts";
import type { NormalizedBinding, ShortcutCatalogEntry } from "../src/client/dsh.ts";

/** One catalogue row; every case below is this row with one field changed. */
const entry: ShortcutCatalogEntry = {
  id: "session.new",
  label: "新建会话",
  keys: ["⌘", "N"],
  binding: { code: "KeyN", modifiers: ["meta"] },
  modified: false,
  conflicts: [],
  issue: null,
};

describe("usableShortcut", () => {
  it("returns the keycaps and the binding of a bound, unconflicted entry", () => {
    const usable = usableShortcut([entry], "session.new");
    expect(usable?.keys).toEqual(["⌘", "N"]);
    // The binding is handed back by reference: callers compare the chord, and a
    // copy would make that comparison a deep walk for no gain.
    expect(usable?.binding).toBe(entry.binding);
  });

  it("returns undefined when the entry has no binding", () => {
    expect(usableShortcut([{ ...entry, binding: null }], "session.new")).toBeUndefined();
  });

  it("returns undefined when the binding carries an issue", () => {
    expect(usableShortcut([{ ...entry, issue: "unparsable" }], "session.new")).toBeUndefined();
  });

  it("returns undefined when another command holds the chord", () => {
    expect(usableShortcut([{ ...entry, conflicts: ["workspace.add"] }], "session.new")).toBeUndefined();
  });

  it("returns undefined when the entry is not in the catalogue", () => {
    expect(usableShortcut([entry], "session.rename")).toBeUndefined();
  });

  it("returns undefined when the entry has no keycaps to show", () => {
    expect(usableShortcut([{ ...entry, keys: [] }], "session.new")).toBeUndefined();
  });
});

/** `⌘⌥N`, the chord macOS web delivers as a Dead key rather than as `KeyN`. */
const deadChord: NormalizedBinding = { code: "KeyN", modifiers: ["meta", "alt"] };

/** A keydown with nothing pressed but the chord under test. */
function facts(overrides: Partial<KeyFacts> = {}): KeyFacts {
  return {
    code: "KeyN",
    key: "n",
    repeat: false,
    ctrlKey: false,
    metaKey: true,
    altKey: true,
    shiftKey: false,
    ...overrides,
  };
}

const macWeb = { runtime: "web", platform: "macos" } as const;

describe("matchesShortcut", () => {
  it("matches the exact chord", () => {
    expect(matchesShortcut(facts(), deadChord, macWeb)).toBe(true);
  });

  it("rejects a chord with one modifier too many", () => {
    expect(matchesShortcut(facts({ shiftKey: true }), deadChord, macWeb)).toBe(false);
    expect(matchesShortcut(facts({ ctrlKey: true }), deadChord, macWeb)).toBe(false);
  });

  it("rejects a chord with one modifier missing", () => {
    expect(matchesShortcut(facts({ altKey: false }), deadChord, macWeb)).toBe(false);
    expect(matchesShortcut(facts({ metaKey: false }), deadChord, macWeb)).toBe(false);
  });

  it("rejects a different physical key", () => {
    expect(matchesShortcut(facts({ code: "KeyJ", key: "j" }), deadChord, macWeb)).toBe(false);
  });

  it("rejects AltGr, which is a character entry rather than a chord", () => {
    expect(matchesShortcut(facts({ altGraph: true }), deadChord, macWeb)).toBe(false);
  });

  it("rejects a key pressed while an IME is composing", () => {
    expect(matchesShortcut(facts({ composing: true }), deadChord, macWeb)).toBe(false);
  });

  it("rejects a Dead key that is not the host's one exception", () => {
    expect(matchesShortcut(facts({ key: "Dead" }), deadChord, { runtime: "web", platform: "windows" })).toBe(false);
    expect(matchesShortcut(facts({ key: "Dead" }), { code: "KeyB", modifiers: ["meta", "alt"] }, macWeb)).toBe(false);
  });

  it("lets the macOS web Dead key through for ⌘⌥N, as the host does", () => {
    expect(matchesShortcut(facts({ key: "Dead" }), deadChord, macWeb)).toBe(true);
  });

  it("keeps the Dead key exception out of the desktop runtime and out of other modifier sets", () => {
    expect(matchesShortcut(facts({ key: "Dead" }), deadChord, { runtime: "desktop", platform: "macos" })).toBe(false);
    expect(matchesShortcut(facts({ key: "Dead", shiftKey: true }), deadChord, macWeb)).toBe(false);
    expect(matchesShortcut(facts({ key: "Dead", ctrlKey: true }), deadChord, macWeb)).toBe(false);
  });

  it("rejects a two-stroke binding, which the DOM layer never owns", () => {
    expect(matchesShortcut(facts(), { ...deadChord, secondCode: "KeyK" }, macWeb)).toBe(false);
  });
});
