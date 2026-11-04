/**
 * Where the workspace-row menu is, and which workspace it belongs to.
 *
 * The host opens that menu from a button on the workspace row and renders it
 * through a portal, and it exposes no slot for the row. The class names on the
 * floating list are build hashes, so the menu is recognised by its structure:
 * a container holding at least two `role="menuitem"` rows whose labels are the
 * workspace menu's rename and delete entries. Anything else that floats up
 * (the session-row menu, a tooltip) fails one of those checks and is left alone.
 */
import { createWorkspacePathStore, type WorkspacePathStore } from "./workspaces-probe.ts";

/** Marker on the node this anchor appends, so a re-render is not injected twice. */
const ANCHOR_MARK = "data-dsh-workspace-open-local";

/** The workspace menu's two rows, in the host's two shipped locales. */
const WORKSPACE_MENU_LABELS: ReadonlySet<string> = new Set(["重命名", "删除工作区", "Rename", "Delete workspace"]);

/** How many of those labels must be present before a menu counts as the workspace one. */
const REQUIRED_LABEL_HITS = 2;

export interface WorkspaceMenuOpen {
  readonly workspaceId: string;
  /** The directory the probe recorded for this workspace. Present only because injection waits for it. */
  readonly path: string;
  /** The node the host's menu rows live in, which the container is appended to. */
  readonly host: HTMLElement;
  /** The node appended for the caller to render into. */
  readonly container: HTMLElement;
  /**
   * The row's menu button, or null when the click that opened the menu was not
   * one this anchor could name. The row re-asserts the menu's open state through
   * it, because the row is a React root the host's tree cannot see.
   */
  readonly trigger: HTMLElement | null;
}

export interface WorkspaceMenuAnchorOptions {
  readonly document?: Document;
  /**
   * Directories by workspace id. Defaults to a private empty store, which
   * resolves nothing, so an anchor without one never injects.
   */
  readonly store?: WorkspacePathStore;
  /** Called once per injection. Its return runs when that injection is removed. */
  readonly onOpen: (open: WorkspaceMenuOpen) => (() => void) | void;
  /** Called when the menu is the workspace one but no directory is recorded for it yet. */
  readonly onUnresolved?: (workspaceId: string) => void;
}

interface Injection {
  readonly menu: HTMLElement;
  readonly container: HTMLElement;
  readonly cleanup: (() => void) | void;
}

/** The workspace id carried by a group row, or null when the key is not one. */
function workspaceIdFrom(row: Element): string | null {
  const key = row.getAttribute("data-row-key");
  if (key === null || !key.startsWith("workspace:")) return null;
  return key.slice("workspace:".length);
}

/**
 * Whether a node sits inside a sidebar row.
 *
 * Rows carry their own buttons, and a workspace row's title can read the same
 * as a menu label, so menu detection has to stay out of the row tree entirely.
 */
function insideRow(element: Element): boolean {
  return element.closest("[data-row-key]") !== null;
}

/** A click on the row's action buttons, as opposed to the row body that toggles it. */
function menuTrigger(target: EventTarget | null): { row: HTMLElement; button: HTMLButtonElement } | null {
  if (!(target instanceof Element)) return null;
  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement) || button.type !== "button") return null;
  const row = button.closest("[data-row-key^='workspace:']");
  if (!(row instanceof HTMLElement)) return null;
  return { row, button };
}

/**
 * Which of the row's action buttons opens the menu.
 *
 * The host renders two: the ellipsis menu first, then the new-session button.
 * Both stop their own propagation, so the click's position among the row's
 * buttons is the only stable way to tell them apart.
 */
function isMenuButton(row: HTMLElement, button: HTMLButtonElement): boolean {
  const buttons = row.querySelectorAll("button");
  return buttons.length > 0 && buttons[0] === button;
}

/** A menuitem's visible label, trimmed, for the workspace-menu check. */
function itemLabel(item: Element): string {
  return (item.textContent ?? "").trim();
}

/**
 * The list the rows share.
 *
 * The host wraps every row in its own element, so a menuitem's parent holds
 * exactly one of them. Walk up until a container holds the whole set: that is
 * the node a sibling can be appended to without landing inside one row.
 */
function listHolding(menu: HTMLElement, items: readonly Element[]): HTMLElement | null {
  let container: HTMLElement | null = items[0]?.parentElement ?? null;
  while (container !== null && menu.contains(container)) {
    const held = items.filter((item) => container?.contains(item)).length;
    if (held >= REQUIRED_LABEL_HITS) return container;
    if (container === menu) return null;
    container = container.parentElement;
  }
  return null;
}

