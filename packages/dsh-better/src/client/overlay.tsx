/**
 * The select popup, with provider-aware search for `/model`.
 *
 * This component registers into the same slot cell as the shell's own popup and
 * shadows it, because the thing being changed, which rows a query can reach, is
 * decided inside that component: the shell filters through a module-private
 * function that only looks at a row's own label, so a provider name is invisible
 * to it no matter what the rows carry. Improving provider search therefore means
 * owning the render.
 *
 * Owning it does not mean reimplementing the surface. Two rules keep everything
 * else native:
 *
 *   - any command other than `/model`, and any `/model` state this feature has no
 *     opinion about, renders the shell's own component as a child element, so
 *     every other picker, and every loading, failure and gated state, is exactly
 *     what shipped;
 *   - `/model` keeps the shell's markup, hashed classes, dismissal behaviour and
 *     settlement path, and differs only in the row list it draws.
 *
 * Selection and highlighting never go through a row index. The controller keeps
 * its highlight and resolves a picked index inside the list *it* computed, which
 * is shorter than this one whenever a provider query matched, so an index would
 * name a different row than the one drawn. This surface keeps its own cursor
 * over its own rows and settles by option identity.
 */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode, Ref } from "react";

import { readPopupClasses } from "./classes.ts";
import { effortLevelsOf, initialEffort, type CatalogGroupLike } from "./effort.ts";
import { ModelRow, modelRefOf } from "./row.tsx";
import { groupOptions } from "./groups.ts";
import type { PopupControllerLike, PopupOptionLike, PopupStateLike } from "./popup.ts";
import { resolvePrimitives, type KeyboardEventLike, type Primitives } from "./primitives.ts";
import { rankByProvider, type SearchMode } from "./search.ts";

/** The command whose picker gains provider search. */
export const MODEL_COMMAND = "model";

/** Design cap on the card height, matching the shell's own popup. */
const MAX_HEIGHT = 320;

/** Props the overlay entry receives from the slot renderer. */
export interface OverlayProps {
  /** The session's popup controller, injected by the host wiring. */
  readonly popup?: PopupControllerLike | undefined;
  /** Locale lookup, injected by the slot's `locale` seat. */
  readonly t?: ((key: string) => string) | undefined;
  /** The session's catalog groups, which carry each model's effort ladder. */
  readonly catalog?: readonly CatalogGroupLike[] | undefined;
  /**
   * Submit a complete selection, including the effort level.
   *
   * The popup's own settlement rebuilds a choice from the row id, which cannot
   * carry a level; this is the path that can.
   */
  readonly selectModel?:
    | ((selection: { provider: string; model: string; reasoningEffort?: string }) => Promise<unknown> | undefined)
    | undefined;
}

/** What one overlay mount needs but cannot import. */
export interface OverlayDeps {
  /** The loader `require`, for the host's UI primitives. */
  readonly load: ((specifier: string) => unknown) | null;
  /**
   * Resolve the shell's own popup component from the shadowed slot entry.
   *
   * Called per render rather than captured once, because load order is not this
   * plugin's to decide: when this package applies before the shell registers its
   * entry there is nothing to read yet, and freezing that answer would make the
   * overlay render nothing for the rest of the page's life.
   */
  native: () => ((props: OverlayProps) => ReactNode) | undefined;
  /** Document holding the shell's stylesheet. */
  readonly document: Document | undefined;
}

/**
 * Whether this surface is responsible for the current picker.
 *
 * Only a ready, ungated, non-empty `/model` list is taken over. Loading, failure
 * and an empty result are states the shell already renders correctly, and the
 * risk gate is a settlement path this surface deliberately leaves alone.
 * @param state - current popup state.
 * @returns true when the improved picker should draw.
 */
export function ownsPicker(state: PopupStateLike): boolean {
  if (state.command !== MODEL_COMMAND) return false;
  if (!state.open || state.status !== "ready" || state.confirming !== null) return false;
  if (state.options.length === 0) return false;
  return state.submitting || state.error === null;
}

