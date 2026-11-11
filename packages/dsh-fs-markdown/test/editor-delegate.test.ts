// @vitest-environment jsdom
/**
 * The editor shell's delegation to the four editable language blocks.
 *
 * The shell chunk holds ten grammars statically. The other 44 languages live in
 * four batch chunks, each carrying its own editor, so a file whose language is in
 * one of those batches has to be handed to that block instead of being drawn by
 * the shell's own view.
 *
 * The delegation happens here rather than in `body.tsx` because the catalogue is
 * already in this chunk: doing it in the startup bundle would drag the whole
 * language table into a bundle that has a few KB of headroom.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { EditorBodyProps } from "../src/client/contracts.ts";
import { translatorFor } from "../src/client/copy.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** One recorded mount, so a test can see what the block was handed. */
interface Mounted {
  readonly block: string;
  readonly language: string;
  readonly text: string;
  destroyed: boolean;
  text_: string;
}

/** A fake block whose mount records itself and paints its text. */
function blockOf(block: string, mounted: Mounted[]) {
  return {
    renderer: block,
    mount: (host: HTMLElement, options: { text: string; language: string; onChange(t: string): void }) => {
      const record: Mounted = { block, language: options.language, text: options.text, destroyed: false, text_: options.text };
      mounted.push(record);
      host.textContent = options.text;
      return {
        setText(text: string) {
          record.text_ = text;
          host.textContent = text;
        },
        revealRange() {},
        clearSelection() {},
        focus() {},
        destroy() {
          record.destroyed = true;
          host.textContent = "";
        },
      };
    },
  };
}

