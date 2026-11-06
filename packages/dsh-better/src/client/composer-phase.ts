/**
 * The composer's published submit phase.
 *
 * A message leaves the editor on send, but the host has not accepted it yet:
 * 0.2.2 publishes `sending` for that window and keeps the draft in place until
 * the sink settles. Everything this package draws around the composer must read
 * the same window, because the host's "is something queued" face
 * (`pendingSubmissions`) now appears only after acceptance, which leaves the
 * send itself invisible.
 *
 * The union is local on purpose: no runtime import of a host package, and any
 * phase this list does not know is treated as busy rather than idle — a future
 * phase that freezes the editor must not be mistaken for a writable one.
 */

/** The phases the host publishes; only `plain` accepts input. */
export type ComposerPhase = "plain" | "adjudicating" | "claimed" | "submitting" | "sending";

/** One session's published composer state, narrowed to the phase store. */
export interface ComposerPhaseStoreLike {
  getSnapshot(): { readonly phase: string };
  subscribe(listener: () => void): () => void;
}

/**
 * Whether the composer is mid-submit.
 *
 * The host freezes the editor and the attachment intake for every phase but
 * `plain`, so a surface that writes there would otherwise fail without a trace.
 * An unpublished phase (a host older than `sending`) is not busy: those hosts do
 * not freeze anything this package writes.
 * @param phase - the published phase, or undefined when the host publishes none.
 * @returns true while a submission is being adjudicated, submitted or accepted.
 */
export function composerBusy(phase: string | undefined): boolean {
  return phase !== undefined && phase !== "plain";
}
