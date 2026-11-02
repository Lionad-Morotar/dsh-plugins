window.__ModuleLoader__.load({
  id: "dsh-git-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var me=Object.defineProperty;var ht=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var yt=Object.prototype.hasOwnProperty;var bt=(e,t)=>{for(var n in t)me(e,n,{get:t[n],enumerable:!0})},vt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of ft(t))!yt.call(e,o)&&o!==n&&me(e,o,{get:()=>t[o],enumerable:!(r=ht(t,o))||r.enumerable});return e};var wt=e=>vt(me({},"__esModule",{value:!0}),e);var _t={};bt(_t,{__test:()=>nt,apply:()=>tt,clientPlugin:()=>rt,createRemoteResolver:()=>Ze,createRpcCall:()=>et,default:()=>$t,inject:()=>Qe});module.exports=wt(_t);var Me={"tab.label":"Git","view.title":"Git","head.refresh":"\u5237\u65B0","head.changes":"\u53D8\u66F4","head.commits":"\u63D0\u4EA4","head.branches":"\u5206\u652F","head.detached":"\u6E38\u79BB HEAD","head.ahead":"\u9886\u5148","head.behind":"\u843D\u540E","state.noSession.title":"\u8BF7\u5148\u9009\u62E9\u4F1A\u8BDD","state.noSession.description":"\u9009\u62E9\u4F1A\u8BDD\u540E\uFF0CGit \u9762\u677F\u4F1A\u5728\u8FD9\u91CC\u5C55\u5F00\u3002","state.noService.title":"Git \u670D\u52A1\u4E0D\u53EF\u7528","state.noService.description":"\u5BBF\u4E3B\u6CA1\u6709\u6302\u8F7D gitExplorer \u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4 dsh-git-explorer \u7684 host \u534A\u5DF2\u52A0\u8F7D\u3002","state.loading":"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u2026","state.failed.title":"\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25","state.notRepository.title":"\u5F53\u524D\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93","state.notRepository.description":"\u5728\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55\u521D\u59CB\u5316\u4ED3\u5E93\u540E\uFF0C\u70B9\u51FB\u91CD\u8BD5\u3002","state.emptyRepository.title":"\u7A7A\u4ED3\u5E93","state.emptyRepository.description":"\u4ED3\u5E93\u91CC\u8FD8\u6CA1\u6709\u63D0\u4EA4\uFF0C\u6682\u5B58\u6587\u4EF6\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002","action.retry":"\u91CD\u8BD5","pane.resize":"\u62D6\u62FD\u6216\u65B9\u5411\u952E\u8C03\u6574\u5DE6\u680F\u5BBD\u5EA6","pane.resizeHint":"\u62D6\u62FD\u6216 \u2190/\u2192 \u8C03\u6574\u5BBD\u5EA6\uFF0C\u53CC\u51FB\u6216 Delete \u6062\u590D\u9ED8\u8BA4","changes.title":"\u53D8\u66F4","changes.empty":"\u5DE5\u4F5C\u533A\u5E72\u51C0","changes.root":"\u6839\u76EE\u5F55","changes.jump":"\u5728\u6587\u4EF6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00","changes.directory":"\u76EE\u5F55","changes.staged":"\u5DF2\u6682\u5B58","status.added":"\u65B0\u589E","status.modified":"\u4FEE\u6539","status.deleted":"\u5220\u9664","status.renamed":"\u91CD\u547D\u540D","status.copied":"\u590D\u5236","status.typechange":"\u7C7B\u578B\u53D8\u66F4","status.untracked":"\u672A\u8DDF\u8E2A","status.conflicted":"\u51B2\u7A81","history.title":"\u5386\u53F2","history.empty":"\u8FD8\u6CA1\u6709\u63D0\u4EA4","history.loading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u2026","history.loadMore":"\u52A0\u8F7D\u66F4\u591A","history.noMore":"\u5DF2\u5230\u672B\u5C3E","history.loaded":"\u5DF2\u52A0\u8F7D","history.total":"\u5171","history.detailLoading":"\u6B63\u5728\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u2026","detail.title":"\u63D0\u4EA4\u8BE6\u60C5","detail.parents":"\u7236\u63D0\u4EA4","detail.noParents":"\u6839\u63D0\u4EA4","detail.files":"\u53D8\u66F4\u6587\u4EF6","detail.noFiles":"\u6CA1\u6709\u6587\u4EF6\u53D8\u66F4","detail.body":"\u63D0\u4EA4\u8BF4\u660E","detail.failed":"\u8BFB\u53D6\u63D0\u4EA4\u8BE6\u60C5\u5931\u8D25","detail.empty":"\u9009\u62E9\u4E00\u4E2A\u63D0\u4EA4\u67E5\u770B\u8BE6\u60C5"},Ne={"tab.label":"Git","view.title":"Git","head.refresh":"Refresh","head.changes":"Changes","head.commits":"Commits","head.branches":"Branches","head.detached":"detached HEAD","head.ahead":"ahead","head.behind":"behind","state.noSession.title":"Select a conversation first","state.noSession.description":"The Git panel opens here once a conversation is selected.","state.noService.title":"Git service unavailable","state.noService.description":"The host did not mount the gitExplorer service. Check that the dsh-git-explorer host half is loaded.","state.loading":"Reading repository\u2026","state.failed.title":"Could not read the repository","state.notRepository.title":"This directory is not a Git repository","state.notRepository.description":"Initialize a repository in the session working directory, then retry.","state.emptyRepository.title":"Empty repository","state.emptyRepository.description":"There are no commits yet. Staged files will show up here.","action.retry":"Retry","pane.resize":"Drag or use arrow keys to resize the left column","pane.resizeHint":"Drag or \u2190/\u2192 to resize; double-click or Delete to reset","changes.title":"Changes","changes.empty":"Working tree clean","changes.root":"root","changes.jump":"Open in file explorer","changes.directory":"Directory","changes.staged":"Staged","status.added":"Added","status.modified":"Modified","status.deleted":"Deleted","status.renamed":"Renamed","status.copied":"Copied","status.typechange":"Type changed","status.untracked":"Untracked","status.conflicted":"Conflicted","history.title":"History","history.empty":"No commits yet","history.loading":"Loading commits\u2026","history.loadMore":"Load more","history.noMore":"End of history","history.loaded":"Loaded","history.total":"of","history.detailLoading":"Loading commit\u2026","detail.title":"Commit","detail.parents":"Parents","detail.noParents":"Root commit","detail.files":"Changed files","detail.noFiles":"No file changes","detail.body":"Message","detail.failed":"Could not load the commit","detail.empty":"Select a commit to see its detail"};var xe="conversation.view",X="git-explorer";var Z="git-explorer",Te="gitExplorer";var kt={added:"A",modified:"M",deleted:"D",renamed:"R",copied:"C",typechange:"T",untracked:"U",conflicted:"!"};function ee(e){return kt[e]}var Ee={modified:1,typechange:2,deleted:3,added:4,copied:5,renamed:6,untracked:7,conflicted:8};function Ct(e,t){return(Ee[e]??0)>=(Ee[t]??0)?e:t}function Le(e){if(e==="??")return"untracked";let t=e[0]??".",n=e[1]??".";return t==="U"||n==="U"?"conflicted":t==="R"||n==="R"?"renamed":t==="C"||n==="C"?"copied":t==="A"||n==="A"?"added":t==="D"||n==="D"?"deleted":t==="T"||n==="T"?"typechange":"modified"}function he(e,t){let n=0;for(let r=0;r<t;r+=1){let o=e.indexOf(" ",n);if(o<0)return"";n=o+1}return e.slice(n)}function St(e){let t=e.split("\0"),n=new Map,r=o=>{let a=n.get(o.path);if(a===void 0){n.set(o.path,o);return}n.set(o.path,{...a,status:Ct(a.status,o.status),staged:a.staged||o.staged,isDirectory:a.isDirectory||o.isDirectory,...a.origPath===void 0&&o.origPath===void 0?{}:{origPath:a.origPath??o.origPath}})};for(let o=0;o<t.length;o+=1){let a=t[o];if(a===void 0||a===""||a.startsWith("#"))continue;let p=a[0];if(p==="1"){let s=a.slice(2),c=s.slice(0,2),i=he(s,7);i!==""&&r({path:i,status:Le(c),staged:c[0]!==".",isDirectory:!1})}else if(p==="2"){let s=a.slice(2),c=s.slice(0,2),i=he(s,8),h=t[o+1]??"";i!==""&&h!==""&&(o+=1,r({path:i,status:Le(c),staged:c[0]!==".",isDirectory:!1,origPath:h}))}else if(p==="u"){let s=a.slice(2),c=he(s,9);c!==""&&r({path:c,status:"conflicted",staged:!1,isDirectory:!1})}else if(p==="?"){let s=a.slice(2);if(s==="")continue;let c=s.endsWith("/");r({path:c?s.slice(0,-1):s,status:"untracked",staged:!1,isDirectory:c})}}return[...n.values()]}function Rt(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function fe(e){let t=new Map;for(let n of e){let r=Rt(n.path),o=t.get(r);o===void 0?t.set(r,[n]):o.push(n)}return[...t.entries()].sort(([n],[r])=>n===""?-1:r===""?1:n.localeCompare(r)).map(([n,r])=>({dir:n,files:[...r].sort((o,a)=>o.path.localeCompare(a.path))}))}function te(e){return fe(St(e))}function ye(e,t=Date.now()){let n=Math.max(0,Math.floor(t/1e3)-Math.trunc(e));if(n<60)return"now";let r=Math.floor(n/60);if(r<60)return`${r}m`;let o=Math.floor(r/60);if(o<24)return`${o}h`;let a=Math.floor(o/24);if(a<7)return`${a}d`;let p=Math.floor(a/7);if(p<5)return`${p}w`;let s=Math.floor(a/30);return s<12?`${s}mo`:`${Math.floor(a/365)}y`}function ne(e,t=Date.now()){return{shortHash:e.hash.slice(0,7),author:e.author,subject:e.subject,relative:ye(e.time,t)}}function re({views:e,sessionId:t}){return(n,r=1)=>{if(n==="")return;let o=n.replace(/^\.\//u,"").replace(/\\/gu,"/"),a=Number.isFinite(r)&&r>0?Math.floor(r):1;e.open(t,"fs-explorer",`path:${o}:${a}`)}}var Mt=/^commit:([0-9a-f]{4,64})$/iu;function Ge(e){if(e===void 0)return;let t=Mt.exec(e);return t===null?void 0:{hash:(t[1]??"").toLowerCase()}}function oe(e,t){let n=Math.max(1,t.rowHeight||1),r=Math.max(0,t.height||0),o=Math.max(0,Math.trunc(t.overscan??6)),a=Math.max(1,Math.ceil(r/n)),p=Math.max(0,e.length-a-o*2),s=Math.floor(Math.max(0,t.scrollTop)/n)-o,c=Math.min(Math.max(s,0),p),i=Math.min(e.length,c+a+o*2);return{rows:e.slice(c,i),startIndex:c,endIndex:i}}function Pe(e){let t=[],n=[],r=[],o=0,a=[],p=()=>r.length===0?o++:(r.sort((h,m)=>h-m),r.shift()??o++),s=i=>{i!==null&&!r.includes(i)&&r.push(i)},c=()=>{let i=t.indexOf(null);return i>=0?i:(t.push(null),n.push(null),t.length-1)};for(let i of e){let h=[...t],m=[...n],f=h.indexOf(i.hash),L=f>=0;L||(f=c());let k=L?n[f]??null:null;k===null&&(k=p(),n[f]=k);for(let y=0;y<h.length;y+=1)y!==f&&h[y]===i.hash&&(s(n[y]??null),t[y]=null,n[y]=null);let C=i.parents[0];C===void 0?(s(n[f]??null),t[f]=null,n[f]=null):(t[f]=C,n[f]=k);let W=[];for(let y=1;y<i.parents.length;y+=1){let G=i.parents[y];if(G===void 0)continue;let S=t.indexOf(G);S<0&&(S=c(),t[S]=G),n[S]===null&&(n[S]=p()),W.push(S)}let E=[];for(let y=0;y<h.length;y+=1){let G=h[y];if(G===null)continue;let S=m[y]??k;G===i.hash?E.push({kind:"into",from:y,to:f,color:S}):E.push({kind:"pass",from:y,to:y,color:S})}C!==void 0&&E.push({kind:"out",from:f,to:f,color:n[f]??k});for(let y of W)E.push({kind:"out",from:f,to:y,color:n[y]??k});for(a.push({lane:f,color:k,merge:i.parents.length>=2,segments:E});t.length>0&&t[t.length-1]===null;)t.pop(),n.pop()}return a}function De(e){let t=0;for(let n of e)t=Math.max(t,n.lane,n.segments.reduce((r,o)=>Math.max(r,o.from,o.to),0));return t+1}function j(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}var Ie="dsh-git-explorer-styles",Nt=`
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
.gx-detail-file { display: grid; grid-template-columns: 15px minmax(0, 1fr) auto; align-items: center; gap: 6px; height: 20px; padding: 0 2px; }
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
`;function Fe(e){if(e===void 0)return()=>{};if(e.querySelector(`style[data-dsh-style="${Ie}"]`)!==null)return()=>{};let n=e.createElement("style");return n.dataset.dshStyle=Ie,n.textContent=Nt,e.head.appendChild(n),()=>{n.remove()}}var x=require("react");var ae=require("react");var v=require("react/jsx-runtime");function Tt(e){if(e===null)return;let t=e.ownerDocument;if(e.contains(t.activeElement))return;let n=e.querySelector('button.gx-file[data-directory="false"]');n!==null&&(n.focus({preventScroll:!0}),n.scrollIntoView?.({block:"nearest"}))}function Et({stat:e}){return e===void 0?null:e.additions===null&&e.deletions===null?(0,v.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)("span",{className:"gx-add",children:`+${String(e.additions??0)}`}),(0,v.jsx)("span",{className:"gx-del",children:`-${String(e.deletions??0)}`})]})}function We({groups:e,stats:t,t:n,onOpen:r,claimFocus:o,onFocusClaimed:a}){let p=e.reduce((c,i)=>c+i.files.length,0),s=(0,ae.useRef)(null);return(0,ae.useEffect)(()=>{o&&(a(),Tt(s.current))},[o,a]),(0,v.jsxs)("section",{ref:s,className:"gx-pane","data-testid":"git-changes",children:[(0,v.jsxs)("header",{className:"gx-pane-head",children:[(0,v.jsx)("span",{children:n("changes.title")}),(0,v.jsx)("span",{className:"gx-count",children:p})]}),(0,v.jsx)("div",{className:"gx-scroll",children:p===0?(0,v.jsx)("div",{className:"gx-empty gx-empty-inline",children:(0,v.jsx)("strong",{children:n("changes.empty")})}):e.map(c=>(0,v.jsxs)("div",{children:[(0,v.jsxs)("div",{className:"gx-group-head",children:[(0,v.jsx)("span",{className:"gx-group-dir",children:c.dir===""?n("changes.root"):c.dir}),(0,v.jsx)("span",{className:"gx-count",children:c.files.length})]}),c.files.map(i=>{let h=t.get(i.path),m=n(`status.${i.status}`);return(0,v.jsxs)("button",{type:"button",className:"gx-file","data-status":i.status,"data-directory":i.isDirectory?"true":"false","data-renamed":i.origPath===void 0?"false":"true","data-testid":"git-change-file",title:i.isDirectory?`${m} \xB7 ${n("changes.directory")}`:`${m} \xB7 ${n("changes.jump")}`,onClick:()=>{i.isDirectory||r(i.path,1)},children:[(0,v.jsx)("span",{className:"gx-badge","data-status":i.status,children:ee(i.status)}),(0,v.jsxs)("span",{className:"gx-file-name",children:[j(i.path),i.origPath===void 0?null:(0,v.jsx)("span",{className:"gx-file-orig",children:j(i.origPath)})]}),(0,v.jsx)("span",{className:"gx-file-stats",children:(0,v.jsx)(Et,{stat:h})})]},i.path)})]},c.dir===""?".":c.dir))})]})}var z=require("react");function He(e){let t=n=>(r,o)=>e(n,{args:{request:r}},o);return{snapshot:t("snapshot"),query:t("query"),commit:t("commit")}}function B(e){if(e===null||typeof e!="object")return{ok:!1,message:"malformed remote response"};let t=e;if(t.ok!==!0){let r=t.error;return{ok:!1,message:typeof r?.message=="string"&&r.message!==""?r.message:typeof r?.code=="string"?r.code:"request failed"}}let n=t.value;return n!==null&&typeof n=="object"&&typeof n.ok=="boolean"?{ok:!0,result:n}:{ok:!0,result:t}}function K(e){if(e instanceof Error)return e.message;if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){let t=e;if(typeof t.message=="string"&&t.message!=="")return t.message;if(typeof t.code=="string")return t.code}return"unknown error"}var u=require("react/jsx-runtime");function Lt({additions:e,deletions:t}){return e===null&&t===null?(0,u.jsx)("span",{className:"gx-stat-muted",children:"bin"}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("span",{className:"gx-add",children:`+${String(e??0)}`}),(0,u.jsx)("span",{className:"gx-del",children:`-${String(t??0)}`})]})}function $e({sessionId:e,hash:t,remote:n,t:r,onSelect:o}){let[a,p]=(0,z.useState)({kind:"idle"}),[s,c]=(0,z.useState)(0),i=(0,z.useRef)(new Map);(0,z.useEffect)(()=>{if(t===void 0){p({kind:"idle"});return}let m=i.current.get(t);if(m!==void 0){p({kind:"ready",detail:m});return}if(n===void 0||e===void 0){p({kind:"failed",message:r("state.noService.description")});return}let f=!0;return p({kind:"loading"}),Promise.resolve().then(()=>n.commit({sessionId:e,hash:t})).then(L=>{if(!f)return;let k=B(L);if(!k.ok){p({kind:"failed",message:k.message});return}let C=k.result;C.ok?(i.current.set(t,C.detail),p({kind:"ready",detail:C.detail})):p({kind:"failed",message:C.error.message===""?C.error.code:C.error.message})}).catch(L=>{f&&p({kind:"failed",message:K(L)})}),()=>{f=!1}},[t,n,e,s,r]);let h=ne(a.kind==="ready"?a.detail:{hash:t??"",parents:[],author:"",time:Math.floor(Date.now()/1e3),subject:""});return(0,u.jsxs)("section",{className:"gx-detail","data-testid":"git-detail",children:[(0,u.jsxs)("header",{className:"gx-detail-head",children:[(0,u.jsx)("span",{children:r("detail.title")}),t===void 0?null:(0,u.jsx)("span",{className:"gx-hash",children:h.shortHash}),(0,u.jsx)("span",{className:"gx-spacer",style:{flex:1}})]}),(0,u.jsx)("div",{className:"gx-detail-body",children:a.kind==="idle"?(0,u.jsx)("div",{className:"gx-skeleton",children:r("detail.empty")}):a.kind==="loading"?(0,u.jsx)("div",{className:"gx-skeleton",children:r("history.detailLoading")}):a.kind==="failed"?(0,u.jsxs)("div",{className:"gx-empty gx-empty-inline",children:[(0,u.jsx)("strong",{children:r("detail.failed")}),(0,u.jsx)("span",{children:a.message}),(0,u.jsx)("button",{type:"button",className:"gx-btn",onClick:()=>c(m=>m+1),children:r("action.retry")})]}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("div",{className:"gx-detail-subject",children:a.detail.subject}),(0,u.jsxs)("div",{className:"gx-detail-meta",children:[(0,u.jsx)("span",{className:"gx-author",children:a.detail.author}),(0,u.jsx)("span",{children:h.relative}),(0,u.jsx)("span",{title:new Date(a.detail.time*1e3).toLocaleString(),children:new Date(a.detail.time*1e3).toLocaleDateString()})]}),(0,u.jsxs)("div",{className:"gx-parents",children:[(0,u.jsx)("span",{className:"gx-parents-label",children:r("detail.parents")}),a.detail.parents.length===0?(0,u.jsx)("span",{className:"gx-parents-label",children:r("detail.noParents")}):a.detail.parents.map(m=>(0,u.jsx)("button",{type:"button",className:"gx-parent",title:m,onClick:()=>o(m),children:m.slice(0,7)},m))]}),a.detail.body===""?null:(0,u.jsx)("pre",{className:"gx-body-text",children:a.detail.body}),(0,u.jsxs)("div",{className:"gx-detail-files",children:[(0,u.jsx)("div",{className:"gx-detail-files-title",children:`${r("detail.files")} \xB7 ${String(a.detail.files.length)}`}),a.detail.files.length===0?(0,u.jsx)("div",{className:"gx-skeleton",children:r("detail.noFiles")}):fe(a.detail.files).map(m=>(0,u.jsxs)("div",{className:"gx-detail-group",children:[(0,u.jsx)("div",{className:"gx-detail-dir",children:m.dir===""?r("changes.root"):m.dir}),m.files.map(f=>(0,u.jsxs)("div",{className:"gx-detail-file",children:[(0,u.jsx)("span",{className:"gx-badge","data-status":f.status,children:ee(f.status)}),(0,u.jsxs)("span",{className:"gx-file-name",children:[j(f.path),f.origPath===void 0?null:(0,u.jsx)("span",{className:"gx-file-orig",children:j(f.origPath)})]}),(0,u.jsx)("span",{className:"gx-file-stats",children:(0,u.jsx)(Lt,{additions:f.additions,deletions:f.deletions})})]},f.path))]},m.dir===""?".":m.dir))]})]})})]})}var D=require("react");var Y=require("react/jsx-runtime");function _e(e){return`var(--gx-lane-${String(Math.abs(e)%8)})`}function ze({row:e,laneCount:t,height:n}){let r=Math.min(116,Math.max(16,t*12)),o=r/Math.max(1,t),a=c=>c*o+o/2,p=n/2,s=e.segments.map((c,i)=>{let h=a(c.from),m=a(c.to),f=c.kind==="pass"?`M ${String(h)} 0 L ${String(m)} ${String(n)}`:c.kind==="into"?`M ${String(h)} 0 C ${String(h)} ${String(n*.55)}, ${String(m)} ${String(n*.45)}, ${String(m)} ${String(p)}`:`M ${String(h)} ${String(p)} C ${String(h)} ${String(n*.55)}, ${String(m)} ${String(n*.45)}, ${String(m)} ${String(n)}`;return(0,Y.jsx)("path",{d:f,fill:"none",stroke:_e(c.color),strokeWidth:1.4,strokeLinecap:"round"},`${c.kind}-${String(c.from)}-${String(c.to)}-${String(i)}`)});return(0,Y.jsxs)("svg",{className:"gx-graph",width:r,height:n,viewBox:`0 0 ${String(r)} ${String(n)}`,"aria-hidden":"true",focusable:"false",children:[s,(0,Y.jsx)("circle",{cx:a(e.lane),cy:p,r:e.merge?4:3.2,fill:_e(e.color),stroke:"var(--gx-panel)",strokeWidth:1})]})}var b=require("react/jsx-runtime"),ie=24,Ae=100;function Gt({commit:e,row:t,laneCount:n,top:r,selected:o,head:a,onSelect:p}){return(0,b.jsxs)("button",{type:"button",className:"gx-row",style:{top:r},"data-selected":o?"true":"false","data-head":a?"true":"false","data-testid":"git-history-row",title:`${e.hash.slice(0,7)} ${e.subject}`,onClick:()=>p(e.hash),children:[t===void 0?(0,b.jsx)("span",{className:"gx-graph",style:{width:16}}):(0,b.jsx)(ze,{row:t,laneCount:n,height:ie}),(0,b.jsx)("span",{className:"gx-hash",children:e.hash.slice(0,7)}),(0,b.jsx)("span",{className:"gx-subject",children:e.subject}),e.refs.slice(0,2).map(s=>(0,b.jsxs)("span",{className:"gx-ref","data-kind":s.kind,children:[(0,b.jsx)("span",{className:"gx-ref-name",children:s.name}),(0,b.jsx)("span",{className:"gx-ref-tip",role:"tooltip",children:s.name})]},`${s.kind}:${s.name}`)),(0,b.jsx)("span",{className:"gx-author",children:e.author}),(0,b.jsx)("span",{className:"gx-time",title:new Date(e.time*1e3).toLocaleString(),children:ye(e.time)})]})}function Ve(e){let{commits:t,graph:n,selectedHash:r,headHash:o,total:a,hasMore:p,loadingMore:s,loadError:c,t:i,onSelect:h,onLoadMore:m}=e,f=(0,D.useRef)(null),[L,k]=(0,D.useState)(0),[C,W]=(0,D.useState)(0),E=(0,D.useRef)(!1);(0,D.useEffect)(()=>{let N=f.current;if(N===null)return;let R=()=>W(N.clientHeight);if(R(),typeof ResizeObserver>"u")return;let F=new ResizeObserver(R);return F.observe(N),()=>F.disconnect()},[]),(0,D.useEffect)(()=>{s||(E.current=!1)},[s]);let y=(0,D.useCallback)(()=>{!p||s||E.current||(E.current=!0,m())},[p,s,m]),G=N=>{let R=N.currentTarget;k(R.scrollTop),R.scrollTop+R.clientHeight>=R.scrollHeight-160&&y()},S=oe(t,{scrollTop:L,height:C===0?480:C,rowHeight:ie}),$=Math.max(1,De(n));return(0,b.jsxs)("section",{className:"gx-pane","data-testid":"git-history",children:[(0,b.jsxs)("header",{className:"gx-pane-head",children:[(0,b.jsx)("span",{children:i("history.title")}),(0,b.jsx)("span",{className:"gx-count",children:`${String(t.length)} / ${String(a)}`})]}),t.length===0?(0,b.jsxs)("div",{className:"gx-empty",children:[(0,b.jsx)("strong",{children:e.emptyTitle??i("history.empty")}),e.emptyDescription===void 0?null:(0,b.jsx)("span",{children:e.emptyDescription}),e.onRetry===void 0?null:(0,b.jsx)("button",{type:"button",className:"gx-btn",onClick:e.onRetry,children:e.retryLabel??i("action.retry")})]}):(0,b.jsx)("div",{className:"gx-scroll",ref:f,onScroll:G,"data-testid":"git-history-scroll",children:(0,b.jsx)("div",{className:"gx-vlist",style:{height:t.length*ie},children:S.rows.map((N,R)=>{let F=S.startIndex+R;return(0,b.jsx)(Gt,{commit:N,row:n[F],laneCount:$,top:F*ie,selected:N.hash===r,head:N.hash===o,onSelect:h},N.hash)})})}),(0,b.jsxs)("footer",{className:"gx-loadbar",children:[(0,b.jsx)("span",{children:`${i("history.loaded")} ${String(t.length)}`}),c===void 0?null:(0,b.jsx)("span",{className:"gx-del",children:c}),(0,b.jsx)("span",{className:"gx-spacer"}),p?(0,b.jsx)("button",{type:"button",className:"gx-linkbtn",disabled:s,onClick:y,children:i(s?"history.loading":"history.loadMore")}):(0,b.jsx)("span",{children:t.length===0?"":i("history.noMore")})]})]})}var be="git-explorer.leftColumnWidth";function ve(e){return Math.min(560,Math.max(240,e))}function qe(e){if(e==null)return null;let t;try{t=e.getItem(be)}catch{return null}if(t===null)return null;let n=Number(t);return!Number.isFinite(n)||n<240||n>560?null:n}function se(e,t){let n=Math.round(ve(t));if(e!=null)try{e.setItem(be,String(n))}catch{}return n}function je(e){if(e!=null)try{e.removeItem(be)}catch{}}function Ue(e,t){return Math.round(e)===Math.round(t)}var Oe=16;function Xe(e,t){if(t)return null;switch(e){case"ArrowLeft":return{kind:"nudge",delta:-Oe};case"ArrowRight":return{kind:"nudge",delta:Oe};case"Home":return{kind:"min"};case"End":return{kind:"max"};case"Backspace":case"Delete":return{kind:"reset"};default:return null}}var g=require("react/jsx-runtime");function Pt(e,t){return e===void 0?"idle":t?"loading":"no-service"}function Ke(e,t){let n=Ge(e);return n!==void 0&&t.select(n.hash),t.complete?.(),n!==void 0}var Dt={display:"flex",alignItems:"center",gap:8};function It(){if(typeof document>"u")return null;try{return document.defaultView?.localStorage??null}catch{return null}}var Ft=()=>typeof window>"u"||window.matchMedia("(max-width: 720px)").matches;function le({title:e,description:t,actionLabel:n,onAction:r}){return(0,g.jsxs)("div",{className:"gx-empty",role:"note","data-testid":"git-state",children:[(0,g.jsx)("strong",{children:e}),t===void 0?null:(0,g.jsx)("span",{children:t}),n===void 0||r===void 0?null:(0,g.jsx)("button",{type:"button",className:"gx-btn",onClick:r,children:n})]})}function Wt(e){return e.split(/[\\/]/u).filter(Boolean).at(-1)??e}function Ye(e){let{workbench:t,version:n,t:r,remote:o}=e;function a(p){let s=p.sessionId??t.currentSessionId(),c=(0,x.useRef)(s);c.current=s;let i=(0,x.useMemo)(()=>o(),[o]),[h,m]=(0,x.useState)(()=>({kind:Pt(s,i!==void 0)})),[f,L]=(0,x.useState)(0),[k,C]=(0,x.useState)([]),[W,E]=(0,x.useState)(!1),[y,G]=(0,x.useState)(!1),[S,$]=(0,x.useState)(void 0),[N,R]=(0,x.useState)(void 0),F=(0,x.useRef)(void 0),ke=(0,x.useRef)(void 0),[ot,Ce]=(0,x.useState)(!0),H=(0,x.useMemo)(()=>It(),[]),[_,A]=(0,x.useState)(()=>qe(H)),ce=(0,x.useRef)(null),V=(0,x.useRef)(null),J=(0,x.useCallback)(l=>{F.current=l,R(l),Ce(!1)},[]),at=(0,x.useCallback)(()=>{Ce(!1)},[]),it=(0,x.useCallback)(l=>{if(l.button!==0||V.current!==null||Ft())return;let d=ce.current?.previousElementSibling;if(d instanceof HTMLElement){try{l.currentTarget.setPointerCapture(l.pointerId)}catch{return}V.current={pointerId:l.pointerId,startX:l.clientX,baseWidth:d.getBoundingClientRect().width,restWidth:_},document.body.classList.add("gx-pane-resizing")}},[_]),st=(0,x.useCallback)(l=>{let d=V.current;d===null||d.pointerId!==l.pointerId||A(ve(d.baseWidth+l.clientX-d.startX))},[]),pe=(0,x.useCallback)(l=>{let d=V.current;if(d===null||d.pointerId!==l.pointerId)return;V.current=null,document.body.classList.remove("gx-pane-resizing");try{l.currentTarget.releasePointerCapture(l.pointerId)}catch{}let w=d.baseWidth+l.clientX-d.startX;if(Ue(w,d.baseWidth)){A(d.restWidth);return}A(se(H,w))},[H]),ue=(0,x.useCallback)(()=>{je(H),A(null)},[H]),lt=(0,x.useCallback)(l=>{if(l.nativeEvent.isComposing)return;let d=Xe(l.key,l.altKey||l.ctrlKey||l.metaKey||l.shiftKey);if(d===null)return;if(l.preventDefault(),l.stopPropagation(),d.kind==="reset"){ue();return}if(d.kind==="min"||d.kind==="max"){let P=d.kind==="min"?240:560;A(se(H,P));return}let w=ce.current?.previousElementSibling,T=w instanceof HTMLElement?w.getBoundingClientRect().width:_??240;A(se(H,T+d.delta))},[H,ue,_]);(0,x.useEffect)(()=>()=>{V.current!==null&&document.body.classList.remove("gx-pane-resizing")},[]),(0,x.useEffect)(()=>{if(s===void 0||p.openView===void 0)return;let l=t.views;if(l?.bind!==void 0)return l.bind(s,p.openView)},[s,p.openView,t]),(0,x.useEffect)(()=>{if(s===void 0){m({kind:"idle"});return}if(i===void 0){m({kind:"no-service"});return}let l=!0;return m({kind:"loading"}),$(void 0),Promise.resolve().then(()=>i.snapshot({sessionId:s})).then(d=>{if(!l)return;let w=B(d);if(!w.ok){m({kind:"failed",message:w.message});return}let T=w.result;if(!T.ok){m({kind:"failed",message:T.error.message===""?T.error.code:T.error.message});return}let P=T.snapshot;m({kind:"ready",snapshot:P}),C(P.commits),E(P.commits.length<P.counts.commits);let O=F.current;F.current=void 0,R(U=>O!==void 0?O:U!==void 0&&P.commits.some(Q=>Q.hash===U)?U:P.commits[0]?.hash)}).catch(d=>{l&&m({kind:"failed",message:K(d)})}),()=>{l=!1}},[s,i,f]),(0,x.useEffect)(()=>{let l=p.viewRequest;if(l==null||l.view!==X)return;let d=`${l.view}:${l.focus}`;ke.current!==d&&(ke.current=d,Ke(l.focus,{select:J,complete:()=>p.completeViewRequest?.()}))},[p.viewRequest,p.completeViewRequest,J]),(0,x.useEffect)(()=>{let l=t.viewFocus;if(l===void 0||s===void 0)return;let d=()=>{let w=l.take(X);w!==void 0&&Ke(w,{select:J})};return d(),l.subscribe(d)},[t,s,J]);let dt=(0,x.useMemo)(()=>Pe(k),[k]),M=h.kind==="ready"?h.snapshot:void 0,Se=(0,x.useMemo)(()=>M===void 0?[]:te(M.status),[M]),ct=(0,x.useMemo)(()=>{let l=new Map;for(let d of M?.stats??[])l.set(d.path,{additions:d.additions,deletions:d.deletions});return l},[M]),Re=(0,x.useMemo)(()=>{let l=new Map;for(let d of M?.branches??[]){let w=l.get(d.hash);w===void 0?l.set(d.hash,[{kind:d.kind,name:d.name,head:d.head}]):w.push({kind:d.kind,name:d.name,head:d.head})}return l},[M]),pt=(0,x.useCallback)(()=>{if(s===void 0||i===void 0||!W||y)return;let l=s;G(!0),$(void 0),Promise.resolve().then(()=>i.query({sessionId:s,skip:k.length,limit:Ae})).then(d=>{if(c.current!==l)return;let w=B(d);if(!w.ok){$(w.message);return}let T=w.result;if(!T.ok){$(T.error.message===""?T.error.code:T.error.message);return}let P=T.page;C(O=>{let U=new Set(O.map(q=>q.hash)),Q=P.commits.filter(q=>!U.has(q.hash)).map(q=>({...q,refs:Re.get(q.hash)??[]}));return Q.length===0?O:[...O,...Q]}),E(P.hasMore)}).catch(d=>$(K(d))).finally(()=>G(!1))},[s,i,W,y,k.length,Re]),ut=(0,x.useMemo)(()=>{let l=t.views??{open:(d,w)=>t.openView?.(d,w)??!1};return re({views:l,sessionId:s??""})},[t,s]),gt=(l,d=1)=>{s!==void 0&&ut(l,d)},mt=()=>L(l=>l+1),ge=()=>L(l=>l+1),I=M?.head,xt=Se.reduce((l,d)=>l+d.files.length,0);return(0,g.jsxs)("section",{className:"gx-root","data-workbench-view":"git-explorer","data-core-version":n,"data-conversation-composer-overlay":!0,"data-state":h.kind,"data-session":s??"","data-testid":"git-explorer-view",children:[(0,g.jsxs)("header",{className:"gx-head",children:[(0,g.jsxs)("div",{className:"gx-head-main",children:[(0,g.jsx)("span",{className:"gx-head-icon","aria-hidden":"true",children:(0,g.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[(0,g.jsx)("circle",{cx:"4.5",cy:"3.5",r:"1.7"}),(0,g.jsx)("circle",{cx:"4.5",cy:"12.5",r:"1.7"}),(0,g.jsx)("circle",{cx:"11.5",cy:"7",r:"1.7"}),(0,g.jsx)("path",{d:"M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1",strokeLinecap:"round"})]})}),(0,g.jsx)("span",{className:"gx-repo",title:M?.root??r("view.title"),children:M===void 0?r("view.title"):Wt(M.root)}),I?.branch===null||I?.branch===void 0?null:(0,g.jsx)("span",{className:"gx-branch",children:I.branch}),I?.detached===!0?(0,g.jsx)("span",{className:"gx-chip",children:r("head.detached")}):null,I?.ahead!==void 0&&I.ahead>0?(0,g.jsx)("span",{className:"gx-chip",children:`${r("head.ahead")} ${String(I.ahead)}`}):null,I?.behind!==void 0&&I.behind>0?(0,g.jsx)("span",{className:"gx-chip",children:`${r("head.behind")} ${String(I.behind)}`}):null]}),(0,g.jsxs)("div",{className:"gx-head-meta",style:Dt,children:[M===void 0?null:(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)("span",{children:[r("head.changes")," ",(0,g.jsx)("b",{children:xt})]}),(0,g.jsxs)("span",{children:[r("head.commits")," ",(0,g.jsx)("b",{children:M.counts.commits})]}),(0,g.jsxs)("span",{children:[r("head.branches")," ",(0,g.jsx)("b",{children:M.counts.branches})]})]}),(0,g.jsx)("button",{type:"button",className:"gx-btn",title:r("head.refresh"),"aria-label":r("head.refresh"),disabled:h.kind==="loading",onClick:mt,children:"\u21BB"})]})]}),s===void 0?(0,g.jsx)(le,{title:r("state.noSession.title"),description:r("state.noSession.description")}):h.kind==="no-service"?(0,g.jsx)(le,{title:r("state.noService.title"),description:r("state.noService.description")}):h.kind==="loading"?(0,g.jsx)("div",{className:"gx-skeleton","data-testid":"git-loading",children:r("state.loading")}):h.kind==="failed"?(0,g.jsx)(le,{title:r("state.failed.title"),description:h.message,actionLabel:r("action.retry"),onAction:ge}):h.kind==="ready"&&!h.snapshot.isRepository?(0,g.jsx)(le,{title:r("state.notRepository.title"),description:r("state.notRepository.description"),actionLabel:r("action.retry"),onAction:ge}):h.kind==="ready"?(0,g.jsxs)("div",{className:"gx-body",style:_===null?void 0:{"--gx-left-col":`${_}px`},children:[(0,g.jsx)(We,{groups:Se,stats:ct,t:r,onOpen:gt,claimFocus:ot,onFocusClaimed:at}),(0,g.jsx)("div",{ref:ce,className:"gx-pane-handle",role:"separator","aria-orientation":"vertical","aria-label":r("pane.resize"),"aria-valuemin":240,"aria-valuemax":560,"aria-valuenow":_??void 0,title:r("pane.resizeHint"),tabIndex:0,"data-testid":"gx-pane-handle",onPointerDown:it,onPointerMove:st,onPointerUp:pe,onPointerCancel:pe,onLostPointerCapture:pe,onKeyDown:lt,onDoubleClick:ue}),(0,g.jsxs)("div",{className:"gx-col",children:[(0,g.jsx)(Ve,{commits:k,graph:dt,selectedHash:N,headHash:h.snapshot.head?.hash??null,total:h.snapshot.counts.commits,hasMore:W,loadingMore:y,loadError:S,t:r,onSelect:R,onLoadMore:pt,...h.snapshot.counts.commits===0?{emptyTitle:r("state.emptyRepository.title"),emptyDescription:r("state.emptyRepository.description"),onRetry:ge,retryLabel:r("action.retry")}:{}}),(0,g.jsx)($e,{sessionId:s,hash:N,remote:i,t:r,onSelect:R})]})]}):null]})}return a}var Qe=["slots","locale","workbench","remote"];function Je(e){if(e===null||typeof e!="object")return!1;let t=e;return typeof t.snapshot=="function"&&typeof t.query=="function"&&typeof t.commit=="function"}function Ze(e){return()=>{try{let n=e.remote?.gitExplorer;if(Je(n))return n}catch{}try{let n=e.get?.("remote.gitExplorer");if(Je(n))return n}catch{}let t=et(e);return t===void 0?void 0:He(t)}}function et(e){let n=e.get?.("connection")?.rpc;if(!(n===void 0||typeof n.call!="function"))return(r,o,a)=>n.call("/api",`${Te}/${r}`,o,a)}var de;function tt(e){let t=e.workbench;if(t==null)return()=>{};let n=e.locale.bind(Z);de?.();let r=e.locale.register(Z,{zh:Me,en:Ne});de=r;let o=Fe(typeof document>"u"?void 0:document),a=Ye({workbench:t,version:t.version,t:n,remote:Ze(e)});return e.slots.inject(xe,()=>e.slots.register({name:xe,id:X,order:110,label:()=>n("tab.label"),locale:Z},a)),()=>{o(),r(),de===r&&(de=void 0)}}var nt={groupChanges:te,formatCommitDetail:ne,createJump:re,computeWindow:oe},rt={name:"dsh-git-explorer",inject:Qe,apply:tt,__test:nt},$t=rt;

    // Hand the loader's `require` to the module's `boot` export when the
    // package needs platform modules beyond the static externals.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
