/**
 * The test board: a run's results as lanes of ticks, with the selected file's
 * code beside them.
 *
 * The view owns the reading state (filter, query, sort), which files are open,
 * what is selected, and how wide the case list is; everything else is derived
 * from the snapshot on each render. There is no fetching and no timer: the data
 * is a committed snapshot, and the board is a reading of it.
 *
 * Two lazy chunks feed it. The snapshot arrives on mount and paints the rows;
 * the sources arrive separately and only fill the code pane, so a reader who
 * never opens a file never pays for the megabytes of test text.
 *
 * Theme is tracked rather than left to CSS alone. The palette itself switches
 * through `body[data-ds-dark-theme]` in the stylesheet, but the container also
 * carries the resolved theme as a class, so a test (or a reader of the DOM) can
 * see which palette is in force without parsing computed styles.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import type { TestSnapshot } from "./model.ts";
import { groupFileRows, listFileRows, peakThroughput, summarize, throughputSeries, type RowFilter, type RowSort } from "./model.ts";
import { applyNavIntent, navKeyIntent, normalizeSelection, type NavSelection } from "./nav.ts";
import {
  paneWidthStorage,
  paneWidthStyle,
  readLeftPaneWidth,
  resetLeftPaneWidth,
  type PaneWidthStorage,
} from "./pane-width.ts";
import type { EditorChunkModule } from "./code-contract.ts";
import type { SourceBundle } from "./source.ts";
import { CaseList } from "./components/case-list.tsx";
import { DetailPane, type DetailPaneStrings } from "./components/detail-pane.tsx";
import { LaneRow } from "./components/lane-row.tsx";
import { PaneHandle } from "./components/pane-handle.tsx";
import { SummaryHeader } from "./components/summary-header.tsx";
import { ThroughputSparkline } from "./components/throughput-sparkline.tsx";
import { Toolbar } from "./components/toolbar.tsx";

/** The attribute the host writes on `body` to select the dark palette. */
const DARK_ATTRIBUTE = "data-ds-dark-theme";

/** Strings the view renders, bound through the locale seat by the entry. */
export interface TestboardViewStrings extends DetailPaneStrings {
  readonly title: string;
  readonly subtitle: string;
  readonly ago: string;
  readonly passed: string;
  readonly failed: string;
  readonly filterAll: string;
  readonly filterFailed: string;
  readonly searchPlaceholder: string;
  readonly sortFailFirst: string;
  readonly sortSlowFirst: string;
  readonly peak: string;
  readonly perSecond: string;
  readonly empty: string;
  readonly cases: string;
  readonly took: string;
  readonly paneResize: string;
  readonly paneResizeHint: string;
  readonly listLabel: string;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/** What the view needs to render; the loaders supply the data. */
export interface TestboardViewOptions {
  readonly strings: TestboardViewStrings;
  /**
   * Resolves the snapshot. Called once on mount.
   *
   * A loader rather than a value: the data lives in a lazy chunk that must not
   * be pulled into the startup bundle, so the fetch can only start after the tab
   * is actually opened.
   */
  readonly loadSnapshot: () => Promise<TestSnapshot>;
  /**
   * Resolves every test file's source text. Called once on mount, beside the
   * snapshot and independently of it.
   */
  readonly loadSources: () => Promise<SourceBundle>;
  /**
   * Resolves the code editor. Requested on the first row selection rather than
   * on mount: a reader who never selects a file never pays for CodeMirror.
   */
  readonly loadEditor: () => Promise<EditorChunkModule>;
}

/**
 * Read the host's current theme from the body attribute.
 * @returns the resolved theme.
 */
function readTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  return document.body.hasAttribute(DARK_ATTRIBUTE) ? "dark" : "light";
}

/**
 * Follow the host's theme attribute for as long as the board is mounted.
 *
 * The host writes the attribute on `body` and never announces it, so the board
 * observes the attribute rather than polling: a `MutationObserver` on the body's
 * attributes is the only signal available, and it keeps the resolved theme in
 * React state so the container class stays truthful.
 * @returns the current theme.
 */
