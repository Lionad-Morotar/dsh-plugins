/**
 * The board's toolbar: which rows to show, which file to look for, and how to
 * order them.
 *
 * Stateless on purpose. The view owns the three values, so a filter change and
 * the row list it produces can never disagree about what is on screen.
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
}

/** Props the toolbar takes. */
export interface ToolbarProps {
  readonly filter: RowFilter;
  readonly query: string;
  readonly sort: RowSort;
  readonly strings: ToolbarStrings;
  readonly onFilter: (filter: RowFilter) => void;
  readonly onQuery: (query: string) => void;
  readonly onSort: (sort: RowSort) => void;
}

/**
 * Render the toolbar.
 * @param props - current values, strings and their setters.
 * @returns the toolbar element.
 */
export function Toolbar({ filter, query, sort, strings, onFilter, onQuery, onSort }: ToolbarProps): ReactElement {
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
    </div>
  );
}
