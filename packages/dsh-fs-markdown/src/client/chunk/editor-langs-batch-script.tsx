/**
 * The editable batch-script block: general-purpose and scripting languages.
 *
 * One chunk per batch, because the edit surface's own chunk holds only the ten
 * in-service grammars and adding 44 more to it would double a Markdown
 * first-open. The grammar sources mirror the read-only block of the same name.
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

import type { EditableHandle, EditableMountOptions } from "../contracts.ts";
import { mountEditable } from "./editor-kit.tsx";

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
 * Exported so a test can assert every id has a factory without copying the list.
 * Raku has no mode of its own; it descends from Perl 6, so the perl mode is the
 * closest base colour.
 */
export const grammars: Readonly<Record<string, () => Extension>> = {
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
 * @param options - the document, its language and the shell's sinks.
 * @returns the handle the shell keeps.
 */
export function mount(host: HTMLElement, options: EditableMountOptions): EditableHandle {
  const factory = grammars[options.language];
  return mountEditable(host, options, factory === undefined ? [] : factory());
}
