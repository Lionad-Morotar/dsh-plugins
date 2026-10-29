/** The left column: working-tree changes grouped by directory. */
import { basename, statusLetter, type ChangeGroup } from "./model.ts";
import type { Translate } from "./copy.ts";

/** Line counts for one path, absent for untracked files. */
export interface ChangeStatFace {
  readonly additions: number | null;
  readonly deletions: number | null;
}

/** Props one changes pane mount reads. */
export interface ChangesPaneProps {
  readonly groups: readonly ChangeGroup[];
  readonly stats: ReadonlyMap<string, ChangeStatFace>;
  readonly t: Translate;
  readonly onOpen: (path: string, line?: number) => void;
}

function Stat({ stat }: { readonly stat: ChangeStatFace | undefined }) {
  if (stat === undefined) return null;
  if (stat.additions === null && stat.deletions === null) return <span className="gx-stat-muted">bin</span>;
  return (
    <>
      <span className="gx-add">{`+${String(stat.additions ?? 0)}`}</span>
      <span className="gx-del">{`-${String(stat.deletions ?? 0)}`}</span>
    </>
  );
}

/**
 * Render the changes pane.
 * @param props - grouped changes, line stats, copy and the jump callback.
 * @returns the pane element.
 */
export function ChangesPane({ groups, stats, t, onOpen }: ChangesPaneProps) {
  const total = groups.reduce((sum, group) => sum + group.files.length, 0);
  return (
    <section className="gx-pane" data-testid="git-changes">
      <header className="gx-pane-head">
        <span>{t("changes.title")}</span>
        <span className="gx-count">{total}</span>
      </header>
      <div className="gx-scroll">
        {total === 0 ? (
          <div className="gx-empty gx-empty-inline">
            <strong>{t("changes.empty")}</strong>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.dir === "" ? "." : group.dir}>
              <div className="gx-group-head">
                <span className="gx-group-dir">{group.dir === "" ? t("changes.root") : group.dir}</span>
                <span className="gx-count">{group.files.length}</span>
              </div>
              {group.files.map(file => {
                const stat = stats.get(file.path);
                const label = t(`status.${file.status}`);
                return (
                  <button
                    key={file.path}
                    type="button"
                    className="gx-file"
                    data-status={file.status}
                    data-directory={file.isDirectory ? "true" : "false"}
                    data-renamed={file.origPath === undefined ? "false" : "true"}
                    data-testid="git-change-file"
                    title={file.isDirectory ? `${label} · ${t("changes.directory")}` : `${label} · ${t("changes.jump")}`}
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
                      <Stat stat={stat} />
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
