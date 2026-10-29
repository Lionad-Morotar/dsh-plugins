/**
 * Executors for the default catalogue.
 *
 * Every row is one function call on a client service, and this is the only file
 * that makes them. It is deliberately separate from the runtime: the runtime owns
 * *when* a row runs (accept, availability, keys), this file owns *what* it does
 * and what the reader sees when it does not work.
 *
 * Failure is a first-class outcome here. The host reports business failures as
 * `RemoteResult` error codes and, for a few verbs, throws instead; both are folded
 * into one sentence plus the raw code, shown in the panel (still open) or on the
 * composer (already closed). A row never fails silently.
 */

import type {
  LayoutService,
  PluginNavigationService,
  RemoteResult,
  SessionsService,
  SidebarRightService,
  SlotSeatActions,
  SlotService,
  ThemeService,
  UiWorkspaceService,
} from "./dsh.ts";
import type { Copy } from "./copy.ts";
import type { RowAction } from "./rows.ts";
import { PANEL_SOURCE } from "./sources.ts";

/** Collaborators the executors read; every one may be absent on a trimmed host. */
export interface ActionDeps {
  readonly sessions: () => SessionsService | undefined;
  readonly workspaces: () => {
    readonly list: { getSnapshot(): { readonly pinnedSessionIds: readonly string[] } };
  } | undefined;
  readonly uiWorkspace: () => UiWorkspaceService | undefined;
  readonly layout: () => LayoutService | undefined;
  readonly theme: () => ThemeService | undefined;
  readonly pluginNavigation: () => PluginNavigationService | undefined;
  readonly sidebarRight: () => SidebarRightService | undefined;
  readonly slots: () => SlotService | undefined;
  readonly currentSessionId: () => string | null;
  /** Write into the composer through the panel's existing insertion path. */
  readonly insert: (text: string) => "ok" | "no-session" | "failed";
  readonly close: () => void;
  readonly notify: (text: string, tone?: "info" | "error") => void;
  readonly copy: () => Copy;
}

/** Extract the Host business code from whatever shape a failure arrived in. */
export function failureCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const carrier = error as { rpcError?: { code?: unknown }; code?: unknown; message?: unknown };
  const rpc = carrier.rpcError?.code;
  if (typeof rpc === "string") return rpc;
  if (typeof carrier.code === "string") return carrier.code;
  if (typeof carrier.message === "string" && carrier.message !== "") return carrier.message;
  return undefined;
}

function describe(deps: ActionDeps, id: string): string {
  return deps.copy().actionLabels[id] ?? id;
}

function fail(deps: ActionDeps, what: string, code: string | undefined): void {
  deps.notify(deps.copy().actions.failed(what, code), "error");
}

// ── session lifecycle ──────────────────────────────────────────────────────

async function createSession(scope: "workspace" | "ungrouped", deps: ActionDeps): Promise<void> {
  const ui = deps.uiWorkspace();
  const copy = deps.copy();
  if (ui === undefined) {
    fail(deps, describe(deps, "session.newInWorkspace"), undefined);
    return;
  }

  if (scope === "workspace") {
    try {
      // Inherits the current session's workspace, else the most recent one.
      ui.startSession();
      deps.close();
    } catch (error) {
      fail(deps, describe(deps, "session.newInWorkspace"), failureCode(error));
    }
    return;
  }

  const sessions = deps.sessions();
  const current = deps.currentSessionId();
  const cwd = sessions === undefined || current === null
    ? undefined
    : sessions.list.getSnapshot().byId[current]?.cwd;
  if (sessions === undefined || cwd === undefined || cwd === "") {
    deps.notify(copy.actions.needsCwd, "error");
    return;
  }

  try {
    // A cwd without a workspace leaves the session ungrouped on the Host.
    const created = await sessions.create({ cwd });
    ui.openSession(created);
    deps.close();
  } catch (error) {
    fail(deps, describe(deps, "session.newUngrouped"), failureCode(error));
  }
}

/** A message for the archived/forked session, preferring its projected title. */
function titleOf(deps: ActionDeps, sessionId: string): string {
  const sessions = deps.sessions();
  const row = sessions?.list.getSnapshot().byId[sessionId];
  return row?.displayTitle ?? sessionId;
}

async function sessionCommand(
  command: "archive" | "fork" | "cancel" | "pin",
  deps: ActionDeps,
): Promise<void> {
  const copy = deps.copy();
  const id = deps.currentSessionId();
  if (id === null) {
    deps.notify(copy.noticeNoSession, "error");
    return;
  }
  const ui = deps.uiWorkspace();

  if (command === "cancel") {
    const sessions = deps.sessions();
    if (sessions === undefined) {
      fail(deps, describe(deps, "session.cancel"), undefined);
      return;
    }
    try {
      const result = await sessions.using(id, { source: PANEL_SOURCE }, async reference => {
        await reference.ready;
        return reference.binding.session.cancel();
      });
      deps.close();
      if (!result.ok) fail(deps, describe(deps, "session.cancel"), result.error.code);
    } catch (error) {
      fail(deps, describe(deps, "session.cancel"), failureCode(error));
    }
    return;
  }

  if (ui === undefined) {
    fail(deps, describe(deps, `session.${command}`), undefined);
    return;
  }

  try {
    if (command === "archive") {
      await ui.archiveSession(id);
      deps.close();
      return;
    }
    if (command === "fork") {
      const child = await ui.forkSession(id);
      // Forking is for continuing elsewhere, so land in the child: leaving the
      // reader on the source would make the new session hard to find.
      ui.openSession(child);
      deps.close();
      deps.notify(copy.actions.forked(titleOf(deps, child)));
      return;
    }

    const workspaces = deps.workspaces();
    const pinned = workspaces?.list.getSnapshot().pinnedSessionIds.includes(id) ?? false;
    if (pinned) await ui.unpinSession(id);
    else await ui.pinSession(id);
    deps.close();
    deps.notify(copy.actions.pinned(!pinned));
  } catch (error) {
    const code = failureCode(error);
    // A running session cannot be archived; saying so beats a raw code.
    if (command === "archive" && code === "workspace/session-active") {
      deps.notify(copy.actions.sessionBusy, "error");
      return;
    }
    fail(deps, describe(deps, `session.${command}`), code);
  }
}

