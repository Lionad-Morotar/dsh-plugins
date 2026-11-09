/**
 * The board's toolbar: which rows to show, which file to look for, how to order
 * them, and the run control.
 *
 * Stateless on purpose. The view owns the three reading values and the run's
 * phase, so a filter change and the row list it produces can never disagree
 * about what is on screen, and the button cannot claim a run the host is not
 * running.
 *
 * The run control is one slot, not two: while a run is going it becomes the
 * cancel for that run. A separate cancel button beside a disabled run button
 * would make the reader find the one that works.
 */
import type { ReactElement } from "react";

import type { RowFilter, RowSort } from "../model.ts";

/** Strings the toolbar renders. */
export interface ToolbarStrings {
  readonly filterAll: string;
  readonly filterFailed: string;
  readonly searchPlaceholder: string;
  readonly sortFailFirst: string;
  readonly sortSlowFirst: string;
  readonly runAll: string;
  readonly cancel: string;
  readonly running: string;
}

/** Props the toolbar takes. */
export interface ToolbarProps {
  readonly filter: RowFilter;
  readonly query: string;
  readonly sort: RowSort;
  /** Whether the host is currently running something in this workspace. */
  readonly running: boolean;
  /**
   * Whether a run may be started at all.
   *
   * False for a tab with no session and for a workspace the host refused: both
   * are states where pressing the button could only fail.
   */
  readonly canRun: boolean;
  readonly strings: ToolbarStrings;
  readonly onFilter: (filter: RowFilter) => void;
  readonly onQuery: (query: string) => void;
  readonly onSort: (sort: RowSort) => void;
  readonly onRunAll: () => void;
  readonly onCancel: () => void;
}

/**
 * Render the toolbar.
 * @param props - current values, strings and their setters.
 * @returns the toolbar element.
 */
export function Toolbar({
  filter,
  query,
  sort,
  running,
  canRun,
  strings,
  onFilter,
  onQuery,
  onSort,
  onRunAll,
  onCancel,
}: ToolbarProps): ReactElement {
  return (
    <div data-testid="toolbar" data-tst="toolbar">
      <div data-tst="segmented" role="group">
        <button
          type="button"
          data-tst="segment"
          data-active={filter === "all" ? "true" : "false"}
          onClick={() => onFilter("all")}
        >
          {strings.filterAll}
        </button>
        <button
          type="button"
          data-tst="segment"
          data-active={filter === "failed" ? "true" : "false"}
          onClick={() => onFilter("failed")}
        >
          {strings.filterFailed}
        </button>
      </div>

      <input
        type="search"
        data-testid="search-input"
        data-tst="search"
        placeholder={strings.searchPlaceholder}
        value={query}
        onChange={event => onQuery(event.target.value)}
      />

      <div data-tst="segmented" role="group">
        <button
          type="button"
          data-tst="segment"
          data-active={sort === "fail-first" ? "true" : "false"}
          onClick={() => onSort("fail-first")}
        >
          {strings.sortFailFirst}
        </button>
        <button
          type="button"
          data-tst="segment"
          data-active={sort === "slow-first" ? "true" : "false"}
          onClick={() => onSort("slow-first")}
        >
          {strings.sortSlowFirst}
        </button>
      </div>

      {running ? (
        <button type="button" data-testid="cancel-run" data-tst="run-control" data-running="true" onClick={onCancel}>
          {strings.cancel}
        </button>
      ) : (
        <button
          type="button"
          data-testid="run-all"
          data-tst="run-control"
          data-running="false"
          disabled={!canRun}
          onClick={onRunAll}
        >
          {strings.runAll}
        </button>
      )}
    </div>
  );
}
