/**
 * The continue button's rendered surface, pinned where a wrong render is silent.
 *
 * The button is one line of markup, so the interesting part is not that it draws
 * but that it stays away. Every case below is a state where offering to continue
 * would be a lie: a turn that finished on its own, a turn the user has already
 * scrolled past, a message still in flight, or a host that never handed over the
 * seam to send one. A button that appears in those states costs the user a click
 * and a wasted turn, and nothing on screen would explain why.
 *
 * Rendered with `renderToStaticMarkup` rather than a DOM: what is asserted is
 * which markup the decision produces, and a real document would add a layout
 * engine to reason about for nothing. The click path is covered through the pure
 * helpers the component uses, since static markup never dispatches events.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ContinueButton,
  continueFailureText,
  type ContinueButtonProps,
  type ContinueChatSnapshotLike,
  type ContinueInputSnapshotLike,
  type ContinueSessionSnapshotLike,
} from "../src/client/continue-button.tsx";
import {
  CONTINUE_BUTTON_CLASS,
  CONTINUE_CSS,
  installContinueStyles,
} from "../src/client/continue-styles.ts";

/** Translation keys resolve to readable sentinels, so a missing key is visible. */
function translate(key: string): string {
  if (key === "continue.label") return "继续";
  if (key === "continue.sending") return "继续中…";
  return key;
}

/** A chat snapshot whose timeline ends at the given turn. */
function chatEndingAt(last: number) {
  return (select: (snapshot: ContinueChatSnapshotLike) => unknown): unknown =>
    select({ timeline: { turnOrder: [1, last] } });
}

/** A session snapshot with the given number of queued submissions. */
function sessionWithPending(count: number) {
  return (select: (snapshot: ContinueSessionSnapshotLike) => unknown): unknown =>
    select({ pendingSubmissions: Array.from({ length: count }, (_, index) => ({ index })) });
}

/** A composer snapshot selector stuck on one phase. */
function composerAt(phase: string) {
  return (select: (snapshot: ContinueInputSnapshotLike) => unknown): unknown => select({ phase });
}

/** Props for a turn that should offer to continue, before any override. */
function props(overrides: Partial<ContinueButtonProps> = {}): ContinueButtonProps {
  return {
    turn: { turn: 2, end: { data: { reason: { kind: "interrupted" } } } },
    sessionId: "session-1",
    useChat: chatEndingAt(2),
    useSession: sessionWithPending(0),
    t: translate,
    submitContinue: async () => {},
    ...overrides,
  };
}

/** Render the button for one prop set. */
function render(overrides: Partial<ContinueButtonProps> = {}): string {
  return renderToStaticMarkup(createElement(ContinueButton, props(overrides)));
}

describe("ContinueButton", () => {
  it("offers to continue an interrupted last turn", () => {
    const html = render();
    expect(html).toContain('data-testid="better-continue"');
    expect(html).toContain("继续");
    expect(html).toContain(CONTINUE_BUTTON_CLASS);
  });

  it("renders a button element, not a link or a span", () => {
    expect(render()).toMatch(/^<button[^>]*data-testid="better-continue"/u);
  });

  it("is enabled before anything is sent", () => {
    expect(render()).not.toContain("disabled");
  });

  it.each([
    ["the turn is not the last one", { turn: { turn: 1, end: { data: { reason: { kind: "interrupted" } } } } }],
    ["the turn stopped normally", { turn: { turn: 2, end: { data: { reason: { kind: "stop" } } } } }],
    ["the turn ended in an error", { turn: { turn: 2, end: { data: { reason: { kind: "error" } } } } }],
    ["the turn has not ended", { turn: { turn: 2 } }],
    ["a submission is still in flight", { useSession: sessionWithPending(1) }],
    // 0.2.2 publishes the echo only after acceptance, so the phase is what
    // covers the window in between; without it the button lingers long enough
    // to be pressed twice.
    ["a message is still being accepted", { useInput: composerAt("sending") }],
    ["the composer is adjudicating a command", { useInput: composerAt("submitting") }],
    ["the host handed over no send action", { submitContinue: undefined }],
    ["the host handed over no translator", { t: undefined }],
    ["the host handed over no session", { sessionId: undefined }],
    ["the host handed over no turn", { turn: undefined }],
    ["the host handed over no chat selector", { useChat: undefined }],
  ])("renders nothing when %s", (_name, overrides) => {
    expect(render(overrides as Partial<ContinueButtonProps>)).toBe("");
  });

  it("still offers when the host hands over no session selector", () => {
    // `useSession` is not one of the seams the row requires: without it nothing
    // is known to be queued, and refusing to draw would hide the button on a
    // host that simply has no pending-submission view.
    expect(render({ useSession: undefined })).toContain('data-testid="better-continue"');
  });

  it("offers again once the send settles back to a plain draft", () => {
    // The window is temporary: a refused send returns the composer to plain
    // with the draft kept, and the button must come back so it can be retried.
    expect(render({ useInput: composerAt("plain") })).toContain('data-testid="better-continue"');
  });

  it("keeps offering on a host that publishes no composer phase", () => {
    // Older hosts have no `sending` phase; the pending-submission face is all
    // they have, and it must not be replaced by a permanent lock.
    expect(render({ useInput: undefined })).toContain('data-testid="better-continue"');
  });

  it("reads the timeline rather than trusting the turn's own position", () => {
    // A stale `turn` prop left over from a previous render must not resurrect the
    // button: the timeline is the authority on which turn is last.
    expect(render({ useChat: chatEndingAt(3) })).toBe("");
  });

  it("keeps the hooks unconditional, so a missing seam cannot change hook order", () => {
    // Both selectors are called on every render, including the renders that end
    // up returning null. A conditional call would break React's hook contract the
    // moment the host's state changed between renders.
    const calls: string[] = [];
    render({
      useChat: select => {
        calls.push("chat");
        return select({ timeline: { turnOrder: [1, 2] } });
      },
      useSession: select => {
        calls.push("session");
        return select({ pendingSubmissions: [] });
      },
      useInput: select => {
        calls.push("input");
        return select({ phase: "plain" });
      },
    });
    expect(calls).toEqual(["chat", "session", "input"]);
  });
});

