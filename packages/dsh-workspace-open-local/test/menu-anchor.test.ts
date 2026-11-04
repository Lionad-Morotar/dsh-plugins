/**
 * The anchor has no slot to occupy, so these cases build the host's DOM by
 * hand and assert the injection against it: which click counts as opening the
 * menu, where the container lands, and that a workspace with no known path
 * produces nothing at all.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { attachWorkspaceMenuAnchor, type WorkspaceMenuOpen } from "../src/client/menu-anchor.ts";
import { createWorkspacePathStore, type WorkspacePathStore } from "../src/client/workspaces-probe.ts";

const MARK = "data-dsh-workspace-open-local";

afterEach(() => {
  document.body.replaceChildren();
});

/** One workspace group row, shaped like the host's treeitem. */
function workspaceRow(workspaceId: string): HTMLElement {
  const row = document.createElement("div");
  row.dataset.rowKey = `workspace:${workspaceId}`;
  row.setAttribute("role", "treeitem");
  row.setAttribute("aria-expanded", "true");

  const actions = document.createElement("span");
  const menuButton = document.createElement("button");
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", `工作区“${workspaceId}”的操作`);
  menuButton.textContent = "…";
  const createButton = document.createElement("button");
  createButton.type = "button";
  createButton.textContent = "+";
  actions.append(menuButton, createButton);

  const title = document.createElement("span");
  title.textContent = workspaceId;
  row.append(title, actions);
  return row;
}

/** The host menu: a portaled role=menu whose viewport holds two menuitems. */
function hostMenu(labels: readonly string[]): HTMLElement {
  const surface = document.createElement("div");
  surface.setAttribute("role", "menu");
  const viewport = document.createElement("div");
  viewport.setAttribute("role", "presentation");
  for (const label of labels) {
    const wrap = document.createElement("div");
    const item = document.createElement("button");
    item.type = "button";
    item.setAttribute("role", "menuitem");
    item.textContent = label;
    wrap.append(item);
    viewport.append(wrap);
  }
  surface.append(viewport);
  return surface;
}

/**
 * The shape the structure test guards: no role=menu anywhere, just a plain div
 * whose descendant list holds the menuitems. A class-name or tag check misses it.
 */
function plainMenu(labels: readonly string[]): HTMLElement {
  const surface = document.createElement("div");
  const list = document.createElement("div");
  for (const label of labels) {
    const item = document.createElement("div");
    item.setAttribute("role", "menuitem");
    item.textContent = label;
    list.append(item);
  }
  surface.append(list);
  return surface;
}

/** Let a MutationObserver callback scheduled by the append run. */
async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

interface Harness {
  store: WorkspacePathStore;
  opens: WorkspaceMenuOpen[];
  cleanups: ReturnType<typeof vi.fn>[];
  unresolved: string[];
  dispose: () => void;
}

function harness(paths?: Readonly<Record<string, string>>): Harness {
  const store = createWorkspacePathStore();
  if (paths !== undefined) {
    store.publish(Object.entries(paths).map(([workspaceId, path]) => ({ workspaceId, path })));
  }
  const opens: WorkspaceMenuOpen[] = [];
  const cleanups: ReturnType<typeof vi.fn>[] = [];
  const unresolved: string[] = [];
  const dispose = attachWorkspaceMenuAnchor({
    store,
    onOpen(open) {
      opens.push(open);
      const cleanup = vi.fn();
      cleanups.push(cleanup);
      return cleanup;
    },
    onUnresolved(workspaceId) {
      unresolved.push(workspaceId);
    },
  });
  return { store, opens, cleanups, unresolved, dispose };
}

/** Click the row's menu button, then mount the floating menu. */
async function openMenu(row: HTMLElement, menu: HTMLElement, which: "menu" | "create" | "row" = "menu"): Promise<void> {
  const buttons = row.querySelectorAll("button");
  const target = which === "create" ? buttons[1] : which === "row" ? row : buttons[0];
  target?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  target?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  if (which === "menu") document.body.append(menu);
  await flush();
}

