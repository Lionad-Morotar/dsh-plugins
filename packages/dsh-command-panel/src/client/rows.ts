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
  GitCommitSummary,
  SessionListState,
  SessionSummary,
  ShortcutCatalogEntry,
  WorkspaceSnapshot,
  WorkspaceView,
} from "./dsh.ts";
import type { PathEntry } from "../shared.ts";
import type { PanelMode, SessionScope } from "./panel-state.ts";
import { displayPath, tildeForm, toAbsolutePath } from "./paths.ts";
import { usableShortcut } from "./shortcut-key.ts";
import { sessionTier, workspaceTier, type StatusTier } from "./status.ts";

/** What picking a row does; the runtime maps each variant onto host services. */
export type RowAction =
  | {
      readonly kind: "insert-path";
      readonly absolutePath: string;
      /** Where a symlinked entry really lives, when the listing already knew. */
      readonly link?: string;
    }
  | { readonly kind: "execute-command"; readonly name: string; readonly needsInput: boolean }
  | { readonly kind: "open-mode"; readonly mode: PanelMode }
  | { readonly kind: "drill"; readonly scope: SessionScope; readonly title: string }
  | { readonly kind: "open-session"; readonly sessionId: string }
  | { readonly kind: "create-session"; readonly scope: "workspace" | "ungrouped"; readonly workspaceId?: string }
  /**
   * Enter the switch mode's archive view; which archive it lists is the scope
   * the caller was in — the root workspace row reaches the registry-global
   * set, a workspace session list reaches that workspace's own archive.
   */
  | { readonly kind: "drill-archived" }
  /** Restore one archived session to its list, then open it. */
  | { readonly kind: "restore-session"; readonly sessionId: string }
  /** Write `/name ` into the composer and let the host command take the argument. */
  | { readonly kind: "insert-command"; readonly name: string }
  | { readonly kind: "session-command"; readonly command: "archive" | "fork" | "cancel" | "pin" }
  | { readonly kind: "copy-session-id" }
  | {
      readonly kind: "open-surface";
      readonly surface: "plugins" | "settings" | "shortcuts" | "sidebar" | "files" | "terminal" | "browser";
    }
  | { readonly kind: "toggle-theme" }
  /** Run one shortcuts-catalog command the default catalogue does not cover. */
  | { readonly kind: "invoke-shortcut"; readonly id: string }
  /** Open the git workbench on one commit's detail (`commit:<hash>` focus). */
  | { readonly kind: "open-commit"; readonly hash: string }
  /** Ask the host for a graceful exit; the runtime confirms before firing. */
  | { readonly kind: "request-shutdown" };

/** The default catalogue's domain, re-exported so callers keep one import. */
export type { ActionCategory, CatalogEntry } from "./catalog.ts";

export interface PanelRow {
  /** Stable identity across reloads; used as the React key. */
  readonly key: string;
  readonly label: string;
  /** Secondary text matched at a small discount: a basename or a path. */
  readonly alias?: string;
  /**
   * The basename a file row leads with. Set only on file and directory rows,
   * where the view paints the file tree's own mark in front of the path.
   */
  readonly name?: string;
  readonly detail?: string;
  readonly hint?: string;
  /**
   * The host shortcut this row stands for, when one exists. The row does not
   * carry the keycap itself: the binding is the reader's to rebind, so the
   * keycap is injected at composition time from the live catalogue.
   */
  readonly shortcutId?: string;
  /**
   * Activity-ladder rung for the title colour, mirrored from the sidebar so
   * one session never reads at two levels between the two surfaces.
   */
  readonly tone?: StatusTier;
  /** Title emphasis; only workspace rows carry it, never session rows. */
  readonly weight?: "bold";
  /** Semantic colour for the trailing badge; the running badge reads green. */
  readonly hintTone?: "running";
  readonly group?: string;
  /**
   * What the row names. Tree navigation and the file-workbench jump both need
   * this as a fact rather than as a localized label comparison.
   */
  readonly kind?: "file" | "directory";
  /**
   * Which plane the row came from. Workspace rows leave it unset; filesystem
   * rows mark themselves so the reveal accelerator knows to speak the
   * workbench's absolute `abs:` protocol instead of `path:`.
   */
  readonly origin?: "filesystem";
  readonly action: RowAction;
}

/** Candidates plus the session directory they are relative to. */
export interface FileRowInput {
  readonly candidates: readonly FileReferenceCandidate[];
  readonly cwd: string;
}

/** Filesystem entries plus the home they were expanded against. */
export interface FilesystemRowInput {
  readonly home: string;
  readonly entries: readonly PathEntry[];
}

