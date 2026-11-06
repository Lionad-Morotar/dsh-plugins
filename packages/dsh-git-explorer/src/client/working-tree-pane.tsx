/**
 * The detail column's working-tree mode: what the uncommitted row shows instead
 * of a commit.
 *
 * Everything here comes from the snapshot the view already holds, so selecting
 * the working tree costs no host round trip. The pane is deliberately a sibling
 * of the commit detail rather than a branch inside it: a commit detail is a
 * request with a loading and a failure state, and a summary of files already in
 * memory has neither.
 */
import { basename, statusLetter, type ChangeGroup } from "./model.ts";
import type { Translate } from "./copy.ts";

/** Line counts for one path, absent for untracked files. */
export interface WorkingTreeStat {
  readonly additions: number | null;
  readonly deletions: number | null;
}

/** Props one working-tree pane mount reads. */
export interface WorkingTreePaneProps {
  readonly groups: readonly ChangeGroup[];
  readonly stats: ReadonlyMap<string, WorkingTreeStat>;
  readonly t: Translate;
  /** Open one changed file in the file workbench. */
  readonly onOpen: (path: string, line?: number) => void;
}

/** Sum the per-path line counts, skipping paths that carry none. */
function totals(
  groups: readonly ChangeGroup[],
  stats: ReadonlyMap<string, WorkingTreeStat>,
): { readonly additions: number; readonly deletions: number; readonly counted: number } {
  let additions = 0;
  let deletions = 0;
  let counted = 0;
  for (const group of groups) {
    for (const file of group.files) {
      const stat = stats.get(file.path);
      if (stat === undefined) continue;
      additions += stat.additions ?? 0;
      deletions += stat.deletions ?? 0;
      counted += 1;
    }
  }
  return { additions, deletions, counted };
}

/**
 * Render the working-tree summary.
 * @param props - grouped changes, line stats, copy and the file opener.
 * @returns the pane element.
 */
export function WorkingTreePane({ groups, stats, t, onOpen }: WorkingTreePaneProps) {
  const fileCount = groups.reduce((sum, group) => sum + group.files.length, 0);
  const sums = totals(groups, stats);
  return (
    <section className="gx-detail" data-testid="git-working-tree">
      <header className="gx-detail-head">
        <strong className="gx-detail-subject">{t("uncommitted.title")}</strong>
        <span className="gx-count">{`${String(fileCount)} ${t("uncommitted.files")}`}</span>
        <span className="gx-spacer" />
        {/* A tree of only untracked paths has no line counts at all, so the
            totals are omitted rather than reported as a misleading +0 -0. */}
        {sums.counted === 0 ? null : (
          <span className="gx-detail-stats">
            <span className="gx-add">{`+${String(sums.additions)}`}</span>
            <span className="gx-del">{`-${String(sums.deletions)}`}</span>
          </span>
        )}
      </header>
      <div className="gx-detail-body" data-testid="git-working-tree-body">
        {groups.map(group => (
          <div key={group.dir} className="gx-detail-group">
            <div className="gx-group-head">
              <span className="gx-group-dir">{group.dir === "" ? t("changes.root") : group.dir}</span>
              <span className="gx-count">{group.files.length}</span>
            </div>
            {group.files.map(file => (
              <button
                key={file.path}
                type="button"
                className="gx-file"
                data-status={file.status}
                data-directory={file.isDirectory ? "true" : "false"}
                data-testid="git-change-file"
                title={
                  file.isDirectory
                    ? `${t(`status.${file.status}`)} · ${t("changes.directory")}`
                    : `${t(`status.${file.status}`)} · ${t("changes.jump")}`
                }
                onClick={() => {
                  if (!file.isDirectory) onOpen(file.path, 1);
                }}
              >
                <span className="gx-badge" data-status={file.status}>
                  {statusLetter(file.status)}
                </span>
                <span className="gx-file-name">
                  {basename(file.path)}
                  {file.origPath === undefined ? null : <span className="gx-file-orig">{basename(file.origPath)}</span>}
                </span>
                <span className="gx-file-stats">
                  <FileStat stat={stats.get(file.path)} />
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FileStat({ stat }: { readonly stat: WorkingTreeStat | undefined }) {
  if (stat === undefined) return null;
  if (stat.additions === null && stat.deletions === null) return <span className="gx-stat-muted">bin</span>;
  return (
    <>
      <span className="gx-add">{`+${String(stat.additions ?? 0)}`}</span>
      <span className="gx-del">{`-${String(stat.deletions ?? 0)}`}</span>
    </>
  );
}
