/**
 * The Tab management page.
 *
 * One row per conversation view the host is currently showing a tab for, plus
 * the fixed slot the host never lets leave the strip: Chat, rendered first as
 * the numbered slot 1 without any control. A checkbox would be a control that
 * cannot do what it says, and Chat is not draggable for the same reason — the
 * host hard-codes it to lead, so every drag has to respect the slot it holds.
 *
 * The movable rows carry their strip number and are draggable. A drag reorders
 * the page's own rows live (the way a native sortable does, by moving the node
 * while the pointer crosses a row's midline), and the drop commits the row
 * order to the controller in one write; a drag that ends without a drop
 * repaints the page back to the stored order. The number is the place in the
 * strip, so a hidden row shows none — it is not in the strip to have a place
 * in.
 *
 * The host mounts one element and never re-renders it, so the page builds its
 * rows as DOM inside that element and replaces them whenever the ledger or the
 * choice changes. No React hook is involved at any point.
 */
import { FIXED_VIEW_ID, stripPositions, type TabController, type TabRow } from "./tabs.ts";

/**
 * The slice of React the page uses.
 *
 * Only `createElement`, and only to hand the host the one element it mounts.
 * Everything inside that element is DOM. The host calls a section component as
 * a plain function with no hook dispatcher, so a hook here throws on first
 * paint and the panel stays blank while the nav entry, which only reads the
 * registration, looks perfectly fine.
 */
export interface PageReact {
  createElement: (type: unknown, props: Record<string, unknown> | null) => unknown;
}

/** The strings the page renders, resolved by the caller per locale. */
export interface TabCopy {
  /** Page heading. */
  readonly heading: string;
  /** The fixed first slot's label, which the host renders on the chat tab. */
  readonly chatLabel: string;
  /** Shown in place of the list while no plugin has registered a view tab. */
  readonly empty: string;
  /** Accessible name of one row's checkbox, given the tab label. */
  checkboxLabel(tabLabel: string, enabled: boolean): string;
}

export interface TabPageProps {
  React: PageReact;
  controller: TabController;
  copy: TabCopy;
}

/** The row attribute, carrying the view id; the fixed slot carries Chat's. */
const ROW_ATTR = "data-dsh-better-tabs-row";

/** The attribute that marks the fixed first slot. */
const FIXED_ATTR = "data-dsh-better-tabs-fixed";

/** The attribute a row carries while it is being dragged. */
const DRAGGING_ATTR = "data-dsh-better-tabs-dragging";

/** The page stylesheet, scoped to this plugin's section root. */
export const TABS_PAGE_CSS = `
[data-dsh-better-tabs] {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--dsw-alias-label-primary);
}
[data-dsh-better-tabs] [data-dsh-better-tabs-heading] {
  margin: 0;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row] {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 52px;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
  font-size: 14px;
  line-height: 22px;
  cursor: grab;
  user-select: none;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row]:last-of-type {
  border-bottom: none;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row="${FIXED_VIEW_ID}"] {
  cursor: default;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row][data-dsh-better-tabs-dragging] {
  opacity: 0.5;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-lead] {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-pos] {
  flex-shrink: 0;
  box-sizing: border-box;
  min-width: 22px;
  padding: 0 5px;
  border: 0.5px solid var(--dsw-alias-border-l2);
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-name] {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-check] {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
  cursor: pointer;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-empty] {
  margin: 0;
  padding-top: 4px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
`;

/** Tag id for the page stylesheet, so a reload does not insert a second copy. */
const STYLE_TAG = "dsh-better/tabs.css";

/** Insert the page stylesheet once; returns the symmetric teardown. */
export function insertTabPageStyles(doc: Document): () => void {
  const selector = `style[data-plugin-css=${JSON.stringify(STYLE_TAG)}]`;
  if (doc.querySelector(selector) !== null) return () => undefined;
  const tag = doc.createElement("style");
  tag.dataset.plugin = "dsh-better";
  tag.dataset.pluginCss = STYLE_TAG;
  tag.textContent = TABS_PAGE_CSS;
  doc.head.append(tag);
  return () => tag.remove();
}

