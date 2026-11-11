/**
 * The session statistics pill.
 *
 * This pill takes over the shipped `activity` seat in the composer dock and
 * nothing else, so it has to be a superset of that seat specifically: one static
 * reading in compact mode, the same dialog rows in detailed mode, plus the retry
 * wait the shipped fold cannot report (it measures model time from `step/start`,
 * so a retried step folds the failed attempt and the backoff into model time).
 * The neighbouring `usage` seat is a separate entry id and keeps rendering on
 * its own, which is why this module reads no token usage.
 *
 * Everything the platform owns arrives as props, never as imports. This module
 * is compiled into a loader factory where React, react-dom and the shared
 * primitive kit are seeded by the host — a bundled second copy of any of them
 * would break hooks or render into a detached tree. The same prop channel also
 * carries the mode hook: the slot derives a hook prop `useFoo` from an injected
 * hook named `foo`, which is how a settings preference reaches a third-party
 * pill at all.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { TimingView } from "../schema.ts";
import { decodeSpeed, type Translate } from "./format.ts";
import { compactReading, detailRows, hasDetails } from "./rows.ts";
import { installStyles, styles } from "./styles.ts";

// The stylesheet goes in at module scope, not during render: the pill is
// re-rendered per streamed token and the tag must already exist at first paint.
installStyles();

/** Distance between the trigger's top edge and the panel's bottom. */
const PANEL_GAP = 8;
/** Viewport margin the placement clamp keeps. */
const PANEL_MARGIN = 12;
/** Laid out but invisible, so the clamp measures the panel's real size. */
const MEASURE_STYLE = { visibility: "hidden", left: 0, top: 0 } as const;

/** The two shapes the dock renders. */
export type UsageMode = "compact" | "detailed";

/** react-dom's `createPortal`, typed without depending on react-dom. */
export type PortalRender = (children: ReactNode, container: Element) => ReactNode;

/** The placement hook of the shared primitive kit. */
export type AnchoredPosition = (options: {
  open: boolean;
  anchorRef: { readonly current: HTMLElement | null };
  panelRef: { readonly current: HTMLElement | null };
  side: "top" | "bottom";
  gap: number;
  margin: number;
}) => PanelPosition | null;

/** The fixed-position coordinates the dialog renders with. */
export interface PanelPosition {
  readonly left: number;
  readonly top: number;
}

/** A measured box: the subset of DOMRect the fallback placement reads. */
export interface PanelBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

/** The outside-dismiss hook of the shared primitive kit. */
export type DismissOnOutsidePointer = (
  rootRef: { readonly current: HTMLElement | null },
  open: boolean,
  setOpen: (value: boolean) => void,
  panelRef?: { readonly current: HTMLElement | null },
) => void;

/** The platform kit the entry resolves through the loader and injects. */
export interface PlatformKit {
  /** The gauge glyph the dock pill uses. */
  readonly IconGauge: ComponentType<Record<string, unknown>>;
  /**
   * Shared anchored placement. Present on 0.2.2-rc.1, removed in 0.2.2-rc.2:
   * when absent the dialog measures itself in `useMeasuredPanelPosition`.
   */
  readonly useAnchoredPosition?: AnchoredPosition;
  readonly useDismissOnOutsidePointer: DismissOnOutsidePointer;
  readonly createPortal: PortalRender;
}

/** Everything the slot hands the component. */
export interface StatsPillProps {
  /** Host-computed projection values, addressed by key. */
  readonly useProjection: <K extends string>(key: K) => TimingView | undefined;
  /** The mirrored chat preference; `compact` collapses the pill to the speed reading. */
  readonly useSessionTimingMode: <S>(selector: (mode: UsageMode) => S) => S;
  /** Platform modules, resolved by the entry. */
  readonly kit: PlatformKit;
  /** The locale seat for this plugin's namespace. */
  readonly t: Translate;
}

/**
 * Place the panel above the trigger, aligning its left edge and clamping it into
 * the viewport. Kept pure so the fallback math is testable without a layout.
 * @param anchor - trigger box.
 * @param panel - panel box, measured while laid out.
 * @param viewport - viewport size.
 * @returns fixed-position coordinates.
 */
export function placePanelAbove(
  anchor: PanelBox,
  panel: PanelBox,
  viewport: { readonly width: number; readonly height: number },
): PanelPosition {
  const maxLeft = Math.max(PANEL_MARGIN, viewport.width - panel.width - PANEL_MARGIN);
  return {
    left: Math.min(Math.max(anchor.left, PANEL_MARGIN), maxLeft),
    top: Math.max(PANEL_MARGIN, anchor.top - PANEL_GAP - panel.height),
  };
}

/**
 * Fallback placement for hosts whose primitive kit dropped the anchor hook
 * (0.2.2-rc.2 and later). It measures both boxes after the portal commits and
 * re-measures on viewport resize and on scroll, because the panel is fixed
 * while its trigger moves with the composer.
 * @param open - whether the dialog is mounted.
 * @param anchorRef - trigger ref.
 * @param panelRef - panel ref.
 * @returns coordinates, or null while closed or not yet measured.
 */
