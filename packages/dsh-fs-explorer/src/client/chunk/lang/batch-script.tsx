/**
 * The batch-script block: general-purpose and scripting languages.
 *
 * A block is a bundle, and every bundle inlines its own copy of CodeMirror, so
 * the languages outside the first slice share four blocks. This one holds the
 * scripting languages: three have a real grammar package (Go, Rust, Java) and
 * the rest come from the legacy stream modes named in the coverage record.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: the host's `require` resolves no `@codemirror/*`. See
 * `read-only.tsx`.
 */
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { StreamLanguage } from "@codemirror/language";
import { clojure } from "@codemirror/legacy-modes/mode/clojure";
import { coffeeScript } from "@codemirror/legacy-modes/mode/coffeescript";
import { groovy } from "@codemirror/legacy-modes/mode/groovy";
import { julia } from "@codemirror/legacy-modes/mode/julia";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { perl } from "@codemirror/legacy-modes/mode/perl";
import { powerShell } from "@codemirror/legacy-modes/mode/powershell";
import { r } from "@codemirror/legacy-modes/mode/r";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { swift } from "@codemirror/legacy-modes/mode/swift";
import type { Extension } from "@codemirror/state";

import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "batch-script" as const;

/**
 * The languages this block draws, in the catalogue's order.
 *
 * The build asserts this list equals the catalogue's for this block, element for
 * element.
 */
export const ids = [
  "go",
  "rust",
  "swift",
  "java",
  "groovy",
  "clojure",
  "ruby",
  "perl",
  "raku",
  "lua",
  "r",
  "julia",
  "powershell",
  "shellscript",
  "coffeescript",
] as const;

/**
 * One grammar per language id.
 *
 * Raku has no mode of its own; it descends from Perl 6, so the perl mode is the
 * closest base colour, which is what the coverage record decided.
 */
const grammars: Readonly<Record<string, () => Extension>> = {
  go: () => go(),
  rust: () => rust(),
  swift: () => StreamLanguage.define(swift),
  java: () => java(),
  groovy: () => StreamLanguage.define(groovy),
  clojure: () => StreamLanguage.define(clojure),
  ruby: () => StreamLanguage.define(ruby),
  perl: () => StreamLanguage.define(perl),
  raku: () => StreamLanguage.define(perl),
  lua: () => StreamLanguage.define(lua),
  r: () => StreamLanguage.define(r),
  julia: () => StreamLanguage.define(julia),
  powershell: () => StreamLanguage.define(powerShell),
  shellscript: () => StreamLanguage.define(shell),
  coffeescript: () => StreamLanguage.define(coffeeScript),
};

/**
 * Mount the editor for one language in this block.
 * @param host - the element the editor fills.
 * @param options - page text, path and first line.
 * @param id - language id from the catalogue.
 * @returns the update/destroy handle.
 */
export function mount(host: HTMLElement, options: ReadOnlyOptions, id: string): ReadOnlyHandle {
  const factory = grammars[id];
  return mountReadOnly(host, options, factory === undefined ? [] : factory());
}
