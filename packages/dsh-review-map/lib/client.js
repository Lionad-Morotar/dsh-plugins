window.__ModuleLoader__.load({
  id: "dsh-review-map",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var k=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var J=Object.prototype.hasOwnProperty;var Q=(a,e)=>{for(var t in e)k(a,t,{get:e[t],enumerable:!0})},ee=(a,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Z(e))!J.call(a,i)&&i!==t&&k(a,i,{get:()=>e[i],enumerable:!(n=Y(e,i))||n.enumerable});return a};var ae=a=>ee(k({},"__esModule",{value:!0}),a);var ce={};Q(ce,{apply:()=>$,clientPlugin:()=>K,default:()=>pe,inject:()=>_});module.exports=ae(ce);var T="dsh-review-map",x="conversation.view",U="review-map";var f="review-map",F="/review-map/api";var R={"review-map.tabTitle":"\u8BC4\u5BA1","review-map.repoFallback":"\u672A\u77E5\u4ED3\u5E93","review-map.scopeWorktree":"\u672A\u63D0\u4EA4","review-map.scopeBranch":"\u5206\u652F\u5BF9\u6BD4","review-map.refresh":"\u91CD\u65B0\u8BFB\u53D6","review-map.statLines":"\u6E90\u7801\u884C","review-map.statFiles":"\u6539\u52A8\u6587\u4EF6","review-map.uncommitted":"\u672A\u63D0\u4EA4 {count}","review-map.listMetaWorktree":"\u672A\u63D0\u4EA4\u6539\u52A8","review-map.listMetaBranch":"\u5BF9\u6BD4 {base}","review-map.listSort":"\u6309\u53D8\u66F4\u91CF\u6392\u5E8F","review-map.listEmpty":"\u5DE5\u4F5C\u533A\u6CA1\u6709\u53D8\u66F4","review-map.renameHint":"\u539F\u8DEF\u5F84 {path}","review-map.markBinary":"\u4E8C\u8FDB\u5236","review-map.markUntracked":"\u672A\u8DDF\u8E2A","review-map.markConflicted":"\u51B2\u7A81","review-map.statusAdded":"\u65B0\u589E","review-map.statusModified":"\u4FEE\u6539","review-map.statusDeleted":"\u5220\u9664","review-map.statusRenamed":"\u91CD\u547D\u540D","review-map.statusCopied":"\u590D\u5236","review-map.statusTypeChanged":"\u7C7B\u578B\u53D8\u66F4","review-map.statusUntracked":"\u672A\u8DDF\u8E2A","review-map.statusConflicted":"\u51B2\u7A81","review-map.statusUnknown":"\u672A\u77E5","review-map.loading":"\u52A0\u8F7D\u4E2D","review-map.empty":"\u9009\u62E9\u4F1A\u8BDD\u540E\u52A0\u8F7D\u53D8\u66F4","review-map.emptyHint":"\u8BC4\u5BA1\u89C6\u56FE\u4F1A\u5728\u8FD9\u91CC\u6309\u53D8\u66F4\u8303\u56F4\u94FA\u5F00\u3002","review-map.errorNotARepo":"\u8FD9\u4E2A\u76EE\u5F55\u4E0D\u662F git \u4ED3\u5E93","review-map.errorNoBase":"\u4ED3\u5E93\u6CA1\u6709\u53EF\u6BD4\u57FA\u7EBF","review-map.errorNoSession":"\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u533A","review-map.errorTooLarge":"\u53D8\u66F4\u592A\u5927\uFF0C\u65E0\u6CD5\u5B8C\u6574\u8BFB\u53D6","review-map.errorConflicted":"\u8BE5\u6587\u4EF6\u5904\u4E8E\u51B2\u7A81\u4E2D","review-map.errorUnreadable":"\u8BFB\u53D6\u5931\u8D25","review-map.errorUnknown":"\u8BFB\u53D6\u53D8\u66F4\u65F6\u51FA\u9519"},S={"review-map.tabTitle":"Review","review-map.repoFallback":"Unknown repository","review-map.scopeWorktree":"Uncommitted","review-map.scopeBranch":"Branch","review-map.refresh":"Refresh","review-map.statLines":"Source lines","review-map.statFiles":"Files changed","review-map.uncommitted":"{count} uncommitted","review-map.listMetaWorktree":"Uncommitted changes","review-map.listMetaBranch":"Against {base}","review-map.listSort":"Sorted by churn","review-map.listEmpty":"No changes in this workspace","review-map.renameHint":"was {path}","review-map.markBinary":"binary","review-map.markUntracked":"untracked","review-map.markConflicted":"conflict","review-map.statusAdded":"added","review-map.statusModified":"modified","review-map.statusDeleted":"deleted","review-map.statusRenamed":"renamed","review-map.statusCopied":"copied","review-map.statusTypeChanged":"type changed","review-map.statusUntracked":"untracked","review-map.statusConflicted":"conflicted","review-map.statusUnknown":"unknown","review-map.loading":"Loading","review-map.empty":"Select a session to load its changes","review-map.emptyHint":"The review map will lay the change set out here.","review-map.errorNotARepo":"This directory is not a git repository","review-map.errorNoBase":"This repository has no baseline to compare against","review-map.errorNoSession":"This session has no workspace","review-map.errorTooLarge":"The change is too large to read in full","review-map.errorConflicted":"This file is in conflict","review-map.errorUnreadable":"The read failed","review-map.errorUnknown":"Something went wrong reading the changes"};var L="data-dsh-review-map",te=`[data-testid="review-map"] {
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

/* List: one row per path, churn on the right. */
[data-testid="review-map"] [data-rm="list"] {
  flex: 1 1 auto;
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
`;function A(a=typeof document>"u"?void 0:document){if(a===void 0)return;let e=a.querySelector(`style[${L}]`);if(e!==null)return e;let t=a.createElement("style");return t.setAttribute(L,""),t.textContent=te,a.head.append(t),t}var s=require("react");async function re(a,e){let t=await a(e);if(!t.ok)throw new Error(`${e} answered ${String(t.status)}`);return await t.json()}function N(a=fetch){return{async loadSnapshot(e,t){let n=new URLSearchParams({sessionId:e,scope:t.kind});return t.kind==="branch"&&t.baseRef!==void 0&&n.set("base",t.baseRef),await re(a,`${F}/state?${n.toString()}`)}}}function P(a){switch(a){case"added":return"A";case"modified":return"M";case"deleted":return"D";case"renamed":return"R";case"copied":return"C";case"type-changed":return"T";case"untracked":return"U";case"conflicted":return"!";default:return"?"}}function B(a){if(a.status==="conflicted")return{additions:null,deletions:null,note:"conflicted"};if(a.untracked)return{additions:null,deletions:null,note:"untracked"};if(a.binary)return{additions:null,deletions:null,note:"binary"};let e=a.additions!==null&&a.additions>0?a.additions:null,t=a.deletions!==null&&a.deletions>0?a.deletions:null;return{additions:e,deletions:t,note:null}}function H(a){let e=[];return a.additions!==null&&e.push(`+${String(a.additions)}`),a.deletions!==null&&e.push(`\u2212${String(a.deletions)}`),e.join(" ")}function z(a){let e=a.lastIndexOf("/");return e<0?{dir:"",name:a}:{dir:a.slice(0,e+1),name:a.slice(e+1)}}function V(a){let e=t=>(t.additions??0)+(t.deletions??0);return[...a].sort((t,n)=>{let i=e(n)-e(t);return i!==0?i:t.path<n.path?-1:t.path>n.path?1:0})}function D(a){let e=a.summary,t=e!==void 0&&e.files>0?e.files:a.files.length;if(e!==void 0&&e.files>0)return{files:t,additions:e.additions,deletions:e.deletions};let n=0,i=0;for(let d of a.files)n+=d.additions??0,i+=d.deletions??0;return{files:t,additions:n,deletions:i}}function W(a){return a.slice(0,7)}function y(a,e){return a.replace(/\{(\w+)\}/gu,(t,n)=>e[n]??t)}var r=require("react/jsx-runtime");function ne(a,e){switch(a){case"added":return e.statusAdded;case"modified":return e.statusModified;case"deleted":return e.statusDeleted;case"renamed":return e.statusRenamed;case"copied":return e.statusCopied;case"type-changed":return e.statusTypeChanged;case"untracked":return e.statusUntracked;case"conflicted":return e.statusConflicted;default:return e.statusUnknown}}function ie(a,e){switch(a){case"not-a-repo":return e.errorNotARepo;case"no-base":return e.errorNoBase;case"no-session":return e.errorNoSession;case"too-large":return e.errorTooLarge;case"conflicted":return e.errorConflicted;case"unreadable":return e.errorUnreadable;default:return e.errorUnknown}}function oe(a,e){return a==="binary"?e.markBinary:a==="untracked"?e.markUntracked:a==="conflicted"?e.markConflicted:null}function de({file:a,strings:e}){let t=z(a.path),n=B(a),i=oe(n.note,e),d=a.status==="deleted",l=a.oldPath===void 0?void 0:y(e.renameHint,{path:a.oldPath});return(0,r.jsxs)("div",{"data-testid":"review-row","data-path":a.path,"data-status":a.status,"data-deleted":d?"true":void 0,title:l,"aria-label":l,children:[(0,r.jsx)("span",{"data-rm":"mark","data-status":a.status,title:ne(a.status,e),children:P(a.status)}),(0,r.jsxs)("span",{"data-rm":"path",children:[t.dir===""?null:(0,r.jsx)("span",{"data-rm":"path-dir",children:t.dir}),(0,r.jsx)("span",{"data-rm":"path-name",className:d?"rm-struck":void 0,children:t.name})]}),(0,r.jsx)("span",{"data-rm":"churn","data-note":n.note??void 0,children:i??H(n)})]})}function O({strings:a,runtime:e=N()}){return function({sessionId:n}){let[i,d]=(0,s.useState)("worktree"),[l,u]=(0,s.useState)({kind:"idle"}),m=(0,s.useRef)(0),g=(0,s.useRef)(n),w=(0,s.useCallback)((p,G)=>{m.current+=1;let M=m.current;u({kind:"loading"});let X=G==="branch"?{kind:"branch"}:{kind:"worktree"};e.loadSnapshot(p,X).then(b=>{m.current===M&&u(b.ok?{kind:"ready",snapshot:b.snapshot}:{kind:"error",code:b.error.code})},()=>{m.current===M&&u({kind:"error",code:"unreadable"})})},[e]);(0,s.useEffect)(()=>{if(n===void 0||n===""){m.current+=1,g.current=n,u({kind:"idle"});return}if(g.current!==n){g.current=n,d("worktree"),w(n,"worktree");return}w(n,i)},[n,i,w]);let C=p=>{p!==i&&d(p)},q=()=>{n===void 0||n===""||w(n,i)},j=n!==void 0&&n!=="",o=l.kind==="ready"?l.snapshot:void 0,v=o===void 0?void 0:D(o),E=o===void 0?[]:V(o.files),I=o===void 0?void 0:o.scope==="branch"&&o.baseRef!==null?y(a.listMetaBranch,{base:W(o.baseRef)}):a.listMetaWorktree;return(0,r.jsxs)("div",{"data-testid":"review-map","data-conversation-composer-overlay":"",children:[(0,r.jsxs)("div",{"data-rm":"header",children:[(0,r.jsx)("h2",{"data-rm":"title",children:a.title}),(0,r.jsx)("span",{"data-rm":"repo-name",children:o?.repo??a.repoFallback}),o===void 0?null:(0,r.jsxs)("span",{"data-rm":"head","data-head-kind":o.head.kind,children:[o.head.kind==="branch"?o.head.ref:"HEAD"," ",o.head.shortHash]}),(0,r.jsxs)("span",{"data-rm":"scope",role:"group",children:[(0,r.jsx)("button",{type:"button","data-rm":"scope-worktree","aria-pressed":i==="worktree",onClick:()=>C("worktree"),children:a.scopeWorktree}),(0,r.jsx)("button",{type:"button","data-rm":"scope-branch","aria-pressed":i==="branch",onClick:()=>C("branch"),children:a.scopeBranch})]}),(0,r.jsx)("button",{type:"button","data-rm":"refresh",onClick:q,disabled:!j,children:a.refresh})]}),l.kind==="idle"?(0,r.jsxs)("div",{"data-rm":"empty",children:[(0,r.jsx)("p",{"data-rm":"empty-title",children:a.empty}),(0,r.jsx)("p",{"data-rm":"empty-hint",children:a.emptyHint})]}):null,l.kind==="loading"?(0,r.jsx)("p",{"data-rm":"loading",children:a.loading}):null,l.kind==="error"?(0,r.jsx)("p",{"data-rm":"error",children:ie(l.code,a)}):null,o!==void 0&&v!==void 0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{"data-rm":"stats",children:[(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"lines",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:a.statLines}),(0,r.jsxs)("span",{"data-rm":"stat-value",children:[(0,r.jsxs)("span",{"data-rm":"stat-add",children:["+",v.additions]})," ",(0,r.jsxs)("span",{"data-rm":"stat-del",children:["\u2212",v.deletions]})]})]}),(0,r.jsxs)("div",{"data-rm":"stat","data-stat":"files",children:[(0,r.jsx)("span",{"data-rm":"stat-label",children:a.statFiles}),(0,r.jsx)("span",{"data-rm":"stat-value",children:v.files}),(0,r.jsx)("span",{"data-rm":"uncommitted",children:y(a.uncommitted,{count:String(o.uncommitted)})})]})]}),(0,r.jsxs)("div",{"data-rm":"list",children:[(0,r.jsxs)("div",{"data-rm":"list-meta",children:[(0,r.jsx)("span",{"data-rm":"list-scope",children:I}),(0,r.jsx)("span",{"data-rm":"list-sort",children:a.listSort})]}),E.length===0?(0,r.jsx)("p",{"data-rm":"list-empty",children:a.listEmpty}):E.map(p=>(0,r.jsx)(de,{file:p,strings:a},p.path))]})]}):null]})}}var _=["slots","locale"],h,c;function le(a){let e=a.locale.getSnapshot?.();return typeof e?.active=="string"?e.active:"zh"}function $(a){A();let e=a.locale.bind(f);h?.();let t=a.locale.register(f,{zh:R,en:S});h=t;let n=O({strings:{title:e("review-map.tabTitle"),repoFallback:e("review-map.repoFallback"),scopeWorktree:e("review-map.scopeWorktree"),scopeBranch:e("review-map.scopeBranch"),refresh:e("review-map.refresh"),statLines:e("review-map.statLines"),statFiles:e("review-map.statFiles"),uncommitted:e("review-map.uncommitted"),listMetaWorktree:e("review-map.listMetaWorktree"),listMetaBranch:e("review-map.listMetaBranch"),listSort:e("review-map.listSort"),listEmpty:e("review-map.listEmpty"),markBinary:e("review-map.markBinary"),markUntracked:e("review-map.markUntracked"),markConflicted:e("review-map.markConflicted"),renameHint:e("review-map.renameHint"),statusAdded:e("review-map.statusAdded"),statusModified:e("review-map.statusModified"),statusDeleted:e("review-map.statusDeleted"),statusRenamed:e("review-map.statusRenamed"),statusCopied:e("review-map.statusCopied"),statusTypeChanged:e("review-map.statusTypeChanged"),statusUntracked:e("review-map.statusUntracked"),statusConflicted:e("review-map.statusConflicted"),statusUnknown:e("review-map.statusUnknown"),errorNotARepo:e("review-map.errorNotARepo"),errorNoBase:e("review-map.errorNoBase"),errorNoSession:e("review-map.errorNoSession"),errorTooLarge:e("review-map.errorTooLarge"),errorConflicted:e("review-map.errorConflicted"),errorUnreadable:e("review-map.errorUnreadable"),errorUnknown:e("review-map.errorUnknown"),loading:e("review-map.loading"),empty:e("review-map.empty"),emptyHint:e("review-map.emptyHint")}}),i;return a.slots.inject(x,()=>{c?.();let d=a.slots.register({name:x,id:U,order:140,label:()=>le(a).startsWith("zh")?R["review-map.tabTitle"]:S["review-map.tabTitle"],locale:f},n);return c=d,i=d,()=>{d(),c===d&&(c=void 0)}}),()=>{i!==void 0&&c===i&&(c(),c=void 0),i=void 0,h===t&&(t(),h=void 0)}}var K={name:T,inject:_,apply:$},pe=K;

    return module.exports.default ?? module.exports;
  }
});
