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
 *     draws the caption itself: the provider's display name in front of the
 *     model name, which is what the slot's contributor used to add. The shell's
 *     own behaviour without a contributor is the bare model name, which cannot
 *     tell two providers with the same catalog apart;
 *   - the trigger keeps the shell's class names and markup shape, so the shell's
 *     stylesheet still applies and the button stays indistinguishable from the
 *     native one apart from its text.
 */
import { useCallback, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { resolvePrimitives } from "./primitives.ts";
import { triggerCaption } from "./caption.ts";

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
  /** Document holding the shell's seat stylesheet, read for its class names. */
  readonly document: Document | undefined;
}

/**
 * The class names the shell's seat uses.
 *
 * Read from the injected stylesheet, never written down: the prefix is a
 * per-build content hash and differs between hosts that ship the same version.
 * Verified on this machine, the CLI build uses `_7KE1Ra_` while the desktop
 * application's bundle uses `htuFrW_` for the very same stylesheet, so a
 * hard-coded set would render an unstyled button on one of them while looking
 * correct on the other. Same reason and same technique as {@link readPopupClasses}.
 */
export interface SeatClasses {
  readonly root: string;
  readonly trigger: string;
  readonly triggerIcon: string;
  readonly triggerLabel: string;
  readonly triggerEffort: string;
  readonly chevron: string;
}

/** Stable id the shell installs the seat stylesheet under. */
const SEAT_STYLESHEET_ID = "@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";

/**
 * Read the seat's class map out of the shell's injected stylesheet.
 * @param doc - document holding the stylesheet.
 * @returns the class map, or undefined while the stylesheet is missing.
 */
export function readSeatClasses(doc: Document | undefined): SeatClasses | undefined {
  if (doc === undefined) return undefined;
  const tag = doc.querySelector(`style[data-plugin-css="${SEAT_STYLESHEET_ID}"]`);
  const css = tag?.textContent ?? "";
  // The suffix is stable; only the six-character prefix varies per build, so it
  // is captured rather than assumed.
  const find = (part: string): string | undefined => new RegExp(`\\.(\\w+_${part})\\{`, "u").exec(css)?.[1];
  const classes = {
    root: find("root"),
    trigger: find("trigger"),
    triggerIcon: find("triggerIcon"),
    triggerLabel: find("triggerLabel"),
    triggerEffort: find("triggerEffort"),
    chevron: find("chevron"),
  };
  for (const value of Object.values(classes)) if (value === undefined) return undefined;
  return classes as SeatClasses;
}

/**
 * Build the seat component for one plugin instance.
 * @param deps - resolved dependencies.
 * @returns a component for the `conversation.input.model` slot.
 */
export function createSeat(deps: SeatDeps): (props: SeatProps) => ReactNode {
  const primitives = resolvePrimitives(deps.load);

  // Read once per mount rather than per render: the stylesheet is installed by
  // the shell at load and does not change identity afterwards.
  const classes = readSeatClasses(deps.document);

  function Seat(props: SeatProps): ReactNode {
    const Native = deps.native();
    // Three cases keep the shell's own seat, and each would otherwise ship a
    // trigger that is worse than the one that came with the app: a session that
    // cannot select models, a host whose entry has not landed yet, and a shell
    // whose stylesheet this package failed to recognise (the trigger would be an
    // unstyled button). This feature adds an entry point; it must not remove one.
    if (props.available === false || Native === undefined || classes === undefined) {
      return Native === undefined ? null : <Native {...props} />;
    }
    return (
      <Trigger
        props={props}
        primitives={primitives}
        openPicker={deps.openPicker}
        translate={deps.translate}
        classes={classes}
      />
    );
  }

  return Seat;
}

/** Props for the trigger body. */
interface TriggerProps {
  readonly props: SeatProps;
  readonly primitives: ReturnType<typeof resolvePrimitives>;
  readonly openPicker: SeatDeps["openPicker"];
  readonly translate: SeatDeps["translate"];
  readonly classes: SeatClasses;
}

/**
 * The trigger button.
 *
 * Split from {@link createSeat} so the hook that subscribes to the directory runs
 * in its own component: the delegating branch above must not run it, and hook
 * order cannot depend on a prop.
 */
function Trigger({ props, primitives, openPicker, translate, classes }: TriggerProps): ReactNode {
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

  const modelLabel = waiting ? (tr?.("trigger.loading") ?? "") : triggerCaption(found, tr?.("trigger.fallback") ?? "");
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
    <div className={classes.root} data-dsh-better-seat="">
      <button
        type="button"
        className={classes.trigger}
        aria-label={aria}
        aria-haspopup="dialog"
        aria-expanded="false"
        title={triggerLabel}
        disabled={locked}
        onClick={onClick}
      >
        {IconData === undefined ? null : <IconData className={classes.triggerIcon} size={16} />}
        <span className={classes.triggerLabel} data-provider-id={current?.provider} data-model-id={current?.model}>
          {modelLabel}
        </span>
        {effortLabel !== undefined && <span className={classes.triggerEffort}>{effortLabel}</span>}
        {IconChevron === undefined ? null : <IconChevron className={classes.chevron} />}
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
