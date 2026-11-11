/**
 * The batch-systems block: C-family and .NET languages.
 *
 * A block is a bundle, and every bundle inlines its own copy of CodeMirror
 * (about 86 KB gzipped), so the languages that were not in the first slice share
 * four blocks instead of getting one each. This one holds the languages whose
 * grammar source is the C family: the real C++ grammar for `c` and `cpp`, and
 * the legacy clike configurations for the dialects that have no package of their
 * own.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: the host's `require` resolves no `@codemirror/*`, so an
 * extension built elsewhere fails the identity check. See `read-only.tsx`.
 */
import { cpp } from "@codemirror/lang-cpp";
import { StreamLanguage } from "@codemirror/language";
import { csharp, dart, objectiveC, objectiveCpp, shader } from "@codemirror/legacy-modes/mode/clike";
import { fSharp } from "@codemirror/legacy-modes/mode/mllike";
import { vb } from "@codemirror/legacy-modes/mode/vb";
import type { Extension } from "@codemirror/state";

import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "batch-systems" as const;

/**
 * The languages this block draws, in the catalogue's order.
 *
 * The build asserts this list equals the catalogue's for this block, element for
 * element, so a language cannot be listed there and missing from the table below.
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
 * CUDA, HLSL and ShaderLab have no grammar of their own; they are C-family
 * shading dialects, so the C++ grammar is the closest honest answer. Objective-C
 * and Objective-C++ come from the legacy clike configurations, which is the same
 * source the coverage record names for them.
 */
const grammars: Readonly<Record<string, () => Extension>> = {
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
 *
 * An id outside the table gets an empty extension rather than a throw: the file
 * stays readable and editable, it just gets no parser, which is the honest
 * answer for a language this block does not carry.
 * @param host - the element the editor fills.
 * @param options - page text, path and first line.
 * @param id - language id from the catalogue.
 * @returns the update/destroy handle.
 */
export function mount(host: HTMLElement, options: ReadOnlyOptions, id: string): ReadOnlyHandle {
  const factory = grammars[id];
  return mountReadOnly(host, options, factory === undefined ? [] : factory());
}
