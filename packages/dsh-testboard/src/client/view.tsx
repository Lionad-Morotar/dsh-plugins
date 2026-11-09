/**
 * The test board: a run's results as lanes of ticks, with the selected file's
 * code beside them.
 *
 * The view owns the reading state (filter, query, sort), which files are open,
 * what is selected, and how wide the case list is; everything else is derived
 * from the snapshot on each render.
 *
 * All data comes through one `TestboardRuntime`. The board no longer reads a
 * committed snapshot: it asks the host which workspace this session is in, what
 * that workspace last ran, and starts runs itself. Two consequences shape the
 * code below. The session id is the identity of everything on screen, so a
 * change to it throws the whole reading state away rather than showing one
 * workspace's rows under another's title. And a run is a process, not a value,
 * so a running run is polled until the host says it settled.
 *
 * Source text is fetched per file and cached: the board can no longer carry
 * every test file's text, and a reader who opens one file should not pay for the
 * rest.
 *
 * Theme is tracked rather than left to CSS alone. The palette itself switches
 * through `body[data-ds-dark-theme]` in the stylesheet, but the container also
 * carries the resolved theme as a class, so a test (or a reader of the DOM) can
 * see which palette is in force without parsing computed styles.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import type { TestSnapshot } from "./model.ts";
import {
  groupFileRows,
  listFileRows,
  summarize,
  throughputSeries,
  type RowFilter,
  type RowSort,
  type ThroughputBucket,
} from "./model.ts";
import type { TestboardRuntime } from "./runtime.ts";
import type { DemoStage, RunProgress, RunScope, TestboardError, TestboardState } from "../shared.ts";
import {
  caseTickStates,
  defaultMotion,
  elapsedOf,
  isReducedMotion,
  phaseLabel,
  runMeta,
  type MotionStrings,
  type PhaseLabel,
} from "./motion.ts";
import { applyNavIntent, flattenNav, navKeyIntent, normalizeSelection, pageStep, type NavSelection } from "./nav.ts";
import {
  paneWidthStorage,
  paneWidthStyle,
  readLeftPaneWidth,
  resetLeftPaneWidth,
  type PaneWidthStorage,
} from "./pane-width.ts";
import type { EditorChunkModule } from "./code-contract.ts";
import { CaseList } from "./components/case-list.tsx";
import { DetailPane, type DetailPaneStrings } from "./components/detail-pane.tsx";
import { LaneRow } from "./components/lane-row.tsx";
import { PaneHandle } from "./components/pane-handle.tsx";
import { AreaChart } from "./components/area-chart.tsx";
import { RunHeader } from "./components/run-header.tsx";
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
  readonly runAll: string;
  readonly cancel: string;
  readonly runFile: string;
  readonly running: string;
  readonly notRunYet: string;
  readonly notRunYetHint: string;
  readonly noSession: string;
  readonly errorNoSession: string;
  readonly errorUnknownWorkspace: string;
  readonly errorNoVitest: string;
  readonly errorNoSubprocess: string;
  readonly errorBusy: string;
  readonly errorBadScope: string;
  readonly errorRunFailed: string;
  readonly rerunning: string;
  readonly finished: string;
  readonly failing: string;
  readonly run: string;
  readonly rerun: string;
  readonly tests: string;
  readonly chartTitle: string;
  readonly fixing: string;
  readonly fixingModel: string;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/** What the view needs to render. */
export interface TestboardViewOptions {
  readonly strings: TestboardViewStrings;
  /**
   * Everything the board asks of the host.
   *
   * An interface rather than a set of loaders: the preview serves the same one
   * from a fixture, so the board has exactly one data path and the preview stays
   * evidence about the real tab.
   */
  readonly runtime: TestboardRuntime;
  /**
   * Resolves the code editor. Requested on the first row selection rather than
   * on mount: a reader who never selects a file never pays for CodeMirror.
   */
  readonly loadEditor: () => Promise<EditorChunkModule>;
}

/**
 * How often a running run is polled.
 *
 * The host publishes progress as it parses the runner's stream, so the board's
 * rows can light up while the suite is still going. 350ms is fast enough to look
 * live and slow enough that a long suite costs a handful of requests a second
 * rather than a stream of them.
 */
const RUN_POLL_MS = 350;

