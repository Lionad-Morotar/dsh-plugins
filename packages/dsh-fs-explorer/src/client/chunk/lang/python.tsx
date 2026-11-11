/**
 * The python language chunk.
 *
 * The one grammar here that no other chunk shares.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: each chunk inlines its own CodeMirror core, so an extension
 * built elsewhere fails the host's identity check. See read-only.tsx.
 */
import { python } from "@codemirror/lang-python";
import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "python" as const;

export function mount(host: HTMLElement, options: ReadOnlyOptions, _id?: string): ReadOnlyHandle {
  return mountReadOnly(host, options, python());
}
