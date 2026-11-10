window.__ModuleLoader__.load({
  id: "dsh-review-map",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var z=Object.defineProperty;var ye=Object.getOwnPropertyDescriptor;var ge=Object.getOwnPropertyNames;var be=Object.prototype.hasOwnProperty;var ke=(a,e)=>{for(var r in e)z(a,r,{get:e[r],enumerable:!0})},xe=(a,e,r,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ge(e))!be.call(a,i)&&i!==r&&z(a,i,{get:()=>e[i],enumerable:!(t=ye(e,i))||t.enumerable});return a};var Re=a=>xe(z({},"__esModule",{value:!0}),a);var ze={};ke(ze,{apply:()=>me,clientPlugin:()=>ce,default:()=>Pe,inject:()=>pe});module.exports=Re(ze);var I="dsh-review-map",A="conversation.view",X="review-map";var M="review-map",H="/review-map/api";var N={"review-map.tabTitle":"\u8BC4\u5BA1","review-map.repoFallback":"\u672A\u77E5\u4ED3\u5E93","review-map.scopeWorktree":"\u672A\u63D0\u4EA4","review-map.scopeBranch":"\u5206\u652F\u5BF9\u6BD4","review-map.refresh":"\u91CD\u65B0\u8BFB\u53D6","review-map.statLines":"\u6E90\u7801\u884C","review-map.statFiles":"\u6539\u52A8\u6587\u4EF6","review-map.uncommitted":"\u672A\u63D0\u4EA4 {count}","review-map.listMetaWorktree":"\u672A\u63D0\u4EA4\u6539\u52A8","review-map.listMetaBranch":"\u5BF9\u6BD4 {base}","review-map.listSort":"\u6309\u53D8\u66F4\u91CF\u6392\u5E8F","review-map.listEmpty":"\u5DE5\u4F5C\u533A\u6CA1\u6709\u53D8\u66F4","review-map.renameHint":"\u539F\u8DEF\u5F84 {path}","review-map.markBinary":"\u4E8C\u8FDB\u5236","review-map.markUntracked":"\u672A\u8DDF\u8E2A","review-map.markConflicted":"\u51B2\u7A81","review-map.statusAdded":"\u65B0\u589E","review-map.statusModified":"\u4FEE\u6539","review-map.statusDeleted":"\u5220\u9664","review-map.statusRenamed":"\u91CD\u547D\u540D","review-map.statusCopied":"\u590D\u5236","review-map.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","review-map.statusUntracked":"\u672A\u8DDF\u8E2A","review-map.statusConflicted":"\u51B2\u7A81","review-map.statusUnknown":"\u672A\u77E5","review-map.loading":"\u52A0\u8F7D\u4E2D","review-map.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u53D8\u66F4","review-map.emptyHint":"\u8BC4\u5BA1\u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u53D8\u66F4\u8303\u56F4\u94FA\u5F00\u3002","review-map.detailClose":"\u5173\u95ED\u8BE6\u60C5","review-map.detailTruncated":"\u5DF2\u622A\u65AD","review-map.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","review-map.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","review-map.detailEmpty":"\u8BE5\u6587\u4EF6\u6CA1\u6709\u53EF\u663E\u793A\u7684\u5DEE\u5F02","review-map.detailErrorConflicted":"\u6587\u4EF6\u6709\u672A\u89E3\u51B3\u7684\u51B2\u7A81","review-map.detailErrorTooLarge":"\u6587\u4EF6\u8FC7\u5927\uFF0C\u5DF2\u8DF3\u8FC7","review-map.detailErrorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.detailErrorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u6587\u4EF6","review-map.detailErrorUnknown":"\u8BFB\u53D6\u8BE5\u6587\u4EF6\u65F6\u51FA\u9519","review-map.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","review-map.errorNoBase":"\u4ED3\u5E93\u6CA1\u6709\u53EF\u6BD4\u57FA\u7EBF","review-map.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","review-map.errorTooLarge":"\u53D8\u66F4\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","review-map.errorConflicted":"\u8BE5\u6587\u4EF6\u5904\u4E8E\u51B2\u7A81\u4E2D","review-map.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.errorUnknown":"\u8BFB\u53D6\u53D8\u66F4\u65F6\u51FA\u9519"},V={"review-map.tabTitle":"Review","review-map.repoFallback":"Unknown repository","review-map.scopeWorktree":"Uncommitted","review-map.scopeBranch":"Branch","review-map.refresh":"Refresh","review-map.statLines":"Source lines","review-map.statFiles":"Files changed","review-map.uncommitted":"{count} uncommitted","review-map.listMetaWorktree":"Uncommitted changes","review-map.listMetaBranch":"Against {base}","review-map.listSort":"Sorted by churn","review-map.listEmpty":"No changes in this workspace","review-map.renameHint":"was {path}","review-map.markBinary":"binary","review-map.markUntracked":"untracked","review-map.markConflicted":"conflict","review-map.statusAdded":"added","review-map.statusModified":"modified","review-map.statusDeleted":"deleted","review-map.statusRenamed":"renamed","review-map.statusCopied":"copied","review-map.statusTypeChanged":"type changed","review-map.statusUntracked":"untracked","review-map.statusConflicted":"conflicted","review-map.statusUnknown":"unknown","review-map.loading":"Loading","review-map.empty":"Select a session to load its changes","review-map.emptyHint":"The review map will lay the change set out here.","review-map.detailClose":"Close the detail","review-map.detailTruncated":"Truncated","review-map.detailBinary":"Binary file, {size}","review-map.detailUnknownSize":"size unknown","review-map.detailEmpty":"This file has no diff to show","review-map.detailErrorConflicted":"This file has an unresolved conflict","review-map.detailErrorTooLarge":"This file is too large and was skipped","review-map.detailErrorUnreadable":"The read failed","review-map.detailErrorBadRequest":"This file cannot be read","review-map.detailErrorUnknown":"Something went wrong reading this file","review-map.errorNotARepo":"This directory is not a git repository","review-map.errorNoBase":"This repository has no baseline to compare against","review-map.errorNoSession":"This session has no workspace","review-map.errorTooLarge":"The change is too large to read in full","review-map.errorConflicted":"This file is in conflict","review-map.errorUnreadable":"The read failed","review-map.errorUnknown":"Something went wrong reading the changes"};var Y="data-dsh-review-map",Se=`[data-testid="review-map"] {
  position: relative;
  display: flex;
  flex-direction: column;
  /* The host only gives the conversation view a definite height when the panel
     declares itself a composer overlay (see the attribute in view.tsx). Without
     \`flex: 1 1 auto\` plus \`align-self: stretch\` the panel sits at its content
     height inside a column flex parent, and \`height: 100%\` then resolves
     against an auto parent. */
  flex: 1 1 auto;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  padding: 22px 26px calc(var(--dsh-composer-height, 140px) + 12px);
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: 1.45;

  /* The two state colours the list needs. Both are derived from host tokens so
     the light and dark palettes move them without a second block of rules. */
  --rm-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-del: var(--dsw-alias-state-error-primary, #cf222e);
  /* The diff's line backgrounds and gutter colours. Declared here so a theme can
     override them in one place; the values are mixed from the two state colours
     rather than used at full strength, because a solid green block behind every
     added line is unreadable in a dark theme. */
  --rm-add-bg: color-mix(in srgb, var(--rm-add) 14%, transparent);
  --rm-del-bg: color-mix(in srgb, var(--rm-del) 14%, transparent);
  --rm-add-fg: var(--rm-add);
  --rm-del-fg: var(--rm-del);
  --rm-mono: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  --rm-code: var(--dsh-code-font-size, 11px);
}

/* Header: identity, range, refresh. */
[data-testid="review-map"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="review-map"] [data-rm="title"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="repo-name"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="head"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  white-space: nowrap;
}

[data-testid="review-map"] [data-rm="scope"] {
  display: inline-flex;
  gap: 2px;
  margin-left: auto;
}

[data-testid="review-map"] [data-rm="scope"] button,
[data-testid="review-map"] [data-rm="refresh"] {
  font: inherit;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

[data-testid="review-map"] [data-rm="scope"] button[aria-pressed="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.04));
  border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16));
}

[data-testid="review-map"] [data-rm="refresh"]:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Stats: two readings, side by side. */
[data-testid="review-map"] [data-rm="stats"] {
  flex: none;
  display: flex;
  gap: 10px;
  padding: 12px 0;
}

[data-testid="review-map"] [data-rm="stat"] {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
}

[data-testid="review-map"] [data-rm="stat-label"] {
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="stat-value"] {
  font-family: var(--rm-mono);
  font-size: calc(var(--dsh-content-font-size, 14px) * 16 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="stat-add"] {
  color: var(--rm-add);
}

[data-testid="review-map"] [data-rm="stat-del"] {
  color: var(--rm-del);
}

[data-testid="review-map"] [data-rm="uncommitted"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

/* Split region: the list, and the panel beside it when one is open. */
[data-testid="review-map"] [data-rm="split"] {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  /* Closed: one column, the list takes everything. Open: the list keeps a
     readable minimum and the panel takes the larger share. Grid rather than
     flex because the two columns must not fight over a percentage. */
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
}

[data-testid="review-map"] [data-rm="split"][data-open="true"] {
  grid-template-columns: minmax(280px, 1fr) minmax(0, 1.4fr);
  gap: 14px;
}

/* A narrow panel stacks instead of scrolling sideways: a two-column split at
   this width would leave the diff narrower than its line numbers. */
@media (max-width: 720px) {
  [data-testid="review-map"] [data-rm="split"][data-open="true"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(120px, 0.8fr) minmax(0, 1.2fr);
  }
}

[data-testid="review-map"] [data-rm="list"] {
  min-height: 0;
  overflow-y: auto;
  /* No horizontal scroll: a long path is ellipsized, not panned. A review list
     that scrolls sideways hides the churn column, which is the column the sort
     is about. */
  overflow-x: hidden;
}

[data-testid="review-map"] [data-rm="list-meta"] {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 0 8px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="review-map"] [data-rm="list-empty"] {
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-testid="review-row"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 4px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
}

[data-testid="review-map"] [data-testid="review-row"]:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
}

[data-testid="review-map"] [data-rm="mark"] {
  flex: none;
  width: 1.2em;
  text-align: center;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="mark"][data-status="added"] {
  color: var(--rm-add);
}

[data-testid="review-map"] [data-rm="mark"][data-status="deleted"] {
  color: var(--rm-del);
}

[data-testid="review-map"] [data-rm="mark"][data-status="conflicted"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

[data-testid="review-map"] [data-rm="path"] {
  flex: 1 1 auto;
  min-width: 0;
  /* The ellipsis has to land on the path, not on the row: the row also holds the
     mark and the churn, and clipping it would cut the numbers off. */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

[data-testid="review-map"] [data-rm="path-dir"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="path-name"] {
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="path-name"].rm-struck {
  text-decoration: line-through;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-testid="review-row"][data-deleted="true"] [data-rm="path-dir"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
  opacity: 0.7;
}

[data-testid="review-map"] [data-rm="churn"] {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary, #6b655c);
  white-space: nowrap;
}

[data-testid="review-map"] [data-rm="churn"][data-note] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-style: italic;
}

/* Detail panel: header, then a scrolling diff. */
[data-testid="review-map"] [data-rm="detail"] {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  overflow: hidden;
}

[data-testid="review-map"] [data-rm="detail-header"] {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
}

[data-testid="review-map"] [data-rm="detail-path"] {
  flex: 1 1 auto;
  min-width: 0;
  /* The full path is the point of this header, so it wraps rather than being
     ellipsized: a truncated path in a detail panel is the one place a reader
     cannot work around. */
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="detail-status"] {
  flex: none;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="detail-churn"] {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="detail-close"] {
  flex: none;
  font: inherit;
  line-height: 1;
  padding: 2px 6px;
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  cursor: pointer;
}

[data-testid="review-map"] [data-rm="detail-body"] {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 4px 0;
}

[data-testid="review-map"] [data-rm="detail-loading"],
[data-testid="review-map"] [data-rm="detail-error"],
[data-testid="review-map"] [data-rm="detail-empty"],
[data-testid="review-map"] [data-rm="detail-binary"],
[data-testid="review-map"] [data-rm="detail-truncated"] {
  margin: 8px 10px;
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="detail-error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="review-map"] [data-rm="detail-truncated"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

/* Diff rows: two number gutters, a sign, then the text. */
[data-testid="review-map"] [data-rm="diff"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  /* No horizontal scroll: a long line is clipped with an ellipsis rather than
     turning the panel into a two-axis scroller. */
  overflow-x: hidden;
}

[data-testid="review-map"] [data-rm="diff-hunk"] {
  padding: 2px 10px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.05));
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

[data-testid="review-map"] [data-rm="diff-line"] {
  display: grid;
  grid-template-columns: 3.2em 3.2em 1.2em minmax(0, 1fr);
  align-items: baseline;
  /* Compact: a diff is read by scanning, and 20px is the tightest line that
     still separates two rows of a mono face at this size. */
  line-height: 20px;
  min-height: 20px;
}

[data-testid="review-map"] [data-rm="diff-old"],
[data-testid="review-map"] [data-rm="diff-new"] {
  text-align: right;
  padding-right: 6px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

[data-testid="review-map"] [data-rm="diff-sign"] {
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
  user-select: none;
}

[data-testid="review-map"] [data-rm="diff-text"] {
  padding-right: 10px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary, #14110d);
}

/* The two state colours are mixed with the surface rather than used at full
   strength: a solid green block behind every added line is unreadable in a dark
   theme, and the mix keeps the text's contrast against the panel. */
[data-testid="review-map"] [data-rm="diff-line"][data-kind="add"] {
  background: var(--rm-add-bg, color-mix(in srgb, var(--rm-add) 14%, transparent));
}

[data-testid="review-map"] [data-rm="diff-line"][data-kind="add"] [data-rm="diff-sign"] {
  color: var(--rm-add-fg, var(--rm-add));
}

[data-testid="review-map"] [data-rm="diff-line"][data-kind="del"] {
  background: var(--rm-del-bg, color-mix(in srgb, var(--rm-del) 14%, transparent));
}

[data-testid="review-map"] [data-rm="diff-line"][data-kind="del"] [data-rm="diff-sign"] {
  color: var(--rm-del-fg, var(--rm-del));
}

/* States. */
[data-testid="review-map"] [data-rm="loading"],
[data-testid="review-map"] [data-rm="error"] {
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="review-map"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
  margin: auto;
  padding: 24px;
  text-align: center;
}

[data-testid="review-map"] [data-rm="empty-title"] {
  margin: 0;
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="empty-hint"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}
`;function Z(a=typeof document>"u"?void 0:document){if(a===void 0)return;let e=a.querySelector(`style[${Y}]`);if(e!==null)return e;let r=a.createElement("style");return r.setAttribute(Y,""),r.textContent=Se,a.head.append(r),r}var o=require("react");async function J(a,e){let r=await a(e);if(!r.ok)throw new Error(`${e} answered ${String(r.status)}`);return await r.json()}function Q(a=fetch){return{async loadSnapshot(e,r){let t=new URLSearchParams({sessionId:e,scope:r.kind});return r.kind==="branch"&&r.baseRef!==void 0&&t.set("base",r.baseRef),await J(a,`${H}/state?${t.toString()}`)},async loadDiff(e,r,t){let i=new URLSearchParams({sessionId:e,path:t,scope:r.kind});return r.kind==="branch"&&r.baseRef!==void 0&&i.set("base",r.baseRef),await J(a,`${H}/diff?${i.toString()}`)}}}function ee(a){switch(a){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";case"untracked":return"U";case"conflicted":return"!";default:return"?"}}function W(a){if(a.status==="conflicted")return{additions:null,deletions:null,note:"conflicted"};if(a.untracked)return{additions:null,deletions:null,note:"untracked"};if(a.binary)return{additions:null,deletions:null,note:"binary"};let e=a.additions!==null&&a.additions>0?a.additions:null,r=a.deletions!==null&&a.deletions>0?a.deletions:null;return{additions:e,deletions:r,note:null}}function O(a){let e=[];return a.additions!==null&&e.push(`+${String(a.additions)}`),a.deletions!==null&&e.push(`\u2212${String(a.deletions)}`),e.join(" ")}function ae(a){let e=a.lastIndexOf("/");return e<0?{dir:"",name:a}:{dir:a.slice(0,e+1),name:a.slice(e+1)}}function te(a){let e=r=>(r.additions??0)+(r.deletions??0);return[...a].sort((r,t)=>{let i=e(t)-e(r);return i!==0?i:r.path<t.path?-1:r.path>t.path?1:0})}function re(a){let e=a.summary,r=e!==void 0&&e.files>0?e.files:a.files.length;if(e!==void 0&&e.files>0)return{files:r,additions:e.additions,deletions:e.deletions};let t=0,i=0;for(let l of a.files)t+=l.additions??0,i+=l.deletions??0;return{files:r,additions:t,deletions:i}}function ne(a){return a.slice(0,7)}function E(a,e){return a.replace(/\{(\w+)\}/gu,(r,t)=>e[t]??r)}function Ee(a){let e=`@@ -${String(a.oldStart)},${String(a.oldLines)} +${String(a.newStart)},${String(a.newLines)} @@`;return a.heading===void 0||a.heading===""?e:`${e} ${a.heading}`}function Ce(a){return a==="add"?"+":a==="del"?"\u2212":" "}function $(a,e,r,t){return{kind:"line",key:`${String(e??"x")}:${String(r??"x")}`,lineKind:a,oldLine:e,newLine:r,sign:Ce(a),text:t}}function ie(a){if(a.kind==="binary")return[];if(a.kind==="deleted")return a.lines.map((r,t)=>$("del",t+1,null,r));if(a.kind==="untracked")return a.lines.map((r,t)=>$("add",null,t+1,r));let e=[];for(let r of a.hunks){e.push({kind:"hunk",header:Ee(r)});for(let t of r.lines)e.push($(t.kind,t.oldLine,t.newLine,t.text))}return e}function de(a){return a<1024?`${String(a)} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:`${(a/(1024*1024)).toFixed(1)} MB`}var n=require("react/jsx-runtime");function oe(a,e){switch(a){case"added":return e.statusAdded;case"modified":return e.statusModified;case"deleted":return e.statusDeleted;case"renamed":return e.statusRenamed;case"copied":return e.statusCopied;case"type-changed":return e.statusTypeChanged;case"untracked":return e.statusUntracked;case"conflicted":return e.statusConflicted;default:return e.statusUnknown}}function Te(a,e){switch(a){case"not-a-repo":return e.errorNotARepo;case"no-base":return e.errorNoBase;case"no-session":return e.errorNoSession;case"too-large":return e.errorTooLarge;case"conflicted":return e.errorConflicted;case"unreadable":return e.errorUnreadable;default:return e.errorUnknown}}function Ue(a,e){switch(a){case"conflicted":return e.detailErrorConflicted;case"too-large":return e.detailErrorTooLarge;case"unreadable":return e.detailErrorUnreadable;case"bad-request":return e.detailErrorBadRequest;default:return e.detailErrorUnknown}}function se(a,e){return a==="binary"?e.markBinary:a==="untracked"?e.markUntracked:a==="conflicted"?e.markConflicted:null}function De({file:a,strings:e,selected:r,onSelect:t,onOpen:i,onKey:l}){let p=ae(a.path),m=W(a),C=se(m.note,e),c=a.status==="deleted",u=a.oldPath===void 0?void 0:E(e.renameHint,{path:a.oldPath});return(0,n.jsxs)("div",{"data-testid":"review-row","data-path":a.path,"data-status":a.status,"data-deleted":c?"true":void 0,"data-selected":r?"true":"false",role:"option","aria-selected":r,tabIndex:r?0:-1,title:u,"aria-label":u,onClick:()=>{t(a.path),i(a.path)},onKeyDown:v=>l(v,a.path),children:[(0,n.jsx)("span",{"data-rm":"mark","data-status":a.status,title:oe(a.status,e),children:ee(a.status)}),(0,n.jsxs)("span",{"data-rm":"path",children:[p.dir===""?null:(0,n.jsx)("span",{"data-rm":"path-dir",children:p.dir}),(0,n.jsx)("span",{"data-rm":"path-name",className:c?"rm-struck":void 0,children:p.name})]}),(0,n.jsx)("span",{"data-rm":"churn","data-note":m.note??void 0,children:C??O(m)})]})}function Me({path:a,file:e,phase:r,strings:t,onClose:i,bodyRef:l}){let p=e===void 0?void 0:W(e),m=p===void 0?null:se(p.note,t);return(0,n.jsxs)("div",{"data-testid":"review-detail","data-rm":"detail",children:[(0,n.jsxs)("div",{"data-rm":"detail-header",children:[(0,n.jsx)("span",{"data-rm":"detail-path",children:a}),e===void 0?null:(0,n.jsx)("span",{"data-rm":"detail-status",children:oe(e.status,t)}),p===void 0||m!==null?null:(0,n.jsx)("span",{"data-rm":"detail-churn",children:O(p)}),(0,n.jsx)("button",{type:"button","data-rm":"detail-close","aria-label":t.detailClose,onClick:i,children:"\xD7"})]}),(0,n.jsxs)("div",{"data-rm":"detail-body",ref:l,children:[r.kind==="loading"?(0,n.jsx)("p",{"data-rm":"detail-loading",children:t.loading}):null,r.kind==="error"?(0,n.jsx)("p",{"data-rm":"detail-error",children:Ue(r.code,t)}):null,r.kind==="ready"?(0,n.jsx)(Le,{diff:r.diff,strings:t}):null]})]})}function Le({diff:a,strings:e}){if(a.kind==="binary"){let t=a.bytes===null?e.detailUnknownSize:de(a.bytes);return(0,n.jsx)("p",{"data-rm":"detail-binary",children:E(e.detailBinary,{size:t})})}let r=ie(a);return r.length===0?(0,n.jsx)("p",{"data-rm":"detail-empty",children:e.detailEmpty}):(0,n.jsxs)(n.Fragment,{children:[a.kind==="text"&&a.truncated?(0,n.jsx)("p",{"data-rm":"detail-truncated",children:e.detailTruncated}):null,(0,n.jsx)("div",{"data-rm":"diff",children:r.map(t=>t.kind==="hunk"?(0,n.jsx)("div",{"data-rm":"diff-hunk",children:t.header},`hunk:${t.header}`):(0,n.jsxs)("div",{"data-rm":"diff-line","data-kind":t.lineKind,children:[(0,n.jsx)("span",{"data-rm":"diff-old",children:t.oldLine??""}),(0,n.jsx)("span",{"data-rm":"diff-new",children:t.newLine??""}),(0,n.jsx)("span",{"data-rm":"diff-sign",children:t.sign}),(0,n.jsx)("span",{"data-rm":"diff-text",children:t.text})]},t.key))})]})}function le({strings:a,runtime:e=Q()}){return function({sessionId:t}){let[i,l]=(0,o.useState)("worktree"),[p,m]=(0,o.useState)({kind:"idle"}),[C,c]=(0,o.useState)(void 0),[u,v]=(0,o.useState)(void 0),[T,h]=(0,o.useState)(void 0),R=(0,o.useRef)(0),b=(0,o.useRef)(0),F=(0,o.useRef)(t),B=(0,o.useRef)(null),U=(0,o.useCallback)((d,w)=>{R.current+=1;let y=R.current;m({kind:"loading"});let g=w==="branch"?{kind:"branch"}:{kind:"worktree"};e.loadSnapshot(d,g).then(x=>{R.current===y&&m(x.ok?{kind:"ready",snapshot:x.snapshot}:{kind:"error",code:x.error.code})},()=>{R.current===y&&m({kind:"error",code:"unreadable"})})},[e]),ue=(0,o.useCallback)((d,w,y)=>{b.current+=1;let g=b.current;v(y),h({kind:"loading",path:y});let x=w==="branch"?{kind:"branch"}:{kind:"worktree"};e.loadDiff(d,x,y).then(S=>{b.current===g&&h(S.ok?{kind:"ready",diff:S.diff}:{kind:"error",code:S.error.code})},()=>{b.current===g&&h({kind:"error",code:"unreadable"})})},[e]);(0,o.useEffect)(()=>{if(t===void 0||t===""){R.current+=1,b.current+=1,F.current=t,m({kind:"idle"}),c(void 0),v(void 0),h(void 0);return}if(F.current!==t){F.current=t,l("worktree"),b.current+=1,v(void 0),h(void 0),c(void 0),U(t,"worktree");return}U(t,i)},[t,i,U]),(0,o.useEffect)(()=>{B.current!==null&&(B.current.scrollTop=0)},[u,T?.kind==="ready"?T.diff.path:""]);let K=d=>{d!==i&&(b.current+=1,v(void 0),h(void 0),c(void 0),l(d))},fe=()=>{t===void 0||t===""||U(t,i)},we=t!==void 0&&t!=="",s=p.kind==="ready"?p.snapshot:void 0,D=s===void 0?void 0:re(s),f=s===void 0?[]:te(s.files),ve=s===void 0?void 0:s.scope==="branch"&&s.baseRef!==null?E(a.listMetaBranch,{base:ne(s.baseRef)}):a.listMetaWorktree,q=f.some(d=>d.path===C)?C:f[0]?.path,_=u===void 0?void 0:f.find(d=>d.path===u),P=_===void 0?void 0:u,j=d=>{t===void 0||t===""||d!==u&&ue(t,i,d)},G=d=>{if(f.length===0)return;let w=f.findIndex(S=>S.path===q),y=Math.min(f.length-1,Math.max(0,(w<0?0:w)+d)),g=f[y];if(g===void 0)return;c(g.path),document.querySelector(`[data-testid="review-row"][data-path="${CSS.escape(g.path)}"]`)?.focus()},he=(d,w)=>{if(d.key==="Enter"||d.key===" "){d.preventDefault(),c(w),j(w);return}if(d.key==="Escape"){if(u===void 0)return;d.preventDefault(),v(void 0),h(void 0);return}if(d.key==="ArrowDown"){d.preventDefault(),G(1);return}d.key==="ArrowUp"&&(d.preventDefault(),G(-1))};return(0,n.jsxs)("div",{"data-testid":"review-map","data-conversation-composer-overlay":"",children:[(0,n.jsxs)("div",{"data-rm":"header",children:[(0,n.jsx)("h2",{"data-rm":"title",children:a.title}),(0,n.jsx)("span",{"data-rm":"repo-name",children:s?.repo??a.repoFallback}),s===void 0?null:(0,n.jsxs)("span",{"data-rm":"head","data-head-kind":s.head.kind,children:[s.head.kind==="branch"?s.head.ref:"HEAD"," ",s.head.shortHash]}),(0,n.jsxs)("span",{"data-rm":"scope",role:"group",children:[(0,n.jsx)("button",{type:"button","data-rm":"scope-worktree","aria-pressed":i==="worktree",onClick:()=>K("worktree"),children:a.scopeWorktree}),(0,n.jsx)("button",{type:"button","data-rm":"scope-branch","aria-pressed":i==="branch",onClick:()=>K("branch"),children:a.scopeBranch})]}),(0,n.jsx)("button",{type:"button","data-rm":"refresh",onClick:fe,disabled:!we,children:a.refresh})]}),p.kind==="idle"?(0,n.jsxs)("div",{"data-rm":"empty",children:[(0,n.jsx)("p",{"data-rm":"empty-title",children:a.empty}),(0,n.jsx)("p",{"data-rm":"empty-hint",children:a.emptyHint})]}):null,p.kind==="loading"?(0,n.jsx)("p",{"data-rm":"loading",children:a.loading}):null,p.kind==="error"?(0,n.jsx)("p",{"data-rm":"error",children:Te(p.code,a)}):null,s!==void 0&&D!==void 0?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{"data-rm":"stats",children:[(0,n.jsxs)("div",{"data-rm":"stat","data-stat":"lines",children:[(0,n.jsx)("span",{"data-rm":"stat-label",children:a.statLines}),(0,n.jsxs)("span",{"data-rm":"stat-value",children:[(0,n.jsxs)("span",{"data-rm":"stat-add",children:["+",D.additions]})," ",(0,n.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",D.deletions]})]})]}),(0,n.jsxs)("div",{"data-rm":"stat","data-stat":"files",children:[(0,n.jsx)("span",{"data-rm":"stat-label",children:a.statFiles}),(0,n.jsx)("span",{"data-rm":"stat-value",children:D.files}),(0,n.jsx)("span",{"data-rm":"uncommitted",children:E(a.uncommitted,{count:String(s.uncommitted)})})]})]}),(0,n.jsxs)("div",{"data-rm":"split","data-open":P===void 0?"false":"true",children:[(0,n.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":a.title,children:[(0,n.jsxs)("div",{"data-rm":"list-meta",children:[(0,n.jsx)("span",{"data-rm":"list-scope",children:ve}),(0,n.jsx)("span",{"data-rm":"list-sort",children:a.listSort})]}),f.length===0?(0,n.jsx)("p",{"data-rm":"list-empty",children:a.listEmpty}):f.map(d=>(0,n.jsx)(De,{file:d,strings:a,selected:d.path===q,onSelect:c,onOpen:j,onKey:he},d.path))]}),P===void 0||T===void 0?null:(0,n.jsx)(Me,{path:P,file:_,phase:T,strings:a,bodyRef:B,onClose:()=>{v(void 0),h(void 0)}})]})]}):null]})}}var pe=["slots","locale"],L,k;function Be(a){let e=a.locale.getSnapshot?.();return typeof e?.active=="string"?e.active:"zh"}function me(a){Z();let e=a.locale.bind(M);L?.();let r=a.locale.register(M,{zh:N,en:V});L=r;let t=le({strings:{title:e("review-map.tabTitle"),repoFallback:e("review-map.repoFallback"),scopeWorktree:e("review-map.scopeWorktree"),scopeBranch:e("review-map.scopeBranch"),refresh:e("review-map.refresh"),statLines:e("review-map.statLines"),statFiles:e("review-map.statFiles"),uncommitted:e("review-map.uncommitted"),listMetaWorktree:e("review-map.listMetaWorktree"),listMetaBranch:e("review-map.listMetaBranch"),listSort:e("review-map.listSort"),listEmpty:e("review-map.listEmpty"),markBinary:e("review-map.markBinary"),markUntracked:e("review-map.markUntracked"),markConflicted:e("review-map.markConflicted"),renameHint:e("review-map.renameHint"),statusAdded:e("review-map.statusAdded"),statusModified:e("review-map.statusModified"),statusDeleted:e("review-map.statusDeleted"),statusRenamed:e("review-map.statusRenamed"),statusCopied:e("review-map.statusCopied"),statusTypeChanged:e("review-map.statusTypeChanged"),statusUntracked:e("review-map.statusUntracked"),statusConflicted:e("review-map.statusConflicted"),statusUnknown:e("review-map.statusUnknown"),errorNotARepo:e("review-map.errorNotARepo"),errorNoBase:e("review-map.errorNoBase"),errorNoSession:e("review-map.errorNoSession"),errorTooLarge:e("review-map.errorTooLarge"),errorConflicted:e("review-map.errorConflicted"),errorUnreadable:e("review-map.errorUnreadable"),errorUnknown:e("review-map.errorUnknown"),loading:e("review-map.loading"),empty:e("review-map.empty"),emptyHint:e("review-map.emptyHint"),detailClose:e("review-map.detailClose"),detailTruncated:e("review-map.detailTruncated"),detailBinary:e("review-map.detailBinary"),detailUnknownSize:e("review-map.detailUnknownSize"),detailEmpty:e("review-map.detailEmpty"),detailErrorConflicted:e("review-map.detailErrorConflicted"),detailErrorTooLarge:e("review-map.detailErrorTooLarge"),detailErrorUnreadable:e("review-map.detailErrorUnreadable"),detailErrorBadRequest:e("review-map.detailErrorBadRequest"),detailErrorUnknown:e("review-map.detailErrorUnknown")}}),i;return a.slots.inject(A,()=>{k?.();let l=a.slots.register({name:A,id:X,order:140,label:()=>Be(a).startsWith("zh")?N["review-map.tabTitle"]:V["review-map.tabTitle"],locale:M},t);return k=l,i=l,()=>{l(),k===l&&(k=void 0)}}),()=>{i!==void 0&&k===i&&(k(),k=void 0),i=void 0,L===r&&(r(),L=void 0)}}var ce={name:I,inject:pe,apply:me},Pe=ce;

    return module.exports.default ?? module.exports;
  }
});
