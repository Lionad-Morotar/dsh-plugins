/**
 * The file tree's search bar.
 *
 * It is mounted inside the tree pane but never inside the tree's scroll
 * container. That placement is load-bearing: the scroll container carries the
 * tree's key handler, which includes the same-level prefix jump, so an input
 * nested under it would hand every typed letter to a typeahead that moves the
 * cursor instead of filling the field.
 *
 * The bar owns no results. It reports a query and four gestures, and the pane
 * decides where rows come from — the workspace index or the already-listed
 * entries — because only the pane knows which of the two is available.
 */
import { useEffect, useRef, type KeyboardEvent, type ReactElement } from "react";

import type { Translate } from "./copy.ts";
import type { SearchOrigin } from "./tree-search.ts";

/** Props for the tree's search bar. */
export interface TreeSearchBoxProps {
  readonly t: Translate;
  readonly value: string;
  /** Where the current answer came from; null while no query is active. */
  readonly origin: SearchOrigin | null;
  /** How many rows the query produced. */
  readonly count: number;
  /** Whether the workspace index is still answering. */
  readonly busy: boolean;
  readonly onChange: (value: string) => void;
  /** Step the tree cursor among the result rows; `1` is down, `-1` is up. */
  readonly onStep: (delta: number) => void;
  /** Open the row the tree cursor rests on. */
  readonly onActivate: () => void;
  /** Clear the query and hand the keyboard back to the tree. */
  readonly onClose: () => void;
}

/**
 * Render the search bar.
 * @param props - the query, where the answer came from and the gestures.
 * @returns the bar.
 */
export function TreeSearchBox({
  t,
  value,
  origin,
  count,
  busy,
  onChange,
  onStep,
  onActivate,
  onClose,
}: TreeSearchBoxProps): ReactElement {
  const input = useRef<HTMLInputElement>(null);

  // Opening the bar means the reader wants to type, so the caret goes there
  // rather than staying on the tree it was just taken from.
  useEffect(() => {
    input.current?.focus();
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      // The caret has nowhere useful to go in a one-line field, so these step
      // the result cursor instead — the gesture the reader already knows from
      // the tree itself.
      event.preventDefault();
      onStep(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      onActivate();
    }
  };

  // The scope is spelled out because the fallback is a strictly smaller answer
  // than the reader asked for; a silent subset would read as "no such file".
  const scope =
    origin === null
      ? null
      : origin === "index"
        ? t("search.scope.index")
        : t("search.scope.loaded");

  return (
    <div className="fx-search" data-testid="fs-tree-search" onKeyDown={onKeyDown}>
      <input
        ref={input}
        type="search"
        className="fx-search-input"
        data-testid="fs-tree-search-input"
        value={value}
        spellCheck={false}
        autoComplete="off"
        placeholder={t("search.placeholder")}
        aria-label={t("search.placeholder")}
        onChange={event => onChange(event.currentTarget.value)}
      />
      {scope === null ? null : (
        <span
          className="fx-search-scope"
          data-testid="fs-tree-search-scope"
          data-origin={origin}
          title={t("search.scope")}
        >
          {scope}
          {busy ? <span className="fx-spinner" aria-hidden="true" /> : null}
        </span>
      )}
      {origin === null ? null : (
        <span className="fx-search-count" data-testid="fs-tree-search-count" data-state={count === 0 ? "empty" : "ready"}>
          {count === 0 ? t("search.none") : t("search.count").replace("{count}", String(count))}
        </span>
      )}
      <button
        type="button"
        className="fx-pbtn"
        data-testid="fs-tree-search-close"
        title={t("search.close")}
        aria-label={t("search.close")}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
