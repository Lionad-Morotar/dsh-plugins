/**
 * The run header: the phase narration, the workspace line, and the live counts.
 *
 * This is the board's one piece of narration. Everything else on screen is a
 * reading of the data; this line is what tells a reader what the board is
 * currently doing, and it is the thing the reference's whole rhythm hangs on.
 *
 * The counters are tweened rather than snapped. A count that jumps from 8 to 134
 * between two polls reads as a glitch; one that climbs reads as work happening.
 * The tween is driven by the view's single animation frame loop, not by a timer
 * here, so a still board costs nothing.
 */
import { useEffect, useRef, useState, type ReactElement } from "react";

import { formatDuration } from "../format.ts";
import { countTween, type PhaseLabel } from "../motion.ts";

/** Strings the header renders. */
export interface RunHeaderStrings {
  readonly passed: string;
  readonly failed: string;
  readonly took: string;
}

/** Props the header takes. */
export interface RunHeaderProps {
  /** The phase line, already resolved by `phaseLabel`. */
  readonly label: PhaseLabel;
  /**
   * The preview demo's own stage, when there is one.
   *
   * It rides on the phase element's `data-phase` because that is what a
   * screenshot or recording script samples, and the demo's `fixing` stage is
   * not a run phase the host has.
   */
  readonly demoPhase?: "running" | "fixing" | "rerunning" | "finished";
  /** `workspace · command`, the line under the title. */
  readonly subtitle: string;
  /** Cases passed so far, or in total once the run settled. */
  readonly passed: number;
  /** Cases failed so far, or in total once the run settled. */
  readonly failed: number;
  /** Wall clock of the run, in milliseconds. */
  readonly elapsedMs: number;
  /** Whether the run is still going, which is when the timer ticks. */
  readonly running: boolean;
  /** Whether the reader asked for reduced motion. */
  readonly reduced: boolean;
  readonly strings: RunHeaderStrings;
}

/**
 * A number that climbs to its target instead of snapping to it.
 *
 * The tween is driven by `requestAnimationFrame` only while a change is in
 * flight: a settled board runs no loop at all, which is what keeps a tab that
 * nobody is watching free.
 *
 * @param target - the value the number should reach.
 * @param durationMs - how long the climb takes; zero renders the target at once.
 * @returns the value to render this frame.
 */
function useTweenedCount(target: number, durationMs: number): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startedRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (durationMs <= 0) {
      fromRef.current = target;
      setValue(target);
      return undefined;
    }
    if (fromRef.current === target) return undefined;

    const from = fromRef.current;
    startedRef.current = performance.now();

    const step = (): void => {
      const elapsed = performance.now() - startedRef.current;
      if (elapsed >= durationMs) {
        fromRef.current = target;
        setValue(target);
        frameRef.current = undefined;
        return;
      }
      setValue(countTween({ from, to: target, elapsedMs: elapsed, durationMs, reduced: false }));
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
      // The next tween starts from wherever this one got to, not from the value
      // it was aiming at: a poll that lands mid-climb must not jump backwards.
      fromRef.current = target;
    };
  }, [target, durationMs]);

  return value;
}

/**
 * Render the run header.
 * @param props - the phase, the counts and the locale-bound words.
 * @returns the header element.
 */
export function RunHeader({
  label,
  demoPhase,
  subtitle,
  passed,
  failed,
  elapsedMs,
  running,
  reduced,
  strings,
}: RunHeaderProps): ReactElement {
  const shownPassed = useTweenedCount(passed, reduced ? 0 : 300);
  const shownFailed = useTweenedCount(failed, reduced ? 0 : 300);

  // The failure count pulses once when it first becomes positive. Tracking the
  // transition rather than the value means a rerun that stays red does not
  // re-pulse on every poll.
  const [pulsing, setPulsing] = useState(false);
  const wasFailedRef = useRef(failed > 0);
  useEffect(() => {
    const nowFailed = failed > 0;
    if (nowFailed && !wasFailedRef.current && !reduced) {
      setPulsing(true);
      const timer = setTimeout(() => setPulsing(false), 400);
      wasFailedRef.current = nowFailed;
      return () => clearTimeout(timer);
    }
    wasFailedRef.current = nowFailed;
    return undefined;
  }, [failed, reduced]);

  return (
    <header data-testid="summary-header" data-tst="header">
      <div data-tst="header-main">
        <h1
          data-testid="run-phase"
          data-tst="title"
          data-phase={demoPhase ?? label.phase}
          data-tone={label.tone}
          key={label.phase + label.text}
        >
          {label.text}
        </h1>
        <p data-tst="subtitle">{subtitle}</p>
      </div>
      <div data-tst="header-stats">
        <span data-testid="run-timer" data-tst="timer" data-running={running ? "true" : "false"}>
          {formatDuration(elapsedMs)}
        </span>
        <span data-tst="tally">
          <span data-testid="count-passed" data-tst="tally-passed">
            {shownPassed} {strings.passed}
          </span>
          <span data-tst="tally-sep">·</span>
          <span
            data-testid="count-failed"
            data-tst="tally-failed"
            data-has-failed={failed > 0 ? "true" : "false"}
            data-pulse={pulsing ? "true" : "false"}
          >
            {shownFailed} {strings.failed}
          </span>
        </span>
      </div>
    </header>
  );
}
