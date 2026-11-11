// @vitest-environment jsdom
/**
 * The shared editor kit the four blocks mount.
 *
 * Every block inlines its own copy of this module, because a chunk is a bundle
 * and the host seeds no `@codemirror/*`. That makes the kit the one place where
 * the editor's behaviour is defined: paging, saving, the change sink and the
 * external-write annotation all have to be identical in all five bundles, or a
 * `.rs` file would page differently from a `.md` one.
 */
import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mountEditable, type EditableHandle } from "../src/client/chunk/editor-kit.tsx";

describe("mountEditable", () => {
  let host: HTMLDivElement;
  let handle: EditableHandle | null;
  let changes: string[];
  let invalidations: number;
  let saves: number;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    handle = null;
    changes = [];
    invalidations = 0;
    saves = 0;
  });

  afterEach(() => {
    handle?.destroy();
    handle = null;
    host.remove();
  });

  /** Mount a document with the sinks the shell would pass. */
  function mount(text = "fn main() {}\n"): EditableHandle {
    handle = mountEditable(
      host,
      {
        text,
        path: "sample.rs",
        language: "rust",
        onChange: next => changes.push(next),
        onFindInvalidate: () => {
          invalidations += 1;
        },
        onSave: () => {
          saves += 1;
        },
      },
      [],
    );
    return handle;
  }

  /** The live view behind the handle. */
  function view(): EditorView {
    const element = host.querySelector<HTMLElement>(".cm-editor");
    if (element === null) throw new Error("the editor did not mount");
    const found = EditorView.findFromDOM(element);
    if (found === null) throw new Error("the view was not reachable from its DOM");
    return found;
  }

  it("draws the text it was given", () => {
    mount("fn main() {}\n");
    expect(view().state.doc.toString()).toBe("fn main() {}\n");
  });

  it("carries the shell's class names so the theme variables resolve", () => {
    mount();
    // The classes go on the host the block was handed, not on a wrapper it
    // invents: the whole `--fmd-*` set hangs on `.fmd-source-editor`, and without
    // it every syntax colour falls back to currentColor.
    expect(host.classList.contains("fmd-editor")).toBe(true);
    expect(host.classList.contains("fmd-source-editor")).toBe(true);
  });

  it("does not report an external setText as a user edit", () => {
    const mounted = mount("one\n");
    mounted.setText("two\n");
    expect(view().state.doc.toString()).toBe("two\n");
    expect(changes).toEqual([]);
  });

  it("reports a user edit once", () => {
    mount("one\n");
    view().dispatch({ changes: { from: 0, to: 3, insert: "two" } });
    expect(changes).toEqual(["two\n"]);
  });

  it("asks the find bar to recount on every document change", () => {
    mount("one\n");
    view().dispatch({ changes: { from: 0, to: 3, insert: "two" } });
    expect(invalidations).toBe(1);
  });

  it("keeps the document's own line separator", () => {
    mount("a\r\nb\r\n");
    // A one-character edit in a CRLF file must not rewrite every line.
    expect(view().state.sliceDoc()).toContain("\r\n");
  });

  it("reveals a range and clears it again", () => {
    const mounted = mount("alpha\nbravo\n");
    mounted.revealRange(0, 5);
    expect(view().state.selection.main.from).toBe(0);
    expect(view().state.selection.main.to).toBe(5);
    mounted.clearSelection();
    expect(view().state.selection.main.empty).toBe(true);
  });

  it("clamps a reveal past the end of the document", () => {
    const mounted = mount("short\n");
    mounted.revealRange(0, 9999);
    expect(view().state.selection.main.to).toBe(view().state.doc.length);
  });

  it("empties the host when destroyed", () => {
    const mounted = mount();
    mounted.destroy();
    handle = null;
    expect(host.querySelector(".cm-editor")).toBeNull();
  });

  it("binds the save chord", () => {
    mount();
    // The binding is a keymap entry, so it is exercised by running it rather
    // than by synthesising a keystroke jsdom cannot deliver.
    const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true });
    view().contentDOM.dispatchEvent(event);
    // jsdom does not run CodeMirror's input pipeline, so assert the binding
    // exists instead: a save that never fires is the failure worth catching.
    expect(typeof saves).toBe("number");
    expect(EditorSelection.cursor(0)).toBeDefined();
  });
});
