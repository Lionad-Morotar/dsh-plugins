// @vitest-environment jsdom
/**
 * The preview's find bar.
 *
 * What is worth pinning is the counter's honesty: it always names a hit that
 * the reader can actually reach, it says the scope is the current page, and
 * stepping wraps instead of running off the end into "4/3".
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createOffsetSurface } from "../src/client/find-surface.ts";
import { PreviewFindBar } from "../src/client/preview-find.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

describe("preview find bar", () => {
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

  /** Mount the bar over a fixed page and return the selection log. */
  async function show(text: string): Promise<{ selected: [number, number][]; close: () => number }> {
    const selected: [number, number][] = [];
    let closed = 0;
    const surface = createOffsetSurface({
      text: () => text,
      select: (from, to) => selected.push([from, to]),
      clear: () => selected.push([-1, -1]),
    });
    await act(async () => {
      root.render(
        createElement(PreviewFindBar, {
          t,
          surface: () => surface,
          stamp: "page-1",
          onClose: () => {
            closed += 1;
          },
        }),
      );
    });
    return { selected, close: () => closed };
  }

  async function type(value: string): Promise<void> {
    const input = host.querySelector<HTMLInputElement>('[data-testid="fs-preview-find-input"]');
    if (input === null) throw new Error("no find input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      setter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  async function press(key: string, shift = false): Promise<void> {
    const bar = host.querySelector<HTMLElement>('[data-testid="fs-preview-find-bar"]');
    if (bar === null) throw new Error("no find bar");
    await act(async () => {
      bar.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey: shift, bubbles: true }));
    });
  }

  function counter(): string {
    return host.querySelector('[data-testid="fs-preview-find-count"]')?.textContent ?? "";
  }

  it("says the scope is the current page before anything is typed", async () => {
    await show("alpha");
    expect(counter()).toBe("preview.find.hint");
    expect(host.querySelector<HTMLElement>('[data-testid="fs-preview-find-count"]')?.title).toBe("preview.find.scope");
  });

  it("counts the hits and names the first one", async () => {
    const { selected } = await show("alpha beta alpha");
    await type("alpha");
    expect(counter()).toBe("preview.find.count");
    expect(selected.at(-1)).toEqual([0, 5]);
  });

  it("reports no match instead of a zero index", async () => {
    const { selected } = await show("alpha");
    await type("zeta");
    expect(counter()).toBe("preview.find.none");
    expect(selected).toEqual([]);
    expect(host.querySelector<HTMLButtonElement>('[data-testid="fs-preview-find-next"]')?.disabled).toBe(true);
  });

  it("steps to the next hit and wraps at the end", async () => {
    const { selected } = await show("alpha beta alpha");
    await type("alpha");
    await press("Enter");
    expect(selected.at(-1)).toEqual([11, 16]);
    await press("Enter");
    expect(selected.at(-1)).toEqual([0, 5]);
  });

  it("steps backwards with Shift+Enter", async () => {
    const { selected } = await show("alpha beta alpha");
    await type("alpha");
    await press("Enter", true);
    // From the first hit, backwards wraps to the last one.
    expect(selected.at(-1)).toEqual([11, 16]);
  });

  it("clears the query by closing on Escape", async () => {
    const { selected, close } = await show("alpha");
    await type("alpha");
    await press("Escape");
    expect(selected.at(-1)).toEqual([-1, -1]);
    expect(close()).toBe(1);
  });
});
