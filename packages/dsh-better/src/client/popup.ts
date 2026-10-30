/**
 * The popup controller face this plugin reads.
 *
 * Deliberately structural rather than imported: the controller is a class the
 * ui-commands package keeps inside its own bundle, and importing it would ship a
 * second copy of the state machine. Only the members used here are named, and
 * every one of them is optional on read, so a renamed method degrades to "this
 * feature does nothing" instead of breaking the composer's overlay.
 */
export interface PopupStateLike {
  readonly open: boolean;
  readonly command: string | null;
  readonly status: "pending" | "ready" | "failed";
  readonly options: readonly PopupOptionLike[];
  readonly search: string;
  readonly searchLabels: SearchLabelsLike | null;
  readonly searchMode: "substring" | "fuzzy-label";
  readonly active: number;
  readonly submitting: boolean;
  /** The row awaiting a risk acknowledgement, or null when no gate is up. */
  readonly confirming: unknown;
  readonly acknowledged: boolean;
  readonly error: string | null;
}

/** Per-command strings the picker shows around its search box. */
export interface SearchLabelsLike {
  readonly placeholder: string;
  readonly empty: string;
  readonly noResults: string;
}

/** One option row; the fields this plugin reads. */
export interface PopupOptionLike {
  readonly id: string;
  readonly label: string;
  readonly badge?: string | undefined;
  readonly detail?: string | undefined;
  readonly group?: { readonly name: string; readonly label: string } | undefined;
  /** Marks the session's current value, which the picker parks its highlight on. */
  readonly active?: boolean | undefined;
  /**
   * Present when picking this row must pass a risk gate first.
   *
   * The model picker never sets it; it is read so that a row which does carry
   * one is handed back to the shell instead of being settled unguarded.
   */
  readonly confirmation?: unknown;
  /**
   * Reasoning effort to submit with this row.
   *
   * Not read by the shell's own picker (its `onSelect` recomputes the value from
   * the directory), but this surface sets it so a level the user actually chose
   * is the one that travels. The shell's `selectionOf` prefers
   * `current.reasoningEffort ?? model.reasoning.defaultEffort`, and a settled row
   * is exactly the object its `onSelect` matches against.
   */
  readonly reasoningEffort?: string | undefined;
}

/** The store the controller publishes its state through. */
export interface PopupStoreLike {
  subscribe(listener: () => void): () => void;
  getSnapshot(): PopupStateLike;
  set?(state: PopupStateLike): void;
}

/** The open-time binding whose token segment is consumed after settlement. */
export interface PopupBindingLike {
  readonly segment: unknown;
}

/** The controller methods this plugin calls. */
export interface PopupControllerLike {
  readonly state: PopupStoreLike;
  /**
   * The open-time settlement token.
   *
   * Exposed because settlement is identity-guarded: `settle` refuses unless the
   * caller passes the token it currently holds, which is how a late settlement
   * loses its write rights.
   */
  readonly binding: PopupBindingLike | null;
  /** Native session wiring, including the guarded command-token consumer. */
  readonly deps?: { readonly consume?: ((segment: unknown) => unknown) | undefined } | undefined;
  /**
   * Settle an already-admitted row.
   *
   * This is the only path that names a row by object rather than by index, and
   * naming by object is what lets the picker draw a row list the shell's own
   * filter never produced. Absent on a host that changed its controller shape,
   * in which case the picker declines to take over rather than picking blind.
   *
   * The second argument is whatever the spec's `onSelect` receives; passing a
   * row carrying a chosen `reasoningEffort` is how this surface makes the effort
   * visible instead of letting the adapter pick it silently.
   */
  settle?(binding: unknown, option: PopupOptionLike): Promise<void> | void;
  setSearch(search: string): void;
  dismiss(options?: { focusComposer?: boolean }): void;
}

/** Direct submissions already in flight, one per session popup controller. */
const DIRECT_SETTLEMENTS = new WeakSet<object>();

/**
 * Settle a selection outside the controller's `onSelect`, then close natively.
 *
 * Direct directory submission preserves the chosen reasoning effort, but it
 * bypasses the controller's usual token-consumption step. Admission is
 * single-flight and publishing `submitting` locks the picker while that work is
 * pending. Reuse the native guarded consumer after business success so a typed
 * `/model` token leaves the composer exactly as it does through native settlement.
 * @param popup - controller that opened the picker.
 * @param select - direct business submission.
 */
export async function settleDirectSelection(
  popup: Pick<PopupControllerLike, "binding" | "state" | "deps" | "dismiss">,
  select: () => Promise<unknown> | undefined,
): Promise<void> {
  const binding = popup.binding;
  const snapshot = popup.state.getSnapshot();
  if (binding === null || snapshot.submitting || DIRECT_SETTLEMENTS.has(popup)) return;
  DIRECT_SETTLEMENTS.add(popup);
  popup.state.set?.({ ...snapshot, submitting: true, confirming: null, acknowledged: false, error: null });
  try {
    const attempt = select();
    // Optional host wiring answers undefined synchronously when the directory
    // entry is absent. A Promise<void>, by contrast, is a real submission whose
    // successful resolution must still consume the token.
    if (attempt === undefined) return;
    await attempt;
    if (binding !== null && popup.binding === binding) popup.deps?.consume?.(binding.segment);
  } finally {
    DIRECT_SETTLEMENTS.delete(popup);
    // A superseded binding owns neither the old token nor the replacement popup.
    if (binding !== null && popup.binding === binding) popup.dismiss({ focusComposer: true });
  }
}
