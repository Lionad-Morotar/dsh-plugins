/**
 * Host half.
 *
 * The feature is entirely a client-side rendering change: which rows the picker
 * draws for a query is decided in the browser, from a row list the host already
 * publishes. There is nothing for the host half to add, and inventing a service
 * call here would put a network round trip on a keystroke path that is currently
 * local.
 *
 * The module still exists because every Loader row in this repo is loaded as
 * `{name, apply}` on both surfaces; an empty apply is what makes the row legal on
 * the host without claiming a capability it does not have.
 */

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = "dsh-better";

/** Services the host half reads; none, which is why the list is empty. */
export const inject: string[] = [];

/** No host-side work: see the module note. */
export function apply(): void {}