/** A store that never publishes, standing in before the controller arrives. */
const ABSENT_STORE = {
  subscribe: () => () => undefined,
  getSnapshot: (): PopupStateLike => ({
    open: false,
    command: null,
    status: "pending",
    options: [],
    search: "",
    searchLabels: null,
    searchMode: "substring",
    active: 0,
    submitting: false,
    confirming: null,
    acknowledged: false,
    error: null,
  }),
};

/**
 * Build the overlay component for one plugin instance.
 *
 * Built rather than declared at module scope because its dependencies
 * (primitives, the shell component, the document) only appear once the plugin
 * applies.
 * @param deps - the resolved dependencies.
 * @returns a component suitable for the overlay slot.
 */
export function createOverlay(deps: OverlayDeps): (props: OverlayProps) => ReactNode {
  const primitives = resolvePrimitives(deps.load);

  /**
   * Route one overlay render to the shell or to the improved picker.
   *
   * Every hook runs unconditionally and before any branch, because the same
   * mount serves every command and every popup state; a branch that skipped a
   * hook would desynchronise the hook order the moment a picker opened.
   */
  function Overlay(props: OverlayProps): ReactNode {
    const popup = props.popup;
    // The controller is a stable per-session object, so deriving the store face
    // from it keeps uSES subscriptions stable across renders.
    const store = popup?.state ?? ABSENT_STORE;
    const subscribe = useCallback((notify: () => void) => store.subscribe(notify), [store]);
    const getSnapshot = useCallback(() => store.getSnapshot(), [store]);
    const state = useSyncExternalStore(subscribe, getSnapshot);

    // Rendered as an *element*, never called as a function: the shell's popup
    // runs its own hooks, and invoking it inline would splice them into this
    // component's hook slot and crash on the next render.
    const Native = deps.native();
    if (popup === undefined || Native === undefined) return null;
    if (!ownsPicker(state) || popup.settle === undefined) return <Native {...props} />;
    return (
      <ModelPicker
        popup={popup}
        state={state}
        t={props.t}
        primitives={primitives}
        doc={deps.document}
        catalog={props.catalog}
        selectModel={props.selectModel}
      />
    );
  }

  return Overlay;
}

/** Props the improved picker takes. */
interface ModelPickerProps {
  readonly popup: PopupControllerLike;
  readonly state: PopupStateLike;
  readonly t: ((key: string) => string) | undefined;
  readonly primitives: Primitives;
  readonly doc: Document | undefined;
  /**
   * Catalog groups, the only place reasoning metadata lives.
   *
   * The popup's own rows carry no effort information at all: the shell's
   * `selectionOf` reads it from the directory, so showing and choosing a level
   * here means reading the same source rather than extending the rows.
   */
  readonly catalog: readonly CatalogGroupLike[] | undefined;
  readonly selectModel:
    | ((selection: { provider: string; model: string; reasoningEffort?: string }) => Promise<unknown> | undefined)
    | undefined;
}

/**
 * The `/model` picker: the shell's surface with a provider-aware row list.
 */
