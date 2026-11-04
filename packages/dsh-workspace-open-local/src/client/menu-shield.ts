/**
 * Keep the host's workspace menu open while the pointer is on the row this
 * plugin injected into it.
 *
 * The workspace row mounts its menu with `closeOnPointerLeave: true`. That puts
 * `onPointerEnter`/`onPointerLeave` on the menu's root `<span>`: leaving arms a
 * 200ms close timer, entering cancels it. The menu surface is portalled to the
 * body, so React knows the floating list is still "inside" the root by React
 * tree, not by DOM.
 *
 * The row below is rendered by a second React root of this plugin, which makes
 * it a subtree React has no fiber for. Moving the pointer from a host menuitem
 * into that subtree cannot be resolved to an instance, so React reports the
 * leave for the menuitem's whole ancestor chain, the menu root included: the
 * timer arms and the menu closes under the pointer, without a click.
 *
 * The host exposes no API for that state, so the row cancels the timer through
 * the only door the menu listens at: a `pointerover` on its own trigger button
 * re-enters the root as far as React is concerned, which runs the cancel path.
 * It is repeated on a short interval while the pointer is on the row so the
 * cancel lands after the arm no matter whether React handled the leave in the
 * capture or the bubble pass.
 */

/** How often to re-cancel while the pointer rests on the row; under the host's 200ms timer. */
const CANCEL_INTERVAL_MS = 100;

/** Pointer events on the row that should re-assert the menu's open state. */
const HOVER_EVENTS = ["pointerover", "pointerenter", "pointermove"] as const;

/**
 * Events the host must not see coming from the row.
 *
 * `pointerdown` is how the host dismisses a menu it considers outside; `click`
 * is how the surface decides a row was chosen. Both belong to the row's own
 * React root, so the shield stops them after that root has handled them.
 */
const SEALED_EVENTS = ["pointerdown", "pointerup", "click", "contextmenu"] as const;

/**
 * Re-enter the host menu root, cancelling a close it may have armed.
 *
 * A `pointerover` with no related target is what a pointer arriving from
 * outside produces, and React turns it into `pointerenter` for every ancestor
 * of the target, including the menu root that owns the timer.
 *
 * @param trigger - the button that opened the menu.
 * @param detached - whether the trigger is still in the document.
 * @returns whether an event was dispatched.
 */
export function cancelPendingMenuClose(trigger: Element | null, detached = false): boolean {
  if (trigger === null || detached) return false;
  const view = trigger.ownerDocument.defaultView;
  const Pointer = view?.PointerEvent;
  const options: PointerEventInit = { bubbles: true, relatedTarget: null };
  const event = Pointer === undefined ? new MouseEvent("pointerover", options) : new Pointer(Pointer === undefined ? "pointerover" : "pointerover", options);
  trigger.dispatchEvent(event);
  return true;
}

export interface HostMenuShieldOptions {
  /** The node this plugin appended to the menu; events inside it are sealed. */
  readonly container: HTMLElement;
  /** The button that opened the menu, or null when the anchor could not name it. */
  readonly trigger: HTMLElement | null;
}

/**
 * Shield the injected row from the host menu's pointer bookkeeping.
 *
 * @param options - the injected container and the menu's trigger button.
 * @returns a disposer that removes every listener and timer.
 */
export function installHostMenuShield(options: HostMenuShieldOptions): () => void {
  const { container, trigger } = options;
  let interval: ReturnType<typeof setInterval> | null = null;

  const stopInterval = (): void => {
    if (interval === null) return;
    clearInterval(interval);
    interval = null;
  };

  const cancel = (): void => {
    cancelPendingMenuClose(trigger, trigger?.isConnected !== true);
  };

  const startInterval = (): void => {
    cancel();
    if (interval !== null || trigger === null) return;
    interval = setInterval(cancel, CANCEL_INTERVAL_MS);
  };

  const onHover = (): void => {
    startInterval();
  };
  const onLeave = (): void => {
    stopInterval();
    cancel();
  };
  const seal = (event: Event): void => {
    event.stopPropagation();
  };

  for (const type of HOVER_EVENTS) container.addEventListener(type, onHover, true);
  container.addEventListener("pointerleave", onLeave, true);
  for (const type of SEALED_EVENTS) container.addEventListener(type, seal, false);

  return () => {
    stopInterval();
    for (const type of HOVER_EVENTS) container.removeEventListener(type, onHover, true);
    container.removeEventListener("pointerleave", onLeave, true);
    for (const type of SEALED_EVENTS) container.removeEventListener(type, seal, false);
  };
}
