/**
 * Rows: what the panel can show, and what picking one does.
 *
 * A row is presentation plus a serializable action — no closures, no services.
 * That split is what lets the builders be exercised against fixture catalogues
 * and lets the runtime own every side effect in one switch.
 *
 * The builders also own the two exclusion rules the host taught us: archived
 * sessions are absent from every list (they were deliberately put away), and
 * subagent children are continuation addresses rather than conversations. Both
 * mirror the sidebar and `/resume`, so the panel never becomes a back door.
 */

import type { CatalogEntry } from "./catalog.ts";
import type { Copy } from "./copy.ts";
import type {
  CommandDescriptor,
  FileReferenceCandidate,
  SessionListState,
  SessionSummary,
  WorkspaceSnapshot,
  WorkspaceView,
} from "./dsh.ts";
import type { PanelMode, SessionScope } from "./panel-state.ts";
import { displayPath, toAbsolutePath } from "./paths.ts";

/** What picking a row does; the runtime maps each variant onto host services. */
export type RowAction =
  | { readonly kind: "insert-path"; readonly absolutePath: string }
  | { readonly kind: "execute-command"; readonly name: string; readonly needsInput: boolean }
  | { readonly kind: "open-mode"; readonly mode: PanelMode }
  | { readonly kind: "drill"; readonly scope: SessionScope; readonly title: string }
  | { readonly kind: "open-session"; readonly sessionId: string }
  | { readonly kind: "create-session"; readonly scope: "workspace" | "ungrouped" }
  /** Write `/name ` into the composer and let the host command take the argument. */
  | { readonly kind: "insert-command"; readonly name: string }
  | { readonly kind: "session-command"; readonly command: "archive" | "fork" | "cancel" | "pin" }
  | {
      readonly kind: "open-surface";
      readonly surface: "plugins" | "settings" | "shortcuts" | "sidebar" | "files" | "terminal" | "browser";
    }
  | { readonly kind: "toggle-theme" };

/** The default catalogue's domain, re-exported so callers keep one import. */
export type { ActionCategory, CatalogEntry } from "./catalog.ts";

export interface PanelRow {
  /** Stable identity across reloads; used as the React key. */
  readonly key: string;
  readonly label: string;
  /** Secondary text matched at a small discount: a basename or a path. */
  readonly alias?: string;
  readonly detail?: string;
  readonly hint?: string;
  readonly group?: string;
  readonly action: RowAction;
}

/** Candidates plus the session directory they are relative to. */
export interface FileRowInput {
  readonly candidates: readonly FileReferenceCandidate[];
  readonly cwd: string;
}

/**
 * Project file candidates into rows.
 *
 * The label keeps the workspace-relative path because that is what distinguishes
 * two `index.ts` files; the absolute path is the payload, computed here so the
 * runtime never re-derives it.
 */
export function fileRows(input: FileRowInput, copy: Copy): PanelRow[] {
  return input.candidates.map(candidate => {
    const absolutePath = toAbsolutePath(input.cwd, displayPath(candidate));
    const label = displayPath(candidate);
    const slash = Math.max(label.lastIndexOf("/"), label.lastIndexOf("\\"));
    return {
      key: `file:${candidate.kind}:${candidate.path}`,
      label,
      alias: slash >= 0 ? label.slice(slash + 1) : label,
      detail: candidate.kind === "directory" ? copy.directory : undefined,
      action: { kind: "insert-path", absolutePath },
    };
  });
}

/** One row per registered host command, plus how it is invoked. */
export function commandRows(commands: readonly CommandDescriptor[], copy: Copy): PanelRow[] {
  return commands.map(command => ({
    key: `command:${command.name}`,
    label: `/${command.name}`,
    detail: command.description,
    hint: command.input === undefined ? undefined : command.input.hint,
    group: copy.groupCommands,
    action: { kind: "execute-command", name: command.name, needsInput: command.input !== undefined },
  }));
}

/**
 * Project the default catalogue into rows.
 *
 * The label carries the category (`会话：归档当前会话`) instead of the list
 * carrying a section header: typing the category word then narrows the list with
 * no extra syntax, which is the reason the word is in the row at all.
 *
 * @param copy - active locale.
 * @param entries - the catalogue entries available right now.
 * @param hints - keycap by host shortcut id, for the rows whose action has one.
 * @returns one row per entry, in catalogue order.
 */
export function catalogRows(
  copy: Copy,
  entries: readonly CatalogEntry[],
  hints: ReadonlyMap<string, string>,
): PanelRow[] {
  return entries.map(entry => ({
    key: `catalog:${entry.id}`,
    label: `${copy.categoryNames[entry.category]}：${copy.actionLabels[entry.id] ?? entry.id}`,
    hint: entry.shortcutId === undefined ? undefined : hints.get(entry.shortcutId),
    action: entry.action,
  }));
}

