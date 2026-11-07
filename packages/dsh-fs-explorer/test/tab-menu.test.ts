/**
 * The strip's menu as a decision table.
 *
 * Two product decisions live here rather than in the rendered menu: "right"
 * means the strip's order, which a reader can reorder by opening files in a
 * different sequence; and the batch rows change shape at the strip's ends —
 * greying out on the last tab, dropping the right-hand row when there is no
 * right side.
 */
import { describe, expect, it } from "vitest";

import { TAB_MENU_ACTION, buildTabMenu } from "../src/client/context-menu.ts";
import { closeBatch, type PanelEntry } from "../src/client/panels.ts";

const t = (key: string): string => key;

function panel(path: string): PanelEntry {
  return { key: path, path, line: 1, absolute: false };
}

describe("closeBatch", () => {
  const strip = [panel("a.md"), panel("b.md"), panel("c.md")];

  it("takes every tab but the one the menu opened on", () => {
    expect(closeBatch(strip, "b.md", "others")).toEqual(["a.md", "c.md"]);
  });

  it("takes only the tabs after it, in strip order", () => {
    expect(closeBatch([panel("c.md"), panel("a.md"), panel("b.md")], "a.md", "right")).toEqual(["b.md"]);
  });

  it("takes nothing from the rightmost tab", () => {
    expect(closeBatch(strip, "c.md", "right")).toEqual([]);
  });

  it("takes nothing for a tab the strip no longer holds", () => {
    expect(closeBatch(strip, "z.md", "others")).toEqual([]);
  });
});

describe("buildTabMenu", () => {
  it("keeps close-others visible but disabled on the only tab, and drops close-right", () => {
    const rows = buildTabMenu({ panels: [panel("a.md")], key: "a.md" }, t);

    expect(rows.map(row => row.id)).toEqual([
      TAB_MENU_ACTION.reference,
      TAB_MENU_ACTION.close,
      TAB_MENU_ACTION.closeOthers,
    ]);
    expect(rows[1]?.disabled).toBeUndefined();
    expect(rows[2]?.disabled).toBe(true);
    expect(rows[2]?.reason).toBe("menu.tab.closeOthers.reason");
  });

  it("enables close-others and adds close-right when tabs sit to the right", () => {
    const rows = buildTabMenu({ panels: [panel("a.md"), panel("b.md")], key: "a.md" }, t);

    expect(rows.map(row => row.id)).toEqual([
      TAB_MENU_ACTION.reference,
      TAB_MENU_ACTION.close,
      TAB_MENU_ACTION.closeOthers,
      TAB_MENU_ACTION.closeRight,
    ]);
    expect(rows[1]?.disabled).toBeUndefined();
  });

  it("offers nothing for a tab the strip no longer holds", () => {
    expect(buildTabMenu({ panels: [panel("a.md")], key: "z.md" }, t)).toEqual([]);
  });
});