function rowHost(menu: HTMLElement): HTMLElement | null {
  if (insideRow(menu)) return null;
  const items = [...menu.querySelectorAll("[role='menuitem']")].filter((item) => !insideRow(item));
  if (items.length < REQUIRED_LABEL_HITS) return null;
  const hits = items.filter((item) => WORKSPACE_MENU_LABELS.has(itemLabel(item))).length;
  if (hits < REQUIRED_LABEL_HITS) return null;
  return listHolding(menu, items);
}

/** A menu this anchor already owns, so a mutation inside it is not a new menu. */
function alreadyAnchored(menu: HTMLElement): boolean {
  return menu.querySelector(`[${ANCHOR_MARK}]`) !== null;
}

export function attachWorkspaceMenuAnchor(options: WorkspaceMenuAnchorOptions): () => void {
  const doc = options.document ?? document;
  const store = options.store ?? createWorkspacePathStore();
  const root = doc.body ?? doc.documentElement;

  let pendingWorkspaceId: string | null = null;
  let pendingTrigger: HTMLElement | null = null;
  let injection: Injection | null = null;
  let disposed = false;

  /**
   * Detach whatever was appended and tell the caller its menu went away.
   *
   * The remembered workspace stays: the host swaps the floating menu for a new
   * one on re-render, and that replacement still belongs to the row that was
   * clicked. What must not survive is the injection itself. The removal it does
   * is itself a mutation, and the observer delivers that record after this
   * function returns, which would read as a fresh menu and append another
   * container. Taking the records now leaves the observer nothing to act on.
   */
  const closeInjection = (): void => {
    if (injection === null) return;
    const current = injection;
    injection = null;
    current.container.remove();
    observer.takeRecords();
    current.cleanup?.();
  };

  /**
   * Append the container once the open menu is recognisable and its directory
   * is known. A missing directory reports and waits: injecting would offer to
   * open a folder this anchor cannot name.
   */
  const tryInject = (): void => {
    if (disposed || injection !== null || pendingWorkspaceId === null) return;
    const menu = findWorkspaceMenu(root);
    if (menu === null) return;
    const host = rowHost(menu);
    if (host === null || alreadyAnchored(menu)) return;
    const workspaceId = pendingWorkspaceId;
    const path = store.resolve(workspaceId);
    if (path === null) {
      options.onUnresolved?.(workspaceId);
      return;
    }
    const container = doc.createElement("div");
    container.setAttribute(ANCHOR_MARK, "");
    container.setAttribute("role", "none");
    host.append(container);
    const open: WorkspaceMenuOpen = { workspaceId, path, host, container, trigger: pendingTrigger };
    injection = { menu, container, cleanup: options.onOpen(open) };
  };

  const onPointer = (event: Event): void => {
    const trigger = menuTrigger(event.target);
    if (trigger !== null) {
      const workspaceId = workspaceIdFrom(trigger.row);
      if (workspaceId !== null && isMenuButton(trigger.row, trigger.button)) {
        pendingWorkspaceId = workspaceId;
        pendingTrigger = trigger.button;
      }
      return;
    }
    // A pointer down anywhere but the open menu is the host's cue to close it,
    // so the injection should not outlive that click.
    if (injection !== null && event.target instanceof Node && !injection.menu.contains(event.target)) closeInjection();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") closeInjection();
  };

  const observer = new MutationObserver(() => {
    if (injection !== null && !injection.menu.isConnected) closeInjection();
    tryInject();
  });

  doc.addEventListener("pointerdown", onPointer, true);
  doc.addEventListener("click", onPointer, true);
  doc.addEventListener("keydown", onKeyDown, true);
  observer.observe(root, { childList: true, subtree: true });
  const stopStore = store.subscribe(() => {
    tryInject();
  });

  return () => {
    if (disposed) return;
    disposed = true;
    doc.removeEventListener("pointerdown", onPointer, true);
    doc.removeEventListener("click", onPointer, true);
    doc.removeEventListener("keydown", onKeyDown, true);
    observer.disconnect();
    stopStore();
    closeInjection();
  };
}

/**
 * The workspace menu among whatever was just added to the body.
 *
 * Portal content lands directly under the body, but a menu surface can also
 * wrap its rows, so the search walks each added subtree and stops at the first
 * container whose rows identify it.
 */
function findWorkspaceMenu(root: HTMLElement): HTMLElement | null {
  const body = root.ownerDocument.body;
  const candidates = new Set<Element>([
    ...(body === null ? [] : body.children),
    ...root.querySelectorAll("[role='menu']"),
  ]);
  for (const candidate of candidates) {
    if (!(candidate instanceof HTMLElement) || insideRow(candidate)) continue;
    if (rowHost(candidate) !== null) return candidate;
  }
  return null;
}
