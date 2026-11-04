/**
 * The preview's in-page find bar.
 *
 * Compared with a global find, this one has a much smaller promise: the pager
 * holds exactly one page, so the bar searches what is on screen and says so in
 * the counter. There is no query history and no persistence — the bar exists
 * while it is open and forgets everything when it closes.
 *
 * The bar holds only "which hit the reader is on". It never holds an offset:
 * the two surfaces (editor, rendered DOM) measure in different spaces, and
 * mixing them here is exactly the bug this split exists to prevent.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import type { Translate } from "./copy.ts";
import { stepHit } from "./find.ts";
import type { FindSurface } from "./find-surface.ts";

/** Props for the find bar. */
export interface PreviewFindBarProps {
  readonly t: Translate;
  /** Resolves the mounted body's surface; called per gesture, never cached here. */
  readonly surface: () => FindSurface;
  /** Changes whenever the body or the page behind it changed, so the count re-runs. */
  readonly stamp: string;
  readonly onClose: () => void;
}

/**
 * Render the find bar under the preview toolbar.
 * @param props - translator, surface getter, body stamp and the close gesture.
 * @returns the bar.
 */
export function PreviewFindBar({ t, surface, stamp, onClose }: PreviewFindBarProps): ReactElement {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  // Opening the bar is the reader asking to type, so the caret goes there and
  // not to the document behind it.
  useEffect(() => {
    input.current?.focus();
  }, []);

  // Recount when the query changes or the body underneath it is replaced.
  useEffect(() => {
    if (query === "") {
      setCount(0);
      setIndex(0);
      return;
    }
    const found = surface().count(query);
    setCount(found);
    setIndex(current => (found === 0 ? 0 : Math.min(current, found - 1)));
  }, [query, stamp, surface]);

  // Put the selection on the current hit. Running this on the count as well is
  // what makes a page change re-reveal the same ordinal instead of leaving the
  // caret on a hit that the new page does not have.
  useEffect(() => {
    if (query === "" || count === 0) return;
    surface().reveal(query, index);
  }, [query, index, count, surface]);

  const close = useCallback((): void => {
    surface().clear();
    onClose();
  }, [surface, onClose]);

  const step = useCallback(
    (delta: number): void => {
      if (count === 0) return;
      setIndex(current => stepHit(current, count, delta));
    },
    [count],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      step(event.shiftKey ? -1 : 1);
      return;
    }
    // Arrow keys belong to the caret inside the field; letting them reach the
    // panel's own handlers would move a cursor the reader cannot see.
    if (event.key === "ArrowDown" || event.key === "ArrowUp") event.stopPropagation();
  };

  const label =
    query === ""
      ? t("preview.find.hint")
      : count === 0
        ? t("preview.find.none")
        : t("preview.find.count")
            .replace("{index}", String(index + 1))
            .replace("{count}", String(count));

  return (
    <div className="fx-find" data-testid="fs-preview-find-bar" onKeyDown={onKeyDown}>
      <input
        ref={input}
        type="search"
        className="fx-find-input"
        data-testid="fs-preview-find-input"
        value={query}
        spellCheck={false}
        autoComplete="off"
        placeholder={t("preview.find.placeholder")}
        aria-label={t("preview.find.placeholder")}
        onChange={event => {
          setQuery(event.currentTarget.value);
          setIndex(0);
        }}
      />
      <span
        className="fx-find-count"
        data-testid="fs-preview-find-count"
        data-state={count === 0 ? "empty" : "ready"}
        title={t("preview.find.scope")}
      >
        {label}
      </span>
      <button
        type="button"
        className="fx-pbtn"
        data-testid="fs-preview-find-prev"
        disabled={count === 0}
        title={t("preview.find.prev")}
        aria-label={t("preview.find.prev")}
        onClick={() => step(-1)}
      >
        ↑
      </button>
      <button
        type="button"
        className="fx-pbtn"
        data-testid="fs-preview-find-next"
        disabled={count === 0}
        title={t("preview.find.next")}
        aria-label={t("preview.find.next")}
        onClick={() => step(1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="fx-pbtn"
        data-testid="fs-preview-find-close"
        title={t("preview.find.close")}
        aria-label={t("preview.find.close")}
        onClick={close}
      >
        ×
      </button>
    </div>
  );
}
