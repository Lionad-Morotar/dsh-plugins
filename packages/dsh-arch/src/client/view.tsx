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
import { useEffect, useRef, type ReactElement } from "react";

import type { ArchChromeOptions } from "./chrome.tsx";
import { mountArchChrome } from "./chrome.tsx";

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/** What one view mount closes over. */
export interface ArchViewWiring {
  /** Chrome options minus the session, which the host supplies per mount. */
  readonly chrome: Omit<ArchChromeOptions, "sessionId">;
}

/**
 * Build the conversation view component.
 *
 * @param wiring - the chrome seams the entry already composed.
 * @returns a component the slot registry can mount.
 */
export function createArchView({ chrome }: ArchViewWiring) {
  function ArchView(props: ConversationViewProps): ReactElement {
    const hostRef = useRef<HTMLDivElement>(null);
    const sessionId = props.sessionId;

    useEffect(() => {
      const host = hostRef.current;
      if (host === null) return;
      return mountArchChrome(host, { ...chrome, sessionId });
    }, [sessionId]);

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
