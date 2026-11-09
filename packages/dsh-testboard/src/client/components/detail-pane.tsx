/**
 * The right pane: the selected file's code, and the selected case's detail.
 *
 * This replaces the hover card the board used to float over its rows. A card
 * that appears under the pointer covers the rows beneath it and is unreachable
 * by keyboard; a pane beside the list shows the same information without
 * occluding anything and is where the keyboard's selection is read.
 *
 * The order is deliberate: file identity first, then the case's own detail, then
 * the code. A reader who selected a case is asking "what is this and where is
 * it", and the line it lives on is the answer, so the code sits below both and
 * scrolls to the highlighted line.
 */
import { useEffect, useRef, type ReactElement } from "react";

import { fileNameOf, formatDuration, syntheticFailure } from "../format.ts";
import type { TestCase, TestFileRow } from "../model.ts";
import { splitSourceLines, type SourceBundle } from "../source.ts";

/**
 * Strings the pane renders.
 *
 * Deliberately a subset of the view's own string table rather than a parallel
 * one: the view can hand its whole table over, and the pane only names the keys
 * it actually reads.
 */
export interface DetailPaneStrings {
  readonly detailEmpty: string;
  readonly line: string;
  readonly passed: string;
  readonly failed: string;
  readonly cases: string;
  readonly sourceMissing: string;
}

/** Props the pane takes. */
export interface DetailPaneProps {
  /** The selected file's row, or undefined when nothing is selected. */
  readonly row: TestFileRow | undefined;
  /** The selected case within that row, or undefined when only the file is selected. */
  readonly selectedCase: TestCase | undefined;
  /** The loaded source bundle, or undefined while it is still being fetched. */
  readonly sources: SourceBundle | undefined;
  readonly strings: DetailPaneStrings;
}

/**
 * Render the right pane.
 * @param props - the selection, the source bundle and locale-bound strings.
 * @returns the pane element.
 */
export function DetailPane({ row, selectedCase, sources, strings }: DetailPaneProps): ReactElement {
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const highlightLine = selectedCase?.line;

  useEffect(() => {
    if (highlightLine === undefined) return;
    // jsdom implements no layout and no scrolling, so this method is absent
    // there; the guard keeps the effect a no-op in tests instead of a crash.
    highlightRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [highlightLine, row?.path]);

  if (row === undefined) {
    return (
      <div data-testid="detail-pane" data-tst="detail-pane" data-empty="true">
        <p data-testid="detail-empty" data-tst="detail-empty">
          {strings.detailEmpty}
        </p>
      </div>
    );
  }

  const text = sources?.files[row.path];
  const lines = text === undefined ? [] : splitSourceLines(text);

  return (
    <div data-testid="detail-pane" data-tst="detail-pane" data-path={row.path}>
      <div data-testid="detail-file" data-tst="detail-file">
        <div data-tst="detail-file-main">
          <span data-tst="detail-file-name">{fileNameOf(row.path)}</span>
          <span data-tst="detail-file-path">{row.path}</span>
        </div>
        <div data-tst="detail-file-stats">
          <span data-tst="detail-file-duration">{formatDuration(row.durationMs)}</span>
          <span data-tst="detail-file-cases">
            {row.cases.length} {strings.cases}
          </span>
          <span data-tst="detail-file-passed">
            {row.passed} {strings.passed}
          </span>
          <span data-tst="detail-file-failed" data-has-failed={row.failed > 0 ? "true" : "false"}>
            {row.failed} {strings.failed}
          </span>
        </div>
      </div>

      {selectedCase === undefined ? null : (
        <div data-testid="detail-case" data-tst="detail-case" data-status={selectedCase.status}>
          <div data-tst="detail-case-name">{selectedCase.name}</div>
          <div data-tst="detail-case-meta">
            <span data-tst="detail-case-status" data-status={selectedCase.status}>
              {selectedCase.status === "failed" ? strings.failed : selectedCase.status === "skipped" ? "skipped" : strings.passed}
            </span>            <span data-tst="detail-case-duration">{formatDuration(selectedCase.durationMs)}</span>
            <span data-tst="detail-case-line">
              {strings.line} {selectedCase.line}
            </span>
          </div>
          {selectedCase.status === "failed" ? (
            <div data-tst="detail-case-error">{syntheticFailure(selectedCase.name)}</div>
          ) : null}
        </div>
      )}

      <div data-testid="detail-code" data-tst="detail-code">
        {text === undefined ? (
          <p data-tst="detail-code-missing">{strings.sourceMissing}</p>
        ) : (
          <div data-tst="code-lines">
            {lines.map((content, index) => {
              const lineNumber = index + 1;
              const highlighted = lineNumber === highlightLine;
              return (
                <div
                  key={lineNumber}
                  ref={highlighted ? highlightRef : undefined}
                  data-tst="code-line"
                  data-line={lineNumber}
                  data-highlighted={highlighted ? "true" : "false"}
                >
                  <span data-tst="code-number">{lineNumber}</span>
                  <span data-tst="code-text">{content}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
