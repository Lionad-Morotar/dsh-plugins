/**
 * The slices of React, React DOM and the host UI primitives this panel uses.
 *
 * None of them is a dependency of this package: the host seeds `react`,
 * `react-dom` and `@deepseek-ai/dsh-client-ui-primitives` as platform modules
 * through the loader factory's `require`, so each can only be reached as an
 * injected value. Narrowing them to the exact members the panel calls keeps that
 * seam honest — a host that shims React without `useSyncExternalStore` is caught
 * where it is resolved, not on first render.
 */

export interface ReactSlice {
  createElement(type: unknown, props?: unknown, ...children: unknown[]): unknown;
  useState<T>(initial: T | (() => T)): [T, (next: T | ((prev: T) => T)) => void];
  useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  useRef<T>(initial: T): { current: T };
  useSyncExternalStore<T>(subscribe: (listener: () => void) => () => void, getSnapshot: () => T): T;
}

export interface PanelDomSlice {
  createPortal(node: unknown, container: Element): unknown;
}

/**
 * The host UI primitives the panel reuses instead of reimplementing.
 *
 * `useModalLayer` is the whole modal contract in one call: stack ownership,
 * Escape to close (repeat ignored), Tab cycling, `data-modal-autofocus` for the
 * initial focus, focus restoration on close, and composition guards.
 * `observeComposition` is the input-method gate the host itself uses, including
 * the one-shot `ended` flag that stops the committing Enter from confirming a
 * row.
 */
export interface PanelPrimitives {
  useModalLayer(dialog: { current: HTMLElement | null }, open: boolean, onClose: () => void): void;
  observeComposition(doc: Document): { guards(event: KeyboardEvent): boolean; dispose(): void };
}
