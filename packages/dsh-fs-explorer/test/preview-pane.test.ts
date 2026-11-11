// @vitest-environment jsdom
/**
 * The pane's diagnostic marker for the body it actually mounted.
 *
 * `data-renderer` is what acceptance probes read to tell one engine from
 * another, so it must follow the winning module rather than the pane's own
 * fallback vocabulary, in reading mode as well as source mode.
 */
import { act, createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PreviewPane } from "../src/client/preview-pane.tsx";
import { createRendererRegistry, type RendererBodyProps } from "../src/client/renderer-registry.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

describe("preview pane renderer marker", () => {
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

  async function show(): Promise<void> {
    const registry = createRendererRegistry();
    registry.register({
      id: "plugin.markdown",
      label: "Markdown",
      match: { extensions: [".md"] },
      priority: 100,
      load: async () => ({ renderer: "plugin-engine", Body: () => createElement("div", { "data-testid": "plugin-body" }) }),
    });
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text: "# title\n", offset: 1, totalLines: 1, eof: true } }),
    };

    await act(async () => {
      root.render(
        createElement(PreviewPane, {
          sessionId: "s1",
          files,
          path: "docs/a.md",
          t,
          renderers: registry,
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function marker(): string | null {
    return host.querySelector<HTMLElement>('[data-testid="fs-preview"]')?.getAttribute("data-renderer") ?? null;
  }

  it("names the winning module in reading mode", async () => {
    await show();

    expect(host.querySelector('[data-testid="plugin-body"]')).not.toBeNull();
    expect(marker()).toBe("plugin-engine");
  });

  it("keeps naming it after the mode switches to source", async () => {
    await show();

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-preview-mode"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    expect(marker()).toBe("plugin-engine");
  });
});

describe("preview pane symlink target", () => {
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

  it("names the real file a refused symbolic link points at", async () => {
    const real = "/Users/lionad/.claude/CLAUDE.md";
    const files = {
      list: async () => ({ entries: [] }),
      read: async (session: string, target: string) =>
        target === real
          ? { ok: true, value: { text: "# real\n", offset: 1, lines: 1, eof: true } }
          : {
              ok: false,
              error: { code: "workspace-file/not-regular-file", message: "is a symlink", details: { kind: "symlink" } },
            },
    };

    await act(async () => {
      root.render(
        createElement(PreviewPane, {
          sessionId: "s1",
          files,
          path: "CLAUDE.md",
          t,
          locate: async () => ({ absolutePath: real }),
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(host.querySelector('[data-testid="fs-preview"]')?.getAttribute("data-state")).toBe("ready");
    expect(host.querySelector('[data-testid="fs-preview-link-target"]')?.textContent).toContain(real);
    expect(host.querySelector('[data-testid="fs-preview-path"]')?.getAttribute("data-link")).toBe("followed");
  });
});

describe("preview pane find source", () => {
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

  /**
   * The promise a body publishes instead of letting the pane read its DOM.
   *
   * `document` below is deliberately absent from the rendered markup: a pane
   * that reads the DOM would report no match, while one that asks the body gets
   * the whole text.
   */
  const DOCUMENT = "the whole document has a needle inside";

  it("recounts through the body's own source after the bar has already counted", async () => {
    // The body only publishes once asked to, which is the ordering the pane's
    // revision counter exists for: the bar opens against the DOM reading, then
    // the real editor arrives with a whole document the DOM never showed.
    const selections: [number, number][] = [];
    const publish = (find?: RendererBodyProps["find"]): void => {
      find?.register({
        scope: "document",
        text: () => DOCUMENT,
        select: (from, to) => selections.push([from, to]),
        clear: () => undefined,
      });
    };
    const registry = createRendererRegistry();
    registry.register({
      id: "plugin.editor",
      label: "Editor",
      match: { extensions: [".md"] },
      priority: 100,
      load: async () => ({
        renderer: "plugin-editor",
        Body: ({ find }: RendererBodyProps) =>
          createElement(
            "button",
            { type: "button", "data-testid": "plugin-publish", onClick: () => publish(find) },
            "publish",
          ),
      }),
    });
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text: "page only", offset: 1, totalLines: 1, eof: true } }),
    };
    const translator = (key: string): string => (key === "preview.find.count.document" ? "{index}/{count}" : key);

    await act(async () => {
      root.render(
        createElement(PreviewPane, {
          sessionId: "s1",
          files,
          path: "docs/a.md",
          t: translator,
          renderers: registry,
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-preview-find"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
    const input = host.querySelector<HTMLInputElement>('[data-testid="fs-preview-find-input"]');
    if (input === null) throw new Error("no find input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      setter?.call(input, "needle");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // No source yet: the DOM reading counts a page and says so.
    const counter = host.querySelector('[data-testid="fs-preview-find-count"]');
    expect(counter?.textContent).toBe("preview.find.none.page");

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="plugin-publish"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    // The source arrived after the count: the revision must re-run it in the
    // body's own offset space, and the scope label must change with it.
    expect(counter?.textContent).toBe("1/1");
    expect(counter?.getAttribute("title")).toBe("preview.find.scope.document");
    const start = DOCUMENT.indexOf("needle");
    expect(selections.at(-1)).toEqual([start, start + "needle".length]);
  });
});

/**
 * The cost model, asserted at the pane rather than at the loader.
 *
 * Opening a file whose language has its own chunk must fetch that chunk and
 * nothing else. The preview chunk carries a second CodeMirror core, so fetching
 * it is not merely wasted bytes: its extensions cannot be accepted by the
 * language chunk's editor, which is the whole reason the pivot exists.
 */
describe("preview pane language chunk routing", () => {
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

  /** Boot the chunk loader with a fake require that records every request. */
  async function bootWith(calls: string[]): Promise<void> {
    const previewChunk = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      if (specifier === "./client.lang-python.js") {
        return {
          renderer: "python",
          mount: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }),
        };
      }
      throw new Error(`no chunk built for ${specifier}`);
    };
    previewChunk.boot(require);
  }

  async function show(path: string): Promise<void> {
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text: "print(1)\n", offset: 1, lines: 1, eof: true } }),
    };
    await act(async () => {
      root.render(createElement(PreviewPane, { sessionId: "s1", files, path, t }));
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("fetches only the language chunk for a .py file", async () => {
    const calls: string[] = [];
    await bootWith(calls);
    await show("a.py");

    expect(calls).toContain("./client.lang-python.js");
    expect(calls).not.toContain("./client.preview.js");
  });

  it("falls back to the preview chunk for a language with no block and no plaintext row", async () => {
    const calls: string[] = [];
    await bootWith(calls);
    // `.xyz` matches no catalogue row at all, so it is neither a language block
    // nor plaintext: it keeps the monochrome editor, which the first-line tier
    // needs to stay reachable.
    await show("a.xyz");

    expect(calls).toContain("./client.preview.js");
    expect(calls.some(call => call.startsWith("./client.lang-"))).toBe(false);
  });
});

/**
 * The three ways a language chunk can leave the surface wrong.
 *
 * All three are about the same thing: the language chunk is fetched
 * asynchronously while the reader keeps using the pane, so the surface has to
 * stay readable before it arrives, catch up when it does, and let go of the
 * editor it replaced. Each test drives the chunk by hand so the ordering is the
 * test's, not the machine's.
 */
describe("preview pane language chunk lifecycle", () => {
  let host: HTMLDivElement;
  let root: Root;
  /** The pane from a fresh module graph, so no earlier suite's chunk cache leaks in. */
  let Pane: typeof PreviewPane;

  beforeEach(async () => {
    vi.resetModules();
    Pane = (await import("../src/client/preview-pane.tsx")).PreviewPane;
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

  /** A chunk request whose settlement the test controls. */
  interface Deferred {
    readonly calls: string[];
    resolve(module: unknown): void;
    reject(error: unknown): void;
  }

  /**
   * Boot the loader with a require that hands back a deferred language chunk.
   *
   * The preview chunk is answered immediately with a monochrome editor whose
   * content is readable, so a test can tell "fell back" from "drew nothing".
   */
  async function bootDeferred(): Promise<Deferred> {
    const calls: string[] = [];
    let settle: { resolve(value: unknown): void; reject(error: unknown): void } | null = null;
    const previewChunk = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      if (specifier === "./client.preview.js") {
        // The fake paints its text into the host, the way a real editor puts the
        // document in the DOM. Without that, "no text on screen" could not be
        // told apart from "the fake renders nothing".
        return {
          renderer: "codemirror",
          mountCodePreview: (element: HTMLElement, options: { text: string }) => {
            element.textContent = options.text;
            return {
              update(next: string) {
                element.textContent = next;
              },
              revealRange() {},
              clearSelection() {},
              destroy() {
                element.textContent = "";
              },
            };
          },
          MarkdownView: () => null,
        };
      }
      return new Promise((resolve, reject) => {
        settle = { resolve, reject };
      });
    };
    previewChunk.boot(require);
    return {
      calls,
      resolve: module => settle?.resolve(module),
      reject: error => settle?.reject(error),
    };
  }

  /**
   * Render the pane over a paged file.
   *
   * Page one is `page one`, page two is `page two`, so a stale page is visible as
   * the wrong words rather than as an equal-looking string.
   */
  async function showPaged(path: string): Promise<void> {
    const files = {
      list: async () => ({ entries: [] }),
      read: async (_session: string, _path: string, range?: { offset?: number }) =>
        (range?.offset ?? 1) > 1
          ? { ok: true, value: { text: "page two\n", offset: 2, lines: 1, totalLines: 2, eof: true } }
          : { ok: true, value: { text: "page one\n", offset: 1, lines: 1, totalLines: 2, eof: false } },
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path, t }));
    });
    await flush();
  }

  /** Let the pane's promise chain and React's effects settle. */
  async function flush(): Promise<void> {
    await act(async () => {
      for (let turn = 0; turn < 6; turn += 1) await Promise.resolve();
    });
  }

  /** Every mounted editor's text, read out of the fake handles the tests record. */
  function editorTexts(): string[] {
    return mounted.map(entry => entry.text);
  }

  /** The fake handles created so far, in mount order. */
  let mounted: { text: string; destroyed: boolean }[] = [];

  beforeEach(() => {
    mounted = [];
  });

  /**
   * A language chunk whose mount records the text it was given and paints it.
   *
   * Painting matters: the assertions read the DOM, so a fake that only recorded
   * its text would make "the editor shows the new page" unobservable.
   */
  function languageModule(id: string) {
    return {
      renderer: id,
      mount: (element: HTMLElement, options: { text: string }) => {
        const entry = { text: options.text, destroyed: false };
        mounted.push(entry);
        element.textContent = options.text;
        return {
          update(text: string) {
            entry.text = text;
            element.textContent = text;
          },
          revealRange() {},
          clearSelection() {},
          destroy() {
            entry.destroyed = true;
            element.textContent = "";
          },
        };
      },
    };
  }

  it("shows the page as plain text when the language chunk fails", async () => {
    const deferred = await bootDeferred();
    await showPaged("a.py");

    await act(async () => {
      deferred.reject(new Error("chunk 404"));
    });
    await flush();

    // The reader must still see the page, word for word.
    expect(host.textContent).toContain("page one");
  });

  it("retries the language chunk on the next open after a failure", async () => {
    const deferred = await bootDeferred();
    await showPaged("a.py");

    await act(async () => {
      deferred.reject(new Error("chunk 404"));
    });
    await flush();
    const afterFirst = deferred.calls.filter(call => call === "./client.lang-python.js").length;
    expect(afterFirst).toBe(1);

    // Reopening the same file must ask again: a rejected chunk is not cached.
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files: pagedFiles(), path: "a.py", t }));
    });
    await flush();
    const afterSecond = deferred.calls.filter(call => call === "./client.lang-python.js").length;
    expect(afterSecond).toBeGreaterThan(afterFirst);
  });

  it("catches up to the current page when the chunk arrives late", async () => {
    const deferred = await bootDeferred();
    await showPaged("a.py");

    // Turn the page while the chunk is still in flight.
    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-preview-next"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
    await flush();

    await act(async () => {
      deferred.resolve(languageModule("python"));
    });
    await flush();

    // The mount must carry the page on screen now, not the one that was showing
    // when the fetch started. Asserted on the mount record rather than the DOM:
    // the DOM alone cannot tell a correct initial mount from a stale one that a
    // later update happened to fix.
    expect(mounted).toHaveLength(1);
    expect(mounted[0]?.text).toBe("page two\n");
  });

  it("destroys the language editor when the reader switches to a file with no chunk", async () => {
    const deferred = await bootDeferred();
    await showPaged("a.py");

    await act(async () => {
      deferred.resolve(languageModule("python"));
    });
    await flush();
    expect(mounted).toHaveLength(1);
    expect(mounted[0]?.destroyed).toBe(false);

    // `.bat` has no block, so the monochrome path takes over this host.
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files: pagedFiles(), path: "a.bat", t }));
    });
    await flush();

    // The replaced editor must be gone, not stacked under the new one.
    expect(mounted[0]?.destroyed).toBe(true);
  });

  /** The same paged reader, for tests that re-render without a new mount. */
  function pagedFiles() {
    return {
      list: async () => ({ entries: [] }),
      read: async (_session: string, _path: string, range?: { offset?: number }) =>
        (range?.offset ?? 1) > 1
          ? { ok: true, value: { text: "page two\n", offset: 2, lines: 1, totalLines: 2, eof: true } }
          : { ok: true, value: { text: "page one\n", offset: 1, lines: 1, totalLines: 2, eof: false } },
    };
  }
});

