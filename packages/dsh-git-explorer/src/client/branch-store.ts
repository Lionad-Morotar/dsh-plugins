/**
 * The branch inventory shared by the header trigger and, later, the view.
 *
 * One store per client apply: the header action and any other subscriber see
 * the same snapshot, which is what lets a successful switch be noticed outside
 * the popover. `useSyncExternalStore` compares snapshots by identity, so a
 * state object is replaced only when something changed; a read that changes
 * nothing returns the previous object.
 */
import type { GitBranchList, GitBranchListResult, GitSwitchResult } from "../host/types.ts";
import { describeFailure, unwrapTransport, type RemoteResolver } from "./wire.ts";

/** Marker for "the host half was not readable", localized by the panel. */
export const SERVICE_UNAVAILABLE = "service-unavailable";

/** What the trigger and the popover read. */
export interface BranchListState {
  readonly status: "idle" | "loading" | "ready" | "error";
  /** Last inventory read; kept across a reload so rows do not blink. */
  readonly list?: GitBranchList;
  /** Host or transport message, or {@link SERVICE_UNAVAILABLE}. */
  readonly error?: string;
  /**
   * Monotonic counter of successful switches.
   *
   * It lives on the snapshot rather than in a separate signal so a subscriber
   * that reloads on change reads the same object as everything else.
   */
  readonly revision: number;
  /** Session the snapshot belongs to; null before the first load. */
  readonly sessionId: string | null;
}

/** The seam the header action consumes, narrow enough to fake in a test. */
export interface BranchStoreFace {
  subscribe(listener: () => void): () => void;
  getSnapshot(): BranchListState;
  /** Read the inventory; a snapshot already at this revision is a no-op. */
  load(sessionId: string): Promise<void>;
  /** Switch and, on success, adopt the host's branch as current. */
  switchTo(sessionId: string, name: string): Promise<boolean>;
  /** Announce an external change (another surface wrote the branch). */
  bump(): void;
}

const IDLE: BranchListState = Object.freeze({ status: "idle", revision: 0, sessionId: null });

/**
 * Build one store over the host's Remote face.
 * @param remote - resolver read on every call, because the host half may load
 * after this bundle mounts.
 * @returns the store the header action binds to.
 */
export function createBranchStore(remote: RemoteResolver): BranchStoreFace {
  let state = IDLE;
  let loadedRevision = -1;
  let requestTicket = 0;
  const listeners = new Set<() => void>();

  const publish = (next: BranchListState): void => {
    state = next;
    for (const listener of [...listeners]) listener();
  };

  /** A load is pointless only when the very same read is already in hand. */
  const isFresh = (sessionId: string): boolean =>
    state.sessionId === sessionId &&
    state.status === "ready" &&
    state.error === undefined &&
    state.list !== undefined &&
    loadedRevision === state.revision;

  const load = async (sessionId: string): Promise<void> => {
    if (isFresh(sessionId)) return;
    const face = remote();
    const ticket = ++requestTicket;
    const revision = state.revision;
    const sameSession = state.sessionId === sessionId;
    publish({
      status: "loading",
      ...(sameSession && state.list !== undefined ? { list: state.list } : {}),
      revision,
      sessionId,
    });
    /** A newer load or a switch that landed first outranks this response. */
    const stale = (): boolean => ticket !== requestTicket || state.revision !== revision;

    if (typeof face?.branches !== "function") {
      if (stale()) return;
      publish({ status: "error", error: SERVICE_UNAVAILABLE, revision, sessionId });
      return;
    }

    try {
      const transport = await face.branches({ sessionId });
      if (stale()) return;
      const unwrapped = unwrapTransport<GitBranchListResult>(transport);
      if (!unwrapped.ok) {
        publish({ status: "error", error: unwrapped.message, revision, sessionId });
        return;
      }
      if (unwrapped.result.ok === false) {
        publish({ status: "error", error: unwrapped.result.error.message, revision, sessionId });
        return;
      }
      loadedRevision = revision;
      publish({ status: "ready", list: unwrapped.result.list, revision, sessionId });
    } catch (error) {
      if (stale()) return;
      publish({ status: "error", error: describeFailure(error), revision, sessionId });
    }
  };

  const switchTo = async (sessionId: string, name: string): Promise<boolean> => {
    const face = remote();
    if (typeof face?.switchBranch !== "function") {
      publish({ ...state, error: SERVICE_UNAVAILABLE });
      return false;
    }
    try {
      const transport = await face.switchBranch({ sessionId, name });
      const unwrapped = unwrapTransport<GitSwitchResult>(transport);
      const message = !unwrapped.ok
        ? unwrapped.message
        : unwrapped.result.ok === false
          ? unwrapped.result.error.message
          : undefined;
      if (message !== undefined) {
        // The list stays as it was: the switch was refused, so the rows still
        // describe the worktree and only the message row is new.
        publish({ ...state, error: message });
        return false;
      }
      const branch = unwrapped.ok && unwrapped.result.ok === true ? unwrapped.result.branch : name;
      const list = state.list;
      publish({
        status: list === undefined ? state.status : "ready",
        ...(list === undefined
          ? {}
          : { list: { ...list, detached: false, headHash: null, branches: list.branches.map(entry => ({ ...entry, current: entry.name === branch })) } }),
        revision: state.revision + 1,
        sessionId,
      });
      return true;
    } catch (error) {
      publish({ ...state, error: describeFailure(error) });
      return false;
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => state,
    load,
    switchTo,
    bump() {
      publish({ ...state, revision: state.revision + 1 });
    },
  };
}
