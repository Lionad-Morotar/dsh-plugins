/** Values both halves of the package agree on. */
export const PACKAGE_NAME = "dsh-git-explorer";

/** Host slot the Git workbench registers into. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "git-explorer";

/** Tab order in the conversation view row; chat stays at 0. */
export const VIEW_ORDER = 110;

/**
 * Session header action row the branch trigger joins.
 *
 * It is a per-session list slot, so every entry receives the owning
 * `sessionId` as a prop; the trigger reads its inventory from that id.
 */
export const HEADER_SLOT = "conversation.session.header.actions";

/** Cell id inside that action row. */
export const HEADER_ID = "git-branch";

/**
 * Position in the action row.
 *
 * The shipped occupants are agent-team (-20), subagent catalog (10) and the job
 * list (20); the branch belongs at the right edge of that cluster.
 */
export const HEADER_ORDER = 30;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "git-explorer";

/**
 * Cordis service key and Typert wire namespace of the host half.
 *
 * The client half reaches the three endpoints as `remote.gitExplorer.*`; the
 * key is shared here so a future rename cannot desynchronize the two halves.
 */
export const GIT_SERVICE = "gitExplorer";