export function useMeasuredPanelPosition(
  open: boolean,
  anchorRef: { readonly current: HTMLElement | null },
  panelRef: { readonly current: HTMLElement | null },
): PanelPosition | null {
  const [position, setPosition] = useState<PanelPosition | null>(null);
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const place = (): void => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (anchor === null || panel === null) return;
      const panelBox = panel.getBoundingClientRect();
      // A zero-size box means the portal has not been laid out yet. Keeping the
      // hidden measuring style for another frame beats pinning the panel to 0,0.
      if (panelBox.width === 0 && panelBox.height === 0) return;
      const next = placePanelAbove(anchor.getBoundingClientRect(), panelBox, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setPosition((current) =>
        current !== null && current.left === next.left && current.top === next.top ? current : next,
      );
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    // The host hook also tracks the panel's own size; rows can appear while the
    // dialog is open, and a taller panel would otherwise grow over its trigger.
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    if (panelRef.current !== null) observer?.observe(panelRef.current);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      observer?.disconnect();
    };
  }, [open, anchorRef, panelRef]);
  return position;
}

/**
 * Resolve the dialog placement. The shared hook owns the work when the host
 * seeds one; otherwise the measured fallback stands in. The kit is fixed by the
 * loader for the life of the page, so this branch cannot flip between renders
 * and reorder the hooks. Same shape as dsh-git-explorer's branch popover.
 * @param kit - platform kit.
 * @param open - whether the dialog is mounted.
 * @param anchorRef - trigger ref.
 * @param panelRef - panel ref.
 * @returns coordinates, or null while closed.
 */
function usePanelPosition(
  kit: PlatformKit,
  open: boolean,
  anchorRef: { readonly current: HTMLElement | null },
  panelRef: { readonly current: HTMLElement | null },
): PanelPosition | null {
  if (kit.useAnchoredPosition !== undefined) {
    return kit.useAnchoredPosition({ open, anchorRef, panelRef, side: "top", gap: PANEL_GAP, margin: PANEL_MARGIN });
  }
  return useMeasuredPanelPosition(open, anchorRef, panelRef);
}

/** One trigger-anchored dialog seat: open state, clamped placement, Escape-close. */
function useStatDialog(kit: PlatformKit) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pos = usePanelPosition(kit, open, rootRef, panelRef);
  kit.useDismissOnOutsidePointer(rootRef, open, setOpen, panelRef);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  return { open, toggle, rootRef, panelRef, pos };
}

/** Join two readings with the dock's separator glyph. */
function joined(first: string, second: string | null) {
  if (second === null) return first;
  return (
    <>
      {first}
      <span className={styles.sep} aria-hidden>
        ·
      </span>
      {second}
    </>
  );
}

/**
 * The statistics pill: turn/step counts with whole-session speed, opening the
 * timing dialog. Compact keeps only the speed reading.
 * @param props - projection reader, preference hook, platform kit, locale seat.
 * @returns the pill, or null until the session has a timing reading.
 */
export function StatsPill({ useProjection, useSessionTimingMode, kit, t }: StatsPillProps) {
  const mode = useSessionTimingMode((value) => value);
  const timing = useProjection("sessionTiming");
  const speed = useMemo(() => (timing === undefined ? null : decodeSpeed(timing, t)), [timing, t]);
  const { open, toggle, rootRef, panelRef, pos } = useStatDialog(kit);
  if (timing === undefined) return null;
  const { IconGauge } = kit;
  const icon = <IconGauge />;
  if (mode === "compact") {
    const reading = compactReading(speed);
    if (reading === null) return null;
    return (
      <span className={styles.anchor} data-composer-stat="session-timing">
        <span className={styles.pill}>
          {icon}
          <span className={styles.label}>{reading}</span>
        </span>
      </span>
    );
  }
  if (timing.steps === 0) return null;
  const counts = t("stats.counts", { turns: timing.turns, steps: timing.steps });
  const title = t("stats.title");
  const openable = hasDetails(timing, speed);
  const pill = openable ? (
    <button type="button" className={styles.pill} aria-haspopup="dialog" aria-expanded={open} aria-label={counts} onClick={toggle}>
      {icon}
      <span className={styles.label}>{joined(counts, speed)}</span>
    </button>
  ) : (
    <span className={styles.pill}>
      {icon}
      <span className={styles.label}>{joined(counts, speed)}</span>
    </span>
  );
  return (
    <span ref={openable ? rootRef : undefined} className={styles.anchor} data-composer-stat="session-timing">
      {pill}
      {open &&
        openable &&
        kit.createPortal(
          <div ref={panelRef} className={styles.panel} role="dialog" aria-label={title} style={pos ?? MEASURE_STYLE} data-session-timing-details>
            <div className={styles.title}>
              <span className={styles.titleLabel}>
                {icon}
                {title}
              </span>
            </div>
            <div className={styles.titleRule} aria-hidden />
            <dl className={styles.details}>
              {detailRows(timing, speed, t).map((row) => (
                <div key={row.key} className={styles.row}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>,
          document.body,
        )}
    </span>
  );
}

export default StatsPill;
