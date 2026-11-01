/**
 * The element details pane: the right-hand column that opens when a node is
 * selected, showing the element's catalogue fields from /arch/api/model.
 *
 * The pane is imperative DOM like the rest of the chrome (the panel hands
 * over plain elements); `render` is the whole API — null closes it, an
 * element opens it with fresh content. `readElement` is the pure decoder for
 * the catalogue's Record shape so it stays testable without a DOM.
 */

/** One decoded catalogue element; absent fields are null/empty, never undefined. */
export interface ArchElementDetails {
  readonly id: string;
  readonly title: string | null;
  readonly description: string | null;
  readonly technology: string | null;
  readonly links: readonly { readonly title: string | null; readonly url: string }[];
  readonly tags: readonly string[];
}

const text = (value: unknown): string | null => (typeof value === "string" ? value : null);

/** `$data` carries description as `{ txt }`; export dumps use plain strings. */
const descriptionOf = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "txt" in value) {
    return text((value as { txt?: unknown }).txt);
  }
  return null;
};

const linksOf = (value: unknown): { title: string | null; url: string }[] => {
  if (!Array.isArray(value)) return [];
  const links: { title: string | null; url: string }[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const url = text((entry as { url?: unknown }).url);
    if (url === null) continue;
    links.push({ title: text((entry as { title?: unknown }).title), url });
  }
  return links;
};

const tagsOf = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string") : [];

/**
 * Decode one element from the model catalogue's Record.
 *
 * @param elements - the `elements` Record of `GET /arch/api/model`.
 * @param id - the selected node id; LikeC4 node and element ids coincide.
 * @returns the decoded element, or null when the id is unknown or the record
 *   is not an object.
 */
export function readElement(
  elements: Readonly<Record<string, unknown>> | undefined,
  id: string,
): ArchElementDetails | null {
  if (elements === undefined) return null;
  const raw = elements[id];
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  return {
    id,
    title: text(record.title),
    description: descriptionOf(record.description),
    technology: text(record.technology),
    links: linksOf(record.links),
    tags: tagsOf(record.tags),
  };
}

export interface DetailsPaneOptions {
  /** Invoked by the pane's close button; the chrome routes it to deselect. */
  readonly onClose: () => void;
}

export interface DetailsPaneHandle {
  /** Open with an element's fields, or close with null. */
  render(element: ArchElementDetails | null): void;
}

const paneStyle =
  "flex:none;width:240px;max-width:40%;overflow:auto;" +
  "border-left:1px solid color-mix(in srgb, currentColor 12%, transparent);padding:8px 10px;font-size:11px";
const titleStyle = "font-size:12px;font-weight:600;margin:0 24px 6px 0";
const closeStyle =
  "position:absolute;top:4px;right:4px;border:none;background:transparent;color:inherit;" +
  "cursor:pointer;font-size:12px;padding:2px 6px;border-radius:6px;opacity:0.7";
const rowLabelStyle = "opacity:0.6;margin-right:6px";
const linkStyle = "color:inherit";

/**
 * Mount the details pane into its host (the right column beside the diagram).
 *
 * The pane element is created once and re-parented on every render: closed
 * means absent from the DOM, so "is the pane open" is a plain selector.
 *
 * @param host - the element the pane lives in; the pane itself is one child.
 * @param options - the close seam.
 * @returns the render handle.
 */
export function mountArchDetailsPane(host: HTMLElement, options: DetailsPaneOptions): DetailsPaneHandle {
  const pane = document.createElement("aside");
  pane.dataset.archDetails = "";
  pane.style.cssText = `${paneStyle};position:relative`;

  const title = document.createElement("h3");
  title.style.cssText = titleStyle;

  const close = document.createElement("button");
  close.type = "button";
  close.dataset.archDetailsClose = "";
  close.setAttribute("aria-label", "close details");
  close.textContent = "×";
  close.style.cssText = closeStyle;
  close.addEventListener("click", () => options.onClose());

  const body = document.createElement("div");
  pane.append(title, close, body);

  const row = (label: string, value: string): HTMLElement => {
    const line = document.createElement("p");
    line.style.margin = "4px 0";
    const name = document.createElement("span");
    name.style.cssText = rowLabelStyle;
    name.textContent = `${label}:`;
    line.append(name, document.createTextNode(value));
    return line;
  };

  const linkRow = (link: { title: string | null; url: string }): HTMLElement => {
    const line = document.createElement("p");
    line.style.margin = "4px 0";
    const name = document.createElement("span");
    name.style.cssText = rowLabelStyle;
    name.textContent = "link:";
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.style.cssText = linkStyle;
    anchor.textContent = link.title ?? link.url;
    line.append(name, anchor);
    return line;
  };

  return {
    render(element) {
      if (element === null) {
        pane.remove();
        body.replaceChildren();
        return;
      }
      title.textContent = element.title ?? element.id;
      const parts: HTMLElement[] = [];
      if (element.technology !== null) parts.push(row("technology", element.technology));
      if (element.tags.length > 0) parts.push(row("tags", element.tags.join(", ")));
      for (const link of element.links) parts.push(linkRow(link));
      if (element.description !== null) {
        const desc = document.createElement("p");
        desc.style.margin = "6px 0 2px";
        desc.textContent = element.description;
        parts.push(desc);
      }
      body.replaceChildren(...parts);
      host.append(pane);
    },
  };
}
