window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var me=Object.defineProperty;var bt=Object.getOwnPropertyDescriptor;var vt=Object.getOwnPropertyNames;var wt=Object.prototype.hasOwnProperty;var kt=(e,t)=>{for(var n in t)me(e,n,{get:t[n],enumerable:!0})},Ct=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of vt(t))!wt.call(e,a)&&a!==n&&me(e,a,{get:()=>t[a],enumerable:!(r=bt(t,a))||r.enumerable});return e};var St=e=>Ct(me({},"__esModule",{value:!0}),e);var Ot={};kt(Ot,{__test:()=>rt,apply:()=>nt,clientPlugin:()=>ot,createRemoteResolver:()=>et,createRpcCall:()=>tt,default:()=>Vt,inject:()=>Ze});module.exports=St(Ot);var Me={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},Ne={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var fe="conversation.view",J="git-explorer";var Z="git-explorer",Te="gitExplorer";var Rt={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function ee(e){return Rt[e]}var Ge={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function Mt(e,t){return(Ge[e]??0)>=(Ge[t]??0)?e:t}function Ee(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function he(e,t){let n=0;for(let r=0;r<t;r+=1){let a=e.indexOf(" ",n);if(a<0)return"";n=a+1}return e.slice(n)}function Nt(e){let t=e.split("\0"),n=new Map,r=a=>{let c=n.get(a.path);if(c===void 0){n.set(a.path,a);return}n.set(a.path,{...c,status:Mt(c.status,a.status),staged:c.staged||a.staged,isDirectory:c.isDirectory||a.isDirectory,...c.origPath===void 0&&a.origPath===void 0?{}:{origPath:c.origPath??a.origPath}})};for(let a=0;a<t.length;a+=1){let c=t[a];if(c===void 0||c===""||c.startsWith("#"))continue;let d=c[0];if(d==="1"){let o=c.slice(2),p=o.slice(0,2),s=he(o,7);s!==""&&r({path:s,status:Ee(p),staged:p[0]!==".",isDirectory:!1})}else if(d==="2"){let o=c.slice(2),p=o.slice(0,2),s=he(o,8),h=t[a+1]??"";s!==""&&h!==""&&(a+=1,r({path:s,status:Ee(p),staged:p[0]!==".",isDirectory:!1,origPath:h}))}else if(d==="u"){let o=c.slice(2),p=he(o,9);p!==""&&r({path:p,status:"conflicted",staged:!1,isDirectory:!1})}else if(d==="?"){let o=c.slice(2);if(o==="")continue;let p=o.endsWith("/");r({path:p?o.slice(0,-1):o,status:"untracked",staged:!1,isDirectory:p})}}return[...n.values()]}function Tt(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function xe(e){let t=new Map;for(let n of e){let r=Tt(n.path),a=t.get(r);a===void 0?t.set(r,[n]):a.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((a,c)=>a.path.localeCompare(c.path))}))}function te(e){return xe(Nt(e))}function ye(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let a=Math.floor(r/60);if(a<24)return`${a}h`;let c=Math.floor(a/24);if(c<7)return`${c}d`;let d=Math.floor(c/7);if(d<5)return`${d}w`;let o=Math.floor(c/30);return o<12?`${o}mo`:`${Math.floor(c/365)}y`}function ne(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:ye(e.time,t)}}function re({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let a=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),c=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${a}:${c}`)}}function Le({seam:e,sessionId:t}){return(n,r,a=1)=>{let c=typeof n=="string"?n.trim().toLowerCase():"";if(c===""||typeof r!="string")return;let d=r.trim().replace(/\\/gu,"/").replace(/^(?:\.\/)+/u,"");if(d==="")return;let o=Number.isFinite(a)&&a>0?Math.floor(a):1,p=`git:${c}:${String(o)}:${d}`;if(e.openViewOrSwitch!==void 0){e.viewFocus?.request?.("fs-explorer",p);let s=e.openViewOrSwitch("fs-explorer",p);if(s.focused){e.viewFocus?.take?.("fs-explorer");return}if(s.opened)return;e.viewFocus?.take?.("fs-explorer")}e.views?.open(t,"fs-explorer",p)!==!0&&e.openView?.("fs-explorer",p)!==!0&&e.viewFocus?.request?.("fs-explorer",p)}}var Gt=/^commit:([0-9a-f]{4,64})$/iu;function Pe(e){if(e===void 0)return;let t=Gt.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function oe(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),a=Math.max(0,Math.trunc(t.overscan??6)),c=Math.max(1,Math.ceil(r/n)),d=Math.max(0,e.length-c-a*2),o=Math.floor(Math.max(0,t.scrollTop)/n)-a,p=Math.min(Math.max(o,0),d),s=Math.min(e.length,p+c+a*2);return{rows:e.slice(p,s),startIndex:p,endIndex:s}}function Fe(e){let t=[],n=[],r=[],a=0,c=[],d=()=>r.length===0?a++:(r.sort((h,b)=>h-b),r.shift()??a++),o=s=>{s!==null&&!r.includes(s)&&r.push(s)},p=()=>{let s=t.indexOf(null);return s>=0?s:(t.push(null),n.push(null),t.length-1)};for(let s of e){let h=[...t],b=[...n],f=h.indexOf(s.hash),k=f>=0;k||(f=p());let C=k?n[f]??null:null;C===null&&(C=d(),n[f]=C);for(let x=0;x<h.length;x+=1)x!==f&&h[x]===s.hash&&(o(n[x]??null),t[x]=null,n[x]=null);let G=s.parents[0];G===void 0?(o(n[f]??null),t[f]=null,n[f]=null):(t[f]=G,n[f]=C);let S=[];for(let x=1;x<s.parents.length;x+=1){let P=s.parents[x];if(P===void 0)continue;let M=t.indexOf(P);M<0&&(M=p(),t[M]=P),n[M]===null&&(n[M]=d()),S.push(M)}let L=[];for(let x=0;x<h.length;x+=1){let P=h[x];if(P===null)continue;let M=b[x]??C;P===s.hash?L.push({kind:"into",from:x,to:f,color:M}):L.push({kind:"pass",from:x,to:x,color:M})}G!==void 0&&L.push({kind:"out",from:f,to:f,color:n[f]??C});for(let x of S)L.push({kind:"out",from:f,to:x,color:n[x]??C});for(c.push({lane:f,color:C,merge:s.parents.length>=2,segments:L});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return c}function Ie(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,a)=>Math.max(r,a.from,a.to),0));return t+1}function j(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}var De="dsh-git-explorer-styles",Et=`
.gx-root {
  --gx-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --gx-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --gx-row-h: 24px;
  --gx-text: var(--dsw-alias-label-primary, inherit);
  --gx-text-2: var(--dsw-alias-label-secondary, inherit);
  --gx-text-3: var(--dsw-alias-label-tertiary, inherit);
  --gx-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --gx-border: var(--dsw-alias-border-l2, color-mix(in srgb, currentColor 18%, transparent));
  --gx-border-soft: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 10%, transparent));
  --gx-panel: var(--dsw-alias-bg-layer-1, transparent);
  --gx-panel-2: var(--dsw-alias-bg-layer-2, transparent);
  --gx-hover: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent));
  --gx-active: var(--dsw-alias-interactive-bg-active, color-mix(in srgb, currentColor 12%, transparent));
  --gx-accent: var(--dsw-alias-brand-primary, currentColor);
  --gx-added: var(--dsw-alias-state-success-primary, currentColor);
  --gx-deleted: var(--dsw-alias-state-error-primary, currentColor);
  --gx-modified: var(--dsw-alias-state-warn-primary, currentColor);
  --gx-renamed: var(--dsw-alias-state-business-primary, currentColor);
  --gx-untracked: var(--dsw-alias-state-success-primary, currentColor);
  --gx-conflict: var(--dsw-alias-state-error-primary, currentColor);
  --gx-lane-0: var(--dsw-alias-brand-primary, currentColor);
  --gx-lane-1: var(--dsw-alias-state-success-primary, currentColor);
  --gx-lane-2: var(--dsw-alias-state-warn-primary, currentColor);
  --gx-lane-3: var(--dsw-alias-state-business-primary, currentColor);
  --gx-lane-4: color-mix(in oklab, var(--dsw-alias-brand-primary, currentColor) 55%, var(--dsw-alias-state-success-primary, currentColor));
  --gx-lane-5: color-mix(in oklab, var(--dsw-alias-state-warn-primary, currentColor) 60%, var(--dsw-alias-brand-primary, currentColor));
  --gx-lane-6: color-mix(in oklab, var(--dsw-alias-state-error-primary, currentColor) 55%, var(--dsw-alias-state-business-primary, currentColor));
  --gx-lane-7: var(--dsw-alias-label-tertiary, currentColor);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--gx-text);
  background: var(--dsw-alias-bg-base, transparent);
  font-family: var(--gx-font);
  font-size: 12px;
  line-height: 1.45;
  padding-bottom: calc(var(--dsh-composer-height, 140px) + 12px);
}