/**
 * Turn a wire error into the sentence a reader can act on.
 *
 * The wire carries short codes rather than prose so the client owns the wording
 * and the locale. An unknown code still renders something: a blank panel would
 * hide the fact that the host answered at all.
 *
 * @param error - the code the host sent.
 * @param strings - the locale-bound table.
 * @returns the sentence to show.
 */
function errorText(error: TestboardError, strings: TestboardViewStrings): string {
  switch (error) {
    case "no-session":
      return strings.errorNoSession;
    case "unknown-workspace":
      return strings.errorUnknownWorkspace;
    case "no-vitest":
      return strings.errorNoVitest;
    case "no-subprocess":
      return strings.errorNoSubprocess;
    case "busy":
      return strings.errorBusy;
    case "bad-scope":
      return strings.errorBadScope;
    case "run-failed":
      return strings.errorRunFailed;
  }
}

/**
 * Fold the snapshot's per-second buckets into the host's cumulative shape.
 *
 * The chart draws a running total, and the two sources report different things:
 * the host's buckets are already cumulative, the snapshot's are deltas. Folding
 * here keeps the chart with one input shape instead of a branch inside it.
 *
 * @param buckets - the snapshot's per-second completions.
 * @returns the same reading, accumulated.
 */
function cumulativeOf(buckets: readonly ThroughputBucket[]): RunProgress["series"] {
  let finished = 0;
  let passed = 0;
  let failed = 0;
  return buckets.map(bucket => {
    finished += bucket.completed;
    failed += bucket.failed;
    passed = finished - failed;
    return { tMs: bucket.second * 1000, finished, passed, failed };
  });
}

/**
 * Read the reader's motion preference, when the environment has one.
 *
 * jsdom has no `matchMedia`, and the board has to render there too; an absent
 * query means "motion allowed", which is the same default a browser without the
 * feature gives.
 * @returns the query's result, or undefined.
 */
