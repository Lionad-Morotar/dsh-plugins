// @vitest-environment jsdom
/**
 * The body against a fake document channel: what it asks for, what it paints
 * for each failure code, and the promise that a mode switch never re-opens a
 * document.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { MarkdownBody, configureBody } from "../src/client/body.tsx";
import { boot } from "../src/client/chunk-loader.ts";
import { MarkdownView } from "../src/client/chunk/markdown.tsx";
import type { RendererBodyProps } from "../src/client/contracts.ts";
import { translatorFor } from "../src/client/copy.ts";
import type { DocumentsFace } from "../src/client/documents.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// The body fetches its GFM chunk through the loader's hand-over; the test
// substitutes the real chunk module so reading mode is exercised end to end.
boot(
  Object.assign(() => {
    throw new Error("the test require only exposes async()");
  }, {
    async: async () => ({ renderer: "markdown", MarkdownView }),
  }),
);

const TEXT = "# 标题\n\n正文段落\n\n| 列 | 值 |\n| --- | --- |\n| a | 1 |\n";

/** One successful open, shaped as the generated Remote answers it. */
function envelope(text: string): unknown {
  return { ok: true, value: { ok: true, document: { text, bytes: text.length, version: "v1" } } };
}

interface OpenCall {
  readonly request: { readonly sessionId: string; readonly path: string };
  readonly signal: AbortSignal | undefined;
}

function installChannel(open: DocumentsFace["open"]): void {
  configureBody({ documents: () => ({ open }), t: translatorFor("zh") });
}

function props(overrides: Partial<RendererBodyProps> = {}): RendererBodyProps {
  return {
    path: "docs/a.md",
    sessionId: "session-1",
    mode: "source",
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

  /** Render once and let the channel and chunk promises settle. */
  async function show(overrides: Partial<RendererBodyProps> = {}): Promise<void> {
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

  it("opens the whole document with the session and path, then paints the source", async () => {
    const calls: OpenCall[] = [];
    installChannel((request, signal) => {
      calls.push({ request, signal });
      return Promise.resolve(envelope(TEXT));
    });

    await show();

    expect(calls).toHaveLength(1);
    expect(calls[0]?.request).toEqual({ sessionId: "session-1", path: "docs/a.md" });
    expect(calls[0]?.signal).toBeInstanceOf(AbortSignal);
    expect(testId("fs-md-source")?.textContent).toBe(TEXT);
  });

  it("renders GFM in reading mode and the literal text in source mode", async () => {
    installChannel(() => Promise.resolve(envelope(TEXT)));

    await show({ mode: "reading" });
    expect(testId("fs-md-reading")).not.toBeNull();
    expect(host.querySelector("table")).not.toBeNull();

    await show({ mode: "source" });
    expect(testId("fs-md-source")?.textContent).toBe(TEXT);
  });

  it("does not re-open the document when only the mode changes", async () => {
    let opens = 0;
    installChannel(() => {
      opens += 1;
      return Promise.resolve(envelope(TEXT));
    });

    await show({ mode: "reading" });
    await show({ mode: "source" });
    await show({ mode: "reading" });

    expect(opens).toBe(1);
  });

  it("does not read while the panel is hidden", async () => {
    let opens = 0;
    installChannel(() => {
      opens += 1;
      return Promise.resolve(envelope(TEXT));
    });

    await show({ visible: false });
    expect(opens).toBe(0);

    await show({ visible: true });
    expect(opens).toBe(1);
  });

  it("re-reads when the path changes", async () => {
    const paths: string[] = [];
    installChannel(request => {
      paths.push(request.path);
      return Promise.resolve(envelope(`# ${request.path}`));
    });

    await show({ path: "docs/a.md" });
    await show({ path: "docs/b.md" });

    expect(paths).toEqual(["docs/a.md", "docs/b.md"]);
    expect(testId("fs-md-source")?.textContent).toBe("# docs/b.md");
  });

  it("re-reads when the session changes under the same path", async () => {
    const sessions: string[] = [];
    installChannel(request => {
      sessions.push(request.sessionId);
      return Promise.resolve(envelope(`# ${request.sessionId}`));
    });

    await show({ sessionId: "session-1" });
    await show({ sessionId: "session-2" });

    expect(sessions).toEqual(["session-1", "session-2"]);
    expect(testId("fs-md-source")?.textContent).toBe("# session-2");
  });

  it("turns too-large into the paged-source hint and offers a retry", async () => {
    installChannel(() =>
      Promise.resolve({ ok: true, value: { ok: false, error: { code: "too-large", message: "3000000 bytes" } } }),
    );

    await show();

    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("too-large");
    expect(host.textContent).toContain("2 MiB");
    expect(testId("fs-md-retry")).not.toBeNull();
  });

  it("turns not-text into a non-text message", async () => {
    installChannel(() =>
      Promise.resolve({ ok: true, value: { ok: false, error: { code: "not-text", message: "utf-8 decode failed" } } }),
    );

    await show();

    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("not-text");
    expect(host.textContent).toContain("不是文本文件");
  });

  it("keeps the backend message for an unmapped code", async () => {
    installChannel(() => Promise.resolve({ ok: false, error: { code: "io-error", message: "backend said no" } }));

    await show();

    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("io-error");
    expect(host.textContent).toContain("backend said no");
  });

  it("retries after a failure", async () => {
    let opens = 0;
    installChannel(() => {
      opens += 1;
      return opens === 1
        ? Promise.resolve({ ok: false, error: { code: "io-error", message: "first attempt failed" } })
        : Promise.resolve(envelope(TEXT));
    });

    await show();
    expect(testId("fs-md-error")).not.toBeNull();

    const retry = testId("fs-md-retry");
    await act(async () => {
      retry?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(opens).toBe(2);
    expect(testId("fs-md-source")?.textContent).toBe(TEXT);
  });

  it("shows the channel-unavailable state when the host half is missing", async () => {
    configureBody({ documents: () => undefined, t: translatorFor("zh") });

    await show();

    expect(testId("fs-md-unavailable")).not.toBeNull();
    expect(testId("fs-md-retry")).not.toBeNull();
  });

  it("reports a missing session without touching the channel", async () => {
    let opens = 0;
    installChannel(() => {
      opens += 1;
      return Promise.resolve(envelope(TEXT));
    });

    await show({ sessionId: undefined });

    expect(opens).toBe(0);
    expect(testId("fs-md-error")?.getAttribute("data-code")).toBe("no-session");
  });

  it("aborts an in-flight read when the body unmounts", async () => {
    let signal: AbortSignal | undefined;
    installChannel((_request, nextSignal) => {
      signal = nextSignal;
      return new Promise(() => {});
    });

    const localHost = document.createElement("div");
    document.body.append(localHost);
    const localRoot = createRoot(localHost);

    await act(async () => {
      localRoot.render(createElement(MarkdownBody, props()));
    });
    expect(signal?.aborted).toBe(false);

    await act(async () => {
      localRoot.unmount();
    });
    expect(signal?.aborted).toBe(true);
    localHost.remove();
  });
});