/**
 * The three-tier routing the pane now uses.
 *
 * A file's language is not decided by its suffix alone any more: the catalogue
 * checks exact filenames, then glob patterns, then suffixes, then the first line.
 * Each tier exists because a real file needed it, so each one is asserted here
 * with the file that motivated it.
 *
 * Every case also pins the cost: a file whose language has a block fetches that
 * block and not the preview chunk, and a file with no block fetches nothing.
 */
describe("preview pane language routing", () => {
  let host: HTMLDivElement;
  let root: Root;
  let Pane: typeof PreviewPane;
  let calls: string[];

  beforeEach(async () => {
    vi.resetModules();
    Pane = (await import("../src/client/preview-pane.tsx")).PreviewPane;
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    calls = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Every block the pane may ask for, answered with a recording fake. */
  async function boot(): Promise<void> {
    const previewChunk = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      if (specifier === "./client.preview.js") {
        return {
          renderer: "codemirror",
          mountCodePreview: (element: HTMLElement, options: { text: string }) => {
            element.textContent = options.text;
            return { update() {}, revealRange() {}, clearSelection() {}, destroy() {} };
          },
          MarkdownView: () => null,
        };
      }
      // The marker is the block name, not the language id: `vue` is drawn by the
      // html block, so a loader comparing against the id would reject it.
      const block = /^\.\/client\.lang-(.+)\.js$/u.exec(specifier)?.[1] ?? "";
      return {
        renderer: block,
        ids: [block],
        mount: (element: HTMLElement, options: { text: string }) => {
          element.textContent = options.text;
          return { update() {}, revealRange() {}, clearSelection() {}, destroy() {} };
        },
      };
    };
    previewChunk.boot(require);
  }

  async function show(path: string, text = "print(1)\n"): Promise<void> {
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text, offset: 1, lines: 1, eof: true } }),
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path, t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
  }

  it("colours .vue with the html block, the first slice's regression", async () => {
    await boot();
    await show("a.vue");
    expect(calls).toContain("./client.lang-html.js");
    expect(calls).not.toContain("./client.preview.js");
  });

  it("fetches the shared block once for .vue and .html", async () => {
    await boot();
    await show("a.vue");
    await show("a.html");
    // Both files are drawn by the same artifact, so the second open is a cache hit.
    expect(calls.filter(call => call === "./client.lang-html.js")).toHaveLength(1);
  });

  it("routes Dockerfile by its exact filename", async () => {
    await boot();
    await show("Dockerfile");
    // No suffix to match, so only the filename tier can reach it.
    expect(calls).toContain("./client.lang-batch-datadoc.js");
    expect(calls).not.toContain("./client.preview.js");
  });

  it("routes docker-compose.yml by its glob pattern", async () => {
    await boot();
    await show("docker-compose.yml");
    expect(calls).toContain("./client.lang-yaml.js");
  });

  it("routes tsconfig.json by filename, not by its .json suffix", async () => {
    await boot();
    await show("tsconfig.json");
    // The catalogue files `tsconfig.json` under jsonc, which is a filename-tier
    // match that beats the plain `.json` suffix. Either way it must not fall
    // through to the javascript grammar the way a suffix-only lookup would.
    expect(calls).toContain("./client.lang-batch-datadoc.js");
    expect(calls).not.toContain("./client.lang-javascript.js");
    expect(calls).not.toContain("./client.lang-json.js");
  });

  it("routes a shebang file by its first line", async () => {
    await boot();
    await show("script", "#!/usr/bin/env python3\nprint(1)\n");
    expect(calls).toContain("./client.lang-python.js");
  });

  it("routes the same file differently when the shebang changes", async () => {
    await boot();
    await show("script", "#!/bin/sh\necho hi\n");
    expect(calls).toContain("./client.lang-batch-script.js");
    expect(calls).not.toContain("./client.lang-python.js");
  });

  it("hands the block the language id, not the block name", async () => {
    // A batch block dispatches on this id to pick a grammar. Passing the block
    // name instead would leave every language in the block monochrome, and the
    // fetch count would still look right, so this is asserted on the argument.
    const seen: string[] = [];
    const previewChunk = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      const block = /^\.\/client\.lang-(.+)\.js$/u.exec(specifier)?.[1] ?? "";
      return {
        renderer: block,
        mount: (element: HTMLElement, options: { text: string }, id: string) => {
          seen.push(id);
          element.textContent = options.text;
          return { update() {}, revealRange() {}, clearSelection() {}, destroy() {} };
        },
      };
    };
    previewChunk.boot(require);

    await show("a.rs");
    expect(calls).toContain("./client.lang-batch-script.js");
    expect(seen).toEqual(["rust"]);
  });

  it("fetches nothing for a suffix the catalogue does not know", async () => {
    await boot();
    await show("a.xyz");
    expect(calls.filter(call => call.startsWith("./client.lang-"))).toEqual([]);
  });

  it("fetches no language block for the explicit plaintext row", async () => {
    await boot();
    await show("a.txt");
    // Plaintext is a decided answer, not a gap: it has no block to fetch.
    expect(calls.filter(call => call.startsWith("./client.lang-"))).toEqual([]);
  });
});

