/**
 * One package's rows, drawn as a directory tree.
 *
 * The board used to list a package's files flat with the directory repeated on
 * every row. In a repository where one directory holds a hundred and eighty
 * files that is a hundred and eighty copies of the same word, and the shape of
 * the suite is invisible: nothing on screen says that `test/unit` is a subtree.
 * This draws the directories once and hangs the files under them.
 *
 * The component owns the recursion and the headers; it does not own the rows.
 * A row's ticks, reading and selected state are resolved by the view from the
 * run's scope and phase, and a tree that decided those for itself would disagree
 * with its neighbours. So the view hands down a `renderRow` that already knows
 * how to draw one file, and this file only decides where it goes.
 *
 * Indentation is a padding on the header rather than nested containers: the list
 * is a flat scroll box whose rows are `option`s of one listbox, and nesting the
 * DOM would put the rows inside elements the list's own traversal does not know
 * about.
 */
import type { ReactElement } from "react";

import type { DirectoryNode, PackageTree } from "../model.ts";

/** Strings the tree renders. */
export interface LaneTreeStrings {
  readonly failed: string;
}

/** Props the tree takes. */
export interface LaneTreeProps {
  readonly pkg: PackageTree;
  /** Draws one file row, wherever the tree decides it belongs. */
  readonly renderRow: (row: PackageTree["rows"][number]) => ReactElement;
  readonly strings: LaneTreeStrings;
}

/** How far one nesting level indents its header, in pixels. */
const INDENT_PX = 14;

/**
 * Render one directory and everything below it.
 * @param props - the node, its package, the row renderer and the strings.
 * @returns the node's header, its files, then its children.
 */
function DirectoryBranch({
  node,
  packageName,
  renderRow,
  strings,
}: {
  readonly node: DirectoryNode;
  readonly packageName: string;
  readonly renderRow: LaneTreeProps["renderRow"];
  readonly strings: LaneTreeStrings;
}): ReactElement {
  return (
    <div data-tst="directory-branch">
      <div
        data-testid="directory-section"
        data-tst="directory"
        // The package is part of the identity because the node's own key is only
        // the path inside its package: `test/unit` exists in a dozen packages,
        // and a later slice keys collapse state on this attribute.
        data-dir={`${packageName}:${node.key}`}
        data-depth={node.depth}
        style={{ paddingLeft: `${String(node.depth * INDENT_PX)}px` }}
      >
        <span data-tst="directory-name">{node.name}</span>
        {node.stats.failed === 0 ? null : (
          <span data-tst="directory-failed">
            {node.stats.failed} {strings.failed}
          </span>
        )}
      </div>
      {node.files.map(row => (
        <div key={row.path} data-tst="lane-slot">
          {renderRow(row)}
        </div>
      ))}
      {node.directories.map(child => (
        <DirectoryBranch
          key={child.key}
          node={child}
          packageName={packageName}
          renderRow={renderRow}
          strings={strings}
        />
      ))}
    </div>
  );
}

/**
 * Render a package's rows: flat when it has nothing to nest, a tree otherwise.
 * @param props - the package, the row renderer and the strings.
 * @returns the rows.
 */
export function LaneTree({ pkg, renderRow, strings }: LaneTreeProps): ReactElement {
  if (!pkg.grouped) {
    return (
      <>
        {pkg.rows.map(row => (
          <div key={row.path} data-tst="lane-slot">
            {renderRow(row)}
          </div>
        ))}
      </>
    );
  }
  return (
    <>
      {pkg.directories.map(node => (
        <DirectoryBranch
          key={node.key}
          node={node}
          packageName={pkg.packageName}
          renderRow={renderRow}
          strings={strings}
        />
      ))}
    </>
  );
}
