/**
 * Host half of dsh-blank-new-chat.
 *
 * The feature lives in the browser: the client half registers a synthetic
 * conversation target and activates it on the blank home, which flips the
 * shell's conversation phase from `blank` to `active`. The Host row still
 * exists so the bundle has a Loader entry to mount.
 */

/** @returns nothing; the Host side owns no state. */
export function apply(): void {}
