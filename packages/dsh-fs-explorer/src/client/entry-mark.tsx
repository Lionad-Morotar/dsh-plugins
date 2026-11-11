/**
 * The mark a file or directory row leads with.
 *
 * One component, used by the file tree and by the command panel's file rows:
 * a second drawing of the badge would drift the moment a file type is added.
 * The colour vocabulary lives in `ENTRY_MARK_STYLES`, which a consumer scopes
 * under its own root; the classes themselves are the tree's, so a row reads
 * the same in both places. The `.fx-name` and `.fx-row-dir` rules travel with
 * it for the same reason: the panel shows a search-result row, name first and
 * the parent directory dimmed beside it.
 */
import type { ReactElement, SVGProps } from "react";

import { badgeFor, iconFor } from "./model.ts";

/** One SVG the marks share: current colour, square, no title. */
function glyph(size: number, children: SVGProps<SVGPathElement> | readonly SVGProps<SVGPathElement>[]): ReactElement {
  const paths = Array.isArray(children) ? children : [children];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((props, index) => (
        <path key={index} {...props} />
      ))}
    </svg>
  );
}

/**
 * The opened or closed folder glyph.
 * @param props.open - whether the folder reads as open; a list that does not
 *   expand directories passes false.
 * @param props.size - the square edge, in pixels.
 */
export function FolderIcon({ open = true, size = 14 }: { readonly open?: boolean; readonly size?: number }): ReactElement {
  return open
    ? glyph(size, [
        { d: "M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9" },
        { d: "M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z" },
      ])
    : glyph(size, { d: "M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z" });
}

/**
 * The coloured file-type badge.
 * @param props.name - the basename the badge describes.
 */
export function FileBadge({ name }: { readonly name: string }): ReactElement {
  return (
    <span className="fx-badge" data-icon={iconFor(name)} aria-hidden="true">
      {badgeFor(name)}
    </span>
  );
}

/**
 * The leading mark of one entry: a folder glyph or the file-type badge.
 *
 * @param props.name - the basename, which decides the badge family.
 * @param props.kind - `directory` draws the folder, anything else the badge.
 * @param props.open - whether a directory reads as open.
 */
export function EntryMark({
  name,
  kind,
  open = false,
}: {
  readonly name: string;
  readonly kind: "file" | "directory";
  readonly open?: boolean;
}): ReactElement {
  if (kind === "directory") {
    return (
      <span className="fx-folder" data-open={open ? "true" : "false"} aria-hidden="true">
        <FolderIcon open={open} />
      </span>
    );
  }
  return <FileBadge name={name} />;
}

/**
 * The colour and geometry the marks need.
 *
 * Scoped under whatever root the consumer paints: the file tree's `.fx-root`
 * already declares the `--fx-*` variables, and another surface that embeds a
 * mark declares the same variables on its own root before inserting this.
 */
export const ENTRY_MARK_STYLES = `
.fx-folder { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; flex: none; color: var(--fx-folder); }
.fx-folder[data-open="false"] { color: color-mix(in oklab, var(--fx-folder) 78%, var(--fx-caption)); }
.fx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--fx-fs-code) * 1.6364);
  height: calc(var(--fx-fs-code) * 1.3636);
  flex: none;
  border-radius: 4px;
  background: color-mix(in oklab, currentColor 13%, transparent);
  font-family: var(--fx-mono);
  font-size: calc(var(--fx-fs-code) * 0.7727);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}
.fx-badge[data-icon="code"] { color: var(--fx-code); }
.fx-badge[data-icon="markdown"] { color: var(--fx-markdown); }
.fx-badge[data-icon="data"] { color: var(--fx-data); }
.fx-badge[data-icon="image"] { color: var(--fx-image); }
.fx-badge[data-icon="style"] { color: var(--fx-style); }
.fx-badge[data-icon="config"] { color: var(--fx-config); }
.fx-badge[data-icon="archive"] { color: var(--fx-archive); }
.fx-badge[data-icon="file"] { color: var(--fx-file); }
.fx-name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(var(--fx-fs) * 0.8571); }
.fx-row-dir {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--fx-caption);
  font-size: calc(var(--fx-fs) * 0.75);
  white-space: nowrap;
}
`;
