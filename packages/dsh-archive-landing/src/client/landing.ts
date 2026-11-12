/**
 * The landing rule, kept pure so it can be read and asserted without the host's
 * stores or a sidebar in front of it.
 */

/** Where the main view should go once the current session is archived. */
export type Landing = { readonly kind: "open"; readonly id: string } | { readonly kind: "start" };

/** The rule's only "no neighbour" answer; a fresh object would be re-allocated per call. */
const START: Landing = { kind: "start" };

/**
 * Pick the session the main view should land on after `current` is archived.
 *
 * `order` is the pre-archive sidebar order, so `current` still sits at its old
 * position: the row directly below it is the "next" the user means. At the end
 * of the list the row above takes over, and a session with no neighbour at all
 * (or one that is not in the order, e.g. only reachable through search) starts
 * a new conversation instead.
 * @param order - session ids in the order the sidebar showed them before the archive.
 * @param current - the session being archived.
 * @returns the landing, resolved by the caller against the host services.
 */
export function chooseLanding(order: readonly string[], current: string): Landing {
  const index = order.indexOf(current);
  if (index === -1) return START;
  const next = order[index + 1];
  if (next !== undefined) return { kind: "open", id: next };
  const previous = order[index - 1];
  if (previous !== undefined) return { kind: "open", id: previous };
  return START;
}
