/**
 * Watching for a new conversation page.
 *
 * The host renders an empty conversation as a hero page, and the only stable
 * way to tell "the reader just opened a new conversation" from "the reader is
 * looking at the one they already had" is the pair of attributes the host puts
 * on its content root: `data-content-phase` and `data-conversation-session`.
 * These tests drive that pair directly, because the module's whole job is the
 * transition between two values of it.
 *
 * The watcher is built over a real jsdom document and a real MutationObserver
 * from that document's own window, so the observation path is exercised rather
 * than mocked. Mutations are delivered asynchronously, hence the `settle` helper.
 */
import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createNewChatWatcher, type NewChatWatcherOptions } from "../src/client/new-chat-splash.ts";

let dom: JSDOM;
let doc: Document;

/** The host's content root, carrying the two attributes the watcher reads. */
function contentRoot(phase: string, session: string): HTMLElement {
  const element = doc.createElement("div");
  element.setAttribute("data-conversation-content", "");
  element.setAttribute("data-content-phase", phase);
  element.setAttribute("data-conversation-session", session);
  return element;
}

/** Let the document's MutationObserver deliver what has been queued. */
async function settle(): Promise<void> {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function watcher(overrides: Partial<NewChatWatcherOptions> = {}) {
  const onOpen = vi.fn();
  const handle = createNewChatWatcher({
    doc,
    enabled: () => true,
    armed: () => true,
    busy: () => false,
    onOpen,
    ...overrides,
  });
  return { handle, onOpen };
}

beforeEach(() => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://127.0.0.1/" });
  doc = dom.window.document;
});

afterEach(() => {
  dom.window.close();
});

describe("createNewChatWatcher", () => {
  it("opens once when the page becomes the hero page", async () => {
    const root = contentRoot("active", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher();

    root.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).toHaveBeenCalledTimes(1);
    handle.dispose();
  });

  it("does not open again while the same empty conversation stays on screen", async () => {
    // The host re-renders the hero page on unrelated state changes, and each of
    // those is a mutation. Only the transition into a new page is the event.
    const root = contentRoot("hero", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher();

    root.setAttribute("data-content-phase", "hero");
    await settle();
    root.setAttribute("data-conversation-session", "s1");
    await settle();

    expect(onOpen).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("opens when a second empty conversation replaces the first", async () => {
    // Consecutive new conversations never leave the hero phase, so the session
    // value is the only thing that changes between them.
    const root = contentRoot("hero", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher();

    root.setAttribute("data-conversation-session", "s2");
    await settle();

    expect(onOpen).toHaveBeenCalledTimes(1);
    handle.dispose();
  });

  it("does nothing while the setting is off", async () => {
    const root = contentRoot("active", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher({ enabled: () => false });

    root.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("does nothing before the cold start has finished", async () => {
    // The hero page the app opens on is the cold start's own page, not a new
    // conversation the reader asked for.
    const root = contentRoot("active", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher({ armed: () => false });

    root.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("does not stack a second splash on top of one that is still up", async () => {
    const root = contentRoot("active", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher({ busy: () => true });

    root.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("keeps watching after the host replaces its content root", async () => {
    // React remounts the conversation on a layout change, and the new element
    // carries none of the old one's identity. A watcher bound to the first node
    // would go quiet for the rest of the session.
    const first = contentRoot("active", "s1");
    doc.body.append(first);
    const { handle, onOpen } = watcher();

    const second = contentRoot("active", "s1");
    first.replaceWith(second);
    await settle();

    second.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).toHaveBeenCalledTimes(1);
    handle.dispose();
  });

  it("survives a document with no content root at all", async () => {
    const { handle, onOpen } = watcher();

    // The root appears later, which is the normal case: the skin applies before
    // the shell has rendered anything, and the watcher must not have given up.
    const root = contentRoot("active", "s1");
    doc.body.append(root);
    await settle();

    root.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).toHaveBeenCalledTimes(1);
    handle.dispose();
  });

  it("disposes idempotently and stops reporting", async () => {
    const root = contentRoot("active", "s1");
    doc.body.append(root);
    const { handle, onOpen } = watcher();

    handle.dispose();
    handle.dispose();

    root.setAttribute("data-content-phase", "hero");
    await settle();

    expect(onOpen).not.toHaveBeenCalled();
  });
});