describe("workspace menu anchor", () => {

  it("appends one marked container to the menuitem list when the menu opens", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness({ "ws-1": "/work/one" });

    await openMenu(row, menu);

    const containers = menu.querySelectorAll(`[${MARK}]`);
    expect(containers).toHaveLength(1);
    const container = containers[0] as HTMLElement;
    expect(container.parentElement).toBe(menu.querySelector("[role=presentation]"));
    expect(container.getAttribute("role")).toBe("none");
    expect(h.opens).toHaveLength(1);
    expect(h.opens[0]?.workspaceId).toBe("ws-1");
    expect(h.opens[0]?.container).toBe(container);
    expect(h.unresolved).toEqual([]);
    h.dispose();
  });

  it("still anchors a menu that is a plain div of menuitems, with no role=menu", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = plainMenu(["Rename", "Delete workspace"]);
    const h = harness({ "ws-1": "/work/one" });

    await openMenu(row, menu);

    const container = menu.querySelector(`[${MARK}]`);
    expect(container).not.toBeNull();
    expect(container?.parentElement).toBe(menu.firstElementChild);
    expect(menu.getAttribute("role")).toBeNull();
    h.dispose();
  });

  it("does not inject a second container when the same menu is observed again", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness({ "ws-1": "/work/one" });
    await openMenu(row, menu);

    menu.append(document.createElement("span"));
    await flush();

    expect(menu.querySelectorAll(`[${MARK}]`)).toHaveLength(1);
    expect(h.opens).toHaveLength(1);
    h.dispose();
  });

  it("reinjects after the host replaces the floating menu on a re-render", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const h = harness({ "ws-1": "/work/one" });
    const first = hostMenu(["重命名", "删除工作区"]);
    await openMenu(row, first);
    expect(h.cleanups).toHaveLength(1);

    first.remove();
    await flush();
    expect(h.cleanups[0]).toHaveBeenCalledTimes(1);

    const second = hostMenu(["重命名", "删除工作区"]);
    document.body.append(second);
    await flush();

    expect(second.querySelectorAll(`[${MARK}]`)).toHaveLength(1);
    expect(h.opens).toHaveLength(2);
    expect(h.opens[1]?.workspaceId).toBe("ws-1");
    h.dispose();
  });

  it("removes the container and runs the cleanup when the menu leaves the document", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness({ "ws-1": "/work/one" });
    await openMenu(row, menu);
    const container = h.opens[0]?.container;
    expect(container?.isConnected).toBe(true);

    menu.remove();
    await flush();

    expect(container?.isConnected).toBe(false);
    expect(h.cleanups[0]).toHaveBeenCalledTimes(1);
    h.dispose();
  });

  it("closes on a pointer down outside the menu", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness({ "ws-1": "/work/one" });
    await openMenu(row, menu);

    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await flush();

    expect(menu.querySelector(`[${MARK}]`)).toBeNull();
    expect(h.cleanups[0]).toHaveBeenCalledTimes(1);
    h.dispose();
  });

  it("closes on Escape", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness({ "ws-1": "/work/one" });
    await openMenu(row, menu);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await flush();

    expect(menu.querySelector(`[${MARK}]`)).toBeNull();
    expect(h.cleanups[0]).toHaveBeenCalledTimes(1);
    h.dispose();
  });

  it("injects nothing and reports the id when the path is not ready yet", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness();

    await openMenu(row, menu);

    expect(menu.querySelector(`[${MARK}]`)).toBeNull();
    expect(h.opens).toHaveLength(0);
    expect(h.unresolved).toEqual(["ws-1"]);
    h.dispose();
  });

  it("injects once the path arrives while the menu is still open", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness();
    await openMenu(row, menu);
    expect(h.unresolved).toEqual(["ws-1"]);

    h.store.publish([{ workspaceId: "ws-1", path: "/work/one" }]);
    await flush();

    expect(menu.querySelectorAll(`[${MARK}]`)).toHaveLength(1);
    expect(h.opens).toHaveLength(1);
    h.dispose();
  });

  it("ignores the row's other button and a click on the row body", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const h = harness({ "ws-1": "/work/one" });

    await openMenu(row, hostMenu(["重命名", "删除工作区"]), "create");
    await openMenu(row, hostMenu(["重命名", "删除工作区"]), "row");

    expect(document.querySelectorAll(`[${MARK}]`)).toHaveLength(0);
    expect(h.opens).toHaveLength(0);
    h.dispose();
  });

  it("ignores a menu that is not the workspace row menu", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["置顶", "归档"]);
    const h = harness({ "ws-1": "/work/one" });

    await openMenu(row, menu);

    expect(menu.querySelector(`[${MARK}]`)).toBeNull();
    expect(h.opens).toHaveLength(0);
    h.dispose();
  });

  it("attributes the menu to the workspace row whose button was clicked", async () => {
    const first = workspaceRow("ws-1");
    const second = workspaceRow("ws-2");
    document.body.append(first, second);
    const h = harness({ "ws-1": "/work/one", "ws-2": "/work/two" });

    await openMenu(second, hostMenu(["Rename", "Delete workspace"]));

    expect(h.opens.map((open) => open.workspaceId)).toEqual(["ws-2"]);
    h.dispose();
  });

  it("stops listening once disposed, so a later menu is left alone", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const h = harness({ "ws-1": "/work/one" });
    h.dispose();

    await openMenu(row, hostMenu(["重命名", "删除工作区"]));

    expect(document.querySelector(`[${MARK}]`)).toBeNull();
    expect(h.opens).toHaveLength(0);
  });

  it("disposes an injection that is still open", async () => {
    const row = workspaceRow("ws-1");
    document.body.append(row);
    const menu = hostMenu(["重命名", "删除工作区"]);
    const h = harness({ "ws-1": "/work/one" });
    await openMenu(row, menu);

    h.dispose();

    expect(menu.querySelector(`[${MARK}]`)).toBeNull();
    expect(h.cleanups[0]).toHaveBeenCalledTimes(1);
  });
});