/**
 * The page component the settings slot renders.
 *
 * Returns the one element the host mounts. The ref is where the rows come from:
 * it is the only callback the host runs for an element, it fires with the node
 * once that node is in the document, and it fires with null when the panel
 * replaces the page. Between those two the page owns the node's contents.
 */
export function TabSettingsPage(props: TabPageProps): unknown {
  let unsubscribe: (() => void) | undefined;
  return props.React.createElement("section", {
    "data-dsh-better-tabs": "",
    ref: (node: Element | null) => {
      unsubscribe?.();
      unsubscribe = undefined;
      if (node === null) return;
      const paint = (): void => {
        paintRows(node, props);
      };
      paint();
      unsubscribe = props.controller.subscribe(paint);
    },
  });
}

/**
 * Write the current rows into the mounted section.
 *
 * Rebuilt from scratch on every change rather than reconciled. The list is a
 * handful of rows, and rebuilding is what keeps a row that disappeared from
 * staying on screen. The checkbox is the one piece of state, and it is set from
 * the controller before the node is attached, so the browser never gets to
 * disagree with it. During a drag the rebuild stays out of the way: the drag
 * moves nodes itself, and only the drop (or a drag that ends elsewhere) writes
 * the controller and repaints.
 *
 * Exported so a test can paint into a document and read the result back. The
 * host never calls it; the ref does.
 */
export function paintRows(section: Element, props: TabPageProps): void {
  const doc = section.ownerDocument;
  const { controller, copy } = props;
  section.replaceChildren();

  const heading = doc.createElement("h2");
  heading.setAttribute("data-dsh-better-tabs-heading", "");
  heading.textContent = copy.heading;
  section.append(heading);

  section.append(fixedRow(doc, copy.chatLabel));

  const rows = controller.rows();
  const positions = stripPositions(rows);
  /**
   * The id of the row a drag is carrying, and whether the drag has moved any
   * node yet. The drag ends on `dragend` no matter where the pointer lets go,
   * so that is the one place the page commits; `drop` cannot be relied on,
   * because the browser only delivers it to a row whose `dragover` was
   * prevented — and the row the pointer is over when it lets go is frequently
   * the dragged row itself, which follows the pointer and is skipped.
   */
  let dragging: string | null = null;
  let moved = false;

  for (const row of rows) {
    section.append(movableRow(doc, props, row, positions.get(row.id), {
      dragStart: () => {
        dragging = row.id;
        moved = false;
      },
      dragOver: event => {
        if (dragging === null) return;
        // The pointer must always sit somewhere drop is allowed, or the
        // browser ends the drag as a failed one and the reorder is lost. The
        // dragged row itself only allows the drop; it does not move.
        event.preventDefault();
        if (dragging === row.id) return;
        if (moveRow(section, dragging, row.id, dropBefore(event, rowById(section, row.id)))) moved = true;
      },
      drop: event => {
        event.preventDefault();
      },
      dragEnd: () => {
        dragging = null;
        if (moved) controller.setOrder(readRowOrder(section));
        paintRows(section, props);
      },
    }));
  }

  if (rows.length === 0) {
    const empty = doc.createElement("p");
    empty.setAttribute("data-dsh-better-tabs-empty", "");
    empty.textContent = copy.empty;
    section.append(empty);
  }
}

/** The drag surface one movable row wires, as plain closures over the section. */
interface RowDrag {
  dragStart(): void;
  dragOver(event: DragEvent): void;
  drop(event: DragEvent): void;
  dragEnd(): void;
}

/** The fixed first slot: numbered, named, and carrying no control. */
function fixedRow(doc: Document, chatLabel: string): HTMLElement {
  const row = doc.createElement("div");
  row.setAttribute(ROW_ATTR, FIXED_VIEW_ID);
  row.setAttribute(FIXED_ATTR, "");
  row.append(lead(doc, 1, chatLabel));
  return row;
}

