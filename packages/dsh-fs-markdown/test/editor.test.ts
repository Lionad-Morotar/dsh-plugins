// @vitest-environment jsdom
/**
 * The editor chunk against a real CodeMirror view in jsdom.
 *
 * Assertions go through EditorView transactions and `state.doc`, never through
 * synthetic keyboard events: jsdom does not run CodeMirror's input pipeline,
 * and a test that pretended otherwise would only test the DOM shim.
 */
import { EditorSelection } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EditorBody } from "../src/client/chunk/editor.tsx";
import type { EditorBodyProps, FindSourceFace } from "../src/client/contracts.ts";
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

  it("keeps CRLF line endings when a user edit is reported", async () => {
    await show({ text: "a\r\nb\r\n" });

    await act(async () => {
      view().dispatch({ changes: { from: view().state.doc.length, insert: "x" } });
    });

    // CM6 splits lines on \r\n and rejoins with \n by default; a whole-file
    // rewrite of a CRLF document turns every line into a diff.
    expect(changes.at(-1)).toBe("a\r\nb\r\nx");
  });

  it("leaves a pure LF document on LF", async () => {
    await show({ text: "a\nb\n" });

    await act(async () => {
      view().dispatch({ changes: { from: view().state.doc.length, insert: "x" } });
    });

    expect(changes.at(-1)).toBe("a\nb\nx");
  });

  it("does not treat the CRLF text it just reported as an external replacement", async () => {
    await show({ text: "a\r\nb\r\n" });
    await act(async () => {
      view().dispatch({
        changes: { from: 0, insert: "x" },
        selection: { anchor: 1 },
      });
    });

    const reported = changes.at(-1) ?? "";
    await show({ text: reported });

    // A full-document replacement would drag the cursor to the end of the file.
    expect(view().state.selection.main.anchor).toBe(1);
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

  /** Find the first binding registered for one key, ahead of the default map. */
  function bindingFor(current: EditorView, key: string) {
    return current.state.facet(keymap).flat().find(candidate => candidate.key === key);
  }

  /** Pin jsdom's zero layout to a ten-line viewport moving one line per step. */
  function pinViewport(current: EditorView): { restore: () => void } {
    Object.defineProperty(current, "defaultLineHeight", { value: 10, configurable: true });
    Object.defineProperty(current.scrollDOM, "clientHeight", { value: 100, configurable: true });
    const spy = vi.spyOn(current, "moveVertically").mockImplementation((range, forward) =>
      EditorSelection.cursor(
        Math.max(0, Math.min(current.state.doc.length, range.head + (forward ? 1 : -1))),
      ),
    );
    return { restore: () => spy.mockRestore() };
  }

  it("moves the caret half a viewport on PageDown, not a whole one", async () => {
    // A full page leaves no shared line between the before and after screen;
    // half a page keeps the upper half in place, which is the reading habit.
    await show({ text: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\n" });
    const current = view();
    const layout = pinViewport(current);
    const start = current.state.selection.main.head;

    expect(bindingFor(current, "PageDown")?.run?.(current)).toBe(true);

    // Ten visible lines halve to five.
    expect(current.state.selection.main.head).toBe(start + 5);
    layout.restore();
  });

  it("moves the caret half a viewport backward on PageUp", async () => {
    await show({ text: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\n" });
    const current = view();
    const layout = pinViewport(current);
    await act(async () => {
      current.dispatch({ selection: { anchor: current.state.doc.length } });
    });
    const start = current.state.selection.main.head;

    expect(bindingFor(current, "PageUp")?.run?.(current)).toBe(true);

    expect(current.state.selection.main.head).toBe(start - 5);
    layout.restore();
  });

  it("extends the selection half a viewport on Shift+PageDown", async () => {
    await show({ text: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\n" });
    const current = view();
    const layout = pinViewport(current);
    const anchor = current.state.selection.main.anchor;
    const head = current.state.selection.main.head;

    expect(bindingFor(current, "Shift-PageDown")?.run?.(current)).toBe(true);

    expect(current.state.selection.main.anchor).toBe(anchor);
    expect(current.state.selection.main.head).toBe(head + 5);
    layout.restore();
  });

  it("renders an inactive table as a table widget with inline marks and alignment", async () => {
    await show({ text: "# t\n\n| a | **b** | `c` |\n| --- | :---: | --- |\n| 1 | 2 | 3 |\n\nplain" });

    const table = host.querySelector<HTMLTableElement>(".fmd-table");
    expect(table).not.toBeNull();
    const header = table?.querySelectorAll<HTMLElement>("thead th") ?? [];
    expect(header).toHaveLength(3);
    expect(header[0]?.textContent).toBe("a");
    // Cell marks go through the same inline scanner as a paragraph.
    expect(header[1]?.querySelector(".fmd-strong")?.textContent).toBe("b");
    expect(header[2]?.querySelector(".fmd-code")?.textContent).toBe("c");
    expect(header[1]?.style.textAlign).toBe("center");
    expect(table?.querySelectorAll("tbody td")).toHaveLength(3);
    // The source lines are replaced rather than painted under the widget.
    expect(text()).not.toContain("| --- |");
  });

  it("shows the source of the table the selection enters", async () => {
    const doc = "# t\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n";
    await show({ text: doc });
    expect(host.querySelector(".fmd-table")).not.toBeNull();

    await act(async () => {
      view().dispatch({ selection: { anchor: doc.indexOf("| a |") } });
    });

    expect(host.querySelector(".fmd-table")).toBeNull();
    expect(text()).toContain("| --- |");
  });

  it("moves the selection to the clicked cell's first character", async () => {
    // A table at position 0 would be active from the start; lead with a heading
    // so the table is painted and the click has a widget to land on.
    const doc = "# t\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n";
    await show({ text: doc });
    const second = host.querySelectorAll<HTMLElement>("tbody td")[1];
    expect(second).not.toBeUndefined();

    await act(async () => {
      second?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
    });

    expect(view().state.selection.main.anchor).toBe(doc.indexOf("2"));
    // The dispatch reveals the source, which is the editing surface.
    expect(host.querySelector(".fmd-table")).toBeNull();
  });

  it("renders a table that ends the document without a trailing newline", async () => {
    await show({ text: "# t\n\n| a | b |\n| --- | --- |\n| 1 | 2 |" });

    expect(host.querySelector(".fmd-table")).not.toBeNull();
    expect(host.querySelectorAll(".fmd-table tbody td")).toHaveLength(2);
  });

  it("does not render a table inside a fenced block", async () => {
    await show({ text: "```md\n| a |\n| --- |\n```\n" });
    expect(host.querySelector(".fmd-table")).toBeNull();
    expect(text()).toContain("| --- |");
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
  it("publishes the whole document, and says that is what it covers", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find, text: "alpha beta alpha" });

    const source = registered.at(-1);
    expect(source).not.toBeUndefined();
    expect(source?.scope).toBe("document");
    expect(source?.text()).toBe("alpha beta alpha");
  });

  it("reads the live document on every call, not the text it mounted with", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find, text: "alpha beta alpha" });
    const source = registered.at(-1);

    await act(async () => {
      view().dispatch({ changes: { from: 0, to: 5, insert: "gamma" } });
    });

    expect(source?.text()).toBe("gamma beta alpha");
  });

  it("asks the find bar to recount after a user edit and after a reload", async () => {
    const invalidations: number[] = [];
    const find = {
      register: (_source: FindSourceFace | null) => {},
      invalidate: () => invalidations.push(1),
    };
    await show({ find, text: "alpha beta alpha" });
    expect(invalidations).toHaveLength(0);

    // A user edit through the view.
    await act(async () => {
      view().dispatch({ changes: { from: 0, to: 5, insert: "gamma" } });
    });
    const afterEdit = invalidations.length;
    expect(afterEdit).toBeGreaterThan(0);

    // A replacement pushed in by the pane (a reload), which the draft store
    // must not treat as a user edit but which still changes the searched text.
    await act(async () => {
      await show({ find, text: "replaced" });
    });
    expect(invalidations.length).toBeGreaterThan(afterEdit);
  });

  it("does not register twice when only unrelated props change", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find });
    const mounts = registered.length;

    await act(async () => {
      await show({ find, mode: "source" });
    });

    expect(registered).toHaveLength(mounts);
  });

  it("keeps find offsets in document positions on a CRLF file", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find, text: "a\r\nb\r\nneedle" });
    const source = registered.at(-1);

    // The document counts each line break as one position; the text the find
    // bar searches must be measured in that same space.
    expect(source?.text()).toBe("a\nb\nneedle");
    await act(async () => {
      source?.select(4, 10);
    });
    expect(view().state.sliceDoc(4, 10)).toBe("needle");
  });

  it("selects a hit without taking the keyboard from the find input", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find, text: "alpha beta alpha" });
    const source = registered.at(-1);

    // The reader is typing in the find field while the editor is unfocused.
    const field = document.createElement("input");
    document.body.append(field);
    field.focus();

    await act(async () => {
      source?.select(11, 16);
    });

    const selection = view().state.selection.main;
    expect([selection.from, selection.to]).toEqual([11, 16]);
    expect(document.activeElement).toBe(field);
    field.remove();
  });

  it("collapses the find selection in place", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find });
    const source = registered.at(-1);

    await act(async () => {
      source?.select(0, 6);
    });
    await act(async () => {
      source?.clear();
    });

    expect(view().state.selection.main.empty).toBe(true);
    expect(view().state.selection.main.head).toBe(6);
  });

  it("unregisters its find source when the body goes away", async () => {
    const registered: (FindSourceFace | null)[] = [];
    const find = { register: (source: FindSourceFace | null) => registered.push(source) };
    await show({ find });
    expect(registered.at(-1)).not.toBeNull();

    await act(async () => {
      root.render(null);
    });

    expect(registered.at(-1)).toBeNull();
  });
});

