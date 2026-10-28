/**
 * The composer's model trigger, repurposed as an opener for the picker.
 *
 * The shell's seat (`conversation.input.model`) draws a trigger that opens a
 * two-level menu of its own: a root pane of Model/Effort cells drilling into
 * lists. That is a second model list, and it searches model names only, so on a
 * machine with forty-odd providers it cannot answer "everything under this
 * provider" any better than the command popup could.
 *
 * Rather than keep two lists in agreement, the trigger opens the picker `/model`
 * opens, where search knows about providers and the effort level is chosen in
 * the same list.
 *
 * Two consequences of shadowing a `single` slot are load-bearing:
 *
 *   - the label the trigger shows normally comes from the shell's own inline
 *     child slot (`conversation.input.model.label`). Only the entry that declared
 *     that slot may render it, and a second declaration throws, so this component
 *     renders the model name directly. That matches the shell's own behaviour in
 *     the absence of a contributor, which is the state both profiles are in;
 *   - the shell's trigger is restyled by another plugin in the wild (a provider
 *     prefix). This component therefore keeps the shell's class names and markup
 *     shape, so such a stylesheet still applies even though the text is drawn
 *     here.
 */
import { useCallback, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { resolvePrimitives } from "./primitives.ts";

/** Props the shell's seat receives; this shadow reads the same share. */
export interface SeatProps {
  /** Whether this session may inspect and select models at all. */
  readonly available?: boolean | undefined;
  /** Whether the composer has locked model changes (e.g. mid-turn). */
  readonly locked?: boolean | undefined;
  /** Session the seat belongs to. */
  readonly sessionId?: string | undefined;
  /** The shared directory store. */
  readonly directory?:
    | {
        subscribe(notify: () => void): () => void;
        getSnapshot(): SeatSnapshotLike;
      }
    | undefined;
  /** `model`-namespace translator. */
  readonly t?: ((key: string, params?: Record<string, unknown>) => string) | undefined;
}

/** The directory snapshot fields the trigger draws from. */
export interface SeatSnapshotLike {
  readonly current: { provider: string; model: string; reasoningEffort?: string } | null;
  readonly retainedEffort?: string | undefined;
  readonly status: string;
  readonly groups: readonly {
    readonly id: string;
    readonly name: string;
    readonly models: readonly {
      readonly id: string;
      readonly name: string;
      readonly reasoning?: { readonly efforts?: readonly { readonly id: string; readonly name: string }[]; readonly defaultEffort?: string } | undefined;
    }[];
  }[];
}

/** What one seat mount needs but cannot import. */
export interface SeatDeps {
  /** Loader `require`, for the host's primitives. */
  readonly load: ((specifier: string) => unknown) | null;
  /** The shell's own seat component, from the shadowed slot entry. */
  native: () => ((props: SeatProps) => ReactNode) | undefined;
  /**
   * Open the picker for a session.
   * @param sessionId - session whose picker opens.
   * @returns whether the picker could be opened.
   */
  readonly openPicker: (sessionId: string | undefined) => boolean;
  /** Translator for this package's namespace, resolved lazily. */
  readonly translate: () => ((key: string, params?: Record<string, unknown>) => string) | undefined;
}

/**
 * The class names the shell's seat uses.
 *
 * Written out because this package has no access to that module's stylesheet
 * object. They are literal strings in the shell's build (not content-hashed), so
 * they are stable, and reusing them is what keeps the trigger looking native.
 */
const CLS = {
  root: "_7KE1Ra_root",
  trigger: "_7KE1Ra_trigger",
  triggerIcon: "_7KE1Ra_triggerIcon",
  triggerLabel: "_7KE1Ra_triggerLabel",
  triggerEffort: "_7KE1Ra_triggerEffort",
  chevron: "_7KE1Ra_chevron",
} as const;

/**
 * Build the seat component for one plugin instance.
 * @param deps - resolved dependencies.
 * @returns a component for the `conversation.input.model` slot.
 */
export function createSeat(deps: SeatDeps): (props: SeatProps) => ReactNode {
  const primitives = resolvePrimitives(deps.load);

  function Seat(props: SeatProps): ReactNode {
    const Native = deps.native();
    // A session that cannot select models, or a host whose entry has not landed
    // yet, keeps the shell's own seat: this feature adds an entry point, and an
    // entry point that opens nothing is worse than the one that shipped.
    if (props.available === false || Native === undefined) {
      return Native === undefined ? null : <Native {...props} />;
    }
    return <Trigger props={props} primitives={primitives} openPicker={deps.openPicker} translate={deps.translate} />;
  }

  return Seat;
}

/** Props for the trigger body. */
interface TriggerProps {
  readonly props: SeatProps;
  readonly primitives: ReturnType<typeof resolvePrimitives>;
  readonly openPicker: SeatDeps["openPicker"];
  readonly translate: SeatDeps["translate"];
}

/**
 * The trigger button.
 *
 * Split from {@link createSeat} so the hook that subscribes to the directory runs
 * in its own component: the delegating branch above must not run it, and hook
 * order cannot depend on a prop.
 */
function Trigger({ props, primitives, openPicker, translate }: TriggerProps): ReactNode {
  const { directory, t, sessionId, locked } = props;
  const state = useDirectorySnapshot(directory);
  // The seat's registration declares this package's namespace, so `t` speaks
  // `better` rather than the shell's `model` strings; the trigger's own few
  // strings live there. The resolved fallback keeps a partially-initialised
  // locale from rendering a raw key as a label.
  const tr = t ?? translate();

  const current = state?.current ?? null;
  const waiting = current === null && state?.status === "loading";
  const found = findModel(state, current);

  const modelLabel = waiting ? (tr?.("trigger.loading") ?? "") : (found?.model.name ?? tr?.("trigger.fallback") ?? "");
  const effortLabel = effortCaption(state, current, found, tr);
  const triggerLabel = effortLabel === undefined ? modelLabel : `${modelLabel} · ${effortLabel}`;
  const aria = waiting
    ? (tr?.("trigger.loading") ?? "")
    : current === null
      ? (tr?.("trigger.selectAria") ?? "")
      : effortLabel === undefined
        ? (tr?.("trigger.aria", { model: modelLabel }) ?? "")
        : (tr?.("trigger.ariaEffort", { model: modelLabel, effort: effortLabel }) ?? "");

  const onClick = (): void => {
    openPicker(sessionId);
  };

  const IconData = primitives.IconDataOutlineRegular;
  const IconChevron = primitives.IconChevronDownOutlineRegular;

  return (
    <div className={CLS.root} data-dsh-better-seat="">
      <button
        type="button"
        className={CLS.trigger}
        aria-label={aria}
        aria-haspopup="dialog"
        aria-expanded="false"
        title={triggerLabel}
        disabled={locked}
        onClick={onClick}
      >
        {IconData === undefined ? null : <IconData className={CLS.triggerIcon} size={16} />}
        <span className={CLS.triggerLabel} data-provider-id={current?.provider} data-model-id={current?.model}>
          {modelLabel}
        </span>
        {effortLabel !== undefined && <span className={CLS.triggerEffort}>{effortLabel}</span>}
        {IconChevron === undefined ? null : <IconChevron className={CLS.chevron} />}
      </button>
    </div>
  );
}

/**
 * Subscribe to the directory store, tolerating its absence.
 * @param directory - the directory store, if the session has one.
 * @returns the snapshot, or undefined before it exists.
 */
function useDirectorySnapshot(directory: SeatProps["directory"]): SeatSnapshotLike | undefined {
  // A real subscription, not a bare `getSnapshot`: the selection changes while
  // this component is mounted (the picker settles it), and without subscribing
  // the trigger would keep showing the previous model and effort until something
  // else happened to re-render it.
  const subscribe = useCallback(
    (notify: () => void) => (directory === undefined ? () => undefined : directory.subscribe(notify)),
    [directory],
  );
  const getSnapshot = useCallback(() => directory?.getSnapshot(), [directory]);
  return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * The model entry the current selection names.
 * @param state - directory snapshot.
 * @param current - saved selection.
 * @returns the catalog entry, or undefined when the catalog no longer lists it.
 */
function findModel(
  state: SeatSnapshotLike | undefined,
  current: SeatSnapshotLike["current"],
): { group: SeatSnapshotLike["groups"][number]; model: SeatSnapshotLike["groups"][number]["models"][number] } | undefined {
  if (state === undefined || current === null || current === undefined) return undefined;
  for (const group of state.groups) {
    if (group.id !== current.provider) continue;
    for (const model of group.models) {
      if (model.id === current.model) return { group, model };
    }
  }
  return undefined;
}

/**
 * The effort text shown beside the model name.
 *
 * Falls back exactly the way the shell does: the retained caption when the model
 * is gone from the catalog, then the adapter's default when the selection names
 * no level, then the raw id when the catalog has no display name for it.
 * @param state - directory snapshot.
 * @param current - saved selection.
 * @param found - catalog entry for the selection, if any.
 * @param tr - translator.
 * @returns the caption, or undefined when there is nothing to say.
 */
function effortCaption(
  state: SeatSnapshotLike | undefined,
  current: SeatSnapshotLike["current"],
  found: ReturnType<typeof findModel>,
  tr: ((key: string, params?: Record<string, unknown>) => string) | undefined,
): string | undefined {
  if (state === undefined || current === null || current === undefined) return undefined;
  const reasoning = found?.model.reasoning;
  const effective = current.reasoningEffort ?? reasoning?.defaultEffort;
  if (found === undefined) return state.retainedEffort;
  if (reasoning === undefined) return undefined;
  if (effective === undefined) return undefined;
  const named = reasoning.efforts?.find((level) => level.id === effective);
  return named?.name ?? effective;
}
