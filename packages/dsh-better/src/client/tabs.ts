/**
 * Which conversation-view tabs stay in the header strip.
 *
 * The host builds that strip from `conversation.view` and hides ids on an
 * in-memory unpinned list. That list has no settings and no menu on this host:
 * the menu that would write it only exists while a plugin registers a row into
 * `conversation.session.header.views.actions`, and the pin state itself is a
 * closure inside the conversation bundle, reachable only through the inject
 * props of the `conversation.session.header` slot. That slot is a host-owned
 * `single` whose catalog entry declares `registerOptions: []`, and a second
 * registration at the occupant's priority throws — the first cut of this
 * feature crashed the boot exactly that way, so the strip is no longer driven
 * through the host's pins at all.
 *
 * Instead the decision lands as a stylesheet on the strip's own DOM seam: the
 * host renders one `button[role=tab]` per visible view inside
 * `[data-conversation-tabs]`, in the ledger's order, with Chat always first.
 * Hiding a tab is therefore a `display: none` on one button — the label leaves
 * the strip while the registration, the view underneath it and the selection
 * all stay. A stylesheet also survives the host re-rendering buttons, and it
 * re-asserts itself on every load, which is what makes the choice durable.
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
 *
 * Positions are verified against the DOM before a rule is emitted, because the
 * host may render fewer buttons than the ledger advertises (it drops the
 * trajectory tab unless developer tools are on) and a miscounted position would
 * hide a neighbour. When the positional walk disagrees, planning falls back to
 * matching each hidden id's resolved label against the button texts, and hides
 * only an unambiguous single match — a relabelled strip hides nothing rather
 * than the wrong thing.
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

/** The DOM seam the host renders the strip on; buttons are its direct children. */
export const STRIP_CONTAINER_SELECTOR = "[data-conversation-tabs]";

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

/** One strip occupant the rule planner addresses: a view id with its shown label. */
export interface StripRow {
  readonly id: string;
  readonly label: string;
}

/** The ledger face the decision reads. It never writes it. */
export interface ViewLedger {
  /** Shadowing winners, one entry per visible cell. */
  entriesOfSlot(key: string): readonly ViewEntry[];
  subscribe(key: string, listener: () => void): () => void;
}

/** Page storage. Absent under a runtime without `localStorage`, which the controller treats as memory only. */
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
 * The strip the host renders, in the order the buttons appear.
 *
 * Chat leads and is not in the ledger, so it is not a row here either: the
 * planner addresses ledger rows by their position after Chat. The order is the
 * host's own projection — priority ascending, one row per winning cell — which
 * is the order the ledger's `entriesOfSlot` already returns.
 */
export function stripRows(entries: readonly ViewEntry[]): readonly StripRow[] {
  const rows: StripRow[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const id = entry.options.id;
    if (id === undefined || id === FIXED_VIEW_ID || seen.has(id)) continue;
    seen.add(id);
    rows.push({ id, label: resolveViewLabel(entry.options.label, id) });
  }
  return rows;
}

/** One tab button, narrowed to the label it shows and the marker it carries. */
export interface StripButton {
  /** The visible label, already trimmed. */
  readonly label: string;
  /** Whether this button is currently marked hidden. */
  readonly hidden: boolean;
}

/**
 * Which buttons should carry the hidden marker, given the strip right now.
 *
 * The decision is by label, never by position. Position is what the previous
 * version used, and it cannot be trusted: the host's renderer places text and
 * comment nodes between the buttons, so the third button is not the third
 * child and a positional selector matches nothing. A label that more than one
 * button shows is left alone, because there is no way to tell which view it
 * belongs to; a label the strip does not show is a no-op rather than a guess.
 *
 * @returns one boolean per button, true when that button should be hidden.
 */
