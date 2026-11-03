/**
 * The skill-alias settings page.
 *
 * One page, two controls: a switch for whether the keyword needs a leading `/`,
 * and a table of keyword → target → params rows. The table is the whole editor;
 * there is no save button because every edit publishes through the shared store
 * and survives the page closing.
 *
 * The page is a normal React component (the settings slot supplies a hook
 * dispatcher), unlike the older DOM-painted tab page in this package. Rows keep
 * empty fields while editing: unfinished rows are a legal draft and matching
 * simply ignores them.
 */
import { useRef, useSyncExternalStore, type ComponentType, type ReactElement } from "react";

import { aliasRowIssue, type AliasRow, type AliasStore } from "./alias-store.ts";

/** Translator seat owned by this package. */
export type AliasPageTranslate = (key: string, params?: Record<string, string | number>) => string;

/** What one page mount closes over. */
export interface AliasPageDeps {
  readonly store: AliasStore;
  readonly translate: AliasPageTranslate;
}

/** One table row. */
function AliasRowEditor(props: {
  row: AliasRow;
  store: AliasStore;
  t: AliasPageTranslate;
  focus: boolean;
  clearFocus(): void;
}): ReactElement {
  const { row, store, t } = props;
  const issue = aliasRowIssue(row);
  return (
    <tr data-testid="alias-row" data-row-id={row.id} data-incomplete={issue === undefined ? undefined : ""}>
      <td>
        <input
          className="dsh-better-alias-input"
          data-testid="alias-keyword"
          value={row.keyword}
          placeholder="wf"
          spellCheck={false}
          autoComplete="off"
          aria-label={t("alias.table.keyword")}
          ref={(node) => {
            if (node !== null && props.focus) {
              node.focus();
              props.clearFocus();
            }
          }}
          onChange={(event) => store.updateRow(row.id, { keyword: event.target.value })}
        />
      </td>
      <td>
        <input
          className="dsh-better-alias-input"
          data-testid="alias-target"
          value={row.target}
          placeholder="flow-workflow"
          spellCheck={false}
          autoComplete="off"
          aria-label={t("alias.table.target")}
          onChange={(event) => store.updateRow(row.id, { target: event.target.value })}
        />
      </td>
      <td>
        <input
          className="dsh-better-alias-input"
          data-testid="alias-params"
          value={row.params}
          placeholder={t("alias.table.paramsPlaceholder")}
          spellCheck={false}
          autoComplete="off"
          aria-label={t("alias.table.params")}
          onChange={(event) => store.updateRow(row.id, { params: event.target.value })}
        />
      </td>
      <td className="dsh-better-alias-actions">
        <button
          type="button"
          className="dsh-better-alias-delete"
          data-testid="alias-remove"
          aria-label={t("alias.remove", { keyword: row.keyword.trim() || t("alias.unnamed") })}
          title={t("alias.remove", { keyword: row.keyword.trim() || t("alias.unnamed") })}
          onClick={() => store.removeRow(row.id)}
        >
          ×
        </button>
      </td>
    </tr>
  );
}

/**
 * Build the settings page component.
 * @param deps - shared store and translator.
 * @returns the component registered into `settings.section`.
 */
export function createAliasSettingsPage(deps: AliasPageDeps): ComponentType {
  function AliasSettingsPage(): ReactElement {
    const config = useSyncExternalStore(deps.store.subscribe, deps.store.getSnapshot, deps.store.getSnapshot);
    const { translate: t } = deps;
    const pendingFocus = useRef<string | null>(null);

    const addRow = (): void => {
      pendingFocus.current = deps.store.addRow();
    };

    return (
      <section className="dsh-better-alias-page" data-testid="alias-page">
        <h2 className="dsh-better-alias-heading">{t("alias.heading")}</h2>

        <label className="dsh-better-alias-prefix">
          <span>
            <span className="dsh-better-alias-prefix-title">{t("alias.prefix.title")}</span>
            <span className="dsh-better-alias-prefix-hint">
              {t(config.prefix ? "alias.prefix.on" : "alias.prefix.off")}
            </span>
          </span>
          <input
            type="checkbox"
            data-testid="alias-prefix"
            checked={config.prefix}
            aria-label={t("alias.prefix.title")}
            onChange={(event) => deps.store.setPrefix(event.target.checked)}
          />
        </label>

        <div className="dsh-better-alias-table-wrap">
          <table className="dsh-better-alias-table">
            <thead>
              <tr>
                <th scope="col">{t("alias.table.keyword")}</th>
                <th scope="col">{t("alias.table.target")}</th>
                <th scope="col">{t("alias.table.params")}</th>
                <th scope="col" aria-label={t("alias.table.actions")} />
              </tr>
            </thead>
            <tbody>
              {config.rows.map((row) => (
                <AliasRowEditor
                  key={row.id}
                  row={row}
                  store={deps.store}
                  t={t}
                  focus={pendingFocus.current === row.id}
                  clearFocus={() => {
                    pendingFocus.current = null;
                  }}
                />
              ))}
            </tbody>
          </table>
          {config.rows.length === 0 ? (
            <p className="dsh-better-alias-empty" data-testid="alias-empty">
              {t("alias.empty")}
            </p>
          ) : null}
        </div>

        <button type="button" className="dsh-better-alias-add" data-testid="alias-add" onClick={addRow}>
          {t("alias.add")}
        </button>
        <p className="dsh-better-alias-footnote">{t("alias.footnote")}</p>
      </section>
    );
  }
  return AliasSettingsPage;
}
