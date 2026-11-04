// @vitest-environment jsdom
/**
 * The editable body as the text renderer mounts it.
 *
 * The Markdown path is covered by `body.test.ts`, which pins its exact
 * behaviour including the two mode-specific test ids. This file covers what the
 * second renderer adds: the same draft lifecycle over a non-Markdown path, the
 * decoration layer switched off, and the read-only degradation when the
 * deployment has no write channel.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TextEditorBody, configureBody, isEditable } from "../src/client/body.tsx";
import { boot } from "../src/client/chunk-loader.ts";
import type {
  DocumentSessionFace,
  DocumentSnapshotFace,
  DocumentStoreFace,
  EditorBodyProps,
  RendererBodyProps,
} from "../src/client/contracts.ts";
import { translatorFor } from "../src/client/copy.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Records the presentation flags the body handed the editor chunk. */
const seen: EditorBodyProps[] = [];

function FakeEditor(props: EditorBodyProps) {
  seen.push(props);
  return createElement(
    "div",
    { "data-testid": "fake-editor", "data-decorate": String(props.decorate) },
    createElement("span", { "data-testid": "fake-text" }, props.text),
    createElement(
      "button",
      { type: "button", "data-testid": "fake-type", onClick: () => props.onChange(`${props.text}!`) },
      "type",
    ),
    createElement("button", { type: "button", "data-testid": "fake-save", onClick: () => props.onSave?.() }, "save"),
  );
}

boot(
  Object.assign(() => {
    throw new Error("the test require only exposes async()");
  }, {
    async: async () => ({ renderer: "codemirror", EditorBody: FakeEditor }),
  }),
);

interface FakeSession extends DocumentSessionFace {
  reloads: number;
  saves: number;
}

/**
 * A store whose sessions answer one fixed document.
 * @param options - `writable: false` models an explorer half without the write channel.
 * @returns the store plus the sessions it handed out.
 */
function createStore(options: { readonly writable?: boolean } = {}): {
  store: DocumentStoreFace;
  sessions: FakeSession[];
  acquires: string[];
} {
  const sessions: FakeSession[] = [];
  const acquires: string[] = [];
  const writable = options.writable !== false;

  const store: DocumentStoreFace = {
    acquire(_sessionId, path) {
      acquires.push(path);
      let snapshot: DocumentSnapshotFace = {
        status: "idle",
        text: "",
        savedText: "",
        version: null,
        dirty: false,
        // Absent is how an older explorer half reports "no write channel".
        ...(writable ? { saving: false } : {}),
        conflict: false,
        error: null,
      };
      const listeners = new Set<() => void>();
      const publish = (): void => {
        for (const listener of [...listeners]) listener();
      };
      const session: FakeSession = {
        reloads: 0,
        saves: 0,
        getSnapshot: () => snapshot,
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        setDraft(text) {
          snapshot = { ...snapshot, text, dirty: text !== snapshot.savedText };
          publish();
        },
        async save() {
          session.saves += 1;
          return { ok: true as const, version: snapshot.version };
        },
        async reload() {
          session.reloads += 1;
          snapshot = { ...snapshot, status: "loading" };
          publish();
          snapshot = {
            status: "ready",
            text: `// ${path}`,
            savedText: `// ${path}`,
            version: "v1",
            dirty: false,
            ...(writable ? { saving: false } : {}),
            conflict: false,
            error: null,
          };
          publish();
        },
        dispose() {},
      };
      sessions.push(session);
      return session;
    },
  };

  return { store, sessions, acquires };
}

function props(overrides: Partial<RendererBodyProps> = {}): RendererBodyProps {
  return {
    path: "src/main.ts",
    sessionId: "session-1",
    mode: "source",
    t: translatorFor("zh"),
    ...overrides,
  };
}

describe("TextEditorBody", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    seen.length = 0;
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

  async function show(
    overrides: Partial<RendererBodyProps> = {},
    store: DocumentStoreFace = createStore().store,
  ): Promise<void> {
    configureBody({ documents: () => store, t: translatorFor("zh") });
    await act(async () => {
      root.render(createElement(TextEditorBody, props(overrides)));
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function testId(id: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-testid="${id}"]`);
  }

  it("mounts an editor over a non-Markdown text file", async () => {
    const { store, acquires } = createStore();
    await show({}, store);

    expect(acquires).toEqual(["src/main.ts"]);
    expect(testId("fs-text-editor")).not.toBeNull();
    expect(testId("fake-text")?.textContent).toBe("// src/main.ts");
  });

  it("switches the decoration layer off", async () => {
    // The planner behind that layer understands Markdown only; running it over
    // TypeScript would hide characters it mistook for markers.
    const { store } = createStore();
    await show({}, store);

    expect(seen.at(-1)?.decorate).toBe(false);
  });

  it("keeps the mono editor surface whatever mode the pane reports", async () => {
    // The pane defaults to `reading` and only offers the toggle for Markdown, so
    // a code file must not inherit the prose typography from that default.
    const { store } = createStore();
    await show({ mode: "reading" }, store);

    expect(testId("fs-text-editor")?.className).toBe("fmd-source-editor");
  });

  it("pushes an edit into the shared draft and saves through the same session", async () => {
    const { store, sessions } = createStore();
    await show({}, store);

    await act(async () => {
      testId("fake-type")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(sessions[0]?.getSnapshot().dirty).toBe(true);

    await act(async () => {
      testId("fake-save")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(sessions[0]?.saves).toBe(1);
  });

  it("does not read while the panel is hidden", async () => {
    const { store, sessions } = createStore();
    await show({ visible: false }, store);

    expect(sessions[0]?.reloads).toBe(0);
    expect(testId("fs-text-editor")).toBeNull();
  });

  it("degrades to a read-only view when the deployment has no write channel", async () => {
    // An editor here would accept keystrokes and drop them, which is worse than
    // saying plainly that the file cannot be saved.
    const { store } = createStore({ writable: false });
    await show({}, store);

    expect(testId("fs-md-readonly")).not.toBeNull();
    expect(testId("fs-md-readonly-note")?.textContent).toContain("只读");
    expect(testId("fs-text-source")?.textContent).toBe("// src/main.ts");
    expect(testId("fake-editor")).toBeNull();
  });

  it("keeps the read failure path for a file the channel refused", async () => {
    configureBody({ documents: () => undefined, t: translatorFor("zh") });
    await act(async () => {
      root.render(createElement(TextEditorBody, props()));
    });

    expect(testId("fs-md-unavailable")).not.toBeNull();
  });
});

describe("isEditable", () => {
  const base: DocumentSnapshotFace = {
    status: "ready",
    text: "x",
    savedText: "x",
    version: "v1",
    dirty: false,
    saving: false,
    error: null,
  };

  it("accepts a ready snapshot from a channel that can write", () => {
    expect(isEditable(base)).toBe(true);
  });

  it("refuses a ready snapshot from a channel with no write member", () => {
    const { saving: _saving, ...withoutSaving } = base;
    expect(isEditable(withoutSaving as DocumentSnapshotFace)).toBe(false);
  });

  it("refuses anything that is not ready", () => {
    expect(isEditable({ ...base, status: "loading" })).toBe(false);
    expect(isEditable({ ...base, status: "idle" })).toBe(false);
    expect(isEditable({ ...base, status: "failed" })).toBe(false);
  });
});