/**
 * The plaintext renderer: a page of text with line numbers, and no fetch.
 *
 * Everything else the pane draws needs a chunk: a language block for a file with
 * a grammar, the preview chunk for the monochrome editor. A file that is only
 * ever plain text needs neither, and fetching 132 KB to draw it was the cost this
 * renderer removes.
 */
describe("preview pane plaintext renderer", () => {
  let host: HTMLDivElement;
  let root: Root;
  let Pane: typeof PreviewPane;
  let calls: string[];

  beforeEach(async () => {
    vi.resetModules();
    Pane = (await import("../src/client/preview-pane.tsx")).PreviewPane;
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    calls = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Boot the loader so any fetch at all is recorded. */
  async function boot(): Promise<void> {
    const previewChunk = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      if (specifier === "./client.preview.js") {
        return {
          renderer: "codemirror",
          mountCodePreview: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }),
          MarkdownView: () => null,
        };
      }
      const block = /^\.\/client\.lang-(.+)\.js$/u.exec(specifier)?.[1] ?? "";
      return {
        renderer: block,
        mount: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }),
      };
    };
    previewChunk.boot(require);
  }

  async function show(path: string, text = "hello\nworld\n", offset = 1): Promise<void> {
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text, offset, lines: 2, eof: true } }),
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path, t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
  }

  it("draws a .txt file without fetching anything", async () => {
    await boot();
    await show("notes.txt");
    expect(calls).toEqual([]);
    expect(host.querySelector('[data-testid="fs-preview-plaintext"]')).not.toBeNull();
  });

  it("shows the text word for word", async () => {
    await boot();
    await show("notes.txt", "first line\nsecond line\n");
    expect(host.textContent).toContain("first line");
    expect(host.textContent).toContain("second line");
  });

  it("numbers the lines from one on the first page", async () => {
    await boot();
    await show("notes.txt", "alpha\nbravo\n");
    const gutter = host.querySelector('[data-testid="fs-preview-plaintext-gutter"]');
    expect(gutter?.textContent).toContain("1");
    expect(gutter?.textContent).toContain("2");
  });

  it("numbers the lines from the page offset on a later page", async () => {
    await boot();
    await show("notes.txt", "alpha\nbravo\n", 201);
    const gutter = host.querySelector('[data-testid="fs-preview-plaintext-gutter"]');
    // A page starting at 201 must not claim to start at 1.
    expect(gutter?.textContent).toContain("201");
    expect(gutter?.textContent).toContain("202");
  });

  it("draws LICENSE by its exact name without fetching anything", async () => {
    await boot();
    await show("LICENSE", "MIT License\n");
    expect(calls).toEqual([]);
    expect(host.querySelector('[data-testid="fs-preview-plaintext"]')).not.toBeNull();
  });

  it("draws Makefile by its exact name without fetching anything", async () => {
    await boot();
    await show("Makefile", "all:\n\techo hi\n");
    expect(calls).toEqual([]);
    expect(host.querySelector('[data-testid="fs-preview-plaintext"]')).not.toBeNull();
  });

  it("still sends an unknown suffix to the monochrome editor", async () => {
    await boot();
    await show("a.xyz");
    // The first-line tier needs a real editor, so unknown files are not bypassed.
    expect(calls).toContain("./client.preview.js");
  });

  it("still sends .py to its language block", async () => {
    await boot();
    await show("a.py", "print(1)\n");
    expect(calls).toContain("./client.lang-python.js");
    expect(calls).not.toContain("./client.preview.js");
  });

  it("leaves .md to the markdown reader", async () => {
    await boot();
    await show("a.md", "# title\n");
    // builtin.markdown is priority 0 and must outrank the plaintext renderer.
    expect(calls).toContain("./client.preview.js");
    expect(host.querySelector('[data-testid="fs-preview-plaintext"]')).toBeNull();
  });
});

