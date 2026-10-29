/**
 * The panel view.
 *
 * Mounted inside `shell.overlay` for lifecycle and theme, rendered through a
 * portal onto `document.body` for two reasons the layout forces: the overlay
 * layer is a `z-index: 20` stacking context that can never paint above the
 * host's modals, and the host decides which dialog owns the foreground by
 * document order — a node inside the frame is always earlier than a later modal.
 *
 * Keyboard ownership is taken in two layers. The modal semantics (`role`,
 * `aria-modal`, `data-shortcut-modal`, `useModalLayer`) make the host mark every
 * other command blocked, and the five navigation keys are read at window capture
 * so the host's own capture listeners cannot answer them first. Escape then means
 * "one level up" before it means "close", which is the whole two-level model.
 */

import { PANEL_MODES, highlightOf, type PanelMode, type PanelModel } from "./panel-state.ts";
import type { Copy } from "./copy.ts";
import type { PanelDomSlice, PanelPrimitives, ReactSlice } from "./react.ts";
import type { PanelRow } from "./rows.ts";
import { ROOT_ATTR } from "./styles.ts";
import type { PanelStore } from "./store.ts";

/** The modal id this panel publishes to the shortcut service. */
export const PANEL_MODAL = "command-panel";

/** Everything the view may ask the runtime to do. */
export interface PanelViewDeps {
  readonly React: ReactSlice;
  readonly dom: PanelDomSlice;
  readonly primitives: PanelPrimitives;
  readonly store: PanelStore;
  readonly copy: Copy;
  readonly document: Document;
  readonly move: (delta: number) => void;
  readonly highlight: (index: number) => void;
  readonly setQuery: (query: string) => void;
  readonly acceptActive: () => void;
  readonly accept: (row: PanelRow) => void;
  readonly dismiss: () => void;
  readonly back: () => void;
  readonly switchMode: (mode: PanelMode) => void;
  /** Breadcrumb of the drilled level, or null at the top level. */
  readonly crumbLabel: () => string | null;
}

const INPUT_PROPS = {
  type: "text",
  spellCheck: false,
  autoComplete: "off",
  "data-dcp-query": "",
  "data-modal-autofocus": "",
} as const;

/** Keys the panel answers itself while it is open. */
const OWNED_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Enter",
  "Tab",
  "Escape",
]);

/**
 * Build the React component bound to the runtime's actions.
 *
 * @param deps - React, portal, primitives, the store and the runtime's verbs.
 * @returns the component the slot renders; it returns null while closed.
 */
