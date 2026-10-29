/** Values both halves of the package agree on. */
export const PACKAGE_NAME = "dsh-git-explorer";

/** Host slot the Git workbench registers into. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "git-explorer";

/** Tab order in the conversation view row; chat stays at 0. */
export const VIEW_ORDER = 110;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "git-explorer";

/**
 * Cordis service key and Typert wire namespace of the host half.
 *
 * The client half reaches the three endpoints as `remote.gitExplorer.*`; the
 * key is shared here so a future rename cannot desynchronize the two halves.
 */
export const GIT_SERVICE = "gitExplorer";
