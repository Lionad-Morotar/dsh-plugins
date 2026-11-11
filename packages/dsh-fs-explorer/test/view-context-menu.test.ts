// @vitest-environment jsdom
/**
 * The context menu end to end, over a fake workspace channel.
 *
 * What this file protects is the wiring between three pieces that are each
 * tested alone: the tree's gesture, the pure menu builder, and the host channel.
 * A menu that opens but dispatches nothing, or a copy that reports success
 * without touching the clipboard, would pass every unit test and still be
 * useless.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { WorkspaceCapabilities } from "../src/host/types.ts";
import { setMenuKitForTest, type HostMenuProps } from "../src/client/platform.ts";
import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";
import type { WorkspaceClient } from "../src/client/workspace-face.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** The listing the fake file service answers with. */
const LISTING = {
  ok: true as const,
  value: { entries: [{ name: "a.md", type: "file" }], truncated: false },
};

/** One recorded reveal call. */
interface RevealCall {
  readonly sessionId: string;
  readonly path: string;
}

/** A workspace channel that records what the view asked it to do. */
function fakeWorkspace(options: { readonly capabilities?: WorkspaceCapabilities } = {}): {
  readonly client: WorkspaceClient;
  readonly reveals: RevealCall[];
  readonly infos: string[];
} {
  const reveals: RevealCall[] = [];
  const infos: string[] = [];
  const capabilities: WorkspaceCapabilities = options.capabilities ?? { fileManager: "finder", canReveal: true };
  return {
    reveals,
    infos,
    client: {
      capabilities: async () => ({ ok: true, capabilities }),
      info: async (_sessionId, path) => {
        infos.push(path);
        return { ok: true, info: { absolutePath: `/workspace/${path}`, type: "file", exists: true } };
      },
      reveal: async (sessionId, path) => {
        reveals.push({ sessionId, path });
        return { ok: true };
      },
    },
  };
}

const workbench: WorkbenchFace = {
  version: 1,
  currentSessionId: () => "s1",
  openViewOrSwitch: () => ({ opened: false, focused: false }),
};

describe("file view context menu", () => {
  let host: HTMLDivElement;
  let root: Root;
  let clipboard: string[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    clipboard = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text: string) => void clipboard.push(text) },
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the view over one file and wait for the tree to list it. */
  async function mount(workspace: WorkspaceClient | undefined): Promise<void> {
    const View = createFsExplorerView({
      workbench,
      version: 1,
      t,
      files: () => ({ list: async () => LISTING }),
      status: () => undefined,
      ...(workspace === undefined ? {} : { workspace: () => workspace }),
    });
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
    });
    // The root listing lands on a microtask; the row has to exist before a
    // gesture can address it.
    await act(async () => {
      await Promise.resolve();
    });
  }

  /** The mounted row for one path. */
  function row(path: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-path="${path}"]`);
    if (found === null) throw new Error(`no row for ${path}`);
    return found;
  }

  /** Right-click one row and let the info probe settle. */
  async function rightClick(path: string): Promise<void> {
    await act(async () => {
      row(path).dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 40, clientY: 60 }),
      );
    });
    await act(async () => {
      await Promise.resolve();
    });
  }

  /** The menu row for one action id. */
  function menuItem(action: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-action="${action}"]`);
    if (found === null) throw new Error(`no menu row for ${action}`);
    return found;
  }

  it("opens the menu on a row with the platform's own reveal label", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("a.md");

    expect(host.querySelector('[data-testid="fx-menu"]')).not.toBeNull();
    expect(menuItem("reveal").textContent).toBe("menu.reveal.finder");
    expect(workspace.infos).toEqual(["a.md"]);
  });

  it("hands the host menu both anchor forms, whichever host version renders it", async () => {
    const captured: HostMenuProps[] = [];
    const Menu = (props: HostMenuProps): null => {
      captured.push(props);
      return null;
    };
    setMenuKitForTest({ Menu });
    try {
      await mount(fakeWorkspace().client);
      await rightClick("a.md");
    } finally {
      setMenuKitForTest(null);
    }

    const props = captured.at(-1);
    if (props === undefined) throw new Error("the host menu never rendered");
    // The pointer position is passed both ways: 0.2.2-rc.2 reads `anchorPoint`,
    // older hosts read only `getAnchorRect`.
    expect(props.anchorPoint).toEqual({ x: 40, y: 60 });
    expect(props.getAnchorRect).toBeTypeOf("function");
    expect(props.getAnchorRect?.()).toMatchObject({ x: 40, y: 60 });
  });

  it("copies the absolute path the host reported", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("a.md");

    // The copy submenu opens on its parent, then the absolute row runs.
    await act(async () => {
      menuItem("menu.copy").click();
    });
    await act(async () => {
      menuItem("copy.absolute").click();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(clipboard).toEqual(["/workspace/a.md"]);
    expect(host.querySelector('[data-testid="fx-notice"]')?.textContent).toBe("notice.copiedAbsolute");
    // The menu is a one-shot: it closes on the action.
    expect(host.querySelector('[data-testid="fx-menu"]')).toBeNull();
  });

  it("copies the workspace-relative path without asking the host", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("a.md");

    await act(async () => {
      menuItem("menu.copy").click();
    });
    await act(async () => {
      menuItem("copy.relative").click();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(clipboard).toEqual(["a.md"]);
    expect(host.querySelector('[data-testid="fx-notice"]')?.textContent).toBe("notice.copiedRelative");
  });

  it("reveals the row through the workspace channel", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("a.md");

    await act(async () => {
      menuItem("reveal").click();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(workspace.reveals).toEqual([{ sessionId: "s1", path: "a.md" }]);
    const notice = host.querySelector('[data-testid="fx-notice"]');
    expect(notice?.textContent).toBe("notice.revealed");
    expect(notice?.getAttribute("data-tone")).toBe("ok");
  });

  it("disables the reveal row when the host has no file manager", async () => {
    const workspace = fakeWorkspace({ capabilities: { fileManager: null, canReveal: false } });
    await mount(workspace.client);
    await rightClick("a.md");

    const reveal = menuItem("reveal");
    expect(reveal.getAttribute("aria-disabled")).toBe("true");
    expect(reveal.getAttribute("title")).toBe("menu.reveal.reason");
  });

  it("disables the reveal row when the view has no workspace channel", async () => {
    await mount(undefined);
    await rightClick("a.md");

    const reveal = menuItem("reveal");
    expect(reveal.getAttribute("aria-disabled")).toBe("true");
    // The absolute copy is unavailable too: only the host can say where the
    // path really lands.
    await act(async () => {
      menuItem("menu.copy").click();
    });
    expect(menuItem("copy.absolute").getAttribute("aria-disabled")).toBe("true");
  });

  it("offers the create rows on the tree's blank area", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("no scroller");
    await act(async () => {
      scroller.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 12, clientY: 300 }),
      );
    });

    const items = host.querySelectorAll('[data-testid="fx-menu-item"]');
    expect([...items].map(item => item.getAttribute("data-action"))).toEqual(["create.file", "create.folder"]);
    // The blank area has no path, so nothing to reveal or copy.
    expect(host.querySelector('[data-action="reveal"]')).toBeNull();
  });

  it("closes the menu on Escape", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("a.md");
    expect(host.querySelector('[data-testid="fx-menu"]')).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(host.querySelector('[data-testid="fx-menu"]')).toBeNull();
  });
});
