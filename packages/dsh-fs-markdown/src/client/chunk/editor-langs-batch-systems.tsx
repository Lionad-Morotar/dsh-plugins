/**
 * The editable batch-systems block: C-family and .NET languages.
 *
 * The edit surface's own chunk holds ten grammars statically. The other 44
 * languages get one chunk per batch instead, because putting them all in the
 * editor chunk would push a Markdown first-open from about 214 KB to about
 * 400 KB. Each block inlines CodeMirror plus its own grammars, which is the
 * structural cost of a chunk being a bundle.
 *
 * The grammar sources mirror the read-only block of the same name, so a file
 * colours the same whether it is being read or edited.
 */
import { cpp } from "@codemirror/lang-cpp";
import { StreamLanguage } from "@codemirror/language";
import { csharp, dart, objectiveC, objectiveCpp, shader } from "@codemirror/legacy-modes/mode/clike";
import { fSharp } from "@codemirror/legacy-modes/mode/mllike";
import { vb } from "@codemirror/legacy-modes/mode/vb";
import type { Extension } from "@codemirror/state";

import type { EditableHandle, EditableMountOptions } from "../contracts.ts";
import { mountEditable } from "./editor-kit.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "batch-systems" as const;

/**
 * The languages this block draws, in the catalogue's order.
 *
 * `test/editor-langs.test.ts` asserts this list equals the catalogue's for this
 * block, element for element; `scripts/build.mjs` guards the block set itself.
 */
export const ids = [
  "c",
  "cpp",
  "objective-c",
  "objective-cpp",
  "cuda-cpp",
  "hlsl",
  "shaderlab",
  "csharp",
  "dart",
  "fsharp",
  "vb",
] as const;

/**
 * One grammar per language id.
 *
 * Exported so a test can assert every id has a factory without copying the list.
 * CUDA, HLSL and ShaderLab have no grammar of their own; they are C-family
 * shading dialects, so the C++ grammar is the closest honest answer.
 */
export const grammars: Readonly<Record<string, () => Extension>> = {
  c: () => cpp(),
  cpp: () => cpp(),
  "objective-c": () => StreamLanguage.define(objectiveC),
  "objective-cpp": () => StreamLanguage.define(objectiveCpp),
  "cuda-cpp": () => cpp(),
  hlsl: () => cpp(),
  shaderlab: () => StreamLanguage.define(shader),
  csharp: () => StreamLanguage.define(csharp),
  dart: () => StreamLanguage.define(dart),
  fsharp: () => StreamLanguage.define(fSharp),
  vb: () => StreamLanguage.define(vb),
};

/**
 * Mount the editor for one language in this block.
 * @param host - the element the editor fills.
 * @param options - the document, its language and the shell's sinks.
 * @returns the handle the shell keeps.
 */
export function mount(host: HTMLElement, options: EditableMountOptions): EditableHandle {
  const factory = grammars[options.language];
  return mountEditable(host, options, factory === undefined ? [] : factory());
}
