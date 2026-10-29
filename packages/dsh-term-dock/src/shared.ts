/** Values both halves of the package agree on. */
export const PACKAGE_NAME = "dsh-term-dock";

/**
 * Host slot the dock occupies.
 *
 * `shell.bottom` is a single, root-scoped slot: the first registrant wins, so
 * the core will later own the visibility switch that decides whether this row
 * registers at all (blueprint D2).
 */
export const DOCK_SLOT = "shell.bottom";

/** Stable product id, used for DOM probes and diagnostics. */
export const DOCK_ID = "term-dock";

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "term-dock";
