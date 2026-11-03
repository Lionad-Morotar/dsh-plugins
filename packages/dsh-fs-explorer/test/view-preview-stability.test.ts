// @vitest-environment jsdom
/**
 * The file view must hand the preview a stable locator.
 *
 * A fresh locator identity is indistinguishable from a different reader to the
 * pane, so evaluating the locator factory during render would rebuild the
 * loader and re-read the open file on every unrelated parent render. That is
 * the "preview keeps refreshing" failure: the README never changed, the view
 * simply rendered again.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";
import { VIEW_ID } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

describe("file view preview stability", () => {
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

  it("resolves the session locator once across parent renders", async () => {
    let locatorCalls = 0;
    const workbench: WorkbenchFace = {
      version: 1,
      currentSessionId: () => "s1",
      openViewOrSwitch: () => ({ opened: true, focused: true }),
    };
    const files = () => ({
      list: async () => ({ entries: [{ name: "README.md", kind: "file" }] }),
      read: async () => ({ text: "# readme", offset: 1, total: 1, eof: true }),
    });
    const View = createFsExplorerView({
      workbench,
      version: 1,
      t,
      files,
      status: () => undefined,
      locate: () => {
        locatorCalls += 1;
        return async () => undefined;
      },
    });

    const render = async (): Promise<void> => {
      await act(async () => {
        root.render(
          createElement(View, {
            sessionId: "s1",
            viewRequest: { view: VIEW_ID, focus: "path:README.md:1" },
            completeViewRequest: () => undefined,
          }),
        );
      });
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
    };

    await render();
    const afterFirst = locatorCalls;
    await render();

    expect(afterFirst).toBe(1);
    expect(locatorCalls).toBe(afterFirst);
  });
});
