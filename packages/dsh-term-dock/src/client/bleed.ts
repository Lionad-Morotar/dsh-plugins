/**
 * How far the dock row has to reach sideways to fill the conversation column.
 *
 * The composer sits in a centred, max-width stack (`composerStack`), so the dock
 * row inherits that stack's width even after its own padding is zeroed: on the
 * App the terminal stopped ~200px short of the column on each side. Nothing in
 * CSS can name an ancestor's width, so the dock measures the gap once per layout
 * and publishes it as two custom properties the injected rule consumes.
 */

/** Horizontal overflow the dock row must add to reach the column edges. */
export interface Bleed {
  readonly left: number;
  readonly right: number;
}

/** Any box measured with `getBoundingClientRect`. */
export interface Box {
  readonly left: number;
  readonly right: number;
}

/**
 * Distance from the dock row's box out to the column's box, per side.
 *
 * Only positive gaps become overflow: a row that is already wider than the
 * column must not be pulled inwards, because that would clip the terminal.
 * @param wrap - the composer dock row.
 * @param column - the ancestor standing for the conversation column.
 * @returns rounded pixel gaps; `0` on a side that needs nothing.
 */
export function bleedBetween(wrap: Box, column: Box): Bleed {
  return {
    left: Math.max(0, Math.round(wrap.left - column.left)),
    right: Math.max(0, Math.round(column.right - wrap.right)),
  };
}

/**
 * Pick the box that stands for the conversation column.
 *
 * The column is the widest ancestor the dock row has that is not the document
 * itself: the sidebar is a sibling of that box, so anything wider would drag the
 * terminal under the sidebar.
 * @param candidates - ancestor boxes, nearest first, each flagged when it is the
 * document root (`body` / `html`).
 * @returns the chosen box, or undefined when every candidate is the document.
 */
export function pickColumn(candidates: readonly { readonly box: Box; readonly isDocument: boolean }[]): Box | undefined {
  let best: Box | undefined;
  let widest = -1;
  for (const candidate of candidates) {
    if (candidate.isDocument) continue;
    const width = candidate.box.right - candidate.box.left;
    if (width > widest) {
      widest = width;
      best = candidate.box;
    }
  }
  return best;
}