.gx-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  min-height: 38px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--gx-border-soft);
}
.gx-head-main { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
.gx-head-icon { display: inline-flex; color: var(--gx-accent); flex: none; }
.gx-repo {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 34ch;
}
.gx-branch, .gx-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 18px;
  padding: 0 7px;
  border: 1px solid var(--gx-border);
  border-radius: 999px;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: 10.5px;
  white-space: nowrap;
  flex: none;
}
.gx-branch { color: var(--gx-accent); border-color: color-mix(in srgb, var(--gx-accent) 40%, transparent); }
.gx-head-meta { display: flex; align-items: center; gap: 8px; flex: none; color: var(--gx-caption); font-size: 11px; }
.gx-head-meta b { color: var(--gx-text-2); font-weight: 600; font-variant-numeric: tabular-nums; }
.gx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  min-width: 24px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--gx-text-2);
  font: inherit;
  cursor: pointer;
}
.gx-btn:hover:not(:disabled) { background: var(--gx-hover); color: var(--gx-text); border-color: var(--gx-border-soft); }
.gx-btn:disabled { opacity: .45; cursor: default; }
.gx-btn:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }

.gx-body {
  display: grid;
  /* A user-dragged width arrives as the --gx-left-col inline variable; the
     fallback keeps the shipped fluid track for everyone who never dragged. The
     middle track carries the divider and replaces the old column gap, so the
     gutter between the columns stays 10px. */
  grid-template-columns: var(--gx-left-col, minmax(240px, 31%)) 10px minmax(0, 1fr);
  row-gap: 10px;
  column-gap: 0;
  flex: 1;
  min-height: 0;
  padding: 10px 12px 0;
  box-sizing: border-box;
}
.gx-pane-handle {
  position: relative;
  width: 6px;
  justify-self: center;
  cursor: col-resize;
  touch-action: none;
}
.gx-pane-handle::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-.5px);
  background: var(--gx-accent);
  opacity: 0;
}
.gx-pane-handle:hover::before { opacity: .55; }
/* The handle is 6px wide, so the default focus ring collapses into noise;
   the keyboard focus reuses the hover line instead. */
