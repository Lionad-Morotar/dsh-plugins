/**
 * The batch-webstyle block: markup, stylesheet and config-file languages.
 *
 * A block is a bundle, and every bundle inlines its own copy of CodeMirror, so
 * the languages outside the first slice share four blocks. This one holds the
 * web and config formats: PHP, Handlebars, the two stylesheet dialects that are
 * not CSS proper, and the ini-family config rows.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: the host's `require` resolves no `@codemirror/*`. See
 * `read-only.tsx`.
 */
import { html } from "@codemirror/lang-html";
import { less } from "@codemirror/lang-less";
import { php } from "@codemirror/lang-php";
import { sass } from "@codemirror/lang-sass";
import { StreamLanguage } from "@codemirror/language";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { pug } from "@codemirror/legacy-modes/mode/pug";
import type { Extension } from "@codemirror/state";

import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "batch-webstyle" as const;

/**
 * The languages this block draws, in the catalogue's order.
 *
 * The build asserts this list equals the catalogue's for this block, element for
 * element.
 */
export const ids = [
  "php",
  "handlebars",
  "less",
  "scss",
  "properties",
  "ini",
  "ignore",
  "dotenv",
  "jade",
] as const;

/**
 * One grammar per language id.
 *
 * SCSS is the indented-syntax-off mode of the sass package: the two share a
 * grammar, and only the indentation rule differs. The ini family (properties,
 * ini, ignore, dotenv) is one legacy mode, which is the same source the coverage
 * record names for all four.
 */
const grammars: Readonly<Record<string, () => Extension>> = {
  php: () => php(),
  handlebars: () => html(),
  less: () => less(),
  scss: () => sass({ indented: false }),
  properties: () => StreamLanguage.define(properties),
  ini: () => StreamLanguage.define(properties),
  ignore: () => StreamLanguage.define(properties),
  dotenv: () => StreamLanguage.define(properties),
  jade: () => StreamLanguage.define(pug),
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