export function planHiddenButtons(
  entries: readonly ViewEntry[],
  hidden: ReadonlySet<string>,
  buttons: readonly StripButton[],
): readonly boolean[] {
  const wanted = new Set<string>();
  for (const row of stripRows(entries)) {
    if (!hidden.has(row.id) || row.label === "") continue;
    const shown = buttons.filter(button => button.label === row.label).length;
    // One button, one view. Two buttons with the same label cannot be told
    // apart, and hiding both would remove a view the reader did not name.
    if (shown === 1) wanted.add(row.label);
  }
  return buttons.map(button => wanted.has(button.label));
}

/**
 * The controller the settings page reads.
 *
 * It is the one place that knows both the ledger and the preference, so the
 * page renders whatever it returns and never merges the two itself.
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
  /**
   * Own the strip stylesheet for one document.
   *
   * Installs the sheet, applies the stored choice, and re-plans whenever the
   * ledger moves — a plugin that registers a view after the page opened shifts
   * every later button, so the rules have to follow. While the host has not
   * rendered the strip yet (this package applies before React mounts the
   * header), planning retries on the next frames rather than guessing.
   */
  attach(doc: StripHostDocument): () => void;
}

/** A tab button as the reader sees it: its label and its marker. */
export interface ReadableStripButton extends StripButton {
  /** Set or clear the hidden marker. The host re-renders the button without it. */
  mark(hidden: boolean): void;
}

/** The slice of `Document` the strip reader needs, so tests can stand in. */
export interface StripDocument {
  querySelector(selector: string): unknown;
}

/** The sheet node `attach` writes through. Structural so tests can stand in. */
export interface StripStyleTag {
  dataset: { plugin?: string; pluginCss?: string };
  textContent: string;
  remove(): void;
}

/** The document face `attach` needs: create a sheet, mount it, schedule retries. */
export interface StripHostDocument extends StripDocument {
  createElement(tag: string): StripStyleTag;
  head: { append(node: StripStyleTag): void };
  readonly defaultView?: {
    requestAnimationFrame?(callback: () => void): number;
    cancelAnimationFrame?(handle: number): void;
  } | undefined;
}

/**
 * Read the strip's buttons from a document.
 *
 * `undefined`, not empty, when the container is absent: the header has not
 * rendered yet, which is a timing fact the caller reacts to, different from a
 * strip that genuinely shows no view tab.
 */
export function readStripButtons(doc: StripDocument): readonly ReadableStripButton[] | undefined {
  const container = doc.querySelector(STRIP_CONTAINER_SELECTOR);
  if (container === null || typeof container !== "object") return undefined;
  const owner = container as {
    querySelectorAll?(selector: string): {
      length: number;
      [index: number]: StripButtonElement | undefined;
    };
  };
  const buttons = owner.querySelectorAll?.(":scope > button[role='tab']");
  if (buttons === undefined) return undefined;
  const read: ReadableStripButton[] = [];
  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index];
    if (button === undefined) continue;
    read.push({
      label: buttonLabel(button),
      hidden: button.hasAttribute(HIDDEN_TAB_ATTR),
      mark: hidden => {
        if (hidden) button.setAttribute(HIDDEN_TAB_ATTR, "");
        else button.removeAttribute(HIDDEN_TAB_ATTR);
      },
    });
  }
  return read;
}

