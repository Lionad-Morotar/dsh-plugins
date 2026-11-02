/**
 * The Tab management page.
 *
 * One checkbox per conversation view the host is currently showing a tab for,
 * aside from Chat. The row is the whole explanation: the name is the tab's own
 * label, and the checkbox is whether that tab is in the strip. There is no
 * description under it, because the layout already says which view and which
 * state.
 *
 * The host mounts one element and never re-renders it, so the page builds its
 * rows as DOM inside that element and replaces them whenever the ledger or the
 * choice changes. No React hook is involved at any point.
 */
import type { TabController } from "./tabs.ts";

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
  cursor: pointer;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row]:last-of-type {
  border-bottom: none;
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
 * disagree with it.
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

  const rows = controller.rows();
  if (rows.length === 0) {
    const empty = doc.createElement("p");
    empty.setAttribute("data-dsh-better-tabs-empty", "");
    empty.textContent = copy.empty;
    section.append(empty);
    return;
  }

  for (const row of rows) {
    const label = doc.createElement("label");
    label.setAttribute("data-dsh-better-tabs-row", row.id);

    const name = doc.createElement("span");
    name.setAttribute("data-dsh-better-tabs-name", "");
    name.textContent = row.label;

    const box = doc.createElement("input");
    box.setAttribute("data-dsh-better-tabs-check", row.id);
    box.type = "checkbox";
    box.checked = row.enabled;
    box.setAttribute("aria-label", copy.checkboxLabel(row.label, row.enabled));
    box.addEventListener("change", () => {
      controller.setEnabled(row.id, box.checked);
    });

    label.append(name, box);
    section.append(label);
  }
}
