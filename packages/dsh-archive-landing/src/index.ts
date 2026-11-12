/**
 * Host half of dsh-archive-landing.
 *
 * The feature is entirely a browser-side navigation policy: it needs the client
 * workspace service, the persisted selection snapshot and the sidebar DOM. The
 * Host row exists only so the bundle has a Loader entry to mount.
 */

/** @returns nothing; the Host side owns no state. */
export function apply(): void {}