/** The button surface the reader touches. */
interface StripButtonElement {
  textContent?: string | null;
  querySelector?(selector: string): { textContent?: string | null } | null;
  hasAttribute(name: string): boolean;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

/**
 * The label a tab button shows.
 *
 * The host wraps the label in a tooltip, so the button's own text is the label
 * plus whatever the tooltip rendered into it. The visible label is the
 * `.tabLabel` span; the button's own text is the fallback for a host that
 * renders the label bare.
 */
function buttonLabel(button: {
  textContent?: string | null;
  querySelector?(selector: string): { textContent?: string | null } | null;
}): string {
  const label = button.querySelector?.("[class*='tabLabel']");
  const text = label?.textContent ?? button.textContent ?? "";
  return text.trim();
}

/**
 * Move the strip to the planned marking.
 *
 * Writes only the buttons whose marker disagrees with the plan, so a repaint
 * that changes nothing does not touch the DOM. Returns whether anything moved.
 */
export function applyHiddenButtons(buttons: readonly ReadableStripButton[], planned: readonly boolean[]): boolean {
  let changed = false;
  for (const [index, button] of buttons.entries()) {
    const hide = planned[index] ?? false;
    if (hide === button.hidden) continue;
    button.mark(hide);
    changed = true;
  }
  return changed;
}

/**
 * Build the controller.
 *
 * The stylesheet is not a constructor argument because it belongs to a
 * document, and documents arrive with `attach`.
 */
export function createTabController(deps: {
  ledger: ViewLedger;
  storage?: TabStorage;
  /** The strip reader; defaults to the DOM walk and stands in for tests. */
  readButtons?: (doc: StripDocument) => readonly ReadableStripButton[] | undefined;
}): TabController {
  const { ledger, storage } = deps;
  const readButtons = deps.readButtons ?? readStripButtons;
  const hidden = new Set(readHidden(storage));
  const listeners = new Set<() => void>();
  /** The attached document's planner, so a checkbox flip re-emits rules at once. */
  let replan: (() => void) | undefined;

  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };

  /** The frames left before planning gives up waiting for the strip to render. */
  const RENDER_ATTEMPTS = 30;

  return {
    rows: () => tabRows(ledger.entriesOfSlot(VIEW_SLOT), hidden),
    setEnabled(id, enabled) {
      if (id === FIXED_VIEW_ID) return false;
      const wasHidden = hidden.has(id);
      if (enabled === !wasHidden) return false;
      if (enabled) hidden.delete(id);
      else hidden.add(id);
      writeHidden(storage, hidden);
      replan?.();
      notify();
      return true;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    attach(doc: StripHostDocument) {
      const tag = doc.createElement("style");
      tag.dataset.plugin = "dsh-better";
      tag.dataset.pluginCss = STRIP_STYLE_TAG;
      // One rule for the life of the sheet. Which button it matches changes
      // with the marker, and the marker is rewritten below.
      tag.textContent = HIDDEN_TAB_RULE;
      doc.head.append(tag);
      const schedule = doc.defaultView?.requestAnimationFrame?.bind(doc.defaultView);
      const cancel = doc.defaultView?.cancelAnimationFrame?.bind(doc.defaultView);
      let attempts = schedule === undefined ? 0 : RENDER_ATTEMPTS;
      let frame: number | undefined;

      const refresh = (): void => {
        const entries = ledger.entriesOfSlot(VIEW_SLOT);
        const buttons = readButtons(doc);
        if (buttons === undefined || buttons.length === 0) {
          // The header may not have rendered yet. A strip that will never
          // render (this document is closing) simply exhausts the retries.
          if (attempts > 0 && schedule !== undefined) {
            attempts -= 1;
            frame = schedule(() => refresh());
          }
          return;
        }
        frame = undefined;
        applyHiddenButtons(buttons, planHiddenButtons(entries, hidden, buttons));
      };

      const unsubscribe = ledger.subscribe(VIEW_SLOT, refresh);
      replan = refresh;
      refresh();
      return () => {
        unsubscribe();
        replan = undefined;
        if (frame !== undefined) cancel?.(frame);
        tag.remove();
      };
    },
  };
}

/**
 * The stylesheet tag the strip rules live under, so a reload does not insert a
 * second copy and a teardown can find its own sheet.
 */
export const STRIP_STYLE_TAG = "dsh-better/strip.css";

/**
 * The marker a hidden tab button carries.
 *
 * A selector by position cannot name these buttons. The strip's children are
 * not only buttons: the host inserts text and comment nodes between them, and
 * `nth-child` counts every child, so a rule written for "the third button"
 * matches nothing. Marking the button itself is what survives that.
 */
export const HIDDEN_TAB_ATTR = "data-dsh-better-tab-hidden";

/** The one rule the sheet holds: a marked button is not in the strip. */
export const HIDDEN_TAB_RULE = `${STRIP_CONTAINER_SELECTOR} > button[${HIDDEN_TAB_ATTR}] { display: none; }`;