// ── surfaces ───────────────────────────────────────────────────────────────

const SIDEBAR_KINDS: Readonly<Record<"files" | "terminal" | "browser", string>> = {
  files: "files",
  terminal: "terminal",
  browser: "browser",
};

/**
 * Reach a slot's declarative store seat.
 *
 * The settings shell and the shortcuts overlay publish no service; what they
 * publish is a `store` on their registration whose `create()` the host pins to the
 * instance its own commands drive. That pin is what makes this a supported
 * shortcut rather than a second instance, and it is why these rows are separable.
 */
export function seatActions(
  slots: SlotService | undefined,
  slotKey: string,
  entryId: string | undefined,
): SlotSeatActions | undefined {
  const rows = slots?.entries?.(slotKey);
  if (rows === undefined || rows.length === 0) return undefined;
  const entry = entryId === undefined ? rows[0] : rows.find(row => row.options?.id === entryId);
  const declared = entry?.store;
  if (declared === undefined) return undefined;
  const seat = typeof declared === "function" ? declared() : declared;
  return seat.create().actions;
}

async function openSurface(
  surface: "plugins" | "settings" | "shortcuts" | "sidebar" | "files" | "terminal" | "browser",
  deps: ActionDeps,
): Promise<void> {
  const copy = deps.copy();

  if (surface === "plugins") {
    const navigation = deps.pluginNavigation();
    if (navigation === undefined) {
      fail(deps, describe(deps, "navigate.plugins"), undefined);
      return;
    }
    try {
      navigation.openList();
      deps.close();
    } catch (error) {
      fail(deps, describe(deps, "navigate.plugins"), failureCode(error));
    }
    return;
  }

  if (surface === "sidebar") {
    const layout = deps.layout();
    if (layout === undefined) {
      fail(deps, describe(deps, "view.sidebar"), undefined);
      return;
    }
    try {
      layout.toggleSidebar();
      deps.close();
    } catch (error) {
      fail(deps, describe(deps, "view.sidebar"), failureCode(error));
    }
    return;
  }

  if (surface === "settings" || surface === "shortcuts") {
    const entryId = surface === "shortcuts" ? "shortcuts" : undefined;
    const slotKey = surface === "shortcuts" ? "shell.overlay" : "sidebar.settings";
    let actions: SlotSeatActions | undefined;
    try {
      actions = seatActions(deps.slots(), slotKey, entryId);
    } catch {
      actions = undefined;
    }
    if (actions?.open === undefined) {
      deps.notify(copy.actions.seatUnavailable, "error");
      return;
    }
    try {
      actions.open();
      deps.close();
    } catch {
      deps.notify(copy.actions.seatUnavailable, "error");
    }
    return;
  }

  const sidebar = deps.sidebarRight();
  if (sidebar === undefined) {
    fail(deps, describe(deps, `view.${surface}`), undefined);
    return;
  }
  try {
    sidebar.openTab(SIDEBAR_KINDS[surface]);
    deps.close();
  } catch (error) {
    // `openTab` throws when no session surface is mounted; that is a state, not a
    // defect, so it gets a sentence instead of a code.
    const message = deps.copy().actions.noSessionSurface;
    deps.notify(failureCode(error) === undefined ? message : `${message}（${failureCode(error)}）`, "error");
  }
}

function toggleTheme(deps: ActionDeps): void {
  const theme = deps.theme();
  if (theme === undefined) {
    fail(deps, describe(deps, "view.theme"), undefined);
    return;
  }
  const dark = theme.getTheme().active.colorScheme === "dark";
  try {
    theme.setTheme(dark ? "light" : "dark");
    deps.close();
    deps.notify(deps.copy().actions.themeSwitched(!dark));
  } catch (error) {
    fail(deps, describe(deps, "view.theme"), failureCode(error));
  }
}

function insertCommand(name: string, deps: ActionDeps): void {
  const outcome = deps.insert(`/${name} `);
  if (outcome === "ok") {
    deps.close();
    return;
  }
  deps.notify(
    outcome === "no-session" ? deps.copy().noticeNoSession : deps.copy().noticeInsertFailed,
    "error",
  );
}

/**
 * Run one catalogue action.
 *
 * @param action - the row's serializable action.
 * @returns whether this layer handled it (the mode/file/session-open kinds stay
 * in the runtime, which owns their navigation semantics).
 */
export async function runCatalogAction(action: RowAction, deps: ActionDeps): Promise<boolean> {
  switch (action.kind) {
    case "create-session":
      await createSession(action.scope, deps);
      return true;
    case "insert-command":
      insertCommand(action.name, deps);
      return true;
    case "session-command":
      await sessionCommand(action.command, deps);
      return true;
    case "open-surface":
      await openSurface(action.surface, deps);
      return true;
    case "toggle-theme":
      toggleTheme(deps);
      return true;
    default:
      return false;
  }
}

/** Re-exported so the runtime can keep one import for result plumbing. */
export type { RemoteResult };
