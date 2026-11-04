/**
 * The stylesheet for the continue button.
 *
 * Its own sheet and its own style tag id, like the compaction count: the two
 * surfaces are installed by different entries, so either can come and go without
 * touching the other's sheet.
 *
 * The button sits in the turn tail, which the host lays out as a flex column with
 * a 16px gap, so the container's `align-self` is the whole of the right alignment.
 * Nothing here borrows a hashed class from the shell: those names change per
 * build and cannot be read from outside. The tokens below are the shell's public
 * design tokens, which is what keeps this button the same size, weight and colour
 * as the cost reading it sits beside, in both color schemes.
 */

/** Stable id so a second mount does not add a second copy. */
const STYLE_ID = "dsh-better-continue";

/** The button's class, exported so the component and tests share one spelling. */
export const CONTINUE_BUTTON_CLASS = "dshBetter_continue";

/** The failure line's class, exported for the same reason. */
export const CONTINUE_ERROR_CLASS = "dshBetter_continueError";

/**
 * The rules.
 *
 * Deliberately a secondary control: a 1px outline on a transparent fill, in the
 * tertiary label colour, at the same 13px as the cost reading. A filled primary
 * button here would read as the thing the user is supposed to do next, and after
 * an interruption that is usually not true; most of the time the user reads what
 * the model said and stops.
 *
 * `align-self` rather than a wrapper: the tail is already a flex column, so the
 * item can place itself and no extra box is needed between the host's children.
 */
const CSS = `
.${CONTINUE_BUTTON_CLASS} {
  align-self: flex-end;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font: inherit;
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-sm, 6px);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}

.${CONTINUE_BUTTON_CLASS}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${CONTINUE_BUTTON_CLASS}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${CONTINUE_BUTTON_CLASS}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${CONTINUE_ERROR_CLASS} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;

/**
 * Insert the stylesheet once per document.
 *
 * Idempotent by id rather than by module state: a profile reload re-applies the
 * plugin while the document survives, and a second copy would be dead weight that
 * never disagrees but never goes away either. A call that inserted nothing
 * returns a no-op disposer, so it cannot remove the tag another call owns.
 * @param doc - document to style.
 * @returns a disposer removing what this call inserted.
 */
export function installContinueStyles(doc: Document | undefined): () => void {
  if (doc === undefined) return () => undefined;
  if (doc.getElementById(STYLE_ID) !== null) return () => undefined;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.append(style);
  return () => {
    style.remove();
  };
}

/** The sheet's text, for tests that assert the placement rule is present. */
export const CONTINUE_CSS = CSS;
