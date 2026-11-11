/**
 * The typescript language chunk.
 *
 * TypeScript without JSX.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: each chunk inlines its own CodeMirror core, so an extension
 * built elsewhere fails the host's identity check. See read-only.tsx.
 */
import { javascript } from "@codemirror/lang-javascript";
import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "typescript" as const;

export function mount(host: HTMLElement, options: ReadOnlyOptions): ReadOnlyHandle {
  return mountReadOnly(host, options, javascript({ typescript: true }));
}
