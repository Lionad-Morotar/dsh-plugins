/**
 * The divider between the case list and the detail pane.
 *
 * The same gesture the Git panel's divider offers, because a reader who has
 * resized one panel expects the other to behave identically: drag to resize,
 * arrow keys when focused, double-click to go back to the fluid default.
 *
 * The width lives in the parent's state, so this component owns only the
 * gesture. It measures the pane to its left rather than trusting the stored
 * value, because the fluid default has no number in state at all: a drag from a
 * fresh install still has to start from what is actually on screen.
 */
import { useCallback, useRef, type KeyboardEvent, type PointerEvent, type ReactElement } from "react";

import {
  LEFT_PANE_MAX_WIDTH,
  LEFT_PANE_MIN_WIDTH,
  clampLeftPaneWidth,
  dragReturnedToBase,
  paneResizeKeyAction,
  resetLeftPaneWidth,
  saveLeftPaneWidth,
  type PaneWidthStorage,
} from "../pane-width.ts";

/** Strings the handle announces. */
export interface PaneHandleStrings {
  readonly paneResize: string;
  readonly paneResizeHint: string;
}

/** Props the handle takes. */
export interface PaneHandleProps {
  /** The pinned width, or null while the column is fluid. */
  readonly width: number | null;
  readonly storage: PaneWidthStorage | null;
  readonly strings: PaneHandleStrings;
  /** Called with the width to show while the gesture is live. */
  readonly onWidth: (width: number | null) => void;
}

/** What one live drag remembers. */
interface DragState {
  readonly pointerId: number;
  readonly startX: number;
  readonly baseWidth: number;
  /** The width state at drag start, restored when the drag lands where it began. */
  readonly restWidth: number | null;
}

/**
 * Render the divider.
 * @param props - the current width, the store and the callbacks.
 * @returns the separator element.
 */
export function PaneHandle({ width, storage, strings, onWidth }: PaneHandleProps): ReactElement {
  const handleRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  /** Measure the pane this handle divides; 0 when it is not laid out. */
  const measurePane = useCallback((): number => {
    const pane = handleRef.current?.previousElementSibling;
    return pane instanceof HTMLElement ? pane.getBoundingClientRect().width : 0;
  }, []);

  const beginDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      if (event.button !== 0 || dragRef.current !== null) return;
      const pane = handleRef.current?.previousElementSibling;
      if (!(pane instanceof HTMLElement)) return;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // jsdom implements no pointer capture, and a host without it would
        // strand the drag the moment the pointer left the handle; either way
        // the gesture is abandoned rather than half-taken.
        return;
      }
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        baseWidth: pane.getBoundingClientRect().width,
        restWidth: width,
      };
      document.body.classList.add("tst-pane-resizing");
    },
    [width],
  );

  const moveDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      const drag = dragRef.current;
      if (drag === null || drag.pointerId !== event.pointerId) return;
      onWidth(clampLeftPaneWidth(drag.baseWidth + event.clientX - drag.startX));
    },
    [onWidth],
  );

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      const drag = dragRef.current;
      if (drag === null || drag.pointerId !== event.pointerId) return;
      dragRef.current = null;
      document.body.classList.remove("tst-pane-resizing");
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Capture is already gone; pointercancel beats this handler here.
      }
      const landed = drag.baseWidth + event.clientX - drag.startX;
      // The moves already pinned transient pixels into state; a drag that lands
      // back where it began must undo that, or the fluid default stays lost for
      // the rest of the session.
      if (dragReturnedToBase(landed, drag.baseWidth)) {
        onWidth(drag.restWidth);
        return;
      }
      onWidth(saveLeftPaneWidth(storage, landed));
    },
    [onWidth, storage],
  );

  const reset = useCallback((): void => {
    // Clearing the store is part of the gesture, not the parent's job: the
    // handle owns the width's persistence, and a reset that only moved state
    // would come back on the next mount.
    resetLeftPaneWidth(storage);
    onWidth(null);
  }, [onWidth, storage]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.nativeEvent.isComposing) return;
      const action = paneResizeKeyAction(event.key, event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
      if (action === null) return;
      // The arrows would otherwise scroll the list the handle sits beside.
      event.preventDefault();
      event.stopPropagation();
      if (action.kind === "reset") {
        reset();
        return;
      }
      if (action.kind === "min" || action.kind === "max") {
        const bound = action.kind === "min" ? LEFT_PANE_MIN_WIDTH : LEFT_PANE_MAX_WIDTH;
        onWidth(saveLeftPaneWidth(storage, bound));
        return;
      }
      // A fluid pane has no number in state, so a nudge measures the rendered
      // box and steps from what is on screen.
      const current = measurePane() || (width ?? LEFT_PANE_MIN_WIDTH);
      onWidth(saveLeftPaneWidth(storage, current + action.delta));
    },
    [measurePane, onWidth, reset, storage, width],
  );

  return (
    <div
      ref={handleRef}
      data-testid="pane-handle"
      data-tst="pane-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label={strings.paneResize}
      aria-valuemin={LEFT_PANE_MIN_WIDTH}
      aria-valuemax={LEFT_PANE_MAX_WIDTH}
      aria-valuenow={width ?? undefined}
      title={strings.paneResizeHint}
      tabIndex={0}
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onKeyDown={onKeyDown}
      onDoubleClick={reset}
    />
  );
}