/**
 * The surface must never paint an empty page.
 *
 * Two states used to leave `CodeSurface` with nothing to draw: a file whose
 * renderer was pinned to the monochrome module (its body passes `chunk: null`)
 * and whose own language has no block, and a first-line-routed file turned to
 * page two, where the first-line evidence disappears and the language editor is
 * torn down. Both rendered an empty host div with no text at all.
 */
describe("preview pane never paints an empty page", () => {
  let host: HTMLDivElement;
  let root: Root;
  let Pane: typeof PreviewPane;
  let calls: string[];

  beforeEach(async () => {
    vi.resetModules();
    calls = [];
    const loader = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      if (specifier === "./client.preview.js") {
        return {
          renderer: "codemirror",
          mountCodePreview: (element: HTMLElement, options: { text: string }) => {
            element.textContent = options.text;
            return {
              update(next: string) {
                element.textContent = next;
              },
              revealRange() {},
              clearSelection() {},
              destroy() {
                element.textContent = "";
              },
            };
          },
          MarkdownView: () => null,
        };
      }
      const block = /^\.\/client\.lang-(.+)\.js$/u.exec(specifier)?.[1] ?? "";
      return {
        renderer: block,
        mount: (element: HTMLElement, options: { text: string }) => {
          element.textContent = options.text;
          return {
            update(next: string) {
              element.textContent = next;
            },
            revealRange() {},
            clearSelection() {},
            destroy() {
              element.textContent = "";
            },
          };
        },
      };
    };
    loader.boot(require);
    Pane = (await import("../src/client/preview-pane.tsx")).PreviewPane;
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

  /** Render one file and let its page land. */
  async function show(path: string, text: string): Promise<void> {
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text, offset: 1, lines: 1, eof: true } }),
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path, t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
  }

  it("keeps the second file readable after a shebang file pinned the renderer", async () => {
    // The first file is routed by its shebang, so the pane pins the monochrome
    // module for it. The second has no language at all, and used to inherit that
    // pin with no editor to mount.
    await show("deploy", "#!/usr/bin/env python3\nprint(1)\n");
    await show("notes", "just some notes\n");
    expect(host.textContent).toContain("just some notes");
  });

  it("keeps page two readable when the first-line evidence goes away", async () => {
    const files = {
      list: async () => ({ entries: [] }),
      read: async (_session: string, _path: string, range?: { offset?: number }) =>
        (range?.offset ?? 1) > 1
          ? { ok: true, value: { text: "second page body\n", offset: 2, lines: 1, totalLines: 2, eof: true } }
          : { ok: true, value: { text: "#!/usr/bin/env python3\nprint(1)\n", offset: 1, lines: 2, totalLines: 3, eof: false } },
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path: "script", t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-preview-next"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
    expect(host.textContent).toContain("second page body");
  });
});

