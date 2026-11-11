// @vitest-environment jsdom
/**
 * The preview toolbar as a breadcrumb.
 *
 * The bar used to print one opaque path string. These cases pin the wiring: the
 * crumb row replaces that string, the sibling flyout reaches the file service,
 * and the two conditions that make it inert (a commit version, a path outside
 * the workspace) stay inert.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PreviewPane, type PreviewPaneProps } from "../src/client/preview-pane.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

function entry(name: string, kind: "file" | "directory") {
  return { name, kind };
}

describe("preview toolbar breadcrumb", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  async function settle(): Promise<void> {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  async function mount(overrides: Partial<PreviewPaneProps> = {}): Promise<void> {
    const props = {
      sessionId: "s1",
      files: { list: async () => ({ entries: [] }), read: async () => ({ ok: true, value: { text: "x\n", offset: 1, lines: 1, eof: true } }) },
      path: "docs/guide/intro.md",
      t,
      ...overrides,
    } as PreviewPaneProps;
    await act(async () => {
      root.render(createElement(PreviewPane, props));
    });
    await settle();
  }

  async function click(node: Element | null | undefined): Promise<void> {
    await act(async () => {
      node?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await settle();
  }

  function crumbs(): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>('[data-testid="fs-preview-crumb"]'));
  }

  function flyout(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="fs-preview-crumbs"]');
  }

  function rows(): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>('[data-testid="fs-preview-crumb-peer"]'));
  }

  it("replaces the path string with one crumb per segment", async () => {
    await mount();
    expect(host.querySelector('[data-testid="fs-preview-path"]')).not.toBeNull();
    expect(crumbs().length).toBeGreaterThanOrEqual(3);
    expect(crumbs().map(node => node.textContent)).toEqual(["docs", "guide", "intro.md"]);
    expect(crumbs().at(-1)?.textContent).toBe("intro.md");
  });

  it("lists the file's own directory and hands a sibling back to the caller", async () => {
    const onOpenPeer = vi.fn();
    const list = vi.fn(async () => ({
      entries: [entry("intro.md", "file"), entry("setup.md", "file")],
      path: "docs/guide",
    }));
    await mount({ files: { list, read: async () => ({ ok: true, value: { text: "x\n", offset: 1, lines: 1, eof: true } }) }, onOpenPeer });

    await click(crumbs().at(-1));
    expect(flyout()).not.toBeNull();
    expect(list).toHaveBeenCalledWith("s1", "docs/guide");

    const setup = rows().find(row => row.textContent?.includes("setup.md"));
    await click(setup);
    expect(onOpenPeer).toHaveBeenCalledTimes(1);
    expect(onOpenPeer).toHaveBeenCalledWith("docs/guide/setup.md", "file");
  });

  it("stays inert when the caller offers no peer handler", async () => {
    await mount();
    for (const crumb of crumbs()) expect(crumb.tagName).toBe("SPAN");
    await click(crumbs().at(-1));
    expect(flyout()).toBeNull();
  });

  it("stays inert for a commit version", async () => {
    await mount({
      revision: "abc1234",
      git: { show: async () => ({ ok: true, value: { text: "x\n" } }) },
      onOpenPeer: () => {},
    });
    for (const crumb of crumbs()) expect(crumb.tagName).toBe("SPAN");
    await click(crumbs().at(-1));
    expect(flyout()).toBeNull();
  });

  it("stays inert for a path outside the workspace", async () => {
    await mount({ path: "/Users/x/a.ts", onOpenPeer: () => {} });
    expect(crumbs().length).toBeGreaterThan(0);
    for (const crumb of crumbs()) expect(crumb.tagName).toBe("SPAN");
    await click(crumbs().at(-1));
    expect(flyout()).toBeNull();
  });

  it("keeps naming the real target of a followed symbolic link", async () => {
    const real = "/Users/lionad/.claude/CLAUDE.md";
    const files = {
      list: async () => ({ entries: [] }),
      read: async (_session: string, target: string) =>
        target === real
          ? { ok: true, value: { text: "# real\n", offset: 1, lines: 1, eof: true } }
          : {
              ok: false,
              error: { code: "workspace-file/not-regular-file", message: "is a symlink", details: { kind: "symlink" } },
            },
    };
    await mount({ files, path: "CLAUDE.md", locate: async () => ({ absolutePath: real }) });

    const bar = host.querySelector<HTMLElement>('[data-testid="fs-preview-path"]');
    expect(bar?.getAttribute("data-link")).toBe("followed");
    expect(host.querySelector('[data-testid="fs-preview-link-target"]')?.textContent).toContain(real);
    // The link path is what the reader sees, so the crumbs follow it rather than
    // the real target sitting in the arrow.
    expect(crumbs().map(node => node.textContent)).toEqual(["CLAUDE.md"]);
  });
});
