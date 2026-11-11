/**
 * The map's stylesheet, injected by the chunk that needs it.
 *
 * This file exists because of a budget, and the budget is a product decision
 * rather than a tidiness one. `client.js` is evaluated on every page boot whether
 * or not the review tab is ever opened; the map's rules were living there and
 * had grown to a fifth of the startup bundle for a surface most boots never
 * show. Moving them here means a reader who never opens the map never downloads
 * them, and the startup bundle keeps its headroom for the view itself.
 *
 * The rules are unchanged in substance — same selectors, same tokens, same
 * fallbacks — because this is a move, not a restyle. Two states were added for
 * the list↔map linkage, and they are additive.
 *
 * Injected once per document, guarded by an attribute on the `<style>` element:
 * the chunk can mount many times in one page (a scope switch rebuilds the map),
 * and appending a stylesheet per mount would grow the document without bound.
 */

/** Marks the injected `<style>`, so a second mount finds the first one. */
const MAP_STYLE_ATTRIBUTE = "data-rm-map";

const MAP_STYLESHEET = `/* The directory map's own stylesheet, injected by the chunk that draws it.
   Scoped to the map's data-rm namespace rather than to the tab, because the map
   is mounted into a host the view owns and must not need the tab's wrapper to be
   styled. Colours are host tokens with a hex fallback: the map has to survive a
   host that ships no palette at all. */
[data-rm="map-root"] {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary, #14110d);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);

  /* The map's own state colours, derived from host tokens so a theme switch
     moves them without a second block of rules. */
  --rm-map-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-map-del: var(--dsw-alias-state-error-primary, #cf222e);
  --rm-map-warn: var(--dsw-alias-state-warning-primary, #bf8700);
  --rm-map-surface: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
  --rm-map-surface-strong: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.07));
  --rm-map-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
  --rm-map-muted: var(--dsw-alias-label-tertiary, #a39c91);
  /* The two dependency directions. Blue and green are the requirement's own
     choice; the dash patterns above are what carries the meaning without them. */
  --rm-map-imports: var(--dsw-alias-state-info-primary, #2f6feb);
  --rm-map-imported-by: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-map-secondary: var(--dsw-alias-label-secondary, #6b655c);
}

/* Breadcrumb: one button per level, root first. */
[data-rm="map-breadcrumb"] {
  flex: none;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 26px;
  overflow: hidden;
  white-space: nowrap;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: max(9px, var(--dsh-code-font-size, 11px));
}

[data-rm="map-breadcrumb-crumb"] {
  font: inherit;
  padding: 1px 6px;
  color: var(--rm-map-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

[data-rm="map-breadcrumb-crumb"]:hover {
  background: var(--rm-map-surface);
}

[data-rm="map-breadcrumb-crumb"][data-current="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

/* The crumb that holds a highlighted target the map has not drilled into. */
[data-rm="map-breadcrumb-crumb"][data-breadcrumb-target="true"] {
  border-color: var(--rm-map-warn);
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-rm="map-root"] svg {
  flex: 1 1 auto;
  min-height: 0;
  display: block;
  width: 100%;
}

/* Cards. The rect carries the surface; the group carries the identity. */
[data-rm="map-tile"] {
  cursor: pointer;
}

[data-rm="map-tile-rect"] {
  fill: var(--rm-map-surface);
  stroke: var(--rm-map-border);
  stroke-width: 0.5;
  vector-effect: non-scaling-stroke;
}

/* A changed card is drawn on a stronger surface and a heavier border: the map
   must show what changed before it shows what did not. */
[data-rm="map-tile-rect"][data-changed="true"] {
  fill: var(--rm-map-surface-strong);
  stroke: var(--rm-map-secondary);
  stroke-width: 1;
}

[data-rm="map-tile"]:hover [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
}

[data-rm="map-tile"][data-highlighted="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 2;
}

/* A directory's in-tile preview: one level of its direct children, laid out with
   the same treemap. The crumbs are texture, not targets, so they are drawn
   without strokes at rest and only pick one up when they carry a change. */
[data-rm="map-crumb"] {
  fill: var(--rm-map-surface-strong);
  stroke: none;
}

[data-rm="map-crumb"][data-kind="dir"] {
  fill: var(--rm-map-surface);
}

/* A changed crumb uses the same colour and shape vocabulary as the cards: the
   preview is a miniature of the folder, so it must not invent a second one. */
[data-rm="map-crumb"][data-changed="true"] {
  stroke: var(--rm-map-secondary);
  stroke-width: 0.5;
  vector-effect: non-scaling-stroke;
}

[data-rm="map-crumb"][data-status="added"] {
  fill: color-mix(in srgb, var(--rm-map-add) 45%, transparent);
  stroke: var(--rm-map-add);
}

[data-rm="map-crumb"][data-status="modified"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 40%, transparent);
  stroke: var(--rm-map-warn);
}

[data-rm="map-crumb"][data-status="deleted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 45%, transparent);
  stroke: var(--rm-map-del);
  stroke-dasharray: 2 1;
}

[data-rm="map-crumb"][data-status="untracked"] {
  fill: color-mix(in srgb, var(--rm-map-add) 25%, transparent);
  stroke: var(--rm-map-add);
  stroke-dasharray: 1 1;
}

[data-rm="map-crumb"][data-status="conflicted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 30%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 2 1 3 1;
}

/* The aggregate block a capped preview shows instead of silently dropping the
   children it left out. */
[data-rm="map-crumb-overflow"] {
  fill: var(--rm-map-muted);
  opacity: 0.5;
}

/* The hovered directory's reading: the linkage's visible end. */
[data-rm="map-tile"][data-hovered="true"] [data-rm="map-dir-reading"] {
  fill: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

[data-rm="map-tile"][data-hovered="true"] [data-rm="map-dir-name"] {
  fill: var(--dsw-alias-label-primary, #14110d);
}

/* Dependency edges. Colour is the first channel and the dash pattern is the
   second: imports is a solid blue line with an open chevron, imported-by a
   dashed green line with a filled triangle. A greyscale render still separates
   them by both the dash and the arrow shape. */
[data-rm="map-edge"] {
  stroke-width: 1.5;
  stroke-linecap: round;
  pointer-events: none;
}

[data-rm="map-edge"][data-flow="imports"] {
  stroke: var(--rm-map-imports, #2f6feb);
  stroke-dasharray: none;
  color: var(--rm-map-imports, #2f6feb);
}

[data-rm="map-edge"][data-flow="imported-by"] {
  stroke: var(--rm-map-imported-by, #1a7f37);
  stroke-dasharray: 5 3;
  color: var(--rm-map-imported-by, #1a7f37);
}

/* A removed edge is drawn faint and dotted: it is a dependency that no longer
   exists, and it must be visible without competing with the live ones. */
[data-rm="map-edge"][data-state="removed"] {
  stroke-dasharray: 2 3;
  opacity: 0.55;
}

[data-rm="map-edge"][data-aggregated="true"] {
  stroke-width: 2.5;
}

[data-rm="map-arrow-head"] {
  color: inherit;
}

/* The legend explains lines that only exist while a file is highlighted, so it
   only exists then too. */
[data-rm="map-legend"] {
  pointer-events: none;
}

[data-rm="map-legend-swatch"] {
  stroke-width: 2;
}

[data-rm="map-legend-swatch"][data-flow="imports"] {
  stroke: var(--rm-map-imports, #2f6feb);
}

[data-rm="map-legend-swatch"][data-flow="imported-by"] {
  stroke: var(--rm-map-imported-by, #1a7f37);
  stroke-dasharray: 5 3;
}

[data-rm="map-legend-swatch"][data-flow="unresolved"] {
  stroke: var(--rm-map-muted);
  stroke-dasharray: 2 3;
}

[data-rm="map-legend-label"] {
  font-size: 9px;
  fill: var(--rm-map-secondary);
}

[data-rm="map-unresolved"] {
  font-size: 9px;
  fill: var(--rm-map-warn);
}

[data-rm="map-partial"] {
  font-size: 9px;
  fill: var(--rm-map-muted);
  font-style: italic;
}

/* Status: colour and shape, both. The dash patterns are the shape channel, so a
   greyscale render still separates the states; the fills are the colour one. */
[data-rm="map-tile-rect"][data-status="added"] {
  fill: color-mix(in srgb, var(--rm-map-add) 16%, transparent);
  stroke: var(--rm-map-add);
}

[data-rm="map-tile-rect"][data-status="modified"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 14%, transparent);
  stroke: var(--rm-map-warn);
}

[data-rm="map-tile-rect"][data-status="deleted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 16%, transparent);
  stroke: var(--rm-map-del);
  stroke-dasharray: 4 2;
}

[data-rm="map-tile-rect"][data-status="untracked"] {
  fill: color-mix(in srgb, var(--rm-map-add) 8%, transparent);
  stroke: var(--rm-map-add);
  stroke-dasharray: 1 2;
}

[data-rm="map-tile-rect"][data-status="conflicted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 10%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 2 1 4 1;
}

[data-rm="map-tile-rect"][data-status="renamed"],
[data-rm="map-tile-rect"][data-status="copied"] {
  fill: color-mix(in srgb, var(--rm-map-secondary) 10%, transparent);
  stroke: var(--rm-map-secondary);
  stroke-dasharray: 6 2;
}

[data-rm="map-tile-rect"][data-status="type-changed"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 8%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 1 3;
}

/* A deleted card is struck through as well as dashed: the dash says "gone" at a
   glance, the strike says it again on the label, and neither depends on colour. */
[data-rm="map-tile"][data-deleted="true"] [data-rm="map-file-name"] {
  text-decoration: line-through;
  fill: var(--rm-map-muted);
}

/* Text. 9px is the floor: below it a label is a smudge, and the renderer drops
   the text entirely rather than drawing something unreadable. */
[data-rm="map-root"] text {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: 9px;
  fill: var(--dsw-alias-label-primary, #14110d);
  pointer-events: none;
}

[data-rm="map-dir-name"] {
  font-weight: 600;
}

[data-rm="map-dir-reading"],
[data-rm="map-file-churn"] {
  fill: var(--rm-map-secondary);
}

[data-rm="map-dir-reading"][data-pending="true"] {
  fill: var(--rm-map-muted);
  font-style: italic;
}

[data-rm="map-file-mark"][data-status="added"] {
  fill: var(--rm-map-add);
}

[data-rm="map-file-mark"][data-status="deleted"] {
  fill: var(--rm-map-del);
}

[data-rm="map-file-mark"][data-status="conflicted"] {
  fill: var(--rm-map-warn);
}

/* The distribution bar: where in the file the edits landed. */
[data-rm="map-bar-seg"][data-kind="add"] {
  fill: var(--rm-map-add);
}

[data-rm="map-bar-seg"][data-kind="del"] {
  fill: var(--rm-map-del);
}

/* The aggregate marker a capped level shows instead of silently dropping files. */
[data-rm="map-overflow-rect"] {
  fill: var(--rm-map-surface);
  stroke: var(--rm-map-border);
  stroke-dasharray: 2 2;
  stroke-width: 0.5;
}

[data-rm="map-overflow-text"] {
  fill: var(--rm-map-muted);
  font-style: italic;
}
/* Hover, from either side of the linkage. A hovered card and a highlighted card
   are different states: hover is where the pointer is, highlight is what the
   list is pointing at, and a reader can be doing both at once. */
[data-rm="map-tile"][data-hovered="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 1.5;
}

[data-rm="map-tile"][data-highlighted="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 2;
}
`;

/**
 * Install the map's stylesheet if this document does not have it yet.
 *
 * Idempotent by construction: the attribute is the key, so a second call returns
 * the element the first one appended instead of adding a duplicate.
 * @param doc - the document to install into.
 * @returns the style element.
 */
export function ensureMapStyles(doc: Document): HTMLStyleElement {
  const existing = doc.querySelector<HTMLStyleElement>(`style[${MAP_STYLE_ATTRIBUTE}]`);
  if (existing !== null) return existing;
  const style = doc.createElement("style");
  style.setAttribute(MAP_STYLE_ATTRIBUTE, "");
  style.textContent = MAP_STYLESHEET;
  doc.head.append(style);
  return style;
}
