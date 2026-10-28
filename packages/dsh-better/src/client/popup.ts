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
}

/** The store the controller publishes its state through. */
export interface PopupStoreLike {
  subscribe(listener: () => void): () => void;
  getSnapshot(): PopupStateLike;
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
  readonly binding: unknown;
  /**
   * Settle an already-admitted row.
   *
   * This is the only path that names a row by object rather than by index, and
   * naming by object is what lets the picker draw a row list the shell's own
   * filter never produced. Absent on a host that changed its controller shape,
   * in which case the picker declines to take over rather than picking blind.
   */
  settle?(binding: unknown, option: PopupOptionLike): Promise<void> | void;
  setSearch(search: string): void;
  dismiss(options?: { focusComposer?: boolean }): void;
}
