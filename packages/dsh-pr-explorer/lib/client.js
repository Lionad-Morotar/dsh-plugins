window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var re=Object.defineProperty;var nr=Object.getOwnPropertyDescriptor;var or=Object.getOwnPropertyNames;var ir=Object.prototype.hasOwnProperty;var dr=(e,t)=>{for(var r in t)re(e,r,{get:t[r],enumerable:!0})},lr=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let d of or(t))!ir.call(e,d)&&d!==r&&re(e,d,{get:()=>t[d],enumerable:!(i=nr(t,d))||i.enumerable});return e};var sr=e=>lr(re({},"__esModule",{value:!0}),e);var wr={};dr(wr,{apply:()=>Ge,clientPlugin:()=>Je,default:()=>br,inject:()=>_e});module.exports=sr(wr);var Pe="dsh-pr-explorer",te="conversation.view",N="pr-explorer";var _="pr-explorer",G="/pr-explorer/api";var ae={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"\u672A\u77E5\u4ED3\u5E93","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"\u4EA4\u6362","pr-explorer.refresh":"\u91CD\u65B0\u8BFB\u53D6","pr-explorer.tabCommits":"\u63D0\u4EA4","pr-explorer.tabFiles":"\u6587\u4EF6","pr-explorer.ahead":"\u9886\u5148 {count}","pr-explorer.behind":"\u843D\u540E {count}","pr-explorer.filesCount":"{count} \u6587\u4EF6","pr-explorer.commitsTruncated":"\u63D0\u4EA4\u5217\u8868\u5DF2\u622A\u65AD","pr-explorer.markBinary":"\u4E8C\u8FDB\u5236","pr-explorer.markUnknown":"\u672A\u77E5","pr-explorer.statusAdded":"\u65B0\u589E","pr-explorer.statusModified":"\u4FEE\u6539","pr-explorer.statusDeleted":"\u5220\u9664","pr-explorer.statusRenamed":"\u91CD\u547D\u540D","pr-explorer.statusCopied":"\u590D\u5236","pr-explorer.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","pr-explorer.statusUnknown":"\u672A\u77E5","pr-explorer.loading":"\u52A0\u8F7D\u4E2D","pr-explorer.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.noDifference":"\u4E24\u4E2A ref \u4E4B\u95F4\u6CA1\u6709\u5DEE\u5F02","pr-explorer.detailEmpty":"\u9009\u62E9\u5DE6\u4FA7\u4E00\u884C\u67E5\u770B\u8BE6\u60C5","pr-explorer.detailTruncated":"\u5DF2\u622A\u65AD","pr-explorer.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","pr-explorer.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","pr-explorer.commitHash":"\u63D0\u4EA4","pr-explorer.commitAuthor":"\u4F5C\u8005","pr-explorer.commitDate":"\u65E5\u671F","pr-explorer.commitSubject":"\u6807\u9898","pr-explorer.commitRefs":"\u5F15\u7528","pr-explorer.commitFiles":"\u6539\u52A8 {count} \u4E2A\u6587\u4EF6","pr-explorer.commitRoot":"\u521D\u59CB\u63D0\u4EA4\u6CA1\u6709\u7236\u63D0\u4EA4\uFF0C\u65E0\u6CD5\u663E\u793A\u5DEE\u5F02","pr-explorer.commitEmpty":"\u8FD9\u4E2A\u63D0\u4EA4\u6CA1\u6709\u6539\u52A8","pr-explorer.openInFiles":"\u5728\u6587\u4EF6\u9762\u677F\u6253\u5F00","pr-explorer.openInGit":"\u5728 Git \u9762\u677F\u6253\u5F00","pr-explorer.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","pr-explorer.errorInvalidRef":"\u8BE5 ref \u4E0D\u5B58\u5728","pr-explorer.errorNoMergeBase":"\u4E24\u4E2A ref \u6CA1\u6709\u5171\u540C\u7956\u5148","pr-explorer.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","pr-explorer.errorTooLarge":"\u5185\u5BB9\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","pr-explorer.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","pr-explorer.errorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u533A\u95F4","pr-explorer.errorUnknown":"\u8BFB\u53D6\u5BF9\u6BD4\u65F6\u51FA\u9519"},ne={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"Unknown repository","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"Swap","pr-explorer.refresh":"Refresh","pr-explorer.tabCommits":"Commits","pr-explorer.tabFiles":"Files","pr-explorer.ahead":"{count} ahead","pr-explorer.behind":"{count} behind","pr-explorer.filesCount":"{count} files","pr-explorer.commitsTruncated":"The commit list was truncated","pr-explorer.markBinary":"binary","pr-explorer.markUnknown":"unknown","pr-explorer.statusAdded":"added","pr-explorer.statusModified":"modified","pr-explorer.statusDeleted":"deleted","pr-explorer.statusRenamed":"renamed","pr-explorer.statusCopied":"copied","pr-explorer.statusTypeChanged":"type changed","pr-explorer.statusUnknown":"unknown","pr-explorer.loading":"Loading","pr-explorer.empty":"Select a session to load the comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.noDifference":"These two refs have no difference","pr-explorer.detailEmpty":"Pick a row on the left to see its detail","pr-explorer.detailTruncated":"Truncated","pr-explorer.detailBinary":"Binary file, {size}","pr-explorer.detailUnknownSize":"size unknown","pr-explorer.commitHash":"Commit","pr-explorer.commitAuthor":"Author","pr-explorer.commitDate":"Date","pr-explorer.commitSubject":"Subject","pr-explorer.commitRefs":"Refs","pr-explorer.commitFiles":"{count} changed files","pr-explorer.commitRoot":"This is the root commit; there is no parent to diff against","pr-explorer.commitEmpty":"This commit changed no files","pr-explorer.openInFiles":"Open in the file panel","pr-explorer.openInGit":"Open in the Git panel","pr-explorer.errorNotARepo":"This directory is not a git repository","pr-explorer.errorInvalidRef":"That ref does not exist","pr-explorer.errorNoMergeBase":"These two refs share no commit","pr-explorer.errorNoSession":"This session has no workspace","pr-explorer.errorTooLarge":"The content is too large to read in full","pr-explorer.errorUnreadable":"The read failed","pr-explorer.errorBadRequest":"That range cannot be read","pr-explorer.errorUnknown":"Something went wrong reading the comparison"};var Se="data-dsh-pr-explorer",pr=`[data-testid="pr-explorer"] {
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

  /* The two state colours the diff needs, mixed with the surface rather than
     used at full strength: a solid green block behind every added line is
     unreadable in a dark theme. */
  --rm-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-del: var(--dsw-alias-state-error-primary, #cf222e);
  --rm-add-bg: color-mix(in srgb, var(--rm-add) 14%, transparent);
  --rm-del-bg: color-mix(in srgb, var(--rm-del) 14%, transparent);
  --rm-mono: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  --rm-code: var(--dsh-code-font-size, 11px);
}

/* Header: identity, the range, the two pickers and the two actions. */
[data-testid="pr-explorer"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="pr-explorer"] [data-rm="title"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="repo-name"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="range"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  white-space: nowrap;
}

[data-testid="pr-explorer"] [data-rm="base-field"],
[data-testid="pr-explorer"] [data-rm="head-field"] {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

[data-testid="pr-explorer"] [data-rm="head-field"] {
  margin-left: 0;
}

[data-testid="pr-explorer"] [data-rm="base-label"],
[data-testid="pr-explorer"] [data-rm="head-label"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] select {
  font: inherit;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  padding: 2px 4px;
  max-width: 16em;
}

[data-testid="pr-explorer"] [data-rm="swap"],
[data-testid="pr-explorer"] [data-rm="refresh"] {
  font: inherit;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-rm="swap"]:disabled,
[data-testid="pr-explorer"] [data-rm="refresh"]:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Summary: the two counts, the file totals and the line totals. */
[data-testid="pr-explorer"] [data-rm="summary"] {
  flex: none;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="pr-explorer"] [data-rm="stat-add"] {
  color: var(--rm-add);
}

[data-testid="pr-explorer"] [data-rm="stat-del"] {
  color: var(--rm-del);
}

[data-testid="pr-explorer"] [data-rm="commits-truncated"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

[data-testid="pr-explorer"] [data-rm="no-difference"] {
  flex: none;
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

/* Split region: the list, and the detail beside it. */
[data-testid="pr-explorer"] [data-rm="split"] {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  /* Closed: one column, the list takes everything. Open: the list keeps a
     readable minimum and the detail takes the larger share. Grid rather than
     flex because the two columns must not fight over a percentage. */
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
}

[data-testid="pr-explorer"] [data-rm="split"][data-open="true"] {
  grid-template-columns: minmax(280px, 1fr) minmax(0, 1.4fr);
  gap: 14px;
}

/* A narrow panel stacks instead of scrolling sideways: a two-column split at this
   width would leave the diff narrower than its line numbers. */
@media (max-width: 720px) {
  [data-testid="pr-explorer"] [data-rm="split"][data-open="true"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(120px, 0.8fr) minmax(0, 1.2fr);
  }
}

[data-testid="pr-explorer"] [data-rm="list"] {
  min-height: 0;
  overflow-y: auto;
  /* No horizontal scroll: a long path is ellipsized, not panned. A list that
     scrolls sideways hides the churn column, which is the column the sort is
     about. */
  overflow-x: hidden;
}

[data-testid="pr-explorer"] [data-rm="tabs"] {
  display: flex;
  gap: 2px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  position: sticky;
  top: 0;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  z-index: 1;
}

[data-testid="pr-explorer"] [data-rm="tabs"] button {
  font: inherit;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-rm="tabs"] button[aria-selected="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.04));
  border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16));
}

/* Rows: one per commit or file, churn on the right. */
[data-testid="pr-explorer"] [data-testid="commit-row"],
[data-testid="pr-explorer"] [data-testid="file-row"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 4px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-testid="commit-row"]:hover,
[data-testid="pr-explorer"] [data-testid="file-row"]:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
}

[data-testid="pr-explorer"] [data-testid="commit-row"][data-selected="true"],
[data-testid="pr-explorer"] [data-testid="file-row"][data-selected="true"] {
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.06));
}

[data-testid="pr-explorer"] [data-rm="commit-short"] {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="commit-subject"] {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="commit-meta"] {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  white-space: nowrap;
}

[data-testid="pr-explorer"] [data-rm="mark"] {
  flex: none;
  width: 1.2em;
  text-align: center;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="mark"][data-status="added"] {
  color: var(--rm-add);
}

[data-testid="pr-explorer"] [data-rm="mark"][data-status="deleted"] {
  color: var(--rm-del);
}

[data-testid="pr-explorer"] [data-rm="path"] {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

[data-testid="pr-explorer"] [data-rm="path-dir"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="path-name"] {
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="path-name"].rm-struck {
  text-decoration: line-through;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="churn"] {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary, #6b655c);
  white-space: nowrap;
}

[data-testid="pr-explorer"] [data-rm="churn"][data-note] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-style: italic;
}

/* Detail: a header line, then a scrolling body. */
[data-testid="pr-explorer"] [data-rm="detail"] {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  overflow: hidden;
}

[data-testid="pr-explorer"] [data-rm="detail-body"] {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 6px 8px;
}

[data-testid="pr-explorer"] [data-rm="detail-empty"],
[data-testid="pr-explorer"] [data-rm="detail-loading"],
[data-testid="pr-explorer"] [data-rm="detail-error"],
[data-testid="pr-explorer"] [data-rm="detail-binary"],
[data-testid="pr-explorer"] [data-rm="detail-truncated"] {
  margin: 8px 2px;
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="detail-error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="pr-explorer"] [data-rm="detail-truncated"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

[data-testid="pr-explorer"] [data-rm="detail-file-name"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
  overflow-wrap: anywhere;
  padding-bottom: 4px;
}

/* Commit detail: a compact header, its changed-file list and the picked diff. */
[data-testid="pr-explorer"] [data-rm="commit-files"] {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
}

[data-testid="pr-explorer"] [data-rm="commit-files-head"] {
  margin: 0 0 2px;
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="commit-files-list"] {
  display: flex;
  flex-direction: column;
  max-height: min(34vh, 320px);
  overflow: auto;
}

[data-testid="pr-explorer"] [data-testid="commit-file-row"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 4px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: inherit;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
  text-align: left;
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-testid="commit-file-row"]:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
}

[data-testid="pr-explorer"] [data-testid="commit-file-row"][data-selected="true"] {
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.06));
}

[data-testid="pr-explorer"] [data-testid="commit-file-row"]:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary, #14110d);
  outline-offset: -2px;
}

[data-testid="pr-explorer"] [data-rm="commit-diff"] {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
}

/* Commit metadata: a label column and a value column. */
[data-testid="pr-explorer"] [data-rm="commit-detail-row"] {
  display: grid;
  grid-template-columns: 5em minmax(0, 1fr);
  gap: 8px;
  padding: 2px 0;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
}

[data-testid="pr-explorer"] [data-rm="commit-detail-label"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="commit-detail-value"] {
  color: var(--dsw-alias-label-primary, #14110d);
  overflow-wrap: anywhere;
}

/* Diff rows: two number gutters, a sign, then the text. */
[data-testid="pr-explorer"] [data-rm="diff"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  overflow-x: hidden;
}

[data-testid="pr-explorer"] [data-rm="diff-hunk"] {
  padding: 2px 4px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.05));
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

[data-testid="pr-explorer"] [data-rm="diff-line"] {
  display: grid;
  grid-template-columns: 3.2em 3.2em 1.2em minmax(0, 1fr);
  align-items: baseline;
  /* Compact: a diff is read by scanning, and 20px is the tightest line that
     still separates two rows of a mono face at this size. */
  line-height: 20px;
  min-height: 20px;
}

[data-testid="pr-explorer"] [data-rm="diff-old"],
[data-testid="pr-explorer"] [data-rm="diff-new"] {
  text-align: right;
  padding-right: 6px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

[data-testid="pr-explorer"] [data-rm="diff-sign"] {
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
  user-select: none;
}

[data-testid="pr-explorer"] [data-rm="diff-text"] {
  padding-right: 4px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="add"] {
  background: var(--rm-add-bg);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="add"] [data-rm="diff-sign"] {
  color: var(--rm-add);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="del"] {
  background: var(--rm-del-bg);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="del"] [data-rm="diff-sign"] {
  color: var(--rm-del);
}

/* States. */
[data-testid="pr-explorer"] [data-rm="loading"],
[data-testid="pr-explorer"] [data-rm="error"] {
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="pr-explorer"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
  margin: auto;
  padding: 24px;
  text-align: center;
}

[data-testid="pr-explorer"] [data-rm="empty-title"] {
  margin: 0;
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="empty-hint"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}
`;function Fe(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${Se}]`);if(t!==null)return t;let r=e.createElement("style");return r.setAttribute(Se,""),r.textContent=pr,e.head.append(r),r}var p=require("react");async function oe(e,t){let r=await e(t);if(!r.ok)throw new Error(`${t} answered ${String(r.status)}`);return await r.json()}function Ee(e=fetch){return{async loadRefs(t){let r=new URLSearchParams({sessionId:t});return await oe(e,`${G}/refs?${r.toString()}`)},async loadCompare(t,r,i){let d=new URLSearchParams({sessionId:t,base:r,head:i});return await oe(e,`${G}/compare?${d.toString()}`)},async loadDiff(t,r,i,d){let o=new URLSearchParams({sessionId:t,base:r,head:i,path:d});return await oe(e,`${G}/diff?${o.toString()}`)}}}function De(){let e=new Map;return{forSession(t){let r=t??"",i=e.get(r);if(i!==void 0)return i;let d={};return e.set(r,d),d}}}var Te="compare:";function ie(e){if(e===void 0||!e.startsWith(Te))return;let t=e.slice(Te.length),r=t.indexOf(":");if(r<0)return;let i=t.slice(0,r),d=t.slice(r+1);if(!(i===""||d===""||d.includes(":")))return{base:i,head:d}}function Le({seam:e,sessionId:t}){return(r,i)=>{if(i!==""){if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.(r,i);let d=e.openViewOrSwitch(r,i);if(d.focused){e.viewFocus?.take?.(r);return}if(d.opened)return;e.viewFocus?.take?.(r)}e.views?.open(t,r,i)!==!0&&e.openView?.(r,i)!==!0&&e.viewFocus?.request?.(r,i)}}}function Ve(e){return`path:${e}`}function Me(e){return`commit:${e}`}var Ue={branch:0,remote:1,tag:2};function Ae(e,t={}){let r=e.refs.map(d=>({name:d.name,kind:d.kind,isDefault:d.isDefault})),i=new Set(r.map(d=>d.name));for(let d of t.current??[])d===""||i.has(d)||(i.add(d),r.push({name:d,kind:"branch",isDefault:!1}));return r.sort((d,o)=>{let x=Ue[d.kind]-Ue[o.kind];return x!==0?x:d.name<o.name?-1:d.name>o.name?1:0})}function de(e){let t=e.refs.find(d=>d.kind==="branch")?.name,r=e.defaultBase??t??"HEAD",i=e.head.kind==="branch"?e.head.ref:"HEAD";return r===i?{base:r,head:"HEAD"}:{base:r,head:i}}function $e(e){return[...e]}function le(e){switch(e){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";default:return"?"}}function se(e){if(e.binary)return{additions:null,deletions:null,note:"binary"};if(e.status==="unknown")return{additions:null,deletions:null,note:"unknown"};let t=e.additions!==null&&e.additions>0?e.additions:null,r=e.deletions!==null&&e.deletions>0?e.deletions:null;return{additions:t,deletions:r,note:null}}function pe(e){let t=[];return e.additions!==null&&t.push(`+${String(e.additions)}`),e.deletions!==null&&t.push(`\u2212${String(e.deletions)}`),t.join(" ")}function me(e){let t=e.lastIndexOf("/");return t<0?{dir:"",name:e}:{dir:e.slice(0,t+1),name:e.slice(t+1)}}function ce(e){let t=r=>(r.additions??0)+(r.deletions??0);return[...e].sort((r,i)=>{let d=t(i)-t(r);return d!==0?d:r.path<i.path?-1:r.path>i.path?1:0})}function He(e,t){return`${e}...${t}`}function Be(e){return{ahead:e.reading.ahead,behind:e.reading.behind,files:e.files.summary.files,additions:e.files.summary.additions,deletions:e.files.summary.deletions,commits:e.commits.commits.length,truncatedCommitList:e.commits.truncated}}function mr(e){let t=`@@ -${String(e.oldStart)},${String(e.oldLines)} +${String(e.newStart)},${String(e.newLines)} @@`;return e.heading===void 0||e.heading===""?t:`${t} ${e.heading}`}function cr(e){return e==="add"?"+":e==="del"?"\u2212":" "}function ze(e,t,r,i){return{kind:"line",key:`${String(t??"x")}:${String(r??"x")}`,lineKind:e,oldLine:t,newLine:r,sign:cr(e),text:i}}function Ie(e){if(e.kind==="binary")return[];if(e.kind==="deleted")return e.lines.map((r,i)=>ze("del",i+1,null,r));let t=[];for(let r of e.hunks){t.push({kind:"hunk",header:mr(r)});for(let i of r.lines)t.push(ze(i.kind,i.oldLine,i.newLine,i.text))}return t}function Ne(e){return e.path}function Oe(e){return e<1024?`${String(e)} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function M(e,t){return e.replace(/\{(\w+)\}/gu,(r,i)=>t[i]??r)}var a=require("react/jsx-runtime");function qe(e,t){switch(e){case"added":return t.statusAdded;case"modified":return t.statusModified;case"deleted":return t.statusDeleted;case"renamed":return t.statusRenamed;case"copied":return t.statusCopied;case"type-changed":return t.statusTypeChanged;default:return t.statusUnknown}}function ue(e,t){switch(e){case"not-a-repo":return t.errorNotARepo;case"invalid-ref":return t.errorInvalidRef;case"no-merge-base":return t.errorNoMergeBase;case"no-session":return t.errorNoSession;case"too-large":return t.errorTooLarge;case"unreadable":return t.errorUnreadable;case"bad-request":return t.errorBadRequest;default:return t.errorUnknown}}function Ke(e,t){return e==="binary"?t.markBinary:e==="unknown"?t.markUnknown:null}function ur({commit:e,selected:t,onSelect:r,onKey:i}){return(0,a.jsxs)("div",{"data-testid":"commit-row","data-hash":e.hash,"data-selected":t?"true":"false",role:"option","aria-selected":t,tabIndex:t?0:-1,onClick:()=>r(e.hash),onKeyDown:d=>i(d,e.hash),children:[(0,a.jsx)("span",{"data-rm":"commit-short",children:e.short}),(0,a.jsx)("span",{"data-rm":"commit-subject",children:e.subject}),(0,a.jsxs)("span",{"data-rm":"commit-meta",children:[e.author," \xB7 ",e.date]})]})}function fr({file:e,strings:t,selected:r,onSelect:i,onKey:d,onOpenInFiles:o}){let x=me(e.path),P=se(e),s=Ke(P.note,t),f=e.status==="deleted",k=e.oldPath===void 0?void 0:`${e.oldPath} \u2192 ${e.path}`;return(0,a.jsxs)("div",{"data-testid":"file-row","data-path":e.path,"data-status":e.status,"data-deleted":f?"true":void 0,"data-selected":r?"true":"false",role:"option","aria-selected":r,tabIndex:r?0:-1,title:k,"aria-label":k,onClick:()=>i(e.path),onKeyDown:y=>d(y,e.path),children:[(0,a.jsx)("span",{"data-rm":"mark","data-status":e.status,title:qe(e.status,t),children:le(e.status)}),(0,a.jsxs)("span",{"data-rm":"path",children:[x.dir===""?null:(0,a.jsx)("span",{"data-rm":"path-dir",children:x.dir}),(0,a.jsx)("span",{"data-rm":"path-name",className:f?"rm-struck":void 0,children:x.name})]}),(0,a.jsx)("span",{"data-rm":"churn","data-note":P.note??void 0,children:s??pe(P)}),o===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files","aria-label":t.openInFiles,title:t.openInFiles,onClick:y=>{y.stopPropagation(),o(e.path)},children:"\u2197"})]})}function yr({phase:e,strings:t,bodyRef:r,onOpenInFiles:i,onOpenInGit:d,onSelectCommitFile:o}){return(0,a.jsx)("div",{"data-rm":"detail",children:(0,a.jsxs)("div",{"data-rm":"detail-body",ref:r,children:[e.kind==="none"?(0,a.jsx)("p",{"data-rm":"detail-empty",children:t.detailEmpty}):null,e.kind==="loading"?(0,a.jsx)("p",{"data-rm":"detail-loading",children:t.loading}):null,e.kind==="error"?(0,a.jsx)("p",{"data-rm":"detail-error",children:ue(e.code,t)}):null,e.kind==="commit"?(0,a.jsx)(hr,{commit:e.commit,files:e.files,filesReady:e.filesReady,diff:e.diff,strings:t,onSelectFile:o,...e.selectedPath===void 0?{}:{selectedPath:e.selectedPath},...d===void 0?{}:{onOpenInGit:d},...i===void 0?{}:{onOpenInFiles:i}}):null,e.kind==="file"?(0,a.jsx)(je,{diff:e.diff,strings:t,onOpenInFiles:i}):null]})})}function hr({commit:e,files:t,filesReady:r,selectedPath:i,diff:d,strings:o,onSelectFile:x,onOpenInGit:P,onOpenInFiles:s}){return(0,a.jsxs)("div",{"data-testid":"commit-detail",children:[P===void 0?null:(0,a.jsx)("div",{"data-rm":"commit-detail-actions",children:(0,a.jsx)("button",{type:"button","data-rm":"open-in-git",onClick:()=>P(e.hash),children:o.openInGit})}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:o.commitHash}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.hash})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:o.commitSubject}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.subject})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:o.commitAuthor}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.author})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:o.commitDate}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.date})]}),e.refs===void 0?null:(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:o.commitRefs}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.refs})]}),r?(0,a.jsxs)("div",{"data-rm":"commit-files",children:[(0,a.jsx)("div",{"data-rm":"commit-files-head",children:M(o.commitFiles,{count:String(t.length)})}),t.length===0?null:(0,a.jsx)("div",{"data-rm":"commit-files-list",role:"listbox","aria-label":M(o.commitFiles,{count:String(t.length)}),children:t.map(f=>{let k=me(f.path),y=se(f),E=Ke(y.note,o),w=f.path===i;return(0,a.jsxs)("button",{type:"button","data-testid":"commit-file-row","data-path":f.path,"data-status":f.status,"data-selected":w?"true":"false",role:"option","aria-selected":w,onClick:()=>x(f.path),children:[(0,a.jsx)("span",{"data-rm":"mark","data-status":f.status,title:qe(f.status,o),children:le(f.status)}),(0,a.jsxs)("span",{"data-rm":"path",children:[k.dir===""?null:(0,a.jsx)("span",{"data-rm":"path-dir",children:k.dir}),(0,a.jsx)("span",{"data-rm":"path-name",children:k.name})]}),(0,a.jsx)("span",{"data-rm":"churn","data-note":y.note??void 0,children:E??pe(y)})]},f.path)})})]}):(0,a.jsx)("p",{"data-rm":"detail-loading",children:o.loading}),d.kind==="idle"?null:(0,a.jsxs)("div",{"data-rm":"commit-diff",children:[d.kind==="loading"?(0,a.jsx)("p",{"data-rm":"detail-loading",children:o.loading}):null,d.kind==="root"?(0,a.jsx)("p",{"data-rm":"detail-empty",children:o.commitRoot}):null,d.kind==="empty"?(0,a.jsx)("p",{"data-rm":"detail-empty",children:o.commitEmpty}):null,d.kind==="error"?(0,a.jsx)("p",{"data-rm":"detail-error",children:ue(d.code,o)}):null,d.kind==="ready"?(0,a.jsx)(je,{diff:d.diff,strings:o,...s===void 0?{}:{onOpenInFiles:s}}):null]})]})}function je({diff:e,strings:t,onOpenInFiles:r}){let i=Ne(e);if(e.kind==="binary"){let o=e.bytes===null?t.detailUnknownSize:Oe(e.bytes);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:i}),r===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>r(i),children:t.openInFiles}),(0,a.jsx)("p",{"data-rm":"detail-binary",children:M(t.detailBinary,{size:o})})]})}let d=Ie(e);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:i}),r===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>r(i),children:t.openInFiles}),e.kind==="text"&&e.truncated?(0,a.jsx)("p",{"data-rm":"detail-truncated",children:t.detailTruncated}):null,(0,a.jsx)("div",{"data-rm":"diff",children:d.map(o=>o.kind==="hunk"?(0,a.jsx)("div",{"data-rm":"diff-hunk",children:o.header},`hunk:${o.header}`):(0,a.jsxs)("div",{"data-rm":"diff-line","data-kind":o.lineKind,children:[(0,a.jsx)("span",{"data-rm":"diff-old",children:o.oldLine??""}),(0,a.jsx)("span",{"data-rm":"diff-new",children:o.newLine??""}),(0,a.jsx)("span",{"data-rm":"diff-sign",children:o.sign}),(0,a.jsx)("span",{"data-rm":"diff-text",children:o.text})]},o.key))})]})}function We({strings:e,runtime:t=Ee(),workbench:r}){let i=De();return function({sessionId:o,viewRequest:x,completeViewRequest:P}){let s=(0,p.useMemo)(()=>i.forSession(o),[i,o]),[f,k]=(0,p.useState)({kind:"idle"}),[y,E]=(0,p.useState)(()=>s.base),[w,z]=(0,p.useState)(()=>s.head),[R,fe]=(0,p.useState)(()=>s.tab??"commits"),[ye,A]=(0,p.useState)(()=>s.selectedCommit),[he,$]=(0,p.useState)(()=>s.selectedFile),[v,h]=(0,p.useState)({kind:"none"}),[Xe,O]=(0,p.useState)(0),L=(0,p.useRef)(0),g=(0,p.useRef)(0),X=(0,p.useRef)(o),Y=(0,p.useRef)(null),ge=(0,p.useRef)(void 0),H=(0,p.useRef)(s.base!==void 0&&s.head!==void 0),D=(0,p.useRef)(s.tab===void 0?void 0:{tab:s.tab,commit:s.selectedCommit,file:s.selectedFile}),q=(0,p.useMemo)(()=>r===void 0?void 0:Le({seam:r,sessionId:o??""}),[r,o]),xe=q,Z=(0,p.useCallback)((n,l)=>{L.current+=1;let m=L.current;k({kind:"loading"}),(async()=>{try{let u=await t.loadRefs(n);if(L.current!==m)return;if(!u.ok){k({kind:"error",code:u.error.code});return}let c=l??de(u.listing),F=H.current&&l!==void 0;E(c.base),z(c.head);let b=await t.loadCompare(n,c.base,c.head);if(L.current!==m||!b.ok&&b.error.code==="invalid-ref"&&F&&(H.current=!1,D.current=void 0,delete s.selectedCommit,delete s.selectedFile,c=de(u.listing),E(c.base),z(c.head),b=await t.loadCompare(n,c.base,c.head),L.current!==m))return;H.current=!1,s.base=c.base,s.head=c.head,k(b.ok?{kind:"ready",listing:u.listing,compare:b.compare}:{kind:"error",code:b.error.code})}catch{if(L.current!==m)return;k({kind:"error",code:"unreadable"})}})()},[s,t]),Ye=(0,p.useCallback)((n,l,m)=>{g.current+=1;let u=g.current;h({kind:"loading",path:m}),t.loadDiff(n,l.base,l.head,m).then(c=>{g.current===u&&h(c.ok?{kind:"file",diff:c.diff}:{kind:"error",code:c.error.code})},()=>{g.current===u&&h({kind:"error",code:"unreadable"})})},[t]),Ze=(0,p.useCallback)((n,l)=>{g.current+=1;let m=g.current;h({kind:"commit",commit:l,files:[],filesReady:!1,diff:{kind:"idle"}});let u=`${l.hash}^`;t.loadCompare(n,u,l.hash).then(c=>{if(g.current!==m)return;if(!c.ok){let I=c.error.code==="invalid-ref";h({kind:"commit",commit:l,files:[],filesReady:!0,diff:I?{kind:"root"}:{kind:"error",code:c.error.code}});return}let F=ce(c.compare.files.files),b=F[0];if(b===void 0){h({kind:"commit",commit:l,files:F,filesReady:!0,diff:{kind:"empty"}});return}h({kind:"commit",commit:l,files:F,filesReady:!0,selectedPath:b.path,diff:{kind:"loading",path:b.path}}),t.loadDiff(n,u,l.hash,b.path).then(I=>{g.current===m&&h({kind:"commit",commit:l,files:F,filesReady:!0,selectedPath:b.path,diff:I.ok?{kind:"ready",diff:I.diff}:{kind:"error",code:I.error.code}})},()=>{g.current===m&&h({kind:"commit",commit:l,files:F,filesReady:!0,selectedPath:b.path,diff:{kind:"error",code:"unreadable"}})})},()=>{g.current===m&&h({kind:"commit",commit:l,files:[],filesReady:!0,diff:{kind:"error",code:"unreadable"}})})},[t]),Qe=(0,p.useCallback)(n=>{if(o===void 0||o===""||v.kind!=="commit"||v.commit===void 0)return;let l=v.commit;g.current+=1;let m=g.current;h({...v,selectedPath:n,diff:{kind:"loading",path:n}}),t.loadDiff(o,`${l.hash}^`,l.hash,n).then(u=>{g.current===m&&h({...v,selectedPath:n,diff:u.ok?{kind:"ready",diff:u.diff}:{kind:"error",code:u.error.code}})},()=>{g.current===m&&h({...v,selectedPath:n,diff:{kind:"error",code:"unreadable"}})})},[v,t,o]);(0,p.useEffect)(()=>{if(o===void 0||o===""){L.current+=1,g.current+=1,X.current=o,k({kind:"idle"}),E(void 0),z(void 0),h({kind:"none"}),delete s.base,delete s.head,delete s.selectedCommit,delete s.selectedFile,s.tab="commits",D.current=void 0,H.current=!1;return}if(X.current!==o){X.current=o,g.current+=1,fe("commits"),A(void 0),$(void 0),h({kind:"none"}),delete s.base,delete s.head,delete s.selectedCommit,delete s.selectedFile,s.tab="commits",D.current=void 0,H.current=!1,Z(o,void 0);return}Z(o,y===void 0||w===void 0?void 0:{base:y,head:w})},[o,Xe,Z]);let K=(0,p.useCallback)(n=>{g.current+=1,D.current=void 0,H.current=!1,delete s.selectedCommit,delete s.selectedFile,A(void 0),$(void 0),h({kind:"none"}),E(n.base),z(n.head),O(l=>l+1)},[s]);(0,p.useEffect)(()=>{let n=x;if(n==null||n.view!==N)return;let l=`${n.view}:${n.focus}`;if(ge.current===l)return;ge.current=l;let m=ie(n.focus);m!==void 0&&K(m),P?.()},[x,P,K]),(0,p.useEffect)(()=>{let n=r?.viewFocus;if(n===void 0)return;let l=()=>{let m=n.take(N);if(m===void 0)return;let u=ie(m);u!==void 0&&K(u)};return l(),n.subscribe?.(l)},[r,K]),(0,p.useEffect)(()=>{Y.current!==null&&(Y.current.scrollTop=0)},[v.kind==="file"?v.diff.path:"",v.kind==="commit"?v.selectedPath??"":"",v.kind]);let C=f.kind==="ready"?f.compare:void 0,Q=f.kind==="ready"?f.listing:void 0,V=C===void 0?void 0:Be(C),S=C===void 0?[]:$e(C.commits.commits),T=C===void 0?[]:ce(C.files.files),j=Q===void 0?[]:Ae(Q,{current:[y??"",w??""]}),er=C!==void 0&&S.length===0&&T.length===0,be=(n,l)=>{g.current+=1,D.current=void 0,delete s.selectedCommit,delete s.selectedFile,A(void 0),$(void 0),h({kind:"none"}),n==="base"?E(l):z(l),O(m=>m+1)},rr=()=>{y===void 0||w===void 0||(g.current+=1,D.current=void 0,delete s.selectedCommit,delete s.selectedFile,A(void 0),$(void 0),h({kind:"none"}),E(w),z(y),O(n=>n+1))},tr=()=>{o===void 0||o===""||y===void 0||w===void 0||O(n=>n+1)},B=(n,l)=>{if(n==="commits"){s.selectedCommit=l,A(l);let m=S.find(u=>u.hash===l);if(m!==void 0){if(o===void 0||o===""){g.current+=1,h({kind:"commit",commit:m,files:[],filesReady:!1,diff:{kind:"idle"}});return}Ze(o,m)}return}s.selectedFile=l,$(l),!(o===void 0||o===""||y===void 0||w===void 0)&&Ye(o,{base:y,head:w},l)};(0,p.useEffect)(()=>{let n=D.current;if(!(n===void 0||C===void 0)){if(D.current=void 0,n.tab==="commits"&&n.commit!==void 0&&S.some(l=>l.hash===n.commit)){B("commits",n.commit);return}n.tab==="files"&&n.file!==void 0&&T.some(l=>l.path===n.file)&&B("files",n.file)}},[C,S,T,B]);let ee=R==="commits"?S:T,we=S.some(n=>n.hash===ye)?ye:S[0]?.hash,ve=T.some(n=>n.path===he)?he:T[0]?.path,W=n=>{if(ee.length===0)return;let l=R==="commits"?S.findIndex(b=>b.hash===we):T.findIndex(b=>b.path===ve),m=Math.min(ee.length-1,Math.max(0,(l<0?0:l)+n)),u=ee[m];if(u===void 0)return;let c=R==="commits"?u.hash:u.path;R==="commits"?(s.selectedCommit=c,A(c)):(s.selectedFile=c,$(c));let F=R==="commits"?`[data-testid="commit-row"][data-hash="${CSS.escape(c)}"]`:`[data-testid="file-row"][data-path="${CSS.escape(c)}"]`;document.querySelector(F)?.focus()},ke=(n,l)=>{if(n.key==="Enter"||n.key===" "){n.preventDefault(),B(R,l);return}if(n.key==="ArrowDown"){n.preventDefault(),W(1);return}if(n.key==="ArrowUp"){n.preventDefault(),W(-1);return}if(n.key==="PageDown"){n.preventDefault(),W(10);return}n.key==="PageUp"&&(n.preventDefault(),W(-10))},Re=n=>{q?.("fs-explorer",Ve(n))},ar=n=>{xe?.("git-explorer",Me(n))},Ce=n=>{n!==R&&(s.tab=n,fe(n),h({kind:"none"}))};return(0,a.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,a.jsxs)("div",{"data-rm":"header",children:[(0,a.jsx)("h2",{"data-rm":"title",children:e.title}),(0,a.jsx)("span",{"data-rm":"repo-name",children:Q?.repo??e.repoFallback}),y===void 0||w===void 0?null:(0,a.jsx)("span",{"data-rm":"range",children:He(y,w)}),(0,a.jsxs)("label",{"data-rm":"base-field",children:[(0,a.jsx)("span",{"data-rm":"base-label",children:e.baseLabel}),(0,a.jsx)("select",{"data-rm":"base",value:y??"",onChange:n=>be("base",n.target.value),disabled:j.length===0,children:j.map(n=>(0,a.jsx)("option",{value:n.name,children:n.name},`base:${n.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"swap",onClick:rr,disabled:y===void 0||w===void 0,children:e.swap}),(0,a.jsxs)("label",{"data-rm":"head-field",children:[(0,a.jsx)("span",{"data-rm":"head-label",children:e.headLabel}),(0,a.jsx)("select",{"data-rm":"head",value:w??"",onChange:n=>be("head",n.target.value),disabled:j.length===0,children:j.map(n=>(0,a.jsx)("option",{value:n.name,children:n.name},`head:${n.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"refresh",onClick:tr,disabled:y===void 0||w===void 0,children:e.refresh})]}),f.kind==="idle"?(0,a.jsxs)("div",{"data-rm":"empty",children:[(0,a.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,a.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]}):null,f.kind==="loading"?(0,a.jsx)("p",{"data-rm":"loading",children:e.loading}):null,f.kind==="error"?(0,a.jsx)("p",{"data-rm":"error",children:ue(f.code,e)}):null,C!==void 0&&V!==void 0?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{"data-rm":"summary",children:[(0,a.jsx)("span",{"data-rm":"ahead",children:M(e.ahead,{count:String(V.ahead)})}),(0,a.jsx)("span",{"data-rm":"behind",children:M(e.behind,{count:String(V.behind)})}),(0,a.jsx)("span",{"data-rm":"files-count",children:M(e.filesCount,{count:String(V.files)})}),(0,a.jsxs)("span",{"data-rm":"lines",children:[(0,a.jsxs)("span",{"data-rm":"stat-add",children:["+",V.additions]})," ",(0,a.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",V.deletions]})]}),V.truncatedCommitList?(0,a.jsx)("span",{"data-rm":"commits-truncated",children:e.commitsTruncated}):null]}),er?(0,a.jsx)("p",{"data-rm":"no-difference",children:e.noDifference}):null,(0,a.jsxs)("div",{"data-rm":"split","data-open":v.kind==="none"?"false":"true",children:[(0,a.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":e.title,"data-page-keys":"own",children:[(0,a.jsxs)("div",{"data-rm":"tabs",role:"tablist",children:[(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-commits","aria-selected":R==="commits",onClick:()=>Ce("commits"),children:e.tabCommits}),(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-files","aria-selected":R==="files",onClick:()=>Ce("files"),children:e.tabFiles})]}),R==="commits"?S.map(n=>(0,a.jsx)(ur,{commit:n,selected:n.hash===we,onSelect:l=>B("commits",l),onKey:ke},n.hash)):T.map(n=>(0,a.jsx)(fr,{file:n,strings:e,selected:n.path===ve,onSelect:l=>B("files",l),onKey:ke,...q===void 0?{}:{onOpenInFiles:Re}},n.path))]}),(0,a.jsx)(yr,{phase:v,strings:e,bodyRef:Y,onSelectCommitFile:Qe,...q===void 0?{}:{onOpenInFiles:Re},...xe===void 0?{}:{onOpenInGit:ar}})]})]}):null]})}}var _e=["slots","locale","workbench"],J,U;function xr(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function Ge(e){Fe();let t=e.workbench??void 0,r=e.locale.bind(_);J?.();let i=e.locale.register(_,{zh:ae,en:ne});J=i;let d=We({strings:{title:r("pr-explorer.tabTitle"),repoFallback:r("pr-explorer.repoFallback"),baseLabel:r("pr-explorer.baseLabel"),headLabel:r("pr-explorer.headLabel"),swap:r("pr-explorer.swap"),refresh:r("pr-explorer.refresh"),tabCommits:r("pr-explorer.tabCommits"),tabFiles:r("pr-explorer.tabFiles"),ahead:r("pr-explorer.ahead"),behind:r("pr-explorer.behind"),filesCount:r("pr-explorer.filesCount"),commitsTruncated:r("pr-explorer.commitsTruncated"),markBinary:r("pr-explorer.markBinary"),markUnknown:r("pr-explorer.markUnknown"),statusAdded:r("pr-explorer.statusAdded"),statusModified:r("pr-explorer.statusModified"),statusDeleted:r("pr-explorer.statusDeleted"),statusRenamed:r("pr-explorer.statusRenamed"),statusCopied:r("pr-explorer.statusCopied"),statusTypeChanged:r("pr-explorer.statusTypeChanged"),statusUnknown:r("pr-explorer.statusUnknown"),loading:r("pr-explorer.loading"),empty:r("pr-explorer.empty"),emptyHint:r("pr-explorer.emptyHint"),noDifference:r("pr-explorer.noDifference"),detailEmpty:r("pr-explorer.detailEmpty"),detailTruncated:r("pr-explorer.detailTruncated"),detailBinary:r("pr-explorer.detailBinary"),detailUnknownSize:r("pr-explorer.detailUnknownSize"),commitHash:r("pr-explorer.commitHash"),commitAuthor:r("pr-explorer.commitAuthor"),commitDate:r("pr-explorer.commitDate"),commitSubject:r("pr-explorer.commitSubject"),commitRefs:r("pr-explorer.commitRefs"),commitFiles:r("pr-explorer.commitFiles"),commitRoot:r("pr-explorer.commitRoot"),commitEmpty:r("pr-explorer.commitEmpty"),openInFiles:r("pr-explorer.openInFiles"),openInGit:r("pr-explorer.openInGit"),errorNotARepo:r("pr-explorer.errorNotARepo"),errorInvalidRef:r("pr-explorer.errorInvalidRef"),errorNoMergeBase:r("pr-explorer.errorNoMergeBase"),errorNoSession:r("pr-explorer.errorNoSession"),errorTooLarge:r("pr-explorer.errorTooLarge"),errorUnreadable:r("pr-explorer.errorUnreadable"),errorBadRequest:r("pr-explorer.errorBadRequest"),errorUnknown:r("pr-explorer.errorUnknown")},...t===void 0?{}:{workbench:t}}),o;return e.slots.inject(te,()=>{U?.();let x=e.slots.register({name:te,id:N,order:115,label:()=>xr(e).startsWith("zh")?ae["pr-explorer.tabTitle"]:ne["pr-explorer.tabTitle"],locale:_},d);return U=x,o=x,()=>{x(),U===x&&(U=void 0)}}),()=>{o!==void 0&&U===o&&(U(),U=void 0),o=void 0,J===i&&(i(),J=void 0)}}var Je={name:Pe,inject:_e,apply:Ge},br=Je;

    return module.exports.default ?? module.exports;
  }
});
