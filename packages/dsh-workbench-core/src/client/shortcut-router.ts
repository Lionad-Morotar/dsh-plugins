/**
 * The web shell's global chord router.
 *
 * The host shortcut service admits only a narrow set of web combinations:
 * `Ctrl+Shift+E/G/M` is rejected as `unsupported-browser`, so the three global
 * workbench commands carry no host binding on web. The browser still dispatches
 * the keydown, so this module gives the bundle a local, capture-phase route for
 * exactly those chords.
 *
 * Desktop never installs it. The native menu accelerator owns the same
 * combinations there, and a second listener would run every command twice.
 *
 * Matching is deliberately exact: an event that is already handled, carries an
 * extra modifier, or is not in the table stays with the page. The router only
 * calls `preventDefault` after a chord matched, so a miss never swallows a
 * browser or host gesture.
 */

/** One chord the local router owns, keyed by physical `KeyboardEvent.code`. */
export interface GlobalKeyRoute {
  readonly code: string;
  readonly commandId: string;
}

/** The three chords the host refuses on web but the browser still dispatches. */
export const GLOBAL_KEY_ROUTES: readonly GlobalKeyRoute[] = Object.freeze([
  { code: "KeyE", commandId: "workbench.files.toggle" },
  { code: "KeyG", commandId: "workbench.git.toggle" },
  { code: "KeyM", commandId: "workbench.term.toggle" },
]);

/** The keyboard fields the matcher reads; a real `KeyboardEvent` satisfies all of them. */
export interface GlobalKeyEvent {
  readonly code?: string;
  readonly ctrlKey?: boolean;
  readonly shiftKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
  readonly defaultPrevented?: boolean;
  preventDefault?(): void;
}

/** The window surface the router attaches to; a real `window` satisfies it. */
export interface GlobalKeyTarget {
  addEventListener(type: "keydown", listener: (event: KeyboardEvent) => void, capture?: boolean): void;
  removeEventListener(type: "keydown", listener: (event: KeyboardEvent) => void, capture?: boolean): void;
}

/** What the router does with a matched chord. */
export interface GlobalKeyRouterOptions {
  /** Run one workbench command; the entry wires this to `commands.ts`. */
  run(commandId: string): void;
  /** Attach immediately when provided. Node tests omit it and call `handle`. */
  target?: GlobalKeyTarget;
}

/** The node-drivable seam the acceptance probe exercises. */
export interface GlobalKeyRouter {
  /** @returns true only when the event matched a routed chord. */
  handle(event: GlobalKeyEvent): boolean;
  /** Detach the window listener and stop handling further events. */
  dispose(): void;
}

/**
 * Whether a shortcut service runs in the browser shell.
 * @param shortcuts - the host shortcut service, or undefined outside a host.
 * @returns true only for the web shell; a missing runtime is treated as desktop.
 */
export function isWebShortcutRuntime(
  shortcuts: { readonly runtime?: string } | undefined | null,
): boolean {
  return shortcuts?.runtime === "web";
}

/**
 * Build the router for one mount.
 * @param options - command sink and an optional window-like target.
 * @returns the `{ handle, dispose }` seam; no DOM is required when `target` is omitted.
 */
export function createGlobalKeyRouter({ run, target }: GlobalKeyRouterOptions): GlobalKeyRouter {
  const routes = new Map(GLOBAL_KEY_ROUTES.map(route => [route.code, route.commandId]));
  let disposed = false;

  const handle = (event: GlobalKeyEvent): boolean => {
    if (disposed) return false;
    if (event.defaultPrevented === true) return false;
    if (event.ctrlKey !== true || event.shiftKey !== true) return false;
    if (event.metaKey === true || event.altKey === true) return false;
    const commandId = routes.get(event.code ?? "");
    if (commandId === undefined) return false;
    event.preventDefault?.();
    run(commandId);
    return true;
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    handle(event);
  };
  target?.addEventListener("keydown", onKeyDown, true);

  return {
    handle,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      target?.removeEventListener("keydown", onKeyDown, true);
    },
  };
}

/**
 * Install the router only where it is needed.
 *
 * The runtime guard is the whole point: web gets the local route because the
 * host registry cannot carry these chords, desktop keeps the native binding.
 * @param options - runtime, command sink and window-like target.
 * @returns a disposer; a no-op on desktop or without a target.
 */
export function installGlobalKeyRouter(options: {
  readonly runtime?: string;
  run(commandId: string): void;
  target?: GlobalKeyTarget;
}): () => void {
  if (!isWebShortcutRuntime({ runtime: options.runtime })) return () => {};
  if (options.target === undefined) return () => {};
  const router = createGlobalKeyRouter({ run: options.run, target: options.target });
  return () => router.dispose();
}
