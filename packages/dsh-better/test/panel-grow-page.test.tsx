/**
 * The layout settings page's rendered surface.
 *
 * One switch and one hint, no submit button: the page writes the preference the
 * moment the box changes, and the runtime re-reads that document on the next
 * panel open. These cases pin the visible promises — the switch mirrors the
 * stored document, and every word on the page comes from the dictionary rather
 * than from the component.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DICTIONARIES } from "../src/client/dictionaries.ts";
import { PanelGrowSettingsPage, panelGrowCopy, type PanelGrowPageProps } from "../src/client/panel-grow-page.tsx";
import type { PanelGrowPreference } from "../src/client/panel-grow.ts";

/** Resolve a key against the shipped Chinese dictionary; a missing key surfaces in the markup. */
function zh(key: string): string {
  return DICTIONARIES.zh?.[key] ?? `missing:${key}`;
}

/** Render the page for one stored preference. */
function render(preference: PanelGrowPreference, props: Partial<PanelGrowPageProps> = {}): string {
  return renderToStaticMarkup(
    <PanelGrowSettingsPage
      preference={() => preference}
      save={() => {}}
      translate={zh}
      {...props}
    />,
  );
}

describe("layout settings page", () => {
  it("renders the switch on by default with every string from the dictionary", () => {
    const html = render({ expandWindow: true });
    expect(html).toContain('data-testid="panel-grow-section"');
    expect(html).toContain('data-testid="panel-grow-switch"');
    expect(html).toContain("checked");
    expect(html).toContain("布局");
    expect(html).toContain("打开右侧栏时窗口向右扩展");
    expect(html).toContain(
      "仅在桌面端、右侧栏以普通方式打开且屏幕右侧有空间时生效；全屏与浏览器端保持原生布局。",
    );
  });

  it("renders the switch off when the stored document says so", () => {
    const html = render({ expandWindow: false });
    expect(html).toContain('data-testid="panel-grow-switch"');
    expect(html).not.toContain("checked");
  });

  it("maps the page copy onto the three dictionary keys", () => {
    const copy = panelGrowCopy((key) => `sentinel:${key}`);
    expect(copy).toEqual({
      heading: "sentinel:layout.heading",
      row: "sentinel:layout.expandWindow",
      hint: "sentinel:layout.expandWindowHint",
    });
  });

  it("reads every label through translate instead of hard-coding text", () => {
    const html = render({ expandWindow: true }, { translate: (key) => `t:${key}` });
    expect(html).toContain("t:layout.heading");
    expect(html).toContain("t:layout.expandWindow");
    expect(html).toContain("t:layout.expandWindowHint");
    expect(html).not.toContain("布局");
  });
});
