/**
 * The conversation view that hosts the architecture chrome.
 *
 * Files and Git register a React component on `conversation.view`. The chrome
 * itself stays imperative DOM (the dock kind still mounts it that way), so this
 * view is only the React shell the slot contract requires: it fills the tab
 * body and hands that element to `mountArchChrome`.
 *
 * The shell remounts the component on every tab entry and unmounts it on exit,
 * which is the chrome's own lifecycle: load on mount, flush on unmount.
 */
import { useEffect, useMemo, useRef, type ReactElement } from "react";

import type { ArchChromeOptions, ArchFocusSeam, NodeReferenceSeam } from "./chrome.tsx";
import { mountArchChrome } from "./chrome.tsx";
import { subscribeArchFocus, takeArchFocus } from "./focus-store.ts";
import { archReferenceFromModel, type ArchInsertionResult, type ArchReferencePayload } from "./reference.ts";
import { ROUTE_PREFIX } from "../shared.ts";
import { createArchViewMemoryRegistry } from "./view-memory.ts";

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
  /**
   * The composer's standard props. `conversation.view` is a session-scope slot,
   * so the host hands these to every entry; optional here because the view also
   * mounts in tests and on hosts that publish neither.
   */
  readonly inputActions?: InputActionsFace;
}

/** The slice of the composer face the reference write reads. */
export interface InputActionsFace {
  captureInsertion?(): { readonly start: number; readonly end: number; readonly draftRev: number };
  insertText?(
    text: string,
    span: { readonly start: number; readonly end: number; readonly draftRev: number },
  ): boolean;
}

/** What the entry injects so the view can reach the session's composer facade. */
export type InsertReferenceSeam = (
  sessionId: string,
  payload: ArchReferencePayload,
  actions: InputActionsFace,
  /** Whether the chip's trigger source is registered, so a chip could be sent. */
  sourceAvailable: boolean,
) => ArchInsertionResult;

/** What one view mount closes over. */
export interface ArchViewWiring {
  /** Chrome options minus the session, which the host supplies per mount. */
  readonly chrome: Omit<ArchChromeOptions, "sessionId">;
  /** The session input facade, probed per click; absent on hosts without one. */
  readonly insertReference?: InsertReferenceSeam;
  /**
   * Whether the chip's trigger source is registered right now.
   *
   * A getter because registration can land after this view is built, and a
   * boolean captured here would keep the button hidden on a host that finished
   * wiring the source a moment later.
   */
  readonly referenceSourceAvailable?: () => boolean;
}

/**
 * Read one element out of the model route.
 *
 * The route is the only place that knows the definition line and the code
 * path, so the reference asks it rather than re-deriving either. A failed or
 * partial fetch still yields a payload: an element with no source and no code
 * is a reference that names the element and nothing more.
 * @param sessionId - the session whose workspace the panel is showing.
 * @param nodeId - the element to reference.
 * @param fetchImpl - fetch implementation, injected by tests.
 * @returns the payload, or undefined when the model does not have the element.
 */
export async function fetchArchReferencePayload(
  sessionId: string,
  nodeId: string,
  fetchImpl: typeof fetch,
): Promise<ArchReferencePayload | undefined> {
  const response = await fetchImpl(`${ROUTE_PREFIX}/model?sessionId=${encodeURIComponent(sessionId)}`);
  if (!response.ok) return undefined;
  const model = (await response.json()) as Parameters<typeof archReferenceFromModel>[0];
  return archReferenceFromModel(model, nodeId);
}

/**
 * Take whatever focus request is waiting and hand it to the mounted chrome.
 *
 * Exported because it is the view's whole side-effect surface: the effect only
 * decides *when* to call it, and a test can drive this half without a React
 * tree. A request that arrives with no chrome behind the seam is dropped, which
 * is the same outcome as one that arrives before the chrome exists.
 * @param seam - the object `mountArchChrome` fills `focus` into.
 */
export function consumeArchFocus(seam: ArchFocusSeam): void {
  const id = takeArchFocus();
  if (id === undefined) return;
  seam.focus?.(id);
}

/**
 * Build the conversation view component.
 *
 * @param wiring - the chrome seams the entry already composed.
 * @returns a component the slot registry can mount.
 */
export function createArchView({ chrome, insertReference, referenceSourceAvailable }: ArchViewWiring) {
  // The selection per session: the host unmounts this view on every tab switch,
  // so the element the reader picked lives in this factory closure instead of
  // the chrome, which is rebuilt from scratch on each mount.
  const memoryRegistry = createArchViewMemoryRegistry();
  function ArchView(props: ConversationViewProps): ReactElement {
    const hostRef = useRef<HTMLDivElement>(null);
    const sessionId = props.sessionId;
    // What this conversation remembers from its last mount. Mutated in place,
    // so the next mount of the same session reads exactly what this one left.
    const memory = useMemo(() => memoryRegistry.forSession(sessionId), [memoryRegistry, sessionId]);
    // The composer face is recreated by the host on every render, so it is
    // held in a ref: putting it in the effect's dependencies would remount the
    // whole chrome (and re-fetch the model) on every keystroke in the composer.
    const actionsRef = useRef(props.inputActions);
    actionsRef.current = props.inputActions;
    // Same reason: the wiring object is rebuilt by the entry's composition root
    // on every apply, and it must not restart the chrome mid-read.
    const chromeRef = useRef(chrome);
    chromeRef.current = chrome;
    // The chrome fills this in when it mounts; the focus effect below reads it
    // through the same object rather than through a state update, because a
    // selection request must not re-render (and remount) the diagram.
    const focusSeamRef = useRef<ArchFocusSeam>({});
    const focusSeam = focusSeamRef.current;
    const hasComposer = props.inputActions !== undefined && insertReference !== undefined;

    useEffect(() => {
      const host = hostRef.current;
      if (host === null) return;
      const seam: NodeReferenceSeam = {
        // The source is part of the capability, not just the composer: a chip
        // with no codec is refused at send time and strands the draft, so the
        // button is not drawn at all when the source is missing.
        available: sessionId !== undefined && hasComposer && referenceSourceAvailable?.() === true,
        async insert(nodeId: string): Promise<void> {
          const actions = actionsRef.current;
          if (sessionId === undefined || actions === undefined || insertReference === undefined) return;
          const current = chromeRef.current;
          const payload = await fetchArchReferencePayload(sessionId, nodeId, current.fetchImpl ?? fetch);
          if (payload === undefined) return;
          // Read again here: the source can be disposed between the paint that
          // drew the button and this click.
          insertReference(sessionId, payload, actions, referenceSourceAvailable?.() === true);
        },
      };
      return mountArchChrome(host, {
        ...chromeRef.current,
        sessionId,
        nodeReference: seam,
        focusSeam,
        initialSelection: memory.selectedId,
        onSelectionChange: id => {
          if (id === null) delete memory.selectedId;
          else memory.selectedId = id;
        },
      });
    }, [sessionId, memory, hasComposer, insertReference, referenceSourceAvailable]);

    // The chip click that caused this mount filed its element before the tab
    // was pressed, so the request is already waiting here. The subscription
    // covers the other order: a click while the panel is up. Both run after the
    // mount effect above, which is what fills `focusSeam.focus` in.
    useEffect(() => {
      const apply = (): void => {
        consumeArchFocus(focusSeam);
      };
      apply();
      return subscribeArchFocus(apply);
    }, []);

    return (
      <div
        ref={hostRef}
        data-arch-view=""
        style={{ width: "100%", height: "100%", minHeight: 0, overflow: "hidden" }}
      />
    );
  }

  return ArchView;
}
