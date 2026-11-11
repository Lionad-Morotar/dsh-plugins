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