/**
 * The scope class the whole `--fmd-*` variable set hangs on.
 *
 * `MARKDOWN_STYLES` defines the typography and the ten syntax colours on
 * `.fmd-read, .fmd-source-editor`, not on `.fmd-editor`. Without one of those two
 * classes on an ancestor, every `var(--fmd-syn-*)` falls back to `currentColor`
 * and the editor paints one flat colour: that is exactly what shipped, because
 * the wrapper in `body.tsx` carries the class but a body mounted on its own does
 * not. So the editor root has to carry it too.
 */
describe("EditorBody scope class", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  async function show(mode: "reading" | "source"): Promise<void> {
    await act(async () => {
      root.render(createElement(EditorBody, props({ mode, decorate: mode === "reading" })));
    });
  }

  function rootClass(): string {
    return host.querySelector<HTMLElement>(".fmd-editor")?.className ?? "";
  }

  it("carries the source scope in source mode", async () => {
    await show("source");
    expect(rootClass()).toContain("fmd-source-editor");
    expect(rootClass()).not.toContain("fmd-read");
  });

  it("carries the reading scope in reading mode", async () => {
    await show("reading");
    expect(rootClass()).toContain("fmd-read");
    expect(rootClass()).not.toContain("fmd-source-editor");
  });

  it("keeps fmd-editor, because the stylesheet's child selectors need it", async () => {
    await show("source");
    expect(rootClass()).toContain("fmd-editor");
  });

  it("swaps the scope class when the mode changes under a live editor", async () => {
    await show("reading");
    expect(rootClass()).toContain("fmd-read");

    await show("source");
    expect(rootClass()).toContain("fmd-source-editor");
    expect(rootClass()).not.toContain("fmd-read");
  });
});
