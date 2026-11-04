/**
 * The host mounts the workspace menu with `closeOnPointerLeave: true`, which arms
 * a 200ms close timer on the menu root's pointerleave and cancels it on enter.
 * The row this plugin injects is a separate React root, so moving the pointer
 * from a host menuitem into it makes React report the leave for the menuitem's
 * whole ancestor chain and the menu closes under the pointer.
 *
 * These cases pin the two halves of the answer: the cancel is dispatched through
 * the menu's own trigger button, and the row seals its clicks so the host's
 * outside-dismiss never sees them.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cancelPendingMenuClose, installHostMenuShield } from "../src/client/menu-shield.ts";

interface Fixture {
  readonly container: HTMLElement;
  readonly trigger: HTMLElement;
}

/** The three nodes that matter: the menu's trigger, the injected container, a row control. */
function fixture(): Fixture {
  const actions = document.createElement("span");
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.textContent = "…";
  actions.append(trigger);
  document.body.append(actions);

  const menu = document.createElement("div");
  menu.setAttribute("role", "menu");
  const container = document.createElement("div");
  container.setAttribute("data-dsh-workspace-open-local", "");
  container.setAttribute("role", "none");
  const control = document.createElement("button");
  control.type = "button";
  control.textContent = "在本地打开";
  container.append(control);
  menu.append(container);
  document.body.append(menu);

  return { container, trigger };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("cancelPendingMenuClose", () => {
  it("re-enters the menu root through its trigger button", () => {
    const { trigger } = fixture();
    const events: PointerEvent[] = [];
    trigger.addEventListener("pointerover", (event) => events.push(event as PointerEvent));

    expect(cancelPendingMenuClose(trigger)).toBe(true);
    expect(events).toHaveLength(1);
    // Bubbling is what lets React walk from the trigger up to the menu's root span;
    // a related target would claim the pointer came from inside and skip the enter.
    expect(events[0]?.bubbles).toBe(true);
    expect(events[0]?.relatedTarget).toBeNull();
  });

  it("does nothing without a trigger or with a detached one", () => {
    const { trigger } = fixture();
    const events: Event[] = [];
    trigger.addEventListener("pointerover", (event) => events.push(event));

    expect(cancelPendingMenuClose(null)).toBe(false);
    expect(cancelPendingMenuClose(trigger, true)).toBe(false);
    expect(events).toHaveLength(0);
  });
});

describe("installHostMenuShield", () => {
  it("keeps cancelling while the pointer rests on the row", () => {
    const { container, trigger } = fixture();
    const events: Event[] = [];
    trigger.addEventListener("pointerover", (event) => events.push(event));
    const release = installHostMenuShield({ container, trigger });

    container.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    expect(events.length).toBeGreaterThan(0);

    // The host's timer is 200ms; the shield re-asserts inside that window so an
    // arm that lands after the first cancel still cannot fire.
    const afterEnter = events.length;
    vi.advanceTimersByTime(250);
    expect(events.length).toBeGreaterThan(afterEnter);

    release();
  });

  it("stops cancelling once the pointer leaves the row", () => {
    const { container, trigger } = fixture();
    const events: Event[] = [];
    trigger.addEventListener("pointerover", (event) => events.push(event));
    const release = installHostMenuShield({ container, trigger });

    container.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    container.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false }));
    const afterLeave = events.length;
    vi.advanceTimersByTime(500);
    // One last cancel covers a leave that armed the timer on its way out.
    expect(events.length).toBe(afterLeave);

    release();
  });

  it("seals row clicks from the document while the row still handles them", () => {
    const { container, trigger } = fixture();
    const release = installHostMenuShield({ container, trigger });
    const control = container.querySelector("button");
    if (!(control instanceof HTMLButtonElement)) throw new Error("fixture lost its control");

    const seen: string[] = [];
    control.addEventListener("click", () => seen.push("control"));
    document.addEventListener("click", () => seen.push("document"));

    control.click();
    expect(seen).toEqual(["control"]);
    expect(trigger.isConnected).toBe(true);

    release();
  });

  it("removes every listener when released", () => {
    const { container, trigger } = fixture();
    const events: Event[] = [];
    trigger.addEventListener("pointerover", (event) => events.push(event));
    const release = installHostMenuShield({ container, trigger });
    release();

    container.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    vi.advanceTimersByTime(500);
    expect(events).toHaveLength(0);
  });
});
