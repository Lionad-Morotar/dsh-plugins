/**
 * The shell's popup stylesheet classes.
 *
 * The picker reuses the stylesheet the shell already installs rather than
 * shipping its own copy, so the surface keeps the host's material, elevation,
 * spacing and focus ring for free, and keeps following them when the shell is
 * restyled.
 *
 * The names cannot be written down here: they are content-hashed per build
 * (`mufS8W_card`), so a hard-coded copy would look right in review and break on
 * the next release. They are read from the `<style>` element instead, which the
 * shell keys by a stable plugin-css id.
 */

/** The classes this surface uses, in the shell's own vocabulary. */
export interface PopupClasses {
  readonly card: string;
  readonly viewport: string;
  readonly row: string;
  readonly rowActive: string;
  readonly label: string;
  readonly labelText: string;
  readonly badge: string;
  readonly detail: string;
  readonly check: string;
  readonly status: string;
  readonly search: string;
  readonly error: string;
  readonly errorText: string;
  readonly retry: string;
}

/** Stable id the shell installs the popup stylesheet under. */
const STYLESHEET_ID = "@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";

/**
 * Read the class map out of the shell's injected stylesheet.
 * @param doc - document holding the stylesheet.
 * @returns the class map, or undefined while the stylesheet is missing.
 */
export function readPopupClasses(doc: Document | undefined): PopupClasses | undefined {
  if (doc === undefined) return undefined;
  const tag = doc.querySelector(`style[data-plugin-css="${STYLESHEET_ID}"]`);
  const css = tag?.textContent ?? "";
  const find = (part: string): string | undefined => new RegExp(`\\.(\\w+_${part})\\{`, "u").exec(css)?.[1];
  const classes = {
    card: find("card"),
    viewport: find("viewport"),
    row: find("row"),
    rowActive: find("rowActive"),
    label: find("label"),
    labelText: find("labelText"),
    badge: find("badge"),
    detail: find("detail"),
    check: find("check"),
    status: find("status"),
    search: find("search"),
    error: find("error"),
    errorText: find("errorText"),
    retry: find("retry"),
  };
  // All or nothing: a partial map would render rows with an undefined class
  // name, which looks like a styling regression rather than a missing sheet.
  for (const value of Object.values(classes)) if (value === undefined) return undefined;
  return classes as PopupClasses;
}
