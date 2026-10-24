/**
 * Keeping the caret where the user can see it.
 *
 * Cancelling the keydown also cancels the browser's own scroll-into-view, so
 * every move this plugin makes has to reveal the new caret itself. Two shapes:
 *
 * - Rich text: the caret has a real client rect, so revealing it is the same
 *   nearest-scroll adjustment for every scrollable ancestor.
 * - Text fields: the caret has no rect. A single-line input only ever needs a
 *   horizontal scroll, and a textarea's line index times its line height is
 *   close enough to the truth (soft wrapping is the only case it approximates).
 *
 * Only bounding-box arithmetic lives here so the reveal policy can be tested
 * without a layout engine; the DOM reads stay in app.ts.
 */

export interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** One scroll container's viewport box plus its scroll state. */
export interface ScrollBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
}

export interface ScrollDelta {
  top?: number;
  left?: number;
}

/** Does this element scroll at all? Sub-pixel overflow is not a scroll. */
export function isScrollable(box: ScrollBox): boolean {
  return box.scrollHeight - box.clientHeight > 1 || box.scrollWidth - box.clientWidth > 1;
}

/**
 * The smallest scroll adjustment that brings `rect` inside `box`.
 *
 * "Smallest" is the whole point: scrolling a container that already shows the
 * caret would move content the user is reading, which is exactly the bug this
 * plugin exists to fix. When both edges overflow (an element taller than the
 * viewport) the top edge wins, matching CSS scroll-into-view's "nearest"
 * behaviour.
 */
export function revealDelta(box: ScrollBox, rect: Rect, margin = 4): ScrollDelta {
  const delta: ScrollDelta = {};

  if (box.scrollHeight - box.clientHeight > 0) {
    const viewTop = box.top + margin;
    const viewBottom = box.bottom - margin;
    if (rect.top < viewTop) {
      delta.top = Math.max(box.scrollTop - (viewTop - rect.top), 0);
    } else if (rect.bottom > viewBottom) {
      const max = box.scrollHeight - box.clientHeight;
      delta.top = Math.min(box.scrollTop + (rect.bottom - viewBottom), max);
    }
  }

  if (box.scrollWidth - box.clientWidth > 0) {
    const viewLeft = box.left + margin;
    const viewRight = box.right - margin;
    const max = box.scrollWidth - box.clientWidth;
    // Line boundaries always reset the horizontal axis, so the rule is
    // directional rather than "nearest": Home shows the line start, End the end.
    if (rect.left < viewLeft) {
      delta.left = 0;
    } else if (rect.right > viewRight) {
      delta.left = Math.min(box.scrollLeft + (rect.right - viewRight), max);
    }
  }

  return delta;
}

/** Vertical/horizontal offsets for a text field caret, from its own metrics. */
export interface FieldMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
  lineHeight: number;
  paddingTop: number;
}

/**
 * Where a text field should scroll to show the caret at `offset`.
 *
 * `line` is the hard-line index of the offset: Home starts the current line,
 * End finishes it. A soft-wrapped line therefore lands on the first visual row
 * that contains the logical offset, which is close enough for a field the user
 * is typing into; correctness of the caret itself never depends on this.
 */
export function textFieldScroll(metrics: FieldMetrics, value: string, offset: number): ScrollDelta {
  const delta: ScrollDelta = {};
  const clamp = (v: number, max: number): number => Math.min(Math.max(v, 0), Math.max(max, 0));

  const lineHeight = metrics.lineHeight > 0 ? metrics.lineHeight : 20;
  const line = countLines(value, offset);
  const caretTop = metrics.paddingTop + line * lineHeight - metrics.scrollTop;
  const caretBottom = caretTop + lineHeight;

  if (caretTop < 0) {
    delta.top = clamp(metrics.scrollTop + caretTop, metrics.scrollHeight - metrics.clientHeight);
  } else if (caretBottom > metrics.clientHeight) {
    delta.top = clamp(metrics.scrollTop + (caretBottom - metrics.clientHeight), metrics.scrollHeight - metrics.clientHeight);
  }

  if (metrics.scrollWidth - metrics.clientWidth > 0 && offset === value.length) {
    // End of a single-line value: show the right edge, which is what the
    // browser itself does when it moves the caret there.
    delta.left = metrics.scrollWidth - metrics.clientWidth;
  } else if (metrics.scrollLeft !== 0 && offset === 0) {
    delta.left = 0;
  }

  return delta;
}

function countLines(value: string, offset: number): number {
  const stop = Math.min(Math.max(offset, 0), value.length);
  let line = 0;
  for (let i = 0; i < stop; i += 1) {
    if (value.charCodeAt(i) === 10) line += 1;
  }
  return line;
}
/** One scrollport's own geometry, the only state a page step needs. */
export interface ScrollMetrics {
  readonly scrollTop: number;
  readonly scrollHeight: number;
  readonly clientHeight: number;
}

/** Where a page step lands, clamped to the scrollable range. */
export interface PageTarget {
  /** Destination scrollTop, already clamped. */
  readonly top: number;
  /** Whether the scrollport had room to move at all. */
  readonly moved: boolean;
}

/**
 * Compute the destination of one page step.
 *
 * Clamping here rather than letting the browser do it keeps the arithmetic
 * testable and gives the app layer a cheap way to skip a no-op write: at
 * either end of the transcript a further PageDown has nowhere to go, and
 * writing the same scrollTop would still fire a scroll event that the host's
 * reading-intent machinery attributes to the user.
 *
 * A one-pixel minimum keeps a zero-height viewport (a hidden transcript, a
 * not-yet-measured element) from turning the key into a dead one.
 */
export function pageTarget(metrics: ScrollMetrics, direction: -1 | 1, fraction: number): PageTarget {
  const viewport = metrics.clientHeight;
  const step = viewport > 1 ? Math.round(viewport * fraction) : 1;
  const maxTop = Math.max(0, metrics.scrollHeight - viewport);
  const requested = metrics.scrollTop + direction * Math.max(1, step);
  const top = Math.min(Math.max(requested, 0), maxTop);
  return { top, moved: top !== metrics.scrollTop };
}
