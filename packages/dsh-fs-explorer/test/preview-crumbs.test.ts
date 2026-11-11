// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PREVIEW_CRUMBS_COPY,
  PreviewCrumbs,
  type PreviewCrumbsProps,
} from "../src/client/preview-crumbs.tsx";
import { insertStyles } from "../src/client/styles.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// The flyout's layout rules live in the package stylesheet, so the geometry
// assertions below only mean anything once that sheet is in the document. One
// insertion for the whole file: `insertStyles` is idempotent per document, and
// re-inserting per case would leave the sheet's disposer racing the assertions.
insertStyles(document);

const t = (key: string): string => key;

function entry(name: string, kind: "file" | "directory") {
  return { name, kind };
}

describe("PreviewCrumbs", () => {
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

  async function mount(overrides: Partial<PreviewCrumbsProps> = {}): Promise<void> {
    const props = {
      path: "a/b/c.ts",
      t,
      interactive: true,
      onOpenPeer: () => {},
      ...overrides,
    } as PreviewCrumbsProps;
    await act(async () => {
      root.render(createElement(PreviewCrumbs, props));
    });
  }

  async function click(node: Element): Promise<void> {
    await act(async () => {
      node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  }

  function crumbs(): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>('[data-testid="fs-preview-crumb"]'));
  }

  function rows(): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>('[data-testid="fs-preview-crumb-peer"]'));
  }

  function flyout(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="fs-preview-crumbs"]');
  }

  function status(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="fs-preview-crumb-status"]');
  }

  function names(): (string | null | undefined)[] {
    return rows().map((row) => row.querySelector(".fx-peers-name")?.textContent);
  }

  it("renders one crumb per segment with a separator between them", async () => {
    await mount();
    expect(crumbs()).toHaveLength(3);
    expect(crumbs().map((node) => node.textContent)).toEqual(["a", "b", "c.ts"]);
    const separators = Array.from(host.querySelectorAll(".fx-crumb-sep"));
    expect(separators).toHaveLength(2);
    expect(separators.map((node) => node.textContent)).toEqual([">", ">"]);
    expect(separators[0]?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders plain spans and explains itself when it cannot be interactive", async () => {
    await mount({ interactive: false, unavailableReason: "提交版本" });
    expect(crumbs()).toHaveLength(3);
    for (const crumb of crumbs()) expect(crumb.tagName).toBe("SPAN");
    expect(host.querySelector(".fx-preview-crumbs")?.getAttribute("title")).toBe("提交版本");
  });

  it("opts its controls out of the command panel's reference links", async () => {
    // Every crumb carries the path in `title`, which the reference-link
    // recogniser would otherwise claim as a document reference before the
    // crumb's own click can open the sibling panel.
    await mount();
    expect(host.querySelector(".fx-preview-crumbs")?.getAttribute("data-dcp-ref-skip")).toBe("");
  });

  it("lists the clicked crumb's siblings with the current one highlighted", async () => {
    const list = vi.fn(async () => ({
      entries: [entry("c.ts", "file"), entry("b", "directory")],
      path: "a",
    }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(list).toHaveBeenCalledWith("s1", "a");
    expect(flyout()).not.toBeNull();
    expect(names()).toEqual(["b", "c.ts"]);
    expect(rows()[0]?.getAttribute("data-current")).toBe("true");
    expect(rows()[1]?.getAttribute("data-current")).toBeNull();
  });

  it("lists the workspace root for the first crumb through the host's dot path", async () => {
    // The host rejects an empty path with "path is required"; the tree asks for
    // the root as ".", so the flyout's first level has to spell it that way too.
    const list = vi.fn(async () => ({ entries: [entry("a", "directory")], path: "" }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[0] as HTMLElement);
    expect(list).toHaveBeenCalledWith("s1", ".");
    expect(flyout()).not.toBeNull();
    expect(names()).toEqual(["a"]);
    expect(host.querySelector('[data-testid="fs-preview-crumb-head"]')?.textContent).toBe("./");
  });

  it("keeps the flyout mounted when the pointer goes down on another crumb", async () => {
    // A real click starts with pointerdown. Closing the flyout there unmounts
    // it mid-gesture and the browser stops synthesising the click on the crumb,
    // so switching levels by clicking a sibling crumb would silently do nothing.
    const list = vi.fn(async () => ({ entries: [entry("a", "directory")] }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(flyout()).not.toBeNull();
    await act(async () => {
      crumbs()[2]?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    });
    expect(flyout()).not.toBeNull();
    await click(crumbs()[2] as HTMLElement);
    expect(list).toHaveBeenLastCalledWith("s1", "a/b");
  });

  it("opens the peer file and closes the flyout", async () => {
    const onOpenPeer = vi.fn();
    const list = vi.fn(async () => ({ entries: [entry("c.ts", "file")], path: "a" }));
    await mount({ files: { list }, sessionId: "s1", onOpenPeer });
    await click(crumbs()[1] as HTMLElement);
    await click(rows()[0] as HTMLElement);
    expect(onOpenPeer).toHaveBeenCalledTimes(1);
    expect(onOpenPeer).toHaveBeenCalledWith("a/c.ts", "file");
    expect(flyout()).toBeNull();
  });

  it("drills into a directory row without opening it as a peer", async () => {
    const onOpenPeer = vi.fn();
    const list = vi.fn(async (_sessionId: string, dir: string) =>
      dir === "a"
        ? { entries: [entry("b", "directory")], path: "a" }
        : { entries: [entry("d.ts", "file")], path: "a/b" },
    );
    await mount({ files: { list }, sessionId: "s1", onOpenPeer });
    await click(crumbs()[1] as HTMLElement);
    await click(rows()[0] as HTMLElement);
    expect(onOpenPeer).not.toHaveBeenCalled();
    expect(list).toHaveBeenLastCalledWith("s1", "a/b");
    expect(host.querySelector('[data-testid="fs-preview-crumb-head"]')?.textContent).toBe("a/b");
    expect(names()).toEqual(["d.ts"]);
  });

  it("says so when the directory is empty", async () => {
    const list = vi.fn(async () => ({ entries: [] }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(status()?.textContent).toBe("preview.crumbs.empty");
  });

  it("says so when the listing fails", async () => {
    const list = vi.fn(async () => {
      throw new Error("boom");
    });
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(status()?.textContent).toBe("preview.crumbs.failed");
  });

  it("shows the loading line while the listing is still in flight", async () => {
    const list = vi.fn(() => new Promise(() => {}));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(status()?.textContent).toBe("preview.crumbs.loading");
  });

  it("notes how many entries a truncated listing kept", async () => {
    const list = vi.fn(async () => ({ entries: [entry("c.ts", "file")], truncated: true }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(host.querySelector(".fx-peers-status")?.textContent).toBe(
      "preview.crumbs.truncated".replace("{count}", "1"),
    );
  });

  it("closes on Escape and hands focus back to the crumb that opened it", async () => {
    const list = vi.fn(async () => ({ entries: [entry("c.ts", "file")] }));
    await mount({ files: { list }, sessionId: "s1" });
    const trigger = crumbs()[1] as HTMLElement;
    await click(trigger);
    expect(flyout()).not.toBeNull();
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(flyout()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when the pointer goes down outside it", async () => {
    const list = vi.fn(async () => ({ entries: [entry("c.ts", "file")] }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(flyout()).not.toBeNull();
    await act(async () => {
      document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });
    expect(flyout()).toBeNull();
  });

  it("moves focus between rows with the arrow keys", async () => {
    const list = vi.fn(async () => ({
      entries: [entry("b", "directory"), entry("c.ts", "file")],
    }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);
    expect(document.activeElement).toBe(rows()[0]);
    await act(async () => {
      rows()[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    expect(document.activeElement).toBe(rows()[1]);
    await act(async () => {
      rows()[1]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    });
    expect(document.activeElement).toBe(rows()[0]);
  });

  it("keeps the head and the rows at full height when the list overflows", async () => {
    // Eleven peers push the card past its 300px max-height, which is the case
    // that used to squeeze the head to 8px and clip its own text.
    const entries = Array.from({ length: 11 }, (_unused, index) => entry(`f${index}.ts`, "file"));
    const list = vi.fn(async () => ({ entries, path: "a" }));
    await mount({ files: { list }, sessionId: "s1" });
    await click(crumbs()[1] as HTMLElement);

    const head = host.querySelector<HTMLElement>(".fx-peers-head");
    const row = rows()[0];
    expect(head).not.toBeNull();
    expect(row).toBeDefined();
    // A shrink factor above 0 is what let the column flex container flatten
    // these children once the content exceeded max-height.
    expect(getComputedStyle(head as HTMLElement).flexShrink).toBe("0");
    expect(getComputedStyle(row as HTMLElement).flexShrink).toBe("0");
    expect(getComputedStyle(head as HTMLElement).position).toBe("sticky");
  });

  it("carries both locales for every string it asks for", () => {
    const keys = [
      "preview.crumbs.open",
      "preview.crumbs.loading",
      "preview.crumbs.empty",
      "preview.crumbs.failed",
      "preview.crumbs.truncated",
    ];
    for (const key of keys) {
      expect(PREVIEW_CRUMBS_COPY.zh[key], key).toBeTruthy();
      expect(PREVIEW_CRUMBS_COPY.en[key], key).toBeTruthy();
    }
    expect(PREVIEW_CRUMBS_COPY.zh["preview.crumbs.truncated"]).toContain("{count}");
    expect(PREVIEW_CRUMBS_COPY.en["preview.crumbs.truncated"]).toContain("{count}");
  });
});
