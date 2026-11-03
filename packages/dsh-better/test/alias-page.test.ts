/**
 * The alias settings page's rendered surface.
 *
 * The page has no submit button: every keystroke writes through the shared store.
 * These cases mount it with a real store and pin the two visible promises — the
 * prefix switch reflects the document, and the table exposes one editable row per
 * alias with keyword, target and params in separate cells.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createAliasSettingsPage } from "../src/client/alias-page.tsx";
import { createAliasStore, type AliasRow } from "../src/client/alias-store.ts";

/** Translation keys resolve to readable sentinels. */
function translate(key: string, params?: Record<string, string | number>): string {
  if (key === "alias.prefix.on") return `on:${params?.example ?? ""}`;
  if (key === "alias.prefix.off") return `off:${params?.example ?? ""}`;
  if (key === "alias.remove") return `remove:${params?.keyword ?? ""}`;
  return key;
}

/** Render the page for one store. */
function render(rows: readonly AliasRow[], prefix = true): string {
  const store = createAliasStore(undefined, () => "fresh");
  for (const row of rows) {
    const id = store.addRow();
    store.updateRow(id, { keyword: row.keyword, target: row.target, params: row.params });
  }
  store.setPrefix(prefix);
  const Page = createAliasSettingsPage({ store, translate });
  return renderToStaticMarkup(createElement(Page));
}

describe("alias settings page", () => {
  it("renders the prefix switch as checked", () => {
    const html = render([], true);
    expect(html).toContain('data-testid="alias-prefix"');
    expect(html).toContain("checked");
    expect(html).toContain("alias.prefix.title");
  });

  it("renders one row with keyword, target and params inputs", () => {
    const html = render([{ id: "a", keyword: "wf", target: "flow-workflow", params: "run" }]);
    expect(html).toContain('data-testid="alias-row"');
    expect(html).toContain('data-testid="alias-keyword"');
    expect(html).toContain('value="wf"');
    expect(html).toContain('value="flow-workflow"');
    expect(html).toContain('value="run"');
    expect(html).toContain("alias.add");
  });

  it("renders the empty-state example and no row", () => {
    const html = render([], false);
    expect(html).toContain('data-testid="alias-empty"');
    expect(html).not.toContain('data-testid="alias-row"');
    expect(html).toContain("off:wf");
  });
});
