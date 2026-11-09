/**
 * The seat that keeps both Turn labels on the working clock.
 *
 * It renders one hidden anchor and nothing else. The anchor has two jobs: it
 * keeps the effects alive in the composer dock (session-scoped, mounted in every
 * chat view, surviving conversation switches), and it marks the DOM position the
 * patcher belongs to. The projection hook is what makes the reading live, so the
 * seat has to be mounted where the projection is readable for the session on
 * screen; the composer dock is that place.
 *
 * The effects have different jobs. The mount effect resolves the seat's own
 * conversation view root and owns the patcher's lifetime; the view effect closes
 * the one-render gap after a projection update so a Turn that just closed is
 * corrected before the next tick, not after it.
 *
 * The reader is treated as optional even though the host always supplies it:
 * this seat's only failure mode should be "does nothing", never a throw inside
 * the composer's render, because a crashed seat would take the dock with it. The
 * same applies to root resolution — an unknown host layout degrades to the
 * document, which is the pre-scoping behaviour.
 */
import { useEffect, useRef } from "react";
import type { TurnClockView } from "../types.ts";
import { patchRoot, startClockPatcher } from "./face.ts";

/** The read face every entry of this slot receives from the host. */
export type ProjectionReader = <K extends string>(key: K) => unknown;

/** Everything the slot hands this seat. */
export interface ClockWatchProps {
  /** Host-computed projection values, addressed by key. */
  readonly useProjection?: ProjectionReader;
}

/** The projection key this package registers on the host. */
const PROJECTION_KEY = "turnClock";

/** The host's session-scoped conversation container, one per mounted view. */
const VIEW_SELECTOR = "[data-conversation-session]";

/** The two spellings of a mounted chat flow this host has shipped. */
const FLOW_SELECTOR = '[data-slot="conversation.chat.flow"], [data-chat-flow]';

/**
 * Resolve the patch root for the conversation view this seat lives in.
 *
 * One document can hold several views at once — split panes, dock tabs, hidden
 * tabs kept mounted — and each of them has its own projection and its own Turn
 * numbering. Patching from the document would let one seat write another
 * session's figures, so the root is the nearest view container. When the host
 * ships no session attribute, the walk falls back to the closest ancestor that
 * holds exactly one chat flow; a document holding none (or several) resolves to
 * the document itself, which is the old whole-page behaviour.
 * @param anchor - the seat's own hidden element, mounted inside the view.
 * @returns the view root to scope every pass to.
 */
export function resolvePatchRoot(anchor: Element): ParentNode {
  const scoped = anchor.closest(VIEW_SELECTOR);
  if (scoped !== null) return scoped;
  let ancestor: Element | null = anchor.parentElement;
  while (ancestor !== null) {
    const flows = ancestor.querySelectorAll(FLOW_SELECTOR).length;
    if (flows === 1) return ancestor;
    if (flows > 1) break;
    ancestor = ancestor.parentElement;
  }
  return anchor.ownerDocument;
}

/**
 * The seat that runs the clock patcher.
 * @param props - the projection reader.
 * @returns one hidden anchor, no visible output.
 */
export function ClockWatch({ useProjection }: ClockWatchProps) {
  // The condition is fixed for the lifetime of the seat (the slot either seeds
  // the reader or not), so the hook order never changes between renders.
  const view = useProjection === undefined ? undefined : (useProjection(PROJECTION_KEY) as TurnClockView | undefined);
  const latest = useRef<TurnClockView | undefined>(view);
  latest.current = view;
  const anchor = useRef<HTMLSpanElement>(null);
  const root = useRef<ParentNode | null>(null);

  useEffect(() => {
    const node = anchor.current;
    const resolved = node === null ? document : resolvePatchRoot(node);
    root.current = resolved;
    const patcher = startClockPatcher(resolved, () => latest.current);
    return () => {
      root.current = null;
      patcher.stop();
    };
  }, []);

  useEffect(() => {
    if (view === undefined) return;
    patchRoot(root.current ?? document, () => latest.current, Date.now());
  }, [view]);

  return <span ref={anchor} hidden aria-hidden="true" />;
}
