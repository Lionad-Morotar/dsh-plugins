import { describe, expect, it } from "vitest";

import { usableShortcut } from "../src/client/shortcut-key.ts";
import type { ShortcutCatalogEntry } from "../src/client/dsh.ts";

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
