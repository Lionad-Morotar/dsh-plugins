/**
 * The test board: a run's results as lanes of ticks.
 *
 * The view owns three pieces of state (filter, query, sort) plus which files are
 * expanded and which one is hovered, and derives everything else from the
 * snapshot on each render. There is no fetching and no timer: the data is a
 * committed snapshot, and the board is a reading of it.
 *
 * Theme is tracked rather than left to CSS alone. The palette itself switches
 * through `body[data-ds-dark-theme]` in the stylesheet, but the container also
 * carries the resolved theme as a class, so a test (or a reader of the DOM) can
 * see which palette is in force without parsing computed styles.
 */
import { useEffect, useState, type ReactElement } from "react";

import type { TestSnapshot } from "./model.ts";
import { groupFileRows, listFileRows, peakThroughput, summarize, throughputSeries, type RowFilter, type RowSort } from "./model.ts";
import { CaseList } from "./components/case-list.tsx";
import { DetailCard } from "./components/detail-card.tsx";
import { LaneRow } from "./components/lane-row.tsx";
import { SummaryHeader } from "./components/summary-header.tsx";
import { ThroughputSparkline } from "./components/throughput-sparkline.tsx";
import { Toolbar } from "./components/toolbar.tsx";

/** The attribute the host writes on `body` to select the dark palette. */
const DARK_ATTRIBUTE = "data-ds-dark-theme";

/** Strings the view renders, bound through the locale seat by the entry. */
export interface TestboardViewStrings {
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
  readonly detailHint: string;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/** What the view needs to render; the loader supplies the snapshot. */
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
 * @param options - locale-bound strings and the snapshot to render.
 * @returns the component the slot mounts.
 */
export function createTestboardView(options: TestboardViewOptions): (props: ConversationViewProps) => ReactElement {
  const { strings, loadSnapshot } = options;

  return function TestboardView(): ReactElement {
    const theme = useHostTheme();
    const [snapshot, setSnapshot] = useState<TestSnapshot | undefined>(undefined);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [filter, setFilter] = useState<RowFilter>("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<RowSort>("fail-first");
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
    const [hovered, setHovered] = useState<string | undefined>(undefined);

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

    if (snapshot === undefined) {
      return (
        <div data-testid="testboard" data-tst="board" className={`tst-theme-${theme}`} data-theme={theme}>
          <p data-tst="status">{loadError ?? "…"}</p>
        </div>
      );
    }

    const summary = summarize(snapshot);
    const series = throughputSeries(snapshot);
    const rows = listFileRows(snapshot, { filter, query, sort });
    const groups = groupFileRows(rows);
    const hoveredRow = hovered === undefined ? undefined : rows.find(row => row.path === hovered);

    const toggle = (path: string): void => {
      setExpanded(current => {
        const next = new Set(current);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        return next;
      });
    };

    return (
      <div data-testid="testboard" data-tst="board" className={`tst-theme-${theme}`} data-theme={theme}>
        <SummaryHeader
          summary={summary}
          strings={{ title: strings.title, subtitle: strings.subtitle, ago: strings.ago, passed: strings.passed, failed: strings.failed }}
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

        <div data-tst="lanes">
          {groups.length === 0 ? <p data-testid="empty" data-tst="empty">{strings.empty}</p> : null}
          {groups.map(group => (
            <section key={group.packageName} data-testid="package-section" data-tst="package" data-package={group.packageName}>
              <h2 data-tst="package-name">{group.packageName}</h2>
              {group.rows.map(row => (
                <div key={row.path} data-tst="lane-slot">
                  <LaneRow
                    row={row}
                    expanded={expanded.has(row.path)}
                    strings={{ failed: strings.failed }}
                    onToggle={toggle}
                    onHover={setHovered}
                  />
                  {expanded.has(row.path) ? <CaseList cases={row.cases} /> : null}
                </div>
              ))}
            </section>
          ))}
        </div>

        {hoveredRow === undefined ? null : (
          <div data-tst="card-anchor">
            <DetailCard row={hoveredRow} />
          </div>
        )}
      </div>
    );
  };
}
