window.__ModuleLoader__.load({
  id: "dsh-pr-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var j=Object.defineProperty;var Ae=Object.getOwnPropertyDescriptor;var ze=Object.getOwnPropertyNames;var He=Object.prototype.hasOwnProperty;var Be=(e,r)=>{for(var t in r)j(e,t,{get:r[t],enumerable:!0})},Me=(e,r,t,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of ze(r))!He.call(e,n)&&n!==t&&j(e,n,{get:()=>r[n],enumerable:!(i=Ae(r,n))||i.enumerable});return e};var $e=e=>Me(j({},"__esModule",{value:!0}),e);var Je={};Be(Je,{apply:()=>Se,clientPlugin:()=>Ee,default:()=>Ze,inject:()=>Pe});module.exports=$e(Je);var te="dsh-pr-explorer",I="conversation.view",ne="pr-explorer";var A="pr-explorer",z="/pr-explorer/api";var _={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"\u672A\u77E5\u4ED3\u5E93","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"\u4EA4\u6362","pr-explorer.refresh":"\u91CD\u65B0\u8BFB\u53D6","pr-explorer.tabCommits":"\u63D0\u4EA4","pr-explorer.tabFiles":"\u6587\u4EF6","pr-explorer.ahead":"\u9886\u5148 {count}","pr-explorer.behind":"\u843D\u540E {count}","pr-explorer.filesCount":"{count} \u6587\u4EF6","pr-explorer.commitsTruncated":"\u63D0\u4EA4\u5217\u8868\u5DF2\u622A\u65AD","pr-explorer.markBinary":"\u4E8C\u8FDB\u5236","pr-explorer.markUnknown":"\u672A\u77E5","pr-explorer.statusAdded":"\u65B0\u589E","pr-explorer.statusModified":"\u4FEE\u6539","pr-explorer.statusDeleted":"\u5220\u9664","pr-explorer.statusRenamed":"\u91CD\u547D\u540D","pr-explorer.statusCopied":"\u590D\u5236","pr-explorer.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","pr-explorer.statusUnknown":"\u672A\u77E5","pr-explorer.loading":"\u52A0\u8F7D\u4E2D","pr-explorer.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u5BF9\u6BD4","pr-explorer.emptyHint":"PR \u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u533A\u95F4\u94FA\u5F00\u4E24\u4E2A\u7AEF\u70B9\u4E4B\u95F4\u7684\u6539\u52A8\u3002","pr-explorer.noDifference":"\u4E24\u4E2A ref \u4E4B\u95F4\u6CA1\u6709\u5DEE\u5F02","pr-explorer.detailEmpty":"\u9009\u62E9\u5DE6\u4FA7\u4E00\u884C\u67E5\u770B\u8BE6\u60C5","pr-explorer.detailTruncated":"\u5DF2\u622A\u65AD","pr-explorer.detailBinary":"\u4E8C\u8FDB\u5236\u6587\u4EF6 {size}","pr-explorer.detailUnknownSize":"\u672A\u77E5\u5927\u5C0F","pr-explorer.commitHash":"\u63D0\u4EA4","pr-explorer.commitAuthor":"\u4F5C\u8005","pr-explorer.commitDate":"\u65E5\u671F","pr-explorer.commitSubject":"\u6807\u9898","pr-explorer.commitRefs":"\u5F15\u7528","pr-explorer.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","pr-explorer.errorInvalidRef":"\u8BE5 ref \u4E0D\u5B58\u5728","pr-explorer.errorNoMergeBase":"\u4E24\u4E2A ref \u6CA1\u6709\u5171\u540C\u7956\u5148","pr-explorer.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","pr-explorer.errorTooLarge":"\u5185\u5BB9\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","pr-explorer.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","pr-explorer.errorBadRequest":"\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u533A\u95F4","pr-explorer.errorUnknown":"\u8BFB\u53D6\u5BF9\u6BD4\u65F6\u51FA\u9519"},W={"pr-explorer.tabTitle":"PR","pr-explorer.repoFallback":"Unknown repository","pr-explorer.baseLabel":"base","pr-explorer.headLabel":"head","pr-explorer.swap":"Swap","pr-explorer.refresh":"Refresh","pr-explorer.tabCommits":"Commits","pr-explorer.tabFiles":"Files","pr-explorer.ahead":"{count} ahead","pr-explorer.behind":"{count} behind","pr-explorer.filesCount":"{count} files","pr-explorer.commitsTruncated":"The commit list was truncated","pr-explorer.markBinary":"binary","pr-explorer.markUnknown":"unknown","pr-explorer.statusAdded":"added","pr-explorer.statusModified":"modified","pr-explorer.statusDeleted":"deleted","pr-explorer.statusRenamed":"renamed","pr-explorer.statusCopied":"copied","pr-explorer.statusTypeChanged":"type changed","pr-explorer.statusUnknown":"unknown","pr-explorer.loading":"Loading","pr-explorer.empty":"Select a session to load the comparison","pr-explorer.emptyHint":"The PR view will lay the changes between the two ends out here.","pr-explorer.noDifference":"These two refs have no difference","pr-explorer.detailEmpty":"Pick a row on the left to see its detail","pr-explorer.detailTruncated":"Truncated","pr-explorer.detailBinary":"Binary file, {size}","pr-explorer.detailUnknownSize":"size unknown","pr-explorer.commitHash":"Commit","pr-explorer.commitAuthor":"Author","pr-explorer.commitDate":"Date","pr-explorer.commitSubject":"Subject","pr-explorer.commitRefs":"Refs","pr-explorer.errorNotARepo":"This directory is not a git repository","pr-explorer.errorInvalidRef":"That ref does not exist","pr-explorer.errorNoMergeBase":"These two refs share no commit","pr-explorer.errorNoSession":"This session has no workspace","pr-explorer.errorTooLarge":"The content is too large to read in full","pr-explorer.errorUnreadable":"The read failed","pr-explorer.errorBadRequest":"That range cannot be read","pr-explorer.errorUnknown":"Something went wrong reading the comparison"};var oe="data-dsh-pr-explorer",Ne=`[data-testid="pr-explorer"] {
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
`;function ie(e=typeof document>"u"?void 0:document){if(e===void 0)return;let r=e.querySelector(`style[${oe}]`);if(r!==null)return r;let t=e.createElement("style");return t.setAttribute(oe,""),t.textContent=Ne,e.head.append(t),t}var p=require("react");async function G(e,r){let t=await e(r);if(!t.ok)throw new Error(`${r} answered ${String(t.status)}`);return await t.json()}function de(e=fetch){return{async loadRefs(r){let t=new URLSearchParams({sessionId:r});return await G(e,`${z}/refs?${t.toString()}`)},async loadCompare(r,t,i){let n=new URLSearchParams({sessionId:r,base:t,head:i});return await G(e,`${z}/compare?${n.toString()}`)},async loadDiff(r,t,i,n){let d=new URLSearchParams({sessionId:r,base:t,head:i,path:n});return await G(e,`${z}/diff?${d.toString()}`)}}}var le={branch:0,remote:1,tag:2};function pe(e,r={}){let t=e.refs.map(n=>({name:n.name,kind:n.kind,isDefault:n.isDefault})),i=new Set(t.map(n=>n.name));for(let n of r.current??[])n===""||i.has(n)||(i.add(n),t.push({name:n,kind:"branch",isDefault:!1}));return t.sort((n,d)=>{let l=le[n.kind]-le[d.kind];return l!==0?l:n.name<d.name?-1:n.name>d.name?1:0})}function me(e){let r=e.refs.find(n=>n.kind==="branch")?.name,t=e.defaultBase??r??"HEAD",i=e.head.kind==="branch"?e.head.ref:"HEAD";return t===i?{base:t,head:"HEAD"}:{base:t,head:i}}function ce(e){return[...e]}function ue(e){switch(e){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";default:return"?"}}function fe(e){if(e.binary)return{additions:null,deletions:null,note:"binary"};if(e.status==="unknown")return{additions:null,deletions:null,note:"unknown"};let r=e.additions!==null&&e.additions>0?e.additions:null,t=e.deletions!==null&&e.deletions>0?e.deletions:null;return{additions:r,deletions:t,note:null}}function ye(e){let r=[];return e.additions!==null&&r.push(`+${String(e.additions)}`),e.deletions!==null&&r.push(`\u2212${String(e.deletions)}`),r.join(" ")}function xe(e){let r=e.lastIndexOf("/");return r<0?{dir:"",name:e}:{dir:e.slice(0,r+1),name:e.slice(r+1)}}function he(e){let r=t=>(t.additions??0)+(t.deletions??0);return[...e].sort((t,i)=>{let n=r(i)-r(t);return n!==0?n:t.path<i.path?-1:t.path>i.path?1:0})}function ge(e,r){return`${e}...${r}`}function be(e){return{ahead:e.reading.ahead,behind:e.reading.behind,files:e.files.summary.files,additions:e.files.summary.additions,deletions:e.files.summary.deletions,commits:e.commits.commits.length,truncatedCommitList:e.commits.truncated}}function Ve(e){let r=`@@ -${String(e.oldStart)},${String(e.oldLines)} +${String(e.newStart)},${String(e.newLines)} @@`;return e.heading===void 0||e.heading===""?r:`${r} ${e.heading}`}function Ke(e){return e==="add"?"+":e==="del"?"\u2212":" "}function se(e,r,t,i){return{kind:"line",key:`${String(r??"x")}:${String(t??"x")}`,lineKind:e,oldLine:r,newLine:t,sign:Ke(e),text:i}}function we(e){if(e.kind==="binary")return[];if(e.kind==="deleted")return e.lines.map((t,i)=>se("del",i+1,null,t));let r=[];for(let t of e.hunks){r.push({kind:"hunk",header:Ve(t)});for(let i of t.lines)r.push(se(i.kind,i.oldLine,i.newLine,i.text))}return r}function ve(e){return e.path}function ke(e){return e<1024?`${String(e)} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`}function T(e,r){return e.replace(/\{(\w+)\}/gu,(t,i)=>r[i]??t)}var a=require("react/jsx-runtime");function Oe(e,r){switch(e){case"added":return r.statusAdded;case"modified":return r.statusModified;case"deleted":return r.statusDeleted;case"renamed":return r.statusRenamed;case"copied":return r.statusCopied;case"type-changed":return r.statusTypeChanged;default:return r.statusUnknown}}function Re(e,r){switch(e){case"not-a-repo":return r.errorNotARepo;case"invalid-ref":return r.errorInvalidRef;case"no-merge-base":return r.errorNoMergeBase;case"no-session":return r.errorNoSession;case"too-large":return r.errorTooLarge;case"unreadable":return r.errorUnreadable;case"bad-request":return r.errorBadRequest;default:return r.errorUnknown}}function qe(e,r){return e==="binary"?r.markBinary:e==="unknown"?r.markUnknown:null}function je({commit:e,selected:r,onSelect:t,onKey:i}){return(0,a.jsxs)("div",{"data-testid":"commit-row","data-hash":e.hash,"data-selected":r?"true":"false",role:"option","aria-selected":r,tabIndex:r?0:-1,onClick:()=>t(e.hash),onKeyDown:n=>i(n,e.hash),children:[(0,a.jsx)("span",{"data-rm":"commit-short",children:e.short}),(0,a.jsx)("span",{"data-rm":"commit-subject",children:e.subject}),(0,a.jsxs)("span",{"data-rm":"commit-meta",children:[e.author," \xB7 ",e.date]})]})}function Ie({file:e,strings:r,selected:t,onSelect:i,onKey:n}){let d=xe(e.path),l=fe(e),R=qe(l.note,r),m=e.status==="deleted",b=e.oldPath===void 0?void 0:`${e.oldPath} \u2192 ${e.path}`;return(0,a.jsxs)("div",{"data-testid":"file-row","data-path":e.path,"data-status":e.status,"data-deleted":m?"true":void 0,"data-selected":t?"true":"false",role:"option","aria-selected":t,tabIndex:t?0:-1,title:b,"aria-label":b,onClick:()=>i(e.path),onKeyDown:y=>n(y,e.path),children:[(0,a.jsx)("span",{"data-rm":"mark","data-status":e.status,title:Oe(e.status,r),children:ue(e.status)}),(0,a.jsxs)("span",{"data-rm":"path",children:[d.dir===""?null:(0,a.jsx)("span",{"data-rm":"path-dir",children:d.dir}),(0,a.jsx)("span",{"data-rm":"path-name",className:m?"rm-struck":void 0,children:d.name})]}),(0,a.jsx)("span",{"data-rm":"churn","data-note":l.note??void 0,children:R??ye(l)})]})}function _e({phase:e,strings:r,bodyRef:t}){return(0,a.jsx)("div",{"data-rm":"detail",children:(0,a.jsxs)("div",{"data-rm":"detail-body",ref:t,children:[e.kind==="none"?(0,a.jsx)("p",{"data-rm":"detail-empty",children:r.detailEmpty}):null,e.kind==="loading"?(0,a.jsx)("p",{"data-rm":"detail-loading",children:r.loading}):null,e.kind==="error"?(0,a.jsx)("p",{"data-rm":"detail-error",children:Re(e.code,r)}):null,e.kind==="commit"?(0,a.jsx)(We,{commit:e.commit,strings:r}):null,e.kind==="file"?(0,a.jsx)(Ge,{diff:e.diff,strings:r}):null]})})}function We({commit:e,strings:r}){return(0,a.jsxs)("div",{"data-testid":"commit-detail",children:[(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitHash}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.hash})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitSubject}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.subject})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitAuthor}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.author})]}),(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitDate}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.date})]}),e.refs===void 0?null:(0,a.jsxs)("div",{"data-rm":"commit-detail-row",children:[(0,a.jsx)("span",{"data-rm":"commit-detail-label",children:r.commitRefs}),(0,a.jsx)("span",{"data-rm":"commit-detail-value",children:e.refs})]})]})}function Ge({diff:e,strings:r}){let t=ve(e);if(e.kind==="binary"){let n=e.bytes===null?r.detailUnknownSize:ke(e.bytes);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:t}),(0,a.jsx)("p",{"data-rm":"detail-binary",children:T(r.detailBinary,{size:n})})]})}let i=we(e);return(0,a.jsxs)("div",{"data-rm":"detail-file",children:[(0,a.jsx)("div",{"data-rm":"detail-file-name",children:t}),e.kind==="text"&&e.truncated?(0,a.jsx)("p",{"data-rm":"detail-truncated",children:r.detailTruncated}):null,(0,a.jsx)("div",{"data-rm":"diff",children:i.map(n=>n.kind==="hunk"?(0,a.jsx)("div",{"data-rm":"diff-hunk",children:n.header},`hunk:${n.header}`):(0,a.jsxs)("div",{"data-rm":"diff-line","data-kind":n.lineKind,children:[(0,a.jsx)("span",{"data-rm":"diff-old",children:n.oldLine??""}),(0,a.jsx)("span",{"data-rm":"diff-new",children:n.newLine??""}),(0,a.jsx)("span",{"data-rm":"diff-sign",children:n.sign}),(0,a.jsx)("span",{"data-rm":"diff-text",children:n.text})]},n.key))})]})}function Ce({strings:e,runtime:r=de()}){return function({sessionId:i}){let[n,d]=(0,p.useState)({kind:"idle"}),[l,R]=(0,p.useState)(void 0),[m,b]=(0,p.useState)(void 0),[y,X]=(0,p.useState)("commits"),[Y,S]=(0,p.useState)(void 0),[Z,E]=(0,p.useState)(void 0),[D,x]=(0,p.useState)({kind:"none"}),[De,B]=(0,p.useState)(0),C=(0,p.useRef)(0),h=(0,p.useRef)(0),M=(0,p.useRef)(i),$=(0,p.useRef)(null),N=(0,p.useCallback)((o,s)=>{C.current+=1;let c=C.current;d({kind:"loading"}),(async()=>{try{let u=await r.loadRefs(o);if(C.current!==c)return;if(!u.ok){d({kind:"error",code:u.error.code});return}let f=s??me(u.listing);R(f.base),b(f.head);let L=await r.loadCompare(o,f.base,f.head);if(C.current!==c)return;d(L.ok?{kind:"ready",listing:u.listing,compare:L.compare}:{kind:"error",code:L.error.code})}catch{if(C.current!==c)return;d({kind:"error",code:"unreadable"})}})()},[r]),Le=(0,p.useCallback)((o,s,c)=>{h.current+=1;let u=h.current;x({kind:"loading",path:c}),r.loadDiff(o,s.base,s.head,c).then(f=>{h.current===u&&x(f.ok?{kind:"file",diff:f.diff}:{kind:"error",code:f.error.code})},()=>{h.current===u&&x({kind:"error",code:"unreadable"})})},[r]);(0,p.useEffect)(()=>{if(i===void 0||i===""){C.current+=1,h.current+=1,M.current=i,d({kind:"idle"}),R(void 0),b(void 0),x({kind:"none"});return}if(M.current!==i){M.current=i,h.current+=1,X("commits"),S(void 0),E(void 0),x({kind:"none"}),N(i,void 0);return}N(i,l===void 0||m===void 0?void 0:{base:l,head:m})},[i,De,N]),(0,p.useEffect)(()=>{$.current!==null&&($.current.scrollTop=0)},[D.kind==="file"?D.diff.path:"",D.kind]);let g=n.kind==="ready"?n.compare:void 0,V=n.kind==="ready"?n.listing:void 0,w=g===void 0?void 0:be(g),v=g===void 0?[]:ce(g.commits.commits),P=g===void 0?[]:he(g.files.files),F=V===void 0?[]:pe(V,{current:[l??"",m??""]}),Te=g!==void 0&&v.length===0&&P.length===0,J=(o,s)=>{h.current+=1,S(void 0),E(void 0),x({kind:"none"}),o==="base"?R(s):b(s),B(c=>c+1)},Fe=()=>{l===void 0||m===void 0||(h.current+=1,S(void 0),E(void 0),x({kind:"none"}),R(m),b(l),B(o=>o+1))},Ue=()=>{i===void 0||i===""||l===void 0||m===void 0||B(o=>o+1)},K=(o,s)=>{if(o==="commits"){S(s);let c=v.find(u=>u.hash===s);c!==void 0&&(h.current+=1,x({kind:"commit",commit:c}));return}E(s),!(i===void 0||i===""||l===void 0||m===void 0)&&Le(i,{base:l,head:m},s)},O=y==="commits"?v:P,Q=v.some(o=>o.hash===Y)?Y:v[0]?.hash,ee=P.some(o=>o.path===Z)?Z:P[0]?.path,U=o=>{if(O.length===0)return;let s=y==="commits"?v.findIndex(q=>q.hash===Q):P.findIndex(q=>q.path===ee),c=Math.min(O.length-1,Math.max(0,(s<0?0:s)+o)),u=O[c];if(u===void 0)return;let f=y==="commits"?u.hash:u.path;y==="commits"?S(f):E(f);let L=y==="commits"?`[data-testid="commit-row"][data-hash="${CSS.escape(f)}"]`:`[data-testid="file-row"][data-path="${CSS.escape(f)}"]`;document.querySelector(L)?.focus()},re=(o,s)=>{if(o.key==="Enter"||o.key===" "){o.preventDefault(),K(y,s);return}if(o.key==="ArrowDown"){o.preventDefault(),U(1);return}if(o.key==="ArrowUp"){o.preventDefault(),U(-1);return}if(o.key==="PageDown"){o.preventDefault(),U(10);return}o.key==="PageUp"&&(o.preventDefault(),U(-10))},ae=o=>{o!==y&&(X(o),x({kind:"none"}))};return(0,a.jsxs)("div",{"data-testid":"pr-explorer","data-conversation-composer-overlay":"",children:[(0,a.jsxs)("div",{"data-rm":"header",children:[(0,a.jsx)("h2",{"data-rm":"title",children:e.title}),(0,a.jsx)("span",{"data-rm":"repo-name",children:V?.repo??e.repoFallback}),l===void 0||m===void 0?null:(0,a.jsx)("span",{"data-rm":"range",children:ge(l,m)}),(0,a.jsxs)("label",{"data-rm":"base-field",children:[(0,a.jsx)("span",{"data-rm":"base-label",children:e.baseLabel}),(0,a.jsx)("select",{"data-rm":"base",value:l??"",onChange:o=>J("base",o.target.value),disabled:F.length===0,children:F.map(o=>(0,a.jsx)("option",{value:o.name,children:o.name},`base:${o.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"swap",onClick:Fe,disabled:l===void 0||m===void 0,children:e.swap}),(0,a.jsxs)("label",{"data-rm":"head-field",children:[(0,a.jsx)("span",{"data-rm":"head-label",children:e.headLabel}),(0,a.jsx)("select",{"data-rm":"head",value:m??"",onChange:o=>J("head",o.target.value),disabled:F.length===0,children:F.map(o=>(0,a.jsx)("option",{value:o.name,children:o.name},`head:${o.name}`))})]}),(0,a.jsx)("button",{type:"button","data-rm":"refresh",onClick:Ue,disabled:l===void 0||m===void 0,children:e.refresh})]}),n.kind==="idle"?(0,a.jsxs)("div",{"data-rm":"empty",children:[(0,a.jsx)("p",{"data-rm":"empty-title",children:e.empty}),(0,a.jsx)("p",{"data-rm":"empty-hint",children:e.emptyHint})]}):null,n.kind==="loading"?(0,a.jsx)("p",{"data-rm":"loading",children:e.loading}):null,n.kind==="error"?(0,a.jsx)("p",{"data-rm":"error",children:Re(n.code,e)}):null,g!==void 0&&w!==void 0?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{"data-rm":"summary",children:[(0,a.jsx)("span",{"data-rm":"ahead",children:T(e.ahead,{count:String(w.ahead)})}),(0,a.jsx)("span",{"data-rm":"behind",children:T(e.behind,{count:String(w.behind)})}),(0,a.jsx)("span",{"data-rm":"files-count",children:T(e.filesCount,{count:String(w.files)})}),(0,a.jsxs)("span",{"data-rm":"lines",children:[(0,a.jsxs)("span",{"data-rm":"stat-add",children:["+",w.additions]})," ",(0,a.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",w.deletions]})]}),w.truncatedCommitList?(0,a.jsx)("span",{"data-rm":"commits-truncated",children:e.commitsTruncated}):null]}),Te?(0,a.jsx)("p",{"data-rm":"no-difference",children:e.noDifference}):null,(0,a.jsxs)("div",{"data-rm":"split","data-open":D.kind==="none"?"false":"true",children:[(0,a.jsxs)("div",{"data-rm":"list",role:"listbox","aria-label":e.title,"data-page-keys":"own",children:[(0,a.jsxs)("div",{"data-rm":"tabs",role:"tablist",children:[(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-commits","aria-selected":y==="commits",onClick:()=>ae("commits"),children:e.tabCommits}),(0,a.jsx)("button",{type:"button",role:"tab","data-rm":"tab-files","aria-selected":y==="files",onClick:()=>ae("files"),children:e.tabFiles})]}),y==="commits"?v.map(o=>(0,a.jsx)(je,{commit:o,selected:o.hash===Q,onSelect:s=>K("commits",s),onKey:re},o.hash)):P.map(o=>(0,a.jsx)(Ie,{file:o,strings:e,selected:o.path===ee,onSelect:s=>K("files",s),onKey:re},o.path))]}),(0,a.jsx)(_e,{phase:D,strings:e,bodyRef:$})]})]}):null]})}}var Pe=["slots","locale"],H,k;function Ye(e){let r=e.locale.getSnapshot?.();return typeof r?.active=="string"?r.active:"zh"}function Se(e){ie();let r=e.locale.bind(A);H?.();let t=e.locale.register(A,{zh:_,en:W});H=t;let i=Ce({strings:{title:r("pr-explorer.tabTitle"),repoFallback:r("pr-explorer.repoFallback"),baseLabel:r("pr-explorer.baseLabel"),headLabel:r("pr-explorer.headLabel"),swap:r("pr-explorer.swap"),refresh:r("pr-explorer.refresh"),tabCommits:r("pr-explorer.tabCommits"),tabFiles:r("pr-explorer.tabFiles"),ahead:r("pr-explorer.ahead"),behind:r("pr-explorer.behind"),filesCount:r("pr-explorer.filesCount"),commitsTruncated:r("pr-explorer.commitsTruncated"),markBinary:r("pr-explorer.markBinary"),markUnknown:r("pr-explorer.markUnknown"),statusAdded:r("pr-explorer.statusAdded"),statusModified:r("pr-explorer.statusModified"),statusDeleted:r("pr-explorer.statusDeleted"),statusRenamed:r("pr-explorer.statusRenamed"),statusCopied:r("pr-explorer.statusCopied"),statusTypeChanged:r("pr-explorer.statusTypeChanged"),statusUnknown:r("pr-explorer.statusUnknown"),loading:r("pr-explorer.loading"),empty:r("pr-explorer.empty"),emptyHint:r("pr-explorer.emptyHint"),noDifference:r("pr-explorer.noDifference"),detailEmpty:r("pr-explorer.detailEmpty"),detailTruncated:r("pr-explorer.detailTruncated"),detailBinary:r("pr-explorer.detailBinary"),detailUnknownSize:r("pr-explorer.detailUnknownSize"),commitHash:r("pr-explorer.commitHash"),commitAuthor:r("pr-explorer.commitAuthor"),commitDate:r("pr-explorer.commitDate"),commitSubject:r("pr-explorer.commitSubject"),commitRefs:r("pr-explorer.commitRefs"),errorNotARepo:r("pr-explorer.errorNotARepo"),errorInvalidRef:r("pr-explorer.errorInvalidRef"),errorNoMergeBase:r("pr-explorer.errorNoMergeBase"),errorNoSession:r("pr-explorer.errorNoSession"),errorTooLarge:r("pr-explorer.errorTooLarge"),errorUnreadable:r("pr-explorer.errorUnreadable"),errorBadRequest:r("pr-explorer.errorBadRequest"),errorUnknown:r("pr-explorer.errorUnknown")}}),n;return e.slots.inject(I,()=>{k?.();let d=e.slots.register({name:I,id:ne,order:115,label:()=>Ye(e).startsWith("zh")?_["pr-explorer.tabTitle"]:W["pr-explorer.tabTitle"],locale:A},i);return k=d,n=d,()=>{d(),k===d&&(k=void 0)}}),()=>{n!==void 0&&k===n&&(k(),k=void 0),n=void 0,H===t&&(t(),H=void 0)}}var Ee={name:te,inject:Pe,apply:Se},Ze=Ee;

    return module.exports.default ?? module.exports;
  }
});
