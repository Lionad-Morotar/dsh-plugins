/**
 * The branch inventory shared by the header trigger and the Git view.
 *
 * The browser half has exactly one active store: the entry point builds it once
 * per apply, the header action writes to it and the conversation view watches
 * its revision, which is what lets a successful switch refresh the panel
 * without a second channel between the two surfaces. `useSyncExternalStore`
 * compares snapshots by identity, so a state object is replaced only when
 * something changed; a read that changes nothing returns the previous object.
 */
import type {
  GitBranchList,
  GitBranchListResult,
  GitSwitchResult,
  GitSwitchStashOutcome,
} from "../host/types.ts";
import { describeFailure, unwrapTransport, type RemoteResolver } from "./wire.ts";

/** Marker for "the host half was not readable", localized by the panel. */
export const SERVICE_UNAVAILABLE = "service-unavailable";

/**
 * What one switch request produced.
 *
 * A boolean used to be enough, but the automatic stash makes the outcome richer
 * than accepted or refused: the popover has to know whether the changes came
 * back or stayed parked in a conflicted stash. The stash report is only carried
 * on a successful switch; a refusal has nothing to restore.
 */
export interface BranchSwitchOutcome {
  readonly switched: boolean;
  /** What the automatic stash did; absent when the host refused the switch. */
  readonly stash?: GitSwitchStashOutcome;
}

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
  /**
   * Switch and, on success, adopt the host's branch as current.
   *
   * The reply is adopted only while the snapshot still belongs to `sessionId`;
   * one that lands after the store moved to another session is dropped, since
   * its optimistic patch and its stash report would describe the wrong
   * worktree. The resolved outcome still reports whether the host accepted the
   * switch.
   */
  switchTo(sessionId: string, name: string): Promise<BranchSwitchOutcome>;
  /** Announce an external change (another surface wrote the branch). */
  bump(): void;
}

const IDLE: BranchListState = Object.freeze({ status: "idle", revision: 0, sessionId: null });

/** The store the current apply installed; absent before the browser half mounts. */
let installed: BranchStoreFace | undefined;

/**
 * Build one store over the host's Remote face.
 * @param remote - resolver read on every call, because the host half may load
 * after this bundle mounts.
 * @returns a store the header action binds to.
 */
function buildBranchStore(remote: RemoteResolver): BranchStoreFace {
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

  const switchTo = async (sessionId: string, name: string): Promise<BranchSwitchOutcome> => {
    /**
     * Whether a load for another session has published since the call started.
     * `load` reports its session before awaiting, so this comparison is already
     * decisive by the time the reply lands; `load`'s ticket cannot be reused
     * here because a switch starts no read of its own to compare against.
     */
    const displaced = (): boolean => state.sessionId !== sessionId;
    const face = remote();
    if (typeof face?.switchBranch !== "function") {
      if (!displaced()) publish({ ...state, error: SERVICE_UNAVAILABLE });
      return { switched: false };
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
        if (!displaced()) publish({ ...state, error: message });
        return { switched: false };
      }
      // The host switched, but the snapshot now belongs to another session:
      // report the outcome without naming that branch current in the wrong
      // tree, and without handing this popover another worktree's stash report.
      if (displaced()) return { switched: true };
      const result = unwrapped.ok && unwrapped.result.ok === true ? unwrapped.result : undefined;
      const branch = result === undefined ? name : result.branch;
      const list = state.list;
      publish({
        status: list === undefined ? state.status : "ready",
        ...(list === undefined
          ? {}
          : { list: { ...list, detached: false, headHash: null, branches: list.branches.map(entry => ({ ...entry, current: entry.name === branch })) } }),
        revision: state.revision + 1,
        sessionId,
      });
      return result === undefined || result.stash === undefined
        ? { switched: true }
        : { switched: true, stash: result.stash };
    } catch (error) {
      if (!displaced()) publish({ ...state, error: describeFailure(error) });
      return { switched: false };
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

/**
 * Build the store for one client apply and install it as the shared one.
 *
 * A repeat apply replaces it whole rather than carrying the previous state:
 * the Remote face it resolves through belongs to that apply, and an inventory
 * read from the previous mount would be stale anyway. Creating it here, rather
 * than lazily on first read, keeps the entry's one call the initialization
 * point for both surfaces.
 * @param remote - resolver the store reads on every call.
 * @returns the installed store the header action and the view both consume.
 */
export function initBranchStore(remote: RemoteResolver): BranchStoreFace {
  installed = buildBranchStore(remote);
  return installed;
}

/** Historical name the browser entry calls; it performs the same installation. */
export const createBranchStore = initBranchStore;

/**
 * The store installed by the current apply.
 * @returns the shared store, or undefined before the browser half mounts.
 */
export function getBranchStore(): BranchStoreFace | undefined {
  return installed;
}
