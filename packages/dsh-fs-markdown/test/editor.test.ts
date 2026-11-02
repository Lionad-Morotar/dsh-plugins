// @vitest-environment jsdom
/**
 * The editor chunk against a real CodeMirror view in jsdom.
 *
 * Assertions go through EditorView transactions and `state.doc`, never through
 * synthetic keyboard events: jsdom does not run CodeMirror's input pipeline,
 * and a test that pretended otherwise would only test the DOM shim.
 */
import { EditorView, keymap } from "@codemirror/view";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { EditorBody } from "../src/client/chunk/editor.tsx";
import type { EditorBodyProps } from "../src/client/contracts.ts";
import { translatorFor } from "../src/client/copy.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function props(overrides: Partial<EditorBodyProps> = {}): EditorBodyProps {
  return {
    path: "docs/a.md",
    sessionId: "session-1",
    mode: "reading",
    text: "**bold**\n\nplain",
    t: translatorFor("zh"),
    onChange: () => {},
    ...overrides,
  };
}

describe("EditorBody", () => {
  let host: HTMLDivElement;
  let root: Root;
  let changes: string[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    changes = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  async function show(overrides: Partial<EditorBodyProps> = {}): Promise<void> {
    await act(async () => {
      root.render(createElement(EditorBody, props({ onChange: text => changes.push(text), ...overrides })));
    });
  }

  function view(): EditorView {
    const element = host.querySelector<HTMLElement>(".cm-editor");
    if (element === null) throw new Error("the editor did not mount");
    const found = EditorView.findFromDOM(element);
    if (found === null) throw new Error("the editor view was not reachable from its DOM");
    return found;
  }

  function text(): string {
    return host.querySelector(".cm-content")?.textContent ?? "";
  }

  it("mounts a CodeMirror editor carrying the document", async () => {
    await show();

    expect(host.querySelector(".fmd-editor")).not.toBeNull();
    expect(view().state.doc.toString()).toBe("**bold**\n\nplain");
    // The cursor starts in the first block, so its markers stay visible.
    expect(text()).toContain("**bold**");
  });

  it("hides markers outside the cursor block and restores them inside it", async () => {
    await show();

    await act(async () => {
      view().dispatch({ selection: { anchor: view().state.doc.length } });
    });
    expect(text()).not.toContain("**bold**");
    expect(text()).toContain("bold");
    expect(host.querySelector(".fmd-strong")).not.toBeNull();

    await act(async () => {
      view().dispatch({ selection: { anchor: 3 } });
    });
    expect(text()).toContain("**bold**");
  });

  it("maps the planner vocabulary to the documented class names", async () => {
    await show({ text: "# title\n\nplain" });

    expect(host.querySelector(".fmd-h1")).not.toBeNull();
    expect(host.querySelector(".fmd-heading1")).toBeNull();
  });

  it("pushes user edits to the change sink", async () => {
    await show();

    await act(async () => {
      view().dispatch({ changes: { from: view().state.doc.length, insert: "!" } });
    });

    expect(changes.at(-1)).toBe("**bold**\n\nplain!");
  });

  it("does not report an external text replacement as a user edit", async () => {
    await show();

    await show({ text: "replaced by the session" });

    expect(view().state.doc.toString()).toBe("replaced by the session");
    expect(changes).toEqual([]);
  });

  it("registers the save chord so it never reaches the host", async () => {
    let saves = 0;
    await show({ onSave: () => { saves += 1; } });

    const binding = view()
      .state.facet(keymap)
      .flat()
      .find(candidate => candidate.key === "Mod-s");
    expect(binding).toBeDefined();
    expect(binding?.preventDefault).toBe(true);
    expect(binding?.run?.(view())).toBe(true);
    expect(saves).toBe(1);
  });

  it("keeps one view and only switches decorations between modes", async () => {
    await show();
    const editorView = view();

    await act(async () => {
      view().dispatch({ selection: { anchor: view().state.doc.length } });
    });
    expect(text()).not.toContain("**bold**");

    await show({ mode: "source" });

    expect(view()).toBe(editorView);
    expect(text()).toContain("**bold**");
  });
});
