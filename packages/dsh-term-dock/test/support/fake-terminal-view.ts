import type { TerminalRenderFrame, TerminalViewLike, TerminalViewState } from "../../src/client/binding.ts";

/** A host terminal view that records every call instead of spawning a shell. */
export interface FakeTerminalView extends TerminalViewLike {
  readonly calls: string[];
  setState(patch: Partial<TerminalViewState>): void;
  emitRender(revision: number, frame: TerminalRenderFrame): void;
}

/**
 * Build a recording terminal view.
 * @param initial - starting snapshot; defaults to a ready 120x40 grid.
 * @returns the view and its call log.
 */
export function createFakeTerminalView(
  initial: TerminalViewState = { phase: "ready", writable: true, environment: { maxCols: 120, maxRows: 40 } },
): FakeTerminalView {
  const listeners = new Set<() => void>();
  const calls: string[] = [];
  let state: TerminalViewState = initial;
  const publish = (next: TerminalViewState): void => {
    state = next;
    for (const listener of listeners) listener();
  };

  return {
    calls,
    state: {
      getSnapshot: () => state,
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    },
    mount() {
      calls.push("mount");
      return () => calls.push("detach");
    },
    write(data) {
      calls.push(`write:${data}`);
    },
    resize(cols, rows) {
      calls.push(`resize:${cols}x${rows}`);
    },
    acknowledge(revision) {
      calls.push(`ack:${revision}`);
    },
    close() {
      calls.push("close");
      return Promise.resolve();
    },
    dispose() {
      calls.push("dispose");
      return Promise.resolve();
    },
    setState(patch) {
      publish({ ...state, ...patch });
    },
    emitRender(revision, frame) {
      publish({ ...state, render: { revision, frame } });
    },
  };
}
