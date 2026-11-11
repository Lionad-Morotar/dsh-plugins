/**
 * The editable batch-webstyle block: markup, stylesheet and config languages.
 *
 * One chunk per batch, because the edit surface's own chunk holds only the ten
 * in-service grammars. The grammar sources mirror the read-only block of the
 * same name, so a file colours the same whether it is read or edited.
 */
import { html } from "@codemirror/lang-html";
import { less } from "@codemirror/lang-less";
import { php } from "@codemirror/lang-php";
import { sass } from "@codemirror/lang-sass";
import { StreamLanguage } from "@codemirror/language";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { pug } from "@codemirror/legacy-modes/mode/pug";
import type { Extension } from "@codemirror/state";

import type { EditableHandle, EditableMountOptions } from "../contracts.ts";
import { mountEditable } from "./editor-kit.tsx";

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
 * grammar and only the indentation rule differs. The ini family is one legacy
 * mode, which is the same source the coverage record names for all four.
 */
export const grammars: Readonly<Record<string, () => Extension>> = {
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
 * @param options - the document, its language and the shell's sinks.
 * @returns the handle the shell keeps.
 */
export function mount(host: HTMLElement, options: EditableMountOptions): EditableHandle {
  const factory = grammars[options.language];
  return mountEditable(host, options, factory === undefined ? [] : factory());
}
