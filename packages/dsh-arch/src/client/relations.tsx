/**
 * The relationships pane: the floating card that opens when the user presses an
 * edge or a node's browse button, listing the relationships that edge or node
 * stands for.
 *
 * Imperative DOM like the rest of the chrome (the panel hands over plain
 * elements, no React). `render` is the whole API: null closes it, a payload
 * opens it with fresh content. The pane is positioned in host-client pixels
 * against an anchor rectangle the renderer computed, so it never needs to know
 * about pan or zoom.
 *
 * The grouping and decoding rules live in `relations-data.ts` so they stay
 * testable without a document; this file only lays them out.
 */
import type { DiagramAnchor } from "./chunk/diagram.ts";
import type { ArchRelationGroups, ArchRelationRow } from "./relations-data.ts";

/** What the pane shows: a title for the header plus the two groups. */
export interface RelationsPanePayload {
  /** Header text, e.g. the edge's own label or the element's title. */
  readonly title: string;
  /** Subtitle line, e.g. "source → target" for an edge. */
  readonly subtitle: string | null;
  readonly groups: ArchRelationGroups;
  /** Where to point, in host-client pixels. */
  readonly anchor: DiagramAnchor;
  /** Bounds of the host element, so the pane can flip inside it. */
  readonly host: { readonly width: number; readonly height: number };
}

export interface RelationsPaneOptions {
  /** Invoked by the × button, a blank-canvas press or Escape. */
  readonly onClose: () => void;
  /** Invoked when a row is pressed; the chrome focuses that node pair. */
  readonly onPick?: (row: ArchRelationRow) => void;
}

export interface RelationsPaneHandle {
  /** Open with a payload, or close with null. */
  render(payload: RelationsPanePayload | null): void;
  /** Whether the pane is currently open. */
  isOpen(): boolean;
}

/** Pane width bounds; the card is a reading surface, not a full panel. */
const PANE_MIN_WIDTH = 260;
const PANE_MAX_WIDTH = 420;
/** Gap between the anchor and the card. */
const PANE_OFFSET = 8;

const paneStyle =
  "position:absolute;z-index:30;box-sizing:border-box;display:flex;flex-direction:column;" +
  "gap:6px;padding:10px 12px;border-radius:10px;overflow:auto;max-height:420px;" +
  // A raised surface from the host's own tokens: the pane used to be a dark
  // card, which on a light host read as a foreign overlay rather than part of
  // the panel it belongs to.
  "background:color-mix(in srgb, var(--dsw-alias-bg-layer-2,#ffffff) 97%, transparent);" +
  "color:var(--dsw-alias-label-primary,#0f1115);" +
  "border:1px solid var(--dsw-alias-border-l3,rgba(0,0,0,0.12));" +
  "box-shadow:0 12px 32px color-mix(in srgb, var(--dsw-alias-label-primary,#0f1115) 16%, transparent);" +
  "font-size:12px;line-height:1.5;cursor:default";
const headerStyle = "display:flex;align-items:flex-start;gap:8px;flex:none";
const titleStyle = "font-size:12px;font-weight:600;margin:0;flex:1;min-width:0;word-break:break-word";
const subtitleStyle = "font-size:11px;opacity:0.62;margin:0;word-break:break-word";
const closeStyle =
  "flex:none;border:none;background:transparent;color:inherit;cursor:pointer;" +
  "font-size:15px;line-height:1;padding:2px 4px;border-radius:5px;opacity:0.7";
const groupStyle =
  "font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;" +
  "opacity:0.55;margin:2px 0 0";
const rowStyle =
  "display:flex;flex-direction:column;gap:2px;padding:5px 6px;border-radius:6px;" +
  "cursor:pointer;border:1px solid transparent";
const endpointsStyle = "display:flex;align-items:center;gap:5px;flex-wrap:wrap";
const arrowStyle = "opacity:0.55;font-size:11px";
const relationTitleStyle = "font-weight:500;word-break:break-word";
const metaStyle = "opacity:0.62;font-size:11px;word-break:break-word";
const capsuleStyle =
  "display:inline-block;padding:0 6px;border-radius:999px;font-size:10px;line-height:16px;" +
  "border:1px solid currentColor;white-space:nowrap";

/**
 * Endpoint capsule: the short name inside a coloured pill, full name on hover.
 *
 * The colour is the element's own C4 colour when the view carried one; the
 * fallback keeps an unknown element readable instead of invisible.
 *
 * @param endpoint - the decoded endpoint.
 * @param colour - the element colour, or null.
 * @returns the capsule element.
 */
function capsule(endpoint: { short: string; full: string }, colour: string | null): HTMLElement {
  const pill = document.createElement("span");
  pill.style.cssText = capsuleStyle;
  pill.textContent = endpoint.short;
  pill.title = endpoint.full;
  pill.style.color = colour ?? "var(--dsw-alias-label-secondary,#61666b)";
  return pill;
}

/**
 * One relationship row: endpoints, title, and the optional technology and
 * description lines.
 *
 * @param row - the decoded row.
 * @param colours - element colour lookup, keyed by full element id.
 * @param onPick - row press handler.
 * @returns the row element.
 */