.gx-pane-handle:focus-visible { outline: none; }
.gx-pane-handle:focus-visible::before { opacity: .55; }
/* Applied to the document body while a drag is live: no text selection under a
   moving pointer and a stable cursor wherever it travels. */
body.gx-pane-resizing { user-select: none; cursor: col-resize; }
.gx-col { display: flex; flex-direction: column; min-width: 0; min-height: 0; gap: 10px; }
.gx-col > .gx-pane { flex: 1; }
.gx-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  background: var(--gx-panel);
  overflow: hidden;
}
.gx-pane-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 30px;
  padding: 0 10px;
  border-bottom: 1px solid var(--gx-border-soft);
  color: var(--gx-text-2);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
}
.gx-pane-head .gx-count { color: var(--gx-caption); font-weight: 400; font-variant-numeric: tabular-nums; }
.gx-pane-head .gx-spacer { flex: 1; }
.gx-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, color-mix(in srgb, currentColor 22%, transparent)) transparent;
}
.gx-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
.gx-scroll::-webkit-scrollbar-thumb { background: var(--dsw-alias-scrollbar-bg-l2, color-mix(in srgb, currentColor 22%, transparent)); border-radius: 999px; border: 3px solid transparent; background-clip: padding-box; }
.gx-scroll::-webkit-scrollbar-thumb:hover { background: var(--dsw-alias-scrollbar-hover-l2, color-mix(in srgb, currentColor 34%, transparent)); background-clip: padding-box; }

.gx-group-head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 10px;
  background: var(--gx-panel-2);
  color: var(--gx-caption);
  font-size: 10.5px;
  border-bottom: 1px solid var(--gx-border-soft);
}
.gx-group-head .gx-group-dir { font-family: var(--gx-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-group-head .gx-count { margin-left: auto; font-variant-numeric: tabular-nums; }

.gx-file {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) auto;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: var(--gx-row-h);
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--gx-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
}
.gx-file:hover { background: var(--gx-hover); }
.gx-file:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-file[data-directory="true"] { cursor: default; color: var(--gx-text-2); }
.gx-file-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.gx-file-name .gx-file-dir { color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10.5px; margin-right: 4px; }
.gx-file[data-renamed="true"] .gx-file-name { color: var(--gx-text-2); }
.gx-file-orig { color: var(--gx-caption); font-size: 10px; margin-left: 4px; text-decoration: line-through; }
.gx-file-stats { display: inline-flex; align-items: center; gap: 5px; font-family: var(--gx-mono); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.gx-add { color: var(--gx-added); }
.gx-del { color: var(--gx-deleted); }
.gx-stat-muted { color: var(--gx-caption); }

.gx-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 4px;
  font-family: var(--gx-mono);
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1;
  background: color-mix(in oklab, currentColor 16%, transparent);
  color: var(--gx-text-2);
}
.gx-badge[data-status="added"] { color: var(--gx-added); }
.gx-badge[data-status="modified"] { color: var(--gx-modified); }
.gx-badge[data-status="deleted"] { color: var(--gx-deleted); }
.gx-badge[data-status="renamed"] { color: var(--gx-renamed); }
.gx-badge[data-status="copied"] { color: var(--gx-renamed); }
.gx-badge[data-status="typechange"] { color: var(--gx-modified); }
.gx-badge[data-status="untracked"] { color: var(--gx-untracked); }
.gx-badge[data-status="conflicted"] { color: var(--gx-conflict); }

.gx-vlist { position: relative; width: 100%; }
.gx-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--gx-row-h);
  padding: 0 10px 0 4px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--gx-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  white-space: nowrap;
}
.gx-row:hover { background: var(--gx-hover); }
.gx-row[data-selected="true"] { background: var(--gx-active); box-shadow: inset 2px 0 0 var(--gx-accent); }
.gx-row:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-graph { flex: none; display: block; overflow: visible; }
.gx-hash { flex: none; color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10.5px; }
.gx-subject { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
.gx-ref {
  position: relative;
  flex: none;
  max-width: 12ch;
  padding: 0 5px;
  border: 1px solid color-mix(in srgb, var(--gx-accent) 35%, transparent);
  border-radius: 999px;
  color: var(--gx-accent);
  font-family: var(--gx-mono);
  font-size: 9.5px;
  line-height: 15px;
}
.gx-ref-name { display: block; overflow: hidden; text-overflow: ellipsis; }
/* The chip lives inside the row button, whose title suppresses a child's native
   tooltip, so the full ref name is a hover label of its own. */
.gx-ref-tip {
  display: none;
  position: absolute;
  z-index: 5;
  top: calc(100% + 4px);
  right: 0;
  max-width: 48ch;
  padding: 2px 6px;
  border: 1px solid var(--gx-border);
  border-radius: 6px;
  background: var(--gx-panel-2);
  color: var(--gx-text);
  font-size: 10.5px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--gx-text) 16%, transparent);
  pointer-events: none;
}
.gx-ref:hover .gx-ref-tip { display: block; }
.gx-ref[data-kind="tag"] { color: var(--gx-modified); border-color: color-mix(in srgb, var(--gx-modified) 35%, transparent); }
.gx-author, .gx-time { flex: none; color: var(--gx-caption); font-size: 10.5px; }
.gx-author { max-width: 12ch; overflow: hidden; text-overflow: ellipsis; }
.gx-time { font-family: var(--gx-mono); font-variant-numeric: tabular-nums; min-width: 3ch; text-align: right; }