/** Sessions that belong in a list: not archived, not blank, not a subagent. */
export function visibleSessions(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
): readonly SessionSummary[] {
  const archived = new Set(snapshot.archivedSessionIds);
  const owned = scope.kind === "workspace" ? workspaceOwnership(snapshot).get(scope.workspaceId) : undefined;

  const rows: SessionSummary[] = [];
  for (const id of sessions.ids) {
    const session = sessions.byId[id];
    if (session === undefined) continue;
    if (session.blank || session.origin === "subagent") continue;
    if (archived.has(id)) continue;
    if (scope.kind === "workspace" && (owned === undefined || !owned.has(id))) continue;
    if (scope.kind === "ungrouped" && isGrouped(snapshot, id)) continue;
    rows.push(session);
  }
  return rows;
}

/** session id → owning workspace id, from the host's one-owner ledger. */
export function workspaceOwnership(snapshot: WorkspaceSnapshot): Map<string, Set<string>> {
  const owned = new Map<string, Set<string>>();
  for (const workspace of snapshot.items) {
    owned.set(workspace.workspaceId, new Set(workspace.sessionIds));
  }
  return owned;
}

function isGrouped(snapshot: WorkspaceSnapshot, sessionId: string): boolean {
  for (const workspace of snapshot.items) {
    if (workspace.sessionIds.includes(sessionId)) return true;
  }
  return false;
}

/** The workspace holding one session, for disambiguating cross-workspace rows. */
function workspaceTitle(snapshot: WorkspaceSnapshot, sessionId: string): string | undefined {
  for (const workspace of snapshot.items) {
    if (workspace.sessionIds.includes(sessionId)) return workspace.title;
  }
  return undefined;
}

function countVisible(sessions: SessionListState, workspace: WorkspaceView, archived: ReadonlySet<string>): number {
  let count = 0;
  for (const id of workspace.sessionIds) {
    const session = sessions.byId[id];
    if (session === undefined || session.blank || session.origin === "subagent") continue;
    if (archived.has(id)) continue;
    count += 1;
  }
  return count;
}

/**
 * The switch mode's first level: every workspace, then the two aggregate scopes.
 *
 * The aggregate rows exist because the host's ownership ledger is sparse — most
 * sessions on a real machine belong to no workspace at all, and a workspaces-only
 * list would hide them.
 */
export function workspaceRows(
  snapshot: WorkspaceSnapshot,
  sessions: SessionListState,
  copy: Copy,
): PanelRow[] {
  const archived = new Set(snapshot.archivedSessionIds);
  const rows: PanelRow[] = [];

  for (const workspace of snapshot.items) {
    const count = countVisible(sessions, workspace, archived);
    rows.push({
      key: `workspace:${workspace.workspaceId}`,
      label: workspace.title,
      alias: workspace.path,
      detail: workspace.path,
      hint: copy.sessionsCount(count),
      action: {
        kind: "drill",
        scope: { kind: "workspace", workspaceId: workspace.workspaceId },
        title: workspace.title,
      },
    });
  }

  const ungrouped = sessions.ids.filter(id => {
    const session = sessions.byId[id];
    if (session === undefined || session.blank || session.origin === "subagent" || archived.has(id)) return false;
    return !isGrouped(snapshot, id);
  }).length;

  rows.push({
    key: "scope:all",
    label: copy.allSessions,
    detail: copy.allSessionsDetail,
    hint: copy.sessionsCount(visibleSessions(sessions, snapshot, { kind: "all" }).length),
    action: { kind: "drill", scope: { kind: "all" }, title: copy.allSessions },
  });

  if (ungrouped > 0) {
    rows.push({
      key: "scope:ungrouped",
      label: copy.ungrouped,
      hint: copy.sessionsCount(ungrouped),
      action: { kind: "drill", scope: { kind: "ungrouped" }, title: copy.ungrouped },
    });
  }

  return rows;
}

/**
 * The switch mode's second level: sessions of one scope, newest first.
 *
 * The host's list order is a manual order, not recency, so a palette that wants
 * "the one I was just in" has to sort by `updatedAt` itself.
 */
export function sessionRows(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
  copy: Copy,
  now: number,
): PanelRow[] {
  const visible = [...visibleSessions(sessions, snapshot, scope)];
  visible.sort((left, right) => right.updatedAt - left.updatedAt);

  return visible.map(session => {
    const owner = scope.kind === "all" ? workspaceTitle(snapshot, session.id) : undefined;
    const age = copy.age(now - session.updatedAt);
    return {
      key: `session:${session.id}`,
      label: session.displayTitle,
      detail: owner === undefined ? age : `${owner} · ${age}`,
      hint: session.running ? copy.running : undefined,
      action: { kind: "open-session", sessionId: session.id },
    };
  });
}
