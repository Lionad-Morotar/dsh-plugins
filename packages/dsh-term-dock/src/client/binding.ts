/**
 * The adapter between one host `TerminalView` and one emulator.
 *
 * Two contracts meet here and neither side may leak into the other:
 *
 * - The host owns the process, the grid and the backpressure window. It hands a
 *   `render` frame with a revision and refuses to deliver the next frame until
 *   that revision is acknowledged, so the emulator's write callback is the only
 *   correct place to acknowledge from.
 * - The emulator owns pixels. It cannot see a `TerminalView`, so everything it
 *   needs (initial screen, output bytes, size) is pushed to it through a sink.
 *
 * React-free on purpose: the acceptance probe and the unit tests drive this file
 * with a plain fake view, which is the only way to prove the acknowledge sequence
 * without a browser.
 */

/** Terminal grid limits and scrollback the host reports for this session. */
export interface TerminalEnvironment {
  readonly maxCols: number;
  readonly maxRows: number;
  readonly scrollback?: number;
}

/** Process metadata of the host terminal behind one view. */
export interface TerminalInfo {
  readonly cols: number;
  readonly rows: number;
  readonly state?: "running" | "exited" | "failed";
  readonly exitCode?: number;
  readonly error?: string;
}

/** One screen frame the host wants painted. */
export type TerminalRenderFrame =
  | { readonly type: "snapshot"; readonly info: TerminalInfo; readonly screen: string }
  | { readonly type: "output"; readonly data: string }
  | { readonly type: "state"; readonly info: TerminalInfo };

/** What one `TerminalView` publishes. */
export interface TerminalViewState {
  readonly phase: string;
  readonly writable?: boolean;
  readonly issue?: string;
  readonly error?: string;
  readonly title?: string;
  readonly info?: TerminalInfo;
  readonly environment?: TerminalEnvironment;
  readonly render?: { readonly revision: number; readonly frame: TerminalRenderFrame };
}

/** Observable face of a `TerminalView`. */
export interface TerminalViewStateStore {
  getSnapshot(): TerminalViewState;
  subscribe(listener: () => void): () => void;
}

/**
 * The host `TerminalView` members this package uses.
 *
 * Structural rather than imported: the host package is not a dependency of a
 * plugin bundle, and a missing method has to degrade the panel, not throw during
 * module evaluation.
 */
export interface TerminalViewLike {
  readonly state: TerminalViewStateStore;
  /** Attach the DOM lifetime; the returned detach leaves the process alive. */
  mount(): () => void;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  acknowledge(revision: number): void;
  /** Terminate the process; returns a promise in the host implementation. */
  close(): unknown;
  /** Stop client work without touching the process. */
  dispose(): unknown;
}

/** Where the emulator accepts bytes. */
export interface EmulatorSink {
  /** Paint text; `done` must fire after the emulator has parsed it. */
  write(data: string, done: () => void): void;
  /** Throw the screen away and adopt a snapshot's grid. */
  reset(cols: number, rows: number): void;
}

/** A grid size actually requested from the host. */
export interface TerminalGrid {
  readonly cols: number;
  readonly rows: number;
}

/** The per-panel binding the dock and the chunk both use. */
export interface TerminalBinding {
  /** Stable panel key inside one session. */
  readonly key: string;
  readonly state: TerminalViewStateStore;
  /** Start the shell once; repeated calls reuse the first detach. */
  attach(): () => void;
  /** Push emulator input to the process. */
  input(data: string): void;
  /**
   * Fit the view to a measured cell grid, clamped to the host's limits.
   * @returns the grid actually requested, or undefined when the view cannot resize.
   */
  fit(width: number, height: number): TerminalGrid | undefined;
  /** Acknowledge one painted frame so the host releases the next one. */
  acknowledge(revision: number): void;
  /** Follow the view's render frames into an emulator; returns the unsubscribe. */
  attachEmulator(sink: EmulatorSink): () => void;
  /** Terminate the process and detach. */
  close(): void;
  /** Detach without terminating; used when the plugin itself is disposed. */
  dispose(): void;
}

/** How the binding reaches its view; a getter because views are replaced on recovery. */
export interface TerminalBindingInput {
  view: () => TerminalViewLike;
  key: string;
}

/** Swallow a promise rejection we are not going to await. */
function settleQuietly(result: unknown): void {
  if (result !== null && typeof result === "object" && "catch" in result) {
    void (result as Promise<unknown>).catch(() => {});
  }
}

/**
 * Create the binding for one terminal panel.
 * @param input - the view getter and the panel key.
 * @returns the binding; nothing is mounted until `attach`.
 */
export function createTerminalBinding({ view, key }: TerminalBindingInput): TerminalBinding {
  let detach: (() => void) | null = null;

  const release = (): void => {
    const current = detach;
    detach = null;
    current?.();
  };

  /**
   * Build the disposer `attach` hands back.
   *
   * It clears the binding's own pointer as well as calling the host's detach:
   * a panel that unmounts (a session switch, a minimized dock) must be able to
   * mount again, and a stale detach would silently keep the next `attach` from
   * ever calling `view.mount()`.
   */
  const createDetacher = (mounted: () => void): (() => void) => {
    let released = false;
    const disposer = (): void => {
      if (released) return;
      released = true;
      if (detach === disposer) detach = null;
      mounted();
    };
    return disposer;
  };

  const store: TerminalViewStateStore = {
    getSnapshot: () => view().state.getSnapshot(),
    subscribe: listener => view().state.subscribe?.(listener) ?? (() => {}),
  };

  return {
    key,
    state: store,
    attach() {
      if (detach !== null) return detach;
      const mounted = view().mount();
      const disposer = createDetacher(typeof mounted === "function" ? mounted : () => {});
      detach = disposer;
      return disposer;
    },
    input(data) {
      const current = view().state.getSnapshot();
      if (current.writable === false) return;
      if (data.length === 0) return;
      view().write(data);
    },
    fit(width, height) {
      const current = view().state.getSnapshot();
      const environment = current.environment;
      if (environment === undefined) return undefined;
      if (current.writable === false) return undefined;
      if (!Number.isFinite(width) || !Number.isFinite(height)) return undefined;
      const cols = Math.min(Math.max(Math.trunc(width), 2), environment.maxCols);
      const rows = Math.min(Math.max(Math.trunc(height), 1), environment.maxRows);
      view().resize(cols, rows);
      return { cols, rows };
    },
    acknowledge(revision) {
      view().acknowledge(revision);
    },
    attachEmulator(sink) {
      const target = view();
      let lastRevision = 0;
      const drain = (): void => {
        const snapshot = target.state.getSnapshot();
        const render = snapshot.render;
        if (render === undefined || render.revision <= lastRevision) return;
        lastRevision = render.revision;
        const frame = render.frame;
        if (frame.type === "snapshot") {
          sink.reset(frame.info.cols, frame.info.rows);
          sink.write(frame.screen, () => target.acknowledge(render.revision));
          return;
        }
        if (frame.type === "output") {
          sink.write(frame.data, () => target.acknowledge(render.revision));
          return;
        }
        // A state frame carries metadata only. Acknowledging it keeps the stream
        // moving if the host ever routes one through the render slot.
        target.acknowledge(render.revision);
      };
      const unsubscribe = target.state.subscribe?.(drain) ?? (() => {});
      drain();
      return unsubscribe;
    },
    close() {
      const target = view();
      settleQuietly(target.close());
      release();
    },
    dispose() {
      const target = view();
      settleQuietly(target.dispose());
      release();
    },
  };
}