export function createPanelView(deps: PanelViewDeps): (props: unknown) => unknown {
  const { React, store, copy } = deps;
  const h = React.createElement;
  const dom = deps.document;

  return function CommandPanelView(): unknown {
    const snapshot = React.useSyncExternalStore(
      listener => store.subscribe(listener),
      () => store.getSnapshot(),
    );
    const rootRef = React.useRef<HTMLElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const composition = React.useMemo(() => deps.primitives.observeComposition(dom), []);
    const open = snapshot.open;

    React.useEffect(() => () => composition.dispose(), [composition]);

    deps.primitives.useModalLayer(rootRef, open, deps.dismiss);

    React.useEffect(() => {
      if (!open) return;
      inputRef.current?.focus();
    }, [open]);

    React.useEffect(() => {
      if (!open || rootRef.current === null) return;
      const active = rootRef.current.querySelector('[data-dcp-row][data-active="true"]');
      if (active !== null && typeof (active as { scrollIntoView?: unknown }).scrollIntoView === "function") {
        (active as HTMLElement).scrollIntoView({ block: "nearest" });
      }
    }, [open, snapshot.model.highlight, snapshot.rows]);

    /**
     * Own the navigation keys while the panel is open.
     *
     * Window capture is deliberate: the host installs its own capture listener at
     * boot, and Escape there doubles as the first stroke of its stop-sequence
     * chord, so anything later in the path never sees the key. Preventing the
     * default also stops `useModalLayer` from closing the panel behind our back.
     */
    React.useEffect(() => {
      if (!open) return undefined;
      const target = dom.defaultView ?? globalThis.window;
      if (target === undefined) return undefined;

      const onKeyDown = (event: KeyboardEvent): void => {
        if (!OWNED_KEYS.has(event.key)) return;
        // The committing Enter of an IME session is not a confirmation: the host's
        // gate covers `composing`, `isComposing`, keyCode 229 and the one-shot
        // `ended` flag that makes Chinese input commit without selecting a row.
        if (composition.guards(event)) return;
        event.preventDefault();
        event.stopPropagation();
        switch (event.key) {
          case "ArrowDown":
            deps.move(1);
            return;
          case "ArrowUp":
            deps.move(-1);
            return;
          case "PageDown":
            deps.move(8);
            return;
          case "PageUp":
            deps.move(-8);
            return;
          case "Enter":
          case "Tab":
            deps.acceptActive();
            return;
          case "Escape":
            deps.back();
            return;
          default:
            return;
        }
      };

      target.addEventListener("keydown", onKeyDown, true);
      return () => target.removeEventListener("keydown", onKeyDown, true);
    }, [open, composition]);

    if (!open) return null;
    const body = dom.body;
    if (body === null) return null;

    const { model, rows } = snapshot;
    const active = highlightOf(model, rows.length);

    const list: unknown[] = [];
    let group: string | undefined;
    rows.forEach((row, index) => {
      if (row.group !== undefined && row.group !== group) {
        list.push(h("div", { key: `group:${row.group}`, "data-dcp-group": "" }, row.group));
      }
      group = row.group;
      list.push(
        h(
          "div",
          {
            key: row.key,
            "data-dcp-row": "",
            "data-kind": row.action.kind,
            "data-active": index === active ? "true" : undefined,
            role: "option",
            "aria-selected": index === active,
            onMouseMove: () => deps.highlight(index),
            onClick: () => deps.accept(row),
          },
          h("span", { "data-dcp-label": "" }, row.label),
          row.detail === undefined ? null : h("span", { "data-dcp-detail": "" }, row.detail),
          row.hint === undefined ? null : h("span", { "data-dcp-hint": "" }, row.hint),
        ),
      );
    });

    const crumb = deps.crumbLabel();
    const status = statusLine(snapshot.status, snapshot.message, rows.length, model, copy);

    const card = h(
      "div",
      { "data-dcp-card": "" },
      h(
        "div",
        { "data-dcp-head": "" },
        h(
          "div",
          { "data-dcp-modes": "", role: "tablist" },
          ...PANEL_MODES.map(mode =>
            h(
              "button",
              {
                key: mode,
                type: "button",
                role: "tab",
                "data-dcp-mode": "",
                "data-active": mode === model.mode ? "true" : undefined,
                "aria-selected": mode === model.mode,
                onMouseDown: (event: Event) => event.preventDefault(),
                onClick: () => deps.switchMode(mode),
              },
              copy.modeNames[mode],
            ),
          ),
        ),
        crumb === null
          ? null
          : h(
              "button",
              {
                type: "button",
                "data-dcp-crumb": "",
                title: crumb,
                onMouseDown: (event: Event) => event.preventDefault(),
                onClick: () => deps.back(),
              },
              `‹ ${crumb}`,
            ),
        h("input", {
          ...INPUT_PROPS,
          ref: inputRef,
          value: model.query,
          placeholder: copy.placeholder[model.mode],
          "aria-label": copy.title,
          onChange: (event: { currentTarget: HTMLInputElement }) => deps.setQuery(event.currentTarget.value),
        }),
      ),
      rows.length === 0
        ? h("div", { "data-dcp-status": "", "aria-live": "polite" }, status)
        : h("div", { "data-dcp-list": "", role: "listbox", "aria-label": copy.title }, ...list),
      snapshot.notice === null
        ? null
        : h(
            "div",
            { "data-dcp-notice": "", "data-tone": snapshot.noticeTone ?? "info", "aria-live": "polite" },
            snapshot.notice,
          ),
      h(
        "div",
        { "data-dcp-foot": "" },
        h("span", null, copy.footer.move),
        h("span", null, copy.footer.accept),
        h("span", null, crumb === null ? copy.footer.close : copy.footer.back),
      ),
    );

    return deps.dom.createPortal(
      h(
        "div",
        {
          ref: rootRef,
          [ROOT_ATTR]: "",
          "data-shortcut-modal": PANEL_MODAL,
          role: "dialog",
          "aria-modal": "true",
          "aria-label": copy.title,
          tabIndex: -1,
        },
        h("div", { "data-dcp-mask": "", "aria-hidden": "true", onClick: () => deps.dismiss() }),
        card,
      ),
      body,
    );
  };
}

function statusLine(
  status: "idle" | "loading" | "ready" | "error",
  message: string | null,
  count: number,
  model: PanelModel,
  copy: Copy,
): string {
  if (status === "error") return message ?? copy.failed;
  if (count === 0 && model.query !== "") return copy.noResults;
  if (count === 0) return copy.empty[model.mode];
  return copy.loading;
}