/** Commits plus the clock their relative ages are measured against. */
export interface CommitRowInput {
  readonly commits: readonly GitCommitSummary[];
  readonly now: number;
}

/**
 * Project commits into rows.
 *
 * The label is the subject, because that is what a reader recognises; the full
 * hash rides along as the alias (an unrendered match surface) so refining the
 * typed prefix keeps matching — a seven-digit abbreviation would stop on the
 * eighth keystroke, exactly when the reader is closing in on one commit.
 */
export function commitRows(input: CommitRowInput, copy: Copy): PanelRow[] {
  return input.commits.map(commit => ({
    key: `commit:${commit.hash}`,
    label: commit.subject,
    alias: commit.hash,
    detail: `${commit.author} · ${copy.age(input.now - commit.time * 1000)}`,
    group: copy.groupCommits,
    action: { kind: "open-commit", hash: commit.hash },
  }));
}

/**
 * Project filesystem entries into rows.
 *
 * The label is the expanded absolute path (what the composer will receive and
 * what the tree drill rewrites the query with); the tilde spelling rides along
 * as the alias so a query typed `~/…` keeps matching these rows between round
 * trips.
 */
export function filesystemRows(input: FilesystemRowInput, copy: Copy): PanelRow[] {
  return input.entries.map(entry => {
    const label = entry.kind === "directory" && !/[\\/]$/.test(entry.path) ? `${entry.path}/` : entry.path;
    const bare = label.replace(/[\\/]+$/u, "");
    const slash = Math.max(bare.lastIndexOf("/"), bare.lastIndexOf("\\"));
    return {
      key: `fsys:${entry.kind}:${label}`,
      label,
      alias: tildeForm(label, input.home),
      name: slash >= 0 ? bare.slice(slash + 1) : bare,
      kind: entry.kind,
      group: copy.groupFilesystem,
      origin: "filesystem",
      action: {
        kind: "insert-path",
        absolutePath: label,
        ...(entry.link === undefined ? {} : { link: entry.link }),
      },
    };
  });
}

/**
 * Project file candidates into rows.
 *
 * The label keeps the workspace-relative path because ranking and the tree
 * drill read it, and because it is what distinguishes two `index.ts` files.
 * The view shows `name` with the file tree's mark and the parent directory
 * beside it. The absolute path is the payload, computed here so the runtime
 * never re-derives it.
 */
