/**
 * The javascript language chunk.
 *
 * Plain JavaScript, no dialect flags.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: each chunk inlines its own CodeMirror core, so an extension
 * built elsewhere fails the host's identity check. See read-only.tsx.
 */
import { javascript } from "@codemirror/lang-javascript";
import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "javascript" as const;

export function mount(host: HTMLElement, options: ReadOnlyOptions, _id?: string): ReadOnlyHandle {
  return mountReadOnly(host, options, javascript({}));
}
