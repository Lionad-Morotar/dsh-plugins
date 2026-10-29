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
  | { readonly kind: "open-session"; readonly sessionId: string };

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
 * The panel's own entries, so every mode is reachable from every other mode.
 *
 * This is the whole "navigation and commands are mounted here" idea expressed in
 * four rows: no plugin API, no registry, just the modes addressing each other.
 */
export function builtinRows(copy: Copy, hints: Partial<Record<PanelMode, string>>): PanelRow[] {
  const modes: readonly PanelMode[] = ["navigate", "command", "switch"];
  return modes.map(mode => ({
    key: `mode:${mode}`,
    label: copy.modeNames[mode],
    detail: copy.modeDescriptions[mode],
    hint: hints[mode],
    group: copy.groupBuiltin,
    action: { kind: "open-mode", mode },
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
