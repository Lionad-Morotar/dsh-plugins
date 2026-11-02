/**
 * The Tab management page.
 *
 * One checkbox per conversation view the host is currently showing a tab for,
 * aside from Chat. The row is the whole explanation: the name is the tab's own
 * label, and the checkbox is whether that tab is in the strip. There is no
 * description under it, because the layout already says which view and which
 * state.
 *
 * React arrives from the module loader, so the tree is built with
 * `createElement`. The page subscribes with `useSyncExternalStore` because a
 * plugin can register a view while the page is open, and the new row has to
 * appear without a navigation.
 */
import type { TabController } from "./tabs.ts";

/** The slice of React the page uses. Structural, so the loader's copy satisfies it. */
export interface PageReact {
  createElement: (
    type: unknown,
    props: Record<string, unknown> | null,
    ...children: unknown[]
  ) => unknown;
  useSyncExternalStore: <T>(subscribe: (listener: () => void) => () => void, getSnapshot: () => T) => T;
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
 * A function rather than a component declaration because the host's registry
 * accepts any function, and keeping it a plain function lets a test render the
 * tree without a reconciler.
 */
export function TabSettingsPage(props: TabPageProps): unknown {
  const { React, controller, copy } = props;
  const rows = React.useSyncExternalStore(
    listener => controller.subscribe(listener),
    () => controller.rows(),
  );
  const heading = React.createElement("h2", { "data-dsh-better-tabs-heading": "" }, copy.heading);
  const body =
    rows.length === 0
      ? React.createElement("p", { "data-dsh-better-tabs-empty": "" }, copy.empty)
      : rows.map(row =>
          React.createElement(
            "label",
            { "data-dsh-better-tabs-row": row.id, key: row.id },
            React.createElement("span", { "data-dsh-better-tabs-name": "" }, row.label),
            React.createElement("input", {
              "data-dsh-better-tabs-check": row.id,
              type: "checkbox",
              checked: row.enabled,
              "aria-label": copy.checkboxLabel(row.label, row.enabled),
              onChange: (event: { currentTarget: { checked: boolean } }) => {
                controller.setEnabled(row.id, event.currentTarget.checked);
              },
            }),
          ),
        );
  return React.createElement("section", { "data-dsh-better-tabs": "" }, heading, body);
}
