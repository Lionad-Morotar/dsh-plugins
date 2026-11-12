// @vitest-environment jsdom
/**
 * The blank-home frame's rendered behaviour.
 *
 * The component is the narrow seam between the Host's hero page and the
 * synthetic target: it must activate the target once, for the session whose
 * content root it sits in, and only while the Host says this is the blank
 * home. An ordinary conversation never reaches the activation branch.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BlankNewChatFrame } from "../src/client/entry.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root | undefined;

beforeEach(() => {
  host = document.createElement("div");
  host.setAttribute("data-conversation-content", "");
  host.setAttribute("data-conversation-session", "session-1");
  document.body.append(host);
});

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = undefined;
  host.remove();
});

/**
 * Render the frame into the fake conversation root.
 * @param hero - the Host's blank-home flag.
 * @param activate - the activation spy.
 */
function render(hero: boolean, activate: (sessionId: string) => void): void {
  root = createRoot(host);
  act(() => {
    root?.render(
      createElement(BlankNewChatFrame, { hero, activate }, createElement("span", { "data-child": "" })),
    );
  });
}

describe("blank-home frame", () => {
  it("activates the session when the Host shows the blank home", () => {
    const activate = vi.fn();
    render(true, activate);
    expect(activate).toHaveBeenCalledTimes(1);
    expect(activate).toHaveBeenCalledWith("session-1");
  });

  it("leaves an ordinary conversation alone", () => {
    const activate = vi.fn();
    render(false, activate);
    expect(activate).not.toHaveBeenCalled();
  });

  it("does nothing before a session id exists", () => {
    host.removeAttribute("data-conversation-session");
    const activate = vi.fn();
    render(true, activate);
    expect(activate).not.toHaveBeenCalled();
  });

  it("wraps without taking a box in the Host's flex layout", () => {
    render(true, () => undefined);
    const wrapper = host.firstElementChild as HTMLElement | null;
    expect(wrapper?.style.display).toBe("contents");
    expect(host.querySelector("[data-child]")).not.toBeNull();
  });
});
