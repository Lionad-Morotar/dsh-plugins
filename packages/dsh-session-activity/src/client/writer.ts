/**
 * The one module in this package that touches the DOM.
 *
 * A `<style>` element rather than inline `style` attributes or `insertRule`, for
 * the same reason the host's own packages do it that way: the page already allows
 * style elements through its CSP, and one element per plugin is one thing to
 * remove on unload. Inline attributes would also lose to the host's own
 * declarations on the title, and `insertRule` would make the removal path
 * order-dependent.
 *
 * The text is cached so a recompute that produced the same table costs no DOM
 * write at all. That matters because the entry recomputes on every host
 * notification, and a busy sidebar notifies far more often than a row changes
 * tier.
 */
import { STYLE_TAG_ID } from "./styles.ts";

/** What the entry drives. */
export interface RowWriter {
  /**
   * Install the stylesheet text.
   * @param css - the complete table.
   */
  update(css: string): void;
  /** Remove the element and stop writing; idempotent. */
  dispose(): void;
}

/**
 * Create the writer for one document.
 *
 * The element is created on the first update rather than on construction, so a
 * mount that is disposed before it paints never touches the head.
 * @param doc - the page's document.
 * @returns the writer for this page.
 */
export function createWriter(doc: Document): RowWriter {
  let element: HTMLElement | undefined;
  let lastCss: string | undefined;
  let disposed = false;

  const mount = (): HTMLElement => {
    const created = doc.createElement("style");
    created.setAttribute("data-plugin-css", STYLE_TAG_ID);
    doc.head.appendChild(created);
    element = created;
    return created;
  };

  return {
    update(css: string): void {
      if (disposed || css === lastCss) return;
      const target = element ?? mount();
      target.textContent = css;
      lastCss = css;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      element?.remove();
      element = undefined;
      lastCss = undefined;
    },
  };
}