describe("continueFailureText", () => {
  it("shows the error's own message", () => {
    expect(continueFailureText(new Error("network unreachable"))).toBe("network unreachable");
  });

  it("shows a thrown non-error as its string form", () => {
    expect(continueFailureText("rejected")).toBe("rejected");
    expect(continueFailureText(undefined)).toBe("undefined");
  });
});

describe("continue styles", () => {
  /** A document stand-in with just the three calls the installer makes. */
  function fakeDocument() {
    interface FakeStyle {
      id: string;
      textContent: string;
      remove(): void;
    }
    const nodes: FakeStyle[] = [];
    const doc = {
      getElementById: (id: string): FakeStyle | null => nodes.find(node => node.id === id) ?? null,
      createElement: (): FakeStyle => {
        const element: FakeStyle = {
          id: "",
          textContent: "",
          remove: () => {
            const index = nodes.indexOf(element);
            if (index >= 0) nodes.splice(index, 1);
          },
        };
        return element;
      },
      head: {
        append: (element: FakeStyle): void => {
          nodes.push(element);
        },
      },
    };
    return { doc: doc as unknown as Document, nodes };
  }

  it("right-aligns the row inside the turn tail's column", () => {
    // The host's turn-tail root is a flex column, so the container's own
    // alignment is what puts the button on the right edge.
    expect(CONTINUE_CSS).toContain("align-self: flex-end");
  });

  it("draws a small outlined button rather than a filled primary one", () => {
    expect(CONTINUE_CSS).toContain("border: 1px solid");
    expect(CONTINUE_CSS).toContain("border-radius");
    expect(CONTINUE_CSS).toContain("cursor: pointer");
  });

  it("marks the disabled state as inert", () => {
    expect(CONTINUE_CSS).toContain(":disabled");
    expect(CONTINUE_CSS).toContain("cursor: default");
    expect(CONTINUE_CSS).toContain("opacity");
  });

  it("takes every colour from a host design token", () => {
    expect(CONTINUE_CSS).toContain("var(--dsw-alias-");
    expect(CONTINUE_CSS).not.toMatch(/#[0-9a-f]{3,8}\b/iu);
    expect(CONTINUE_CSS).not.toMatch(/\brgba?\(/u);
  });

  it("installs once per document and disposes what it added", () => {
    const { doc, nodes } = fakeDocument();
    const dispose = installContinueStyles(doc);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.id).toBe("dsh-better-continue");
    expect(nodes[0]?.textContent).toBe(CONTINUE_CSS);
    dispose();
    expect(nodes).toHaveLength(0);
  });

  it("is idempotent by id, so a reload does not stack copies", () => {
    const { doc, nodes } = fakeDocument();
    installContinueStyles(doc);
    const secondDispose = installContinueStyles(doc);
    expect(nodes).toHaveLength(1);
    // The second call inserted nothing, so its disposer must not remove the
    // first call's tag out from under whoever installed it.
    secondDispose();
    expect(nodes).toHaveLength(1);
  });

  it("does nothing without a document", () => {
    expect(() => installContinueStyles(undefined)()).not.toThrow();
  });
});
