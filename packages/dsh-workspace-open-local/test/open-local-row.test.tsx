/**
 * The split row is a controlled view: it renders what it is given and reports
 * gestures back. These cases pin the structure a later controller will query
 * and the four gestures it will listen for.
 */
import { createElement, type ReactElement } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  OpenLocalRow,
  type OpenLocalApplication,
  type OpenLocalRowProps,
} from "../src/client/OpenLocalRow.tsx";
import { insertOpenLocalRowStyles, OPEN_LOCAL_ROW_STYLES } from "../src/client/styles.ts";

const apps: readonly OpenLocalApplication[] = [
  { id: "vscode", label: "Visual Studio Code", iconUrl: "open-in-app/icon/vscode" },
  { id: "finder", label: "Finder", iconUrl: "open-in-app/icon/finder" },
];

function markup(overrides: Partial<OpenLocalRowProps> = {}): string {
  return renderToStaticMarkup(createElement(OpenLocalRow, { path: "/work/repo", applications: apps, ...overrides }));
}

const mounts: Root[] = [];

afterEach(() => {
  for (const root of mounts) root.unmount();
  mounts.length = 0;
  document.body.replaceChildren();
});

/**
 * Mount into jsdom so clicks and keys actually dispatch.
 *
 * `root.render` commits asynchronously, so a click in the same turn would land
 * on an empty container. `flushSync` makes the commit happen before we return.
 */
function mount(element: ReactElement): HTMLElement {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  mounts.push(root);
  flushSync(() => {
    root.render(element);
  });
  return host;
}

describe("open local row structure", () => {
  it("renders nothing when the host reported no application", () => {
    expect(markup({ applications: [] })).toBe("");
  });

  it("marks the remembered application as the default and gives every app its icon", () => {
    const html = markup({ defaultApplication: "finder", menuOpen: true });
    expect(html).toContain('data-testid="open-local-main"');
    expect(html).toContain('data-testid="open-local-choose"');
    expect(html).toContain('data-app-id="vscode"');
    expect(html).not.toContain('data-app-id="vscode" data-default="true"');
    expect(html).toContain('src="open-in-app/icon/vscode"');
    expect(html).toContain('src="open-in-app/icon/finder"');
    expect(html).toContain('data-app-id="finder" data-default="true"');
  });

  it("falls back to the first application when the remembered id is unknown", () => {
    const html = markup({ defaultApplication: "gone", menuOpen: true });
    expect(html).toContain('data-app-id="vscode" data-default="true"');
    expect(html).toContain("用 Visual Studio Code 打开 /work/repo");
  });

  it("disables both segments and marks them busy while launching", () => {
    const html = markup({ phase: "launching" });
    const buttons = html.match(/<button[^>]*>/g) ?? [];
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).toContain("disabled");
      expect(button).toContain('aria-busy="true"');
    }
  });

  it("renders the failure copy and honours label overrides", () => {
    const html = markup({
      error: "打不开",
      menuOpen: true,
      labels: { open: "Open here", defaultMark: "(default)", choose: "Pick" },
    });
    expect(html).toContain("打不开");
    expect(html).toContain("Open here");
    expect(html).toContain("(default)");
    expect(html).toContain('aria-label="Pick"');
    expect(html).toContain('data-testid="open-local-menu"');
    expect(html).toContain('role="menu"');
    expect(html).toContain('role="menuitemradio"');
  });

  it("omits the menu entirely while it is closed", () => {
    expect(markup({ menuOpen: false })).not.toContain('data-testid="open-local-menu"');
  });
});

describe("open local row stylesheet", () => {
  it("inserts one sheet and reuses it on the second call", () => {
    const doc = document.implementation.createHTMLDocument("row");
    const remove = insertOpenLocalRowStyles(doc);
    const again = insertOpenLocalRowStyles(doc);
    const sheets = doc.querySelectorAll('style[data-plugin="dsh-workspace-open-local"]');
    expect(sheets).toHaveLength(1);
    expect(sheets[0]?.textContent).toBe(OPEN_LOCAL_ROW_STYLES);
    again();
    expect(doc.querySelectorAll("style")).toHaveLength(1);
    remove();
    expect(doc.querySelectorAll("style")).toHaveLength(0);
  });
});

describe("open local row gestures", () => {
  it("reports the primary click, the menu toggle, a pick and Escape", () => {
    const onOpen = vi.fn();
    const onToggleMenu = vi.fn();
    const onPickApplication = vi.fn();
    const onDismissMenu = vi.fn();
    const host = mount(
      createElement(OpenLocalRow, {
        path: "/work/repo",
        applications: apps,
        menuOpen: true,
        onOpen,
        onToggleMenu,
        onPickApplication,
        onDismissMenu,
      }),
    );

    host.querySelector<HTMLButtonElement>('[data-testid="open-local-main"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-testid="open-local-choose"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-app-id="finder"]')?.click();
    host.querySelector('[data-testid="open-local-menu"]')?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    expect(onOpen).toHaveBeenCalledOnce();
    expect(onToggleMenu).toHaveBeenCalledExactlyOnceWith(false);
    expect(onPickApplication).toHaveBeenCalledExactlyOnceWith("finder");
    expect(onDismissMenu).toHaveBeenCalledOnce();
  });
});