.gx-loadbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-top: 1px solid var(--gx-border-soft);
  color: var(--gx-caption);
  font-size: 10.5px;
}
.gx-loadbar .gx-spacer { flex: 1; }
.gx-loadbar .gx-del { max-width: 42ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gx-linkbtn {
  border: 0;
  background: transparent;
  color: var(--gx-accent);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}
.gx-linkbtn:hover:not(:disabled) { background: var(--gx-hover); }
.gx-linkbtn:disabled { opacity: .45; cursor: default; }

.gx-detail { display: flex; flex-direction: column; flex: none; height: 38%; min-height: 180px; border: 1px solid var(--gx-border); border-radius: 10px; background: var(--gx-panel); overflow: hidden; }
.gx-detail-head { display: flex; align-items: center; gap: 8px; flex: none; height: 28px; padding: 0 10px; border-bottom: 1px solid var(--gx-border-soft); color: var(--gx-text-2); font-size: 11px; font-weight: 600; }
.gx-detail-head .gx-hash { color: var(--gx-text-2); }
.gx-detail-body { flex: 1; min-height: 0; overflow: auto; padding: 8px 10px 10px; box-sizing: border-box; }
.gx-detail-subject { font-size: 13px; font-weight: 600; line-height: 1.4; word-break: break-word; }
.gx-detail-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; color: var(--gx-caption); font-size: 10.5px; }
.gx-detail-meta .gx-author { max-width: none; }
.gx-parents { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.gx-parents-label { color: var(--gx-caption); font-size: 10px; }
.gx-parent {
  border: 1px solid var(--gx-border);
  border-radius: 5px;
  background: transparent;
  color: var(--gx-text-2);
  font-family: var(--gx-mono);
  font-size: 10px;
  padding: 1px 5px;
  cursor: pointer;
}
.gx-parent:hover { color: var(--gx-accent); border-color: color-mix(in srgb, var(--gx-accent) 45%, transparent); }
.gx-body-text { margin: 8px 0 0; padding: 6px 8px; border-radius: 6px; background: var(--gx-panel-2); color: var(--gx-text-2); font-family: var(--gx-mono); font-size: 10.5px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.gx-detail-files { margin-top: 10px; }
.gx-detail-files-title { color: var(--gx-caption); font-size: 10px; letter-spacing: .02em; margin-bottom: 2px; }
.gx-detail-group { margin-top: 4px; }
.gx-detail-dir { color: var(--gx-caption); font-family: var(--gx-mono); font-size: 10px; }
.gx-detail-file {
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 20px;
  padding: 0 2px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.gx-detail-file:hover { background: var(--gx-hover); }
.gx-detail-file:focus-visible { outline: 2px solid var(--gx-accent); outline-offset: -2px; }
.gx-detail-file .gx-file-name { font-size: 11px; }

.gx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1;
  min-height: 120px;
  margin: 12px;
  padding: 18px;
  border: 1px dashed var(--gx-border);
  border-radius: 10px;
  color: var(--gx-text-2);
  text-align: center;
}
.gx-empty strong { color: var(--gx-text); font-size: 13px; font-weight: 600; }
.gx-empty span { color: var(--gx-caption); font-size: 11px; max-width: 46ch; }
.gx-empty .gx-btn { margin-top: 4px; border-color: var(--gx-border); }
.gx-empty-inline { min-height: 80px; margin: 8px; padding: 10px; }
.gx-skeleton { padding: 12px; color: var(--gx-caption); font-size: 11px; }

@media (max-width: 720px) {
  .gx-body { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(140px, 34%) minmax(0, 1fr); }
  /* Stacked columns have no horizontal split to resize, so the handle and any
     persisted width (this rule wins the cascade over the variable) both go
     inert. */
  .gx-pane-handle { display: none; }
  .gx-author { display: none; }
}
`;function We(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${De}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=De,n.textContent=Et,e.head.appendChild(n),()=>{n.remove()}}var m=require("react");var ae=require("react");var v=require("react/jsx-runtime");function Lt(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Pt({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,v.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,v.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function He({groups:e,stats:t,t:n,onOpen:r,claimFocus:a,onFocusClaimed:c}){let d=e.reduce((p,s)=>p+s.files.length,0),o=(0,ae.useRef)(null);return(0,ae.useEffect)(()=>{a&&(c(),Lt(o.current))},[a,c]),(0,v.jsxs)("section",{ref:o,className:"gx-pane","data-testid":"git-changes",children:[(0,v.jsxs)("header",{className:"gx-pane-head",children:[(0,v.jsx)("span",{children:n("changes.title")}),(0,v.jsx)("span",{className:"gx-count",children:d})]}),(0,v.jsx)("div",{className:"gx-scroll",children:d===0?(0,v.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,v.jsx)("strong",{children:n("changes.empty")})}):e.map(p=>(0,v.jsxs)("div",{children:[(0,v.jsxs)("div",{className:"gx-group-head",children:[(0,v.jsx)("span",{className:"gx-group-dir",children:p.dir===""?n("changes.root"):p.dir}),(0,v.jsx)("span",{className:"gx-count",children:p.files.length})]}),p.files.map(s=>{let h=t.get(s.path),b=n(`status.${s.status}`);return(0,v.jsxs)("button",{type:"button",className:"gx-file","data-status":s.status,"data-directory":s.isDirectory?"true":"false","data-renamed":s.origPath===void 0?"false":"true","data-testid":"git-change-file",title:s.isDirectory?`${b} \xB7 ${n("changes.directory")}`:`${b} \xB7 ${n("changes.jump")}`,onClick:()=>{s.isDirectory||r(s.path,1)},children:[(0,v.jsx)("span",{className:"gx-badge","data-status":s.status,children:ee(s.status)}),(0,v.jsxs)("span",{className:"gx-file-name",children:[j(s.path),s.origPath===void 0?null:(0,v.jsx)("span",{className:"gx-file-orig",children:j(s.origPath)})]}),(0,v.jsx)("span",{className:"gx-file-stats",children:(0,v.jsx)(Pt,{stat:h})})]},s.path)})]},p.dir===""?".":p.dir))})]})}var z=require("react");function $e(e){let t=n=>(r,a)=>e(n,{args:{request:r}},a);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit"),show:t("show")}}function X(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function B(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var u=require("react/jsx-runtime");function Ft({additions:e,deletions:t}){return e===null&&t===null?(0,u.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,u.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function _e({sessionId:e,hash:t,remote:n,t:r,onSelect:a,onOpenFile:c}){let[d,o]=(0,z.useState)({kind:"idle"}),[p,s]=(0,z.useState)(0),h=(0,z.useRef)(new Map);(0,z.useEffect)(()=>{if(t===void 0){o({kind:"idle"});return}let f=h.current.get(t);if(f!==void 0){o({kind:"ready",detail:f});return}if(n===void 0||e===void 0){o({kind:"failed",message:r("state.noService.description")});return}let k=!0;return o({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(C=>{if(!k)return;let G=X(C);if(!G.ok){o({kind:"failed",message:G.message});return}let S=G.result;S.ok?(h.current.set(t,S.detail),o({kind:"ready",detail:S.detail})):o({kind:"failed",message:S.error.message===""?S.error.code:S.error.message})}).catch(C=>{k&&o({kind:"failed",message:B(C)})}),()=>{k=!1}},[t,n,e,p,r]);let b=ne(d.kind==="ready"?d.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,u.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,u.jsxs)("header",{className:"gx-detail-head",children:[(0,u.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,u.jsx)("span",{className:"gx-hash",children:b.shortHash}),(0,u.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,u.jsx)("div",{className:"gx-detail-body",children:d.kind==="idle"?(0,u.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):d.kind==="loading"?(0,u.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):d.kind==="failed"?(0,u.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,u.jsx)("strong",{children:r("detail.failed")}),(0,u.jsx)("span",{children:d.message}),(0,u.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>s(f=>f+1),children:r("action.retry")})]}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("div",{className:"gx-detail-subject",children:d.detail.subject}),(0,u.jsxs)("div",{className:"gx-detail-meta",children:[(0,u.jsx)("span",{className:"gx-author",children:d.detail.author}),(0,u.jsx)("span",{children:b.relative}),(0,u.jsx)("span",{title:new Date(d.detail.time*1e3).toLocaleString(),children:new Date(d.detail.time*1e3).toLocaleDateString()})]}),(0,u.jsxs)("div",{className:"gx-parents",children:[(0,u.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),d.detail.parents.length===0?(0,u.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):d.detail.parents.map(f=>(0,u.jsx)("button",{type:"button",className:"gx-parent",title:f,onClick:()=>a(f),children:f.slice(0,7)},f))]}),d.detail.body===""?null:(0,u.jsx)("pre",{className:"gx-body-text",children:d.detail.body}),(0,u.jsxs)("div",{className:"gx-detail-files",children:[(0,u.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(d.detail.files.length)}`}),d.detail.files.length===0?(0,u.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):xe(d.detail.files).map(f=>(0,u.jsxs)("div",{className:"gx-detail-group",children:[(0,u.jsx)("div",{className:"gx-detail-dir",children:f.dir===""?r("changes.root"):f.dir}),f.files.map(k=>(0,u.jsxs)("button",{type:"button",className:"gx-detail-file","data-testid":"gx-detail-file",title:k.path,onClick:()=>c?.(k.path),children:[(0,u.jsx)("span",{className:"gx-badge","data-status":k.status,children:ee(k.status)}),(0,u.jsxs)("span",{className:"gx-file-name",children:[j(k.path),k.origPath===void 0?null:(0,u.jsx)("span",{className:"gx-file-orig",children:j(k.origPath)})]}),(0,u.jsx)("span",{className:"gx-file-stats",children:(0,u.jsx)(Ft,{additions:k.additions,deletions:k.deletions})})]},k.path))]},f.dir===""?".":f.dir))]})]})})]})}var I=require("react");var K=require("react/jsx-runtime");function ze(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function Ve({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),a=r/Math.max(1,t),c=p=>p*a+a/2,d=n/2,o=e.segments.map((p,s)=>{let h=c(p.from),b=c(p.to),f=p.kind==="pass"?`M ${String(h)} 0 L ${String(b)} ${String(n)}`:p.kind==="into"?`M ${String(h)} 0 C ${String(h)} ${String(n*.55)}, ${String(b)} ${String(n*.45)}, ${String(b)} ${String(d)}`:`M ${String(h)} ${String(d)} C ${String(h)} ${String(n*.55)}, ${String(b)} ${String(n*.45)}, ${String(b)} ${String(n)}`;return(0,K.jsx)("path",{d:f,fill:"none",stroke:ze(p.color),strokeWidth:1.4,strokeLinecap:"round"},`${p.kind}-${String(p.from)}-${String(p.to)}-${String(s)}`)});return(0,K.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[o,(0,K.jsx)("circle",{cx:c(e.lane),cy:d,r:e.merge?4:3.2,fill:ze(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var y=require("react/jsx-runtime"),ie=24,Oe=100;function It({commit:e,row:t,laneCount:n,top:r,selected:a,head:c,onSelect:d}){return(0,y.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":a?"true":"false","data-head":c?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>d(e.hash),children:[t===void 0?(0,y.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,y.jsx)(Ve,{row:t,laneCount:n,height:ie}),(0,y.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,y.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(o=>(0,y.jsxs)("span",{className:"gx-ref","data-kind":o.kind,children:[(0,y.jsx)("span",{className:"gx-ref-name",children:o.name}),(0,y.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:o.name})]},`${o.kind}:${o.name}`)),(0,y.jsx)("span",{className:"gx-author",children:e.author}),(0,y.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:ye(e.time)})]})}function Ae(e){let{commits:t,graph:n,selectedHash:r,headHash:a,total:c,hasMore:d,loadingMore:o,loadError:p,t:s,onSelect:h,onLoadMore:b}=e,f=(0,I.useRef)(null),[k,C]=(0,I.useState)(0),[G,S]=(0,I.useState)(0),L=(0,I.useRef)(!1);(0,I.useEffect)(()=>{let R=f.current;if(R===null)return;let N=()=>S(R.clientHeight);if(N(),typeof ResizeObserver>"u")return;let W=new ResizeObserver(N);return W.observe(R),()=>W.disconnect()},[]),(0,I.useEffect)(()=>{o||(L.current=!1)},[o]);let x=(0,I.useCallback)(()=>{!d||o||L.current||(L.current=!0,b())},[d,o,b]),P=R=>{let N=R.currentTarget;C(N.scrollTop),N.scrollTop+N.clientHeight>=N.scrollHeight-160&&x()},M=oe(t,{scrollTop:k,height:G===0?480:G,rowHeight:ie}),$=Math.max(1,Ie(n));return(0,y.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,y.jsxs)("header",{className:"gx-pane-head",children:[(0,y.jsx)("span",{children:s("history.title")}),(0,y.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(c)}`})]}),t.length===0?(0,y.jsxs)("div",{className:"gx-empty",children:[(0,y.jsx)("strong",{children:e.emptyTitle??s("history.empty")}),e.emptyDescription===void 0?null:(0,y.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,y.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??s("action.retry")})]}):(0,y.jsx)("div",{className:"gx-scroll",ref:f,onScroll:P,"data-testid":"git-history-scroll",children:(0,y.jsx)("div",{className:"gx-vlist",style:{height:t.length*ie},children:M.rows.map((R,N)=>{let W=M.startIndex+N;return(0,y.jsx)(It,{commit:R,row:n[W],laneCount:$,top:W*ie,selected:R.hash===r,head:R.hash===a,onSelect:h},R.hash)})})}),(0,y.jsxs)("footer",{className:"gx-loadbar",children:[(0,y.jsx)("span",{children:`${s("history.loaded")} ${String(t.length)}`}),p===void 0?null:(0,y.jsx)("span",{className:"gx-del",children:p}),(0,y.jsx)("span",{className:"gx-spacer"}),d?(0,y.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:o,onClick:x,children:s(o?"history.loading":"history.loadMore")}):(0,y.jsx)("span",{children:t.length===0?"":s("history.noMore")})]})]})}var be="git-explorer.leftColumnWidth";function ve(e){return Math.min(560,Math.max(240,e))}function je(e){if(e==null)return null;let t;try{t=e.getItem(be)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function se(e,t){let n=Math.round(ve(t));if(e!=null)try{e.setItem(be,String(n))}catch{}return n}function Ue(e){if(e!=null)try{e.removeItem(be)}catch{}}function Je(e,t){return Math.round(e)===Math.round(t)}var qe=16;function Xe(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-qe};case"ArrowRight":return{kind:"nudge",delta:qe};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var g=require("react/jsx-runtime");function Dt(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Ke(e,t){let n=Pe(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}var Wt={display:"flex",alignItems:"center",gap:8};function Ht(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var $t=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function le({title:e,description:t,actionLabel:n,onAction:r}){return(0,g.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,g.jsx)("strong",{children:e}),t===void 0?null:(0,g.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,g.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function _t(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function Ye(e){let{workbench:t,version:n,t:r,remote:a}=e;function c(d){let o=d.sessionId??t.currentSessionId(),p=(0,m.useRef)(o);p.current=o;let s=(0,m.useMemo)(()=>a(),[a]),[h,b]=(0,m.useState)(()=>({kind:Dt(o,s!==void 0)})),[f,k]=(0,m.useState)(0),[C,G]=(0,m.useState)([]),[S,L]=(0,m.useState)(!1),[x,P]=(0,m.useState)(!1),[M,$]=(0,m.useState)(void 0),[R,N]=(0,m.useState)(void 0),W=(0,m.useRef)(void 0),ke=(0,m.useRef)(void 0),[at,Ce]=(0,m.useState)(!0),H=(0,m.useMemo)(()=>Ht(),[]),[_,V]=(0,m.useState)(()=>je(H)),ce=(0,m.useRef)(null),O=(0,m.useRef)(null),Y=(0,m.useCallback)(i=>{W.current=i,N(i),Ce(!1)},[]),it=(0,m.useCallback)(()=>{Ce(!1)},[]),st=(0,m.useCallback)(i=>{if(i.button!==0||O.current!==null||$t())return;let l=ce.current?.previousElementSibling;if(l instanceof HTMLElement){try{i.currentTarget.setPointerCapture(i.pointerId)}catch{return}O.current={pointerId:i.pointerId,startX:i.clientX,baseWidth:l.getBoundingClientRect().width,restWidth:_},document.body.classList.add("gx-pane-resizing")}},[_]),lt=(0,m.useCallback)(i=>{let l=O.current;l===null||l.pointerId!==i.pointerId||V(ve(l.baseWidth+i.clientX-l.startX))},[]),pe=(0,m.useCallback)(i=>{let l=O.current;if(l===null||l.pointerId!==i.pointerId)return;O.current=null,document.body.classList.remove("gx-pane-resizing");try{i.currentTarget.releasePointerCapture(i.pointerId)}catch{}let w=l.baseWidth+i.clientX-l.startX;if(Je(w,l.baseWidth)){V(l.restWidth);return}V(se(H,w))},[H]),ue=(0,m.useCallback)(()=>{Ue(H),V(null)},[H]),dt=(0,m.useCallback)(i=>{if(i.nativeEvent.isComposing)return;let l=Xe(i.key,i.altKey||i.ctrlKey||i.metaKey||i.shiftKey);if(l===null)return;if(i.preventDefault(),i.stopPropagation(),l.kind==="reset"){ue();return}if(l.kind==="min"||l.kind==="max"){let F=l.kind==="min"?240:560;V(se(H,F));return}let w=ce.current?.previousElementSibling,E=w instanceof HTMLElement?w.getBoundingClientRect().width:_??240;V(se(H,E+l.delta))},[H,ue,_]);(0,m.useEffect)(()=>()=>{O.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,m.useEffect)(()=>{if(o===void 0||d.openView===void 0)return;let i=t.views;if(i?.bind!==void 0)return i.bind(o,d.openView)},[o,d.openView,t]),(0,m.useEffect)(()=>{if(o===void 0){b({kind:"idle"});return}if(s===void 0){b({kind:"no-service"});return}let i=!0;return b({kind:"loading"}),$(void 0),Promise.resolve().then(()=>s.snapshot({sessionId:o})).then(l=>{if(!i)return;let w=X(l);if(!w.ok){b({kind:"failed",message:w.message});return}let E=w.result;if(!E.ok){b({kind:"failed",message:E.error.message===""?E.error.code:E.error.message});return}let F=E.snapshot;b({kind:"ready",snapshot:F}),G(F.commits),L(F.commits.length<F.counts.commits);let A=W.current;W.current=void 0,N(U=>A!==void 0?A:U!==void 0&&F.commits.some(Q=>Q.hash===U)?U:F.commits[0]?.hash)}).catch(l=>{i&&b({kind:"failed",message:B(l)})}),()=>{i=!1}},[o,s,f]),(0,m.useEffect)(()=>{let i=d.viewRequest;if(i==null||i.view!==J)return;let l=`${i.view}:${i.focus}`;ke.current!==l&&(ke.current=l,Ke(i.focus,{select:Y,complete:()=>d.completeViewRequest?.()}))},[d.viewRequest,d.completeViewRequest,Y]),(0,m.useEffect)(()=>{let i=t.viewFocus;if(i===void 0||o===void 0)return;let l=()=>{let w=i.take(J);w!==void 0&&Ke(w,{select:Y})};return l(),i.subscribe(l)},[t,o,Y]);let ct=(0,m.useMemo)(()=>Fe(C),[C]),T=h.kind==="ready"?h.snapshot:void 0,Se=(0,m.useMemo)(()=>T===void 0?[]:te(T.status),[T]),pt=(0,m.useMemo)(()=>{let i=new Map;for(let l of T?.stats??[])i.set(l.path,{additions:l.additions,deletions:l.deletions});return i},[T]),Re=(0,m.useMemo)(()=>{let i=new Map;for(let l of T?.branches??[]){let w=i.get(l.hash);w===void 0?i.set(l.hash,[{kind:l.kind,name:l.name,head:l.head}]):w.push({kind:l.kind,name:l.name,head:l.head})}return i},[T]),ut=(0,m.useCallback)(()=>{if(o===void 0||s===void 0||!S||x)return;let i=o;P(!0),$(void 0),Promise.resolve().then(()=>s.query({sessionId:o,skip:C.length,limit:Oe})).then(l=>{if(p.current!==i)return;let w=X(l);if(!w.ok){$(w.message);return}let E=w.result;if(!E.ok){$(E.error.message===""?E.error.code:E.error.message);return}let F=E.page;G(A=>{let U=new Set(A.map(q=>q.hash)),Q=F.commits.filter(q=>!U.has(q.hash)).map(q=>({...q,refs:Re.get(q.hash)??[]}));return Q.length===0?A:[...A,...Q]}),L(F.hasMore)}).catch(l=>$(B(l))).finally(()=>P(!1))},[o,s,S,x,C.length,Re]),gt=(0,m.useMemo)(()=>{let i=t.views??{open:(l,w)=>t.openView?.(l,w)??!1};return re({views:i,sessionId:o??""})},[t,o]),mt=(i,l=1)=>{o!==void 0&&gt(i,l)},ft=(0,m.useMemo)(()=>{let i={...t.views===void 0?{}:{views:t.views},...t.openView===void 0?{}:{openView:t.openView},...t.viewFocus===void 0?{}:{viewFocus:t.viewFocus},...t.openViewOrSwitch===void 0?{}:{openViewOrSwitch:(l,w)=>t.openViewOrSwitch?.(l,w)??{opened:!1,focused:!1}}};return Le({seam:i,sessionId:o??""})},[t,o]),ht=(i,l=1)=>{o!==void 0&&R!==void 0&&ft(R,i,l)},xt=()=>k(i=>i+1),ge=()=>k(i=>i+1),D=T?.head,yt=Se.reduce((i,l)=>i+l.files.length,0);return(0,g.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":h.kind,"data-session":o??"","data-testid":"git-explorer-view",children:[(0,g.jsxs)("header",{className:"gx-head",children:[(0,g.jsxs)("div",{className:"gx-head-main",children:[(0,g.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,g.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,g.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,g.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,g.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,g.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,g.jsx)("span",{className:"gx-repo",title:T?.root??r("view.title"),children:T===void 0?r("view.title"):_t(T.root)}),D?.branch===null||D?.branch===void 0?null:(0,g.jsx)("span",{className:"gx-branch",children:D.branch}),D?.detached===!0?(0,g.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,D?.ahead!==void 0&&D.ahead>0?(0,g.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(D.ahead)}`}):null,D?.behind!==void 0&&D.behind>0?(0,g.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(D.behind)}`}):null]}),(0,g.jsxs)("div",{className:"gx-head-meta",style:Wt,children:[T===void 0?null:(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)("span",{children:[r("head.changes")," ",(0,g.jsx)("b",{children:yt})]}),(0,g.jsxs)("span",{children:[r("head.commits")," ",(0,g.jsx)("b",{children:T.counts.commits})]}),(0,g.jsxs)("span",{children:[r("head.branches")," ",(0,g.jsx)("b",{children:T.counts.branches})]})]}),(0,g.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:h.kind==="loading",onClick:xt,children:"\u21BB"})]})]}),o===void 0?(0,g.jsx)(le,{title:r("state.noSession.title"),description:r("state.noSession.description")}):h.kind==="no-service"?(0,g.jsx)(le,{title:r("state.noService.title"),description:r("state.noService.description")}):h.kind==="loading"?(0,g.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):h.kind==="failed"?(0,g.jsx)(le,{title:r("state.failed.title"),description:h.message,actionLabel:r("action.retry"),onAction:ge}):h.kind==="ready"&&!h.snapshot.isRepository?(0,g.jsx)(le,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:ge}):h.kind==="ready"?(0,g.jsxs)("div",{className:"gx-body",style:_===null?void 0:{"--gx-left-col":`${_}px`},children:[(0,g.jsx)(He,{groups:Se,stats:pt,t:r,onOpen:mt,claimFocus:at,onFocusClaimed:it}),(0,g.jsx)("div",{ref:ce,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":_??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:st,onPointerMove:lt,onPointerUp:pe,onPointerCancel:pe,onLostPointerCapture:pe,onKeyDown:dt,onDoubleClick:ue}),(0,g.jsxs)("div",{className:"gx-col",children:[(0,g.jsx)(Ae,{commits:C,graph:ct,selectedHash:R,headHash:h.snapshot.head?.hash??null,total:h.snapshot.counts.commits,hasMore:S,loadingMore:x,loadError:M,t:r,onSelect:N,onLoadMore:ut,...h.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:ge,retryLabel:r("action.retry")}:{}}),(0,g.jsx)(_e,{sessionId:o,hash:R,remote:s,t:r,onSelect:N,onOpenFile:ht})]})]}):null]})}return c}var Ze=["slots","locale","workbench","remote"];function Qe(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function et(e){return()=>{try{let n=e.remote?.gitExplorer;if(Qe(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Qe(n))return n}catch{}let t=tt(e);return t===void 0?void 0:$e(t)}}function tt(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,a,c)=>n.call("/api",`${Te}/${r}`,a,c)}var de;function nt(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.bind(Z);de?.();let r=e.locale.register(Z,{zh:Me,en:Ne});de=r;let a=We(typeof document>"u"?void 0:document),c=Ye({workbench:t,version:t.version,t:n,remote:et(e)});return e.slots.inject(fe,()=>e.slots.register({name:fe,id:J,order:110,label:()=>n("tab.label"),locale:Z},c)),()=>{a(),r(),de===r&&(de=void 0)}}var rt={groupChanges:te,formatCommitDetail:ne,createJump:re,computeWindow:oe},ot={name:"dsh-git-explorer",inject:Ze,apply:nt,__test:rt},Vt=ot;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
