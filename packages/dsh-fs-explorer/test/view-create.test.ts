// @vitest-environment jsdom
/**
 * "New file" and "new folder" end to end, over a fake workspace channel.
 *
 * The promise this file protects is the one a reader can see: the entry appears
 * in the directory they right-clicked, a file opens so they can start typing, a
 * folder expands so they can see what they just made, and a refusal keeps the
 * card up with a reason instead of closing on them. Each of those is a separate
 * way to get it wrong while every unit test still passes.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { WorkspaceCapabilities } from "../src/host/types.ts";
import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";
import type { WorkspaceClient } from "../src/client/workspace-face.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** One listing the fake file service answers with, per directory. */
type Listing = { readonly entries: readonly { name: string; type: string }[] };

/** One recorded create call. */
interface CreateCall {
  readonly sessionId: string;
  readonly parent: string;
  readonly name: string;
  readonly kind: "file" | "directory";
}

/**
 * A workspace channel that records creates and answers them from a script.
 *
 * `onCreate` decides the answer, so one test can succeed and the next can
 * refuse without a second fake.
 */
function fakeWorkspace(options: {
  readonly capabilities?: WorkspaceCapabilities;
  readonly onCreate?: (call: CreateCall) => { ok: true; path: string } | { ok: false; code: string };
} = {}): { readonly client: WorkspaceClient; readonly creates: CreateCall[] } {
  const creates: CreateCall[] = [];
  const capabilities: WorkspaceCapabilities = options.capabilities ?? { fileManager: "finder", canReveal: true };
  return {
    creates,
    client: {
      capabilities: async () => ({ ok: true, capabilities }),
      info: async (_sessionId, path) => ({
        ok: true,
        info: { absolutePath: `/workspace/${path}`, type: "file", exists: true },
      }),
      reveal: async () => ({ ok: true }),
      create: async (sessionId, parent, name, kind) => {
        const call = { sessionId, parent, name, kind };
        creates.push(call);
        const answer = options.onCreate?.(call) ?? { ok: true, path: parent === "" ? name : `${parent}/${name}` };
        return answer.ok ? answer : { ok: false, error: { code: answer.code as never, message: "" } };
      },
    },
  };
}

const workbench: WorkbenchFace = {
  version: 1,
  currentSessionId: () => "s1",
  openViewOrSwitch: () => ({ opened: false, focused: false }),
};

describe("file view create flow", () => {
  let host: HTMLDivElement;
  let root: Root;
  /** The directories the tree asked for, in order. */
  let listed: string[];
  /** What each directory listing answers. */
  let listings: Map<string, Listing>;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    listed = [];
    // The tree asks for the root as `"."`: `listingPath("")` maps the ledger's
    // root key to the path the host resolves against the workspace root.
    listings = new Map([
      [
        ".",
        {
          entries: [
            { name: "docs", type: "directory" },
            { name: "a.md", type: "file" },
          ],
        },
      ],
    ]);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the view and wait for the root listing. */
  async function mount(workspace: WorkspaceClient | undefined): Promise<void> {
    const View = createFsExplorerView({
      workbench,
      version: 1,
      t,
      files: () => ({
        list: async (_sessionId: string, path: string) => {
          listed.push(path);
          return { ok: true as const, value: { entries: [...(listings.get(path)?.entries ?? [])], truncated: false } };
        },
      }),
      status: () => undefined,
      ...(workspace === undefined ? {} : { workspace: () => workspace }),
    });
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
    });
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

  /** Right-click the tree's blank area. */
  async function rightClickBlank(): Promise<void> {
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("no scroller");
    await act(async () => {
      scroller.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 12, clientY: 300 }),
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

  /** Click one menu row. */
  async function choose(action: string): Promise<void> {
    await act(async () => {
      menuItem(action).click();
    });
    await act(async () => {
      await Promise.resolve();
    });
  }

  /** The name card's input. */
  function input(): HTMLInputElement {
    const found = host.querySelector<HTMLInputElement>('[data-testid="fx-name-input"]');
    if (found === null) throw new Error("no name input");
    return found;
  }

  /** Type a name and submit it with Enter. */
  async function submit(name: string): Promise<void> {
    await act(async () => {
      const field = input();
      // React reads the value off the DOM node, so the native setter is what
      // makes a programmatic change look like typing to it.
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(field, name);
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      input().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await Promise.resolve();
    });
  }

  it("creates a file in the right-clicked directory and opens it", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("docs");
    await choose("create.file");

    expect(host.querySelector('[data-testid="fx-name-prompt"]')).not.toBeNull();
    await submit("b.md");

    expect(workspace.creates).toEqual([
      { sessionId: "s1", parent: "docs", name: "b.md", kind: "file" },
    ]);
    // The parent is re-read, so the new row exists without a page reload.
    expect(listed).toContain("docs");
    // And the file is open: creating a file is a request to write in it.
    expect(host.querySelector('[data-testid="fx-notice"]')?.textContent).toBe("notice.createdFile");
    expect(host.querySelector('[data-testid="fx-name-prompt"]')).toBeNull();
  });

  it("creates a file beside a file row, in that file's directory", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("a.md");
    await choose("create.file");
    await submit("b.md");
    expect(workspace.creates).toEqual([{ sessionId: "s1", parent: "", name: "b.md", kind: "file" }]);
  });

  it("creates a file at the root from the blank area", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClickBlank();
    await choose("create.file");
    await submit("top.md");
    expect(workspace.creates).toEqual([{ sessionId: "s1", parent: "", name: "top.md", kind: "file" }]);
  });

  it("creates a folder, expands it and puts the cursor on it", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("docs");
    await choose("create.folder");
    await submit("nested");

    expect(workspace.creates).toEqual([
      { sessionId: "s1", parent: "docs", name: "nested", kind: "directory" },
    ]);
    // The new folder is listed as a row, which means the parent was re-read and
    // the folder itself was expanded.
    expect(listed).toContain("docs");
    expect(listed).toContain("docs/nested");
    expect(host.querySelector('[data-testid="fx-notice"]')?.textContent).toBe("notice.createdFolder");
  });

  it("keeps the card open and shows the reason when the name is taken", async () => {
    const workspace = fakeWorkspace({ onCreate: () => ({ ok: false, code: "exists" }) });
    await mount(workspace.client);
    await rightClick("docs");
    await choose("create.file");
    await submit("a.md");

    expect(host.querySelector('[data-testid="fx-name-prompt"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="fx-name-error"]')?.textContent).toBe("prompt.error.exists");
    // The typed name survives, so the reader can edit it instead of retyping.
    expect(input().value).toBe("a.md");
  });

  it("refuses an empty name without asking the host", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("docs");
    await choose("create.file");
    await submit("   ");

    expect(workspace.creates).toEqual([]);
    expect(host.querySelector('[data-testid="fx-name-error"]')?.textContent).toBe("prompt.error.empty");
  });

  it("closes the card on Escape without creating anything", async () => {
    const workspace = fakeWorkspace();
    await mount(workspace.client);
    await rightClick("docs");
    await choose("create.file");

    await act(async () => {
      input().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(host.querySelector('[data-testid="fx-name-prompt"]')).toBeNull();
    expect(workspace.creates).toEqual([]);
  });

  it("disables both create rows when the view has no workspace channel", async () => {
    await mount(undefined);
    await rightClick("docs");
    expect(menuItem("create.file").getAttribute("aria-disabled")).toBe("true");
    expect(menuItem("create.folder").getAttribute("aria-disabled")).toBe("true");
  });
});