function readReducedQuery(): { readonly matches: boolean } | undefined {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
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
  const { strings, runtime, loadEditor } = options;

  return function TestboardView({ sessionId }: ConversationViewProps): ReactElement {
    const theme = useHostTheme();
    const [snapshot, setSnapshot] = useState<TestSnapshot | undefined>(undefined);
    const [workspaceName, setWorkspaceName] = useState<string | undefined>(undefined);
    const [run, setRun] = useState<RunProgress | undefined>(undefined);
    const [stateError, setStateError] = useState<TestboardError | undefined>(undefined);
    const [demo, setDemo] = useState<DemoStage | undefined>(undefined);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [editor, setEditor] = useState<EditorChunkModule | undefined>(undefined);
    const [filter, setFilter] = useState<RowFilter>("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<RowSort>("fail-first");
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
    const [selection, setSelection] = useState<NavSelection | undefined>(undefined);
    const [sourceCache, setSourceCache] = useState<ReadonlyMap<string, string>>(() => new Map());
    // Bumped on every session change, so a slow answer for the previous session
    // cannot land on the new one's board.
    const [sessionEpoch, setSessionEpoch] = useState(0);
    const listRef = useRef<HTMLDivElement | null>(null);
    const editorRequested = useRef(false);
    const lastSession = useRef<string | undefined>(sessionId);

    // The reader's motion preference, read once and then followed: a reader who
    // turns it on mid-run should stop seeing animation without a reload.
    const [reduced, setReduced] = useState(() => isReducedMotion(readReducedQuery()));
    useEffect(() => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const sync = (): void => setReduced(isReducedMotion(query));
      sync();
      query.addEventListener?.("change", sync);
      return () => query.removeEventListener?.("change", sync);
    }, []);
    const motion = useMemo(() => defaultMotion({ matches: reduced }), [reduced]);

    // The clock the header's timer reads. It only runs while a run is going: a
    // settled board has nothing to count, and a tab nobody is watching should
    // not wake up ten times a second to redraw the same number.
    const [nowMs, setNowMs] = useState(() => Date.now());
    useEffect(() => {
      if (run?.phase !== "running") return undefined;
      setNowMs(Date.now());
      const timer = setInterval(() => setNowMs(Date.now()), 100);
      return () => clearInterval(timer);
    }, [run?.phase]);

    const storage: PaneWidthStorage | null = useMemo(() => paneWidthStorage(), []);
    const [leftWidth, setLeftWidth] = useState<number | null>(() => readLeftPaneWidth(storage));

    // A session is the identity of everything on screen: its workspace, its
    // last run, its rows. Switching sessions therefore throws all of it away
    // rather than letting one workspace's rows appear under another's title.
    useEffect(() => {
      if (lastSession.current === sessionId) return;
      lastSession.current = sessionId;
      setSnapshot(undefined);
      setWorkspaceName(undefined);
      setRun(undefined);
      setStateError(undefined);
      setLoadError(undefined);
      setSelection(undefined);
      setExpanded(new Set());
      setSourceCache(new Map());
      setSessionEpoch(epoch => epoch + 1);
    }, [sessionId]);

    /** Fold one host answer into the board's state. */
    const applyState = useCallback((state: TestboardState): void => {
      if (state.snapshot !== undefined) setSnapshot(state.snapshot);
      setWorkspaceName(state.workspaceName);
      setRun(state.run);
      setStateError(state.error);
      // Only the preview's fixture fills this in; on the host it is absent and
      // the board never invents a fixing stage.
      setDemo(state.demo);
    }, []);

    // The first load, and every session change. No session id means the host
    // cannot say which workspace this is, so the board says so instead of
    // guessing at the process cwd.
    useEffect(() => {
      if (sessionId === undefined || sessionId === "") {
        setSnapshot(undefined);
        setRun(undefined);
        setStateError("no-session");
        return undefined;
      }
      let live = true;
      runtime.loadState(sessionId).then(
        state => {
          if (live) applyState(state);
        },
        (error: unknown) => {
          if (live) setLoadError(error instanceof Error ? error.message : String(error));
        },
      );
      return () => {
        live = false;
      };
    }, [runtime, sessionId, sessionEpoch, applyState]);

    // A run is a process, not a value: while the host says one is going, the
    // board asks again until it settles. The timer is cleared whenever the phase
    // leaves `running`, and on unmount, so a closed tab stops polling.
    //
    // The preview's demo is the second reason to poll. Its loop keeps moving
    // through stages the wire has no phase for (a fixing card, a hold before the
    // next pass), so a run that reads `finished` there is not the end of the
    // story; the demo stage is what says the loop is still going.
    const polling = run?.phase === "running" || demo !== undefined;
    useEffect(() => {
      if (!polling || sessionId === undefined || sessionId === "") return undefined;
      let live = true;
      const timer = setInterval(() => {
        runtime.loadState(sessionId).then(
          state => {
            if (!live) return;
            applyState(state);
            // The host's snapshot replaces the board wholesale once the run
            // settled: it is authoritative, and the live events were only ever
            // a preview of it.
            if (state.run?.phase !== "running") setRun(state.run);
          },
          () => {
            // A failed poll is not a failed run: the next tick tries again, and
            // the run's own state is what decides when to stop.
          },
        );
      }, RUN_POLL_MS);
      return () => {
        live = false;
        clearInterval(timer);
      };
    }, [polling, runtime, sessionId, applyState]);

    // Source text is fetched per file and kept: the board no longer ships every
    // test file's text, and re-selecting a file must not refetch it.
    const selectedPath = selection?.path;
    useEffect(() => {
      if (selectedPath === undefined || sessionId === undefined || sessionId === "") return undefined;
      if (sourceCache.has(selectedPath)) return undefined;
      let live = true;
      runtime.loadSource(sessionId, selectedPath).then(
        text => {
          if (!live) return;
          setSourceCache(current => {
            if (current.has(selectedPath)) return current;
            const next = new Map<string, string>(current);
            next.set(selectedPath, text);
            return next;
          });
        },
        () => {
          // The pane says the source is missing; failing the tab over the code
          // view would take the rows down with it.
        },
      );
      return () => {
        live = false;
      };
    }, [selectedPath, sessionId, runtime, sourceCache]);

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
        // Only the page keys need a measurement, and only the DOM has one: the
        // row height is not fixed (an open file carries its cases, and the font
        // follows the host's axes), so the step is derived from the box the list
        // actually occupies. The row count has to be the flat order, not the
        // file count: the scroll height covers the expanded cases too, and
        // dividing it by the file count would overstate every row's height and
        // shrink the step.
        const step =
          intent === "page-down" || intent === "page-up"
            ? pageStep(
                listRef.current?.clientHeight ?? 0,
                listRef.current?.scrollHeight ?? 0,
                flattenNav(rows, expanded).length,
              )
            : 1;
        const result = applyNavIntent(intent, { selection: resolved, expanded }, rows, step);
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

    /**
     * The run's events for one file.
     *
     * The host reports events for the whole run, and a row only cares about its
     * own cases; filtering here keeps the tick computation a pure function of
     * one file.
     */
    const runCasesFor = useCallback(
      (path: string): RunProgress["cases"] => (run === undefined ? [] : run.cases.filter(entry => entry.path === path)),
      [run],
    );

    const resetPaneWidth = useCallback((): void => {
      resetLeftPaneWidth(storage);
      setLeftWidth(null);
    }, [storage]);

    /**
     * Ask the host to run something.
     *
     * A refusal is shown rather than swallowed: `busy` and `no-vitest` are the
     * two a reader can act on, and a click that silently did nothing would look
     * like a broken button.
     */
    const startRun = useCallback(
      (scope: RunScope): void => {
        if (sessionId === undefined || sessionId === "") return;
        runtime.startRun(sessionId, scope).then(
          result => {
            if (result.ok) {
              // The host's next state carries the run; asking immediately makes
              // the running phase appear without waiting for a poll.
              setStateError(undefined);
              runtime.loadState(sessionId).then(applyState, () => undefined);
              return;
            }
            setStateError(result.error);
          },
          (error: unknown) => setLoadError(error instanceof Error ? error.message : String(error)),
        );
      },
      [runtime, sessionId, applyState],
    );

    const onRunAll = useCallback((): void => startRun({ kind: "all" }), [startRun]);
    const onRunFile = useCallback((path: string): void => startRun({ kind: "file", path }), [startRun]);

    const onCancel = useCallback((): void => {
      if (sessionId === undefined || sessionId === "") return;
      runtime.cancelRun(sessionId).then(
        () => runtime.loadState(sessionId).then(applyState, () => undefined),
        (error: unknown) => setLoadError(error instanceof Error ? error.message : String(error)),
      );
    }, [runtime, sessionId, applyState]);

    const running = run?.phase === "running";
    const canRun = sessionId !== undefined && sessionId !== "" && stateError === undefined && !running;

    /**
     * The sentence explaining an empty board, or undefined when there is one.
     *
     * Ordered by what the reader needs first: a failed request, then a host
     * error, then "nothing has run here yet". The last one is not an error, and
     * it is the state a fresh workspace is in, so it keeps the run button live.
     */
    const statusText =
      loadError ??
      (stateError === undefined ? undefined : errorText(stateError, strings)) ??
      (snapshot === undefined ? strings.notRunYet : undefined);

    if (snapshot === undefined) {
      return (
        <div
          data-testid="testboard"
          data-tst="board"
          data-conversation-composer-overlay=""
          className={`tst-theme-${theme}`}
          data-theme={theme}
        >
          <div data-testid="testboard-status" data-tst="status-block">
            <p data-tst="status">{statusText ?? "…"}</p>
            {stateError === undefined && loadError === undefined ? (
              <p data-tst="status-hint">{strings.notRunYetHint}</p>
            ) : null}
            <button
              type="button"
              data-testid="run-all"
              data-tst="run-all"
              disabled={!canRun}
              onClick={onRunAll}
            >
              {strings.runAll}
            </button>
          </div>
        </div>
      );
    }

    const summary = summarize(snapshot);
    const activeOption = resolved === undefined ? undefined : optionId(resolved);

    const motionStrings: MotionStrings = {
      running: strings.running,
      rerunning: strings.rerunning,
      finished: strings.finished,
      failing: strings.failing,
      notRunYet: strings.notRunYet,
      run: strings.run,
      rerun: strings.rerun,
      tests: strings.tests,
    };
    // The preview's demo has a stage the wire does not: `fixing`. It is not a
    // run phase (D18), so it is layered on here rather than taught to
    // `phaseLabel`, which stays a function of the host's own state.
    const label: PhaseLabel =
      demo?.phase === "fixing"
        ? {
            phase: "finished",
            text: `${strings.fixing} ${String(run?.counts.failed ?? 0)} ${strings.failing}`,
            tone: "failed",
          }
        : phaseLabel(run, motionStrings);
    // With no run in flight the header still has a number to show: the last
    // reading's own duration. Reporting 0.0s would say the suite took no time.
    const elapsedMs = run === undefined ? summary.wallClockMs : elapsedOf(run, nowMs);
    // The chart reads the live run when there is one and the snapshot's own
    // synthetic series otherwise, so an idle board still shows the last shape.
    // The two bucket shapes differ (the snapshot's are per-second deltas, the
    // host's are cumulative), so the synthetic one is folded into the same
    // cumulative form rather than special-cased in the chart.
    const chartSeries: RunProgress["series"] =
      run === undefined ? cumulativeOf(throughputSeries(snapshot)) : run.series;
    const chartFailures = run === undefined ? [] : run.failures;
    const chartSpanMs = run === undefined ? Math.max(1000, summary.wallClockMs) : Math.max(1000, elapsedMs);
    const meta = runMeta(run, motionStrings);
    // The subtitle is `workspace · command`. The command half already names the
    // project in the locale string, so the workspace is only prepended when it
    // says something different: otherwise the line reads `dsh-plugins ·
    // dsh-plugins · pnpm test`.
    const subtitle =
      workspaceName === undefined || strings.subtitle.startsWith(workspaceName)
        ? strings.subtitle
        : `${workspaceName} · ${strings.subtitle}`;

    return (
      <div
        data-testid="testboard"
        data-tst="board"
        data-conversation-composer-overlay=""
        className={`tst-theme-${theme}`}
        data-theme={theme}
      >
        <RunHeader
          label={label}
          demoPhase={demo?.phase}
          subtitle={subtitle}
          passed={run === undefined ? summary.passed : run.counts.passed}
          failed={run === undefined ? summary.failed : run.counts.failed}
          elapsedMs={elapsedMs}
          running={running}
          reduced={motion.reduced}
          strings={{ passed: strings.passed, failed: strings.failed, took: strings.took }}
        />
        <AreaChart
          series={chartSeries}
          failures={chartFailures}
          spanMs={chartSpanMs}
          reduced={motion.reduced}
          strings={{ title: strings.chartTitle, peak: strings.peak, perSecond: strings.perSecond }}
          overlay={
            demo?.phase === "fixing" ? (
              <aside data-testid="fixing-card" data-tst="fixing-card">
                <div data-tst="fixing-head">
                  {strings.fixing} <span data-tst="fixing-path">{demo.path ?? ""}</span>
                </div>
                <div data-tst="fixing-meta">
                  <span data-tst="fixing-model">{demo.model ?? ""}</span>
                  <span data-tst="fixing-sep">·</span>
                  <span data-tst="fixing-seconds">{String(demo.seconds ?? 0)}s</span>
                </div>
                <div data-tst="fixing-diff">
                  <span data-tst="diff-add">+2</span>
                  <span data-tst="diff-del">−2</span>
                </div>
              </aside>
            ) : null
          }
        />
        {meta === "" ? null : (
          <p data-testid="run-meta" data-tst="run-meta">
            {meta}
          </p>
        )}
        <Toolbar
          filter={filter}
          query={query}
          sort={sort}
          running={running}
          canRun={canRun}
          strings={{
            filterAll: strings.filterAll,
            filterFailed: strings.filterFailed,
            searchPlaceholder: strings.searchPlaceholder,
            sortFailFirst: strings.sortFailFirst,
            sortSlowFirst: strings.sortSlowFirst,
            runAll: strings.runAll,
            cancel: strings.cancel,
            running: strings.running,
          }}
          onFilter={setFilter}
          onQuery={setQuery}
          onSort={setSort}
          onRunAll={onRunAll}
          onCancel={onCancel}
        />

        <div data-testid="split" data-tst="split" style={paneWidthStyle(leftWidth)}>
          <div
              ref={listRef}
              data-testid="lanes"
              data-tst="lanes"
              data-page-keys="own"
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
                          running={running}
                          ticks={caseTickStates({
                            snapshotCases: row.cases,
                            runCases: runCasesFor(row.path),
                            scope: run?.scope,
                            rerunning: run !== undefined && run.runNumber > 1,
                            running,
                            path: row.path,
                          })}
                          reduced={motion.reduced}
                          strings={{ failed: strings.failed, runFile: strings.runFile }}
                          onSelect={onFileClick}
                          onRun={onRunFile}
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
              source={selectedRow === undefined ? undefined : sourceCache.get(selectedRow.path)}
              editor={editor}
              theme={theme}
              strings={strings}
          />
        </div>
      </div>
    );
  };
}