export function fileRows(input: FileRowInput, _copy: Copy): PanelRow[] {
  return input.candidates.map(candidate => {
    const absolutePath = toAbsolutePath(input.cwd, displayPath(candidate));
    const label = displayPath(candidate);
    const bare = label.replace(/[\\/]+$/u, "");
    const slash = Math.max(bare.lastIndexOf("/"), bare.lastIndexOf("\\"));
    const name = slash >= 0 ? bare.slice(slash + 1) : bare;
    return {
      key: `file:${candidate.kind}:${candidate.path}`,
      label,
      alias: name,
      // The view paints the file tree's mark from this, so the row and the
      // tree name the same file the same way. The full path stays the label
      // because that is what ranking and the tree drill read.
      name,
      kind: candidate.kind,
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
 * Project the shortcuts catalogue into rows.
 *
 * These are the client product commands any mounted plugin registered — the
 * inspector's NodeJS diagnostics, the workbench's panel jumps — which have no
 * host slash command and would otherwise be unreachable except through their
 * key bindings. Entries the default catalogue already covers (via
 * `shortcutId`) are skipped so no action appears twice.
 *
 * @param entries - the shortcuts catalogue snapshot.
 * @param copy - active locale.
 * @param covered - shortcut ids already rendered by the default catalogue.
 * @returns one row per uncovered command, in catalogue order.
 */
export function shortcutRows(
  entries: readonly ShortcutCatalogEntry[],
  copy: Copy,
  covered: ReadonlySet<string>,
): PanelRow[] {
  const rows: PanelRow[] = [];
  for (const entry of entries) {
    if (covered.has(entry.id)) continue;
    const aliases = entry.aliases ?? [];
    rows.push({
      key: `shortcut:${entry.id}`,
      label: entry.label,
      alias: aliases.length > 0 ? aliases.join(" ") : undefined,
      hint: entry.keys.length > 0 ? entry.keys.join(" ") : undefined,
      group: copy.groupShortcuts,
      action: { kind: "invoke-shortcut", id: entry.id },
    });
  }
  return rows;
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
    alias: entry.aliases === undefined || entry.aliases.length === 0 ? undefined : entry.aliases.join(" "),
    hint: entry.shortcutId === undefined ? undefined : hints.get(entry.shortcutId),
    // The keycap is display; the id is what lets the row answer its own chord.
    // Without it the command mode would show a key that does nothing when pressed.
    shortcutId: entry.shortcutId,
    action: entry.action,
  }));
}

/**
 * Put the live keycap on the rows that declare a host shortcut.
 *
 * Rows built from host data (workspaces, sessions) never see the shortcuts
 * catalogue, so their keycaps are filled in here rather than at construction:
 * the same row then reads correctly after a rebind without the builder knowing
 * a catalogue exists. A row that already speaks its own trailing text keeps it,
 * and a shortcut that cannot be pressed contributes nothing.
 *
 * @param rows - rows as the mode's builder produced them.
 * @param entries - the shortcuts catalogue snapshot.
 * @returns the same array when no row needed a hint, else a new one.
 */
export function withShortcutHints(
  rows: readonly PanelRow[],
  entries: readonly ShortcutCatalogEntry[],
): PanelRow[] {
  let changed = false;
  const hinted = rows.map(row => {
    if (row.shortcutId === undefined || row.hint !== undefined) return row;
    const usable = usableShortcut(entries, row.shortcutId);
    if (usable === undefined) return row;
    changed = true;
    return { ...row, hint: usable.keys.join(" ") };
  });
  return changed ? hinted : (rows as PanelRow[]);
}

/**
 * The armed quit row speaks the confirmation instead of its label.
 *
 * This is a display projection, applied after ranking and never on the stored
 * rows: ranking scores the canonical labels, so the query keeps matching the
 * armed row at the seat it already held, and disarming (a retyped query, going
 * back, reopening) drops the wording without recomposition.
 */
export function withConfirmLabel(
  rows: readonly PanelRow[],
  confirmQuit: boolean,
  copy: Copy,
): readonly PanelRow[] {
  if (!confirmQuit) return rows;
  return rows.map(row => (row.action.kind === "request-shutdown" ? { ...row, label: copy.confirmQuit } : row));
}

/** Sessions that belong in a list: not archived, not blank, not a subagent. */
export function visibleSessions(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
): readonly SessionSummary[] {
  return scopeSessions(sessions, snapshot, scope, false);
}

/**
 * The newest live session of one scope: the second level's first row.
 *
 * One function rather than a second rule because the accelerator must open the
 * row the reader would have landed on had they drilled: same visibility filter,
 * same recency order. A tie keeps the catalogue's own order, exactly as the
 * stable sort in `sessionRows` does.
 *
 * @param sessions - the host's session catalogue.
 * @param snapshot - the workspace registry, for ownership and the archive set.
 * @param scope - one workspace, every session, or the ungrouped remainder.
 * @returns the session, or undefined when the scope has nothing to open.
 */
export function newestSession(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
): SessionSummary | undefined {
  let newest: SessionSummary | undefined;
  for (const session of visibleSessions(sessions, snapshot, scope)) {
    if (newest === undefined || session.updatedAt > newest.updatedAt) newest = session;
  }
  return newest;
}

/**
 * The scope's archived sessions: the mirror image of `visibleSessions`.
 *
 * The host keeps archived summaries inside the ordinary session catalogue (the
 * sidebar's archive view reads the same rows), so this filter needs no second
 * data plane — the panel's ordinary lists just skip them, and this one keeps
 * only them.
 */
export function archivedSessions(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
): readonly SessionSummary[] {
  return scopeSessions(sessions, snapshot, scope, true);
}

/** One scope pass over the catalogue, picking the live side or the archive side. */
function scopeSessions(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
  archived: boolean,
): readonly SessionSummary[] {
  const archiveSet = new Set(snapshot.archivedSessionIds);
  const owned = scope.kind === "workspace" ? workspaceOwnership(snapshot).get(scope.workspaceId) : undefined;

  const rows: SessionSummary[] = [];
  for (const id of sessions.ids) {
    const session = sessions.byId[id];
    if (session === undefined) continue;
    if (session.blank || session.origin === "subagent") continue;
    if (archiveSet.has(id) !== archived) continue;
    if (scope.kind === "workspace" && (owned === undefined || !owned.has(id))) continue;
    if (scope.kind === "ungrouped" && isGrouped(snapshot, id)) continue;
    rows.push(session);
  }
  return rows;
}

/**
 * The calendar-day bucket an archived session lands in.
 *
 * Local calendar days, not elapsed hours: a session last touched at 23:00
 * reads as "yesterday" the next morning even though fewer than 24 hours
 * passed, which is what the bucket label promises.
 */
export function dateBucketLabel(updatedAt: number, now: number, copy: Copy): string {
  const then = new Date(updatedAt);
  const today = new Date(now);
  const day = (date: Date): number => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((day(today) - day(then)) / 86_400_000);
  if (diffDays <= 0) return copy.bucketToday;
  if (diffDays === 1) return copy.bucketYesterday;
  if (diffDays <= 7) return copy.bucketWeek;
  if (diffDays <= 30) return copy.bucketMonth;
  return copy.bucketOlder;
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
  now: number,
): PanelRow[] {
  const archived = new Set(snapshot.archivedSessionIds);
  const rows: PanelRow[] = [];

  for (const workspace of snapshot.items) {
    const count = countVisible(sessions, workspace, archived);
    const tone = workspaceTier(sessions, workspace.sessionIds, now);
    rows.push({
      key: `workspace:${workspace.workspaceId}`,
      label: workspace.title,
      alias: workspace.path,
      // The path stays matchable but leaves the row: the sidebar's workspace
      // row shows a folder and the title, and the panel's row does the same.
      hint: copy.sessionsCount(count),
      tone,
      weight: tone === "strong" || tone === "mid" ? "bold" : undefined,
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

  // The two fixed rows close the list: creating a session and reaching the
  // archive are both "the list I see is not the session I want" intents, and
  // their data is already in hand, so neither row costs a host round trip.
  rows.push({
    key: "scope:new-session",
    label: copy.newSession,
    // This row starts a session exactly where the host command does — the
    // current session's workspace, else the most recent one — so the keycap it
    // shows is a true promise.
    shortcutId: "session.new",
    action: { kind: "create-session", scope: "workspace" },
  });
  rows.push({
    key: "scope:archived",
    label: copy.archivedSessions,
    hint: copy.sessionsCount(archivedSessions(sessions, snapshot, { kind: "all" }).length),
    action: { kind: "drill-archived" },
  });

  return rows;
}

/**
 * The switch mode's second level: sessions of one scope, newest first.
 *
 * The host's list order is a manual order, not recency, so a palette that wants
 * "the one I was just in" has to sort by `updatedAt` itself.
 *
 * In the archive view the same list becomes the archived side: rows restore
 * instead of switching, and calendar-day buckets keep a long archive readable.
 * A workspace scope's ordinary view closes with two fixed rows — new session,
 * then that workspace's archived sessions — while the archive itself grows
 * neither: creating or drilling from inside the archive is not an intention
 * the view should guess.
 */
export function sessionRows(
  sessions: SessionListState,
  snapshot: WorkspaceSnapshot,
  scope: SessionScope,
  copy: Copy,
  now: number,
  archived = false,
): PanelRow[] {
  const visible = [...(archived ? archivedSessions(sessions, snapshot, scope) : visibleSessions(sessions, snapshot, scope))];
  visible.sort((left, right) => right.updatedAt - left.updatedAt);

  const rows: PanelRow[] = visible.map(session => {
    const owner = scope.kind === "all" ? workspaceTitle(snapshot, session.id) : undefined;
    const age = copy.age(now - session.updatedAt);
    return {
      key: archived ? `archive:${session.id}` : `session:${session.id}`,
      label: session.displayTitle,
      detail: owner === undefined ? age : `${owner} · ${age}`,
      group: archived ? dateBucketLabel(session.updatedAt, now, copy) : undefined,
      hint: archived ? copy.restoreHint : session.running ? copy.running : undefined,
      hintTone: !archived && session.running ? ("running" as const) : undefined,
      // 归档行交还宿主的 caption 灰语义，与侧栏「归档会话不计因子但自身不着色」一致
      tone: archived ? undefined : sessionTier(sessions, session.id, now),
      action: archived
        ? ({ kind: "restore-session", sessionId: session.id } as const)
        : ({ kind: "open-session", sessionId: session.id } as const),
    };
  });

  if (!archived && scope.kind === "workspace") {
    // The trailing pair both answer "the list I see is not the session I want";
    // the archive count reads the same workspace scope so the hint never
    // promises a larger archive than the drilled list delivers.
    rows.push({
      key: "scope:new-session",
      label: copy.newSession,
      // No host shortcut on this row: Enter starts a session in the drilled
      // workspace, while `session.new` starts one where the reader currently
      // is. A keycap that would do something else is worse than none.
      action: { kind: "create-session", scope: "workspace", workspaceId: scope.workspaceId },
    });
    rows.push({
      key: "scope:archived",
      label: copy.archivedSessions,
      hint: copy.sessionsCount(archivedSessions(sessions, snapshot, scope).length),
      action: { kind: "drill-archived" },
    });
  }
  return rows;
}
