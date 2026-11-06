/**
 * The block widget that paints one GFM table in reading mode.
 *
 * Typing inside a rendered table is not possible by design: the source is the
 * single editable surface, and the planner shows it as soon as the selection
 * touches the table. The widget therefore has one job besides painting — turn a
 * click on a cell into a selection on that cell's first character, so the table
 * opens for editing where the reader pointed instead of only from the keyboard.
 *
 * Cells reuse the same inline scanner as the editor (`planInline`), which is
 * what keeps `**bold**`, backticks and link labels inside a table consistent
 * with the same marks in a paragraph.
 */
import { WidgetType, type EditorView } from "@codemirror/view";

import { CLASS_NAMES } from "./classes.ts";
import { planInline } from "./decorations.ts";
import type { TableAlignment, TableBlock, TableCell, TableRow } from "./tables.ts";

/** ASCII punctuation, the characters a Markdown backslash may escape. */
function isAsciiPunctuation(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return (
    (code >= 33 && code <= 47) ||
    (code >= 58 && code <= 64) ||
    (code >= 91 && code <= 96) ||
    (code >= 123 && code <= 126)
  );
}

/**
 * Resolve the backslash escapes GFM processes outside code spans.
 * @param text - raw source text.
 * @returns the text a reader should see.
 */
function unescapeMarkdown(text: string): string {
  let result = "";
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index] ?? "";
    const next = text[index + 1] ?? "";
    if (char === "\\" && next !== "" && isAsciiPunctuation(next)) {
      result += next;
      index += 1;
      continue;
    }
    result += char;
  }
  return result;
}

/** The CSS `text-align` value a column declares, if any. */
function textAlign(alignment: TableAlignment): string | undefined {
  return alignment === "none" ? undefined : alignment;
}

export class TableWidget extends WidgetType {
  /** Content fingerprint; two plans for the same table paint the same DOM. */
  private readonly key: string;

  /**
   * @param table - the parsed table, in document coordinates.
   * @param text - the whole document, for cell slices and inline scanning.
   */
  constructor(
    private readonly table: TableBlock,
    private readonly text: string,
  ) {
    super();
    this.key = `${String(table.from)}:${String(table.to)}:${text.slice(table.from, table.to)}`;
  }

  override eq(other: WidgetType): boolean {
    return other instanceof TableWidget && other.key === this.key;
  }

  /**
   * The widget handles its own pointer events; letting CodeMirror also treat a
   * click as a selection gesture would fight the cell mapping below.
   */
  override ignoreEvent(): boolean {
    return true;
  }

  override toDOM(view: EditorView): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "fmd-table-block";
    wrap.dataset.testid = "fs-md-table";
    wrap.append(this.buildTable());
    wrap.addEventListener("mousedown", event => {
      this.revealSource(event, view);
    });
    return wrap;
  }

  /**
   * Move the selection into the cell under the pointer.
   *
   * The dispatch is enough to remove the widget: decorations are recomputed
   * from the selection, and a table the selection touches is shown as source.
   * @param event - the widget's mousedown event.
   * @param view - the editor that owns this widget.
   */
  private revealSource(event: MouseEvent, view: EditorView): void {
    if (event.button !== 0) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-fmd-pos]") : null;
    const position = target?.dataset.fmdPos;
    if (position === undefined) return;
    event.preventDefault();
    view.dispatch({ selection: { anchor: Number(position) } });
    view.focus();
  }

  /** Paint the table: one header row, then the body rows GFM normalized. */
  private buildTable(): HTMLTableElement {
    const table = document.createElement("table");
    table.className = "fmd-table";
    const head = document.createElement("thead");
    head.append(this.buildRow("th", this.table.header));
    table.append(head);
    if (this.table.rows.length > 0) {
      const body = document.createElement("tbody");
      for (const row of this.table.rows) body.append(this.buildRow("td", row));
      table.append(body);
    }
    return table;
  }

  /**
   * Paint one row, aligning each cell the way its column declares.
   * @param tag - `th` for the header, `td` for body rows.
   * @param row - parsed cells in document coordinates.
   * @returns the row element.
   */
  private buildRow(tag: "th" | "td", row: TableRow): HTMLTableRowElement {
    const element = document.createElement("tr");
    row.cells.forEach((cell, index) => {
      const node = document.createElement(tag);
      const align = textAlign(this.table.alignments[index] ?? "none");
      if (align !== undefined) node.style.textAlign = align;
      // The clicked cell remembers where its content starts; the widget turns
      // that into a selection on pointer down.
      node.dataset.fmdPos = String(cell.from);
      this.appendInline(node, cell);
      element.append(node);
    });
    return element;
  }

  /**
   * Paint one cell's inline marks.
   *
   * The scanner drops the source markers and styles the remaining text, so the
   * walk below copies plain stretches verbatim and wraps styled ones in the
   * class the stylesheet defines. Code spans keep their backslashes because
   * CommonMark does not process escapes inside them.
   * @param host - the cell element.
   * @param cell - trimmed content bounds.
   */
  private appendInline(host: HTMLElement, cell: TableCell): void {
    let cursor = cell.from;
    for (const range of planInline(this.text, cell.from, cell.to)) {
      if (range.from > cursor) host.append(document.createTextNode(unescapeMarkdown(this.text.slice(cursor, range.from))));
      if (range.kind === "style") {
        const style = range.style ?? "code";
        const span = document.createElement("span");
        span.className = CLASS_NAMES[style];
        const content = this.text.slice(range.from, range.to);
        span.textContent = style === "code" ? content : unescapeMarkdown(content);
        host.append(span);
      }
      cursor = range.to;
    }
    if (cursor < cell.to) host.append(document.createTextNode(unescapeMarkdown(this.text.slice(cursor, cell.to))));
  }
}
