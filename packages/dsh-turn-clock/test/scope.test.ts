// @vitest-environment jsdom
/**
 * One seat per mounted conversation view, and no seat touching another's rows.
 *
 * A DSH window can hold several conversation views at once: split panes, dock
 * tabs, and tabs kept mounted while hidden. Every view mounts its own clock seat
 * with its own session projection, and the two sessions number their Turns
 * independently — both have a Turn 12, with unrelated durations. This file pins
 * the property that keeps those seats apart: a pass runs over its own view root,
 * never the document.
 *
 * The first case encodes the hazard instead of hiding it: an unscoped pass does
 * carry one session's figure onto another session's row. That is what used to
 * happen in the docked layout, and it is why the seats now resolve a root.
 */
import { afterEach, describe, expect, it } from "vitest";
import { patchRoot, startClockPatcher, type ClockPatcher } from "../src/client/face.ts";
import { resolvePatchRoot } from "../src/client/watch.tsx";
import type { TurnClockView } from "../src/types.ts";

/** One session's view with a single closed Turn (number 12) and its net table. */
function view(netMs: number): TurnClockView {
  return { currentTurn: null, turnStart: null, waitMs: 0, waitSince: null, totalWaitMs: 0, turnNet: { "12": netMs } };
}

/** The parent session's Turn 12: an old, unrelated five and a half minutes. */
const PARENT = view(330_000);

/** The docked subagent session's Turn 12: the one the reader is watching. */
const DOCKED = view(69_000);

/** One view's markup: a session container holding a chat flow with one settled row. */
function viewMarkup(session: string): string {
  // No whitespace inside the row: the host's React markup has none either, and
  // the patcher writes the sentence into the row's first text node.
  return `<div data-conversation-session="${session}">`
    + '<div data-slot="conversation.chat.flow"><div data-chat-flow>'
    + '<button data-turn-process="12"><span class="label">已完成，用时 <span class="num">1</span>分<span class="num">10</span>秒</span></button>'
    + '</div></div>'
    + '<div data-composer-seat><span data-anchor></span></div>'
    + '</div>';
}

/** The host's own sentence for the row, split the way ui-chat splits it. */
const HOST_SENTENCE = '已完成，用时 <span class="num">1</span>分<span class="num">10</span>秒';

/** The label text inside one view. */
function label(session: string): string {
  return document.querySelector(`[data-conversation-session="${session}"] [data-turn-process] .label`)?.textContent?.trim() ?? "";
}

/** The view root for one session. */
function root(session: string): Element {
  const element = document.querySelector(`[data-conversation-session="${session}"]`);
  if (element === null) throw new Error(`no view for ${session}`);
  return element;
}

/** Let the microtask-queued observer pass and its own follow-up run. */
async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Patchers started by a case, stopped even when the case throws. */
const running: ClockPatcher[] = [];

/** Start a patcher and remember it for the cleanup. */
function watch(target: ParentNode, read: () => TurnClockView): ClockPatcher {
  const patcher = startClockPatcher(target, read);
  running.push(patcher);
  return patcher;
}

afterEach(() => {
  while (running.length > 0) running.pop()?.stop();
  document.body.innerHTML = "";
});

describe("patch root", () => {
  it("resolves the seat's own session container", () => {
    document.body.innerHTML = viewMarkup("session-a") + viewMarkup("session-b");
    const anchorA = document.querySelector('[data-conversation-session="session-a"] [data-anchor]');
    expect(anchorA).not.toBeNull();
    expect(resolvePatchRoot(anchorA as Element)).toBe(root("session-a"));
  });

  it("falls back to the closest ancestor holding exactly one chat flow", () => {
    document.body.innerHTML = `
      <div id="view">
        <div data-slot="conversation.chat.flow"><div data-turn-process="2">已完成，用时 1秒</div></div>
        <div><span data-anchor></span></div>
      </div>
    `;
    expect(resolvePatchRoot(document.querySelector("[data-anchor]") as Element)).toBe(document.querySelector("#view"));
  });

  it("falls back to the document when no view shape is recognizable", () => {
    document.body.innerHTML = `<div><span data-anchor></span></div>`;
    expect(resolvePatchRoot(document.querySelector("[data-anchor]") as Element)).toBe(document);
  });
});

describe("cross-view isolation", () => {
  it("an unscoped pass would rewrite both views from one session's table", () => {
    document.body.innerHTML = viewMarkup("parent") + viewMarkup("docked");
    // This is the shape the patcher used to run in: document-wide, one table.
    expect(patchRoot(document, () => PARENT, 1)).toBe(2);
    expect(label("parent")).toBe("已完成，用时 5分30秒");
    expect(label("docked")).toBe("已完成，用时 5分30秒");
  });

  it("two scoped seats keep their own figures across host repaints", async () => {
    document.body.innerHTML = viewMarkup("parent") + viewMarkup("docked");
    watch(root("parent"), () => PARENT);
    watch(root("docked"), () => DOCKED);
    await settle();
    expect(label("parent")).toBe("已完成，用时 5分30秒");
    expect(label("docked")).toBe("已完成，用时 1分9秒");

    // The host repaints both rows with its wall-clock sentence, as React does
    // when a row remounts or the conversation re-renders.
    for (const session of ["parent", "docked"]) {
      const row = document.querySelector(`[data-conversation-session="${session}"] [data-turn-process] .label`);
      if (row !== null) row.innerHTML = HOST_SENTENCE;
    }
    await settle();

    // Each seat corrected its own view and left the other view's row alone.
    expect(label("parent")).toBe("已完成，用时 5分30秒");
    expect(label("docked")).toBe("已完成，用时 1分9秒");
  });

  it("corrects a host repaint without waiting for a timer", async () => {
    document.body.innerHTML = viewMarkup("docked");
    watch(root("docked"), () => DOCKED);
    await settle();
    const row = document.querySelector('[data-conversation-session="docked"] [data-turn-process] .label');
    if (row === null) throw new Error("row missing");
    row.innerHTML = HOST_SENTENCE;
    // One macrotask is enough: the correction is queued as a microtask, so it
    // lands before the next timer fires — a timer-based debounce would not.
    await settle();
    expect(row.textContent).toBe("已完成，用时 1分9秒");
  });
});