/**
 * The renderer is resolved from this file's own evidence, not the last file's.
 *
 * The effect that picks a renderer reads the page's first line to answer the
 * first-line tier, but the page arrives asynchronously. Without the snapshot in
 * its dependencies it ran once against whatever page was still held, which meant
 * a shebang file's evidence could be applied to the next file, and a shebang file
 * opened fresh could fetch the preview chunk before its own first line landed.
 */
describe("preview pane renderer resolution evidence", () => {
  let host: HTMLDivElement;
  let root: Root;
  let Pane: typeof PreviewPane;
  let calls: string[];

  beforeEach(async () => {
    vi.resetModules();
    calls = [];
    const loader = await import("../src/client/preview-chunk.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      if (specifier === "./client.preview.js") {
        return {
          renderer: "codemirror",
          mountCodePreview: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }),
          MarkdownView: () => null,
        };
      }
      const block = /^\.\/client\.lang-(.+)\.js$/u.exec(specifier)?.[1] ?? "";
      return { renderer: block, mount: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }) };
    };
    loader.boot(require);
    Pane = (await import("../src/client/preview-pane.tsx")).PreviewPane;
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

  it("never fetches the preview chunk for a file its own first line routes to a block", async () => {
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({
        ok: true,
        value: { text: "#!/usr/bin/env python3\nprint(1)\n", offset: 1, lines: 2, eof: true },
      }),
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path: "script", t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
    // The block is the only thing this file needs; the preview chunk would be
    // 132 KB downloaded and never used.
    expect(calls).toContain("./client.lang-python.js");
    expect(calls).not.toContain("./client.preview.js");
  });

  it("does not apply the previous file's first line to the next file", async () => {
    const files = {
      list: async () => ({ entries: [] }),
      read: async (_session: string, target: string) => ({
        ok: true,
        value:
          target === "deploy"
            ? { text: "#!/usr/bin/env python3\nprint(1)\n", offset: 1, lines: 2, eof: true }
            : { text: "just some notes\n", offset: 1, lines: 1, eof: true },
      }),
    };
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path: "deploy", t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
    const afterFirst = calls.slice();
    await act(async () => {
      root.render(createElement(Pane, { sessionId: "s1", files, path: "notes", t }));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
    // `notes` has no language at all, so it must not be treated as python.
    expect(calls.slice(afterFirst.length)).not.toContain("./client.lang-python.js");
  });
});
