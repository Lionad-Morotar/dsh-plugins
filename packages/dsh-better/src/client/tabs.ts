/**
 * Which conversation-view tabs stay in the header strip.
 *
 * The host builds that strip by reading `conversation.view` and dropping the ids
 * in an in-memory unpinned list. That list is the only hide the host has, and it
 * is not a setting: it resets on reload, and the menu that writes it never opens
 * on this host. So a durable checkbox has to own the same decision and feed it to
 * the strip, while leaving every registration where its owner put it.
 *
 * Withdrawing the registration was the obvious alternative and the wrong one.
 * The content area renders whichever view id the session last selected, whether
 * or not that id still has a tab; removing the entry blanks the open view and
 * takes the plugin's data source with it. A hidden tab is a hidden label. The
 * view underneath it, when it is the one open, stays.
 *
 * `chat` is never a row. The host hard-codes it as the view that always shows,
 * always leads the strip, and is the fallback a session returns to. A checkbox
 * for it would be a control that cannot do what it says.
 */

/** The slot every conversation view tab registers into. */
export const VIEW_SLOT = "conversation.view";

/** The settings nav slot this package contributes its page to. */
export const TABS_SECTION_SLOT = "settings.section";

/** The section id; a fresh id adds a nav entry rather than replacing one. */
export const TABS_SECTION_ID = "tabs";

/**
 * Position in the settings nav.
 *
 * The host's own pages occupy -10 through 20 and the workbench page sits at 60,
 * so 55 places this directly before it: both are about the conversation chrome.
 */
export const TABS_SECTION_ORDER = 55;

/** The view the host never lets leave the strip. */
export const FIXED_VIEW_ID = "chat";

/**
 * Persistence document.
 *
 * Namespaced by product rather than shared with the host's conversation store:
 * that document is per session and holds the draft, and a tab choice is neither.
 */
export const TABS_STORAGE_KEY = "dsh-better.tabs";

/** One registered view, narrowed to what a row needs. */
export interface ViewEntry {
  readonly options: {
    readonly id?: string;
    readonly label?: unknown;
  };
}

/** One row the settings page renders. */
export interface TabRow {
  /** The view id, also the persistence key. */
  readonly id: string;
  /** The label the tab strip shows, resolved the same way the host resolves it. */
  readonly label: string;
  /** Whether the view currently occupies the strip. */
  readonly enabled: boolean;
}

/** The ledger face the decision reads. It never writes it. */
export interface ViewLedger {
  /** Shadowing winners, one entry per visible cell. */
  entriesOfSlot(key: string): readonly ViewEntry[];
  subscribe(key: string, listener: () => void): () => void;
}

/**
 * The host header's pin seam, the one channel that removes a tab.
 *
 * `setPinned(id, false)` is what the host's own menu calls to take a tab out of
 * the strip, and it leaves the registration, the content, and the selection
 * untouched. `chat` is refused by the host, which is why this decision never
 * sends it.
 */
export interface ViewPins {
  /** Unpinned ids. Stable between changes, so it can back a subscription. */
  readonly unpinned: {
    getSnapshot(): readonly string[];
    subscribe(listener: () => void): () => void;
  };
  setPinned(id: string, pinned: boolean): void;
}

/** The slice of `localStorage` the preference uses; absent storage is memory only. */
export interface TabStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * The host's label resolution, copied in shape.
 *
 * A label is either a string or a zero-argument function the owner re-reads on
 * locale change. Anything else is not a label, and the id stands in for it.
 */
export function resolveViewLabel(label: unknown, id: string): string {
  if (typeof label === "string" && label !== "") return label;
  if (typeof label === "function") {
    try {
      const resolved = (label as () => unknown)();
      if (typeof resolved === "string" && resolved !== "") return resolved;
    } catch {
      // A throwing label thunk is the owner's bug. The row still has to name
      // the view, and the id is the only name that cannot throw.
    }
  }
  return id;
}

/**
 * Read the hidden set.
 *
 * Anything that is not a list of strings is treated as "nothing hidden": a
 * corrupt document must not hide every tab on the next launch, and an absent
 * one must not either. `chat` is dropped on read so a hand-edited document
 * cannot ask for the one hide the host refuses.
 */
export function readHidden(storage: TabStorage | undefined): ReadonlySet<string> {
  if (storage === undefined) return new Set();
  let raw: string | null;
  try {
    raw = storage.getItem(TABS_STORAGE_KEY);
  } catch {
    return new Set();
  }
  if (raw === null || raw === "") return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const hidden = new Set<string>();
    for (const item of parsed) {
      if (typeof item === "string" && item !== "" && item !== FIXED_VIEW_ID) hidden.add(item);
    }
    return hidden;
  } catch {
    return new Set();
  }
}

