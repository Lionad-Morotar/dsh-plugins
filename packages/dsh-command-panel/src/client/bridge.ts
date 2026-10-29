/**
 * The session bridge.
 *
 * A root-level plugin has no public way to ask "which session is on screen": the
 * host's selection store is private to the workspace service, and the de-facto
 * convention (`retainedBy.mainView > 0` in the catalogue snapshot) is a
 * convention, not an API. A `session`-scope slot is: it is mounted for exactly
 * the session being shown, and the framework hands every such entry the Session
 * standard props, including `sessionId` and the live `inputActions` face.
 *
 * So the plugin registers an invisible entry and publishes those two facts. That
 * buys the navigation mode a non-destructive insert — `insertText` at the caret
 * keeps the existing draft and the `@` reference chips — instead of replacing the
 * whole draft through the service layer.
 */

import type { InputActions } from "./dsh.ts";
import type { ReactSlice } from "./react.ts";

/** What one session-scope entry receives from the framework. */
export interface BridgeProps {
  readonly sessionId?: string;
  readonly inputActions?: InputActions;
}

/** The bridge's published fact; `inputActions` is absent on hosts without a composer. */
export interface BridgeState {
  readonly sessionId: string | null;
  readonly inputActions: InputActions | null;
}

/**
 * Build the invisible entry component.
 *
 * It calls no hooks of its own beyond one effect, so it is safe on a host that
 * hands it fewer props than expected: an entry without `sessionId` simply
 * publishes absence.
 *
 * @param React - React slice resolved from the platform module table.
 * @param publish - runtime sink for the published state.
 * @returns the component; it always renders null.
 */
export function createBridgeView(
  React: ReactSlice,
  publish: (state: BridgeState) => void,
): (props: unknown) => unknown {
  return function SessionBridgeView(props: unknown): unknown {
    const bridge = props as BridgeProps;
    const sessionId = bridge.sessionId ?? null;
    const inputActions = bridge.inputActions ?? null;

    // The effect must not depend on `inputActions` identity: the host recreates
    // that face on every render, and publishing it would wake the runtime, which
    // retains the session, which publishes a catalogue change, which renders the
    // host again — a loop that saturates the page instead of doing any work.
    // A ref carries the fresh value; a boolean carries "arrived or not".
    const latest = React.useRef<BridgeState>({ sessionId, inputActions });
    latest.current = { sessionId, inputActions };
    const connected = inputActions !== null;

    React.useEffect(() => {
      publish({ sessionId, inputActions: latest.current.inputActions });
    }, [sessionId, connected]);

    return null;
  };
}
