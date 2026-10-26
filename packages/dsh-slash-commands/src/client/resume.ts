/**
 * `/resume` as a pure session switch.
 *
 * The command exists to answer one question the keyboard cannot: "which of my
 * sessions do I want to be in now". It is therefore the sidebar's click expressed
 * as a slash command `-` the same catalog, the same navigation call, no second
 * notion of session state that could drift from the sidebar's.
 *
 * Scope is a tab, carried by two option rows at the top of the list. The shared
 * popup shell has no tab widget, so switching scope means re-opening the same
 * shell with the other row set, which the shell documents as the way to replace
 * an open picker. Keeping the scope rows inside the option list also means search
 * covers what is in scope: archived sessions are never loaded, so no query can
 * reach them.
 *
 * Everything here is DOM-free and takes its collaborators structurally, so the
 * switch semantics are testable without a browser and the only thing left in the
 * client wiring is reading the live catalogs.
 */

/** Bare command name; the slash menu keys contributions by this, not by `/resume`. */
export const RESUME_COMMAND_NAME = "resume";

/**
 * Row-set scopes, in display order. `project` is first because it is the default:
 * resuming almost always means "the thing I am working on", and the wider list is
 * the escape hatch rather than the posture.
 */
export const RESUME_SCOPES = ["project", "all"] as const;

/** One row-set scope. */
export type ResumeScope = (typeof RESUME_SCOPES)[number];

/** Where a freshly opened picker starts. */
export const DEFAULT_SCOPE: ResumeScope = "project";

/** Row id prefix for scope rows, so a pick can tell a scope from a session. */
export const SCOPE_ROW_PREFIX = "scope:";

/** The group the scope rows live in; session rows stay ungrouped under them. */
export const SCOPE_GROUP = { name: "scope", label: "范围" } as const;

/** The catalog shape this command reads out of `ctx.sessions.list`. */
export interface SessionListLike {
  readonly ids: readonly string[];
  readonly byId: Readonly<Record<string, SessionRowLike | undefined>>;
}

/** The subset of `SessionSummary` the row builder depends on. */
export interface SessionRowLike {
  readonly displayTitle?: string;
  readonly running?: boolean;
  readonly blank?: boolean;
  readonly cwd?: string;
  readonly origin?: "subagent";
}

/** One popup row; the field names are the shell's, not ours. */
export interface ResumeRow {
  readonly id: string;
  readonly label: string;
  readonly badge?: string;
  readonly group?: { readonly name: string; readonly label: string };
  readonly active?: boolean;
}

/** Everything one row set derivation needs to know. */
export interface ResumeRowsInput {
  readonly currentSessionId: string;
  readonly scope: ResumeScope;
  /** Host-confirmed archive set; archived sessions are absent from every scope. */
  readonly archived: readonly string[];
  /** Directory of the session in use, which defines the project scope. */
  readonly currentCwd?: string | undefined;
}

/** What `switchTo` needs from the workspace navigator. */
export interface SessionOpener {
  openSession(sessionId: string): void;
}

/**
 * One scope row.
 *
 * The scope in use carries a `当前` badge rather than `active`: `active` parks the
 * shell's highlight there, and an accept made without looking would then re-pick
 * the scope in use instead of confirming the session the user is already in. A
 * badge states the same fact without claiming the default pick.
 */
export function scopeRow(scope: ResumeScope, current: boolean): ResumeRow {
  return {
    id: `${SCOPE_ROW_PREFIX}${scope}`,
    label: scope === "project" ? "当前项目" : "全部会话",
    group: SCOPE_GROUP,
    ...(current ? { badge: "当前" } : {}),
  };
}

/** Whether an option id names a scope rather than a session. */
export function scopeOfRow(id: string): ResumeScope | undefined {
  if (!id.startsWith(SCOPE_ROW_PREFIX)) return undefined;
  const scope = id.slice(SCOPE_ROW_PREFIX.length);
  return RESUME_SCOPES.includes(scope as ResumeScope) ? (scope as ResumeScope) : undefined;
}

/** The scope rows of one opening, in fixed order, badging the one in use. */
export function scopeRows(scope: ResumeScope): readonly ResumeRow[] {
  return RESUME_SCOPES.map(candidate => scopeRow(candidate, candidate === scope));
}

/** The scope a scope pick leads to; picking the one already in use changes nothing. */
export function nextScope(id: string): ResumeScope | undefined {
  return scopeOfRow(id);
}

/**
 * Project the catalog into the session rows of one scope.
 *
 * Exclusions, all of them mirroring the sidebar rather than inventing a rule:
 *
 * - Blank sessions are dropped. The Workspace browser hides them behind the "new
 *   session" affordance because switching to a blank is starting work, not
 *   resuming it; offering them here would contradict the surface this mirrors.
 * - Archived sessions are dropped from both scopes. They are hidden from the
 *   sidebar by design, and listing them would make `/resume` a back door to what
 *   the user deliberately put away. Because they are never loaded, search cannot
 *   reach them either.
 * - Subagent children are dropped: their id is a continuation address, not a
 *   conversation the user opens.
 * - Nothing claims `active` unless it is the session in use. The shell parks its
 *   highlight on the active row and an accept made without looking confirms that
 *   row, so a decorative mark would silently redirect the user.
 *
 * Order follows `ids` verbatim: it is the host's list order, which is what the
 * sidebar shows. Re-sorting here would make the two disagree.
 *
 * The project scope needs a directory to scope to. Without one it falls back to
 * every session rather than to nothing: an empty picker would read as "you have
 * no sessions" when the truth is "this session has no project".
 */
export function resumeRows(state: SessionListLike, input: ResumeRowsInput): readonly ResumeRow[] {
  const archived = new Set(input.archived);
  const projectCwd = input.scope === "project" ? input.currentCwd : undefined;
  const rows: ResumeRow[] = [];
  for (const id of state.ids) {
    const session = state.byId[id];
    if (session === undefined) continue;
    if (session.blank === true) continue;
    if (session.origin === "subagent") continue;
    if (archived.has(id)) continue;
    if (projectCwd !== undefined && session.cwd !== projectCwd) continue;
    rows.push({
      id,
      label: session.displayTitle !== undefined && session.displayTitle !== "" ? session.displayTitle : id,
      ...(session.running === true ? { badge: "运行中" } : {}),
      ...(id === input.currentSessionId ? { active: true } : {}),
    });
  }
  return rows;
}

/** Scope rows first, then the session rows of that scope: one option list. */
export function resumeOptions(state: SessionListLike, input: ResumeRowsInput): readonly ResumeRow[] {
  return [...scopeRows(input.scope), ...resumeRows(state, input)];
}

/**
 * Perform the switch for one picked row.
 *
 * A pick that names the session already in use is a no-op rather than a
 * re-navigation: `openSession` on the current session would remount the
 * conversation and drop the user's scroll position and in-flight draft, which is
 * never what "resume the one I'm already in" means.
 */
export async function switchTo(
  opener: SessionOpener,
  row: { readonly id: string },
  currentSessionId?: string,
): Promise<void> {
  if (row.id === currentSessionId) return;
  await opener.openSession(row.id);
}
