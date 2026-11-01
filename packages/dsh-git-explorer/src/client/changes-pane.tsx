/** The left column: working-tree changes grouped by directory. */
import { useEffect, useRef } from "react";

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
  /** Whether entering the view still owes the pane one focus claim. */
  readonly claimFocus: boolean;
  /** Called once the claim is spent, so a reload cannot replay it. */
  readonly onFocusClaimed: () => void;
}

/**
 * Move keyboard focus onto the first file row of the changes pane.
 *
 * Directory rows only label a group; a file row is what opens in the file
 * panel, so a file row is what the claim is about. Two situations must leave
 * focus alone: one already inside the pane, because that placement was
 * deliberate, and a list with no file row, because parking focus on an empty
 * container reads as a lost focus rather than a moved one.
 * @param pane - the changes pane element, or null before its first render.
 */
export function focusFirstChangeRow(pane: HTMLElement | null): void {
  if (pane === null) return;
  const doc = pane.ownerDocument;
  if (pane.contains(doc.activeElement)) return;
  const row = pane.querySelector<HTMLElement>('button.gx-file[data-directory="false"]');
  if (row === null) return;
  // `preventScroll` keeps the browser from jumping the pane before the panel
  // below has laid out; the row then decides how far the list should move.
  row.focus({ preventScroll: true });
  row.scrollIntoView?.({ block: "nearest" });
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
 * @param props - grouped changes, line stats, copy, the jump callback and the focus claim.
 * @returns the pane element.
 */
export function ChangesPane({ groups, stats, t, onOpen, claimFocus, onFocusClaimed }: ChangesPaneProps) {
  const total = groups.reduce((sum, group) => sum + group.files.length, 0);
  const pane = useRef<HTMLElement>(null);

  // The claim is spent before it is served: a snapshot reload unmounts and
  // remounts this pane, so a claim kept here would fire again and pull a
  // keyboard reader off whatever row they had moved on to since.
  useEffect(() => {
    if (!claimFocus) return;
    onFocusClaimed();
    focusFirstChangeRow(pane.current);
  }, [claimFocus, onFocusClaimed]);

  return (
    <section ref={pane} className="gx-pane" data-testid="git-changes">
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
