window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var W=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var qe=Object.getOwnPropertyNames;var je=Object.prototype.hasOwnProperty;var Ge=(e,r)=>{for(var a in r)W(e,a,{get:r[a],enumerable:!0})},We=(e,r,a,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of qe(r))!je.call(e,n)&&n!==a&&W(e,n,{get:()=>r[n],enumerable:!(i=Ke(r,n))||i.enumerable});return e};var _e=e=>We(W({},"__esModule",{value:!0}),e);var lr={};Ge(lr,{apply:()=>Ie,clientPlugin:()=>ze,default:()=>dr,inject:()=>Ae});module.exports=_e(lr);var le="dsh-pr-explorer",_="conversation.view",z="pr-explorer";var H="pr-explorer",$="/pr-explorer/api";var J={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"\u672A\u77E5\u4ED3\u5E93","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"\u4EA4\u6362","pr-explorer.refresh":"\u91CD\u65B0\u8BFB\u53D6","pr-explorer.tabCommits":"\u63D0\u4EA4","pr-explorer.tabFiles":"\u6587\u4EF6","pr-explorer.ahead":"\u9886\u5148 {count}","pr-explorer.behind":"\u843D\u540E {count}","pr-explorer.filesCount":"{count} \u6587\u4EF6","pr-explorer.commitsTruncated":"\u63D0\u4EA4\u5217\u8868\u5DF2\u622A\u65AD","pr-explorer.markBinary":"\u4E8C\u8FDB\u5236","pr-explorer.markUnknown":"\u672A\u77E5","pr-explorer.statusAdded":"\u65B0\u589E","pr-explorer.statusModified":"\u4FEE\u6539","pr-explorer.statusDeleted":"\u5220\u9664","pr-explorer.statusRenamed":"\u91CD\u547D\u540D","pr-explorer.statusCopied":"\u590D\u5236","pr-explorer.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","pr-explorer.statusUnknown":"\u672A\u77E5","pr-explorer.loading":"\u52A0\u8F7D\u4E2D","pr-explorer.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.noDifference":"\u4E24\u4E2A ref \u4E4B\u95F4\u6CA1\u6709\u5DEE\u5F02","pr-explorer.detailEmpty":"\u9009\u62E9\u5DE6\u4FA7\u4E00\u884C\u67E5\u770B\u8BE6\u60C5","pr-explorer.detailTruncated":"\u5DF2\u622A\u65AD","pr-explorer.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","pr-explorer.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","pr-explorer.commitHash":"\u63D0\u4EA4","pr-explorer.commitAuthor":"\u4F5C\u8005","pr-explorer.commitDate":"\u65E5\u671F","pr-explorer.commitSubject":"\u6807\u9898","pr-explorer.commitRefs":"\u5F15\u7528","pr-explorer.openInFiles":"\u5728\u6587\u4EF6\u9762\u677F\u6253\u5F00","pr-explorer.openInGit":"\u5728 Git \u9762\u677F\u6253\u5F00","pr-explorer.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","pr-explorer.errorInvalidRef":"\u8BE5 ref \u4E0D\u5B58\u5728","pr-explorer.errorNoMergeBase":"\u4E24\u4E2A ref \u6CA1\u6709\u5171\u540C\u7956\u5148","pr-explorer.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","pr-explorer.errorTooLarge":"\u5185\u5BB9\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","pr-explorer.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","pr-explorer.errorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u533A\u95F4","pr-explorer.errorUnknown":"\u8BFB\u53D6\u5BF9\u6BD4\u65F6\u51FA\u9519"},X={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"Unknown repository","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"Swap","pr-explorer.refresh":"Refresh","pr-explorer.tabCommits":"Commits","pr-explorer.tabFiles":"Files","pr-explorer.ahead":"{count} ahead","pr-explorer.behind":"{count} behind","pr-explorer.filesCount":"{count} files","pr-explorer.commitsTruncated":"The commit list was truncated","pr-explorer.markBinary":"binary","pr-explorer.markUnknown":"unknown","pr-explorer.statusAdded":"added","pr-explorer.statusModified":"modified","pr-explorer.statusDeleted":"deleted","pr-explorer.statusRenamed":"renamed","pr-explorer.statusCopied":"copied","pr-explorer.statusTypeChanged":"type changed","pr-explorer.statusUnknown":"unknown","pr-explorer.loading":"Loading","pr-explorer.empty":"Select a session to load the comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.noDifference":"These two refs have no difference","pr-explorer.detailEmpty":"Pick a row on the left to see its detail","pr-explorer.detailTruncated":"Truncated","pr-explorer.detailBinary":"Binary file, {size}","pr-explorer.detailUnknownSize":"size unknown","pr-explorer.commitHash":"Commit","pr-explorer.commitAuthor":"Author","pr-explorer.commitDate":"Date","pr-explorer.commitSubject":"Subject","pr-explorer.commitRefs":"Refs","pr-explorer.openInFiles":"Open in the file panel","pr-explorer.openInGit":"Open in the Git panel","pr-explorer.errorNotARepo":"This directory is not a git repository","pr-explorer.errorInvalidRef":"That ref does not exist","pr-explorer.errorNoMergeBase":"These two refs share no commit","pr-explorer.errorNoSession":"This session has no workspace","pr-explorer.errorTooLarge":"The content is too large to read in full","pr-explorer.errorUnreadable":"The read failed","pr-explorer.errorBadRequest":"That range cannot be read","pr-explorer.errorUnknown":"Something went wrong reading the comparison"};var se="data-dsh-pr-explorer",Je=`[data-testid="pr-explorer"] {
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
`;function pe(e=typeof document>"u"?void 0:document){if(e===void 0)return;let r=e.querySelector(`style[${se}]`);if(r!==null)return r;let a=e.createElement("style");return a.setAttribute(se,""),a.textContent=Je,e.head.append(a),a}var s=require("react");async function Y(e,r){let a=await e(r);if(!a.ok)throw new Error(`${r} answered ${String(a.status)}`);return await a.json()}function me(e=fetch){return{async loadRefs(r){let a=new URLSearchParams({sessionId:r});return await Y(e,`${$}/refs?${a.toString()}`)},async loadCompare(r,a,i){let n=new URLSearchParams({sessionId:r,base:a,head:i});return await Y(e,`${$}/compare?${n.toString()}`)},async loadDiff(r,a,i,n){let d=new URLSearchParams({sessionId:r,base:a,head:i,path:n});return await Y(e,`${$}/diff?${d.toString()}`)}}}var ce="compare:";function ue(e){if(e===void 0||!e.startsWith(ce))return;let r=e.slice(ce.length),a=r.indexOf(":");if(a<0)return;let i=r.slice(0,a),n=r.slice(a+1);if(!(i===""||n===""||n.includes(":")))return{base:i,head:n}}function fe({seam:e,sessionId:r}){return(a,i)=>{if(i!==""){if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.(a,i);let n=e.openViewOrSwitch(a,i);if(n.focused){e.viewFocus?.take?.(a);return}if(n.opened)return;e.viewFocus?.take?.(a)}e.views?.open(r,a,i)!==!0&&e.openView?.(a,i)!==!0&&e.viewFocus?.request?.(a,i)}}}function ye(e){return`path:${e}`}function xe(e){return`commit:${e}`}var he={branch:0,remote:1,tag:2};function be(e,r={}){let a=e.refs.map(n=>({name:n.name,kind:n.kind,isDefault:n.isDefault})),i=new Set(a.map(n=>n.name));for(let n of r.current??[])n===""||i.has(n)||(i.add(n),a.push({name:n,kind:"branch",isDefault:!1}));return a.sort((n,d)=>{let x=he[n.kind]-he[d.kind];return x!==0?x:n.name<d.name?-1:n.name>d.name?1:0})}function we(e){let r=e.refs.find(n=>n.kind==="branch")?.name,a=e.defaultBase??r??"HEAD",i=e.head.kind==="branch"?e.head.ref:"HEAD";return a===i?{base:a,head:"HEAD"}:{base:a,head:i}}function ve(e){return[...e]}function ke(e){switch(e){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";default:return"?"}}function Re(e){if(e.binary)return{additions:null,deletions:null,note:"binary"};if(e.status==="unknown")return{additions:null,deletions:null,note:"unknown"};let r=e.additions!==null&&e.additions>0?e.additions:null,a=e.deletions!==null&&e.deletions>0?e.deletions:null;return{additions:r,deletions:a,note:null}}function Ce(e){let r=[];return e.additions!==null&&r.push(`+${String(e.additions)}`),e.deletions!==null&&r.push(`\u2212${String(e.deletions)}`),r.join(" ")}function Pe(e){let r=e.lastIndexOf("/");return r<0?{dir:"",name:e}:{dir:e.slice(0,r+1),name:e.slice(r+1)}}function Se(e){let r=a=>(a.additions??0)+(a.deletions??0);return[...e].sort((a,i)=>{let n=r(i)-r(a);return n!==0?n:a.path<i.path?-1:a.path>i.path?1:0})}function Ee(e,r){return`${e}...${r}`}function Fe(e){return{ahead:e.reading.ahead,behind:e.reading.behind,files:e.files.summary.files,additions:e.files.summary.additions,deletions:e.files.summary.deletions,commits:e.commits.commits.length,truncatedCommitList:e.commits.truncated}}function Xe(e){let r=`@@ -${String(e.oldStart)},${String(e.oldLines)} +${String(e.newStart)},${String(e.newLines)} @@`;return e.heading===void 0||e.heading===""?r:`${r} ${e.heading}`}function Ye(e){return e==="add"?"+":e==="del"?"\u2212":" "}function ge(e,r,a,i){return{kind:"line",key:`${String(r??"x")}:${String(a??"x")}`,lineKind:e,oldLine:r,newLine:a,sign:Ye(e),text:i}}function De(e){if(e.kind==="binary")return[];if(e.kind==="deleted")return e.lines.map((a,i)=>ge("del",i+1,null,a));let r=[];for(let a of e.hunks){r.push({kind:"hunk",header:Xe(a)});for(let i of a.lines)r.push(ge(i.kind,i.oldLine,i.newLine,i.text))}return r}function Te(e){return e.path}function Le(e){return e<1024?`${String(e)} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function L(e,r){return e.replace(/\{(\w+)\}/gu,(a,i)=>r[i]??a)}var t=require("react/jsx-runtime");function Ze(e,r){switch(e){case"added":return r.statusAdded;case"modified":return r.statusModified;case"deleted":return r.statusDeleted;case"renamed":return r.statusRenamed;case"copied":return r.statusCopied;case"type-changed":return r.statusTypeChanged;default:return r.statusUnknown}}function Ve(e,r){switch(e){case"not-a-repo":return r.errorNotARepo;case"invalid-ref":return r.errorInvalidRef;case"no-merge-base":return r.errorNoMergeBase;case"no-session":return r.errorNoSession;case"too-large":return r.errorTooLarge;case"unreadable":return r.errorUnreadable;case"bad-request":return r.errorBadRequest;default:return r.errorUnknown}}function Qe(e,r){return e==="binary"?r.markBinary:e==="unknown"?r.markUnknown:null}function er({commit:e,selected:r,onSelect:a,onKey:i}){return(0,t.jsxs)("div",{"data-testid":"commit-row","data-hash":e.hash,"data-selected":r?"true":"false",role:"option","aria-selected":r,tabIndex:r?0:-1,onClick:()=>a(e.hash),onKeyDown:n=>i(n,e.hash),children:[(0,t.jsx)("span",{"data-rm":"commit-short",children:e.short}),(0,t.jsx)("span",{"data-rm":"commit-subject",children:e.subject}),(0,t.jsxs)("span",{"data-rm":"commit-meta",children:[e.author," \xB7 ",e.date]})]})}function rr({file:e,strings:r,selected:a,onSelect:i,onKey:n,onOpenInFiles:d}){let x=Pe(e.path),p=Re(e),v=Qe(p.note,r),c=e.status==="deleted",b=e.oldPath===void 0?void 0:`${e.oldPath} \u2192 ${e.path}`;return(0,t.jsxs)("div",{"data-testid":"file-row","data-path":e.path,"data-status":e.status,"data-deleted":c?"true":void 0,"data-selected":a?"true":"false",role:"option","aria-selected":a,tabIndex:a?0:-1,title:b,"aria-label":b,onClick:()=>i(e.path),onKeyDown:y=>n(y,e.path),children:[(0,t.jsx)("span",{"data-rm":"mark","data-status":e.status,title:Ze(e.status,r),children:ke(e.status)}),(0,t.jsxs)("span",{"data-rm":"path",children:[x.dir===""?null:(0,t.jsx)("span",{"data-rm":"path-dir",children:x.dir}),(0,t.jsx)("span",{"data-rm":"path-name",className:c?"rm-struck":void 0,children:x.name})]}),(0,t.jsx)("span",{"data-rm":"churn","data-note":p.note??void 0,children:v??Ce(p)}),d===void 0?null:(0,t.jsx)("button",{type:"button","data-rm":"open-in-files","aria-label":r.openInFiles,title:r.openInFiles,onClick:y=>{y.stopPropagation(),d(e.path)},children:"\u2197"})]})}function tr({phase:e,strings:r,bodyRef:a,onOpenInFiles:i,onOpenInGit:n}){return(0,t.jsx)("div",{"data-rm":"detail",children:(0,t.jsxs)("div",{"data-rm":"detail-body",ref:a,children:[e.kind==="none"?(0,t.jsx)("p",{"data-rm":"detail-empty",children:r.detailEmpty}):null,e.kind==="loading"?(0,t.jsx)("p",{"data-rm":"detail-loading",children:r.loading}):null,e.kind==="error"?(0,t.jsx)("p",{"data-rm":"detail-error",children:Ve(e.code,r)}):null,e.kind==="commit"?(0,t.jsx)(ar,{commit:e.commit,strings:r,onOpenInGit:n}):null,e.kind==="file"?(0,t.jsx)(nr,{diff:e.diff,strings:r,onOpenInFiles:i}):null]})})}function ar({commit:e,strings:r,onOpenInGit:a}){return(0,t.jsxs)("div",{"data-testid":"commit-detail",children:[a===void 0?null:(0,t.jsx)("div",{"data-rm":"commit-detail-actions",children:(0,t.jsx)("button",{type:"button","data-rm":"open-in-git",onClick:()=>a(e.hash),children:r.openInGit})}),(0,t.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,t.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitHash}),(0,t.jsx)("span",{"data-rm":"commit-detail-value",children:e.hash})]}),(0,t.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,t.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitSubject}),(0,t.jsx)("span",{"data-rm":"commit-detail-value",children:e.subject})]}),(0,t.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,t.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitAuthor}),(0,t.jsx)("span",{"data-rm":"commit-detail-value",children:e.author})]}),(0,t.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,t.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitDate}),(0,t.jsx)("span",{"data-rm":"commit-detail-value",children:e.date})]}),e.refs===void 0?null:(0,t.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,t.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitRefs}),(0,t.jsx)("span",{"data-rm":"commit-detail-value",children:e.refs})]})]})}function nr({diff:e,strings:r,onOpenInFiles:a}){let i=Te(e);if(e.kind==="binary"){let d=e.bytes===null?r.detailUnknownSize:Le(e.bytes);return(0,t.jsxs)("div",{"data-rm":"detail-file",children:[(0,t.jsx)("div",{"data-rm":"detail-file-name",children:i}),a===void 0?null:(0,t.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>a(i),children:r.openInFiles}),(0,t.jsx)("p",{"data-rm":"detail-binary",children:L(r.detailBinary,{size:d})})]})}let n=De(e);return(0,t.jsxs)("div",{"data-rm":"detail-file",children:[(0,t.jsx)("div",{"data-rm":"detail-file-name",children:i}),a===void 0?null:(0,t.jsx)("button",{type:"button","data-rm":"open-in-files",onClick:()=>a(i),children:r.openInFiles}),e.kind==="text"&&e.truncated?(0,t.jsx)("p",{"data-rm":"detail-truncated",children:r.detailTruncated}):null,(0,t.jsx)("div",{"data-rm":"diff",children:n.map(d=>d.kind==="hunk"?(0,t.jsx)("div",{"data-rm":"diff-hunk",children:d.header},`hunk:${d.header}`):(0,t.jsxs)("div",{"data-rm":"diff-line","data-kind":d.lineKind,children:[(0,t.jsx)("span",{"data-rm":"diff-old",children:d.oldLine??""}),(0,t.jsx)("span",{"data-rm":"diff-new",children:d.newLine??""}),(0,t.jsx)("span",{"data-rm":"diff-sign",children:d.sign}),(0,t.jsx)("span",{"data-rm":"diff-text",children:d.text})]},d.key))})]})}function Ue({strings:e,runtime:r=me(),workbench:a}){return function({sessionId:n}){let[d,x]=(0,s.useState)({kind:"idle"}),[p,v]=(0,s.useState)(void 0),[c,b]=(0,s.useState)(void 0),[y,Z]=(0,s.useState)("commits"),[Q,P]=(0,s.useState)(void 0),[ee,S]=(0,s.useState)(void 0),[D,h]=(0,s.useState)({kind:"none"}),[He,V]=(0,s.useState)(0),E=(0,s.useRef)(0),g=(0,s.useRef)(0),M=(0,s.useRef)(n),O=(0,s.useRef)(null),U=(0,s.useMemo)(()=>a===void 0?void 0:fe({seam:a,sessionId:n??""}),[a,n]),re=U,N=(0,s.useCallback)((o,l)=>{E.current+=1;let u=E.current;x({kind:"loading"}),(async()=>{try{let m=await r.loadRefs(o);if(E.current!==u)return;if(!m.ok){x({kind:"error",code:m.error.code});return}let f=l??we(m.listing);v(f.base),b(f.head);let T=await r.loadCompare(o,f.base,f.head);if(E.current!==u)return;x(T.ok?{kind:"ready",listing:m.listing,compare:T.compare}:{kind:"error",code:T.error.code})}catch{if(E.current!==u)return;x({kind:"error",code:"unreadable"})}})()},[r]),$e=(0,s.useCallback)((o,l,u)=>{g.current+=1;let m=g.current;h({kind:"loading",path:u}),r.loadDiff(o,l.base,l.head,u).then(f=>{g.current===m&&h(f.ok?{kind:"file",diff:f.diff}:{kind:"error",code:f.error.code})},()=>{g.current===m&&h({kind:"error",code:"unreadable"})})},[r]);(0,s.useEffect)(()=>{if(n===void 0||n===""){E.current+=1,g.current+=1,M.current=n,x({kind:"idle"}),v(void 0),b(void 0),h({kind:"none"});return}if(M.current!==n){M.current=n,g.current+=1,Z("commits"),P(void 0),S(void 0),h({kind:"none"}),N(n,void 0);return}N(n,p===void 0||c===void 0?void 0:{base:p,head:c})},[n,He,N]),(0,s.useEffect)(()=>{let o=a?.viewFocus;if(o===void 0)return;let l=()=>{let u=o.take(z);if(u===void 0)return;let m=ue(u);m!==void 0&&(g.current+=1,P(void 0),S(void 0),h({kind:"none"}),v(m.base),b(m.head),V(f=>f+1))};return l(),o.subscribe?.(l)},[a]),(0,s.useEffect)(()=>{O.current!==null&&(O.current.scrollTop=0)},[D.kind==="file"?D.diff.path:"",D.kind]);let w=d.kind==="ready"?d.compare:void 0,K=d.kind==="ready"?d.listing:void 0,k=w===void 0?void 0:Fe(w),R=w===void 0?[]:ve(w.commits.commits),F=w===void 0?[]:Se(w.files.files),A=K===void 0?[]:be(K,{current:[p??"",c??""]}),Be=w!==void 0&&R.length===0&&F.length===0,te=(o,l)=>{g.current+=1,P(void 0),S(void 0),h({kind:"none"}),o==="base"?v(l):b(l),V(u=>u+1)},Me=()=>{p===void 0||c===void 0||(g.current+=1,P(void 0),S(void 0),h({kind:"none"}),v(c),b(p),V(o=>o+1))},Oe=()=>{n===void 0||n===""||p===void 0||c===void 0||V(o=>o+1)},q=(o,l)=>{if(o==="commits"){P(l);let u=R.find(m=>m.hash===l);u!==void 0&&(g.current+=1,h({kind:"commit",commit:u}));return}S(l),!(n===void 0||n===""||p===void 0||c===void 0)&&$e(n,{base:p,head:c},l)},j=y==="commits"?R:F,ae=R.some(o=>o.hash===Q)?Q:R[0]?.hash,ne=F.some(o=>o.path===ee)?ee:F[0]?.path,I=o=>{if(j.length===0)return;let l=y==="commits"?R.findIndex(G=>G.hash===ae):F.findIndex(G=>G.path===ne),u=Math.min(j.length-1,Math.max(0,(l<0?0:l)+o)),m=j[u];if(m===void 0)return;let f=y==="commits"?m.hash:m.path;y==="commits"?P(f):S(f);let T=y==="commits"?`[data-testid="commit-row"][data-hash="${CSS.escape(f)}"]`:`[data-testid="file-row"][data-path="${CSS.escape(f)}"]`;document.querySelector(T)?.focus()},oe=(o,l)=>{if(o.key==="Enter"||o.key===" "){o.preventDefault(),q(y,l);return}if(o.key==="ArrowDown"){o.preventDefault(),I(1);return}if(o.key==="ArrowUp"){o.preventDefault(),I(-1);return}if(o.key==="PageDown"){o.preventDefault(),I(10);return}o.key==="PageUp"&&(o.preventDefault(),I(-10))},ie=o=>{U?.("fs-explorer",ye(o))},Ne=o=>{re?.("git-explorer",xe(o))},de=o=>{o!==y&&(Z(o),h({kind:"none"}))};return(0,t.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,t.jsxs)("div",{"data-rm":"header",children:[(0,t.jsx)("h2",{"data-rm":"title",children:e.title}),(0,t.jsx)("span",{"data-rm":"repo-name",children:K?.repo??e.repoFallback}),p===void 0||c===void 0?null:(0,t.jsx)("span",{"data-rm":"range",children:Ee(p,c)}),(0,t.jsxs)("label",{"data-rm":"base-field",children:[(0,t.jsx)("span",{"data-rm":"base-label",children:e.baseLabel}),(0,t.jsx)("select",{"data-rm":"base",value:p??"",onChange:o=>te("base",o.target.value),disabled:A.length===0,children:A.map(o=>(0,t.jsx)("option",{value:o.name,children:o.name},`base:${o.name}`))})]}),(0,t.jsx)("button",{type:"button","data-rm":"swap",onClick:Me,disabled:p===void 0||c===void 0,children:e.swap}),(0,t.jsxs)("label",{"data-rm":"head-field",children:[(0,t.jsx)("span",{"data-rm":"head-label",children:e.headLabel}),(0,t.jsx)("select",{"data-rm":"head",value:c??"",onChange:o=>te("head",o.target.value),disabled:A.length===0,children:A.map(o=>(0,t.jsx)("option",{value:o.name,children:o.name},`head:${o.name}`))})]}),(0,t.jsx)("button",{type:"button","data-rm":"refresh",onClick:Oe,disabled:p===void 0||c===void 0,children:e.refresh})]}),d.kind==="idle"?(0,t.jsxs)("div",{"data-rm":"empty",children:[(0,t.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,t.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]}):null,d.kind==="loading"?(0,t.jsx)("p",{"data-rm":"loading",children:e.loading}):null,d.kind==="error"?(0,t.jsx)("p",{"data-rm":"error",children:Ve(d.code,e)}):null,w!==void 0&&k!==void 0?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{"data-rm":"summary",children:[(0,t.jsx)("span",{"data-rm":"ahead",children:L(e.ahead,{count:String(k.ahead)})}),(0,t.jsx)("span",{"data-rm":"behind",children:L(e.behind,{count:String(k.behind)})}),(0,t.jsx)("span",{"data-rm":"files-count",children:L(e.filesCount,{count:String(k.files)})}),(0,t.jsxs)("span",{"data-rm":"lines",children:[(0,t.jsxs)("span",{"data-rm":"stat-add",children:["+",k.additions]})," ",(0,t.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",k.deletions]})]}),k.truncatedCommitList?(0,t.jsx)("span",{"data-rm":"commits-truncated",children:e.commitsTruncated}):null]}),Be?(0,t.jsx)("p",{"data-rm":"no-difference",children:e.noDifference}):null,(0,t.jsxs)("div",{"data-rm":"split","data-open":D.kind==="none"?"false":"true",children:[(0,t.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":e.title,"data-page-keys":"own",children:[(0,t.jsxs)("div",{"data-rm":"tabs",role:"tablist",children:[(0,t.jsx)("button",{type:"button",role:"tab","data-rm":"tab-commits","aria-selected":y==="commits",onClick:()=>de("commits"),children:e.tabCommits}),(0,t.jsx)("button",{type:"button",role:"tab","data-rm":"tab-files","aria-selected":y==="files",onClick:()=>de("files"),children:e.tabFiles})]}),y==="commits"?R.map(o=>(0,t.jsx)(er,{commit:o,selected:o.hash===ae,onSelect:l=>q("commits",l),onKey:oe},o.hash)):F.map(o=>(0,t.jsx)(rr,{file:o,strings:e,selected:o.path===ne,onSelect:l=>q("files",l),onKey:oe,...U===void 0?{}:{onOpenInFiles:ie}},o.path))]}),(0,t.jsx)(tr,{phase:D,strings:e,bodyRef:O,...U===void 0?{}:{onOpenInFiles:ie},...re===void 0?{}:{onOpenInGit:Ne}})]})]}):null]})}}var Ae=["slots","locale"],B,C;function ir(e){let r=e.locale.getSnapshot?.();return typeof r?.active=="string"?r.active:"zh"}function Ie(e){pe();let r=e.locale.bind(H);B?.();let a=e.locale.register(H,{zh:J,en:X});B=a;let i=Ue({strings:{title:r("pr-explorer.tabTitle"),repoFallback:r("pr-explorer.repoFallback"),baseLabel:r("pr-explorer.baseLabel"),headLabel:r("pr-explorer.headLabel"),swap:r("pr-explorer.swap"),refresh:r("pr-explorer.refresh"),tabCommits:r("pr-explorer.tabCommits"),tabFiles:r("pr-explorer.tabFiles"),ahead:r("pr-explorer.ahead"),behind:r("pr-explorer.behind"),filesCount:r("pr-explorer.filesCount"),commitsTruncated:r("pr-explorer.commitsTruncated"),markBinary:r("pr-explorer.markBinary"),markUnknown:r("pr-explorer.markUnknown"),statusAdded:r("pr-explorer.statusAdded"),statusModified:r("pr-explorer.statusModified"),statusDeleted:r("pr-explorer.statusDeleted"),statusRenamed:r("pr-explorer.statusRenamed"),statusCopied:r("pr-explorer.statusCopied"),statusTypeChanged:r("pr-explorer.statusTypeChanged"),statusUnknown:r("pr-explorer.statusUnknown"),loading:r("pr-explorer.loading"),empty:r("pr-explorer.empty"),emptyHint:r("pr-explorer.emptyHint"),noDifference:r("pr-explorer.noDifference"),detailEmpty:r("pr-explorer.detailEmpty"),detailTruncated:r("pr-explorer.detailTruncated"),detailBinary:r("pr-explorer.detailBinary"),detailUnknownSize:r("pr-explorer.detailUnknownSize"),commitHash:r("pr-explorer.commitHash"),commitAuthor:r("pr-explorer.commitAuthor"),commitDate:r("pr-explorer.commitDate"),commitSubject:r("pr-explorer.commitSubject"),commitRefs:r("pr-explorer.commitRefs"),openInFiles:r("pr-explorer.openInFiles"),openInGit:r("pr-explorer.openInGit"),errorNotARepo:r("pr-explorer.errorNotARepo"),errorInvalidRef:r("pr-explorer.errorInvalidRef"),errorNoMergeBase:r("pr-explorer.errorNoMergeBase"),errorNoSession:r("pr-explorer.errorNoSession"),errorTooLarge:r("pr-explorer.errorTooLarge"),errorUnreadable:r("pr-explorer.errorUnreadable"),errorBadRequest:r("pr-explorer.errorBadRequest"),errorUnknown:r("pr-explorer.errorUnknown")},...e.workbench===void 0?{}:{workbench:e.workbench}}),n;return e.slots.inject(_,()=>{C?.();let d=e.slots.register({name:_,id:z,order:115,label:()=>ir(e).startsWith("zh")?J["pr-explorer.tabTitle"]:X["pr-explorer.tabTitle"],locale:H},i);return C=d,n=d,()=>{d(),C===d&&(C=void 0)}}),()=>{n!==void 0&&C===n&&(C(),C=void 0),n=void 0,B===a&&(a(),B=void 0)}}var ze={name:le,inject:Ae,apply:Ie},dr=ze;

    return module.exports.default ?? module.exports;
  }
});
