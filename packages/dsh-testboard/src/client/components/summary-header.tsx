/**
 * The board's run header: what ran, when, and how it went.
 *
 * The timestamp is fixed copy, not a clock read: the board renders a committed
 * snapshot, and a live "2m ago" would drift away from the data it describes.
 */
import type { ReactElement } from "react";

import { formatDuration } from "../format.ts";
import type { TestSummary } from "../model.ts";

/** Strings the header renders. */
export interface SummaryHeaderStrings {
  readonly title: string;
  readonly subtitle: string;
  readonly ago: string;
  readonly passed: string;
  readonly failed: string;
  readonly took: string;
}

/** Props the header takes. */
export interface SummaryHeaderProps {
  readonly summary: TestSummary;
  readonly strings: SummaryHeaderStrings;
}

/**
 * Render the run header.
 * @param props - totals and locale-bound strings.
 * @returns the header element.
 */
export function SummaryHeader({ summary, strings }: SummaryHeaderProps): ReactElement {
  return (
    <header data-testid="summary-header" data-tst="header">
      <div data-tst="header-main">
        <h1 data-tst="title">{strings.title}</h1>
        <p data-tst="subtitle">{strings.subtitle}</p>
      </div>
      <div data-tst="header-stats">
        <span data-tst="ago">{strings.ago}</span>
        <span data-tst="tally">
          <span data-tst="tally-passed">
            {summary.passed} {strings.passed}
          </span>
          <span data-tst="tally-sep">·</span>
          <span data-tst="tally-failed" data-has-failed={summary.failed > 0 ? "true" : "false"}>
            {summary.failed} {strings.failed}
          </span>
        </span>
        <span data-testid="header-duration" data-tst="duration">
          {strings.took} {formatDuration(summary.wallClockMs)}
        </span>
      </div>
    </header>
  );
}
