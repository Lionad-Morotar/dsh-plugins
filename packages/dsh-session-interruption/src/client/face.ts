/**
 * The injected face the three row seats share.
 *
 * One object per page, built once in `apply` and handed to every entry through
 * its inject share: reads go through the host list snapshot, refreshes ride the
 * host's projection read (which never opens a conversation), and dismissals
 * live in localStorage as a pure presentation preference. List changes fan out
 * to subscribed entries; dismissal writes do the same, so a menu action hides
 * the marker in the same frame.
 */
import { readDismissed, selectReading, writeDismiss, type InterruptionReading, type SessionListWire, type StorageLike } from "./reading.ts";

/** The slice of `ctx.sessions` this face reads. */
export interface SessionsLike {
  readonly list: {
    readonly getSnapshot: () => unknown;
    readonly subscribe: (onChange: () => void) => () => void;
  };
  /** Host read of one session's projections; resolves without opening the conversation. */
  readonly refreshProjections: (sessionId: string) => Promise<void>;
}

/** What the seat components consume. */
export interface InterruptionFace {
  /** The row's current reading, or undefined when nothing should render. */
  readonly read: (sessionId: string) => InterruptionReading | undefined;
  /** Ask the host to recompute one session's projections; errors are swallowed. */
  readonly refresh: (sessionId: string) => void;
  /** Subscribe to list and dismissal changes; returns the disposer. */
  readonly subscribe: (onChange: () => void) => () => void;
  /** Record one dismissal and notify every subscriber. */
  readonly dismiss: (sessionId: string, turnStartSeq: number) => void;
}

/** A face the plugin owner can stop. */
export interface ManagedInterruptionFace extends InterruptionFace {
  /** Release the list subscription; the apply disposer calls this. */
  readonly dispose: () => void;
}

/**
 * Resolve the dismissal store: the browser's localStorage when present, an
 * in-memory stand-in otherwise, so a headless mount never crashes on storage.
 * @returns a usable storage.
 */
function browserStorage(): StorageLike {
  const direct = (globalThis as { localStorage?: StorageLike }).localStorage;
  if (direct !== undefined) return direct;
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

/**
 * Build the shared face over the host sessions service.
 * @param sessions - the host sessions slice.
 * @param storage - dismissal backing store; defaults to the browser's localStorage.
 * @returns the face with its disposer.
 */
export function buildInterruptionFace(sessions: SessionsLike, storage: StorageLike = browserStorage()): ManagedInterruptionFace {
  let dismissed = readDismissed(storage);
  const listeners = new Set<() => void>();
  const emit = (): void => {
    for (const listener of listeners) listener();
  };
  const stopList = sessions.list.subscribe(emit);
  return {
    read(sessionId: string): InterruptionReading | undefined {
      const reading = selectReading(sessions.list.getSnapshot() as SessionListWire, sessionId);
      if (reading === undefined) return undefined;
      if (reading.turnStartSeq !== null && dismissed[sessionId] === reading.turnStartSeq) return undefined;
      return reading;
    },
    refresh(sessionId: string): void {
      sessions.refreshProjections(sessionId).catch(() => {});
    },
    subscribe(onChange: () => void): () => void {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
    dismiss(sessionId: string, turnStartSeq: number): void {
      dismissed = writeDismiss(storage, sessionId, turnStartSeq);
      emit();
    },
    dispose(): void {
      stopList();
    },
  };
}
