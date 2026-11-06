/**
 * The host's close-page tail, claimed by workbench views.
 *
 * On macOS and Windows Desktop the shell turns the close-page chord (⌘W, or
 * Ctrl+W on Windows) into the `page.close` command: close the focused
 * right-sidebar page, and when there is none, close the whole window through
 * the shortcut service's `closeWindow()`. A conversation view is not a
 * right-sidebar page — the host keeps no page record for it — so that fallback
 * used to take the application down while the reader had a file panel open.
 *
 * The host exposes no seam on the command itself, and a second registration on
 * the same chord would collide with `page.close`'s default, so the interception
 * happens one level down, at the method the fallback calls. Views claim the
 * gesture through {@link PageCloseFallback.register}; an unclaimed fallback
 * calls the host method unchanged, which keeps the window-close behaviour for
 * every surface that has nothing to close.
 *
 * Two properties matter for the host upgrade surface:
 * - the wrapper follows the command, not the chord, so rebinding `page.close`
 *   in the host shortcut settings keeps the behaviour intact;
 * - the service is patched on its raw instance, because Cordis hands out a
 *   traceable proxy per access and the host closure re-reads `ctx.shortcuts` on
 *   every call. Without the unwrap the wrapper would only shadow that proxy.
 */

/** One mounted view's claim on the host page-close gesture. */
export type PageCloser = () => boolean;

/** The fallback one entry apply holds; `release` balances the acquisition. */
export interface PageCloseFallback {
  /** Register a claim; the disposer removes it. */
  register(closer: PageCloser): () => void;
  /** Drop this owner; the last release restores the host method. */
  release(): void;
}

/** The slice of the host shortcut service the fallback wraps. */
export interface CloseWindowHost {
  closeWindow?(): Promise<void>;
}

/**
 * Symbols Cordis uses to hand out a service. The public surface is the traceable
 * proxy, and `symbols.original` is how that proxy exposes the raw instance.
 */
const CORDIS_ORIGINAL: unique symbol = Symbol.for("cordis.original") as typeof CORDIS_ORIGINAL;

/** One installed wrapper, shared by every apply that acquires it. */
interface Installed {
  readonly raw: CloseWindowHost;
  readonly closers: Set<PageCloser>;
  readonly warn: (message: string) => void;
  /** The method that was on the instance when the wrapper was installed. */
  readonly previous: () => Promise<void>;
  /** Whether {@link previous} was already an own property. */
  readonly hadOwn: boolean;
  readonly wrapper: () => Promise<void>;
  owners: number;
}

/** Installs keyed by the raw host object, so a double apply shares one wrapper. */
const installed = new WeakMap<object, Installed>();

/**
 * Unwrap the Cordis traceable proxy to the service instance it mirrors.
 *
 * Assignment through the proxy lands on the shadow the registry hands back, not
 * on the value the host closure captured, so the wrapper has to be installed on
 * the raw object. A plain test double has no marker symbol and is used as is.
 * @param service - the service, possibly a traceable proxy.
 * @returns the raw instance when the marker is present.
 */
export function unwrapHostService<T extends object>(service: T): T {
  const raw = (service as Record<PropertyKey, unknown>)[CORDIS_ORIGINAL];
  if (raw === null || typeof raw !== "object") return service;
  return raw as T;
}

/**
 * Install (or join) the page-close fallback over one host shortcut service.
 *
 * The first acquire wraps the raw `closeWindow`; every apply after that shares
 * the wrapper and the same closer set. The last release restores what was
 * there before, so a plugin unload leaves the host exactly as it was.
 * @param host - the host shortcut service, proxy or raw.
 * @param warn - reports a throwing claim without letting it block the fallback.
 * @returns the fallback a view registers into and its owning entry releases.
 */
export function acquirePageCloseFallback(host: CloseWindowHost, warn: (message: string) => void): PageCloseFallback {
  const raw = unwrapHostService(host);
  const key = raw as object;
  const existing = installed.get(key);
  if (existing !== undefined) {
    existing.owners += 1;
    return handleFor(existing);
  }

  const previous = raw.closeWindow;
  if (typeof previous !== "function") {
    // A host that never exposes the fallback has nothing to claim; the seam
    // still answers the feature packages so they need no version probe.
    return { register: () => () => {}, release: () => {} };
  }

  let state: Installed;
  const wrapper = function wrappedCloseWindow(this: CloseWindowHost): Promise<void> {
    // Claims run in registration order; the first one that answers `true` owns
    // the gesture. A throw is a view bug, not a reason to keep the window open,
    // so it is reported and the next claim (then the host) gets its turn.
    for (const closer of [...state.closers]) {
      let claimed = false;
      try {
        claimed = closer() === true;
      } catch (error) {
        state.warn(`page close claim failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      if (claimed) return Promise.resolve();
    }
    return state.previous.call(state.raw);
  };
  state = {
    raw,
    closers: new Set(),
    warn,
    previous,
    hadOwn: Object.prototype.hasOwnProperty.call(raw, "closeWindow"),
    wrapper,
    owners: 1,
  };
  installed.set(key, state);
  raw.closeWindow = wrapper;
  return handleFor(state);
}

/**
 * Build the per-owner handle over one installed wrapper.
 * @param state - the shared installation.
 * @returns register plus a refcounted release.
 */
function handleFor(state: Installed): PageCloseFallback {
  let released = false;
  return {
    register(closer: PageCloser): () => void {
      if (released) return () => {};
      state.closers.add(closer);
      return () => {
        state.closers.delete(closer);
      };
    },
    release: (): void => {
      if (released) return;
      released = true;
      state.owners -= 1;
      if (state.owners > 0) return;
      installed.delete(state.raw as object);
      // Another module instance may own the property by now (the desktop host
      // can load one bundle twice); restoring this wrapper would shadow it with
      // a closure whose claims are already gone.
      if (state.raw.closeWindow !== state.wrapper) return;
      if (state.hadOwn) {
        state.raw.closeWindow = state.previous;
        return;
      }
      delete state.raw.closeWindow;
    },
  };
}

/**
 * Whether the fallback currently owns the host method.
 *
 * Exported for the tests that pin the restore path; production code reads the
 * behaviour through {@link PageCloseFallback} only.
 * @param host - the host shortcut service the fallback wrapped.
 * @returns true while the wrapper is still installed.
 */
export function isPageCloseFallbackInstalled(host: CloseWindowHost): boolean {
  const state = installed.get(unwrapHostService(host) as object);
  return state !== undefined && state.raw.closeWindow === state.wrapper;
}