/** One movable row: the number chip when shown, the name, and the checkbox. */
function movableRow(
  doc: Document,
  props: TabPageProps,
  row: TabRow,
  position: number | undefined,
  drag: RowDrag,
): HTMLElement {
  const label = doc.createElement("label");
  label.setAttribute(ROW_ATTR, row.id);
  label.setAttribute("draggable", "true");
  label.append(lead(doc, position, row.label));

  const box = doc.createElement("input");
  box.setAttribute("data-dsh-better-tabs-check", row.id);
  box.type = "checkbox";
  box.checked = row.enabled;
  box.setAttribute("aria-label", props.copy.checkboxLabel(row.label, row.enabled));
  box.addEventListener("change", () => {
    props.controller.setEnabled(row.id, box.checked);
  });
  label.append(box);

  label.addEventListener("dragstart", event => {
    event.dataTransfer?.setData("text/plain", row.id);
    label.setAttribute(DRAGGING_ATTR, "");
    drag.dragStart();
  });
  label.addEventListener("dragover", event => drag.dragOver(event));
  label.addEventListener("drop", event => drag.drop(event));
  label.addEventListener("dragend", () => drag.dragEnd());
  return label;
}

/**
 * The lead cluster: the strip number when the row has one, then the name.
 *
 * A hidden row takes no number. It is not in the strip, and printing the place
 * it would take would promise a position the reader cannot see.
 */
function lead(doc: Document, position: number | undefined, labelText: string): HTMLElement {
  const cluster = doc.createElement("span");
  cluster.setAttribute("data-dsh-better-tabs-lead", "");
  if (position !== undefined) {
    const chip = doc.createElement("span");
    chip.setAttribute("data-dsh-better-tabs-pos", "");
    chip.textContent = String(position);
    cluster.append(chip);
  }
  const name = doc.createElement("span");
  name.setAttribute("data-dsh-better-tabs-name", "");
  name.textContent = labelText;
  cluster.append(name);
  return cluster;
}

/** The row element a drag names, found by attribute rather than by index. */
function rowById(section: Element, id: string): Element | null {
  for (const row of section.querySelectorAll(`[${ROW_ATTR}]`)) {
    if (row.getAttribute(ROW_ATTR) === id) return row;
  }
  return null;
}

/**
 * Move the dragged row across the row it now hovers, live.
 *
 * The DOM is the only thing that moves here: the controller is written once,
 * when the drag ends, so a repaint cannot land in the middle of a drag and
 * detach the node the browser is carrying. A row the section no longer has —
 * the roster changed under the drag — is a move that does not happen.
 * @returns whether the list actually changed shape.
 */
function moveRow(section: Element, dragId: string, overId: string, before: boolean): boolean {
  const dragged = rowById(section, dragId);
  const target = rowById(section, overId);
  if (dragged === null || target === null) return false;
  const parent = dragged.parentElement;
  if (parent === null) return false;
  const reference = before ? target : target.nextSibling;
  if (reference === dragged) return false;
  parent.insertBefore(dragged, reference);
  return true;
}

/**
 * Which side of the hovered row the pointer is on.
 *
 * The midline is the whole decision: above it the drag lands before the row,
 * below it after. An event without coordinates — which is what a hostile
 * dispatch would be — reads as "before", the choice that cannot overshoot the
 * list.
 */
function dropBefore(event: DragEvent, row: Element | null): boolean {
  if (row === null || typeof event.clientY !== "number") return true;
  const rect = row.getBoundingClientRect();
  if (rect === undefined || rect === null) return true;
  return event.clientY < rect.top + rect.height / 2;
}

/**
 * The movable rows' ids in the order the page shows them.
 *
 * The fixed slot carries the same row attribute but is not draggable, so it
 * never enters the sequence a drop commits — Chat is the host's to place.
 */
export function readRowOrder(section: Element): readonly string[] {
  const ids: string[] = [];
  for (const row of section.querySelectorAll(`[${ROW_ATTR}]`)) {
    if (row.getAttribute("draggable") !== "true") continue;
    const id = row.getAttribute(ROW_ATTR);
    if (id !== null && id !== FIXED_VIEW_ID) ids.push(id);
  }
  return ids;
}
