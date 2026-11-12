window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var ee=Object.defineProperty;var Ze=Object.getOwnPropertyDescriptor;var Qe=Object.getOwnPropertyNames;var er=Object.prototype.hasOwnProperty;var rr=(e,t)=>{for(var r in t)ee(e,r,{get:t[r],enumerable:!0})},tr=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Qe(t))!er.call(e,i)&&i!==r&&ee(e,i,{get:()=>t[i],enumerable:!(o=Ze(t,i))||o.enumerable});return e};var ar=e=>tr(ee({},"__esModule",{value:!0}),e);var xr={};rr(xr,{apply:()=>Ke,clientPlugin:()=>je,default:()=>gr,inject:()=>qe});module.exports=ar(xr);var he="dsh-pr-explorer",re="conversation.view",$="pr-explorer";var j="pr-explorer",G="/pr-explorer/api";var te={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"\u672A\u77E5\u4ED3\u5E93","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"\u4EA4\u6362","pr-explorer.refresh":"\u91CD\u65B0\u8BFB\u53D6","pr-explorer.tabCommits":"\u63D0\u4EA4","pr-explorer.tabFiles":"\u6587\u4EF6","pr-explorer.ahead":"\u9886\u5148 {count}","pr-explorer.behind":"\u843D\u540E {count}","pr-explorer.filesCount":"{count} \u6587\u4EF6","pr-explorer.commitsTruncated":"\u63D0\u4EA4\u5217\u8868\u5DF2\u622A\u65AD","pr-explorer.markBinary":"\u4E8C\u8FDB\u5236","pr-explorer.markUnknown":"\u672A\u77E5","pr-explorer.statusAdded":"\u65B0\u589E","pr-explorer.statusModified":"\u4FEE\u6539","pr-explorer.statusDeleted":"\u5220\u9664","pr-explorer.statusRenamed":"\u91CD\u547D\u540D","pr-explorer.statusCopied":"\u590D\u5236","pr-explorer.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","pr-explorer.statusUnknown":"\u672A\u77E5","pr-explorer.loading":"\u52A0\u8F7D\u4E2D","pr-explorer.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.noDifference":"\u4E24\u4E2A ref \u4E4B\u95F4\u6CA1\u6709\u5DEE\u5F02","pr-explorer.detailEmpty":"\u9009\u62E9\u5DE6\u4FA7\u4E00\u884C\u67E5\u770B\u8BE6\u60C5","pr-explorer.detailTruncated":"\u5DF2\u622A\u65AD","pr-explorer.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","pr-explorer.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","pr-explorer.commitHash":"\u63D0\u4EA4","pr-explorer.commitAuthor":"\u4F5C\u8005","pr-explorer.commitDate":"\u65E5\u671F","pr-explorer.commitSubject":"\u6807\u9898","pr-explorer.commitRefs":"\u5F15\u7528","pr-explorer.openInFiles":"\u5728\u6587\u4EF6\u9762\u677F\u6253\u5F00","pr-explorer.openInGit":"\u5728 Git \u9762\u677F\u6253\u5F00","pr-explorer.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","pr-explorer.errorInvalidRef":"\u8BE5 ref \u4E0D\u5B58\u5728","pr-explorer.errorNoMergeBase":"\u4E24\u4E2A ref \u6CA1\u6709\u5171\u540C\u7956\u5148","pr-explorer.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","pr-explorer.errorTooLarge":"\u5185\u5BB9\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","pr-explorer.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","pr-explorer.errorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u533A\u95F4","pr-explorer.errorUnknown":"\u8BFB\u53D6\u5BF9\u6BD4\u65F6\u51FA\u9519"},ae={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"Unknown repository","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"Swap","pr-explorer.refresh":"Refresh","pr-explorer.tabCommits":"Commits","pr-explorer.tabFiles":"Files","pr-explorer.ahead":"{count} ahead","pr-explorer.behind":"{count} behind","pr-explorer.filesCount":"{count} files","pr-explorer.commitsTruncated":"The commit list was truncated","pr-explorer.markBinary":"binary","pr-explorer.markUnknown":"unknown","pr-explorer.statusAdded":"added","pr-explorer.statusModified":"modified","pr-explorer.statusDeleted":"deleted","pr-explorer.statusRenamed":"renamed","pr-explorer.statusCopied":"copied","pr-explorer.statusTypeChanged":"type changed","pr-explorer.statusUnknown":"unknown","pr-explorer.loading":"Loading","pr-explorer.empty":"Select a session to load the comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.noDifference":"These two refs have no difference","pr-explorer.detailEmpty":"Pick a row on the left to see its detail","pr-explorer.detailTruncated":"Truncated","pr-explorer.detailBinary":"Binary file, {size}","pr-explorer.detailUnknownSize":"size unknown","pr-explorer.commitHash":"Commit","pr-explorer.commitAuthor":"Author","pr-explorer.commitDate":"Date","pr-explorer.commitSubject":"Subject","pr-explorer.commitRefs":"Refs","pr-explorer.openInFiles":"Open in the file panel","pr-explorer.openInGit":"Open in the Git panel","pr-explorer.errorNotARepo":"This directory is not a git repository","pr-explorer.errorInvalidRef":"That ref does not exist","pr-explorer.errorNoMergeBase":"These two refs share no commit","pr-explorer.errorNoSession":"This session has no workspace","pr-explorer.errorTooLarge":"The content is too large to read in full","pr-explorer.errorUnreadable":"The read failed","pr-explorer.errorBadRequest":"That range cannot be read","pr-explorer.errorUnknown":"Something went wrong reading the comparison"};var be="data-dsh-pr-explorer",nr=`[data-testid="pr-explorer"] {
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
`;function we(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${be}]`);if(t!==null)return t;let r=e.createElement("style");return r.setAttribute(be,""),r.textContent=nr,e.head.append(r),r}var p=require("react");async function ne(e,t){let r=await e(t);if(!r.ok)throw new Error(`${t} answered ${String(r.status)}`);return await r.json()}function ve(e=fetch){return{async loadRefs(t){let r=new URLSearchParams({sessionId:t});return await ne(e,`${G}/refs?${r.toString()}`)},async loadCompare(t,r,o){let i=new URLSearchParams({sessionId:t,base:r,head:o});return await ne(e,`${G}/compare?${i.toString()}`)},async loadDiff(t,r,o,i){let d=new URLSearchParams({sessionId:t,base:r,head:o,path:i});return await ne(e,`${G}/diff?${d.toString()}`)}}}function ke(){let e=new Map;return{forSession(t){let r=t??"",o=e.get(r);if(o!==void 0)return o;let i={};return e.set(r,i),i}}}var Re="compare:";function oe(e){if(e===void 0||!e.startsWith(Re))return;let t=e.slice(Re.length),r=t.indexOf(":");if(r<0)return;let o=t.slice(0,r),i=t.slice(r+1);if(!(o===""||i===""||i.includes(":")))return{base:o,head:i}}function Ce({seam:e,sessionId:t}){return(r,o)=>{if(o!==""){if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.(r,o);let i=e.openViewOrSwitch(r,o);if(i.focused){e.viewFocus?.take?.(r);return}if(i.opened)return;e.viewFocus?.take?.(r)}e.views?.open(t,r,o)!==!0&&e.openView?.(r,o)!==!0&&e.viewFocus?.request?.(r,o)}}}function Pe(e){return`path:${e}`}function Se(e){return`commit:${e}`}var Fe={branch:0,remote:1,tag:2};function De(e,t={}){let r=e.refs.map(i=>({name:i.name,kind:i.kind,isDefault:i.isDefault})),o=new Set(r.map(i=>i.name));for(let i of t.current??[])i===""||o.has(i)||(o.add(i),r.push({name:i,kind:"branch",isDefault:!1}));return r.sort((i,d)=>{let y=Fe[i.kind]-Fe[d.kind];return y!==0?y:i.name<d.name?-1:i.name>d.name?1:0})}function ie(e){let t=e.refs.find(i=>i.kind==="branch")?.name,r=e.defaultBase??t??"HEAD",o=e.head.kind==="branch"?e.head.ref:"HEAD";return r===o?{base:r,head:"HEAD"}:{base:r,head:o}}function Te(e){return[...e]}function Le(e){switch(e){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";default:return"?"}}function Ve(e){if(e.binary)return{additions:null,deletions:null,note:"binary"};if(e.status==="unknown")return{additions:null,deletions:null,note:"unknown"};let t=e.additions!==null&&e.additions>0?e.additions:null,r=e.deletions!==null&&e.deletions>0?e.deletions:null;return{additions:t,deletions:r,note:null}}function Me(e){let t=[];return e.additions!==null&&t.push(`+${String(e.additions)}`),e.deletions!==null&&t.push(`\u2212${String(e.deletions)}`),t.join(" ")}function Ue(e){let t=e.lastIndexOf("/");return t<0?{dir:"",name:e}:{dir:e.slice(0,t+1),name:e.slice(t+1)}}function Ae(e){let t=r=>(r.additions??0)+(r.deletions??0);return[...e].sort((r,o)=>{let i=t(o)-t(r);return i!==0?i:r.path<o.path?-1:r.path>o.path?1:0})}function ze(e,t){return`${e}...${t}`}function Ie(e){return{ahead:e.reading.ahead,behind:e.reading.behind,files:e.files.summary.files,additions:e.files.summary.additions,deletions:e.files.summary.deletions,commits:e.commits.commits.length,truncatedCommitList:e.commits.truncated}}function or(e){let t=`@@ -${String(e.oldStart)},${String(e.oldLines)} +${String(e.newStart)},${String(e.newLines)} @@`;return e.heading===void 0||e.heading===""?t:`${t} ${e.heading}`}function ir(e){return e==="add"?"+":e==="del"?"\u2212":" "}function Ee(e,t,r,o){return{kind:"line",key:`${String(t??"x")}:${String(r??"x")}`,lineKind:e,oldLine:t,newLine:r,sign:ir(e),text:o}}function $e(e){if(e.kind==="binary")return[];if(e.kind==="deleted")return e.lines.map((r,o)=>Ee("del",o+1,null,r));let t=[];for(let r of e.hunks){t.push({kind:"hunk",header:or(r)});for(let o of r.lines)t.push(Ee(o.kind,o.oldLine,o.newLine,o.text))}return t}function He(e){return e.path}function Be(e){return e<1024?`${String(e)} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function H(e,t){return e.replace(/\{(\w+)\}/gu,(r,o)=>t[o]??r)}var a=require("react/jsx-runtime");function dr(e,t){switch(e){case"added":return t.statusAdded;case"modified":return t.statusModified;case"deleted":return t.statusDeleted;case"renamed":return t.statusRenamed;case"copied":return t.statusCopied;case"type-changed":return t.statusTypeChanged;default:return t.statusUnknown}}function Oe(e,t){switch(e){case"not-a-repo":return t.errorNotARepo;case"invalid-ref":return t.errorInvalidRef;case"no-merge-base":return t.errorNoMergeBase;case"no-session":return t.errorNoSession;case"too-large":return t.errorTooLarge;case"unreadable":return t.errorUnreadable;case"bad-request":return t.errorBadRequest;default:return t.errorUnknown}}function lr(e,t){return e==="binary"?t.markBinary:e==="unknown"?t.markUnknown:null}function sr({commit:e,selected:t,onSelect:r,onKey:o}){return(0,a.jsxs)("div",{"data-testid":"commit-row","data-hash":e.hash,"data-selected":t?"true":"false",role:"option","aria-selected":t,tabIndex:t?0:-1,onClick:()=>r(e.hash),onKeyDown:i=>o(i,e.hash),children:[(0,a.jsx)("span",{"data-rm":"commit-short",children:e.short}),(0,a.jsx)("span",{"data-rm":"commit-subject",children:e.subject}),(0,a.jsxs)("span",{"data-rm":"commit-meta",children:[e.author," \xB7 ",e.date]})]})}function pr({file:e,strings:t,selected:r,onSelect:o,onKey:i,onOpenInFiles:d}){let y=Ue(e.path),T=Ve(e),l=lr(T.note,t),x=e.status==="deleted",C=e.oldPath===void 0?void 0:`${e.oldPath} \u2192 ${e.path}`;return(0,a.jsxs)("div",{"data-testid":"file-row","data-path":e.path,"data-status":e.status,"data-deleted":x?"true":void 0,"data-selected":r?"true":"false",role:"option","aria-selected":r,tabIndex:r?0:-1,title:C,"aria-label":C,onClick:()=>o(e.path),onKeyDown:u=>i(u,e.path),children:[(0,a.jsx)("span",{"data-rm":"mark","data-status":e.status,title:dr(e.status,t),children:Le(e.status)}),(0,a.jsxs)("span",{"data-rm":"path",children:[y.dir===""?null:(0,a.jsx)("span",{"data-rm":"path-dir",children:y.dir}),(0,a.jsx)("span",{"data-rm":"path-name",className:x?"rm-struck":void 0,children:y.name})]}),(0,a.jsx)("span",{"data-rm":"churn","data-note":T.note??void 0,children:l??Me(T)}),d===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files","aria-label":t.openInFiles,title:t.openInFiles,onClick:u=>{u.stopPropagation(),d(e.path)},children:"\u2197"})]})}function mr({phase:e,strings:t,bodyRef:r,onOpenInFiles:o,onOpenInGit:i}){return(0,a.jsx)("div",{"data-rm":"detail",children:(0,a.jsxs)("div",{"data-rm":"detail-body",ref:r,children:[e.kind==="none"?(0,a.jsx)("p",{"data-rm":"detail-empty",children:t.detailEmpty}):null,e.kind==="loading"?(0,a.jsx)("p",{"data-rm":"detail-loading",children:t.loading}):null,e.kind==="error"?(0,a.jsx)("p",{"data-rm":"detail-error",children:Oe(e.code,t)}):null,e.kind==="commit"?(0,a.jsx)(cr,{commit:e.commit,strings:t,onOpenInGit:i}):null,e.kind==="file"?(0,a.jsx)(ur,{diff:e.diff,strings:t,onOpenInFiles:o}):null]})})}function cr({commit:e,strings:t,onOpenInGit:r}){return(0,a.jsxs)("div",{"data-testid":"commit-detail",children:[r===void 0?null:(0,a.jsx)("div",{"data-rm":"commit-detail-actions",children:(0,a.jsx)("button",{type:"button","data-rm":"open-in-git",onClick:()=>r(e.hash),children:t.openInGit})}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitHash}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.hash})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitSubject}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.subject})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitAuthor}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.author})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitDate}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.date})]}),e.refs===void 0?null:(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitRefs}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.refs})]})]})}function ur({diff:e,strings:t,onOpenInFiles:r}){let o=He(e);if(e.kind==="binary"){let d=e.bytes===null?t.detailUnknownSize:Be(e.bytes);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:o}),r===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>r(o),children:t.openInFiles}),(0,a.jsx)("p",{"data-rm":"detail-binary",children:H(t.detailBinary,{size:d})})]})}let i=$e(e);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:o}),r===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>r(o),children:t.openInFiles}),e.kind==="text"&&e.truncated?(0,a.jsx)("p",{"data-rm":"detail-truncated",children:t.detailTruncated}):null,(0,a.jsx)("div",{"data-rm":"diff",children:i.map(d=>d.kind==="hunk"?(0,a.jsx)("div",{"data-rm":"diff-hunk",children:d.header},`hunk:${d.header}`):(0,a.jsxs)("div",{"data-rm":"diff-line","data-kind":d.lineKind,children:[(0,a.jsx)("span",{"data-rm":"diff-old",children:d.oldLine??""}),(0,a.jsx)("span",{"data-rm":"diff-new",children:d.newLine??""}),(0,a.jsx)("span",{"data-rm":"diff-sign",children:d.sign}),(0,a.jsx)("span",{"data-rm":"diff-text",children:d.text})]},d.key))})]})}function Ne({strings:e,runtime:t=ve(),workbench:r}){let o=ke();return function({sessionId:d,viewRequest:y,completeViewRequest:T}){let l=(0,p.useMemo)(()=>o.forSession(d),[o,d]),[x,C]=(0,p.useState)({kind:"idle"}),[u,L]=(0,p.useState)(()=>l.base),[g,V]=(0,p.useState)(()=>l.head),[h,de]=(0,p.useState)(()=>l.tab??"commits"),[le,M]=(0,p.useState)(()=>l.selectedCommit),[se,U]=(0,p.useState)(()=>l.selectedFile),[I,b]=(0,p.useState)({kind:"none"}),[Ge,B]=(0,p.useState)(0),F=(0,p.useRef)(0),w=(0,p.useRef)(0),_=(0,p.useRef)(d),J=(0,p.useRef)(null),pe=(0,p.useRef)(void 0),A=(0,p.useRef)(l.base!==void 0&&l.head!==void 0),P=(0,p.useRef)(l.tab===void 0?void 0:{tab:l.tab,commit:l.selectedCommit,file:l.selectedFile}),O=(0,p.useMemo)(()=>r===void 0?void 0:Ce({seam:r,sessionId:d??""}),[r,d]),me=O,X=(0,p.useCallback)((n,s)=>{F.current+=1;let c=F.current;C({kind:"loading"}),(async()=>{try{let f=await t.loadRefs(n);if(F.current!==c)return;if(!f.ok){C({kind:"error",code:f.error.code});return}let m=s??ie(f.listing),Q=A.current&&s!==void 0;L(m.base),V(m.head);let k=await t.loadCompare(n,m.base,m.head);if(F.current!==c||!k.ok&&k.error.code==="invalid-ref"&&Q&&(A.current=!1,P.current=void 0,delete l.selectedCommit,delete l.selectedFile,m=ie(f.listing),L(m.base),V(m.head),k=await t.loadCompare(n,m.base,m.head),F.current!==c))return;A.current=!1,l.base=m.base,l.head=m.head,C(k.ok?{kind:"ready",listing:f.listing,compare:k.compare}:{kind:"error",code:k.error.code})}catch{if(F.current!==c)return;C({kind:"error",code:"unreadable"})}})()},[l,t]),We=(0,p.useCallback)((n,s,c)=>{w.current+=1;let f=w.current;b({kind:"loading",path:c}),t.loadDiff(n,s.base,s.head,c).then(m=>{w.current===f&&b(m.ok?{kind:"file",diff:m.diff}:{kind:"error",code:m.error.code})},()=>{w.current===f&&b({kind:"error",code:"unreadable"})})},[t]);(0,p.useEffect)(()=>{if(d===void 0||d===""){F.current+=1,w.current+=1,_.current=d,C({kind:"idle"}),L(void 0),V(void 0),b({kind:"none"}),delete l.base,delete l.head,delete l.selectedCommit,delete l.selectedFile,l.tab="commits",P.current=void 0,A.current=!1;return}if(_.current!==d){_.current=d,w.current+=1,de("commits"),M(void 0),U(void 0),b({kind:"none"}),delete l.base,delete l.head,delete l.selectedCommit,delete l.selectedFile,l.tab="commits",P.current=void 0,A.current=!1,X(d,void 0);return}X(d,u===void 0||g===void 0?void 0:{base:u,head:g})},[d,Ge,X]);let N=(0,p.useCallback)(n=>{w.current+=1,P.current=void 0,A.current=!1,delete l.selectedCommit,delete l.selectedFile,M(void 0),U(void 0),b({kind:"none"}),L(n.base),V(n.head),B(s=>s+1)},[l]);(0,p.useEffect)(()=>{let n=y;if(n==null||n.view!==$)return;let s=`${n.view}:${n.focus}`;if(pe.current===s)return;pe.current=s;let c=oe(n.focus);c!==void 0&&N(c),T?.()},[y,T,N]),(0,p.useEffect)(()=>{let n=r?.viewFocus;if(n===void 0)return;let s=()=>{let c=n.take($);if(c===void 0)return;let f=oe(c);f!==void 0&&N(f)};return s(),n.subscribe?.(s)},[r,N]),(0,p.useEffect)(()=>{J.current!==null&&(J.current.scrollTop=0)},[I.kind==="file"?I.diff.path:"",I.kind]);let v=x.kind==="ready"?x.compare:void 0,Y=x.kind==="ready"?x.listing:void 0,E=v===void 0?void 0:Ie(v),R=v===void 0?[]:Te(v.commits.commits),S=v===void 0?[]:Ae(v.files.files),q=Y===void 0?[]:De(Y,{current:[u??"",g??""]}),_e=v!==void 0&&R.length===0&&S.length===0,ce=(n,s)=>{w.current+=1,P.current=void 0,delete l.selectedCommit,delete l.selectedFile,M(void 0),U(void 0),b({kind:"none"}),n==="base"?L(s):V(s),B(c=>c+1)},Je=()=>{u===void 0||g===void 0||(w.current+=1,P.current=void 0,delete l.selectedCommit,delete l.selectedFile,M(void 0),U(void 0),b({kind:"none"}),L(g),V(u),B(n=>n+1))},Xe=()=>{d===void 0||d===""||u===void 0||g===void 0||B(n=>n+1)},z=(n,s)=>{if(n==="commits"){l.selectedCommit=s,M(s);let c=R.find(f=>f.hash===s);c!==void 0&&(w.current+=1,b({kind:"commit",commit:c}));return}l.selectedFile=s,U(s),!(d===void 0||d===""||u===void 0||g===void 0)&&We(d,{base:u,head:g},s)};(0,p.useEffect)(()=>{let n=P.current;if(!(n===void 0||v===void 0)){if(P.current=void 0,n.tab==="commits"&&n.commit!==void 0&&R.some(s=>s.hash===n.commit)){z("commits",n.commit);return}n.tab==="files"&&n.file!==void 0&&S.some(s=>s.path===n.file)&&z("files",n.file)}},[v,R,S,z]);let Z=h==="commits"?R:S,ue=R.some(n=>n.hash===le)?le:R[0]?.hash,fe=S.some(n=>n.path===se)?se:S[0]?.path,K=n=>{if(Z.length===0)return;let s=h==="commits"?R.findIndex(k=>k.hash===ue):S.findIndex(k=>k.path===fe),c=Math.min(Z.length-1,Math.max(0,(s<0?0:s)+n)),f=Z[c];if(f===void 0)return;let m=h==="commits"?f.hash:f.path;h==="commits"?(l.selectedCommit=m,M(m)):(l.selectedFile=m,U(m));let Q=h==="commits"?`[data-testid="commit-row"][data-hash="${CSS.escape(m)}"]`:`[data-testid="file-row"][data-path="${CSS.escape(m)}"]`;document.querySelector(Q)?.focus()},ye=(n,s)=>{if(n.key==="Enter"||n.key===" "){n.preventDefault(),z(h,s);return}if(n.key==="ArrowDown"){n.preventDefault(),K(1);return}if(n.key==="ArrowUp"){n.preventDefault(),K(-1);return}if(n.key==="PageDown"){n.preventDefault(),K(10);return}n.key==="PageUp"&&(n.preventDefault(),K(-10))},ge=n=>{O?.("fs-explorer",Pe(n))},Ye=n=>{me?.("git-explorer",Se(n))},xe=n=>{n!==h&&(l.tab=n,de(n),b({kind:"none"}))};return(0,a.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,a.jsxs)("div",{"data-rm":"header",children:[(0,a.jsx)("h2",{"data-rm":"title",children:e.title}),(0,a.jsx)("span",{"data-rm":"repo-name",children:Y?.repo??e.repoFallback}),u===void 0||g===void 0?null:(0,a.jsx)("span",{"data-rm":"range",children:ze(u,g)}),(0,a.jsxs)("label",{"data-rm":"base-field",children:[(0,a.jsx)("span",{"data-rm":"base-label",children:e.baseLabel}),(0,a.jsx)("select",{"data-rm":"base",value:u??"",onChange:n=>ce("base",n.target.value),disabled:q.length===0,children:q.map(n=>(0,a.jsx)("option",{value:n.name,children:n.name},`base:${n.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"swap",onClick:Je,disabled:u===void 0||g===void 0,children:e.swap}),(0,a.jsxs)("label",{"data-rm":"head-field",children:[(0,a.jsx)("span",{"data-rm":"head-label",children:e.headLabel}),(0,a.jsx)("select",{"data-rm":"head",value:g??"",onChange:n=>ce("head",n.target.value),disabled:q.length===0,children:q.map(n=>(0,a.jsx)("option",{value:n.name,children:n.name},`head:${n.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"refresh",onClick:Xe,disabled:u===void 0||g===void 0,children:e.refresh})]}),x.kind==="idle"?(0,a.jsxs)("div",{"data-rm":"empty",children:[(0,a.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,a.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]}):null,x.kind==="loading"?(0,a.jsx)("p",{"data-rm":"loading",children:e.loading}):null,x.kind==="error"?(0,a.jsx)("p",{"data-rm":"error",children:Oe(x.code,e)}):null,v!==void 0&&E!==void 0?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{"data-rm":"summary",children:[(0,a.jsx)("span",{"data-rm":"ahead",children:H(e.ahead,{count:String(E.ahead)})}),(0,a.jsx)("span",{"data-rm":"behind",children:H(e.behind,{count:String(E.behind)})}),(0,a.jsx)("span",{"data-rm":"files-count",children:H(e.filesCount,{count:String(E.files)})}),(0,a.jsxs)("span",{"data-rm":"lines",children:[(0,a.jsxs)("span",{"data-rm":"stat-add",children:["+",E.additions]})," ",(0,a.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",E.deletions]})]}),E.truncatedCommitList?(0,a.jsx)("span",{"data-rm":"commits-truncated",children:e.commitsTruncated}):null]}),_e?(0,a.jsx)("p",{"data-rm":"no-difference",children:e.noDifference}):null,(0,a.jsxs)("div",{"data-rm":"split","data-open":I.kind==="none"?"false":"true",children:[(0,a.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":e.title,"data-page-keys":"own",children:[(0,a.jsxs)("div",{"data-rm":"tabs",role:"tablist",children:[(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-commits","aria-selected":h==="commits",onClick:()=>xe("commits"),children:e.tabCommits}),(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-files","aria-selected":h==="files",onClick:()=>xe("files"),children:e.tabFiles})]}),h==="commits"?R.map(n=>(0,a.jsx)(sr,{commit:n,selected:n.hash===ue,onSelect:s=>z("commits",s),onKey:ye},n.hash)):S.map(n=>(0,a.jsx)(pr,{file:n,strings:e,selected:n.path===fe,onSelect:s=>z("files",s),onKey:ye,...O===void 0?{}:{onOpenInFiles:ge}},n.path))]}),(0,a.jsx)(mr,{phase:I,strings:e,bodyRef:J,...O===void 0?{}:{onOpenInFiles:ge},...me===void 0?{}:{onOpenInGit:Ye}})]})]}):null]})}}var qe=["slots","locale","workbench"],W,D;function yr(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function Ke(e){we();let t=e.workbench??void 0,r=e.locale.bind(j);W?.();let o=e.locale.register(j,{zh:te,en:ae});W=o;let i=Ne({strings:{title:r("pr-explorer.tabTitle"),repoFallback:r("pr-explorer.repoFallback"),baseLabel:r("pr-explorer.baseLabel"),headLabel:r("pr-explorer.headLabel"),swap:r("pr-explorer.swap"),refresh:r("pr-explorer.refresh"),tabCommits:r("pr-explorer.tabCommits"),tabFiles:r("pr-explorer.tabFiles"),ahead:r("pr-explorer.ahead"),behind:r("pr-explorer.behind"),filesCount:r("pr-explorer.filesCount"),commitsTruncated:r("pr-explorer.commitsTruncated"),markBinary:r("pr-explorer.markBinary"),markUnknown:r("pr-explorer.markUnknown"),statusAdded:r("pr-explorer.statusAdded"),statusModified:r("pr-explorer.statusModified"),statusDeleted:r("pr-explorer.statusDeleted"),statusRenamed:r("pr-explorer.statusRenamed"),statusCopied:r("pr-explorer.statusCopied"),statusTypeChanged:r("pr-explorer.statusTypeChanged"),statusUnknown:r("pr-explorer.statusUnknown"),loading:r("pr-explorer.loading"),empty:r("pr-explorer.empty"),emptyHint:r("pr-explorer.emptyHint"),noDifference:r("pr-explorer.noDifference"),detailEmpty:r("pr-explorer.detailEmpty"),detailTruncated:r("pr-explorer.detailTruncated"),detailBinary:r("pr-explorer.detailBinary"),detailUnknownSize:r("pr-explorer.detailUnknownSize"),commitHash:r("pr-explorer.commitHash"),commitAuthor:r("pr-explorer.commitAuthor"),commitDate:r("pr-explorer.commitDate"),commitSubject:r("pr-explorer.commitSubject"),commitRefs:r("pr-explorer.commitRefs"),openInFiles:r("pr-explorer.openInFiles"),openInGit:r("pr-explorer.openInGit"),errorNotARepo:r("pr-explorer.errorNotARepo"),errorInvalidRef:r("pr-explorer.errorInvalidRef"),errorNoMergeBase:r("pr-explorer.errorNoMergeBase"),errorNoSession:r("pr-explorer.errorNoSession"),errorTooLarge:r("pr-explorer.errorTooLarge"),errorUnreadable:r("pr-explorer.errorUnreadable"),errorBadRequest:r("pr-explorer.errorBadRequest"),errorUnknown:r("pr-explorer.errorUnknown")},...t===void 0?{}:{workbench:t}}),d;return e.slots.inject(re,()=>{D?.();let y=e.slots.register({name:re,id:$,order:115,label:()=>yr(e).startsWith("zh")?te["pr-explorer.tabTitle"]:ae["pr-explorer.tabTitle"],locale:j},i);return D=y,d=y,()=>{y(),D===y&&(D=void 0)}}),()=>{d!==void 0&&D===d&&(D(),D=void 0),d=void 0,W===o&&(o(),W=void 0)}}var je={name:he,inject:qe,apply:Ke},gr=je;

    return module.exports.default ?? module.exports;
  }
});
