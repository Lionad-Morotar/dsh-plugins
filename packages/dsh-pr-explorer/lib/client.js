window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var W=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var qe=Object.getOwnPropertyNames;var je=Object.prototype.hasOwnProperty;var Ge=(e,t)=>{for(var r in t)W(e,r,{get:t[r],enumerable:!0})},We=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of qe(t))!je.call(e,n)&&n!==r&&W(e,n,{get:()=>t[n],enumerable:!(i=Ke(t,n))||i.enumerable});return e};var _e=e=>We(W({},"__esModule",{value:!0}),e);var lr={};Ge(lr,{apply:()=>Ie,clientPlugin:()=>ze,default:()=>dr,inject:()=>Ae});module.exports=_e(lr);var le="dsh-pr-explorer",_="conversation.view",z="pr-explorer";var H="pr-explorer",$="/pr-explorer/api";var J={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"\u672A\u77E5\u4ED3\u5E93","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"\u4EA4\u6362","pr-explorer.refresh":"\u91CD\u65B0\u8BFB\u53D6","pr-explorer.tabCommits":"\u63D0\u4EA4","pr-explorer.tabFiles":"\u6587\u4EF6","pr-explorer.ahead":"\u9886\u5148 {count}","pr-explorer.behind":"\u843D\u540E {count}","pr-explorer.filesCount":"{count} \u6587\u4EF6","pr-explorer.commitsTruncated":"\u63D0\u4EA4\u5217\u8868\u5DF2\u622A\u65AD","pr-explorer.markBinary":"\u4E8C\u8FDB\u5236","pr-explorer.markUnknown":"\u672A\u77E5","pr-explorer.statusAdded":"\u65B0\u589E","pr-explorer.statusModified":"\u4FEE\u6539","pr-explorer.statusDeleted":"\u5220\u9664","pr-explorer.statusRenamed":"\u91CD\u547D\u540D","pr-explorer.statusCopied":"\u590D\u5236","pr-explorer.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","pr-explorer.statusUnknown":"\u672A\u77E5","pr-explorer.loading":"\u52A0\u8F7D\u4E2D","pr-explorer.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.noDifference":"\u4E24\u4E2A ref \u4E4B\u95F4\u6CA1\u6709\u5DEE\u5F02","pr-explorer.detailEmpty":"\u9009\u62E9\u5DE6\u4FA7\u4E00\u884C\u67E5\u770B\u8BE6\u60C5","pr-explorer.detailTruncated":"\u5DF2\u622A\u65AD","pr-explorer.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","pr-explorer.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","pr-explorer.commitHash":"\u63D0\u4EA4","pr-explorer.commitAuthor":"\u4F5C\u8005","pr-explorer.commitDate":"\u65E5\u671F","pr-explorer.commitSubject":"\u6807\u9898","pr-explorer.commitRefs":"\u5F15\u7528","pr-explorer.openInFiles":"\u5728\u6587\u4EF6\u9762\u677F\u6253\u5F00","pr-explorer.openInGit":"\u5728 Git \u9762\u677F\u6253\u5F00","pr-explorer.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","pr-explorer.errorInvalidRef":"\u8BE5 ref \u4E0D\u5B58\u5728","pr-explorer.errorNoMergeBase":"\u4E24\u4E2A ref \u6CA1\u6709\u5171\u540C\u7956\u5148","pr-explorer.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","pr-explorer.errorTooLarge":"\u5185\u5BB9\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","pr-explorer.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","pr-explorer.errorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u533A\u95F4","pr-explorer.errorUnknown":"\u8BFB\u53D6\u5BF9\u6BD4\u65F6\u51FA\u9519"},X={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"Unknown repository","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"Swap","pr-explorer.refresh":"Refresh","pr-explorer.tabCommits":"Commits","pr-explorer.tabFiles":"Files","pr-explorer.ahead":"{count} ahead","pr-explorer.behind":"{count} behind","pr-explorer.filesCount":"{count} files","pr-explorer.commitsTruncated":"The commit list was truncated","pr-explorer.markBinary":"binary","pr-explorer.markUnknown":"unknown","pr-explorer.statusAdded":"added","pr-explorer.statusModified":"modified","pr-explorer.statusDeleted":"deleted","pr-explorer.statusRenamed":"renamed","pr-explorer.statusCopied":"copied","pr-explorer.statusTypeChanged":"type changed","pr-explorer.statusUnknown":"unknown","pr-explorer.loading":"Loading","pr-explorer.empty":"Select a session to load the comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.noDifference":"These two refs have no difference","pr-explorer.detailEmpty":"Pick a row on the left to see its detail","pr-explorer.detailTruncated":"Truncated","pr-explorer.detailBinary":"Binary file, {size}","pr-explorer.detailUnknownSize":"size unknown","pr-explorer.commitHash":"Commit","pr-explorer.commitAuthor":"Author","pr-explorer.commitDate":"Date","pr-explorer.commitSubject":"Subject","pr-explorer.commitRefs":"Refs","pr-explorer.openInFiles":"Open in the file panel","pr-explorer.openInGit":"Open in the Git panel","pr-explorer.errorNotARepo":"This directory is not a git repository","pr-explorer.errorInvalidRef":"That ref does not exist","pr-explorer.errorNoMergeBase":"These two refs share no commit","pr-explorer.errorNoSession":"This session has no workspace","pr-explorer.errorTooLarge":"The content is too large to read in full","pr-explorer.errorUnreadable":"The read failed","pr-explorer.errorBadRequest":"That range cannot be read","pr-explorer.errorUnknown":"Something went wrong reading the comparison"};var se="data-dsh-pr-explorer",Je=`[data-testid="pr-explorer"] {
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
`;function pe(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${se}]`);if(t!==null)return t;let r=e.createElement("style");return r.setAttribute(se,""),r.textContent=Je,e.head.append(r),r}var s=require("react");async function Y(e,t){let r=await e(t);if(!r.ok)throw new Error(`${t} answered ${String(r.status)}`);return await r.json()}function me(e=fetch){return{async loadRefs(t){let r=new URLSearchParams({sessionId:t});return await Y(e,`${$}/refs?${r.toString()}`)},async loadCompare(t,r,i){let n=new URLSearchParams({sessionId:t,base:r,head:i});return await Y(e,`${$}/compare?${n.toString()}`)},async loadDiff(t,r,i,n){let d=new URLSearchParams({sessionId:t,base:r,head:i,path:n});return await Y(e,`${$}/diff?${d.toString()}`)}}}var ce="compare:";function ue(e){if(e===void 0||!e.startsWith(ce))return;let t=e.slice(ce.length),r=t.indexOf(":");if(r<0)return;let i=t.slice(0,r),n=t.slice(r+1);if(!(i===""||n===""||n.includes(":")))return{base:i,head:n}}function fe({seam:e,sessionId:t}){return(r,i)=>{if(i!==""){if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.(r,i);let n=e.openViewOrSwitch(r,i);if(n.focused){e.viewFocus?.take?.(r);return}if(n.opened)return;e.viewFocus?.take?.(r)}e.views?.open(t,r,i)!==!0&&e.openView?.(r,i)!==!0&&e.viewFocus?.request?.(r,i)}}}function ye(e){return`path:${e}`}function xe(e){return`commit:${e}`}var ge={branch:0,remote:1,tag:2};function be(e,t={}){let r=e.refs.map(n=>({name:n.name,kind:n.kind,isDefault:n.isDefault})),i=new Set(r.map(n=>n.name));for(let n of t.current??[])n===""||i.has(n)||(i.add(n),r.push({name:n,kind:"branch",isDefault:!1}));return r.sort((n,d)=>{let p=ge[n.kind]-ge[d.kind];return p!==0?p:n.name<d.name?-1:n.name>d.name?1:0})}function we(e){let t=e.refs.find(n=>n.kind==="branch")?.name,r=e.defaultBase??t??"HEAD",i=e.head.kind==="branch"?e.head.ref:"HEAD";return r===i?{base:r,head:"HEAD"}:{base:r,head:i}}function ve(e){return[...e]}function ke(e){switch(e){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";default:return"?"}}function Re(e){if(e.binary)return{additions:null,deletions:null,note:"binary"};if(e.status==="unknown")return{additions:null,deletions:null,note:"unknown"};let t=e.additions!==null&&e.additions>0?e.additions:null,r=e.deletions!==null&&e.deletions>0?e.deletions:null;return{additions:t,deletions:r,note:null}}function Ce(e){let t=[];return e.additions!==null&&t.push(`+${String(e.additions)}`),e.deletions!==null&&t.push(`\u2212${String(e.deletions)}`),t.join(" ")}function Pe(e){let t=e.lastIndexOf("/");return t<0?{dir:"",name:e}:{dir:e.slice(0,t+1),name:e.slice(t+1)}}function Se(e){let t=r=>(r.additions??0)+(r.deletions??0);return[...e].sort((r,i)=>{let n=t(i)-t(r);return n!==0?n:r.path<i.path?-1:r.path>i.path?1:0})}function Ee(e,t){return`${e}...${t}`}function Fe(e){return{ahead:e.reading.ahead,behind:e.reading.behind,files:e.files.summary.files,additions:e.files.summary.additions,deletions:e.files.summary.deletions,commits:e.commits.commits.length,truncatedCommitList:e.commits.truncated}}function Xe(e){let t=`@@ -${String(e.oldStart)},${String(e.oldLines)} +${String(e.newStart)},${String(e.newLines)} @@`;return e.heading===void 0||e.heading===""?t:`${t} ${e.heading}`}function Ye(e){return e==="add"?"+":e==="del"?"\u2212":" "}function he(e,t,r,i){return{kind:"line",key:`${String(t??"x")}:${String(r??"x")}`,lineKind:e,oldLine:t,newLine:r,sign:Ye(e),text:i}}function De(e){if(e.kind==="binary")return[];if(e.kind==="deleted")return e.lines.map((r,i)=>he("del",i+1,null,r));let t=[];for(let r of e.hunks){t.push({kind:"hunk",header:Xe(r)});for(let i of r.lines)t.push(he(i.kind,i.oldLine,i.newLine,i.text))}return t}function Te(e){return e.path}function Le(e){return e<1024?`${String(e)} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function L(e,t){return e.replace(/\{(\w+)\}/gu,(r,i)=>t[i]??r)}var a=require("react/jsx-runtime");function Ze(e,t){switch(e){case"added":return t.statusAdded;case"modified":return t.statusModified;case"deleted":return t.statusDeleted;case"renamed":return t.statusRenamed;case"copied":return t.statusCopied;case"type-changed":return t.statusTypeChanged;default:return t.statusUnknown}}function Ve(e,t){switch(e){case"not-a-repo":return t.errorNotARepo;case"invalid-ref":return t.errorInvalidRef;case"no-merge-base":return t.errorNoMergeBase;case"no-session":return t.errorNoSession;case"too-large":return t.errorTooLarge;case"unreadable":return t.errorUnreadable;case"bad-request":return t.errorBadRequest;default:return t.errorUnknown}}function Qe(e,t){return e==="binary"?t.markBinary:e==="unknown"?t.markUnknown:null}function er({commit:e,selected:t,onSelect:r,onKey:i}){return(0,a.jsxs)("div",{"data-testid":"commit-row","data-hash":e.hash,"data-selected":t?"true":"false",role:"option","aria-selected":t,tabIndex:t?0:-1,onClick:()=>r(e.hash),onKeyDown:n=>i(n,e.hash),children:[(0,a.jsx)("span",{"data-rm":"commit-short",children:e.short}),(0,a.jsx)("span",{"data-rm":"commit-subject",children:e.subject}),(0,a.jsxs)("span",{"data-rm":"commit-meta",children:[e.author," \xB7 ",e.date]})]})}function rr({file:e,strings:t,selected:r,onSelect:i,onKey:n,onOpenInFiles:d}){let p=Pe(e.path),m=Re(e),v=Qe(m.note,t),u=e.status==="deleted",b=e.oldPath===void 0?void 0:`${e.oldPath} \u2192 ${e.path}`;return(0,a.jsxs)("div",{"data-testid":"file-row","data-path":e.path,"data-status":e.status,"data-deleted":u?"true":void 0,"data-selected":r?"true":"false",role:"option","aria-selected":r,tabIndex:r?0:-1,title:b,"aria-label":b,onClick:()=>i(e.path),onKeyDown:x=>n(x,e.path),children:[(0,a.jsx)("span",{"data-rm":"mark","data-status":e.status,title:Ze(e.status,t),children:ke(e.status)}),(0,a.jsxs)("span",{"data-rm":"path",children:[p.dir===""?null:(0,a.jsx)("span",{"data-rm":"path-dir",children:p.dir}),(0,a.jsx)("span",{"data-rm":"path-name",className:u?"rm-struck":void 0,children:p.name})]}),(0,a.jsx)("span",{"data-rm":"churn","data-note":m.note??void 0,children:v??Ce(m)}),d===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files","aria-label":t.openInFiles,title:t.openInFiles,onClick:x=>{x.stopPropagation(),d(e.path)},children:"\u2197"})]})}function tr({phase:e,strings:t,bodyRef:r,onOpenInFiles:i,onOpenInGit:n}){return(0,a.jsx)("div",{"data-rm":"detail",children:(0,a.jsxs)("div",{"data-rm":"detail-body",ref:r,children:[e.kind==="none"?(0,a.jsx)("p",{"data-rm":"detail-empty",children:t.detailEmpty}):null,e.kind==="loading"?(0,a.jsx)("p",{"data-rm":"detail-loading",children:t.loading}):null,e.kind==="error"?(0,a.jsx)("p",{"data-rm":"detail-error",children:Ve(e.code,t)}):null,e.kind==="commit"?(0,a.jsx)(ar,{commit:e.commit,strings:t,onOpenInGit:n}):null,e.kind==="file"?(0,a.jsx)(nr,{diff:e.diff,strings:t,onOpenInFiles:i}):null]})})}function ar({commit:e,strings:t,onOpenInGit:r}){return(0,a.jsxs)("div",{"data-testid":"commit-detail",children:[r===void 0?null:(0,a.jsx)("div",{"data-rm":"commit-detail-actions",children:(0,a.jsx)("button",{type:"button","data-rm":"open-in-git",onClick:()=>r(e.hash),children:t.openInGit})}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitHash}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.hash})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitSubject}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.subject})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitAuthor}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.author})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitDate}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.date})]}),e.refs===void 0?null:(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:t.commitRefs}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.refs})]})]})}function nr({diff:e,strings:t,onOpenInFiles:r}){let i=Te(e);if(e.kind==="binary"){let d=e.bytes===null?t.detailUnknownSize:Le(e.bytes);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:i}),r===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>r(i),children:t.openInFiles}),(0,a.jsx)("p",{"data-rm":"detail-binary",children:L(t.detailBinary,{size:d})})]})}let n=De(e);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:i}),r===void 0?null:(0,a.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>r(i),children:t.openInFiles}),e.kind==="text"&&e.truncated?(0,a.jsx)("p",{"data-rm":"detail-truncated",children:t.detailTruncated}):null,(0,a.jsx)("div",{"data-rm":"diff",children:n.map(d=>d.kind==="hunk"?(0,a.jsx)("div",{"data-rm":"diff-hunk",children:d.header},`hunk:${d.header}`):(0,a.jsxs)("div",{"data-rm":"diff-line","data-kind":d.lineKind,children:[(0,a.jsx)("span",{"data-rm":"diff-old",children:d.oldLine??""}),(0,a.jsx)("span",{"data-rm":"diff-new",children:d.newLine??""}),(0,a.jsx)("span",{"data-rm":"diff-sign",children:d.sign}),(0,a.jsx)("span",{"data-rm":"diff-text",children:d.text})]},d.key))})]})}function Ue({strings:e,runtime:t=me(),workbench:r}){return function({sessionId:n}){let[d,p]=(0,s.useState)({kind:"idle"}),[m,v]=(0,s.useState)(void 0),[u,b]=(0,s.useState)(void 0),[x,Z]=(0,s.useState)("commits"),[Q,P]=(0,s.useState)(void 0),[ee,S]=(0,s.useState)(void 0),[D,g]=(0,s.useState)({kind:"none"}),[He,V]=(0,s.useState)(0),E=(0,s.useRef)(0),h=(0,s.useRef)(0),M=(0,s.useRef)(n),O=(0,s.useRef)(null),U=(0,s.useMemo)(()=>r===void 0?void 0:fe({seam:r,sessionId:n??""}),[r,n]),re=U,N=(0,s.useCallback)((o,l)=>{E.current+=1;let f=E.current;p({kind:"loading"}),(async()=>{try{let c=await t.loadRefs(o);if(E.current!==f)return;if(!c.ok){p({kind:"error",code:c.error.code});return}let y=l??we(c.listing);v(y.base),b(y.head);let T=await t.loadCompare(o,y.base,y.head);if(E.current!==f)return;p(T.ok?{kind:"ready",listing:c.listing,compare:T.compare}:{kind:"error",code:T.error.code})}catch{if(E.current!==f)return;p({kind:"error",code:"unreadable"})}})()},[t]),$e=(0,s.useCallback)((o,l,f)=>{h.current+=1;let c=h.current;g({kind:"loading",path:f}),t.loadDiff(o,l.base,l.head,f).then(y=>{h.current===c&&g(y.ok?{kind:"file",diff:y.diff}:{kind:"error",code:y.error.code})},()=>{h.current===c&&g({kind:"error",code:"unreadable"})})},[t]);(0,s.useEffect)(()=>{if(n===void 0||n===""){E.current+=1,h.current+=1,M.current=n,p({kind:"idle"}),v(void 0),b(void 0),g({kind:"none"});return}if(M.current!==n){M.current=n,h.current+=1,Z("commits"),P(void 0),S(void 0),g({kind:"none"}),N(n,void 0);return}N(n,m===void 0||u===void 0?void 0:{base:m,head:u})},[n,He,N]),(0,s.useEffect)(()=>{let o=r?.viewFocus;if(o===void 0)return;let l=()=>{let f=o.take(z);if(f===void 0)return;let c=ue(f);c!==void 0&&(h.current+=1,P(void 0),S(void 0),g({kind:"none"}),v(c.base),b(c.head),V(y=>y+1))};return l(),o.subscribe?.(l)},[r]),(0,s.useEffect)(()=>{O.current!==null&&(O.current.scrollTop=0)},[D.kind==="file"?D.diff.path:"",D.kind]);let w=d.kind==="ready"?d.compare:void 0,K=d.kind==="ready"?d.listing:void 0,k=w===void 0?void 0:Fe(w),R=w===void 0?[]:ve(w.commits.commits),F=w===void 0?[]:Se(w.files.files),A=K===void 0?[]:be(K,{current:[m??"",u??""]}),Be=w!==void 0&&R.length===0&&F.length===0,te=(o,l)=>{h.current+=1,P(void 0),S(void 0),g({kind:"none"}),o==="base"?v(l):b(l),V(f=>f+1)},Me=()=>{m===void 0||u===void 0||(h.current+=1,P(void 0),S(void 0),g({kind:"none"}),v(u),b(m),V(o=>o+1))},Oe=()=>{n===void 0||n===""||m===void 0||u===void 0||V(o=>o+1)},q=(o,l)=>{if(o==="commits"){P(l);let f=R.find(c=>c.hash===l);f!==void 0&&(h.current+=1,g({kind:"commit",commit:f}));return}S(l),!(n===void 0||n===""||m===void 0||u===void 0)&&$e(n,{base:m,head:u},l)},j=x==="commits"?R:F,ae=R.some(o=>o.hash===Q)?Q:R[0]?.hash,ne=F.some(o=>o.path===ee)?ee:F[0]?.path,I=o=>{if(j.length===0)return;let l=x==="commits"?R.findIndex(G=>G.hash===ae):F.findIndex(G=>G.path===ne),f=Math.min(j.length-1,Math.max(0,(l<0?0:l)+o)),c=j[f];if(c===void 0)return;let y=x==="commits"?c.hash:c.path;x==="commits"?P(y):S(y);let T=x==="commits"?`[data-testid="commit-row"][data-hash="${CSS.escape(y)}"]`:`[data-testid="file-row"][data-path="${CSS.escape(y)}"]`;document.querySelector(T)?.focus()},oe=(o,l)=>{if(o.key==="Enter"||o.key===" "){o.preventDefault(),q(x,l);return}if(o.key==="ArrowDown"){o.preventDefault(),I(1);return}if(o.key==="ArrowUp"){o.preventDefault(),I(-1);return}if(o.key==="PageDown"){o.preventDefault(),I(10);return}o.key==="PageUp"&&(o.preventDefault(),I(-10))},ie=o=>{U?.("fs-explorer",ye(o))},Ne=o=>{re?.("git-explorer",xe(o))},de=o=>{o!==x&&(Z(o),g({kind:"none"}))};return(0,a.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,a.jsxs)("div",{"data-rm":"header",children:[(0,a.jsx)("h2",{"data-rm":"title",children:e.title}),(0,a.jsx)("span",{"data-rm":"repo-name",children:K?.repo??e.repoFallback}),m===void 0||u===void 0?null:(0,a.jsx)("span",{"data-rm":"range",children:Ee(m,u)}),(0,a.jsxs)("label",{"data-rm":"base-field",children:[(0,a.jsx)("span",{"data-rm":"base-label",children:e.baseLabel}),(0,a.jsx)("select",{"data-rm":"base",value:m??"",onChange:o=>te("base",o.target.value),disabled:A.length===0,children:A.map(o=>(0,a.jsx)("option",{value:o.name,children:o.name},`base:${o.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"swap",onClick:Me,disabled:m===void 0||u===void 0,children:e.swap}),(0,a.jsxs)("label",{"data-rm":"head-field",children:[(0,a.jsx)("span",{"data-rm":"head-label",children:e.headLabel}),(0,a.jsx)("select",{"data-rm":"head",value:u??"",onChange:o=>te("head",o.target.value),disabled:A.length===0,children:A.map(o=>(0,a.jsx)("option",{value:o.name,children:o.name},`head:${o.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"refresh",onClick:Oe,disabled:m===void 0||u===void 0,children:e.refresh})]}),d.kind==="idle"?(0,a.jsxs)("div",{"data-rm":"empty",children:[(0,a.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,a.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]}):null,d.kind==="loading"?(0,a.jsx)("p",{"data-rm":"loading",children:e.loading}):null,d.kind==="error"?(0,a.jsx)("p",{"data-rm":"error",children:Ve(d.code,e)}):null,w!==void 0&&k!==void 0?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{"data-rm":"summary",children:[(0,a.jsx)("span",{"data-rm":"ahead",children:L(e.ahead,{count:String(k.ahead)})}),(0,a.jsx)("span",{"data-rm":"behind",children:L(e.behind,{count:String(k.behind)})}),(0,a.jsx)("span",{"data-rm":"files-count",children:L(e.filesCount,{count:String(k.files)})}),(0,a.jsxs)("span",{"data-rm":"lines",children:[(0,a.jsxs)("span",{"data-rm":"stat-add",children:["+",k.additions]})," ",(0,a.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",k.deletions]})]}),k.truncatedCommitList?(0,a.jsx)("span",{"data-rm":"commits-truncated",children:e.commitsTruncated}):null]}),Be?(0,a.jsx)("p",{"data-rm":"no-difference",children:e.noDifference}):null,(0,a.jsxs)("div",{"data-rm":"split","data-open":D.kind==="none"?"false":"true",children:[(0,a.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":e.title,"data-page-keys":"own",children:[(0,a.jsxs)("div",{"data-rm":"tabs",role:"tablist",children:[(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-commits","aria-selected":x==="commits",onClick:()=>de("commits"),children:e.tabCommits}),(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-files","aria-selected":x==="files",onClick:()=>de("files"),children:e.tabFiles})]}),x==="commits"?R.map(o=>(0,a.jsx)(er,{commit:o,selected:o.hash===ae,onSelect:l=>q("commits",l),onKey:oe},o.hash)):F.map(o=>(0,a.jsx)(rr,{file:o,strings:e,selected:o.path===ne,onSelect:l=>q("files",l),onKey:oe,...U===void 0?{}:{onOpenInFiles:ie}},o.path))]}),(0,a.jsx)(tr,{phase:D,strings:e,bodyRef:O,...U===void 0?{}:{onOpenInFiles:ie},...re===void 0?{}:{onOpenInGit:Ne}})]})]}):null]})}}var Ae=["slots","locale"],B,C;function ir(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function Ie(e){pe();let t=e.get?.("workbench"),r=e.locale.bind(H);B?.();let i=e.locale.register(H,{zh:J,en:X});B=i;let n=Ue({strings:{title:r("pr-explorer.tabTitle"),repoFallback:r("pr-explorer.repoFallback"),baseLabel:r("pr-explorer.baseLabel"),headLabel:r("pr-explorer.headLabel"),swap:r("pr-explorer.swap"),refresh:r("pr-explorer.refresh"),tabCommits:r("pr-explorer.tabCommits"),tabFiles:r("pr-explorer.tabFiles"),ahead:r("pr-explorer.ahead"),behind:r("pr-explorer.behind"),filesCount:r("pr-explorer.filesCount"),commitsTruncated:r("pr-explorer.commitsTruncated"),markBinary:r("pr-explorer.markBinary"),markUnknown:r("pr-explorer.markUnknown"),statusAdded:r("pr-explorer.statusAdded"),statusModified:r("pr-explorer.statusModified"),statusDeleted:r("pr-explorer.statusDeleted"),statusRenamed:r("pr-explorer.statusRenamed"),statusCopied:r("pr-explorer.statusCopied"),statusTypeChanged:r("pr-explorer.statusTypeChanged"),statusUnknown:r("pr-explorer.statusUnknown"),loading:r("pr-explorer.loading"),empty:r("pr-explorer.empty"),emptyHint:r("pr-explorer.emptyHint"),noDifference:r("pr-explorer.noDifference"),detailEmpty:r("pr-explorer.detailEmpty"),detailTruncated:r("pr-explorer.detailTruncated"),detailBinary:r("pr-explorer.detailBinary"),detailUnknownSize:r("pr-explorer.detailUnknownSize"),commitHash:r("pr-explorer.commitHash"),commitAuthor:r("pr-explorer.commitAuthor"),commitDate:r("pr-explorer.commitDate"),commitSubject:r("pr-explorer.commitSubject"),commitRefs:r("pr-explorer.commitRefs"),openInFiles:r("pr-explorer.openInFiles"),openInGit:r("pr-explorer.openInGit"),errorNotARepo:r("pr-explorer.errorNotARepo"),errorInvalidRef:r("pr-explorer.errorInvalidRef"),errorNoMergeBase:r("pr-explorer.errorNoMergeBase"),errorNoSession:r("pr-explorer.errorNoSession"),errorTooLarge:r("pr-explorer.errorTooLarge"),errorUnreadable:r("pr-explorer.errorUnreadable"),errorBadRequest:r("pr-explorer.errorBadRequest"),errorUnknown:r("pr-explorer.errorUnknown")},...t===void 0?{}:{workbench:t}}),d;return e.slots.inject(_,()=>{C?.();let p=e.slots.register({name:_,id:z,order:115,label:()=>ir(e).startsWith("zh")?J["pr-explorer.tabTitle"]:X["pr-explorer.tabTitle"],locale:H},n);return C=p,d=p,()=>{p(),C===p&&(C=void 0)}}),()=>{d!==void 0&&C===d&&(C(),C=void 0),d=void 0,B===i&&(i(),B=void 0)}}var ze={name:le,inject:Ae,apply:Ie},dr=ze;

    return module.exports.default ?? module.exports;
  }
});
