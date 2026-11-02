// @vitest-environment jsdom
/**
 * The body against a fake document store: what it acquires, when it reads, and
 * what it paints for each failure code.
 *
 * The editor chunk is replaced by a plain component here. Mounting the real
 * CodeMirror surface is covered by `editor.test.ts`; this file is about the
 * lifecycle around the draft, which must stay assertable without a layout
 * engine.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { MarkdownBody, configureBody } from "../src/client/body.tsx";
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

function FakeEditor({ text, onChange }: EditorBodyProps) {
  return createElement(
    "div",
    { "data-testid": "fake-editor" },
    createElement("span", { "data-testid": "fake-text" }, text),
    createElement("button", { type: "button", "data-testid": "fake-type", onClick: () => onChange(`${text}!`) }, "type"),
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
  readonly sessionId: string;
  readonly path: string;
  readonly snapshots: DocumentSnapshotFace[];
  reloads: number;
}

interface FakeStore extends DocumentStoreFace {
  readonly sessions: FakeSession[];
  readonly acquires: { sessionId: string; path: string }[];
}

interface StoreOptions {
  readonly open?: (sessionId: string, path: string) => Promise<{
    ok: boolean;
    text?: string;
    version?: string;
    code?: string;
    message?: string;
  }>;
}

function createFakeStore(options: StoreOptions = {}): FakeStore {
  const sessions: FakeSession[] = [];
  const acquires: { sessionId: string; path: string }[] = [];

  function createSession(sessionId: string, path: string): FakeSession {
    let snapshot: DocumentSnapshotFace = {
      status: "idle",
      text: "",
      savedText: "",
      version: null,
      dirty: false,
      error: null,
    };
    const listeners = new Set<() => void>();
    const session: FakeSession = {
      sessionId,
      path,
      snapshots: [],
      reloads: 0,
      getSnapshot: () => snapshot,
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      setDraft(text) {
        snapshot = { ...snapshot, text, dirty: text !== snapshot.savedText };
        publish();
      },
      async save() {},
      async reload() {
        session.reloads += 1;
        snapshot = { ...snapshot, status: "loading" };
        publish();
        const result = await (options.open?.(sessionId, path) ??
          Promise.resolve({ ok: true, text: `${sessionId}:${path}`, version: "v1" }));
        if (result.ok) {
          const text = result.text ?? "";
          snapshot = {
            status: "ready",
            text,
            savedText: text,
            version: result.version ?? null,
            dirty: false,
            error: null,
          };
        } else {
          snapshot = {
            ...snapshot,
            status: "failed",
            error: { code: result.code ?? "io-error", message: result.message ?? "" },
          };
        }
        publish();
      },
      dispose() {},
    };
    function publish(): void {
      session.snapshots.push(snapshot);
      for (const listener of [...listeners]) listener();
    }
    session.snapshots.push(snapshot);
    return session;
  }

  return {
    sessions,
    acquires,
    acquire(sessionId, path) {
      acquires.push({ sessionId, path });
      const session = createSession(sessionId, path);
      sessions.push(session);
      return session;
    },
  };
}

function props(overrides: Partial<RendererBodyProps> = {}): RendererBodyProps {
  return {
    path: "docs/a.md",
    sessionId: "session-1",
    mode: "reading",
    t: translatorFor("zh"),
    ...overrides,
  };
}

describe("MarkdownBody", () => {
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

  /** Render once and let the store's reload promise settle. */
  async function show(overrides: Partial<RendererBodyProps> = {}, store?: DocumentStoreFace): Promise<void> {
    configureBody({ documents: () => store ?? createFakeStore(), t: translatorFor("zh") });
    await act(async () => {
      root.render(createElement(MarkdownBody, props(overrides)));
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function testId(id: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-testid="${id}"]`);
  }

  it("acquires the session and reads the whole document when visible", async () => {
    const store = createFakeStore();
    await show({}, store);

    expect(store.acquires).toEqual([{ sessionId: "session-1", path: "docs/a.md" }]);
    expect(store.sessions[0]?.reloads).toBe(1);
    expect(testId("fake-text")?.textContent).toBe("session-1:docs/a.md");
    expect(testId("fs-md-reading")).not.toBeNull();
  });

  it("does not read while the panel is hidden", async () => {
    const store = createFakeStore();
    await show({ visible: false }, store);

    expect(store.acquires).toHaveLength(1);
    expect(store.sessions[0]?.reloads).toBe(0);

    await show({ visible: true }, store);
    expect(store.acquires).toHaveLength(1);
    expect(store.sessions[0]?.reloads).toBe(1);
  });

  it("pushes an editor change into the acquired session draft", async () => {
    const store = createFakeStore();
    await show({}, store);

    const button = testId("fake-type");
    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(store.sessions[0]?.getSnapshot().text).toBe("session-1:docs/a.md!");
    expect(store.sessions[0]?.getSnapshot().dirty).toBe(true);
  });

  it("does not acquire or read again when only the mode changes", async () => {
    const store = createFakeStore();
    await show({ mode: "reading" }, store);
    await show({ mode: "source" }, store);
    expect(testId("fs-md-source")).not.toBeNull();
    await show({ mode: "reading" }, store);

    expect(store.acquires).toHaveLength(1);
    expect(store.sessions[0]?.reloads).toBe(1);
    expect(testId("fs-md-reading")).not.toBeNull();
  });

  it("acquires a new session when the path changes", async () => {
    const store = createFakeStore();
    await show({}, store);
    await show({ path: "docs/b.md" }, store);

    expect(store.acquires.map(call => call.path)).toEqual(["docs/a.md", "docs/b.md"]);
    expect(testId("fake-text")?.textContent).toBe("session-1:docs/b.md");
  });

  it("acquires a new session when the session changes under the same path", async () => {
    const store = createFakeStore();
    await show({}, store);
    await show({ sessionId: "session-2" }, store);

    expect(store.acquires.map(call => call.sessionId)).toEqual(["session-1", "session-2"]);
    expect(testId("fake-text")?.textContent).toBe("session-2:docs/a.md");
  });

  it("turns too-large into the paged-source hint and offers a retry", async () => {
    const store = createFakeStore({
      open: async () => ({ ok: false, code: "too-large", message: "3000000 bytes" }),
    });
    await show({}, store);

    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("too-large");
    expect(host.textContent).toContain("2 MiB");
    expect(testId("fs-md-retry")).not.toBeNull();
  });

  it("turns not-text into a non-text message", async () => {
    const store = createFakeStore({
      open: async () => ({ ok: false, code: "not-text", message: "utf-8 decode failed" }),
    });
    await show({}, store);

    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("not-text");
    expect(host.textContent).toContain("不是文本文件");
  });

  it("keeps the backend message for an unmapped code", async () => {
    const store = createFakeStore({
      open: async () => ({ ok: false, code: "io-error", message: "backend said no" }),
    });
    await show({}, store);

    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("io-error");
    expect(host.textContent).toContain("backend said no");
  });

  it("retries after a failure without re-acquiring", async () => {
    let attempts = 0;
    const store = createFakeStore({
      open: async () => {
        attempts += 1;
        return attempts === 1
          ? { ok: false, code: "io-error", message: "first attempt failed" }
          : { ok: true, text: "recovered" };
      },
    });
    await show({}, store);
    expect(testId("fs-md-error")).not.toBeNull();

    const retry = testId("fs-md-retry");
    await act(async () => {
      retry?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(store.acquires).toHaveLength(1);
    expect(store.sessions[0]?.reloads).toBe(2);
    expect(testId("fake-text")?.textContent).toBe("recovered");
  });

  it("shows the channel-unavailable state when the host half is missing", async () => {
    configureBody({ documents: () => undefined, t: translatorFor("zh") });
    await act(async () => {
      root.render(createElement(MarkdownBody, props()));
    });

    expect(testId("fs-md-unavailable")).not.toBeNull();
    expect(testId("fs-md-retry")).not.toBeNull();
  });

  it("reports a missing session without touching the store", async () => {
    const store = createFakeStore();
    await show({ sessionId: undefined }, store);

    expect(store.acquires).toHaveLength(0);
    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("no-session");
  });

  it("disposes the acquired session on unmount", async () => {
    const store = createFakeStore();
    let disposed = 0;
    const original = store.acquire.bind(store);
    store.acquire = (sessionId, path) => {
      const session = original(sessionId, path);
      const dispose = session.dispose.bind(session);
      session.dispose = () => {
        disposed += 1;
        dispose();
      };
      return session;
    };

    await show({}, store);
    await act(async () => {
      root.unmount();
    });

    expect(disposed).toBe(1);
  });
});