describe("editor body delegation", () => {
  let host: HTMLDivElement;
  let root: Root;
  let calls: string[];
  let mounted: Mounted[];
  let EditorBody: (props: EditorBodyProps) => unknown;

  beforeEach(async () => {
    vi.resetModules();
    calls = [];
    mounted = [];
    const loader = await import("../src/client/chunk-loader.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      const block = /^\.\/client\.editor-langs-(.+)\.js$/u.exec(specifier)?.[1];
      if (block !== undefined) return blockOf(block, mounted);
      throw new Error(`no chunk built for ${specifier}`);
    };
    loader.boot(require);
    EditorBody = (await import("../src/client/chunk/editor.tsx")).EditorBody as never;
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

  /** Props for one editable file. */
  function props(overrides: Partial<EditorBodyProps> = {}): EditorBodyProps {
    return {
      path: "sample.rs",
      sessionId: "s1",
      mode: "source",
      text: "fn main() {}\n",
      t: translatorFor("zh"),
      onChange: () => undefined,
      ...overrides,
    };
  }

  /** Render and let the chunk promise settle. */
  async function show(overrides: Partial<EditorBodyProps> = {}): Promise<void> {
    await act(async () => {
      root.render(createElement(EditorBody as never, props(overrides)));
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });
  }

  it("loads the batch block for a .rs file", async () => {
    await show({ path: "sample.rs" });
    expect(calls).toContain("./client.editor-langs-batch-script.js");
    expect(host.querySelector('[data-renderer="batch-script"]')).not.toBeNull();
  });

  it("hands the block the language id, not the block name", async () => {
    await show({ path: "sample.rs" });
    expect(mounted).toHaveLength(1);
    expect(mounted[0]?.language).toBe("rust");
  });

  it("loads the webstyle block for .ini and .php, once", async () => {
    await show({ path: "config.ini", text: "key=value\n" });
    await show({ path: "index.php", text: "<?php\n" });
    expect(calls.filter(call => call === "./client.editor-langs-batch-webstyle.js")).toHaveLength(1);
  });

  it("fetches no language block for a .md file", async () => {
    await show({ path: "notes.md", text: "# title\n", decorate: true });
    expect(calls.filter(call => call.startsWith("./client.editor-langs-"))).toEqual([]);
    expect(host.querySelector('[data-renderer="codemirror"]')).not.toBeNull();
  });

  it("fetches no language block for an in-service language", async () => {
    await show({ path: "a.ts", text: "const x = 1;\n" });
    expect(calls.filter(call => call.startsWith("./client.editor-langs-"))).toEqual([]);
    expect(host.querySelector('[data-renderer="codemirror"]')).not.toBeNull();
  });

  it("falls back to the shell editor when the block fails", async () => {
    // Reboot the loader so this block's request rejects. The cache is module
    // state, so a fresh graph is the only way to make the same block fail after
    // an earlier test resolved it.
    vi.resetModules();
    const loader = await import("../src/client/chunk-loader.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      throw new Error(`no chunk built for ${specifier}`);
    };
    loader.boot(require);
    EditorBody = (await import("../src/client/chunk/editor.tsx")).EditorBody as never;

    await show({ path: "sample.rs" });
    // A failed block must not leave the file uneditable: the shell's own view
    // takes over, monochrome.
    expect(calls).toContain("./client.editor-langs-batch-script.js");
    expect(host.querySelector('[data-renderer="codemirror"]')).not.toBeNull();
  });

  it("pushes an external text change through setText", async () => {
    await show({ path: "sample.rs", text: "one\n" });
    await show({ path: "sample.rs", text: "two\n" });
    expect(mounted[0]?.text_).toBe("two\n");
  });

  it("destroys the block editor when the body goes away", async () => {
    await show({ path: "sample.rs" });
    expect(mounted[0]?.destroyed).toBe(false);
    await act(async () => {
      root.unmount();
    });
    expect(mounted[0]?.destroyed).toBe(true);
    root = createRoot(host);
  });
});

/**
 * The editor chunk has to export its own `boot`.
 *
 * The loader injects the startup require into the chunk, but only if the chunk
 * exposes a `boot` for it to call. Forgetting that export is the exact regression
 * that shipped: the loader's hand-over had nothing to hand the require to, the
 * chunk's own copy of the loader stayed empty, and every delegated block fell
 * back to monochrome.
 */
describe("editor chunk module exports", () => {
  it("exposes boot alongside the renderer and the body", async () => {
    vi.resetModules();
    const module = await import("../src/client/chunk/editor.tsx");
    const chunkModule = module.default as { renderer?: string; EditorBody?: unknown; boot?: unknown };
    expect(chunkModule.renderer).toBe("codemirror");
    expect(typeof chunkModule.EditorBody).toBe("function");
    expect(typeof chunkModule.boot).toBe("function");
  });

  it("initialises this bundle's loader when boot is called", async () => {
    vi.resetModules();
    const loader = await import("../src/client/chunk-loader.ts");
    const module = await import("../src/client/chunk/editor.tsx");
    const require = Object.assign(() => {
      throw new Error("sync require is not used here");
    }, { async: async () => ({}) });
    // Before the hand-over the delegated loader has nothing to fetch with.
    await expect(loader.loadEditableLangChunk("batch-script")).rejects.toThrow(/loader require/u);
    module.boot(require as never);
    // After it, the same call reaches the loader instead of refusing outright:
    // the stub answers with an empty module, so the failure is now the marker
    // check rather than the missing hand-over.
    await expect(loader.loadEditableLangChunk("batch-script")).rejects.toThrow(/is not the batch-script block/u);
  });
});

/**
 * The delegated editor publishes normalized text to the find bar.
 *
 * The bar searches the text a body publishes and then asks that body to select at
 * the offset it found. If the published text keeps the file's CRLF while the
 * editor's offsets count a line break as one character, every hit on the second
 * line and later lands one position too far per preceding line. The shell's own
 * editor has always published `doc.toString()` for exactly this reason; the
 * delegated path has to do the same.
 */
describe("delegated find source", () => {
  let host: HTMLDivElement;
  let root: Root;
  let Pane: (props: EditorBodyProps) => unknown;
  let registered: { text(): string } | null;

  beforeEach(async () => {
    vi.resetModules();
    const loader = await import("../src/client/chunk-loader.ts");
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      const block = /^\.\/client\.editor-langs-(.+)\.js$/u.exec(specifier)?.[1];
      if (block === undefined) throw new Error(`no chunk built for ${specifier}`);
      return {
        renderer: block,
        mount: (element: HTMLElement, options: { text: string }) => {
          // A real editor normalizes CRLF to \n; the fake does the same so the
          // assertion is about the contract rather than about the fake.
          const normalized = options.text.replace(/\r\n/gu, "\n");
          element.textContent = normalized;
          return {
            setText() {},
            getText: () => normalized,
            revealRange() {},
            clearSelection() {},
            focus() {},
            destroy() {},
          };
        },
      };
    };
    loader.boot(require);
    Pane = (await import("../src/client/chunk/editor.tsx")).EditorBody as never;
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    registered = null;
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  it("publishes text without carriage returns", async () => {
    const find = {
      register: (source: { text(): string } | null) => {
        if (source !== null) registered = source;
      },
    };
    await act(async () => {
      root.render(
        createElement(Pane as never, {
          path: "sample.rs",
          sessionId: "s1",
          mode: "source",
          text: "fn main() {\r\n    let x = 1;\r\n}\r\n",
          t: (key: string) => key,
          onChange: () => undefined,
          find,
        } as never),
      );
    });
    await act(async () => {
      for (let turn = 0; turn < 8; turn += 1) await Promise.resolve();
    });

    expect(registered).not.toBeNull();
    const text = registered?.text() ?? "";
    expect(text).not.toContain("\r");
    // The offset the bar would report for `let` must equal its document offset.
    expect(text.indexOf("let")).toBe("fn main() {\n    let x = 1;\n}\n".indexOf("let"));
  });
});
