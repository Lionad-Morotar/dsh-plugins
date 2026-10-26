/**
 * The client wiring behind `/resume`.
 *
 * The seam is deliberately thin: everything decidable is in `resume.ts`, and
 * this module only reads the live catalogs, hands the shell a command object, and
 * forwards the pick. Reading the catalogs inside `options` (per open) rather than
 * at registration is load-bearing: sessions are created, finished and archived
 * while the plugin stays mounted, so a list captured once would be stale by the
 * second invocation.
 *
 * The invoking session id comes from the session argument, not from a
 * `sessions.current()` read: the shell already knows which session opened the
 * popup, and asking a second source invites the two to disagree mid-navigation.
 * The project boundary is read the same way, from that session's own row.
 *
 * The scope rows are tabs. The shell renders one option list and has no tab
 * widget, so picking a scope re-opens the popup with the other row set: `open` is
 * documented as superseding the open picker, which is exactly a tab switch. The
 * re-open carries no token of its own, so the superseded settle cannot close the
 * new shell - the settlement that started it sees its binding replaced and stops.
 */
import {
  DEFAULT_SCOPE,
  RESUME_COMMAND_NAME,
  nextScope,
  resumeOptions,
  switchTo,
  type ResumeRow,
  type ResumeScope,
  type SessionListLike,
} from "./resume.ts";

/** The session projection the popup callbacks receive. */
export interface InvokingSession {
  readonly sessionId: string;
}

/** What this wiring needs from `ctx.sessions`: the catalog and session scopes. */
export interface ResumeSessionsLike {
  readonly list: { getSnapshot(): SessionListLike };
  scope?(sessionId: string): unknown;
}

/** What this wiring needs from `ctx.workspaces`: the archive set and nothing else. */
export interface ResumeWorkspacesLike {
  readonly list: { getSnapshot(): { readonly archivedSessionIds: readonly string[] } };
}

/** What this wiring needs from `ctx.uiWorkspace`: session navigation. */
export interface ResumeWorkspaceLike {
  openSession(sessionId: string): void;
}

/** The popup surface a scope pick re-opens onto; `open` supersedes the old shell. */
export interface ResumePopupLike {
  open(command: string, spec: ResumePopupSpec, context: InvokingSession, segment: { via: "enter"; token: string }): void;
  /** Re-applies the filter after a reopen; a no-op while no shell is open. */
  setSearch?(search: string): void;
  /** Read-only shell state, used to carry the filter across a reopen. */
  readonly state?: { getSnapshot(): { readonly search: string } };
}

/** The spec half of the popup, i.e. the contribution's `ui` without its kind tag. */
export interface ResumePopupSpec {
  readonly searchMode: "fuzzy-label";
  searchLabels(): { placeholder: string; empty: string; noResults: string };
  options(session: InvokingSession, signal: AbortSignal): Promise<readonly ResumeRow[]>;
  onSelect(option: ResumeRow, session: InvokingSession): Promise<void>;
}

/** What this wiring needs from `ctx.commandUi`. */
export interface ResumeCommandUiLike {
  register(contribution: ResumeContribution): () => void;
  popupFor?(actx: unknown): ResumePopupLike | undefined;
}

/** The context shape this wiring reads; spelled structurally so the package
 *  keeps no compile-time dependency on the harness' internal type packages. */
export interface ResumeWiringContext {
  readonly commandUi: ResumeCommandUiLike;
  readonly sessions: ResumeSessionsLike;
  readonly workspaces: ResumeWorkspacesLike;
  readonly uiWorkspace: ResumeWorkspaceLike;
}

/** The contribution object `ctx.commandUi.register` accepts, narrowed to what
 *  this command actually populates. */
export interface ResumeContribution {
  readonly name: string;
  label(): string;
  description(): string;
  available(session: InvokingSession): boolean;
  readonly ui: { readonly kind: "popupSelect" } & ResumePopupSpec;
}

/**
 * Build the contribution for one client context.
 *
 * `available` is unconditionally true, including for a session with no rows:
 * the popup itself is the empty-state surface ("no sessions to switch to"), and
 * hiding the command would leave the user with no explanation for its absence.
 *
 * Every open starts in the project scope. Scope is per-opening state rather than a
 * remembered preference: the command answers "where am I going now", and starting
 * on the current project is the answer that needs no reading.
 */
export function createResumeContribution(ctx: ResumeWiringContext): ResumeContribution {
  /** Read both catalogs at open time; they arrive from different services. */
  const rows = (sessionId: string, scope: ResumeScope): readonly ResumeRow[] => {
    const sessions = ctx.sessions.list.getSnapshot();
    const currentCwd = sessions.byId[sessionId]?.cwd;
    return resumeOptions(sessions, {
      currentSessionId: sessionId,
      scope,
      archived: ctx.workspaces.list.getSnapshot().archivedSessionIds,
      ...(currentCwd !== undefined ? { currentCwd } : {}),
    });
  };

  /** Re-open the popup onto another scope; false when the shell is unreachable. */
  const reopen = (session: InvokingSession, scope: ResumeScope): boolean => {
    const actx = ctx.sessions.scope?.(session.sessionId);
    if (actx === undefined) return false;
    let popup: ResumePopupLike | undefined;
    try {
      popup = ctx.commandUi.popupFor?.(actx);
    } catch {
      // The controller refuses a Context whose Session generation was released.
      // That can only happen while the surface is tearing down, and a scope pick
      // is not worth an error banner over: the shell closes and the user retries.
      return false;
    }
    if (popup === undefined) return false;
    // The filter is read before the reopen because the reopen resets the shell:
    // a fresh open starts with an empty query, so a user who had narrowed the list
    // and then switched scope would silently lose their filter and have to type it
    // again to keep looking at the same subset.
    const search = popup.state?.getSnapshot().search ?? "";
    // The controller swaps its binding before the old settlement resumes, and the
    // old settlement drops out on that mismatch, so this re-open survives the
    // pick that opened it. The token is replayed unchanged because the original
    // one was never consumed: the superseded settlement never reached consumption.
    popup.open(RESUME_COMMAND_NAME, specFor(scope), session, {
      via: "enter",
      token: `/${RESUME_COMMAND_NAME} `,
    });
    if (search !== "") popup.setSearch?.(search);
    return true;
  };

  /** The popup behaviour of one scope: the row set, and what a pick does in it. */
  const specFor = (scope: ResumeScope): ResumePopupSpec => ({
    // Titles are names the user recognizes, so fuzzy ranking beats substring
    // matching: a two-word title stays reachable from its initials.
    searchMode: "fuzzy-label",
    searchLabels: () => ({ placeholder: "搜索会话", empty: "还没有可切换的会话", noResults: "没有匹配的会话" }),
    options: async (session, signal) => {
      // An aborted open (the user closed the popup, or picked something else)
      // must not spend the catalog read on rows nobody will see.
      signal.throwIfAborted();
      return rows(session.sessionId, scope);
    },
    onSelect: async (option, session) => {
      const target = nextScope(option.id);
      if (target !== undefined) {
        // Picking the scope already in use changes nothing; re-opening onto the
        // identical list would only throw away the user's search.
        if (target !== scope) reopen(session, target);
        return;
      }
      await switchTo({ openSession: id => ctx.uiWorkspace.openSession(id) }, option, session.sessionId);
    },
  });

  return {
    name: RESUME_COMMAND_NAME,
    label: () => "切换会话",
    description: () => "切换到另一个已有会话，等同在侧边栏点击该会话",
    available: () => true,
    ui: { kind: "popupSelect", ...specFor(DEFAULT_SCOPE) },
  };
}
