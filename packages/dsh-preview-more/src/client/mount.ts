/**
 * The mount lifecycle every engine surface shares.
 *
 * A preview that fails once has to be able to come back: the reader clicks
 * retry, the engine gets another attempt, and a transient failure (a WebGL
 * context that was refused, a file read that raced the workspace) does not
 * strand the tab. That only works when the element the engine mounts into
 * outlives the failure, so the rule is written down here once instead of being
 * re-derived in each surface.
 *
 * Nothing in this module touches React or the DOM: it is the part of the
 * lifecycle that can be wrong in a way no screenshot shows.
 */

/** What one attempt is allowed to do to the element it mounts into. */
export interface MountSlot {
  /** Element the engine draws into. */
  readonly container: HTMLElement;
  /** Remove whatever a previous attempt left behind. */
  clear(): void;
}

/** The phase one surface is in. */
export type MountPhase =
  | { readonly kind: "loading" }
  | { readonly kind: "failed"; readonly message: string };

/**
 * Whether an attempt may start.
 *
 * A missing container is the failure this function exists for. The surface keeps
 * the container mounted through a failure, so `null` means the surface is
 * between mounts rather than that the preview is unrecoverable.
 * @param container - the element resolved from the surface's ref.
 * @returns true when an attempt can proceed.
 */
export function canAttempt(container: HTMLElement | null): container is HTMLElement {
  return container !== null;
}

/**
 * Prepare the element for a new attempt.
 *
 * Retry re-enters the same effect on the same element, so anything the failed
 * attempt appended is cleared first. Without this, a success after a failure
 * leaves two canvases stacked in one box.
 * @param slot - the element and its clear operation.
 */
export function prepareAttempt(slot: MountSlot): void {
  slot.clear();
}

/**
 * The message a reader is shown for one thrown value.
 *
 * An engine failure is often a DOMException or a loader's bare string, neither of
 * which carries a useful `message`, so the fallback has to name the failure
 * rather than render `[object Object]`.
 * @param error - whatever the attempt threw.
 * @returns a message fit for the failure panel.
 */
export function failureMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string" && error.length > 0) return error;
  return "the preview failed without a message";
}

/**
 * Settle guard for the host's renderer handshake.
 *
 * The host accepts exactly one `loaded` or `failed` per revision, so the report
 * has to be idempotent: retrying a failed render must not report the old
 * revision twice.
 * @param reported - the revision already reported, or -1 for none.
 * @param revision - the revision this attempt belongs to.
 * @returns true when this attempt should report.
 */
export function shouldSettle(reported: number, revision: number): boolean {
  return reported !== revision;
}