function useHostTheme(): "dark" | "light" {
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const sync = (): void => setTheme(readTheme());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: [DARK_ATTRIBUTE] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/**
 * Build the board component around one set of strings and one snapshot.
 *
 * A factory rather than a module-level component: the strings are resolved per
 * apply, and a module-level component would freeze the boot language into the
 * tab body while the tab label kept following the locale.
 * @param options - locale-bound strings and the two data loaders.
 * @returns the component the slot mounts.
 */
export function createTestboardView(options: TestboardViewOptions): (props: ConversationViewProps) => ReactElement {
  const { strings, loadSnapshot, loadSources, loadEditor } = options;

  return function TestboardView(): ReactElement {
    const theme = useHostTheme();
    const [snapshot, setSnapshot] = useState<TestSnapshot | undefined>(undefined);
    const [sources, setSources] = useState<SourceBundle | undefined>(undefined);
    const [editor, setEditor] = useState<EditorChunkModule | undefined>(undefined);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [filter, setFilter] = useState<RowFilter>("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<RowSort>("fail-first");
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
    const [selection, setSelection] = useState<NavSelection | undefined>(undefined);
    const listRef = useRef<HTMLDivElement | null>(null);
    const editorRequested = useRef(false);

    const storage: PaneWidthStorage | null = useMemo(() => paneWidthStorage(), []);
    const [leftWidth, setLeftWidth] = useState<number | null>(() => readLeftPaneWidth(storage));

    useEffect(() => {
      let live = true;
      loadSnapshot().then(
        loaded => {
          if (live) setSnapshot(loaded);
        },
        (error: unknown) => {
          if (live) setLoadError(error instanceof Error ? error.message : String(error));
        },
      );
      return () => {
        live = false;
      };
    }, [loadSnapshot]);

    useEffect(() => {
      let live = true;
      loadSources().then(
        loaded => {
          if (live) setSources(loaded);
        },
        () => {
          // The rows are already on screen and the pane says the source is
          // missing; failing the whole tab over the code view would be worse.
          if (live) setSources(undefined);
        },
      );
      return () => {
        live = false;
      };
    }, [loadSources]);

    // CodeMirror is the largest chunk this package ships, so it is fetched only
    // after the first selection, and a failed fetch leaves the plain source
    // lines in place rather than failing the tab. The flag is cleared on failure
    // so the next selection retries.
    useEffect(() => {
      if (selection === undefined || editorRequested.current) return undefined;
      editorRequested.current = true;
      let live = true;
      loadEditor().then(
        loaded => {
          if (live) setEditor(loaded);
        },
        () => {
          if (live) editorRequested.current = false;
        },
      );
      return () => {
        live = false;
      };
    }, [selection, loadEditor]);

    // The rows are grouped before anything reads them, and the flat navigation
    // order is built from the groups rather than from the sorted row list: the
    // board renders one section per package, so walking the row list's own order
    // would move the selection up and down a different sequence than the one on
    // screen.
    const groups = useMemo(
      () => (snapshot === undefined ? [] : groupFileRows(listFileRows(snapshot, { filter, query, sort }))),
      [snapshot, filter, query, sort],
    );
    const rows = useMemo(() => groups.flatMap(group => group.rows), [groups]);

    // A filter can remove the selected file and a collapse can take its cases
    // off screen; the selection follows rather than pointing at nothing.
    const resolved = normalizeSelection(selection, rows, expanded);
    const selectedRow = resolved === undefined ? undefined : rows.find(row => row.path === resolved.path);
    const selectedCase =
      resolved?.kind === "case" ? selectedRow?.cases[resolved.index] : undefined;

    /** The DOM id of one row, so the listbox can point at it and scroll to it. */
    const optionId = useCallback(
      (item: NavSelection): string =>
        item.kind === "file" ? `tst-opt-file-${item.path}` : `tst-opt-case-${item.path}-${String(item.index)}`,
      [],
    );

    /** Scroll the selected row into view; jsdom has no scrolling, hence the guard. */
    const reveal = useCallback(
      (item: NavSelection | undefined): void => {
        if (item === undefined) return;
        const element = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(item))}`);
        element?.scrollIntoView?.({ block: "nearest" });
      },
      [optionId],
    );

    const onListKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.nativeEvent.isComposing) return;
        const intent = navKeyIntent(event.key, event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
        if (intent === null) return;
        // The list is the scroll container, so every one of these keys would
        // otherwise also scroll it under the selection.
        event.preventDefault();
        const result = applyNavIntent(intent, { selection: resolved, expanded }, rows);
        setSelection(result.selection);
        setExpanded(result.expanded);
        reveal(result.reveal);
      },
      [expanded, resolved, reveal, rows],
    );

    const toggleFile = useCallback((path: string): void => {
      setExpanded(current => {
        const next = new Set(current);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        return next;
      });
    }, []);

    const onFileClick = useCallback(
      (path: string): void => {
        setSelection({ kind: "file", path });
        toggleFile(path);
      },
      [toggleFile],
    );

    const onCaseClick = useCallback((path: string, index: number): void => {
      // Selecting a case never collapses its file: the reader is looking at the
      // case, and closing the list under them would hide what they chose.
      setSelection({ kind: "case", path, index });
    }, []);

    const resetPaneWidth = useCallback((): void => {
      resetLeftPaneWidth(storage);
      setLeftWidth(null);
    }, [storage]);

    if (snapshot === undefined) {
      return (
        <div data-testid="testboard" data-tst="board" className={`tst-theme-${theme}`} data-theme={theme}>
          <p data-tst="status">{loadError ?? "…"}</p>
        </div>
      );
    }

    const summary = summarize(snapshot);
    const series = throughputSeries(snapshot);
    const activeOption = resolved === undefined ? undefined : optionId(resolved);

    return (
      <div data-testid="testboard" data-tst="board" className={`tst-theme-${theme}`} data-theme={theme}>
        <SummaryHeader
          summary={summary}
          strings={{
            title: strings.title,
            subtitle: strings.subtitle,
            ago: strings.ago,
            passed: strings.passed,
            failed: strings.failed,
            took: strings.took,
          }}
        />
        <ThroughputSparkline series={series} peak={peakThroughput(series)} strings={{ peak: strings.peak, perSecond: strings.perSecond }} />
        <Toolbar
          filter={filter}
          query={query}
          sort={sort}
          strings={{
            filterAll: strings.filterAll,
            filterFailed: strings.filterFailed,
            searchPlaceholder: strings.searchPlaceholder,
            sortFailFirst: strings.sortFailFirst,
            sortSlowFirst: strings.sortSlowFirst,
          }}
          onFilter={setFilter}
          onQuery={setQuery}
          onSort={setSort}
        />

        <div data-testid="split" data-tst="split" style={paneWidthStyle(leftWidth)}>
          <div
              ref={listRef}
              data-testid="lanes"
              data-tst="lanes"
              role="listbox"
              aria-label={strings.listLabel}
              aria-activedescendant={activeOption}
              tabIndex={0}
              onKeyDown={onListKeyDown}
            >
              {groups.length === 0 ? <p data-testid="empty" data-tst="empty">{strings.empty}</p> : null}
              {groups.map(group => (
                <section key={group.packageName} data-testid="package-section" data-tst="package" data-package={group.packageName}>
                  <h2 data-tst="package-name">{group.packageName}</h2>
                  {group.rows.map(row => {
                    const fileItem: NavSelection = { kind: "file", path: row.path };
                    const isSelected = resolved?.kind === "file" && resolved.path === row.path;
                    return (
                      <div key={row.path} data-tst="lane-slot">
                        <LaneRow
                          row={row}
                          expanded={expanded.has(row.path)}
                          selected={isSelected}
                          optionId={optionId(fileItem)}
                          strings={{ failed: strings.failed }}
                          onSelect={onFileClick}
                        />
                        {expanded.has(row.path) ? (
                          <CaseList
                            cases={row.cases}
                            selectedIndex={resolved?.kind === "case" && resolved.path === row.path ? resolved.index : -1}
                            optionId={index => optionId({ kind: "case", path: row.path, index })}
                            onSelect={index => onCaseClick(row.path, index)}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </section>
              ))}
          </div>

          <PaneHandle
            width={leftWidth}
            storage={storage}
            strings={{ paneResize: strings.paneResize, paneResizeHint: strings.paneResizeHint }}
            onWidth={setLeftWidth}
          />

          <DetailPane
              row={selectedRow}
              selectedCase={selectedCase}
              sources={sources}
              editor={editor}
              theme={theme}
              strings={strings}
          />
        </div>
      </div>
    );
  };
}