/** Persist the hidden set. A storage that throws keeps the in-memory choice. */
export function writeHidden(storage: TabStorage | undefined, hidden: ReadonlySet<string>): void {
  if (storage === undefined) return;
  try {
    storage.setItem(TABS_STORAGE_KEY, JSON.stringify([...hidden].sort()));
  } catch {
    // Quota and privacy modes refuse the write. The choice still holds until
    // reload, which is the failure a settings page can survive.
  }
}

/**
 * The rows a settings page should show, in the strip's own order.
 *
 * One row per winning cell. A shadowed cell has one tab, and listing every
 * priority would offer a checkbox for a view the strip does not show. `chat` is
 * dropped rather than rendered disabled, because a disabled row still implies
 * the choice exists.
 */
export function tabRows(entries: readonly ViewEntry[], hidden: ReadonlySet<string>): readonly TabRow[] {
  const rows: TabRow[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const id = entry.options.id;
    if (id === undefined || id === FIXED_VIEW_ID || seen.has(id)) continue;
    seen.add(id);
    rows.push({ id, label: resolveViewLabel(entry.options.label, id), enabled: !hidden.has(id) });
  }
  return rows;
}

/**
 * Push the preference onto the host's pin list.
 *
 * Only ids the ledger currently advertises are touched, and only when the pin
 * list disagrees. A hidden id whose plugin has not registered yet is left for
 * the next ledger change; pinning an id the host has never heard of would
 * accumulate in its list forever, since the host never prunes it.
 *
 * @returns whether the pin list was asked to change.
 */
export function applyHidden(
  entries: readonly ViewEntry[],
  hidden: ReadonlySet<string>,
  pins: ViewPins,
): boolean {
  const unpinned = new Set(pins.unpinned.getSnapshot());
  let changed = false;
  const seen = new Set<string>();
  for (const entry of entries) {
    const id = entry.options.id;
    if (id === undefined || id === FIXED_VIEW_ID || seen.has(id)) continue;
    seen.add(id);
    const shouldHide = hidden.has(id);
    if (shouldHide === unpinned.has(id)) continue;
    pins.setPinned(id, !shouldHide);
    changed = true;
  }
  return changed;
}

/**
 * The controller the settings page reads.
 *
 * It is the one place that knows both the ledger and the preference, so the page
 * renders whatever it returns and never merges the two itself.
 */
export interface TabController {
  /** Rows in strip order. A fresh array whenever the ledger or the choice changed. */
  rows(): readonly TabRow[];
  /**
   * Show or hide one view's tab.
   *
   * Hiding the tab of the view that is open leaves that view open: the host
   * keeps rendering a selected id that has no tab, and putting the tab back
   * does not navigate anywhere.
   * @returns whether the choice changed.
   */
  setEnabled(id: string, enabled: boolean): boolean;
  subscribe(listener: () => void): () => void;
  /** Apply the stored choice once the pin seam exists, then follow the ledger. */
  start(pins: ViewPins): () => void;
}

/**
 * Build the controller.
 *
 * The pin seam is not a constructor argument because it lives inside the header
 * slot, which is declared later than this plugin loads. `start` is what the
 * slot's own inject callback calls, once per header generation.
 */
export function createTabController(deps: {
  ledger: ViewLedger;
  storage?: TabStorage;
}): TabController {
  const { ledger, storage } = deps;
  const hidden = new Set(readHidden(storage));
  const listeners = new Set<() => void>();
  let pins: ViewPins | undefined;
  let applying = false;

  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };

  const reconcile = (): void => {
    if (pins === undefined || applying) return;
    applying = true;
    try {
      // The host's pin setter notifies synchronously, and this controller also
      // listens to that list. One pass never quite lands when several ids
      // disagree at once: each correction re-enters, the guard skips it, and
      // the id is only corrected on the next notification. Looping until the
      // list agrees finishes the job inside the notification that started it.
      for (let pass = 0; pass < 8 && applyHidden(ledger.entriesOfSlot(VIEW_SLOT), hidden, pins); pass += 1) {
        // The work happens in the condition. Eight is a ceiling, not a budget:
        // a correct setter converges in two passes.
      }
    } finally {
      applying = false;
    }
  };

  return {
    rows: () => tabRows(ledger.entriesOfSlot(VIEW_SLOT), hidden),
    setEnabled(id, enabled) {
      if (id === FIXED_VIEW_ID) return false;
      const wasHidden = hidden.has(id);
      if (enabled === !wasHidden) return false;
      if (enabled) hidden.delete(id);
      else hidden.add(id);
      writeHidden(storage, hidden);
      reconcile();
      notify();
      return true;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    start(next) {
      pins = next;
      reconcile();
      // The ledger and the pin list are both inputs. A plugin that registers
      // after the page opened has to be hidden without a reload, and a pin the
      // host changes on its own has to be put back, because this preference is
      // the one that persists.
      const unsubscribeLedger = ledger.subscribe(VIEW_SLOT, reconcile);
      const unsubscribePins = next.unpinned.subscribe(reconcile);
      return () => {
        unsubscribeLedger();
        unsubscribePins();
        if (pins === next) pins = undefined;
      };
    },
  };
}