function ModelPicker({ popup, state, t, primitives, doc, catalog, selectModel }: ModelPickerProps): ReactNode {
  const cardRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const classes = useMemo(() => readPopupClasses(doc), [doc]);
  const mode: SearchMode = state.searchMode;

  const ranked = useMemo(
    () => rankByProvider(state.options, state.search, mode, primitives.rankByName),
    [state.options, state.search, mode, primitives.rankByName],
  );
  const groups = useMemo(() => groupOptions(ranked), [ranked]);

  // Effort state is per model, not per list: pointing at `max` for one model must
  // not silently pre-select `max` for the next one whose ladder differs.
  const [efforts, setEfforts] = useState<Record<string, string | undefined>>({});

  // The cursor is this surface's own. Opening parks it on the session's current
  // model, matching the shell's first-open behaviour; the shell's own index is
  // unusable because its list and this one differ in length.
  const [cursor, setCursor] = useState(() => currentIndex(ranked));
  // A new query is a different list, so the cursor restarts on the row the shell
  // would have highlighted: the current model when it survives the filter.
  useEffect(() => {
    setCursor(currentIndex(ranked));
  }, [state.search, state.options]);
  const active = clampActive(ranked, cursor);

  const maxHeight = useAnchoredHeight(primitives, cardRef, state);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport === null || primitives.observeStickyMenuGroups === undefined) return;
    return primitives.observeStickyMenuGroups(viewport);
  }, [primitives.observeStickyMenuGroups, state.open, state.status, groups]);

  useEffect(() => {
    cardRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active, ranked]);

  useEffect(() => {
    if (!state.open) return;
    const onPointerDown = (event: Event): void => {
      const card = cardRef.current;
      if (card !== null && event.target instanceof Node && card.contains(event.target)) return;
      popup.dismiss();
    };
    doc?.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      doc?.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [doc, popup, state.open]);

  useEffect(() => {
    searchRef.current?.focus();
  }, [state.open]);

  /**
   * Settle one drawn row by identity.
   *
   * `settle` is token-guarded, so passing the controller's current binding is
   * what makes a click that lands after the picker was superseded lose its write
   * rights instead of selecting into a stale binding.
   */
  /**
   * Settle one drawn row.
   *
   * Two paths, chosen by whether the model has a level to carry. A model without
   * one goes through the shell's own settlement, which handles consumption and
   * focus for us. A model with levels must submit the pair directly: the shell's
   * settlement rebuilds the choice from the row id alone and would drop the level,
   * leaving whatever was already in effect. That path closes the picker itself,
   * because it does not run the shell's settlement.
   */
  const settleRow = useCallback(
    (option: PopupOptionLike, effort: string | undefined): void => {
      if (effort === undefined || selectModel === undefined) {
        void popup.settle?.(popup.binding, option);
        return;
      }
      const ref = modelRefOf(option);
      if (ref === undefined) {
        void popup.settle?.(popup.binding, option);
        return;
      }
      void Promise.resolve(selectModel({ ...ref, reasoningEffort: effort })).finally(() => {
        popup.dismiss({ focusComposer: true });
      });
    },
    [popup, selectModel],
  );

  const choose = useCallback(
    (option: PopupOptionLike): void => {
      const ref = modelRefOf(option);
      const levels = ref === undefined ? [] : effortLevelsOf(catalog ?? [], ref);
      // The level the row is pointing at, defaulting to the one the adapter
      // itself would use, so a plain row click is still a complete choice.
      const pointed = levels.length === 0 ? undefined : (efforts[option.id] ?? initialEffort(levels, undefined, undefined));
      settleRow(option, pointed);
    },
    [catalog, efforts, settleRow],
  );

  /**
   * Submit a row with one specific effort level.
   *
   * A badge is an explicit choice, so it submits rather than merely highlighting:
   * the user pointed at `max` on a model row, which is the whole gesture.
   */
  const pickEffort = useCallback(
    (option: PopupOptionLike, level: string): void => {
      setEfforts((previous) => ({ ...previous, [option.id]: level }));
      settleRow(option, level);
    },
    [settleRow],
  );

  const chooseCursor = useCallback((): void => {
    const option = ranked[active];
    if (option !== undefined) choose(option);
  }, [active, choose, ranked]);

  const step = useCallback(
    (delta: number): void => {
      if (ranked.length === 0) return;
      setCursor((previous) => (clampActive(ranked, previous) + delta + ranked.length) % ranked.length);
    },
    [ranked],
  );

  const onKeyDown = (event: KeyboardEventLike): void => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        step(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        step(-1);
        return;
      case "Enter":
        event.preventDefault();
        chooseCursor();
        return;
      case "Tab":
        // Plain Tab keeps the shell's contract: with nothing to accept it moves
        // focus on instead of trapping the user in an empty picker.
        if (!event.shiftKey && ranked.length === 0) return;
        event.preventDefault();
        if (event.shiftKey) popup.dismiss({ focusComposer: true });
        else chooseCursor();
        return;
      case "Escape":
        event.preventDefault();
        popup.dismiss({ focusComposer: true });
        return;
      default:
    }
  };

  if (classes === undefined) return null;

  const placeholder = state.searchLabels?.placeholder ?? t?.("search.placeholder") ?? "";
  // Mirrors the shell: its own fallback when the command published no labels,
  // the "no models" string when the list is empty, else "no matches".
  const emptyLabel =
    state.searchLabels === null
      ? (t?.("status.empty") ?? "")
      : state.options.length === 0
        ? state.searchLabels.empty
        : state.searchLabels.noResults;

  const renderRow = (option: PopupOptionLike, index: number): ReactNode => (
    <ModelRow
      key={option.id}
      option={option}
      active={index === active}
      catalog={catalog}
      pointed={efforts[option.id]}
      classes={classes}
      primitives={primitives}
      onChoose={() => {
        choose(option);
      }}
      onPickEffort={(level) => {
        pickEffort(option, level);
      }}
      onHover={() => {
        setCursor(index);
      }}
      t={t}
    />
  );

  // The card is drawn group by group so headings stay native; the cursor counts
  // across the whole list, which is why it is threaded through the mapping.
  let optionIndex = 0;
  const body = groups.map(({ group, rows }) => {
    const drawn = rows.map((option) => renderRow(option, optionIndex++));
    if (group === undefined) return <Fragment key="ungrouped">{drawn}</Fragment>;
    return primitives.MenuGroup === undefined ? (
      <Fragment key={`group:${group.name}`}>{drawn}</Fragment>
    ) : (
      <primitives.MenuGroup label={group.label} key={`group:${group.name}`}>
        {drawn}
      </primitives.MenuGroup>
    );
  });

  const content = (
    <>
      <input
        ref={searchRef}
        className={classes.search}
        type="text"
        placeholder={placeholder}
        aria-label={t?.("search.aria") ?? ""}
        value={state.search}
        readOnly={state.submitting}
        onChange={(event) => {
          popup.setSearch(event.currentTarget.value);
        }}
      />
      {state.submitting && <div className={classes.status}>{t?.("status.applying") ?? ""}</div>}
      {!state.submitting && ranked.length === 0 && <div className={classes.status}>{emptyLabel}</div>}
      {ranked.length > 0 && (
        <div ref={viewportRef} role="listbox" aria-label={t?.("listbox.aria") ?? ""} className={classes.viewport}>
          {body}
        </div>
      )}
    </>
  );

  const surfaceProps = {
    className: classes.card,
    style: { maxHeight },
    "aria-label": t?.("overlay.aria") ?? MODEL_COMMAND,
    onKeyDown,
  };

  return primitives.MenuSurface === undefined ? (
    <div ref={cardRef as Ref<HTMLDivElement>} {...surfaceProps}>
      {content}
    </div>
  ) : (
    <primitives.MenuSurface ref={cardRef} {...surfaceProps}>
      {content}
    </primitives.MenuSurface>
  );
}

