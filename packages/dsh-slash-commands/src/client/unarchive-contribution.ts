/**
 * `/unarchive` as a client-side, state-gated command.
 *
 * The web/desktop slash menu must not offer a restore command for a session
 * that is not archived: a restore row in an unarchived session is dead weight
 * in every palette. The client contribution face is where per-session gating
 * lives — `available` runs on every candidate pass, so the row appears the
 * moment the host's archive push marks the open session and disappears the
 * moment it does not — while the host registry has no such hook.
 *
 * The write goes through the same workspaces rpc the sidebar's「取消归档」row
 * uses, so the command invents no second notion of restoring. It is absent
 * from the TUI (no client half there); the TUI's host-registry row is the
 * honest constant because a TUI session stays open after being archived.
 */

/** Command name without the leading slash, matching the host grammar. */
export const UNARCHIVE_COMMAND_NAME = "unarchive";

/** What this contribution needs from `ctx.workspaces`: the archive set and the restore call. */
export interface UnarchiveWorkspacesLike {
  readonly list: { getSnapshot(): { readonly archivedSessionIds: readonly string[] } };
  unarchiveSession?(sessionId: string): Promise<void>;
}

/** The slice of the client context this contribution reads. */
export interface UnarchiveContributionContext {
  readonly workspaces: UnarchiveWorkspacesLike;
}

/** The session projection availability checks and runs receive. */
export interface UnarchiveSession {
  readonly sessionId: string;
}

/**
 * Whether the session in use is currently archived — the whole gate. Unarchive
 * means nothing for a session the archive set does not name, and the menu
 * should not pretend otherwise.
 */
export function unarchiveAvailable(archivedSessionIds: readonly string[], sessionId: string): boolean {
  return archivedSessionIds.includes(sessionId);
}

/**
 * Build the contribution. The archive set is read per check, never captured at
 * registration: sessions are archived and restored while the plugin stays
 * mounted, and a stale set would show or hide the row against the host's truth.
 */
export function createUnarchiveContribution(ctx: UnarchiveContributionContext): {
  readonly name: string;
  label(): string;
  description(): string;
  available(session: UnarchiveSession): boolean;
  readonly ui: { readonly kind: "action"; run(session: UnarchiveSession): void };
} {
  return {
    name: UNARCHIVE_COMMAND_NAME,
    label: () => "取消归档",
    description: () => "把已归档的当前会话放回会话列表",
    available(session) {
      return unarchiveAvailable(ctx.workspaces.list.getSnapshot().archivedSessionIds, session.sessionId);
    },
    ui: {
      kind: "action",
      run(session) {
        const unarchive = ctx.workspaces.unarchiveSession;
        if (typeof unarchive !== "function") return;
        // Unarchiving is idempotent on the host, so the ordinary failure mode
        // is a carrier fault; the menu callback cannot render an error surface,
        // so the fault is logged and the user falls back to the sidebar row.
        unarchive.call(ctx.workspaces, session.sessionId).catch(reason => {
          console.warn("dsh-slash-commands: /unarchive failed:", reason);
        });
      },
    },
  };
}