function relationRow(
  row: ArchRelationRow,
  colours: ReadonlyMap<string, string>,
  onPick: ((row: ArchRelationRow) => void) | undefined,
): HTMLElement {
  const element = document.createElement("div");
  element.dataset.archRelationRow = "";
  element.dataset.relationId = row.id;
  element.style.cssText = rowStyle;

  const endpoints = document.createElement("div");
  endpoints.style.cssText = endpointsStyle;
  const arrow = document.createElement("span");
  arrow.style.cssText = arrowStyle;
  arrow.textContent = "→";
  endpoints.append(
    capsule(row.source, colours.get(row.source.id) ?? null),
    arrow,
    capsule(row.target, colours.get(row.target.id) ?? null),
  );
  element.append(endpoints);

  if (row.title !== null) {
    const title = document.createElement("div");
    title.style.cssText = relationTitleStyle;
    title.textContent = row.title;
    element.append(title);
  }
  if (row.technology !== null) {
    const technology = document.createElement("div");
    technology.style.cssText = metaStyle;
    technology.textContent = `technology: ${row.technology}`;
    element.append(technology);
  }
  if (row.description !== null) {
    const description = document.createElement("div");
    description.style.cssText = metaStyle;
    description.textContent = row.description;
    element.append(description);
  }

  if (onPick !== undefined) {
    element.addEventListener("click", event => {
      event.stopPropagation();
      onPick(row);
    });
    element.addEventListener("pointerenter", () => {
      element.style.background = "color-mix(in srgb, var(--dsw-alias-label-primary,#0f1115) 7%, transparent)";
      element.style.borderColor = "var(--dsw-alias-border-l2,rgba(0,0,0,0.1))";
    });
    element.addEventListener("pointerleave", () => {
      element.style.background = "transparent";
      element.style.borderColor = "transparent";
    });
  }
  return element;
}

/**
 * Place the pane against its anchor, flipping to stay inside the host.
 *
 * Four quadrants, hand-computed: the card prefers below-right of the anchor and
 * flips vertically when it would overflow the bottom, horizontally when it
 * would overflow the right. No floating-ui dependency for two comparisons.
 *
 * @param pane - the card, already sized by the browser.
 * @param payload - the payload carrying the anchor and host bounds.
 */
function place(pane: HTMLElement, payload: RelationsPanePayload): void {
  const { anchor, host } = payload;
  const width = pane.offsetWidth || PANE_MIN_WIDTH;
  const height = pane.offsetHeight || 0;

  // Prefer the anchor's left edge; flip left when that would run past the host.
  let left = anchor.x;
  if (left + width > host.width) left = anchor.x + anchor.width - width;
  if (left < 0) left = 0;

  // Prefer below the anchor; flip above when the card would overflow.
  let top = anchor.y + anchor.height + PANE_OFFSET;
  if (top + height > host.height) {
    const above = anchor.y - height - PANE_OFFSET;
    top = above >= 0 ? above : Math.max(0, host.height - height);
  }

  pane.style.left = `${Math.round(left)}px`;
  pane.style.top = `${Math.round(top)}px`;
  pane.style.width = `${Math.round(Math.min(PANE_MAX_WIDTH, Math.max(PANE_MIN_WIDTH, width)))}px`;
}

/**
 * Mount the relationships pane into a host element.
 *
 * The pane is created once and re-parented on every render, the same shape as
 * the details pane: closed means absent from the DOM, so "is it open" is a
 * plain selector.
 *
 * @param host - the element the pane lives in; it must be positioned.
 * @param options - the close and pick seams.
 * @returns the render handle.
 */
export function mountArchRelationsPane(
  host: HTMLElement,
  options: RelationsPaneOptions,
): RelationsPaneHandle {
  const pane = document.createElement("div");
  pane.dataset.archRelations = "";
  pane.style.cssText = paneStyle;
  // The pane must not let a press reach the canvas behind it: that would close
  // the pane on the same click that was meant to interact with it.
  pane.addEventListener("pointerdown", event => event.stopPropagation());
  pane.addEventListener("click", event => event.stopPropagation());

  let open = false;

  const render = (payload: RelationsPanePayload | null): void => {
    if (payload === null) {
      open = false;
      pane.remove();
      pane.replaceChildren();
      return;
    }

    const colours = new Map<string, string>();
    // A re-render replaces the previous content outright. Appending would
    // stack a second header and a second set of groups onto the same card,
    // which is what happens whenever the user opens one edge after another.
    pane.replaceChildren();

    const header = document.createElement("div");
    header.style.cssText = headerStyle;

    const heading = document.createElement("div");
    heading.style.cssText = "flex:1;min-width:0;display:flex;flex-direction:column;gap:2px";
    const title = document.createElement("h4");
    title.style.cssText = titleStyle;
    title.textContent = payload.title;
    heading.append(title);
    if (payload.subtitle !== null) {
      const subtitle = document.createElement("p");
      subtitle.style.cssText = subtitleStyle;
      subtitle.textContent = payload.subtitle;
      heading.append(subtitle);
    }

    const close = document.createElement("button");
    close.type = "button";
    close.dataset.archRelationsClose = "";
    close.setAttribute("aria-label", "close relationships");
    close.textContent = "×";
    close.style.cssText = closeStyle;
    close.addEventListener("click", event => {
      event.stopPropagation();
      options.onClose();
    });

    header.append(heading, close);
    pane.append(header);

    const addGroup = (label: string, rows: readonly ArchRelationRow[]): void => {
      if (rows.length === 0) return;
      const group = document.createElement("div");
      group.dataset.archRelationsGroup = "";
      group.style.cssText = groupStyle;
      group.textContent = label;
      pane.append(group);
      for (const row of rows) pane.append(relationRow(row, colours, options.onPick));
    };

    addGroup("DIRECT", payload.groups.direct);
    addGroup("RESOLVED FROM NESTED", payload.groups.nested);

    // Nothing usable: say so rather than showing an empty card.
    if (payload.groups.direct.length === 0 && payload.groups.nested.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText = metaStyle;
      empty.textContent = "no relationships recorded for this edge";
      pane.append(empty);
    }

    open = true;
    host.append(pane);
    // Measured after insertion: offsetWidth/Height are zero while detached.
    place(pane, payload);
  };

  return { render, isOpen: () => open };
}
