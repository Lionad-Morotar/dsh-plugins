// @vitest-environment jsdom
/**
 * The header's Workspace switch as the reader meets it.
 *
 * The panel is mounted through `createRoot` because the decisions worth pinning
 * are behavioural: whether the repository name is a control at all, which row a
 * click switches to, and whether picking the row already standing there writes
 * anything. The switch itself is a seam handed in by the entry, so the host is
 * never needed here.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { act, createElement } from "react";
import { createPortal } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGitExplorerView, type ViewWiring } from "../src/client/view.tsx";
import { setBranchKitForTest, type BranchKit } from "../src/client/platform.ts";
import type { WorkspaceChoice, WorkspaceSwitchWiring } from "../src/client/workspace-switch.ts";
import type { GitRemoteFace, RemoteResult } from "../src/client/wire.ts";
import type { GitCommitNode, GitSnapshot, GitSnapshotResult } from "../src/host/types.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

const ROOT = "/Users/lionad/Github/dsh-plugins";

const ITEMS: readonly WorkspaceChoice[] = [
  { workspaceId: "w1", title: "dsh-plugins", path: ROOT },
  { workspaceId: "w2", title: "Perch Docs", path: "/Users/lionad/Documents/perch-docs" },
];

const KIT: BranchKit = {
  createPortal: (children, container) => createPortal(children, container),
};

function commit(hash: string): GitCommitNode {
  return { hash, parents: [], author: "Alice", time: 1_700_000_000, subject: `subject ${hash}`, refs: [] };
}

function snapshot(root = ROOT): GitSnapshot {
  return {
    root,
    isRepository: true,
    head: { hash: "head-1", branch: "main", detached: false, ahead: 0, behind: 0 },
    branches: [],
    changes: [],
    stats: [],
    status: "",
    commits: [commit("head-1")],
    lanes: [],
    remotes: [],
    counts: { commits: 1, branches: 0, changes: 0 },
  };
}

function remoteFace(root = ROOT): GitRemoteFace {
  return {
    snapshot: vi.fn(async (): Promise<RemoteResult<GitSnapshotResult>> => ({
      ok: true,
      value: { ok: true, snapshot: snapshot(root) },
    })),
    query: vi.fn(async () => ({ ok: true as const, value: { ok: true as const, page: { commits: [], lanes: [], hasMore: false } } })),
    commit: vi.fn(async () => ({ ok: true as const, value: { ok: false as const, error: { code: "x", message: "x" } } })),
    branches: vi.fn(),
    switchBranch: vi.fn(),
    show: vi.fn(),
  } as unknown as GitRemoteFace;
}

function wiring(face: GitRemoteFace, workspaces?: WorkspaceSwitchWiring): ViewWiring {
  return {
    workbench: { version: 1, currentSessionId: () => "s1" },
    version: 1,
    t,
    remote: () => face,
    ...(workspaces === undefined ? {} : { workspaces }),
  };
}

describe("the header's Workspace switch", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    setBranchKitForTest(KIT);
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    document.body.innerHTML = "";
    setBranchKitForTest(null);
  });

  async function mount(face: GitRemoteFace, workspaces?: WorkspaceSwitchWiring): Promise<void> {
    const View = createGitExplorerView(wiring(face, workspaces));
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function trigger(): HTMLButtonElement | null {
    return document.querySelector<HTMLButtonElement>('[data-testid="gx-workspace-switch"]');
  }

  function panel(): HTMLElement | null {
    return document.querySelector<HTMLElement>('[data-testid="gx-workspace-panel"]');
  }

  function row(workspaceId: string): HTMLButtonElement | null {
    return document.querySelector<HTMLButtonElement>(`[data-testid="gx-workspace-row-${workspaceId}"]`);
  }

  async function open(): Promise<void> {
    const button = trigger();
    if (button === null) throw new Error("trigger missing");
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  }

  async function click(element: HTMLElement): Promise<void> {
    await act(async () => {
      element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  }

  it("renders the repository name as a plain span when the host has no Workspace services", async () => {
    await mount(remoteFace());
    expect(trigger()).toBeNull();
    const repo = host.querySelector(".gx-repo");
    expect(repo?.tagName).toBe("SPAN");
    expect(repo?.textContent).toBe("dsh-plugins");
  });

  it("stays a plain span when only one of the two services is there", async () => {
    const listOnly: WorkspaceSwitchWiring = {
      list: () => ITEMS,
      startSession: undefined,
    };
    await mount(remoteFace(), listOnly);
    expect(trigger()).toBeNull();
    expect(host.querySelector(".gx-repo")?.tagName).toBe("SPAN");
  });

  it("stays a plain span while the host's own probe reports the services absent", async () => {
    // The entry hands in a getter rather than a boolean, so the name has to
    // follow what the host reports at render time, not at build time.
    await mount(remoteFace(), { available: () => false, list: () => ITEMS, startSession: vi.fn() });
    expect(trigger()).toBeNull();
    expect(host.querySelector(".gx-repo")?.tagName).toBe("SPAN");
  });

  it("renders a button carrying the full root as its title when both services are there", async () => {
    const startSession = vi.fn();
    await mount(remoteFace(), { list: () => ITEMS, startSession });
    const button = trigger();
    expect(button).not.toBeNull();
    expect(button?.className).toContain("gx-repo");
    expect(button?.className).toContain("gx-repo-switch");
    expect(button?.getAttribute("aria-haspopup")).toBe("listbox");
    expect(button?.getAttribute("title")).toBe(ROOT);
  });

  it("marks the row whose path is the repository root, ignoring a trailing separator", async () => {
    await mount(remoteFace(`${ROOT}/`), { list: () => ITEMS, startSession: vi.fn() });
    await open();
    expect(row("w1")?.getAttribute("data-current")).toBe("true");
    expect(row("w2")?.getAttribute("data-current")).toBeNull();
  });

  it("marks no row current when the root belongs to no registered Workspace", async () => {
    await mount(remoteFace("/Users/lionad/Github/elsewhere"), { list: () => ITEMS, startSession: vi.fn() });
    await open();
    expect(row("w1")?.getAttribute("data-current")).toBeNull();
    expect(row("w2")?.getAttribute("data-current")).toBeNull();
  });

  it("switches to another Workspace through the injected startSession and closes", async () => {
    const startSession = vi.fn();
    await mount(remoteFace(), { list: () => ITEMS, startSession });
    await open();
    const target = row("w2");
    if (target === null) throw new Error("row missing");
    await click(target);
    expect(startSession).toHaveBeenCalledTimes(1);
    expect(startSession).toHaveBeenCalledWith("w2");
    expect(panel()).toBeNull();
  });

  it("only closes when the picked row is the Workspace already open", async () => {
    const startSession = vi.fn();
    await mount(remoteFace(), { list: () => ITEMS, startSession });
    await open();
    const current = row("w1");
    if (current === null) throw new Error("row missing");
    await click(current);
    expect(startSession).not.toHaveBeenCalled();
    expect(panel()).toBeNull();
  });

  it("narrows the list from the search box and says so when nothing matches", async () => {
    await mount(remoteFace(), { list: () => ITEMS, startSession: vi.fn() });
    await open();
    const search = document.querySelector<HTMLInputElement>('[data-testid="gx-workspace-search"]');
    if (search === null) throw new Error("search missing");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(search, "perch");
    await act(async () => {
      search.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(row("w1")).toBeNull();
    expect(row("w2")).not.toBeNull();

    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(search, "zzz");
    await act(async () => {
      search.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(panel()?.textContent).toContain("workspace.empty");
  });

  it("closes on Escape and hands the keyboard back to the trigger", async () => {
    await mount(remoteFace(), { list: () => ITEMS, startSession: vi.fn() });
    await open();
    expect(panel()).not.toBeNull();
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("keeps the panel open and reports the failure when startSession throws", async () => {
    const startSession = vi.fn(() => {
      throw new Error("host refused");
    });
    await mount(remoteFace(), { list: () => ITEMS, startSession });
    await open();
    const target = row("w2");
    if (target === null) throw new Error("row missing");
    await click(target);
    expect(panel()).not.toBeNull();
    expect(panel()?.textContent).toContain("workspace.failed");
  });
});

describe("the switch's source", () => {
  const here = dirname(fileURLToPath(import.meta.url));

  it("never reaches for a directory picker", () => {
    const forbidden = ["showOpenDialog", "directoryFlow", "listDirectory", "createDirectory"];
    for (const file of ["workspace-menu.tsx", "workspace-switch.ts"]) {
      const source = readFileSync(join(here, "..", "src", "client", file), "utf8");
      for (const name of forbidden) {
        expect(source, `${file} must not mention ${name}`).not.toContain(name);
      }
    }
  });
});
