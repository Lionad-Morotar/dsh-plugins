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
  readonly expandDirectory: string;
  readonly collapseDirectory: string;
}

/** Props the tree takes. */
export interface LaneTreeProps {
  readonly pkg: PackageTree;
  /** Draws one file row, wherever the tree decides it belongs. */
  readonly renderRow: (row: PackageTree["rows"][number]) => ReactElement;
  /**
   * The folded directories, keyed `${packageName}:${dirPath}`.
   *
   * Owned by the view rather than the tree: the same set decides which rows are
   * navigable, so a second copy here would let the screen and the keyboard
   * disagree about what is on it.
   */
  readonly collapsed: ReadonlySet<string>;
  /** Fold or unfold one directory. */
  readonly onToggle: (key: string) => void;
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
  collapsed,
  onToggle,
  strings,
}: {
  readonly node: DirectoryNode;
  readonly packageName: string;
  readonly renderRow: LaneTreeProps["renderRow"];
  readonly collapsed: ReadonlySet<string>;
  readonly onToggle: LaneTreeProps["onToggle"];
  readonly strings: LaneTreeStrings;
}): ReactElement {
  const key = `${packageName}:${node.key}`;
  const folded = collapsed.has(key);
  return (
    <div data-tst="directory-branch">
      <div
        data-testid="directory-section"
        data-tst="directory"
        // The package is part of the identity because the node's own key is only
        // the path inside its package: `test/unit` exists in a dozen packages.
        data-dir={key}
        data-depth={node.depth}
        style={{ paddingLeft: `${String(node.depth * INDENT_PX)}px` }}
      >
        <button
          type="button"
          data-testid="directory-toggle"
          data-tst="directory-toggle"
          // Not a tab stop and not an option: the list owns the focus and the
          // arrow keys, and a focusable header would take the focus away from it
          // and strand a keyboard reader mid-list. The pointer is the way in.
          aria-expanded={!folded}
          data-collapsed={folded ? "true" : "false"}
          aria-label={folded ? strings.expandDirectory : strings.collapseDirectory}
          title={folded ? strings.expandDirectory : strings.collapseDirectory}
          onClick={() => onToggle(key)}
        >
          <span aria-hidden="true" data-tst="directory-chevron">
            {folded ? "▸" : "▾"}
          </span>
          <span data-tst="directory-name">{node.name}</span>
        </button>
        {node.stats.failed === 0 ? null : (
          <span data-tst="directory-failed">
            {node.stats.failed} {strings.failed}
          </span>
        )}
      </div>
      {/* A folded branch renders nothing below its header, children included:
          the subtree is not on screen, so its rows must not be in the DOM. */}
      {folded
        ? null
        : (
          <>
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
                collapsed={collapsed}
                onToggle={onToggle}
                strings={strings}
              />
            ))}
          </>
        )}
    </div>
  );
}

/**
 * Render a package's rows: flat when it has nothing to nest, a tree otherwise.
 * @param props - the package, the row renderer and the strings.
 * @returns the rows.
 */
export function LaneTree({ pkg, renderRow, collapsed, onToggle, strings }: LaneTreeProps): ReactElement {
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
          collapsed={collapsed}
          onToggle={onToggle}
          strings={strings}
        />
      ))}
    </>
  );
}