/**
 * The row to park the cursor on for a freshly drawn list.
 *
 * The session's current model when the list still shows it, otherwise the top
 * row: an accept gesture made before looking should confirm the value already in
 * use, never an arbitrary neighbour.
 * @param rows - drawn rows.
 * @returns an index into `rows`.
 */
function currentIndex(rows: readonly PopupOptionLike[]): number {
  const at = rows.findIndex((option) => option.active === true);
  return at === -1 ? 0 : at;
}

/**
 * Keep a cursor inside the drawn list.
 * @param rows - drawn rows.
 * @param index - desired position.
 * @returns an index into `rows`, or 0 when the list is empty.
 */
function clampActive(rows: readonly PopupOptionLike[], index: number): number {
  if (rows.length === 0) return 0;
  return Math.min(Math.max(index, 0), rows.length - 1);
}

/**
 * Clamp the card to the space above the composer.
 *
 * A hook cannot be called conditionally and the primitive is absent on hosts
 * that do not seed it, so this routes through a stable local hook that reports
 * the plain cap in that case.
 * @param primitives - host primitives.
 * @param ref - the card element ref.
 * @param state - value to re-measure on.
 * @returns the height cap in pixels.
 */
function useAnchoredHeight(primitives: Primitives, ref: Ref<HTMLElement | null>, state: unknown): number {
  const measure = primitives.useAnchoredMaxHeight;
  return measure === undefined ? MAX_HEIGHT : measure(ref, MAX_HEIGHT, state);
}
